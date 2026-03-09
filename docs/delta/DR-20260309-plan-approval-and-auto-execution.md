# delta-request

## Delta ID
- DR-20260309-plan-approval-and-auto-execution

## Delta Type
- FEATURE

## 目的
- 管理人が作った `plan_ready` を即実行せず、ユーザー承認で実行開始する。
- 承認後は dispatch された task/job を最小の自動 execution loop で最後まで進める。

## 変更対象（In Scope）
- Guide の `plan_ready` 後を `pending_approval` artifact として保存する。
- `はい / 進めて / お願いします` 相当の承認入力で最新 pending plan を `approved` に更新し、materialize する。
- materialize 後に created task/job を順に `start -> submit -> gate review -> approve/reject` まで自動実行する。
- `task_progress_logs` と Task detail conversation log に承認・dispatch・自動進行の会話を残す。
- 最小限の unit / E2E / spec / architecture 同期を行う。

## 非対象（Out of Scope）
- resident routing の精度改善
- 別プロセス/別スレッド化
- queue / scheduler / worker daemon の導入
- Gate 判定ロジックの刷新
- Guide の `SOUL/ROLE` 再設計

## 差分仕様
- DS-01:
  - Given: 管理人が `status=plan_ready` と valid plan を返す
  - When: Guide chat がその応答を受け取る
  - Then: plan artifact は `pending_approval` で保存され、task/job はまだ materialize されない
- DS-02:
  - Given: 最新 artifact が `pending_approval`
  - When: ユーザーが承認意図の短い返答を送る
  - Then: その artifact を `approved` に更新し、task/job を materialize する
- DS-03:
  - Given: approved plan から task/job が materialize された
  - When: 自動 execution loop が起動する
  - Then: created target は順に resident runtime と gate review を通り、完了または reject/replan 状態まで進む
- DS-04:
  - Given: dispatch / auto execution / gate result が発生する
  - When: progress log と detail conversation を表示する
  - Then: 承認、依頼、進捗、古参住人の判定、再計画要求、完了返却が読み取れる

## 受入条件（Acceptance Criteria）
- AC-01: `plan_ready` 直後には task/job が増えず、artifact は `pending_approval` で保存される
- AC-02: `はい` または `進めて` で最新 pending artifact が materialize される
- AC-03: materialize 後、少なくとも 1 plan の created task/job が自動 execution loop で `done` または `rejected/replan_required` まで進む
- AC-04: Task detail 右列で、承認から完了/差し戻しまでの会話ログが読める

## 制約
- 既存の手動 `runTaskAction / runGate` は残し、後方互換を壊さない
- 自動 execution は created targets に限定し、既存 backlog 全体を勝手に実行しない
- 追加状態は最小にし、既存 `plan_artifacts` schema を使える範囲で使う

## Review Gate
- required: Yes
- reason: Guide / Orchestrator / TaskBoard / progress log を横断し、execution loop の挙動が変わる

## Review Focus（REVIEW または review gate required の場合）
- checklist: `docs/delta/REVIEW_CHECKLIST.md`
- target area: plan artifact lifecycle / auto execution loop / task conversation flow

## 未確定事項
- Q-01: 自動 execution loop の gate reject 既定動作は `replan bridge` 優先でよいか

# delta-apply

## 実装方針
- `plan_ready` は直ちに dispatch せず、`pending_approval` の `Plan artifact` として保存する。
- 最新 `pending_approval` artifact がある時だけ、短い承認入力を approval とみなして同一 `plan_id` を `approved` に更新する。
- approval 後は saved artifact を materialize し、created task だけを最小 auto execution loop で順に進める。
- progress log と task detail conversation は、承認から完了までの resident-facing な会話を残す。

