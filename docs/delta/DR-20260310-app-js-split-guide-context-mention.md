# DR-20260310-app-js-split-guide-context-mention

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - Guide の project context 構築、focus command、@mention menu state/helper を `wireframe/app.js` から新規 module へ切り出す
  - `wireframe/index.html` の script 読み込み順を更新する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - Guide runtime request / plan approval / progress query のロジック変更
  - Guide planning / parser / few-shot のロジック変更
  - resident routing / orchestrator の変更
- Acceptance Criteria:
  - `app.js` から Guide の project context / focus command / mention menu helper が除去され、新規 module に移る
  - Guide focus command と @mention UI の既存挙動が変わらない
  - targeted static / E2E / validator が PASS する

## Step 2: delta-apply
- Delta Type: FEATURE
- 実行ステータス: APPLIED
- 変更ファイル:
  - `wireframe/guide-context-mention.js`
  - `wireframe/app.js`
  - `wireframe/index.html`
  - `docs/architecture.md`
  - `docs/plan.md`
- 適用内容:
  - AC-01:
    - 変更: Guide の project context / focus command / @mention menu helper を `guide-context-mention.js` へ切り出した
    - 根拠: `app.js` から関連 helper と `guideMentionState` を除去し、新規 module に移した
  - AC-02:
    - 変更: `index.html` に `guide-context-mention.js` を追加し、Guide focus command と @mention UI の配線を維持した
    - 根拠: `guide-chat-entry.js` / `guide-chat-runtime.js` が新 module の helper を参照する script 順へ更新した
  - AC-03:
    - 変更: architecture / plan に新 module の責務と current delta を最小同期した
    - 根拠: renderer helper 一覧に `guide-context-mention.js` を追加し、`plan current` を更新した
- 非対象維持の確認:
  - Out of Scope への変更なし: Yes
- コード分割健全性:
  - 500行超のファイルあり: Yes
  - 800行超のファイルあり: Yes
  - 1000行超のファイルあり: Yes
  - 長大な関数なし: Yes
  - 責務過多のモジュールなし: No

## Step 3: delta-verify
- Delta ID: `DR-20260310-app-js-split-guide-context-mention`
- Verify Profile:
  - static check: `node --check wireframe/guide-context-mention.js wireframe/guide-chat-runtime.js wireframe/guide-chat-entry.js wireframe/app.js`
  - targeted unit: なし
  - targeted integration / E2E: `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat resumes after registering model in settings|guide chat keeps dialog open when plan is not ready|guide progress query reports completed task without model call|guide controller assist is off by default and can be enabled in settings|guide chat supports @ completion with focus and project:file"`
  - project-validator: `node C:\\Users\\kitad\\.codex\\skills\\project-validator\\scripts\\validate_delta_links.js --dir .`
  - code size: `node C:\\Users\\kitad\\.codex\\skills\\project-validator\\scripts\\check_code_size.js --dir .`
- 検証結果:
  - AC-01: PASS
    - 根拠: `guide-context-mention.js` へ helper / state を集約し、`app.js` から関連実装を除去済み
  - AC-02: PASS
    - 根拠: targeted Playwright 15 件 PASS。Guide focus command と @mention UI の回帰なし
  - AC-03: PASS
    - 根拠: `architecture.md` / `plan.md` の最小同期と validator PASS を確認
- スコープ逸脱チェック:
  - Out of Scope 変更の有無: No
- 不整合/回帰リスク:
  - `app.js` は依然 8820 行で exception threshold 超過。追加分割が必要
  - `runtime/settings-store.js` も split threshold 超過のまま
- Review Gate:
  - required: No
  - checklist: `docs/delta/REVIEW_CHECKLIST.md`
  - layer integrity: PASS
  - docs sync: PASS
  - data size: FAIL
  - code split health: FAIL
  - file-size threshold: FAIL
- 判定:
  - Overall: PASS

## Step 4: delta-archive
- Archive Status: DONE
- 実施メモ:
  - Guide の project context / mention 周りを `app.js` から独立させ、Guide runtime / entry の責務境界をさらに狭めた
  - 次の分割対象は `Guide plan approval / progress query` または `runtime/settings-store.js`
