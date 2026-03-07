# delta-request

## Delta ID
- DR-20260301-ws-root-layout

## 目的
- ws-root の既定値を OS 別に確定し、設定保存先を `<ws-root>/.palpal` 配下へ統一する。
- 単一ルート配下で内部領域（`.palpal`）を分離する土台を実装する。

## In Scope
- ws-root 解決ロジック（Windows/macOS/Linux）を runtime モジュールとして追加する。
- Settings 保存先パスを `app.getPath("userData")` 直下から `<ws-root>/.palpal` 配下へ変更する。
- `.palpal/state|secrets|cache|logs` の作成処理を追加する。
- unit テストを追加する。

## Out of Scope
- `USER.md` / `SOUL.md` など Markdown 契約の実装。
- Context Builder 本体（収集/予算/圧縮/監査）の実装。
- UI 表示変更。

## Acceptance Criteria
- AC-01: ws-root の既定値が以下ロジックで解決される。
  - Windows/macOS: `Documents/palpal`
  - Linux: `Documents/palpal`（存在しない場合 `~/.local/share/palpal`）
- AC-02: Settings 永続化の保存先が `<ws-root>/.palpal/state/settings.sqlite` / `<ws-root>/.palpal/secrets/secrets.json` になる。
- AC-03: 起動時に `.palpal/state|secrets|cache|logs` を自動生成する。
- AC-04: unit テストで ws-root 解決と `.palpal` ディレクトリ作成を検証する。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- runtime/workspace-root.js
- electron-main.js
- tests/unit/workspace-root.test.js
- package.json
- docs/plan.md
- docs/delta/DR-20260301-ws-root-layout.md

## AC 対応
- AC-01:
  - `runtime/workspace-root.js` に `resolveWorkspaceRoot` を追加。
  - Linux の `Documents` 存在有無でフォールバックを分岐。
- AC-02:
  - `electron-main.js` の `createSettingsStore` を ws-root ベースへ変更。
  - DB/Secrets の実体パスを `.palpal` 配下へ移動。
- AC-03:
  - `ensureWorkspaceLayout` を追加し、起動時に内部ディレクトリを確保。
- AC-04:
  - `tests/unit/workspace-root.test.js` を追加。
  - `package.json` の `test:unit` に新規 test を組み込み。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `resolveWorkspaceRoot` の OS 別テストを追加し PASS |
| AC-02 | PASS | `electron-main.js` で `workspacePaths.dbPath/secretsPath` を使用 |
| AC-03 | PASS | `ensureWorkspaceLayout(workspacePaths)` を起動時に実行 |
| AC-04 | PASS | `tests/unit/workspace-root.test.js` 追加 + `npm run test:unit` PASS |

## 実行コマンド
- `node --check electron-main.js`
- `node --test tests/unit/workspace-root.test.js`
- `npm run test:unit`

# delta-archive

## クローズ
- verify result: PASS
- archive: 完了

## 要約
- ws-root の OS 別既定値と Linux フォールバックを実装した。
- Settings 永続化の保存先を `<ws-root>/.palpal` 配下へ統一し、内部ディレクトリを自動作成するようにした。
