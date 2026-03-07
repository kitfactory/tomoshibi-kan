# delta-request

## Delta ID
- DR-20260307-opencode-capability-audit

## Goal
- `OpenCode` を CLI tool runtime 候補として評価するため、現時点で取得できる command / agent / skill / MCP / server / config 周りの能力を棚卸しする。
- 既存の `Codex` probe は実装済みのため、今回は `OpenCode` の実態把握だけに閉じる。

## In Scope
- ローカルにインストールされた `OpenCode` CLI の実コマンドを確認する。
- `--version` / `--help` と主要 subcommand の `--help` を調べる。
- `skill` / `agent` / `MCP/server` / config / models / db 周りで取得できる能力情報を整理する。
- audit 結果を delta verify / archive に記録する。

## Out of Scope
- `OpenCode` probe の実装
- routing / settings への反映
- `Codex` probe の変更
- commit / push

## Acceptance Criteria
- AC-01: `OpenCode` CLI の version と top-level command を確認できる。
- AC-02: `skill` / `agent` / `MCP/server` / config / feature 相当の取得手段を確認できる。
- AC-03: `OpenCode` を probe 実装する場合の最小候補コマンドを verify に残せる。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-opencode-capability-audit

## ステータス
- APPLIED

## 実行コマンド
- `Get-Command opencode`
- `opencode --version`
- `opencode --help`
- `opencode run --help`
- `opencode agent --help`
- `opencode agent list`
- `opencode mcp --help`
- `opencode mcp list`
- `opencode serve --help`
- `opencode debug --help`
- `opencode debug config`
- `opencode debug paths`
- `opencode debug skill`
- `opencode debug agent build`
- `opencode db --help`
- `opencode models`

## 観測メモ
- 実行バイナリは `C:\nvm4w\nodejs\opencode.ps1`
- version は `1.2.20`
- top-level command には `run`, `agent`, `mcp`, `serve`, `web`, `models`, `stats`, `session`, `db`, `debug` などがある
- `opencode debug skill` は成功したが、現環境の skill 一覧は `[]`
- `opencode agent list` では `build`, `compaction`, `plan`, `summary`, `title`, `explore`, `general` が見えた
- `opencode debug agent build` では built-in tool と permission を JSON で取得できた
- `opencode mcp list` は `No MCP servers configured`
- `opencode debug config` は `agent`, `mode`, `plugin`, `command`, `username` を返した
- `opencode debug paths` では config/data/state/db の実パスを取得できた
- 初回は DB migration が走るため、並列実行すると `database is locked` が出る。probe は直列実行前提が安全

# delta-verify

## Delta ID
- DR-20260307-opencode-capability-audit

## 受入条件検証
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `opencode --version` で `1.2.20`、`opencode --help` で top-level command を確認した |
| AC-02 | PASS | `opencode debug skill`, `opencode agent list`, `opencode debug agent build`, `opencode mcp list`, `opencode serve --help`, `opencode debug config`, `opencode debug paths`, `opencode models`, `opencode db --help` を確認した |
| AC-03 | PASS | probe 実装時の最小候補コマンドを整理した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS |

## 最小 probe 候補
- `opencode --version`
- `opencode --help`
- `opencode debug skill`
- `opencode agent list`
- `opencode debug agent build`
- `opencode mcp list`
- `opencode debug config`
- `opencode debug paths`

## まとめ
- `OpenCode` には skill 機構自体は存在するが、この環境では未インストール
- `agent` と `debug agent` から built-in tool 能力をかなり取れる
- `Codex` と違って top-level `config` command はなく、`debug config` 経由で見る形
- capability probe 実装では、help 文だけでなく `debug agent` の JSON を優先した方が精度が高い

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-opencode-capability-audit

## クローズ判定
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- 本 delta は audit のみ。実装差分は追加していない
- `OpenCode` probe 実装は次の delta へ分離する
