# concept.md（必ず書く：最新版）
#1.概要（Overview）（先頭固定）
- 作るもの（What）:
  `Tomoshibi-kan / 灯火館`。ユーザー相談を `Guide` が計画化し、`Pal` が実行し、`Gate` が `palpal-core` 判定で承認するデスクトップアプリ。`Guide` / `Gate` / `Pal` は role ごとに複数 profile を持てる。
- ブランド文（Brand Statement）:
  `Tomoshibi-kan` は、作り、築き、想像する人たちが一つ屋根の下に集う、温かな灯りの館である。`Tomoshibi-kan — a house of warm lights where creators gather.` 仕事、暮らし、物語が同じ場所で静かにつながる、温かみと知性を両立したローカル志向の作業環境を目指す。
- 解決すること（Why）:
  相談から実行完了までの分担・承認基準・差し戻しループを一貫化し、再現可能な運用を作る。
- できること（主要機能の要約）:
  Guideチャット、Task/Job配布、Pal実行、Completion Ritual保存、Gate Approve/Reject、差し戻し再提出、進捗ログ表示、設定管理、完了通知。
- 使いどころ（When/Where）:
  ローカル環境で、相談タスクと定期実行ジョブを安全に分担し、承認付きで完了させたい場面。
- 成果物（Outputs）:
  `PlanCard`、`TaskCard`、`JobCard`、`CompletionRitual`、`GateResult`、`Event`、`PalProfile`、`RuntimeConfig`。
- 命名ルール（Domain/UI）:
  Domainの正規名は `Plan` / `Task` / `Job`。UI表示名は `Plan Card` / `Task Card` / `Cron` とする。
- 体験トーン（Experience Tone）:
  全体トーンは「温かみと知性」を両立した、のびのび仕事・研究できる静かな机のような体験とする。`灯火館` は一刻館やトキワ荘のように、創る人たちの親密さと創作の密度が同居する居場所をイメージし、`Guide Chat` / `Project` / `Settings` は親和的で安心感のある表情、`Task Board` / `Cron` / `Gate` / `Event Log` は落ち着きと精度が伝わる表情を優先する。マイクロインタラクションは常時装飾ではなく、`focus / sending / saving / selection / gate review` のような状態連動を優先する。
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
- UI前提: WorkspaceはTab（Guide Chat / 住人一覧 / Cron / Task Board / Event Log / Settings）で切り替える。
- 設定前提: Settingsでモデル、CLIツール、Skill、Pal割当を管理する。
- Skill前提: `ClawHub` を検索し、Download操作でローカル登録する（現段階は擬似導線）。
- セキュリティ前提: Palごとの制約（例: `no_network`、`allowed_paths`、`deny_commands`）を実行前に強制する。
- 非対象（現段階で未対応）: 本物のClawHub配布連携、外部チャット連携、3D本実装。

#4.採用する技術スタック（採用理由つき）
- Electron（Main/Renderer/Preload）: デスクトップで一貫したGuide/Pal/Gate体験を提供できるため。
- TypeScript + React（Renderer、将来実装方針）: 状態遷移中心UIを型安全に実装しやすいため。
- Node.js（PlanExecutionOrchestrator）: Guide/Plan/Task/Job/Gate の `Execution Loop` を一元化できるため。
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
| F-10 | Settingsでモデル/CLIツール/Skill/Guide・Gate・Pal設定を管理する | P-5 | UC-9 |
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
| UC-9 | ユーザー | モデル/CLIツール/Guide・Gate・Pal設定を管理する | Settingsが利用可能 | 1) モデル追加/削除 2) CLIツール追加/削除 3) Guide/Gate/Pal profile の追加・切替 4) Runtime設定保存 | 各 profile が登録済みランタイム参照で保存され、active guide / default gate を切り替えられる | 未登録ランタイムは選択不可 |
| UC-10 | ユーザー | Skillを登録/削除する | Settingsが利用可能 | 1) ClawHub検索 2) Download 3) Skill一覧確認 | SkillがSettings一覧へ反映される | 現段階は擬似Download導線 |

#7.Goals（Goalのみ／ユースケース紐づけ必須）
- G-1: 相談から承認可能なPlan生成までを完結できる（対応: UC-1）
- G-2: 承認後のTask配布を迷いなく実行できる（対応: UC-2）
- G-3: Pal完了提出に必要な証跡を必須化できる（対応: UC-3）
- G-4: Gate判定と差し戻しループを一貫運用できる（対応: UC-4, UC-5）
- G-5: Workspace Tabで進捗と履歴を追跡できる（対応: UC-6）
- G-6: 最終完了をユーザーへ明示通知できる（対応: UC-7）
- G-7: Job（定期タスク）をTask同様に運用できる（対応: UC-8）
- G-8: モデル/CLIツール/Skill と Guide・Gate・Pal profile 設定を一元管理できる（対応: UC-9, UC-10）

