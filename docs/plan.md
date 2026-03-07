# plan.md�E�忁E��書く：最新版！E
# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace path / localStorage key / docs ブランド表記を `Tomoshibi-kan` 基準へ揃え、旧 `palpal` 系は fallback で互換維持する
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] delta request/apply/verify/archive を実施し、first-party rename を archive まで閉じる
- [x] [SEED-20260307-brand-tomoshibikan-and-origin-commit] 表示名を `Tomoshibi-kan / 灯火館` へ更新し、コアコンセプトへブランド世界観を取り込んだうえで current worktree を commit する
- [x] [DR-20260307-brand-tomoshibikan-and-origin-commit] delta request/apply/verify/archive を実施し、brand rename・origin 設定・commit を archive まで閉じる
- [x] [SEED-20260307-guide-few-shot-three-option-recommendation] Guide の `OPERATING_RULES` だけで弱い `3案提示 + 1案推薦 + 短い締め` を few-shot 例で補強し、assist OFF の実モデルで再観測する
- [x] [DR-20260307-guide-few-shot-three-option-recommendation] delta request/apply/verify/archive を実施し、Guide few-shot 追加後の assist OFF 実モデル所見を archive まで閉じる
- [x] [SEED-20260307-guide-operating-rules-three-option-closing] Guide が `scope_unclear` の短いターンで、可能性順の3案提示・1案推薦・短く返答しやすい締めを返すよう `OPERATING_RULES` を強化する
- [x] [DR-20260307-guide-operating-rules-three-option-closing] delta request/apply/verify/archive を実施し、3案提示ルール追加後の Guide 応答所見を archive まで閉じる
- [x] [SEED-20260307-guide-operating-rules-work-intent] Guide の判断軸を `work intent` 中心に切り替え、短い曖昧入力では会話文脈に沿った具体的な3択を提案するよう `OPERATING_RULES` を更新する
- [x] [DR-20260307-guide-operating-rules-work-intent] delta request/apply/verify/archive を実施し、work-intent 中心の Guide rules 更新と assist OFF 再観測を archive まで閉じる
- [x] [SEED-20260307-guide-output-instruction-reduction] Guide の判断規則を `OPERATING_RULES` に寄せ、output instruction を schema と形式制約だけに削減する
- [x] [DR-20260307-guide-output-instruction-reduction] delta request/apply/verify/archive を実施し、Guide output instruction の重複削減を archive まで閉じる
- [x] [SEED-20260307-guide-operating-rules-option-suggestion] `scope_unclear` の短いターンで Guide が仮説と選択肢を先に提案するよう `Guide OPERATING_RULES` を強化し、assist OFF の real-model 応答を再観測する
- [x] [DR-20260307-guide-operating-rules-option-suggestion] delta request/apply/verify/archive を実施し、option suggestion 追加後の Guide 応答所見を archive まで閉じる
- [x] [SEED-20260307-guide-operating-rules-planning-guidance] assist OFF でも Guide が planning intent を拾いやすくなるよう `Guide OPERATING_RULES` を強化し、real-model autonomous check を再観測する
- [x] [DR-20260307-guide-operating-rules-planning-guidance] delta request/apply/verify/archive を実施し、Guide OPERATING_RULES 強化と assist OFF 再観測の所見を archive まで閉じる
- [x] [SEED-20260307-guide-autonomous-check-assist-off] `Guide controller assist` OFF のまま実モデル Guide autonomous check を再実行し、Guide 単体でどこまで `conversation / needs_clarification / plan_ready` に到達するかを観測する
- [x] [DR-20260307-guide-autonomous-check-assist-off] delta request/apply/verify/archive を実施し、assist OFF 条件での Guide autonomous check 所見を archive まで閉じる
- [x] [SEED-20260307-guide-controller-assist-default-off] controller assist を既定OFFにし、Settings の checkbox で明示 ON できるようにする
- [x] [SEED-20260307-orchestrator-three-task-cycle-check] Guide が生成した `Trace / Fix / Verify` 3 task を順番に worker runtime / gate review まで流す real runner を追加し、3周分の debug run を観測する
- [x] [SEED-20260306-orchestrator-autonomous-check] Guide が生成した `Trace / Fix / Verify` task を worker runtime / gate review まで流す real runner を追加し、debug run を観測する
- [x] [SEED-20260306-guide-full-runner-stabilization] `run_guide_autonomous_check.js` の待機条件を `guideSend aria-busy` ベースへ寄せ、timeout 時の診断を強化する
- [x] [SEED-20260306-guide-plan-materialization-e2e-check] 実モデルの malformed `plan_ready` payload replay から board 上で `Trace / Fix / Verify` 3 task が materialize されるか確認する
- [x] [SEED-20260306-guide-plan-debug-task-recovery] malformed `trace / fix / verify` plan を debug-purpose 3 task へ救済し、materialization を安定させる
- [x] [SEED-20260306-guide-needs-clarification-controller-assist] `explicit_breakdown` かつ再現手順・期待結果が揃う入力では `needs_clarification` に留まり続けないよう controller 側で補助する
- [x] [SEED-20260306-guide-planning-intent-controller-assist] controller 側で planning trigger を検知し、Guide が `conversation` に留まり続けないよう prompt を補助する
- [x] [SEED-20260306-guide-failure-mode-observation] `palpal debug guide-failures` を追加し、Guide の `plan_ready` 未到達 run を status と blocking cue で観測できるようにする
- [x] [SEED-20260306-guide-simple-role-worker-hint] Guide が debug-purpose workspace では `trace / fix / verify` の simple-role worker を優先して plan を組むよう prompt を補強する
- [x] [SEED-20260306-simple-role-debug-pals] built-in debug worker を `trace only / fix only / verify only` に寄せ、Guide と routing が役割を読み取りやすい seed へ揃える
- [x] [SEED-20260306-guide-output-prompt-tightening] Guide ? output instruction ??????`conversation / needs_clarification / plan_ready` ???????????
- [x] [SEED-20260306-guide-structured-output-adoption] Guide runtime ? native structured output / schema mode ???????????????????
- [x] [SEED-20260306-guide-output-parser-hardening] Guide ? `plan_ready` ?????? wrapper token ???? JSON ???????parse ???????
- [x] [SEED-20260306-guide-real-dialogue-check] 実モデルで Guide の複数ターン対話を行い、`conversation -> needs_clarification -> plan_ready` の観測 runner を追加する
- [x] [SEED-20260306-guide-conversation-boundary] Guide の通常会話では task 化を行わず、`conversation` 状態で対話継続する境界を追加する
- [x] [SEED-20260306-guide-plan-parse-gate] Guide 出力を `Plan` schema として parse/validate し、valid Plan の時だけ task 化へ進む
- [x] [SEED-20260306-guide-plan-boundary-doc] Guide を唯一の planning 主体とし、valid Plan まで対話継続・approved Plan でのみ Orchestrator 開始とする設計境界を文書化する
- [x] [DOC] concept/spec/architecture と現行�Eロトタイプ�E差刁E��確認し、今回実裁E��めEIn Scope を固定すめE- [x] [SEED-20260301-settings-persistence-policy] 設定保存方式（非機寁ESQLite / API_KEY=OSキーチェーン�E��E delta request を作�Eする
- [x] [SEED-20260301-settings-persistence-policy] API_KEYの扱ぁE��Erite-only入力、画面再表示禁止、secret_ref参�E�E�を含む保存�EリシーめEspec/architecture/overview に反映する
- [x] [SEED-20260301-settings-persistence-impl] Settings保存を SQLite�E�非機寁E��E SecretStorePort�E�EPI_KEY�E�へ実裁E��めE- [x] [SEED-20260301-settings-persistence-impl] API_KEYをUI再表示しなぁE��孁E更新/削除フローめEunit で検証する
- [x] [SEED-20260301-settings-persistence-impl] E2Eで「�E起動後�E設定保持」「API_KEY非表示維持」を検証する
- [x] [SEED-20260301-guide-lmstudio-dev] Guide の実モチE��利用状況を確認し、delta request を作�Eする
- [x] [SEED-20260301-guide-lmstudio-dev] 開発/チE��ト時に LM Studio (`192.168.11.16:1234/v1`, `openai/gpt-oss-20b`) を利用する Guide 送信処琁E��実裁E��めE- [x] [SEED-20260301-guide-lmstudio-dev] 既孁EE2E を更新し、回帰がなぁE��とを検証する
- [x] [SEED-20260301-mojibake-fix] Guide Chat を含む UI 斁E��の斁E��化けを解消すめEdelta request を作�Eする
- [x] [SEED-20260301-mojibake-fix] `app.js/index.html` の壊れた日本語文言を復允E��、表示を正常化すめE- [x] [SEED-20260301-mojibake-fix] E2E と構文チェチE��で回帰がなぁE��とを確認すめE- [x] [SEED-20260301-runtime-validation] Pal Runtime 排他制紁E��Emodel` また�E `tool`�E��E delta request を作�Eする
- [x] [SEED-20260301-runtime-validation] Pal Runtime 設定UIと保存バリチE�Eションを実裁E��、直後に単体テストを追加する
- [x] [SEED-20260301-runtime-validation] Runtime制紁E�EE2Eシナリオ�E�Emodel`時Skill可 / `tool`時Skill不可�E�を追加する
- [x] [SEED-20260301-skill-catalog] ClawHub 検索・擬似Download・削除導線�E delta request を作�Eする
- [x] [SEED-20260301-skill-catalog] Settings の Skill 管琁E��面と状態管琁E��実裁E��、直後に単体テストを追加する
- [x] [SEED-20260301-skill-catalog] Skill 登録/削除導線�EE2Eシナリオを追加する
- [x] [SEED-20260301-pal-profile] Pal 追加/削除と Name/Role/Runtime/Skill 紐づけ�E delta request を作�Eする
- [x] [SEED-20260301-pal-profile] Pal List 編雁E��ロー�E�追加・保存�E削除�E�を実裁E��、直後に単体テストを追加する
- [x] [SEED-20260301-pal-profile] Pal List 操作！Euntime選択�ESkill選択�E削除�E��EE2Eシナリオを追加する
- [x] [SEED-20260301-guide-model-guard] GuideモチE��未設定時は会話送信をブロチE��し、Settingsで設定するよぁE��E�� delta request を作�Eする
- [x] [SEED-20260301-guide-model-guard] 未設定ガード！Euide runtime=model + model参�EチェチE���E�と誘導メチE��ージ表示を実裁E��、単体テストを追加する
- [x] [SEED-20260301-guide-model-guard] E2Eで「未設定時は送信不可 / 設定導線表示」を検証する
- [x] [SEED-20260301-settings-model-registration] Settingsで登録したモチE��めEGuide 参�E設定へ反映する delta request を作�Eする
- [x] [SEED-20260301-settings-model-registration] モチE��登録後に Guide が参照可能になる状態同期を実裁E��、単体テストを追加する
- [x] [SEED-20260301-settings-model-registration] E2Eで「Settings登録 -> Guide参�E可能」を検証する
- [x] [SEED-20260301-settings-model-catalog-env] SettingsモチE��候補�E取得�EめE`palpal-core` registry 準拠へ刁E��替える delta request を作�Eする
- [x] [SEED-20260301-settings-model-catalog-env] `.env` の LM Studio 既定値�E�Ease_url/model�E�を Electron 実行時に反映する配線を実裁E��めE- [x] [SEED-20260301-settings-model-catalog-env] unit/E2E でモチE��候補と既存フロー回帰を検証する
- [x] [SEED-20260301-settings-provider-model-link] Settings モチE��追加で provider 選択に応じぁEmodel 候補連動�E delta request を作�Eする
- [x] [SEED-20260301-settings-provider-model-link] provider/model 不整合を防ぐバリチE�Eションと保存フロー補正を実裁E��めE- [x] [SEED-20260301-settings-provider-model-link] unit/E2E で provider-model 連動と保存回帰を検証する
- [x] [SEED-20260301-settings-lmstudio-provider] Settings provider 選択肢へ LM Studio 追加の delta request を作�Eする
- [x] [SEED-20260301-settings-lmstudio-provider] provider/model 正規化と alias を補強し、LM Studio を選択可能にする
- [x] [SEED-20260301-settings-lmstudio-provider] unit/E2E で LM Studio option と設定画面回帰を検証する
- [x] [SEED-20260301-guide-chat-dialogue] モチE��設定済み Guide 対話フローの delta request を作�Eする
- [x] [SEED-20260301-guide-chat-dialogue] Guide 対話�E�モチE��応筁E失敗時ハンドリング�E�を実裁E��、単体テストを追加する
- [x] [SEED-20260301-guide-chat-dialogue] E2Eで会話送受信とエラーハンドリングを検証する
- [x] [DOC] 吁E��裁E��刁E�� concept/spec/architecture/plan に同期し、delta archive 条件を満たすことを確認すめE
- [x] [DR-20260301-env-vars-provider-minimal] ���ϐ��� provider�� API_KEY/BASE_URL �݂̂ɐ�������v����`
# future
- Job の定期実行スケジューラ�E�Eron/interval�E�と実行履歴保持の仕様確宁E- Gate 判定理由チE��プレートと再提出ナビゲーション改喁E- Event Log の検索・フィルタ・ペ�Eジング導�E
- APIキーのローチE�Eション/移行！Eecret_ref再発行�E削除整合）�E運用仕様を定義
- palpal-core 実実裁E��続時の Adapter 差し替え検証を追加
- i18n 斁E��めE`UI-PPH-xxxx` / `MSG-PPH-xxxx` で辞書刁E��し、未翻訳フォールバックを�E動検証

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260307-brand-tomoshibikan-and-origin-commit] `Tomoshibi-kan / 灯火館` を表示名と core concept に反映し、`origin` を `https://github.com/kitfactory/tomoshibi-kan.git` に設定したうえで current worktree を commit した
- [x] [DR-20260307-guide-few-shot-three-option-recommendation] Guide の system prompt に few-shot 例を追加し、assist OFF の実モデルで 2 ターン目の `3案 + recommendation + 2でよいですか？` と 3 ターン目の `plan_ready -> Trace/Fix/Verify` materialize を確認した
- [x] [DR-20260307-guide-operating-rules-three-option-closing] Guide の `OPERATING_RULES` に 3案提示ルールを追加し、assist OFF の実モデルでも 2 ターン目で 3 択が返るところまで改善した
- [x] [DR-20260307-guide-operating-rules-work-intent] Guide の判断軸を `work intent` 中心へ更新したが、assist OFF の実モデルでは 3 択提案までは再現しないことを確認した
- [x] [DR-20260307-guide-output-instruction-reduction] Guide の判断規則を `OPERATING_RULES` に集約し、output instruction を schema と形式制約だけへ削減した
- [x] [DR-20260307-guide-operating-rules-option-suggestion] `scope_unclear` の短いターンで仮説と選択肢を出す rules を追加し、assist OFF の実モデル応答が generic follow-up から仮説寄りに改善したことを確認した
- [x] [DR-20260307-guide-operating-rules-planning-guidance] Guide の `OPERATING_RULES` を planning trigger 中心に強化し、assist OFF でも `conversation` 固定から `needs_clarification` へ進むところまで改善した
- [x] [DR-20260307-guide-autonomous-check-assist-off] assist OFF の素の Guide autonomous check を実モデルで再実行し、3 ターンとも `conversation` に留まり task 化しないことを debug record と CLI で確認した
- [x] [DR-20260306-guide-output-prompt-tightening] Guide prompt ? tighten ??????????? `needs_clarification` ???????
- [x] [DR-20260306-guide-structured-output-adoption] Guide runtime ? native structured output ?????debug record ? responseFormat ? pure JSON output ???????????
- [x] [DR-20260306-guide-output-parser-hardening] Guide plan parser ? wrapper token ????? JSON repair ?????unit verify ? `plan_ready` ?????????
- [x] [DR-20260306-guide-real-dialogue-check] 実モデルの Guide 複数ターン対話 runner を追加し、`conversation / needs_clarification / plan_ready` の観測所見を verify に記録した
- [x] [DR-20260306-guide-conversation-boundary] Guide status を `conversation|needs_clarification|plan_ready` に拡張し、通常会話では task 化せず対話継続するよう prototype と正本を同期した
- [x] [DR-20260306-guide-plan-parse-gate] Guide 出力を `Plan` schema で parse/validate し、valid Plan 以外では対話継続、valid Plan の時だけ task 化するよう prototype を切り替えた
- [x] [DR-20260306-guide-plan-boundary-doc] Guide を唯一の planning 主体とし、valid Plan ができるまで対話継続、Orchestrator は valid かつ approved な Plan からのみ開始するよう concept/spec/architecture を同期した
- [x] [DR-20260301-settings-persistence-impl] Settings保存を Electron IPC 経由の SQLite + SecretStore に実裁E��、API_KEYはwrite-only/非表示を維持しぁE- [x] [DR-20260301-settings-persistence-policy] 設定保存方式を「非機寁ESQLite / API_KEY=OSキーチェーン+secret_ref」に決定し、API_KEY扱ぁE��針を斁E��化しぁE- [x] [DR-20260301-guide-lmstudio-dev] Guide をモチE��返信から OpenAI互換呼び出しへ刁E��替え、E��発/チE��ト時は LM Studio (`openai/gpt-oss-20b`) を既定利用にした
- [x] [DR-20260301-guide-chat-mojibake-fix] Guide Chat を含む日本語文言の斁E��化けを修正し、表示を正常化しぁE- [x] [DR-20260301-guide-chat-dialogue] モチE��設定済みGuide対話で送受信が�E立し、返信に model/provider 斁E��を反映した
- [x] [DR-20260301-settings-model-registration] Settings登録モチE��めEGuide 参�Eへ同期し、Pal Listで反映を確認可能にした
- [x] [DR-20260301-settings-model-catalog-env] SettingsモチE��候補を `palpal-core` registry 由来に変更し、LM Studio 既定値めE`.env` から注入するようにした
- [x] [DR-20260301-settings-provider-model-link] Settings モチE��追加の provider-model 連動を修正し、不整合�E力で保存が破綻しなぁE��ぁE��した
- [x] [DR-20260301-settings-lmstudio-provider] Settings provider へ LM Studio を追加し、provider/model 連動�E不整合を修正した
- [x] [DR-20260301-guide-model-guard] GuideモチE��未設定時に送信をブロチE��し、Settings誘導を表示するようにした
- [x] [DR-20260301-plan-current-order-guide] Guide関連の次サイクル頁E��めE`2 -> 3 -> 1` の頁E�� current に反映した
- [x] [DR-20260301-doc-sync] 実裁E��み差刁E�� OVERVIEW/spec/architecture/plan に同期し、current の DOC 頁E��をクローズした
- [x] [DR-20260301-pal-profile] Pal Profile ロジチE��を�E通化し、追加/保孁E削除フローめEunit/E2E で検証可能にした
- [x] [DR-20260301-skill-catalog] Skill Catalog ロジチE��を�E通化し、unit/E2E で検索・追加・削除導線を検証可能にした
- [x] [DR-20260301-runtime-validation] Pal Runtime の保存判定を共通化し、unit/E2E で排他制紁E��検証可能にした
- [x] [DR-20260301-plan-clarify] `docs/plan.md` の斁E��化けを解消し、current/future/archive を�E構�Eした
- [x] concept/spec/architecture を�Eロトタイプ準拠UI + 封E��実裁E��針�E前提で再整備しぁE- [x] Settings の Skill 欁E�� ClawHub 検索 + 擬似Download導線に変更した
- [x] Job タブを追加し、定期タスクの Pal 実衁E+ Gate 承認フローを実裁E��ぁE- [x] Settings の Model 一覧/追加UIを実裁E��、provider 候補を palpal-core registry 準拠に整琁E��ぁE- [x] Workspace タブ頁E�� `Guide Chat / Pal List / Job / Task Board / Event Log / Settings` に統一した
- [x] Guide Chat の入力欁E��画面最下部固定に変更し、履歴欁E��刁E��した
- [x] タブ表示領域がビューポ�Eト下にはみ出さなぁE��ぁE���E部スクロール化して収まりを調整した
- [x] Task Detail めETask Board 選択時のみ表示する条件に修正した
- [x] Tailwind + daisyUI ベ�Eスへ刁E��替え、E���E感�Eあるオフィス調ト�Eンへ更新した
- [x] Event Log 含むタブ�E替と Guide 入力欁E�E置に対する Playwright E2E を導�Eした
- [x] Settings をタブ画面化し、モチE��/ランタイム設定フローを操作可能にした

