# delta-request

## Delta ID
- DR-20260306-soul-md-canonicalize

## Purpose
- Agent Identity の個別文脈ファイル名を `SOUL.md` 表記へ正規化し、文書と実装の契約を揃える。既存の `soul.md` は読み取り互換を維持する。

## In Scope
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` と関連 delta 文書内の `soul.md` 表記を `SOUL.md` に統一する
- `runtime/agent-identity-store.js` を更新し、保存先を `SOUL.md` に変更しつつ、既存 `soul.md` を読み取り互換として扱う
- `tests/unit/agent-identity-store.test.js` を更新し、`SOUL.md` 正規名と lowercase fallback を検証する
- `docs/plan.md` に今回の seed/archive を反映する

## Out of Scope
- `role.md` / `skills.yaml` / `user.md` の命名変更
- Agent Identity UI の追加や編集フローの変更
- `SOUL.md` 内容仕様そのものの変更

## Acceptance Criteria
- AC-01: 正本文書と関連 delta 文書で Agent Identity の個別文脈ファイル名が `SOUL.md` 表記に統一されている
- AC-02: `runtime/agent-identity-store.js` は保存時に `SOUL.md` を生成し、読み込み時に既存 `soul.md` も受け入れる
- AC-03: unit test で `SOUL.md` 保存と `soul.md` fallback 読み込みの双方が PASS する
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- ファイル名変更は大小文字を区別する環境で既存ワークスペースとの互換性問題を起こしうる
- archive 済み delta 文書の用語変更で履歴文面が変わる

## Open Questions
- なし

# delta-apply

## status
- APPLIED

## changed files
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260304-agent-identity-step1-foundation.md
- docs/delta/DR-20260304-agent-identity-repository.md
- runtime/agent-identity-store.js
- tests/unit/agent-identity-store.test.js
- docs/delta/DR-20260306-soul-md-canonicalize.md

## applied AC
- AC-01: `spec.md` / `architecture.md` / `plan.md` と関連 delta 文書の `soul.md` 表記を `SOUL.md` へ更新した
- AC-02: `AgentIdentityStore` の保存先を `SOUL.md` に変更し、読み込み時は `SOUL.md` 優先・`soul.md` fallback にした
- AC-03: unit test を更新し、`SOUL.md` 保存と lowercase fallback 読み込みを検証するようにした
- AC-04: delta link 検証前提の記録を追加した

## scope deviation
- Out of Scope への変更: No
- 補足: `role.md` / `skills.yaml` / `user.md` の命名や UI 仕様は変更していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` と関連 delta の `SOUL.md` 表記を更新 |
| AC-02 | PASS | `runtime/agent-identity-store.js` が `SOUL.md` 保存と `soul.md` fallback 読み込みを実装 |
| AC-03 | PASS | `node --test tests/unit/agent-identity-store.test.js` PASS |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の有無: No
- 確認内容: `role.md` / `skills.yaml` / `user.md` の命名、UI、他 runtime 仕様には変更を入れていない

## residual risks
- R-01: 既存ワークスペースの rename は行わないため、ディスク上には `soul.md` と `SOUL.md` が混在しうる

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
