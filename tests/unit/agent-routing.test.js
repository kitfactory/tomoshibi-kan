const test = require("node:test");
const assert = require("node:assert/strict");

const {
  inferRequiredSkills,
  selectWorkerForTask,
  selectGateForTarget,
} = require("../../wireframe/agent-routing.js");

test("inferRequiredSkills picks worker skills that match task text", () => {
  const required = inferRequiredSkills(
    {
      title: "Run browser test flow",
      description: "Use browser and file search to inspect the UI flow",
    },
    [
      {
        id: "pal-browser",
        enabledSkillIds: ["browser-chrome", "codex-file-search"],
        skillSummaries: [
          "Browser Chrome: open and inspect pages",
          "File Search: search files",
        ],
      },
    ]
  );
  assert.deepEqual(required, ["browser-chrome", "codex-file-search"]);
});

test("selectWorkerForTask prioritizes matched skills before role text", () => {
  const selected = selectWorkerForTask({
    taskDraft: {
      title: "Run browser test flow",
      description: "Use browser and file search to inspect the UI flow",
    },
    workers: [
      {
        id: "pal-writer",
        roleText: "Write summaries and document changes",
        enabledSkillIds: ["codex-file-edit"],
        skillSummaries: ["File Edit: apply patches"],
      },
      {
        id: "pal-browser",
        roleText: "Investigate browser behavior and test flows",
        enabledSkillIds: ["browser-chrome", "codex-file-search"],
        skillSummaries: [
          "Browser Chrome: open and inspect pages",
          "File Search: search files",
        ],
      },
    ],
  });

  assert.equal(selected.workerId, "pal-browser");
  assert.deepEqual(selected.matchedSkills, ["browser-chrome", "codex-file-search"]);
});

test("selectGateForTarget prioritizes rubric match and falls back to default gate on tie", () => {
  const selected = selectGateForTarget({
    target: {
      title: "Validate E2E review",
      instruction: "Check test evidence and safety constraints",
      expectedOutput: "Approve only when evidence and test result are present",
      submission: "Evidence and test result attached",
      evidence: "playwright report",
      replay: "npx playwright test",
      fixes: [],
    },
    defaultGateId: "gate-core",
    gates: [
      {
        id: "gate-core",
        rubricText: "Check evidence and traceability",
      },
      {
        id: "gate-test",
        rubricText: "Check evidence, test result, and safety constraints",
      },
    ],
  });

  assert.equal(selected.gateId, "gate-test");
  assert.ok(selected.matchedRubricTerms.includes("evidence"));
  assert.ok(selected.matchedReviewFocusTerms.includes("evidence"));
});
