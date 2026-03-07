# delta-request

## Delta ID
- DR-20260304-settings-skill-search-api

## In Scope
- Settings > Skills 検索モーダルの検索処理を ClawHub API ベースへ変更する。
  - キーワード検索: `GET /api/v1/search?q=...`
  - 条件付き一覧: `GET /api/v1/skills?sort=...&nonSuspicious=...&highlighted=...`
- API失敗時は既存ローカルカタログへフォールバックし、検索体験を維持する。
- モーダル結果の loading 表示を追加する。
- ClawHub API由来の未知スキルは「標準Skillのみ対応」としてインストール不可にする。

## Out of Scope
- 外部スキル（標準Skill以外）の実インストール実装
- Skills 画面レイアウトやタブ構造の変更
- Pal Runtime への外部スキル割り当て仕様変更

## Acceptance Criteria
- AC-01: 検索実行で ClawHub API を呼び、結果をモーダルに表示できる。
- AC-02: `疑わしいスキルを除外` / `Highlightedのみ` / `並び順` が API パラメータと画面結果に反映される。
- AC-03: API失敗/タイムアウト時でも UI が壊れず、ローカル検索へフォールバックする。
- AC-04: 既存の Skills 検索・フィルタ・インストール導線のE2EがPASSする。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- docs/plan.md
- docs/delta/DR-20260304-settings-skill-search-api.md

## applied AC
- AC-01: `searchClawHubSkillsApi` / `fetchClawHubJson` を追加し、検索ボタン押下時に実API呼び出しを実行。
- AC-02: filter/sort 状態を API クエリ (`sort/nonSuspicious/highlighted`) に変換して送信。
- AC-03: API結果取得失敗時は `searchClawHubSkillsWithFallback` でローカル検索にフォールバック。
- AC-04: modal loading 状態と install可否（標準Skillのみ）を追加し、既存導線を維持。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` に ClawHub API 呼び出しを実装（`/search`, `/skills`） |
| AC-02 | PASS | filter/sort を API パラメータへマッピングして検索実行 |
| AC-03 | PASS | API失敗時にローカル検索へフォールバックし、モーダル描画継続 |
| AC-04 | PASS | `playwright` 9件PASS（Skills検索/フィルタ/インストール） |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
