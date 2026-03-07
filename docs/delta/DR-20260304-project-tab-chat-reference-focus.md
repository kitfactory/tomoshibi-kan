# delta-request

## Delta ID
- DR-20260304-project-tab-chat-reference-focus

## In Scope
- Workspace タブに `Project` を追加し、順序を `Guide Chat / Pal List / Project / ...` にする。
- Project は「プロジェクト名 + ディレクトリ」の一覧として管理できるUIを追加する（追加/削除/フォーカス）。
- Guide Chat で以下を実装する。
  - `@project` / `@project:file` の参照記法を解釈する。
  - フォーカス中プロジェクトがある場合、`@file` で直接参照できる。
  - `/use projectName` と `projectNameを開いて` でチャットフォーカスを更新する。
  - `@` 入力時に補完候補（プロジェクト名/ファイル）を表示する。

## Out of Scope
- 実ファイルシステムの再帰検索や全文インデックス実装
- 外部ストレージ仕様（SQLite schema）への新規テーブル追加
- LLMツール呼び出しプロトコルの変更

## Acceptance Criteria
- AC-01: Project タブが Pal List の次に表示され、パネル切替が機能する。
- AC-02: Project 一覧で追加/削除/フォーカス更新ができる。
- AC-03: Guide Chat で `/use` および `〜を開いて` がフォーカス更新として動作する。
- AC-04: Guide Chat で `@` 補完が表示され、`@project:file` とフォーカス時 `@file` が候補化される。
- AC-05: 既存E2E回帰を含む `workspace-layout` テストがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/index.html
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260304-project-tab-chat-reference-focus.md

## applied AC
- AC-01: タブと `data-tab-panel="project"` を追加し、タブ切替レンダリングへ `project` 分岐を追加。
- AC-02: Project 管理ステートと `renderProjectTab` を実装（追加/削除/フォーカス/ローカル保存）。
- AC-03: Guide Chat にフォーカスコマンド解釈（`/use`, `〜を開いて`）を追加。
- AC-04: Guide Chat 入力に `@` 補完UIを追加し、プロジェクト/ファイル候補を挿入可能にした。
- AC-05: Playwright `workspace-layout` 全件を再実行。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/index.html` と `wireframe/app.js` に `project` タブ/パネルを追加 |
| AC-02 | PASS | `renderProjectTab` で追加/削除/フォーカスを実装し `localStorage` へ保存 |
| AC-03 | PASS | `handleGuideFocusCommand` で `/use` と `〜を開いて` を処理 |
| AC-04 | PASS | `guideMentionMenu` と補完ロジックを実装しE2Eで確認 |
| AC-05 | PASS | `tests/e2e/workspace-layout.spec.js` 87件 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
