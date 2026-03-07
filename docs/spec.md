# Tomoshibi-kan

要件とは（レビュー者視点）＋ Given/When/Done ＋ MSG/ERR のID管理  
※I/F詳細・API使用は書かない

## 命名整合ルール（Domain/UI）
- Domainの正規名は `Plan` / `Task` / `Job` とする。
- UI表示名は `Plan Card` / `Task Card` / `Cron` とする。
- 本書ではユーザー向け可読性を優先し、画面文脈ではUI表示名を使用する。

# 要件一覧（Requirements）
| ID | 要件（固定書式・正常系のみ） | 関連UC-ID |
|---|---|---|
| REQ-0001 | 相談文を送信したら、GuideがPlan Cardを提示する。 | UC-1 |
| REQ-0002 | 承認済みPlanを配布したら、Task CardをPalへ割り当てる。 | UC-2 |
| REQ-0003 | PalがTaskを完了したら、Completion Ritualを保存してGateへ提出する。 | UC-3 |
| REQ-0004 | Gateが提出物を判定したら、ApproveまたはRejectを記録する。 | UC-4 |
| REQ-0005 | RejectされたTaskを再作業したら、再提出できる。 | UC-5 |
| REQ-0006 | Workspaceを開いたら、Guide Chat/住人一覧/Cron/Task Board/Event Log/SettingsをTab切替表示できる。 | UC-6 |
| REQ-0007 | Palが実行操作を開始したら、制約違反操作を実行前にブロックする。 | UC-3 |
| REQ-0008 | 最終TaskがApproveされたら、Guideが完了通知を投稿しPlanを完了状態へ更新する。 | UC-7 |
| REQ-0009 | Jobを実行・提出したら、Task同様にGate判定と差し戻し再提出を運用できる。 | UC-8 |
| REQ-0010 | Settingsでモデル/CLIツール/Skill/Guide・Gate・Pal設定を編集でき、Guide/Gate/Pal profile は複数追加・選択でき、SkillはClawHub検索＋擬似Download導線で登録できる。 | UC-9, UC-10 |

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
Done: Guide Chat / 住人一覧 / Cron / Task Board / Event Log / Settingsのうち、選択した1画面のみが表示される

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

### [PPH-0010] Settingsでランタイム設定とGuide・Gate・Pal profile管理を編集できる。
Given: Settingsタブが利用可能で、workspace に Guide/Gate/Pal profile を保存できる  
When: ユーザーがモデル/CLIツール/Skill/Guide・Gate・Pal設定を編集し保存する  
Done: 保存結果が各 profile 設定へ反映される。Guide/Gate/Pal profile は複数追加・選択でき、SkillはClawHub検索＋擬似Download導線で追加できる

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
| MSG-PPH-0003 | Completion Ritualを保存してGateへ提出しました。 | Task/Cron Detail | Ritual提出成功時 | REQ-0003, REQ-0009 |
| MSG-PPH-0004 | Gate判定を記録しました。 | Task Board / Cron Board | Gate判定成功時 | REQ-0004, REQ-0009 |
| MSG-PPH-0005 | 差し戻しTaskを再提出しました。 | Task/Cron Detail | 再提出成功時 | REQ-0005, REQ-0009 |
| MSG-PPH-0007 | Agent設定を適用しました。 | 住人一覧 / Settings | 設定保存成功時 | REQ-0010 |
| MSG-PPH-0008 | Plan完了を通知しました。 | Guide Chat | 完了通知成功時 | REQ-0008 |
| MSG-PPH-0009 | Guideチャットを更新しました。 | Guide Chat | Guide会話更新時 | REQ-0001 |
| MSG-PPH-1001 | 入力内容を確認してください。 | 対象画面 | 入力不正時 | ERR-PPH-0001, ERR-PPH-0005, ERR-PPH-0014, ERR-PPH-0019 |
| MSG-PPH-1002 | 処理がタイムアウトしました。再試行してください。 | 対象画面 | タイムアウト時 | ERR-PPH-0002, ERR-PPH-0007, ERR-PPH-0009, ERR-PPH-0011 |
| MSG-PPH-1003 | 保存に失敗しました。保存先を確認してください。 | 対象画面 | 永続化失敗時 | ERR-PPH-0004, ERR-PPH-0006, ERR-PPH-0016, ERR-PPH-0018 |
| MSG-PPH-1004 | 対象データが見つかりません。 | 対象画面 | 対象なし時 | ERR-PPH-0003, ERR-PPH-0012 |
| MSG-PPH-1005 | セーフティ制約により操作をブロックしました。 | Task/Cron Detail | 制約違反時 | ERR-PPH-0013 |
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
| ERR-PPH-0020 | Runtime参照不整合 | 未登録モデル/CLIツールでGuide/Gate/Pal保存を検知 | 参照先を登録後に再保存 | 可 | MSG-PPH-1006 | REQ-0010 |

## 画面情報設計（MVP最小）

