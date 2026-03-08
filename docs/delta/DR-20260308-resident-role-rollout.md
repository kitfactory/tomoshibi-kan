# delta-request

## Delta ID
- DR-20260308-resident-role-rollout

## 目的
- built-in 5人の `ROLE.md` を resident set v0.4 と task detail conversation log 方針に合わせて更新する。
- `SOUL.md` の人格を踏まえつつ、各役の `Mission / Inputs / Outputs / Done Criteria / Constraints / Hand-off Rules / Progress Voice / Progress Note Triggers` を固定する。

## 変更対象（In Scope）
- `wireframe/debug-identity-seeds.js` の built-in 5人の `ROLE.md` / `RUBRIC.md`
- 必要最小限の unit test
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- `SOUL.md` の再変更
- routing / orchestrator ロジック変更
- progress log schema 変更
- default template (`agent-identity-store.js`) の同期

## 受入条件（Acceptance Criteria）
- AC-01: built-in 5人の `ROLE.md` / `RUBRIC.md` が resident set v0.4 と task conversation log 方針に沿う。
- AC-02: 各 built-in role に `Progress Voice / Progress Note Triggers` 相当の契約が含まれる。
- AC-03: harness / routing を壊さず、targeted unit が PASS する。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-resident-role-rollout

## ステータス
- APPLIED

## 変更ファイル
- wireframe/debug-identity-seeds.js
- tests/unit/debug-identity-seeds.test.js
- docs/plan.md

## 適用内容
- built-in 5人の `ROLE.md / RUBRIC.md` を resident set v0.4 と task conversation log 方針に合わせて更新した。
- Guide/Worker の `ROLE.md` に `Mission / Inputs / Outputs / Done Criteria / Constraints / Hand-off Rules / Progress Voice / Progress Note Triggers` を追加した。
- Gate は `RUBRIC.md` に `Inputs / Outputs / Done Criteria / Progress Voice / Progress Note Triggers` を追加した。
- `SOUL.md` は変更していない。
- unit test の断面を `Progress Voice / Progress Note Triggers` 前提へ更新した。

# delta-verify

## Delta ID
- DR-20260308-resident-role-rollout

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | built-in 5人の `ROLE.md / RUBRIC.md` を resident set v0.4 と task conversation log の方針に沿う構成へ更新した。 |
| AC-02 | PASS | Guide/Worker/Gate すべてに `Progress Voice / Progress Note Triggers` 相当の節を追加した。 |
| AC-03 | PASS | `tests/unit/debug-identity-seeds.test.js` と `node --check wireframe/debug-identity-seeds.js` が PASS した。 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check wireframe/debug-identity-seeds.js`
- `node --test tests/unit/debug-identity-seeds.test.js`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-resident-role-rollout

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- built-in 5人の `ROLE.md / RUBRIC.md` を personality ではなく作業契約として整理した。
- task detail conversation log を支える `Progress Voice / Progress Note Triggers` を resident ごとに定義した。
- `SOUL.md` は維持したまま、job / hand-off / progress note の責務だけを明確化した。
