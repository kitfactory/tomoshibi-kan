# delta-request

## Delta ID
- DR-20260306-pal-identity-template-init

## Purpose
- Pal 作成時に、ユーザー利用言語に応じた `SOUL.md` と `ROLE.md` のテンプレートファイルを生成する。あわせて Agent Identity の role file 名を `ROLE.md` に正規化する。

## In Scope
- `runtime/agent-identity-store.js` に locale 別 `SOUL.md` / `ROLE.md` テンプレート初期化を追加する
- `wireframe/app.js` の Pal 追加処理を更新し、Pal 作成時に Agent Identity を初期化する
- `tests/unit/agent-identity-store.test.js` を更新し、`ROLE.md` 正規名と locale 別テンプレート生成を検証する
- `tests/e2e/workspace-layout.spec.js` に Pal 追加時の identity save 呼び出し確認を追加する
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に `ROLE.md` 契約と template 初期化を反映する
- `docs/delta/DR-20260306-pal-identity-template-init.md` を request/apply/verify/archive で完結させる

## Out of Scope
- 既存 Pal の `SOUL.md` / `ROLE.md` 内容移行
- Guide / Gate の自動テンプレート生成
- `skills.yaml` や `user.md` の命名・仕様変更

## Acceptance Criteria
- AC-01: `AgentIdentityStore` は `SOUL.md` / `ROLE.md` を正規名として扱い、`initializeTemplates` 指定時に locale 別テンプレートを生成する
- AC-02: Pal 追加時に Agent Identity save が呼ばれ、`locale` と template 初期化フラグが渡される
- AC-03: unit / e2e で `ROLE.md` 正規名と template 初期化が PASS する
- AC-04: `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に今回の契約が反映される
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- 既存 `role.md` 実ファイルがリポジトリ外にある場合は別途 rename が必要
- テンプレート文面を固定しすぎると、後で tone の変更が入ったときに差し替えが必要

## Open Questions
- なし

# delta-apply

## status
- APPLIED

## changed files
- runtime/agent-identity-store.js
- wireframe/app.js
- tests/unit/agent-identity-store.test.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260306-pal-identity-template-init.md

## applied AC
- AC-01: `AgentIdentityStore` に locale 別 template builder を追加し、`ROLE.md` 正規名へ変更した
- AC-02: Pal 追加処理で `PalpalAgentIdentity.save` を呼び、locale と template 初期化フラグを渡すようにした
- AC-03: unit / e2e を更新し、`ROLE.md` と template 初期化を検証するようにした
- AC-04: `spec.md` / `architecture.md` / `plan.md` に契約変更を反映した
- AC-05: 検証前提の delta 記録を追加した

## scope deviation
- Out of Scope への変更: No
- 補足: Guide / Gate の自動生成や既存ファイル移行は行っていない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `runtime/agent-identity-store.js` が `ROLE.md` と locale template を実装 |
| AC-02 | PASS | `tests/e2e/workspace-layout.spec.js` で Pal 追加時の identity save payload を確認 |
| AC-03 | PASS | `node --test tests/unit/agent-identity-store.test.js` / Playwright 対象テスト PASS |
| AC-04 | PASS | `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に反映 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の有無: No
- 確認内容: 既存 Pal の内容移行、Guide/Gate 自動生成、`skills.yaml` / `user.md` 契約には変更を入れていない

## residual risks
- R-01: リポジトリ外の既存 workspace に `role.md` がある場合、別 delta で移行が必要

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
