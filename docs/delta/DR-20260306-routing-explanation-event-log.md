# delta-request

## Delta ID
- DR-20260306-routing-explanation-event-log

## 目的
- Worker/Gate routing explanation を Event Log summary に残し、dispatch/to_gate の根拠を UI から追えるようにする。

## 変更対象範囲 (In Scope)
- `wireframe/app.js` の dispatch/to_gate event summary に routing explanation を付与する。
- `tests/e2e/workspace-layout.spec.js` に routing explanation 表示の回帰を追加または修正する。
- `docs/spec.md` と `docs/architecture.md` に Event Log へ explanation を残す方針を最小同期する。
- `docs/plan.md` に seed/archive を反映する。

## 変更対象外 (Out of Scope)
- explanation 専用の新しい event type 追加
- Event Log の行レイアウト変更
- routing explanation の詳細化や長文化
- selector scoring ロジックの再設計

## 受入条件
- DS-01:
  - Given: Guide が task を計画し Worker を選定した
  - When: dispatch event が Event Log に記録される
  - Then: summary に `skills=...` または `ROLE=...` の短い explanation が含まれる
- DS-02:
  - Given: Task/Cron が Gate へ提出され、Gate routing が行われた
  - When: `to_gate` event が Event Log に記録される
  - Then: summary に `RUBRIC=...` の短い explanation が含まれる
- DS-03:
  - Given: Event Log を Playwright で確認する
  - When: dispatch/to_gate の対象を検索する
  - Then: routing explanation を UI 上で確認できる

## Acceptance Criteria
- AC-01: dispatch event summary が Worker routing explanation を表示する。
- AC-02: to_gate event summary が Gate routing explanation を表示する。
- AC-03: Event Log 回帰テストが routing explanation を検証して PASS する。
- AC-04: 正本は spec/architecture/plan の最小同期に留まり、Out of Scope へ変更しない。

## リスク
- planner に依存する E2E 入力が不安定だと dispatch event が生成されず、回帰が壊れやすい。
- explanation が空のケースでは Event Log summary に余計な記号だけが残る可能性がある。

## 未解決事項
- Q-01: routing explanation を将来 Event 詳細や audit export にも出すかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-routing-explanation-event-log

## 実装ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: dispatch event summary に `formatWorkerRoutingExplanation()` の結果を埋め込む実装を適用した。
  - 理由: Event Log から Worker 選定根拠を短く追えるようにするため。
- AC-02:
  - 変更点: to_gate event summary に `formatGateRoutingExplanation()` の結果を埋め込む実装を適用した。
  - 理由: Event Log から Gate 選定根拠を短く追えるようにするため。
- AC-03:
  - 変更点: Playwright の routing explanation テストを、task 生成が確実に起きる入力と待ち条件へ修正した。
  - 理由: planner 依存の揺れで false negative になるのを防ぐため。
- AC-04:
  - 変更点: spec/architecture/plan へ最小同期した。
  - 理由: explanation を Event Log に残す契約を文書上でも明示するため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: Event Log の見た目や selector scoring 自体は変更していない。

# delta-verify

## Delta ID
- DR-20260306-routing-explanation-event-log

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | dispatch event summary 実装が `formatWorkerRoutingExplanation()` を使う状態を保持している。 |
| AC-02 | PASS | to_gate event summary 実装が `formatGateRoutingExplanation()` を使う状態を保持している。 |
| AC-03 | PASS | node check + targeted Playwright で Event Log 上の explanation 表示を確認した。 |
| AC-04 | PASS | spec/architecture/plan の最小同期に留まり、Out of Scope 変更はない。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 変更は app.js / E2E / spec / architecture / plan に限定した。

## 主な確認コマンド
- R-01: `node --check wireframe/app.js`
- R-02: `node --check tests/e2e/workspace-layout.spec.js`
- R-03: `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|event log shows routing explanations for dispatch and gate submit|event log supports search, filter, and pagination|job board supports gate flow"`
- R-04: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-routing-explanation-event-log

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: dispatch/to_gate の Event Log summary に routing explanation を残す。
- 変更対象範囲: app.js, E2E, spec, architecture, plan
- 変更対象外: event type 追加、UI 大改修、selector 再設計

## 実装結果
- 変更ファイル: `wireframe/app.js`, `tests/e2e/workspace-layout.spec.js`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`
- AC達成状況: AC-01/02/03/04 PASS

## 検証要約
- verify結果: node check + targeted Playwright + delta link validation PASS
- 主な補足: E2E は planner が確実に task を作る入力へ寄せて安定化した。

## 未解決事項
- routing explanation の export/audit 詳細化は未実装

## 次のdeltaへの引き継ぎ
- Seed-01: routing explanation を Event 詳細や audit export へ展開するかは別 delta で判断する。
