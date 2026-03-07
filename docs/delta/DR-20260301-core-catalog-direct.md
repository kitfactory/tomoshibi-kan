# delta-request

## Delta ID
- DR-20260301-core-catalog-direct

## 目的
- Settings の provider/model 候補を正規化テーブル優先ではなく `palpal-core` 取得結果優先にする。
- Electron 実行時は fallback カタログを前面に出さず、`palpal-core` から再取得して反映する。

## In Scope
- `runtime/palpal-core-runtime.js` の provider/model カタログ取得ロジック。
- `electron-main.js` の起動時カタログ受け渡しロジック。
- `wireframe/app.js` の provider/model レジストリ初期化と runtime 再取得。
- `wireframe/palpal-core-registry.js` の fallback 注入条件。

## Out of Scope
- palpal-core 本体の実装変更。
- Settings UI デザイン変更。
- SecretStore/SQLite の保存仕様変更。

## Acceptance Criteria
- AC-01: Electron 実行時、Settings の provider/model 候補は `PalpalCoreRuntime.listProviderModels()` の結果が反映される。
- AC-02: core カタログが空のときに wireframe fallback が上書き注入されない。
- AC-03: unit/E2E 既存テストが PASS する。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- runtime/palpal-core-runtime.js
- electron-main.js
- wireframe/app.js
- wireframe/palpal-core-registry.js

## AC 対応
- AC-01:
  - `wireframe/app.js` に `refreshCoreCatalogFromRuntime()` を追加し、`init()` 冒頭で実行。
  - 取得結果を `applyCoreCatalogSnapshot()` で provider/model レジストリへ再反映。
- AC-02:
  - `wireframe/palpal-core-registry.js` で `PalpalCoreRuntime` 存在時は fallback 注入を抑止。
  - `electron-main.js` の初期 `coreCatalog` を空配列にし、失敗時も空配列維持。
- AC-03:
  - `npm run test:unit` を実行。
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model"` を実行。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `refreshCoreCatalogFromRuntime()` 実装、`init()` で実行 |
| AC-02 | PASS | preload/runtime bridge 存在時 fallback 注入停止、main の空カタログ保持 |
| AC-03 | PASS | unit/E2E 実行結果が PASS |

## 追加確認
- `node -e "...listCoreProviderModels(...)"` 実行で LM Studio を含む実カタログを取得確認。

# delta-archive

## クローズ
- verify: PASS
- verify result: PASS
- archive: 完了

## 要約
- 「正規値に揃える」の挙動を抑え、Electron 実行時は `palpal-core` 取得値を優先して Settings 候補へ反映する実装に切り替えた。
