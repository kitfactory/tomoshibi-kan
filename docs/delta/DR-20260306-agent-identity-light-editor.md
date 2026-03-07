# delta-request

## Delta ID
- DR-20260306-agent-identity-light-editor

## Purpose
- Pal 設定モーダルから `SOUL.md` / `ROLE.md` / `RUBRIC.md` を軽量編集できるようにし、identity file の調整を UI 内で完結させる。

## In Scope
- `wireframe/index.html` に identity file editor modal を追加する
- `wireframe/app.js` に identity editor の open/load/save/close state と Pal 設定モーダルからの導線を追加する
- `wireframe/app.js` で Guide/worker は `ROLE.md`、Gate は `RUBRIC.md` を role-aware に扱う
- identity file 未作成時は既存 template 初期化を利用して編集開始できるようにする
- `tests/e2e/workspace-layout.spec.js` に identity editor の編集保存回帰を追加する
- `docs/plan.md` とこの delta を request/apply/verify/archive で閉じる

## Out of Scope
- Import / Export UI
- markdown preview / diff / 補完
- `spec.md` / `architecture.md` の更新
- identity file 編集結果の別経路同期

## Acceptance Criteria
- AC-01: Pal 設定モーダルから `SOUL` と role-aware secondary file の編集導線を開ける
- AC-02: identity editor modal が対象 profile と file 名を表示し、本文を読み込める
- AC-03: 保存で対象 file だけが更新され、他の identity file は保持される
- AC-04: identity file 未作成 profile でも template 初期化後に編集開始できる
- AC-05: Playwright で Guide の `SOUL.md` と Gate の `RUBRIC.md` 編集保存を確認できる
- AC-06: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- identity editor save は full identity payload 保存なので、load/save の整合が崩れると非編集 file を上書きする
- modal を二段で使うため、close 順序の崩れが E2E と実操作の差分になりやすい

## Open Questions
- Import / Export が必要になった場合は別 delta で editor action を拡張する

# delta-apply

## status
- APPLIED

## changed files
- wireframe/index.html
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260306-agent-identity-light-editor.md

## applied AC
- AC-01: Pal 設定モーダルに `Edit SOUL` と secondary file 編集ボタンを追加した
- AC-02: identity editor modal と load/render state を実装した
- AC-03: save 時に current identity を読み込み、対象 file のみ差し替えて保存するようにした
- AC-04: identity file 未作成時は `initializeTemplates: true` で template を生成してから開くようにした
- AC-05: E2E に Guide `SOUL.md` / Gate `RUBRIC.md` 編集保存シナリオを追加した
- AC-06: plan と delta を更新した

## scope deviation
- Out of Scope への変更: No
- 補足: editor は textarea + Save/Cancel のみで、preview/import/export は追加していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の `renderPalConfigModal()` に identity category と編集ボタンを追加 |
| AC-02 | PASS | `wireframe/index.html` の `#identityEditorModal` と `wireframe/app.js` の `openIdentityEditorModal()` / `renderIdentityEditorModal()` で modal 表示と読み込みを実装 |
| AC-03 | PASS | `wireframe/app.js` の save handler で current identity を基に対象 file だけを差し替えて保存 |
| AC-04 | PASS | `openIdentityEditorModal()` で `hasIdentityFiles` 不在時に template 初期化を実行 |
| AC-05 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "identity files can be edited from pal settings modal|pal list supports add and delete profile|guide and gate profiles can be added and selected|guide and gate add initialize role-aware identity templates"` PASS |
| AC-06 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- Import/Export、preview、canonical docs 更新は未実施

## residual risks
- R-01: identity editor は prototype 上 local API 前提のため、将来 runtime のエラー種別が増えるとメッセージ分岐が必要
- R-02: 長文編集向けの利便機能はまだない

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - Import / Export や markdown preview は別 delta
