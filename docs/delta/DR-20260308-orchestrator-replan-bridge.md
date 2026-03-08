# delta-request

## Delta ID
- DR-20260308-orchestrator-replan-bridge

## 目的
- Gate reject が `replan_required` を示した時、Orchestrator が active Guide の runtime / `SOUL.md` を使って新しい Plan を作り、old task を履歴として残したまま new task へ橋渡しする最小実装を追加する。

## 変更対象（In Scope）
- `wireframe/app.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/concept.md`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- worker reroute の実装
- Gate routing の見直し
- task row / board layout redesign
- resident `SOUL.md / ROLE.md` の再編集
- replan 精度の最適化

## 受入条件（Acceptance Criteria）
- AC-01: Gate reject が `replan_required` を示す場合、old task/job に `replan_required` を残した後で Guide-driven replan を試行できる。
- AC-02: valid な新 Plan が返った場合、新しい Plan artifact が保存され、new task dispatch まで進む。
- AC-03: old target には `replanned` progress log が残り、Guide progress query で再計画済みであることを返せる。
- AC-04: targeted E2E で `replan_required -> replanned` と new task materialization を確認できる。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

## delta-apply
- `buildGuideReplanUserText()` と `executeGuideDrivenReplanForTarget()` を追加し、Gate reject 後に active Guide runtime を使って replan request を生成できるようにした。
- valid な `plan_ready` が返った時だけ `plan_artifacts` に new Plan を保存し、`materializeApprovedPlanArtifact()` で new task を作成するようにした。
- old target には `replanned` progress log を残し、Guide progress query が `replanned` を自然文で返せるようにした。
- `runGate()` から `requiresReplan` の場合に resubmit へ進まず、Guide-driven replan bridge を起動するようにした。
- E2E に `gate replan bridge creates new tasks and updates progress query` を追加した。

## delta-verify
- `node --check wireframe/app.js` PASS
- `node --check tests/e2e/workspace-layout.spec.js` PASS
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide progress query explains replan required after gate reject|gate replan bridge creates new tasks and updates progress query|job board supports gate flow"` PASS
- `node scripts/validate_delta_links.js --dir .` PASS

## delta-archive

## Delta ID
- DR-20260308-orchestrator-replan-bridge

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的: `replan_required -> replanned -> new task dispatch` の最小橋渡しを追加した
- 変更対象: `wireframe/app.js`、`tests/e2e/workspace-layout.spec.js`、`docs/concept.md`、`docs/spec.md`、`docs/architecture.md`、`docs/plan.md`、当該 delta 記録
- 非対象: worker reroute、Gate routing 見直し、board layout redesign、resident identity 再編集、replan 精度最適化

## 実装記録
- 変更ファイル:
  - `wireframe/app.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/concept.md`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
  - `docs/delta/DR-20260308-orchestrator-replan-bridge.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS
  - AC-05 PASS

## 検証記録
- verify要約: `replan_required -> replanned -> new task materialization` の橋渡しが E2E と validator で確認された
- 主要な根拠:
  - `node --check wireframe/app.js` PASS
  - `node --check tests/e2e/workspace-layout.spec.js` PASS
  - Playwright targeted PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- なし

## 次のdeltaへの引き継ぎ（任意）
- なし
