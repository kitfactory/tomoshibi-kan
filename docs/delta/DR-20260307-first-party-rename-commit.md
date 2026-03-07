# delta-request

## Delta ID
- DR-20260307-first-party-rename-commit

## 背景
- `DR-20260307-first-party-rename-tomoshibi-kan` で適用済みの rename 差分を 1 commit に確定する。

## In Scope
- 現在の worktree 差分を確認する。
- rename 差分のみを stage して commit する。
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
