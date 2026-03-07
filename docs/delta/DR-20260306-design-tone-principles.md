# delta-request

## Delta ID
- DR-20260306-design-tone-principles

## In Scope
- `PalPal-Hive` の体験トーンを「温かみと知性」の両立として定義する。
- `concept.md` に、プロダクト全体と画面群ごとのトーン方針を最小差分で追記する。
- `design_assist.md` に、温かみと知性をデザインへ落とすための実務ルールを追記する。
- `docs/plan.md` に今回の文書化完了を記録する。

## Out of Scope
- UI実装、配色、アニメーション、レイアウトの直接変更
- `spec.md` / `architecture.md` の仕様追加や構造変更
- 既存のワークフロー仕様、タブ構成、用語定義の変更

## Acceptance Criteria
- AC-01: `concept.md` に、プロダクトの体験トーンが「温かみと知性」であること、および Guide系と Task/Gate/Event系のトーン差分が明記される。
- AC-02: `design_assist.md` に、色・面・動き・キャラクター・情報密度の観点で使えるデザイン原則が追加される。
- AC-03: `docs/plan.md` と delta 記録が整合し、`node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- docs/concept.md
- docs/design_assist.md
- docs/plan.md
- docs/delta/DR-20260306-design-tone-principles.md

## applied AC
- AC-01: `concept.md` の概要セクションに体験トーンを追加し、プロダクト全体の方向性と画面群ごとの温度差を定義した。
- AC-02: `design_assist.md` に「本プロジェクトの体験トーン」節を追加し、視覚・モーション・画面別トーン配分を明文化した。
- AC-03: `docs/plan.md` の archive に今回の delta 完了記録を追加した。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/concept.md` に「体験トーン（Experience Tone）」を追加 |
| AC-02 | PASS | `docs/design_assist.md` に「3.4 本プロジェクトの体験トーン（PalPal-Hive）」を追加 |
| AC-03 | PASS | `docs/plan.md` に archive 追記、`node scripts/validate_delta_links.js --dir .` PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
