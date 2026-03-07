# delta-request

## Delta ID
- DR-20260306-guide-conversation-boundary

## 目的
- Guide が通常会話まで Plan 化しないようにし、ユーザーが task 化を求めていない時は `conversation` 状態で対話継続させる。

## 変更対象（In Scope）
- `wireframe/guide-plan.js` の status を `conversation | needs_clarification | plan_ready` に拡張する。
- `wireframe/app.js` の Guide output contract を同じ 3 状態に揃える。
- unit test / E2E に `conversation` ケースを追加する。
- `concept/spec/architecture/plan` に通常会話境界を最小同期する。

## 非対象（Out of Scope）
- Plan approval / persistence。
- Guide の intent classification 高度化。
- Orchestrator の開始条件変更。

## 受入条件（Acceptance Criteria）
- AC-01: Guide plan parser が `conversation` を受理する。
- AC-02: `conversation` 応答時は task 数が増えない。
- AC-03: output instruction が `conversation` を含む。
- AC-04: concept/spec/architecture に通常会話境界が反映される。
- AC-05: targeted unit/E2E と delta link 検証が PASS する。

## 制約
- `plan_ready` と `needs_clarification` の既存挙動を壊さない。

## 未解決
- Q-01: `conversation` と `needs_clarification` の判定をどこまで model 依存にするかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-guide-conversation-boundary

## 適用ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- wireframe/app.js
- tests/unit/guide-plan.test.js
- tests/e2e/workspace-layout.spec.js
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更: `parseGuidePlanResponse()` が `conversation` を受理するようにした。
  - 根拠: `conversation` を `plan: null` で返す分岐を追加。
- AC-02:
  - 変更: E2E に `conversation` ケースを追加した。
  - 根拠: 通常会話で task 数が増えないことを確認するテストを追加。
- AC-03:
  - 変更: Guide output instruction に `conversation` を追加した。
  - 根拠: parser と app fallback を更新。
- AC-04:
  - 変更: concept/spec/architecture に通常会話境界を追記した。
  - 根拠: `Guide Conversation Boundary` と status 定義を追加。
- AC-05:
  - 変更: plan/delta を更新した。
  - 根拠: 検証と archive 用。

## Out of Scope 逸脱
- Out of Scope 変更の有無: No

## verify 申し送り
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|guide chat keeps dialog open when plan is not ready|guide chat keeps conversation mode without touching plan tasks|guide chat resumes after registering model in settings"`
- `node scripts/validate_delta_links.js --dir .`

# delta-verify

## Delta ID
- DR-20260306-guide-conversation-boundary

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `parseGuidePlanResponse` が `conversation` を受理する unit test を追加した。 |
| AC-02 | PASS | `conversation` E2E で task 数が増えないことを確認した。 |
| AC-03 | PASS | output instruction が `conversation` を含むよう更新した。 |
| AC-04 | PASS | concept/spec/architecture に通常会話境界を追記した。 |
| AC-05 | PASS | targeted unit/E2E と delta link 検証が PASS した。 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No

## 実施コマンド
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|guide chat keeps dialog open when plan is not ready|guide chat keeps conversation mode without touching plan tasks|guide chat resumes after registering model in settings"`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-conversation-boundary

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: Guide の通常会話を Plan 化せず、`conversation` 状態で対話継続できるようにした。
- 変更対象:
  - parser/app/test/docs/plan
- 非対象:
  - approval/persistence
  - advanced intent classifier

## 検証
- targeted unit/E2E PASS
- `node scripts/validate_delta_links.js --dir .` PASS

## 未解決
- `conversation` と `needs_clarification` の境界の高度化は別 delta。

## 次のdeltaへの引き継ぎ
- Seed-01: Guide の `conversation -> needs_clarification -> plan_ready` 遷移を実モデル観測で磨く。
