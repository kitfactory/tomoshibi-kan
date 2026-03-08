# delta-request

## Delta ID
- DR-20260308-assist-off-plan-ready-stability

## Delta Type
- FEATURE

## 目的
- assist OFF の Guide が resident trio 前提でも、少ないターンで `plan_ready` に到達し、task materialization まで進みやすいようにする。

## 変更対象（In Scope）
- 対象1:
  - `wireframe/context-builder.js` の Guide `OPERATING_RULES`
- 対象2:
  - `wireframe/guide-plan.js` の few-shot / Guide prompt 補助
- 対象3:
  - assist OFF の real-model 観測 script / verify 手順
- 対象4:
  - `tests/unit/context-builder.test.js`
  - `tests/unit/guide-plan.test.js`
- 対象5:
  - `docs/plan.md`
  - 本 delta 記録

## 非対象（Out of Scope）
- 非対象1:
  - controller assist の既定値や設定変更
- 非対象2:
  - resident `SOUL.md / ROLE.md / RUBRIC.md`
- 非対象3:
  - parser / recovery ロジックの大幅変更
- 非対象4:
  - Orchestrator / routing / progress log

## 差分仕様
- DS-01:
  - Given:
    - assist OFF の Guide が、3案提示と推薦を返した後の短い work intent 会話
  - When:
    - 依頼の輪郭が十分に見えている
  - Then:
    - Guide は追加質問だけに戻らず、依頼化提案を経て `plan_ready` に進みやすい
- DS-02:
  - Given:
    - resident trio 前提の debug/save/reload 系シナリオ
  - When:
    - real-model 観測を行う
  - Then:
    - `plan_ready` 到達率と task materialization の成否を観測できる

## 受入条件（Acceptance Criteria）
- AC-01:
  - assist OFF 条件で、Guide rules / few-shot が resident trio 前提の依頼化へ寄るように更新されている
- AC-02:
  - unit test が新ルールを固定し PASS する
- AC-03:
  - assist OFF の real-model 観測結果が delta に記録されている
- AC-04:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - controller assist は OFF のまま検証する
- 制約2:
  - resident trio (`調べる人 / 作り手 / 書く人`) の前提は維持する
- 制約3:
  - schema や Orchestrator 側での救済に頼らず、まず prompt 層の改善を優先する

## Review Gate
- required: No
- reason:
  - Guide prompt 層と観測の限定差分であり、レイヤー横断の構造変更を含まない

## 未確定事項
- Q-01:
  - prompt 改善だけで十分か、few-shot をさらに増やす必要があるかは観測次第

# delta-apply

## Delta ID
- DR-20260308-assist-off-plan-ready-stability

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/context-builder.js
- wireframe/guide-plan.js
- tests/unit/context-builder.test.js
- tests/unit/guide-plan.test.js
- docs/plan.md
- docs/delta/DR-20260308-assist-off-plan-ready-stability.md

## 適用内容（AC対応）
- AC-01:
  - 変更:
    - assist OFF 条件で explicit breakdown 要求と主要材料が揃った時は `plan_ready` を優先する rules を追加した
    - finalization proposal は Guide 自身がまとめる言い方へ固定した
  - 根拠:
    - `追加の最終確認に戻らず status=plan_ready`
    - ``まとめてほしい` のように、ユーザーへ逆に依頼しない`
    の rules を追加した
- AC-02:
  - 変更:
    - few-shot に explicit breakdown prompt から resident trio の `plan_ready` へ進む具体例を追加した
  - 根拠:
    - save/reload シナリオの `例3` を追加し、即 `plan_ready` へ進む形を固定した
- AC-03:
  - 変更:
    - assist OFF の real-model runner を実行し、結果を記録した
  - 根拠:
    - 3 turn 観測で `plan_ready -> task materialization` の成否を確認した
- AC-04:
  - 変更:
    - validator 実行予定
  - 根拠:
    - delta 記録と plan の整合確認を行う

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由:

## コード分割健全性
- 500行超のファイルあり: Yes
- 800行超のファイルあり: No
- 1000行超のファイルあり: No
- 長大な関数なし: Yes
- 責務過多のモジュールなし: Yes

## verify 依頼メモ
- 検証してほしい観点:
  - assist OFF の 3ターン目で `plan_ready` に到達するか
  - resident trio task が materialize されるか
- review evidence:
  - unit
  - real-model runner
  - delta validator

# delta-verify

## Delta ID
- DR-20260308-assist-off-plan-ready-stability

## Verify Profile
- static check: `node --check wireframe/guide-plan.js wireframe/context-builder.js tests/unit/guide-plan.test.js tests/unit/context-builder.test.js`
- targeted unit: `node --test tests/unit/guide-plan.test.js tests/unit/context-builder.test.js`
- targeted integration / E2E: `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 240000`
- project-validator: `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | Guide rules に `plan_ready` 優先条件と finalization proposal の主語固定を追加した |
| AC-02 | PASS | few-shot に explicit breakdown から resident trio plan へ進む `例3` を追加し、unit で固定した |
| AC-03 | PASS | assist OFF の real-model runner で 3ターン目が `plan_ready` となり、task 数が `3 -> 6` へ増えた |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- R-01:
  - 1ターン目の雑談寄り入力は引き続き `conversation` に留まる。これは意図どおりだが、雑談の自然さ自体は別観点で継続確認する

## Review Gate
- required: No
- checklist: `docs/delta/REVIEW_CHECKLIST.md`
- layer integrity: NOT CHECKED
- docs sync: PASS
- data size: NOT CHECKED
- code split health: PASS
- file-size threshold: PASS

## Review Delta Outcome
- pass: Yes
- follow-up delta seeds:

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260308-assist-off-plan-ready-stability

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的:
  - assist OFF の Guide が resident trio 前提でも `plan_ready` に到達し、task materialization まで進みやすくした
- 変更対象:
  - `wireframe/context-builder.js`
  - `wireframe/guide-plan.js`
  - `tests/unit/context-builder.test.js`
  - `tests/unit/guide-plan.test.js`
  - `docs/plan.md`
  - 本 delta 記録
- 非対象:
  - controller assist 設定
  - resident identity
  - parser / recovery の大幅変更
  - Orchestrator / routing / progress log

## 実装記録
- 変更ファイル:
  - `wireframe/context-builder.js`
  - `wireframe/guide-plan.js`
  - `tests/unit/context-builder.test.js`
  - `tests/unit/guide-plan.test.js`
  - `docs/plan.md`
  - `docs/delta/DR-20260308-assist-off-plan-ready-stability.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS

## 検証記録
- verify要約:
  - assist OFF の Guide で、3案提示 -> 推薦 -> explicit breakdown 要求時の `plan_ready` 優先を prompt 層で固定し、real-model でも resident trio materialization を確認した
- 主要な根拠:
  - static check PASS
  - targeted unit PASS
  - `run_guide_autonomous_check.js --turn-timeout-ms 240000` PASS
  - 3ターン目で `task_count_before=3`, `task_count_after=6`
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- なし

## 次のdeltaへの引き継ぎ（任意）
- resident trio の会話の自然さや、より広い業務テーマでの収束は継続観測する
