# delta-request

## Delta ID
- DR-20260306-guide-structured-output-adoption

## 目的
- Guide runtime に native structured output (`response_format: json_schema`) を導入し、`plan_ready` 出力の安定性を上げる。

## In Scope
- `wireframe/guide-plan.js` に Guide Plan 用の response schema を追加
- `wireframe/app.js` から Guide chat payload に `responseFormat` を渡す
- `electron-main.js` と `runtime/palpal-core-runtime.js` で Guide 専用 structured output path を追加
- structured output 失敗時の fallback を unit test で固定
- `spec/architecture/plan` の最小同期

## Out of Scope
- Worker / Gate への structured output 展開
- prompt 文言の最適化
- Orchestrator / task materialization の修正

## Acceptance Criteria
- AC-01: Guide Plan schema を `response_format: json_schema` として生成できる
- AC-02: Guide runtime が structured output 成功時に native path を使う
- AC-03: structured output 失敗時は既存 model path に fallback する
- AC-04: 実モデルの `guide_chat` debug record に `responseFormat` が残り、output が pure JSON で返ることを確認できる
- AC-05: unit test と delta link validate が PASS する

## 制約
- Guide 以外の runtime 契約は変えない
- provider 非対応時は fallback で壊さない

## 未解決
- Q-01: LM Studio / gpt-oss で `plan_ready` まで安定到達するかは prompt tightening と別途観測する

# delta-apply

## Delta ID
- DR-20260306-guide-structured-output-adoption

## 適用ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- wireframe/app.js
- electron-main.js
- runtime/palpal-core-runtime.js
- tests/unit/guide-plan.test.js
- tests/unit/palpal-core-runtime.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更: `buildGuidePlanResponseFormat()` を追加した
  - 理由: Guide Plan schema を runtime に渡すため
- AC-02:
  - 変更: Guide chat payload に `responseFormat` を追加し、runtime に structured output path を追加した
  - 理由: provider が対応している場合に native schema mode を優先するため
- AC-03:
  - 変更: structured output fetch 失敗時は既存 `model.generate()` path に戻る fallback を追加した
  - 理由: provider 差分で Guide chat を壊さないため
- AC-04:
  - 変更: debug input に `responseFormat` を残すようにした
  - 理由: 実動観測で schema mode の使用有無を追跡するため
- AC-05:
  - 変更: unit test と正本同期を追加した
  - 理由: delta verify と文書整合を満たすため

## Out of Scope 確認
- Out of Scope 変更の混入: No

## verify 予定
- `node --check runtime/palpal-core-runtime.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js tests/unit/palpal-core-runtime.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .`

# delta-verify

## Delta ID
- DR-20260306-guide-structured-output-adoption

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `buildGuidePlanResponseFormat()` を追加し unit test で `json_schema` contract を確認した |
| AC-02 | PASS | `requestGuideChatCompletion()` の native structured output path を unit test で確認した |
| AC-03 | PASS | structured output fetch 失敗時に既存 model path へ戻る unit test を追加した |
| AC-04 | PASS | 実モデル `guide_chat` debug record に `responseFormat` が残り、output が pure JSON で返ることを確認した |
| AC-05 | PASS | targeted unit test と delta link validate が PASS した |

## スコープ外変更チェック
- Out of Scope 変更の混入: No
- 補足: 実モデル run では pure JSON は返るが、4 ターン目は still `needs_clarification` であり `plan_ready` 到達率の改善は後続 delta の対象

## 実行コマンド
- `node --check runtime/palpal-core-runtime.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js tests/unit/palpal-core-runtime.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-structured-output-adoption

## クローズ条件
- verify 判定: PASS
- archive 可否: 可

## サマリ
- 目的: Guide runtime に native structured output を導入し、pure JSON 出力を優先できるようにした
- 変更範囲:
  - `wireframe/guide-plan.js`
  - `wireframe/app.js`
  - `electron-main.js`
  - `runtime/palpal-core-runtime.js`
  - `tests/unit/guide-plan.test.js`
  - `tests/unit/palpal-core-runtime.test.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
- 非対象:
  - prompt tightening
  - Orchestrator / task materialization 改善
  - Worker / Gate structured output

## 検証
- `node --check runtime/palpal-core-runtime.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js tests/unit/palpal-core-runtime.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .` PASS

## 未解決
- structured output 化だけでは 4 ターン目の `plan_ready` 到達までは安定していない
- 次は prompt tightening と Orchestrator downstream verify が必要

## 次の delta への引き継ぎ
- Seed-01: Guide output prompt を tightening し、`plan_ready` 到達条件をより明確にする
