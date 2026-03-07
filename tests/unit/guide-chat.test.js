const test = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveGuideModelState,
  bindGuideToFirstRegisteredModel,
  buildGuideModelReply,
  buildGuideModelRequiredPrompt,
} = require("../../wireframe/guide-chat.js");

test("resolveGuideModelState returns not-ready when guide model is missing", () => {
  const state = resolveGuideModelState({
    palProfiles: [
      {
        id: "guide-core",
        role: "guide",
        runtimeKind: "model",
        models: [],
      },
    ],
    activeGuideId: "guide-core",
    registeredModels: [{ name: "gpt-4.1", provider: "openai" }],
  });
  assert.equal(state.ready, false);
  assert.equal(state.errorCode, "MSG-PPH-1010");
});

test("resolveGuideModelState returns ready when guide model exists in settings", () => {
  const state = resolveGuideModelState({
    palProfiles: [
      {
        id: "guide-core",
        role: "guide",
        runtimeKind: "model",
        models: ["gpt-4.1"],
      },
    ],
    activeGuideId: "guide-core",
    registeredModels: [{ name: "gpt-4.1", provider: "openai" }],
  });
  assert.equal(state.ready, true);
  assert.equal(state.modelName, "gpt-4.1");
  assert.equal(state.provider, "openai");
});

test("bindGuideToFirstRegisteredModel forces guide to model runtime", () => {
  const palProfiles = [
    {
      id: "guide-core",
      role: "guide",
      runtimeKind: "tool",
      models: [],
      cliTools: ["Codex"],
      provider: "",
    },
  ];
  const result = bindGuideToFirstRegisteredModel({
    palProfiles,
    activeGuideId: "guide-core",
    registeredModels: [{ name: "claude-3-7-sonnet", provider: "anthropic" }],
  });
  assert.equal(result.changed, true);
  assert.equal(palProfiles[0].runtimeKind, "model");
  assert.deepEqual(palProfiles[0].models, ["claude-3-7-sonnet"]);
  assert.deepEqual(palProfiles[0].cliTools, []);
  assert.equal(palProfiles[0].provider, "anthropic");
});

test("resolveGuideModelState uses activeGuideId when multiple guides exist", () => {
  const state = resolveGuideModelState({
    palProfiles: [
      {
        id: "guide-core",
        role: "guide",
        runtimeKind: "model",
        models: ["missing-model"],
      },
      {
        id: "guide-home",
        role: "guide",
        runtimeKind: "model",
        models: ["gpt-4.1"],
      },
    ],
    activeGuideId: "guide-home",
    registeredModels: [{ name: "gpt-4.1", provider: "openai" }],
  });
  assert.equal(state.ready, true);
  assert.equal(state.guideId, "guide-home");
});

test("bindGuideToFirstRegisteredModel updates only active guide", () => {
  const palProfiles = [
    {
      id: "guide-core",
      role: "guide",
      runtimeKind: "tool",
      models: [],
      cliTools: ["Codex"],
      provider: "",
    },
    {
      id: "guide-home",
      role: "guide",
      runtimeKind: "model",
      models: ["gpt-4.1"],
      cliTools: [],
      provider: "openai",
    },
  ];
  const result = bindGuideToFirstRegisteredModel({
    palProfiles,
    activeGuideId: "guide-core",
    registeredModels: [{ name: "claude-3-7-sonnet", provider: "anthropic" }],
  });
  assert.equal(result.changed, true);
  assert.deepEqual(palProfiles[0].models, ["claude-3-7-sonnet"]);
  assert.deepEqual(palProfiles[1].models, ["gpt-4.1"]);
});

test("buildGuideModelReply includes provider/model context", () => {
  const reply = buildGuideModelReply({
    userText: "バックログ整理",
    modelName: "gpt-4.1",
    providerLabel: "OpenAI",
  });
  assert.match(reply.ja, /OpenAI\/gpt-4\.1/);
  assert.match(reply.en, /OpenAI\/gpt-4\.1/);
});

test("buildGuideModelRequiredPrompt returns settings guidance", () => {
  const prompt = buildGuideModelRequiredPrompt();
  assert.match(prompt.ja, /Settings/);
  assert.match(prompt.en, /Settings/);
});
