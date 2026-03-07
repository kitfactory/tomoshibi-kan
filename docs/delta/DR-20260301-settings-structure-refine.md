# delta-request

## Delta ID
- DR-20260301-settings-structure-refine

## 目的
- Settings の情報構造を整理し、重複表示を削除する。
- Model/CLI と Skills を視覚的に明確に分離する。

## In Scope
- `wireframe/app.js` の Settings 表示文言とレイアウト。
- `wireframe/styles.css` に subpanel レイアウトスタイル追加。

## Out of Scope
- データ保存仕様変更。
- Skill データモデル変更。

## Acceptance Criteria
- AC-01: Language セクションはカテゴリ見出し「Language」のみ。項目は「表示言語 / Display language」のみ表示。
- AC-02: Model/CLI セクションの説明文（登録・追加・保存）は非表示。
- AC-03: Model と CLI がそれぞれ subpanel 表示。
- AC-04: Skills セクションで「インストール済みスキル」パネルと「ClawHub検索/インストール」パネルを縦並び表示。
- AC-05: 既存 Skill 操作（削除/検索/Download）が維持される。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- wireframe/styles.css

## AC 対応
- AC-01:
  - `labels.languageItem` を導入。
  - Language セクションから重複ヒント表示を削除。
- AC-02:
  - Model/CLI セクションの `settings-section-sub` 出力を削除。
- AC-03:
  - Model / CLI の各ブロックに `settings-subpanel` を適用。
- AC-04:
  - Skills セクションに `settings-stack` を導入。
  - 上段: `settingsTabSkillList`（Installed Skills）
  - 下段: `settingsTabSkillSearch` + `settingsTabClawHubList`（ClawHub）
- AC-05:
  - Skill 関連IDを維持し、既存イベントバインドを継続利用。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | Language セクションの重複文言を削除 |
| AC-02 | PASS | Model/CLI セクションの説明文非表示 |
| AC-03 | PASS | Model/CLI を subpanel 表示 |
| AC-04 | PASS | Skills を Installed/ClawHub の2パネル縦構成 |
| AC-05 | PASS | settings系 E2E（skill uninstall/search/download）PASS |

## 実行コマンド
- `node --check wireframe/app.js`
- `npm run build:wireframe-css`
- `npm run test:unit`
- `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model|settings tab supports skill uninstall and install|language switch exists in settings tab|settings allows LMStudio model without api key"`

# delta-archive

## クローズ
- verify: PASS
- verify result: PASS
- archive: 完了

## 要約
- Settings のカテゴリ構造を整理し、Languageの重複説明を削除。
- Model/CLI の panel 分離、および Skills の Installed/ClawHub 2段 panel 化を実施した。
