const test = require("node:test");
const assert = require("node:assert/strict");

const {
  inferRequiredSkills,
  buildResidentRoleSignals,
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
        roleText: "# ROLE\n\n## 得意な依頼\n- 再現手順を固めたい依頼\n- 原因候補と証拠を集めたい依頼\n\n## 得意な作成物\n- 再現手順メモ\n- 証拠 summary",
        enabledSkillIds: ["codex-file-search"],
        skillSummaries: ["file search and repro evidence"],
      },
    ],
    assignmentCounts: new Map([["pal-alpha", 1]]),
  });

  assert.equal(routingInput.planId, "PLAN-001");
  assert.equal(routingInput.candidateResidents.length, 1);
  assert.equal(routingInput.candidateResidents[0].residentId, "pal-alpha");
  assert.match(routingInput.candidateResidents[0].roleContractText, /得意な依頼/);
  assert.deepEqual(routingInput.candidateResidents[0].residentFocus, ["再現手順を固めたい依頼", "原因候補と証拠を集めたい依頼"]);
  assert.deepEqual(routingInput.candidateResidents[0].preferredOutputs, ["再現手順メモ", "証拠 summary"]);
  assert.equal(routingInput.candidateResidents[0].currentLoad, 1);
});

test("buildResidentRoleSignals extracts resident focus and preferred outputs from ROLE", () => {
  const signals = buildResidentRoleSignals({
    roleText: "# ROLE\n\n## 得意な依頼\n- 再現手順を固めたい依頼\n- 原因候補と証拠を集めたい依頼\n\n## 得意な作成物\n- 再現手順メモ\n- 証拠 summary",
  });

  assert.deepEqual(signals.residentFocus, ["再現手順を固めたい依頼", "原因候補と証拠を集めたい依頼"]);
  assert.deepEqual(signals.preferredOutputs, ["再現手順メモ", "証拠 summary"]);
});

test("selectWorkerForTask prefers resident role focus before generic lexical match", () => {
  const workers = [
    {
      id: "pal-alpha",
      displayName: "調べる人",
      roleText: "# ROLE\n\n## 得意な依頼\n- 再現手順を固めたい依頼\n- 原因候補と証拠を集めたい依頼\n\n## 得意な作成物\n- 再現手順メモ\n- 証拠 summary",
      enabledSkillIds: ["codex-file-search"],
      skillSummaries: ["trace files and gather evidence"],
    },
    {
      id: "pal-beta",
      displayName: "作り手",
      roleText: "# ROLE\n\n## 得意な依頼\n- 最小修正で前へ進めたい依頼\n- patch や試作で形を作りたい依頼\n\n## 得意な作成物\n- 最小 patch\n- 変更ファイル一覧",
      enabledSkillIds: ["codex-file-edit"],
      skillSummaries: ["apply patches and implement changes"],
    },
    {
      id: "pal-delta",
      displayName: "書く人",
      roleText: "# ROLE\n\n## 得意な依頼\n- 話が混線していて整理したい依頼\n- 返却文や説明文を整えたい依頼\n\n## 得意な作成物\n- 要約\n- 返却文",
      enabledSkillIds: ["codex-file-read"],
      skillSummaries: ["write summaries and shape explanations"],
    },
  ];

  const research = selectWorkerForTask({
    taskDraft: {
      title: "再現確認",
      description: "保存不具合の原因候補と証拠を集めて、再現手順メモを残したい",
    },
    workers,
  });
  assert.equal(research.workerId, "pal-alpha");
  assert.ok(research.matchedResidentFocus.includes("証拠"));
  assert.ok(research.matchedPreferredOutputs.includes("再現手順メモ"));

  const make = selectWorkerForTask({
    taskDraft: {
      title: "修正実装",
      description: "保存処理を最小修正で前へ進めたい。変更ファイル一覧も残す",
    },
    workers,
  });
  assert.equal(make.workerId, "pal-beta");
  assert.ok(make.matchedResidentFocus.includes("最小修正"));
  assert.ok(make.matchedRoleTerms.includes("進め"));

  const write = selectWorkerForTask({
    taskDraft: {
      title: "返却文整理",
      description: "返却文と要約を整えて、話の混線をほどきたい",
    },
    workers,
  });
  assert.equal(write.workerId, "pal-delta");
  assert.ok(write.matchedResidentFocus.includes("返却文"));
  assert.ok(write.matchedPreferredOutputs.includes("返却文"));
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
