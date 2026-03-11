# DR-20260311-ui-core-markdown-split

## Step 1: delta-request
- Delta Type: REPAIR
- In Scope:
  - `wireframe/ui-core.js` から Markdown/HTML rendering helper を別 module へ分離する
  - `index.html` の script 読み込みを更新する
  - `architecture.md` と `plan.md` を最小同期する
- Out of Scope:
  - Markdown 表示仕様の変更
  - `app.js` や task detail の挙動変更
  - provider/model catalog や resident seed の再設計
- Acceptance Criteria:
  - `wireframe/ui-core.js` が split threshold (`<= 800`) を満たす
  - `renderMarkdownText` の public 利用点は維持される
  - static / targeted E2E / validator が PASS する

## Step 2: delta-apply
- changed files:
  - `wireframe/ui-core.js`
  - `wireframe/ui-markdown.js`
  - `wireframe/ui-link-utils.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - markdown / HTML rendering helper を `ui-markdown.js` へ分離した
  - external link / search keyword helper を `ui-link-utils.js` へ分離した
  - `wireframe/ui-core.js` を split threshold (`<= 800`) に収めた
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `wireframe/ui-core.js` が split threshold (`<= 800`) を満たす: PASS
  - `renderMarkdownText` の public 利用点は維持される: PASS
  - static / targeted E2E / validator が PASS する: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
