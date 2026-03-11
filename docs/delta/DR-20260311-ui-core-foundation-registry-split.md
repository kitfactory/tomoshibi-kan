# DR-20260311-ui-core-foundation-registry-split

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/ui-core.js` から generic helper を `ui-foundation.js` へ分離する
  - `wireframe/ui-core.js` から runtime/model/tool/skill registry を `ui-runtime-registry.js` へ分離する
  - `wireframe/ui-core.js` を state/bootstrap 中心へ縮小する
  - `wireframe/index.html` の script 読み込み順を更新する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - 挙動変更
  - state/bootstrap 自体の更なる再分割
  - `settings-tab.js` / `ui-core.js` 以外の別責務 split
- Acceptance Criteria:
  - `ui-foundation.js` が generic helper を持つ
  - `ui-runtime-registry.js` が runtime/provider/model/tool/skill registry を持つ
  - `ui-core.js` から上記責務が除去されている
  - UI 挙動に回帰がない
  - targeted verify と validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/ui-foundation.js`
  - `wireframe/ui-runtime-registry.js`
  - `wireframe/ui-core.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - generic helper を `ui-foundation.js` へ切り出した
  - runtime/provider/model/tool/skill registry を `ui-runtime-registry.js` へ切り出した
  - `ui-core.js` を state/bootstrap 中心へ縮小した
  - `index.html` の script order を更新した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `ui-foundation.js` が generic helper を持つ: PASS
  - `ui-runtime-registry.js` が runtime/provider/model/tool/skill registry を持つ: PASS
  - `ui-core.js` から上記責務が除去されている: PASS
  - UI 挙動に回帰がない: PASS
  - targeted verify と validator が PASS する: PASS
- verify commands:
  - `node --check wireframe/ui-foundation.js`
  - `node --check wireframe/ui-runtime-registry.js`
  - `node --check wireframe/ui-core.js`
  - `npx playwright test tests/e2e/workspace-layout.settings.js -g "settings tab shows model list and allows adding model"`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `ui-core.js` には prototype seed / copy / event helper が残るため次の split delta が必要

## Canonical Sync
- synced docs:
  - architecture: `ui-foundation.js` / `ui-runtime-registry.js` を renderer helper 一覧へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
