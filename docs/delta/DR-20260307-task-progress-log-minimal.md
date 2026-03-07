# delta-request

## Delta ID
- DR-20260307-task-progress-log-minimal

## 目的
- `task-centric progress log` の最小実装を追加し、ユーザーが task/job の途中経過を後から追える基盤を作る。
- 既存の `Guide -> worker -> gate` 実行フローを壊さず、まずは DB/repository/bridge/append/query までを閉じる。

## 変更対象（In Scope）
- 対象1: `runtime/settings-store.js` の progress log schema / append / query 実装
- 対象2: `electron-main.js` / `electron-preload.js` の progress log bridge 追加
- 対象3: `wireframe/app.js` の既存 dispatch / worker runtime / to_gate / gate / resubmit / plan completion から progress log を append する接続
- 対象4: progress log query を使う最小の test 追加・更新
- 対象5: `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` と本 delta 文書の最小同期

## 非対象（Out of Scope）
- 非対象1: `PlanExecutionOrchestrator` 独立モジュール化
- 非対象2: replan / reroute / retry policy の実装拡張
- 非対象3: Guide が progress log を自然文で要約して答える会話機能
- 非対象4: 新しい Debug / Progress 専用 UI タブ
- 非対象5: `docs/plan.md` 全体の文字化け修復
- 非対象6: ユーザー未追跡ファイル `docs/tomoshibikan_resident_set_v0_1.md`

## 差分仕様
- DS-01:
  - Given: 既存 `settings.sqlite` に orchestration debug run はあるが、task/job 単位の progress log はない
  - When: progress log table と repository append/query を追加する
  - Then: `actual_actor / display_actor / action_type / status / message_for_user / payload_json` を task/job 単位で保持できる
- DS-02:
  - Given: renderer から progress log を永続化する経路がない
  - When: Electron IPC / preload bridge を追加する
  - Then: renderer は direct DB access なしで append/list/latest を呼べる
- DS-03:
  - Given: dispatch / worker runtime / gate review の主要イベントは既に UI event として存在する
  - When: 既存フローから progress log を append する
  - Then: task/job の最新状態と直近イベントを DB query で追える

## 受入条件（Acceptance Criteria）
- AC-01: `settings.sqlite` に task progress log table が追加され、append/list/latest 相当の repository API が使える
- AC-02: preload bridge から progress log append/query が呼べる
- AC-03: `dispatch`, `worker_runtime`, `to_gate`, `gate_review`, `resubmit`, `plan_completed` の主要イベントが progress log に記録される
- AC-04: unit または E2E で task/job progress log query の結果を確認できる
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1: 既存 Event Log UI の再設計は行わない
- 制約2: DB schema は既存 `settings.sqlite` に追加し、新しい DB ファイルは作らない
- 制約3: 既存 runtime/debug DB を壊さない

## 未確定事項
- Q-01: `message_for_user` をどこまで event summary と共通化するかは実装中に最小で判断する

# delta-apply

## 実施内容
- `runtime/settings-store.js` に `task_progress_logs` table と append/list/latest API を追加した
- `electron-main.js` / `electron-preload.js` に progress log IPC / bridge を追加した
- `wireframe/app.js` に progress log append/query helper を追加し、dispatch / worker runtime / to_gate / gate review / resubmit / plan completion から append するよう接続した
- `tests/unit/settings-store.test.js` と `tests/e2e/workspace-layout.spec.js` に最小 verify を追加した
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` を最小同期した

## In Scope 実績
- DS-01: DB schema / repository append/query を追加
- DS-02: Electron bridge を追加
- DS-03: 既存フローから主要 progress event を append する接続を追加

# delta-verify

## 実行結果
- AC-01: PASS
  - `runtime/settings-store.js` に `task_progress_logs` / `appendTaskProgressLogEntry` / `listTaskProgressLogEntries` / `getLatestTaskProgressLogEntry` を追加
- AC-02: PASS
  - `electron-main.js` に `progress-log:append|list|latest`
  - `electron-preload.js` に `TomoshibikanProgressLog`
- AC-03: PASS
  - `dispatch`, `worker_runtime`, `to_gate`, `gate_review`, `resubmit`, `plan_completed` の append code path を `wireframe/app.js` に追加
- AC-04: PASS
  - `node --test tests/unit/settings-store.test.js` PASS
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "task progress log stores dispatch and gate flow entries|job board supports gate flow|guide chat creates planned tasks and assigns workers|worker runtime receives structured handoff payload"` -> 12 passed
- AC-05: PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 所見
- minimal 実装としては DB/repository/bridge/append/query まで閉じた
- Guide が progress log を読んで自然文で途中経過回答する機能は未着手のまま残している
- `docs/plan.md` 全体の既存文字化けは scope 外のまま
- verify result: PASS

# delta-archive

## archive
- PASS
- minimal task-centric progress log を `settings.sqlite` に実装し、既存 Guide/worker/gate フローから主要イベントを記録・query できるようにした
