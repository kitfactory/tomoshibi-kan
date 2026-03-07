# delta-request

## Delta ID
- DR-20260301-job-scheduler-spec

## In Scope
- Job 定期実行スケジューラ（`cron` / `interval`）の仕様を `docs/spec.md` に定義する。
- 実行履歴（run history）の保持項目・保持件数・Event Log 連携を `docs/spec.md` に定義する。
- 実装時のレイヤ配置・Port 契約・状態遷移を `docs/architecture.md` に定義する。
- plan に実施記録を反映する。

## Out of Scope
- Scheduler の実コード実装。
- Job UI の表示変更。
- DB マイグレーションや E2E 追加。

## Acceptance Criteria
- AC-01: `docs/spec.md` に schedule 定義（kind/value/timezone/enabled）と起動ポリシーが追加されている。
- AC-02: `docs/spec.md` に Job 実行履歴のデータ項目、保持件数、Event Log 連携、関連エラーIDが追加されている。
- AC-03: `docs/architecture.md` に Scheduler/RunHistory のレイヤ配置と Port 契約が追加されている。
- AC-04: `docs/plan.md` と delta link 検証が整合している。

# delta-apply

## status
- APPLIED

## changed files
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-job-scheduler-spec.md

## applied AC
- AC-01: spec に `schedule_kind/schedule_value/timezone/enabled` と single-flight/missed-run 方針を追記。
- AC-02: spec に run history 項目、保持件数（200件）、Event Log 連携、`ERR-PPH-0021..0023` を追記。
- AC-03: architecture に `JobScheduleUseCase/JobSchedulerTickUseCase/JobRunFinalizeUseCase`、`JobSchedulePort/JobRunRepositoryPort` を追記。
- AC-04: plan と delta の参照を追加。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/spec.md` の「追加仕様 (2026-03-01): Job定期実行スケジューラ」 |
| AC-02 | PASS | 同章の「Job 実行履歴」「Event Log 連携」「エラー」 |
| AC-03 | PASS | `docs/architecture.md` の「追加設計 (2026-03-01): Job Scheduler / Run History」 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が OK |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - 実装（Scheduler本体、UI）は次 delta で対応。
