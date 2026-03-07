# delta-request

## Delta ID
- DR-20260304-settings-skill-recommendation-visibility

## In Scope
- Skills欄に未インストールおすすめスキルを常時表示する。
- インストール/アンインストールに応じておすすめ表示が同期する。

## Out of Scope
- モーダル検索仕様の変更。
- スキルカタログのデータソース変更。

## Acceptance Criteria
- AC-01: 未インストールおすすめが `Settings > Skills` 欄に表示される。
- AC-02: スキルをインストールすると Skills欄おすすめから同スキルが消える。
- AC-03: スキルをアンインストールすると Skills欄おすすめへ同スキルが再表示される。
- AC-04: 関連E2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260304-settings-skill-recommendation-visibility.md

## applied AC
- AC-01: Skills欄へ `settingsSkillMarketPreview` を追加し、未インストール候補を一覧表示。
- AC-02: install後に `settingsSkillMarketPreview` から対象が消える検証をE2Eへ追加。
- AC-03: uninstall後に `settingsSkillMarketPreview` へ対象が復帰する検証をE2Eへ追加。
- AC-04: Settings関連E2Eを実行しPASS確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の `settingsSkillMarketPreview` |
| AC-02 | PASS | E2E `not.toContainText(\"File Search\")` |
| AC-03 | PASS | E2E `toContainText(\"File Search\")` |
| AC-04 | PASS | Playwright 対象 9/9 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
