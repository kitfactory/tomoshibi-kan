# delta-request

## Delta ID
- DR-20260301-plan-current-order-guide

## 目的
- `docs/plan.md` の current に、Guide関連の次サイクル項目を `2 -> 3 -> 1` の順で追加する。

## 変更対象（In Scope）
- `docs/plan.md` の current を更新し、以下の優先順を反映する。
  - 2: Guideモデル未設定時に会話不可 + 設定誘導
  - 3: Settingsからモデル登録を実動作に反映
  - 1: Guideとの対話機能（モデル設定済み前提）
- `docs/plan.md` archive に本 DR の記録を追加する。

## 非対象（Out of Scope）
- 実装コード（wireframe/app.js 等）の変更。
- spec / architecture / concept の更新。

## 差分仕様
- DS-01:
  - Given: Guide関連の次タスク順序が未定義
  - When: current を更新する
  - Then: `2 -> 3 -> 1` の順で seed タスクが並ぶ
- DS-02:
  - Given: delta 運用の整合が必要
  - When: 本DRを archive 記録する
  - Then: plan と delta の参照が整合する

## 受入条件（Acceptance Criteria）
- AC-01: current に `2 -> 3 -> 1` の順で seed タスクが追加されている。
- AC-02: 既存の完了済み current 項目は保持される。
- AC-03: archive に `DR-20260301-plan-current-order-guide` が追加される。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

## 制約
- 変更は `docs/plan.md` と本 delta ファイルのみ。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-plan-current-order-guide

## 実行ステータス
- APPLIED

## 変更ファイル
- docs/plan.md
- docs/delta/DR-20260301-plan-current-order-guide.md

## 適用内容（AC対応）
- AC-01:
  - 変更: current に Guide関連 seed を `2 -> 3 -> 1` の順で追加した。
  - 根拠: `SEED-20260301-guide-model-guard` → `SEED-20260301-settings-model-registration` → `SEED-20260301-guide-chat-dialogue` の順序で配置。
- AC-02:
  - 変更: 既存 current 完了項目を維持した。
  - 根拠: 既存 `[x]` 項目を削除せず残置。
- AC-03:
  - 変更: archive に本DR項目を追記した。
  - 根拠: `[DR-20260301-plan-current-order-guide]` を archive に追加。
- AC-04:
  - 変更: 検証コマンド実行前提で delta 記録を整備。
  - 根拠: verify/archive セクションを同ファイルに記録。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: current の順序、archive 参照、delta整合

# delta-verify

## Delta ID
- DR-20260301-plan-current-order-guide

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | current に `2 -> 3 -> 1` 順で seed 追加済み |
| AC-02 | PASS | 既存 current 完了項目を維持 |
| AC-03 | PASS | archive に本DR項目を追加 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` 成功 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: 計画更新のみで挙動変更なし。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-plan-current-order-guide

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: Guide関連実装の優先順を `2 -> 3 -> 1` で current へ反映する。
- 変更対象: `docs/plan.md` / `docs/delta/DR-20260301-plan-current-order-guide.md`
- 非対象: 実装コード・仕様文書更新

## 実装記録
- 変更ファイル:
  - docs/plan.md
  - docs/delta/DR-20260301-plan-current-order-guide.md
- AC達成状況: AC-01〜AC-04 全達成

## 検証記録
- verify要約: current順序/plan-delta整合ともにPASS
- 主要な根拠:
  - `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- なし
