# DR-20260310-app-js-split-runtime-payloads

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/app.js` から Guide/Worker/Gate の runtime payload helper 群を切り出す
  - `resolveContextHandoffPolicy` から `parseGateRuntimeResponse` までの payload/build/parse helper を新 module へ移す
  - `wireframe/index.html` と `docs/architecture.md` の参照を同期する
  - `docs/plan.md` に current/archive を反映する
- Out of Scope:
  - runtime payload の仕様変更
  - Guide/Worker/Gate の routing ロジック変更
  - auto execution / progress log / task detail UI の変更
  - `settings-tab.js` や `settings-store.js` の分割
- Acceptance Criteria:
  - `app.js` から対象 helper 群が削除される
  - 新 module API 経由で Guide/Worker/Gate の payload 生成が継続する
  - targeted E2E が PASS
  - delta validator が PASS
  - `project-validator` のコードサイズ確認で `app.js` の行数が悪化せず、分割が前進している

## Step 2: delta-apply
- changed files:
  - `wireframe/runtime-payloads.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - Guide/Worker/Gate の runtime payload helper 群を `wireframe/runtime-payloads.js` へ切り出した
  - `wireframe/app.js` は context builder と thin wrapper だけを残し、既存 call site を維持した
  - `index.html` に `runtime-payloads.js` の読み込みを追加した
  - `architecture.md` と `plan.md` を split 結果に同期した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `app.js` から対象 helper 群が削除される: PASS
  - 新 module API 経由で Guide/Worker/Gate の payload 生成が継続する: PASS
  - targeted E2E が PASS: PASS
  - delta validator が PASS: PASS
  - `project-validator` のコードサイズ確認で `app.js` の行数が悪化せず、分割が前進している: PASS
- static:
  - `node --check wireframe/runtime-payloads.js`: PASS
  - `node --check wireframe/app.js`: PASS
- targeted unit:
  - `node --test tests/unit/plan-orchestrator.test.js tests/unit/agent-routing.test.js`: PASS
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "worker runtime receives structured handoff payload|job board supports gate flow|task detail drawer renders conversation log timeline|guide progress query reports completed task without model call"`: PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`: PASS
- project-validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`: REVIEWED
  - `wireframe/app.js` は `5413 -> 5031` 行へ減少し、この delta で悪化していない
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `app.js` は依然 `5031` 行あり、次段の split delta が必要
  - `runtime/settings-store.js` と `wireframe/settings-tab.js` も継続して split 対象

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `runtime-payloads.js` を renderer helper 一覧へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
