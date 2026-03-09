# delta-request

## Delta ID
- DR-20260310-project-validator-skill-unification

## Delta Type
- OPS

## 目的
- `project-validator` の所有物を `~/.codex/skills/project-validator` 側に統一する。
- repo 側に残っている validator 残骸を削除し、今後の実行前提を current template で揃える。

## 変更対象（In Scope）
- repo 側の `scripts/validate_delta_links.js` を削除する。
- `docs/delta/TEMPLATE.md` の validator 実行前提を `project-validator` skill 側実行へ更新する。
- `docs/plan.md` と delta 記録を同期する。

## 非対象（Out of Scope）
- 過去 delta 文書に残る `node scripts/validate_delta_links.js --dir .` の記述修正
- `project-validator` skill 本体の編集
- 他の repo scripts の整理

## 受入条件（Acceptance Criteria）
- AC-01: repo 側の `scripts/validate_delta_links.js` が削除される
- AC-02: `docs/delta/TEMPLATE.md` が `project-validator` skill 側実行前提へ更新される
- AC-03: `project-validator` skill 側の `validate_delta_links.js` が PASS し、`check_code_size.js` は現状の長大ファイル所見を報告できる

# delta-apply

## 実装方針
- repo 側 validator 残骸は削除する。
- 現在の運用入口として使う `docs/delta/TEMPLATE.md` のみを更新し、過去文書は履歴としてそのまま残す。

# delta-verify

## Delta ID
- DR-20260310-project-validator-skill-unification

## Verify Profile
- static:
  - `Test-Path scripts/validate_delta_links.js`
- project-validator:
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
  - `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | repo 側 `scripts/validate_delta_links.js` を削除し、`Test-Path scripts/validate_delta_links.js` が `False` になった |
| AC-02 | PASS | `docs/delta/TEMPLATE.md` の Validation Command を `project-validator` skill 側実行前提へ更新した |
| AC-03 | PASS | skill 側 `validate_delta_links.js` は PASS。`check_code_size.js` は既存の長大ファイル所見のみを報告し、今回差分に起因する新規問題は無いことを確認した |

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260310-project-validator-skill-unification

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- `project-validator` は `~/.codex/skills/project-validator/scripts/*` を正とする。
- repo 側 `scripts/validate_delta_links.js` は残骸として削除した。
- 現在の運用テンプレートは skill 側 validator 実行前提へ更新した。
- `check_code_size.js` の既存所見は別 issue とし、この delta では扱わない。
