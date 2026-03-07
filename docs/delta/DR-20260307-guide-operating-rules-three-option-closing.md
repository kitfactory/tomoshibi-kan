# delta-request

## Delta ID
- DR-20260307-guide-operating-rules-three-option-closing

## 目的
- Guide が `scope_unclear` の短いターンで、可能性の高い順に 3 案を提示し、1 案を推薦し、`1でよいですか？` のように短く答えやすい締めを返すよう `OPERATING_RULES` を強化する。

## In Scope
- Guide 用 `OPERATING_RULES` に `3案提示 + 推薦 + short-answer closing` を追加する
- 関連 unit test を更新する
- assist OFF 条件で `run_guide_autonomous_check.js` を再実行し、Guide 応答傾向を再観測する
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` を最小同期する

## Out of Scope
- controller assist / parser / structured output の変更
- ROLE.md / SOUL.md の変更
- Worker / Gate / UI の変更

## Acceptance Criteria
- AC-01: Guide 用 `OPERATING_RULES` が、短い `scope_unclear` では可能性順の 3 案提示、1 案推薦、短い返答で選べる締めを明示する
- AC-02: 関連 unit test が更新され PASS する
- AC-03: assist OFF 条件で `run_guide_autonomous_check.js` を再実行できる
- AC-04: verify に assist OFF 再実行後の Guide 応答傾向と `conversation / needs_clarification / plan_ready / task_count` 観測を残す
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-operating-rules-three-option-closing

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- wireframe/context-builder.js
- tests/unit/context-builder.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- Guide 用 `OPERATING_RULES` に、短い `scope_unclear` では可能性順の 3 案提示、1 案推薦、`1でよいですか？` のような short-answer closing を追加した
- unit test と docs をこのルールに合わせて更新した

# delta-verify

## Delta ID
- DR-20260307-guide-operating-rules-three-option-closing

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` と `wireframe/context-builder.js` に 3 案提示、1 案推薦、short-answer closing を追加した |
| AC-02 | PASS | `node --test tests/unit/context-builder.test.js` PASS |
| AC-03 | PASS | `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000` を assist OFF で完走できた |
| AC-04 | PASS | assist OFF 再観測で `conversation:conversation | count=1`, `needs_clarification:scope_unclear | count=1`, `needs_clarification:general_clarification | count=1`, `task_count_before=3 / after=3` を記録した |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check wireframe/context-builder.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/context-builder.test.js`
- `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 180000`
- `$env:PALPAL_WS_ROOT='C:\\Users\\kitad\\AppData\\Local\\Temp\\palpal-guide-check-OmMvyo'; node cli/palpal.js debug guide-failures --limit 10`
- `node scripts/validate_delta_links.js --dir .`

## 観測所見
- 2 ターン目では狙いどおり、`1. UIの見た目・操作性 2. 設定が正しく保存されない 3. 保存後の挙動` という 3 択が返った
- ただし 1 案推薦や `1でよいですか？` のような締めまではまだ再現していない
- 3 ターン目は再び一般的な追加質問へ戻っており、`plan_ready` には進まなかった
- つまり 3 案提示ルールは一部効いたが、`推薦` と `short-answer closing` はまだ model へ十分には効いていない

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-operating-rules-three-option-closing

## クローズ状態
- verify 結果: PASS
- archive 可否: 可

archive status: PASS

## まとめ
- Guide の `OPERATING_RULES` に 3 案提示ルールを追加し、assist OFF の実モデルでも 2 ターン目では 3 択が返るところまで改善した
- ただし `1件推薦` と `短い返答で選べる締め` はまだ弱く、次は few-shot か ROLE 側の押し方が必要
