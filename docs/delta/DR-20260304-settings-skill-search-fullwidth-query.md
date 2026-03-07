# delta-request

## Delta ID
- DR-20260304-settings-skill-search-fullwidth-query

## In Scope
- Settings > Skills の ClawHub 検索で、全角入力キーワード（例: `Ｄｄｇ`）を半角正規化して検索できるようにする。
- キーワードフィルタ（ローカル絞り込み）でも同じ正規化を適用し、表示結果の不一致を防ぐ。
- E2E に再発防止テストを追加する。

## Out of Scope
- Skills 検索UIのレイアウト変更。
- ClawHub API 連携方式の変更（`/search` + `/skills` の構成自体は変更しない）。

## Acceptance Criteria
- AC-01: `Ｄｄｇ` で検索した場合でも `Ddg` スキルが結果に表示される。
- AC-02: 既存の `duckduckgo` 検索フローが回帰しない。
- AC-03: `npm run test:e2e -- --reporter=line tests/e2e/workspace-layout.spec.js -g "settings skill search"` が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/delta/DR-20260304-settings-skill-search-fullwidth-query.md

## applied AC
- AC-01:
  - `normalizeSearchKeyword` を追加し、`NFKC + lower-case` 正規化を実装。
  - `searchClawHubSkillsApi` / `searchClawHubSkillsWithFallback` / `filterSkillRecordsByKeyword` に適用。
  - E2E テスト `settings skill search normalizes full-width ddg keyword` を追加。
- AC-02:
  - 既存 `duckduckgo` テストが壊れないよう、`ddg` モックの summary を調整し検索語を分離。
- AC-03:
  - 指定コマンドで Skills 検索関連テストを実行。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | E2E で `Ｄｄｇ` 検索時に `Ddg` 表示を確認 |
| AC-02 | PASS | 既存 `settings skill search keeps duckduckgo result and allows install` が PASS |
| AC-03 | PASS | `99 passed`（Skills 検索テスト群） |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
