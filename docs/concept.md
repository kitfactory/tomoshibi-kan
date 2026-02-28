# concept.md（必ず書く：最新版）
#1.概要（Overview）（先頭固定）
- 作るもの（What）：
  `PalPal-Hive`。ユーザー相談を `Guide` が計画化し、`Pal` が実行し、`Gate` が `palpal-core` 判定で承認する Electron デスクトップアプリ。
- 解決すること（Why）：
  相談から実行完了までの分担と判定基準を一貫化し、差し戻しを含む完了ループを明確にする。
- できること（主要機能の要約）：
  Guideチャット、Plan承認、Task配布、Pal実行、Completion Ritual保存、Gate Approve/Reject、差し戻し再提出、進捗ログ表示、完了通知。
- 使いどころ（When/Where）：
  ローカル環境で、相談タスクを安全に分担し、承認付きで完了させたい場面。
- 成果物（Outputs）：
  `PlanCard`、`TaskCard`、`CompletionRitual`、`GateResult`、`Event`。
- 命名ルール（Domain/UI）：
  Domainの正規名は `Plan` / `Task`、UI表示名は `Plan Card` / `Task Card` とする。
- 前提（Assumptions）：
  MVPは単一ユーザー運用、ローカル保存、Guide/Pal/Gateフロー成立を最優先とする。Kaizen・Provider管理・高度設定は後続拡張とする。

#2.ユーザーの困りごと（Pain）
- P-1: 相談内容を実行可能な計画へ落とし込む手間が大きい。
- P-2: 誰がどのタスクを担当しているか追跡しにくい。
- P-3: 完了判定の基準が曖昧で差し戻し理由が不明確になりやすい。
- P-4: 完了後の再現情報が不足し、再作業が発生する。

#3.ターゲットと前提環境（詳細）
- 主対象ユーザー: 単独または少人数でタスクを分担する開発者。
- 利用環境: Windows/macOS の Electron デスクトップアプリ。
- 運用前提: ローカルDBにカードとイベントを保存する。
- 起動前提: 起動時に `Pal` 一覧（persona/skills/constraints）を読み込み、Guideの割当判断で参照可能にする。
- セキュリティ前提: Palごとの制約（例: `no_network`、`allowed_paths`、`deny_commands`）を実行前に強制する。
- 非対象（MVP外）: Kaizen運用、Provider/モデル管理、APIキー補完、3D演出、外部チャット連携。

#4.採用する技術スタック（採用理由つき）
- Electron（Main/Renderer/Preload）: デスクトップで一貫したGuide/Pal/Gate体験を提供できるため。
- TypeScript + React（Renderer）: 状態遷移中心のUIを型安全に実装しやすいため。
- Node.js（Main Orchestrator）: Guide/Pal/Gateのフロー制御を一元化できるため。
- SQLite（ローカル永続化）: MVPで必要なカード・イベント保存を軽量に実現できるため。
- palpal-core（Library + Adapter IF）: Gate判定を将来本実装へ差し替え可能に保つため。
- Zod（スキーマ検証）: Card/Result/Eventの必須項目を実行時検証するため。

#5.機能一覧（Features）
| ID | 機能 | 解決するPain | 対応UC |
|---|---|---|---|
| F-1 | GuideチャットからPlan Cardを生成する | P-1 | UC-1 |
| F-2 | Plan承認後にTaskをPalへ配布する | P-1, P-2 | UC-2 |
| F-3 | PalがTaskを実行しCompletion Ritualを保存する | P-2, P-4 | UC-3 |
| F-4 | Gateがpalpal-core判定でApprove/Rejectする | P-3 | UC-4 |
| F-5 | Reject時にPalへ差し戻し、再提出ループを回す | P-3, P-4 | UC-4 |
| F-6 | Guide Chat / Task Board / Event Logを表示する | P-2 | UC-5 |
| F-7 | Pal制約違反操作を実行前にブロックする | P-3 | UC-3 |
| F-8 | 最終完了時にGuideがユーザーへ完了通知する | P-2 | UC-6 |

#6.ユースケース（Use Cases）
| ID | 主体 | 目的 | 前提 | 主要手順（最小操作） | 成功条件 | 例外/制約 |
|---|---|---|---|---|---|---|
| UC-1 | ユーザー | 相談内容を承認可能な計画にする | Guideが利用可能 | 1) 相談送信 2) GuideがPlan提示 3) ユーザーが承認/却下 | Planが `approved` または `rejected` で確定する | 未承認Planは配布不可 |
| UC-2 | Guide | 承認済みPlanをPalへ配布する | Planが `approved` | 1) Taskを生成 2) Palへ割当 3) Task Boardへ反映 | Taskが `assigned` になる | 割当不可Taskは配布不可 |
| UC-3 | Pal | 担当Taskを完了して提出する | Taskが `assigned` | 1) 作業 2) Completion Ritual保存 3) Gateへ提出 | Taskが `to_gate` になる | Evidence/Replay欠落は提出不可、制約違反操作はブロック |
| UC-4 | Gate | 提出物を判定してループ制御する | Taskが `to_gate` | 1) Ritual受理 2) 判定 3) Approve/Reject返却 | Approveで `done`、Rejectで `rejected` になる | Reject時は理由と修正条件を付与する |
| UC-5 | ユーザー | 実行状況を追跡する | Eventが保存されている | 1) Task選択 2) Task状態確認 3) Event Log確認 | 現在状態と直近履歴を確認できる | 監査詳細は必要時のみ展開 |
| UC-6 | Guide | 全Task完了をユーザーへ通知する | Plan配下Taskが存在する | 1) 最終TaskのApprove検知 2) 完了通知を投稿 3) Plan完了更新 | Guide Chatに完了通知が表示される | 未完了Taskが残る場合は通知不可 |

