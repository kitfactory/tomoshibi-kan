# concept.md（必ず書く：最新版）
#1.概要（Overview）（先頭固定）
- 作るもの（What）:
  `PalPal-Hive`。ユーザー相談を `Guide` が計画化し、`Pal` が実行し、`Gate` が `palpal-core` 判定で承認するデスクトップアプリ。
- 解決すること（Why）:
  相談から実行完了までの分担・承認基準・差し戻しループを一貫化し、再現可能な運用を作る。
- できること（主要機能の要約）:
  Guideチャット、Task/Job配布、Pal実行、Completion Ritual保存、Gate Approve/Reject、差し戻し再提出、進捗ログ表示、設定管理、完了通知。
- 使いどころ（When/Where）:
  ローカル環境で、相談タスクと定期実行ジョブを安全に分担し、承認付きで完了させたい場面。
- 成果物（Outputs）:
  `PlanCard`、`TaskCard`、`JobCard`、`CompletionRitual`、`GateResult`、`Event`、`PalProfile`、`RuntimeConfig`。
- 命名ルール（Domain/UI）:
  Domainの正規名は `Plan` / `Task` / `Job`。UI表示名は `Plan Card` / `Task Card` / `Job` とする。
- 前提（Assumptions）:
  ユーザー向けI/F（見た目・操作）は現行プロトタイプのTab UIを基準とする。内部設計は将来実装方針（UseCase中心・レイヤー分離）を正とする。Skillインストールは当面 `ClawHub` の検索＋擬似Download導線で扱う。

#2.ユーザーの困りごと（Pain）
- P-1: 相談内容を実行可能な計画へ落とし込む手間が大きい。
- P-2: Task/Jobの担当と進捗を追跡しにくい。
- P-3: 完了判定の基準が曖昧で差し戻し理由が不明確になりやすい。
- P-4: 完了後の再現情報が不足し、再作業が発生する。
- P-5: モデル/CLIツール/Skillの運用設定が分散しやすい。

#3.ターゲットと前提環境（詳細）
- 主対象ユーザー: 単独または少人数でタスクを分担する開発者。
- 利用環境: Windows/macOS の Electron デスクトップアプリ。
- 運用前提: ローカルDBにカード・設定・イベントを保存する。
- UI前提: WorkspaceはTab（Guide Chat / Pal List / Job / Task Board / Event Log / Settings）で切り替える。
- 設定前提: Settingsでモデル、CLIツール、Skill、Pal割当を管理する。
- Skill前提: `ClawHub` を検索し、Download操作でローカル登録する（現段階は擬似導線）。
- セキュリティ前提: Palごとの制約（例: `no_network`、`allowed_paths`、`deny_commands`）を実行前に強制する。
- 非対象（現段階で未対応）: 本物のClawHub配布連携、外部チャット連携、3D本実装。

#4.採用する技術スタック（採用理由つき）
- Electron（Main/Renderer/Preload）: デスクトップで一貫したGuide/Pal/Gate体験を提供できるため。
- TypeScript + React（Renderer、将来実装方針）: 状態遷移中心UIを型安全に実装しやすいため。
- Node.js（Main Orchestrator）: Guide/Pal/Gate/Jobのフロー制御を一元化できるため。
- SQLite（ローカル永続化）: MVPで必要なカード・イベント・設定保存を軽量に実現できるため。
- palpal-core（Library + Adapter IF）: Gate判定を将来本実装へ差し替え可能に保つため。
- Tailwind CSS + daisyUI（UI実装）: プロトタイプUI基準の見た目・操作を保ちながら開発速度を確保するため。

