# delta-request

## Delta ID
- DR-20260304-doc-ui-label-cron

## In Scope
- `docs/concept.md` / `docs/spec.md` / `docs/architecture.md` の UI 表示名について、定期タスク入口の表記を `Job` から `Cron` に統一する。
- Domain 名 `Job` は維持し、UI 文脈の表記のみ更新する。

## Out of Scope
- ドメインモデル名、型名、UseCase名（`Job*`）の変更
- 実装コードの内部キー（`job`）変更
- 仕様内容そのもの（状態遷移・保存方式）の変更

## Acceptance Criteria
- AC-01: `concept.md` の命名ルールと Tab UI 文脈が `Cron` 表記に更新される。
- AC-02: `spec.md` の UI表示名、Tab名、Board/Detailの画面文脈が `Cron` 表記に更新される。
- AC-03: `architecture.md` の Tab 構成表記が `Cron` になる。
- AC-04: delta link 検証が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260304-doc-ui-label-cron.md

## applied AC
- AC-01: `concept.md` の命名ルール（UI表示名）と Tab UI 表記を `Cron` へ更新。
- AC-02: `spec.md` の UI表示名、REQ-0006、画面一覧（Cron Tab）、メッセージ出力先（Cron Board/Detail）を更新。
- AC-03: `architecture.md` の Tab 構成 `Guide/Pal/Cron/Task/Event/Settings` へ更新。
- AC-04: `node scripts/validate_delta_links.js --dir .` で整合確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/concept.md` 命名ルール行と UI前提Tab行が `Cron` 表記 |
| AC-02 | PASS | `docs/spec.md` の UI表示名/REQ-0006/SCR-WS-003/MSG出力先が `Cron` 系へ更新 |
| AC-03 | PASS | `docs/architecture.md` の Tab 構成表記が `Guide/Pal/Cron/Task/Event/Settings` |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が `errors=0, warnings=0` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
