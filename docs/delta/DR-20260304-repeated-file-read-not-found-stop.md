# delta-request

## Delta ID
- DR-20260304-repeated-file-read-not-found-stop

## 背景
- `README.md` が存在しないとき、model が `file-read -> file-search -> file-read -> file-search` を繰り返し、`max turns` まで到達してしまう。
- ユーザーには早い段階で「そのファイルは見つからない」を返す方が自然。

## In Scope
- runtime tool loop に、同一パスの `codex-file-read` not-found が2回観測された時点で早期停止する判定を追加。
- 停止時は既存の file-not-found fallback を返す。
- unit test を追加して挙動を固定。

## Out of Scope
- モデルプロンプト変更。
- file-search の検索アルゴリズム変更。
- UI レイヤ変更。

## 受入条件 (Acceptance Criteria)
- AC-01: 同一 path の `codex-file-read` not-found が2回発生した場合、`maxTurns` を待たず loop が停止する。
- AC-02: 停止応答は `Requested file could not be read.` を返す。
- AC-03: `npm run test:unit` と `validate_delta_links` が PASS。

# delta-apply

## Delta ID
- DR-20260304-repeated-file-read-not-found-stop

## ステータス
- APPLIED

## 変更ファイル
- runtime/palpal-core-runtime.js
- tests/unit/palpal-core-runtime.test.js
- docs/delta/DR-20260304-repeated-file-read-not-found-stop.md

## AC対応
- AC-01:
  - `findRepeatedNotFoundFileRead` を追加。
  - `runModelToolLoop` で tool 実行後に判定し、該当時に即 return。
- AC-02:
  - `loopStopReason = repeated_file_read_not_found` を追加。
  - `buildToolLoopFallbackText` の reasonText に反映。
- AC-03:
  - unit test 追加 + test/validate 実行。

# delta-verify

## Delta ID
- DR-20260304-repeated-file-read-not-found-stop

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | 同一 read-not-found 2回で早期停止する unit test 追加 |
| AC-02 | PASS | fallback 文面 `Requested file could not be read.` を確認 |
| AC-03 | PASS | `npm run test:unit` / `validate_delta_links` PASS |

## スコープ逸脱
- Out of Scope 変更なし

## Overall
- PASS

# delta-archive

## Delta ID
- DR-20260304-repeated-file-read-not-found-stop

## verify結果: PASS

## クローズ内容
- read-not-found が繰り返されたときに max turns まで待たず停止し、見つからない旨を早く返すように改善した。

## 反映先
- runtime/palpal-core-runtime.js
- tests/unit/palpal-core-runtime.test.js
- docs/delta/DR-20260304-repeated-file-read-not-found-stop.md
