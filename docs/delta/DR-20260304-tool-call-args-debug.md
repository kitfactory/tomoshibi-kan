# delta-request

## Delta ID
- DR-20260304-tool-call-args-debug

## 背景
- tool-loop ログが `plannedTools` のみで、実際の ToolCall 引数（path/query など）が見えず、原因切り分けが遅い。

## In Scope
- `PALPAL_RUNTIME_DEBUG=1` 時の runtime ログに ToolCall 引数サマリを追加する。
- 実行後ログに ToolCall の成功/失敗と output サマリを追加する。
- 既存挙動（ツール実行結果や停止条件）は変更しない。

## Out of Scope
- Guide UI 表示変更。
- repeated-plan 判定ロジックの閾値変更。
- ツール仕様（file-read/search/edit/shell/browser）変更。

## 受入条件 (Acceptance Criteria)
- AC-01: `tool-loop turn` ログに `plannedCallDetails`（tool + args）が含まれる。
- AC-02: `tool-call requested/executed/failed` ログで引数と結果要約が確認できる。
- AC-03: `node --check runtime/palpal-core-runtime.js` と `npm run test:unit` が PASS。

# delta-apply

## Delta ID
- DR-20260304-tool-call-args-debug

## ステータス
- APPLIED

## 変更ファイル
- runtime/palpal-core-runtime.js
- docs/delta/DR-20260304-tool-call-args-debug.md

## AC対応
- AC-01:
  - `buildPlannedCallDebugEntries` を追加。
  - `runModelToolLoop` の debug ログに `plannedCallDetails` を追加。
- AC-02:
  - `executeRequestedToolCalls` に `tool-call requested/missing/executed/failed` ログを追加。
  - 引数/出力は `summarizeValueForDebug` で短縮してログ化。
- AC-03:
  - 構文チェックと unit test 実行。

# delta-verify

## Delta ID
- DR-20260304-tool-call-args-debug

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `runModelToolLoop` debug 出力に `plannedCallDetails` を追加 |
| AC-02 | PASS | `executeRequestedToolCalls` に requested/executed/failed ログを追加 |
| AC-03 | PASS | `node --check` と `npm run test:unit` が PASS |

## スコープ逸脱
- Out of Scope 変更なし

## Overall
- PASS

# delta-archive

## Delta ID
- DR-20260304-tool-call-args-debug

## verify結果: PASS

## クローズ内容
- ToolCall の引数と結果を runtime debug ログで可視化し、`@README.md` 等の不整合調査を即時化した。

## 反映先
- runtime/palpal-core-runtime.js
- docs/delta/DR-20260304-tool-call-args-debug.md
