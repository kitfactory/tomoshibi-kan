const fs = require("fs");
const os = require("os");
const path = require("path");
const { _electron: electron } = require("playwright");

const { SqliteSettingsStore } = require("../runtime/settings-store");
const { resolveWorkspacePaths } = require("../runtime/workspace-root");

function normalizeString(value) {
  return String(value || "").trim();
}

function getOptionValue(args, name, fallback = "") {
  const index = args.indexOf(name);
  if (index < 0 || index + 1 >= args.length) return fallback;
  return normalizeString(args[index + 1]) || fallback;
}

function getOptionValues(args, name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== name) continue;
    const value = normalizeString(args[index + 1]);
    if (value) values.push(value);
  }
  return values;
}

function resolveTurnTimeout(args) {
  const raw = Number.parseInt(getOptionValue(args, "--turn-timeout-ms", "180000"), 10);
  if (Number.isFinite(raw) && raw > 0) return raw;
  return 180000;
}

function createWorkspaceRoot(args) {
  const explicit = normalizeString(getOptionValue(args, "--workspace"));
  if (explicit) {
    fs.mkdirSync(explicit, { recursive: true });
    return path.resolve(explicit);
  }
  return fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibi-kan-orchestrator-check-"));
}

function createSafeStorageMock() {
  return {
    isEncryptionAvailable() {
      return false;
    },
  };
}

async function readDebugRuns(workspaceRoot) {
  const paths = resolveWorkspacePaths(workspaceRoot);
  const store = new SqliteSettingsStore({
    dbPath: paths.dbPath,
    secretsPath: paths.secretsPath,
    safeStorage: createSafeStorageMock(),
  });
  try {
    return await store.listOrchestrationDebugRuns({ limit: 100 });
  } finally {
    await store.close();
  }
}

async function waitForDebugRun(workspaceRoot, predicate, timeoutMs = 120000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const rows = await readDebugRuns(workspaceRoot);
    const match = rows.find(predicate);
    if (match) return match;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return null;
}

async function addLmStudioModel(page) {
  await page.click('[data-tab="settings"]');
  const removeButtons = page.locator("[data-remove-model-index]");
  while (await removeButtons.count() > 0) {
    await removeButtons.first().click();
  }
  await page.click("#settingsTabOpenAddItem");
  await page.selectOption("#settingsTabModelProvider", "lmstudio");
  await page.selectOption("#settingsTabModelName", "openai/gpt-oss-20b");
  await page.fill(
    "#settingsTabModelBaseUrl",
    normalizeString(process.env.LMSTUDIO_BASE_URL) || "http://192.168.11.16:1234/v1"
  );
  await page.click("#settingsTabAddItemSubmit");
  await page.click("#settingsTabSave");
  await page.waitForFunction(() => {
    const button = document.getElementById("settingsTabSave");
    return !button || button.getAttribute("aria-busy") !== "true";
  }, { timeout: 30000 });
}

async function closePalConfigModalIfVisible(page) {
  const closeButton = page.locator("#closePalConfigModal");
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
  await page.waitForFunction(() => {
    const modal = document.getElementById("palConfigModal");
    return !modal || modal.hidden === true || modal.classList.contains("hidden");
  }, { timeout: 30000 }).catch(() => {});
}

async function configureProfileModel(page, profileId) {
  await page.click('[data-tab="pal"]');
  await page.click(`[data-pal-open-id="${profileId}"]`);
  await page.selectOption(`[data-pal-runtime-select="${profileId}"]`, "model");
  await page.selectOption(`[data-pal-runtime-target-select="${profileId}"]`, "openai/gpt-oss-20b");
  await page.click("#palConfigSave");
  await closePalConfigModalIfVisible(page);
}

async function configureGuideWorkerAndGate(page) {
  for (const profileId of ["guide-core", "gate-core", "pal-alpha", "pal-beta", "pal-delta"]) {
    await configureProfileModel(page, profileId);
  }
}

async function collectGuideTurnDiagnostics(page) {
  return page.evaluate(() => {
    const chatRows = Array.from(document.querySelectorAll("#guideChat .chat"));
    return {
      chatCount: chatRows.length,
      latestMessages: chatRows.slice(-4).map((row) => String(row.textContent || "").trim()),
      sendBusy: document.getElementById("guideSend")?.getAttribute("aria-busy") || "",
      inputBusy: document.getElementById("guideInput")?.getAttribute("aria-busy") || "",
      errorToastCode: document.getElementById("errorToastCode")?.textContent || "",
    };
  });
}

