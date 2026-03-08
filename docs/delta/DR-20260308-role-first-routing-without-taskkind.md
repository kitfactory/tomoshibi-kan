# delta-request

## Delta ID
- DR-20260308-role-first-routing-without-taskkind

## Delta Type
- FEATURE

## 目的
- `taskKind` に依存した resident routing を廃止し、`ROLE.md` の得意領域と得意な作成物を軸に、住人が増えても伸ばしやすい routing へ切り替える。

## 変更対象（In Scope）
- `wireframe/agent-routing.js`
- `wireframe/debug-identity-seeds.js`
- `tests/unit/agent-routing.test.js`
- `tests/unit/debug-identity-seeds.test.js`
- `tests/unit/plan-orchestrator.test.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- resident `SOUL.md` の再編集
- Guide の conversation / plan_ready prompt 調整
- Orchestrator の reroute / replan wiring 変更
- progress log / task detail UI の変更
- real-model 観測

## 差分仕様
- DS-01:
  - Given:
    - resident routing が `RoutingInput` を組み立てる場面
  - When:
    - candidate resident summary を生成する
  - Then:
    - `taskKind` と `residentFunction` は DTO から外れ、代わりに `residentFocus[]` と `preferredOutputs[]` が入る
- DS-02:
  - Given:
    - deterministic fallback scorer が住人を選ぶ場面
  - When:
    - `ROLE.md` に得意領域や得意な作成物が定義されている
  - Then:
    - scorer は `requiredSkills` と `ROLE` の一致を主に見て、`taskKind` には依存しない
- DS-03:
  - Given:
    - built-in resident seed を同期する場面
  - When:
    - worker `ROLE.md` を生成する
  - Then:
    - 少なくとも `得意な依頼` と `得意な作成物` の節が含まれている

## 受入条件（Acceptance Criteria）
- AC-01:
  - `wireframe/agent-routing.js` から `taskKind` / `residentFunction` 依存が除去されている
- AC-02:
  - `RoutingInput` と candidate resident summary が `residentFocus[]` と `preferredOutputs[]` を持つ
- AC-03:
  - built-in resident `ROLE.md` に `得意な依頼` と `得意な作成物` が入る
- AC-04:
  - unit test が新しい role-first routing を検証して PASS する
- AC-05:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - Guide-driven routing の LLM schema は最小変更に留める
- 制約2:
  - `taskKind` を別の内部カテゴリへ置き換えるだけの実装にしない
- 制約3:
  - resident ごとの世界観用語は維持する

## Review Gate
- required: No
- reason:
  - routing と ROLE seed の限定差分であり、アーキテクチャ全面変更ではない

# delta-apply

## Delta ID
- DR-20260308-role-first-routing-without-taskkind

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/agent-routing.js
- wireframe/plan-orchestrator.js
- wireframe/app.js
- wireframe/debug-identity-seeds.js
- tests/unit/agent-routing.test.js
- tests/unit/debug-identity-seeds.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- 当該 delta 記録

## 適用内容（AC対応）
- AC-01:
  - `agent-routing.js` から `taskKind` / `residentFunction` を外し、`residentFocus` / `preferredOutputs` を routing DTO と scorer に入れた
- AC-02:
  - candidate resident summary に `residentFocus[]` と `preferredOutputs[]` を追加した
- AC-03:
  - built-in resident seed の `ROLE.md` に `得意な依頼` と `得意な作成物` を追加した
- AC-04:
  - unit test を新しい role-first routing 契約へ更新した
- AC-05:
  - validator 実行予定

## 非対象維持の確認
- Out of Scope への変更なし: Yes

# delta-verify

## Delta ID
- DR-20260308-role-first-routing-without-taskkind

## Verify Profile
- static check:
  - `node --check wireframe/agent-routing.js`
  - `node --check wireframe/plan-orchestrator.js`
  - `node --check wireframe/app.js`
- targeted unit:
  - `node --test tests/unit/agent-routing.test.js tests/unit/plan-orchestrator.test.js tests/unit/debug-identity-seeds.test.js`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `agent-routing.js` から `taskKind` / `residentFunction` 依存を除去し、`residentFocus` / `preferredOutputs` ベースへ切り替えた |
| AC-02 | PASS | `buildWorkerRoutingInput()` の candidate resident summary に `residentFocus[]` と `preferredOutputs[]` が含まれる |
| AC-03 | PASS | built-in worker `ROLE.md` に `得意な依頼` と `得意な作成物` が追加され、seed test で確認した |
| AC-04 | PASS | `tests/unit/agent-routing.test.js` と関連 unit が PASS した |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-role-first-routing-without-taskkind

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 結論
- `taskKind` を廃止し、routing は `ROLE.md` の `得意な依頼` と `得意な作成物` を主な判断材料にした
- LLM routing prompt も display name ではなく `ROLE` の得意領域を一次ソースとして扱うように寄せた
- deterministic fallback も同じ role-first 方針へ揃えた
