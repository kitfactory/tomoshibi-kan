# delta-request

## Delta ID
- DR-20260304-settings-skill-link-external-desc

## In Scope
- Skills の Link を Electron 内新規ウィンドウではなく外部ブラウザで開く。
- Skills の「おすすめ」未インストール一覧にも説明文を表示する。
- 既存のインストール済み/未インストールの Link 導線を維持する。
- E2E を更新して回帰を防ぐ。

## Out of Scope
- Skills 検索API仕様の変更。
- Settings 全体レイアウト再設計。

## Acceptance Criteria
- AC-01: Electron 実行時、Skills Link クリックで外部ブラウザが開く。
- AC-02: おすすめ未インストール一覧にスキル説明文が表示される。
- AC-03: `npm run test:e2e -- --reporter=line tests/e2e/workspace-layout.spec.js -g "settings skill|settings tab supports skill uninstall and install"` が PASS。

# delta-apply

## status
- APPLIED

## changed files
- electron-main.js
- electron-preload.js
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/delta/DR-20260304-settings-skill-link-external-desc.md

## applied AC
- AC-01:
  - `electron-main.js` で `setWindowOpenHandler` / `will-navigate` と `external:open` IPC を追加し、http/https を `shell.openExternal` へ転送。
  - `electron-preload.js` で `PalpalExternal.openUrl` を公開し、renderer から外部起動を明示実行できるようにした。
- AC-02:
  - `wireframe/app.js` のおすすめ未インストール行に説明文を追加。
  - 標準スキル（`codex-*` 等）は ClawHub 個別ページ未公開のため、Link を Skills 検索URLへフォールバックした。
- AC-03:
  - Skills 関連 E2E を実行し PASS を確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `electron-main.js` の window open/nav handler による external open 実装 |
| AC-02 | PASS | E2Eでおすすめ一覧に `Search files and text quickly` を確認 |
| AC-03 | PASS | `99 passed` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
