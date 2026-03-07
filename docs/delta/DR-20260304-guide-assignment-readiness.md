# delta-request

## Delta ID
- DR-20260304-guide-assignment-readiness

## 目的
- Guide がユーザー要望を受けた直後に、手順へ分解した Task を作成し、Pal の role/skill 文脈に基づいて割り当てられる状態を作る。

## 変更対象（In Scope）
- Guide planner モジュール（要望分解・割当）を追加する。
- `wireframe/app.js` の Guide 送信フローに「Task 作成と Pal 割当」を接続する。
- Pal 割当時に role 文脈（identity role/fallback）と skill summaries を使う。
- Task 作成の unit test と E2E 検証を追加する。

## 非対象（Out of Scope）
- Task 進捗運用（start/submit/gate）のルール変更。
- Guide planner を LLM JSON 出力に置き換える実装。
- Gate/Worker 側の追加ロジック変更。

## 差分仕様
- DS-01:
  - Given: Guide にユーザー要望が送信される
  - When: 送信が成功する
  - Then: 要望が Task drafts に分解され、Task が生成される
- DS-02:
  - Given: worker Pal ごとの role/skill 文脈がある
  - When: Task を割り当てる
  - Then: role/skill マッチに基づく Pal 割当を行う
- DS-03:
  - Given: Task が作成される
  - When: dispatch を記録する
  - Then: Event Log に dispatch event が追記される

## 受入条件（Acceptance Criteria）
- AC-01: Guide planner の unit test が追加され、分解と割当を検証できる。
- AC-02: Guide 送信後に Task が自動生成される（Task Board で確認可能）。
- AC-03: `npm run test:unit` と `npm run test:e2e -- --reporter=list` が PASS する。

## 制約
- 既存の Guide 会話フロー（user + guide のメッセージ更新）を壊さない。
- Task 生成は最小構成（assigned 状態）に限定する。

## 未確定事項
- Q-01: 将来、分解を LLM 指示形式に切り替える際の互換方式。

# delta-apply

## Delta ID
- DR-20260304-guide-assignment-readiness

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-task-planner.js
- wireframe/app.js
- wireframe/index.html
- tests/unit/guide-task-planner.test.js
- tests/e2e/workspace-layout.spec.js
- package.json
- docs/plan.md
- docs/delta/DR-20260304-guide-assignment-readiness.md

## 適用内容（AC対応）
- AC-01:
  - 変更: Guide planner と unit test を追加し、分解・割当・スコアリングを検証。
  - 根拠: `tests/unit/guide-task-planner.test.js` で主要ケースを確認。
- AC-02:
  - 変更: Guide送信フローに `createPlannedTasksFromGuideRequest` を接続し、Task生成と dispatch event 追記を実装。
  - 根拠: `wireframe/app.js` で送信成功後に Task 作成処理を実行。
- AC-03:
  - 変更: E2E に `guide chat creates planned tasks and assigns workers` を追加。
  - 根拠: `npm run test:unit` / `npm run test:e2e -- --reporter=list` の PASS。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- Guide 会話メッセージ数の既存検証を壊していないこと。
- Task 追加数と割当表示が再現すること。

# delta-verify

## Delta ID
- DR-20260304-guide-assignment-readiness

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `tests/unit/guide-task-planner.test.js` 追加、`npm run test:unit` 55 passed |
| AC-02 | PASS | Guide 送信後の Task 作成を `wireframe/app.js` で接続 |
| AC-03 | PASS | `npm run test:e2e -- --reporter=list` 90 passed / 1 skipped |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: 現在はルールベース分解のため、複雑要件では Task 粒度が荒くなる可能性がある。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260304-guide-assignment-readiness

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Guide の要望分解→Pal割当→Task作成フローを MVP で有効化した。
- 変更対象: planner モジュール、Guide送信フロー、unit/E2E。
- 非対象: 進捗運用変更、LLM分解置換、他ロール改修。

## 実装記録
- 変更ファイル:
  - wireframe/guide-task-planner.js
  - wireframe/app.js
  - wireframe/index.html
  - tests/unit/guide-task-planner.test.js
  - tests/e2e/workspace-layout.spec.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260304-guide-assignment-readiness.md
- AC達成状況:
  - AC-01: 達成
  - AC-02: 達成
  - AC-03: 達成

## 検証記録
- verify要約: unit/e2e と delta links を確認し PASS。
- 主要な根拠: `npm run test:unit` / `npm run test:e2e -- --reporter=list` / `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- あり
  - 分解精度を上げる LLM planner 連携は次フェーズ対応。

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: 生成Taskの理由表示（なぜこのPalに割り当てたか）を Task Detail に表示する。