async function runGuideTurn(page, userText, turnTimeoutMs) {
  await page.click('[data-tab="guide"]');
  const beforeTaskCount = await page.locator("[data-task-row]").count().catch(() => 0);
  const beforeChatCount = await page.locator("#guideChat .chat").count().catch(() => 0);
  await page.fill("#guideInput", userText);
  await page.click("#guideSend");
  await page.waitForFunction(() => {
    const send = document.getElementById("guideSend");
    return !send || send.getAttribute("aria-busy") === "true";
  }, { timeout: 10000 }).catch(() => {});
  try {
    await page.waitForFunction(() => {
      const send = document.getElementById("guideSend");
      return !send || send.getAttribute("aria-busy") !== "true";
    }, { timeout: turnTimeoutMs });
    await page.waitForFunction(
      (expected) => document.querySelectorAll("#guideChat .chat").length >= expected,
      beforeChatCount + 2,
      { timeout: 5000 }
    );
  } catch (error) {
    const diagnostics = await collectGuideTurnDiagnostics(page);
    throw new Error(`guide_turn_timeout: ${JSON.stringify(diagnostics)}`);
  }
  const lastGuideMessage = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("#guideChat .chat"));
    const last = rows[rows.length - 1];
    return last ? String(last.textContent || "").trim() : "";
  });
  await page.click('[data-tab="task"]');
  const afterTaskCount = await page.locator("[data-task-row]").count().catch(() => 0);
  const latestTasks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-task-row]"))
      .slice(-3)
      .map((row) => ({
        id: row.getAttribute("data-task-row") || "",
        text: String(row.textContent || "").trim(),
      }));
  });
  return {
    lastGuideMessage,
    beforeTaskCount,
    afterTaskCount,
    latestTasks,
  };
}

function resolvePrompts(args) {
  const prompts = getOptionValues(args, "--prompt");
  if (prompts.length > 0) return prompts;
  return [
    "最近このアプリの使い心地どう思う？",
    "設定画面の保存まわりで違和感がある。まず何を確認すべき？",
    "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。調べる人 / 作り手 / 書く人 に分けて進めたい。",
  ];
}

function pickTargetTask(latestTasks) {
  const traceTask = latestTasks.find((task) => /\bTrace\b/i.test(task.text));
  return traceTask || latestTasks[0] || null;
}

async function runTaskToGate(page, taskId) {
  await page.click('[data-tab="task"]');
  await page.click(`[data-action="start"][data-task-id="${taskId}"]`);
}

async function submitTaskToGate(page, taskId) {
  await page.click(`[data-action="submit"][data-task-id="${taskId}"]`);
  await page.click(`[data-action="gate"][data-task-id="${taskId}"]`);
  await page.locator("#gatePanel").waitFor({ state: "visible", timeout: 30000 });
}

async function runCheck(args) {
  const workspaceRoot = createWorkspaceRoot(args);
  const prompts = resolvePrompts(args);
  const turnTimeoutMs = resolveTurnTimeout(args);
  const appRoot = path.resolve(__dirname, "..");
  console.log(`workspace_root=${workspaceRoot}`);

  const electronApp = await electron.launch({
    args: [appRoot],
    env: {
      ...process.env,
      TOMOSHIBIKAN_WS_ROOT: workspaceRoot,
      PALPAL_WS_ROOT: workspaceRoot,
    },
  });

  let turns = [];
  let targetTask = null;
  try {
    const page = await electronApp.firstWindow();
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.waitForSelector('[data-tab="guide"]', { timeout: 30000 });
    await addLmStudioModel(page);
    await configureGuideWorkerAndGate(page);

    for (const prompt of prompts) {
      const turn = await runGuideTurn(page, prompt, turnTimeoutMs);
      turns.push({ prompt, ...turn });
    }

    targetTask = pickTargetTask(turns[turns.length - 1]?.latestTasks || []);
    if (!targetTask?.id) {
      throw new Error("target trace task not found");
    }

    await runTaskToGate(page, targetTask.id);
    const workerRun = await waitForDebugRun(
      workspaceRoot,
      (row) => normalizeString(row.stage) === "worker_runtime" && normalizeString(row.targetId) === targetTask.id,
      180000
    );
    if (!workerRun) {
      throw new Error(`missing worker_runtime for ${targetTask.id}`);
    }

    await submitTaskToGate(page, targetTask.id);
    const gateRun = await waitForDebugRun(
      workspaceRoot,
      (row) => normalizeString(row.stage) === "gate_review" && normalizeString(row.targetId) === targetTask.id,
      180000
    );
    if (!gateRun) {
      throw new Error(`missing gate_review for ${targetTask.id}`);
    }

    console.log(`target_task=${targetTask.id}`);
    console.log(`worker_run=${normalizeString(workerRun.runId)}`);
    console.log(`gate_run=${normalizeString(gateRun.runId)}`);
  } finally {
    await electronApp.close();
  }

  const rows = await readDebugRuns(workspaceRoot);
  const guideRuns = rows.filter((row) => normalizeString(row.stage) === "guide_chat");
  const workerRuns = rows.filter((row) => normalizeString(row.stage) === "worker_runtime");
  const gateRuns = rows.filter((row) => normalizeString(row.stage) === "gate_review");

  console.log(`guide_run_count=${guideRuns.length}`);
  console.log(`worker_run_count=${workerRuns.length}`);
  console.log(`gate_run_count=${gateRuns.length}`);

  turns.forEach((turn, index) => {
    console.log(`turn=${index + 1}`);
    console.log(`prompt=${normalizeString(turn.prompt)}`);
    console.log(`guide_reply=${normalizeString(turn.lastGuideMessage)}`);
    console.log(`task_count_before=${turn.beforeTaskCount}`);
    console.log(`task_count_after=${turn.afterTaskCount}`);
    turn.latestTasks.forEach((task) => {
      console.log(`task=${task.id} | ${normalizeString(task.text)}`);
    });
  });
}

runCheck(process.argv.slice(2)).catch((error) => {
  console.error(normalizeString(error?.message || error));
  process.exit(1);
});
