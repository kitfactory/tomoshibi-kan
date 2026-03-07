# delta-request

## Delta ID
- DR-20260303-settings-skill-search-scroll

## In Scope
- Settings > Skills の検索入力時に、画面スクロール位置が初期位置へ戻る問題を解消する。
- 検索中のレイアウト揺れを抑え、入力継続しやすい表示を固定する。
- E2E で「検索入力中にスクロール位置が維持される」ことを検証する。

## Out of Scope
- Skill catalog のデータソース変更。
- Settings タブの構造変更（Language / Model / Skills のカテゴリ再設計）。

## Acceptance Criteria
- AC-01: `#settingsTabSkillSearch` 入力時に `renderSettingsTab()` 全体再描画を行わない。
- AC-02: Skills マーケットリスト高さが固定され、検索結果件数で全体レイアウトが大きく揺れない。
- AC-03: E2E で入力中のスクロール位置維持を検証し PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260303-settings-skill-search-scroll.md

## applied AC
- AC-01: `settingsTabSkillSearch` の `input` ハンドラを全体再描画から `ClawHubリストのみ部分更新` に変更。
- AC-02: `.settings-skill-market-list` を `height: 220px` 固定に変更し件数変動のレイアウト揺れを抑制。
- AC-03: E2E `settings skill search keeps scroll position while typing` を追加。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` (`renderClawHubSkillMarketList`) |
| AC-02 | PASS | `wireframe/styles.css` (`.settings-skill-market-list { height: 220px; }`) |
| AC-03 | PASS | Playwright 対象 6/6 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
