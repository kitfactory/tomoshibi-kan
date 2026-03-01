# PalPal-Hive

要件とは（レビュー者視点）＋ Given/When/Done ＋ MSG/ERR のID管理  
※I/F詳細・API使用は書かない

## 命名整合ルール（Domain/UI）
- Domainの正規名は `Plan` / `Task` / `Job` とする。
- UI表示名は `Plan Card` / `Task Card` / `Job` とする。
- 本書ではユーザー向け可読性を優先し、画面文脈ではUI表示名を使用する。

# 要件一覧（Requirements）
| ID | 要件（固定書式・正常系のみ） | 関連UC-ID |
|---|---|---|
| REQ-0001 | 相談文を送信したら、GuideがPlan Cardを提示する。 | UC-1 |
| REQ-0002 | 承認済みPlanを配布したら、Task CardをPalへ割り当てる。 | UC-2 |
| REQ-0003 | PalがTaskを完了したら、Completion Ritualを保存してGateへ提出する。 | UC-3 |
| REQ-0004 | Gateが提出物を判定したら、ApproveまたはRejectを記録する。 | UC-4 |
| REQ-0005 | RejectされたTaskを再作業したら、再提出できる。 | UC-5 |
| REQ-0006 | Workspaceを開いたら、Guide Chat/Pal List/Job/Task Board/Event Log/SettingsをTab切替表示できる。 | UC-6 |
| REQ-0007 | Palが実行操作を開始したら、制約違反操作を実行前にブロックする。 | UC-3 |
| REQ-0008 | 最終TaskがApproveされたら、Guideが完了通知を投稿しPlanを完了状態へ更新する。 | UC-7 |
| REQ-0009 | Jobを実行・提出したら、Task同様にGate判定と差し戻し再提出を運用できる。 | UC-8 |
| REQ-0010 | Settingsでモデル/CLIツール/Skill/Pal設定を編集でき、SkillはClawHub検索＋擬似Download導線で登録できる。 | UC-9, UC-10 |

### [PPH-0001] 相談文を送信したら、GuideがPlan Cardを提示する。
Given: Guideが利用可能で、ユーザーが相談セッションを開始している  
When: ユーザーが相談文を送信する  
Done: GuideMessageとPlanCardが保存され、Guide ChatにPlan Cardが表示される

#### エラー分岐（REQ-0001の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0001 | 相談文が空または入力制約を超過する | 入力内容を修正して再送信する | MSG-PPH-1001 |
| ERR-PPH-0002 | Plan生成処理がタイムアウトする | 再試行する | MSG-PPH-1002 |

### [PPH-0002] 承認済みPlanを配布したら、Task CardをPalへ割り当てる。
Given: PlanCardが `approved` で、割当候補Palが存在する  
When: GuideがDispatchを実行する  
Done: TaskCardが作成され、各Taskが `assigned` でTask Boardへ表示される

#### エラー分岐（REQ-0002の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0003 | 割当可能なPalが存在しない | Pal設定を見直すか手動割当する | MSG-PPH-1004 |
| ERR-PPH-0004 | Task配布結果の保存に失敗する | 保存先を確認して再実行する | MSG-PPH-1003 |

### [PPH-0003] PalがTaskを完了したら、Completion Ritualを保存してGateへ提出する。
Given: TaskCardが `assigned` または `in_progress` で、Palが担当に一致する  
When: Palが作業完了として提出を実行する  
Done: CompletionRitualが保存され、TaskCardが `to_gate` へ遷移する

#### エラー分岐（REQ-0003の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0005 | Completion RitualのEvidenceまたはReplayが不足している | 必須項目を補完して再提出する | MSG-PPH-1001 |
| ERR-PPH-0006 | Completion Ritualの保存に失敗する | 保存先を確認して再提出する | MSG-PPH-1003 |

### [PPH-0004] Gateが提出物を判定したら、ApproveまたはRejectを記録する。
Given: TaskCardが `to_gate` で、CompletionRitualが紐づいている  
When: Gateが判定を実行する  
Done: GateResultが保存され、Approve時はTaskCardが `done`、Reject時は `rejected` になる

#### エラー分岐（REQ-0004の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0007 | palpal-core判定呼び出しがタイムアウトまたは失敗する | 再試行する | MSG-PPH-1002 |
| ERR-PPH-0008 | Reject理由が3件超となる | 上限制約内に修正して再判定する | MSG-PPH-1007 |

### [PPH-0005] RejectされたTaskを再作業したら、再提出できる。
Given: TaskCardが `rejected` で、修正条件が付与されている  
When: Palが修正後に再提出を実行する  
Done: TaskCardが再び `to_gate` へ遷移し、Gate再判定待ちになる