#8.基本レイヤー構造（Layering）
| レイヤー | 役割 | 主な処理/データ流れ |
|---|---|---|
| プレゼンテーション層（Electron Renderer） | Tab UIの表示と操作受付 | Guide/Pal/Cron/Task/Event/Settingsの表示切替、入力受付、結果表示 |
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
| PalProfile | id, role, display_name, runtime_kind(model\|tool), runtime_ref, skills[] | Guide/Gate/Pal profile 設定（UC-9 / F-10） |
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
6. Settings（Model/CLI/Guide・Gate・Pal設定）（UC-9）を実装する。
7. Skill管理（ClawHub検索＋擬似Download導線）（UC-10）を実装する。
8. 最終完了通知とPlan完了更新（UC-7）を実装する。

#11.用語集（Glossary）
- Guide: ユーザー相談を受け、Planを作成・配布する窓口エージェント。家庭用/仕事用/研究用など複数 profile を切り替えて使える。
- Worker: Task/Jobを実行し、Completion Ritualを添えてGateへ提出する実行エージェント。ユーザーに見える文脈では「住人」と表現してよい。
- Gate: palpal-core判定根拠でTask/JobをApprove/Rejectする承認エージェント。業務ごとに複数 profile を持ち、既定 gate または対象別 gate を使い分ける。
- Plan Card: 目的・完了条件・制約を持つ実行計画カード。
- Task Card: Palに配布される通常作業カード。
- Job: スケジュールを持つ定期実行カード。
- Runtime: Palが実行時に利用する `LLMモデル` または `CLIツール`。
- Skill: 主にモデル実行時に利用する能力単位。Settingsで登録しPalごとに有効化する。
- ClawHub: Skillの検索・導入元として扱うカタログ。現段階では擬似Download導線のみ実装。

- Execution Loop: `Guide -> Plan -> PlanExecutionOrchestrator -> (Worker -> Gate -> retry)* -> Guide completion` の実行ループ全体を指す概念名。
- PlanExecutionOrchestrator: Plan承認後の Task/Job 配布、Worker 実行、Gate 判定、reject 後の再提出、完了通知までを束ねる実行系責務名。
- Guide Planning Boundary: Guide は valid な `Plan` オブジェクトを作れるまでユーザーとの対話を継続する。valid Plan がない間は後段へ進めない。
- Guide Conversation Boundary: ユーザーが task 化や実行計画化を求めていない通常会話では、Guide は `conversation` 状態に留まり、Plan の内容や task 化を前に出さない。
- Orchestrator Start Boundary: `PlanExecutionOrchestrator` は valid かつ `approved` な Plan を受け取った時だけ開始する。raw 会話文や未確定の計画案からは開始しない。
- Plan Artifact: valid な `plan_ready` を受けた時は、まず `Plan artifact` として保存し、その保存済み artifact を起点に後段の materialize / dispatch を進める。

- Context Handoff Policy: `Execution Loop` 内でどの文脈を次の agent へ渡すかを制御する workspace 方針。既定は `Balanced` とし、生の対話全文ではなく構造化データと要約を優先して引き継ぐ。

- Handoff Summary: `Execution Loop` 内で次の agent に渡すための短い要約。Guide 会話全文ではなく、目的・判断理由・リスク・未解決事項を圧縮して伝える。

- Worker Routing: Task/Job をどの Worker profile へ割り当てるかを決める判断。主に `enabled skills` と `ROLE.md` を見て、必要な能力と仕事の進め方が一致する Worker を選ぶ。

- Gate Routing: 提出物をどの Gate profile へ回すかを決める判断。主に `RUBRIC.md` を見て、その業務・完了条件・評価観点に最も合う Gate を選ぶ。

- Guide-driven Orchestrator: `PlanExecutionOrchestrator` は独立モジュールとして動くが、replan や結果解釈のような LLM が必要な判断では active Guide と同じ model / `SOUL.md` を使う。実行制御は Orchestrator、意味判断は Guide の頭脳で支える。

- Task-centric Progress Log: task/job ごとに途中経過を追える進捗ログ。ユーザーは「依頼した task が今どうなっているか」を確認でき、見た目上は `Guide / 住人 / Gate` が語るが、内部では `Orchestrator` を含む実 actor を保持する。

