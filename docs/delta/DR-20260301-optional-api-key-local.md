# delta-request

## Delta ID
- DR-20260301-optional-api-key-local

## 目的
- Settings のモデル追加で `ollama` / `lmstudio` は API_KEY 未入力でも保存可能にする。

## In Scope
- `wireframe/app.js` のモデル追加バリデーション。
- `wireframe/app.js` の API_KEY 入力プレースホルダ表示。
- `tests/e2e/workspace-layout.spec.js` への回帰テスト追加。

## Out of Scope
- OpenAI/Anthropic/Gemini/OpenRouter など他 provider の API_KEY 必須ルール変更。
- settings 永続化仕様の変更。

## Acceptance Criteria
- AC-01: provider が `lmstudio` または `ollama` の場合、API_KEY 空でモデル追加できる。
- AC-02: provider が上記以外の場合は従来どおり API_KEY 必須。
- AC-03: unit/E2E テストが PASS する。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js

## AC 対応
- AC-01:
  - `OPTIONAL_API_KEY_PROVIDERS` と `isApiKeyRequiredForProvider()` を追加。
  - `addModel()` の API_KEY 必須判定を provider 別へ変更。
- AC-02:
  - API_KEY 判定は `lmstudio/ollama` 以外で必須のまま維持。
- AC-03:
  - `npm run test:unit` 実行。
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings allows LMStudio model without api key|settings tab shows model list and allows adding model"` 実行。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `isApiKeyRequiredForProvider(next.provider)` で `lmstudio/ollama` を許容 |
| AC-02 | PASS | 必須判定は他 provider で維持 |
| AC-03 | PASS | unit/E2E 実行結果 PASS |

# delta-archive

## クローズ
- verify: PASS
- verify result: PASS
- archive: 完了

## 要約
- ローカル実行系 provider（LMStudio/Ollama）の API_KEY を任意化し、保存できない問題を解消した。