#### エラー分岐（REQ-0005の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0009 | 再提出処理がタイムアウトする | 再提出を再実行する | MSG-PPH-1002 |
| ERR-PPH-0010 | Task状態が `rejected` 以外で再提出しようとする | Task状態を確認して再操作する | MSG-PPH-1006 |

### [PPH-0006] Workspaceを開いたら、Tab切替で各機能を表示する。
Given: ユーザーがアプリにアクセスできる  
When: Workspaceを表示しTabを選択する  
Done: Guide Chat / Pal List / Job / Task Board / Event Log / Settingsのうち、選択した1画面のみが表示される

#### エラー分岐（REQ-0006の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0011 | 初期ロードがタイムアウトする | 再読み込みする | MSG-PPH-1002 |
| ERR-PPH-0012 | Event Logの対象データが見つからない | 対象Task/Jobを再選択する | MSG-PPH-1004 |

### [PPH-0007] Palが実行操作を開始したら、制約違反操作を実行前にブロックする。
Given: Palに制約が定義されている  
When: Palが実行操作を開始する  
Done: 制約違反操作は実行されず、ブロック結果がEvent Logへ記録される

#### エラー分岐（REQ-0007の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0013 | 実行要求がPal制約に違反している | 手順を修正して再実行する | MSG-PPH-1005 |
| ERR-PPH-0014 | Pal制約定義が不正である | 制約設定を修正して再保存する | MSG-PPH-1001 |

### [PPH-0008] 最終TaskがApproveされたら、Guideが完了通知を投稿しPlanを完了状態へ更新する。
Given: Plan配下Taskが存在し、最終未完了Taskが `to_gate` である  
When: Gateが最終TaskをApproveする  
Done: Guide Chatへ完了通知が投稿され、PlanCard.statusが `completed` になる

#### エラー分岐（REQ-0008の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0015 | 最終完了判定時に未完了Taskが残っている | Task状態を再同期して再判定する | MSG-PPH-1008 |
| ERR-PPH-0016 | 完了通知の保存に失敗する | 保存先を確認して再通知する | MSG-PPH-1003 |

### [PPH-0009] Jobを実行・提出したら、Gate判定と再提出を運用できる。
Given: Jobが登録済みで、Palが割り当て済みである  
When: ユーザーがJobを開始/提出/Gate判定/再提出する  
Done: Jobが `assigned -> in_progress -> to_gate -> done/rejected` で遷移し、Event Logへ記録される

#### エラー分岐（REQ-0009の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0017 | Jobが想定外状態で開始/提出/再提出された | Job状態を確認して再操作する | MSG-PPH-1006 |
| ERR-PPH-0018 | Job対象のGate判定保存に失敗する | 保存先を確認して再判定する | MSG-PPH-1003 |

### [PPH-0010] Settingsでランタイム設定とSkill登録を編集できる。
Given: Settingsタブが利用可能である  
When: ユーザーがモデル/CLIツール/Skill/Pal設定を編集し保存する  
Done: 保存結果がPal設定へ反映される。SkillはClawHub検索＋擬似Download導線で追加できる

#### エラー分岐（REQ-0010の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0019 | モデル保存時に必須項目（api_key等）が不足する | 入力を補完して再保存する | MSG-PPH-1001 |
| ERR-PPH-0020 | 未登録ランタイム参照でPal保存しようとする | Settings登録を先に行い再保存する | MSG-PPH-1006 |

