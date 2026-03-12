# DR-20260312-workspace-agent-guide-runtime-split

## delta-request
- Delta Type: REFACTOR
- In Scope:
  - `wireframe/workspace-agent-guide-runtime.js` を `guide runtime interop` と `guide context/identity build` に分割する
  - façade 側は bridge export と assignment wrapper に責務を絞る
  - `index.html` / `architecture.md` / `plan.md` を最小同期する
- Out of Scope:
  - Guide の会話挙動変更
  - resident routing の仕様変更
  - Settings / Channel 機能
- Acceptance Criteria:
  - `workspace-agent-guide-runtime.js` が 500 行台以下へ縮小する
  - new module に責務が分かれ、既存の public API 名は維持する
  - Guide 系 targeted E2E と static check が PASS する
  - `project-validator` の `check_code_size` と `validate_delta_links` が PASS する

## delta-apply
- `workspace-agent-guide-runtime.js` を façade 化し、Guide runtime interop と Guide context build を別 module へ分離した。
- `wireframe/workspace-agent-guide-interop.js` を追加し、provider/model option 解決、Guide 応答 parse/fallback helper を移した。
- `wireframe/workspace-agent-guide-context.js` を追加し、resident capability 解決、identity/context build、guide plan API 解決を移した。
- `index.html` に新しい Guide runtime module の script 読み込み順を追加した。

## delta-verify
- static
  - `node --check wireframe/workspace-agent-guide-interop.js`
  - `node --check wireframe/workspace-agent-guide-context.js`
  - `node --check wireframe/workspace-agent-guide-runtime.js`
  - `node --check wireframe/app.js`
- targeted E2E
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide progress query reports completed task without model call|guide progress query explains replan required after gate reject|guide chat creates planned tasks and assigns workers|settings can sync built-in resident definitions to workspace"`
- project-validator
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- 結果:
  - static PASS
  - targeted E2E PASS
  - `check_code_size`: split `0`, exception `0`
  - `validate_delta_links`: PASS（historical monthly archive warning のみ）

## delta-archive
- archive status: PASS
- Summary:
  - `workspace-agent-guide-runtime.js` の責務を `interop / context / façade` に分けた
  - Guide 系 targeted E2E を維持したまま split を完了した