### 画面一覧
| 画面ID | 画面名 | 目的 | 関連REQ |
|---|---|---|---|
| SCR-WS-001 | Guide Chat Tab | 相談とGuide応答を扱う | REQ-0001, REQ-0008 |
| SCR-WS-002 | 住人一覧 Tab | Guide/Gate/住人プロフィールを管理する | REQ-0010 |
| SCR-WS-003 | Cron Tab | 定期タスク（Job）を運用する | REQ-0009 |
| SCR-WS-004 | Task Board Tab | Task進捗を運用する | REQ-0002, REQ-0003, REQ-0005 |
| SCR-WS-005 | Event Log Tab | イベント履歴を確認する | REQ-0006 |
| SCR-WS-006 | Settings Tab | モデル/CLI/Skill と Guide/Gate/Pal設定を管理する | REQ-0010 |
| SCR-WS-007 | Task Detail Panel | 選択Taskの詳細・提出情報・差し戻し条件を確認する | REQ-0003, REQ-0005 |
| SCR-WS-008 | Gate Panel | 判定結果（Approve/Reject）と理由を入力する | REQ-0004, REQ-0009 |

### 各画面の表示項目（必須）
| 画面/ブロック | 表示項目（最低限） |
|---|---|
| Guide Chat | timestamp, sender(user/guide/system), message, plan_status |
| 住人一覧 | pal_id, role, runtime_kind, runtime_ref, skills, status |
| Cron Tab | job_id, title, schedule, instruction, status, pal_id, last_run |
| Task Board | task_id, title, status, pal_id, updated_at, gate_decision_summary |
| Event Log | timestamp, event_type, target_id(task/job), result, summary |
| Settings / Model | provider, model_name, api_key, base_url |
| Settings / CLI Tool | tool_name |
| Settings / Skill | installed_skills, clawhub_search_query, download_action(擬似) |

### 設定メニュー階層（MVP）
| 階層 | 設定項目 | 操作 | 備考 |
|---|---|---|---|
| 設定 > Language | locale(ja/en) | 選択/保存 | UI言語切替 |
| 設定 > Models | provider, model_name, api_key, base_url | 追加/削除 | モデル名は `palpal-core` registry 候補から選択（provider選択に連動、`LM Studio` を含む） |
| 設定 > CLI Tools | tool_name(Codex/ClaudeCode/OpenCode) | 追加/削除 | 固定候補 |
| 設定 > Skills | skill_id, name, source, description | 検索/Download(擬似)/削除 | ClawHub検索導線 |
| 設定 > Pal Profiles | display_name, role, runtime(model/tool), runtime_ref, skills | 編集/保存/削除 | Runtimeがtool時はSkill無効 |

### 設定保存方式（決定）
| 区分 | 保存先 | 取り扱いルール |
|---|---|---|
| 非機密設定（locale, model_name, provider, base_url, tools, skills, pal profile） | SQLite (`SqliteSettingsRepository`) | 通常の設定データとして保存・読込する |
| API_KEY（明示入力値） | OSキーチェーン（Windows Credential Manager / macOS Keychain / libsecret） | 平文でDB保存しない。`secret_ref` のみ設定データへ保持する |

#### 開発既定ランタイム（Guide）
- 開発/テスト既定の model/base_url/provider/api_key は `.env`（`LMSTUDIO_*`）から注入する。
- `.env` 未設定時は `openai/gpt-oss-20b` / `http://192.168.11.16:1234/v1` / `openai` / `lmstudio` をフォールバック値とする。

#### API_KEY入力の扱い（必須）
- API_KEY入力欄は write-only とし、保存済み値を再表示しない。
- 保存時にAPI_KEYが入力された場合のみ SecretStore を更新し、空入力時は既存 secret_ref を維持する。
- モデル削除時は対応する secret_ref とキーチェーン実体を同時削除する。
- Export/ログ/Event Log には API_KEY を含めない（マスク済み状態のみ扱う）。
- Browser単体実行（E2E/file://）では検証用に localStorage fallback を使うが、API_KEY平文は保存しない。

### 実装検証補助（wireframe）
- `runtime-validation.js`: Runtime を `model/tool` 排他で保存する判定を担う。
- `skill-catalog.js`: Skill の検索・追加・削除（重複防止）判定を担う。
- `pal-profile.js`: Pal 追加初期化、Runtime適用、削除可否判定を担う。
- これらは MVP の検証補助であり、将来実装では UseCase + Port へ置換する前提とする。

### デザインテイスト（MVP）
- トーン: 「温かみと知性」を両立した静かな作業環境。暖かさは保ちつつ、運用面では精度と落ち着きを優先する。
- レイアウト: Workspace Tab切替。Task Detail/Gateはオーバーレイ表示。
- UI基盤: `Tailwind CSS` + `daisyUI` + `CSS Variables`。
- ガイドキャラクター: Guide Chatで前景表示するが、入力欄と重ならない安全領域を確保する。常時アニメーションに依存せず、`focus / sending` などの状態に応じて反応する。
- エラー表示: 下部から入るトーストで通知し、致命色に寄せすぎない。

### i18n / UIメッセージID管理（MVP）
- UI文言は `UI-PPH-xxxx` で管理する。
- ロケールは `ja-JP` 既定、`en-US` 同時管理（未翻訳は `ja-JP` フォールバック）。
- 操作結果/エラー通知は `MSG-PPH-xxxx` を使用し、UIラベルIDと混在させない。

