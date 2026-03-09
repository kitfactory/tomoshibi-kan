# DR-20260310-app-js-split-guide-chat-entry

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `Guide` の送信入口と project onboarding / plan approval / progress query 分岐を `wireframe/app.js` から新規 module へ切り出す
  - `wireframe/index.html` の script 読み込み順を更新する
  - 分割後も `Guide` の既存挙動を維持する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - Guide planning / parser のロジック変更
  - progress log schema 変更
  - Orchestrator / routing の挙動変更
- Acceptance Criteria:
  - `app.js` から `sendGuideMessage` と付随 helper が除去され、新規 module へ移る
  - project onboarding / plan approval / progress query / model call の既存挙動が変わらない
  - targeted static / E2E / validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/guide-chat-entry.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - Guide の送信入口と project onboarding / plan approval / progress query 分岐を `guide-chat-entry.js` へ切り出した
  - `index.html` の script 読み込み順を更新し、renderer wiring を維持した
  - `architecture.md` に helper 所在を最小同期した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `app.js` から `sendGuideMessage` と付随 helper が除去され、新規 module へ移る: PASS
  - project onboarding / plan approval / progress query / model call の既存挙動が変わらない: PASS
  - targeted static / E2E / validator が PASS する: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: renderer helper の所在を同期
  - plan: current から archive へ移し、20260310 archive index を更新

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
