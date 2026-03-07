# delta-request

## Delta ID
- DR-20260306-guide-plan-debug-task-recovery

## 概要
- `plan_ready` になった model 出力の task 配列が壊れて 1 task しか materialize されないケースを、debug-purpose の `trace / fix / verify` 3 task へ救済する。reply 内の breakdown だけでなく controller cue (`planningIntent` / `planningReadiness`) も recovery 条件に使う。

## In Scope
- `wireframe/guide-plan.js` に debug breakdown recovery を追加・拡張する
- `wireframe/app.js` から parser へ controller cue を渡す
- `tests/unit/guide-plan.test.js` に malformed payload と controller cue を使う recovery test を追加する
- `docs/spec.md` / `docs/architecture.md` に最小同期する
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- Guide parser 全体の改善
- routing algorithm の変更
- task UI の変更
- debug DB schema の変更

## Acceptance Criteria
- AC-01: reply に `trace / fix / verify` の明示 breakdown がある時、壊れた task 配列を 3 task へ recovery できる
- AC-02: reply が短くても controller cue (`planningIntent=explicit_breakdown`, `planningReadiness=debug_repro_ready`) がある時、壊れた task 配列を 3 task へ recovery できる
- AC-03: 正常な plan payload はそのまま保持される
- AC-04: unit test と実モデル debug payload replay で PASS する

# delta-apply

## Delta ID
- DR-20260306-guide-plan-debug-task-recovery

## ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- wireframe/app.js
- tests/unit/guide-plan.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

# delta-verify

## Delta ID
- DR-20260306-guide-plan-debug-task-recovery

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | malformed `trace / fix / verify` payload を 3 task へ recovery できた |
| AC-02 | PASS | 実モデルの `planningIntent=explicit_breakdown` / `planningReadiness=debug_repro_ready` payload を 3 task へ recovery できた |
| AC-03 | PASS | 既存の正常 plan test は保持された |
| AC-04 | PASS | unit test と実モデル debug payload replay が成功した |

## 主な検証コマンド
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `node -` (実モデル `guide_chat` debug record replay)
- `node scripts/validate_delta_links.js --dir .`

## 観測メモ
- full real runner はモデル待機が不安定で timeout した
- ただし直近の実モデル `guide_chat` record (`debug-mmeu18rc-g5270qnp`) を current parser に replay すると、`Trace / Fix / Verify` の 3 task に recovery できた
- 次の詰まりは parser ではなく、実際の materialize 後に 3 task が board へ反映される end-to-end 確認である

## 総合判定
- PASS

verify結果: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-plan-debug-task-recovery

## クローズ判定
- verify 総合判定: PASS
- archive 可否: 可

archive status: PASS

## 成果
- debug-purpose の壊れた `plan_ready` task 配列を、reply または controller cue に基づいて `Trace / Fix / Verify` の 3 task へ安定して回復できるようになった

## 次の delta への引き継ぎ
- Seed-01: recovered plan が実際に board 上で 3 task materialize される end-to-end 経路を確認する
