# delta-request

## Delta ID
- DR-20260306-experience-tone-doc

## In Scope
- `docs/experience_tone.md` を新設し、PalPal-Hive の体験トーンの正本を定義する。
- `docs/OVERVIEW.md` に `experience_tone.md` へのリンクを追加する。
- `docs/design_assist.md` に、体験トーンの詳細は `experience_tone.md` を正とする旨を追記する。
- `docs/plan.md` に今回の文書追加を記録する。

## Out of Scope
- UI実装変更
- `spec.md` / `architecture.md` の変更
- `AGENTS.md` の運用ルール変更

## Acceptance Criteria
- AC-01: `docs/experience_tone.md` が作成され、ブランド文、トーン原則、画面ごとのトーン配分、色/面/動き/キャラクター/NG表現が日本語で整理されている。
- AC-02: `docs/OVERVIEW.md` と `docs/design_assist.md` から `experience_tone.md` へ到達できる。
- AC-03: `docs/plan.md` と delta 記録が整合し、`node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- docs/experience_tone.md
- docs/OVERVIEW.md
- docs/design_assist.md
- docs/plan.md
- docs/delta/DR-20260306-experience-tone-doc.md

## applied AC
- AC-01: `docs/experience_tone.md` を新設し、ブランド文、主トーン/副トーン、画面配分、視覚原則を整理した。
- AC-02: `docs/OVERVIEW.md` の重要リンクへ追加し、`docs/design_assist.md` に参照先を追記した。
- AC-03: `docs/plan.md` の archive に今回の差分を追加した。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/experience_tone.md` を追加 |
| AC-02 | PASS | `docs/OVERVIEW.md` と `docs/design_assist.md` に参照リンクを追加 |
| AC-03 | PASS | `docs/plan.md` を更新し、`node scripts/validate_delta_links.js --dir .` PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
