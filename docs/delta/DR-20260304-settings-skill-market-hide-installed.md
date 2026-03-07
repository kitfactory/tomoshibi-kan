# delta-request

## Delta ID
- DR-20260304-settings-skill-market-hide-installed

## In Scope
- Settings の Skills おすすめリスト（ClawHub）で、インストール済みスキルを非表示にする。
- インストール後に同一スキルがおすすめリストへ残らないことを E2E で固定する。

## Out of Scope
- スキルインストール/削除フロー自体の仕様変更。
- スキル検索条件や外部ソース（ClawHub）連携仕様の変更。

## Acceptance Criteria
- AC-01: インストール済みスキルは `#settingsTabClawHubList` に表示されない。
- AC-02: スキルをインストールした直後、おすすめリストから同一スキルが消える。
- AC-03: 既存 Skills E2E が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260304-settings-skill-market-hide-installed.md

## applied AC
- AC-01: ClawHub表示前に `registeredSkills` を `normalizeSkillId` で正規化し、候補から除外。
- AC-02: おすすめ行の `Installed` 表示分岐を撤去し、インストール済みは非表示化。
- AC-03: Skills E2Eへ「インストール後におすすめリストに同一スキルが出ない」検証を追加。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の `installedSkillIds` 除外フィルタ |
| AC-02 | PASS | インストール後の ClawHub リストに同名が残らない E2E |
| AC-03 | PASS | Playwright 対象テスト PASS |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
