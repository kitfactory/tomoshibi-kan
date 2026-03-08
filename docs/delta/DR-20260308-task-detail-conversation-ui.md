# delta-request

## Delta ID
- DR-20260308-task-detail-conversation-ui

## 目的
- task 一覧から開く右列 detail を、`Guide / 住人 / 古参住人` の会話として読める task detail conversation log UI に改修する。

## 変更対象（In Scope）
- `wireframe/app.js`
- `wireframe/styles.css`
- `tests/e2e/workspace-layout.spec.js`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- Event Log 全体の redesign
- progress log schema の追加変更
- resident microtests の追加
- LLM による追加要約生成

## 受入条件（Acceptance Criteria）
- AC-01: task を選択すると、右列で progress log が会話タイムラインとして表示される。
- AC-02: `Guide / 住人 / 古参住人` の区別が UI 上で読める。
- AC-03: `replan_required` が右列で会話として読める。
- AC-04: existing task/gate flow の E2E が回帰しない。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-task-detail-conversation-ui

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md

## 適用内容
- `renderDetail()` を非同期化し、既存 `task_progress_logs` から task detail conversation log を描画するように更新した。
- `displayActor / actionType / status / messageForUser` を presentation 用に整形する helper を追加した。
- task detail 右列に `planId / taskId / latest status` を含む概要カードと、会話タイムラインを追加した。
- `wireframe/styles.css` に conversation log の最小スタイルを追加した。
- `tests/e2e/workspace-layout.spec.js` に task detail conversation log の表示確認を追加した。

# delta-verify

## Delta ID
- DR-20260308-task-detail-conversation-ui

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | task detail 右列に progress log が会話タイムラインとして表示されることを E2E で確認した。 |
| AC-02 | PASS | `Guide / 住人 / 古参住人` の actor 区別が UI で読めることを E2E で確認した。 |
| AC-03 | PASS | `replan_required` を含む progress log を会話タイムラインで扱う表示経路を追加した。 |
| AC-04 | PASS | `task progress log stores dispatch and gate flow entries` と `job board supports gate flow` の targeted E2E が回帰していない。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check wireframe/app.js`
- `node --check tests/e2e/workspace-layout.spec.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "task detail drawer renders conversation log timeline|task progress log stores dispatch and gate flow entries|job board supports gate flow"`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-task-detail-conversation-ui

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- task detail 右列に progress log を `Guide / 住人 / 古参住人` の会話タイムラインとして表示する最小 UI を追加した。
- schema 変更や resident microtests には入っていない。
