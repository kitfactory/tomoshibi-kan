const test = require("node:test");
const assert = require("node:assert/strict");

const { getBuiltInDebugIdentitySeed } = require("../../wireframe/debug-identity-seeds.js");

function loadResidentSeed(id, role, locale = "ja") {
  const seed = getBuiltInDebugIdentitySeed({ id, role, skills: [] }, locale);
  assert.ok(seed, `seed must exist for ${id}`);
  return seed;
}

test("管理人 microtest: planning と progress 返答の契約がある", () => {
  const seed = loadResidentSeed("guide-core", "guide");
  assert.match(seed.soul, /管理人/);
  assert.match(seed.soul, /安心して話せる|急かさず/);
  assert.match(seed.role, /## Inputs/);
  assert.match(seed.role, /## Outputs/);
  assert.match(seed.role, /plan_ready/);
  assert.match(seed.role, /Progress Voice/);
  assert.match(seed.role, /進捗確認/);
  assert.match(seed.role, /Progress Note Triggers/);
  assert.match(seed.role, /依頼を受け止めた時/);
});

test("古参 microtest: 判定と再計画要求の契約がある", () => {
  const seed = loadResidentSeed("gate-core", "gate");
  assert.match(seed.soul, /古参/);
  assert.match(seed.soul, /悪くないと思うなぁ|本筋はたぶんそこじゃない/);
  assert.match(seed.rubric, /decision: approved または rejected/);
  assert.match(seed.rubric, /replan/);
  assert.match(seed.rubric, /Progress Voice/);
  assert.match(seed.rubric, /Progress Note Triggers/);
  assert.match(seed.rubric, /reject を返す時|replan が必要/);
});

test("調べる人 microtest: 観測優先で fix しない契約がある", () => {
  const seed = loadResidentSeed("pal-alpha", "worker");
  assert.match(seed.soul, /引っかかります|そこは違うと思います/);
  assert.match(seed.role, /trace \/ research/);
  assert.match(seed.role, /何を観測し/);
  assert.match(seed.role, /file を編集しない/);
  assert.match(seed.role, /Hand-off Rules/);
  assert.match(seed.role, /再現手順、証拠、原因候補/);
  assert.match(seed.role, /Progress Note Triggers/);
  assert.match(seed.role, /再現に成功した時/);
});

test("作り手 microtest: 小さく作って scope を守る契約がある", () => {
  const seed = loadResidentSeed("pal-beta", "worker");
  assert.match(seed.soul, /たぶん、いけます|ちょっと触ってみます/);
  assert.match(seed.role, /make \/ fix/);
  assert.match(seed.role, /最小の patch/);
  assert.match(seed.role, /scope 内/);
  assert.match(seed.role, /Hand-off Rules/);
  assert.match(seed.role, /changed files|残リスク|verification/);
  assert.match(seed.role, /Progress Voice/);
  assert.match(seed.role, /何を触ったか/);
});

test("書く人 microtest: 言葉の交通整理と返却文の契約がある", () => {
  const seed = loadResidentSeed("pal-delta", "worker");
  assert.match(seed.soul, /いったん、こう整理できます|言い換えると/);
  assert.match(seed.role, /writing \/ naming \/ summary/);
  assert.match(seed.role, /concise summary、document draft、label、clarifying note/);
  assert.match(seed.role, /意図が損なわれず/);
  assert.match(seed.role, /Hand-off Rules/);
  assert.match(seed.role, /来訪者にそのまま返せる/);
  assert.match(seed.role, /Progress Voice/);
  assert.match(seed.role, /交通整理/);
});

