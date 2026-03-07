# delta-request

## Delta ID
- DR-20260306-soul-md-fallback-removal

## Purpose
- `SOUL.md` が既存ワークスペースに存在し、`soul.md` 実ファイルが存在しない前提に合わせて、Agent Identity の lowercase fallback を削除する。

## In Scope
- `runtime/agent-identity-store.js` から `soul.md` 読み取り fallback を削除する
- `tests/unit/agent-identity-store.test.js` から lowercase fallback 検証を削除する
- `docs/architecture.md` と `docs/plan.md` に今回の契約変更を反映する
- `docs/delta/DR-20260306-soul-md-fallback-removal.md` を request/apply/verify/archive で完結させる

## Out of Scope
- `SOUL.md` 命名そのものの再変更
- `role.md` / `skills.yaml` / `user.md` の命名変更
- 既存 archive 済み delta 文書の歴史記述の修正

## Acceptance Criteria
- AC-01: `runtime/agent-identity-store.js` は `SOUL.md` のみを読み書きする
- AC-02: unit test は `SOUL.md` 保存契約のみを検証し、全件 PASS する
- AC-03: `docs/architecture.md` と `docs/plan.md` に fallback 削除が反映されている
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- もし外部ワークスペースに実ファイル `soul.md` が残っていた場合、そのままでは読めなくなる

## Open Questions
- なし

# delta-apply

## status
- APPLIED

## changed files
- runtime/agent-identity-store.js
- tests/unit/agent-identity-store.test.js
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260306-soul-md-fallback-removal.md

## applied AC
- AC-01: `AgentIdentityStore` の `soul.md` fallback 読み込みを削除した
- AC-02: lowercase fallback 用 unit test を削除し、`SOUL.md` 契約のみを残した
- AC-03: `architecture.md` と `plan.md` に fallback 削除を反映した
- AC-04: 検証前提の delta 記録を追加した

## scope deviation
- Out of Scope への変更: No
- 補足: 命名契約自体は `SOUL.md` のまま維持し、他ファイル名や UI は変更していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `runtime/agent-identity-store.js` が `SOUL.md` のみを解決 |
| AC-02 | PASS | `node --test tests/unit/agent-identity-store.test.js` PASS |
| AC-03 | PASS | `docs/architecture.md` と `docs/plan.md` に fallback 削除を反映 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の有無: No
- 確認内容: `SOUL.md` 命名、他 Markdown 契約、UI 仕様には変更を入れていない

## residual risks
- R-01: リポジトリ外の古い workspace に `soul.md` が残っている場合は別途移行が必要

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
