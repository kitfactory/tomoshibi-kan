# delta-request

## Delta ID
- DR-20260304-settings-skill-market-button-layout

## In Scope
- Skills欄の「ClawHubから検索・インストール」ボタンを左寄せにする。
- 同ボタン幅をおおよそ1/4に調整する。
- 重複している説明ラベル（ClawHubからスキルを検索してインストール）を削除する。

## Out of Scope
- モーダル検索ロジックの仕様変更。
- スキル一覧/おすすめ一覧の内容変更。

## Acceptance Criteria
- AC-01: `#settingsSkillMarketOpenModal` が左寄せ表示される。
- AC-02: `#settingsSkillMarketOpenModal` が約1/4幅で表示される（モバイルは全幅許容）。
- AC-03: Skills欄の重複説明ラベルが表示されない。
- AC-04: 関連E2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- docs/plan.md
- docs/delta/DR-20260304-settings-skill-market-button-layout.md

## applied AC
- AC-01/AC-02: `settings-skill-market-open-btn` クラスを追加し左寄せ + 25%幅を適用。
- AC-02: モバイル（max-width:900px）では全幅へフォールバック。
- AC-03: Skills欄の説明ラベル要素を削除。
- AC-04: Settings対象E2Eを実行しPASS確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/styles.css` `.settings-skill-market-open-btn` |
| AC-02 | PASS | `width:25%` + mobile media query full width |
| AC-03 | PASS | `wireframe/app.js` から重複ラベル削除 |
| AC-04 | PASS | Playwright 対象 3/3 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
