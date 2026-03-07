# delta-request

## Delta ID
- DR-20260301-guide-chat-dialogue

## 目的
- モデル設定済みGuideの対話フローを明確化し、返信にモデル文脈を反映する。

## 変更対象（In Scope）
- Guide返信生成に model/provider 文脈を反映する。
- Guide対話ロジックをモジュール化し、unitで検証する。
- E2Eで「設定後は送受信できる」ことを検証する。

## 非対象（Out of Scope）
- 実LLM API通信。
- Plan/Task自動生成ロジック本実装。

## 差分仕様
- DS-01:
  - Given: Guideモデルが有効に設定されている
  - When: ユーザーが送信する
  - Then: ユーザー発話とGuide返信が記録され、返信に model 文脈が含まれる

## 受入条件（Acceptance Criteria）
- AC-01: 設定済み時にGuide送受信が成立する。
- AC-02: 返信文に model 文脈（例: provider/model）が含まれる。
- AC-03: unit/E2Eで対話成立が検証される。

## 制約
- 返信はMVPモック生成のままとする（実API接続なし）。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-guide-chat-dialogue

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
- docs/delta/DR-20260301-guide-chat-dialogue.md

## 適用内容（AC対応）
- AC-01:
  - 変更: モデル設定済み時の Guide 送受信フローを実装。
  - 根拠: `sendGuideMessage` で guideState ready 時のみユーザー発話 + Guide返信を追加。
- AC-02:
  - 変更: Guide返信に provider/model 文脈を反映。
  - 根拠: `buildGuideReplyWithFallback` で `providerLabel/modelName` を返信へ埋め込み。
- AC-03:
  - 変更: unit/E2E を追加・更新。
  - 根拠: `buildGuideModelReply` の unit と `guide chat resumes after registering model in settings` E2E を追加。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: 設定済み時の送受信成立、返信文脈、テスト結果

# delta-verify

## Delta ID
- DR-20260301-guide-chat-dialogue

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | 設定済み時にGuide送受信が成立することをE2Eで確認 |
| AC-02 | PASS | 返信テキストへ provider/model 文脈を含むことを unit/E2E で確認 |
| AC-03 | PASS | unit 20件PASS、guide関連E2E 9件PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: 応答はMVPモック生成であり、実API接続は未実装。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-guide-chat-dialogue

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: モデル設定済み Guide 対話フローを成立させ、返信へ model 文脈を反映する。
- 変更対象: `wireframe/guide-chat.js`、`wireframe/index.html`、`wireframe/app.js`、`tests/unit/guide-chat.test.js`、`tests/e2e/workspace-layout.spec.js`、`package.json`、`docs/plan.md`
- 非対象: 実LLM API通信、Plan/Task自動生成本実装

## 実装記録
- 変更ファイル:
  - wireframe/guide-chat.js
  - wireframe/index.html
  - wireframe/app.js
  - tests/unit/guide-chat.test.js
  - tests/e2e/workspace-layout.spec.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260301-guide-chat-dialogue.md
- AC達成状況: AC-01〜AC-03 すべて達成

## 検証記録
- verify要約: 設定済み時送受信と文脈反映を確認しPASS
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep 'guide chat is blocked when guide model is not configured|guide chat resumes after registering model in settings|settings tab shows model list and allows adding model'`

## 未解決事項
- なし
