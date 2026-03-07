# delta-request

## Delta ID
- DR-20260304-workspace-name-prefix-path-normalize

## 背景
- Guide の ToolCall で `palpal-hive/README.md` のように workspace 名を先頭に付けた相対パスが返ることがある。
- 現在は `workspaceRoot` 配下にさらに同名ディレクトリを解決してしまい、`file not found` になる。

## In Scope
- runtime の file-read/file-search path 解決で、workspace 名プレフィックス付き相対パスを自動吸収する。
- unit test を追加して挙動を固定する。

## Out of Scope
- モデルプロンプトの変更。
- UI 側の `/use` 仕様変更。
- 既存の workspace root 検証ロジック変更。

## 受入条件 (Acceptance Criteria)
- AC-01: `workspaceName/README.md` 形式で file-read が成功する。
- AC-02: `workspaceName` を path 指定した file-search が workspace root として扱われる。
- AC-03: `npm run test:unit` と `validate_delta_links` が PASS。

# delta-apply

## Delta ID
- DR-20260304-workspace-name-prefix-path-normalize

## ステータス
- APPLIED

## 変更ファイル
- runtime/palpal-core-runtime.js
- tests/unit/palpal-core-runtime.test.js
- docs/delta/DR-20260304-workspace-name-prefix-path-normalize.md

## AC対応
- AC-01:
  - `buildWorkspacePathCandidates` を追加し、workspace 名先頭セグメントを剥がした候補を作成。
  - `resolveWorkspaceFilePath` で候補を順次解決し、既存ファイル優先で採用。
- AC-02:
  - `resolveWorkspaceDirectoryPath` でも同候補ロジックを利用し、workspace 名 path を root に解決。
- AC-03:
  - unit test を2件追加（prefixed read / prefixed search）。

# delta-verify

## Delta ID
- DR-20260304-workspace-name-prefix-path-normalize

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `workspace-name-prefixed file-read path` テスト追加・PASS |
| AC-02 | PASS | `workspace-name-prefixed file-search path` テスト追加・PASS |
| AC-03 | PASS | `npm run test:unit` と `validate_delta_links` PASS |

## スコープ逸脱
- Out of Scope 変更なし

## Overall
- PASS

# delta-archive

## Delta ID
- DR-20260304-workspace-name-prefix-path-normalize

## verify結果: PASS

## クローズ内容
- ToolCall が workspace 名付き相対パスを返しても、runtime が自動吸収して正しい root 配下を参照できるようにした。

## 反映先
- runtime/palpal-core-runtime.js
- tests/unit/palpal-core-runtime.test.js
- docs/delta/DR-20260304-workspace-name-prefix-path-normalize.md
