# delta-request

## Delta ID
- DR-20260306-guide-full-runner-stabilization

## 概要
- `scripts/run_guide_autonomous_check.js` は chat row count だけを待機条件にしており、実モデル応答で timeout しやすい。`guideSend` の busy state と追加診断を使う待機へ切り替え、full runner の観測を安定化する。途中で見つかった `sendGuideMessage()` の planning cue 参照バグも最小差分で修正する。

## In Scope
- `scripts/run_guide_autonomous_check.js` の待機条件を改善する
- timeout 時の診断出力を追加する
- `sendGuideMessage()` で parser へ渡す planning cue を適切に解決する最小修正を入れる
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- Guide runtime の本体変更
- parser / planner / routing の変更
- CLI の追加
- spec / architecture の変更

## Acceptance Criteria
- AC-01: guide turn 実行時に `guideSend[aria-busy]` の開始/終了を待てる
- AC-02: timeout 時に chat count / busy state / latest messages / debug run count を診断出力できる
- AC-02b: `sendGuideMessage()` が `ReferenceError` なく Guide reply まで進む
- AC-03: `node scripts/run_guide_autonomous_check.js` が 3 turn を完了する
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260306-guide-full-runner-stabilization

## ステータス
- APPLIED

## 変更ファイル
- scripts/run_guide_autonomous_check.js
- wireframe/app.js
- docs/plan.md

# delta-verify

## Delta ID
- DR-20260306-guide-full-runner-stabilization

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | runner が `guideSend[aria-busy]` の開始/終了を待てるようになった |
| AC-02 | PASS | timeout 用 diagnostics に chat count / busy / latest messages を追加した |
| AC-02b | PASS | `sendGuideMessage()` の `planningIntent / planningReadiness` 未定義参照を解消した |
| AC-03 | PASS | full runner が 3 turn を完了し、`guide_run_count=3` を確認した |
| AC-04 | PASS | delta link validation が成功した |

## 主な検証コマンド
- `node --check scripts/run_guide_autonomous_check.js`
- `node --check wireframe/app.js`
- `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000`
- `node scripts/validate_delta_links.js --dir .`

## 観測メモ
- 3 turn 完了
- `guide_run_count=3`
- 3 turn 目で `task_count_before=15`, `task_count_after=18`
- latest task は `Trace / Fix / Verify`

## 総合判定
- PASS

verify結果: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-full-runner-stabilization

## クローズ判定
- verify 総合判定: PASS
- archive 可否: 可

archive status: PASS

## 成果
- full runner で `Guide -> plan_ready -> Trace/Fix/Verify materialize` を 3 turn 通しで観測できるようになった

## 次の delta への引き継ぎ
- Seed-01: Orchestrator autonomous check として、Guide の生成した task を worker runtime / gate review まで通しで確認する
