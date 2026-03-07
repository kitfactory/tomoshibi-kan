# delta-request

## Delta ID
- DR-20260304-project-list-hide-focus-display

## In Scope
- Project 一覧で表示していた「現在のフォーカス」バッジ表示を削除する。
- Project 一覧は管理情報（名前/ディレクトリ）中心にし、フォーカス状態表示を持たない。

## Out of Scope
- フォーカス機能そのものの削除
- `/use` や `〜を開いて` のコマンド仕様変更
- Guide Chat 側のフォーカス表示（チャット内表示）の変更

## Acceptance Criteria
- AC-01: Project 一覧に「現在のフォーカス」表示が出ない。
- AC-02: 既存の Project/Guide 関連E2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- docs/plan.md
- docs/delta/DR-20260304-project-list-hide-focus-display.md

## applied AC
- AC-01: `renderProjectTab` の focus badge 出力と文言定義を削除。
- AC-02: Project/Guide のE2Eシナリオを再実行。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` で focus badge テンプレート除去 |
| AC-02 | PASS | Playwright 6件 PASS（project tab + @ completion） |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
