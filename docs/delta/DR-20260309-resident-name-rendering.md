# delta-request

## Delta ID
- DR-20260309-resident-name-rendering

## Delta Type
- FEATURE

## Requirement Links
- [SEED-20260309-resident-name-rendering](/abs/path/C:/Users/kitad/palpal-hive/docs/plan.md)

## Background
- internal resident ID の `pal-alpha / pal-beta / pal-delta` が user-facing UI と会話ログに漏れている。
- ユーザー向けには `冬坂 / 久瀬 / 白峰` を表示したい。

## In Scope
- Task / Cron row、task detail conversation log、progress query reply など user-facing 表示の `pal-*` を proper name 表示へ置き換える。
- 関連 E2E expectation を proper name 表示へ合わせる。

## Out of Scope
- internal resident ID の rename
- persistence schema 変更
- docs 内の historical delta 記録や内部説明の `pal-*` 記述変更

## Acceptance Criteria
- AC-01: Task/Cron 一覧に `pal-alpha / pal-beta / pal-delta` が user-facing 表示として出ない。
- AC-02: task detail conversation log に internal resident ID が出ず、`冬坂 / 久瀬 / 白峰` が出る。
- AC-03: relevant E2E が PASS する。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260309-resident-name-rendering

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 変更ファイル
- `wireframe/app.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/plan.md`
- `docs/delta/DR-20260309-resident-name-rendering.md`

## 適用内容（AC対応）
- AC-01:
  - Task / Cron row の assignee 表示を internal resident ID ではなく proper name へ変更した。
- AC-02:
  - dispatch summary と task detail conversation log の user-facing resident 表示を proper name へ変更した。
- AC-03:
  - E2E expectation を `冬坂 / 久瀬 / 白峰` 前提へ更新した。
- AC-04:
  - delta / plan 参照を整え、validator に通る形へ整理した。

# delta-verify

## Delta ID
- DR-20260309-resident-name-rendering

## Verify Profile
- static check:
  - `node --check wireframe/app.js`
  - `node --check tests/e2e/workspace-layout.spec.js`
- targeted integration / E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|guide chat can materialize cron jobs from approved plan|task detail drawer renders conversation log timeline|guide-driven reroute keeps dispatch but records reroute progress|task progress log stores dispatch and gate flow entries"`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | Task / Cron 一覧の resident 表示が proper name へ置き換わった |
| AC-02 | PASS | task detail conversation log に internal ID が出ず、`冬坂 / 久瀬 / 白峰` が出ることを E2E で確認した |
| AC-03 | PASS | targeted Playwright 15件が PASS した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260309-resident-name-rendering

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- user-facing resident rendering は proper name 表示へ統一された。
- Task/Cron 一覧と task detail conversation log で `pal-*` が漏れないことを確認した。