## 変更ファイル
- `runtime/settings-store.js`
- `electron-main.js`
- `electron-preload.js`
- `wireframe/app.js`
- `tests/unit/settings-store.test.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- `docs/delta/DR-20260309-plan-approval-and-auto-execution.md`

## 実装メモ
- `plan_artifacts` は `updatePlanArtifact` を追加し、`pending_approval -> approved` の更新を DB 上で扱えるようにした。
- Guide chat は `plan_ready` 受信時に `pending_approval` artifact を保存し、承認入力 (`はい / 進めて / お願いします`) の時だけ materialize へ進む。
- `materializeApprovedPlanArtifact()` は created task/job の一覧を返し、created task を queue ベースで auto execution へ渡せるようにした。
- auto execution は created task に限定し、`dispatch -> worker_runtime -> to_gate -> gate_review -> done | rejected | replan_required` まで順に進める。
- Cron job は approval 後に materialize するが、今回の最小実装では自動実行しない。

# delta-verify

## 実行した検証
- static:
  - `node --check runtime/settings-store.js`
  - `node --check electron-main.js`
  - `node --check electron-preload.js`
  - `node --check wireframe/app.js`
  - `node --check tests/e2e/workspace-layout.spec.js`
- targeted unit:
  - `node --test tests/unit/settings-store.test.js`
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|guide chat can materialize cron jobs from approved plan|guide prompts project setup before starting a new project request|guide prompts project setup before planning when no project is focused|task detail drawer renders conversation log timeline|guide progress query reports completed task without model call|guide progress query explains replan required after gate reject|task progress log stores dispatch and gate flow entries|job board supports gate flow"`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `guide chat creates planned tasks and assigns workers` E2E で、初回 `plan_ready` 後は latest artifact が `pending_approval` となり task 数が増えないことを確認した |
| AC-02 | PASS | 同 E2E と `guide chat can materialize cron jobs from approved plan` E2E で、`はい / 進めて` により同一 `plan_id` が `approved` へ更新され、task/job が materialize されることを確認した |
| AC-03 | PASS | task approval 後の created task が auto execution に入り、progress log に `dispatch / worker_runtime / to_gate / gate_review` が残ることを E2E で確認した |
| AC-04 | PASS | `task detail drawer renders conversation log timeline` E2E で、承認後の dispatch から gate result までを右列会話ログとして読めることを確認した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- 既知の最小制約として、Cron job は approval 後に materialize されるが、この delta では自動実行しない。

## Review Gate
- required: Yes
- checklist: `docs/delta/REVIEW_CHECKLIST.md`
- layer integrity: PASS
- docs sync: PASS
- data size: NOT CHECKED
- code split health: PASS
- file-size threshold: PASS

## Review Delta Outcome
- pass: Yes
- follow-up delta seeds:
  - `SEED-20260309-auto-execution-background-runner`

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260309-plan-approval-and-auto-execution

## クローズ判定
- verify結果: PASS
- review gate: PASS
- archive可否: 可

## 確定内容
- 目的: `plan_ready` を即実行せず承認待ちにし、承認後に materialize と最小 auto execution loop を開始する。
- 変更対象: `runtime/settings-store.js`、`electron-main.js`、`electron-preload.js`、`wireframe/app.js`、`tests/unit/settings-store.test.js`、`tests/e2e/workspace-layout.spec.js`、`docs/spec.md`、`docs/architecture.md`、`docs/plan.md`、本 delta 記録
- 非対象: resident routing 精度改善、別スレッド/別プロセス化、queue/daemon 導入、Gate 判定ロジック刷新、Guide の `SOUL/ROLE` 再設計

## 実装記録
- 変更ファイル:
  - `runtime/settings-store.js`
  - `electron-main.js`
  - `electron-preload.js`
  - `wireframe/app.js`
  - `tests/unit/settings-store.test.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
  - `docs/delta/DR-20260309-plan-approval-and-auto-execution.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS

## 検証記録
- verify要約: `pending_approval -> approved -> materialize -> task auto execution` の lifecycle を unit / E2E / validator で確認した。
- 主要な根拠:
  - static check PASS
  - `tests/unit/settings-store.test.js` PASS
  - targeted Playwright 27件 PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- Cron job の自動実行は未対応。approval 後に materialize のみ行う。
