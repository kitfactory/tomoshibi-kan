# delta-request

## Delta ID
- DR-20260306-board-state-gate-profile-persistence

## Purpose
- `gateProfileId` を再読み込み後も維持するため、prototype の Task/Cron board state を localStorage snapshot へ保存・復元する。

## In Scope
- `wireframe/app.js` に board state snapshot（`tasks / jobs / selectedTaskId`）の build/read/write/apply を追加する
- `wireframe/app.js` の board state 更新経路で snapshot を保存する
- `wireframe/app.js` の init で board state snapshot を復元する
- `tests/e2e/workspace-layout.spec.js` に reload 後も Task/Cron の `gateProfileId` と Gate 表示が残る検証を追加する
- `docs/plan.md` とこの delta を request/apply/verify/archive で閉じる

## Out of Scope
- Event Log の永続化
- `gateProfileId` の SQLite 永続化
- target-specific Gate override UI
- `spec.md` / `architecture.md` の同期

## Acceptance Criteria
- AC-01: board state snapshot が `tasks / jobs / selectedTaskId` を localStorage に保存・復元する
- AC-02: Task/Cron の `gateProfileId` が reload 後も維持される
- AC-03: 既存 gate flow E2E が回帰しない
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- board state 全体を localStorage に置くため、将来 SQLite 側永続化へ移す際に移行 delta が必要

## Open Questions
- board state を Electron 側保存へ寄せるかは後続 delta で判断する

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260306-board-state-gate-profile-persistence.md

## applied AC
- AC-01: board state snapshot build/read/write/apply を追加し、mutation 経路へ保存を接続した
- AC-02: default gate E2E に reload 後の維持確認を追加した
- AC-03: 既存 gate flow の対象 Playwright を回した
- AC-04: plan と delta を更新した

## scope deviation
- Out of Scope への変更: No
- 補足: persistence は localStorage のみで、Electron/SQLite への昇格はしていない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` に `BOARD_STATE_LOCAL_STORAGE_KEY` と board snapshot build/read/write/apply を追加 |
| AC-02 | PASS | `tests/e2e/workspace-layout.spec.js` の `default gate is assigned to task and cron gate flow` で reload 後も `data-gate-profile-id` を検証 |
| AC-03 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "default gate is assigned to task and cron gate flow|guide and gate profiles can be added and selected|job board supports gate flow|task board and gate expose visual state attributes"` PASS |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- 確認: Event Log、SQLite 永続化、override UI、正本同期は未変更

## residual risks
- R-01: localStorage snapshot のため、大きな board state では将来保存方式の見直しが必要

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - board state persistence を SQLite/Electron 側へ寄せるかは別 delta
