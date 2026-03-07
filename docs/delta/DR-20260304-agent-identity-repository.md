# delta-request

## Delta ID
- DR-20260304-agent-identity-repository

## 目的
- Agent Identity Layer（`SOUL.md` / `role.md` / `skills.yaml`）を保存・読込できる runtime repository を実装し、次の Context Builder 接続に使える IPC を用意する。

## 変更対象（In Scope）
- `runtime/agent-identity-store.js` を追加し、agent identity ファイルの read/write を実装する。
- `electron-main.js` に `agent-identity:load` / `agent-identity:save` IPC を追加する。
- `electron-preload.js` に `window.PalpalAgentIdentity` bridge を追加する。
- `tests/unit/agent-identity-store.test.js` を追加し、基本動作を検証する。
- `package.json` の `test:unit` に新規 unit test を組み込む。

## 非対象（Out of Scope）
- UI（Settings/Pal画面）から Agent Identity を編集する機能追加。
- Context Builder への `enabled_skill_ids` 解決接続。
- Guide の計画/アサインロジック変更。

## 差分仕様
- DS-01:
  - Given: workspace root が解決済みである
  - When: `agent-identity:save` に identity 情報を渡す
  - Then: agent ごとの `SOUL.md`, `role.md`, `skills.yaml` が保存される
- DS-02:
  - Given: identity ファイルが存在する/しない
  - When: `agent-identity:load` を実行する
  - Then: ファイルがあれば内容を返し、無ければ空既定値を返す
- DS-03:
  - Given: worker identity 保存時
  - When: `agentId` が空
  - Then: validation error で保存を拒否する

## 受入条件（Acceptance Criteria）
- AC-01: runtime store が `SOUL.md`, `role.md`, `skills.yaml` の read/write を行える。
- AC-02: Electron IPC (`agent-identity:load/save`) と preload bridge (`PalpalAgentIdentity`) が追加される。
- AC-03: 新規 unit test を含む `npm run test:unit` が PASS する。

## 制約
- 変更は最小差分で行い、既存 E2E フローを壊さない。
- `skills.yaml` は `enabled_skill_ids` のみを扱う最小スキーマに限定する。

## 未確定事項
- Q-01: `skills.yaml` の将来拡張キー（version/runtime_kind 等）の導入時期。

# delta-apply

## Delta ID
- DR-20260304-agent-identity-repository

## 実行ステータス
- APPLIED

## 変更ファイル
- runtime/agent-identity-store.js
- electron-main.js
- electron-preload.js
- tests/unit/agent-identity-store.test.js
- package.json
- docs/plan.md
- docs/delta/DR-20260304-agent-identity-repository.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `AgentIdentityStore` を追加し、agent type/path 解決、`skills.yaml` 解析・シリアライズ、identity load/save を実装。
  - 根拠: `runtime/agent-identity-store.js` に `loadAgentIdentity` / `saveAgentIdentity` を実装。
- AC-02:
  - 変更: `electron-main.js` に `agent-identity:load/save` を追加し、`electron-preload.js` へ `PalpalAgentIdentity` bridge を追加。
  - 根拠: Renderer から IPC 経由で identity API を呼べる状態になった。
- AC-03:
  - 変更: `tests/unit/agent-identity-store.test.js` を追加し、`package.json` `test:unit` に組み込み。
  - 根拠: 保存/読込/バリデーションの unit test を実行可能化した。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- worker identity の `agentId` 必須チェックが効くこと。
- `skills.yaml` が `enabled_skill_ids` で round-trip できること。

# delta-verify

## Delta ID
- DR-20260304-agent-identity-repository

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `tests/unit/agent-identity-store.test.js` で save/load と yaml round-trip を検証 |
| AC-02 | PASS | `electron-main.js` / `electron-preload.js` に `agent-identity` IPC/bridge を追加 |
| AC-03 | PASS | `npm run test:unit` => 47 passed / 0 failed |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: UI からの呼び出し導線は未接続のため、次 delta で統合が必要。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260304-agent-identity-repository

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Agent Identity の基礎 I/O と IPC を提供した。
- 変更対象: runtime store, electron IPC bridge, unit test, plan同期。
- 非対象: UI 編集導線、Context Builder 接続、Guide アサイン実装。

## 実装記録
- 変更ファイル:
  - runtime/agent-identity-store.js
  - electron-main.js
  - electron-preload.js
  - tests/unit/agent-identity-store.test.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260304-agent-identity-repository.md
- AC達成状況:
  - AC-01: 達成
  - AC-02: 達成
  - AC-03: 達成

## 検証記録
- verify要約: unit test 一式がPASSし、delta linkも整合。
- 主要な根拠: `npm run test:unit` / `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- あり
  - UI から Agent Identity を編集/保存する導線は未実装。

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: `skills.yaml` の `enabled_skill_ids` と Settings Skill 台帳の結合を Context Builder に接続する。
