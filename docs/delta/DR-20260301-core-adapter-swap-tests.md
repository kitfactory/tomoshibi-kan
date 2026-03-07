# delta-request

## Delta ID
- DR-20260301-core-adapter-swap-tests

## In Scope
- palpal-core runtime adapter の差し替え検証を unit test で追加する。
- テスト用の最小注入フックを runtime へ追加する。
- spec/architecture/plan を同期する。

## Out of Scope
- 実プロバイダーへのネットワーク接続テスト。
- Guide UI フロー変更。

## Acceptance Criteria
- AC-01: runtime adapter にテスト注入フックが追加される。
- AC-02: unit test で catalog 正規化/環境変数パッチ復元を検証できる。
- AC-03: `npm run test:unit` が PASS する。
- AC-04: delta link 検証が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- runtime/palpal-core-runtime.js
- tests/unit/palpal-core-runtime.test.js
- package.json
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-core-adapter-swap-tests.md

## applied AC
- AC-01: `__setCoreRuntimeBindingsForTest` / `__resetCoreRuntimeBindingsForTest` を追加。
- AC-02: モック注入で list/generate 契約を検証する unit test を追加。
- AC-03: unit test スイートへ追加し全PASSを確認。
- AC-04: docs/plan/deltaを同期。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `runtime/palpal-core-runtime.js` に test hook 追加 |
| AC-02 | PASS | `tests/unit/palpal-core-runtime.test.js` 追加 |
| AC-03 | PASS | `npm run test:unit` |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - 実接続 E2E は別deltaで扱う。
