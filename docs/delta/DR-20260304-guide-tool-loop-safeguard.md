# delta-request

## Delta ID
- DR-20260304-guide-tool-loop-safeguard

## 目的
- Guide で browser 系スキルを使った際に `tool loop exceeded max turns` が発生するケースを停止可能にし、デバッグ情報を取得できるようにする。

## 変更対象（In Scope）
- `runtime/palpal-core-runtime.js` の tool loop に収束失敗時のセーフガードを追加する。
- 連続で同一 tool plan が返る場合の早期停止と、max turn 到達時のフォールバック応答を実装する。
- デバッグログ（envトグル）と loop trace を結果へ含める。
- unit test を追加して「例外で落ちない」ことを検証する。

## 非対象（Out of Scope）
- スキル実体の高度化（browser 自動操作や shell 実行許可の拡張）。
- Guide UI 文言の大幅変更。
- Gate/Task/Cron の状態遷移仕様変更。

## 差分仕様
- DS-01:
  - Given: モデルが同一の tool plan を連続で返す
  - When: tool loop を実行する
  - Then: 例外を投げず、`loopStopReason=repeated_plan` で停止しフォールバック文を返す
- DS-02:
  - Given: モデルが最終回答を返さず maxTurns に到達する
  - When: tool loop を実行する
  - Then: 例外を投げず、`loopStopReason=max_turns` で停止しフォールバック文を返す
- DS-03:
  - Given: デバッグフラグ `PALPAL_RUNTIME_DEBUG=1`
  - When: tool loop を実行する
  - Then: turnごとの planned tool 情報を main process log に出力する

## 受入条件（Acceptance Criteria）
- AC-01: tool loop が未収束でも `requestGuideChatCompletion` は throw せず結果を返す。
- AC-02: 返却 payload に `loopStopReason` と `loopTrace` が含まれる。
- AC-03: `npm run test:unit` が PASS する。

## 制約
- 既存の成功系（通常の tool 実行→最終回答）の挙動を壊さない。
- 既存 public I/F の必須フィールド（`text`, `toolCalls`）を維持する。

## 未確定事項
- Q-01: 収束失敗時メッセージをUIでどう見せるか（専用バッジ等）は次 delta で検討。

# delta-apply

## Delta ID
- DR-20260304-guide-tool-loop-safeguard

## 実行ステータス
- APPLIED

## 変更ファイル
- runtime/palpal-core-runtime.js
- tests/unit/palpal-core-runtime.test.js
- docs/delta/DR-20260304-guide-tool-loop-safeguard.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `runModelToolLoop` の終端 throw を廃止し、`repeated_plan` / `max_turns` でフォールバック応答を返すよう変更。
  - 根拠: `buildToolLoopFallbackText` と停止条件分岐を実装。
- AC-02:
  - 変更: runtime 結果に `loopStopReason` / `loopTrace` を追加。
  - 根拠: `requestPalChatCompletion` の返却payloadへ格納。
- AC-03:
  - 変更: unit test を追加し、未収束時にも例外で落ちないことを検証。
  - 根拠: `requestGuideChatCompletion returns fallback text instead of throwing...` テスト追加。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- `PALPAL_RUNTIME_DEBUG=1` で turnログが出ること。
- browser 指示時に main process 側で例外ログが出ないこと。

# delta-verify

## Delta ID
- DR-20260304-guide-tool-loop-safeguard

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | unit test 追加で未収束時に fallback text を返すことを確認 |
| AC-02 | PASS | `loopStopReason` / `loopTrace` を payload へ追加 |
| AC-03 | PASS | `npm run test:unit` 59 passed |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- R-01: 現在のフォールバック文は runtime生成の英語ベースで、UI側の翻訳統一は未対応。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260304-guide-tool-loop-safeguard

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Guide の tool loop 収束失敗時でも落ちずに応答可能化し、原因追跡のログ/traceを追加した。
- 変更対象: runtime loop停止条件、debug log、unit test。
- 非対象: スキル実体拡張、UI改善、状態遷移仕様変更。

## 実装記録
- 変更ファイル:
  - runtime/palpal-core-runtime.js
  - tests/unit/palpal-core-runtime.test.js
  - docs/delta/DR-20260304-guide-tool-loop-safeguard.md
- AC達成状況:
  - AC-01: 達成
  - AC-02: 達成
  - AC-03: 達成

## 検証記録
- verify要約: tool loop 収束失敗ケースを unit test で固定し、全unitを再実行して PASS。
- 主要な根拠:
  - `npm run test:unit`

## 未解決事項
- あり
  - Q-01: UI上で `loopStopReason` を明示表示するかの設計。

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: 収束失敗時の UI 表示（警告バッジ/再試行導線）を追加する。
