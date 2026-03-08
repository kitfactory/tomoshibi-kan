# delta-request

## Delta ID
- DR-20260308-routing-precision-role-first

## 目的
- resident の主担当 (`調べる人 / 作り手 / 書く人`) を routing 前処理へ明示し、fallback scorer と Guide-driven routing input を role-first に寄せて worker dispatch の精度を改善する。

## 変更対象（In Scope）
- `wireframe/agent-routing.js`
- `tests/unit/agent-routing.test.js`
- `tests/unit/plan-orchestrator.test.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- resident `SOUL.md / ROLE.md` の編集
- Gate routing 精度改善
- reroute / replan bridge の追加変更
- board UI redesign
- real-model autonomous check の再設計

## 受入条件（Acceptance Criteria）
- AC-01: worker 候補 summary に resident の主担当 function (`research|make|write`) を含められる。
- AC-02: deterministic fallback scorer が taskKind と resident function の一致を skill/role 語彙と並ぶ主要判断材料として使う。
- AC-03: Guide-driven routing input が resident function を candidate resident summary に含む。
- AC-04: unit test で `research -> 調べる人`, `make -> 作り手`, `write -> 書く人` の role-first bias を確認できる。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

## delta-apply
- `AgentRouting.inferResidentFunction()` を追加し、resident 候補を `research | make | write | general` に正規化するようにした。
- `buildCandidateResidentSummaries()` と `buildWorkerRoutingInput()` が `residentFunction` を含む candidate resident summary を返すようにした。
- `scoreWorkerCandidate()` と `selectWorkerForTask()` に role-first bias を追加し、`taskKind` と `residentFunction` の一致へ強い重みを与えるようにした。
- routing explanation に `function=...` を含められるようにした。
- unit test に `research -> 調べる人`, `make -> 作り手`, `write -> 書く人` の bias を追加した。

## delta-verify
- `node --check wireframe/agent-routing.js` PASS
- `node --check wireframe/app.js` PASS
- `node --check wireframe/plan-orchestrator.js` PASS
- `node --test tests/unit/agent-routing.test.js tests/unit/plan-orchestrator.test.js` PASS
- `node scripts/validate_delta_links.js --dir .` PASS

## delta-archive
- PASS。resident の主担当 function と `taskKind` を routing 前処理と fallback scorer に反映し、role-first の精度改善を入れた。
