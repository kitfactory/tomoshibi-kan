# delta-request

## Delta ID
- DR-20260304-settings-skill-modal-advanced-filters

## In Scope
- Skills検索モーダルに以下検索条件を追加する。
  - 疑わしいスキル除外フラグ（non-suspicious）
  - highlighted フラグ（highlighted only）
  - ソート（downloads / stars / installs / latest update / highlighted）
- 検索実行ボタンで上記条件を適用して結果表示する。

## Out of Scope
- ClawHub実APIとの接続。
- スキルインストール永続化仕様の変更。

## Acceptance Criteria
- AC-01: モーダル内に `non-suspicious` / `highlighted` / `sort` の操作UIが表示される。
- AC-02: 検索実行時に指定条件で結果が絞り込み/並び替えされる。
- AC-03: 疑わしい除外ON時は suspicious スキルが結果から除外される。
- AC-04: 関連E2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260304-settings-skill-modal-advanced-filters.md

## applied AC
- AC-01: モーダルへ sort select / non-suspicious checkbox / highlighted checkbox を追加。
- AC-02: `applySkillSearchFilters` + `sortSkillMarketItems` を追加して検索ボタン時に適用。
- AC-03: スキルメタに `suspicious/highlighted/downloads/stars/installs/updatedAt` を追加。
- AC-04: E2Eへフィルタ/ソート検証シナリオを追加しPASS確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` モーダルフィルタUI |
| AC-02 | PASS | `applySkillSearchFilters` / `sortSkillMarketItems` |
| AC-03 | PASS | E2Eで non-suspicious ON/OFF の結果差分を確認 |
| AC-04 | PASS | Playwright対象 9/9 PASS（3シナリオ x 3 viewport） |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
