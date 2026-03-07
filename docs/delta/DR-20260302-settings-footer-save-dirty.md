# delta-request

## Delta ID
- DR-20260302-settings-footer-save-dirty

## In Scope
- Settings の保存ボタンを全体フッターへ移動する。
- 保存ボタンを dirty state 連動で有効/無効化する。
- タブ移動時の未保存状態保持を E2E で固定する。

## Out of Scope
- 保存対象フィールドの追加。
- 永続化方式（SQLite/SecretStore）の変更。

## Acceptance Criteria
- AC-01: 保存ボタンが Settings 下部フッターに配置される。
- AC-02: 変更がないとき保存ボタンは disabled、変更後のみ enabled。
- AC-03: 未保存変更はタブ移動後も保持される。
- AC-04: 関連E2Eと unit が PASS。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260302-settings-footer-save-dirty.md

## applied AC
- AC-01: Settings フッター (`settings-footer`) へ保存ボタンを移動。
- AC-02: `settingsSavedSignature` / `settingsSaveInFlight` を追加し活性制御。
- AC-03: E2E `settings save button is enabled only when changed and keeps unsaved state across tabs` を追加。
- AC-04: 対象E2E と `npm run test:unit` を実行。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` + `wireframe/styles.css` |
| AC-02 | PASS | `hasUnsavedSettingsChanges` / save button disabled binding |
| AC-03 | PASS | 新規E2Eシナリオでタブ往復後の未保存保持を確認 |
| AC-04 | PASS | Playwright対象 12/12 PASS + unit 42/42 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
