# delta-request

## Delta ID
- DR-20260301-runtime-validation

## 目的
- Pal Runtime を `model` / `tool` の排他選択として保存できるよう、保存時判定を明確化する。
- Runtime 制約を unit / E2E で回帰防止できる状態にする。

## 変更対象（In Scope）
- `wireframe` の Pal 設定保存ロジックに Runtime 判定ヘルパーを導入する。
- Runtime 判定ヘルパーの unit テストを追加する。
- Runtime 制約（`model` 時 skill 有効、`tool` 時 skill 無効、無効 runtime 保存不可）の E2E を追加/強化する。
- `docs/plan.md` に本 delta の進捗反映を行う。

## 非対象（Out of Scope）
- Settings の Skill カタログ仕様変更（ClawHub導線の再設計）。
- Pal 追加/削除UIの構造変更。
- concept/spec/architecture の仕様本文更新。

## 差分仕様
- DS-01:
  - Given: Pal 保存時に Runtime 判定が UI ロジックへ分散している
  - When: Runtime 判定を共通ヘルパーで評価する
  - Then: 保存結果が `model` / `tool` 排他で確定する
- DS-02:
  - Given: Runtime 判定の単体検証がない
  - When: 判定ヘルパーに unit テストを追加する
  - Then: 正常系/異常系の判定が自動検証できる
- DS-03:
  - Given: Runtime 制約のE2Eが不足している
  - When: E2Eを追加/強化する
  - Then: `tool` 保存不可条件と skill 無効条件の回帰を検出できる

## 受入条件（Acceptance Criteria）
- AC-01: Pal 保存時の Runtime 判定が共通ヘルパー経由になる。
- AC-02: unit テストで Runtime 判定の正常系/異常系が検証される。
- AC-03: E2E テストで `model` 時 skill 有効、`tool` 時 skill 無効、および無効 runtime 保存時エラーが検証される。
- AC-04: `docs/plan.md` に runtime-validation seed の進捗が反映される。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

## 制約
- 変更は runtime-validation に必要な最小差分に限定する。
- 既存 UI の見た目・レイアウト変更は実施しない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-runtime-validation

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/runtime-validation.js
- wireframe/index.html
- wireframe/app.js
- tests/unit/runtime-validation.test.js
- tests/e2e/workspace-layout.spec.js
- package.json
- docs/plan.md
- docs/delta/DR-20260301-runtime-validation.md

## 適用内容（AC対応）
- AC-01:
  - 変更: Runtime 判定ヘルパー `wireframe/runtime-validation.js` を追加し、Pal 保存処理をヘルパー経由へ変更した。
  - 根拠: `validatePalRuntimeSelectionWithFallback` を `wireframe/app.js` に追加し、`data-pal-save-id` の保存処理で利用。
- AC-02:
  - 変更: Runtime 判定ヘルパーの unit テストを追加した。
  - 根拠: `tests/unit/runtime-validation.test.js` を追加し、正常系/異常系を検証。
- AC-03:
  - 変更: Runtime 制約の E2E を強化した。
  - 根拠: `tests/e2e/workspace-layout.spec.js` に runtime 不正保存ケースを追加し、既存 runtime 切替テストへ skill 未選択確認を追加。
- AC-04:
  - 変更: `docs/plan.md` の runtime-validation seed を完了チェックへ更新し、archive に DR 項目を追加した。
  - 根拠: current 3項目を `[x]` 化し、`[DR-20260301-runtime-validation]` を archive に追加。
- AC-05:
  - 変更: delta 整合検証実行可能状態へ更新した。
  - 根拠: 本ファイルへ verify/archive セクションを追加。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: Runtime 排他保存、skill 有効/無効切替、unit/E2E 実行結果、delta リンク整合

# delta-verify

## Delta ID
- DR-20260301-runtime-validation

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の Pal 保存処理が `validatePalRuntimeSelectionWithFallback` 経由に変更されている |
| AC-02 | PASS | `npm run test:unit` で 5件 PASS |
| AC-03 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js --grep 'pal list includes roles and allows name/model/tool settings|pal runtime save is blocked when tool target is not available'` で 6件 PASS |
| AC-04 | PASS | `docs/plan.md` の runtime-validation seed が完了チェック済み、archive に DR 項目あり |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が成功 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: `syncPalProfilesRegistryRefs` の自動フォールバック挙動（runtimeの自動切替）は既存仕様のまま維持。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-runtime-validation

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: Pal Runtime 排他保存とテスト担保を追加する。
- 変更対象: `wireframe/runtime-validation.js`、`wireframe/index.html`、`wireframe/app.js`、`tests/unit/runtime-validation.test.js`、`tests/e2e/workspace-layout.spec.js`、`package.json`、`docs/plan.md`
- 非対象: Skill カタログ仕様変更、Pal 画面レイアウト変更、canonical docs の仕様本文更新

## 実装記録
- 変更ファイル:
  - wireframe/runtime-validation.js
  - wireframe/index.html
  - wireframe/app.js
  - tests/unit/runtime-validation.test.js
  - tests/e2e/workspace-layout.spec.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260301-runtime-validation.md
- AC達成状況: AC-01〜AC-05 すべて達成

## 検証記録
- verify要約: unit/E2E/delta整合を確認し、全AC PASS
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep 'pal list includes roles and allows name/model/tool settings|pal runtime save is blocked when tool target is not available'`
  - `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- なし

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: SEED-20260301-skill-catalog
- Seed-02: SEED-20260301-pal-profile
