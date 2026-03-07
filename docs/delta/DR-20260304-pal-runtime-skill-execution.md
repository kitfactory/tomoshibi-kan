# delta-request

## Delta ID
- DR-20260304-pal-runtime-skill-execution

## 目的
- Guide だけでなく各 Pal（少なくとも Task/Cron 実行主体の worker）で、`runtimeKind=model` かつ有効 Skill がある場合に tool-call 実行を有効化する。
- 特に `browser-chrome` を含む標準 Skill が Guide 応答中に実行可能な状態を作る。

## 変更対象（In Scope）
- `runtime/palpal-core-runtime.js` に Skill ID から tool を組み立てる処理と、model generate の tool-call ループ実行を追加する。
- Electron IPC に汎用 Pal 実行エンドポイント（Guide 以外でも利用）を追加する。
- `wireframe/app.js` の Guide 送信で有効 Skill ID をランタイムへ渡す。
- `wireframe/app.js` の Task/Cron `start` 実行時に、担当 Pal の model runtime を非同期実行し、結果（evidence/replay）へ反映する。
- 関連 unit test を追加・更新する。

## 非対象（Out of Scope）
- CLI runtime（`runtimeKind=tool`）での Skill 実行対応。
- Gate 判定ロジック自体の自動化・LLM化。
- Skills UI/設定画面の構造変更。
- 標準 Skill 以外の外部 Skill 実体実行（未知 Skill は実行対象外）。

## 差分仕様
- DS-01:
  - Given: Guide が `runtimeKind=model` で `enabledSkillIds` を持つ
  - When: Guide chat を送信する
  - Then: ランタイムは対応 Skill を tool 定義へ変換し、model の tool-call をループ実行して最終応答を返す
- DS-02:
  - Given: worker Pal が `runtimeKind=model` で Task/Cron `start` が押される
  - When: 背景実行が成功する
  - Then: 対象 Task/Job の `evidence`/`replay` が実行結果で更新され、Event Log に記録される
- DS-03:
  - Given: `runtimeKind=tool` またはモデル未設定
  - When: Task/Cron `start` が押される
  - Then: 従来の状態遷移は維持し、runtime 実行はスキップされる

## 受入条件（Acceptance Criteria）
- AC-01: `palpal-core-runtime` の unit test で tool-call ループ（tool 実行→再 generate）が検証される。
- AC-02: Guide 送信経路で `enabledSkillIds` が runtime に渡され、返信オブジェクトに tool 実行結果が含まれる。
- AC-03: Task/Cron `start` の既存状態遷移を壊さず、model runtime 時のみ非同期実行結果が反映される。
- AC-04: `npm run test:unit` が PASS する。

## 制約
- 既存の UI 操作フロー（Guide 送受信、Task/Cron のボタン遷移）を変更しない。
- 変更は最小差分とし、既存E2Eが依存する DOM/ラベルを壊さない。

## 未確定事項
- Q-01: 非標準 Skill の実体実行（ClawHub 由来 package 実行）の方式は次 delta で定義する。

# delta-apply

## Delta ID
- DR-20260304-pal-runtime-skill-execution

## 実行ステータス
- APPLIED

## 変更ファイル
- runtime/palpal-core-runtime.js
- electron-main.js
- electron-preload.js
- wireframe/app.js
- tests/unit/palpal-core-runtime.test.js
- docs/delta/DR-20260304-pal-runtime-skill-execution.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `requestPalChatCompletion` に model tool-call ループを追加し、`enabledSkillIds` から tool 定義を構築して実行可能化。
  - 根拠: `runModelToolLoop` / `executeRequestedToolCalls` / `buildSkillTools` を `runtime/palpal-core-runtime.js` へ実装、unit test 追加。
- AC-02:
  - 変更: Guide 送信時に `enabledSkillIds` を runtime へ渡し、返信 payload の `toolCalls` を UI 返信へ反映。
  - 根拠: `wireframe/app.js` の `requestGuideModelReplyWithFallback` と `buildGuideLiveModelReply` を更新。
- AC-03:
  - 変更: Task/Cron `start` 時に担当 Pal の model runtime を非同期実行し、`evidence/replay` と Event Log を更新。
  - 根拠: `wireframe/app.js` の `executePalRuntimeForTarget` を追加し、`runTaskAction`/`runJobAction` から起動。
- AC-04:
  - 変更: runtime unit test を追加し、既存 unit/e2e を実行。
  - 根拠: `npm run test:unit` PASS、`npm run test:e2e -- --reporter=line tests/e2e/workspace-layout.spec.js -g "guide chat resumes after registering model in settings|guide chat creates planned tasks and assigns workers|job board supports gate flow"` PASS（実行時は同spec全件99件がPASS）。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- Guide 返信に `[tools] ...` が付くケースで表示崩れがないこと。
- Task/Cron start の状態遷移（assigned -> in_progress）が従来通り即時であること。

# delta-verify

## Delta ID
- DR-20260304-pal-runtime-skill-execution

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `tests/unit/palpal-core-runtime.test.js` に tool-call ループ検証を追加し、`npm run test:unit` で PASS |
| AC-02 | PASS | `wireframe/app.js` で Guide runtime 呼び出しに `enabledSkillIds` を渡し、`toolCalls` を返信表示に反映 |
| AC-03 | PASS | `wireframe/app.js` で `executePalRuntimeForTarget` を追加し、Task/Cron start から非同期実行を接続 |
| AC-04 | PASS | `npm run test:unit` PASS、`npm run test:e2e ...` 実行結果で `workspace-layout.spec.js` 99件 PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- R-01: `codex-file-search` / `codex-file-edit` / `codex-test-runner` はプロトタイプ実装（実処理なし）で、実体実行は次 delta が必要。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260304-pal-runtime-skill-execution

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Guide と worker の model runtime で Skill tool-call 実行を有効化し、browser 含む標準 Skill を実行ループへ接続した。
- 変更対象: runtime tool-loop、IPC `pal:chat`、Guide/Task/Cron 実行配線、unit test。
- 非対象: CLI runtime の Skill 実行、Gate自動化、外部 Skill 実体実行。

## 実装記録
- 変更ファイル:
  - runtime/palpal-core-runtime.js
  - electron-main.js
  - electron-preload.js
  - wireframe/app.js
  - tests/unit/palpal-core-runtime.test.js
  - docs/delta/DR-20260304-pal-runtime-skill-execution.md
- AC達成状況:
  - AC-01: 達成
  - AC-02: 達成
  - AC-03: 達成
  - AC-04: 達成

## 検証記録
- verify要約: runtime unit test を拡張し、既存 unit/e2e 回帰も PASS。
- 主要な根拠:
  - `npm run test:unit`
  - `npm run test:e2e -- --reporter=line tests/e2e/workspace-layout.spec.js -g "guide chat resumes after registering model in settings|guide chat creates planned tasks and assigns workers|job board supports gate flow"`

## 未解決事項
- あり
  - 非標準 Skill の実体実行方式（ClawHub package 実行）は未対応。

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: 標準 Skill 実処理（search/edit/test-runner）の本実装と安全制御（allowlist/approval）を追加する。
