# delta-request

## Delta ID
- DR-20260306-guide-needs-clarification-controller-assist

## 概要
- `planningIntent=explicit_breakdown` かつ入力に再現手順・期待結果・対象画面が揃っている時でも、Guide が `needs_clarification` に留まり続ける。controller 側で planning readiness を補助し、軽微な不足は assumptions として `plan_ready` を優先させる。

## In Scope
- planning readiness 判定 helper を追加する
- Guide runtime 呼び出し時に readiness assist prompt を追加する
- debug meta に readiness assist の有無を残す
- unit test を追加する
- `docs/spec.md` / `docs/architecture.md` に最小同期する
- `docs/plan.md` に seed/current を反映する

## Out of Scope
- Guide parser 全体の変更
- structured output schema の変更
- routing algorithm の変更
- task UI の変更

## Acceptance Criteria
- AC-01: `explicit_breakdown` かつ再現手順・期待結果が揃う入力を readiness helper で検知できる
- AC-02: readiness 条件を満たす時だけ Guide prompt に `needs_clarification` を抑える補助文が追加される
- AC-03: debug meta に readiness assist の有無が残る
- AC-04: unit test と real runner 観測で PASS する

# delta-apply

## Delta ID
- DR-20260306-guide-needs-clarification-controller-assist

## ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-planning-intent.js
- wireframe/app.js
- tests/unit/guide-planning-intent.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

# delta-verify

## Delta ID
- DR-20260306-guide-needs-clarification-controller-assist

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | readiness helper が `explicit_breakdown` + 再現手順 + 期待結果を `debug_repro_ready` として検知した |
| AC-02 | PASS | readiness 条件時のみ `status=plan_ready` を優先する assist prompt を Guide system prompt に追加した |
| AC-03 | PASS | debug meta に `planningReadiness=debug_repro_ready` が記録された |
| AC-04 | PASS | unit test と real runner で 3 ターン目が `plan_ready` へ進んだ |

## 主な検証コマンド
- `node --check wireframe/guide-planning-intent.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-planning-intent.test.js`
- `node scripts/run_guide_autonomous_check.js`
- `node scripts/validate_delta_links.js --dir .`

## 観測メモ
- 実モデル run では 3 ターン目が `needs_clarification` ではなく `plan_ready` へ進んだ
- ただし `plan.tasks` 自体はまだ壊れており、materialization は 1 task に留まった
- 次の差分では malformed `plan_ready` payload の recovery 条件を広げる必要がある

## 総合判定
- PASS

verify結果: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-needs-clarification-controller-assist

## クローズ判定
- verify 総合判定: PASS
- archive 可否: 可

archive status: PASS

## 成果
- `explicit_breakdown` かつ再現手順・期待結果が揃う入力では、Guide が `needs_clarification` に留まり続けず `plan_ready` を返しやすくなった

## 次の delta への引き継ぎ
- Seed-01: `plan_ready` になった後も壊れた `tasks` 配列で 1 task しか materialize されないケースに対し、recovery 条件を reply 依存から user intent / readiness 依存へ拡張する
