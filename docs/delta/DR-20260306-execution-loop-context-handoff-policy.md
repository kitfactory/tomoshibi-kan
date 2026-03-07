# delta-request

## Delta ID
- DR-20260306-execution-loop-context-handoff-policy

## 目的
- `Execution Loop` 内でセッション情報をどう正規化・継承するかを定義し、圧縮前提の handoff policy を正本へ反映する。

## 変更対象範囲 (In Scope)
- `docs/concept.md` に Context Handoff Policy の概念を追加する。
- `docs/spec.md` に `Guide/Worker/Gate` ごとの文脈継承方針と `Minimal/Balanced/Verbose` を追記する。
- `docs/architecture.md` に handoff DTO / compaction 方針 / settings 責務を追記する。
- `docs/plan.md` に seed/archive 完了記録を追加する。

## 変更対象外 (Out of Scope)
- 実装コードでの handoff policy 適用。
- Settings UI への policy セレクタ追加。
- Worker/Gate runtime への session summary 注入実装。

## 受入条件
- DS-01:
  - Given: 読者が `Execution Loop` の会話継承を確認する
  - When: spec を参照する
  - Then: Guide/Worker/Gate の引き継ぎ境界が raw session と summary で区別されている。
- DS-02:
  - Given: 読者が将来実装の設定方針を確認する
  - When: spec/architecture を参照する
  - Then: `Minimal/Balanced/Verbose` と workspace-level 設定責務が定義されている。
- DS-03:
  - Given: 読者が圧縮時の振る舞いを確認する
  - When: spec/architecture を参照する
  - Then: 構造化フィールド保持優先の compaction 方針が明文化されている。

## Acceptance Criteria
- AC-01: `concept/spec/architecture` に `Context Handoff Policy` が追加されている。
- AC-02: `spec` に `Minimal/Balanced/Verbose` の定義が追加されている。
- AC-03: `architecture` に workspace-level settings 責務と compaction audit 方針が追加されている。

## リスク
- 現行 prototype 実装との差分が大きく見える可能性。
- `Balanced` の summary 粒度は将来さらに調整が必要になる可能性。

## 未解決事項
- Q-01: `handoffSummary` の具体 schema は別 delta で定義する。
- Q-02: worker/gate 個別 override を将来許可するかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-execution-loop-context-handoff-policy

## 実装ステータス
- APPLIED

## 変更ファイル
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: concept/spec/architecture に `Context Handoff Policy` を追加した。
  - 理由: セッション継承を role ごとに整理するため。
- AC-02:
  - 変更点: spec に `Minimal/Balanced/Verbose` と既定値 `Balanced` を追記した。
  - 理由: 設定を少数モードに制限し、過度な複雑化を避けるため。
- AC-03:
  - 変更点: architecture に workspace-level settings 責務、handoff DTO 方針、compaction audit 方針を追記した。
  - 理由: 実装時に raw session 転送へ流れないよう境界を固定するため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: 実装コードと UI は未変更。
# delta-verify

## Delta ID
- DR-20260306-execution-loop-context-handoff-policy

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `concept/spec/architecture` に `Context Handoff Policy` を追加した。 |
| AC-02 | PASS | `spec` に `Minimal/Balanced/Verbose` と既定値 `Balanced` を追加した。 |
| AC-03 | PASS | `architecture` に settings 責務、handoff DTO 方針、compaction audit を追加した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 実装コードと UI は未変更。

## 主要確認
- R-01: `rg -n "Context Handoff Policy|Minimal|Balanced|Verbose|structure-preserve|handoffSummary" docs/concept.md docs/spec.md docs/architecture.md docs/plan.md docs/delta/DR-20260306-execution-loop-context-handoff-policy.md`
- R-02: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-execution-loop-context-handoff-policy

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: `Execution Loop` 内の文脈継承方針と圧縮前提を正本で統一する。
- 変更対象: concept/spec/architecture/plan
- 非対象: 実装コード、Settings UI、Worker/Gate runtime 接続

## 反映結果
- 変更ファイル: `docs/concept.md`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`
- AC充足: AC-01/02/03 PASS

## 検証記録
- verify要約: 用語検索と delta link validation で確認
- 主因メモ: なし

## 未解決事項
- `handoffSummary` の具体 schema は別 delta で定義する。
- agent 個別 override は別 delta とする。

## 次のdeltaへの引き継ぎ
- Seed-01: `WorkerExecutionInput` / `GateReviewInput` の schema を別 delta で定義する。