### Task/Job Board方針（MVP）
- ソート/フィルタは複雑機能を持たず、`updated_at` 降順を基本とする。
- Task Board の row は `selected / to_gate / rejected` などの運用状態を視覚的に読み分けられること。
- Cron の row は `schedule / last_run / instruction` の順で情報階層を持ち、`last_run` の有無を状態として示すこと。
- Gate Panel は対象 row の選択状態と連動し、判定入力面を他パネルより厳密な見た目で表示すること。
- 運用実績に応じて次フェーズで拡張する。

### Event Log方針（暫定）
- 表示件数は直近 `50` 件固定（MVP暫定）。
- toolbar / pager は filter 結果とページ境界が分かる状態表現を持つこと。
- event row は `event_type` と `result` を視覚的に読み分けられること。
- 検索/ページング/保持期間の調整は実利用後に再定義する。

## 追加仕様 (2026-03-01): Pal Workspace フォルダ契約

### ルート
- `ws-root` は単一ルートで運用する。
- 既定値は OS 別に次の通り。
  - Windows: `%USERPROFILE%\\Documents\\palpal`
  - macOS: `~/Documents/palpal`
  - Linux: `~/Documents/palpal`（`Documents` が存在しない場合は `~/.local/share/palpal`）

### ディレクトリ構造
```text
<ws-root>/
  user.md
  AGENTS.md
  guides/
    guide-<name>/
      SOUL.md
      ROLE.md
      skills.yaml
  gates/
    gate-<name>/
      SOUL.md
      RUBRIC.md
      skills.yaml
  pals/
    pal-<name>/
      SOUL.md
      ROLE.md
      skills.yaml
  skills/
  memory/
  .tomoshibikan/
    state/
    secrets/
    cache/
    logs/
```

### 配置ルール
- `user.md` は Pal 個別フォルダの 1 つ上（`<ws-root>` 直下）に 1 つだけ置く。
- Guide/Worker は `SOUL.md + ROLE.md`、Gate は `SOUL.md + RUBRIC.md` を使う。
- Guide/Worker 作成時は、利用言語（`ja` / `en`）に応じた `SOUL.md + ROLE.md` のテンプレートを初期生成する。
- Gate 作成時は、利用言語（`ja` / `en`）に応じた `SOUL.md + RUBRIC.md` のテンプレートを初期生成する。
- Workspace は 1 つの active guide と 1 つの default gate を持つ。
- Task / Job は必要に応じて `gate_id` を持てる。未指定時は workspace の default gate を使う。
- API_KEY など機密は `.tomoshibikan/secrets` のみで扱い、Markdown 側へ保存しない。
- Git 管理対象は `.tomoshibikan` を除く領域とする。

## 追加仕様 (2026-03-01): PalContextBuilder

### 目的
- Pal 送信前に、利用可能なコンテキスト残量に応じて送信内容を決定する。

### 入力ソース
- `user.md`（共通ユーザー文脈）
- Agent 個別 Markdown（Guide=`guides/guide-*` の `SOUL.md`+`ROLE.md`, Gate=`gates/gate-*` の `SOUL.md`+`RUBRIC.md`, Worker=`pals/pal-*` の `SOUL.md`+`ROLE.md`, `skills.yaml`）
- セッション会話履歴（直近ターン）
- 永続メモリ（`MEMORY.md`, `memory/YYYY-MM-DD.md`）
- スキル定義（`skills/*/SKILL.md`）
- Runtime 情報（model/provider/base_url/runtimeKind）
- 編集対象ファイル断片（必要時）

### skills.yaml 契約（Step1）
- `skills.yaml` は Pal が利用する `enabled_skill_ids` の参照設定のみを保持する。
- Skill の説明文・安全性・評価などの詳細は Settings の「インストール済みスキル台帳」から解決する。
- `runtimeKind="tool"` の場合、`enabled_skill_ids` は保存されていても実行時コンテキストには注入しない。

### 優先度
1. Safety/制約（USER/SOUL/Runtime制約）
2. 現在タスク・直近ユーザー発話
3. 直近会話履歴
4. 永続メモリ要約
5. スキル/MCP/ファイル断片

### token 予算
- `input_budget = model_context_window - reserved_output - safety_margin`
- `reserved_output` は最低 1024 token を確保する。
- `safety_margin` は最低 512 token を確保する。
- 超過時は優先度の低いソースから `truncate -> summarize -> drop` の順で圧縮する。

### 出力
- `messages[]`（system/developer/user）
- `audit`（採用ソース、除外ソース、推定token、圧縮理由、最終input_token）

### エラー
- 必須ソース（Safety/制約）が投入できない場合は送信を中止し、エラーを返す。
- 予算内に収まらない場合は最終的に user 入力のみで送信せず、警告を返す。

## 追加仕様 (2026-03-01): Context Builder のロール展開
- Context Builder は Guide/Gate/Worker 共通 API (`buildPalContext`) を持つ。
- `runtimeKind="model"` のときのみ Skill 文脈を developer メッセージとして注入する。
- `runtimeKind="tool"` のときは Skill 文脈を注入しない（監査に `skip-skill-context:tool-runtime` を残す）。
- 本サイクルでは Guide 経路に接続し、Gate/Worker は同 API を利用する実装前提を固定する。

## 追加仕様 (2026-03-01): Job定期実行スケジューラ

