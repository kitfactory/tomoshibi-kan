# delta-request

## Delta ID
- DR-20260308-guide-finalization-proposal

## Delta Type
- FEATURE

## 目的
- Guide が 3 案提示と推薦の後、依頼が固まりそうな段階では最終依頼案を短く提案し、少ないターンで収束しやすくする。

## 変更対象（In Scope）
- 対象1:
  - `wireframe/context-builder.js` の Guide `OPERATING_RULES`
- 対象2:
  - `wireframe/guide-plan.js` の Guide few-shot
- 対象3:
  - `tests/unit/context-builder.test.js`
  - `tests/unit/guide-plan.test.js`
- 対象4:
  - `docs/plan.md`
  - この delta 記録

## 非対象（Out of Scope）
- 非対象1:
  - `Guide plan` の parser / repair / recovery ロジック
- 非対象2:
  - resident `SOUL.md / ROLE.md / RUBRIC.md`
- 非対象3:
  - Orchestrator / routing / progress log / task detail UI
- 非対象4:
  - `app.js` の fallback prompt 以外の実行フロー変更

## 差分仕様
- DS-01:
  - Given:
    - Guide が short-turn の work intent を受け取り、3 案提示と 1 案推薦を行う場面
  - When:
    - 主要な依頼の輪郭が見えており、まだ `plan_ready` には進まない場面
  - Then:
    - Guide は `これで依頼としてまとめようと考えます` に相当する最終依頼案を短く提案し、ユーザーが yes/no や番号で返しやすい締めを使う
- DS-02:
  - Given:
    - Guide の few-shot を参照して応答を組み立てる場面
  - When:
    - 3 案提示の例を使う
  - Then:
    - few-shot には、各案の着目点、推薦理由、最終依頼案の提示、短い締めが含まれる

## 受入条件（Acceptance Criteria）
- AC-01:
  - `wireframe/context-builder.js` の Guide `OPERATING_RULES` に、3 案提示後の最終依頼案提案ルールが追加されている
- AC-02:
  - `wireframe/guide-plan.js` の few-shot に、最終依頼案を提案する例が含まれている
- AC-03:
  - `tests/unit/context-builder.test.js` と `tests/unit/guide-plan.test.js` が新ルールを検証し、PASS する
- AC-04:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - Guide の output schema は変更しない
- 制約2:
  - 3 task recovery や resident trio materialization の既存ロジックは変更しない
- 制約3:
  - resident trio 前提の worldbuilding 用語を維持する

## Review Gate
- required: No
- reason:
  - prompt / few-shot / unit の限定差分であり、レイヤー横断や大機能の構造変更を含まない

## 未確定事項
- Q-01:
  - finalization proposal の表現をどこまで強く固定するかは、apply 後の unit と実モデル所見で微調整する

# delta-apply

## Delta ID
- DR-20260308-guide-finalization-proposal

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
- docs/delta/DR-20260308-guide-finalization-proposal.md

## 適用内容（AC対応）
- AC-01:
  - 変更:
    - Guide `OPERATING_RULES` に、3案提示と推薦の後で最終依頼案を短く提示するルールを追加した
  - 根拠:
    - `最終依頼案を短く提示`
    - `誰に何を頼む形になるか`
    - `この形で進めてよければ依頼にします`
    を rules に追加した
- AC-02:
  - 変更:
    - Guide few-shot の `needs_clarification` 例に、最終依頼案の提示と短い締めを追加した
  - 根拠:
    - 3案提示 -> 推薦 -> `では、この内容で ... 依頼としてまとめようと考えます` -> `この形で進めてよければ依頼にします`
    の流れを例示に固定した
- AC-03:
  - 変更:
    - unit test の期待値を更新した
  - 根拠:
    - context-builder と few-shot の双方で finalization proposal を検証するようにした
- AC-04:
  - 変更:
    - validator 実行予定
  - 根拠:
    - delta 記録と plan 整合を確認する

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
  - finalization proposal が `OPERATING_RULES` と few-shot に両方入っているか
  - 既存 schema 契約を壊していないか
- review evidence:
  - unit
  - delta validator

# delta-verify

## Delta ID
- DR-20260308-guide-finalization-proposal

## Verify Profile
- static check: `node --check wireframe/guide-plan.js wireframe/context-builder.js tests/unit/guide-plan.test.js tests/unit/context-builder.test.js`
- targeted unit: `node --test tests/unit/guide-plan.test.js tests/unit/context-builder.test.js`
- targeted integration / E2E: Not required
- project-validator: `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `context-builder` の Guide rules に finalization proposal の明示ルールが追加され、unit で検証した |
| AC-02 | PASS | few-shot の `needs_clarification` 例に、最終依頼案の提示と短い締めが含まれることを unit で検証した |
| AC-03 | PASS | `tests/unit/guide-plan.test.js` と `tests/unit/context-builder.test.js` が PASS した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- R-01:
  - 実モデル観測は未実施なので、assist OFF での実際の収束力は次段で確認が必要

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
- DR-20260308-guide-finalization-proposal

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的:
  - Guide が 3案提示と推薦の後で、最終依頼案を短く提案して収束しやすくした
- 変更対象:
  - `wireframe/context-builder.js`
  - `wireframe/guide-plan.js`
  - `tests/unit/context-builder.test.js`
  - `tests/unit/guide-plan.test.js`
  - `docs/plan.md`
  - 本 delta 記録
- 非対象:
  - parser / recovery
  - resident identity
  - Orchestrator / routing / progress log

## 実装記録
- 変更ファイル:
  - `wireframe/context-builder.js`
  - `wireframe/guide-plan.js`
  - `tests/unit/context-builder.test.js`
  - `tests/unit/guide-plan.test.js`
  - `docs/plan.md`
  - `docs/delta/DR-20260308-guide-finalization-proposal.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS

## 検証記録
- verify要約:
  - Guide `OPERATING_RULES` と few-shot に `3案 -> 推薦 -> 最終依頼案提示 -> 短い締め` を固定し、unit と validator で検証した
- 主要な根拠:
  - static check PASS
  - targeted unit PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- assist OFF 条件での実モデル収束力は次段で観測する

## 次のdeltaへの引き継ぎ（任意）
- `SEED-20260308-assist-off-plan-ready-stability`
