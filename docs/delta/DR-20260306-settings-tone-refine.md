# delta-request

## Delta ID
- DR-20260306-settings-tone-refine

## Purpose
- `Settings` を `温かみと知性` のトーンへ寄せる。構造は維持したまま、保存状態と追加フォームの視認性を整理し、安心して操作できる静かな管理画面に補正する。

## In Scope
- `wireframe/styles.css` の `Settings` 専用スタイルを調整し、背景・section・subpanel・footer・add form・skill modal の質感を静かな方向へ補正する
- `wireframe/app.js` を更新し、`Settings` の footer と save button に `saved / dirty / saving` の状態表現を追加する
- `wireframe/app.js` を更新し、追加フォームの open 状態を DOM 属性へ反映して CSS で扱えるようにする
- `tests/e2e/workspace-layout.spec.js` に `Settings` の状態表現確認を追加する
- `docs/plan.md` に今回の seed/archive を反映する

## Out of Scope
- Settings の情報設計、項目構成、保存仕様の変更
- Skill 検索条件や ClawHub 連携ロジックの変更
- `Guide Chat` / `Task Board` / `Gate` / `Event Log` のトーン調整

## Acceptance Criteria
- AC-01: `Settings` の section / footer / add form / skill modal が、既存よりも静かで整理された見た目になっている
- AC-02: 保存フッターが `saved / dirty / saving` を DOM 状態とテキストで表現し、save button は保存中フィードバックを持つ
- AC-03: 追加フォームの open 状態が DOM に反映され、見た目でも開閉が分かる
- AC-04: `workspace-layout` の Settings 系 Playwright と新規 UI 状態確認が PASS する
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- 保存中フィードバック追加で既存の save テストがタイミング依存になる可能性がある
- section 背景や modal の調整が他の既存ボタン色とぶつかる可能性がある

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
- docs/delta/DR-20260306-settings-tone-refine.md

## applied AC
- AC-01: `Settings` 専用の背景 / section / subpanel / footer / add form / skill modal のスタイルを調整し、グラデーションと影の主張を抑えて静かな管理画面へ補正した
- AC-02: `renderSettingsTab` に `saved / dirty / saving` の DOM 状態と表示文言を追加し、save button に `aria-busy` と保存中ラベルを反映した
- AC-03: add form の open 状態を `data-add-form-open` と section class に反映し、見た目で開閉状態を表現できるようにした
- AC-04: `tests/e2e/workspace-layout.spec.js` に Settings footer / add form の状態確認を追加し、既存 Settings 系シナリオと合わせて回帰確認できるようにした
- AC-05: `docs/plan.md` に今回の seed/archive を反映する

## scope deviation
- Out of Scope への変更: No
- 補足: Settings の見た目と状態表現に限定し、保存仕様や Skill 検索仕様は変更していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/styles.css` の Settings 専用スタイルを更新し、section / footer / add form / skill modal を補正 |
| AC-02 | PASS | `wireframe/app.js` に `saving` ラベル、`data-settings-state`、`aria-busy` を追加し、保存状態を DOM とテキストで表現 |
| AC-03 | PASS | `wireframe/app.js` で `data-add-form-open` と `data-settings-section="model"` + `is-adding` を反映 |
| AC-04 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings tab shows model list and allows adding model|newly added model is immediately available in pal tab|settings save button is enabled only when changed and keeps unsaved state across tabs|settings footer reflects saving state and add form open state|settings skill search modal supports keyword search flow"` が 15 passed |
| AC-05 | PASS | `node --check wireframe/app.js` PASS、`node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の有無: No
- 確認内容: Settings の情報設計、保存仕様、ClawHub 連携ロジックには変更を入れていない

## residual risks
- R-01: 視覚トーンの最終判断は実機確認が必要で、今回の検証は DOM 状態と E2E 回帰まで

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
