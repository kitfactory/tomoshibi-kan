# delta-request

## Delta ID
- DR-20260308-orchestrator-dispatch-extraction

## 目的
- `Guide send` ハンドラに残っている task materialization / worker selection / dispatch 相当の責務を、最小の `PlanOrchestrator` モジュールへ抽出する。
- `Guide -> save Plan artifact -> PlanOrchestrator materialize` の形に寄せ、次の replan / routing 改善を Orchestrator 側で進めやすくする。

## 変更対象（In Scope）
- `wireframe/plan-orchestrator.js` の追加
- `wireframe/app.js` の `materializeApprovedPlanArtifact()` 経路
- 必要最小限の unit / E2E / docs(plan/spec/architecture/delta) 同期

## 非対象（Out of Scope）
- full `PlanExecutionOrchestrator` 実装
- replan automation
- routing 精度改善
- Worker / Gate runtime の大規模 redesign
- UI redesign

## 受入条件（Acceptance Criteria）
- AC-01: task materialization と worker selection の主処理が `PlanOrchestrator` モジュールへ移る
- AC-02: `sendGuideMessage()` は保存済み artifact を `PlanOrchestrator` へ渡すだけになり、dispatch ロジックを直接持たない
- AC-03: 既存の Guide plan materialization / progress log / gate flow を壊さず、targeted verify が PASS する
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260308-orchestrator-dispatch-extraction

## ステータス
- APPLIED

## 変更ファイル
- wireframe/plan-orchestrator.js
- wireframe/index.html
- wireframe/app.js
- tests/unit/plan-orchestrator.test.js
- tests/e2e/workspace-layout.spec.js
- docs/architecture.md
- docs/plan.md

## 適用内容
- `wireframe/plan-orchestrator.js` を追加し、保存済み `Plan artifact` から task materialization / worker selection を行う pure module を実装した。
- `materializeApprovedPlanArtifact()` は `PlanOrchestrator.materializePlanArtifact()` を first-class に呼ぶようにし、Guide send フローから routing / task 生成ロジックを分離した。
- `task/job` row に `data-plan-id` を維持し、dispatch / progress log / gate flow の既存挙動はそのまま残した。
- `PlanOrchestrator` の unit test を追加し、artifact -> task 生成の sequence / worker selection / planId 付与を固定した。

# delta-verify

## Delta ID
- DR-20260308-orchestrator-dispatch-extraction

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `PlanOrchestrator.materializePlanArtifact()` を追加し、task materialization / worker selection の主処理を module 側へ移した。unit で artifact -> task 生成を確認した。 |
| AC-02 | PASS | `sendGuideMessage()` は保存済み artifact を `materializeApprovedPlanArtifact()` へ渡すだけで、dispatch 詳細は `PlanOrchestrator` と materialize helper に閉じている。 |
| AC-03 | PASS | `guide chat creates planned tasks and assigns workers`, `task progress log stores dispatch and gate flow entries`, `job board supports gate flow` の targeted E2E が PASS した。 |
| AC-04 | PASS | unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check wireframe/plan-orchestrator.js`
- `node --check wireframe/app.js`
- `node --check tests/unit/plan-orchestrator.test.js`
- `node --test tests/unit/plan-orchestrator.test.js tests/unit/settings-store.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|job board supports gate flow|task progress log stores dispatch and gate flow entries"`
- `node scripts/validate_delta_links.js --dir .`

## 既知事項
- `PlanExecutionOrchestrator` の full module 化は未着手で、worker/gate 実行フロー全体はまだ renderer 内に残っている。
- `materializeApprovedPlanArtifact()` は orchestration entry として残っており、今後の `replan bridge` でさらに整理する。
- routing 精度改善は scope 外で、今回は責務分離だけを行った。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-orchestrator-dispatch-extraction

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- 保存済み `Plan artifact` を起点に task materialization / worker selection を行う `PlanOrchestrator` module を追加した。
- Guide send フローは planning と artifact 保存に寄り、dispatch 相当の責務を一段外へ押し出した。
- 既存の progress log / gate flow / task materialization は回帰なく維持できている。
