# delta-request

## Delta ID
- DR-20260301-i18n-dictionary-verify

## In Scope
- i18n フォールバックを強化する（dynamic/message text）。
- 辞書整合の自動検証スクリプトを追加する。
- package scripts に `verify:i18n` を追加する。
- spec/architecture/plan を同期する。

## Out of Scope
- 既存全画面文言の全面リライト。
- i18n ストレージの外部化。

## Acceptance Criteria
- AC-01: `tDyn` と `messageText` が ja/en フォールバックを持つ。
- AC-02: `scripts/verify_i18n_dictionary.js` で辞書整合を検証できる。
- AC-03: `npm run verify:i18n` が PASS する。
- AC-04: `npm run test:unit` と対象E2Eが回帰なしでPASSする。
- AC-05: delta link 検証が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- scripts/verify_i18n_dictionary.js
- package.json
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-i18n-dictionary-verify.md

## applied AC
- AC-01: `tDyn` / `messageText` フォールバック順を拡張。
- AC-02: i18n 辞書整合検証スクリプトを追加。
- AC-03: npm script を追加。
- AC-04: unit + 対象E2E 実行。
- AC-05: plan/delta 整合反映。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の fallback 実装 |
| AC-02 | PASS | `scripts/verify_i18n_dictionary.js` |
| AC-03 | PASS | `npm run verify:i18n` |
| AC-04 | PASS | `npm run test:unit` / targeted Playwright PASS |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - 辞書生成の自動化は次フェーズで検討。
