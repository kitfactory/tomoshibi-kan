# DR-20260311-ui-core-state-split

- Delta Type: REFACTOR
- Status: archive

## Goal
`wireframe/ui-core.js` に残っている mutable UI state 定義を、責務ごとの state module に分割する。

## In Scope
- `ui-core.js` の state 定義を `settings`, `workspace-data`, `ui-session` の3群に分割する
- script load 順を更新する
- `ui-core.js` は後方互換の薄い facade か最小 state 入口に縮小する
- architecture / plan を最小同期する

## Out of Scope
- state shape の変更
- 利用側 module の大規模 rename
- event handler / business logic の変更

## Acceptance Criteria
- `ui-core.js` の責務が state facade に縮小される
- 新しい state module の責務が明確である
- 既存 UI / E2E の主要動線が回帰しない
- validator が PASS する

## Verify
- `node --check` on changed wireframe files
- targeted Playwright for guide/settings/board paths
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`

# delta-apply
- `ui-core.js` の mutable state を `ui-settings-state.js` / `ui-workspace-data-state.js` / `ui-session-state.js` に分離した。
- `index.html` の script load 順を更新し、state module を `ui-core.js` より前に読み込むようにした。
- `architecture.md` と `plan.md` を最小同期した。

# delta-verify
- `node --check wireframe/ui-settings-state.js wireframe/ui-workspace-data-state.js wireframe/ui-session-state.js wireframe/ui-core.js wireframe/settings-tab.js wireframe/app.js` PASS
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "task detail drawer renders conversation log timeline|guide progress query reports completed task without model call"` PASS
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .` PASS
- verify結果: PASS

# delta-archive
- `ui-core.js` は state facade に縮小された。
- archive status: PASS
