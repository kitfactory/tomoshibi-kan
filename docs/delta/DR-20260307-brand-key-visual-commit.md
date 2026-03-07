# delta-request

## Delta ID
- DR-20260307-brand-key-visual-commit

## 背景
- `Tomoshibi-kan / 灯火館` のブランド方向に合うキービジュアルが追加された。
- すでに進行中の technical safe rename と rename audit の差分があるため、今回は current worktree と一緒に commit し、ブランド採用を履歴化したい。

## In Scope
- `docs/tomoshibi-kan_key_visual.png` を current worktree に含めて commit する。
- 今回の current worktree（technical safe rename / rename audit / key visual）を 1 commit にまとめる。
- `docs/plan.md` と当該 delta を archive まで閉じる。

## Out of Scope
- キービジュアルの文書埋め込み
- UI への画像表示追加
- `Pal / Guide / Gate` の名称変更
- 追加の branding copy 修正

## Acceptance Criteria
- AC-01: `docs/tomoshibi-kan_key_visual.png` が commit 対象に含まれている。
- AC-02: current worktree の変更が 1 commit にまとまっている。
- AC-03: commit 後に worktree が clean である。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-brand-key-visual-commit

## ステータス
- APPLIED

## 適用内容
- `docs/tomoshibi-kan_key_visual.png` を current worktree に追加した。
- current worktree の rename 関連差分と一緒に commit 対象へまとめた。

# delta-verify

## Delta ID
- DR-20260307-brand-key-visual-commit

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `docs/tomoshibi-kan_key_visual.png` が current worktree に存在する。 |
| AC-02 | PASS | current worktree の rename / audit / key visual を 1 commit にまとめた。 |
| AC-03 | PASS | commit 後に worktree clean を確認した。 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `git status --short`
- `git add ...`
- `git commit -m "chore: continue tomoshibikan rename and add key visual"`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-brand-key-visual-commit

## クローズ条件
- verify 判定: PASS
- archive 判定: 実施済み

archive status: PASS

## まとめ
- `Tomoshibi-kan` キービジュアルを current worktree に含めて commit した。
- technical safe rename と rename audit の差分も同じ commit にまとめ、次の名称検討へ進める状態にした。
