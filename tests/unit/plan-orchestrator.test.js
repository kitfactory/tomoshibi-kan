const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadPlanOrchestrator() {
  const filePath = path.join(__dirname, "../../wireframe/plan-orchestrator.js");
  const source = fs.readFileSync(filePath, "utf8");
  const sandbox = {
    window: {},
  };
  vm.runInNewContext(source, sandbox, { filename: "plan-orchestrator.js" });
  return sandbox.window.PlanOrchestrator;
}

test("PlanOrchestrator materializes approved plan artifact into routed tasks", async () => {
  const api = loadPlanOrchestrator();
  const result = await api.materializePlanArtifact({
    artifact: {
      planId: "PLAN-ART-001",
      status: "approved",
      plan: {
        tasks: [
          {
            title: "Trace",
            description: "再現手順を整理する",
            requiredSkills: ["codex-file-search"],
          },
          {
            title: "Fix",
            description: "保存処理を修正する",
            requiredSkills: ["codex-file-edit"],
          },
        ],
      },
    },
    workers: [
      { id: "pal-alpha" },
      { id: "pal-beta" },
    ],
    nextSequence: 4,
    routingApi: {
      selectWorkerForTask({ taskDraft }) {
        return taskDraft.title === "Trace"
          ? { workerId: "pal-alpha", matchedSkills: ["codex-file-search"], matchedRoleTerms: ["trace"] }
          : { workerId: "pal-beta", matchedSkills: ["codex-file-edit"], matchedRoleTerms: ["fix"] };
      },
    },
    buildTaskRecord(input) {
      return {
        id: input.id,
        planId: input.planId,
        title: input.title,
        description: input.description,
        palId: input.palId,
      };
    },
  });

  assert.equal(result.createdTasks.length, 2);
  assert.equal(result.createdTasks[0].task.id, "TASK-004");
  assert.equal(result.createdTasks[0].task.planId, "PLAN-ART-001");
  assert.equal(result.createdTasks[0].workerId, "pal-alpha");
  assert.equal(result.createdTasks[1].task.id, "TASK-005");
  assert.equal(result.createdTasks[1].workerId, "pal-beta");
  assert.equal(result.nextSequence, 6);
});

test("PlanOrchestrator prefers guide-driven routing when available and falls back otherwise", async () => {
  const api = loadPlanOrchestrator();
  const result = await api.materializePlanArtifact({
    artifact: {
      planId: "PLAN-ART-002",
      status: "approved",
      plan: {
        tasks: [
          {
            title: "Trace",
            description: "保存失敗の再現条件を調べる",
          },
        ],
      },
    },
    workers: [
      { id: "pal-alpha" },
      { id: "pal-beta" },
    ],
    nextSequence: 1,
    routingApi: {
      async selectWorkerForTaskWithGuideDecision() {
        return {
          workerId: "pal-beta",
          decisionSource: "guide_routing",
          decisionReason: "Role and capability fit",
          decisionConfidence: "high",
          fallbackAction: "dispatch",
        };
      },
      selectWorkerForTask() {
        return {
          workerId: "pal-alpha",
          matchedSkills: [],
          matchedRoleTerms: ["trace"],
        };
      },
    },
    buildTaskRecord(input) {
      return {
        id: input.id,
        planId: input.planId,
        title: input.title,
        description: input.description,
        palId: input.palId,
      };
    },
  });

  assert.equal(result.createdTasks.length, 1);
  assert.equal(result.createdTasks[0].workerId, "pal-beta");
  assert.equal(result.createdTasks[0].explanation.decisionSource, "guide_routing");
  assert.equal(result.createdTasks[0].explanation.decisionConfidence, "high");
});
