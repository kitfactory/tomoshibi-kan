# delta-request

## Delta ID
- DR-20260301-ws-root-env-appdata

## In Scope
- `.env` に `PALPAL_WS_ROOT` を設定し、Workspace 保存先を AppData 配下へ固定する。
- `npm run palpal -- --devtools` が起動エラーなく実行されることを確認する。

## Out of Scope
- OS 側 Defender 設定変更。
- Workspace 解決ロジックの追加改修。

## Acceptance Criteria
- AC-01: `.env` に `PALPAL_WS_ROOT=C:\Users\kitad\AppData\Local\palpal\workspace` が設定されている。
- AC-02: `npm run palpal -- --devtools` が失敗終了しない。

# delta-apply

## status
- APPLIED

## changed files
- .env
- docs/plan.md
- docs/delta/DR-20260301-ws-root-env-appdata.md

## applied AC
- AC-01: `.env` を更新。
- AC-02: 起動コマンド実行を確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `.env` に `PALPAL_WS_ROOT` 設定あり |
| AC-02 | PASS | `npm run palpal -- --devtools` exit code 0 |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
