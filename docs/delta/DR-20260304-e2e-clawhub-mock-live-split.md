# delta-request

## Delta ID
- DR-20260304-e2e-clawhub-mock-live-split

## In Scope
- E2EのClawHub依存を `mock（既定）` と `live（任意）` に分離する。
- 通常の `test:e2e` は安定実行のためClawHub APIをモックする。
- 実ネットワーク確認用に `live` 専用specと実行スクリプトを追加する。

## Out of Scope
- アプリ本体のSkill検索仕様変更
- ClawHub API契約変更
- 既存unitテストの構成変更

## Acceptance Criteria
- AC-01: `test:e2e` が安定してPASSする（ClawHub外部依存で落ちない）。
- AC-02: `PALPAL_E2E_LIVE=1` で live spec が実ネットワークで実行できる。
- AC-03: `npm run test:e2e:live` で live spec を起動できる。
- AC-04: delta link 検証がPASSする。

# delta-apply

## status
- APPLIED

## changed files
- tests/e2e/workspace-layout.spec.js
- tests/e2e/clawhub-live.spec.js
- scripts/run_e2e_live.js
- package.json
- docs/plan.md
- docs/delta/DR-20260304-e2e-clawhub-mock-live-split.md

## applied AC
- AC-01: `workspace-layout.spec.js` の `beforeEach` で ClawHub API (`/skills`, `/search`) をモック化（`PALPAL_E2E_LIVE!==1`）。
- AC-02: `clawhub-live.spec.js` を追加し、liveモード時のみ実ネットワーク検証するようにした。
- AC-03: `scripts/run_e2e_live.js` と `package.json` に `test:e2e:live` を追加。
- AC-04: `validate_delta_links` 実行手順を通す。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `npm run test:e2e -- --reporter=list` => 87 passed / 1 skipped |
| AC-02 | PASS | `tests/e2e/clawhub-live.spec.js` は `PALPAL_E2E_LIVE=1` 条件で live 実行 |
| AC-03 | PASS | `npm run test:e2e:live -- --reporter=list` => 1 passed |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` => errors=0, warnings=0 |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
