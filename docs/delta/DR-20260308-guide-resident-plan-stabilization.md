# delta-request

## Delta ID
- DR-20260308-guide-resident-plan-stabilization

## 目的
- Guide の `plan_ready` 出力を resident set (`調べる人 / 作り手 / 書く人`) に揃え、real-model でも 3 task materialization に届きやすくする。

## 変更対象（In Scope）
- `wireframe/guide-plan.js`
- `wireframe/guide-planning-intent.js`
- `wireframe/app.js`
- `wireframe/context-builder.js`
- `tests/unit/guide-plan.test.js`
- `tests/unit/guide-planning-intent.test.js`
- `tests/unit/context-builder.test.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- routing scorer の変更
- Orchestrator dispatch / reroute / replan 実装の変更
- resident `SOUL.md / ROLE.md` の編集
- E2E の大規模追加
- task detail UI の改修

## 受入条件（Acceptance Criteria）
- AC-01: `GuidePlan` few-shot と recovery が `調べる人 / 作り手 / 書く人` の 3 task を正として扱う。
- AC-02: planning assist / `OPERATING_RULES` が resident set 前提の breakdown を誘導する。
- AC-03: unit test で resident set 3 task recovery と prompt 更新を固定する。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

## delta-apply
- `GuidePlan` の few-shot、assist、`OPERATING_RULES` を resident trio (`調べる人 / 作り手 / 書く人`) 基準へ更新した。
- parser recovery を強化し、resident trio の explicit breakdown がある `plan_ready` で task 配列が不足・破損・誤 assignee を含む時は、resident trio の 3 task へ回復するようにした。
- unit test を resident trio の部分回復ケースまで更新した。
- spec / architecture の古い `Trace / Fix / Verify` 記述を resident trio 基準へ同期した。

## delta-verify
- AC-01: PASS
  - `buildGuidePlanFewShotExamples()` と `recoverGuidePlanTasks()` が resident trio を正として扱う。
  - `parseGuidePlanResponse()` の unit test で、`調べる人 / 作り手 / 書く人` の部分破損 plan から 3 task へ回復できることを確認した。
- AC-02: PASS
  - `GuidePlanningIntent` と `Guide` の `OPERATING_RULES` は resident trio の breakdown を planning trigger / readiness assist として扱う。
- AC-03: PASS
  - `node --test tests/unit/guide-plan.test.js tests/unit/guide-planning-intent.test.js tests/unit/context-builder.test.js`
  - PASS
- AC-04: PASS
  - `node scripts/validate_delta_links.js --dir .`
  - PASS

### real-model observation
- assist ON の temp workspace 観測:
  - workspace: `C:\\Users\\kitad\\AppData\\Local\\Temp\\tomoshibi-kan-routing-observe-YW6tRn`
  - prompt: resident trio の 3 task 作成を明示
  - result:
    - `guide_reply=...調べる人・作り手・書く人の3タスクに分けて進めます。`
    - `task_count=3->6`
    - materialized tasks:
      - `TASK-004 -> pal-alpha -> 調べる人`
      - `TASK-005 -> pal-beta -> 作り手`
      - `TASK-006 -> pal-delta -> 書く人`
- 結論:
  - resident trio の 3 task materialization は real-model でも到達した。
  - 現在の主要ボトルネックは resident trio recovery ではなく、assist OFF での `plan_ready` 到達率である。

## delta-archive
- archive status: PASS
- Guide resident plan stabilization delta を archive する。