#5.機能一覧（Features）
| ID | 機能 | 解決するPain | 対応UC |
|---|---|---|---|
| F-1 | GuideチャットからPlan Cardを生成する | P-1 | UC-1 |
| F-2 | Plan承認後にTaskをPalへ配布する | P-1, P-2 | UC-2 |
| F-3 | PalがTaskを実行しCompletion Ritualを保存する | P-2, P-4 | UC-3 |
| F-4 | Gateがpalpal-core判定でApprove/Rejectする | P-3 | UC-4 |
| F-5 | Reject時にPalへ差し戻し、再提出ループを回す | P-3, P-4 | UC-5 |
| F-6 | Workspaceの各Tabを切り替えて状況を表示する | P-2 | UC-6 |
| F-7 | Pal制約違反操作を実行前にブロックする | P-3 | UC-3 |
| F-8 | 最終完了時にGuideがユーザーへ完了通知する | P-2 | UC-7 |
| F-9 | Job（定期タスク）をPalへ割当し、Gate承認まで運用する | P-2, P-3 | UC-8 |
| F-10 | Settingsでモデル/CLIツール/Skill/Pal設定を管理する | P-5 | UC-9 |
| F-11 | ClawHub検索＋Download導線でSkillを登録/削除する | P-5 | UC-10 |

#6.ユースケース（Use Cases）
| ID | 主体 | 目的 | 前提 | 主要手順（最小操作） | 成功条件 | 例外/制約 |
|---|---|---|---|---|---|---|
| UC-1 | ユーザー | 相談内容を承認可能な計画にする | Guideが利用可能 | 1) 相談送信 2) GuideがPlan提示 3) ユーザーが承認/却下 | Planが `approved` または `rejected` で確定する | 未承認Planは配布不可 |
| UC-2 | Guide | 承認済みPlanをPalへ配布する | Planが `approved` | 1) Taskを生成 2) Palへ割当 3) Task Boardへ反映 | Taskが `assigned` になる | 割当不可Taskは配布不可 |
| UC-3 | Pal | 担当Taskを完了して提出する | Taskが `assigned` または `in_progress` | 1) 作業 2) Completion Ritual保存 3) Gateへ提出 | Taskが `to_gate` になる | Evidence/Replay欠落は提出不可、制約違反操作はブロック |
| UC-4 | Gate | 提出物を判定する | Taskが `to_gate` | 1) Ritual受理 2) 判定 3) Approve/Reject返却 | Approveで `done`、Rejectで `rejected` になる | Reject時は理由と修正条件を付与する |
| UC-5 | Pal | RejectされたTaskを再提出する | Taskが `rejected` | 1) 修正実施 2) 再提出 3) Gate再判定待ち | Taskが `to_gate` に戻る | `rejected` 以外では再提出不可 |
| UC-6 | ユーザー | Workspaceで進捗を追跡する | アプリが起動済み | 1) Tab切替 2) 対象カード確認 3) Event確認 | 各Tabの内容が切替表示される | 画面内表示は1タブのみアクティブ |
| UC-7 | Guide | 全Task完了をユーザーへ通知する | Plan配下Taskが存在 | 1) 最終Task Approve検知 2) 完了通知投稿 3) Plan完了更新 | Guide Chatに完了通知が表示される | 未完了Taskが残る場合は通知不可 |
| UC-8 | ユーザー/Guide | Jobを定期運用しGate判定まで回す | Jobが登録済み | 1) Job実行 2) 提出 3) Gate判定 4) 必要時再提出 | Jobが `done` または `rejected` で確定する | Taskと同等の状態遷移制約を適用 |
| UC-9 | ユーザー | モデル/CLIツール/Pal設定を管理する | Settingsが利用可能 | 1) モデル追加/削除 2) CLIツール追加/削除 3) Pal Runtime設定保存 | Palが登録済みランタイム参照で保存される | 未登録ランタイムは選択不可 |
| UC-10 | ユーザー | Skillを登録/削除する | Settingsが利用可能 | 1) ClawHub検索 2) Download 3) Skill一覧確認 | SkillがSettings一覧へ反映される | 現段階は擬似Download導線 |

#7.Goals（Goalのみ／ユースケース紐づけ必須）
- G-1: 相談から承認可能なPlan生成までを完結できる（対応: UC-1）
- G-2: 承認後のTask配布を迷いなく実行できる（対応: UC-2）
- G-3: Pal完了提出に必要な証跡を必須化できる（対応: UC-3）
- G-4: Gate判定と差し戻しループを一貫運用できる（対応: UC-4, UC-5）
- G-5: Workspace Tabで進捗と履歴を追跡できる（対応: UC-6）
- G-6: 最終完了をユーザーへ明示通知できる（対応: UC-7）
- G-7: Job（定期タスク）をTask同様に運用できる（対応: UC-8）
- G-8: モデル/CLIツール/Skill設定を一元管理できる（対応: UC-9, UC-10）