- [x] [DR-20260301-core-catalog-direct] Settings provider/model ���� palpal-core �擾�D��֏C��

- [x] [DR-20260301-optional-api-key-local] LMStudio/Ollama �� API_KEY ��C�Ӊ�

- [x] [DR-20260301-core-catalog-no-default-models] palpal-core �� default model ��\����₩�珜�O

- [x] [DR-20260301-settings-provider-selection-sticky] provider �I���ێ����A����LMStudio�t�H�[���o�b�N���~

- [x] [DR-20260301-env-vars-provider-minimal] ���ϐ��� provider�� API_KEY/BASE_URL �݂̂ɐ���

- [x] [DR-20260301-settings-skill-section-split] Settings��Skill���3�J�e�S���֕���
- [x] [DR-20260301-settings-structure-refine] Settings��Language�d���폜��Model/CLI/Skills�p�l���č\��
# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-ws-root-layout] ws-root 既定値（Windows/macOS/Linux）と単一ルート構成（`<ws-root>/.palpal` 分離）を実装前提で定義する
- [x] [SEED-20260301-pal-markdown-contract] Pal(Guide/Gate/Worker) ごとのフォルダ契約と `USER.md` 上位配置ルールを spec/architecture に反映する
- [x] [SEED-20260301-context-builder-spec] PalContextBuilder の入力ソース（SOUL/Skill/MCP/編集ファイル/会話/メモリ）・優先度・token予算・監査ログ仕様を確定する
- [x] [SEED-20260301-context-builder-guide] Guide Chat 経路へ Context Builder を段階導入し、未設定時ガードと履歴圧縮方針を接続する
- [x] [SEED-20260301-context-builder-rollout] Gate/Worker へ Builder を展開し、Runtime=model 時のみ Skill を注入する方針を実装する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-context-builder-roadmap-order] これまでの議論を Context Builder 実装順序として plan に固定した

