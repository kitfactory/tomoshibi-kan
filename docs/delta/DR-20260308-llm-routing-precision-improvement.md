# delta-request

## Delta ID
- DR-20260308-llm-routing-precision-improvement

## Delta Type
- FEATURE

## 目的
- resident routing の通常経路で LLM 判断の精度を上げ、`fallback scorer` の発火頻度を下げる。

## 変更対象（In Scope）
- `wireframe/agent-routing.js`
- `wireframe/app.js`
- `wireframe/plan-orchestrator.js`
- `tests/unit/agent-routing.test.js`
- `tests/unit/plan-orchestrator.test.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- resident `SOUL.md / ROLE.md` の再編集
- Guide conversation / plan_ready の prompt 調整
- progress log / task detail UI の変更
- reroute / replan bridge の実装変更

## 差分仕様
- DS-01:
  - Given:
    - resident routing 用の candidate resident summary を組み立てる
  - When:
    - LLM routing 入力を作る
  - Then:
    - resident 比較に不要な重複を減らし、`ROLE全文 + capability` を主に読ませる
- DS-02:
  - Given:
    - Guide-driven routing prompt を組み立てる
  - When:
    - resident 候補を比較する
  - Then:
    - `Mission`, `得意な依頼`, `得意な作成物`, `Inputs`, `Outputs`, `Done Criteria`, `Constraints`, `Hand-off Rules`, `capabilitySummary` を比較基準としてより明確に指示する
- DS-03:
  - Given:
    - LLM routing decision を parse / validate する
  - When:
    - resident 選定を行う
  - Then:
    - valid decision を通常経路で優先し、fallback scorer は safety net としてのみ使う

## 受入条件（Acceptance Criteria）
- AC-01:
  - LLM routing 入力が `ROLE全文 + capability` を主に読む構成へ整理される
- AC-02:
  - routing prompt が resident 比較基準をより明確に持つ
- AC-03:
  - targeted unit が PASS する
- AC-04:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - fallback scorer は削除しない
- 制約2:
  - resident display name を一次ソースにしない
- 制約3:
  - real-model 観測は次の delta に分けてもよい

## Review Gate
- required: No
- reason:
  - routing 入力と prompt の改善であり、review 必須の大規模再設計ではない

# delta-apply

## Delta ID
- DR-20260308-llm-routing-precision-improvement

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/agent-routing.js
- wireframe/app.js
- tests/unit/agent-routing.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- 当該 delta 記録

## 適用内容（AC対応）
- AC-01:
  - LLM routing 用 resident payload を `ROLE全文 + capability + fitHints` 中心へ整理した
- AC-02:
  - Guide-driven routing prompt を resident 比較基準が明確になるよう更新した
- AC-03:
  - targeted unit を更新した
- AC-04:
  - validator 実行予定

## 非対象維持の確認
- Out of Scope への変更なし: Yes

# delta-verify

## Delta ID
- DR-20260308-llm-routing-precision-improvement

## Verify Profile
- static check:
  - `node --check wireframe/agent-routing.js wireframe/app.js`
- targeted unit:
  - `node --test tests/unit/agent-routing.test.js tests/unit/plan-orchestrator.test.js`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `buildWorkerRoutingLlmInput()` を追加し、LLM resident payload を `roleContractText + capabilitySummary + fitHints` 中心へ整理した |
| AC-02 | PASS | Guide-driven routing prompt が resident 比較基準を `ROLE全文` と capability に寄せるよう更新された |
| AC-03 | PASS | targeted unit が PASS した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-llm-routing-precision-improvement

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 結論
- resident routing の LLM 入力は `ROLE全文 + capability + fitHints` を中心に整理した
- `roleSummary / residentFocus / preferredOutputs` は fallback scorer / audit 用に残し、LLM 通常経路からは外した
- fallback scorer は safety net のまま維持し、通常経路の resident 判断を LLM 側へさらに寄せた
