const test = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveEffectiveSkillIds,
  resolveSkillSummariesForContext,
} = require("../../wireframe/agent-skill-resolver.js");

test("resolveEffectiveSkillIds keeps configured skills that are installed for model runtime", () => {
  const result = resolveEffectiveSkillIds({
    runtimeKind: "model",
    configuredSkillIds: ["codex-file-search", "browser-chrome", "codex-file-search"],
    installedSkillIds: ["codex-file-search", "codex-file-edit"],
  });
  assert.deepEqual(result, ["codex-file-search"]);
});

test("resolveEffectiveSkillIds returns empty for tool runtime when no capability snapshot exists", () => {
  const result = resolveEffectiveSkillIds({
    runtimeKind: "tool",
    configuredSkillIds: ["codex-file-search"],
    installedSkillIds: ["codex-file-search"],
  });
  assert.deepEqual(result, []);
});

test("resolveEffectiveSkillIds returns tool capability ids for tool runtime", () => {
  const result = resolveEffectiveSkillIds({
    runtimeKind: "tool",
    selectedToolNames: ["Codex"],
    registeredToolCapabilities: [
      {
        toolName: "Codex",
        capabilities: [
          { id: "codex.command.exec", name: "exec", kind: "command" },
          { id: "codex.feature.shell_tool", name: "shell_tool", kind: "feature" },
        ],
      },
    ],
  });
  assert.deepEqual(result, ["codex.command.exec", "codex.feature.shell_tool"]);
});

test("resolveSkillSummariesForContext builds summaries from catalog", () => {
  const result = resolveSkillSummariesForContext({
    runtimeKind: "model",
    configuredSkillIds: ["codex-file-search", "browser-chrome"],
    installedSkillIds: ["codex-file-search", "browser-chrome"],
    catalogItems: [
      { id: "codex-file-search", name: "File Search", description: "Search text and files" },
      { id: "browser-chrome", name: "Chrome Browser", description: "Browser automation" },
    ],
  });
  assert.deepEqual(result.effectiveSkillIds, ["codex-file-search", "browser-chrome"]);
  assert.deepEqual(result.skillSummaries, [
    "File Search: Search text and files",
    "Chrome Browser: Browser automation",
  ]);
});

test("resolveSkillSummariesForContext falls back to id when catalog entry is missing", () => {
  const result = resolveSkillSummariesForContext({
    runtimeKind: "model",
    configuredSkillIds: ["unknown-skill"],
    installedSkillIds: ["unknown-skill"],
    catalogItems: [],
  });
  assert.deepEqual(result.skillSummaries, ["unknown-skill"]);
});

test("resolveSkillSummariesForContext returns tool capability summaries for tool runtime", () => {
  const result = resolveSkillSummariesForContext({
    runtimeKind: "tool",
    selectedToolNames: ["Codex"],
    registeredToolCapabilities: [
      {
        toolName: "Codex",
        capabilities: [
          { id: "codex.command.exec", name: "exec", kind: "command" },
        ],
        capabilitySummaries: [
          "exec: Run Codex non-interactively",
          "shell_tool: stable enabled",
        ],
      },
    ],
  });
  assert.deepEqual(result.effectiveSkillIds, ["codex.command.exec"]);
  assert.deepEqual(result.skillSummaries, [
    "exec: Run Codex non-interactively",
    "shell_tool: stable enabled",
  ]);
});
