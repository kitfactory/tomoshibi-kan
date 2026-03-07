# delta-request

## Delta ID
- DR-20260306-execution-loop-handoff-schema

## 目的
- `Execution Loop` の文脈継承を実装できる粒度まで下げるため、`WorkerExecutionInput` / `GateReviewInput` / `HandoffSummary` の schema を定義する。

## 変更対象範囲 (In Scope)
- `docs/concept.md` に `Handoff Summary` の概念を追加する。
- `docs/spec.md` に `WorkerExecutionInput`, `GateReviewInput`, `HandoffSummary`, compaction ルールを追記する。
- `docs/architecture.md` に type 定義と DTO 生成責務を追記する。
- `docs/plan.md` に seed/archive 完了記録を追加する。

## 変更対象外 (Out of Scope)
- runtime / renderer の DTO 実装。
- Settings UI の policy 設定実装。
- `rubricVersion` の算出実装。

## 受入条件
- DS-01:
  - Given: 読者が Worker への handoff payload を確認する
  - When: spec/architecture を参照する
  - Then: `WorkerExecutionInput` の最小キー集合が定義されている。
- DS-02:
  - Given: 読者が Gate への review payload を確認する
  - When: spec/architecture を参照する
  - Then: `GateReviewInput` の最小キー集合が定義されている。
- DS-03:
  - Given: 読者が summary と圧縮方針を確認する
  - When: spec/architecture を参照する
  - Then: `HandoffSummary` の役割と compaction 適用順が定義されている。

## Acceptance Criteria
- AC-01: `spec` に `WorkerExecutionInput`, `GateReviewInput`, `HandoffSummary` の各 schema が追加されている。
- AC-02: `architecture` に type 定義と UseCase ごとの DTO 生成責務が追加されている。
- AC-03: compaction 適用順が `handoffSummary` と `compressedHistorySummary[]` の優先関係まで含めて定義されている。

## リスク
- 将来の実装で field 名の微調整が必要になる可能性。
- `projectContext` や `rubricVersion` の表現は実装時に再確認が必要。

## 未解決事項
- Q-01: `projectContext` を string のままにするか structured object にするかは別 delta とする。
- Q-02: `rejectHistorySummary[]` の最大件数は別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-execution-loop-handoff-schema

## 実装ステータス
- APPLIED

## 変更ファイル
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: spec に `WorkerExecutionInput`, `GateReviewInput`, `HandoffSummary` の schema を追加した。
  - 理由: downstream handoff の境界契約を固定するため。
- AC-02:
  - 変更点: architecture に type 定義と DTO 生成責務を追加した。
  - 理由: UseCase ごとの担当境界を固定するため。
- AC-03:
  - 変更点: spec/architecture に compaction 適用順を追加した。
  - 理由: token 超過時も構造化情報を失わないようにするため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: 実装コードと UI は未変更。
# delta-verify

## Delta ID
- DR-20260306-execution-loop-handoff-schema

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `spec` に `WorkerExecutionInput`, `GateReviewInput`, `HandoffSummary` の schema を追加した。 |
| AC-02 | PASS | `architecture` に type 定義と DTO 生成責務を追加した。 |
| AC-03 | PASS | compaction 適用順を `handoffSummary` と `compressedHistorySummary[]` の優先関係まで定義した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 実装コードと UI は未変更。

## 主要確認
- R-01: `rg -n "WorkerExecutionInput|GateReviewInput|HandoffSummary|compressedHistorySummary|rubricVersion|Compaction 適用順|Handoff Summary" docs/concept.md docs/spec.md docs/architecture.md docs/plan.md docs/delta/DR-20260306-execution-loop-handoff-schema.md`
- R-02: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-execution-loop-handoff-schema

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: `Execution Loop` の handoff payload schema を固定する。
- 変更対象: concept/spec/architecture/plan
- 非対象: runtime/renderer 実装、Settings UI、rubricVersion 算出実装

## 反映結果
- 変更ファイル: `docs/concept.md`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`
- AC充足: AC-01/02/03 PASS

## 検証記録
- verify要約: schema 検索と delta link validation で確認
- 主因メモ: なし

## 未解決事項
- `projectContext` の structured 化は別 delta とする。
- `rejectHistorySummary[]` の最大件数は別 delta とする。

## 次のdeltaへの引き継ぎ
- Seed-01: runtime 側で `WorkerExecutionInput` / `GateReviewInput` を実際に組み立てる delta を切る。
