# delta-request

## Delta ID
- DR-20260301-settings-provider-model-link

## 目的
- Settings のモデル追加で、`provider` と `model` の対応関係を `palpal-core` 由来で正しく扱う。
- 不正な provider/model 組み合わせで追加・保存が失敗する問題を防止する。

## 変更対象（In Scope）
- `wireframe/app.js` の palpal-core モデルカタログ解決と provider 連動ロジック。
- Settings モデル追加フォームの provider->model 絞り込み。
- 追加時の provider/model 整合性バリデーション。
- E2E の設定画面テストに provider 連動の検証を追加。

## 非対象（Out of Scope）
- Settings 保存基盤（SQLite / SecretStore）の方式変更。
- Settings レイアウトや文言全体の再設計。
- `palpal-core` パッケージ導入方式の変更。

## 差分仕様
- DS-01:
  - Given: モデル追加フォームで provider を選ぶ
  - When: model 候補を表示する
  - Then: 選択 provider に対応する `palpal-core` モデルのみが表示される
- DS-02:
  - Given: provider と model の不整合入力
  - When: モデル追加を実行する
  - Then: 追加を拒否して保存不整合を防ぐ
- DS-03:
  - Given: 既存設定に provider/model 不整合がある
  - When: 設定同期を行う
  - Then: `palpal-core` カタログ基準で provider を補正する

## 受入条件（Acceptance Criteria）
- AC-01: モデル候補は provider 選択に連動し、`palpal-core` 由来モデルに限定される。
- AC-02: provider/model 不整合な追加がブロックされる。
- AC-03: unit と対象 E2E が PASS する。

## 制約
- API_KEY 必須入力制約は維持する。
- 既存の Runtime(model/tool) 排他仕様は維持する。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-settings-provider-model-link

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/spec.md
- docs/delta/DR-20260301-settings-provider-model-link.md

## 適用内容（AC対応）
- AC-01:
  - 変更: palpal-core モデルカタログを provider 付きで正規化し、provider 別モデル候補マップを作成。
  - 根拠: `resolvePalpalCoreModels` / `PALPAL_CORE_MODEL_OPTIONS_BY_PROVIDER` / `selectableModelOptions(providerId)`。
- AC-02:
  - 変更: モデル追加時に `isValidProviderModelPair` 検証を追加し、不整合を保存前に拒否。
  - 根拠: `addModel` 内のバリデーション追加。
- AC-03:
  - 変更: E2E に provider 選択時の model 候補絞り込み検証を追加。
  - 根拠: `settings tab shows model list and allows adding model` テスト更新。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: provider/model 連動、追加保存の成否、既存フロー回帰。

# delta-verify

## Delta ID
- DR-20260301-settings-provider-model-link

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | provider 選択時に `settingsTabModelName` が対応候補へ絞り込まれる実装 + E2E 検証 |
| AC-02 | PASS | `isValidProviderModelPair` により不整合追加を拒否 |
| AC-03 | PASS | `npm run test:unit` PASS、対象 E2E 9件 PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: `palpal-core` 側のモデルカタログ形式が増える場合は正規化キー追加が必要。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-settings-provider-model-link

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: Settings モデル追加の provider/model 関係を `palpal-core` 基準で正規化し、保存失敗要因を削減した。
- 変更対象: `wireframe/app.js`、`tests/e2e/workspace-layout.spec.js`、関連 docs。
- 非対象: Settings 保存方式変更、UI再設計、依存導入方式変更。

## 実装記録
- 変更ファイル:
  - wireframe/app.js
  - tests/e2e/workspace-layout.spec.js
  - docs/plan.md
  - docs/spec.md
  - docs/delta/DR-20260301-settings-provider-model-link.md
- AC達成状況: AC-01〜AC-03 すべて達成

## 検証記録
- verify要約: provider/model 連動と保存フロー回帰を確認し PASS。
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model|guide chat resumes after registering model in settings|settings persist after reload and api key is not displayed"`

## 未解決事項
- なし