- [x] [DR-20260301-ws-root-layout] ws-root 既定値と .palpal 内部保存先の実装を適用した

- [x] [DR-20260301-pal-markdown-contract] Palごとのフォルダ契約と USER.md 上位配置を spec/architecture に同期した

- [x] [DR-20260301-context-builder-spec] PalContextBuilder の入力/優先度/token予算/監査仕様を spec/architecture に確定した

- [x] [DR-20260301-context-builder-guide] Guide Chat 経路へ Context Builder を導入し、履歴圧縮方針を接続した

- [x] [DR-20260301-context-builder-rollout] Context Builder を role 共通 API に拡張し、tool runtime の Skill 非注入を固定した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-job-scheduler-spec] Job 定期実行スケジューラ（cron/interval）と実行履歴保持の仕様を確定する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-job-scheduler-spec] Job定期実行スケジューラと実行履歴保持の仕様を spec/architecture に確定した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-gate-reason-template-nav] Gate判定理由テンプレートと再提出ナビゲーションを改善する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-gate-reason-template-nav] Gate理由テンプレート追加とreject後の再提出ナビゲーション改善を実装した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-event-log-query-controls] Event Log の検索・フィルタ・ページングを導入する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-event-log-query-controls] Event Log の検索/フィルタ/ページングUIとロジックを実装した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-api-key-rotation-policy] API_KEY ローテーション/移行（secret_ref再発行・削除整合）の運用仕様を定義する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-api-key-rotation-policy] API_KEY ローテーション/移行の運用仕様を spec/architecture に確定した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-core-adapter-swap-tests] palpal-core 実実装接続時の Adapter 差し替え検証を追加する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-core-adapter-swap-tests] palpal-core adapter の差し替え契約を unit test で検証可能にした

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-i18n-dictionary-verify] i18n 辞書を UI-PPH/MSG-PPH で整合し、未翻訳フォールバックを自動検証する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-i18n-dictionary-verify] i18n 辞書検証スクリプトとフォールバック強化を実装した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-workspace-access-fallback] electron.exe の書き込み拒否時に workspace 保存先をフォールバックさせる

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-workspace-access-fallback] Workspace 書き込み拒否時の自動フォールバックを実装した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-ws-root-env-appdata] PALPAL_WS_ROOT を AppData 配下へ固定する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-ws-root-env-appdata] .env で PALPAL_WS_ROOT を AppData 配下へ固定した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260301-settings-pal-model-immediate] Settingsで追加したモデルをPalタブへ即時反映する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260301-settings-pal-model-immediate] Settings追加モデルがPalタブで即時利用できるようにした

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260302-settings-footer-save-dirty] Settings 保存を画面下フッター化し、差分時のみ有効化する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260302-settings-footer-save-dirty] Settings 全体保存フッターと dirty 連動活性を実装した
- [x] [DR-20260302-settings-save-button-large-dirty] Settings 保存ボタンを大型化し、変更差分の往復で enabled/disabled が正しく切り替わることを固定した
- [x] [DR-20260302-settings-save-disabled-visual] Settings 保存ボタンの disabled 視認性（色差・カーソル）を明確化した
- [x] [DR-20260303-settings-skill-search-scroll] Settings Skills 検索入力中にスクロールが先頭へ戻る問題を修正した
- [x] [DR-20260304-settings-skill-market-hide-installed] Settings Skills おすすめリストからインストール済みスキルを非表示化した
- [x] [DR-20260304-settings-skill-market-modal-flow] Settings Skills をモーダル検索（キーワード入力/検索実行/結果一覧）フローへ変更した
- [x] [DR-20260304-settings-skill-recommendation-persistence] Skills検索で該当なし後も未インストールおすすめが消えないように修正した
- [x] [DR-20260304-settings-skill-recommendation-visibility] Skills欄に未インストールおすすめ一覧を常時表示するようにした
- [x] [DR-20260304-settings-skill-recommendation-install-button] Skills欄の未インストールおすすめに直接インストールボタンを追加した
- [x] [DR-20260304-settings-skill-market-button-layout] Skills欄のClawHubボタンを左寄せ・約1/4幅にし重複説明ラベルを削除した
- [x] [DR-20260304-settings-skill-modal-explicit-search] Skills検索モーダルを検索実行型にし、未検索時の自動結果表示を廃止した
- [x] [DR-20260304-settings-skill-modal-advanced-filters] Skills検索モーダルに non-suspicious/highlighted/sort の検索条件を追加した
- [x] [DR-20260304-settings-skill-modal-filter-layout] Skills検索モーダルのフィルタ表示順を縦構成へ変更し、疑わしい除外を初期ON表示に固定した
- [x] [DR-20260304-settings-skill-search-api] Skills検索をClawHub API連携（/search + /skills）へ切り替え、失敗時フォールバックを追加した
- [x] [DR-20260304-settings-skill-search-duckduckgo] ClawHub `/search` で `suspicious` 未提供の結果が既定フィルタで消える問題を修正した
- [x] [DR-20260304-settings-skill-search-fullwidth-query] Skills検索キーワードをNFKC正規化し、全角 `Ｄｄｇ` 入力でも `Ddg` を検索できるようにした
- [x] [DR-20260304-settings-skill-safety-display] Skills検索の安全性表示を改善し、`Unknown` 固定ではなく状態（疑わしい除外済み等）を表示するようにした
- [x] [DR-20260304-settings-skill-actions-link-layout] Skills一覧の右側操作を2段化し、Linkボタン追加と安全性表示の非表示化を適用した
- [x] [DR-20260304-settings-skill-link-external-desc] Skills Link を外部ブラウザ起動へ変更し、おすすめ未インストール一覧へ説明文を追加した
- [x] [DR-20260304-settings-standard-skill-link-hide] 標準おすすめスキルのLinkを非表示にし、非標準スキルのみLink表示を維持した
- [x] [DR-20260304-settings-skill-install-nonstandard] 標準ID外のClawHubスキルもSettingsからインストール/削除できるようにした
- [x] [DR-20260304-settings-skill-search-metrics-display] Skills検索結果カードに Downloads / Stars 表示を追加した
- [x] [DR-20260304-settings-skill-modal-input-layout] Skills検索モーダルのキーワード入力を長めのテキストフィールド化し、検索条件チェックを横並びに変更した
- [x] [DR-20260304-settings-skill-modal-search-button-align] Skills検索モーダルの検索ボタンを並び順と同段・高さ揃えにし、結果欄の縦スペースを拡張した
- [x] [DR-20260304-settings-skill-modal-search-button-right] Skills検索モーダルの検索ボタンのみを右寄せ配置に調整した
- [x] [DR-20260304-project-tab-chat-reference-focus] Projectタブ（Palの次）を追加し、Guide Chatの @参照補完と /use フォーカス更新を実装した
- [x] [DR-20260304-project-list-hide-focus-display] Project一覧からフォーカス状態表示バッジを削除した
- [x] [DR-20260304-project-list-remove-focus-and-unlist-wording] Project一覧のフォーカス操作UIを除去し、「削除」を「一覧から外す」に変更した
- [x] [DR-20260304-project-directory-picker-unlist-enabled] Projectの追加をディレクトリ選択化し、重複ダイアログと全件「一覧から外す」を実装した
- [x] [DR-20260304-job-tab-label-cron] 定期タスク入口のUI名称を Job から Cron に変更した（内部キーは job を維持）
- [x] [DR-20260304-doc-ui-label-cron] concept/spec/architecture のUI表示名を Job から Cron に統一した（Domain名 Job は維持）
- [x] [DR-20260304-pal-list-compact-modal-settings] Pal一覧をコンパクト化し、詳細設定をモーダルへ移動した
- [x] [DR-20260304-e2e-clawhub-mock-live-split] E2E の ClawHub 依存を mock/live に分離し、通常テストを安定化した

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260304-agent-identity-repository] Agent Identity Layer（`SOUL.md`/`role.md`/`skills.yaml`）の read/write 用 delta request を作成する
- [x] [SEED-20260304-agent-identity-repository] Electron IPC + runtime repository で Agent Identity ファイル保存を実装し、unit test を追加する
- [x] [SEED-20260304-agent-skill-reference-resolver] `skills.yaml` の `enabled_skill_ids` を Settings のインストール済み Skill 台帳へ解決する delta request を作成する
- [x] [SEED-20260304-agent-skill-reference-resolver] Context Builder へ Skill 参照解決を接続し、`runtimeKind=tool` では非注入を維持して unit test を追加する
- [x] [SEED-20260304-guide-assignment-readiness] Guide が計画/アサイン判断に使う Agent 要約（role/runtime/skills）DTO を整備する delta request を作成する
- [x] [SEED-20260304-guide-assignment-readiness] Agent 要約DTOを Guide 経路へ接続し、E2E で最低限の回帰を確認する
- [x] [SEED-20260304-pal-runtime-skill-execution] Guide/Pal の model runtime で Skill tool-call 実行を有効化する delta request を作成する
- [x] [SEED-20260304-pal-runtime-skill-execution] runtime tool-loop + IPC + Task/Cron start 配線を実装し、unit/e2e 回帰を確認する
- [x] [SEED-20260304-guide-tool-loop-safeguard] Guide の browser 指示で発生する tool-loop 未収束エラーを停止可能化する delta request を作成する
- [x] [SEED-20260304-guide-tool-loop-safeguard] runtime に repeated-plan/max-turn セーフガードと debug trace を追加し、unit で回帰確認する
- [x] [SEED-20260304-runtime-workspace-root-from-project-focus] Guide/Pal runtime の file skill が Project focus 配下を参照する delta request を作成する
- [x] [SEED-20260304-runtime-workspace-root-from-project-focus] renderer payload + main 検証/fallback を実装し、unit 回帰を確認する
- [x] [SEED-20260306-guide-chat-tone-refine] Guide Chat のトーン補正（面の静けさ / 送信中フィードバック / Guide キャラ状態連動）を実装する
- [x] [SEED-20260306-settings-tone-refine] Settings のトーン補正（section静音化 / 保存フッター状態表現 / 追加フォーム視認性）を実装する
- [x] [SEED-20260306-task-gate-tone-refine] Task Board / Gate のトーン補正（row厳密化 / drawer強弱 / gate判定面の整理）を実装する
- [x] [SEED-20260306-event-log-tone-refine] Event Log のトーン補正（toolbar整理 / row階層化 / pager状態表現）を実装する
- [x] [SEED-20260306-cron-tone-refine] Cron のトーン補正（schedule/lastRun/instruction 階層化 / lastRun 状態表現）を実装する
- [x] [DOC] 実装反映後に concept/spec/architecture/plan と delta archive を同期する
- [x] [SEED-20260306-soul-md-canonicalize] Agent Identity の `SOUL.md` 命名を正本化し、文書と runtime の file contract を揃える
- [x] [SEED-20260306-soul-md-fallback-removal] Agent Identity の lowercase `soul.md` fallback を削除し、`SOUL.md` 単独契約に戻す
- [x] [SEED-20260306-pal-identity-template-init] Pal 作成時に locale 別 `SOUL.md` / `ROLE.md` テンプレートを生成する
- [x] [SEED-20260306-gate-rubric-contract] Gate の secondary file contract を `RUBRIC.md` に切り替える
- [x] [SEED-20260306-guide-gate-multi-profile-requirement] Guide/Gate を複数 profile として追加・選択できる要件を concept/spec/architecture に定義する
- [x] [SEED-20260306-guide-gate-multi-profile-impl] Guide/Gate の複数 profile 実装（identity path / selection state / Pal List UI）を prototype に適用する
- [x] [SEED-20260306-default-gate-execution-binding] default gate を Task/Cron の gate flow に接続し、target ごとの gateProfileId 表示を追加する
- [x] [SEED-20260306-board-state-gate-profile-persistence] Task/Cron board state を localStorage へ保存し、gateProfileId を reload 後も維持する
- [x] [SEED-20260306-agent-identity-light-editor] Pal 設定モーダルから `SOUL.md` / `ROLE.md` / `RUBRIC.md` を軽量編集できるようにする
- [x] [SEED-20260306-pal-config-footer-compact] Pal 設定モーダルの footer を薄くして本文の圧迫を減らす
- [x] [SEED-20260306-pal-config-modal-auto-height] Pal 設定モーダルの footer 下空白をなくし、内容高ベースで収まるようにする
- [x] [SEED-20260306-language-system-prompt-layer] `LANGUAGE / SOUL / ROLE(RUBRIC)` を system prompt 層として扱い、app locale で既定応答言語を固定する
- [x] [SEED-20260306-role-specific-operating-rules] `OPERATING_RULES` を Guide/Gate/Worker ごとに具体化する
- [x] [SEED-20260306-gate-decision-schema] Gate 出力を `decision / reason / fixes` schema に揃える

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260304-agent-identity-step1-foundation] Agent Identity Layer 方針（`SOUL.md`/`role.md`/`skills.yaml`）を plan/spec/architecture に反映し、実装分解を固定した
- [x] [DR-20260304-agent-identity-repository] Agent Identity の file repository と Electron IPC 配線を実装し、unit test を追加した
- [x] [DR-20260304-agent-skill-reference-resolver] `skills.yaml` 由来の enabled skills を Settings のインストール済み Skill 台帳へ解決し、Guide Context Builder に接続した
- [x] [DR-20260304-guide-assignment-readiness] Guide の要望分解→Pal割当→Task作成を実装し、unit/E2E で回帰を確認した
- [x] [DR-20260304-pal-runtime-skill-execution] Guide/worker の model runtime で Skill tool-call 実行を有効化し、Task/Cron start の実行結果反映を追加した
- [x] [DR-20260304-guide-tool-loop-safeguard] tool loop 未収束時の例外停止を廃止し、fallback応答と debug trace で解析可能にした
- [x] [DR-20260304-runtime-workspace-root-from-project-focus] Guide/Pal runtime に focus project directory を渡し、file-read の root 不一致を回避した
- [x] [DR-20260304-runtime-file-search-readme-recovery] `@README.md` 参照で file-read/search が未収束になる問題を修正し、実検索と復元fallbackを実装した
- [x] [DR-20260304-tool-call-args-debug] runtime debug ログに ToolCall の引数/結果サマリを追加し、原因切り分けを容易にした
- [x] [DR-20260304-file-not-found-fallback] file-read 失敗時の loop stop fallback を「見つからない」明示応答に変更した
- [x] [DR-20260304-workspace-name-prefix-path-normalize] ToolCall の workspace名付き相対パスを runtime で吸収し、file-read/search の解決を安定化した
- [x] [DR-20260304-repeated-file-read-not-found-stop] 同一 file-read not-found の再発時に loop を早期停止し、即時に見つからない応答を返すようにした
- [x] [DR-20260306-design-tone-principles] `温かみと知性` を体験トーンとして concept/design_assist に定義し、Guide系と運用系のトーン配分を文書化した
- [x] [DR-20260306-brand-tone-framing] ブランド文と画面ごとのトーン配分表を concept/design_assist に追記した
- [x] [DR-20260306-experience-tone-doc] 体験トーンの正本として `experience_tone.md` を新設し、OVERVIEW/design_assist から参照可能にした
- [x] [DR-20260306-ui-tone-application-guide] `experience_tone.md` を UI 修正方針へ落とした `ui_tone_application.md` を新設した
- [x] [DR-20260306-guide-chat-tone-refine] Guide Chat のトーンを静かな方向へ補正し、送信中フィードバックと Guide キャラ状態連動を追加した
- [x] [DR-20260306-settings-tone-refine] Settings のトーンを静かな方向へ補正し、保存フッター状態表現と追加フォーム視認性を改善した
- [x] [DR-20260306-task-gate-tone-refine] Task Board / Gate のトーンを厳密側へ補正し、row・drawer・gate panel の状態表現を整理した
- [x] [DR-20260306-event-log-tone-refine] Event Log のトーンを監査寄りに補正し、toolbar・pager・row の状態表現を整理した
- [x] [DR-20260306-cron-tone-refine] Cron のトーンを静かな運用面へ補正し、schedule/lastRun/instruction の階層と lastRun 状態表現を追加した
- [x] [DR-20260306-doc-sync-tone-rollout] Guide/Settings/Task-Gate/Event/Cron の tone rollout を concept/spec/architecture/OVERVIEW/plan に同期した
- [x] [DR-20260306-soul-md-canonicalize] Agent Identity の個別文脈ファイル名を `SOUL.md` へ正規化し、runtime は lowercase fallback を維持した
- [x] [DR-20260306-soul-md-fallback-removal] Agent Identity の `soul.md` fallback を削除し、`SOUL.md` 単独契約へ戻した
- [x] [DR-20260306-pal-identity-template-init] Pal 作成時に locale 別 `SOUL.md` / `ROLE.md` テンプレートを生成し、Agent Identity の role file 名を `ROLE.md` へ統一した
- [x] [DR-20260306-gate-rubric-contract] Gate の個別文脈 file contract を `SOUL.md + RUBRIC.md` に変更した
- [x] [DR-20260306-guide-gate-multi-profile-requirement] Guide/Gate を singleton 前提から複数 profile 前提へ変更し、workspace の active guide / default gate 契約を concept/spec/architecture に固定した
- [x] [DR-20260306-guide-gate-multi-profile-impl] Guide/Gate の複数 profile を prototype 実装へ展開し、identity path・selection state・Pal List UI を追加した
- [x] [DR-20260306-default-gate-execution-binding] default gate を Task/Cron の gate flow に接続し、board/panel に gateProfileId と Gate summary を表示した
- [x] [DR-20260306-board-state-gate-profile-persistence] Task/Cron board state を localStorage へ保存し、reload 後も gateProfileId を維持するようにした
- [x] [DR-20260306-agent-identity-light-editor] Pal 設定モーダルから `SOUL.md` / `ROLE.md` / `RUBRIC.md` を軽量編集できる identity editor を追加した
- [x] [DR-20260306-pal-config-footer-compact] Pal 設定モーダルの footer を薄くし、Delete/Save 領域の圧迫を減らした
- [x] [DR-20260306-pal-config-modal-auto-height] Pal 設定モーダルを auto-height 化し、footer 下の大きな空白を解消した
- [x] [DR-20260306-language-system-prompt-layer] `LANGUAGE / SOUL / ROLE(RUBRIC)` を system prompt 層へ統合し、Guide/worker runtime の既定応答言語を app locale に固定した
- [x] [DR-20260306-role-specific-operating-rules] Guide/Gate/Worker の `OPERATING_RULES` を role 別に具体化した
- [x] [DR-20260306-gate-decision-schema] Gate の prototype 出力を `decision / reason / fixes` schema に揃え、Task/Job state と detail へ反映した

