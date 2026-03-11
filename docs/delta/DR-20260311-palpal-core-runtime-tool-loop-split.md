# DR-20260311-palpal-core-runtime-tool-loop-split

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `runtime/palpal-core-runtime.js` から workspace tool 定義と model tool-loop 実装を分離する
  - `requestPalChatCompletion` / `requestGuideChatCompletion` の public API は維持する
  - 既存 unit test と architecture / plan を最小同期する
- Out of Scope:
  - provider/model path の再設計
  - CLI runtime の挙動変更
  - tool capability probe や routing の変更
- Acceptance Criteria:
  - `runtime/palpal-core-runtime.js` が workspace tool 定義と tool-loop 実装本体を持たない
  - `tests/unit/palpal-core-runtime.test.js` が PASS する
  - `validate_delta_links` が PASS する

## Step 2: delta-apply
- changed files:
  - `runtime/palpal-core-runtime.js`
  - `runtime/palpal-core-tool-runtime.js`
  - `runtime/palpal-core-workspace-tools.js`
  - `runtime/palpal-core-tool-loop.js`
  - `tests/unit/palpal-core-runtime.test.js`
  - `docs/architecture.md`
  - `docs/plan.md`
- applied AC:
  - `palpal-core-runtime.js` から workspace tool 定義と tool-loop 実装を除去し、public API だけを残した
  - `palpal-core-tool-runtime.js` を façade にし、workspace tools / tool loop を別 module に分離した
  - existing unit test と architecture / plan を同期した
- status: APPLIED

## Step 3: delta-verify
- AC result table:
  - `runtime/palpal-core-runtime.js` が workspace tool 定義と tool-loop 実装本体を持たない: PASS
  - `tests/unit/palpal-core-runtime.test.js` が PASS する: PASS
  - `validate_delta_links` が PASS する: PASS
- scope deviation:
  - なし
  - `check_code_size` では repo 全体の既存 split 対象 (`settings-state.js`, `ui-core.js` など) が残るが、今回の差分起因ではない
- overall: PASS

## Step 4: delta-archive
- verify result:
  - PASS
- archive status:
  - ARCHIVED
- unresolved items:
  - `runtime/palpal-core-runtime.js` の分割は完了
  - repo 全体の残る split 対象は別 delta で継続する

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `runtime/palpal-core-runtime.js` / `palpal-core-tool-runtime.js` / `palpal-core-workspace-tools.js` / `palpal-core-tool-loop.js`
  - plan: `SEED-20260311-palpal-core-runtime-tool-loop-split` を archive 反映

## Validation Command
- `node --check runtime/palpal-core-runtime.js`
- `node --check runtime/palpal-core-tool-runtime.js`
- `node --test tests/unit/palpal-core-runtime.test.js`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
