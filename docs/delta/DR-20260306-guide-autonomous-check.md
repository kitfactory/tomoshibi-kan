# delta-request

## Delta ID
- DR-20260306-guide-autonomous-check

## 目的
- 実モデル/CLI を用いて Guide 単体の自律確認を行い、対話整理・task/job 分解・worker/gate routing 根拠が期待どおりかを debug record で観測する。

## 変更対象範囲 (In Scope)
- Guide 単体確認に必要な最小の test/scenario runner を追加する。
- 実モデルを使った Guide 実行結果を `orchestration_debug_runs` と CLI (`debug runs/show`) で観測する。
- 観測結果を delta verify に記録する。

## 変更対象外 (Out of Scope)
- Worker/Gate の自律実行確認。
- `ROLE.md / RUBRIC.md` の改善。
- routing ロジック自体の変更。
- full-loop orchestration の確認。

## 受入条件
- DS-01:
  - Given: Guide 用 model が利用可能
  - When: Guide に debug-oriented request を送る
  - Then: Guide runtime が成功し、`guide_chat` debug record が保存される。
- DS-02:
  - Given: Guide の返答と planner 経路
  - When: task/job draft と assignment を確認する
  - Then: trace/fix/verify など debug-purpose に沿う分解または routing 根拠を観測できる。
- DS-03:
  - Given: debug CLI
  - When: `palpal debug runs/show` を実行する
  - Then: Guide input/output/system prompt/handoff metadata を読める。

## Acceptance Criteria
- AC-01: Guide autonomous check 用の最小実行手段が追加される。
- AC-02: 実モデルで `guide_chat` debug record を 1 件以上生成できる。
- AC-03: `debug show` で Guide の input/output/meta を確認できる。
- AC-04: verify に Guide の分解品質と routing 根拠の所見を残せる。

## リスク
- 実モデル availability に依存するため、環境差で再現性が落ちる可能性がある。
- Guide の出力品質評価は定性的になりやすいため、観測ポイントを先に固定する必要がある。

## 未解決事項
- Q-01: Guide autonomous check の runner を Playwright Electron にするか、CLI 経由にするかは apply 時に最小案を選ぶ。

# delta-apply

## Delta ID
- DR-20260306-guide-autonomous-check

## 実装ステータス
- APPLIED

## 変更ファイル
- scripts/run_guide_autonomous_check.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: Playwright Electron を使う `scripts/run_guide_autonomous_check.js` を追加した。
  - 理由: 実モデルで Guide 単体の対話と planner 経路を最小操作で再実行できるようにするため。
- AC-02:
  - 変更点: runner 内で isolated workspace を作り、Guide 用 model を Settings と guide-core profile に結び付けたうえで `requestGuideModelReplyWithFallback()` を直接実行するようにした。
  - 理由: UI 操作の揺れを避けつつ、Guide runtime を実モデルで確実に通すため。
- AC-03:
  - 変更点: run 後に `guide_chat` debug record を workspace DB から読める前提で、既存 `palpal debug runs/show` と組み合わせて観測する形にした。
  - 理由: 新しい debug UI を増やさず、既存 CLI で観測を閉じるため。
- AC-04:
  - 変更点: plan に current/archive の完了記録を追加した。
  - 理由: 次の Orchestrator 段へ進む前に Guide 段の完了を固定するため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: Worker/Gate/full-loop の自律確認、ROLE/RUBRIC 改善、routing ロジック変更は未着手。

# delta-verify

## Delta ID
- DR-20260306-guide-autonomous-check

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `scripts/run_guide_autonomous_check.js` で Guide autonomous check の最小 runner を追加した。 |
| AC-02 | PASS | 実モデルで `guide_chat` debug record を 1 件生成できた。 |
| AC-03 | PASS | `palpal debug runs --stage guide_chat` と `palpal debug show <run_id>` で Guide input/output/meta を確認した。 |
| AC-04 | PASS | verify に Guide の分解品質と routing 根拠の所見を残した。 |

## Guide 所見
- Guide 返答は「まず対象・問題点・ゴール・関連資料を確認したい」という clarification 寄りで、debug guide としての方向は妥当だった。
- 一方で planner は Guide 返答内容ではなく user request から deterministic に task を生成しているため、Guide が追加質問を返しても `TASK-013/014/015` がそのまま作成された。
- routing 自体は debug-purpose profile に沿って `pal-alpha -> pal-beta -> pal-gamma` へ分かれた。
- したがって Guide 単体の runtime は成功しているが、Guide の対話結果と Plan/Task materialization はまだ意味的に連動していない。

## 主要確認
- R-01: `node --check scripts/run_guide_autonomous_check.js`
- R-02: `node scripts/run_guide_autonomous_check.js --workspace <temp-dir>`
- R-03: `set PALPAL_WS_ROOT=<temp-dir> && node cli/palpal.js debug runs --limit 10 --stage guide_chat`
- R-04: `set PALPAL_WS_ROOT=<temp-dir> && node cli/palpal.js debug show <run_id>`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-autonomous-check

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: Guide 単体の自律確認を実モデルで行い、debug DB/CLI で観測する。
- 変更対象: `scripts/run_guide_autonomous_check.js`, `docs/plan.md`
- 非対象: Worker/Gate/full-loop の自律確認、routing ロジック変更、ROLE/RUBRIC 改善

## 反映結果
- 変更ファイル: `scripts/run_guide_autonomous_check.js`, `docs/plan.md`
- AC充足: AC-01/02/03/04 PASS

## 検証記録
- verify要約: script syntax check + real Guide run + debug runs/show observation PASS
- 主因メモ: Guide 返答と planner の task materialization はまだ意味的に結合していない

## 未解決事項
- Guide clarification を受けた時に task creation を保留すべきかは Orchestrator 段の論点として残る。

## 次のdeltaへの引き継ぎ
- Seed-01: `PlanExecutionOrchestrator` が Guide 返答と task/job materialization をどう結び付けるかを `orchestrator-autonomous-check` で確認する。
