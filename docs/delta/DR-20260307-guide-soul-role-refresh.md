# delta-request

## Delta ID
- DR-20260307-guide-soul-role-refresh

## 背景
- Guide の人物像と役割について、`灯火館 管理人 / Guide` としての新しい `SOUL.md` 草案が提示された。
- 一方で、現在の Guide には `work intent` 判定、3案提示、`plan_ready` への移行など、実モデルでようやく安定してきた task 聞き取りハーネスがある。
- そのため、Guide の identity 層だけを更新し、`OPERATING_RULES` と few-shot の性能を落とさない範囲で取り込みたい。

## In Scope
- `runtime/agent-identity-store.js` の Guide 用 default `SOUL.md` / `ROLE.md` を、新しい人物像に沿って更新する。
- `wireframe/debug-identity-seeds.js` の `guide-core` seed を、新しい Guide 像に沿って更新する。
- unit test を追加または更新し、Guide template の主要文言と、既存の Guide rules/few-shot の回帰がないことを確認する。
- `docs/plan.md` と当該 delta を archive まで閉じる。

## Out of Scope
- `OPERATING_RULES` のロジック変更
- few-shot の内容変更
- 既存 workspace 上の `guide-core` identity file の自動上書き
- `Pal / Guide / Gate` の名称変更

## Acceptance Criteria
- AC-01: Guide 用 default `SOUL.md` が、管理人/案内役/受け止める人としての人物像を表現している。
- AC-02: Guide 用 default `ROLE.md` が、日常会話の受け止めと依頼整理・橋渡しの実務を分離して表現している。
- AC-03: `guide-core` debug seed も同じ方向へ更新されている。
- AC-04: 既存の Guide `OPERATING_RULES` / few-shot 回帰テストが PASS し、task 聞き取りハーネスの主要挙動を落としていない。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-guide-soul-role-refresh

## ステータス
- APPLIED

## 変更ファイル
- runtime/agent-identity-store.js
- wireframe/debug-identity-seeds.js
- tests/unit/agent-identity-store.test.js
- tests/unit/debug-identity-seeds.test.js
- tests/unit/context-builder.test.js
- tests/unit/guide-plan.test.js
- docs/plan.md

## 適用内容
- Guide 用 default `SOUL.md` を、管理人としての空気、受け止め方、橋渡しの姿勢を中心に書き換えた。
- Guide 用 default `ROLE.md` を、日常会話の受け止めと依頼整理・Worker/Gate への橋渡しという実務へ整理した。
- `guide-core` debug seed の `SOUL.md` / `ROLE.md` も同じ方針に揃えた。
- 既存の `OPERATING_RULES` と few-shot は変更していない。

# delta-verify

## Delta ID
- DR-20260307-guide-soul-role-refresh

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | Guide 用 default `SOUL.md` に、管理人 / 受け止める / 急かさない / 橋渡しする人物像を反映した。 |
| AC-02 | PASS | Guide 用 default `ROLE.md` に、日常会話の相手 / 依頼の案内役 / 住人への橋渡しを整理した。 |
| AC-03 | PASS | `guide-core` debug seed の `SOUL.md` / `ROLE.md` を同じ方向へ更新した。 |
| AC-04 | PASS | `context-builder` / `guide-plan` の既存回帰テストが PASS し、Guide rules/few-shot の主要挙動を維持した。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --test tests/unit/agent-identity-store.test.js tests/unit/debug-identity-seeds.test.js tests/unit/context-builder.test.js tests/unit/guide-plan.test.js`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-soul-role-refresh

## クローズ条件
- verify 判定: PASS
- archive 判定: 実施済み

archive status: PASS

## まとめ
- Guide の identity 層を `灯火館 管理人 / Guide` の方向へ更新した。
- 変更は `SOUL.md` / `ROLE.md` / debug seed に限定し、`OPERATING_RULES` と few-shot は維持した。
- task 聞き取りハーネスの主要回帰は確認済み。
