# delta-request

## Delta ID
- DR-20260307-guide-operating-rules-work-intent

## 目的
- Guide の判断軸を「日常会話かどうか」ではなく「ユーザーが仕事の依頼に進もうとしているか」に寄せ、仕事の依頼であれば提案主導で要件を具体化できるようにする。

## In Scope
- Guide 用 `OPERATING_RULES` を work-intent 中心の文面へ更新する
- 短い `scope_unclear` では、会話履歴からあり得そうな案件を 3 択で具体提案するルールを追加する
- 関連 unit test を更新する
- assist OFF 条件で `run_guide_autonomous_check.js` を再実行し、Guide 応答傾向を観測する
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` を最小同期する

## Out of Scope
- controller assist / parser / structured output の変更
- ROLE.md / SOUL.md の変更
- Worker / Gate / UI の変更

## Acceptance Criteria
- AC-01: Guide 用 `OPERATING_RULES` が `work intent` 判定、提案主導、3 択提案を明示する
- AC-02: 関連 unit test が更新され PASS する
- AC-03: assist OFF 条件で `run_guide_autonomous_check.js` を再実行できる
- AC-04: verify に assist OFF 再実行後の Guide 応答傾向と `conversation / needs_clarification / plan_ready / task_count` 観測を残す
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-operating-rules-work-intent

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
- Guide 用 `OPERATING_RULES` を `work intent` 判定中心へ更新した
- 短い `scope_unclear` では、会話文脈に沿った具体的な 3 択を提案し、1 つを推薦するルールを追加した
- unit test と docs をこの整理へ合わせた

# delta-verify

## Delta ID
- DR-20260307-guide-operating-rules-work-intent

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` と `wireframe/context-builder.js` の Guide rules に `work intent` 判定、提案主導、3 択提案、1 件推薦を追加した |
| AC-02 | PASS | `node --test tests/unit/context-builder.test.js` PASS |
| AC-03 | PASS | `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000` を assist OFF で完走できた |
| AC-04 | PASS | assist OFF 再観測で `conversation:conversation | count=1`, `needs_clarification:scope_unclear | count=1`, `needs_clarification:general_clarification | count=1`, `task_count_before=3 / after=3` を記録した |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check wireframe/context-builder.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/context-builder.test.js`
- `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-EIFsgS'; node cli/palpal.js debug guide-failures --limit 10`
- `node scripts/validate_delta_links.js --dir .`

## 観測所見
- 1 ターン目は依然 `conversation` で、仕事依頼への誘導はまだ弱い
- 2 ターン目は `scope_unclear`、3 ターン目は `general_clarification` で、いずれも `plan_ready` には進まなかった
- 3 ターン目の返答は情報要求を箇条書き化したが、rules で狙った「会話文脈に沿った具体的な 3 択提案」には届いていない
- したがって、`work intent` 判定軸は文面として入ったが、実モデルの Guide 応答はまだその rules を十分には反映していない

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-operating-rules-work-intent

## クローズ状態
- verify 結果: PASS
- archive 可否: 可

archive status: PASS

## まとめ
- Guide の `OPERATING_RULES` を `work intent` 中心へ整理し、3 択提案ルールまで明示した
- ただし assist OFF の実モデル応答では 3 択提案は再現せず、次は `ROLE.md` や few-shot など別の押し方が必要と分かった
