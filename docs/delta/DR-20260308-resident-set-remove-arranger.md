# delta-request

## Delta ID
- DR-20260308-resident-set-remove-arranger

## 目的
- `整える人` を `docs/tomoshibikan_resident_set_v0_1.md` と built-in 初期住人セットから外し、初期住人を 5 人構成へ揃える。
- Settings の built-in 同期実行時に、legacy built-in の `pal-gamma` が current workspace に残り続けないようにする。

## 変更対象（In Scope）
- `docs/tomoshibikan_resident_set_v0_1.md`
- `wireframe/app.js` の built-in 初期住人セット / snapshot 正規化 / built-in 同期
- `wireframe/debug-identity-seeds.js`
- `wireframe/guide-planning-intent.js`
- `tests/unit/debug-identity-seeds.test.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` / delta の最小同期

## 非対象（Out of Scope）
- resident set 全体の再構成
- `書く人` の ROLE 再設計
- routing 精度の本格改善
- Guide / Orchestrator ロジックの全面見直し

## 受入条件（Acceptance Criteria）
- AC-01: resident set 文書から `整える人` が除外され、住人一覧が 5 人構成になっている。
- AC-02: built-in 初期住人セットが `guide-core / gate-core / pal-alpha / pal-beta / pal-delta` の 5 件になる。
- AC-03: Settings の built-in 同期で legacy built-in `pal-gamma` が profile list に残らず、current built-in 5 件へ揃う。
- AC-04: targeted unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-resident-set-remove-arranger

## ステータス
- APPLIED

## 変更ファイル
- docs/tomoshibikan_resident_set_v0_1.md
- wireframe/app.js
- wireframe/guide-planning-intent.js
- wireframe/debug-identity-seeds.js
- tests/unit/debug-identity-seeds.test.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- resident set 文書から `整える人` を除外し、住人一覧を 5 人構成へ更新した。
- built-in 初期住人セットを `guide-core / gate-core / pal-alpha / pal-beta / pal-delta` の 5 件へ変更した。
- `pal-delta` の built-in skills に `codex-test-runner` を追加し、debug-purpose の `verify` 受け先を `書く人` へ寄せた。
- legacy built-in `pal-gamma` は snapshot 正規化と Settings の built-in 同期時に profile list から外れるようにした。
- resident-facing prompt / docs / E2E expectation を 5 人構成へ同期した。

# delta-verify

## Delta ID
- DR-20260308-resident-set-remove-arranger

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `docs/tomoshibikan_resident_set_v0_1.md` から `整える人` セクションと対応関係を削除し、住人一覧を 5 人へ更新した。 |
| AC-02 | PASS | `INITIAL_PAL_PROFILES` は `guide-core / gate-core / pal-alpha / pal-beta / pal-delta` の 5 件になった。 |
| AC-03 | PASS | `normalizePalProfilesSnapshot()` と `syncBuiltInProfileMetadata()` が legacy built-in `pal-gamma` を profile list から外し、E2E でも built-in sync 後に `pal-gamma` が残らないことを確認した。 |
| AC-04 | PASS | targeted unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check wireframe/app.js`
- `node --check wireframe/guide-planning-intent.js`
- `node --check wireframe/debug-identity-seeds.js`
- `node --test tests/unit/debug-identity-seeds.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "built-in debug identities are seeded on init when missing|settings can sync built-in resident definitions to workspace|guide chat creates planned tasks and assigns workers|job board supports gate flow"`
- `node scripts/validate_delta_links.js --dir .`

## 既知事項
- `pal-gamma` の legacy identity file 自体は削除していない。profile list と current built-in sync 対象から外すだけに留めている。
- `verify` を `書く人` へ寄せたのは debug-purpose の最小運用であり、長期的な resident role の再定義は scope 外。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-resident-set-remove-arranger

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- `整える人` を resident set と built-in 初期住人セットから外し、初期住人は 5 人構成へ揃った。
- Settings の built-in 同期で legacy built-in `pal-gamma` が残らず、current built-in 5 件へ揃うようにした。
