# delta-request

## Delta ID
- DR-20260301-pal-profile

## 目的
- Pal List の追加/保存/削除ロジックを共通化し、Name/Role/Runtime/Skill の関連を安定化する。
- Pal プロファイル管理を unit/E2E で回帰防止できる状態にする。

## 変更対象（In Scope）
- Pal プロファイル状態遷移を `wireframe` の独立モジュールへ切り出す。
- `wireframe/app.js` の Pal 追加/保存/削除を共通ロジック経由に変更する。
- Pal プロファイルロジックの unit テストを追加する。
- Pal List 編集フローの E2E シナリオを追加/強化する。
- `docs/plan.md` の pal-profile seed 進捗を反映する。

## 非対象（Out of Scope）
- Settings 画面のモデル/Skillカタログ仕様変更。
- Task/Job/Gate の状態遷移ロジック変更。
- concept/spec/architecture 本文改訂。

## 差分仕様
- DS-01:
  - Given: Pal 追加/保存/削除ロジックが UI イベント内に分散している
  - When: 共通ヘルパーへ集約する
  - Then: Name/Runtime/Skill 適用と削除判定が一貫する
- DS-02:
  - Given: Pal プロファイルに unit テストがない
  - When: 追加/保存/削除判定の unit テストを追加する
  - Then: 回帰を自動検知できる
- DS-03:
  - Given: Pal List の E2E カバレッジを補強したい
  - When: 追加/保存/削除の観測可能なシナリオを追加/強化する
  - Then: UI 操作で主要フローを回帰検出できる

## 受入条件（Acceptance Criteria）
- AC-01: Pal 追加/保存/削除の判定が共通ヘルパー経由になる。
- AC-02: unit テストで Pal プロファイルロジック（追加初期化、保存適用、削除可否）が検証される。
- AC-03: E2E テストで Pal 追加/保存/削除フローが検証される。
- AC-04: `docs/plan.md` の pal-profile seed が完了として反映される。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

## 制約
- 変更は pal-profile 管理に必要な最小差分に限定する。
- UI の見た目/レイアウトは変更しない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-pal-profile

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/pal-profile.js
- wireframe/index.html
- wireframe/app.js
- tests/unit/pal-profile.test.js
- tests/e2e/workspace-layout.spec.js
- package.json
- docs/plan.md
- docs/delta/DR-20260301-pal-profile.md

## 適用内容（AC対応）
- AC-01:
  - 変更: Pal 追加/保存/削除ロジックを共通ヘルパー経由へ変更した。
  - 根拠: `wireframe/pal-profile.js` を追加し、`createWorkerPalProfileWithFallback` / `applyPalRuntimeSelectionWithFallback` / `canDeletePalProfileWithFallback` を `wireframe/app.js` に実装。
- AC-02:
  - 変更: Pal プロファイルロジックの unit テストを追加した。
  - 根拠: `tests/unit/pal-profile.test.js` で追加初期化・保存適用・削除可否を検証。
- AC-03:
  - 変更: Pal List E2E を強化した。
  - 根拠: `tests/e2e/workspace-layout.spec.js` の add/delete テストに初期値検証（name/runtime/skill）を追加。
- AC-04:
  - 変更: `docs/plan.md` の pal-profile seed を完了チェックに更新し archive に DR を追加した。
  - 根拠: current の 3項目を `[x]` 化し、`[DR-20260301-pal-profile]` を archive へ追加。
- AC-05:
  - 変更: delta 整合検証可能状態へ更新した。
  - 根拠: 本ファイルへ verify/archive セクションを追加した。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: Pal 追加初期値、保存時 Name/Runtime/Skill 適用、削除可否、unit/E2E/delta整合

# delta-verify

## Delta ID
- DR-20260301-pal-profile

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | Pal 追加/保存/削除が `pal-profile.js` を参照する共通ヘルパー経由へ変更 |
| AC-02 | PASS | `npm run test:unit` で pal-profile unit を含む 15件 PASS |
| AC-03 | PASS | Pal 関連 E2E 9件 PASS（3 viewport） |
| AC-04 | PASS | `docs/plan.md` の pal-profile seed 完了、archive に DR 追加済み |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が成功 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: Role 編集UIは現状未提供のため、Role変更ケースは未対象。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-pal-profile

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: Pal Profile 追加/保存/削除ロジックを共通化し、回帰をテストで固定する。
- 変更対象: `wireframe/pal-profile.js`、`wireframe/index.html`、`wireframe/app.js`、`tests/unit/pal-profile.test.js`、`tests/e2e/workspace-layout.spec.js`、`package.json`、`docs/plan.md`
- 非対象: Settings 仕様変更、Task/Job/Gate ロジック変更、canonical docs 改訂

## 実装記録
- 変更ファイル:
  - wireframe/pal-profile.js
  - wireframe/index.html
  - wireframe/app.js
  - tests/unit/pal-profile.test.js
  - tests/e2e/workspace-layout.spec.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260301-pal-profile.md
- AC達成状況: AC-01〜AC-05 すべて達成

## 検証記録
- verify要約: unit/E2E/delta整合の全AC PASS
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep 'pal list includes roles and allows name/model/tool settings|pal runtime save is blocked when tool target is not available|pal list supports add and delete profile'`
  - `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- なし

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: [DOC] 各実装差分を concept/spec/architecture/plan に同期する
