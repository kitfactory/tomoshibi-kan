# DR-20260310-app-js-split-execution-runtime

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/app.js` から execution runtime / settings-state / workspace-agent-state の責務を分離する
  - 新規 module を追加し、`worker_runtime / gate runtime / replan / progress narration / settings state / resident profile・workspace state helper` を移す
  - `wireframe/index.html` の script 読み込みを更新する
  - `docs/architecture.md` と `docs/plan.md` の参照を同期する
  - `app.js` を 2000 行未満へ落とす
- Out of Scope:
  - routing ロジック変更
  - task detail 表示仕様の変更
  - resident `SOUL/ROLE` の変更
  - 文言改善や mojibake 修復
- Acceptance Criteria:
  - `app.js` から対象責務が外れ、thin wrapper か module 呼び出しになる
  - `app.js` の行数が 2000 未満になる
  - static check が通る
  - targeted test が通る
  - delta validator が PASS
  - `project-validator` のコードサイズ確認で `app.js` の悪化が無い

## Step 2: delta-apply
- changed files:
  - `wireframe/execution-runtime.js`
  - `wireframe/settings-state.js`
  - `wireframe/workspace-agent-state.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - execution runtime helper を `execution-runtime.js` へ切り出した
  - settings persistence / local snapshot helper を `settings-state.js` へ切り出した
  - resident profile / board snapshot / runtime/profile resolution helper を `workspace-agent-state.js` へ切り出した
  - `app.js` を thin wrapper と wiring に縮小し、`3205 -> 1973` 行へ削減した
  - `index.html` と `architecture.md` を module 構成へ同期した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `app.js` から対象責務が外れ、thin wrapper か module 呼び出しになる: PASS
  - `app.js` の行数が 2000 未満になる: PASS
  - static check が通る: PASS
  - targeted test が通る: PASS
  - delta validator が PASS: PASS
  - `project-validator` のコードサイズ確認で `app.js` の悪化が無い: PASS
- static:
  - `node --check wireframe/execution-runtime.js wireframe/settings-state.js wireframe/workspace-agent-state.js wireframe/app.js`: PASS
- targeted unit:
  - `node --test tests/unit/plan-orchestrator.test.js tests/unit/agent-routing.test.js`: PASS
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "worker runtime receives structured handoff payload|job board supports gate flow|task detail drawer renders conversation log timeline|guide progress query reports completed task without model call"`: PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`: PASS
- project-validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`: REVIEWED
  - `app.js` は `3205 -> 1973` 行へ減少し、この delta で悪化していない
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `wireframe/settings-state.js` と `wireframe/workspace-agent-state.js` は依然大きく、次段 split 対象
  - `app.js` は後続 split でさらに縮小を継続

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: execution runtime / settings-state / workspace-agent-state module を renderer helper 構成へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
