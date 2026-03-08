const test = require("node:test");
const assert = require("node:assert/strict");

const {
  detectPlanningIntent,
  buildPlanningIntentAssistPrompt,
  detectPlanningReadiness,
  buildPlanningReadinessAssistPrompt,
} = require("../../wireframe/guide-planning-intent.js");

test("detectPlanningIntent returns explicit breakdown for trace fix verify request", () => {
  const intent = detectPlanningIntent("trace / fix / verify の Task に分けて進めたい");
  assert.equal(intent.requested, true);
  assert.equal(intent.cue, "explicit_breakdown");
});

test("detectPlanningIntent returns explicit breakdown for resident breakdown request", () => {
  const intent = detectPlanningIntent("調べる人 / 作り手 / 書く人 に分けて進めたい");
  assert.equal(intent.requested, true);
  assert.equal(intent.cue, "explicit_breakdown");
});

test("detectPlanningIntent returns none for casual conversation", () => {
  const intent = detectPlanningIntent("最近このアプリの使い心地どう思う？");
  assert.equal(intent.requested, false);
  assert.equal(intent.cue, "none");
});

test("buildPlanningIntentAssistPrompt adds non-conversation guidance", () => {
  const prompt = buildPlanningIntentAssistPrompt("en", {
    requested: true,
    cue: "explicit_breakdown",
  });
  assert.match(prompt, /explicit planning trigger/);
  assert.match(prompt, /Do not stay in status=conversation/);
  assert.match(prompt, /prefer status=plan_ready/);
});

test("detectPlanningReadiness returns debug_repro_ready for explicit breakdown with repro and expected result", () => {
  const readiness = detectPlanningReadiness(
    "Settings tab save button is clickable but model does not persist. Repro steps: open Settings, add model, press Save, reload. Expected result: model remains after reload. trace / fix / verify tasks please.",
    { requested: true, cue: "explicit_breakdown" }
  );
  assert.equal(readiness.ready, true);
  assert.equal(readiness.cue, "debug_repro_ready");
});

test("buildPlanningReadinessAssistPrompt pushes plan_ready for ready repro input", () => {
  const prompt = buildPlanningReadinessAssistPrompt("en", {
    ready: true,
    cue: "debug_repro_ready",
  });
  assert.match(prompt, /target area, reproducible steps, and an expected result/);
  assert.match(prompt, /Do not stay in status=needs_clarification/);
  assert.match(prompt, /produce exactly three tasks for the Research Resident, Maker Resident, and Writer Resident/);
});
