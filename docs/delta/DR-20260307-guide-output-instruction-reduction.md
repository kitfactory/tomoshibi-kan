# delta-request

## Delta ID
- DR-20260307-guide-output-instruction-reduction

## 目的
- Guide の判断規則を `OPERATING_RULES` に集約し、`Guide output instruction` は JSON schema と形式制約だけに削減する。

## In Scope
- `wireframe/guide-plan.js` の `buildGuidePlanOutputInstruction()` から判断文を削除する
- 連動する fallback 側の重複文言を最小修正する
- 関連 unit test を更新する
- assist OFF 条件の `run_guide_autonomous_check.js` を再実行し、挙動が破綻しないことを確認する
- `docs/spec.md` / `docs/architecture.md` に最小同期する
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- `OPERATING_RULES` の追加変更
- controller assist / parser / structured output の変更
- Worker / Gate / UI の変更

## Acceptance Criteria
- AC-01: Guide output instruction から `conversation / needs_clarification / plan_ready` の判断条件文が削除される
- AC-02: Guide output instruction は compact JSON と schema 制約だけを残す
- AC-03: 関連 unit test が更新され PASS する
- AC-04: assist OFF 条件で `run_guide_autonomous_check.js` を再実行できる
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-output-instruction-reduction

## ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- tests/unit/guide-plan.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- `buildGuidePlanOutputInstruction()` から status の使い分け、assumption、assignee、debug worker 優先に関する判断文を削除した
- output instruction は `compact JSON`, `schema`, `status values`, `required fields`, `no extra keys` だけに絞った
- unit test を schema-only 期待へ更新し、`prefer status=plan_ready` 等が出ないことを確認する形に変えた

# delta-verify

## Delta ID
- DR-20260307-guide-output-instruction-reduction

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/guide-plan.js` から `status=conversation / needs_clarification / plan_ready` の判断条件文を削除した |
| AC-02 | PASS | output instruction は `compact JSON`, schema, required fields, extra key 禁止だけを残した |
| AC-03 | PASS | `node --test tests/unit/guide-plan.test.js tests/unit/context-builder.test.js` PASS |
| AC-04 | PASS | `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000` を assist OFF で完走できた |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check wireframe/guide-plan.js`
- `node --test tests/unit/guide-plan.test.js tests/unit/context-builder.test.js`
- `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-D0HEF5'; node cli/palpal.js debug guide-failures --limit 10`
- `node scripts/validate_delta_links.js --dir .`

## 観測所見
- output instruction を削減しても、assist OFF の real-model run 自体は破綻しなかった
- 分類結果は `conversation:conversation | count=1`, `needs_clarification:scope_unclear | count=1`, `needs_clarification:general_clarification | count=1` だった
- つまり、判断規則を `OPERATING_RULES` に寄せても Guide の現状挙動は大きく崩れていない
- 一方で `plan_ready` 到達は依然としてなく、改善論点は今後も `OPERATING_RULES / ROLE / 実モデルの癖` 側にある

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-output-instruction-reduction

## クローズ状態
- verify 結果: PASS
- archive 可否: 可

archive status: PASS

## まとめ
- Guide の判断規則を `OPERATING_RULES` に集約し、output instruction を schema と形式制約だけに削減した
- この整理でも assist OFF の実モデル run は維持できており、責務分離としては前進している
