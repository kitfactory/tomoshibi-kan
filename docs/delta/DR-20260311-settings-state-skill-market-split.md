# delta-request

## Delta ID
- DR-20260311-settings-state-skill-market-split

## Delta Type
- REPAIR

## 目的
- `wireframe/settings-state.js` から skill market / ClawHub catalog 責務を分離し、ファイルサイズと責務混在を減らす。

## 変更対象（In Scope）
- `wireframe/settings-state.js` の skill market / catalog 関連関数の分離
- 新規 module 追加と `index.html` への script 配線
- `architecture.md` と `plan.md` の最小同期

## 非対象（Out of Scope）
- Settings UI の文言変更
- skill market の挙動変更
- settings persistence / runtime bridge の追加分割

## 差分仕様
- DS-01:
  - Given: `settings-state.js` が settings persistence / runtime bridge / skill market を同居させている
  - When: skill market / ClawHub catalog 関連関数を別 module へ移す
  - Then: `settings-state.js` は facade と settings state helper に集中し、既存の public API 名は維持される
- DS-02:
  - Given: Settings UI と resident panel が `normalizeSkillId` などの global 関数を使っている
  - When: 分割後に app を起動する
  - Then: 既存の skill install/search/remove/save フローは回帰しない

## 受入条件（Acceptance Criteria）
- AC-01: `wireframe/settings-state.js` が 800 行未満になる
- AC-02: skill market の search/install/remove/save を対象にした targeted verify が PASS
- AC-03: `validate_delta_links` が `errors=0, warnings=0`

## Step 2: delta-apply
- `wireframe/settings-state.js` から skill market / ClawHub catalog helper を分離した。
- 新規 module `wireframe/settings-skill-market-state.js` を追加した。
- `wireframe/index.html` に script 読み込みを追加した。
- `docs/architecture.md` と `docs/plan.md` を同期した。

## Step 3: delta-verify
- static:
  - `node --check wireframe/settings-skill-market-state.js wireframe/settings-state.js`
  - PASS
- targeted unit:
  - `node --test tests/unit/settings-store.test.js tests/unit/settings-persistence.test.js tests/unit/agent-routing.test.js`
  - PASS
- targeted e2e:
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings skill search modal supports keyword search flow|settings tab supports skill uninstall and install|settings can sync built-in resident definitions to workspace"`
  - PASS
- validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - PASS
- code size:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
  - target file `wireframe/settings-state.js` は `546` 行で AC 内
  - 既存の split threshold 超過は scope 外

## Step 4: delta-archive
- archive result: PASS

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture: `docs/architecture.md`
  - plan: `docs/plan.md`

## 制約
- 既存 global API 名を壊さない
- skill market ロジックの意味は変えない

## Review Gate
- required: No
- reason:

## 未確定事項
- Q-01: なし
