# delta-request

## Delta ID
- DR-20260307-guide-autonomous-check-assist-off

## 目的
- `Guide controller assist` を既定 OFF のまま実モデルで Guide autonomous check を再実行し、`conversation / needs_clarification / plan_ready` のどこまで到達するかを debug record と runner 出力で観測する。

## In Scope
- `scripts/run_guide_autonomous_check.js` を assist OFF 検証に耐えるよう最小修正する
- isolated workspace 起動時に prototype local state を明示クリアし、shared localStorage 汚染を避ける
- runner 実行で `guide_chat` debug record と task materialization を観測する
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- Guide prompt / parser / structured output の追加修正
- controller assist の挙動変更
- Worker / Gate / full-loop の再検証
- 新しい UI 追加

## Acceptance Criteria
- AC-01: `run_guide_autonomous_check.js` が isolated workspace で shared local state をクリアしてから起動できる
- AC-02: assist OFF 条件で real-model Guide autonomous check を 1 回以上完走できる
- AC-03: 実行後に `guide_chat` debug record を 1 件以上確認できる
- AC-04: verify に assist OFF 条件での `conversation / needs_clarification / plan_ready / task_count` の観測結果を残す
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-autonomous-check-assist-off

## ステータス
- APPLIED

## 変更ファイル
- scripts/run_guide_autonomous_check.js
- docs/plan.md

## 適用内容
- runner 起動時に `palpal-hive.projects.v1 / board-state.v1 / agent-profiles.v1 / settings.v1` を localStorage から削除して reload するようにした
- runner が `settingsGuideControllerAssistEnabled` checkbox を読み、`assist_enabled=<bool>` を出力するようにした
- `assist OFF` 条件の autonomous check request を `docs/plan.md` current と delta request に追加した

# delta-verify

## Delta ID
- DR-20260307-guide-autonomous-check-assist-off

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `scripts/run_guide_autonomous_check.js` に localStorage clear + reload を追加し、isolated workspace 起動前に prototype local state を明示リセットした |
| AC-02 | PASS | `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000` が完走し、3 ターンの Guide autonomous check を実モデルで実行できた |
| AC-03 | PASS | `guide_run_count=3` を確認し、`palpal debug show debug-mmftefut-83wv819k` で `guide_chat` record の input/output/meta を確認できた |
| AC-04 | PASS | assist OFF では `assist_enabled=false`、`palpal debug guide-failures --limit 10` は `conversation:conversation | count=3`、各 turn で `task_count_before=3 / after=3` を記録した |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check scripts/run_guide_autonomous_check.js`
- `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-3gDY2E'; node cli/palpal.js debug guide-failures --limit 10`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-3gDY2E'; node cli/palpal.js debug show debug-mmftefut-83wv819k`
- `node scripts/validate_delta_links.js --dir .`

## 観測所見
- assist OFF 条件では `planningIntent / planningReadiness` は `none` のままで、3 ターンとも `conversation` に留まった
- 3 ターン目の明示的な `trace / fix / verify` 要求でも `plan_ready` へ進まず、Guide は追加の聞き返しを返した
- task materialization は発生せず、task count は `3 -> 3` で固定だった
- 現時点の素の Guide は debug scenario では planning intent を自力で十分に拾えていない

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-autonomous-check-assist-off

## クローズ状態
- verify 結果: PASS
- archive 可否: 可

archive status: PASS

## まとめ
- `Guide controller assist` を OFF にした素の Guide autonomous check を実モデルで再実行し、Guide は 3 ターンとも `conversation` に留まり、task 化へ進まないことを確認した

## 残課題
- planning intent / readiness を controller assist なしでどこまで拾わせるか
- 素の Guide で `conversation` から `needs_clarification / plan_ready` へ自然遷移させる prompt / identity / evaluation の見直し
