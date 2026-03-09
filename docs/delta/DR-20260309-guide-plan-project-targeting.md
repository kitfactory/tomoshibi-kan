# delta-request

## Delta ID
- DR-20260309-guide-plan-project-targeting

## Delta Type
- FEATURE

## 目的
- 管理人が `plan_ready` を返す時、どの project / folder に対する依頼かを必ず含め、Plan artifact と materialized task/job に target project を通す。

## 変更対象（In Scope）
- `wireframe/guide-plan.js`
- `wireframe/app.js`
- `wireframe/plan-orchestrator.js`
- `wireframe/context-builder.js`
- `runtime/agent-identity-store.js`
- `wireframe/debug-identity-seeds.js`
- `tests/unit/guide-plan.test.js`
- `tests/unit/plan-orchestrator.test.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- 複数 project への同時 dispatch
- Project タブ UI の redesign
- resident routing 精度改善
- 既存 task/job 一覧の大規模移行

## 受入条件（Acceptance Criteria）
- AC-01: `plan_ready` の `plan` は `project.id`, `project.name`, `project.directory` を必須で持つ
- AC-02: focused project がある通常依頼では、その project を既定値として `plan.project` に反映できる
- AC-03: target project が無い work request は Project タブ設定へ誘導し、task/job を materialize しない
- AC-04: `Plan artifact` と materialized task/job record は `projectId / projectName / projectDirectory` を保持する
- AC-05: static / targeted unit / targeted E2E / validator が PASS する

## 制約
- `new project` 意図の guard と、通常 work request で focused project が無い guard を分けて扱う
- `plan.project` は parser / few-shot / fallback instruction / materialize の全経路で整合させる

## Review Gate
- required: No
- reason: Guide planning schema と project onboarding guard の局所拡張であり、大規模な層再編は含まない

## 未確定事項
- なし

# delta-apply

## 実装方針
- `GuidePlan` の schema / parser / few-shot に `plan.project` を追加する
- focused project がある時は parser recovery でも `plan.project` を補完する
- work request では focused project を既定利用し、target project が無い時だけ Project タブへ誘導する

## 実装内容
- `normalizeGuidePlan()` に `project` 解決を追加し、`plan_ready` には `plan.project` を必須化した
- `buildGuidePlanResponseFormat()` と Guide fallback output instruction を `project + tasks + jobs` schema へ更新した
- `sendGuideMessage()` と Guide-driven replan で `projectContext` を parser に渡すようにした
- `PlanOrchestrator` と record builder が `projectId / projectName / projectDirectory` を task/job に引き継ぐようにした
- Guide の `OPERATING_RULES` / built-in seed / default template に「どの project / folder の依頼かを先に明確にする」条件を追加した
- onboarding guard を `new project intent` と `focused project 不在の work request` で分けた

# delta-verify

## Verify Profile
- static check: `node --check wireframe/guide-plan.js wireframe/app.js wireframe/plan-orchestrator.js wireframe/context-builder.js runtime/agent-identity-store.js wireframe/debug-identity-seeds.js tests/unit/guide-plan.test.js tests/unit/plan-orchestrator.test.js tests/e2e/workspace-layout.spec.js`
- targeted unit: `node --test tests/unit/guide-plan.test.js tests/unit/plan-orchestrator.test.js tests/unit/debug-identity-seeds.test.js tests/unit/agent-identity-store.test.js`
- targeted integration / E2E: `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|guide chat can materialize cron jobs from approved plan|guide prompts project setup before starting a new project request|guide prompts project setup before planning when no project is focused"`
- project-validator: `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `GuidePlan` schema / parser test が `plan.project` 必須と recovery を検証し PASS した |
| AC-02 | PASS | focused project を持つ `guide chat creates planned tasks and assigns workers` E2E で `latestPlan.plan.project.id` を確認した |
| AC-03 | PASS | `guide prompts project setup before starting a new project request` と `guide prompts project setup before planning when no project is focused` E2E が PASS した |
| AC-04 | PASS | `PlanOrchestrator` unit で task/job record へ `projectId` を引き継ぐことを確認した |
| AC-05 | PASS | static / targeted unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` がすべて PASS した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- なし

## Review Gate
- required: No
- checklist: `docs/delta/REVIEW_CHECKLIST.md`
- layer integrity: NOT CHECKED
- docs sync: PASS
- data size: NOT CHECKED
- code split health: PASS
- file-size threshold: PASS

## Review Delta Outcome
- pass: Yes
- follow-up delta seeds:

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260309-guide-plan-project-targeting

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的: Guide の `plan_ready` に target project を必須化し、Plan artifact と task/job materialize に project 指定を通す
- 変更対象: `wireframe/guide-plan.js`、`wireframe/app.js`、`wireframe/plan-orchestrator.js`、`wireframe/context-builder.js`、`runtime/agent-identity-store.js`、`wireframe/debug-identity-seeds.js`、関連 test、`docs/spec.md`、`docs/architecture.md`、`docs/plan.md`、本 delta 記録
- 非対象: 複数 project dispatch、Project タブ redesign、routing 精度改善、既存 task/job の大規模移行

## 実装記録
- 変更ファイル:
  - `wireframe/guide-plan.js`
  - `wireframe/app.js`
  - `wireframe/plan-orchestrator.js`
  - `wireframe/context-builder.js`
  - `runtime/agent-identity-store.js`
  - `wireframe/debug-identity-seeds.js`
  - `tests/unit/guide-plan.test.js`
  - `tests/unit/plan-orchestrator.test.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
  - `docs/delta/DR-20260309-guide-plan-project-targeting.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS
  - AC-05 PASS

## 検証記録
- verify要約: `plan.project` の schema / recovery / materialize を揃え、focused project ありの通常依頼と no-project onboarding guard の両方を確認した
- 主要な根拠:
  - static check PASS
  - targeted unit PASS
  - targeted Playwright 12件 PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- なし
