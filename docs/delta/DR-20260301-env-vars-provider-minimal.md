# delta-request

## Delta ID
- DR-20260301-env-vars-provider-minimal

## 目的
- モデル関連の環境変数を最小化し、provider ごとの API 接続情報だけで運用する。
- `PALPAL_*` / `AGENTS_*` などの共通・重複キー依存を廃止する。

## 背景
- 現状は `PALPAL_LMSTUDIO_*` を `AGENTS_*` へ写像する層があり、設定経路が重複している。
- ユーザー要望は「provider ごとの `API_KEY` / `BASE_URL` のみ」「共通環境変数は不要」。

## In Scope
- 環境変数仕様の正本を以下に統一する。
  - OpenAI: `OPENAI_API_KEY`, `OPENAI_BASE_URL`
  - Ollama: `OLLAMA_API_KEY`, `OLLAMA_BASE_URL`
  - LMStudio: `LMSTUDIO_API_KEY`, `LMSTUDIO_BASE_URL`
  - Gemini: `GEMINI_API_KEY`, `GEMINI_BASE_URL`
  - Anthropic: `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`
  - OpenRouter: `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`
- optional/required ルールを明示する。
  - ローカルLLM（Ollama/LMStudio）は `API_KEY` optional
  - クラウド系（OpenAI/Gemini/Anthropic/OpenRouter）は `API_KEY` required
  - `BASE_URL` は provider 既定値を持つため optional
- 旧キー群（`PALPAL_*`, `AGENTS_*`, `AGENTS_MODEL_PROVIDER` など）を「不要キー」として整理する移行方針を定義する。

## Out of Scope
- Settings 画面の入力項目構成変更。
- モデル名の環境変数化（今回対象外、モデルは Settings/実取得で扱う）。
- palpal-core 本体の公開 API 変更。

## 受入条件 (AC)
- AC-01: docs 上で新しい環境変数一覧・必須度・既定挙動が一意に定義される。
- AC-02: 不要キー一覧（削除対象）と互換期間の扱い（即時削除 or 段階廃止）が定義される。
- AC-03: 実装フェーズで参照すべき移行手順（Step順）が `delta apply` 着手可能な粒度で確定する。

## 補足/前提
- ユーザー記載の `OPENROTER_API_KEY` は `OPENROUTER_API_KEY` の typo と解釈する（互換で両方受理）。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- electron-main.js
- electron-preload.js
- runtime/palpal-core-runtime.js
- .env
- docs/plan.md
- docs/delta/DR-20260301-env-vars-provider-minimal.md

## AC 対応
- AC-01:
  - `electron-main.js` / `electron-preload.js` の runtime defaults を `LMSTUDIO_BASE_URL` / `LMSTUDIO_API_KEY` ベースに変更。
  - `runtime/palpal-core-runtime.js` で provider別標準キーを一次参照に変更。
- AC-02:
  - `PALPAL_*` 入力依存を削除。
  - `AGENTS_MODEL_PROVIDER` の利用を削除。
  - OpenRouter API key は `OPENROUTER_API_KEY` を正としつつ `OPENROTER_API_KEY` 互換受理。
- AC-03:
  - 構文チェック・unit/E2E を実施。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | runtime defaults / provider env 参照を標準キーへ変更 |
| AC-02 | PASS | `PALPAL_*` / `AGENTS_MODEL_PROVIDER` 依存削除を確認 |
| AC-03 | PASS | `npm run test:unit`、settings/guide系 E2E PASS |

## 実行コマンド
- `node --check runtime/palpal-core-runtime.js`
- `node --check electron-main.js`
- `node --check electron-preload.js`
- `npm run test:unit`
- `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model|settings allows LMStudio model without api key|guide chat resumes after registering model in settings"`

# delta-archive

## クローズ
- verify: PASS
- verify result: PASS
- archive: 完了

## 要約
- 環境変数入力を provider別 `API_KEY` / `BASE_URL` のみに整理し、旧 `PALPAL_*` と共通 `AGENTS_MODEL_PROVIDER` 依存を廃止した。
