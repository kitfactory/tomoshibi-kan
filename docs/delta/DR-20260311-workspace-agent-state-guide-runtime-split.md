# DR-20260311-workspace-agent-state-guide-runtime-split

## Step 1: delta-request
- Delta Type: REPAIR
- In Scope:
  - `wireframe/workspace-agent-state.js` から Guide/runtime/context helper を新 module へ分離する
  - `workspace-agent-guide-runtime.js` が split threshold を超える場合は、assignment / runtime execution helper を別 module へ再分離する
  - `WorkspaceAgentStateUi` の public API を維持する
  - `index.html` の script 読み込みを更新する
  - `architecture.md` と `plan.md` を最小同期する
- Out of Scope:
  - helper の挙動変更
  - `app.js` の新規分割
  - resident routing / Guide plan ロジック変更
- Acceptance Criteria:
  - `workspace-agent-state.js` が split threshold (`<= 800`) を満たす
  - `workspace-agent-guide-runtime.js` と `workspace-agent-assignment.js` が split threshold (`<= 800`) を満たす
  - `WorkspaceAgentStateUi` の public API 名は維持される
  - static / targeted unit / validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/workspace-agent-state.js`
  - `wireframe/workspace-agent-guide-runtime.js`
  - `wireframe/workspace-agent-assignment.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - Guide/runtime/context helper を `workspace-agent-guide-runtime.js` へ分離
  - assignment / runtime execution helper を `workspace-agent-assignment.js` へ再分離
  - `workspace-agent-state.js` を state facade と built-in resident sync 中心に縮小
  - `index.html` に新 module script を追加
- status: APPLIED / BLOCKED
  - APPLIED

## Step 3: delta-verify
- AC result table:
  - AC1 `workspace-agent-state.js` が split threshold を満たす: PASS (`179 lines`)
  - AC2 `workspace-agent-guide-runtime.js` / `workspace-agent-assignment.js` が split threshold を満たす: PASS (`665 lines` / `156 lines`)
  - AC3 `WorkspaceAgentStateUi` の public API 名を維持: PASS
  - AC4 static / targeted unit / validator が PASS: PASS
- scope deviation:
  - なし
- overall: PASS / FAIL
  - PASS

- verify commands:
  - `node --check wireframe/workspace-agent-guide-runtime.js`
  - `node --check wireframe/workspace-agent-assignment.js`
  - `node --check wireframe/workspace-agent-state.js`
  - `node --check wireframe/app.js`
  - `node --test tests/unit/plan-orchestrator.test.js tests/unit/agent-routing.test.js tests/unit/guide-plan.test.js`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`

- note:
  - `check_code_size` では今回対象の 3 file は split threshold を解消した
  - 未解消の split target は `wireframe/ui-core.js` と `tests/e2e/workspace-layout.board.js`

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - 次の split 対象は `wireframe/ui-core.js` と `tests/e2e/workspace-layout.board.js`

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `workspace-agent-guide-runtime.js` と `workspace-agent-assignment.js` の責務を追記
  - plan: current/archive を同期

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
