# delta-request

## Delta ID
- DR-20260306-guide-planning-intent-controller-assist

## 目的
- ユーザーが明示的に plan / task 分解を求めているのに Guide が `conversation` に留まり続ける問題を減らすため、controller 側で planning trigger を検知して Guide prompt を補助する。

## In Scope
- planning trigger 検知 helper を追加する。
- Guide runtime 呼び出し時に planning intent assist prompt を追加する。
- debug meta に planning intent を残す。
- unit test を追加する。
- `docs/spec.md` / `docs/architecture.md` に最小同期する。
- `docs/plan.md` に seed/archive を追加する。

## Out of Scope
- Guide parser の変更
- routing algorithm の変更
- debug DB schema の変更
- UI 追加

## Acceptance Criteria
- AC-01: `trace / fix / verify に分けて進めたい` のような入力を planning trigger として検知できる。
- AC-02: planning trigger がある時、Guide system prompt に `conversation に留まらず needs_clarification か plan_ready を返す` 補助文が追加される。
- AC-03: debug meta に planning intent が残る。
- AC-04: unit test と real runner 観測が PASS する。

# delta-apply

## Delta ID
- DR-20260306-guide-planning-intent-controller-assist

## ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-planning-intent.js
- wireframe/index.html
- wireframe/app.js
- tests/unit/guide-planning-intent.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

# delta-verify

## Delta ID
- DR-20260306-guide-planning-intent-controller-assist

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | planning trigger helper で明示的な plan/task breakdown 要求を検知できた。 |
| AC-02 | PASS | trigger 時のみ Guide system prompt に controller assist が追加された。 |
| AC-03 | PASS | debug meta に planning intent を保存した。 |
| AC-04 | PASS | unit test + real runner + guide-failures observation が通過した。 |

## 主な検証コマンド
- `node --check wireframe/guide-planning-intent.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-planning-intent.test.js`
- `node scripts/run_guide_autonomous_check.js`
- `node cli/palpal.js debug guide-failures --limit 20`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- PASS

# delta-archive

## Delta ID
- DR-20260306-guide-planning-intent-controller-assist

## クローズ条件
- verify判定: PASS
- archive可否: 可

## 要約
- planning trigger を controller 側で検知し、Guide に `conversation` ではなく `needs_clarification / plan_ready` を返しに行かせる補助を追加した。

## 次のdeltaへの引き継ぎ
- Seed-01: 観測された結果を基に `plan_ready` materialization 条件をさらに詰める。
