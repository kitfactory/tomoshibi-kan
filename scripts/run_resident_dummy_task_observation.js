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

function createWorkspaceRoot(args) {
  const explicit = normalizeString(getOptionValue(args, "--workspace"));
  if (explicit) {
    fs.mkdirSync(explicit, { recursive: true });
    return path.resolve(explicit);
  }
  return fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibi-kan-resident-observe-"));
}

function createSafeStorageMock() {
  return {
    isEncryptionAvailable() {
      return false;
    },
  };
}

async function withSettingsStore(workspaceRoot, fn) {
  const paths = resolveWorkspacePaths(workspaceRoot);
  const store = new SqliteSettingsStore({
    dbPath: paths.dbPath,
    secretsPath: paths.secretsPath,
    safeStorage: createSafeStorageMock(),
  });
  try {
    return await fn(store);
  } finally {
    await store.close();
  }
}

async function readDebugRuns(workspaceRoot) {
  return withSettingsStore(workspaceRoot, (store) => store.listOrchestrationDebugRuns({ limit: 200 }));
}

async function waitForDebugRun(workspaceRoot, predicate, timeoutMs = 180000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const rows = await readDebugRuns(workspaceRoot);
    const match = rows.find(predicate);
    if (match) return match;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return null;
}

async function waitForTaskStatus(page, taskId, expectedStatus, timeoutMs = 180000) {
  await page.waitForFunction(
    ([id, status]) => {
      const row = document.querySelector(`[data-task-row="${id}"]`);
      return Boolean(row) && row.getAttribute("data-board-status") === status;
    },
    [taskId, expectedStatus],
    { timeout: timeoutMs }
  );
}

async function waitForAppReady(page) {
  await page.waitForFunction(() => {
    const guideTab = document.querySelector('button[data-tab="guide"]');
    const guidePanel = document.querySelector('[data-tab-panel="guide"]');
    return Boolean(guideTab && guidePanel) && guidePanel.hidden === false;
  }, { timeout: 30000 });
}

async function openWorkspaceTab(page, tab) {
  const button = page.locator(`button[data-tab="${tab}"]`).first();
  await button.waitFor({ state: "visible", timeout: 30000 });
  await button.click();
  await page.waitForFunction((expectedTab) => {
    const panel = document.querySelector(`[data-tab-panel="${expectedTab}"]`);
    return Boolean(panel) && panel.hidden === false;
  }, tab, { timeout: 30000 });
}

