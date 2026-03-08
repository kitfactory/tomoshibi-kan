const test = require("node:test");
const assert = require("node:assert/strict");

const {
  inferRequiredSkills,
  buildWorkerRoutingInput,
  parseRoutingDecisionResponse,
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

test("selectWorkerForTask can route to tool runtime worker using capability summaries", () => {
  const selected = selectWorkerForTask({
    taskDraft: {
      title: "Run code review against current changes",
      description: "Use codex review to inspect the diff and summarize findings",
    },
    workers: [
      {
        id: "pal-fix",
        roleText: "Apply code changes and small edits",
        enabledSkillIds: ["codex-file-edit"],
        skillSummaries: ["File Edit: apply patches"],
      },
      {
        id: "pal-codex",
        roleText: "CLI automation worker",
        enabledSkillIds: ["codex.command.review", "codex.command.exec"],
        skillSummaries: [
          "review: Run a code review non-interactively",
          "exec: Run Codex non-interactively",
        ],
      },
    ],
  });

  assert.equal(selected.workerId, "pal-codex");
  assert.ok(selected.matchedSkills.includes("codex.command.review"));
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

test("buildWorkerRoutingInput produces resident summaries for llm-assisted routing", () => {
  const routingInput = buildWorkerRoutingInput({
    targetType: "task",
    targetId: "plan:PLAN-001:task:1",
    planId: "PLAN-001",
    taskDraft: {
      title: "Trace save failure",
      description: "設定保存後に再読込で値が消える原因を調べる",
    },
    workers: [
      {
        id: "pal-alpha",
        displayName: "調べる人",
        roleText: "証拠と再現条件を集める",
        enabledSkillIds: ["codex-file-search"],
        skillSummaries: ["file search and repro evidence"],
      },
    ],
    assignmentCounts: new Map([["pal-alpha", 1]]),
  });

  assert.equal(routingInput.taskKind, "research");
  assert.equal(routingInput.planId, "PLAN-001");
  assert.equal(routingInput.candidateResidents.length, 1);
  assert.equal(routingInput.candidateResidents[0].residentId, "pal-alpha");
  assert.equal(routingInput.candidateResidents[0].currentLoad, 1);
});

test("parseRoutingDecisionResponse repairs wrapper text and validates candidate ids", () => {
  const parsed = parseRoutingDecisionResponse(
    '<|channel|>final\n```json\n{"selectedResidentId":"pal-alpha","reason":"best fit","confidence":"high","fallbackAction":"dispatch"}\n```',
    { allowedResidentIds: ["pal-alpha", "pal-beta"] }
  );

  assert.equal(parsed.ok, true);
  assert.equal(parsed.decision.selectedResidentId, "pal-alpha");
  assert.equal(parsed.decision.confidence, "high");
  assert.equal(parsed.decision.fallbackAction, "dispatch");
});