- [x] [SEED-20260306-execution-loop-terminology] `Execution Loop` / `PlanExecutionOrchestrator` の文書用語を concept/spec/architecture に統一する

- [x] [DR-20260306-execution-loop-terminology] `Execution Loop` を全体フロー名、`PlanExecutionOrchestrator` を実行系責務名として concept/spec/architecture に統一した

- [x] [SEED-20260306-execution-loop-context-handoff-policy] `Execution Loop` の文脈継承方針と圧縮方針を concept/spec/architecture に定義する

- [x] [DR-20260306-execution-loop-context-handoff-policy] `Guide/Worker/Gate` の文脈継承境界、`Minimal/Balanced/Verbose`、圧縮優先順を concept/spec/architecture に同期した

- [x] [SEED-20260306-execution-loop-handoff-schema] `WorkerExecutionInput` / `GateReviewInput` / `HandoffSummary` schema を concept/spec/architecture に定義する

- [x] [DR-20260306-execution-loop-handoff-schema] `WorkerExecutionInput` / `GateReviewInput` / `HandoffSummary` と compaction 適用順を concept/spec/architecture に同期した

- [x] [SEED-20260306-worker-handoff-runtime-payload] `Guide -> Worker` の handoff を `WorkerExecutionInput` ベースの runtime payload へ反映する

