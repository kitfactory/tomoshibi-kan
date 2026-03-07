# delta-request

## Delta ID
- DR-20260304-settings-skill-recommendation-install-button

## In Scope
- Skills欄の未インストールおすすめ各行にインストールボタンを追加する。
- おすすめ欄のボタンから直接インストール可能にする。
- インストール後におすすめ欄から対象スキルが消えることを検証する。

## Out of Scope
- モーダル検索仕様の変更。
- スキルレジストリ定義の変更。

## Acceptance Criteria
- AC-01: `#settingsSkillMarketPreview` 内の各おすすめ行にインストールボタンが表示される。
- AC-02: おすすめ欄のボタン押下でスキルがインストール済みへ移動する。
- AC-03: インストール後、同スキルのおすすめ行が非表示になる。
- AC-04: 関連E2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260304-settings-skill-recommendation-install-button.md

## applied AC
- AC-01: おすすめ行テンプレートへ `data-clawhub-download-skill` ボタンを追加。
- AC-02: 既存インストールハンドラをおすすめ行にも適用し直接インストールを有効化。
- AC-03: E2Eへおすすめ行でのインストール導線検証を追加。
- AC-04: Settings関連E2Eを実行しPASS確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の `settingsSkillMarketPreview` 行テンプレート |
| AC-02 | PASS | E2Eでおすすめ行ボタン押下後に installed 行出現 |
| AC-03 | PASS | E2Eでおすすめ行から対象が消えることを確認 |
| AC-04 | PASS | Playwright 対象 6/6 PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
