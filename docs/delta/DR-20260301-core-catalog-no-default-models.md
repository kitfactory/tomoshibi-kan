# delta-request

## Delta ID
- DR-20260301-core-catalog-no-default-models

## 目的
- provider/model カタログは `palpal-core` の取得結果のみを表示し、`default model` フォールバック値を UI 候補へ混在させない。

## In Scope
- `runtime/palpal-core-runtime.js` の listProviderModels 変換処理。
- `resolution=default` モデルの除外。

## Out of Scope
- palpal-core 本体の provider 仕様変更。
- UI デザイン変更。

## Acceptance Criteria
- AC-01: `resolution=default` のモデルがカタログ結果に含まれない。
- AC-02: provider 一覧は `palpal-core` の providers から取得される。
- AC-03: unit/E2E が PASS。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- runtime/palpal-core-runtime.js

## AC 対応
- AC-01:
  - `listCoreProviderModels` に `includeDefaultModels` フラグを追加（デフォルト false）。
  - `providers[*].resolution === "default"` のとき model 追加をスキップ。
- AC-02:
  - fallback catalog/export を削除し、取得失敗時は throw のみ。
- AC-03:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model|settings allows LMStudio model without api key"`

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | OpenAI/Gemini default モデルが models から除外されることを `node -e` 出力で確認 |
| AC-02 | PASS | providers は `listProviderModels()` の providers を使用 |
| AC-03 | PASS | unit/E2E 実行結果 PASS |

# delta-archive

## クローズ
- verify: PASS
- verify result: PASS
- archive: 完了

## 要約
- 「設定値 or default model」混在を停止し、`palpal-core` カタログのうち実取得/設定済みモデルだけを UI 候補へ反映するよう修正した。
