const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeRuntimeKind,
  validatePalRuntimeSelection,
} = require("../../wireframe/runtime-validation.js");

test("normalizeRuntimeKind returns model by default", () => {
  assert.equal(normalizeRuntimeKind("model"), "model");
  assert.equal(normalizeRuntimeKind("tool"), "tool");
  assert.equal(normalizeRuntimeKind("unknown"), "model");
  assert.equal(normalizeRuntimeKind(""), "model");
});

test("validatePalRuntimeSelection accepts model runtime and filters skills", () => {
  const result = validatePalRuntimeSelection({
    runtimeKind: "model",
    runtimeTarget: "gpt-4o-mini",
    availableModels: ["gpt-4.1", "gpt-4o-mini"],
    availableTools: ["Codex"],
    requestedSkillIds: [
      "codex-file-search",
      "codex-file-search",
      "browser-chrome",
      "not-allowed",
    ],
    allowedSkillIds: ["codex-file-search", "browser-chrome"],
  });

  assert.equal(result.ok, true);
  assert.equal(result.runtimeKind, "model");
  assert.deepEqual(result.models, ["gpt-4o-mini"]);
  assert.deepEqual(result.cliTools, []);
  assert.deepEqual(result.skills, ["codex-file-search", "browser-chrome"]);
});

test("validatePalRuntimeSelection rejects model runtime when target is unavailable", () => {
  const result = validatePalRuntimeSelection({
    runtimeKind: "model",
    runtimeTarget: "gpt-4o-mini",
    availableModels: ["gpt-4.1"],
    availableTools: ["Codex"],
    requestedSkillIds: ["codex-file-search"],
    allowedSkillIds: ["codex-file-search"],
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "MSG-PPH-1001");
});

test("validatePalRuntimeSelection accepts tool runtime and clears skills", () => {
  const result = validatePalRuntimeSelection({
    runtimeKind: "tool",
    runtimeTarget: "Codex",
    availableModels: ["gpt-4.1"],
    availableTools: ["Codex", "ClaudeCode"],
    requestedSkillIds: ["codex-file-search"],
    allowedSkillIds: ["codex-file-search"],
  });

  assert.equal(result.ok, true);
  assert.equal(result.runtimeKind, "tool");
  assert.deepEqual(result.models, []);
  assert.deepEqual(result.cliTools, ["Codex"]);
  assert.deepEqual(result.skills, []);
});

test("validatePalRuntimeSelection rejects tool runtime when no tool is selectable", () => {
  const result = validatePalRuntimeSelection({
    runtimeKind: "tool",
    runtimeTarget: "",
    availableModels: ["gpt-4.1"],
    availableTools: [],
    requestedSkillIds: ["codex-file-search"],
    allowedSkillIds: ["codex-file-search"],
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "MSG-PPH-1001");
});
