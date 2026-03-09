# DR-20260310-app-js-split-guide-progress-flow

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `Guide` の plan 承認 / progress query helper を `wireframe/app.js` から新規 module へ切り出す
  - `wireframe/index.html` の script 読み込み順を更新する
  - 分割後の renderer wiring を維持する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - Guide chat の振る舞い変更
  - progress log schema 変更
  - Orchestrator / routing の挙動変更
- Acceptance Criteria:
  - `app.js` から対象 helper 群が除去され、新規 module へ移る
  - plan 承認 / 進捗問い合わせ / replan 表示の既存挙動が変わらない
  - targeted static / E2E / validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/guide-progress-flow.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - plan 承認 / approved plan 重複防止 / progress query helper を `guide-progress-flow.js` に切り出した
  - `index.html` の script 読み込み順を更新し、renderer wiring を維持した
  - `architecture.md` に helper 所在を最小同期した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `app.js` から対象 helper 群が除去され、新規 module へ移る: PASS
  - plan 承認 / 進捗問い合わせ / replan 表示の既存挙動が変わらない: PASS
  - targeted static / E2E / validator が PASS する: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `gate replan bridge creates new tasks and updates progress query` の既存 E2E は今回の acceptance 外のため追従していない

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: renderer helper の所在を同期
  - plan: current から archive へ移し、20260310 archive index を更新

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
