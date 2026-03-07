const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildTaskDraftsFromRequest,
  assignTasksToWorkers,
  scoreWorkerForTask,
} = require("../../wireframe/guide-task-planner.js");

test("buildTaskDraftsFromRequest returns default 3-phase drafts for single sentence input", () => {
  const drafts = buildTaskDraftsFromRequest({
    userText: "設定画面にモデルの追加と保存機能を実装してください",
  });
  assert.equal(drafts.length, 3);
  assert.match(drafts[0].title, /要件整理/);
  assert.match(drafts[1].title, /実装/);
  assert.match(drafts[2].title, /検証/);
});

test("buildTaskDraftsFromRequest uses multi-line segments when provided", () => {
  const drafts = buildTaskDraftsFromRequest({
    userText: "要件を整理する\nUIを実装する\nテストを追加する",
    maxTasks: 3,
  });
  assert.equal(drafts.length, 3);
  assert.equal(drafts[0].title, "要件を整理する");
  assert.equal(drafts[1].title, "UIを実装する");
  assert.equal(drafts[2].title, "テストを追加する");
});

test("scoreWorkerForTask increases when role/skill text matches task text", () => {
  const task = {
    title: "テストの追加",
    description: "テスト不足を解消して検証する",
  };
  const low = scoreWorkerForTask(task, {
    id: "pal-a",
    roleText: "実装担当",
    skillSummaries: ["File Edit: apply patches"],
    displayName: "Pal A",
    persona: "Builder",
  });
  const high = scoreWorkerForTask(task, {
    id: "pal-b",
    roleText: "検証とテスト担当",
    skillSummaries: ["Test Runner: execute tests"],
    displayName: "Pal B",
    persona: "Reviewer",
  });
  assert.equal(high > low, true);
});

test("assignTasksToWorkers picks matching workers by role/skill text", () => {
  const taskDrafts = [
    { title: "要件整理", description: "要件を整理して設計する" },
    { title: "実装", description: "コードを編集して機能を実装する" },
    { title: "検証", description: "テストを実行して結果を検証する" },
  ];
  const workers = [
    {
      id: "pal-analyst",
      roleText: "要件整理と設計を担当",
      skillSummaries: ["File Search: Search files"],
      displayName: "Analyst",
      persona: "Analyst",
    },
    {
      id: "pal-builder",
      roleText: "実装と編集を担当",
      skillSummaries: ["File Edit: Apply patches"],
      displayName: "Builder",
      persona: "Builder",
    },
    {
      id: "pal-reviewer",
      roleText: "検証と品質確認を担当",
      skillSummaries: ["Test Runner: Execute tests"],
      displayName: "Reviewer",
      persona: "Reviewer",
    },
  ];
  const assigned = assignTasksToWorkers({ taskDrafts, workers });
  assert.equal(assigned.length, 3);
  assert.equal(assigned[0].workerId, "pal-analyst");
  assert.equal(assigned[1].workerId, "pal-builder");
  assert.equal(assigned[2].workerId, "pal-reviewer");
});
