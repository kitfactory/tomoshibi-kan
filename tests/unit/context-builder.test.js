const test = require("node:test");
const assert = require("node:assert/strict");

const { buildGuideContext, buildPalContext } = require("../../wireframe/context-builder.js");

test("buildGuideContext returns system/history/user messages within budget", () => {
  const result = buildGuideContext({
    latestUserText: "次のタスクを整理してください",
    sessionMessages: [
      { role: "user", content: "前提を確認したい" },
      { role: "assistant", content: "現在は2件が保留中です" },
    ],
    contextWindow: 4096,
    reservedOutput: 512,
    safetyMargin: 256,
    maxHistoryMessages: 8,
  });

  assert.equal(result.ok, true);
  assert.equal(Array.isArray(result.messages), true);
  assert.equal(result.messages[0].role, "system");
  assert.equal(result.messages[result.messages.length - 1].role, "user");
  assert.equal(result.audit.estimatedInputTokens <= result.audit.budget, true);
});

test("buildGuideContext drops old history when budget is tight", () => {
  const long = "a".repeat(1200);
  const result = buildGuideContext({
    latestUserText: "一番新しい発話を残してください",
    sessionMessages: [
      { role: "user", content: long },
      { role: "assistant", content: long },
      { role: "user", content: "直近の質問" },
      { role: "assistant", content: "直近の回答" },
    ],
    contextWindow: 1400,
    reservedOutput: 512,
    safetyMargin: 512,
    maxHistoryMessages: 10,
  });

  assert.equal(result.ok, true);
  assert.equal(result.audit.excluded.length > 0, true);
  assert.equal(result.audit.compaction.some((item) => item.startsWith("drop-history:")), true);
});

test("buildGuideContext returns error when latest user text is missing", () => {
  const result = buildGuideContext({
    latestUserText: "   ",
    sessionMessages: [],
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "MSG-PPH-1001");
  assert.equal(result.messages.length, 0);
});

test("buildPalContext injects skill summaries only for model runtime", () => {
  const modelResult = buildPalContext({
    role: "worker",
    runtimeKind: "model",
    latestUserText: "タスクを実行してください",
    sessionMessages: [],
    skillSummaries: ["file-search", "file-edit"],
  });
  assert.equal(modelResult.ok, true);
  assert.equal(
    modelResult.messages.some(
      (message) => message.role === "developer" && message.content.includes("Enabled Skills")
    ),
    true
  );

  const toolResult = buildPalContext({
    role: "worker",
    runtimeKind: "tool",
    latestUserText: "タスクを実行してください",
    sessionMessages: [],
    skillSummaries: ["file-search", "file-edit"],
  });
  assert.equal(toolResult.ok, true);
  assert.equal(
    toolResult.messages.some((message) => message.role === "developer"),
    false
  );
  assert.equal(
    toolResult.audit.compaction.includes("skip-skill-context:tool-runtime"),
    true
  );
});

test("buildPalContext composes LANGUAGE, SOUL, ROLE and RUBRIC into system prompt", () => {
  const workerResult = buildPalContext({
    role: "worker",
    runtimeKind: "model",
    locale: "ja",
    latestUserText: "タスクを実行してください",
    sessionMessages: [],
    soulText: "落ち着いて検証する",
    roleText: "実行結果は簡潔に報告する",
  });
  assert.equal(workerResult.ok, true);
  assert.match(workerResult.messages[0].content, /\[LANGUAGE\]/);
  assert.match(workerResult.messages[0].content, /日本語で回答/);
  assert.match(workerResult.messages[0].content, /Worker Pal/);
  assert.match(workerResult.messages[0].content, /\[SOUL\]/);
  assert.match(workerResult.messages[0].content, /\[ROLE\]/);

  const gateResult = buildPalContext({
    role: "gate",
    runtimeKind: "model",
    locale: "en",
    latestUserText: "Review the submission",
    sessionMessages: [],
    rubricText: "Reject when evidence is missing.",
  });
  assert.equal(gateResult.ok, true);
  assert.match(gateResult.messages[0].content, /answer in English/);
  assert.match(gateResult.messages[0].content, /decision`, `reason`, and `fixes`/);
  assert.match(gateResult.messages[0].content, /\[RUBRIC\]/);
});

test("buildGuideContext uses planning-oriented Guide operating rules in Japanese", () => {
  const result = buildGuideContext({
    locale: "ja",
    latestUserText: "新しい計画を考えて",
    sessionMessages: [],
  });
  assert.equal(result.ok, true);
  assert.match(result.messages[0].content, /仕事の依頼へ進もうとしているかどうか/);
  assert.match(result.messages[0].content, /work intent/);
  assert.match(result.messages[0].content, /これまでの会話からあり得そうな案件を具体化した 3 つの選択肢を、可能性の高い順に提示/);
  assert.match(result.messages[0].content, /何に着目した案かを短く明示/);
  assert.match(result.messages[0].content, /最も妥当な候補を 1 つ推薦/);
  assert.match(result.messages[0].content, /なぜそれを先に見るのかを一言/);
  assert.match(result.messages[0].content, /最終依頼案を短く提示/);
  assert.match(result.messages[0].content, /誰に何を頼む形になるか/);
  assert.match(result.messages[0].content, /`まとめてほしい` のように、ユーザーへ逆に依頼しない/);
  assert.match(result.messages[0].content, /この形で進めてよければ依頼にします/);
  assert.match(result.messages[0].content, /1でよいですか？/);
  assert.match(result.messages[0].content, /追加の最終確認に戻らず status=plan_ready/);
  assert.match(result.messages[0].content, /明示的な breakdown 要求と主要材料が揃っている時は plan 作成を優先/);
  assert.match(result.messages[0].content, /冬坂 \/ 久瀬 \/ 白峰 の3段/);
  assert.match(result.messages[0].content, /担当 Pal をユーザーへ聞き返さず自分で選ぶ/);
});

test("buildGuideContext uses planning-oriented Guide operating rules in English", () => {
  const result = buildGuideContext({
    locale: "en",
    latestUserText: "Break this into trace, fix, and verify tasks.",
    sessionMessages: [],
  });
  assert.equal(result.ok, true);
  assert.match(result.messages[0].content, /moving toward a work request/);
  assert.match(result.messages[0].content, /Fuyusaka \/ Kuze \/ Shiramine split/);
  assert.match(result.messages[0].content, /propose three concrete likely work options grounded in the conversation so far, ordered by likelihood/);
  assert.match(result.messages[0].content, /Make each option explicit about its angle/);
  assert.match(result.messages[0].content, /recommend the most plausible one/);
  assert.match(result.messages[0].content, /add one short reason/);
  assert.match(result.messages[0].content, /propose the final request shape yourself/);
  assert.match(result.messages[0].content, /what kind of request this will become/);
  assert.match(result.messages[0].content, /Do not ask the user to summarize it for you/);
  assert.match(result.messages[0].content, /If that works, I will turn it into a request/);
  assert.match(result.messages[0].content, /return status=plan_ready instead of asking for one more final confirmation/);
  assert.match(result.messages[0].content, /When the breakdown request is explicit and the main inputs are present, prefer producing the plan/);
  assert.match(result.messages[0].content, /Shall we go with 1\?/);
  assert.match(result.messages[0].content, /one blocking fact prevents task creation/);
});
