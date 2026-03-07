# delta-request

## Delta ID
- DR-20260306-gate-decision-schema

## Purpose
- Gate の prototype 出力を `decision / reason / fixes` schema に揃え、Task/Job state と UI 表示で扱えるようにする。

## In Scope
- `wireframe/app.js` に `gateResult = { decision, reason, fixes }` の normalize/build 処理を追加する
- Task/Job の normalize と board snapshot に `gateResult` を保持する
- manual Gate panel の approve/reject/resubmit で `gateResult` を更新する
- Task/Job row と Task detail に Gate schema 表示を追加する
- `tests/e2e/workspace-layout.spec.js` に Gate schema 回帰を追加する
- `docs/spec.md` / `docs/architecture.md` に Gate schema 契約を最小同期する
- `docs/plan.md` とこの delta を request/apply/verify/archive で閉じる

## Out of Scope
- Gate runtime の自動評価実装
- Event Log の Gate schema 詳細表示
- DB 永続化層の正式 `GateResult` repository 実装
- row レイアウトの大幅変更

## Acceptance Criteria
- AC-01: Task/Job state が `gateResult = { decision, reason, fixes }` を保持する
- AC-02: approve/reject/resubmit で `gateResult` が一貫して更新される
- AC-03: Task/Job row に `data-gate-decision` が出る
- AC-04: Task detail で `Gate Decision / Reason / Fixes` を表示できる
- AC-05: `spec/architecture` に Gate schema 契約が追記される
- AC-06: Playwright で Gate flow と schema 表示回帰が通る
- AC-07: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- 既存の `decisionSummary / fixCondition` との二重管理がしばらく残る
- reason/fixes の粒度は manual Gate panel の入力品質に依存する

## Open Questions
- 正式な Gate runtime 導入時に `reason` を複数段に分解するかは別 delta

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260306-gate-decision-schema.md

## applied AC
- AC-01: `normalizeGateResultRecord` / `buildGateResultRecord` を追加し、Task/Job normalize に `gateResult` を組み込んだ
- AC-02: manual Gate panel の approve/reject/resubmit で `gateResult` を更新するようにした
- AC-03: Task/Job row に `data-gate-decision` を追加した
- AC-04: Task detail に `Gate Decision / Reason / Fixes` を追加した
- AC-05: spec/architecture に Gate schema 契約を追記した
- AC-06: Gate flow と detail schema 表示の E2E を追加・再実行した
- AC-07: plan と delta を更新した

## scope deviation
- Out of Scope への変更: No
- 補足: Event Log、DB repository、Gate runtime 自動評価には触れていない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` に `normalizeGateResultRecord` / `buildGateResultRecord` を追加し、Task/Job normalize に `gateResult` を保存 |
| AC-02 | PASS | `runGate()` と resubmit 経路で `gateResult` を更新 |
| AC-03 | PASS | Task/Job row に `data-gate-decision` を追加し、E2E で approve/reject を確認 |
| AC-04 | PASS | Task detail に `Gate Decision / Reason / Fixes` を追加し、E2E で表示確認 |
| AC-05 | PASS | `docs/spec.md` / `docs/architecture.md` に Gate schema を追記 |
| AC-06 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "job board supports gate flow|gate reject uses templates and navigates to resubmit target|task board and gate expose visual state attributes|task detail shows gate decision schema fields"` PASS |
| AC-07 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- Gate runtime、自動評価、Event Log 詳細表示、DB repository 実装は未実施

## residual risks
- R-01: `decisionSummary / fixCondition` は compatibility field のため、将来どこかで一本化が必要

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - compatibility field の整理と正式 Gate runtime は別 delta
