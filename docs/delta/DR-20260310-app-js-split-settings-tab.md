# DR-20260310-app-js-split-settings-tab

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/app.js` から Settings タブ描画ロジックを `wireframe/settings-tab.js` へ分割する
  - `renderSettingsTab` と item-draft/model-option helper を module 化する
  - `wireframe/index.html` と `docs/architecture.md` を最小同期する
- Out of Scope:
  - settings persistence / storage schema の変更
  - resident identity sync の仕様変更
  - Guide / Orchestrator / routing の挙動変更
- Acceptance Criteria:
  - `renderSettingsTab` 本体が `app.js` から除去され、新 module 経由で呼ばれる
  - Settings 画面の save / model add / tool add / skill modal / resident sync が既存どおり動く
  - targeted static / E2E / validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/settings-tab.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - `wireframe/settings-tab.js` を追加し、`renderSettingsTab` と item-draft/model-option helper を移動した
  - `wireframe/app.js` から Settings block を削除した
  - `wireframe/index.html` に `settings-tab.js` を追加した
  - `docs/architecture.md` に helper module を追記した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `renderSettingsTab` 本体が `app.js` から除去され、新 module 経由で呼ばれる: PASS
  - Settings 画面の save / model add / tool add / skill modal / resident sync が既存どおり動く: PASS
  - targeted static / E2E / validator が PASS する: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `settings-tab.js` 自体はまだ 1577 行あり、次段の分割候補として残る

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `settings-tab.js` を renderer helper 一覧へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node --check wireframe/settings-tab.js`
- `node --check wireframe/app.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings tab shows model list and allows adding model|settings save button is enabled only when changed and keeps unsaved state across tabs|settings footer reflects saving state and add form open state|settings skill search modal supports keyword search flow|settings can sync built-in resident definitions to workspace|pal list includes roles and allows name/model/tool settings|identity files can be edited from pal settings modal"`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
