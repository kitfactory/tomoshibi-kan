# delta-request

## Delta ID
- DR-20260307-orchestrator-three-task-cycle-check

## 目的
- `Guide -> plan_ready -> Trace / Fix / Verify materialize` と `latest task 1件 -> worker runtime -> gate review` までは実モデルで確認できた。次は Guide が生成した 3 task 全部を順番に流し、Orchestrator の一巡を debug run で観測する。

## In Scope
- `Trace / Fix / Verify` 3 task を順番に `start -> worker_runtime -> submit -> gate_review -> approve` まで進める real runner script を追加する
- runner の結果として 3件分の `worker_runtime` / `gate_review` debug run を観測する
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- Orchestrator 本体ロジックの変更
- Guide / parser / routing / Gate 判定ロジックの変更
- spec / architecture の更新
- full loop completion や reject/retry シナリオの検証

## Acceptance Criteria
- AC-01: script が Guide 3 turn 後に `Trace / Fix / Verify` 3 task を検出できる
- AC-02: 3 task すべてについて `worker_runtime` debug run を観測できる
- AC-03: 3 task すべてについて `gate_review` debug run を観測できる
- AC-04: script が各 task の `approve` まで進め、3件とも `done` で閉じられる
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-orchestrator-three-task-cycle-check

## ステータス
- APPLIED

## 変更ファイル
- scripts/run_orchestrator_three_task_cycle_check.js
- docs/plan.md

## 適用内容
- existing single-task runner をベースに `Trace / Fix / Verify` 3 task を順番に流す real runner を追加した
- runner 起動時に prototype localStorage (`projects / board-state / agent-profiles / settings`) を消して reload し、workspace ごとの state 汚染を防いだ
- task action は Playwright DOM click ではなく page context の `runTaskAction / runGate` を直接呼び、`assigned -> in_progress -> to_gate -> done` を安定して辿れるようにした
- Gate overlay が開いている間の不要な tab click を除去し、status 読み取りを `data-board-status` に揃えた

# delta-verify

## Delta ID
- DR-20260307-orchestrator-three-task-cycle-check

## 検証結果
| AC | 状態 | 補足 |
|---|---|---|
| AC-01 | PASS | `TASK-004 / TASK-005 / TASK-006` として `Trace / Fix / Verify` 3 task を検出した |
| AC-02 | PASS | `worker_run_count=3`、各 task に `debug-mmfod100-oyz4jjbj / debug-mmfod70y-aewuc53r / debug-mmfodcfp-wj28s2l3` を観測した |
| AC-03 | PASS | `gate_run_count=3`、各 task に `debug-mmfod4is-fff1xvgs / debug-mmfod9yn-o3d6d39w / debug-mmfodfz6-fjmzgsij` を観測した |
| AC-04 | PASS | `TASK-004 / TASK-005 / TASK-006` の最終 `task_status=done` を確認した |
| AC-05 | PASS | delta link validation が通った |

## 主な確認コマンド
- `node --check scripts/run_orchestrator_three_task_cycle_check.js`
- `node scripts/run_orchestrator_three_task_cycle_check.js`
- `node scripts/validate_delta_links.js --dir .`

## 観測メモ
- workspace: `C:\Users\kitad\AppData\Local\Temp\palpal-orchestrator-cycle-check-IraPy0`
- `guide_run_count=3`
- `worker_run_count=3`
- `gate_run_count=3`
- cycle order:
  - `TASK-004 Trace -> pal-alpha -> done`
  - `TASK-005 Fix -> pal-beta -> done`
  - `TASK-006 Verify -> pal-gamma -> done`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-orchestrator-three-task-cycle-check

## クローズ状態
- verify 状態: PASS
- archive 可否: 可

archive status: PASS

## 要約
- Guide が生成した `Trace / Fix / Verify` 3 task を real runner で順番に worker runtime / gate review / approve まで流し、3件すべて `done` で閉じられることを確認した

## 次の delta への引き継ぎ
- Seed-01: `Pal autonomous check` として、各 worker の `WorkerExecutionInput -> output/evidence/replay` の質を個別に観測する
