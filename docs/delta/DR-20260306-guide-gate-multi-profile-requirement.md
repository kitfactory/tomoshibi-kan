# delta-request

## Delta ID
- DR-20260306-guide-gate-multi-profile-requirement

## Purpose
- Guide と Gate を singleton 前提から複数 profile 前提へ切り替え、追加・選択・既定利用の要件を concept/spec/architecture に固定する。

## In Scope
- `docs/concept.md` に Guide/Gate 複数 profile 前提と Settings 管理対象の拡張を反映する
- `docs/spec.md` に REQ-0010 / UC-9 / workspace 配置契約 / active guide / default gate / gate override ルールを反映する
- `docs/architecture.md` に Task/Job の gate selection、workspace selection、Agent Identity path contract を反映する
- `docs/plan.md` に seed / archive を追加する
- `docs/delta/DR-20260306-guide-gate-multi-profile-requirement.md` を request/apply/verify/archive で閉じる

## Out of Scope
- `wireframe/**` の UI 実装
- `runtime/**` の repository / use case / migration 実装
- 既存 workspace の `guide/` / `gate/` から `guides/` / `gates/` への移行処理

## Acceptance Criteria
- AC-01: `concept.md` で Guide/Gate が複数 profile を持てること、Settings 管理対象に含まれることが明示される
- AC-02: `spec.md` で REQ-0010 / UC-9 が Guide/Gate/Pal profile 管理へ拡張され、workspace は active guide / default gate を持つと定義される
- AC-03: `spec.md` の workspace 配置契約が `guides/guide-*` / `gates/gate-*` / `pals/pal-*` に更新される
- AC-04: `architecture.md` で Task/Job の `gateProfileId` と workspace selection 契約、Agent Identity path contract が明示される
- AC-05: `docs/plan.md` に seed / archive が追加され、`node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- 実装未着手のまま path contract を先行変更するため、次の runtime/UI delta で `guide/` / `gate/` 前提を崩す作業が必要になる

## Open Questions
- active guide / default gate の永続化先を SQLite settings とするか `.palpal/state` とするかは次の実装 delta で決める

# delta-apply

## status
- APPLIED

## changed files
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260306-guide-gate-multi-profile-requirement.md

## applied AC
- AC-01: `concept.md` の overview / UC-9 / glossary を Guide/Gate 複数 profile 前提へ更新した
- AC-02: `spec.md` の REQ-0010 / PPH-0010 / screen responsibility を Guide/Gate/Pal profile 管理へ更新した
- AC-03: `spec.md` の workspace 配置契約を `guides/guide-*` / `gates/gate-*` / `pals/pal-*` に更新し、template 生成と selection ルールを追加した
- AC-04: `architecture.md` に `gateProfileId` / `WorkspaceAgentSelection` / Agent Identity path contract を追加した
- AC-05: `plan.md` に seed / archive を追加し、delta 整合検証を実行した

## scope deviation
- Out of Scope への変更: No
- 補足: 実装コードと migration は変更していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/concept.md` に Guide/Gate 複数 profile と Settings 対象拡張を反映 |
| AC-02 | PASS | `docs/spec.md` の `REQ-0010` / `PPH-0010` / `SCR-WS-002` / `SCR-WS-006` を更新 |
| AC-03 | PASS | `docs/spec.md` の workspace 配置契約が `guides/guide-*` / `gates/gate-*` / `pals/pal-*` に更新 |
| AC-04 | PASS | `docs/architecture.md` に `gateProfileId` / `WorkspaceAgentSelection` / Agent Identity path contract を追加 |
| AC-05 | PASS | `docs/plan.md` 更新 + `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- 確認事項: UI / runtime / migration は未変更

## residual risks
- R-01: 実装はまだ singleton 前提の箇所が残るため、次の runtime/UI delta で `guides/` / `gates/` 契約へ合わせる必要がある

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - active guide / default gate の保存先と UI 導線は次の実装 delta で扱う
