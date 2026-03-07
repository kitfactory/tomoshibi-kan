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
  assert.match(seed.soul, /Guide/);
  assert.match(seed.role, /管理人 Guide|管理人/);
  assert.match(seed.role, /trace \/ fix \/ verify/);
  assert.match(seed.role, /debug work|debug work へ橋渡し/);
  assert.deepEqual(seed.enabledSkillIds, ["codex-file-search", "browser-chrome"]);
});

test("getBuiltInDebugIdentitySeed returns gate rubric content in English", () => {
  const seed = getBuiltInDebugIdentitySeed({
    id: "gate-core",
    role: "gate",
    skills: [],
  }, "en");

  assert.ok(seed);
  assert.match(seed.soul, /senior resident|evidence-oriented/);
  assert.equal(typeof seed.role, "undefined");
  assert.match(seed.rubric, /Decision Shape/);
});

test("getBuiltInDebugIdentitySeed returns resident worker seeds", () => {
  const researcher = getBuiltInDebugIdentitySeed({ id: "pal-alpha", role: "worker", skills: [] }, "en");
  const maker = getBuiltInDebugIdentitySeed({ id: "pal-beta", role: "worker", skills: [] }, "en");
  const arranger = getBuiltInDebugIdentitySeed({ id: "pal-gamma", role: "worker", skills: [] }, "en");
  const writer = getBuiltInDebugIdentitySeed({ id: "pal-delta", role: "worker", skills: [] }, "en");

  assert.match(researcher.role, /researcher resident/);
  assert.match(researcher.role, /trace \/ research work first/);
  assert.match(researcher.role, /Do not edit files/);
  assert.match(maker.role, /maker resident/);
  assert.match(maker.role, /make \/ fix work first/);
  assert.match(maker.role, /Prefer simple fixes over broad refactors/);
  assert.match(arranger.role, /arranger resident/);
  assert.match(arranger.role, /verify \/ adjust work first/);
  assert.match(arranger.role, /Do not edit files/);
  assert.match(writer.role, /writer resident/);
  assert.match(writer.role, /writing \/ naming \/ summary work first/);
  assert.match(writer.role, /Do not widen the task into implementation or gate judgment/);
});

test("getBuiltInDebugIdentitySeed returns null for non built-in profile", () => {
  const seed = getBuiltInDebugIdentitySeed({ id: "pal-custom", role: "worker", skills: [] }, "ja");
  assert.equal(seed, null);
});
