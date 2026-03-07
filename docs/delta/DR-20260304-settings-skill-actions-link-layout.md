# delta-request

## Delta ID
- DR-20260304-settings-skill-actions-link-layout

## In Scope
- Skills 表示で「安全性」ラベルを非表示にする。
- Skills 検索結果の右側操作を 2 段構成にする（上: Link / 下: Install）。
- インストール済み Skills の右側操作を 2 段構成にする（上: Link / 下: Remove）。
- 未インストールおすすめ Skills の右側操作も 2 段構成にそろえる（上: Link / 下: Install）。
- E2E を更新して回帰を防止する。

## Out of Scope
- Skills モーダルのフィルタ仕様変更。
- ClawHub API 呼び出しフローの変更。

## Acceptance Criteria
- AC-01: 検索結果に `安全性:` 表示が出ない。
- AC-02: 検索結果で Link ボタンと Install ボタンが縦 2 段で表示される。
- AC-03: インストール済み Skills で Link ボタンと Remove ボタンが縦 2 段で表示される。
- AC-04: `npm run test:e2e -- --reporter=line tests/e2e/workspace-layout.spec.js -g "settings skill|settings tab supports skill uninstall and install"` が PASS。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/delta/DR-20260304-settings-skill-actions-link-layout.md

## applied AC
- AC-01:
  - Skills 検索結果カードから Safety バッジ描画を削除。
- AC-02:
  - Skills 検索結果カードに Link ボタンを追加。
  - 右側操作を `.settings-row-actions` で縦 2 段に変更。
- AC-03:
  - インストール済み Skills とおすすめ Skills に Link ボタンを追加し縦 2 段構成に統一。
- AC-04:
  - E2E で Link ボタンと href を検証。
  - Skills 関連シナリオを実行し PASS を確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `settings skill search normalizes full-width ddg keyword` で `安全性:` 非表示を確認 |
| AC-02 | PASS | 検索結果で `data-skill-link-id` と `data-clawhub-download-skill` の共存を確認 |
| AC-03 | PASS | インストール済み/おすすめ一覧で Link + Remove/Install の表示を確認 |
| AC-04 | PASS | `99 passed` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