### 目的
- Job を `manual` 操作だけでなく、スケジュール実行 (`cron` / `interval`) で起動できるようにする。
- 実行結果を Job 実行履歴として保持し、Gate 判定まで追跡できるようにする。

### スケジュール定義
- `schedule_kind`: `cron` | `interval`
- `schedule_value`:
  - `cron` の場合: 5フィールド形式 (`minute hour day month weekday`)
  - `interval` の場合: 秒数（最小 `60`）
- `timezone`: IANA timezone 文字列（未指定時はローカルタイムゾーン）
- `enabled`: `true` | `false`（`false` の間は自動起動しない）

### 起動ポリシー
- 同一 Job の同時実行は禁止（single-flight）。
- スケジューラ tick 遅延時は backlog を一括実行しない（missed run は `skipped` 記録のみ）。
- 手動起動は従来通り可能だが、定期実行中でも single-flight 制約を適用する。

### Job 実行履歴
- Job ごとに以下を記録する。
  - `run_id`
  - `job_id`
  - `trigger_kind` (`manual` | `schedule` | `resubmit`)
  - `scheduled_at`
  - `started_at`
  - `finished_at`
  - `status` (`running` | `succeeded` | `failed` | `skipped` | `cancelled`)
  - `summary`（UI表示用の短い要約）
  - `error_code` / `error_message`（失敗時のみ）
- 保持件数は Job ごとに直近 `200` 件（超過分は古い順に削除）。

### Event Log 連携
- `schedule` 起動、実行開始、実行完了、失敗、skip を Event Log に追記する。
- Event target は `target_type=job`、`target_id=<job_id>` を使う。

### エラー
- `ERR-PPH-0021`: 不正なスケジュール式（cron/interval 形式不正）
- `ERR-PPH-0022`: Job 同時実行制約違反
- `ERR-PPH-0023`: Job 実行履歴保存失敗

### 非機能
- スケジューラはアプリ再起動後に復元される（`enabled=true` の Job を再登録）。
- Job 実行履歴は UI 読み取りを優先し、書き込み失敗時も UI 全体は継続動作させる。

## 追加仕様 (2026-03-01): Gate理由テンプレートと再提出ナビゲーション

### Gate理由テンプレート
- Gate Panel に理由テンプレートを表示する。
- テンプレート選択時は `gateReason` テキストエリアへ箇条書きで追記する。
- テンプレートは i18n 対応（ja/en）し、Reject 理由の手入力も併用可能。

### 再提出ナビゲーション
- Gate で `reject` した直後、対象が Task の場合は Task Board へ遷移し、対象 Task を選択状態で表示する。
- Gate で `reject` した直後、対象が Job の場合は Cron Board へ遷移し、対象 Job 行を強調表示する。
- 強調表示は短時間の視覚ハイライト（focus class）とし、再提出ボタンがすぐ押せる状態を維持する。

## 追加仕様 (2026-03-01): Event Log 検索・フィルタ・ページング

### Event Log 操作
- 検索ボックスで `event_id / target_id / event_type / summary` を部分一致検索できる。
- `event_type` フィルタ（all/dispatch/gate/task/job/resubmit/plan）で絞り込みできる。
- ページング（Prev/Next）で結果をページ単位で閲覧できる。

### ページング仕様
- 1ページの表示件数は `6` 件。
- 新しい Event が追加されたとき、表示ページは `1` に戻る。
- フィルタ・検索変更時も表示ページは `1` に戻る。

### 空状態
- 検索/フィルタ条件で結果が0件の場合は、空状態メッセージを表示する。

## 追加仕様 (2026-03-01): API_KEY ローテーション / 移行

### 対象
- Settings の Model 設定に紐づく `api_key`（SecretStore 管理）。

### ローテーション
- 同一モデルで API_KEY を更新した場合、既存 `secret_ref` を上書きせず新規 `secret_ref` を発行する。
- 保存成功後に旧 `secret_ref` を削除する。
- UI は常に write-only（キー再表示禁止）を維持する。

### 移行（provider/base_url 変更）
- モデル名が同一で provider/base_url が変更されても、API_KEY 再入力がある場合は新規 `secret_ref` を発行する。
- API_KEY 未入力のまま変更した場合は既存 `secret_ref` を引き継ぐ（キー値の再入力を強制しない）。

### 削除整合
- モデル削除時は紐づく `secret_ref` を SecretStore から削除する。
- 参照先がない `secret_ref` は孤児データとして残さない。

### 失敗時挙動
- 新規 secret 保存に失敗した場合、DB の `secret_ref` は更新しない。
- 旧 secret 削除に失敗した場合は保存自体は成功扱いとし、再試行対象として内部ログに記録する。

### エラー
- `ERR-PPH-0024`: API_KEY ローテーション失敗
- `ERR-PPH-0025`: secret_ref 削除整合失敗

## 追加仕様 (2026-03-01): palpal-core Adapter 差し替え検証

### 契約
- `listProviderModels` から provider/model カタログを取得できること。
- `getProvider(provider).getModel(modelName).generate(...)` で Guide 応答生成できること。

### 検証項目
- default 解決モデルを除外するモードでカタログが正規化されること。
- default 解決モデルを含めるモードに切り替え可能なこと。
- provider env patch（base_url/api_key）が generate 実行中にのみ適用され、完了後に復元されること。

