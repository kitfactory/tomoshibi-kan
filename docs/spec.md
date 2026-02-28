# PalPal-Hive

要件とは（レビュー者視点）＋ Given/When/Done ＋ MSG/ERR のID管理  
※I/F詳細・API使用は書かない

# 要件一覧（Requirements）
| ID | 要件（固定書式・正常系のみ） | 関連UC-ID |
|---|---|---|
| REQ-0001 | 相談文を送信したら、GuideがPlan Cardを提示する。 | UC-1 |
| REQ-0002 | 承認済みPlanを配布したら、Task CardをPalへ割り当てる。 | UC-2 |
| REQ-0003 | PalがTaskを完了したら、Completion Ritualを保存してGateへ提出する。 | UC-3 |
| REQ-0004 | Gateが提出物を判定したら、ApproveまたはRejectを記録する。 | UC-4 |
| REQ-0005 | RejectされたTaskを再作業したら、再提出できる。 | UC-4 |
| REQ-0006 | Workspaceを開いたら、Guide ChatとTask BoardとEvent Logを表示する。 | UC-5 |
| REQ-0007 | Palが実行操作を開始したら、制約違反操作を実行前にブロックする。 | UC-3 |
| REQ-0008 | 最終TaskがApproveされたら、Guideが完了通知を投稿しPlanを完了状態へ更新する。 | UC-6 |

### [PPH-0001] 相談文を送信したら、GuideがPlan Cardを提示する。
Given：Guideが利用可能で、ユーザーが相談セッションを開始している  
When：ユーザーが相談文を送信する  
Done：GuideMessageとPlanCardが保存され、Guide ChatにPlan Cardが表示される

#### エラー分岐（REQ-0001の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0001 | 相談文が空または入力制約を超過する | 入力内容を修正して再送信する | MSG-PPH-1001 |
| ERR-PPH-0002 | Plan生成処理がタイムアウトする | 再試行する | MSG-PPH-1002 |

### [PPH-0002] 承認済みPlanを配布したら、Task CardをPalへ割り当てる。
Given：PlanCardが `approved` で、割当候補Palが存在する  
When：GuideがDispatchを実行する  
Done：TaskCardが作成され、各Taskが `assigned` でTask Boardへ表示される

#### エラー分岐（REQ-0002の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0003 | 割当可能なPalが存在しない | Pal設定を見直すか手動割当する | MSG-PPH-1004 |
| ERR-PPH-0004 | Task配布結果の保存に失敗する | 保存先を確認して再実行する | MSG-PPH-1003 |

### [PPH-0003] PalがTaskを完了したら、Completion Ritualを保存してGateへ提出する。
Given：TaskCardが `assigned` または `in_progress` で、Palが担当に一致する  
When：Palが作業完了として提出を実行する  
Done：CompletionRitualが保存され、TaskCardが `to_gate` へ遷移する

#### エラー分岐（REQ-0003の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0005 | Completion RitualのEvidenceまたはReplayが不足している | 必須項目を補完して再提出する | MSG-PPH-1001 |
| ERR-PPH-0006 | Completion Ritualの保存に失敗する | 保存先を確認して再提出する | MSG-PPH-1003 |

### [PPH-0004] Gateが提出物を判定したら、ApproveまたはRejectを記録する。
Given：TaskCardが `to_gate` で、CompletionRitualが紐づいている  
When：Gateが判定を実行する  
Done：GateResultが保存され、Approve時はTaskCardが `done`、Reject時は `rejected` になる

#### エラー分岐（REQ-0004の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0007 | palpal-core判定呼び出しがタイムアウトまたは失敗する | 再試行する | MSG-PPH-1002 |
| ERR-PPH-0008 | Reject理由が3件超または修正条件が複数指定される | 上限制約内に修正して再判定する | MSG-PPH-1007 |

### [PPH-0005] RejectされたTaskを再作業したら、再提出できる。
Given：TaskCardが `rejected` で、修正条件が付与されている  
When：Palが修正後に再提出を実行する  
Done：TaskCardが再び `to_gate` へ遷移し、Gate再判定待ちになる

