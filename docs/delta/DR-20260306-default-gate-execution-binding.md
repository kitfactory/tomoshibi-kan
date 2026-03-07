# delta-request

## Delta ID
- DR-20260306-default-gate-execution-binding

## Purpose
- `defaultGateId` を Task/Cron の Gate 実行経路へ接続し、target ごとの `gateProfileId` を解決・表示できるようにする。

## In Scope
- `wireframe/index.html` に Gate panel の Gate summary 表示を追加する
- `wireframe/app.js` に target 向け Gate profile 解決 helper を追加する
- `wireframe/app.js` の Task/Cron submit・resubmit・openGate で `gateProfileId` を解決して target に反映する
- `wireframe/app.js` の Task/Cron board row と Gate panel に `gateProfileId` / Gate 表示を出す
- `tests/e2e/workspace-layout.spec.js` に default gate が Task/Cron gate flow に反映されるシナリオを追加する
- `docs/plan.md` とこの delta を request/apply/verify/archive で閉じる

## Out of Scope
- Task/Job ごとの Gate override 編集 UI
- Gate runtime 実行ロジックそのもの
- `gateProfileId` の永続化
- `spec.md` / `architecture.md` の追加同期

## Acceptance Criteria
- AC-01: Task/Cron が `submit` または `openGate` を通ると、target の `gateProfileId` が `defaultGateId` もしくは既存の target-specific gate へ解決される
- AC-02: Task/Cron row は解決済み Gate を表示し、`data-gate-profile-id` を持つ
- AC-03: Gate panel は解決済み Gate を summary と `data-gate-profile-id` で表示する
- AC-04: Playwright で default gate を切り替えたあと、Task/Cron 両方の gate flow に同じ Gate が使われることを検証する
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- target state は in-memory のため、再起動後の `gateProfileId` 維持は別 delta が必要

## Open Questions
- target ごとの `gateProfileId` 編集 UI をいつ追加するかは次の Gate runtime/override delta で決める

# delta-apply

## status
- APPLIED

## changed files
- wireframe/index.html
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260306-default-gate-execution-binding.md

## applied AC
- AC-01: `assignGateProfileToTarget` と `resolveGateProfileForTarget` を追加し、submit/resubmit/openGate へ接続した
- AC-02: Task/Cron row に Gate summary と `data-gate-profile-id` を追加した
- AC-03: Gate panel に summary 表示と `data-gate-profile-id` を追加した
- AC-04: E2E に default gate の Task/Cron 反映ケースを追加した
- AC-05: plan と delta を更新した

## scope deviation
- Out of Scope への変更: No
- 補足: `gateProfileId` は in-memory state のみで、永続化は行っていない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の submit/resubmit/openGate が `assignGateProfileToTarget` を通る |
| AC-02 | PASS | Task/Cron row に `data-gate-profile-id` と Gate summary を追加し、E2E で確認 |
| AC-03 | PASS | Gate panel に `#gateProfileSummary` と `data-gate-profile-id` を追加し、E2E で確認 |
| AC-04 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "job board supports gate flow|gate reject uses templates and navigates to resubmit target|task board and gate expose visual state attributes|default gate is assigned to task and cron gate flow|guide and gate profiles can be added and selected"` PASS |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- 確認: Gate override 編集 UI、Gate runtime、永続化、正本同期は未変更

## residual risks
- R-01: `gateProfileId` は再起動で保持されない
- R-02: target-specific Gate 編集 UI がまだないため、現時点では default gate か既存 target state に依存する

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - `gateProfileId` 永続化と target-specific override UI は次 delta