### テスト方針
- 実プロバイダー接続ではなく、Adapter 差し替え（モック注入）で契約を unit test する。

## 追加仕様 (2026-03-01): i18n 辞書化と未翻訳フォールバック検証

### 辞書ルール
- UI固定文言は `UI-PPH-xxxx` を `UI_TEXT.ja/en` で管理する。
- メッセージ文言は `MSG-PPH-xxxx` を `MESSAGE_TEXT.<id>.ja/en` で管理する。

### フォールバック
- UI文言解決は `locale -> ja -> en -> id` の順で解決する。
- 動的文言解決は `locale -> ja -> en -> key` の順で解決する。

### 自動検証
- `npm run verify:i18n` で以下を検証する。
  - 使用中 UI ID が辞書に存在すること
  - 使用中 MSG ID が辞書に存在すること
  - ja/en の欠落がないこと

## 追加仕様 (2026-03-01): Workspace 書き込み拒否時フォールバック

### 目的
- `Documents/palpal` などが OS セキュリティ機能でブロックされた場合でも、アプリ起動を継続する。

### ルール
- workspace 初期化時に候補ルートを順に試行する。
  1. 既定ルート（または `TOMOSHIBIKAN_WS_ROOT`）
  2. `userData/workspaces/tomoshibi-kan`
  3. `temp/tomoshibi-kan/workspace`
- `EACCES` / `EPERM` のときのみ次候補へフォールバックする。
- 非権限系エラーは即時失敗として扱う。

### 観測性
- フォールバック発生時は起動ログへ primary と selected root を出力する。

## 追加仕様 (2026-03-02): Settings 全体保存フッター

### 保存導線
- Settings の保存ボタンは画面下部フッターに 1 つ配置し、Language/Models/CLI/Skills をまとめて保存する。

### 活性条件
- 保存ボタンは、保存済みスナップショットとの差分がある場合のみ有効化する。
- 保存処理中はボタンを無効化する。

### 状態表示
- Settings フッターは `saved / dirty / saving` を表示し、保存フェーズを明示する。
- 保存ボタンは `saving` 中に busy state を持ち、処理完了まで再送を受け付けない。
- モデル/CLI の追加フォームが開いている間は、当該 section が open 状態であることを視覚的に示す。

### 未保存状態
- 未保存の変更はタブ移動してもメモリ上で保持される。
- ただしアプリ再起動/リロード前に保存しなかった変更は永続化されない。

## �ǉ��d�l (2026-03-06): LANGUAGE System Prompt Layer

- Guide/Gate/Worker �� model runtime �́Auser �w���Ƃ͕ʂ� system prompt �w����B
- system prompt �w�� `LANGUAGE + SOUL + ROLE(RUBRIC) + OPERATING_RULES` �̏��ō\������B
- `LANGUAGE` �� app locale (`ja` / `en`) ���琶�����A���[�U�[�������I�ɕʌ����v�����Ȃ�����A���̌���ŉ񓚂���悤��������B
- Guide/Worker �� `SOUL.md + ROLE.md`�AGate �� `SOUL.md + RUBRIC.md` �� system prompt �w�֒�������B
- Skill �v����b����� system prompt �w�Ƃ͕ʂɕێ����Adeveloper/history context �Ƃ��Ĉ����B

## �ǉ��d�l (2026-03-06): Role-Specific Operating Rules

- Guide �� `OPERATING_RULES` �́A�Θb�ɂ��v�������ATask/Cron ����APal �ւ̊����AGate �]����ӎ������v���܂ށB
- Gate �� `OPERATING_RULES` �́A`decision / reason / fixes` �����m�ȕ]�����ʂ�Ԃ����Ƃ�܂ށB
- Worker �� `OPERATING_RULES` �́A�������s�A�����t���񍐁A�u���b�N���R�̖�����܂ށB

## �ǉ��d�l (2026-03-06): Gate Decision Schema

- Gate �� prototype �o�͂� `decision`, `reason`, `fixes` ����B
- `decision` �� `approved | rejected | none` ������B
- `reason` �͔���̗v�� 1 ����ێ�����B
- `fixes` �� reject ���̏C�����ڔz���ێ�����B
- `decisionSummary / fixCondition` �͊��� UI �݊��̔h���\���Ƃ��Ďc���B

## 追加仕様 (2026-03-06): Execution Loop Terminology

- 本アプリ全体の `Guide -> Plan -> Task/Job 実行 -> Gate 判定 -> retry -> Guide completion` の連なりは `Execution Loop` と呼ぶ。
- `Execution Loop` を束ねる実行系責務名は `PlanExecutionOrchestrator` とする。
- `GuideDispatchUseCase`, `PalWorkUseCase`, `GateReviewUseCase`, `PalResubmitUseCase`, `GuideCompletionUseCase` は `PlanExecutionOrchestrator` を構成する UseCase 群として扱う。
- `Dispatcher` は配布責務だけを連想させて狭いため、正本用語としては使用しない。

## 追加仕様 (2026-03-06): Guide Plan Boundary