#### エラー分岐（REQ-0005の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0009 | 再提出処理がタイムアウトする | 再提出を再実行する | MSG-PPH-1002 |
| ERR-PPH-0010 | Task状態が `rejected` 以外で再提出しようとする | Task状態を確認して再操作する | MSG-PPH-1006 |

### [PPH-0006] Workspaceを開いたら、Guide ChatとTask BoardとEvent Logを表示する。
Given：ユーザーがアプリにアクセスできる  
When：Workspaceを表示する  
Done：Guide Chat、Task Board、Event Logが同一画面で利用可能になる

#### エラー分岐（REQ-0006の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0011 | 初期ロードがタイムアウトする | 再読み込みする | MSG-PPH-1002 |
| ERR-PPH-0012 | Event Logの対象データが見つからない | 対象Taskを再選択する | MSG-PPH-1004 |

### [PPH-0007] Palが実行操作を開始したら、制約違反操作を実行前にブロックする。
Given：Palに制約が定義されている  
When：Palが実行操作を開始する  
Done：制約違反操作は実行されず、ブロック結果がEvent Logへ記録される

#### エラー分岐（REQ-0007の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0013 | 実行要求がPal制約に違反している | 手順を修正して再実行する | MSG-PPH-1005 |
| ERR-PPH-0014 | Pal制約定義が不正である | 制約設定を修正して再保存する | MSG-PPH-1001 |

### [PPH-0008] 最終TaskがApproveされたら、Guideが完了通知を投稿しPlanを完了状態へ更新する。
Given：Plan配下Taskが存在し、最終未完了Taskが `to_gate` である  
When：Gateが最終TaskをApproveする  
Done：Guide Chatへ完了通知が投稿され、PlanCard.statusが `completed` になる

#### エラー分岐（REQ-0008の枝番）
| ERR-ID | 発生条件 | ユーザーアクション | 関連MSG-ID |
|---|---|---|---|
| ERR-PPH-0015 | 最終完了判定時に未完了Taskが残っている | Task状態を再同期して再判定する | MSG-PPH-1008 |
| ERR-PPH-0016 | 完了通知の保存に失敗する | 保存先を確認して再通知する | MSG-PPH-1003 |

