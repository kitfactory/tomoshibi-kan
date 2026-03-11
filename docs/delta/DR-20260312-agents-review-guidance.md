# DR-20260312-agents-review-guidance

## delta-request
- Delta Type: OPS
- In Scope:
  - `AGENTS.md` に、ファイル編集時の軽い責務レビュー運用を追記する
  - `plan.md` / monthly archive に今回の docs-only 変更を記録する
- Out of Scope:
  - `OVERVIEW.md` の再構成
  - `project-validator` skill 本体の変更
  - 実コードの分割や修正
- Acceptance Criteria:
  - `AGENTS.md` にレビュー観点と split 判断基準が追記されている
  - plan / archive に delta の記録が残る
  - delta validator が PASS する

## delta-apply
- `AGENTS.md` に「500 行超のファイル編集時は軽い責務レビューを入れる」方針を追加した
- `plan.md` archive summary と `plan_archive_2026_03.md` に記録を追加した

## delta-verify
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- verify結果: PASS

## delta-archive
- Status: PASS
- Summary:
  - AGENTS.md に「500行超のファイル編集時は軽い責務レビューを併走させる」運用を追加した
  - plan / monthly archive に docs-only 差分として記録した