#7.Goals（Goalのみ／ユースケース紐づけ必須）
- G-1: 相談から承認可能なPlan生成までを完結できる（対応：UC-1）
- G-2: 承認後のTask配布を迷いなく実行できる（対応：UC-2）
- G-3: Pal完了提出に必要な証跡を必須化できる（対応：UC-3）
- G-4: Gate判定と差し戻しループを一貫運用できる（対応：UC-4）
- G-5: 進捗と履歴を同一ワークスペースで追跡できる（対応：UC-5）
- G-6: 最終完了をユーザーへ明示通知できる（対応：UC-6）

#8.基本レイヤー構造（Layering）
| レイヤー | 役割 | 主な処理/データ流れ |
|---|---|---|
| プレゼンテーション層（Electron Renderer） | Guide Chat / Task Board / Event Log の表示と操作受付 | ユーザー入力をApplication層へ渡し、返却状態を表示する |
| アプリケーション層（Orchestration Use Cases） | Guide→Pal→Gateフローの手順実行と状態遷移制御 | Plan承認、Task配布、Pal提出、Gate判定、完了通知を順序制御する |
| ドメイン層（Entities/Policies） | Card整合性、必須項目、遷移制約、Pal制約を保持 | Completion Ritual必須項目検証、Approve/Reject遷移、差し戻し条件検証を行う |
| セーフティ連携層（palpal-core Adapter） | Gate判定入力/出力の標準化 | 判定結果を `GateResult` へ正規化する |
| インフラ層（Persistence/Logging） | SQLite保存とEvent記録 | Plan/Task/Ritual/Result/Eventを永続化し、ログ表示へ供給する |

#9.主要データクラス（Key Data Classes / Entities）
| データクラス | 主要属性（不要属性なし） | 用途（対応UC/Feature） |
|---|---|---|
| UserMessage | id, text | 相談入力の保存（UC-1 / F-1） |
| GuideMessage | id, text | Guide応答と完了通知の保存（UC-1, UC-6 / F-1, F-8） |
| PlanCard | id, goal, status(proposed\|approved\|rejected\|completed) | 承認対象計画と完了状態管理（UC-1, UC-6 / F-1, F-2, F-8） |
| TaskCard | id, plan_id, title, description, pal_id, status(assigned\|in_progress\|to_gate\|rejected\|done) | Pal作業単位と進捗管理（UC-2, UC-3, UC-4 / F-2, F-3, F-4, F-5） |
| Pal | id, persona, skills[], constraints[] | Pal割当判断と制約判定（UC-2, UC-3 / F-2, F-7） |
| CompletionRitual | id, task_id, evidence, replay | 完了証跡の保存（UC-3 / F-3） |
| GateResult | id, task_id, decision(approved\|rejected), reasons[], fix_condition | Gate判定結果と差し戻し条件（UC-4 / F-4, F-5） |
| Event | id, event_type, target_id, timestamp | 進捗ログ表示の元データ（UC-5 / F-6） |

#10.機能部品の実装順序（Implementation Order）
1. Electron基盤とSQLite保存基盤を構築する。
2. PlanCard/TaskCardの状態遷移ルールを実装する。
3. GuideチャットとPlan生成/承認（UC-1）を実装する。
4. Task配布とPal割当（UC-2）を実装する。
5. Pal実行とCompletion Ritual提出（UC-3）を実装する。
6. Gate判定と差し戻しループ（UC-4）を実装する。
7. Workspace（Guide Chat/Task Board/Event Log）表示（UC-5）を実装する。
8. 最終完了通知とPlan完了更新（UC-6）を実装する。

#11.用語集（Glossary）
- Guide: ユーザー相談を受け、Planを作成・配布する窓口エージェント。
- Pal: Taskを実行し、Completion Ritualを添えてGateへ提出する実行エージェント。
- Gate: palpal-core判定根拠でTaskをApprove/Rejectする承認エージェント。
- Plan Card: 目的・完了条件・制約を持つ実行計画カード。
- Task Card: Palに配布される実行単位カード。
- Plan / Task: Domain層の正規エンティティ名。UIでは Plan Card / Task Card として表示する。
- Completion Ritual: 完了内容と再現情報（Evidence/Replay）を含む提出記録。
- Gate Result: Gate判定の結果と差し戻し条件を持つ記録。
- Event Log: フロー進行と状態変更の履歴ログ。
