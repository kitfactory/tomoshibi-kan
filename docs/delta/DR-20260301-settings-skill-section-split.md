# delta-request

## Delta ID
- DR-20260301-settings-skill-section-split

## 目的
- Settings 画面で Skill を Model/CLI から分離し、第3カテゴリとして表示する。

## In Scope
- `wireframe/app.js` の Settings レイアウト。
- カテゴリ見出し文言（Language / Model+CLI / Skills）。
- Skill 一覧・ClawHub・Skill検索を第3カテゴリへ移動。

## Out of Scope
- Skillデータ仕様変更。
- 保存ロジックの仕様変更。

## Acceptance Criteria
- AC-01: Settings が 3 セクション（Language / Model+CLI / Skills）で表示される。
- AC-02: Skill の一覧・削除・検索・Download 操作は従来通り動作する。
- AC-03: unit/E2E が PASS する。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js

## AC 対応
- AC-01:
  - `labels.modelSection` を Model/CLI に変更。
  - `labels.skillCategorySection` / `labels.skillCategoryHint` を追加。
  - root.innerHTML を再構成し、Skill ブロックを独立セクション化。
- AC-02:
  - `settingsTabSkillList` / `settingsTabClawHubList` / `settingsTabSkillSearch` の ID を維持。
  - 既存イベントバインドをそのまま利用。
- AC-03:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep "settings tab shows model list and allows adding model|settings tab supports skill uninstall and install|language switch exists in settings tab|settings allows LMStudio model without api key"`

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | Settings レイアウトを3カテゴリへ分離 |
| AC-02 | PASS | Skill操作 E2E（削除/検索/Download）PASS |
| AC-03 | PASS | unit/E2E PASS |

# delta-archive

## クローズ
- verify: PASS
- verify result: PASS
- archive: 完了

## 要約
- Skill 設定を独立カテゴリ化し、Model/CLIカテゴリと分離した。
