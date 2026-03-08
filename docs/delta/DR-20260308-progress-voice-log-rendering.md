# delta-request

## Delta ID
- DR-20260308-progress-voice-log-rendering

## Delta Type
- FEATURE

## 目的
- task detail 右列の conversation log 本文を、管理人 / 住人 / 古参住人の `Progress Voice` に沿った語り口へ寄せる。

## 変更対象（In Scope）
- `wireframe/app.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- progress log schema の変更
- 新しい actionType の追加
- resident `SOUL.md / ROLE.md / RUBRIC.md` の再編集
- routing / orchestrator のロジック変更
- UI レイアウトや CSS の大幅変更

## 受入条件（Acceptance Criteria）
- AC-01: task detail 右列の `Guide` 系ログが、管理人らしいやわらかい語り口で表示される
- AC-02: `Resident` 系ログが、住人らしい簡潔な途中メモとして表示される
- AC-03: `Gate` 系ログが、古参住人らしい短く含みのある語り口で表示される
- AC-04: `reroute / replan_required / replanned` を含む既存 action が新しい語り口で表示される
- AC-05: targeted E2E と `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- `messageForUser` の永続値はそのまま使い、render 時の整形で表現差を出す
- 既存の progress query や event log には影響を出さない

## Review Gate
- required: No
- reason: task detail 右列の表示文言整形のみで、仕様境界やレイヤー構造を変えない

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260308-progress-voice-log-rendering

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260308-progress-voice-log-rendering.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `Guide` 系の progress log を、管理人らしいやわらかい前置きで render 時に整形する helper を追加
  - 根拠: `dispatch / reroute / to_gate / replan_required / replanned / resubmit / plan_completed` ごとに tone を分けた
- AC-02:
  - 変更: `Resident` 系の `worker_runtime` を、住人らしい簡潔な途中メモへ整形
  - 根拠: resident 発話は短く、手元の進捗が分かる文に寄せた
- AC-03:
  - 変更: `Gate` 系の `gate_review` を、古参住人らしい短く含みのある語り口へ整形
  - 根拠: approve/reject で tone を分けた
- AC-04:
  - 変更: E2E に `reroute / replan_required / replanned` を含む会話ログ表示確認を追加
  - 根拠: render 時の tone 差を action 単位で固定した
- AC-05:
  - 変更: targeted verify を実施予定
  - 根拠: UI 文言整形は E2E と validator で十分確認できる

# delta-verify

## Delta ID
- DR-20260308-progress-voice-log-rendering

## Verify Profile
- static check: `node --check wireframe/app.js`, `node --check tests/e2e/workspace-layout.spec.js`
- targeted unit: Not required
- targeted integration / E2E: `npx playwright test tests/e2e/workspace-layout.spec.js -g "task detail drawer renders conversation log timeline|task detail conversation log applies progress voice per actor|task progress log stores dispatch and gate flow entries|job board supports gate flow"`
- project-validator: `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | Guide 系ログが「では、この件はひとまず」「いったん段取りを見直した方がよさそうです」などの管理人 tone で表示されることを E2E で確認した |
| AC-02 | PASS | Resident 系の `worker_runtime` が「ひとまず、〜」の簡潔な途中メモで表示されることを E2E で確認した |
| AC-03 | PASS | Gate 系の `gate_review` が「このままだとまだ甘いかな。」の古参 tone で表示されることを E2E で確認した |
| AC-04 | PASS | `reroute / replan_required / replanned` を含む会話ログ表示を E2E で確認した |
| AC-05 | PASS | targeted Playwright と `node scripts/validate_delta_links.js --dir .` が PASS した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- なし

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
- DR-20260308-progress-voice-log-rendering

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的: task detail 右列の conversation log 本文を `Progress Voice` に沿った語り口へ寄せた
- 変更対象: `wireframe/app.js`、`tests/e2e/workspace-layout.spec.js`、`docs/plan.md`、本 delta 記録
- 非対象: progress log schema、新 actionType、resident identity 再編集、routing/orchestrator ロジック変更、UI レイアウト大改変

## 実装記録
- 変更ファイル:
  - `wireframe/app.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/plan.md`
  - `docs/delta/DR-20260308-progress-voice-log-rendering.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS
  - AC-05 PASS

## 検証記録
- verify要約: Guide / Resident / Gate の tone 差を render 時に反映し、task detail 右列で conversation-like timeline として読めることを確認した
- 主要な根拠:
  - static check PASS
  - targeted Playwright 12件 PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- なし

## 次のdeltaへの引き継ぎ（任意）
- `SEED-20260308-reroute-replan-real-observation`
