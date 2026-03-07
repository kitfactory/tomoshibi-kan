#!/usr/bin/env node
const path = require("path");
const { spawn } = require("child_process");
const os = require("os");
const { SqliteSettingsStore } = require("../runtime/settings-store");
const { parseGuidePlanResponse } = require("../wireframe/guide-plan");
const {
  resolveWorkspaceRoot,
  resolveWorkspacePaths,
} = require("../runtime/workspace-root");

function printHelp() {
  const cliName = path.basename(process.argv[1] || "tomoshibikan", path.extname(process.argv[1] || ""));
  console.log(`${cliName} - launch Tomoshibi-kan via Electron`);
  console.log("");
  console.log("Usage:");
  console.log(`  ${cliName}`);
  console.log(`  ${cliName} --devtools`);
  console.log(`  ${cliName} debug runs [--limit <n>] [--role <guide|worker|gate>] [--stage <guide_chat|worker_runtime|gate_review>] [--status <ok|error>]`);
  console.log(`  ${cliName} debug show <run_id>`);
  console.log(`  ${cliName} debug guide-failures [--limit <n>]`);
  console.log(`  ${cliName} debug smoke [--workspace <path>]`);
  console.log(`  ${cliName} --help`);
  console.log("");
  console.log("Legacy alias: palpal");
}

function normalizeString(value) {
  return String(value || "").trim();
}

function getOptionValue(args, name, fallback = "") {
  const index = args.indexOf(name);
  if (index < 0 || index + 1 >= args.length) return fallback;
  return normalizeString(args[index + 1]);
}

function resolveWorkspacePathsForCli() {
  const wsRoot = resolveWorkspaceRoot({
    platform: process.platform,
    envWorkspaceRoot: normalizeString(
      process.env.TOMOSHIBIKAN_WS_ROOT ||
      process.env.TOMOSHIBIKAN_WORKSPACE_ROOT ||
      process.env.PALPAL_WS_ROOT ||
      process.env.PALPAL_WORKSPACE_ROOT
    ),
    documentsPath: path.join(os.homedir(), "Documents"),
    homePath: os.homedir(),
    userDataPath: path.join(os.homedir(), ".tomoshibikan"),
  });
  return resolveWorkspacePaths(wsRoot);
}

async function createSettingsStore() {
  const paths = resolveWorkspacePathsForCli();
  return new SqliteSettingsStore({
    dbPath: paths.dbPath,
    secretsPath: paths.secretsPath,
    safeStorage: null,
  });
}

function filterDebugRuns(rows, args) {
  const role = getOptionValue(args, "--role").toLowerCase();
  const stage = getOptionValue(args, "--stage").toLowerCase();
  const status = getOptionValue(args, "--status").toLowerCase();
  return rows.filter((row) => {
    if (role && normalizeString(row.agentRole).toLowerCase() !== role) return false;
    if (stage && normalizeString(row.stage).toLowerCase() !== stage) return false;
    if (status && normalizeString(row.status).toLowerCase() !== status) return false;
    return true;
  });
}

function printDebugRunSummary(row) {
  console.log([
    normalizeString(row.createdAt),
    normalizeString(row.stage),
    normalizeString(row.agentRole),
    normalizeString(row.agentId),
    normalizeString(row.targetKind),
    normalizeString(row.targetId),
    normalizeString(row.status),
    normalizeString(row.modelName),
    normalizeString(row.runId),
  ].join(" | "));
}

function printDebugRunDetail(row) {
  if (!row) return;
  console.log(`run_id: ${normalizeString(row.runId)}`);
  console.log(`created_at: ${normalizeString(row.createdAt)}`);
  console.log(`stage: ${normalizeString(row.stage)}`);
  console.log(`agent_role: ${normalizeString(row.agentRole)}`);
  console.log(`agent_id: ${normalizeString(row.agentId)}`);
  console.log(`target_kind: ${normalizeString(row.targetKind)}`);
  console.log(`target_id: ${normalizeString(row.targetId)}`);
  console.log(`status: ${normalizeString(row.status)}`);
  console.log(`provider: ${normalizeString(row.provider)}`);
  console.log(`model_name: ${normalizeString(row.modelName)}`);
  console.log("");
  console.log("[input]");
  console.log(JSON.stringify(row.input || {}, null, 2));
  console.log("");
  console.log("[output]");
  console.log(JSON.stringify(row.output || {}, null, 2));
  console.log("");
  console.log("[meta]");
  console.log(JSON.stringify(row.meta || {}, null, 2));
  if (normalizeString(row.errorText)) {
    console.log("");
    console.log("[error]");
    console.log(normalizeString(row.errorText));
  }
}

function inferGuideBlockingCue(replyText) {
  const text = normalizeString(replyText).toLowerCase();
  if (!text) return "empty_reply";
  if (
    text.includes("どの機能") ||
    text.includes("どのような違和感") ||
    text.includes("具体的に") ||
    text.includes("what feature") ||
    text.includes("which feature") ||
    text.includes("more specifically")
  ) {
    return "scope_unclear";
  }
  if (
    text.includes("どのファイル") ||
    text.includes("関連ファイル") ||
    text.includes("path") ||
    text.includes("file") ||
    text.includes("files")
  ) {
    return "missing_file_context";
  }
  if (
    text.includes("期待結果") ||
    text.includes("期待通り") ||
    text.includes("goal") ||
    text.includes("outcome") ||
    text.includes("期待") ||
    text.includes("ゴール")
  ) {
    return "missing_expected_outcome";
  }
  if (
    text.includes("再現") ||
    text.includes("repro") ||
    text.includes("steps") ||
    text.includes("手順")
  ) {
    return "missing_repro_context";
  }
  if (
    text.includes("どの pal") ||
    text.includes("担当") ||
    text.includes("assignee") ||
    text.includes("worker")
  ) {
    return "assignment_unclear";
  }
  return "general_clarification";
}

