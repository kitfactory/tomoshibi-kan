# delta-request

## Delta ID
- DR-20260304-settings-standard-skill-link-hide

## In Scope
- 標準おすすめスキル（`STANDARD_SKILL_IDS`）の Link ボタンを非表示にする。
- 適用対象は以下:
  - インストール済み Skills 一覧
  - おすすめ未インストール一覧
  - Skills 検索結果（標準IDが混ざる場合）
- E2E を更新して回帰を防止する。

## Out of Scope
- 非標準（ClawHub由来）スキルの Link 導線変更。
- Settings レイアウト全体の再設計。

## Acceptance Criteria
- AC-01: `codex-file-search` など標準スキルで Link が表示されない。
- AC-02: 非標準スキル（例: `duckduckgo-search`）では Link が引き続き表示される。
- AC-03: `npm run test:e2e -- --reporter=line tests/e2e/workspace-layout.spec.js -g "settings skill|settings tab supports skill uninstall and install"` が PASS。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/delta/DR-20260304-settings-standard-skill-link-hide.md

## applied AC
- AC-01:
  - `wireframe/app.js` で `STANDARD_SKILL_IDS.includes(skillId)` 判定を追加。
  - 標準IDの場合、Linkボタン描画を省略。
- AC-02:
  - 非標準IDは既存通り Link ボタンを描画。
- AC-03:
  - Skills 関連 E2E を再実行し PASS を確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | E2Eで `codex-file-search` の Link 未表示を確認 |
| AC-02 | PASS | E2Eで `duckduckgo-search` の Link 表示を確認 |
| AC-03 | PASS | `99 passed` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
