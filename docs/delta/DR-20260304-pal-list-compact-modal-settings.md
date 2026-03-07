# delta-request

## Delta ID
- DR-20260304-pal-list-compact-modal-settings

## In Scope
- Pal一覧をコンパクト表示にし、一覧からのクリックで設定モーダルを開くUIへ変更する。
- 既存のPal設定項目（名前/Runtime/Skill/保存/削除）はモーダル側へ移動する。
- 一覧表示は「名前、Palタイプ（Guide/Worker/Gate）、アバター顔、使用ランタイム（Model/CLI+target）、スキル一覧」に絞る。

## Out of Scope
- Palドメインモデルの項目追加/削除
- Runtime validation 仕様変更
- Settingsタブのモデル/スキル管理仕様変更

## Acceptance Criteria
- AC-01: Pal一覧に詳細フォームが出ず、コンパクト情報のみ表示される。
- AC-02: Pal一覧のクリックで設定モーダルが開き、既存の編集項目を操作できる。
- AC-03: モーダルで保存/削除が実行でき、一覧表示へ反映される。
- AC-04: Pal関連E2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/index.html
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260304-pal-list-compact-modal-settings.md

## applied AC
- AC-01: `renderPalList` をコンパクト行表示へ変更し、表示項目を最小化。
- AC-02: `#palConfigModal` を追加し、Pal編集項目（name/runtime/target/skills）をモーダルへ移設。
- AC-03: モーダル保存/削除ハンドラを実装し、既存の validation/apply ロジックで更新。
- AC-04: PlaywrightのPal関連テストをモーダル操作に追従更新。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の Pal一覧が compact row 表示に変更 |
| AC-02 | PASS | `wireframe/index.html` に `#palConfigModal` 追加、`wireframe/app.js` で open/close 実装 |
| AC-03 | PASS | `wireframe/app.js` の `#palConfigSave`/`#palConfigDelete` ハンドラで保存・削除反映 |
| AC-04 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings tab shows model list and allows adding model\|newly added model is immediately available in pal tab\|pal list includes roles and allows name/model/tool settings\|pal runtime save is blocked when tool target is not available\|error toast appears from bottom on validation error\|pal list supports add and delete profile"` 18件 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
