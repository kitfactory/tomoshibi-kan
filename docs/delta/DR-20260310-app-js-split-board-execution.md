# DR-20260310-app-js-split-board-execution

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/app.js` から Task/Job の action 実行、Gate panel 開閉、Gate decision 適用、auto execution の UI helper を `wireframe/board-execution.js` へ分割する
  - `wireframe/index.html` と `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - board status / progress log schema の変更
  - Guide planning / parser / routing の変更
  - Gate runtime suggestion の仕様変更
- Acceptance Criteria:
  - `runTaskAction` / `runJobAction` / `openGate` / `closeGate` / `runGate` / `autoExecuteTarget` / `queueAutoExecutionForCreatedTargets` が `app.js` から除去され、新 module 経由で呼ばれる
  - Task/Job の dispatch -> gate -> replan_required / done の既存 UI フローが変わらない
  - targeted static / E2E / project-validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/board-execution.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - `wireframe/board-execution.js` を追加し、Task/Job の action 実行、Gate panel 開閉、Gate decision 適用、auto execution queue を移動した
  - `wireframe/app.js` から上記 block を削除し、新 module API 経由の呼び出しに切り替えた
  - `wireframe/index.html` に `board-execution.js` を追加した
  - `docs/architecture.md` に helper module を追記した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `runTaskAction` / `runJobAction` / `openGate` / `closeGate` / `runGate` / `autoExecuteTarget` / `queueAutoExecutionForCreatedTargets` が `app.js` から除去され、新 module 経由で呼ばれる: PASS
  - Task/Job の dispatch -> gate -> replan_required / done の既存 UI フローが変わらない: PASS
  - targeted static / E2E / project-validator が PASS する: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `app.js` は 5231 行あり、引き続き board 以外の guide / settings / project wiring 分割が必要

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `board-execution.js` を renderer helper 一覧へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node --check wireframe/board-execution.js`
- `node --check wireframe/app.js`
- `node --check wireframe/settings-tab.js`
- `node --check wireframe/project-tab.js`
- `node --check wireframe/workspace-shell.js`
- `node --check wireframe/resident-panel.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "job board supports gate flow|task detail drawer renders conversation log timeline|guide progress query reports completed task without model call|settings can sync built-in resident definitions to workspace|settings footer reflects saving state and add form open state|settings skill search modal supports keyword search flow"`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
