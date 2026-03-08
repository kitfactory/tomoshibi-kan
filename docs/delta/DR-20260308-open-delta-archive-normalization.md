# delta-request

## Delta ID
- DR-20260308-open-delta-archive-normalization

## Delta Type
- DOCS-SYNC

## 目的
- `DR-20260308-orchestrator-replan-bridge`、`DR-20260308-orchestrator-reroute-bridge`、`DR-20260308-routing-precision-role-first` の archive 記述を validator が読める形式へ正規化する。

## 変更対象（In Scope）
- `docs/delta/DR-20260308-orchestrator-replan-bridge.md`
- `docs/delta/DR-20260308-orchestrator-reroute-bridge.md`
- `docs/delta/DR-20260308-routing-precision-role-first.md`
- 本 delta 記録

## 非対象（Out of Scope）
- 実装コードの変更
- AC や apply/verify 証跡の意味変更
- `docs/plan.md` の再整理

## 受入条件（Acceptance Criteria）
- AC-01: 3件すべてに `# delta-archive` 節として validator が読めるクローズ判定が入る
- AC-02: 各 delta の既存 request/apply/verify 内容は維持される
- AC-03: `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- archive 節の形式正規化だけを行う
- 実体の意味は変えない

## Review Gate
- required: No
- reason: 既存 delta 記録の形式修正のみ

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260308-open-delta-archive-normalization

## Delta Type
- DOCS-SYNC

## 実行ステータス
- APPLIED

## 変更ファイル
- docs/delta/DR-20260308-orchestrator-replan-bridge.md
- docs/delta/DR-20260308-orchestrator-reroute-bridge.md
- docs/delta/DR-20260308-routing-precision-role-first.md
- docs/delta/DR-20260308-open-delta-archive-normalization.md

## 適用内容（AC対応）
- AC-01:
  - 変更: 3件の `delta-archive` をテンプレート相当のクローズ判定へ正規化
  - 根拠: validator が `archive可否: 可` と verify PASS を読めるようにする
- AC-02:
  - 変更: request/apply/verify の本文は維持
  - 根拠: archive 節だけを差し替える
- AC-03:
  - 変更: validator 再実行予定
  - 根拠: plan cleanup 再開の前提

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由:

## コード分割健全性
- 500行超のファイルあり: No
- 800行超のファイルあり: No
- 1000行超のファイルあり: No
- 長大な関数なし: Yes
- 責務過多のモジュールなし: Yes

## verify 依頼メモ
- 検証してほしい観点: validator が 3件を PASS archive と解釈するか
- review evidence:

# delta-verify

## Delta ID
- DR-20260308-open-delta-archive-normalization

## Verify Profile
- static check: `Get-Content docs/delta/DR-20260308-orchestrator-replan-bridge.md -TotalCount 220` ほか2件
- targeted unit: Not required
- targeted integration / E2E: Not required
- project-validator: `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | 3件すべてに validator が読める `delta-archive` のクローズ判定が入った |
| AC-02 | PASS | request/apply/verify の本文は維持され、archive 節だけ正規化した |
| AC-03 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- なし

## Review Gate
- required: No
- checklist: `docs/delta/REVIEW_CHECKLIST.md`
- layer integrity: NOT CHECKED
- docs sync: PASS
- data size: NOT CHECKED
- code split health: PASS
- file-size threshold: PASS

## Review Delta Outcome
- pass: Yes
- follow-up delta seeds:

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260308-open-delta-archive-normalization

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的: 3件の open delta 記録を validator が読める archive 形式へ揃えた
- 変更対象: `DR-20260308-orchestrator-replan-bridge`、`DR-20260308-orchestrator-reroute-bridge`、`DR-20260308-routing-precision-role-first`、本 delta 記録
- 非対象: 実装コード、AC や apply/verify 証跡の意味変更、`docs/plan.md` 再整理

## 実装記録
- 変更ファイル:
  - `docs/delta/DR-20260308-orchestrator-replan-bridge.md`
  - `docs/delta/DR-20260308-orchestrator-reroute-bridge.md`
  - `docs/delta/DR-20260308-routing-precision-role-first.md`
  - `docs/delta/DR-20260308-open-delta-archive-normalization.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS

## 検証記録
- verify要約: 3件の archive 節を正規化し、validator が PASS と解釈できる状態にした
- 主要な根拠: `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- なし

## 次のdeltaへの引き継ぎ（任意）
- なし
