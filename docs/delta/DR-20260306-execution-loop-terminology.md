# delta-request

## Delta ID
- DR-20260306-execution-loop-terminology

## 目的
- `Guide -> Plan -> ... -> Guide completion` の全体フロー名と、その実行系責務名を文書で統一する。

## 変更対象範囲 (In Scope)
- `docs/concept.md` に `Execution Loop` / `PlanExecutionOrchestrator` の定義を追加する。
- `docs/spec.md` に用語の追加仕様を追記する。
- `docs/architecture.md` に `Execution Loop` と `PlanExecutionOrchestrator` の責務配置を追記する。
- `docs/plan.md` に seed/archive の完了記録を追加する。

## 変更対象外 (Out of Scope)
- 実装コード上のクラス名、関数名、変数名の変更。
- 既存 UseCase 分割の再設計。
- `Dispatcher` という語を UI やコードへ導入する変更。

## 受入条件
- DS-01:
  - Given: concept/spec/architecture を参照する読者
  - When: 全体フロー名を確認する
  - Then: `Execution Loop` が全体フロー名として一貫して定義されている。
- DS-02:
  - Given: architecture を参照する読者
  - When: 実行系責務名を確認する
  - Then: `PlanExecutionOrchestrator` が `GuideDispatchUseCase` 以降を束ねる責務として定義されている。

## Acceptance Criteria
- AC-01: `concept/spec/architecture` の3文書に `Execution Loop` が追加されている。
- AC-02: `architecture` に `PlanExecutionOrchestrator` が実行系責務として明記されている。
- AC-03: `Dispatcher` は正本用語として採用しないことが `spec` で明示されている。

## リスク
- 既存の `Main Orchestrator` 表現と二重命名になる可能性。
- 文書だけの変更のため、実装名とのズレが残る可能性。

## 未解決事項
- Q-01: 将来、実装コードでも `PlanExecutionOrchestrator` を導入するかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-execution-loop-terminology

## 実装ステータス
- APPLIED

## 変更ファイル
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: concept/spec/architecture に `Execution Loop` を追加した。
  - 理由: 全体フロー名を正本で統一するため。
- AC-02:
  - 変更点: architecture に `PlanExecutionOrchestrator` を追加し、Execution Loop の進行責務として定義した。
  - 理由: 配布だけでなく実行・判定・再提出・完了通知まで含むため。
- AC-03:
  - 変更点: spec に `Dispatcher` を正本用語として採用しない旨を追記した。
  - 理由: 責務が狭く誤解を生みやすいため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: 実装コード名や UI 文言は変更していない。

## verify 申し送り
- `validate_delta_links` と文書内検索で用語の追加位置を確認する。
# delta-verify

## Delta ID
- DR-20260306-execution-loop-terminology

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `concept/spec/architecture` に `Execution Loop` を追加した。 |
| AC-02 | PASS | `architecture` に `PlanExecutionOrchestrator` の責務定義を追加した。 |
| AC-03 | PASS | `spec` に `Dispatcher` を正本用語として使わない旨を追記した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 文書更新のみで、実装コード・UI 文言には変更なし。

## 主要確認
- R-01: `rg -n "Execution Loop|PlanExecutionOrchestrator|Dispatcher" docs/concept.md docs/spec.md docs/architecture.md docs/plan.md docs/delta/DR-20260306-execution-loop-terminology.md`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-execution-loop-terminology

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: 全体フロー名と実行系責務名を文書で統一する。
- 変更対象: concept/spec/architecture/plan
- 非対象: 実装コード名、UseCase 再設計、UI 文言変更

## 反映結果
- 変更ファイル: `docs/concept.md`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`
- AC充足: AC-01/02/03 PASS

## 検証記録
- verify要約: 用語検索と delta link validation で確認
- 主因メモ: なし

## 未解決事項
- 将来、実装コードでも `PlanExecutionOrchestrator` を導入するかは別 delta とする。

## 次のdeltaへの引き継ぎ
- Seed-01: 実装コード名を文書用語へ寄せる必要が出た場合は別 delta で扱う。
