# delta-request

## Delta ID
- DR-20260301-api-key-rotation-policy

## In Scope
- API_KEY ローテーション/移行（secret_ref 再発行・削除整合）の運用仕様を spec/architecture に定義する。
- plan に実施記録を反映する。

## Out of Scope
- 実コード変更。
- DB スキーマ追加。
- SecretStore 実装の差し替え。

## Acceptance Criteria
- AC-01: spec にローテーション、移行、削除整合、失敗時挙動、エラーIDが明記されている。
- AC-02: architecture に実行順序と一貫性ルール、観測性ルールが明記されている。
- AC-03: delta link 検証が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-api-key-rotation-policy.md

## applied AC
- AC-01: spec に API_KEY ローテーション/移行の運用ルールを追記。
- AC-02: architecture に SecretRef rotation のアプリ/インフラ責務と一貫性順序を追記。
- AC-03: plan へ反映。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/spec.md` の「追加仕様 (2026-03-01): API_KEY ローテーション / 移行」 |
| AC-02 | PASS | `docs/architecture.md` の「追加設計 (2026-03-01): SecretRef Rotation / Migration」 |
| AC-03 | PASS | `node scripts/validate_delta_links.js --dir .` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - 実装delta（settings-store 反映）は次サイクルで実施。
