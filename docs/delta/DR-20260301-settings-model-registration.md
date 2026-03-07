# delta-request

## Delta ID
- DR-20260301-settings-model-registration

## 目的
- Settingsで登録したモデルをGuide参照へ確実に反映する。

## 変更対象（In Scope）
- Settings保存時にGuideを登録モデルへバインドする。
- Pal表示でGuide runtime/model反映が確認できるようにする。
- unit/E2Eで反映動作を検証する。

## 非対象（Out of Scope）
- Settings UI構造変更。
- モデル永続化バックエンド実装。

## 差分仕様
- DS-01:
  - Given: Settingsでモデルを追加保存する
  - When: 保存同期が走る
  - Then: Guideが model runtime で登録モデルを参照する

## 受入条件（Acceptance Criteria）
- AC-01: Settings保存後、Guide profile が `runtimeKind=model` で有効モデル参照になる。
- AC-02: Pal List上でGuideの参照モデルが確認できる。
- AC-03: unit/E2Eで反映動作が検証される。

## 制約
- model登録フロー自体のUI改修は行わない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-settings-model-registration

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-chat.js
- wireframe/index.html
- wireframe/app.js
- tests/unit/guide-chat.test.js
- tests/e2e/workspace-layout.spec.js
- package.json
- docs/plan.md
- docs/delta/DR-20260301-settings-model-registration.md

## 適用内容（AC対応）
- AC-01:
  - 変更: Settings保存時に Guide を先頭登録モデルへバインドする処理を追加。
  - 根拠: `syncPalProfilesFromSettings` で `bindGuideToFirstRegisteredModelWithFallback` を呼び出す。
- AC-02:
  - 変更: Pal List 上で Guide runtime/model 反映を確認できるテストを追加。
  - 根拠: `settings tab shows model list and allows adding model` テストで `pal-guide` の runtime/model 値を検証。
- AC-03:
  - 変更: unit/E2E を追加・更新。
  - 根拠: `bindGuideToFirstRegisteredModel` の unit と関連E2Eを追加。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: Settings保存後のGuideモデル同期、Pal List反映、テスト結果

# delta-verify

## Delta ID
- DR-20260301-settings-model-registration

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `syncPalProfilesFromSettings` 内で Guide モデル同期を実施 |
| AC-02 | PASS | E2E で `pal-guide` の runtime/model 値を確認 |
| AC-03 | PASS | unit 20件PASS、guide関連E2E 9件PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: 保存後に Guide を先頭登録モデルへ寄せる仕様のため、Guide個別モデル選択は次段階で詳細化余地あり。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-settings-model-registration

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: Settings登録モデルを Guide 参照へ確実に反映する。
- 変更対象: `wireframe/guide-chat.js`、`wireframe/index.html`、`wireframe/app.js`、`tests/unit/guide-chat.test.js`、`tests/e2e/workspace-layout.spec.js`、`package.json`、`docs/plan.md`
- 非対象: Settings UI構造変更、永続化バックエンド実装

## 実装記録
- 変更ファイル:
  - wireframe/guide-chat.js
  - wireframe/index.html
  - wireframe/app.js
  - tests/unit/guide-chat.test.js
  - tests/e2e/workspace-layout.spec.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260301-settings-model-registration.md
- AC達成状況: AC-01〜AC-03 すべて達成

## 検証記録
- verify要約: Settings登録→Guide同期→Pal表示まで確認しPASS
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep 'guide chat is blocked when guide model is not configured|guide chat resumes after registering model in settings|settings tab shows model list and allows adding model'`

## 未解決事項
- なし
