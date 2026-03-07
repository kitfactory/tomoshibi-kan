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
  return normalizeString(args[index + 1]);
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
  const raw = Number.parseInt(getOptionValue(args, "--turn-timeout-ms", "120000"), 10);
  if (Number.isFinite(raw) && raw > 0) return raw;
  return 120000;
}

function createWorkspaceRoot(args) {
  const explicit = normalizeString(getOptionValue(args, "--workspace"));
  if (explicit) {
    fs.mkdirSync(explicit, { recursive: true });
    return path.resolve(explicit);
  }
  return fs.mkdtempSync(path.join(os.tmpdir(), "palpal-guide-check-"));
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
    return await store.listOrchestrationDebugRuns({ limit: 20 });
  } finally {
    await store.close();
  }
}

async function resetPrototypeLocalState(page) {
  await page.evaluate(() => {
    const keys = [
      "palpal-hive.projects.v1",
      "palpal-hive.board-state.v1",
      "palpal-hive.agent-profiles.v1",
      "palpal-hive.settings.v1",
    ];
    keys.forEach((key) => window.localStorage.removeItem(key));
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-tab="guide"]', { timeout: 30000 });
}

async function addGuideModel(page) {
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

async function readGuideControllerAssistState(page) {
  await page.click('[data-tab="settings"]');
  const checked = await page.locator("#settingsGuideControllerAssistEnabled").isChecked().catch(() => false);
  await page.click('[data-tab="guide"]');
  return checked;
}

async function bindGuideProfileToModel(page) {
  await page.click('[data-tab="pal"]');
  await page.click('[data-pal-open-id="guide-core"]');
  await page.selectOption('[data-pal-runtime-select="guide-core"]', "model");
  await page.selectOption('[data-pal-runtime-target-select="guide-core"]', "openai/gpt-oss-20b");
  await page.click("#palConfigSave");
  const closeButton = page.locator("#closePalConfigModal");
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
  await page.waitForFunction(() => {
    const modal = document.getElementById("palConfigModal");
    return !modal || modal.hidden === true || modal.classList.contains("hidden");
  }, { timeout: 30000 }).catch(() => {});
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
  const beforeTaskCount = await page.locator('[data-task-row]').count().catch(() => 0);
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
    const diagnosticError = new Error(`guide_turn_timeout: ${JSON.stringify(diagnostics)}`);
    diagnosticError.cause = error;
    throw diagnosticError;
  }
  const guideState = await page.evaluate(() => (
    typeof window.resolveGuideModelStateWithFallback === "function"
      ? window.resolveGuideModelStateWithFallback()
      : null
  ));
  const lastGuideMessage = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("#guideChat .chat"));
    const last = rows[rows.length - 1];
    return last ? String(last.textContent || "").trim() : "";
  });
  await page.click('[data-tab="task"]');
  const afterTaskCount = await page.locator('[data-task-row]').count().catch(() => 0);
  const latestTasks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-task-row]"))
      .slice(-3)
      .map((row) => ({
        id: row.getAttribute("data-task-row") || "",
        text: String(row.textContent || "").trim(),
      }));
  });
  return {
    guideState,
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
    "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。trace / fix / verify の Task に分けて進めたい。",
  ];
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
      PALPAL_WS_ROOT: workspaceRoot,
    },
  });

  let scenario = { turns: [] };
  let diagnostics = null;
  let assistEnabled = null;
  try {
    const page = await electronApp.firstWindow();
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.waitForSelector('[data-tab="guide"]', { timeout: 30000 });
    await resetPrototypeLocalState(page);
    assistEnabled = await readGuideControllerAssistState(page);
    await addGuideModel(page);
    await bindGuideProfileToModel(page);
    for (const prompt of prompts) {
      const turn = await runGuideTurn(page, prompt, turnTimeoutMs);
      scenario.turns.push({
        prompt,
        ...turn,
      });
    }
    diagnostics = await page.evaluate(({ timeoutMs }) => ({
      guideChatText: document.getElementById("guideChat")?.textContent || "",
      errorToastCode: document.getElementById("errorToastCode")?.textContent || "",
      guideInputState: typeof window.resolveGuideModelStateWithFallback === "function"
        ? window.resolveGuideModelStateWithFallback()
        : null,
      turnTimeoutMs: timeoutMs,
    }), { timeoutMs: turnTimeoutMs });
  } finally {
    await electronApp.close();
  }

  const rows = await readDebugRuns(workspaceRoot);
  const guideRuns = rows.filter((row) => normalizeString(row.stage) === "guide_chat");
  if (guideRuns.length === 0) {
    if (diagnostics) {
      console.log(JSON.stringify(diagnostics, null, 2));
    }
    throw new Error("missing debug stage: guide_chat");
  }

  console.log(`guide_run_count=${guideRuns.length}`);
  console.log(`assist_enabled=${String(Boolean(assistEnabled))}`);

  scenario.turns.forEach((turn, index) => {
    console.log(`turn=${index + 1}`);
    console.log(`prompt=${normalizeString(turn.prompt)}`);
    console.log(`guide_reply=${normalizeString(turn.lastGuideMessage)}`);
    console.log(`task_count_before=${turn.beforeTaskCount}`);
    console.log(`task_count_after=${turn.afterTaskCount}`);
    turn.latestTasks.forEach((task) => {
      console.log(`task=${task.id} | ${normalizeString(task.text)}`);
    });
  });
  guideRuns.forEach((row, index) => {
    console.log(`guide_run_${index + 1}=${normalizeString(row.runId)}`);
  });
}

runCheck(process.argv.slice(2)).catch((error) => {
  console.error(normalizeString(error?.message || error));
  process.exit(1);
});
