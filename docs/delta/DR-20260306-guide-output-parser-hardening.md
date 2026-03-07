# delta-request

## Delta ID
- DR-20260306-guide-output-parser-hardening

## 目的
- Guide の `plan_ready` 出力に混ざる wrapper token と軽微な JSON 破損を吸収し、valid Plan の受理率を上げる。

## In Scope
- `wireframe/guide-plan.js` の parser hardening
- wrapper token 除去、code fence 除去、軽微な JSON repair の追加
- unit test に wrapper token / damaged JSON ケースを追加
- `docs/plan.md` の最小更新

## Out of Scope
- structured output adoption
- Guide prompt の文言変更
- Orchestrator 側の変更

## Acceptance Criteria
- AC-01: wrapper token 付き `plan_ready` 出力を parser が受理できる
- AC-02: 軽微な JSON 破損の一部を repair して受理できる
- AC-03: 修復不能な出力は fail-safe に invalid のまま返る
- AC-04: unit test と delta link validate が PASS する

## 制約
- parser は保守的に修復する
- JSON の意味が変わるような積極修正はしない

## 未解決
- Q-01: どこまで repair を許容するかは、structured output adoption 後に再評価する

# delta-apply

## Delta ID
- DR-20260306-guide-output-parser-hardening

## 適用ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- tests/unit/guide-plan.test.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更: wrapper token を除去する `stripWrapperTokens()` を追加した
  - 理由: `gpt-oss` 系出力に混ざる `<|channel|>...` を parse 前に吸収するため
- AC-02:
  - 変更: JSON candidate 抽出と軽微 repair を行う `buildJsonCandidates()` / `repairJsonText()` / `parseJsonWithRepairs()` を追加した
  - 理由: quoted object と trailing comma 程度の軽微破損を受け側で吸収するため
- AC-03:
  - 変更: unrecoverable payload の unit test を追加した
  - 理由: 壊れた出力を無理に通さない fail-safe を固定するため
- AC-04:
  - 変更: plan current/archive を更新した
  - 理由: delta 運用の current/archive を同期するため

## Out of Scope 確認
- Out of Scope 変更の混入: No

## verify 予定
- `node --check wireframe/guide-plan.js`
- `node --test tests/unit/guide-plan.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .`

# delta-verify

## Delta ID
- DR-20260306-guide-output-parser-hardening

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | wrapper token 付き `plan_ready` payload を unit test で受理した |
| AC-02 | PASS | quoted object / trailing comma を含む damaged JSON を unit test で repair 受理した |
| AC-03 | PASS | unrecoverable payload は invalid のまま返ることを unit test で確認した |
| AC-04 | PASS | unit test と delta link validate が PASS した |

## スコープ外変更チェック
- Out of Scope 変更の混入: No
- 補足: 実モデル 4 ターン run では `plan_ready` 文字列自体は parse 可能になったが、task materialization まで到達しない挙動が残っている。これは本 delta の対象外で、後続の structured output / downstream verify で扱う。

## 実行コマンド
- `node --check wireframe/guide-plan.js`
- `node --test tests/unit/guide-plan.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-output-parser-hardening

## クローズ条件
- verify 判定: PASS
- archive 可否: 可

## サマリ
- 目的: Guide の `plan_ready` 出力に混ざる wrapper token と軽微な JSON 破損を parser 側で吸収し、valid Plan 受理の耐性を上げた
- 変更範囲:
  - `wireframe/guide-plan.js`
  - `tests/unit/guide-plan.test.js`
  - `docs/plan.md`
- 非対象:
  - structured output adoption
  - Guide output prompt tightening
  - Orchestrator / task materialization の後段検証

## 検証
- `node --check wireframe/guide-plan.js`
- `node --test tests/unit/guide-plan.test.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .` PASS

## 未解決
- parser hardening だけでは full loop 完走には至っていない
- 次は `Guide structured output adoption` と `task materialization` 側の verify が必要

## 次の delta への引き継ぎ
- Seed-01: Guide runtime の native structured output / schema mode 採用を検証する
