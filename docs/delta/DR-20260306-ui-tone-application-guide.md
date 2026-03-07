# delta-request

## Delta ID
- DR-20260306-ui-tone-application-guide

## In Scope
- `docs/ui_tone_application.md` を新設し、体験トーンを UI 修正方針へ落とした実行ガイドを定義する。
- `docs/experience_tone.md` から `ui_tone_application.md` への参照を追加する。
- `docs/OVERVIEW.md` の重要リンクへ `ui_tone_application.md` を追加する。
- `docs/plan.md` に今回の文書追加を記録する。

## Out of Scope
- 実際の UI 実装変更
- `spec.md` / `architecture.md` の変更
- 既存の機能仕様やタブ構成の変更

## Acceptance Criteria
- AC-01: `docs/ui_tone_application.md` に、優先度つきの修正方針、共通スタイル指針、画面別修正方針、非対象が日本語で整理されている。
- AC-02: `docs/experience_tone.md` と `docs/OVERVIEW.md` から新文書へ到達できる。
- AC-03: `docs/plan.md` と delta 記録が整合し、`node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- docs/ui_tone_application.md
- docs/experience_tone.md
- docs/OVERVIEW.md
- docs/plan.md
- docs/delta/DR-20260306-ui-tone-application-guide.md

## applied AC
- AC-01: `docs/ui_tone_application.md` を新設し、P1/P2/P3 の優先度、共通ルール、画面別の UI 修正方針を追加した。
- AC-02: `docs/experience_tone.md` と `docs/OVERVIEW.md` に参照リンクを追加した。
- AC-03: `docs/plan.md` の archive に今回の差分を追加した。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/ui_tone_application.md` を追加 |
| AC-02 | PASS | `docs/experience_tone.md` と `docs/OVERVIEW.md` にリンクを追加 |
| AC-03 | PASS | `docs/plan.md` 更新、`node scripts/validate_delta_links.js --dir .` PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
