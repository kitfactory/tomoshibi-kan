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

function createWorkspaceRoot(args) {
  const explicit = normalizeString(getOptionValue(args, "--workspace"));
  if (explicit) {
    fs.mkdirSync(explicit, { recursive: true });
    return path.resolve(explicit);
  }
  return fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibi-kan-smoke-"));
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

function summarizeRuns(rows) {
  return rows.map((row) => [
    normalizeString(row.createdAt),
    normalizeString(row.stage),
    normalizeString(row.agentRole),
    normalizeString(row.agentId),
    normalizeString(row.targetKind),
    normalizeString(row.targetId),
    normalizeString(row.status),
  ].join(" | "));
}

async function addLmStudioModel(page) {
  await page.click('[data-tab="settings"]');
  await page.click("#settingsTabOpenAddItem");
  await page.selectOption("#settingsTabModelProvider", "lmstudio");
  await page.selectOption("#settingsTabModelName", "openai/gpt-oss-20b");
  await page.fill("#settingsTabModelBaseUrl", "http://127.0.0.1:1234/v1");
  await page.click("#settingsTabAddItemSubmit");
  await page.click("#settingsTabSave");
}

async function configurePalAlphaAndGate(page) {
  await page.click('[data-tab="pal"]');

  await page.click('[data-pal-open-id="pal-alpha"]');
  await page.selectOption('[data-pal-runtime-select="pal-alpha"]', "model");
  await page.selectOption('[data-pal-runtime-target-select="pal-alpha"]', "openai/gpt-oss-20b");
  await page.click("#palConfigSave");
  if (await page.locator("#closePalConfigModal").isVisible().catch(() => false)) {
    await page.click("#closePalConfigModal");
  }

  await page.click('[data-pal-open-id="gate-core"]');
  await page.selectOption('[data-pal-runtime-target-select="gate-core"]', "openai/gpt-oss-20b");
  await page.click("#palConfigSave");
  if (await page.locator("#closePalConfigModal").isVisible().catch(() => false)) {
    await page.click("#closePalConfigModal");
  }
}

async function runGuideFlow(page) {
  await page.click('[data-tab="guide"]');
  await page.fill("#guideInput", "デバッグ観測用に trace / fix / verify で進めてください。");
  await page.click("#guideSend");
  await page.locator("#guideChat .chat").last().waitFor({ state: "visible", timeout: 15000 });
}

async function runWorkerAndGateFlow(page) {
  await page.click('[data-tab="job"]');
  await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
  await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
  await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');
  await page.locator("#gatePanel").waitFor({ state: "visible", timeout: 10000 });
  await page.locator("#gateRuntimeSuggestion").waitFor({ state: "visible", timeout: 15000 });
  await page.click("#approveTask");
}

async function runSmoke(args) {
  const workspaceRoot = createWorkspaceRoot(args);
  const appRoot = path.resolve(__dirname, "..");
  console.log(`workspace_root=${workspaceRoot}`);

  const electronApp = await electron.launch({
    args: [appRoot],
    env: {
      ...process.env,
      TOMOSHIBIKAN_WS_ROOT: workspaceRoot,
      PALPAL_WS_ROOT: workspaceRoot,
      TOMOSHIBIKAN_DEBUG_STUB_RUNTIME: "1",
      PALPAL_DEBUG_STUB_RUNTIME: "1",
    },
  });

  try {
    const page = await electronApp.firstWindow();
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.waitForSelector('[data-tab="guide"]', { timeout: 15000 });

    await addLmStudioModel(page);
    await configurePalAlphaAndGate(page);
    await runGuideFlow(page);
    await runWorkerAndGateFlow(page);
  } finally {
    await electronApp.close();
  }

  const rows = await readDebugRuns(workspaceRoot);
  const stages = new Set(rows.map((row) => normalizeString(row.stage)));
  const required = ["guide_chat", "worker_runtime", "gate_review"];
  required.forEach((stage) => {
    if (!stages.has(stage)) {
      throw new Error(`missing debug stage: ${stage}`);
    }
  });
  summarizeRuns(rows).forEach((line) => console.log(line));
}

runSmoke(process.argv.slice(2)).catch((error) => {
  console.error(normalizeString(error?.message || error));
  process.exit(1);
});
