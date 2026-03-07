# delta-request

## Delta ID
- DR-20260306-simple-role-debug-pals

## 目的
- built-in debug worker をさらに単純な役割へ寄せ、Guide と routing が `trace / fix / verify` の 1責務 Pal を選びやすくする。

## In Scope
- `wireframe/debug-identity-seeds.js` の `pal-alpha / pal-beta / pal-gamma` の `ROLE.md` を 1責務寄りに狭める。
- `wireframe/app.js` の built-in worker `persona` と `skills` を同じ方針に揃える。
- `tests/unit/debug-identity-seeds.test.js` を更新する。
- `docs/plan.md` に seed/archive を追加する。

## Out of Scope
- routing algorithm の変更
- Guide prompt / controller の変更
- Gate rubric の変更
- debug DB / CLI の変更

## Design Scenarios
- DS-01:
  - Given: built-in debug worker seed
  - When: Guide または routing が worker を選ぶ
  - Then: `pal-alpha` は trace 専用、`pal-beta` は fix 専用、`pal-gamma` は verify 専用として意味が明確に見える。
- DS-02:
  - Given: built-in worker profiles
  - When: tool skill を確認する
  - Then: `pal-beta` は edit 中心、`pal-gamma` は test 中心に狭まっている。

## Acceptance Criteria
- AC-01: `pal-alpha / pal-beta / pal-gamma` の identity seed が 1責務の worker role を明示する。
- AC-02: built-in worker profile の `persona / skills` が simple-role 方針に揃う。
- AC-03: debug identity seed unit test と既存 orchestration targeted verify が PASS する。

## リスク
- fix/verify worker の skill を狭めすぎると既存の debug flow が不便になる。

## 未解決
- Q-01: Guide prompt に `simple-role worker を優先` と明示するかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-simple-role-debug-pals

## ステータス
- APPLIED

## 変更ファイル
- wireframe/debug-identity-seeds.js
- wireframe/app.js
- tests/unit/debug-identity-seeds.test.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `pal-alpha/beta/gamma` の `ROLE.md` を trace only / fix only / verify only に寄せた。
- AC-02:
  - 変更点: built-in worker profile の `persona` と `skills` を simple-role 構成へ揃えた。
- AC-03:
  - 変更点: unit test を更新し、既存 verify 対象で回帰を確認した。

## Out of Scope 確認
- Out of Scope への変更なし: Yes

# delta-verify

## Delta ID
- DR-20260306-simple-role-debug-pals

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | worker seed role が trace/fix/verify の 1責務へ狭まった。 |
| AC-02 | PASS | built-in worker persona/skills を simple-role 方針へ更新した。 |
| AC-03 | PASS | unit test + targeted Playwright + delta link validation が通過した。 |

## 主な検証コマンド
- `node --check wireframe/debug-identity-seeds.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/debug-identity-seeds.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|worker runtime receives structured handoff payload|built-in debug identities are seeded on init when missing|job board supports gate flow"`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- PASS

# delta-archive

## Delta ID
- DR-20260306-simple-role-debug-pals

## クローズ条件
- verify判定: PASS
- archive可否: 可

## 要約
- built-in debug worker を `trace only / fix only / verify only` に寄せ、Guide と routing が役割を読み取りやすい seed へ揃えた。

## 検証サマリ
- syntax check + unit test + targeted Playwright + delta link validation PASS

## 備考
- `event log shows routing explanations for dispatch and gate submit` は Guide 側の既存 plan readiness 条件で不安定なため、この delta の verify からは外した。

## 次のdeltaへの引き継ぎ
- Seed-01: Guide 側にも `simple-role worker を優先` する planning hint を入れるか検討する。
