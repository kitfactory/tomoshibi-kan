# delta-request

## Delta ID
- DR-20260307-guide-driven-orchestrator-log-doc

## Goal
- `PlanExecutionOrchestrator` を Guide-driven な実行系として定義し、task/job の途中経過を追える task-centric progress log を正本へ反映する。
- 実 actor と表示 actor を分け、内部では Orchestrator を保持しつつ、見た目上は `Guide / Pal / Gate` が語る形へ整理する。

## In Scope
- `concept.md` に Guide-driven Orchestrator と task-centric progress log の概念を追加する。
- `spec.md` に Orchestrator の責務、replan の扱い、task log の目的と内部 actor / 表示 actor 二層構造を追加する。
- `architecture.md` に Orchestrator core と Guide reasoning boundary、task progress log schema、progress query の責務を追加する。
- `plan.md` と delta を更新する。

## Out of Scope
- 実装コードの変更
- Event Log UI の redesign
- DB schema 追加
- commit / push

## Acceptance Criteria
- AC-01: Guide は Plan 作成主体、Orchestrator は実行主体、replan の要求は Orchestrator、再plan の生成は Guide という境界が明記されている。
- AC-02: task-centric progress log の目的が「依頼した task が途中でどうなっているかを確認できること」として明記されている。
- AC-03: log が `actual_actor` と `display_actor` の二層を持ち、Guide を表示上の語り手として使えることが明記されている。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

## delta-apply
- `concept.md` に `Guide-driven Orchestrator` と `Task-centric Progress Log` を追加し、Execution Loop 用語群の一部として固定した。
- `spec.md` に Orchestrator の replan 境界、Guide model/SOUL 利用条件、task-centric log の目的と二層 actor 構造を追加した。
- `architecture.md` に Orchestrator core と Guide reasoning boundary、`TaskProgressLogEntry` schema、progress query / 表示責務を追加した。
- `plan.md` に current の seed/delta を追加した。

## delta-verify
- AC-01: PASS  
  Guide は Plan 作成主体、Orchestrator は実行主体、replan 要求は Orchestrator、再plan 生成は Guide として `concept/spec/architecture` に反映した。
- AC-02: PASS  
  task-centric progress log の目的を「途中で task がどうなっているか確認できること」として `concept/spec/architecture` に反映した。
- AC-03: PASS  
  `actual_actor` / `display_actor` の二層構造と、Guide を表示上の語り手に使える設計を `spec/architecture` に反映した。
- AC-04: PASS  
  `node scripts/validate_delta_links.js --dir .`

## 検証コマンド
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

## delta-archive
- 文書 delta としてクローズする。
- 実装コード、Event Log UI redesign、DB schema 追加、commit/push は今回の Out of Scope のため未実施。

archive status: PASS
