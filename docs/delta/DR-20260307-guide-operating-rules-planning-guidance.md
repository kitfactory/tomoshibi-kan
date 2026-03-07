# delta-request

## Delta ID
- DR-20260307-guide-operating-rules-planning-guidance

## 目的
- `Guide controller assist` が OFF の状態でも、Guide が planning intent をより自力で解釈し、`conversation` に留まり続けず `needs_clarification` または `plan_ready` へ進みやすいよう `Guide OPERATING_RULES` を強化する。

## In Scope
- Guide 用 `OPERATING_RULES` の文面を `wireframe/context-builder.js` と `wireframe/app.js` で見直す
- Guide 関連 unit test を更新する
- assist OFF 条件の `run_guide_autonomous_check.js` を再実行し、Guide の到達状態を再観測する
- `docs/spec.md` / `docs/architecture.md` に最小同期する
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- controller assist の挙動変更
- Guide output instruction / parser repair / structured output の追加変更
- Worker / Gate / full loop の変更
- ROLE.md / SOUL.md の改訂

## Acceptance Criteria
- AC-01: Guide 用 `OPERATING_RULES` に planning trigger 判定、blocker の絞り込み、debug の `Trace/Fix/Verify` 優先が明示される
- AC-02: 関連 unit test が更新され PASS する
- AC-03: assist OFF 条件で `run_guide_autonomous_check.js` を再実行できる
- AC-04: verify に assist OFF 再実行後の `conversation / needs_clarification / plan_ready / task_count` 観測を残す
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-operating-rules-planning-guidance

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
- Guide 用 `OPERATING_RULES` に planning trigger 判定、blocker が 1 つだけの時だけ follow-up を許すこと、debug では `Trace / Fix / Verify` を優先することを追加した
- `buildGuideContext` の unit test を再構成し、新しい Guide rules を直接検証するようにした
- `assist OFF` の real-model autonomous check を再観測する前提で docs と plan を同期した

# delta-verify

## Delta ID
- DR-20260307-guide-operating-rules-planning-guidance

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` と `wireframe/context-builder.js` の Guide rules に planning request 判定、single blocker 条件、debug 3-step plan 優先を追加した |
| AC-02 | PASS | `node --test tests/unit/context-builder.test.js` PASS |
| AC-03 | PASS | `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000` を assist OFF で完走できた |
| AC-04 | PASS | assist OFF 再観測で `conversation:conversation | count=1`、`needs_clarification:scope_unclear | count=2`、`task_count_before=3 / after=3` を記録した |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check wireframe/context-builder.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/context-builder.test.js`
- `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-jHk5p2'; node cli/palpal.js debug guide-failures --limit 10`
- `node scripts/validate_delta_links.js --dir .`

## 観測所見
- 前回の assist OFF 観測では 3 ターンとも `conversation` だったが、今回の rules 強化後は `conversation 1 / needs_clarification 2` に改善した
- 3 ターン目の明示的な `trace / fix / verify` 要求でも、まだ `plan_ready` には至らず、Guide は `scope_unclear` と解釈して追加確認を返した
- task materialization は発生せず、task count は `3 -> 3` のままだった
- したがって、Guide は assist OFF でも planning trigger を以前より拾えるようになったが、`plan_ready` へ抜けるにはまだ不足がある

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-operating-rules-planning-guidance

## クローズ状態
- verify 結果: PASS
- archive 可否: 可

archive status: PASS

## まとめ
- Guide の `OPERATING_RULES` を planning trigger 中心に強化し、assist OFF でも `conversation` に固定されず `needs_clarification` へ進むところまでは改善した
- ただし `plan_ready` までは未達で、次は `scope_unclear` をどう減らすかが論点になる