- [x] [DR-20260306-worker-handoff-runtime-payload] Worker runtime の `userText` を `WorkerExecutionInput` 形式へ差し替え、Balanced handoff summary を含めた

- [x] [SEED-20260306-context-handoff-policy-runtime] workspace 設定の `Context Handoff Policy` を保存可能にし、`Minimal/Balanced/Verbose` で Worker payload を shaping する

- [x] [DR-20260306-context-handoff-policy-runtime] Settings に `Context Handoff Policy` を追加し、保存・復元・Worker payload shaping (`minimal|balanced|verbose`) を runtime へ反映した

- [x] [SEED-20260306-gate-review-runtime] Gate panel 起点で `GateReviewInput` を model runtime へ渡し、suggestion として panel に反映する

- [x] [DR-20260306-gate-review-runtime] Gate panel で `GateReviewInput` を runtime へ接続し、`decision / reason / fixes` suggestion を panel と reject reason に反映した

- [x] [SEED-20260306-worker-gate-routing-basis-doc] Worker/Gate routing の判断軸 (`skills+ROLE`, `RUBRIC`) を concept/spec/architecture に明文化する

- [x] [DR-20260306-worker-gate-routing-basis-doc] Worker は `enabled skills + ROLE.md`、Gate は `RUBRIC.md` 中心で routing する原則を concept/spec/architecture に同期した

