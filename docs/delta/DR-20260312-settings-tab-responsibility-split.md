# Delta Request: Settings Tab Responsibility Split

## Delta Type
- REFACTOR

## In Scope
- `wireframe/settings-tab.js` を support facade に縮小する
- `wireframe/settings-tab-workspace.js` と `wireframe/settings-tab-feedback.js` を `index.html` に配線する
- Settings render/control が既存 API で動くように compose する
- 最小の architecture / plan 同期を行う

## Out of Scope
- Settings UX の変更
- 新しい設定項目追加
- resident sync ロジック変更
- Slack / Channel 機能

## Acceptance Criteria
- `settings-tab.js` から workspace/progress/toast helper の重複実装が除去される
- `SettingsTabUi` は既存 consumer が参照する API を維持する
- Settings 関連 targeted Playwright が PASS する
- `project-validator` の `validate_delta_links` と `check_code_size` が PASS する

## Request Notes
- 既存の untracked delta
  - `DR-20260312-channel-slack-foundation.md`
  - `DR-20260312-guide-cron-triggered-task-execution.md`
  は今回の対象外として保持する

## Step 2: delta-apply
- changed files:
  - `wireframe/settings-tab.js`
  - `wireframe/settings-tab-workspace.js`
  - `wireframe/settings-tab-feedback.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - `settings-tab.js` を support facade に縮小
  - workspace/progress/toast helper を `settings-tab-workspace.js` / `settings-tab-feedback.js` に移動
  - `SettingsTabUi` の既存 consumer API を compose で維持
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `settings-tab.js` から workspace/progress/toast helper の重複実装が除去される: PASS
  - `SettingsTabUi` は既存 consumer が参照する API を維持する: PASS
  - Settings 関連 targeted Playwright が PASS する: PASS
  - `project-validator` の `validate_delta_links` と `check_code_size` が PASS する: PASS
- scope deviation:
  - なし
- verification commands:
  - `node --check wireframe/settings-tab-workspace.js`
  - `node --check wireframe/settings-tab-feedback.js`
  - `node --check wireframe/settings-tab.js`
  - `node --check wireframe/settings-tab-controls.js`
  - `node --check wireframe/settings-tab-render.js`
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings tab shows model list and allows adding model|settings save button is enabled only when changed and keeps unsaved state across tabs|settings footer reflects saving state and add form open state|settings can sync built-in resident definitions to workspace|settings skill search modal supports keyword search flow"`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - Settings render / action wiring の責務は今後も review 対象

## Canonical Sync
- synced docs:
  - concept: none
  - spec: none
  - architecture: `settings-tab.js` を facade、workspace/progress/toast helper を support module に分離した構成へ同期
  - plan: current から除外し archive に記録
