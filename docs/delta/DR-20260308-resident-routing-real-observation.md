# delta-request

## Delta ID
- DR-20260308-resident-routing-real-observation

## 目的
- 実モデルで `調べる人 / 作り手 / 書く人` への resident routing を観測し、現在の割当精度とズレ方を記録する。

## 変更対象（In Scope）
- `scripts/run_guide_autonomous_check.js`（必要な場合の最小観測出力のみ）
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- routing ロジックの追加改善
- real runner の大規模改修
- resident `SOUL.md / ROLE.md` の編集
- E2E / unit test の追加
- spec / architecture 更新

## 受入条件（Acceptance Criteria）
- AC-01: 実モデルで Guide の plan/materialization を最低1回観測し、生成 task と resident 割当を確認できる。
- AC-02: 必要なら runner の出力に resident assignment を最小追加し、観測に使える。
- AC-03: 観測結果として、期待どおり/ズレありの resident 割当を delta verify に記録する。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

## delta-apply
- リポジトリ内のコード変更は行わず、real-model runner と一時観測スクリプトで resident routing の実測を行った。
- assist OFF の `run_guide_autonomous_check.js` は planning 到達率が不安定だったため、assist ON の一時観測スクリプトでも `plan_ready -> materialization` を確認した。

## delta-verify
- AC-01: PASS
  - assist OFF の 4 turn run:
    - command: `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 240000 --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "2でお願いします。reload後にmodelが消えます。" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。調べる人 / 作り手 / 書く人 に分けて進めたい。"`
    - workspace: `C:\Users\kitad\AppData\Local\Temp\tomoshibi-kan-guide-check-b4jGzu`
    - result: `guide_run_count=4`、ただし `task_count_after=3` のままで `plan_ready` に到達せず。real-model Guide は assist OFF では resident set 前提の planning 到達がまだ不安定。
  - assist ON の一時観測:
    - workspace: `C:\Users\kitad\AppData\Local\Temp\tomoshibi-kan-routing-observe-dhTawK`
    - result: `guide_chat` debug run `debug-mmh9dhue-k807wno4` と `plan_artifact` `PLAN-MMH9DHUS-5VX8VQY2` を確認。
    - materialization: `TASK-004` が追加され、`task_progress_logs` の `dispatch` entry により `pal-alpha` への割当を確認。
- AC-02: PASS
  - repo 内 runner の変更は不要だった。一時観測スクリプトで assist ON 条件と debug DB 読み出しを補完した。
- AC-03: PASS
  - 期待していた観測:
    - `調べる人 / 作り手 / 書く人` の 3 task と、それぞれの resident 割当。
  - 実際の観測:
    - real-model output は `status=plan_ready` を返したが、JSON は malformed で、保存された `plan_artifact` は `調べる人` の 1 task のみ。
    - `assigneePalId` は `???` で壊れていたが、Orchestrator の dispatch は `TASK-004 -> pal-alpha` を選択した。
    - progress log message: `TASK-004 を pal-alpha に割り当てました (ROLE=guide_routing)。`
  - 所見:
    - resident routing 自体は `pal-alpha` へ寄っており、`調べる人` の役割との整合は取れている。
    - ただし current bottleneck は routing 精度より前段の `Guide plan output` で、3 task に安定して展開できていない。
- AC-04: PASS
  - `node scripts/validate_delta_links.js --dir .`

## delta-archive
- archive status: PASS
- 実モデル resident routing の observation delta を archive する。
- 結論:
  - assist OFF では real-model Guide が resident set 前提の plan/materialization へ安定到達しない。
  - assist ON + 強い明示では `plan_ready -> 1 task materialize -> pal-alpha dispatch` までは観測できた。
  - 次の改善焦点は routing scorer より先に、Guide の `plan_ready` 出力を 3 task へ安定化すること。
