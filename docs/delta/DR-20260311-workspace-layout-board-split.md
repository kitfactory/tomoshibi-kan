# DR-20260311-workspace-layout-board-split

## Step 1: delta-request
- Delta Type: REPAIR
- In Scope:
  - `tests/e2e/workspace-layout.board.js` を thin aggregator 化する
  - board 系 E2E を `flow` と `runtime` module に分離する
  - `architecture.md` と `plan.md` を最小同期する
- Out of Scope:
  - E2E シナリオ自体の追加・削除
  - Guide / Settings / Profiles 系 spec の変更
  - task/job/gate の挙動変更
- Acceptance Criteria:
  - `tests/e2e/workspace-layout.board.js` が split threshold (`<= 800`) を満たす
  - `registerBoardTests` の public API が維持される
  - static / targeted Playwright / validator が PASS する

## Step 2: delta-apply
- changed files:
  - `tests/e2e/workspace-layout.board.js`
  - `tests/e2e/workspace-layout.board-flow.js`
  - `tests/e2e/workspace-layout.board-runtime.js`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - board 系 E2E を `flow/runtime` に分離した
  - `workspace-layout.board.js` は thin aggregator へ置換した
  - `registerBoardTests` の利用点は維持した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `tests/e2e/workspace-layout.board.js` が split threshold (`<= 800`) を満たす: PASS
  - `registerBoardTests` の public API が維持される: PASS
  - static / targeted Playwright / validator が PASS する: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
