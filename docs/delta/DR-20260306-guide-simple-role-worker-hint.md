# delta-request

## Delta ID
- DR-20260306-guide-simple-role-worker-hint

## 目的
- Guide が debug-purpose workspace で `trace only / fix only / verify only` の worker を前提に plan を組みやすくする。

## In Scope
- `wireframe/guide-plan.js` の Guide output instruction に simple-role worker hint を追加する。
- `wireframe/app.js` の Guide operating rules / fallback instruction に同じ hint を追加する。
- `tests/unit/guide-plan.test.js` を更新する。
- `docs/spec.md` / `docs/architecture.md` に最小同期する。
- `docs/plan.md` に seed/archive を追加する。

## Out of Scope
- routing algorithm の変更
- built-in worker profile の再変更
- Guide controller / parser の変更
- debug DB / CLI の変更

## Acceptance Criteria
- AC-01: Guide output instruction が `trace / fix / verify` の simple-role worker を優先する方針を含む。
- AC-02: Guide operating rules / fallback instruction が同じ方針に揃う。
- AC-03: unit test と targeted autonomous check が PASS する。

# delta-apply

## Delta ID
- DR-20260306-guide-simple-role-worker-hint

## ステータス
- APPLIED

## 変更ファイル
- wireframe/guide-plan.js
- wireframe/app.js
- tests/unit/guide-plan.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

# delta-verify

## Delta ID
- DR-20260306-guide-simple-role-worker-hint

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | Guide output instruction に simple-role worker hint を追加した。 |
| AC-02 | PASS | Guide operating rules と fallback instruction を同じ方針へ揃えた。 |
| AC-03 | PASS | unit test + autonomous check + delta link validation が通過した。 |

## 主な検証コマンド
- `node --check wireframe/guide-plan.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/guide-plan.test.js`
- `node scripts/run_guide_autonomous_check.js`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- PASS

# delta-archive

## Delta ID
- DR-20260306-guide-simple-role-worker-hint

## クローズ条件
- verify判定: PASS
- archive可否: 可

## 要約
- Guide が debug-purpose workspace では simple-role worker (`trace / fix / verify`) を優先して計画する方針を prompt / operating rules へ同期した。

## 次のdeltaへの引き継ぎ
- Seed-01: 実モデル観測で `plan_ready` に抜けない条件を debug DB/CLI で絞り込む。
