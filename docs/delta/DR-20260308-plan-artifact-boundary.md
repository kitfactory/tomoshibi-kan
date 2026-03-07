# delta-request

## Delta ID
- DR-20260308-plan-artifact-boundary

## 目的
- `Guide` が valid な `Plan` を返した時、まず `persistent Plan artifact` を作成して保存し、task materialization / dispatch をまだ開始しない境界へ寄せる。
- 現在の `Guide send -> そのまま task 化` を分離し、次の `PlanExecutionOrchestrator` 抽出に備える。

## 変更対象（In Scope）
- `wireframe/app.js` の Guide `plan_ready` 後フロー
- Plan artifact の minimal repository / persistence（既存 SQLite か local state の最小追加）
- Guide progress / UI が latest approved plan を参照できる最小 state
- 必要最小限の unit / E2E / docs(plan/spec/architecture/delta) 同期

## 非対象（Out of Scope）
- Worker / Gate 実行フローの全面 redesign
- full `PlanExecutionOrchestrator` 実装
- replan automation
- routing 精度改善
- UI redesign

## 受入条件（Acceptance Criteria）
- AC-01: valid `plan_ready` を受けた時、task materialization 前に Plan artifact が作成・保存される
- AC-02: `GuideConversationUseCase` 相当の send フローは raw user request から直接 dispatch せず、保存済み Plan artifact を経由する
- AC-03: 既存の Guide progress / task flow を壊さず、targeted verify が PASS する
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260308-plan-artifact-boundary

## ステータス
- APPLIED

## 変更ファイル
- runtime/settings-store.js
- electron-main.js
- electron-preload.js
- wireframe/app.js
- tests/unit/settings-store.test.js
- tests/e2e/workspace-layout.spec.js
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- `settings.sqlite` に `plan_artifacts` table を追加し、`append/list/latest` repository を実装した。
- Electron main / preload に `plan-artifact:*` IPC と `TomoshibikanPlanArtifacts` bridge を追加した。
- renderer に plan artifact fallback store を追加し、Guide の `plan_ready` 分岐を `artifact 保存 -> artifact 経由 materialize` へ切り替えた。
- task/job row に `data-plan-id` を追加し、progress log も target の `planId` を引き継ぐようにした。
- Guide task materialization E2E は、artifact 保存と task row への `planId` 反映を確認するよう更新した。

# delta-verify

## Delta ID
- DR-20260308-plan-artifact-boundary

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `SqliteSettingsStore.appendPlanArtifact()` unit と `guide chat creates planned tasks and assigns workers` E2E で、task materialization 前に approved plan artifact が保存されることを確認した。 |
| AC-02 | PASS | `sendGuideMessage()` は raw plan を直接 `createPlannedTasksFromGuidePlan()` に渡さず、`appendPlanArtifactWithFallback()` の戻り値を `materializeApprovedPlanArtifact()` へ渡す形に変更した。 |
| AC-03 | PASS | task progress log / guide progress query / gate flow の targeted E2E が PASS し、既存 progress/task flow を壊していない。 |
| AC-04 | PASS | targeted unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check runtime/settings-store.js`
- `node --check electron-main.js`
- `node --check electron-preload.js`
- `node --check wireframe/app.js`
- `node --check tests/unit/settings-store.test.js`
- `node --check tests/e2e/workspace-layout.spec.js`
- `node --test tests/unit/settings-store.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|task progress log stores dispatch and gate flow entries|guide progress query reports completed task without model call|job board supports gate flow"`
- `node scripts/validate_delta_links.js --dir .`

## 既知事項
- この delta では `approved` status の artifact を即 dispatch しており、approval UI はまだ持たない。
- `PlanExecutionOrchestrator` の独立モジュール抽出はまだ未着手で、materialize 自体は renderer 内に残っている。
- routing 精度改善は scope 外であり、保存境界の導入だけを先に行っている。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-plan-artifact-boundary

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- valid `plan_ready` はまず persistent な `Plan artifact` として保存されるようになった。
- Guide send フローは raw request / raw plan から直接 dispatch せず、保存済み artifact を経由して task materialization を開始するようになった。
- `planId` は task row と progress log に引き継がれ、次の Orchestrator 抽出で artifact 起点を辿れる境界ができた。
