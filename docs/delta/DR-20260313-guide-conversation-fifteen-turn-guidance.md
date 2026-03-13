# delta-request

## Delta ID
- DR-20260313-guide-conversation-fifteen-turn-guidance

## Delta Type
- OPS

## Arrival Point
- AGENTS に、Guide は短いターンで無理に task 化せず、自然に聞き取り、明示的な上限が必要な verify では 15 ターン以内を目安とする基準が追加されている。

## 目的
- Guide 会話の収束基準を、短ターン固定ではなく自然な聞き取り優先に再定義する。

## 変更対象（In Scope）
- AGENTS の Guide 会話運用基準
- 本 delta の記録

## 非対象（Out of Scope）
- 実装コードの変更
- 既存 archive 文書の全面書換え
- Channel / Cron の未着手 delta

## 差分仕様
- DS-01:
  - Given: AGENTS に Guide 会話の運用基準が必要
  - When: 管理人の会話基準を更新する
  - Then: 15ターン以内、まず聞く、詰問しない、最後に提案する、が明記される

## 受入条件（Acceptance Criteria）
- AC-01: AGENTS に 15ターン以内基準が明記されている
- AC-02: AGENTS に「短いターンで無理に task 要件を確定しない」が明記されている
- AC-03: AGENTS に「最後の形が固まり始めてから提案する」が明記されている

## 制約
- docs-only に閉じる
- 既存の delta-first 運用を壊さない

## Review Gate
- required: No
- reason: 運用文言の明確化のみ

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260313-guide-conversation-fifteen-turn-guidance

## Delta Type
- OPS

## 実行ステータス
- APPLIED

## 変更ファイル
- AGENTS.md

## 適用内容（AC対応）
- AC-01:
  - 変更: Guide 会話運用基準に 15 ターン以内の上限を明記
  - 根拠: verify 時の明示上限を統一するため
- AC-02:
  - 変更: 管理人は短いターンで無理に task 化しないことを追加
  - 根拠: まず聞く運用へ寄せるため
- AC-03:
  - 変更: 提案は最後の形が固まり始めてから行うと明記
  - 根拠: 早すぎる task 化を避けるため

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## コード分割健全性
- 500行超のファイルあり: No
- 800行超のファイルあり: No
- 1000行超のファイルあり: No
- 長大な関数なし: Yes
- 責務過多のモジュールなし: Yes

## verify 依頼メモ
- 検証してほしい観点: AGENTS 文言が運用意図どおりか
- review evidence: docs-only

# delta-verify

## Delta ID
- DR-20260313-guide-conversation-fifteen-turn-guidance

## Verify Profile
- static check: N/A
- targeted unit: N/A
- targeted integration / E2E: N/A
- project-validator: not run

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | AGENTS に 15ターン以内の基準を明記 |
| AC-02 | PASS | AGENTS に「短いターンで無理に task 要件を確定しない」を追加 |
| AC-03 | PASS | AGENTS に「最後の形が固まり始めてから提案する」を追加 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No

## 不整合/回帰リスク
- R-01: validator は今回未実行

## Review Gate
- required: No
- checklist: `docs/delta/REVIEW_CHECKLIST.md`
- layer integrity: NOT CHECKED
- docs sync: PASS
- data size: NOT CHECKED
- code split health: NOT CHECKED
- file-size threshold: NOT CHECKED

## Review Delta Outcome
- pass: Yes
- follow-up delta seeds:

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260313-guide-conversation-fifteen-turn-guidance

## Delta Type
- OPS

## 結果
- Guide 会話の運用基準を、短ターン固定ではなく自然な聞き取り優先へ更新した。

## 反映先
- AGENTS.md

## 備考
- docs-only の運用更新
