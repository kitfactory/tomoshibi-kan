const test = require("node:test");
const assert = require("node:assert/strict");

const { getBuiltInDebugIdentitySeed } = require("../../wireframe/debug-identity-seeds.js");

test("getBuiltInDebugIdentitySeed returns guide debug content in Japanese", () => {
  const seed = getBuiltInDebugIdentitySeed({
    id: "guide-core",
    role: "guide",
    skills: ["codex-file-search", "browser-chrome"],
  }, "ja");

  assert.ok(seed);
  assert.match(seed.soul, /証拠|対話/);
  assert.match(seed.role, /trace \/ fix \/ verify/);
  assert.deepEqual(seed.enabledSkillIds, ["codex-file-search", "browser-chrome"]);
});

test("getBuiltInDebugIdentitySeed returns gate rubric content in English", () => {
  const seed = getBuiltInDebugIdentitySeed({
    id: "gate-core",
    role: "gate",
    skills: [],
  }, "en");

  assert.ok(seed);
  assert.match(seed.soul, /evidence-oriented/);
  assert.equal(typeof seed.role, "undefined");
  assert.match(seed.rubric, /Decision Shape/);
});

test("getBuiltInDebugIdentitySeed returns simple-role worker seeds", () => {
  const trace = getBuiltInDebugIdentitySeed({ id: "pal-alpha", role: "worker", skills: [] }, "en");
  const fix = getBuiltInDebugIdentitySeed({ id: "pal-beta", role: "worker", skills: [] }, "en");
  const verify = getBuiltInDebugIdentitySeed({ id: "pal-gamma", role: "worker", skills: [] }, "en");

  assert.match(trace.role, /Trace Worker/);
  assert.match(trace.role, /Do trace work only/);
  assert.match(trace.role, /Do not edit files/);
  assert.match(fix.role, /Fix Worker/);
  assert.match(fix.role, /Do fix work only/);
  assert.match(fix.role, /Do not widen the task into broad tracing or final verification/);
  assert.match(verify.role, /Verify Worker/);
  assert.match(verify.role, /Do verification work only/);
  assert.match(verify.role, /Do not edit files/);
});

test("getBuiltInDebugIdentitySeed returns null for non built-in profile", () => {
  const seed = getBuiltInDebugIdentitySeed({ id: "pal-custom", role: "worker", skills: [] }, "ja");
  assert.equal(seed, null);
});
