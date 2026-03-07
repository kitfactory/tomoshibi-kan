# delta-request

## Delta ID
- DR-20260306-pal-config-modal-auto-height

## Purpose
- Pal 設定モーダルの footer 下に大きな空白が残る問題を解消し、modal 全高を内容に追従させる。

## In Scope
- `wireframe/styles.css` の `pal-config-modal` を auto-height の flex column layout に調整する
- `wireframe/styles.css` の `pal-config-modal-body` を body scroll 前提の flex item に調整する
- `tests/e2e/workspace-layout.spec.js` に footer 下空白が大きく残らない回帰確認を追加する
- `docs/plan.md` とこの delta を request/apply/verify/archive で閉じる

## Out of Scope
- footer 自体の追加縮小
- Pal 設定モーダル本文の項目並び替え
- identity editor modal の見た目変更
- `spec.md` / `architecture.md` の更新

## Acceptance Criteria
- AC-01: `pal-config-modal` が full-height ではなく内容高ベースで描画される
- AC-02: footer 直下に大きな空白が残らない
- AC-03: Playwright で `gapBelowFooter` が小さいことを確認できる
- AC-04: 既存の Pal 設定・identity editor 操作回帰が通る
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- modal の height 指定を外すことで小さい viewport で body scroll が崩れる可能性がある
- `.overlay:not(.hidden) .modal` の汎用 override と role-specific modal の競合に注意が必要

## Open Questions
- modal 項目密度がまだ高い場合は次 delta で本文レイアウトを見直す

# delta-apply

## status
- APPLIED

## changed files
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260306-pal-config-modal-auto-height.md

## applied AC
- AC-01: `pal-config-modal` を `display:flex`, `flex-direction:column`, `height:auto`, `max-height:calc(100vh - 24px)` に変更した
- AC-02: `pal-config-modal-body` を flex item 化し、modal 下端まで詰まる構成にした
- AC-03: Playwright に footer 下空白の回帰確認を追加した
- AC-04: 既存の Pal 設定/identity editor シナリオも合わせて再実行した
- AC-05: plan と delta を更新した

## scope deviation
- Out of Scope への変更: No
- 補足: footer ボタン寸法や本文項目順には追加変更していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/styles.css` の `.pal-config-modal` を flex column + auto height に変更 |
| AC-02 | PASS | Playwright 実測で `gapBelowFooter: 1` を確認 |
| AC-03 | PASS | `pal config modal does not leave a large gap below footer` テストを追加し PASS |
| AC-04 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "pal config footer stays compact|pal config modal does not leave a large gap below footer|pal list includes roles and allows name/model/tool settings|identity files can be edited from pal settings modal|guide and gate profiles can be added and selected"` PASS |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- footer 追加縮小、本文並び替え、canonical docs 更新は未実施

## residual risks
- R-01: viewport がさらに小さい条件では、modal と body の最大高さ配分を再調整する余地がある

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - Pal 設定本文の並びや密度見直しは別 delta
