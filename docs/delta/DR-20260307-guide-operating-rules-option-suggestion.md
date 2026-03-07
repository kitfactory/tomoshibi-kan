# delta-request

## Delta ID
- DR-20260307-guide-operating-rules-option-suggestion

## 目的
- `scope_unclear` の短いターンで Guide が追加質問だけを返すのではなく、妥当な仮説と 2-3 個の選択肢を先に提案し、ユーザーが次の入力を選びやすい状態にする。

## In Scope
- Guide 用 `OPERATING_RULES` に option suggestion ルールを追加する
- Guide 関連 unit test を更新する
- assist OFF 条件の `run_guide_autonomous_check.js` を再実行し、Guide 応答が選択肢提案に寄るかを観測する
- `docs/spec.md` / `docs/architecture.md` に最小同期する
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- controller assist の挙動変更
- Guide output instruction / parser / structured output の変更
- Pal / Gate / Orchestrator の変更
- UI の新規追加

## Acceptance Criteria
- AC-01: Guide 用 `OPERATING_RULES` に、短い `scope_unclear` では仮説と 2-3 個の選択肢を提示してよいことが明示される
- AC-02: 関連 unit test が更新され PASS する
- AC-03: assist OFF 条件で `run_guide_autonomous_check.js` を再実行できる
- AC-04: verify に assist OFF 再実行後の Guide 応答傾向と `conversation / needs_clarification / plan_ready / task_count` 観測を残す
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-operating-rules-option-suggestion

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- wireframe/context-builder.js
- tests/unit/context-builder.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- Guide 用 `OPERATING_RULES` に、短い `scope_unclear` では generic follow-up だけで止まらず、仮説と 2-3 個の選択肢を出し、1 つを推薦してよいルールを追加した
- context-builder unit test に option suggestion ルールの存在確認を追加した
- assist OFF 条件の real-model autonomous check を再観測できるよう docs と plan を同期した

# delta-verify

## Delta ID
- DR-20260307-guide-operating-rules-option-suggestion

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` と `wireframe/context-builder.js` の Guide rules に option suggestion / recommendation ルールを追加した |
| AC-02 | PASS | `node --test tests/unit/context-builder.test.js` PASS |
| AC-03 | PASS | `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000` を assist OFF で完走できた |
| AC-04 | PASS | assist OFF 再観測で `conversation:conversation | count=1`、`needs_clarification:missing_expected_outcome | count=1`、`needs_clarification:assignment_unclear | count=1`、`task_count_before=3 / after=3` を記録した |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check wireframe/context-builder.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/context-builder.test.js`
- `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-MulvHC'; node cli/palpal.js debug guide-failures --limit 10`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-MulvHC'; node cli/palpal.js debug show debug-mmfukh5m-2dhgmlnn`
- `node scripts/validate_delta_links.js --dir .`

## 観測所見
- 3 ターン目は `assignment_unclear` 扱いで、単なる generic follow-up ではなく「仮説をいくつか挙げる」と返すようになった
- ただし実際の返答は「どの Pal を使うか決める必要がある」と聞き返しており、rules にある「担当 Pal を自分で選ぶ」はまだ十分に徹底されていない
- 1 ターン目は依然として `conversation` で、雑談寄りの相談に対する選択肢提案までは出ていない
- task materialization は発生せず、task count は `3 -> 3` のままだった

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-operating-rules-option-suggestion

## クローズ状態
- verify 結果: PASS
- archive 可否: 可

archive status: PASS

## まとめ
- Guide の `OPERATING_RULES` に option suggestion を追加し、`scope_unclear` での応答は少し前進した
- ただし model はまだ「Pal をユーザーに選ばせる」方向へ流れるため、次は output instruction か `ROLE.md` 側でこの点を締める必要がある
