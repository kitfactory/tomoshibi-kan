# delta-request

## Delta ID
- DR-20260307-first-party-rename-commit

## 背景
- `DR-20260307-first-party-rename-tomoshibi-kan` で適用済みの rename 差分を 1 commit に確定する。

## In Scope
- 現在の rename 差分を 1 commit に束ねる。
- commit 後の status を確認する。
- `docs/plan.md` と本 delta を archive まで閉じる。

## Out of Scope
- 追加実装
- push
- 新しい rename 要件の混入

## Acceptance Criteria
- AC-01: 現在の rename 差分が 1 commit に確定している。
- AC-02: commit 後の `git status --short` が clean である。
- AC-03: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-first-party-rename-commit

## ステータス
- APPLIED

## 適用内容
- rename 差分一式を stage し、`chore: align first-party naming with tomoshibi-kan` で commit した。

# delta-verify

## Delta ID
- DR-20260307-first-party-rename-commit

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | commit `d3ed7bf chore: align first-party naming with tomoshibi-kan` を作成した。 |
| AC-02 | PASS | bookkeeping commit 後の `git status --short` が clean である。 |
| AC-03 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `git commit -m "chore: align first-party naming with tomoshibi-kan"`
- `git status --short`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-first-party-rename-commit

## クローズ条件
- verify 判定: PASS
- archive 判定: 実施済み

archive status: PASS

## まとめ
- `Tomoshibi-kan` への first-party rename 差分を commit に確定した。
