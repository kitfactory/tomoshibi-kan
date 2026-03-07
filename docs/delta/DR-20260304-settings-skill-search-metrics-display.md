# delta-request

## Delta ID
- DR-20260304-settings-skill-search-metrics-display

## In Scope
- Settings > Skills の検索結果カードに `Downloads` と `Stars` を表示する。
- 既存の `Safety` / `Rating` 表示は維持する。
- E2E にメトリクス表示確認を追加する。

## Out of Scope
- ClawHub API 取得項目の拡張（新しいAPIエンドポイント追加）。
- Skills 画面のレイアウト刷新。

## Acceptance Criteria
- AC-01: 検索結果カードに `Downloads` バッジが表示される。
- AC-02: 検索結果カードに `Stars` バッジが表示される。
- AC-03: `npm run test:e2e -- --reporter=list tests/e2e/workspace-layout.spec.js` が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/delta/DR-20260304-settings-skill-search-metrics-display.md
- docs/plan.md

## applied AC
- AC-01:
  - 検索結果タグに `Downloads` を追加し、数値は locale に応じて `toLocaleString` で表示。
- AC-02:
  - 検索結果タグに `Stars` を追加し、同様に locale 表示。
- AC-03:
  - duckduckgo 検索ケースで `Downloads` 表示をE2E検証に追加。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の検索結果タグへ `Downloads` 追加 |
| AC-02 | PASS | `wireframe/app.js` の検索結果タグへ `Stars` 追加 |
| AC-03 | PASS | `npm run test:e2e -- --reporter=list tests/e2e/workspace-layout.spec.js` 実行 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