- `Guide` は planning の唯一の主体とし、ユーザーとの対話を通じて valid な `Plan` オブジェクトを作成する責務を持つ。
- Guide の応答状態は `conversation | needs_clarification | plan_ready` の 3 つを持てる。
- Guide runtime は `plan_ready` 系出力の安定化のため、互換 provider が対応している場合は native structured output (`response_format: json_schema`) を優先して使用し、失敗時のみ既存の自然文 JSON 出力へ fallback する。
- Guide の output instruction は判断規則を持たず、`status / reply / plan` schema、compact JSON、必須フィールド、余分なキー禁止といった形式制約だけを持つ。
- ユーザーが明示的に plan / task 分解を求め、対象・期待結果・関連ファイル・利用 tool の主要情報が揃っている場合、Guide は軽微な不足情報を `constraints` 内の assumption として補い、`needs_clarification` より `plan_ready` を優先する。
- Guide の `OPERATING_RULES` は、まず最新のユーザー発話が仕事の依頼へ進もうとしているかどうかを判定し、plan / task 分解 / trace-fix-verify 分割 / 進め方の確定 / 調査依頼 / 修正依頼 / 確認依頼を `work intent` として扱うこと。
- Guide の `OPERATING_RULES` は、task 作成を止める blocker が 1 つだけある時だけ追加確認し、軽微な不足は `constraints` の assumption に落として同じ確認を繰り返さないこと。
- Guide の `OPERATING_RULES` は、短い `scope_unclear` ターンでは generic な聞き返しだけで止まらず、会話履歴からあり得そうな案件を具体化した 3 択を可能性順に提案し、1 つを推薦し、番号や短い yes/no で返答できる締めを付けてよい。
- Guide の system prompt には、`3 択 + recommendation + short-answer closing` を再現しやすくする few-shot example を含めてよい。
- debug-purpose workspace では、Guide は simple-role worker (`Trace Worker / Fix Worker / Verify Worker`) を優先し、trace / fix / verify の順に素直に task を割り当てられる plan を好む。
- debug-purpose workspace で明示的な breakdown 要求がある場合、Guide の `OPERATING_RULES` は `Trace / Fix / Verify` の 3 段 plan を優先してよい。
- controller は user text から planning trigger を検知できるようにし、明示的な plan / task breakdown 要求時は Guide runtime へ `conversation` に留まらず `needs_clarification` か `plan_ready` を返す補助指示を追加してよい。
- controller は `planningIntent=explicit_breakdown` かつ対象画面・再現手順・期待結果が user text に揃っている場合、readiness assist を追加し、ファイルパスやログ未提示だけでは `needs_clarification` に留まらないよう Guide を補助してよい。
- debug-purpose の `trace / fix / verify` breakdown を含む `plan_ready` で task 配列が壊れている場合、parser は reply 内の breakdown だけでなく controller が付与した `planningIntent` / `planningReadiness` cue も使って simple-role 3 task (`Trace / Fix / Verify`) へ recovery してよい。
- controller assist は暫定安定化策として保持してよいが、workspace 設定で明示的に有効化した時だけ使う。既定値は OFF とする。
- `conversation` は雑談、壁打ち、通常相談など、ユーザーが task 化や実行計画化を明示していない状態を表す。この状態では Plan を生成せず、task/job materialize も開始しない。
- Guide の最新出力が valid な `Plan` オブジェクトとして parse / validate できない場合、システムは `GuideConversationUseCase` に留まり、Guide との対話を継続する。
- valid な `Plan` オブジェクトが存在しない間、Task/Job の materialize、dispatch、worker routing、gate routing を開始してはならない。
- `PlanExecutionOrchestrator` は raw user request や Guide の自然文応答を入力として開始せず、valid かつ `approved` な `Plan` オブジェクトを受け取った時だけ開始する。
- したがって、現行 prototype に存在する task draft 生成補助は正本の planning 主体ではなく、将来は `Plan` の parse / validate / normalize 補助へ置き換える前提とする。

## 追加仕様 (2026-03-06): Execution Loop Context Handoff Policy

- `Execution Loop` における文脈継承は、agent 間で生の対話全文をそのまま転送せず、役割ごとに必要最小限の構造化データと要約へ正規化して受け渡す。
- `Guide` は一次セッション保持者とし、Guide Chat の会話履歴を `sessionMessages` として保持する。
- `Worker` へは原則として `Task/Job` の構造化指示、制約、割当先、必要時の `Guide summary` を渡し、生の Guide 会話全文は既定では渡さない。
- `Gate` へは原則として `submission`, `Completion Ritual`, `task/job summary`, `RUBRIC`, 必要時の `reject history summary` を渡し、生の Guide/Worker 会話全文は既定では渡さない。
- Workspace 設定に `Context Handoff Policy` を持ち、`Minimal | Balanced | Verbose` の 3 モードから選択できるようにする。
- Workspace 設定に `Guide controller assist` を持ち、Guide planning trigger / readiness 補助の ON/OFF を切り替えられるようにする。既定値は OFF とする。
- 各モードの意味は次の通りとする。
  - `Minimal`: 構造化データのみを次段へ渡す。
  - `Balanced`: 構造化データに短い handoff summary を加える。既定値とする。
  - `Verbose`: 構造化データに加え、圧縮済みの補助履歴要約を厚めに渡す。
