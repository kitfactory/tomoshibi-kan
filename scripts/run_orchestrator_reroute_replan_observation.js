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
  return fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibi-kan-reroute-replan-observe-"));
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
  return withSettingsStore(workspaceRoot, (store) => store.listOrchestrationDebugRuns({ limit: 100 }));
}

async function readProgressLogs(workspaceRoot, options = {}) {
  return withSettingsStore(workspaceRoot, (store) => store.listTaskProgressLogEntries({ limit: 50, ...options }));
}

async function readPlanArtifacts(workspaceRoot) {
  return withSettingsStore(workspaceRoot, (store) => store.listPlanArtifacts({ limit: 20 }));
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

async function waitForProgressEntry(workspaceRoot, predicate, timeoutMs = 180000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const rows = await readProgressLogs(workspaceRoot);
    const match = rows.find(predicate);
    if (match) return match;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return null;
}

async function waitForAppReady(page) {
  await page.waitForFunction(() => {
    const guideTab = document.querySelector('button[data-tab="guide"]');
    const guidePanel = document.querySelector('[data-tab-panel="guide"]');
    const guideInput = document.getElementById("guideInput");
    return Boolean(guideTab && guidePanel && guideInput)
      && guideTab.getAttribute("aria-selected") === "true"
      && guidePanel.hidden === false;
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
      "palpal-hive.projects.v1",
      "palpal-hive.board-state.v1",
      "palpal-hive.agent-profiles.v1",
      "palpal-hive.settings.v1",
      "tomoshibi-kan.projects.v1",
      "tomoshibi-kan.board-state.v1",
      "tomoshibi-kan.agent-profiles.v1",
      "tomoshibi-kan.settings.v1",
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

async function configureGuideWorkerAndGate(page) {
  for (const profileId of ["guide-core", "gate-core", "pal-alpha", "pal-beta", "pal-delta"]) {
    await configureProfileModel(page, profileId);
  }
}

async function enableGuideControllerAssist(page) {
  await openWorkspaceTab(page, "settings");
  const checkbox = page.locator("#settingsGuideControllerAssistEnabled");
  await checkbox.waitFor({ state: "visible", timeout: 30000 });
  if (!(await checkbox.isChecked())) {
    await checkbox.check();
    await page.click("#settingsTabSave");
    await page.waitForFunction(() => {
      const button = document.getElementById("settingsTabSave");
      return !button || button.getAttribute("aria-busy") !== "true";
    }, { timeout: 30000 });
  }
}

async function observeGuideDrivenRerouteDecision(page) {
  return page.evaluate(async () => {
    const n = (value) => String(value || "").trim();
    const workers = await resolveWorkerAssignmentProfiles();
    const routingApi = resolveAgentRoutingApi();
    const scenarios = [
      {
        name: "research",
        title: "保存不具合の手がかりを調べる",
        description: "設定保存後に reload すると model が消える。事実、再現手順、証拠を集める。",
        expectedOutput: "再現手順と証拠メモ",
      },
      {
        name: "make",
        title: "保存不具合を直す",
        description: "調査済みの不具合に対して、保存処理の最小修正を入れる。",
        expectedOutput: "最小 patch",
      },
      {
        name: "write",
        title: "ユーザーへの返却文を書く",
        description: "調査結果と変更内容を、ユーザーが読みやすい返却文に整える。",
        expectedOutput: "短い返却文",
      },
      {
        name: "mixed",
        title: "状況を整理して返却文も整える",
        description: "保存不具合の現状を確認しつつ、ユーザーに返す短い説明文も用意する。",
        expectedOutput: "状況メモと返却文",
      },
    ];
    const results = [];
    for (const scenario of scenarios) {
      const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
      const taskDraft = {
        title: scenario.title,
        description: scenario.description,
      };
      const baseline = routingApi.selectWorkerForTask({
        taskDraft,
        workers,
        assignmentCounts,
        requiredSkills: [],
      });
      const guided = await requestGuideDrivenWorkerRoutingDecision({
        artifact: {
          planId: `PLAN-ROUTE-${scenario.name.toUpperCase()}`,
          plan: {
            goal: scenario.title,
            completionDefinition: scenario.expectedOutput,
            constraints: [],
          },
        },
        index: 0,
        taskPlan: {
          title: scenario.title,
          description: scenario.description,
          expectedOutput: scenario.expectedOutput,
          requiredSkills: [],
        },
        taskDraft,
        workers,
        assignmentCounts,
      });
      results.push({
        scenario: scenario.name,
        baselineWorkerId: n(baseline?.workerId),
        baselineRoleTerms: Array.isArray(baseline?.matchedRoleTerms) ? baseline.matchedRoleTerms : [],
        guidedWorkerId: n(guided?.workerId),
        guidedFallbackAction: n(guided?.fallbackAction),
        guidedConfidence: n(guided?.decisionConfidence),
        guidedReason: n(guided?.decisionReason),
      });
    }
    return results;
  });
}

async function createObservationTask(page) {
  return page.evaluate(async () => {
    const n = (value) => String(value || "").trim();
    const artifact = await appendPlanArtifactWithFallback({
      status: "approved",
      replyText: "manual observation plan",
      plan: {
        goal: "保存不具合の進め方を見直す",
        completionDefinition: "進め方を見直した task に引き継げる状態",
        constraints: ["scope: settings save and reload"],
        tasks: [
          {
            title: "保存不具合の現状を調べる",
            description: "保存して reload すると model が消える不具合について、事実と手がかりを整理する。",
            assigneePalId: "pal-alpha",
            requiredSkills: [],
          },
        ],
      },
      sourceRunId: "manual-reroute-replan-observation",
    });
    const materialized = await materializeApprovedPlanArtifact(artifact);
    const latestTask = tasks[tasks.length - 1];
    return {
      planId: artifact.planId,
      created: Number(materialized?.created || 0),
      taskId: n(latestTask?.id),
      taskTitle: n(latestTask?.title),
    };
  });
}

async function runTaskStart(page, taskId) {
  await openWorkspaceTab(page, "task");
  await page.evaluate(async (id) => {
    if (typeof runTaskAction !== "function") throw new Error("runTaskAction_missing");
    await runTaskAction("start", id);
  }, taskId);
}

async function submitTaskToGate(page, taskId) {
  await openWorkspaceTab(page, "task");
  await page.evaluate(async (id) => {
    if (typeof runTaskAction !== "function") throw new Error("runTaskAction_missing");
    await runTaskAction("submit", id);
    await runTaskAction("gate", id);
  }, taskId);
  await page.locator("#gatePanel").waitFor({ state: "visible", timeout: 30000 });
}

async function rejectTaskWithReplanReason(page) {
  await page.fill("#gateReason", "このまま直すより、前提と進め方を見直した方がよさそうかな。再計画が必要です。");
  await page.evaluate(() => {
    if (typeof runGate !== "function") throw new Error("runGate_missing");
    runGate("reject");
  });
}

async function waitForTaskCount(page, expectedMinimum, timeoutMs = 180000) {
  await page.waitForFunction((minimum) => {
    return document.querySelectorAll("[data-task-row]").length >= minimum;
  }, expectedMinimum, { timeout: timeoutMs });
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
    await waitForAppReady(page);
    await resetPrototypeLocalState(page);
    await addLmStudioModel(page);
    await configureGuideWorkerAndGate(page);
    await enableGuideControllerAssist(page);

    const rerouteDecisions = await observeGuideDrivenRerouteDecision(page);
    rerouteDecisions.forEach((item) => {
      console.log(
        `reroute_candidate=${item.scenario}|baseline=${item.baselineWorkerId}|guided=${item.guidedWorkerId}|fallback=${item.guidedFallbackAction}|confidence=${item.guidedConfidence}|reason=${item.guidedReason}`
      );
    });

    const beforeTaskCount = await page.locator("[data-task-row]").count();
    const created = await createObservationTask(page);
    console.log(`observation_plan=${created.planId}|created=${created.created}|task=${created.taskId}|title=${created.taskTitle}`);

    await runTaskStart(page, created.taskId);
    const workerRun = await waitForDebugRun(
      workspaceRoot,
      (row) => normalizeString(row.stage) === "worker_runtime" && normalizeString(row.targetId) === created.taskId,
      180000
    );
    if (!workerRun) throw new Error(`missing worker_runtime for ${created.taskId}`);

    await submitTaskToGate(page, created.taskId);
    const gateRun = await waitForDebugRun(
      workspaceRoot,
      (row) => normalizeString(row.stage) === "gate_review" && normalizeString(row.targetId) === created.taskId,
      45000
    );

    await rejectTaskWithReplanReason(page);

    const replanRequired = await waitForProgressEntry(
      workspaceRoot,
      (entry) => normalizeString(entry.targetId) === created.taskId && normalizeString(entry.actionType) === "replan_required",
      180000
    );
    if (!replanRequired) throw new Error(`missing replan_required for ${created.taskId}`);

    const replanned = await waitForProgressEntry(
      workspaceRoot,
      (entry) => normalizeString(entry.targetId) === created.taskId && normalizeString(entry.actionType) === "replanned",
      60000
    );
    if (replanned) {
      await waitForTaskCount(page, beforeTaskCount + 2, 180000);
    }

    const planArtifacts = await readPlanArtifacts(workspaceRoot);
    const latestTasks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("[data-task-row]"))
        .slice(-5)
        .map((row) => ({
          id: row.getAttribute("data-task-row") || "",
          status: row.getAttribute("data-board-status") || "",
          text: String(row.textContent || "").trim(),
        }));
    });

    console.log(`worker_run=${normalizeString(workerRun.runId)}`);
    console.log(`gate_run=${normalizeString(gateRun?.runId) || "missing"}`);
    console.log(`replan_required_status=${normalizeString(replanRequired.status)}|message=${normalizeString(replanRequired.messageForUser)}`);
    console.log(`replanned_status=${normalizeString(replanned?.status) || "missing"}|message=${normalizeString(replanned?.messageForUser)}`);
    console.log(`replanned_payload=${JSON.stringify(replanned?.payload || {})}`);
    console.log(`plan_artifact_count=${planArtifacts.length}`);
    latestTasks.forEach((task) => {
      console.log(`task=${task.id}|status=${task.status}|text=${task.text}`);
    });
  } finally {
    await electronApp.close();
  }
}

runObservation(process.argv.slice(2)).catch((error) => {
  console.error(normalizeString(error?.message || error));
  process.exit(1);
});
