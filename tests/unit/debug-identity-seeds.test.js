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
  assert.match(seed.soul, /そうでしたか|急がなくて大丈夫ですよ|やわらかく受け止めます/);
  assert.match(seed.soul, /参照URLを並べ立てず/);
  assert.match(seed.role, /管理人 Guide|管理人/);
  assert.match(seed.role, /trace \/ fix \/ verify/);
  assert.match(seed.role, /debug work|debug work へ橋渡し/);
  assert.match(seed.role, /Progress Voice|Progress Note Triggers/);
  assert.match(seed.role, /Hand-off Rules/);
  assert.deepEqual(seed.enabledSkillIds, ["codex-file-search", "browser-chrome"]);
});

test("getBuiltInDebugIdentitySeed returns gate rubric content in Japanese", () => {
  const seed = getBuiltInDebugIdentitySeed({
    id: "gate-core",
    role: "gate",
    skills: [],
  }, "ja");

  assert.ok(seed);
  assert.match(seed.soul, /古参住人|悪くないと思うなぁ|本筋はたぶんそこじゃない/);
  assert.equal(typeof seed.role, "undefined");
  assert.match(seed.rubric, /Review Goal/);
  assert.match(seed.rubric, /Progress Voice/);
  assert.match(seed.rubric, /Progress Note Triggers/);
});

test("getBuiltInDebugIdentitySeed returns resident worker seeds", () => {
  const researcher = getBuiltInDebugIdentitySeed({ id: "pal-alpha", role: "worker", skills: [] }, "ja");
  const maker = getBuiltInDebugIdentitySeed({ id: "pal-beta", role: "worker", skills: [] }, "ja");
  const writer = getBuiltInDebugIdentitySeed({ id: "pal-delta", role: "worker", skills: [] }, "ja");

  assert.match(researcher.soul, /そこは違うと思います|かなり引っかかります/);
  assert.match(researcher.role, /リサーチャーとして/);
  assert.match(researcher.role, /file を編集しない/);
  assert.match(researcher.role, /得意な依頼/);
  assert.match(researcher.role, /得意な作成物/);
  assert.match(researcher.role, /Progress Voice/);
  assert.match(researcher.role, /Progress Note Triggers/);
  assert.match(maker.soul, /たぶん、いけます|ちょっと触ってみます/);
  assert.match(maker.role, /プログラマとして/);
  assert.match(maker.role, /simple fix/);
  assert.match(maker.role, /得意な依頼/);
  assert.match(maker.role, /得意な作成物/);
  assert.match(maker.role, /Hand-off Rules/);
  assert.match(writer.soul, /いったん、こう整理できます|言い換えると/);
  assert.match(writer.role, /ライターとして/);
  assert.match(writer.role, /Gate judgment/);
  assert.match(writer.role, /得意な依頼/);
  assert.match(writer.role, /得意な作成物/);
  assert.match(writer.role, /Progress Voice/);
});

test("getBuiltInDebugIdentitySeed returns null for non built-in profile", () => {
  const seed = getBuiltInDebugIdentitySeed({ id: "pal-custom", role: "worker", skills: [] }, "ja");
  assert.equal(seed, null);
});
