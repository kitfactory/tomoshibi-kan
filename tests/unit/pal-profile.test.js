const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizePalDisplayName,
  normalizeProfileId,
  createPalProfile,
  createWorkerPalProfile,
  canDeletePalProfile,
  applyRuntimeSelection,
  resolveAgentSelection,
} = require("../../wireframe/pal-profile.js");

test("normalizePalDisplayName uses fallback when empty", () => {
  assert.equal(normalizePalDisplayName(" Guide Prime ", "Fallback"), "Guide Prime");
  assert.equal(normalizePalDisplayName("", "Fallback"), "Fallback");
});

test("createWorkerPalProfile prefers model runtime when model exists", () => {
  const profile = createWorkerPalProfile({
    id: "pal-worker-001",
    availableModels: ["gpt-4o-mini"],
    availableTools: ["Codex"],
    roleAllowedSkills: ["codex-file-search", "browser-chrome"],
    availableSkills: ["codex-file-search", "browser-chrome"],
    defaultProvider: "openai",
  });

  assert.equal(profile.id, "pal-worker-001");
  assert.equal(profile.runtimeKind, "model");
  assert.deepEqual(profile.models, ["gpt-4o-mini"]);
  assert.deepEqual(profile.cliTools, []);
  assert.deepEqual(profile.skills, ["codex-file-search", "browser-chrome"]);
  assert.equal(profile.provider, "openai");
});

test("createPalProfile supports guide and gate roles", () => {
  const guide = createPalProfile({
    id: "core",
    role: "guide",
    availableModels: ["gpt-4o-mini"],
    availableTools: ["Codex"],
    roleAllowedSkills: ["codex-file-search"],
    availableSkills: ["codex-file-search"],
    defaultProvider: "openai",
  });
  const gate = createPalProfile({
    id: "review",
    role: "gate",
    availableModels: [],
    availableTools: ["Codex"],
    roleAllowedSkills: ["codex-test-runner"],
    availableSkills: ["codex-test-runner"],
    defaultProvider: "anthropic",
  });
  assert.equal(guide.id, "guide-core");
  assert.equal(guide.role, "guide");
  assert.equal(gate.id, "gate-review");
  assert.equal(gate.role, "gate");
  assert.equal(gate.runtimeKind, "tool");
});

test("createWorkerPalProfile falls back to tool runtime when no model exists", () => {
  const profile = createWorkerPalProfile({
    id: "pal-worker-002",
    availableModels: [],
    availableTools: ["Codex"],
    roleAllowedSkills: ["codex-file-search"],
    availableSkills: ["codex-file-search"],
    defaultProvider: "openai",
  });

  assert.equal(profile.runtimeKind, "tool");
  assert.deepEqual(profile.models, []);
  assert.deepEqual(profile.cliTools, ["Codex"]);
  assert.deepEqual(profile.skills, []);
  assert.equal(profile.provider, "");
});

test("canDeletePalProfile blocks deletion when assigned", () => {
  assert.equal(
    canDeletePalProfile({
      palId: "pal-alpha",
      tasks: [{ palId: "pal-alpha" }],
      jobs: [],
    }),
    false
  );
  assert.equal(
    canDeletePalProfile({
      palId: "pal-alpha",
      tasks: [],
      jobs: [{ palId: "pal-alpha" }],
    }),
    false
  );
  assert.equal(
    canDeletePalProfile({
      palId: "pal-alpha",
      tasks: [{ palId: "pal-beta" }],
      jobs: [],
    }),
    true
  );
});

test("canDeletePalProfile blocks deleting the last guide or gate", () => {
  assert.equal(
    canDeletePalProfile({
      palId: "guide-core",
      palProfiles: [{ id: "guide-core", role: "guide" }],
      tasks: [],
      jobs: [],
    }),
    false
  );
  assert.equal(
    canDeletePalProfile({
      palId: "gate-core",
      palProfiles: [
        { id: "gate-core", role: "gate" },
        { id: "gate-backup", role: "gate" },
      ],
      tasks: [],
      jobs: [],
    }),
    true
  );
});

test("applyRuntimeSelection updates provider/skills based on runtime kind", () => {
  const modelUpdated = applyRuntimeSelection({
    pal: {
      id: "guide-core",
      displayName: "Guide Core",
      runtimeKind: "tool",
      models: [],
      cliTools: ["Codex"],
      skills: [],
      provider: "",
    },
    displayName: "Guide Prime",
    runtimeKind: "model",
    runtimeResult: {
      models: ["gpt-4.1"],
      cliTools: [],
      skills: ["codex-file-search"],
    },
    resolveProviderForModel: (modelName) => (modelName === "gpt-4.1" ? "openai" : ""),
  });
  assert.equal(modelUpdated.displayName, "Guide Prime");
  assert.equal(modelUpdated.runtimeKind, "model");
  assert.deepEqual(modelUpdated.models, ["gpt-4.1"]);
  assert.deepEqual(modelUpdated.cliTools, []);
  assert.deepEqual(modelUpdated.skills, ["codex-file-search"]);
  assert.equal(modelUpdated.provider, "openai");

  const toolUpdated = applyRuntimeSelection({
    pal: modelUpdated,
    displayName: "Guide Prime",
    runtimeKind: "tool",
    runtimeResult: {
      models: [],
      cliTools: ["Codex"],
      skills: ["codex-file-search"],
    },
    resolveProviderForModel: () => "openai",
  });
  assert.equal(toolUpdated.runtimeKind, "tool");
  assert.deepEqual(toolUpdated.models, []);
  assert.deepEqual(toolUpdated.cliTools, ["Codex"]);
  assert.deepEqual(toolUpdated.skills, []);
  assert.equal(toolUpdated.provider, "");
});

test("normalizeProfileId and resolveAgentSelection normalize role-specific state", () => {
  assert.equal(normalizeProfileId({ role: "guide", id: "pal-guide" }), "guide-core");
  assert.equal(normalizeProfileId({ role: "gate", id: "review" }), "gate-review");
  assert.deepEqual(
    resolveAgentSelection({
      palProfiles: [
        { id: "guide-core", role: "guide" },
        { id: "gate-core", role: "gate" },
        { id: "guide-home", role: "guide" },
      ],
      activeGuideId: "guide-home",
      defaultGateId: "missing-gate",
    }),
    {
      activeGuideId: "guide-home",
      defaultGateId: "gate-core",
    }
  );
});
