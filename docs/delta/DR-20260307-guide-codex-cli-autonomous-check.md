# delta-request

## Delta ID
- DR-20260307-guide-codex-cli-autonomous-check

## 目的
- Guide を `runtimeKind=tool` / `toolName=Codex` に設定した実経路で、`conversation -> needs_clarification or 3択提案 -> plan_ready -> task materialization` が成立するかを確認する。

## 変更対象（In Scope）
- `scripts/run_guide_autonomous_check.js` の最小拡張
- 必要最小限の unit または smoke verify
- `docs/plan.md` と本 delta の記録

## 非対象（Out of Scope）
- Guide runtime 実装そのものの redesign
- Worker / Gate の CLI runtime 実行
- prompt tuning や SOUL/ROLE の再設計
- Settings UI 変更

## 受入条件（Acceptance Criteria）
- AC-01: Guide autonomous runner が `--guide-runtime tool --guide-tool Codex` で実行できる
- AC-02: Codex CLI 実経路で少なくとも `guide_chat` debug record を生成できる
- AC-03: 実運転結果として `conversation / needs_clarification / plan_ready` と task materialization の有無を観測記録に残す
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-codex-cli-autonomous-check

## ステータス
- APPLIED

## 変更ファイル
- scripts/run_guide_autonomous_check.js
- runtime/cli-tool-runtime.js
- tests/unit/cli-tool-runtime.test.js
- tests/unit/palpal-core-runtime.test.js
- docs/plan.md
- docs/delta/DR-20260307-guide-codex-cli-autonomous-check.md

## 適用内容
- `run_guide_autonomous_check.js` に `--guide-runtime tool --guide-tool Codex` を追加し、Guide を CLI runtime に固定して real runner を回せるようにした。
- runner は tool runtime 時に Settings へ `Codex` を登録してから Guide profile を tool へ切り替えるようにした。
- Windows では `codex exec` を `pwsh -NoProfile -Command` wrapper 経由で呼び、prompt は temp file から読み込むようにして quoting 問題を回避した。
- unit test は Windows wrapper を test から切り離せるように最小調整した。

# delta-verify

## Delta ID
- DR-20260307-guide-codex-cli-autonomous-check

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `node scripts/run_guide_autonomous_check.js --guide-runtime tool --guide-tool Codex --turn-timeout-ms 180000` が完走した。 |
| AC-02 | PASS | real runner の出力で `guide_run_count=3` と `guide_run_1..3` の debug record 生成を確認した。 |
| AC-03 | PASS | turn 1/2 は 3択提案付きの通常対話、turn 3 は `plan_ready` 相当で `task_count_after=6` となり `Trace / Fix / Verify` の materialization を確認した。 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check runtime/cli-tool-runtime.js`
- `node --check scripts/run_guide_autonomous_check.js`
- `node --test tests/unit/cli-tool-runtime.test.js tests/unit/palpal-core-runtime.test.js`
- `node scripts/run_guide_autonomous_check.js --guide-runtime tool --guide-tool Codex --turn-timeout-ms 180000`
- `node scripts/validate_delta_links.js --dir .`

## 観測結果
- workspace: `C:\\Users\\kitad\\AppData\\Local\\Temp\\tomoshibi-kan-guide-check-Th04az`
- `assist_enabled=false`
- `guide_runtime=tool`
- `guide_tool=Codex`
- turn 1: 3択提案 + recommendation、task materialization なし
- turn 2: 保存まわりの 3択提案 + recommendation、task materialization なし
- turn 3: `Trace / Fix / Verify` の 3段計画へ進み、`task_count_before=3 -> task_count_after=6`

## 既知事項
- plan 作成自体は成立したが、routing 品質は完全ではない。観測では `Trace` が `pal-beta` に割り当たっており、simple-role worker との一致精度は別 delta で見直す余地がある。
- この delta は Guide + Codex CLI の planning 観測のみであり、Codex CLI を使った worker/gate 実行は scope 外。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-codex-cli-autonomous-check

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- Codex CLI を Guide runtime とした実経路で、3択提案から `Trace / Fix / Verify` の plan 作成と task materialization まで確認できた。
- Windows の `codex exec` は direct spawn ではなく `pwsh` wrapper が必要であることを実装に反映した。
- Guide planning は成立している一方、worker routing の質は別論点として残る。
