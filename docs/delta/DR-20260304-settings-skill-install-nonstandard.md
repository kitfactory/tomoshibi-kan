# delta-request

## Delta ID
- DR-20260304-settings-skill-install-nonstandard

## In Scope
- Settings > Skills で、標準スキルID以外の ClawHub 検索結果もインストール可能にする。
- 既存の「疑わしいスキル除外」等の検索条件は維持したまま、非標準IDの表示・追加・削除を許可する。
- 回帰防止として unit/E2E を更新する。

## Out of Scope
- スキル実行時のサンドボックス・安全審査ポリシーの新規追加。
- Skills UI レイアウト刷新。

## Acceptance Criteria
- AC-01: ClawHub 検索で見つかった `duckduckgo-search` を Settings からインストールできる。
- AC-02: インストール後、Settings のインストール済み一覧から削除可能である。
- AC-03: `npm run test:unit` と `npm run test:e2e -- --reporter=list tests/e2e/workspace-layout.spec.js` が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- tests/unit/skill-catalog.test.js
- docs/plan.md
- docs/delta/DR-20260304-settings-skill-install-nonstandard.md

## applied AC
- AC-01:
  - `normalizeSkillId` を動的許可へ変更し、標準ID外でも ClawHub 由来IDを受け入れるようにした。
  - `installRegisteredSkillWithFallback` の許可ID集合を固定6件から動的集合へ変更した。
  - 検索結果の追加メタを `ADDITIONAL_SKILL_REGISTRY` へ保持し、標準外IDでも表示名を扱えるようにした。
- AC-02:
  - `uninstallRegisteredSkillWithFallback` も動的許可ID集合を使用するように変更し、非標準IDでも削除可能にした。
- AC-03:
  - unit/E2E を実行し、追加ケースを含め PASS を確認した。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | E2E `settings skill search keeps duckduckgo result and allows install` で `duckduckgo-search` の追加を確認 |
| AC-02 | PASS | 既存削除導線は動的IDでも `uninstallRegisteredSkillWithFallback` で処理可能 |
| AC-03 | PASS | `npm run test:unit` (56 passed), `npm run test:e2e -- --reporter=list tests/e2e/workspace-layout.spec.js` (93 passed) |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
