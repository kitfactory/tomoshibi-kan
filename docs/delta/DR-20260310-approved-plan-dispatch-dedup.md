# delta-request

## Delta ID
- DR-20260310-approved-plan-dispatch-dedup

## Delta Type
- FEATURE

## 目的
- 管理人が `plan_ready` を承認した後、`はい / 進めて` のような短い追い返事で同じ plan を再生成しない。
- 承認済み plan は `dispatch 済み` として扱い、既存 plan の進行案内へ寄せる。

## 変更対象（In Scope）
- 承認意図の短い入力に対して、最新 `approved` artifact が既に materialize 済みなら model planning を呼ばずに即時応答する。
- 既存 task/job 数が増えないことを E2E で固定する。
- 最小限の spec / architecture / plan 同期を行う。

## 非対象（Out of Scope）
- progress query の一般改善
- resident routing 精度改善
- auto execution loop の別 runner 化
- Cron の自動実行

## 受入条件（Acceptance Criteria）
- AC-01: 最新 `pending_approval` artifact が無く、最新 `approved` artifact が materialize 済みの時、`はい / 進めて / お願いします` で新しい plan artifact を作らない
- AC-02: 上記ケースで task/job 数は増えず、Guide は「その依頼で進めている」旨を返す
- AC-03: targeted E2E と validator が PASS する

# delta-apply

## 実装方針
- `pending_approval` 分岐の次に、`approved + already materialized` 分岐を追加する。
- materialize 済み判定は `planId` を持つ task/job の存在で行う。
- 応答は resident-facing の簡潔な進行案内に留める。

# delta-verify

## Delta ID
- DR-20260310-approved-plan-dispatch-dedup

## Verify Profile
- static:
  - `node --check wireframe/app.js`
  - `node --check tests/e2e/workspace-layout.spec.js`
- targeted E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat reuses approved plan on repeated approval intent|guide chat creates planned tasks and assigns workers"`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | 最新 `approved` artifact の再承認入力で新しい `plan artifact` を作らず、既存 `plan_id` を再利用する分岐を追加した |
| AC-02 | PASS | repeated approval intent 用 E2E で task 数が増えず、`既に進めています` 応答を返すことを確認した |
| AC-03 | PASS | targeted Playwright と `node scripts/validate_delta_links.js --dir .` が PASS した |

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260310-approved-plan-dispatch-dedup

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- `GuideConversationUseCase` は、最新 `approved` artifact が既に materialize 済みの時、短い承認入力で新しい plan を再生成せず、既存 plan の進行案内を返す。
- その判定は `plan_id` に紐づく task/job 数で行う。
- repeated approval intent 用 E2E を追加し、task/job 数が増えないことを固定した。

## Notes
- 実装途中で `buildGuidePlanApprovalReply()` の閉じ方が壊れており、`countMaterializedTargetsForPlan` がスコープ外になる不具合があった。修正済み。
