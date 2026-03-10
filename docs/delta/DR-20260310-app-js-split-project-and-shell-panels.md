# DR-20260310-app-js-split-project-and-shell-panels

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/app.js` から resident panel / workspace shell / project tab の UI helper をそれぞれ module へ分割する
  - `wireframe/index.html` と `docs/architecture.md` を最小同期する
- Out of Scope:
  - resident / project / workspace の仕様変更
  - Guide / Orchestrator / routing の挙動変更
- Acceptance Criteria:
  - resident panel / workspace shell / project tab の描画 helper が `app.js` から除去され、新 module 経由で呼ばれる
  - Project タブ、住人一覧、workspace shell の既存 UI が既存どおり動く
  - targeted static / E2E / validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/resident-panel.js`
  - `wireframe/workspace-shell.js`
  - `wireframe/project-tab.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - `wireframe/resident-panel.js` を追加し、住人一覧・住人設定 modal・identity editor modal の UI helper を移動した
  - `wireframe/workspace-shell.js` を追加し、workspace shell 全体のタブ描画と i18n 再描画 wiring を移動した
  - `wireframe/project-tab.js` を追加し、Project タブ描画と project state helper を移動した
  - `wireframe/app.js` から上記 block を削除した
  - `wireframe/index.html` に新 module を追加した
  - `docs/architecture.md` に helper module を追記した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - resident panel / workspace shell / project tab の描画 helper が `app.js` から除去され、新 module 経由で呼ばれる: PASS
  - Project タブ、住人一覧、workspace shell の既存 UI が既存どおり動く: PASS
  - targeted static / E2E / validator が PASS する: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `app.js` は 5954 行あり、引き続き guide / orchestrator / board 系の追加分割が必要

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `resident-panel.js` / `workspace-shell.js` / `project-tab.js` を renderer helper 一覧へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node --check wireframe/resident-panel.js`
- `node --check wireframe/workspace-shell.js`
- `node --check wireframe/project-tab.js`
- `node --check wireframe/app.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "project tab supports add and /use focus switch|guide prompts project setup before starting a new project request|guide prompts project setup before planning when no project is focused|guide chat supports @ completion with focus and project:file|settings tab shows model list and allows adding model|settings save button is enabled only when changed and keeps unsaved state across tabs|settings footer reflects saving state and add form open state|settings skill search modal supports keyword search flow|settings can sync built-in resident definitions to workspace|pal list includes roles and allows name/model/tool settings|identity files can be edited from pal settings modal"`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
