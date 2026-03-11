# DR-20260311-workspace-layout-spec-split

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `tests/e2e/workspace-layout.spec.js` を thin entrypoint に縮小する
  - `workspace-layout.shared.js / guide.js / board.js / settings.js / profiles.js` を追加する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - E2E シナリオの意味変更
  - `language switch exists in settings tab` の既存不安定修正
  - 他の E2E ファイルの分割
- Acceptance Criteria:
  - `tests/e2e/workspace-layout.spec.js` が 200 行未満になる
  - 代表シナリオの targeted Playwright が PASS する
  - `project-validator` と `validate_delta_links` が PASS する

## Step 2: delta-apply
- `workspace-layout.spec.js` を viewport loop と registration だけの entrypoint に縮小した。
- `workspace-layout.shared.js` に fixture / mock / viewport 定義を移した。
- `workspace-layout.guide.js / board.js / settings.js / profiles.js` に責務ごとにテストを分離した。
- `docs/architecture.md` と `docs/plan.md` を最小同期した。

## Step 3: delta-verify
- AC result table:
  - `tests/e2e/workspace-layout.spec.js` が 200 行未満になる: PASS
  - 代表シナリオの targeted Playwright が PASS する: PASS
  - `project-validator` と `validate_delta_links` が PASS する: PASS
- static:
  - `node --check tests/e2e/workspace-layout.spec.js`
  - `node --check tests/e2e/workspace-layout.shared.js`
  - `node --check tests/e2e/workspace-layout.guide.js`
  - `node --check tests/e2e/workspace-layout.board.js`
  - `node --check tests/e2e/workspace-layout.settings.js`
  - `node --check tests/e2e/workspace-layout.profiles.js`
  - PASS
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide composer sticks to panel bottom|guide chat creates planned tasks and assigns workers|task detail drawer renders conversation log timeline|settings tab shows model list and allows adding model|pal list includes roles and allows name/model/tool settings"`
  - PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - PASS
- code size:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - `tests/e2e/workspace-layout.spec.js` は split threshold を下回った
  - `tests/e2e/workspace-layout.board.js` は引き続き split 候補
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `tests/e2e/workspace-layout.board.js` は引き続き split 候補
  - `language switch exists in settings tab` の既存不安定は別 delta で扱う

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: workspace layout E2E の責務分割を追記
  - plan: archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