function classifyGuideDebugRun(row) {
  if (normalizeString(row.stage) !== "guide_chat") {
    return null;
  }
  if (normalizeString(row.status) === "error") {
    return {
      status: "runtime_error",
      cue: normalizeString(row.errorText) ? "runtime_error" : "runtime_error_unknown",
      runId: normalizeString(row.runId),
      createdAt: normalizeString(row.createdAt),
      reply: "",
    };
  }
  const outputText = normalizeString(row.output?.text);
  if (!outputText) {
    return {
      status: "empty_output",
      cue: "empty_output",
      runId: normalizeString(row.runId),
      createdAt: normalizeString(row.createdAt),
      reply: "",
    };
  }
  const parsed = parseGuidePlanResponse(outputText);
  if (!parsed.ok) {
    return {
      status: "parse_failure",
      cue: normalizeString(parsed.error) || "parse_failure",
      runId: normalizeString(row.runId),
      createdAt: normalizeString(row.createdAt),
      reply: outputText,
    };
  }
  return {
    status: normalizeString(parsed.status),
    cue: parsed.status === "needs_clarification"
      ? inferGuideBlockingCue(parsed.reply)
      : parsed.status,
    runId: normalizeString(row.runId),
    createdAt: normalizeString(row.createdAt),
    reply: normalizeString(parsed.reply),
  };
}

function printGuideFailureSummary(classifiedRuns) {
  const counts = new Map();
  classifiedRuns.forEach((item) => {
    const key = `${item.status}:${item.cue}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .forEach(([key, count]) => {
      console.log(`${key} | count=${count}`);
    });
}

function printGuideFailureExamples(classifiedRuns) {
  classifiedRuns.forEach((item) => {
    const replyPreview = normalizeString(item.reply).replace(/\s+/g, " ").slice(0, 160);
    console.log([
      item.createdAt,
      item.status,
      item.cue,
      item.runId,
      replyPreview,
    ].join(" | "));
  });
}

async function runDebugRuns(args) {
  const limit = Number(getOptionValue(args, "--limit", "20")) || 20;
  const store = await createSettingsStore();
  try {
    const rows = await store.listOrchestrationDebugRuns({ limit: Math.max(limit, 1) });
    const filtered = filterDebugRuns(rows, args);
    filtered.forEach(printDebugRunSummary);
  } finally {
    await store.close();
  }
}

async function runDebugShow(args) {
  const runId = normalizeString(args[0]);
  if (!runId) {
    console.error("run_id is required");
    process.exit(1);
  }
  const store = await createSettingsStore();
  try {
    const rows = await store.listOrchestrationDebugRuns({ limit: 200 });
    const row = rows.find((item) => normalizeString(item.runId) === runId);
    if (!row) {
      console.error(`run not found: ${runId}`);
      process.exit(1);
    }
    printDebugRunDetail(row);
  } finally {
    await store.close();
  }
}

async function runDebugGuideFailures(args) {
  const limit = Number(getOptionValue(args, "--limit", "20")) || 20;
  const store = await createSettingsStore();
  try {
    const rows = await store.listOrchestrationDebugRuns({ limit: Math.max(limit, 1) });
    const guideRows = rows.filter((row) => normalizeString(row.stage) === "guide_chat");
    const classified = guideRows
      .map(classifyGuideDebugRun)
      .filter(Boolean);
    printGuideFailureSummary(classified);
    if (classified.length > 0) {
      console.log("");
      printGuideFailureExamples(classified);
    }
  } finally {
    await store.close();
  }
}

async function runDebugSmoke(args) {
  const scriptPath = path.resolve(__dirname, "../scripts/run_orchestration_debug_smoke.js");
  const child = spawn(process.execPath, [scriptPath, ...args], {
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code, signal) => {
    if (signal) {
      process.exit(1);
    }
    process.exit(code || 0);
  });
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

const command = normalizeString(args[0]).toLowerCase();
const subcommand = normalizeString(args[1]).toLowerCase();
if (command === "debug" && subcommand === "runs") {
  runDebugRuns(args.slice(2)).catch((error) => {
    console.error(normalizeString(error?.message || error));
    process.exit(1);
  });
  return;
}
if (command === "debug" && subcommand === "show") {
  runDebugShow(args.slice(2)).catch((error) => {
    console.error(normalizeString(error?.message || error));
    process.exit(1);
  });
  return;
}
if (command === "debug" && subcommand === "guide-failures") {
  runDebugGuideFailures(args.slice(2)).catch((error) => {
    console.error(normalizeString(error?.message || error));
    process.exit(1);
  });
  return;
}
if (command === "debug" && subcommand === "smoke") {
  runDebugSmoke(args.slice(2)).catch((error) => {
    console.error(normalizeString(error?.message || error));
    process.exit(1);
  });
  return;
}

let electronBinary;
try {
  // electron package exports the executable path.
  electronBinary = require("electron");
} catch (err) {
  console.error("electron dependency was not found. Run `npm install` first.");
  process.exit(1);
}

const appRoot = path.resolve(__dirname, "..");
const electronArgs = [appRoot];
if (args.includes("--devtools")) {
  electronArgs.unshift("--auto-open-devtools-for-tabs");
}

const child = spawn(electronBinary, electronArgs, {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code || 0);
});
