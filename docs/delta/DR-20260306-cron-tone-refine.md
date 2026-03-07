# delta-request

## Delta ID
- DR-20260306-cron-tone-refine

## Purpose
- `Cron` を運用面の静かなトーンへ寄せる。既存の Job row 構造は維持しつつ、`schedule / lastRun / instruction` の情報階層と `未実行 / 実行済み` の状態差を見やすくする。

## In Scope
- `wireframe/app.js` を更新し、Cron row の meta 表示に class と DOM 属性を追加する
- `wireframe/styles.css` の Cron row 専用スタイルを調整し、schedule / lastRun / instruction の階層を整理する
- `tests/e2e/workspace-layout.spec.js` に Cron row の状態表現確認を追加する
- `docs/plan.md` に今回の seed/archive を反映する

## Out of Scope
- Cron の状態遷移や Gate 接続ロジックの変更
- Task / Event / Settings の変更
- scheduler 仕様や文言の変更

## Acceptance Criteria
- AC-01: Cron row の `schedule / lastRun / instruction` が既存よりも読み分けやすい見た目になっている
- AC-02: Cron row に `lastRun` の状態を示す DOM 属性が反映されている
- AC-03: `workspace-layout` の Cron 系 Playwright と新規 UI 状態確認が PASS する
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- row マークアップ変更で既存 selector が崩れる可能性がある
- lastRun の属性判定が `-` 以外の空値ケースに漏れる可能性がある

## Open Questions
- なし

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260306-cron-tone-refine.md

## applied AC
- AC-01: Cron row の meta 表示に専用 class を追加し、schedule / lastRun / instruction の階層を調整した
- AC-02: Cron row に `data-last-run-state` を追加し、未実行 / 実行済みを DOM で表現した
- AC-03: `tests/e2e/workspace-layout.spec.js` の Cron 系シナリオで `data-last-run-state` を確認するように更新した
- AC-04: `docs/plan.md` に今回の seed/archive を反映する

## scope deviation
- Out of Scope への変更: No
- 補足: Cron row の見た目と状態表現に限定し、scheduler や Gate ロジックは変更していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` / `wireframe/styles.css` に Cron row の meta class を追加 |
| AC-02 | PASS | `wireframe/app.js` に `data-last-run-state` を追加し、CSS で empty/recorded を表現 |
| AC-03 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "job board supports gate flow"` が 3 passed |
| AC-04 | PASS | `node --check wireframe/app.js` PASS、`node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の有無: No
- 確認内容: Cron の状態遷移、scheduler 仕様、Task / Event には変更を入れていない

## residual risks
- R-01: Cron row の最終視認性は実機確認が必要で、今回の検証は DOM 状態と E2E 回帰まで

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
