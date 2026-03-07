const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const { SqliteSettingsStore } = require("../../runtime/settings-store.js");

function createSafeStorageMock() {
  return {
    isEncryptionAvailable() {
      return true;
    },
    encryptString(value) {
      return Buffer.from(String(value), "utf8");
    },
    decryptString(buffer) {
      return Buffer.from(buffer).toString("utf8");
    },
  };
}

async function createStore(tmpDir) {
  return new SqliteSettingsStore({
    dbPath: path.join(tmpDir, "settings.sqlite"),
    secretsPath: path.join(tmpDir, "secrets.json"),
    safeStorage: createSafeStorageMock(),
  });
}

test("SqliteSettingsStore saves and loads settings without exposing api key", async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-settings-"));
  const store = await createStore(tmpDir);
  try {
    const saved = await store.save({
      locale: "ja",
      registeredModels: [
        {
          name: "gpt-4.1",
          provider: "openai",
          baseUrl: "http://localhost:1234/v1",
          apiKeyInput: "secret-abc",
        },
      ],
      registeredTools: ["Codex"],
      registeredSkills: ["codex-file-search"],
    });

    assert.equal(saved.registeredModels[0].name, "gpt-4.1");
    assert.equal(saved.registeredModels[0].apiKeyConfigured, true);

    const loaded = await store.load();
    assert.equal(loaded.registeredModels[0].apiKeyConfigured, true);
    assert.equal(Object.prototype.hasOwnProperty.call(loaded.registeredModels[0], "apiKey"), false);

    const resolved = await store.resolveModelApiKey("gpt-4.1");
    assert.equal(resolved, "secret-abc");
  } finally {
    await store.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("SqliteSettingsStore keeps existing api key when saving without apiKeyInput", async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-settings-"));
  const store = await createStore(tmpDir);
  try {
    await store.save({
      locale: "ja",
      registeredModels: [
        {
          name: "gpt-4.1",
          provider: "openai",
          baseUrl: "http://localhost:1234/v1",
          apiKeyInput: "secret-abc",
        },
      ],
      registeredTools: ["Codex"],
      registeredSkills: [],
    });

    await store.save({
      locale: "ja",
      registeredModels: [
        {
          name: "gpt-4.1",
          provider: "openai",
          baseUrl: "http://localhost:1234/v1",
          apiKeyInput: "",
        },
      ],
      registeredTools: ["Codex"],
      registeredSkills: [],
    });

    const resolved = await store.resolveModelApiKey("gpt-4.1");
    assert.equal(resolved, "secret-abc");
  } finally {
    await store.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("SqliteSettingsStore appends and lists orchestration debug runs", async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-settings-"));
  const store = await createStore(tmpDir);
  try {
    await store.appendOrchestrationDebugRun({
      stage: "worker_runtime",
      agentRole: "worker",
      agentId: "pal-alpha",
      targetKind: "task",
      targetId: "TASK-001",
      status: "ok",
      provider: "openai",
      modelName: "gpt-4.1",
      input: {
        userText: "[WorkerExecutionInput]",
      },
      output: {
        text: "done",
      },
      meta: {
        identityVersions: {
          roleVersion: "role-1234",
        },
      },
    });

    await store.appendOrchestrationDebugRun({
      stage: "gate_review",
      agentRole: "gate",
      agentId: "gate-core",
      targetKind: "task",
      targetId: "TASK-001",
      status: "error",
      provider: "openai",
      modelName: "gpt-4.1",
      input: {
        userText: "[GateReviewInput]",
      },
      output: {},
      errorText: "timeout",
    });

    const rows = await store.listOrchestrationDebugRuns({ limit: 10 });
    assert.equal(rows.length, 2);
    assert.equal(rows[0].stage, "gate_review");
    assert.equal(rows[0].status, "error");
    assert.equal(rows[0].errorText, "timeout");
    assert.equal(rows[1].stage, "worker_runtime");
    assert.equal(rows[1].input.userText, "[WorkerExecutionInput]");
    assert.equal(rows[1].output.text, "done");
    assert.equal(rows[1].meta.identityVersions.roleVersion, "role-1234");
  } finally {
    await store.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