## メッセージID管理（MSG-xxxx）
| ID | 文面テンプレ | 出力先 | 発生条件 | 関連REQ/ERR |
|---|---|---|---|---|
| MSG-PPH-0001 | Plan Cardを作成しました。 | Guide Chat | Plan生成成功時 | REQ-0001 |
| MSG-PPH-0002 | TaskをPalへ配布しました。 | Task Board | Dispatch成功時 | REQ-0002 |
| MSG-PPH-0003 | Completion Ritualを保存してGateへ提出しました。 | Task/Job Detail | Ritual提出成功時 | REQ-0003, REQ-0009 |
| MSG-PPH-0004 | Gate判定を記録しました。 | Task Board / Job Board | Gate判定成功時 | REQ-0004, REQ-0009 |
| MSG-PPH-0005 | 差し戻しTaskを再提出しました。 | Task/Job Detail | 再提出成功時 | REQ-0005, REQ-0009 |
| MSG-PPH-0007 | Pal設定を適用しました。 | Pal List / Settings | 設定保存成功時 | REQ-0010 |
| MSG-PPH-0008 | Plan完了を通知しました。 | Guide Chat | 完了通知成功時 | REQ-0008 |
| MSG-PPH-0009 | Guideチャットを更新しました。 | Guide Chat | Guide会話更新時 | REQ-0001 |
| MSG-PPH-1001 | 入力内容を確認してください。 | 対象画面 | 入力不正時 | ERR-PPH-0001, ERR-PPH-0005, ERR-PPH-0014, ERR-PPH-0019 |
| MSG-PPH-1002 | 処理がタイムアウトしました。再試行してください。 | 対象画面 | タイムアウト時 | ERR-PPH-0002, ERR-PPH-0007, ERR-PPH-0009, ERR-PPH-0011 |
| MSG-PPH-1003 | 保存に失敗しました。保存先を確認してください。 | 対象画面 | 永続化失敗時 | ERR-PPH-0004, ERR-PPH-0006, ERR-PPH-0016, ERR-PPH-0018 |
| MSG-PPH-1004 | 対象データが見つかりません。 | 対象画面 | 対象なし時 | ERR-PPH-0003, ERR-PPH-0012 |
| MSG-PPH-1005 | セーフティ制約により操作をブロックしました。 | Task/Job Detail | 制約違反時 | ERR-PPH-0013 |
| MSG-PPH-1006 | 現在の状態ではその操作は実行できません。 | 対象画面 | 状態不整合時 | ERR-PPH-0010, ERR-PPH-0017, ERR-PPH-0020 |
| MSG-PPH-1007 | Reject入力が上限制約を超えています。 | Gate Panel | Reject上限制約違反時 | ERR-PPH-0008 |
| MSG-PPH-1008 | 完了判定に不整合があります。状態を再確認してください。 | Guide Chat | 最終完了整合性エラー時 | ERR-PPH-0015 |

## エラーID管理（ERR-xxxx）
| ID | 原因 | 検出条件 | ユーザーアクション | 再試行可否 | 関連MSG-ID | 関連REQ |
|---|---|---|---|---|---|---|
| ERR-PPH-0001 | 相談文バリデーション不一致 | 送信時に空文字または文字数超過を検知 | 入力修正して再送信 | 可 | MSG-PPH-1001 | REQ-0001 |
| ERR-PPH-0002 | Plan生成タイムアウト | Guide応答待機時間超過を検知 | 再実行する | 可 | MSG-PPH-1002 | REQ-0001 |
| ERR-PPH-0003 | 割当先Palなし | Dispatch時に割当候補Pal集合が空 | Pal設定見直しまたは手動割当 | 可 | MSG-PPH-1004 | REQ-0002 |
| ERR-PPH-0004 | 配布結果保存失敗 | Task作成または更新の永続化失敗 | 保存先確認後に再実行 | 可 | MSG-PPH-1003 | REQ-0002 |
| ERR-PPH-0005 | Ritual必須項目不足 | Evidence/Replay欠落を検知 | 必須項目補完後に再提出 | 可 | MSG-PPH-1001 | REQ-0003 |
| ERR-PPH-0006 | Completion Ritual保存失敗 | CompletionRitualの永続化失敗を検知 | 保存先確認後に再提出 | 可 | MSG-PPH-1003 | REQ-0003 |
| ERR-PPH-0007 | Gate判定取得失敗 | palpal-core判定呼出し失敗または超時 | 再試行する | 可 | MSG-PPH-1002 | REQ-0004 |
| ERR-PPH-0008 | Reject制約違反 | 理由数>3を検知 | 制約内へ修正して再判定 | 可 | MSG-PPH-1007 | REQ-0004 |
| ERR-PPH-0009 | 再提出タイムアウト | 再提出処理の待機時間超過を検知 | 再提出を再実行 | 可 | MSG-PPH-1002 | REQ-0005 |
| ERR-PPH-0010 | 再提出状態不整合 | `rejected` 以外で再提出操作を検知 | Task状態を確認して再操作 | 可 | MSG-PPH-1006 | REQ-0005 |
| ERR-PPH-0011 | 初期ロードタイムアウト | Workspace初期読込の超時を検知 | 再読み込みする | 可 | MSG-PPH-1002 | REQ-0006 |
| ERR-PPH-0012 | ログ対象なし | 指定Event/Task/Jobが未存在 | 対象を再選択する | 可 | MSG-PPH-1004 | REQ-0006 |
| ERR-PPH-0013 | Pal制約違反 | 実行前チェックで禁止操作を検知 | 手順を修正して再実行 | 可 | MSG-PPH-1005 | REQ-0007 |
| ERR-PPH-0014 | 制約定義不正 | 制約保存時に形式不一致を検知 | 制約設定を修正して再保存 | 可 | MSG-PPH-1001 | REQ-0007 |
| ERR-PPH-0015 | 完了判定不整合 | 最終Task承認時に未完了Task残存を検知 | Task状態を再同期して再判定 | 可 | MSG-PPH-1008 | REQ-0008 |
| ERR-PPH-0016 | 完了通知保存失敗 | Guide通知メッセージの永続化失敗 | 保存先確認後に再通知 | 可 | MSG-PPH-1003 | REQ-0008 |
| ERR-PPH-0017 | Job状態不整合 | Jobに対し不正遷移操作を検知 | Job状態を確認して再操作 | 可 | MSG-PPH-1006 | REQ-0009 |
| ERR-PPH-0018 | Job判定保存失敗 | Job向けGateResult保存に失敗 | 保存先確認後に再判定 | 可 | MSG-PPH-1003 | REQ-0009 |
| ERR-PPH-0019 | Settings必須項目不足 | モデル保存時にapi_key等が空 | 必須項目を補完して再保存 | 可 | MSG-PPH-1001 | REQ-0010 |
| ERR-PPH-0020 | Runtime参照不整合 | 未登録モデル/CLIツールでPal保存を検知 | 参照先を登録後に再保存 | 可 | MSG-PPH-1006 | REQ-0010 |

