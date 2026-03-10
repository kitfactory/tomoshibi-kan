# DR-20260310-workspace-agent-state-namespace-repair

## Step 1: delta-request
- Delta Type: REPAIR
- In Scope:
  - `wireframe/workspace-agent-state.js` の export を namespaced API に切り替える
  - `wireframe/app.js` の `workspaceAgentStateUiApi()` を namespaced API 参照へ修正する
  - split 後の targeted verify を通す
  - `docs/plan.md` に archive summary を追記する
- Out of Scope:
  - 新しい責務分割
  - `settings-state.js` の追加分割/namespace 化
  - resident / Guide / routing の振る舞い変更
  - `docs/architecture.md` の構造変更
- Acceptance Criteria:
  - browser runtime で `Maximum call stack size exceeded` が発生しない
  - `worker runtime / gate flow / task detail conversation / guide progress query` の targeted Playwright が通る
  - delta validator が PASS
  - この repair によりコードサイズ閾値の新規悪化を作らない

## Step 2: delta-apply
- changed files:
  - `wireframe/workspace-agent-state.js`
  - `wireframe/app.js`
  - `docs/plan.md`
- applied AC:
  - `workspace-agent-state.js` を `WorkspaceAgentStateUi` の namespaced export に変更した
  - `app.js` の wrapper 参照先を `window.WorkspaceAgentStateUi` に変更した
  - archive summary と archive index に本 delta を追記した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - browser runtime で `Maximum call stack size exceeded` が発生しない: PASS
  - `worker runtime / gate flow / task detail conversation / guide progress query` の targeted Playwright が通る: PASS
  - delta validator が PASS: PASS
  - この repair によりコードサイズ閾値の新規悪化を作らない: PASS
- static:
  - `node --check wireframe/workspace-agent-state.js wireframe/app.js`: PASS
- targeted unit:
  - `node --test tests/unit/plan-orchestrator.test.js tests/unit/agent-routing.test.js`: PASS
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "worker runtime receives structured handoff payload|job board supports gate flow|task detail drawer renders conversation log timeline|guide progress query reports completed task without model call"`: PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`: PASS
- project-validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`: REVIEWED
  - repo 既知の大型ファイルは残るが、この repair による新規悪化はない
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `workspace-agent-state.js` 自体は引き続き分割対象

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture:
  - plan: archive summary / archive index に追記

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
