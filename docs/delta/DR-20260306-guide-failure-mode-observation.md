# delta-request

## Delta ID
- DR-20260306-guide-failure-mode-observation

## 目的
- `plan_ready` に抜けない Guide run を debug CLI で分類し、次の controller 補助に必要な failure mode を見えるようにする。

## In Scope
- `cli/palpal.js` に `palpal debug guide-failures` を追加する。
- `guide_chat` debug record を `status + blocking cue` で分類する helper を追加する。
- `tests/unit/palpal-cli.test.js` に guide failure classification の test を追加する。
- `docs/spec.md` / `docs/architecture.md` に最小同期する。
- `docs/plan.md` に seed/archive を追加する。

## Out of Scope
- Guide controller の変更
- prompt の変更
- debug DB schema の変更
- UI 追加

## Acceptance Criteria
- AC-01: `palpal debug guide-failures` が `guide_chat` record を分類して要約表示できる。
- AC-02: `needs_clarification` / `conversation` / `plan_ready` / parse failure / runtime error を区別できる。
- AC-03: unit test と実 runner + CLI 観測が PASS する。

# delta-apply

## Delta ID
- DR-20260306-guide-failure-mode-observation

## ステータス
- APPLIED

## 変更ファイル
- cli/palpal.js
- tests/unit/palpal-cli.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

# delta-verify

## Delta ID
- DR-20260306-guide-failure-mode-observation

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | `palpal debug guide-failures` を追加し、guide failure summary を表示できた。 |
| AC-02 | PASS | Guide status / parse failure / runtime error を分類できた。 |
| AC-03 | PASS | unit test + real runner + CLI observation + delta link validation が通過した。 |

## 主な検証コマンド
- `node --check cli/palpal.js`
- `node --test tests/unit/palpal-cli.test.js`
- `node scripts/run_guide_autonomous_check.js`
- `node cli/palpal.js debug guide-failures --limit 20`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- PASS

# delta-archive

## Delta ID
- DR-20260306-guide-failure-mode-observation

## クローズ条件
- verify判定: PASS
- archive可否: 可

## 要約
- Guide の `plan_ready` 未到達 run を debug CLI で分類し、status と blocking cue を観測できるようにした。

## 次のdeltaへの引き継ぎ
- Seed-01: 観測された blocking cue に応じて Guide controller の readiness 補助を入れる。
