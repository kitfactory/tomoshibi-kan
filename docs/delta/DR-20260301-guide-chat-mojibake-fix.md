# delta-request

## Delta ID
- DR-20260301-guide-chat-mojibake-fix

## 目的
- Guide Chat を含む画面上の日本語文字化けを解消し、可読性を回復する。

## 変更対象（In Scope）
- `wireframe/app.js` の日本語文言（UI_TEXT/DYNAMIC_TEXT/MESSAGE_TEXT、初期データ、イベント文言）の復元。
- `wireframe/index.html` の Guide 送信ボタン文言の復元。
- 文字化けパターンが残っていないことの検証。

## 非対象（Out of Scope）
- UI レイアウトやコンポーネント構造の変更。
- 新規機能追加や状態遷移ロジックの変更。

## 差分仕様
- DS-01:
  - Given: locale が `ja`
  - When: Guide Chat/Task/Job/Event のテキストを表示する
  - Then: 文字化けせず日本語文言として表示される

## 受入条件（Acceptance Criteria）
- AC-01: Guide Chat のヒント・入力プレースホルダ・送信ボタン・初期メッセージが文字化けしない。
- AC-02: Task/Job/Event/Gate に表示される日本語文言が文字化けしない。
- AC-03: 構文チェックと対象 E2E が PASS する。

## 制約
- 既存の動作仕様を変えない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-guide-chat-mojibake-fix

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- wireframe/index.html
- docs/plan.md
- docs/delta/DR-20260301-guide-chat-mojibake-fix.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `UI_TEXT.ja` / `DYNAMIC_TEXT.ja` / `MESSAGE_TEXT.*.ja` の壊れた文字列を復元。
  - 変更: Guide 初期メッセージと送信ボタン文言を復元。
- AC-02:
  - 変更: Task/Job 初期データ、Event 初期データ、状態遷移時の日本語イベント文言を復元。
- AC-03:
  - 変更: 構文チェックと E2E を実行し回帰確認。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- 日本語表示が崩れていないこと、既存挙動が維持されていることを確認する。

# delta-verify

## Delta ID
- DR-20260301-guide-chat-mojibake-fix

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` / `wireframe/index.html` の Guide 文言を復元し、文字化けパターン検索で未検出 |
| AC-02 | PASS | Task/Job/Event/Gate の日本語文言を復元し、文字化けパターン検索で未検出 |
| AC-03 | PASS | `node --check wireframe/app.js` PASS、Playwright 対象6件 PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: 日本語文言は静的定義のため、将来追加分は辞書分離時に同様の検証を継続する。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-guide-chat-mojibake-fix

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Guide Chat を含む日本語文字化けを解消する。
- 変更対象: `wireframe/app.js`、`wireframe/index.html`
- 非対象: レイアウト変更、新規機能追加

## 実装記録
- 変更ファイル:
  - wireframe/app.js
  - wireframe/index.html
  - docs/plan.md
  - docs/delta/DR-20260301-guide-chat-mojibake-fix.md
- AC達成状況: AC-01〜AC-03 すべて達成

## 検証記録
- `node --check wireframe/app.js`
- `npm run build:wireframe-css`
- `npx playwright test tests/e2e/workspace-layout.spec.js --grep "guide chat resumes after registering model in settings|language switch exists in settings tab"`

## 未解決事項
- なし
