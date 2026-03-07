# delta-request

## Delta ID
- DR-20260301-settings-provider-selection-sticky

## 目的
- Settings の provider 選択時、対象 provider にモデル候補が無くても選択値を保持し、別 provider（LMStudio）へ自動で戻らないようにする。

## In Scope
- `wireframe/app.js` の provider ドラフト解決ロジック。

## Out of Scope
- provider/model カタログ取得仕様の変更。
- UI テーマ変更。

## Acceptance Criteria
- AC-01: OpenAI 選択時、候補モデルが空でも provider 選択が OpenAI のまま保持される。
- AC-02: モデル候補が無い場合は追加ボタン無効/警告表示の挙動を維持。
- AC-03: unit/E2E テスト PASS。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js

## AC 対応
- AC-01:
  - `resolveDraftProviderWithAvailableModels` のフォールバック先を「モデル候補あり provider」から「入力 provider 優先」へ変更。
- AC-02:
  - `addModelDisabled` / 警告表示は既存ロジックを維持。
- AC-03:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model|settings allows LMStudio model without api key"`

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | provider が自動で LMStudio に戻らない実装へ変更 |
| AC-02 | PASS | 候補なし時の disabled/warning 挙動維持 |
| AC-03 | PASS | unit/E2E PASS |

# delta-archive

## クローズ
- verify: PASS
- verify result: PASS
- archive: 完了

## 要約
- provider 選択保持を優先するよう修正し、モデル候補が空でも選択値が勝手に切り替わる問題を解消した。
