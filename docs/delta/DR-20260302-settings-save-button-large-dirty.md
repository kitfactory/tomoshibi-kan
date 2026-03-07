# delta-request

## Delta ID
- DR-20260302-settings-save-button-large-dirty

## In Scope
- Settings 保存ボタンを「設定変更時のみ有効 / 未変更時は無効」に固定する。
- 変更を元に戻したときに保存ボタンが再び無効化される動作を固定する。
- Settings 保存ボタンを視認しやすい大きめサイズへ変更する。

## Out of Scope
- Settings 保存対象フィールドの追加・削除。
- Settings 永続化方式（SQLite / SecretStore）の変更。

## Acceptance Criteria
- AC-01: 設定未変更時、`#settingsTabSave` は disabled で表示される。
- AC-02: 設定変更時のみ `#settingsTabSave` が enabled になる。
- AC-03: 変更を元に戻すと `#settingsTabSave` が再び disabled になる。
- AC-04: 保存ボタンが従来より大きい UI サイズで表示される。
- AC-05: 関連 E2E/構文チェックが PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260302-settings-save-button-large-dirty.md

## applied AC
- AC-01/AC-02: `buildSettingsSignature` の安定比較で dirty 判定を維持し、保存ボタン活性を継続。
- AC-03: E2E へ「変更 -> タブ移動 -> 元に戻す -> disabled」シナリオを追加。
- AC-04: 保存ボタンを `btn-lg` + `settings-save-btn` に変更し、最小サイズを拡張。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `tests/e2e/workspace-layout.spec.js` 初期 `toBeDisabled()` |
| AC-02 | PASS | `tests/e2e/workspace-layout.spec.js` 変更後 `toBeEnabled()` |
| AC-03 | PASS | `tests/e2e/workspace-layout.spec.js` 元に戻した後 `toBeDisabled()` |
| AC-04 | PASS | `wireframe/app.js` の `btn-lg settings-save-btn` と `wireframe/styles.css` |
| AC-05 | PASS | `node --check` + Playwright 該当シナリオ 3/3 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