#8.基本レイヤー構造（Layering）
| レイヤー | 役割 | 主な処理/データ流れ |
|---|---|---|
| プレゼンテーション層（Electron Renderer） | Tab UIの表示と操作受付 | Guide/Pal/Job/Task/Event/Settingsの表示切替、入力受付、結果表示 |
| アプリケーション層（Use Cases） | フロー手順実行と状態遷移制御 | Plan/Task/Jobのライフサイクル、Gate判定、設定管理、Skill登録処理 |
| ドメイン層（Entities/Policies） | 不変条件・状態遷移・制約を保持 | Task/Job状態遷移、Ritual必須項目、Runtime整合、Pal制約検証 |
| 連携層（Adapter/Gateway） | 外部連携の抽象化 | palpal-core判定、モデルプロバイダー、SkillCatalog（ClawHub擬似） |
| インフラ層（Persistence/IPC） | 永続化と実行基盤 | SQLite保存、Event記録、Electron IPC配線 |

#9.主要データクラス（Key Data Classes / Entities）
| データクラス | 主要属性（不要属性なし） | 用途（対応UC/Feature） |
|---|---|---|
| PlanCard | id, goal, status(proposed\|approved\|rejected\|completed) | 計画管理（UC-1, UC-7 / F-1, F-8） |
| TaskCard | id, plan_id, title, description, pal_id, status(assigned\|in_progress\|to_gate\|rejected\|done) | Task運用（UC-2〜UC-5 / F-2〜F-5） |
| JobCard | id, title, schedule, instruction, pal_id, status(assigned\|in_progress\|to_gate\|rejected\|done) | 定期実行運用（UC-8 / F-9） |
| PalProfile | id, role, display_name, runtime_kind(model\|tool), runtime_ref, skills[] | Pal設定（UC-9 / F-10） |
| ModelConfig | name, provider, api_key, base_url | モデル設定（UC-9 / F-10） |
| CliToolConfig | tool_name | CLIツール設定（UC-9 / F-10） |
| SkillConfig | id, name, source, mount_point | Skill設定（UC-10 / F-11） |
| CompletionRitual | id, target_id(task/job), evidence, replay | 完了証跡（UC-3, UC-8 / F-3, F-9） |
| GateResult | id, target_id(task/job), decision, reasons[], fix_condition | 判定結果（UC-4, UC-8 / F-4, F-9） |
| Event | id, event_type, target_id, timestamp, result, summary | 進捗ログ（UC-6 / F-6） |

#10.機能部品の実装順序（Implementation Order）
1. Electron基盤、Tab UI骨格、SQLite保存基盤を構築する。
2. Plan/Task/Jobの状態遷移ルールを実装する。
3. GuideチャットとPlan生成/承認（UC-1）を実装する。
4. Task配布、Pal実行、Gate判定、再提出（UC-2〜UC-5）を実装する。
5. Job運用フロー（実行→提出→判定→再提出）（UC-8）を実装する。
6. Settings（Model/CLI/Pal設定）（UC-9）を実装する。
7. Skill管理（ClawHub検索＋擬似Download導線）（UC-10）を実装する。
8. 最終完了通知とPlan完了更新（UC-7）を実装する。

#11.用語集（Glossary）
- Guide: ユーザー相談を受け、Planを作成・配布する窓口エージェント。
- Pal: Task/Jobを実行し、Completion Ritualを添えてGateへ提出する実行エージェント。
- Gate: palpal-core判定根拠でTask/JobをApprove/Rejectする承認エージェント。
- Plan Card: 目的・完了条件・制約を持つ実行計画カード。
- Task Card: Palに配布される通常作業カード。
- Job: スケジュールを持つ定期実行カード。
- Runtime: Palが実行時に利用する `LLMモデル` または `CLIツール`。
- Skill: 主にモデル実行時に利用する能力単位。Settingsで登録しPalごとに有効化する。
- ClawHub: Skillの検索・導入元として扱うカタログ。現段階では擬似Download導線のみ実装。
