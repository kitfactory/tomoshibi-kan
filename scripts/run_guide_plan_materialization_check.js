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
  const index = args.indexOf("--workspace");
  if (index >= 0 && args[index + 1]) {
    const explicit = path.resolve(String(args[index + 1]).trim());
    fs.mkdirSync(explicit, { recursive: true });
    return explicit;
  }
  return fs.mkdtempSync(path.join(os.tmpdir(), "palpal-guide-materialize-"));
}

async function main(args) {
  const workspaceRoot = createWorkspaceRoot(args);
  const sourceWorkspace = path.resolve(getOptionValue(args, "--source-workspace", workspaceRoot));
  const runId = getOptionValue(args, "--run-id");
  const appRoot = path.resolve(__dirname, "..");
  console.log(`workspace_root=${workspaceRoot}`);
  console.log(`source_workspace=${sourceWorkspace}`);
  console.log(`run_id=${runId}`);

  const sourcePaths = resolveWorkspacePaths(sourceWorkspace);
  const sourceStore = new SqliteSettingsStore({
    dbPath: sourcePaths.dbPath,
    secretsPath: sourcePaths.secretsPath,
    safeStorage: { isEncryptionAvailable() { return false; } },
  });
  let sourceRow = null;
  try {
    const rows = await sourceStore.listOrchestrationDebugRuns({ limit: 20, stage: "guide_chat" });
    sourceRow = runId
      ? rows.find((row) => normalizeString(row.runId) === runId) || null
      : rows[0] || null;
  } finally {
    await sourceStore.close();
  }
  if (!sourceRow) {
    throw new Error("source guide_chat debug run not found");
  }

  const electronApp = await electron.launch({
    args: [appRoot],
    env: {
      ...process.env,
      PALPAL_WS_ROOT: workspaceRoot,
    },
  });

  try {
    const page = await electronApp.firstWindow();
    await page.waitForSelector('[data-tab="task"]', { timeout: 30000 });
    await page.click('[data-tab="task"]');
    const result = await page.evaluate(async ({ outputText, meta }) => {
      const beforeCount = document.querySelectorAll("[data-task-row]").length;
      const parsed = window.GuidePlan.parseGuidePlanResponse(String(outputText || ""), {
        planningIntent: String(meta?.planningIntent || ""),
        planningReadiness: String(meta?.planningReadiness || ""),
      });
      if (!parsed.ok) {
        return {
          ok: false,
          stage: "parse",
          error: parsed.error,
          beforeCount,
          afterCount: beforeCount,
          created: 0,
          latestTasks: [],
        };
      }
      const created = await window.createPlannedTasksFromGuidePlan(parsed.plan);
      const rows = Array.from(document.querySelectorAll("[data-task-row]"));
      const afterCount = rows.length;
      const latestTasks = rows.slice(-3).map((row) => ({
        id: row.getAttribute("data-task-row") || "",
        title: String(row.textContent || "").trim().split(/\s+/)[0] || "",
        palId: String(row.textContent || "").match(/pal-[a-z0-9-]+/i)?.[0] || "",
      }));
      return {
        ok: true,
        stage: "materialize",
        beforeCount,
        afterCount,
        created: Number(created?.created || 0),
          latestTasks,
        };
    }, {
      outputText: sourceRow.output?.text || "",
      meta: sourceRow.meta || {},
    });

    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) {
      throw new Error(`materialization check failed at ${result.stage}: ${result.error}`);
    }
    if (result.created !== 3 || result.afterCount !== result.beforeCount + 3) {
      throw new Error(`unexpected materialization result: created=${result.created}, before=${result.beforeCount}, after=${result.afterCount}`);
    }
  } finally {
    await electronApp.close();
  }
}

main(process.argv.slice(2)).catch((error) => {
  console.error(String(error && error.message ? error.message : error));
  process.exit(1);
});
