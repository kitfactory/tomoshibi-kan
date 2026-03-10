# DR-20260311-execution-runtime-split

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/execution-runtime.js` を責務別 module へ分割する
  - 少なくとも次の責務を切り出す
    - resident routing / replan helper
    - plan artifact materialization helper
    - gate review / worker execution bridge
  - browser script wiring を更新する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - resident routing の挙動変更
  - gate / worker / guide の仕様変更
  - `runtime/palpal-core-runtime.js` の分割
  - 新しい E2E シナリオ追加
- Acceptance Criteria:
  - `wireframe/execution-runtime.js` が 1000 行未満になる
  - 分割後も `window.ExecutionRuntimeUi` の公開 API は維持される
  - targeted verify が PASS する
  - `project-validator` と `validate_delta_links` が PASS する

## Step 2: delta-apply
- `wireframe/execution-runtime-routing.js`、`wireframe/execution-runtime-plan.js`、`wireframe/execution-runtime-review.js` を追加し、routing / plan / review bridge を分離した。
- `wireframe/execution-runtime.js` は facade と共通 conversation helper のみを残し、各 module へ委譲する形へ置き換えた。
- `wireframe/index.html` の script wiring を更新した。
- `docs/architecture.md` と `docs/plan.md` を最小同期した。

## Step 3: delta-verify
- AC result table:
  - `wireframe/execution-runtime.js` が 1000 行未満になる: PASS
  - 分割後も `window.ExecutionRuntimeUi` の公開 API は維持される: PASS
  - targeted verify が PASS する: PASS
  - `project-validator` と `validate_delta_links` が PASS する: PASS
- static:
  - `node --check wireframe/execution-runtime-routing.js wireframe/execution-runtime-plan.js wireframe/execution-runtime-review.js wireframe/execution-runtime.js wireframe/app.js`
  - PASS
- targeted unit:
  - `node --test tests/unit/plan-orchestrator.test.js tests/unit/agent-routing.test.js`
  - PASS
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "worker runtime receives structured handoff payload|job board supports gate flow|task detail drawer renders conversation log timeline|guide progress query reports completed task without model call"`
  - PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - PASS
- code size:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - `execution-runtime.js` は `312` 行
  - repo 既存の size threshold 超過は残るが、今回差分の split threshold は解消
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `settings-state.js` と `settings-store.js` は引き続き split 候補
  - `execution-runtime-review.js` は今後の責務増加に応じて再分割候補

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: execution runtime の facade / routing / plan / review 分離を追記
  - plan: current から archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
