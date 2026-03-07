# delta-request

## Delta ID
- DR-20260306-guide-plan-materialization-e2e-check

## 概要
- 実モデルで取得済みの malformed `plan_ready` payload を browser 内で replay し、current parser と `createPlannedTasksFromGuidePlan()` を通した時に `Trace / Fix / Verify` の 3 task が board に materialize されることを確認する。

## In Scope
- `scripts/run_guide_plan_materialization_check.js` を追加する
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- production code の変更
- Guide runtime / parser の追加修正
- spec / architecture の変更

## Acceptance Criteria
- AC-01: source debug run の malformed payload replay から parser が valid plan を返す
- AC-02: `createPlannedTasksFromGuidePlan()` が 3 task を作成する
- AC-03: board 上の task row count が `+3` になる
- AC-04: verification script と delta link validation が PASS する

# delta-apply

## Delta ID
- DR-20260306-guide-plan-materialization-e2e-check

## ステータス
- APPLIED

## 変更ファイル
- scripts/run_guide_plan_materialization_check.js
- docs/plan.md

# delta-verify

## Delta ID
- DR-20260306-guide-plan-materialization-e2e-check

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | source debug run (`debug-mmeu18rc-g5270qnp`) の payload replay から valid plan を返した |
| AC-02 | PASS | `createPlannedTasksFromGuidePlan()` が `created=3` を返した |
| AC-03 | PASS | task row count が `before=9`, `after=12` で `+3` になった |
| AC-04 | PASS | verification script と delta link validation が成功した |

## 主な検証コマンド
- `node --check scripts/run_guide_plan_materialization_check.js`
- `node scripts/run_guide_plan_materialization_check.js --source-workspace C:\Users\kitad\AppData\Local\Temp\palpal-guide-check-5z5sGL --run-id debug-mmeu18rc-g5270qnp`
- `node scripts/validate_delta_links.js --dir .`

## 観測メモ
- source payload は `planningIntent=explicit_breakdown`, `planningReadiness=debug_repro_ready` を持つ実モデル `guide_chat` record
- replay 後の latest task は `Trace -> pal-alpha`, `Fix -> pal-beta`, `Verify -> pal-gamma`

## 総合判定
- PASS

verify結果: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-plan-materialization-e2e-check

## クローズ判定
- verify 総合判定: PASS
- archive 可否: 可

archive status: PASS

## 成果
- recovered `plan_ready` payload が board 上で `Trace / Fix / Verify` の 3 task として materialize されることを replay で確認できた

## 次の delta への引き継ぎ
- Seed-01: Guide -> Plan -> materialize の full runner を安定化し、timeout なしで同じ経路を通せるようにする
