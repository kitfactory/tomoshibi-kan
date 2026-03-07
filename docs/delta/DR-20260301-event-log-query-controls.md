# delta-request

## Delta ID
- DR-20260301-event-log-query-controls

## In Scope
- Event Log に検索入力・event_type フィルタ・ページング UI を追加する。
- Event 配列に対する client-side の絞り込み/ページングロジックを追加する。
- Event Log 関連E2Eを追加し、既存 gate/job フローと合わせて回帰を確認する。
- spec/architecture/plan を同期する。

## Out of Scope
- Event 永続化/サーバーサイド検索。
- Event schema 変更。
- 新規API追加。

## Acceptance Criteria
- AC-01: Event Log で検索・種別フィルタ・Prev/Next ページングが操作できる。
- AC-02: 新規 Event 追加とフィルタ変更時にページが1へ戻る。
- AC-03: E2E（event log supports search, filter, and pagination）が PASS する。
- AC-04: delta link 検証が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/index.html
- wireframe/styles.css
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-event-log-query-controls.md

## applied AC
- AC-01:
  - Event toolbar (`#eventSearchInput`, `#eventTypeFilter`, pager controls) を追加。
  - `filteredEvents` / `renderEventFilterControls` / `renderEventLog` を拡張。
- AC-02:
  - `appendEvent` で `eventPage=1` へリセット。
  - 検索・フィルタ変更時も `eventPage=1`。
- AC-03:
  - E2E へ event log query test を追加。
- AC-04:
  - docs と plan を同期。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/index.html` + `wireframe/app.js` の Event toolbar 実装 |
| AC-02 | PASS | `appendEvent` と filter input handlers で `eventPage=1` |
| AC-03 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js --grep "job board supports gate flow|gate reject uses templates and navigates to resubmit target|event log supports search, filter, and pagination"` |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - server-side query と永続Event検索は次フェーズ。