- `Context Handoff Policy` は workspace 全体設定として保持し、初期導入では agent 個別 override を持たない。
- 圧縮が必要な場合、handoff context は `truncate -> summarize -> drop` の順で縮退させるのではなく、`structure-preserve -> summarize -> drop detail` を優先する。
- 圧縮時も `task title`, `instruction`, `constraints`, `decision`, `reason`, `fixes`, `gateProfileId` などの構造化キーは可能な限り保持する。
- 監査には handoff で採用した source 種別と compaction 理由を残し、`raw-session-omitted`, `summary-generated`, `detail-dropped` などを記録できるようにする。

## 追加仕様 (2026-03-06): Execution Loop Handoff Schema

- `Guide -> Worker` の handoff は `WorkerExecutionInput` として渡す。
- `Guide/Worker -> Gate` の handoff は `GateReviewInput` として渡す。
- `Balanced` 以上では `HandoffSummary` を handoff payload に含める。
- `Verbose` では `compressedHistorySummary[]` を追加できるが、raw session transcript は含めない。

### WorkerExecutionInput
- `targetType`: `task | job`
- `targetId`: 実行対象 ID
- `title`: Task/Job のタイトル
- `instruction`: 実行指示本文
- `constraints[]`: 守るべき制約一覧
- `expectedOutput`: 期待される成果物または完了条件
- `assigneePalId`: 割当先 Pal ID
- `gateProfileId`: 提出先 Gate profile ID
- `projectContext`: project/file focus 由来の補助文脈（必要時のみ）
- `handoffSummary?`: Guide から Worker への短い要約
- `compressedHistorySummary[]?`: Verbose 時のみの補助履歴要約

### GateReviewInput
- `targetType`: `task | job`
- `targetId`: 判定対象 ID
- `title`: Task/Job のタイトル
- `instruction`: 元の実行指示
- `constraints[]`: 守るべき制約一覧
- `expectedOutput`: 期待された成果物または完了条件
- `submission`: Worker が提出した主要出力
- `ritual`: `evidence`, `replay` を含む `Completion Ritual`
- `gateProfileId`: 使用する Gate profile ID
- `rubricVersion`: 使用 rubric の識別子または更新時刻
- `handoffSummary?`: Guide または Worker が渡す短い要約
- `rejectHistorySummary[]?`: 過去 reject の要約配列
- `compressedHistorySummary[]?`: Verbose 時のみの補助履歴要約

### HandoffSummary
- `goal`: この Task/Job が何を達成するためのものか
- `decisionContext`: Guide がこの割当や判定観点を選んだ理由の短い要約
- `risks[]`: 失敗しやすい点や注意点
- `openQuestions[]`: 未解決事項や不確実性
- `sourceRefs[]`: summary 生成元の source 種別一覧（例: `guide-session`, `task-card`, `reject-history`）

### 圧縮ルール
- `handoffSummary` は 1 payload あたり 1 件を基本とする。
- `compressedHistorySummary[]` は source ごとに短い bullet summary を持ち、全文引用ではなく要点のみを保持する。
- token 超過時は `compressedHistorySummary[]` から先に削減し、`handoffSummary` と構造化フィールドは最後まで残す。

## 追加仕様 (2026-03-06): Worker / Gate Routing Basis

- `Execution Loop` 内の routing は raw transcript ではなく、agent profile の構造化属性と identity file を見て決定する。
- Worker routing は `enabled skills` と `ROLE.md` を主判断軸とし、補助軸として `runtimeKind`, `runtimeRef`, `status` を参照する。
- Gate routing は `RUBRIC.md` を主判断軸とし、補助軸として `SOUL.md`, `status`, `defaultGateId` を参照する。
- `Guide` または `PlanExecutionOrchestrator` は routing 時に、profile の display name ではなく中身 (`skills`, `ROLE.md`, `RUBRIC.md`) を見て選定理由を説明可能でなければならない。

### Worker routing rules
- Task/Job が要求する能力は、まず `enabled skills` で充足可否を判定する。
- 複数 Worker が候補になる場合、`ROLE.md` に書かれた責務・進め方・期待アウトプットが Task/Job の性質に最も合う Worker を優先する。
- `runtimeKind="tool"` の Worker は `ROLE.md` に加えて、CLI へ問い合わせて取得した capability snapshot（command / agent / skill / built-in tool / MCP / feature summaries）を routing/context の判断材料として使う。
- CLI capability snapshot は `registeredToolCapabilities[]` として保持し、tool 名、取得時刻、status、capabilities、capability summaries を含む。
- routing 時に必要 skill が存在しない場合は、無理に近い Worker へ割り当てず、Guide に確認または Plan 修正を返せること。

### Gate routing rules
- Gate selection は `RUBRIC.md` が target の完了条件・評価観点・判定厳格性に一致するかを最優先で判定する。
- `defaultGateId` は rubric 適合候補が複数ある場合の既定値として扱うが、より適切な `RUBRIC.md` を持つ Gate が明示されている場合は override できる。
- `SOUL.md` は Gate の評価姿勢や説明トーンの補助情報として参照できるが、評価基準そのものの一次ソースにはしない。

