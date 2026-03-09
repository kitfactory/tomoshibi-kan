# delta-request

## Delta ID
- DR-20260309-task-conversation-flow-hardening

## Delta Type
- FEATURE

## 目的
- 管理人が task を生成した後の流れを、TaskBoard 右列で `管理人 / 住人 / 古参住人` の会話として読めるようにする。
- dispatch 時に「誰に、何をお願いしたか」が分かり、進捗・助言・差し戻し・返却まで一連の会話として見えるようにする。

## 変更対象（In Scope）
- `wireframe/app.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- `docs/plan_archive_2026_03.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- 新しい progress log schema の追加
- resident routing ロジックの変更
- resident の `SOUL.md / ROLE.md / RUBRIC.md` 再編集
- Event Log 全体の redesign

## 受入条件（Acceptance Criteria）
- AC-01: task 生成後の dispatch log に、proper name と依頼内容が含まれる。
- AC-02: task を選択した右列で、dispatch / 進捗 / 古参コメント / 管理人返却が会話として読める。
- AC-03: `replan_required / replanned / resubmit` の分岐でも会話の流れが読める。
- AC-04: task detail は task 対象ログに加えて同じ plan の完了返却も読める。
- AC-05: targeted E2E が回帰しない。
- AC-06: `node scripts/validate_delta_links.js --dir .` が PASS する。

## Review Gate
- required: No
- reason: 既存 progress log の message/render 整形と detail presentation の改善であり、レイヤー境界や data schema の再編を含まない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260309-task-conversation-flow-hardening

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 変更ファイル
- `wireframe/app.js`
- `tests/e2e/workspace-layout.spec.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- `docs/plan_archive_2026_03.md`
- `docs/delta/DR-20260309-task-conversation-flow-hardening.md`

## 適用内容（AC対応）
- AC-01:
  - 変更: dispatch / reroute / to_gate / resubmit の progress log message を resident proper name と task title を使う会話文へ変更した。
  - 根拠: `buildDispatchConversationMessage()` などの helper を追加し、payload に `workerDisplayName`, `gateDisplayName`, `taskTitle` を保持した。
- AC-02:
  - 変更: `worker_runtime`, `gate_review`, `plan_completed` の表示を resident voice に合わせて render するようにした。
  - 根拠: `detailConversationMessage()` が actor/action ごとに resident-facing な自然文を返す。
- AC-03:
  - 変更: `replan_required / replanned / resubmit` も会話として読める文へ整形した。
  - 根拠: task title と created task titles を payload から引いて Guide の見直しコメントに変換した。
- AC-04:
  - 変更: task detail 右列が task log に加えて同じ plan の `plan_completed` 返却も表示するようにした。
  - 根拠: `renderDetail()` で target log と same-plan log をマージして描画する。
- AC-05:
  - 変更: targeted E2E の synthetic payload を更新し、proper name / task title / guide return を検証するケースを追加した。
  - 根拠: `task detail conversation log applies progress voice per actor` と `...shows guide return after plan completion` を更新した。
- AC-06:
  - 変更: validator と整合するよう docs/plan/archive も最小同期した。
  - 根拠: plan current を閉じ、archive summary / archive monthly file へ移動した。

# delta-verify

## Delta ID
- DR-20260309-task-conversation-flow-hardening

## Verify Profile
- static check:
  - `node --check wireframe/app.js`
  - `node --check tests/e2e/workspace-layout.spec.js`
- targeted unit: Not required
- targeted integration / E2E:
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "task detail drawer renders conversation log timeline|task detail conversation log applies progress voice per actor|task detail conversation log shows guide return after plan completion|task progress log stores dispatch and gate flow entries|job board supports gate flow"`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | dispatch / reroute の会話ログが固有名と依頼内容を含むことを targeted Playwright で確認した |
| AC-02 | PASS | task detail 右列で dispatch / worker progress / gate comment が会話として読めることを targeted Playwright で確認した |
| AC-03 | PASS | `replan_required / replanned / resubmit` を含む会話ログが連続して読めることを targeted Playwright で確認した |
| AC-04 | PASS | same-plan の `plan_completed` 返却が task detail 右列に統合表示されることを targeted Playwright で確認した |
| AC-05 | PASS | targeted Playwright 15件が PASS した |
| AC-06 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

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
- DR-20260309-task-conversation-flow-hardening

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的: TaskBoard 右列で dispatch から plan completed 返却までを resident の会話として読めるようにした。
- 変更対象: `wireframe/app.js`、`tests/e2e/workspace-layout.spec.js`、`docs/spec.md`、`docs/architecture.md`、`docs/plan.md`、`docs/plan_archive_2026_03.md`、本 delta 記録
- 非対象: progress log schema 追加、resident routing 変更、resident identity 再編集、Event Log redesign

## 実装記録
- 変更ファイル:
  - `wireframe/app.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
  - `docs/plan_archive_2026_03.md`
  - `docs/delta/DR-20260309-task-conversation-flow-hardening.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS
  - AC-05 PASS
  - AC-06 PASS

## 検証記録
- verify要約: dispatch / progress / gate / replan / completion を、proper name と task content を含む resident-facing な会話として TaskBoard 右列へ描画できることを確認した。
- 主要な根拠:
  - `node --check wireframe/app.js` PASS
  - `node --check tests/e2e/workspace-layout.spec.js` PASS
  - targeted Playwright 15件 PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- なし
