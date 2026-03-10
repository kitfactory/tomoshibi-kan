# DR-20260311-app-js-split-ui-core-and-bridge-facade

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `wireframe/app.js` から UI 共通基盤を分離する
  - 少なくとも次の責務を新規 module へ切り出す
    - i18n text / markdown render / low-level UI utility
    - workspace bridge facade wrapper
  - browser script wiring を更新する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - UI 表示仕様変更
  - Guide / resident / gate の挙動変更
  - `runtime/*` の分割
  - 新しい E2E シナリオ追加
- Acceptance Criteria:
  - `wireframe/app.js` が 1000 行未満になる
  - 分割後も既存 UI の公開挙動は維持される
  - targeted verify が PASS する
  - in-scope の新規 split 対象が 1000 行未満になる
  - `validate_delta_links` が PASS し、`project-validator` の code size review が記録される

## Step 2: delta-apply
- `wireframe/ui-text.js` を追加し、UI 文言辞書と Guide UI 固定定数を `ui-core.js` から分離した。
- `wireframe/ui-core.js` を追加し、markdown render / low-level UI utility を `app.js` から分離した。
- `wireframe/workspace-bridge-facade.js` を追加し、workspace state bridge wrapper を `app.js` から分離した。
- `wireframe/index.html` の script wiring を更新し、分離 module を `app.js` より前に読み込むようにした。
- `docs/architecture.md` と `docs/plan.md` を最小同期した。

## Step 3: delta-verify
- AC result table:
  - `wireframe/app.js` が 1000 行未満になる: PASS
  - 分割後も既存 UI の公開挙動は維持される: PASS
  - targeted verify が PASS する: PASS
  - in-scope の新規 split 対象が 1000 行未満になる: PASS
  - `validate_delta_links` が PASS し、`project-validator` の code size review が記録される: PASS
- static:
  - `node --check wireframe/ui-text.js wireframe/ui-core.js wireframe/workspace-bridge-facade.js wireframe/app.js`
  - PASS
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat supports @ completion with focus and project:file|task detail drawer renders conversation log timeline|settings can sync built-in resident definitions to workspace"`
  - PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - PASS
- code size:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - `app.js` は 748 行
  - `ui-core.js` は 892 行
  - `workspace-bridge-facade.js` は 85 行
  - repo 既存の size threshold 超過は残るが、今回差分で新しい 1000 行超えは作っていない
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `ui-core.js` は 892 行のため、skill の split threshold (> 800) では次の review 候補
  - `workspace-bridge-facade.js` は facade 追加に応じて今後再整理候補

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `ui-text.js` / `ui-core.js` / `workspace-bridge-facade.js` を追記
  - plan: current から archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
