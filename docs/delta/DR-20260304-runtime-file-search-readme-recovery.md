# delta-request

## Delta ID
- DR-20260304-runtime-file-search-readme-recovery

## 背景
- Guide Chat で `@README.md` を参照した際、`codex-file-read` と `codex-file-search` がループし、`max turns` で停止して最終回答に到達しない。
- 現在の `codex-file-search` は要約スタブで、実ファイル検索結果を返していない。

## In Scope
- `runtime/palpal-core-runtime.js` の `codex-file-search` を実検索化する。
- `@README.md` のような `@` 付きパスを `codex-file-read` で読めるように正規化する。
- tool loop が `max_turns` で停止した場合、直近の成功 `codex-file-read` 結果を復元応答として返す。
- unit test を追加して再発を防ぐ。

## Out of Scope
- Guide UI の表示・デザイン変更。
- Task/Cron の実行モデル変更。
- file-edit/shell/test-runner/browser ツールの仕様変更。

## 受入条件 (Acceptance Criteria)
- AC-01: `codex-file-search` が workspace 配下を実際に走査し、`matches` を返す。
- AC-02: `codex-file-read` が `@README.md` を正しく `README.md` として読める。
- AC-03: `max_turns` 停止時、成功済み `codex-file-read` があればその内容を fallback 応答に含める。
- AC-04: `npm run test:unit` が PASS する。

# delta-apply

## Delta ID
- DR-20260304-runtime-file-search-readme-recovery

## ステータス
- APPLIED

## 変更ファイル
- runtime/palpal-core-runtime.js
- tests/unit/palpal-core-runtime.test.js
- docs/delta/DR-20260304-runtime-file-search-readme-recovery.md

## AC対応
- AC-01:
  - `createFileSearchTool(workspaceRoot)` を実装し、workspace 再帰走査 + path/content マッチを返すように変更。
  - `maxResults/maxFiles` と除外ディレクトリ、巨大ファイルスキップを追加。
- AC-02:
  - `normalizeWorkspacePathInput` を追加し、`@` と引用符付きパスを正規化。
  - `resolveWorkspaceFilePath` / `createFileReadTool` で同正規化を使用。
- AC-03:
  - `findLatestSuccessfulFileRead` を追加し、`buildToolLoopFallbackText` で `max_turns`/`repeated_plan` 時に復元応答へ反映。
- AC-04:
  - unit tests に以下を追加。
    - `@`付き file-read + max_turns fallback 復元検証。
    - file-search 実検索結果（`matches`）の検証。

# delta-verify

## Delta ID
- DR-20260304-runtime-file-search-readme-recovery

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `codex-file-search` が `matches/scannedFiles/truncated` を返す実装を追加 |
| AC-02 | PASS | `@README.md` を read できる unit test を追加 |
| AC-03 | PASS | `max_turns` 時に `Recovered file read:` を返す unit test を追加 |
| AC-04 | PASS | `npm run test:unit` 実行で PASS |

## スコープ逸脱
- Out of Scope 変更なし

## Overall
- PASS

# delta-archive

## Delta ID
- DR-20260304-runtime-file-search-readme-recovery

## verify結果: PASS

## クローズ内容
- `@README.md` 参照時に file skill が停止ループして回答不能になる問題を解消。
- 検索ツールをスタブから実検索へ移行し、停止時の読取結果復元を追加。

## 反映先
- runtime/palpal-core-runtime.js
- tests/unit/palpal-core-runtime.test.js
- docs/delta/DR-20260304-runtime-file-search-readme-recovery.md
