# delta-request

## Delta ID
- DR-20260307-replan-required-progress-log

## 目的
- Gate reject のうち再計画が必要なケースを `replan_required` として progress log に残し、Guide progress query から説明できるようにする。
- 実際の再プラン生成には入らず、まずは reject reason からの minimal 分岐だけを閉じる。

## 変更対象（In Scope）
- 対象1: `wireframe/app.js` の Gate reject branch に `replan_required` 判定と progress log append を追加
- 対象2: `wireframe/app.js` の Guide progress query reply に `replan_required` 説明を追加
- 対象3: `tests/e2e/workspace-layout.spec.js` の minimal E2E 追加
- 対象4: `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` の最小同期

## 非対象（Out of Scope）
- 非対象1: 実際の再プラン生成
- 非対象2: `PlanExecutionOrchestrator` のモジュール抽出
- 非対象3: reroute / retry policy の拡張
- 非対象4: task progress log UI の新設
- 非対象5: `docs/plan.md` 全体の文字化け修復
- 非対象6: ユーザー未追跡ファイル `docs/tomoshibikan_resident_set_v0_1.md`

## 差分仕様
- DS-01:
  - Given: Gate reject reason が進め方・前提・要件・スコープの見直しを示す
  - When: `runGate("reject")` が進行する
  - Then: latest progress log に `actionType=replan_required` が追加される
- DS-02:
  - Given: latest progress log が `replan_required`
  - When: ユーザーが `TASK-xxx はどうなった？` と尋ねる
  - Then: Guide progress query は「再計画が必要で、進め方や前提を見直している」と説明する
- DS-03:
  - Given: 既存 approve/reject flow
  - When: `replan_required` 分岐を追加する
  - Then: 既存の gate review / resubmit / approve flow は維持される

## 受入条件（Acceptance Criteria）
- AC-01: Gate reject reason に再計画を示す語が含まれると、latest progress log entry が `actionType=replan_required` になる
- AC-02: `TASK-xxx はどうなった？` の Guide progress query が、`再計画` / `見直し` を含む説明を返す
- AC-03: 既存の reject / approve flow を壊さない
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1: board status 自体には新しい state を追加せず、latest progress entry の解釈で対応する
- 制約2: `replan_required` 判定は keyword-based の minimal 実装に留める
- 制約3: UI redesign や Orchestrator 実体化は行わない

## 未確定事項
- Q-01: `replan_required` の keyword 群は今後 failure log を見ながら調整する

# delta-apply

## 実施内容
- `wireframe/app.js` に `shouldRequireReplanFromGateResult()` を追加し、Gate reject reason / fixes から keyword-based に `replan_required` を判定するようにした
- `runGate("reject")` の reject branch で、再計画が必要な時は `actualActor=orchestrator`, `displayActor=Guide`, `actionType=replan_required`, `status=blocked` の progress log entry を追加するようにした
- `buildGuideProgressQueryReply()` に `replan_required` の自然文説明を追加した
- `tests/e2e/workspace-layout.spec.js` に Gate reject 後の `replan_required` と Guide progress query を確認する minimal E2E を追加した
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` を最小同期した

## In Scope 実績
- DS-01: Gate reject reason から `replan_required` を progress log へ追加する分岐を実装
- DS-02: Guide progress query が latest `replan_required` を自然文で説明する経路を追加
- DS-03: 既存 gate approve/reject flow を維持したまま追加

# delta-verify

## 実行結果
- AC-01: PASS
  - Gate reject reason に `再計画` / `進め方` / `前提` などが含まれる時に `replan_required` entry が追加される
- AC-02: PASS
  - `guide progress query explains replan required after gate reject` E2E で `再計画が必要` / `進め方と前提を見直す` を確認
- AC-03: PASS
  - `job board supports gate flow` と `task progress log stores dispatch and gate flow entries` を回して既存 flow 回帰なしを確認
- AC-04: PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 所見
- minimal 実装としては `runGate` reject branch のみで `replan_required` を扱い、Guide progress query から説明できる状態で閉じた
- 実際の再プラン生成や reroute policy は未着手のまま残している
- verify result: PASS

# delta-archive

## archive
- PASS
- Gate reject reason から `replan_required` を progress log へ追加し、Guide progress query が再計画待ちを自然文で説明できるようにした
