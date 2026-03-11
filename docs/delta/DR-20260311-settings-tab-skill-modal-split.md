# DR-20260311-settings-tab-skill-modal-split

## Step 1: delta-request
- Delta Type: REPAIR
- In Scope:
  - `wireframe/settings-tab-render.js` から skill market / skill modal helper と event wiring を分離する
  - 新規 module `wireframe/settings-tab-skill-modal.js` を追加する
  - `wireframe/index.html` の script 読み込み順を更新する
  - `docs/architecture.md` と `docs/plan.md` を同期する
- Out of Scope:
  - Settings タブの表示仕様変更
  - skill market の検索/インストール仕様変更
  - resident / gate の振る舞い変更
  - `settings-state.js` の分割
- Acceptance Criteria:
  - `settings-tab-render.js` が 800 行未満になる
  - skill modal の表示と検索/インストール導線が回帰しない
  - static check が通る
  - targeted E2E が通る
  - delta validator が PASS

## Step 2: delta-apply
- `wireframe/settings-tab-render.js` から skill market / skill modal helper と event wiring を切り出した。
- 新規 module `wireframe/settings-tab-skill-modal.js` を追加した。
- `wireframe/index.html` に script 読み込みを追加した。
- `docs/architecture.md` と `docs/plan.md` を同期した。

## Step 3: delta-verify
- static:
  - `node --check wireframe/settings-tab-skill-modal.js wireframe/settings-tab-render.js wireframe/settings-tab.js`
  - PASS
- targeted e2e:
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model|settings save button is enabled only when changed and keeps unsaved state across tabs|settings footer reflects saving state and add form open state|settings skill search modal supports keyword search flow|settings tab supports skill uninstall and install|settings can sync built-in resident definitions to workspace"`
  - PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - PASS
- code size:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - target file `wireframe/settings-tab-render.js` は `793` 行で AC 内
  - 既存の split threshold 超過は scope 外

## Step 4: delta-archive
- archive result: PASS

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `docs/architecture.md`
  - plan: `docs/plan.md`

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
