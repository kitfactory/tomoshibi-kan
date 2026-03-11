# DR-20260311-ui-core-seed-copy-event-split

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/ui-core.js` から prototype seed を `ui-prototype-seeds.js` へ分離する
  - `wireframe/ui-core.js` から `tUi / tDyn` を `ui-copy.js` へ分離する
  - `wireframe/ui-core.js` から event helper を `ui-event-log.js` へ分離する
  - `wireframe/index.html` の script order を更新する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - 挙動変更
  - seed 内容の変更
  - Settings / resident / runtime の追加分割
- Acceptance Criteria:
  - `ui-prototype-seeds.js` が localStorage key と initial seed を持つ
  - `ui-copy.js` が `tUi / tDyn` を持つ
  - `ui-event-log.js` が event helper を持つ
  - `ui-core.js` が mutable state/bootstrap 中心になっている
  - targeted verify と validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/ui-prototype-seeds.js`
  - `wireframe/ui-copy.js`
  - `wireframe/ui-event-log.js`
  - `wireframe/ui-core.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - prototype seed と localStorage key を `ui-prototype-seeds.js` へ切り出した
  - `tUi / tDyn` を `ui-copy.js` へ切り出した
  - event helper を `ui-event-log.js` へ切り出した
  - `ui-core.js` を mutable state/bootstrap 中心へ縮小した
  - `index.html` の script order を更新した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `ui-prototype-seeds.js` が localStorage key と initial seed を持つ: PASS
  - `ui-copy.js` が `tUi / tDyn` を持つ: PASS
  - `ui-event-log.js` が event helper を持つ: PASS
  - `ui-core.js` が mutable state/bootstrap 中心になっている: PASS
  - targeted verify と validator が PASS する: PASS
- verify commands:
  - `node --check wireframe/ui-prototype-seeds.js`
  - `node --check wireframe/ui-copy.js`
  - `node --check wireframe/ui-event-log.js`
  - `node --check wireframe/ui-core.js`
  - `npx playwright test tests/e2e/workspace-layout.settings.js -g "settings tab shows model list and allows adding model" tests/e2e/workspace-layout.board-flow.js -g "task detail drawer renders conversation log timeline|guide progress query reports completed task without model call" tests/e2e/workspace-layout.guide.js -g "guide chat resumes after registering model in settings"`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `ui-core.js` は mutable state/bootstrap に縮小したが、次段の責務 split は継続する

## Canonical Sync
- synced docs:
  - architecture: `ui-prototype-seeds.js` / `ui-copy.js` / `ui-event-log.js` を renderer helper 一覧へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
