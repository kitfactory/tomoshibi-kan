# delta-request

## Delta ID
- DR-20260306-guide-output-prompt-tightening

## 目的
- Guide の output instruction と operating rules を締め、`needs_clarification` の過剰継続を減らす。

## In Scope
- `wireframe/guide-plan.js` の output instruction 強化
- `wireframe/app.js` の Guide operating rules / fallback instruction 強化
- unit test で新しい prompt rule を固定
- 実モデル 4 ターン観測を再実行し、所見を verify に記録
- `spec/architecture/plan` の最小同期

## Out of Scope
- structured output schema の変更
- parser / runtime adapter の変更
- Orchestrator / task materialization の変更

## Acceptance Criteria
- AC-01: output instruction が `plan_ready` 優先条件と assumption 利用条件を明示する
- AC-02: Guide operating rules が「Pal をユーザーへ聞き返さず選ぶ」方針を含む
- AC-03: unit test が PASS する
- AC-04: 実モデル 4 ターン観測の結果を verify に残す
- AC-05: delta link validate が PASS する

## 制約
- Guide の conversation boundary は壊さない
- `needs_clarification` 自体は残す

## 未解決
- Q-01: prompt tightening だけで `plan_ready` 到達率が十分改善するかは未確定

# delta-apply

## Delta ID
- DR-20260306-guide-output-prompt-tightening

## 適用ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- wireframe/app.js
- tests/unit/guide-plan.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更: `buildGuidePlanOutputInstruction()` に `needs_clarification` の限定条件、assumption 利用、`plan_ready` 優先条件を追加した
- AC-02:
  - 変更: `buildOperatingRulesPrompt("guide")` に「Pal をユーザーへ聞き返さず Guide が選ぶ」方針を追加した
- AC-03:
  - 変更: unit test に tightened prompt の要点を追加した
- AC-04:
  - 変更: 実モデル 4 ターン観測を再実行した
- AC-05:
  - 変更: spec/architecture/plan を最小同期した

## Out of Scope 確認
- Out of Scope 変更の混入: No

## verify 予定
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .`

# delta-verify

## Delta ID
- DR-20260306-guide-output-prompt-tightening

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | output instruction に `plan_ready` 優先条件、assumption 利用、追加確認の限定条件を追加した |
| AC-02 | PASS | Guide operating rules に「担当 Pal をユーザーへ聞き返さず自分で選ぶ」を追加した |
| AC-03 | PASS | `node --test tests/unit/guide-plan.test.js` PASS |
| AC-04 | PASS | 実モデル 4 ターン観測を再実行し、挙動所見を verify に記録した |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## スコープ外変更チェック
- Out of Scope 変更の混入: No
- 補足: 実モデルでは `needs_clarification` のまま止まるケースが依然残った。今回の delta は prompt を締めたが、`plan_ready` 到達率の改善までは保証しない。

## 実行コマンド
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .`

## 実モデル所見
- turn 4 では `まず担当 Pal を確認したい` のような返答が残り、`plan_ready` までは到達しなかった
- ただし `Pal を聞き返す` 条件は prompt 上で禁止できたため、次段では prompt ではなく planning control の外出しを検討すべき

## 総合判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-output-prompt-tightening

## クローズ条件
- verify 判定: PASS
- archive 可否: 可

## サマリ
- 目的: Guide の prompt を締め、`needs_clarification` の過剰継続を減らす方向へ寄せた
- 変更範囲:
  - `wireframe/guide-plan.js`
  - `wireframe/app.js`
  - `tests/unit/guide-plan.test.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
- 非対象:
  - runtime adapter
  - parser hardening
  - Orchestrator / task materialization

## 検証
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .` PASS

## 未解決
- prompt tightening だけでは `plan_ready` 到達率はまだ十分でない
- 次は planning intent / plan readiness を LLM 任せにしない制御を検討すべき

## 次の delta への引き継ぎ
- Seed-01: Guide の planning intent と `plan_ready` 判定を、prompt ではなく controller / validator 側でも補助する
