# delta-request

## Delta ID
- DR-20260306-agent-routing-selector-impl

## 目的
- `WorkerRoutingSelector / GateRoutingSelector` を prototype 実装し、Worker assignment と Gate selection を identity-aware routing へ切り替える。

## 変更対象範囲 (In Scope)
- `wireframe/agent-routing.js` を追加し、Worker/Gate selector の pure function を実装する。
- `wireframe/guide-task-planner.js` の worker assignment を selector ベースへ切り替える。
- `wireframe/app.js` の gate selection を selector ベースへ切り替える。
- `wireframe/index.html` に selector script を読み込む。
- unit / E2E 回帰を追加または更新する。
- `docs/architecture.md` と `docs/plan.md` に最小同期を行う。

## 変更対象外 (Out of Scope)
- routing explanation の audit/event 永続化。
- Guide 自体の plan 生成改善。
- target 別 gate override UI。

## 受入条件
- DS-01:
  - Given: Worker candidates に `enabled skills` 差分がある
  - When: task assignment を行う
  - Then: matched skills を持つ Worker が優先される。
- DS-02:
  - Given: Gate candidates に `RUBRIC.md` 差分がある
  - When: Gate selection を行う
  - Then: rubric match が高い Gate が優先される。
- DS-03:
  - Given: selector が使えない or 明確な差分がない
  - When: assignment/selection を行う
  - Then: 既存 fallback（load balance / default gate）で動作する。

## Acceptance Criteria
- AC-01: Worker routing selector が `enabled skills + ROLE` ベースで assignment を返す。
- AC-02: Gate routing selector が `RUBRIC` ベースで gate id を返す。
- AC-03: planner/app が selector を使用しつつ既存 fallback を維持している。
- AC-04: unit/E2E で selector 接続の回帰を確認できる。

## リスク
- token-based scoring が単純すぎると誤配分が起きる可能性がある。
- async gate identity load を追加するため、submit/open gate のタイミングで待ちが増える可能性がある。

## 未解決事項
- Q-01: routing explanation を event へどう残すかは別 delta とする。
- Q-02: required skill / review focus 抽出の精度向上は別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-agent-routing-selector-impl

## 実装ステータス
- APPLIED

## 変更ファイル
- wireframe/agent-routing.js
- wireframe/guide-task-planner.js
- wireframe/app.js
- wireframe/index.html
- tests/unit/agent-routing.test.js
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `agent-routing.js` に Worker selector を追加し、`enabled skills` 一致を高優先で score するようにした。
  - 理由: Worker routing を `skills+ROLE` 基準へ寄せるため。
- AC-02:
  - 変更点: `agent-routing.js` に Gate selector を追加し、`RUBRIC.md` match で gate を選ぶようにした。
  - 理由: Gate routing を rubric-driven にするため。
- AC-03:
  - 変更点: planner と app に selector 接続を追加し、未導入時は既存 fallback へ戻るようにした。
  - 理由: prototype の既存フローを壊さずに差し替えるため。
- AC-04:
  - 変更点: unit test と既存 E2E 回帰で selector 接続を確認した。
  - 理由: routing 変更の退行を防ぐため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: event/audit explanation と override UI は未変更。

# delta-verify

## Delta ID
- DR-20260306-agent-routing-selector-impl

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `tests/unit/agent-routing.test.js` で skill match 優先を確認した。 |
| AC-02 | PASS | `tests/unit/agent-routing.test.js` で rubric match 優先を確認した。 |
| AC-03 | PASS | 既存 E2E の worker assignment / gate flow / default gate flow が継続 PASS。 |
| AC-04 | PASS | node check + unit + Playwright targeted run が通過した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: selector module、planner/app wiring、最小の architecture 同期に限定した。

## 主要確認
- R-01: `node --check wireframe/agent-routing.js`
- R-02: `node --check wireframe/guide-task-planner.js`
- R-03: `node --check wireframe/app.js`
- R-04: `node --test tests/unit/agent-routing.test.js tests/unit/guide-task-planner.test.js`
- R-05: `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|default gate is assigned to task and cron gate flow|job board supports gate flow|gate runtime receives structured review payload and applies suggestion"`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-agent-routing-selector-impl

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: Worker/Gate routing selector を prototype 実装へ接続する。
- 変更対象: selector module、planner/app wiring、tests、architecture/plan
- 非対象: routing explanation 永続化、override UI

## 反映結果
- 変更ファイル: `wireframe/agent-routing.js`, `wireframe/guide-task-planner.js`, `wireframe/app.js`, `wireframe/index.html`, `tests/unit/agent-routing.test.js`, `docs/architecture.md`, `docs/plan.md`
- AC充足: AC-01/02/03/04 PASS

## 検証記録
- verify要約: node check + node test + Playwright targeted run
- 主因メモ: なし

## 未解決事項
- routing explanation の audit/event 反映は未実装。
- skill / review focus 抽出精度はまだ heuristic。

## 次のdeltaへの引き継ぎ
- Seed-01: routing explanation を event/audit へ残す delta を切る。
