# delta-request

## Delta ID
- DR-20260308-resident-proper-name-rollout

## Delta Type
- FEATURE

## 目的
- built-in 住人の表示名を固有名へ切り替え、Guide prompt / few-shot / parser recovery / task wording を proper-name 前提に更新する。

## 変更対象（In Scope）
- 対象1:
  - `wireframe/app.js`
- 対象2:
  - `wireframe/context-builder.js`
- 対象3:
  - `wireframe/guide-planning-intent.js`
- 対象4:
  - `wireframe/guide-plan.js`
- 対象5:
  - `wireframe/debug-identity-seeds.js`
- 対象6:
  - `tests/unit/guide-plan.test.js`
- 対象7:
  - `tests/unit/context-builder.test.js`
- 対象8:
  - `tests/unit/guide-planning-intent.test.js`
- 対象9:
  - `tests/unit/debug-identity-seeds.test.js`
- 対象10:
  - `tests/unit/agent-routing.test.js`
- 対象11:
  - `tests/e2e/workspace-layout.spec.js`
- 対象12:
  - `docs/concept.md`
- 対象13:
  - `docs/spec.md`
- 対象14:
  - `docs/architecture.md`
- 対象15:
  - `docs/plan.md`
- 対象16:
  - 本 delta 記録

## 非対象（Out of Scope）
- 非対象1:
  - resident の人数変更
- 非対象2:
  - Orchestrator routing ロジック変更
- 非対象3:
  - task detail conversation UI の追加 redesign

## 差分仕様
- DS-01:
  - Given:
    - built-in 住人の表示名が役割名に寄っている
  - When:
    - built-in metadata と identity seed を更新する
  - Then:
    - displayName は `燈子さん / 槙原 / 冬坂 / 久瀬 / 白峰` になる
- DS-02:
  - Given:
    - Guide prompt / few-shot / parser recovery が旧 resident 名 (`調べる人 / 作り手 / 書く人`) に依存している
  - When:
    - proper-name 前提へ更新する
  - Then:
    - Guide は proper name を使って resident を指し、旧 resident 名は互換検出だけに残る
- DS-03:
  - Given:
    - task title が resident 名そのものになりやすい
  - When:
    - recovery と few-shot の task wording を更新する
  - Then:
    - task title は依頼内容を表し、assignee は resident id / proper name で分離される

## 受入条件（Acceptance Criteria）
- AC-01:
  - built-in resident の displayName が `燈子さん / 槙原 / 冬坂 / 久瀬 / 白峰` に更新されている
- AC-02:
  - Guide の `OPERATING_RULES` / few-shot / readiness assist が proper-name 前提になっている
- AC-03:
  - `GuidePlan` recovery は resident role 名ではなく、具体的な task title を返す
- AC-04:
  - Settings の built-in 同期 E2E が proper name 期待へ更新され、PASS する
- AC-05:
  - `run_guide_autonomous_check.js` と `run_orchestrator_three_task_cycle_check.js` が PASS する
- AC-06:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - user-facing assignee は固有名で表す
- 制約2:
  - 住人の職業設定は `ROLE.md` に残す
- 制約3:
  - 旧 resident 名は互換検出以外の user-facing 文面に残さない

## Review Gate
- required: No
- reason:
  - built-in naming と Guide wording の機能差分だが、大きな destructive 変更ではない

# delta-apply

## Delta ID
- DR-20260308-resident-proper-name-rollout

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 実施内容
- built-in resident の display name を `燈子さん / 槙原 / 冬坂 / 久瀬 / 白峰` に更新した
- Guide の `OPERATING_RULES` / few-shot / readiness assist / parser recovery を proper-name 前提へ更新した
- task wording を resident 名そのものではなく、具体的な依頼内容へ更新した
- default runner prompt も `冬坂 / 久瀬 / 白峰` 前提へ同期した

# delta-verify

## Delta ID
- DR-20260308-resident-proper-name-rollout

## Verify Profile
- static:
  - `node --check wireframe/app.js wireframe/context-builder.js wireframe/guide-planning-intent.js wireframe/guide-plan.js wireframe/debug-identity-seeds.js tests/e2e/workspace-layout.spec.js scripts/run_guide_autonomous_check.js scripts/run_orchestrator_three_task_cycle_check.js`
- unit:
  - `node --test tests/unit/guide-plan.test.js tests/unit/context-builder.test.js tests/unit/guide-planning-intent.test.js tests/unit/debug-identity-seeds.test.js tests/unit/agent-routing.test.js tests/unit/plan-orchestrator.test.js`
- targeted-e2e:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings can sync built-in resident definitions to workspace|guide chat creates planned tasks and assigns workers|task detail drawer renders conversation log timeline|task detail conversation log applies progress voice per actor"`
- real-model:
  - `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 240000`
  - `node scripts/run_orchestrator_three_task_cycle_check.js`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | built-in resident の displayName が `燈子さん / 槙原 / 冬坂 / 久瀬 / 白峰` に更新され、Settings sync E2E でも同じ並びを確認した。 |
| AC-02 | PASS | Guide の `OPERATING_RULES` / few-shot / readiness assist が proper-name 前提になり、旧 resident 名は互換検出だけに残した。 |
| AC-03 | PASS | `GuidePlan` recovery と few-shot の task title は `保存結果が reload 後に消える原因と再現条件を調査する` などの具体的な依頼内容になった。 |
| AC-04 | PASS | `settings can sync built-in resident definitions to workspace` を含む targeted Playwright が PASS した。 |
| AC-05 | PASS | `run_guide_autonomous_check.js` は 5 turn で task materialization へ到達し、`run_orchestrator_three_task_cycle_check.js` は 3 task 全部を `done` まで通した。 |
| AC-06 | PASS | `node scripts/validate_delta_links.js --dir .` は `errors=0, warnings=0` で PASS した。 |

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-resident-proper-name-rollout

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- built-in resident の user-facing assignee は proper name (`燈子さん / 槙原 / 冬坂 / 久瀬 / 白峰`) に統一した
- resident の職業設定は `ROLE.md` に残し、Guide wording と assignee 表示には混ぜない
- Guide planning / parser recovery / runner prompt は proper-name 前提に同期し、dispatch 実動も維持した
