# delta-request

## Delta ID
- DR-20260306-guide-plan-parse-gate

## 目的
- Guide 出力を `Plan` schema として parse / validate し、valid Plan の時だけ task 化する。

## 変更対象（In Scope）
- `wireframe/guide-plan.js` を追加し、Guide の plan response parse / validate と output contract を定義する。
- `wireframe/app.js` の Guide 送信経路を、`Plan` parse / validate 成功時だけ task 作成へ進むよう変更する。
- task 作成の入力を raw user request ではなく parsed `Plan.tasks` に切り替える。
- 単体テストと E2E を追加/更新する。
- `docs/plan.md` に seed/archive を反映する。

## 非対象（Out of Scope）
- `GuideConversationUseCase` / `PlanExecutionOrchestrator` の本実装化。
- `wireframe/guide-task-planner.js` の削除。
- Plan approval UI や Plan 永続化の導入。

## 受入条件（Acceptance Criteria）
- AC-01: Guide reply の parse / validate を行う専用 module が追加されている。
- AC-02: Guide reply が `needs_clarification` の場合、Guide 対話は継続し、task は増えない。
- AC-03: Guide reply が valid `plan_ready` の場合、`Plan.tasks` から task が作成される。
- AC-04: 既存の Guide chat 基本フローと Worker handoff 系の targeted verify が PASS する。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

## 制約
- UI の見た目は大きく変えない。
- `planner` を routing helper として残してもよいが、Guide の planning 主体にはしない。

## 未解決
- Q-01: Plan approval / Plan persistence は別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-guide-plan-parse-gate

## 適用ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- wireframe/index.html
- wireframe/app.js
- tests/unit/guide-plan.test.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更: `guide-plan.js` を追加し、Guide の JSON output contract と parse / validate を実装した。
  - 根拠: `parseGuidePlanResponse`, `buildGuidePlanOutputInstruction` を追加。
- AC-02:
  - 変更: `sendGuideMessage()` は `needs_clarification` では task 作成を行わないようにした。
  - 根拠: parsed status を見て task 作成を分岐。
- AC-03:
  - 変更: task 作成の入力を `Plan.tasks` へ切り替え、worker assignment は selector で解決するようにした。
  - 根拠: `createPlannedTasksFromGuidePlan()` を追加。
- AC-04:
  - 変更: unit test と E2E を追加/更新した。
  - 根拠: `tests/unit/guide-plan.test.js`, `workspace-layout.spec.js` の 2 ケース追加。
- AC-05:
  - 変更: `docs/plan.md` に seed/archive を追加した。
  - 根拠: delta link 整合用。

## Out of Scope 逸脱
- Out of Scope 変更の有無: No

## verify 申し送り
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|guide chat keeps dialog open when plan is not ready|guide chat resumes after registering model in settings|worker runtime receives structured handoff payload"`
- `node scripts/validate_delta_links.js --dir .`

# delta-verify

## Delta ID
- DR-20260306-guide-plan-parse-gate

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/guide-plan.js` を追加し parse / validate を実装した。 |
| AC-02 | PASS | `needs_clarification` E2E で task 数が増えないことを確認した。 |
| AC-03 | PASS | `plan_ready` E2E で task が 3 件追加されることを確認した。 |
| AC-04 | PASS | targeted unit/E2E verify が PASS した。 |
| AC-05 | PASS | delta link 検証が PASS した。 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 確認メモ: `guide-task-planner.js` は削除していない。

## 実施コマンド
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|guide chat keeps dialog open when plan is not ready|guide chat resumes after registering model in settings|worker runtime receives structured handoff payload"`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-plan-parse-gate

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: Guide 出力を `Plan` schema として parse / validate し、valid Plan の時だけ task 化する。
- 変更対象:
  - `wireframe/guide-plan.js`
  - `wireframe/index.html`
  - `wireframe/app.js`
  - `tests/unit/guide-plan.test.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/plan.md`
- 非対象:
  - Plan approval / persistence
  - `guide-task-planner.js` 削除

## 検証
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|guide chat keeps dialog open when plan is not ready|guide chat resumes after registering model in settings|worker runtime receives structured handoff payload"`
- `node scripts/validate_delta_links.js --dir .`

## 未解決
- Plan approval / persistence は未実装。

## 次のdeltaへの引き継ぎ
- Seed-01: Guide の actual `Plan` approval / persistence と `approved Plan -> Orchestrator` 開始条件を実装する。
