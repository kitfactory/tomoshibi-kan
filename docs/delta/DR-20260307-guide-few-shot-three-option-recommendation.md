# delta-request

## Delta ID
- DR-20260307-guide-few-shot-three-option-recommendation

## 目的
- Guide が `scope_unclear` の短いターンで、3案提示・1案推薦・短く返答できる締めを rules だけでなく few-shot でも再現しやすくする。

## In Scope
- Guide 用 few-shot example を追加する。
- Guide system prompt に few-shot example を組み込む。
- unit test を追加または更新する。
- assist OFF 条件で `run_guide_autonomous_check.js` を再実行し、Guide 応答所見を記録する。
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` を最小同期する。

## Out of Scope
- controller assist / parser / structured output の変更
- ROLE.md / SOUL.md の変更
- Worker / Gate / UI の変更

## Acceptance Criteria
- AC-01: Guide 用 few-shot example が追加され、3案提示・1案推薦・短い締めを具体例で示している。
- AC-02: Guide system prompt が few-shot example を含むよう更新されている。
- AC-03: 関連 unit test が PASS する。
- AC-04: assist OFF 条件で `run_guide_autonomous_check.js` が完走し、Guide 応答所見を記録できる。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-guide-few-shot-three-option-recommendation

## ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- wireframe/app.js
- tests/unit/guide-plan.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- Guide 用 few-shot helper `buildGuidePlanFewShotExamples()` を追加し、`needs_clarification` と `plan_ready` の 2 例で `3案提示 + recommendation + short-answer closing` を具体化した。
- Guide の `planningSystemPrompt` に few-shot example を追加した。
- unit test と正本を few-shot 前提へ最小同期した。

# delta-verify

## Delta ID
- DR-20260307-guide-few-shot-three-option-recommendation

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | `wireframe/guide-plan.js` に `buildGuidePlanFewShotExamples()` を追加し、`needs_clarification` と `plan_ready` の具体例を入れた。 |
| AC-02 | PASS | `wireframe/app.js` の `planningSystemPrompt` に few-shot example を組み込んだ。 |
| AC-03 | PASS | `node --test tests/unit/guide-plan.test.js tests/unit/context-builder.test.js` PASS |
| AC-04 | PASS | assist OFF 条件で `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000` が完走し、2 ターン目で `3案 + recommendation + 2でよいですか？`、3 ターン目で `plan_ready` と 3 task materialize を確認した。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 検証コマンド
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js tests/unit/context-builder.test.js`
- `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-0xq0S8'; node cli/palpal.js debug guide-failures --limit 10`
- `node scripts/validate_delta_links.js --dir .`

## 観測所見
- workspace: `C:\Users\kitad\AppData\Local\Temp\palpal-guide-check-0xq0S8`
- `assist_enabled=false`
- 2 ターン目:
  - `needs_clarification`
  - `まずありそうなのは次の3案です...まずは 2 が最も可能性が高いです。2 でよいですか？`
- 3 ターン目:
  - `plan_ready`
  - `Trace / Fix / Verify の 3 段に分けました。`
  - `task_count_before=3`, `task_count_after=6`
- `palpal debug guide-failures --limit 10`
  - `conversation:conversation | count=1`
  - `needs_clarification:general_clarification | count=1`
  - `plan_ready:plan_ready | count=1`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-few-shot-three-option-recommendation

## クローズ状態
- verify 判定: PASS
- archive 実施: 完了

archive status: PASS

## まとめ
- Guide の `OPERATING_RULES` を few-shot で補強し、assist OFF の実モデルでも `3案提示 + recommendation + short-answer closing` が再現することを確認した。
- そのまま 3 ターン目では `plan_ready` に到達し、`Trace / Fix / Verify` の 3 task materialize まで進んだ。
