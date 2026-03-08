# delta-request

## Delta ID
- DR-20260308-orchestrator-reroute-bridge

## 目的
- Guide-driven routing が `fallbackAction="reroute"` を返した時、Orchestrator が selected resident へ付け替えて dispatch し、その判断を progress log と task detail conversation log で追えるようにする。

## 変更対象（In Scope）
- `wireframe/agent-routing.js`
- `wireframe/plan-orchestrator.js`
- `wireframe/app.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- worker runtime 失敗後の reroute
- Gate reroute の実装
- routing 精度の最適化
- board layout redesign
- resident `SOUL.md / ROLE.md` の編集

## 受入条件（Acceptance Criteria）
- AC-01: Guide-driven routing が `reroute` を返した時、Orchestrator は selected resident を採用して task を materialize できる。
- AC-02: `reroute` が発生した task には `reroute` progress log が残り、その後の `dispatch` に連続して現れる。
- AC-03: task detail conversation log で `reroute -> dispatch` の流れを読める。
- AC-04: targeted E2E で `reroute` decision による resident 付け替えと progress log を確認できる。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

## delta-apply
- `requestGuideDrivenWorkerRoutingDecision()` が `fallbackAction=reroute` の `RoutingDecision` を保持したまま Orchestrator へ返すようにした。
- `PlanOrchestrator` は Guide-driven routing 前の baseline resident を保持し、`reroute` が返った時は `rerouteFromWorkerId` を explanation に付与するようにした。
- `materializeApprovedPlanArtifact()` は `reroute` を受けた task に対し、dispatch 前に `reroute` progress log を追加するようにした。
- task detail conversation log に `reroute` ラベルを追加した。
- targeted E2E を追加し、Guide-driven routing が `reroute` を返した時に resident 付け替えと `reroute -> dispatch` を確認できるようにした。

## delta-verify
- `node --check wireframe/app.js` PASS
- `node --check wireframe/plan-orchestrator.js` PASS
- `node --check tests/e2e/workspace-layout.spec.js` PASS
- `node --test tests/unit/plan-orchestrator.test.js tests/unit/agent-routing.test.js` PASS
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide-driven reroute keeps dispatch but records reroute progress|task detail drawer renders conversation log timeline|guide chat creates planned tasks and assigns workers"` PASS
- `node scripts/validate_delta_links.js --dir .` PASS

## delta-archive
- PASS。Guide-driven worker dispatch に `reroute` bridge を追加し、conversation log と progress log で resident の付け替えを追える状態にした。
