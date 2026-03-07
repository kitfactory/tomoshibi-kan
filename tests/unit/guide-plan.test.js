const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseGuidePlanResponse,
  buildGuidePlanOutputInstruction,
  buildGuidePlanResponseFormat,
  buildGuidePlanFewShotExamples,
} = require("../../wireframe/guide-plan.js");

test("parseGuidePlanResponse accepts conversation without plan", () => {
  const parsed = parseGuidePlanResponse(JSON.stringify({
    status: "conversation",
    reply: "まだタスク化しません。まず状況を聞かせてください。",
    plan: null,
  }));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, "conversation");
  assert.equal(parsed.reply, "まだタスク化しません。まず状況を聞かせてください。");
  assert.equal(parsed.plan, null);
});

test("parseGuidePlanResponse accepts needs_clarification without plan", () => {
  const parsed = parseGuidePlanResponse(JSON.stringify({
    status: "needs_clarification",
    reply: "再現手順と期待結果を教えてください。",
    plan: null,
  }));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, "needs_clarification");
  assert.equal(parsed.reply, "再現手順と期待結果を教えてください。");
  assert.equal(parsed.plan, null);
});

test("parseGuidePlanResponse normalizes valid plan_ready payload", () => {
  const parsed = parseGuidePlanResponse(JSON.stringify({
    status: "plan_ready",
    reply: "計画を作成しました。",
    plan: {
      goal: "設定画面の保存不具合を調査する",
      completionDefinition: "原因と確認方法がそろう",
      constraints: ["既存設定は壊さない"],
      tasks: [
        {
          title: "Trace",
          description: "保存処理の流れを追跡する",
          expectedOutput: "trace result",
          requiredSkills: ["browser-chrome", "codex-file-search"],
          reviewFocus: ["repro", "traceability"],
        },
      ],
    },
  }));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, "plan_ready");
  assert.equal(parsed.plan.goal, "設定画面の保存不具合を調査する");
  assert.deepEqual(parsed.plan.tasks[0].requiredSkills, ["browser-chrome", "codex-file-search"]);
});

test("parseGuidePlanResponse recovers empty reply for valid plan_ready payload", () => {
  const parsed = parseGuidePlanResponse(JSON.stringify({
    status: "plan_ready",
    reply: "",
    plan: {
      goal: "設定画面の保存不具合を調査する",
      completionDefinition: "原因と確認方法がそろう",
      constraints: ["既存設定は壊さない"],
      tasks: [
        {
          title: "Trace",
          description: "保存処理の流れを追跡する",
          expectedOutput: "trace result",
          requiredSkills: ["browser-chrome", "codex-file-search"],
          reviewFocus: ["repro", "traceability"],
        },
      ],
    },
  }));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, "plan_ready");
  assert.match(parsed.reply, /Trace|計画/);
});

test("parseGuidePlanResponse accepts wrapper-token plan_ready payload", () => {
  const parsed = parseGuidePlanResponse(`
<|channel|>final
<|constrain|>JSON
<|message|>
{
  "status": "plan_ready",
  "reply": "計画を作成しました。",
  "plan": {
    "goal": "Settings 保存不具合を調査する",
    "completionDefinition": "再現・原因・確認方法がそろう",
    "constraints": ["既存設定を壊さない"],
    "tasks": [
      {
        "title": "Trace",
        "description": "保存処理を追跡する",
        "expectedOutput": "trace result",
        "requiredSkills": ["browser-chrome", "codex-file-search"],
        "reviewFocus": ["repro", "traceability"]
      }
    ]
  }
}`);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, "plan_ready");
  assert.equal(parsed.plan.tasks.length, 1);
});

test("parseGuidePlanResponse repairs light damaged JSON in plan_ready payload", () => {
  const parsed = parseGuidePlanResponse(`
<|channel|>final <|constrain|>JSON<|message|>
{
  "status": "plan_ready",
  "reply": "計画を作成しました。",
  "plan": {
    "goal": "Settings 保存不具合を調査する",
    "completionDefinition": "再現・原因・確認方法がそろう",
    "constraints": ["既存設定を壊さない",],
    "tasks": [
      "{"title":"Trace","description":"保存処理を追跡する","expectedOutput":"trace result","requiredSkills":["browser-chrome"],"reviewFocus":["repro"]}"
    ]
  }
}`);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, "plan_ready");
  assert.equal(parsed.plan.tasks.length, 1);
  assert.equal(parsed.plan.tasks[0].title, "Trace");
});

