# delta-request

## Delta ID
- DR-20260301-settings-lmstudio-provider

## 目的
- Settings の provider/model 選択を provider 依存で正しく連動させる。
- provider 選択肢に `LM Studio` を含める。

## 変更対象（In Scope）
- `wireframe/palpal-core-registry.js` の provider/model レジストリに `lmstudio` を追加。
- `wireframe/app.js` の provider/model カタログ正規化と連動処理を強化。
- `.env` 既定 provider を `lmstudio` に変更。
- E2E で `lmstudio` provider 選択肢存在を検証。

## 非対象（Out of Scope）
- 設定保存基盤（SQLite / SecretStore）の変更。
- Settings レイアウト再設計。
- palpal-core 実依存方式の変更。

## 差分仕様
- DS-01:
  - Given: Settings のモデル追加フォームを開く
  - When: provider を表示する
  - Then: `LM Studio` が選択肢に表示される
- DS-02:
  - Given: provider を選択する
  - When: model 候補を表示する
  - Then: provider に対応するモデル候補のみ表示される
- DS-03:
  - Given: provider/model の組み合わせが不整合
  - When: モデル追加を実行する
  - Then: 追加を拒否し保存不整合を防止する

## 受入条件（Acceptance Criteria）
- AC-01: Settings provider 選択肢に `lmstudio` が含まれる。
- AC-02: provider 変更時に model 候補が連動する。
- AC-03: unit と対象 E2E が PASS する。

## 制約
- API_KEY 必須制約は維持する。
- Runtime(model/tool) 排他仕様は維持する。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-settings-lmstudio-provider

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/palpal-core-registry.js
- wireframe/app.js
- .env
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/spec.md
- docs/delta/DR-20260301-settings-lmstudio-provider.md

## 適用内容（AC対応）
- AC-01:
  - 変更: provider レジストリに `lmstudio` を追加。
  - 根拠: `wireframe/palpal-core-registry.js` と `FALLBACK_PROVIDER_REGISTRY`。
- AC-02:
  - 変更: provider/model 正規化を強化し、provider 依存の model 候補連動を維持。
  - 根拠: `normalizeProviderIdForCatalog` / `resolveProviderRegistry` / `selectableModelOptions(providerId)`。
- AC-03:
  - 変更: E2E に `lmstudio` provider option の存在検証を追加。
  - 根拠: `settings tab shows model list and allows adding model` のテスト更新。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: LM Studio 表示、provider-model 連動、保存フロー回帰。

# delta-verify

## Delta ID
- DR-20260301-settings-lmstudio-provider

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | provider option に `lmstudio` を追加し E2E で存在確認 |
| AC-02 | PASS | provider ごとの model 候補連動ロジックを維持・補強 |
| AC-03 | PASS | `npm run test:unit` PASS / 対象 E2E 3件 PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: palpal-core 側の provider alias 増加時は alias マップ拡張が必要。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-settings-lmstudio-provider

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: LM Studio を provider 選択肢に追加し、provider-model 連動不整合を解消した。
- 変更対象: `wireframe/palpal-core-registry.js`、`wireframe/app.js`、`.env`、`tests/e2e/workspace-layout.spec.js`。
- 非対象: Settings 保存方式、UI再設計、依存導入方式。

## 実装記録
- 変更ファイル:
  - wireframe/palpal-core-registry.js
  - wireframe/app.js
  - .env
  - tests/e2e/workspace-layout.spec.js
  - docs/plan.md
  - docs/spec.md
  - docs/delta/DR-20260301-settings-lmstudio-provider.md
- AC達成状況: AC-01〜AC-03 すべて達成

## 検証記録
- verify要約: LM Studio option 追加、provider/model 連動、保存フロー回帰を確認し PASS。
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model"`

## 未解決事項
- なし
