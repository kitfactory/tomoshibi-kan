# delta-request

## Delta ID
- DR-20260301-settings-persistence-impl

## 目的
- Settings の永続化を実装し、API_KEY を write-only で安全に扱う。

## 変更対象（In Scope）
- Electron main/preload/renderer を接続し、Settings の load/save API を実装する。
- 非機密設定を SQLite へ保存する。
- API_KEY を SecretStore へ保存し、UIへ再表示しない。
- unit/E2E を追加し、再起動後保持と API_KEY 非表示を検証する。

## 非対象（Out of Scope）
- Task/Job/Event の永続化実装。
- 外部クラウド Secret Manager 連携。
- 既存タブレイアウトのデザイン変更。

## 差分仕様
- DS-01:
  - Given: Settings でモデル/ツール/スキルを保存する
  - When: Save を実行する
  - Then: 次回起動時に設定が復元される
- DS-02:
  - Given: モデル追加時に API_KEY を入力して保存する
  - When: Settings を再表示する
  - Then: API_KEY 平文は表示されず、設定済み状態のみ表示される

## 受入条件（Acceptance Criteria）
- AC-01: `settings:load/save` IPC と renderer 保存フローが動作する。
- AC-02: 非機密設定が SQLite に保存される。
- AC-03: API_KEY は SecretStore 保存され、UIに再表示されない。
- AC-04: unit と E2E が PASS する。

## 制約
- 既存機能の挙動を壊さない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-settings-persistence-impl

## 実行ステータス
- APPLIED

## 変更ファイル
- electron-main.js
- electron-preload.js
- runtime/settings-store.js
- wireframe/settings-persistence.js
- wireframe/app.js
- wireframe/index.html
- tests/unit/settings-persistence.test.js
- tests/unit/settings-store.test.js
- tests/e2e/workspace-layout.spec.js
- package.json
- docs/plan.md
- docs/delta/DR-20260301-settings-persistence-impl.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `electron-main.js` に `settings:load/save/resolve-model-api-key` IPC を追加し、`electron-preload.js` で renderer API を公開。
  - 根拠: renderer から `window.PalpalSettingsStorage` を通じて永続化APIを利用可能化。
- AC-02:
  - 変更: `runtime/settings-store.js` を追加し、`sql.js` ベースの SQLite 保存を実装。
  - 根拠: モデル/ツール/スキル/locale を SQLite へ保存・読込。
- AC-03:
  - 変更: SecretStore（safeStorage + secrets file）で API_KEY を分離保存し、renderer 表示は `api_key: configured` のみ。
  - 根拠: `wireframe/app.js` の保存・復元フローで API_KEY 平文を再表示しない。
- AC-04:
  - 変更: unit 2ファイルと E2E 1シナリオを追加。
  - 根拠: `settings-store` / `settings-persistence` の unit と reload persistence E2E を追加。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- Settings 再読み込み後の保持、API_KEY 非表示、既存 Guide/Settings フロー回帰を確認する。

# delta-verify

## Delta ID
- DR-20260301-settings-persistence-impl

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | Electron IPC と preload API を追加し、renderer から load/save 呼び出し可能 |
| AC-02 | PASS | `runtime/settings-store.js` で SQLite（sql.js）保存・読込を実装 |
| AC-03 | PASS | API_KEY は SecretStore へ分離し、UI表示は configured 表示のみ |
| AC-04 | PASS | unit 25件 PASS、関連E2E 9件 PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: Electron外（file://）実行時は localStorage fallback を利用する。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-settings-persistence-impl

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Settings 永続化を実装し、API_KEYをwrite-onlyで扱う。
- 変更対象: Electron main/preload、settings store、renderer保存フロー、unit/E2E
- 非対象: Task/Job/Event永続化、外部Secret Manager連携

## 実装記録
- 変更ファイル:
  - electron-main.js
  - electron-preload.js
  - runtime/settings-store.js
  - wireframe/settings-persistence.js
  - wireframe/app.js
  - wireframe/index.html
  - tests/unit/settings-persistence.test.js
  - tests/unit/settings-store.test.js
  - tests/e2e/workspace-layout.spec.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260301-settings-persistence-impl.md
- AC達成状況: AC-01〜AC-04 すべて達成

## 検証記録
- verify要約: 保存/復元/API_KEY非表示を unit/E2E で確認しPASS
- 主要な根拠:
  - `npm run test:unit`
  - `npm run build:wireframe-css`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings persist after reload and api key is not displayed|guide chat resumes after registering model in settings|settings tab shows model list and allows adding model"`
  - `npm run check:main`
  - `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- なし
