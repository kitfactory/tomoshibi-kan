# DR-20260310-app-js-split-task-detail-conversation

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/app.js` から task detail conversation 用 helper 群を切り出す
  - 新規 browser module を追加し、`renderDetail()` から利用する
  - 既存 Task detail 右列の会話ログ UI 挙動を維持する
- Out of Scope:
  - Guide chat / settings / orchestrator / progress log schema の変更
  - task detail conversation 以外の `app.js` 分割
  - 文言・resident voice の再設計
- Acceptance Criteria:
  - `wireframe/app.js` から task detail conversation helper 群が除去される
  - task detail 右列の会話ログ表示は既存どおり動作する
  - targeted static / E2E / validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/task-detail-conversation.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - task detail conversation helper 群を `wireframe/task-detail-conversation.js` へ切り出した
  - `renderDetail()` から新規 module の global helper を利用する形へ変更した
  - `index.html` に browser script include を追加した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `wireframe/app.js` から task detail conversation helper 群が除去される: PASS
  - task detail 右列の会話ログ表示は既存どおり動作する: PASS
  - targeted static / E2E / validator が PASS する: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `app.js` 全体の巨大化は継続しているため、次の split delta が必要

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `task-detail-conversation.js` を renderer helper 一覧へ追加
  - plan: current から archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
