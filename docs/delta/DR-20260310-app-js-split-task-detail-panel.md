# Delta ID
- DR-20260310-app-js-split-task-detail-panel

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/app.js` から task detail panel の描画責務を切り出す
  - `renderDetail / bindDetailButtons / touchTask / touchJob / selectedTask` を新 module へ移す
  - `index.html` と `architecture.md` の参照を同期する
  - `docs/plan.md` に current/archive を反映する
- Out of Scope:
  - task detail の UI 仕様変更
  - progress log の文言変更
  - board execution / orchestrator / settings の分割
- Acceptance Criteria:
  - `app.js` から task detail panel 描画本体が削除される
  - 新 module から task detail render/bind helper を参照できる
  - task detail の targeted E2E が PASS
  - validator が `errors=0, warnings=0`

## Step 2: delta-apply
- changed files:
  - `wireframe/task-detail-panel.js`
  - `wireframe/app.js`
  - `wireframe/workspace-shell.js`
  - `wireframe/board-execution.js`
  - `wireframe/settings-tab.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - `wireframe/task-detail-panel.js` を追加し、`selectedTask / renderDetail / bindDetailButtons / touchTask / touchJob` を移動した
  - `wireframe/app.js` から task detail panel 描画本体と状態更新 helper を削除し、新 module API 経由に切り替えた
  - `wireframe/workspace-shell.js` と `wireframe/board-execution.js` の direct call を new module API に切り替えた
  - `wireframe/index.html` に `task-detail-panel.js` を追加した
  - `wireframe/settings-tab.js` に task progress append helper の legacy alias を追加し、既存 E2E 互換を維持した
  - `docs/architecture.md` と `docs/plan.md` を同期した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `app.js` から task detail panel 描画本体が削除される: PASS
  - 新 module から task detail render/bind helper を参照できる: PASS
  - task detail の targeted E2E が PASS: PASS
  - validator が `errors=0, warnings=0`: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `app.js` はなお約 5.5k 行で、Guide progress / approval / query などの追加分割が必要

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `task-detail-panel.js` を renderer helper 一覧へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node --check wireframe/task-detail-panel.js`
- `node --check wireframe/app.js`
- `node --check wireframe/workspace-shell.js`
- `node --check wireframe/board-execution.js`
- `node --check wireframe/settings-tab.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "task detail drawer renders conversation log timeline|job board supports gate flow|guide progress query reports completed task without model call|task detail conversation log applies progress voice per actor"`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
