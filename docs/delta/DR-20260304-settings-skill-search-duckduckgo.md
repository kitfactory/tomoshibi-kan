# delta-request

## Delta ID
- DR-20260304-settings-skill-search-duckduckgo

## In Scope
- Settings > Skills の ClawHub 検索で、`/search` レスポンスに `suspicious` が無いスキル（例: `duckduckgo-search`）が既定フィルタ（疑わしいスキル除外ON）でも正しく表示されるようにする。
- `/search` 呼び出しにも `sort` / `nonSuspicious` / `highlighted` / `limit` を渡して、検索条件を API 側へ反映する。
- E2E に再発防止テストを追加する。

## Out of Scope
- スキルのインストール許可ポリシー（標準スキル限定かどうか）の変更。
- Skills 画面のUIレイアウト変更。

## Acceptance Criteria
- AC-01: `duckduckgo` 検索時に、`suspicious` 未提供スキルが「疑わしい除外ON」の既定状態でも結果に表示される。
- AC-02: `/search` 呼び出しに検索条件パラメータが含まれる。
- AC-03: `npm run test:e2e -- --reporter=list` が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/delta/DR-20260304-settings-skill-search-duckduckgo.md
- docs/plan.md

## applied AC
- AC-01:
  - `resolveSkillSuspiciousFlag` の既定値を `true` から `false` へ変更。
  - `suspicious` が未提供でも、明示的に危険と判定されない限り除外されないようにした。
- AC-02:
  - `searchClawHubSkillsApi` の `/search` 呼び出しへ `baseParams`（sort/nonSuspicious/highlighted/limit）を渡すように変更。
- AC-03:
  - E2Eモックに `duckduckgo-search`（`suspicious` 未設定）を追加し、検索結果表示テストを追加。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `settings skill search keeps duckduckgo result when suspicious flag is missing` を追加し、表示を確認 |
| AC-02 | PASS | `wireframe/app.js` の `/search` 呼び出しで `...baseParams` を渡すことを確認 |
| AC-03 | PASS | `npm run test:e2e -- --reporter=list` 実行で全体PASS（live 1件skip） |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
