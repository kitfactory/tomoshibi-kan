Status: ARCHIVE
Delta Type: REFACTOR

# DR-20260312 Settings Tab Render Context Split

## Background
`settings-tab-render.js` still mixes render orchestration and a large amount of context/data assembly. The file is below the hard split threshold but still in review range and its responsibility is broader than necessary.

## In Scope
- Extract Settings render context/data assembly from `settings-tab-render.js` into a new module
- Keep `settings-tab-render.js` as a thin render orchestrator
- Update script wiring and architecture/plan/delta sync
- Run static checks, targeted Playwright, and project-validator

## Out of Scope
- New Settings features
- Settings control behavior changes
- Channel/Slack foundation
- resident/profile logic changes

## Acceptance Criteria
1. `settings-tab-render.js` no longer owns the bulk of render context/data assembly
2. New module has a clear single purpose for Settings render context building
3. Targeted Settings E2E still PASS
4. project-validator passes and delta is archived

## Apply
- `settings-tab-render-context.js` を追加し、Settings タブ描画に必要な option/list/save-state/skill market context の組み立てを切り出した。
- `settings-tab-render.js` は render orchestration と controls binding 呼び出しだけに薄くした。
- `index.html` と `architecture.md` を同期した。

## Verify
- `node --check wireframe/settings-tab-render-context.js` PASS
- `node --check wireframe/settings-tab-render.js` PASS
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings tab shows model list and allows adding model|settings save button is enabled only when changed and keeps unsaved state across tabs|settings footer reflects saving state and add form open state|settings can sync built-in resident definitions to workspace"` PASS
- `node C:\\Users\\kitad\\.codex\\skills\\project-validator\\scripts\\validate_delta_links.js --dir .` PASS

## Archive
- `settings-tab-render.js` から render context/data assembly を除去し、責務を render orchestration に限定した。
