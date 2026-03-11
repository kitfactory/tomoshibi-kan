# DR-20260312-settings-tab-render-controls-split

## delta-request
- Delta Type: REFACTOR
- In Scope:
  - `settings-tab-render.js` から DOM controls binding を切り出す
  - `settings-tab-controls.js` を追加する
  - script load と architecture / plan を最小同期する
- Out of Scope:
  - Settings UI の見た目変更
  - Settings state / persistence 契約変更
  - skill modal の挙動変更
- Acceptance Criteria:
  - `settings-tab-render.js` は render 本体に責務を絞る
  - controls binding は新 module に移る
  - 既存 Settings の targeted E2E が PASS する

## delta-apply
- `settings-tab-controls.js` を追加し、Settings タブの DOM event binding と add/save flow を移した
- `settings-tab-render.js` は HTML render と controls binder 呼び出しだけに整理した
- `index.html` と `architecture.md` を同期した

## delta-verify
- `node --check wireframe/settings-tab-controls.js wireframe/settings-tab-render.js wireframe/settings-tab.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings footer reflects saving state and add form open state|settings can sync built-in resident definitions to workspace|settings skill search modal supports keyword search flow"`
- `node C:\\Users\\kitad\\.codex\\skills\\project-validator\\scripts\\validate_delta_links.js --dir .`
- verify結果: PASS

## delta-archive
- Status: PASS
- Summary:
  - `settings-tab-render.js` の render / controls 責務を分離した
  - Settings の targeted E2E を維持した
