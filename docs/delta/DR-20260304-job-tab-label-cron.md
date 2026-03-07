# delta-request

## Delta ID
- DR-20260304-job-tab-label-cron

## In Scope
- 定期タスク入口として表示している `Job` のUI名称を `Cron` に変更する。
- 対象はタブ名と該当パネル見出し、関連するユーザー向け文言（空状態・Event種別ラベル）に限定する。

## Out of Scope
- 内部データモデル `Job` の名称変更
- `data-tab="job"` や `event.type="job"` など内部キー変更
- 実行ロジック（Job/Cron scheduler）の挙動変更

## Acceptance Criteria
- AC-01: Workspace タブに `Cron` が表示される。
- AC-02: パネル見出しが `Cron Board` になる。
- AC-03: 空状態文言と Event type の表示ラベルが `Cron` 表記になる。
- AC-04: Job/Cron関連 E2E が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/index.html
- wireframe/app.js
- docs/plan.md
- docs/delta/DR-20260304-job-tab-label-cron.md

## applied AC
- AC-01: タブ表示 `Job` を `Cron` へ変更。
- AC-02: パネル見出しを `Job Board` -> `Cron Board`、バッジを `Periodic` -> `Scheduled` に変更。
- AC-03: `noJob` と `eventTypeJob` の表示文言を Cron 表記へ変更（内部キーは維持）。
- AC-04: 対象 Playwright シナリオを実行して回帰確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/index.html` タブラベルを `Cron` に更新 |
| AC-02 | PASS | `wireframe/index.html` 見出しを `Cron Board` に更新 |
| AC-03 | PASS | `wireframe/app.js` `noJob`/`eventTypeJob` の表示文言を Cron 化 |
| AC-04 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "job board supports gate flow|event log supports search, filter, and pagination|job panel stays inside viewport"` 9件 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