## メッセージID管理（MSG-xxxx）
| ID | 文面テンプレ | 出力先 | 発生条件 | 関連REQ/ERR |
|---|---|---|---|---|
| MSG-PPH-0001 | Plan Cardを作成しました。 | Guide Chat | Plan生成成功時 | REQ-0001 |
| MSG-PPH-0002 | TaskをPalへ配布しました。 | Task Board | Dispatch成功時 | REQ-0002 |
| MSG-PPH-0003 | Completion Ritualを保存してGateへ提出しました。 | Task Detail | Ritual提出成功時 | REQ-0003 |
| MSG-PPH-0004 | Gate判定を記録しました。 | Task Board | Gate判定成功時 | REQ-0004 |
| MSG-PPH-0005 | 差し戻しTaskを再提出しました。 | Task Detail | 再提出成功時 | REQ-0005 |
| MSG-PPH-0006 | Workspaceを表示しました。 | Workspace | 初期表示成功時 | REQ-0006 |
| MSG-PPH-0007 | Pal制約を適用しました。 | Task Detail | 実行前制約チェック成功時 | REQ-0007 |
| MSG-PPH-0008 | Plan完了を通知しました。 | Guide Chat | 完了通知成功時 | REQ-0008 |
| MSG-PPH-1001 | 入力内容を確認してください。 | 対象画面 | 入力不正時 | ERR-PPH-0001, ERR-PPH-0005, ERR-PPH-0014 |
| MSG-PPH-1002 | 処理がタイムアウトしました。再試行してください。 | 対象画面 | タイムアウト時 | ERR-PPH-0002, ERR-PPH-0007, ERR-PPH-0009, ERR-PPH-0011 |
| MSG-PPH-1003 | 保存に失敗しました。保存先を確認してください。 | 対象画面 | 永続化失敗時 | ERR-PPH-0004, ERR-PPH-0006, ERR-PPH-0016 |
| MSG-PPH-1004 | 対象データが見つかりません。 | 対象画面 | 対象なし時 | ERR-PPH-0003, ERR-PPH-0012 |
| MSG-PPH-1005 | セーフティ制約により操作をブロックしました。 | Task Detail | 制約違反時 | ERR-PPH-0013 |
| MSG-PPH-1006 | 現在の状態ではその操作は実行できません。 | 対象画面 | 状態不整合時 | ERR-PPH-0010 |
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
| ERR-PPH-0008 | Reject制約違反 | 理由数>3または修正条件数>1を検知 | 制約内へ修正して再判定 | 可 | MSG-PPH-1007 | REQ-0004 |
| ERR-PPH-0009 | 再提出タイムアウト | 再提出処理の待機時間超過を検知 | 再提出を再実行 | 可 | MSG-PPH-1002 | REQ-0005 |
| ERR-PPH-0010 | 再提出状態不整合 | `rejected` 以外で再提出操作を検知 | Task状態を確認して再操作 | 可 | MSG-PPH-1006 | REQ-0005 |
| ERR-PPH-0011 | 初期ロードタイムアウト | Workspace初期読込の超時を検知 | 再読み込みする | 可 | MSG-PPH-1002 | REQ-0006 |
| ERR-PPH-0012 | ログ対象なし | 指定Event/Taskが未存在 | 対象Taskを再選択する | 可 | MSG-PPH-1004 | REQ-0006 |
| ERR-PPH-0013 | Pal制約違反 | 実行前チェックで禁止操作を検知 | 手順を修正して再実行 | 可 | MSG-PPH-1005 | REQ-0007 |
| ERR-PPH-0014 | 制約定義不正 | 制約保存時に形式不一致を検知 | 制約設定を修正して再保存 | 可 | MSG-PPH-1001 | REQ-0007 |
| ERR-PPH-0015 | 完了判定不整合 | 最終Task承認時に未完了Task残存を検知 | Task状態を再同期して再判定 | 可 | MSG-PPH-1008 | REQ-0008 |
| ERR-PPH-0016 | 完了通知保存失敗 | Guide通知メッセージの永続化失敗 | 保存先確認後に再通知 | 可 | MSG-PPH-1003 | REQ-0008 |

## 画面情報設計（MVP最小）

### 画面一覧
| 画面ID | 画面名 | 目的 | 関連REQ |
|---|---|---|---|
| SCR-WS-001 | Workspace | Guide Chat / Task Board / Event Log を同一画面で扱う | REQ-0006 |
| SCR-WS-002 | Task Detail Panel | 選択Taskの詳細・提出情報・差し戻し条件を確認する | REQ-0003, REQ-0005 |
| SCR-WS-003 | Gate Panel | 判定結果（Approve/Reject）と理由を確認する | REQ-0004 |
| SCR-ST-001 | Settings | Agent/Safety/Workspaceの設定情報を確認する | REQ-0007（運用補助） |

### 各画面の表示項目（必須）
| 画面/ブロック | 表示項目（最低限） |
|---|---|
| Workspace / Guide Chat | timestamp, sender(user/guide/system), message, plan_status |
| Workspace / Task Board | task_id, title, status, pal_id, updated_at, gate_decision_summary |
| Workspace / Event Log | timestamp, event_type, target_id, result, summary |
| Task Detail Panel | task_description, constraints_check_result, ritual_evidence, ritual_replay |
| Gate Panel | decision(approved/rejected), reasons[], fix_condition |

### 設定メニュー階層（MVP）
| 階層 | 設定項目 | 操作 | 備考 |
|---|---|---|---|
| 設定 > Agent > Guide | profile_name, profile_version | 閲覧のみ | 起動時ロード結果を表示 |
| 設定 > Agent > Gate | profile_name, rule_version | 閲覧のみ | 起動時ロード結果を表示 |
| 設定 > Agent > Pal | pal_id, persona, skills, constraints | 閲覧のみ | 編集UIはMVP外 |
| 設定 > Safety | block_mode(`pre_execute`) | 固定表示 | REQ-0007に合わせMVPはON固定 |
| 設定 > Workspace | event_log_limit(仮:50固定) | 閲覧のみ | Event Logの運用見直しまで暫定固定 |