- [x] [SEED-20260306-agent-routing-selector-impl] `WorkerRoutingSelector / GateRoutingSelector` を実装し、planner と gate selection に接続する
- [x] [SEED-20260306-routing-explanation-event-log] Worker/Gate routing explanation を Event Log summary へ残し、dispatch/to_gate の根拠を追えるようにする
- [x] [SEED-20260306-e2e-spec-string-repair] `workspace-layout.spec.js` の壊れた文字列リテラルを修復し、Playwright verify を再開可能にする
- [x] [SEED-20260306-orchestration-debug-db-minimal] orchestration debug 用の最小 DB を `settings.sqlite` に追加し、Guide/Worker/Gate の runtime I/O を保存する
- [x] [SEED-20260306-orchestration-debug-cli-minimal] orchestration debug record を確認する `palpal debug runs/show` CLI を追加する
- [x] [SEED-20260306-debug-purpose-pal-profiles] 汎用 Worker seed を debug-purpose profile へ再定義し、trace/fix/verify で orchestration を確認しやすくする
- [x] [SEED-20260306-debug-purpose-identity-seeds] built-in debug profile に `SOUL.md / ROLE.md / RUBRIC.md` を不足時 seed し、初回起動から debug routing を使えるようにする
- [x] [SEED-20260306-orchestration-debug-smoke-cli] Electron 実経路の orchestration smoke を `palpal debug smoke` で起動し、debug DB/CLI で観測できるようにする

