# delta-request

## Delta ID
- DR-20260301-settings-model-catalog-env

## 目的
- Settings で選択できるモデル候補を `palpal-core` registry 準拠に統一する。
- 開発時の LM Studio 既定値を `.env` で定義し、実行時に参照できるようにする。

## 変更対象（In Scope）
- `wireframe/palpal-core-registry.js` にモデルカタログを追加する。
- `wireframe/app.js` のモデル候補を `PALPAL_CORE_MODELS` 由来へ切り替える。
- Electron 起動時に `.env` を読み込み、Renderer に runtime 既定値を渡す。
- `.env` に LM Studio (`192.168.11.16:1234/v1`) と `openai/gpt-oss-20b` を定義する。

## 非対象（Out of Scope）
- 本物の `palpal-core` npm 依存導入やネットワーク API 連携。
- モデル設定 UI のレイアウト刷新。
- SecretStore/SQLite の保存方式変更。

## 差分仕様
- DS-01:
  - Given: Settings の Model 追加フォームを開く
  - When: モデル名候補を表示する
  - Then: `PALPAL_CORE_MODELS` を基準に候補が表示される
- DS-02:
  - Given: Electron 起動時
  - When: `.env` に LM Studio 既定値が定義されている
  - Then: Renderer 側で runtime 既定値として参照できる
- DS-03:
  - Given: Guide の開発/テスト実行
  - When: Guide 送信処理が runtime を解決する
  - Then: `.env` 由来の model/base_url/provider/api_key が優先される

## 受入条件（Acceptance Criteria）
- AC-01: Settings のモデル候補が静的配列ではなく `palpal-core` registry 由来である。
- AC-02: `.env` に定義した LM Studio model/base_url が Electron 実行時に反映される。
- AC-03: unit と対象 E2E が PASS する。

## 制約
- 既存の Runtime（model/tool）排他仕様は維持する。
- 既存 E2E の期待（Guide 既定モデル候補）を壊さない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-settings-model-catalog-env

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/palpal-core-registry.js
- wireframe/app.js
- electron-main.js
- electron-preload.js
- .env
- docs/plan.md
- docs/OVERVIEW.md
- docs/spec.md
- docs/architecture.md
- docs/delta/DR-20260301-settings-model-catalog-env.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `PALPAL_CORE_MODELS` を registry に追加し、Settings のモデル候補を動的参照へ変更。
  - 根拠: `wireframe/palpal-core-registry.js` と `wireframe/app.js` の `buildModelOptionList/selectableModelOptions`。
- AC-02:
  - 変更: main process で `.env` を読み込み、`additionalArguments` 経由で preload/renderer に runtime defaults を配線。
  - 根拠: `electron-main.js` の dotenv ローダー、`electron-preload.js` の `PalpalRuntimeConfig` 公開。
- AC-03:
  - 変更: 回帰テストを実行して PASS を確認。
  - 根拠: unit と対象 E2E コマンド結果。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: Settings モデル候補ソース、`.env` 反映、Guide/PAL 既存フロー回帰。

# delta-verify

## Delta ID
- DR-20260301-settings-model-catalog-env

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `settingsTabModelName` の候補生成が `PALPAL_CORE_MODELS` + 登録済みに変更 |
| AC-02 | PASS | `electron-main.js` で `.env` 読込、`electron-preload.js` で `PalpalRuntimeConfig` 公開 |
| AC-03 | PASS | `npm run test:unit` PASS、対象 E2E 12件 PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: `PALPAL_CORE_MODELS` の実運用拡張時は provider/model の正規化規約を `palpal-core` 側と合わせる必要がある。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-settings-model-catalog-env

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: Settings モデル候補を `palpal-core` 由来に切り替え、LM Studio 既定値を `.env` 管理にした。
- 変更対象: `wireframe/palpal-core-registry.js`、`wireframe/app.js`、`electron-main.js`、`electron-preload.js`、`.env`、関連 docs。
- 非対象: `palpal-core` 実依存導入、Settings UI 再設計、保存方式変更。

## 実装記録
- 変更ファイル:
  - wireframe/palpal-core-registry.js
  - wireframe/app.js
  - electron-main.js
  - electron-preload.js
  - .env
  - docs/plan.md
  - docs/OVERVIEW.md
  - docs/spec.md
  - docs/architecture.md
  - docs/delta/DR-20260301-settings-model-catalog-env.md
- AC達成状況: AC-01〜AC-03 すべて達成

## 検証記録
- verify要約: モデル候補ソース変更と `.env` runtime 既定値配線を確認し PASS。
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "guide chat resumes after registering model in settings|settings tab shows model list and allows adding model|settings persist after reload and api key is not displayed|pal list includes roles and allows name/model/tool settings"`

## 未解決事項
- なし
