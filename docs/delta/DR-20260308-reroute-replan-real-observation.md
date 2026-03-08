# delta-request

## Delta ID
- DR-20260308-reroute-replan-real-observation

## Delta Type
- REVIEW

## 目的
- `reroute / replan_required / replanned` の Orchestrator 分岐を real-model 条件で観測し、current resident set に対してどこまで実運用で回るかを記録する。

## 変更対象（In Scope）
- `scripts/run_orchestrator_autonomous_check.js`
- `scripts/run_orchestrator_three_task_cycle_check.js`
- `scripts/run_orchestrator_reroute_replan_observation.js`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- routing ロジックの改善
- resident `SOUL.md / ROLE.md / RUBRIC.md` の編集
- app runtime の振る舞い変更
- E2E / unit test の追加
- `concept/spec/architecture` 更新

## 受入条件（Acceptance Criteria）
- AC-01: current resident set（`guide-core / gate-core / pal-alpha / pal-beta / pal-delta`）に合わせて real-model runner を実行できる。
- AC-02: real-model observation script で、Gate reject から `replan_required` の branch を少なくとも 1 回観測できる。`replanned` まで進まない場合は、その不成立自体を観測結果として記録できる。
- AC-03: `reroute` については、real-model 条件で decision を複数観測し、成立したか、自然発火しないか、その理由を `delta-verify` に記録できる。
- AC-04: 観測結果として、branch ごとの成立可否・詰まり方・debug run / progress log の要点を `delta-verify` に記録する。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

## delta-apply
- current resident set に合わせて real-model runner の profile 固定を `pal-delta` へ更新した。
- default prompt を resident trio（`調べる人 / 作り手 / 書く人`）基準へ更新した。
- `scripts/run_orchestrator_reroute_replan_observation.js` を追加し、同一 workspace で次を観測できるようにした。
  - Guide-driven routing decision の複数 scenario 観測
  - Gate reject -> `replan_required` branch
  - `replanned` の成立 / 不成立

## delta-verify
- AC-01: PASS
  - `scripts/run_orchestrator_autonomous_check.js`
  - `scripts/run_orchestrator_three_task_cycle_check.js`
  - `scripts/run_orchestrator_reroute_replan_observation.js`
  を current resident set 前提で `node --check` PASS。
- AC-02: PASS
  - command: `node scripts/run_orchestrator_reroute_replan_observation.js`
  - workspace: `C:\Users\kitad\AppData\Local\Temp\tomoshibi-kan-reroute-replan-observe-ZJbmCI`
  - observed:
    - `worker_run=debug-mmhhb6gf-gvkl3n75`
    - `gate_run=debug-mmhhbaxv-zivu0wr1`
    - `replan_required_status=blocked`
    - `replanned_status=missing`
  - meaning:
    - `replan_required` までは real-model 条件で入る。
    - ただし `replanned` は成立せず、Guide は再計画を会話継続として返して止まっている。
- AC-03: PASS
  - Guide-driven routing decision の real-model 観測:
    - `research`: baseline=`pal-alpha`, guided=`""`
    - `make`: baseline=`pal-alpha`, guided=`pal-beta`, fallback=`replan_required`
    - `write`: baseline=`pal-alpha`, guided=`pal-delta`, fallback=`replan_required`
    - `mixed`: baseline=`pal-alpha`, guided=`pal-delta`, fallback=`replan_required`
  - 所見:
    - natural `reroute` は観測できなかった。
    - current routing prompt は baseline resident を LLM に渡していないため、`reroute` の意味づけが弱い。
    - model は resident 選択自体はできるが、fallbackAction を `replan_required` に倒しがち。
- AC-04: PASS
  - progress log:
    - `dispatch -> worker_runtime -> to_gate -> gate_review -> replan_required`
  - bottleneck:
    - `replan_required` 後の Guide reply は `plan_ready` ではなく追加提案 / clarification に留まり、new plan artifact は増えなかった（`plan_artifact_count=1`）。
  - current conclusion:
    - `replan bridge` の wiring は入っている。
    - ただし real-model 条件では `Guide replanning` の到達率がまだ不足している。
- AC-05: PASS
  - `node scripts/validate_delta_links.js --dir .`

## delta-archive

## Delta ID
- DR-20260308-reroute-replan-real-observation

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的: `reroute / replan_required / replanned` の Orchestrator 分岐を real-model 条件で観測し、current resident set に対する成立可否と詰まり方を記録した
- 変更対象: `scripts/run_orchestrator_autonomous_check.js`、`scripts/run_orchestrator_three_task_cycle_check.js`、`scripts/run_orchestrator_reroute_replan_observation.js`、`docs/plan.md`、当該 delta 記録
- 非対象: routing ロジック改善、resident identity 編集、app runtime 振る舞い変更、E2E/unit 追加、`concept/spec/architecture` 更新

## 実装記録
- 変更ファイル:
  - `scripts/run_orchestrator_autonomous_check.js`
  - `scripts/run_orchestrator_three_task_cycle_check.js`
  - `scripts/run_orchestrator_reroute_replan_observation.js`
  - `docs/plan.md`
  - `docs/delta/DR-20260308-reroute-replan-real-observation.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS
  - AC-05 PASS

## 検証記録
- verify要約:
  - natural `reroute` は real-model 条件で観測できなかった
  - `replan_required` は real-model 条件で観測できた
  - ただし `replanned` は成立せず、Guide replanning が current bottleneck であることを確認した
- 主要な根拠:
  - `node --check` PASS
  - `node scripts/run_orchestrator_reroute_replan_observation.js` PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- `reroute` decision の prompt には baseline resident が渡っておらず、fallbackAction の意味づけが弱い
- `replan_required` 後の Guide replanning は real-model 条件で `plan_ready` へ安定到達しない

## 次のdeltaへの引き継ぎ（任意）
- `SEED-20260308-assist-off-plan-ready-stability`
