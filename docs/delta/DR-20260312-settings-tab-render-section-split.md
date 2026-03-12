# DR-20260312-settings-tab-render-section-split

## delta-request
- Delta Type: REFACTOR
- In Scope:
  - `wireframe/settings-tab-render.js` から labels/list/form/shell markup 生成を切り出す
  - `wireframe/settings-tab-markup.js` を追加し、Settings render の section builder を集約する
  - `settings-tab-render.js` を context 準備と `bindSettingsTabControls` 呼び出し中心に縮小する
  - 最小の `index.html` / `architecture.md` / `plan.md` 同期を行う
- Out of Scope:
  - Settings UX の変更
  - 新しい設定項目追加
  - event wiring の仕様変更
  - Channel / Slack 機能
- Acceptance Criteria:
  - `settings-tab-render.js` から labels 定義と `root.innerHTML` の巨大組み立てが除去される
  - `settings-tab-markup.js` に Settings shell markup の責務が集約される
  - Settings 関連 targeted Playwright が PASS する
  - `project-validator` の `check_code_size` と `validate_delta_links` が PASS する

## delta-apply
- `wireframe/settings-tab-markup.js` を追加し、labels/list/form/shell markup 生成を集約した
- `wireframe/settings-tab-render.js` は context 準備と controls binder 呼び出し中心に縮小した
- `wireframe/index.html` と `docs/architecture.md` を新 module 前提に同期した

## delta-verify
- `node --check wireframe/settings-tab-markup.js wireframe/settings-tab-render.js wireframe/settings-tab.js wireframe/settings-tab-controls.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings tab shows model list and allows adding model|settings save button is enabled only when changed and keeps unsaved state across tabs|settings footer reflects saving state and add form open state|settings can sync built-in resident definitions to workspace|settings skill search modal supports keyword search flow"`
- `node C:\\Users\\kitad\\.codex\\skills\\project-validator\\scripts\\check_code_size.js --dir .`
- `node C:\\Users\\kitad\\.codex\\skills\\project-validator\\scripts\\validate_delta_links.js --dir .`
- verify結果: PASS

## delta-archive
- Status: PASS
- Summary:
  - Settings shell markup を `settings-tab-markup.js` へ分離し、`settings-tab-render.js` の責務を縮小した
  - Settings の targeted E2E と validator を維持した
