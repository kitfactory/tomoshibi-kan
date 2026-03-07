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
    registeredSkills: ["codex-file-search", "codex-file-search"],
  });

  assert.equal(payload.locale, "en");
  assert.equal(payload.contextHandoffPolicy, "verbose");
  assert.equal(payload.guideControllerAssistEnabled, true);
  assert.equal(payload.registeredModels.length, 1);
  assert.equal(payload.registeredModels[0].name, "gpt-4.1");
  assert.equal(payload.registeredModels[0].apiKeyInput, "secret-1");
  assert.deepEqual(payload.registeredTools, ["Codex"]);
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
  });

  assert.equal(snapshot.contextHandoffPolicy, "minimal");
  assert.equal(snapshot.guideControllerAssistEnabled, true);
  assert.equal(snapshot.registeredModels[0].apiKeyConfigured, true);
  assert.equal(snapshot.registeredModels[0].apiKey, "");
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
});
