# delta-request

## Delta ID
- DR-20260306-worker-gate-routing-basis-doc

## 目的
- Worker/Gate routing の判断軸を正本へ固定し、`Worker = enabled skills + ROLE.md`、`Gate = RUBRIC.md 中心` を明文化する。

## 変更対象範囲 (In Scope)
- `docs/concept.md` に routing 概念を追加する。
- `docs/spec.md` に Worker/Gate routing rules を追加する。
- `docs/architecture.md` に selector 責務と routing input を追加する。
- `docs/plan.md` に seed/archive 完了記録を追加する。

## 変更対象外 (Out of Scope)
- 実装コードの routing ロジック追加。
- WorkerRoutingSelector / GateRoutingSelector の具体実装。
- audit/event 出力形式の実装変更。

## 受入条件
- DS-01:
  - Given: concept を読む
  - When: routing 概念を確認する
  - Then: Worker routing と Gate routing の違いが分かる。
- DS-02:
  - Given: spec を読む
  - When: Worker/Gate selection rules を確認する
  - Then: Worker は `enabled skills + ROLE.md`、Gate は `RUBRIC.md` 中心であることが明記されている。
- DS-03:
  - Given: architecture を読む
  - When: 実装責務を確認する
  - Then: selector 責務と routing input が分かる。

## Acceptance Criteria
- AC-01: `concept` に Worker Routing / Gate Routing の概念が追加されている。
- AC-02: `spec` に Worker/Gate routing rules と explanation 要件が追加されている。
- AC-03: `architecture` に selector 責務と routing input が追加されている。
- AC-04: `plan` と `delta` のリンク整合が取れている。

## リスク
- routing 規則を早く固定しすぎると、後続の実装で例外ケースが出る可能性がある。
- `ROLE.md` / `RUBRIC.md` の運用粒度が未確定だと、評価基準が抽象的に見える可能性がある。

## 未解決事項
- Q-01: routing explanation を event/audit のどちらへ残すかは別 delta とする。
- Q-02: required skill / review focus をどう抽出するかの実装規則は別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-worker-gate-routing-basis-doc

## 実装ステータス
- APPLIED

## 変更ファイル
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `concept` に `Worker Routing` と `Gate Routing` の概念定義を追加した。
  - 理由: routing の主判断軸をプロダクト概念として固定するため。
- AC-02:
  - 変更点: `spec` に Worker/Gate routing rules と routing explanation 要件を追加した。
  - 理由: 後続実装で判断基準をぶらさないため。
- AC-03:
  - 変更点: `architecture` に `WorkerRoutingSelector` / `GateRoutingSelector` の責務と input DTO を追加した。
  - 理由: 実装責務と依存境界を明確にするため。
- AC-04:
  - 変更点: `plan` に seed/archive 完了を追加した。
  - 理由: delta 履歴を current archive に同期するため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: 実装コード・tests は未変更。

# delta-verify

## Delta ID
- DR-20260306-worker-gate-routing-basis-doc

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `concept` に Worker/Gate routing 概念を追加した。 |
| AC-02 | PASS | `spec` に `skills+ROLE` / `RUBRIC` 中心の routing rules を追加した。 |
| AC-03 | PASS | `architecture` に selector 責務と routing input を追加した。 |
| AC-04 | PASS | plan 更新後に delta links validation が通過した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 文書のみの変更に限定した。

## 主要確認
- R-01: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-worker-gate-routing-basis-doc

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: Worker/Gate routing の判断軸を正本化する。
- 変更対象: concept/spec/architecture/plan
- 非対象: routing 実装、selector 実装

## 反映結果
- 変更ファイル: `docs/concept.md`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`
- AC充足: AC-01/02/03/04 PASS

## 検証記録
- verify要約: delta links validation
- 主因メモ: なし

## 未解決事項
- routing explanation の永続先は未決定。
- required skill / review focus 抽出ロジックは未実装。

## 次のdeltaへの引き継ぎ
- Seed-01: `WorkerRoutingSelector` / `GateRoutingSelector` の実装 delta を切る。