async function resetPrototypeLocalState(page) {
  await page.evaluate(() => {
    const keys = [
      "tomoshibi-kan.projects.v1",
      "tomoshibi-kan.board-state.v1",
      "tomoshibi-kan.agent-profiles.v1",
      "tomoshibi-kan.settings.v1",
      "palpal-hive.projects.v1",
      "palpal-hive.board-state.v1",
      "palpal-hive.agent-profiles.v1",
      "palpal-hive.settings.v1",
    ];
    keys.forEach((key) => window.localStorage.removeItem(key));
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
}

async function addLmStudioModel(page) {
  await openWorkspaceTab(page, "settings");
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
  await openWorkspaceTab(page, "pal");
  await page.click(`[data-pal-open-id="${profileId}"]`);
  await page.selectOption(`[data-pal-runtime-select="${profileId}"]`, "model");
  await page.selectOption(`[data-pal-runtime-target-select="${profileId}"]`, "openai/gpt-oss-20b");
  await page.click("#palConfigSave");
  await closePalConfigModalIfVisible(page);
}

async function configureBuiltins(page) {
  for (const profileId of ["guide-core", "gate-core", "pal-alpha", "pal-beta", "pal-delta"]) {
    await configureProfileModel(page, profileId);
  }
}

async function addFocusedProject(page, workspaceRoot) {
  const projectDir = path.join(workspaceRoot, "resident-observation-project");
  fs.mkdirSync(projectDir, { recursive: true });
  await openWorkspaceTab(page, "project");
  const result = await page.evaluate(async (directory) => {
    if (typeof addProjectByDirectory !== "function") {
      throw new Error("addProjectByDirectory_unavailable");
    }
    return addProjectByDirectory(directory);
  }, projectDir);
  if (!result?.ok) {
    throw new Error(`project_setup_failed:${JSON.stringify(result)}`);
  }
  return {
    id: normalizeString(result.project?.id),
    name: normalizeString(result.project?.name),
    directory: normalizeString(result.project?.directory),
  };
}

async function materializeScenarioTask(page, project, scenario, index) {
  return page.evaluate(async ({ projectInput, scenarioInput, scenarioIndex }) => {
    const workers = await resolveWorkerAssignmentProfiles();
    const beforeTaskCount = Array.isArray(tasks) ? tasks.length : 0;
    const artifact = await appendPlanArtifactWithFallback({
      status: "approved",
      replyText: `resident dummy scenario ${scenarioInput.name}`,
      plan: {
        project: projectInput,
        goal: scenarioInput.goal,
        completionDefinition: scenarioInput.expectedOutput,
        constraints: ["dummy observation task"],
        tasks: [
          {
            title: scenarioInput.title,
            description: scenarioInput.description,
            expectedOutput: scenarioInput.expectedOutput,
            requiredSkills: [],
            reviewFocus: scenarioInput.reviewFocus || [],
            assigneePalId: "",
          },
        ],
      },
      sourceRunId: `resident-dummy-observation-${scenarioIndex}`,
    });
    const created = await materializeApprovedPlanArtifact(artifact);
    const createdTask = Array.isArray(tasks) && tasks.length > beforeTaskCount
      ? tasks[tasks.length - 1]
      : null;
    const latestDispatchLog = createdTask?.id
      ? (await listTaskProgressLogEntriesWithFallback({
        limit: 1,
        targetKind: "task",
        targetId: String(createdTask.id),
        actionType: "dispatch",
      }))[0] || null
      : null;
    return {
      workerCount: Array.isArray(workers) ? workers.length : 0,
      workerIds: Array.isArray(workers) ? workers.map((worker) => String(worker?.id || "").trim()) : [],
      planId: artifact.planId,
      createdCount: Number(created?.created || 0),
      taskId: String(createdTask?.id || "").trim(),
      taskTitle: String(createdTask?.title || "").trim(),
      workerId: String(createdTask?.palId || "").trim(),
      explanation: latestDispatchLog?.payload?.routingExplanation || null,
    };
  }, {
    projectInput: project,
    scenarioInput: scenario,
    scenarioIndex: index,
  });
}

async function runTaskLifecycle(page, workspaceRoot, taskId) {
  await openWorkspaceTab(page, "task");
  await page.evaluate(async (id) => {
    await runTaskAction("start", id);
  }, taskId);

  const workerRun = await waitForDebugRun(
    workspaceRoot,
    (row) => normalizeString(row.stage) === "worker_runtime" && normalizeString(row.targetId) === taskId,
    180000
  );
  if (!workerRun) {
    throw new Error(`missing_worker_runtime:${taskId}`);
  }

  await page.evaluate(async (id) => {
    await runTaskAction("submit", id);
    await runTaskAction("gate", id);
  }, taskId);
  await page.locator("#gatePanel").waitFor({ state: "visible", timeout: 30000 });
  await page.evaluate(() => {
    runGate("approve");
  });

  const gateRun = await waitForDebugRun(
    workspaceRoot,
    (row) => normalizeString(row.stage) === "gate_review" && normalizeString(row.targetId) === taskId,
    180000
  );
  if (!gateRun) {
    throw new Error(`missing_gate_review:${taskId}`);
  }

  await waitForTaskStatus(page, taskId, "done", 180000);

  const rowState = await page.evaluate((id) => {
    const row = document.querySelector(`[data-task-row="${id}"]`);
    return {
      status: String(row?.getAttribute("data-board-status") || "").trim(),
      text: String(row?.textContent || "").trim(),
    };
  }, taskId);

  return {
    workerRunId: normalizeString(workerRun.runId),
    gateRunId: normalizeString(gateRun.runId),
    finalStatus: rowState.status,
    rowText: rowState.text,
  };
}

function scenarios() {
  return [
    {
      resident: "冬坂",
      name: "research-repro",
      title: "保存まわりの違和感の再現手順を整理する",
      description: "設定画面で model を追加して Save を押し reload した時の挙動を観測し、再現手順と証拠を短くまとめる。",
      expectedOutput: "再現手順と観測結果メモ",
      reviewFocus: ["evidence", "repro"],
    },
    {
      resident: "冬坂",
      name: "research-compare",
      title: "複数の手がかりを照合して原因候補をまとめる",
      description: "保存直後の状態と reload 後の状態を見比べ、原因候補を 2-3 件に絞った調査メモを作る。",
      expectedOutput: "原因候補メモ",
      reviewFocus: ["evidence", "comparison"],
    },
    {
      resident: "久瀬",
      name: "program-fix",
      title: "保存後も設定が残るように最小修正を入れる",
      description: "保存フローに最小限の修正を入れ、reload 後も model が残るようにする。",
      expectedOutput: "最小修正の要約",
      reviewFocus: ["patch", "scope"],
    },
    {
      resident: "久瀬",
      name: "program-guard",
      title: "保存ボタンの扱いを見直して不整合を防ぐ",
      description: "保存できない状態で Save が押せる違和感を減らすため、ボタン制御の最小修正方針を作る。",
      expectedOutput: "修正方針と変更点メモ",
      reviewFocus: ["patch", "ux"],
    },
    {
      resident: "白峰",
      name: "writer-return",
      title: "利用者向けの返却文を整える",
      description: "調査結果と修正内容を、利用者が読みやすい返却文にまとめる。",
      expectedOutput: "返却文ドラフト",
      reviewFocus: ["wording", "clarity"],
    },
    {
      resident: "白峰",
      name: "writer-note",
      title: "変更内容の案内文を書く",
      description: "保存まわりの改善内容と、利用者が気にするとよい点を短い案内文にまとめる。",
      expectedOutput: "案内文ドラフト",
      reviewFocus: ["wording", "audience"],
    },
  ];
}

async function runObservation(args) {
  const workspaceRoot = createWorkspaceRoot(args);
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

  try {
    const page = await electronApp.firstWindow();
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.waitForSelector('[data-tab="guide"]', { timeout: 30000 });
    await resetPrototypeLocalState(page);
    await addLmStudioModel(page);
    await configureBuiltins(page);
    const project = await addFocusedProject(page, workspaceRoot);
    const results = [];

    for (const [index, scenario] of scenarios().entries()) {
      const materialized = await materializeScenarioTask(page, project, scenario, index);
      if (!materialized.taskId) {
        throw new Error(`materialize_failed:${scenario.name}:${JSON.stringify(materialized)}`);
      }
      const lifecycle = await runTaskLifecycle(page, workspaceRoot, materialized.taskId);
      results.push({
        resident: scenario.resident,
        scenario: scenario.name,
        title: scenario.title,
        routedWorkerId: materialized.workerId,
        matchedRoleTerms: Array.isArray(materialized.explanation?.matchedRoleTerms) ? materialized.explanation.matchedRoleTerms : [],
        decisionSource: normalizeString(materialized.explanation?.decisionSource),
        workerRunId: lifecycle.workerRunId,
        gateRunId: lifecycle.gateRunId,
        finalStatus: lifecycle.finalStatus,
      });
    }

    console.log(JSON.stringify({ project, results }, null, 2));
  } finally {
    await electronApp.close();
  }
}

runObservation(process.argv.slice(2)).catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
