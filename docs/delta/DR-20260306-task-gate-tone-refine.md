# delta-request

## Delta ID
- DR-20260306-task-gate-tone-refine

## Purpose
- `Task Board / Gate` を `温かみと知性` のうち、運用面の `静けさ / 精度 / 厳密さ` 側へ寄せる。既存フローは維持し、カード選択、detail drawer、gate panel、判定ボタンの見え方を整理する。

## In Scope
- `wireframe/styles.css` の task/job row、status badge、detail drawer、gate overlay/modal、gate template button のスタイルを調整する
- `wireframe/app.js` を更新し、task/job row、drawer、gate panel に状態を示す DOM 属性や class を追加する
- `tests/e2e/workspace-layout.spec.js` に Task / Gate の状態表現確認を追加する
- `docs/plan.md` に今回の seed/archive を反映する

## Out of Scope
- Task / Job / Gate の状態遷移や判定ロジックの変更
- Event Log や Cron のトーン調整
- 文言変更やデータ項目の再設計

## Acceptance Criteria
- AC-01: Task / Job row の面と status badge が、既存よりも静かで厳密な見た目になっている
- AC-02: 選択中 row、detail drawer、gate panel に DOM 状態が反映され、視覚的な主従が強化されている
- AC-03: gate panel の approve / reject / template 周辺が、判定操作として明確に見える
- AC-04: `workspace-layout` の Task / Gate 系 Playwright と新規 UI 状態確認が PASS する
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- row 状態 class の変更で既存 selector が崩れる可能性がある
- gate panel の overlay 調整がモーダル視認性に影響する可能性がある

## Open Questions
- なし

# delta-apply

## status
- APPLIED

## changed files
- wireframe/index.html
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260306-task-gate-tone-refine.md

## applied AC
- AC-01: task/job row、status badge、drawer、gate modal のスタイルを調整し、運用面の静けさと厳密さを強めた
- AC-02: task row、detail drawer、gate panel に `data-board-state` / `data-detail-state` / `data-gate-state` / `data-gate-kind` を追加し、状態を DOM に反映した
- AC-03: gate panel の overlay、template box、approve/reject ボタン周辺を整理し、判定操作の主従を強めた
- AC-04: `tests/e2e/workspace-layout.spec.js` に Task / Gate の状態確認を追加し、既存シナリオと合わせて回帰確認できるようにした
- AC-05: `docs/plan.md` に今回の seed/archive を反映する

## scope deviation
- Out of Scope への変更: No
- 補足: Task / Job / Gate の見た目と状態表現に限定し、状態遷移や判定ロジックは変更していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/styles.css` の task/job row、drawer、gate modal のスタイルを更新 |
| AC-02 | PASS | `wireframe/index.html` / `wireframe/app.js` に `data-detail-state` / `data-gate-state` / `data-gate-kind` / `data-board-state` を追加 |
| AC-03 | PASS | `wireframe/styles.css` の gate overlay、template box、action button の見え方を調整 |
| AC-04 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "task detail drawer is visible only on task tab|job board supports gate flow|gate reject uses templates and navigates to resubmit target|task board and gate expose visual state attributes"` が 12 passed |
| AC-05 | PASS | `node --check wireframe/app.js` PASS、`node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の有無: No
- 確認内容: Task / Job / Gate のロジック、Event Log、Cron には変更を入れていない

## residual risks
- R-01: 運用面トーンの最終評価は実機確認が必要で、今回の検証は DOM 状態と E2E 回帰まで

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
