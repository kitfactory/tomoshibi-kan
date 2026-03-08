# delta-request

## Delta ID
- DR-20260308-orchestrator-routing-llm-impl

## 目的
- Plan artifact からの worker dispatch で、Orchestrator が active Guide の model / `SOUL.md` を借りた LLM-assisted routing を最小実装し、fallback 付きで resident-aware に選定できるようにする。

## 変更対象（In Scope）
- `wireframe/agent-routing.js`
- `wireframe/plan-orchestrator.js`
- `wireframe/app.js`
- `tests/unit/agent-routing.test.js`
- `tests/unit/plan-orchestrator.test.js`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- Gate routing の LLM-assisted 実装
- `reroute / replan_required` の Orchestrator 分岐実装
- resident `ROLE.md / SOUL.md` の再編集
- routing 精度の全面最適化
- UI redesign

## 受入条件（Acceptance Criteria）
- AC-01: worker dispatch の前処理として `RoutingInput` と candidate resident summary を組み立てられる。
- AC-02: Orchestrator は active Guide の runtime を使って routing decision を要求でき、invalid/no-fit 時は既存 rule-based selector へ fallback する。
- AC-03: explicit assignee がある task は LLM-assisted routing を経由せず、その assignee を優先する。
- AC-04: unit test で `RoutingDecision` parse/validate と Orchestrator fallback の両方が確認できる。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-orchestrator-routing-llm-impl

## ステータス
- APPLIED

## 変更ファイル
- wireframe/agent-routing.js
- wireframe/plan-orchestrator.js
- wireframe/app.js
- tests/unit/agent-routing.test.js
- tests/unit/plan-orchestrator.test.js
- docs/plan.md

## 適用内容
- `wireframe/agent-routing.js` に `inferTaskKind`, `buildCandidateResidentSummaries`, `buildWorkerRoutingInput`, `parseRoutingDecisionResponse`, `buildRoutingDecisionResponseFormat` を追加し、resident-aware な routing DTO と response parser を実装した。
- `wireframe/plan-orchestrator.js` を async 化し、`selectWorkerForTaskWithGuideDecision` がある場合は Guide-driven routing を先に試し、失敗時だけ既存 rule-based selector に fallback するようにした。
- `wireframe/app.js` に `buildGuideRoutingOperatingRulesPrompt`, `buildGuideRoutingUserText`, `requestGuideDrivenWorkerRoutingDecision`, `buildPlanOrchestratorRoutingApi` を追加し、active Guide の runtime / `SOUL.md` を使って routing decision を要求できるようにした。
- `materializeApprovedPlanArtifact()` は `PlanOrchestrator.materializePlanArtifact()` を `await` し、Guide-driven routing wrapper を Orchestrator に渡すようにした。
- `tests/unit/agent-routing.test.js` に `RoutingInput` 生成と `RoutingDecision` parse/repair のテストを追加した。
- `tests/unit/plan-orchestrator.test.js` を async 化し、Guide-driven routing が利用可能な時の優先挙動を追加で検証した。
- `docs/plan.md` の current/archive を最小同期した。

# delta-verify

## Delta ID
- DR-20260308-orchestrator-routing-llm-impl

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `buildWorkerRoutingInput()` が taskKind / candidate resident summary / currentLoad を含む `RoutingInput` を組み立てる。 |
| AC-02 | PASS | `requestGuideDrivenWorkerRoutingDecision()` が active Guide runtime を使って routing decision を要求し、invalid/no-fit/low-confidence 時は `null` を返して既存 selector に fallback する。 |
| AC-03 | PASS | `plan-orchestrator.js` は explicit assignee を最優先し、Guide-driven routing を経由しない。 |
| AC-04 | PASS | `tests/unit/agent-routing.test.js` と `tests/unit/plan-orchestrator.test.js` で parser と Orchestrator fallback/guide-routing 優先を検証した。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check wireframe/agent-routing.js`
- `node --check wireframe/plan-orchestrator.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/agent-routing.test.js tests/unit/plan-orchestrator.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|task detail drawer renders conversation log timeline"`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-orchestrator-routing-llm-impl

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- Orchestrator が resident-aware な `RoutingInput` を前処理し、必要時だけ active Guide の runtime / `SOUL.md` を借りて worker routing を判断する最小実装を追加した。
- invalid/no-fit/low-confidence は既存 rule-based selector に fallback するため、dispatch の安全性は維持している。
- Gate routing、`reroute / replan_required` 分岐、routing 精度の最適化にはまだ入っていない。