test("parseGuidePlanResponse recovers trace fix verify tasks from malformed debug breakdown", () => {
  const parsed = parseGuidePlanResponse(`{
    "status":"plan_ready",
    "reply":"以下のように3段階で対処します。1. trace：設定保存時のフローを追跡 2. fix：永続化ロジックを修正 3. verify：再度手順で動作確認 各タスクは別々に割り当てます。",
    "plan":{
      "goal":"Settings save を直す",
      "completionDefinition":"reload 後も model が残る",
      "constraints":["既存設定フローは壊さない"],
      "tasks":[
        {
          "title":"Task 1: 開始…",
          "description":"...??…...……….",
          "expectedOutput":"………..",
          "requiredSkills":["….……………"],
          "reviewFocus":["]"],
          "assigneePalId":"..."
        }
      ]
    }
  }`);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, "plan_ready");
  assert.equal(parsed.plan.tasks.length, 3);
  assert.deepEqual(
    parsed.plan.tasks.map((task) => task.title),
    ["Trace", "Fix", "Verify"]
  );
  assert.deepEqual(parsed.plan.tasks[0].requiredSkills, ["browser-chrome", "codex-file-search", "codex-file-read"]);
});

test("parseGuidePlanResponse recovers debug tasks from controller intent context even when reply is short", () => {
  const parsed = parseGuidePlanResponse(`{
    "status":"plan_ready",
    "reply":"以下のように3つのタスクを作成します。",
    "plan":{
      "goal":"Settings save を直す",
      "completionDefinition":"reload 後も model が残る",
      "constraints":["既存設定画面を壊さない"],
      "tasks":[
        {
          "title":"Trace (1) 設定保存機能を簡単・直線…",
          "description":"...??.....",
          "expectedOutput":"....",
          "requiredSkills":["...."],
          "reviewFocus":["...."],
          "assigneePalId":"..."
        }
      ]
    }
  }`, {
    planningIntent: "explicit_breakdown",
    planningReadiness: "debug_repro_ready",
  });
  assert.equal(parsed.ok, true);
  assert.equal(parsed.status, "plan_ready");
  assert.deepEqual(
    parsed.plan.tasks.map((task) => task.title),
    ["Trace", "Fix", "Verify"]
  );
});

test("parseGuidePlanResponse rejects invalid plan_ready payload", () => {
  const parsed = parseGuidePlanResponse(JSON.stringify({
    status: "plan_ready",
    reply: "計画です。",
    plan: {
      goal: "",
      tasks: [],
    },
  }));
  assert.equal(parsed.ok, false);
  assert.equal(parsed.error, "plan_invalid");
});

test("parseGuidePlanResponse keeps unrecoverable payload invalid", () => {
  const parsed = parseGuidePlanResponse(`
<|channel|>final <|constrain|>JSON<|message|>
{
  "status": "plan_ready",
  "reply": "計画を作成しました。",
  "plan": {
    "goal": "broken"
`);
  assert.equal(parsed.ok, false);
  assert.match(parsed.error, /json_(not_found|parse_failed)/);
});

test("buildGuidePlanOutputInstruction explains compact JSON contract", () => {
  const instruction = buildGuidePlanOutputInstruction("en");
  assert.match(instruction, /Return compact JSON only/);
  assert.match(instruction, /conversation\|needs_clarification\|plan_ready/);
  assert.match(instruction, /Use only the status values defined in the schema/);
  assert.match(instruction, /Do not add extra keys/);
  assert.doesNotMatch(instruction, /prefer status=plan_ready/);
  assert.doesNotMatch(instruction, /reasonable assumptions/);
  assert.doesNotMatch(instruction, /Trace Worker/);
});

test("buildGuidePlanResponseFormat returns json_schema contract", () => {
  const responseFormat = buildGuidePlanResponseFormat();
  assert.equal(responseFormat.type, "json_schema");
  assert.equal(responseFormat.json_schema.name, "guide_plan_response");
  assert.equal(responseFormat.json_schema.strict, true);
});

test("buildGuidePlanFewShotExamples includes recommendation and short closing examples", () => {
  const prompt = buildGuidePlanFewShotExamples("ja");
  assert.match(prompt, /Guide の振る舞い例/);
  assert.match(prompt, /まずありそうなのは次の3案/);
  assert.match(prompt, /最も可能性が高い/);
  assert.match(prompt, /でよいですか/);
  assert.match(prompt, /Trace/);
  assert.match(prompt, /Fix/);
  assert.match(prompt, /Verify/);
});