### Routing explanation
- Worker routing の説明には、最低でも `matched skills` と `ROLE.md` 上の一致点を 1 件以上含める。
- Gate routing の説明には、最低でも `RUBRIC.md` 上の一致点または review focus の一致を 1 件以上含める。
- routing 説明は audit/event へ残せる短い文でよく、raw file 全文の転記は不要とする。
- `dispatch` Event と `to_gate` Event は explanation が得られた場合、summary に短い routing 説明 (`skills=...`, `ROLE=...`, `RUBRIC=...`) を含めてよい。

## 追加仕様 (2026-03-06): Orchestration Debug DB

- orchestration の成功/失敗を改善前に追跡できるよう、最小 debug record を `settings.sqlite` に保存する。
- debug record は Guide/Worker/Gate の runtime request/response を role 別に記録し、UI 状態ではなく runtime I/O を主対象とする。
- debug record は改善・学習用の正式評価データではなく、まずは再現とデバッグを目的とする。

### Debug record の最小項目
- `run_id`
- `created_at`
- `stage` (`guide_chat | worker_runtime | gate_review`)
- `agent_role` (`guide | worker | gate`)
- `agent_id`
- `target_kind` (`plan | task | job`)
- `target_id`
- `status` (`ok | error`)
- `provider`
- `model_name`
- `input_json`
- `output_json`
- `error_text`
- `meta_json`

### Sanitization
- debug record に API_KEY を保存してはならない。
- `input_json` / `output_json` には runtime payload のうち再現に必要な情報のみを入れ、OS secret や write-only 値は含めない。
- `meta_json` には `identityVersions` (`soulVersion`, `roleVersion`, `rubricVersion`) や `handoffPolicy` など、状況比較に必要な最小メタデータを含めてよい。

### Debug CLI
- `tomoshibikan debug runs` は最新 debug record の一覧を表示できること。
- `tomoshibikan debug show <run_id>` は単一 debug record の `input/output/meta/error` を表示できること。
- `tomoshibikan debug guide-failures` は `guide_chat` record を `conversation | needs_clarification | plan_ready | parse_failure | runtime_error` と blocking cue で分類して要約表示できること。
- `tomoshibikan debug smoke` は isolated workspace 上で Electron orchestration smoke を実行し、`guide_chat / worker_runtime / gate_review` の debug record が生成されることを確認できること。
- 初期段階では `tail/export/UI` は持たず、まず `runs/show/smoke` に限定する。

## 追加仕様 (2026-03-07): Guide-driven Orchestrator と Task-centric Log

- `PlanExecutionOrchestrator` は `Execution Loop` の実行主体であり、dispatch、retry、reroute、status 遷移、完了判定を束ねる。
- `Guide` は planning の主体であり続ける。`PlanExecutionOrchestrator` は自分で新しい Plan を発明せず、replan が必要だと判断した時だけ Guide へ戻す。
- replan の要求を出す主体は `PlanExecutionOrchestrator` とし、再plan の生成主体は Guide とする。
- `PlanExecutionOrchestrator` が LLM に依存する判断を行う場合、active Guide と同じ model と `SOUL.md` を使ってよい。ただし、state 遷移や dispatch のような deterministic な処理まで Guide へ委譲してはならない。
- task/job の進行確認のため、`task-centric progress log` を持つ。目的は、ユーザーが途中で「依頼した task は今どうなっているか」を確認できるようにすることにある。
- progress log は内部監査用の `actual_actor` と、ユーザー表示用の `display_actor` を分けて保持する。
- `actual_actor` は少なくとも `orchestrator | guide | worker | gate` を取れる。
- `display_actor` は少なくとも `Guide | Resident | Gate` を取れる。日本語表示では `Guide | 住人 | Gate` を正とする。
- `PlanExecutionOrchestrator` が内部で dispatch / retry / reroute / replan_required を起こした場合でも、表示上は Guide の進行コメントとして見せてよい。
- progress log は少なくとも `task_id/job_id`, `plan_id`, `action_type`, `status`, `message_for_user`, `payload_json`, `source_run_id`, `created_at` を持つ。
- progress log は task/job 単位で最新状態と直近イベント列を引けること。Guide はこのログを使って途中経過を自然文で説明してよい。
- `message_for_user` は世界観に沿った自然文を許容するが、内部の `actual_actor` と `action_type` を欠落させてはならない。
- minimal 実装では `task_progress_logs` を `settings.sqlite` に追加し、`append`, `list`, `latest` の query を提供する。
- minimal 実装で progress log へ必ず記録する action は `dispatch`, `worker_runtime`, `to_gate`, `gate_review`, `replan_required`, `resubmit`, `plan_completed` とする。
- Gate reject reason が進め方・前提・要件・スコープの見直しを示す場合、`PlanExecutionOrchestrator` は `replan_required` を progress log に追加してよい。
- Guide は progress query で latest action が `replan_required` の target に対し、「再計画が必要で、進め方や前提を見直している」旨を自然文で説明してよい。
- renderer は progress log を direct DB access せず、Electron bridge 経由で append/query する。
- Guide はユーザーが task/job の進捗確認を求めた時、progress log と現行 board state だけを使ってローカル reply を返してよい。
- minimal 実装では、明示 ID (`TASK-xxx`, `JOB-xxx`) がある時はその target を優先し、無ければ最新 progress entry を参照する。



