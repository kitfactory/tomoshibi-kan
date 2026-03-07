# delta-request

## Delta ID
- DR-20260301-guide-model-guard

## 目的
- Guideモデル未設定時は会話送信をブロックし、Settings設定を促す。

## 変更対象（In Scope）
- Guide送信前に `Guide runtime=model + model参照有効` を検証する。
- 未設定時にエラー表示（MSG）と設定誘導メッセージを表示する。
- unit/E2Eで未設定ブロックを検証する。

## 非対象（Out of Scope）
- 実LLM API接続。
- Task/Job/Gateロジックの変更。

## 差分仕様
- DS-01:
  - Given: Guideモデル未設定状態
  - When: Guide送信する
  - Then: 送信はブロックされ、Settings設定を促す

## 受入条件（Acceptance Criteria）
- AC-01: Guideモデル未設定時に送信が失敗し、`MSG-PPH-1010` を表示する。
- AC-02: Guideチャットに設定誘導文が表示される。
- AC-03: E2Eで未設定ブロックが検証される。

## 制約
- 既存UIレイアウトは変更しない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-guide-model-guard

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
- docs/delta/DR-20260301-guide-model-guard.md

## 適用内容（AC対応）
- AC-01:
  - 変更: Guide送信時にモデル設定状態を検証し、未設定時は `MSG-PPH-1010` でブロックするよう変更。
  - 根拠: `sendGuideMessage` で `resolveGuideModelStateWithFallback` を評価し、未設定時は return。
- AC-02:
  - 変更: Guideチャットへ設定誘導システムメッセージを追加し、Settingsタブへ誘導する動作を追加。
  - 根拠: `buildGuideModelRequiredPromptWithFallback` と `setWorkspaceTab(\"settings\")` を追加。
- AC-03:
  - 変更: unit/E2E を追加。
  - 根拠: `tests/unit/guide-chat.test.js` と `guide chat is blocked when guide model is not configured` を追加。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: 未設定ブロック、MSG表示、Settings誘導、テスト結果

# delta-verify

## Delta ID
- DR-20260301-guide-model-guard

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `sendGuideMessage` が未設定時に `MSG-PPH-1010` で停止 |
| AC-02 | PASS | 設定誘導メッセージ表示 + Settingsタブ遷移を確認 |
| AC-03 | PASS | unit 20件PASS、guide関連E2E 9件PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: 実LLM接続は未実装のため、未設定判定はモデル参照整合のみを対象とする。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-guide-model-guard

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: Guideモデル未設定時の送信ブロックと設定誘導を実装する。
- 変更対象: `wireframe/guide-chat.js`、`wireframe/index.html`、`wireframe/app.js`、`tests/unit/guide-chat.test.js`、`tests/e2e/workspace-layout.spec.js`、`package.json`、`docs/plan.md`
- 非対象: 実LLM API接続、Task/Job/Gateロジック変更

## 実装記録
- 変更ファイル:
  - wireframe/guide-chat.js
  - wireframe/index.html
  - wireframe/app.js
  - tests/unit/guide-chat.test.js
  - tests/e2e/workspace-layout.spec.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260301-guide-model-guard.md
- AC達成状況: AC-01〜AC-03 すべて達成

## 検証記録
- verify要約: 未設定ブロック/設定誘導/E2Eを確認しPASS
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep 'guide chat is blocked when guide model is not configured|guide chat resumes after registering model in settings|settings tab shows model list and allows adding model'`

## 未解決事項
- なし
