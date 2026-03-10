# DR-20260311-settings-tab-support-split

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/settings-tab.js` から Settings タブ描画本体を分離する
  - 新規 module `wireframe/settings-tab-render.js` を追加する
  - `wireframe/index.html` の script 読み込み順を更新する
  - `docs/architecture.md` と `docs/plan.md` を同期する
  - `settings-tab.js` を 1000 行未満へ落とす
- Out of Scope:
  - Settings タブの表示仕様変更
  - resident / gate の振る舞い変更
  - progress log schema の変更
  - `runtime/settings-store.js` の分割
- Acceptance Criteria:
  - `settings-tab.js` から描画本体が外れ、support/helper 中心になる
  - `settings-tab.js` の行数が 1000 未満になる
  - static check が通る
  - targeted E2E が通る
  - delta validator が PASS
  - `project-validator` のコードサイズ確認で `settings-tab.js` の悪化が無い

## Step 2: delta-apply
- `renderSettingsTab()` 本体を `wireframe/settings-tab-render.js` へ移し、`settings-tab.js` は helper API と thin wrapper を持つ形へ変更した。
- `wireframe/index.html` に `settings-tab-render.js` の script 読み込みを追加した。
- `docs/architecture.md` に `settings-tab.js` と `settings-tab-render.js` の責務を追記した。

## Step 3: delta-verify
- AC result table:
  - `settings-tab.js` から描画本体が外れ、support/helper 中心になる: PASS
  - `settings-tab.js` の行数が 1000 未満になる: PASS
  - static check が通る: PASS
  - targeted E2E が通る: PASS
  - delta validator が PASS: PASS
  - `project-validator` のコードサイズ確認で `settings-tab.js` の悪化が無い: PASS
- static:
  - `node --check wireframe/settings-tab.js`
  - `node --check wireframe/settings-tab-render.js`
  - `node --check wireframe/app.js`
  - PASS
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings footer reflects saving state and add form open state|settings skill search modal supports keyword search flow|settings can sync built-in resident definitions to workspace|settings context handoff policy persists and shapes worker payload"`
  - PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - PASS
- code size:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - `settings-tab.js` は `680` 行、`settings-tab-render.js` は `929` 行
  - `settings-tab.js` は split threshold を下回った
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `settings-tab-render.js` は `929` 行で split threshold を超えるため、次段の分割対象
  - `runtime/settings-store.js` と `settings-state.js` も継続して split 対象

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `settings-tab.js` と `settings-tab-render.js` の責務分離を追記
  - plan: current から archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
