# delta-request

## Delta ID
- DR-20260308-guide-cron-and-project-onboarding

## Delta Type
- FEATURE

## 目的
- 管理人が定期実行・イベント起点の継続作業を `jobs` として plan に含め、新規 project 前提かつ project context 未設定時は Project タブでの設定へ誘導する。

## 変更対象（In Scope）
- `wireframe/guide-plan.js`
- `wireframe/plan-orchestrator.js`
- `wireframe/app.js`
- `wireframe/context-builder.js`
- `tests/unit/guide-plan.test.js`
- `tests/unit/plan-orchestrator.test.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- Cron scheduler の新機能追加
- 外部イベント連携
- Project タブの大幅 redesign
- resident SOUL/ROLE の再編集

## 受入条件（Acceptance Criteria）
- AC-01: Guide が定期実行・イベント起点の依頼を受けた時、`plan_ready` の `plan.jobs[]` を返せる
- AC-02: `jobs` を含む approved `Plan artifact` は Cron Board へ materialize される
- AC-03: project 未設定の新規 project 前提依頼では、Guide が Project タブ設定を促し、task/job を開始しない
- AC-04: 既存の task-only plan は回帰しない
- AC-05: static / targeted unit / targeted E2E / validator が PASS する

## 制約
- project onboarding guard は model 呼び出し前に評価する
- 既存の task progress log / routing / gate flow は変更しない

## Review Gate
- required: No
- reason: Guide の plan schema、Cron materialize、Project onboarding guard の局所拡張であり、大規模な層再編を含まない

## 未確定事項
- なし

# delta-apply

## 実装方針
- `GuidePlan` を `tasks + jobs` へ拡張し、job-only plan も valid として扱う
- `PlanOrchestrator` が task と job を両方 materialize できるようにする
- Guide の new project intent を local guard で検知し、Project タブへ誘導する

## 実装内容
- `GuidePlan` の schema / parser / few-shot を `tasks + jobs` へ拡張
- `PlanOrchestrator.materializePlanArtifact()` を task と job の両方へ対応
- `sendGuideMessage()` に project onboarding guard を追加
- Guide `OPERATING_RULES` に recurring / event-driven work と project onboarding 条件を追加

# delta-verify

## Verify Profile
- static check: `node --check wireframe\guide-plan.js wireframe\plan-orchestrator.js wireframe\app.js wireframe\context-builder.js tests\unit\guide-plan.test.js tests\unit\plan-orchestrator.test.js tests\e2e\workspace-layout.spec.js`
- targeted unit: `node --test tests\unit\guide-plan.test.js tests\unit\plan-orchestrator.test.js tests\unit\context-builder.test.js`
- targeted integration / E2E: `npx playwright test tests/e2e/workspace-layout.spec.js --grep "guide chat can materialize cron jobs from approved plan|guide prompts project setup before starting a new project request|guide chat creates planned tasks and assigns workers|job board supports gate flow"`
- project-validator: `node scripts\validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `parseGuidePlanResponse` が `jobs` を含む `plan_ready` と job-only plan を受理する unit を追加し PASS した |
| AC-02 | PASS | `PlanOrchestrator materializes cron jobs from approved plan artifact` unit と `guide chat can materialize cron jobs from approved plan` E2E が PASS した |
| AC-03 | PASS | `guide prompts project setup before starting a new project request` E2E が PASS し、Guide reply と Project タブ遷移を確認した |
| AC-04 | PASS | `guide chat creates planned tasks and assigns workers` と `job board supports gate flow` の既存 E2E が回帰なしで PASS した |
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
- DR-20260308-guide-cron-and-project-onboarding

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的: Guide が recurring / event-driven work を `jobs` として plan に含め、新規 project 前提では Project タブ設定へ誘導する
- 変更対象: `wireframe/guide-plan.js`、`wireframe/plan-orchestrator.js`、`wireframe/app.js`、`wireframe/context-builder.js`、関連 test、`docs/spec.md`、`docs/architecture.md`、`docs/plan.md`、本 delta 記録
- 非対象: Cron scheduler 新機能、外部イベント連携、Project タブ redesign、resident SOUL/ROLE 再編集

## 実装記録
- 変更ファイル:
  - `wireframe/guide-plan.js`
  - `wireframe/plan-orchestrator.js`
  - `wireframe/app.js`
  - `wireframe/context-builder.js`
  - `tests/unit/guide-plan.test.js`
  - `tests/unit/plan-orchestrator.test.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
  - `docs/delta/DR-20260308-guide-cron-and-project-onboarding.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS
  - AC-05 PASS

## 検証記録
- verify要約: Guide の plan schema を `tasks + jobs` へ拡張し、approved plan artifact から Cron Board materialize と Project onboarding guard の両方を確認した
- 主要な根拠:
  - static check PASS
  - targeted unit PASS
  - targeted Playwright 12件 PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- なし
