# delta-request

## Delta ID
- DR-20260308-full-role-routing-context

## Delta Type
- FEATURE

## 目的
- resident routing の LLM 判断で `ROLE.md` の要点抽出だけでなく全文も参照できるようにし、住人が増えた時でも `ROLE` の記述力をそのまま routing 判断へ活かせるようにする。

## 変更対象（In Scope）
- `wireframe/agent-routing.js`
- `wireframe/app.js`
- `tests/unit/agent-routing.test.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- resident `SOUL.md` / `ROLE.md` の再編集
- deterministic fallback scorer の全面設計変更
- Guide の conversation / plan_ready prompt 調整
- real-model 観測

## 差分仕様
- DS-01:
  - Given:
    - candidate resident summary を生成する場面
  - When:
    - LLM routing 用 payload を組み立てる
  - Then:
    - `roleContractText` として `ROLE.md` 全文が candidate resident summary に含まれる
- DS-02:
  - Given:
    - Guide-driven routing が resident 候補を比較する場面
  - When:
    - system prompt を組み立てる
  - Then:
    - `得意な依頼 / 得意な作成物` を優先しつつ、必要に応じて `ROLE.md` 全文も参照して判断するよう指示される
- DS-03:
  - Given:
    - routing DTO の正本を参照する場面
  - When:
    - spec / architecture を読む
  - Then:
    - `CandidateResidentSummary` に full `ROLE` を含める契約が同期される

## 受入条件（Acceptance Criteria）
- AC-01:
  - candidate resident summary に `roleContractText` が入り、unit test で確認できる
- AC-02:
  - Guide-driven routing prompt が `ROLE.md` 全文参照を明示する
- AC-03:
  - `docs/spec.md` と `docs/architecture.md` に `roleContractText` が同期される
- AC-04:
  - targeted unit が PASS する
- AC-05:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - deterministic fallback scorer は summary ベースを維持し、全文 text 依存へは広げない
- 制約2:
  - candidate summary の主要フィールドは残し、全文追加だけで置き換えない
- 制約3:
  - resident display name を一次ソースにしない方針は維持する

## Review Gate
- required: No
- reason:
  - routing DTO と prompt の限定差分であり、review 必須の大機能変更ではない

# delta-apply

## Delta ID
- DR-20260308-full-role-routing-context

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
  - candidate resident summary に `roleContractText` を追加した
- AC-02:
  - Guide-driven routing prompt に `ROLE.md` 全文参照の指示を追加した
- AC-03:
  - spec / architecture の `CandidateResidentSummary` 契約へ `roleContractText` を同期した
- AC-04:
  - targeted unit を更新した
- AC-05:
  - validator 実行予定

## 非対象維持の確認
- Out of Scope への変更なし: Yes

# delta-verify

## Delta ID
- DR-20260308-full-role-routing-context

## Verify Profile
- static check:
  - `node --check wireframe/agent-routing.js wireframe/app.js`
- targeted unit:
  - `node --test tests/unit/agent-routing.test.js tests/unit/plan-orchestrator.test.js tests/unit/debug-identity-seeds.test.js`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `CandidateResidentSummary` に `roleContractText` を追加し、unit で確認した |
| AC-02 | PASS | Guide-driven routing prompt が `ROLE.md` 全文を必要に応じて参照するよう更新された |
| AC-03 | PASS | spec / architecture の DTO 契約に `roleContractText` を同期した |
| AC-04 | PASS | targeted unit が PASS した |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-full-role-routing-context

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 結論
- resident routing の LLM 入力へ `ROLE.md` 全文を `roleContractText` として追加した
- summary ベースの比較軸は残しつつ、意味解釈には full ROLE も使えるようにした
- deterministic fallback scorer は従来どおり summary ベースのまま維持した
