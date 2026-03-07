const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildSettingsSavePayload,
  normalizeSettingsSnapshot,
  buildLocalStoredSnapshot,
} = require("../../wireframe/settings-persistence.js");

test("buildSettingsSavePayload normalizes locale and model payload", () => {
  const payload = buildSettingsSavePayload({
    locale: "en",
    contextHandoffPolicy: "verbose",
    guideControllerAssistEnabled: true,
    registeredModels: [
      {
        name: " gpt-4.1 ",
        provider: "openai",
        apiKey: "secret-1",
        baseUrl: " http://localhost:1234/v1 ",
      },
    ],
    registeredTools: ["Codex", "Codex"],
    registeredToolCapabilities: [
      {
        toolName: "Codex",
        status: "available",
        fetchedAt: "2026-03-07T00:00:00.000Z",
        commandName: "codex",
        versionText: "codex-cli 0.111.0",
        capabilities: [
          { id: "codex.command.exec", name: "exec", kind: "command", description: "Run Codex non-interactively" },
        ],
        capabilitySummaries: ["exec: Run Codex non-interactively"],
      },
    ],
    registeredSkills: ["codex-file-search", "codex-file-search"],
  });

  assert.equal(payload.locale, "en");
  assert.equal(payload.contextHandoffPolicy, "verbose");
  assert.equal(payload.guideControllerAssistEnabled, true);
  assert.equal(payload.registeredModels.length, 1);
  assert.equal(payload.registeredModels[0].name, "gpt-4.1");
  assert.equal(payload.registeredModels[0].apiKeyInput, "secret-1");
  assert.deepEqual(payload.registeredTools, ["Codex"]);
  assert.equal(payload.registeredToolCapabilities.length, 1);
  assert.equal(payload.registeredToolCapabilities[0].toolName, "Codex");
  assert.deepEqual(payload.registeredSkills, ["codex-file-search"]);
});

test("normalizeSettingsSnapshot does not expose apiKey value", () => {
  const snapshot = normalizeSettingsSnapshot({
    locale: "ja",
    contextHandoffPolicy: "minimal",
    guideControllerAssistEnabled: true,
    registeredModels: [
      {
        name: "gpt-4.1",
        provider: "openai",
        apiKeyConfigured: true,
        apiKey: "should-not-be-shown",
      },
    ],
    registeredToolCapabilities: [
      {
        toolName: "Codex",
        status: "available",
        commandName: "codex",
        capabilities: [
          { id: "codex.command.exec", name: "exec", kind: "command", description: "Run Codex non-interactively" },
        ],
        capabilitySummaries: ["exec: Run Codex non-interactively"],
      },
    ],
  });

  assert.equal(snapshot.contextHandoffPolicy, "minimal");
  assert.equal(snapshot.guideControllerAssistEnabled, true);
  assert.equal(snapshot.registeredModels[0].apiKeyConfigured, true);
  assert.equal(snapshot.registeredModels[0].apiKey, "");
  assert.equal(snapshot.registeredToolCapabilities[0].toolName, "Codex");
});

test("normalizeSettingsSnapshot defaults guide controller assist to false", () => {
  const snapshot = normalizeSettingsSnapshot({
    locale: "ja",
    contextHandoffPolicy: "balanced",
    registeredModels: [],
  });

  assert.equal(snapshot.guideControllerAssistEnabled, false);
});

test("buildLocalStoredSnapshot preserves configured state without storing key", () => {
  const existing = {
    locale: "ja",
    contextHandoffPolicy: "balanced",
    guideControllerAssistEnabled: false,
    registeredModels: [
      {
        name: "gpt-4.1",
        provider: "openai",
        apiKeyConfigured: true,
      },
    ],
    registeredTools: ["Codex"],
    registeredToolCapabilities: [
      {
        toolName: "Codex",
        status: "available",
        commandName: "codex",
        capabilities: [
          { id: "codex.command.exec", name: "exec", kind: "command", description: "Run Codex non-interactively" },
        ],
        capabilitySummaries: ["exec: Run Codex non-interactively"],
      },
    ],
    registeredSkills: ["codex-file-search"],
  };
  const payload = buildSettingsSavePayload({
    locale: "ja",
    contextHandoffPolicy: "verbose",
    guideControllerAssistEnabled: true,
    registeredModels: [
      {
        name: "gpt-4.1",
        provider: "openai",
        apiKey: "",
      },
    ],
    registeredTools: ["Codex"],
    registeredToolCapabilities: [
      {
        toolName: "Codex",
        status: "available",
        commandName: "codex",
        capabilities: [
          { id: "codex.command.exec", name: "exec", kind: "command", description: "Run Codex non-interactively" },
        ],
        capabilitySummaries: ["exec: Run Codex non-interactively"],
      },
    ],
    registeredSkills: ["codex-file-search"],
  });

  const stored = buildLocalStoredSnapshot({
    existingSnapshot: existing,
    payload,
  });

  assert.equal(stored.contextHandoffPolicy, "verbose");
  assert.equal(stored.guideControllerAssistEnabled, true);
  assert.equal(stored.registeredModels[0].apiKeyConfigured, true);
  assert.equal(Object.prototype.hasOwnProperty.call(stored.registeredModels[0], "apiKey"), false);
  assert.equal(stored.registeredToolCapabilities[0].toolName, "Codex");
});
