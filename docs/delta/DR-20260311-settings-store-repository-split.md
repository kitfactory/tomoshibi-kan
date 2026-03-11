# DR-20260311-settings-store-repository-split

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `runtime/settings-store.js` から orchestration debug run / task progress log / plan artifact repository を分離する
  - 共通 helper を別 module へ分離し、`settings-store.js` は app settings/model/tool/skill/secrets の責務を中心に保つ
  - 既存 `SqliteSettingsStore` public API は維持する
  - `tests/unit/settings-store.test.js` と architecture / plan を最小同期する
- Out of Scope:
  - DB schema の意味変更
  - `electron-main.js` など呼び出し側の API 変更
  - `settings-state.js` や他の大型ファイルの分割
- Acceptance Criteria:
  - `runtime/settings-store.js` が orchestration repository 実装本体を直接持たない
  - `SqliteSettingsStore` の既存 unit test が PASS する
  - `project-validator` の `validate_delta_links` が PASS する
  - `check_code_size` で `runtime/settings-store.js` が split threshold (`> 800`) を超えない

## Step 2: delta-apply
- changed files:
- `runtime/settings-store.js`
- `runtime/settings-store-shared.js`
- `runtime/settings-store-repositories.js`
- `tests/unit/settings-store.test.js`
- `docs/architecture.md`
- `docs/plan.md`
- applied AC:
- `settings-store.js` から共通 helper と repository 実装を外し、app settings facade に寄せた
- public API は維持し、unit test 呼び出し側の変更は不要にした
- status: APPLIED / BLOCKED
  - APPLIED

## Step 3: delta-verify
- AC result table:
- AC1 `settings-store.js` が repository 実装本体を持たない: PASS
- AC2 `SqliteSettingsStore` unit test PASS: PASS
- AC3 `validate_delta_links` PASS: PASS
- AC4 `check_code_size` で `settings-store.js` が split threshold を超えない: PASS
- scope deviation:
- なし
- overall: PASS / FAIL
  - PASS

- verify commands:
  - `node --check runtime/settings-store.js`
  - `node --check runtime/settings-store-shared.js`
  - `node --check runtime/settings-store-repositories.js`
  - `node --test tests/unit/settings-store.test.js`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`

- note:
  - `check_code_size` には既存の大ファイル警告/エラーが残るが、`runtime/settings-store.js` 自体は split threshold 超過を解消した

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
- なし

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `settings-store` の repository split を追記
  - plan: current/archive を同期

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