## 画面情報設計（MVP最小）

### 画面一覧
| 画面ID | 画面名 | 目的 | 関連REQ |
|---|---|---|---|
| SCR-WS-001 | Guide Chat Tab | 相談とGuide応答を扱う | REQ-0001, REQ-0008 |
| SCR-WS-002 | Pal List Tab | Palプロフィールを管理する | REQ-0010 |
| SCR-WS-003 | Job Tab | 定期タスク（Job）を運用する | REQ-0009 |
| SCR-WS-004 | Task Board Tab | Task進捗を運用する | REQ-0002, REQ-0003, REQ-0005 |
| SCR-WS-005 | Event Log Tab | イベント履歴を確認する | REQ-0006 |
| SCR-WS-006 | Settings Tab | モデル/CLI/Skill/言語設定を管理する | REQ-0010 |
| SCR-WS-007 | Task Detail Panel | 選択Taskの詳細・提出情報・差し戻し条件を確認する | REQ-0003, REQ-0005 |
| SCR-WS-008 | Gate Panel | 判定結果（Approve/Reject）と理由を入力する | REQ-0004, REQ-0009 |

### 各画面の表示項目（必須）
| 画面/ブロック | 表示項目（最低限） |
|---|---|
| Guide Chat | timestamp, sender(user/guide/system), message, plan_status |
| Pal List | pal_id, role, runtime_kind, runtime_ref, skills, status |
| Job Tab | job_id, title, schedule, instruction, status, pal_id, last_run |
| Task Board | task_id, title, status, pal_id, updated_at, gate_decision_summary |
| Event Log | timestamp, event_type, target_id(task/job), result, summary |
| Settings / Model | provider, model_name, api_key, base_url |
| Settings / CLI Tool | tool_name |
| Settings / Skill | installed_skills, clawhub_search_query, download_action(擬似) |

### 設定メニュー階層（MVP）
| 階層 | 設定項目 | 操作 | 備考 |
|---|---|---|---|
| 設定 > Language | locale(ja/en) | 選択/保存 | UI言語切替 |
| 設定 > Models | provider, model_name, api_key, base_url | 追加/削除 | モデル名は登録済み候補から選択 |
| 設定 > CLI Tools | tool_name(Codex/ClaudeCode/OpenCode) | 追加/削除 | 固定候補 |
| 設定 > Skills | skill_id, name, source, description | 検索/Download(擬似)/削除 | ClawHub検索導線 |
| 設定 > Pal Profiles | display_name, role, runtime(model/tool), runtime_ref, skills | 編集/保存/削除 | Runtimeがtool時はSkill無効 |

### デザインテイスト（MVP）
- トーン: 洗練されたオフィス系の透明感。白基調、可読性優先。
- レイアウト: Workspace Tab切替。Task Detail/Gateはオーバーレイ表示。
- UI基盤: `Tailwind CSS` + `daisyUI` + `CSS Variables`。
- ガイドキャラクター: Guide Chatで前景表示するが、入力欄と重ならない安全領域を確保する。
- エラー表示: 下部から入るトーストで通知し、致命色に寄せすぎない。

### i18n / UIメッセージID管理（MVP）
- UI文言は `UI-PPH-xxxx` で管理する。
- ロケールは `ja-JP` 既定、`en-US` 同時管理（未翻訳は `ja-JP` フォールバック）。
- 操作結果/エラー通知は `MSG-PPH-xxxx` を使用し、UIラベルIDと混在させない。

### Task/Job Board方針（MVP）
- ソート/フィルタは複雑機能を持たず、`updated_at` 降順を基本とする。
- 運用実績に応じて次フェーズで拡張する。

### Event Log方針（暫定）
- 表示件数は直近 `50` 件固定（MVP暫定）。
- 検索/ページング/保持期間の調整は実利用後に再定義する。
