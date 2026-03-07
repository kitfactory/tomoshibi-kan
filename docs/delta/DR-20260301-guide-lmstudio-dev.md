# delta-request

## Delta ID
- DR-20260301-guide-lmstudio-dev

## 目的
- Guide が実際にモデル推論を使うようにし、開発/テスト時は LM Studio を既定利用にする。

## 変更対象（In Scope）
- Guide 送信を OpenAI 互換 `chat/completions` 呼び出し対応にする。
- 開発/テスト環境では `http://192.168.11.16:1234/v1` / `openai/gpt-oss-20b` を利用する。
- 既存 E2E の期待値を更新し、回帰確認を行う。

## 非対象（Out of Scope）
- 本番向けの秘密情報保管（キーチェーン連携）。
- Task/Job/Gate の業務ロジック変更。

## 差分仕様
- DS-01:
  - Given: Guide モデルが設定済み
  - When: Guide へメッセージ送信する
  - Then: OpenAI互換 API を呼び、応答取得失敗時は既存モック返信へフォールバックする

## 受入条件（Acceptance Criteria）
- AC-01: Guide 送信が非同期化され、モデル応答取得を試行する。
- AC-02: 開発/テスト環境で LM Studio 既定値（URL/モデル）が適用される。
- AC-03: 関連 E2E が PASS する。

## 制約
- 既存 UI レイアウトを変更しない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-guide-lmstudio-dev

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260301-guide-lmstudio-dev.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `sendGuideMessage` を async 化し、OpenAI互換 `fetch` 呼び出し + 失敗時フォールバックを実装。
- AC-02:
  - 変更: 開発/テスト判定時に LM Studio (`192.168.11.16:1234/v1` / `openai/gpt-oss-20b`) を強制利用する runtime 解決を実装。
  - 変更: 初期登録モデルと Guide 初期モデルも LM Studio 構成に更新。
- AC-03:
  - 変更: E2E の Guide 応答モデル表記期待値を `gpt-4.1` または `openai/gpt-oss-20b` に更新。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- Guide 送信フローの回帰、E2E 合格、delta 整合を確認する。

# delta-verify

## Delta ID
- DR-20260301-guide-lmstudio-dev

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `sendGuideMessage` が async 化され、モデル呼び出しとフォールバックを実装 |
| AC-02 | PASS | 開発/テスト判定時の LM Studio runtime 解決を実装 |
| AC-03 | PASS | 関連 E2E 6件 PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: LM Studio が未起動の場合はフォールバック返信に切り替わる。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-guide-lmstudio-dev

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Guide の実モデル呼び出しを追加し、開発/テストで LM Studio 既定利用にする。
- 変更対象: `wireframe/app.js`、`tests/e2e/workspace-layout.spec.js`、`docs/plan.md`
- 非対象: キー保管方式の本実装、Task/Job/Gate ロジック変更

## 実装記録
- 変更ファイル:
  - wireframe/app.js
  - tests/e2e/workspace-layout.spec.js
  - docs/plan.md
  - docs/delta/DR-20260301-guide-lmstudio-dev.md
- AC達成状況: AC-01〜AC-03 すべて達成

## 検証記録
- `node --check wireframe/app.js`
- `npm run build:wireframe-css`
- `npx playwright test tests/e2e/workspace-layout.spec.js --grep "guide chat resumes after registering model in settings|language switch exists in settings tab"`
- `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- なし
