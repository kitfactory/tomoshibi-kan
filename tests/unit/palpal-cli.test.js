const test = require("node:test");
const assert = require("node:assert/strict");

const { spawnSync } = require("node:child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { SqliteSettingsStore } = require("../../runtime/settings-store.js");
const { resolveWorkspacePaths } = require("../../runtime/workspace-root.js");

function createSafeStorageMock() {
  return {
    isEncryptionAvailable() {
      return false;
    },
  };
}

async function seedDebugRuns(wsRoot) {
  const paths = resolveWorkspacePaths(wsRoot);
  const store = new SqliteSettingsStore({
    dbPath: paths.dbPath,
    secretsPath: paths.secretsPath,
    safeStorage: createSafeStorageMock(),
  });
  await store.appendOrchestrationDebugRun({
    runId: "debug-run-1",
    stage: "worker_runtime",
    agentRole: "worker",
    agentId: "pal-alpha",
    targetKind: "task",
    targetId: "TASK-001",
    status: "ok",
    provider: "openai",
    modelName: "gpt-4.1",
    input: { userText: "[WorkerExecutionInput]" },
    output: { text: "done" },
    meta: { handoffPolicy: "balanced" },
  });
  await store.appendOrchestrationDebugRun({
    runId: "debug-run-2",
    stage: "gate_review",
    agentRole: "gate",
    agentId: "gate-core",
    targetKind: "task",
    targetId: "TASK-001",
    status: "error",
    provider: "openai",
    modelName: "gpt-4.1",
    input: { userText: "[GateReviewInput]" },
    output: {},
    errorText: "timeout",
  });
  await store.appendOrchestrationDebugRun({
    runId: "guide-run-1",
    stage: "guide_chat",
    agentRole: "guide",
    agentId: "guide-core",
    targetKind: "plan",
    targetId: "PLAN-001",
    status: "ok",
    provider: "openai",
    modelName: "gpt-oss-20b",
    output: {
      text: JSON.stringify({
        status: "needs_clarification",
        reply: "どのファイルで保存処理を実装していますか？",
        plan: null,
      }),
    },
  });
  await store.appendOrchestrationDebugRun({
    runId: "guide-run-2",
    stage: "guide_chat",
    agentRole: "guide",
    agentId: "guide-core",
    targetKind: "plan",
    targetId: "PLAN-001",
    status: "ok",
    provider: "openai",
    modelName: "gpt-oss-20b",
    output: {
      text: "{\"status\":\"plan_ready\",\"reply\":\"broken\"",
    },
  });
  await store.close();
}

test("palpal debug runs lists filtered debug records", async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "palpal-cli-"));
  try {
    await seedDebugRuns(tmpDir);
    const result = spawnSync(
      process.execPath,
      ["cli/palpal.js", "debug", "runs", "--role", "gate", "--status", "error"],
      {
        cwd: path.resolve(__dirname, "../.."),
        env: {
          ...process.env,
          PALPAL_WS_ROOT: tmpDir,
        },
        encoding: "utf8",
      }
    );
    assert.equal(result.status, 0);
    assert.match(result.stdout, /gate_review/);
    assert.match(result.stdout, /debug-run-2/);
    assert.doesNotMatch(result.stdout, /debug-run-1/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("palpal debug show prints one debug record detail", async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "palpal-cli-"));
  try {
    await seedDebugRuns(tmpDir);
    const result = spawnSync(
      process.execPath,
      ["cli/palpal.js", "debug", "show", "debug-run-1"],
      {
        cwd: path.resolve(__dirname, "../.."),
        env: {
          ...process.env,
          PALPAL_WS_ROOT: tmpDir,
        },
        encoding: "utf8",
      }
    );
    assert.equal(result.status, 0);
    assert.match(result.stdout, /run_id: debug-run-1/);
    assert.match(result.stdout, /\[input\]/);
    assert.match(result.stdout, /\[WorkerExecutionInput\]/);
    assert.match(result.stdout, /\[meta\]/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("palpal help includes debug smoke command", () => {
  const result = spawnSync(
    process.execPath,
    ["cli/palpal.js", "--help"],
    {
      cwd: path.resolve(__dirname, "../.."),
      encoding: "utf8",
    }
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /palpal debug smoke/);
});

test("palpal debug guide-failures summarizes guide statuses and cues", async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "palpal-cli-"));
  try {
    await seedDebugRuns(tmpDir);
    const result = spawnSync(
      process.execPath,
      ["cli/palpal.js", "debug", "guide-failures", "--limit", "20"],
      {
        cwd: path.resolve(__dirname, "../.."),
        env: {
          ...process.env,
          PALPAL_WS_ROOT: tmpDir,
        },
        encoding: "utf8",
      }
    );
    assert.equal(result.status, 0);
    assert.match(result.stdout, /needs_clarification:missing_file_context \| count=1/);
    assert.match(result.stdout, /parse_failure:json_parse_failed \| count=1/);
    assert.match(result.stdout, /guide-run-1/);
    assert.match(result.stdout, /guide-run-2/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
