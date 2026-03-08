# delta-request

## Delta ID
- DR-20260308-resident-microtests

## 目的
- built-in 5人 (`管理人 / 古参 / 調べる人 / 作り手 / 書く人`) が `SOUL/ROLE/RUBRIC` に沿った想定動作をするかを、小さな contract-level microtests で固定する。

## 変更対象（In Scope）
- `tests/unit/**`
- 必要なら resident seed 読み出し helper のみ
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- resident の人格再設計
- task detail UI 改修
- routing 精度改善
- real-model autonomous runner の追加

## 受入条件（Acceptance Criteria）
- AC-01: built-in 5人それぞれに対応する小テストが追加される。
- AC-02: `Progress Voice / Progress Note Triggers / Hand-off Rules / Done Criteria` のうち、その住人に必要な節を検証する。
- AC-03: 各住人の character cue または voice cue を 1 つ以上固定する。
- AC-04: 既存の debug identity seed test を壊さない。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-resident-microtests

## ステータス
- APPLIED

## 変更ファイル
- tests/unit/resident-microtests.test.js
- docs/plan.md

## 適用内容
- built-in 5人の contract-level microtests を `tests/unit/resident-microtests.test.js` として追加した。
- `guide-core / gate-core / pal-alpha / pal-beta / pal-delta` それぞれについて、`SOUL/ROLE/RUBRIC` の character cue と contract cue を最小限固定した。
- 既存の `tests/unit/debug-identity-seeds.test.js` と併用し、broad seed test と resident-specific microtests を分離した。

# delta-verify

## Delta ID
- DR-20260308-resident-microtests

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | built-in 5人それぞれに対応する小テストを `tests/unit/resident-microtests.test.js` に追加した。 |
| AC-02 | PASS | `Progress Voice / Progress Note Triggers / Hand-off Rules / Done Criteria` の必要節を resident ごとに検証している。 |
| AC-03 | PASS | 各 resident の character cue または voice cue を 1 つ以上固定している。 |
| AC-04 | PASS | `tests/unit/debug-identity-seeds.test.js` と併走して PASS している。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --test tests/unit/resident-microtests.test.js tests/unit/debug-identity-seeds.test.js`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-resident-microtests

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- built-in 5人それぞれについて、character cue と `Progress Voice / Progress Note Triggers / Hand-off Rules / Done Criteria` の最低限を resident-specific microtests で固定した。