### デザインテイスト（MVP）
- トーン: 「運用の明瞭さ + 親しみあるキャラクター感」。将来の3Dデフォルメ人間Palが同居しても違和感がない、温度感のある業務UIにする。
- レイアウト: 3ペイン固定（左: Guide Chat / 中: Task Board / 右: Event Log）。Task Detail/Gateは右側オーバーレイ表示。右上に将来のPalキャラクター表示スロット（予約領域）を確保する。
- タイポグラフィ: 本文は `Noto Sans JP`、見出しは `M PLUS Rounded 1c`（fallback: `Meiryo`, `sans-serif`）。
- 色設計: 白ベースのオフィス系トーンを採用し、透明感を保つ。`surface=#FFFFFF`, `background=#F7FAFC`, `panel_glass=rgba(255,255,255,0.72)`, `text=#1F2937`, `accent=#0EA5A4`, `guide=#2563EB`, `pal=#F97316`, `gate=#7C3AED`, `success=#15803D`, `warning=#B45309`, `danger=#B91C1C`。
- 状態バッジ: `assigned=#2563EB`, `in_progress=#4F46E5`, `to_gate=#D97706`, `rejected=#DC2626`, `done=#16A34A`。
- コンポーネント: ラウンドを基調とし、角丸 `12px`（ボタン/入力は `9999px` のピル形状を許容）。間隔 `8px` グリッド、カードは薄い影（`y=2 blur=10 alpha=10%`）。主要操作ボタンは最大2種類（Primary/Secondary）に制限。
- モーション: 画面遷移/パネル開閉は `120-180ms ease-out` のみ使用し、透明パネルのフェードを中心に過度なアニメーションは避ける。

### UI実装方針（MVP）
- 採用: `Tailwind CSS` + `CSS Variables`（色・角丸・影・透明度のトークン管理）。
- 非採用: MUI / Bootstrap 等の重量コンポーネントフレームワーク（MVP段階では導入しない）。
- 理由: 透明感ある白ベースとラウンドUIを崩さず、将来の3DデフォルメPal表示と同居しやすい。

### i18n / UIメッセージID管理（MVP）
- UI文言は直書きせず、`UI-PPH-xxxx` のIDで管理する。
- ロケールは `ja-JP` を既定、`en-US` を同時管理する（未翻訳は `ja-JP` フォールバック）。
- 操作結果/エラー通知は既存の `MSG-PPH-xxxx` を使用し、UIラベルIDと混在させない。

| UI-ID | key | ja-JP | en-US | 用途 |
|---|---|---|---|---|
| UI-PPH-0001 | workspace.title | ワークスペース | Workspace | 画面タイトル |
| UI-PPH-0002 | workspace.guide_chat.title | Guide Chat | Guide Chat | 左ペイン見出し |
| UI-PPH-0003 | workspace.task_board.title | Task Board | Task Board | 中央ペイン見出し |
| UI-PPH-0004 | workspace.event_log.title | Event Log | Event Log | 右ペイン見出し |
| UI-PPH-0005 | task.status.assigned | 割り当て済み | Assigned | Task状態表示 |
| UI-PPH-0006 | task.status.in_progress | 実行中 | In Progress | Task状態表示 |
| UI-PPH-0007 | task.status.to_gate | 判定待ち | Awaiting Gate | Task状態表示 |
| UI-PPH-0008 | task.status.rejected | 差し戻し | Rejected | Task状態表示 |
| UI-PPH-0009 | task.status.done | 完了 | Done | Task状態表示 |
| UI-PPH-0010 | settings.title | 設定 | Settings | 設定画面タイトル |
| UI-PPH-0011 | settings.group.agent | Agent設定 | Agent | 設定グループ名 |
| UI-PPH-0012 | settings.group.workspace | Workspace設定 | Workspace | 設定グループ名 |

### Task Board方針（MVP）
- ソート/フィルタ機能は提供しない。
- 表示順は `updated_at` 降順で固定する。
- 絞り込み要件は利用実績を踏まえて次フェーズで定義する。

### Event Log方針（暫定）
- 表示件数は直近 `50` 件固定（MVP暫定）。
- 検索/ページング/保持期間の調整は実利用後に再定義する。
