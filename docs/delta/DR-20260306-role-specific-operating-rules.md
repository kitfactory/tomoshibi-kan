# delta-request

## Delta ID
- DR-20260306-role-specific-operating-rules

## Purpose
- `OPERATING_RULES` を role 別に具体化し、Guide は対話/計画/割当、Gate は評価出力形式、Worker は実行/根拠報告を明示する。

## In Scope
- `wireframe/context-builder.js` の default operating rules を locale-aware / role-aware に具体化する
- `wireframe/app.js` の Guide/worker fallback operating rules を role 別に具体化する
- `runtime/palpal-core-runtime.js` の fallback Guide prompt を新しい Guide operating rules に合わせる
- `tests/unit/context-builder.test.js` に role-specific operating rules の unit test を追加・更新する
- `docs/spec.md` / `docs/architecture.md` に role-specific operating rules 契約を最小同期する
- `docs/plan.md` とこの delta を request/apply/verify/archive で閉じる

## Out of Scope
- `ROLE.md` / `RUBRIC.md` テンプレート本文の更新
- Gate runtime の新規実装
- UI から OPERATING_RULES を編集する機能
- prompt token budget の最適化

## Acceptance Criteria
- AC-01: Guide operating rules が対話、Task/Cron 分解、Pal 割当、Gate-aware planning を含む
- AC-02: Gate operating rules が `decision / reason / fixes` を明示する評価形式を含む
- AC-03: Worker operating rules が execution-first / evidence / blocked-state disclosure を含む
- AC-04: unit/E2E で既存 Guide/worker runtime 回帰が通る
- AC-05: `spec/architecture` に role-specific operating rules 契約が追記される
- AC-06: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- operating rules を詳細化しすぎると prompt が冗長になる
- app fallback と context-builder default がずれると挙動差が出る

## Open Questions
- 将来 `ROLE.md` 側に operating rules 的記述をどこまで寄せるかは別 delta

# delta-apply

## status
- APPLIED

## changed files
- wireframe/context-builder.js
- wireframe/app.js
- runtime/palpal-core-runtime.js
- tests/unit/context-builder.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260306-role-specific-operating-rules.md

## applied AC
- AC-01: Guide operating rules を role-aware default prompt と fallback helper に追加した
- AC-02: Gate operating rules に `decision / reason / fixes` 出力規則を追加した
- AC-03: Worker operating rules に execution/evidence/blocked-state disclosure を追加した
- AC-04: unit/E2E を再実行した
- AC-05: spec/architecture に role-specific operating rules を追記した
- AC-06: plan と delta を更新した

## scope deviation
- Out of Scope への変更: No
- 補足: `ROLE.md` / `RUBRIC.md` テンプレートや UI 編集機能には触れていない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/context-builder.js` と `wireframe/app.js` の Guide operating rules が dialogue / decomposition / assignment / Gate-aware planning を含む |
| AC-02 | PASS | `wireframe/context-builder.js` と `wireframe/app.js` の Gate operating rules が `decision / reason / fixes` を含む |
| AC-03 | PASS | `wireframe/context-builder.js` と `wireframe/app.js` の Worker operating rules が execution / evidence / blocked-state disclosure を含む |
| AC-04 | PASS | `node --test tests/unit/context-builder.test.js tests/unit/palpal-core-runtime.test.js` PASS / `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat resumes after registering model in settings|guide chat creates planned tasks and assigns workers|job board supports gate flow"` PASS |
| AC-05 | PASS | `docs/spec.md` / `docs/architecture.md` に role-specific operating rules を追記 |
| AC-06 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- テンプレート本文更新、Gate runtime 新規実装、UI 編集機能は未実施

## residual risks
- R-01: role-specific rules と identity file 本文の責務境界は今後の運用で再調整余地がある

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - `ROLE.md` / `RUBRIC.md` 本文との責務境界調整は別 delta
