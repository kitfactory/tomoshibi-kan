# delta-request

## Delta ID
- DR-20260307-guide-progress-query-minimal

## 目的
- Guide が progress log を読んで、ユーザーの task/job 進捗確認質問へローカルに答えられるようにする。
- まずは「今どうなっているか」「完了しているか」の最小 query に閉じ、replan や深い要約は含めない。

## 変更対象（In Scope）
- 対象1: `wireframe/app.js` の progress query 判定 / target 解決 / reply 生成
- 対象2: progress query を `sendGuideMessage()` へ接続する最小フロー
- 対象3: 最小限の E2E または unit test 追加
- 対象4: `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` と本 delta 文書の最小同期

## 非対象（Out of Scope）
- 非対象1: Guide が progress log を使って replan を行う機能
- 非対象2: 新しい progress UI タブや detail redesign
- 非対象3: 自然言語理解の高度化や曖昧参照の完全対応
- 非対象4: `docs/plan.md` 全体の文字化け修復
- 非対象5: ユーザー未追跡ファイル `docs/tomoshibikan_resident_set_v0_1.md`

## 差分仕様
- DS-01:
  - Given: task/job progress log が保存されている
  - When: ユーザーが task/job の進捗確認に当たる質問をする
  - Then: Guide は progress log から最新状態を読み、ローカル reply を返す
- DS-02:
  - Given: 質問に `TASK-xxx` / `JOB-xxx` の明示 ID が含まれる場合と含まれない場合がある
  - When: Guide が target を解決する
  - Then: 明示 ID があればそれを優先し、無ければ最新の task/job progress を使う
- DS-03:
  - Given: target が完了状態か途中状態かがある
  - When: Guide が reply を組み立てる
  - Then: 少なくとも `完了 / 承認待ち / 差し戻し / 実行中 / 割り当て済み` を区別して返す

## 受入条件（Acceptance Criteria）
- AC-01: progress query を検知する helper と target 解決 helper が追加される
- AC-02: `sendGuideMessage()` は progress query の時に model 呼び出しを行わず、ローカル reply を返す
- AC-03: task 完了後の質問に対して、Guide reply が completion を示す
- AC-04: unit または E2E で progress query の最小ケースが PASS する
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1: 既存 planning / conversation / plan_ready フローを壊さない
- 制約2: progress query reply は簡潔な自然文に留め、replan や task 生成は行わない
- 制約3: query は progress log と現行 board state だけを使い、追加の LLM 呼び出しは行わない

## 未確定事項
- Q-01: 「さっきお願いした件」のような曖昧参照は latest progress で代用し、複数候補の disambiguation は今回扱わない

# delta-apply

## 実施内容
- `wireframe/app.js` に progress query 判定 / target 解決 / reply 生成 helper を追加した
- `sendGuideMessage()` で model 呼び出し前に progress query を処理するよう接続した
- `tests/e2e/workspace-layout.spec.js` に completed task への progress query と model bypass の確認を追加した
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` を最小同期した

## In Scope 実績
- DS-01: progress log からローカル reply を返す helper を追加
- DS-02: 明示 ID 優先 / latest fallback の target 解決を追加
- DS-03: `done / to_gate / rejected / in_progress / assigned` の簡易 reply を追加

# delta-verify

## 実行結果
- AC-01: PASS
  - `isGuideProgressQuery`, `resolveGuideProgressQueryTarget`, `buildGuideProgressQueryReply` を追加
- AC-02: PASS
  - `sendGuideMessage()` が progress query の時に model 呼び出し前で return
- AC-03: PASS
  - completed task への query で `完了しています。直近では Gate が承認しました。` を返す E2E を追加
- AC-04: PASS
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide progress query reports completed task without model call|task progress log stores dispatch and gate flow entries|guide chat creates planned tasks and assigns workers|job board supports gate flow"` -> 12 passed
- AC-05: PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 所見
- minimal 実装としては progress inquiry のローカル応答と completion 状態説明まで閉じた
- 曖昧参照の disambiguation や Guide による詳細要約は未着手
- verify result: PASS

# delta-archive

## archive
- PASS
- Guide が progress log を読んで、task/job の途中経過と完了状態を model 呼び出しなしで返せる minimal progress query を実装した
