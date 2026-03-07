# delta-request

## Delta ID
- DR-20260304-settings-skill-recommendation-persistence

## In Scope
- Skills モーダル検索で未インストールおすすめスキルが消える不具合を解消する。
- おすすめ件数表示を検索条件から切り離し、未インストール集合で固定する。
- モーダルを閉じた時に検索状態をリセットする。

## Out of Scope
- スキルレジストリ自体の内容変更。
- インストール/削除ロジックの仕様変更。

## Acceptance Criteria
- AC-01: 未インストールスキルは、インストールするまでおすすめ候補に残る。
- AC-02: 1回の検索で該当なしになっても、モーダル再オープン時におすすめ候補が復帰する。
- AC-03: Settings Skills 関連E2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260304-settings-skill-recommendation-persistence.md

## applied AC
- AC-01: おすすめ候補ソースを `getUninstalledSkillMarketItems()` に固定。
- AC-02: モーダル open/close で `skillSearchDraft` / `skillSearchQuery` を初期化。
- AC-03: E2Eへ「該当なし検索後に再オープンで候補復帰」検証を追加。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の `getUninstalledSkillMarketItems` |
| AC-02 | PASS | modal open/close の query reset |
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
