# delta-request

## Delta ID
- DR-20260304-project-list-remove-focus-and-unlist-wording

## In Scope
- Project一覧からフォーカス操作ボタン/表示を除去する。
- Project一覧の「削除」表現を廃止し、「一覧から外す」へ置き換える。
- 「一覧から外す」操作はフォルダ削除ではないことを注記する。

## Out of Scope
- チャット内フォーカス機能（`/use` / `〜を開いて`）の削除
- Projectデータ保存方式の変更
- フォルダ実体への削除処理追加

## Acceptance Criteria
- AC-01: Project一覧にフォーカスボタン/バッジが表示されない。
- AC-02: ボタン文言が「一覧から外す（Unlist）」へ変更される。
- AC-03: 注記で「フォルダは削除されない」ことが明示される。
- AC-04: Project/Guide関連E2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- docs/plan.md
- docs/delta/DR-20260304-project-list-remove-focus-and-unlist-wording.md

## applied AC
- AC-01: `renderProjectTab` からフォーカスボタン生成とイベントバインドを削除。
- AC-02: 文言を `削除 -> 一覧から外す`、`Remove -> Unlist` に変更。
- AC-03: Project注記へ「一覧から外してもフォルダは削除されない」を追記。
- AC-04: PlaywrightのProject/Guide対象シナリオを再実行。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` のProject行から focus UIを除去 |
| AC-02 | PASS | `wireframe/app.js` のlabelsを更新 |
| AC-03 | PASS | `wireframe/app.js` のnote文言を更新 |
| AC-04 | PASS | Playwright 6件 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