- [x] [DR-20260306-agent-routing-selector-impl] `agent-routing.js` を追加し、Worker assignment と Gate selection を selector ベースへ切り替えた
- [x] [DR-20260306-routing-explanation-event-log] dispatch/to_gate event summary に routing explanation を残し、Event Log で Worker/Gate 選定根拠を確認できるようにした
- [x] [DR-20260306-e2e-spec-string-repair] `workspace-layout.spec.js` の未終端文字列を修復し、既存 E2E を再び parse/verify 可能にした
- [x] [DR-20260306-orchestration-debug-db-minimal] `settings.sqlite` に orchestration debug table を追加し、Guide/Worker/Gate runtime の I/O を sanitized record として保存できるようにした
- [x] [DR-20260306-orchestration-debug-cli-minimal] `palpal debug runs/show` を追加し、debug DB の最新一覧と単票詳細を CLI から確認できるようにした
- [x] [DR-20260306-debug-purpose-pal-profiles] 初期 Guide/Gate/Worker profile を debug-purpose 構成へ更新し、trace/fix/verify の役割が routing に現れるようにした
- [x] [DR-20260306-debug-purpose-identity-seeds] built-in Guide/Gate/Worker に debug-purpose identity を不足時 seed し、初回起動から routing/orchestration に使えるようにした
- [x] [DR-20260306-orchestration-debug-smoke-cli] `palpal debug smoke` と stubbed Electron smoke script を追加し、実経路の debug record を CLI で追えるようにした

