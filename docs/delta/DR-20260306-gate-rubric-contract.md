# delta-request

## Delta ID
- DR-20260306-gate-rubric-contract

## Purpose
- Gate の個別文脈ファイル契約を `SOUL.md + RUBRIC.md` に変更し、Guide/Worker の `SOUL.md + ROLE.md` と役割ごとに分ける。

## In Scope
- `runtime/agent-identity-store.js` を更新し、Gate の secondary file を `RUBRIC.md` に切り替える
- `tests/unit/agent-identity-store.test.js` を更新し、Gate の `RUBRIC.md` 保存と template 初期化を検証する
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に Gate の `RUBRIC.md` 契約を反映する
- `docs/delta/DR-20260306-gate-rubric-contract.md` を request/apply/verify/archive で完結させる

## Out of Scope
- Gate 追加 UI の実装
- Guide / Worker の file contract 変更
- 既存 workspace 上の `ROLE.md` -> `RUBRIC.md` 移行処理

## Acceptance Criteria
- AC-01: `AgentIdentityStore` は Gate の場合に `RUBRIC.md` を読み書きする
- AC-02: Gate の template 初期化は locale 別の `RUBRIC.md` を生成する
- AC-03: unit test で Guide/Worker は `ROLE.md`、Gate は `RUBRIC.md` を使うことが PASS する
- AC-04: `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に Gate 契約が反映される
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- 既存 workspace の Gate identity が `ROLE.md` 前提だと、別途移行が必要になる

## Open Questions
- なし

# delta-apply

## status
- APPLIED

## changed files
- runtime/agent-identity-store.js
- tests/unit/agent-identity-store.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260306-gate-rubric-contract.md

## applied AC
- AC-01: Gate の secondary file 名解決を `RUBRIC.md` に変更した
- AC-02: Gate 用 locale template を追加し、`initializeTemplates` 時に `RUBRIC.md` を生成するようにした
- AC-03: unit test に Gate の `RUBRIC.md` 保存/初期化検証を追加した
- AC-04: `spec.md` / `architecture.md` / `plan.md` に Gate 契約を反映した
- AC-05: 検証前提の delta 記録を追加した

## scope deviation
- Out of Scope への変更: No
- 補足: Gate 追加 UI や migration は実装していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `runtime/agent-identity-store.js` が Gate で `RUBRIC.md` を解決 |
| AC-02 | PASS | Gate 用 `RUBRIC` template builder を追加 |
| AC-03 | PASS | `node --test tests/unit/agent-identity-store.test.js` PASS |
| AC-04 | PASS | `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に Gate 契約を反映 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の有無: No
- 確認内容: Gate 追加 UI、Guide/Worker 契約、workspace 移行処理には変更を入れていない

## residual risks
- R-01: リポジトリ外の既存 Gate workspace に `ROLE.md` がある場合は別 delta で移行が必要

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
