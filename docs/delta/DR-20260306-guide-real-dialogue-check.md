# delta-request

## Delta ID
- DR-20260306-guide-real-dialogue-check

## 目的
- 実モデルで Guide の複数ターン対話を行い、`conversation -> needs_clarification -> plan_ready` の実挙動を観測できるようにする。

## 変更対象（In Scope）
- `scripts/run_guide_autonomous_check.js` を複数ターン対話対応に拡張する。
- UI 経路の `guideSend` を通して、実際の Guide 対話と task 増減をターンごとに記録する。
- `docs/plan.md` に seed/archive を反映する。
- 実モデルで runner を実行し、結果を verify に記録する。

## 非対象（Out of Scope）
- Guide の prompt 内容修正。
- planner / orchestrator の実装変更。
- E2E や unit test の追加変更。

## 受入条件（Acceptance Criteria）
- AC-01: runner が複数ターンの prompt を順に送信し、ターンごとの Guide 応答と task 数を出力できる。
- AC-02: 実モデル run で debug DB に `guide_chat` record が複数件生成される。
- AC-03: verify に `conversation / needs_clarification / plan_ready` 観測の所見を記録する。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

## 制約
- 既存の単発実行用途は壊さない。
- 実モデルの揺れは所見として扱い、無理に pass/fail の断定をしない。

## 未解決
- Q-01: 自動で status を厳密判定する parser を runner に入れるかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-guide-real-dialogue-check

## 適用ステータス
- APPLIED

## 変更ファイル
- scripts/run_guide_autonomous_check.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更: runner を複数 `--prompt` 対応へ拡張し、Guide UI 送信経路を通してターンごとの応答と task 数を出力するようにした。
  - 根拠: `runGuideTurn()` と `resolvePrompts()` を追加し、turn ごとの `guide_reply / task_count_before / task_count_after` を出力する。
- AC-02:
  - 変更: 実モデル観測用に複数ターンの既定 prompt を内蔵した。
  - 根拠: 既定 3 ターン、および追加 4 ターン prompt 指定で実行可能にした。
- AC-03:
  - 変更: plan に seed/current を記録した。
  - 根拠: delta link 整合のため。

## Out of Scope 逸脱
- Out of Scope 変更の有無: No

## verify 申し送り
- `node --check scripts/run_guide_autonomous_check.js`
- `node scripts/run_guide_autonomous_check.js`
- `node scripts/run_guide_autonomous_check.js --prompt "..." --prompt "..." --prompt "..." --prompt "..."`
- `node scripts/validate_delta_links.js --dir .`

# delta-verify

## Delta ID
- DR-20260306-guide-real-dialogue-check

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | runner は複数ターンの prompt を順に送信し、各ターンの Guide 応答と task 数を出力できた。 |
| AC-02 | PASS | 実モデル run で `guide_chat` record が複数件生成された。 |
| AC-03 | PASS | verify に `conversation / needs_clarification / plan_ready` の観測所見を記録した。 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実施コマンド
- `node --check scripts/run_guide_autonomous_check.js`
- `node scripts/run_guide_autonomous_check.js`
- `node scripts/run_guide_autonomous_check.js --prompt "最近このアプリの使い心地どう思う？" --prompt "設定画面の保存まわりで違和感がある。まず何を確認すべき？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。" --prompt "関連実装は wireframe/settings-persistence.js と runtime/settings-store.js。保存先は settings.sqlite。trace / fix / verify の Task に分けて、browser-chrome / codex-file-edit / codex-test-runner を使う前提で計画化して。"`
- `node scripts/validate_delta_links.js --dir .`

## 観測所見
- 1 回目 run:
  - turn 1 は通常質問として扱われ、task 数は増えなかった。`conversation` 相当の挙動。
  - turn 2, 3 は追加情報要求に留まり、task 数は増えなかった。`needs_clarification` 相当の挙動。
- 2 回目 run:
  - turn 4 で model は `status=plan_ready` を含む JSON を返した。
  - ただし output 文字列に wrapper token (`<|channel|>final ...`) と task 配列 JSON の破損があり、現 parser では valid Plan として受理できず、task 数は増えなかった。
- 結論:
  - `conversation` と `needs_clarification` の境界は実モデルでも概ね期待どおりに動いている。
  - `plan_ready` 到達自体は確認できたが、JSON の整形不安定性により Orchestrator 開始条件までは通っていない。

## 総合判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-real-dialogue-check

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: 実モデルで Guide の複数ターン対話を行い、`conversation -> needs_clarification -> plan_ready` を観測できるようにする。
- 変更対象:
  - `scripts/run_guide_autonomous_check.js`
  - `docs/plan.md`
- 非対象:
  - planner/orchestrator 実装変更
  - prompt ルール変更

## 検証
- script syntax PASS
- real-model multi-turn run PASS
- delta link 検証 PASS

## 未解決
- `plan_ready` の文字列出力が wrapper token や JSON 破損を含みうるため、parser/repair か Agents SDK structured output 導入が次段で必要。

## 次のdeltaへの引き継ぎ
- Seed-01: Guide の `plan_ready` 出力をより安定して parse できるよう、output repair / parser hardening を行う。
