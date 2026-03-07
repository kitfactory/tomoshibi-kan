# delta-request

## Delta ID
- DR-20260304-project-directory-picker-unlist-enabled

## In Scope
- Project 一覧の「一覧から外す」を常時有効にし、0件になるまで外せるようにする。
- Project 追加を「ボタン押下 -> ディレクトリ選択」フローに変更し、選択ディレクトリ末尾名をプロジェクト名として採用する。
- 既登録ディレクトリを再選択した場合に「プロジェクトは既に含まれています。」ダイアログを表示する。

## Out of Scope
- フォルダ実体の削除
- Project フォーカス仕様の変更
- Guide Chat の補完仕様変更

## Acceptance Criteria
- AC-01: Project 一覧の「一覧から外す」ボタンは常時有効で、全件外せる。
- AC-02: 「プロジェクトを追加」ボタンでディレクトリ選択が開き、追加名は末尾ディレクトリ名になる。
- AC-03: 同一ディレクトリ追加時に重複ダイアログが表示され、一覧に重複追加されない。
- AC-04: Project 関連 E2E が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- electron-main.js
- electron-preload.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260304-project-directory-picker-unlist-enabled.md

## applied AC
- AC-01: Project 行の remove ボタン disabled 条件と「最後の1件は削除不可」分岐を削除。
- AC-02: 追加UIをフォーム入力からディレクトリ選択ボタンへ変更し、末尾フォルダ名から project 名を生成。
- AC-03: ディレクトリ正規化キーで重複判定を追加し、重複時に alert ダイアログとエラーコード表示を実施。
- AC-04: Playwright の Project シナリオを更新し、重複/追加/全件 unlist を検証。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` `renderProjectTab` の remove 処理で常時有効・全件外しを確認 |
| AC-02 | PASS | `wireframe/app.js` `projectPickDirectory`/`addProjectByDirectory` 実装で末尾名採用 |
| AC-03 | PASS | `wireframe/app.js` `projectByDirectory` + 重複ダイアログ文言を確認 |
| AC-04 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "project tab supports add and /use focus switch"` 3件 PASS、全体 87件 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