# current
- [ ] [SEED-20260307-first-party-rename-commit] DR-20260307-first-party-rename-tomoshibi-kan で適用済みの rename 差分を 1 commit に確定する
- [x] [DR-20260307-first-party-rename-commit] delta request/apply/verify/archive を実施し、first-party rename commit を archive まで閉じる
- [x] [SEED-20260306-guide-autonomous-check] 実モデル/CLI で Guide 単体の自律確認を行い、対話整理・task/job 分解・worker/gate routing 根拠を debug record で観測する
- [x] [DR-20260306-guide-autonomous-check] Guide 単体の自律確認 delta request を起点に、観測 runner と verify 記録を適用した

# future
- [ ] [SEED-20260306-guide-output-parser-hardening] Guide の `plan_ready` 出力に混ざる wrapper token と軽微な JSON 破損を修復し、parse 成功率を上げる
- [ ] [SEED-20260306-guide-structured-output-adoption] Guide runtime に native structured output / schema mode を導入できるか検証し、可能なら採用する
- [ ] [SEED-20260306-guide-output-prompt-tightening] Guide の output instruction を短く締め、`conversation / needs_clarification / plan_ready` の出し分けを安定化する
- [ ] [SEED-20260306-guide-needs-clarification-controller-assist] `explicit_breakdown` かつ再現手順・期待結果が揃う入力では `needs_clarification` に留まり続けないよう controller 側で補助する
- [ ] [SEED-20260306-guide-plan-materialization-e2e-check] recovered `Trace / Fix / Verify` plan が board 上で 3 task materialize されるか end-to-end で確認する
- [ ] [SEED-20260306-orchestrator-autonomous-check] Guide 出力を `PlanExecutionOrchestrator` が受けて status/handoff/routing を崩さず流せるか確認する
- [ ] [SEED-20260306-pal-autonomous-check] Pal が `WorkerExecutionInput` を受けて evidence/replay/output を返せるか確認する
- [ ] [SEED-20260306-gate-autonomous-check] Gate が `GateReviewInput` から安定した `decision/reason/fixes` を返せるか確認する
- [ ] [SEED-20260306-full-loop-autonomous-check] Guide -> Orchestrator -> Pal -> Gate の自律ループを通しで確認する

# archive
- [x] [DR-20260307-first-party-rename-commit] Tomoshibi-kan への first-party rename 差分を commit に確定した
- [x] [DR-20260307-first-party-rename-tomoshibi-kan] first-party の CLI / env / workspace / localStorage / current docs を Tomoshibi-kan 基準へ揃え、旧 palpal 系は alias / fallback として残した
- [x] [DR-20260307-guide-controller-assist-default-off] controller assist を標準OFFにし、Settings checkbox で明示ONした時だけ Guide planning cue を注入するようにした
- [x] [DR-20260307-orchestrator-three-task-cycle-check] Guide が生成した `Trace / Fix / Verify` 3 task を real runner で worker runtime / gate review / approve まで順番に流し、3件とも `done` で閉じられることを確認した
- [x] [DR-20260306-guide-planning-intent-controller-assist] planning trigger を controller 側で検知し、Guide prompt と debug meta に planning intent 補助を追加した
- [x] [DR-20260306-guide-needs-clarification-controller-assist] `explicit_breakdown` と再現手順/期待結果が揃う入力で readiness assist を追加し、Guide を `plan_ready` へ進めやすくした
- [x] [DR-20260306-guide-plan-debug-task-recovery] malformed `plan_ready` task 配列を reply または controller cue から `Trace / Fix / Verify` 3 task へ recovery できるようにした
- [x] [DR-20260306-guide-plan-materialization-e2e-check] 実モデル `guide_chat` debug payload replay から `Trace / Fix / Verify` 3 task が board へ materialize されることを確認した
- [x] [DR-20260306-guide-full-runner-stabilization] full runner の待機条件と診断を改善し、3 turn の Guide autonomous check を通る状態にした
- [x] [DR-20260306-orchestrator-autonomous-check] Guide が生成した latest task を worker runtime / gate review まで実モデルで流せることを確認した
- [x] [DR-20260306-guide-failure-mode-observation] `palpal debug guide-failures` を追加し、Guide の `plan_ready` 未到達 run を status と blocking cue で分類できるようにした
- [x] [DR-20260306-guide-simple-role-worker-hint] Guide prompt / operating rules に simple-role worker (`trace / fix / verify`) 優先の planning hint を追加した
- [x] [DR-20260306-simple-role-debug-pals] built-in debug worker の `ROLE/persona/skills` を simple-role 構成へ絞り、trace/fix/verify の 1責務を読み取りやすくした
- [x] [DR-20260306-guide-autonomous-check] 実モデルで Guide 単体確認を行い、`guide_chat` debug record と task assignment の所見を CLI で観測した





