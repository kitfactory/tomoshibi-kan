# DR-20260311-palpal-core-runtime-provider-split

## Step 1: delta-request
- Delta Type: FEATURE
- In Scope:
  - `runtime/palpal-core-runtime.js` から provider catalog / env patch / Guide structured output helper を切り出す
  - `runtime/palpal-core-provider.js` を追加する
  - `docs/architecture.md` と `docs/plan.md` を最小同期する
- Out of Scope:
  - runtime の挙動変更
  - CLI tool runtime の仕様変更
  - `runtime/settings-store.js` の分割
  - 新しい E2E シナリオ追加
- Acceptance Criteria:
  - `runtime/palpal-core-runtime.js` が 1000 行未満になる
  - `tests/unit/palpal-core-runtime.test.js` が PASS する
  - `project-validator` と `validate_delta_links` が PASS する

## Step 2: delta-apply
- `runtime/palpal-core-provider.js` を追加し、provider catalog / env patch / Guide structured output helper を移した。
- `runtime/palpal-core-runtime.js` は provider / structured guide helper を import する façade へ整理した。
- `docs/architecture.md` と `docs/plan.md` を最小同期した。

## Step 3: delta-verify
- AC result table:
  - `runtime/palpal-core-runtime.js` が 1000 行未満になる: PASS
  - `tests/unit/palpal-core-runtime.test.js` が PASS する: PASS
  - `project-validator` と `validate_delta_links` が PASS する: PASS
- static:
  - `node --check runtime/palpal-core-runtime.js runtime/palpal-core-provider.js`
  - PASS
- targeted unit:
  - `node --test tests/unit/palpal-core-runtime.test.js`
  - PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - PASS
- code size:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - `runtime/palpal-core-runtime.js` は `932` 行
  - repo 既存の size threshold 超過は残るが、今回差分の 1000 行超過は解消
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - `runtime/settings-store.js` は引き続き split 候補
  - `palpal-core-runtime.js` は project-validator の split threshold (`>800`) はまだ超えているため、必要なら後続で継続分割する

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: runtime provider helper split を追記
  - plan: archive summary へ移動

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
