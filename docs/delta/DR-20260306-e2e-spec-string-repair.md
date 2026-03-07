# delta-request

## Delta ID
- DR-20260306-e2e-spec-string-repair

## 目的
- `tests/e2e/workspace-layout.spec.js` に混入した未終端文字列を修復し、Playwright verify を再開可能にする。

## 変更対象範囲 (In Scope)
- `tests/e2e/workspace-layout.spec.js` の壊れた文字列リテラルのみを修復する。
- `docs/plan.md` に seed/archive を反映する。

## 変更対象外 (Out of Scope)
- E2E シナリオの意味変更
- アプリ実装の変更
- 他テストファイルの整理

## 受入条件
- DS-01:
  - Given: `workspace-layout.spec.js` に未終端文字列がある
  - When: 構文チェックする
  - Then: parse error なく通る
- DS-02:
  - Given: 文字列修復後の E2E ファイル
  - When: 対象 Playwright を実行する
  - Then: 少なくとも構文起因の失敗は発生しない

## Acceptance Criteria
- AC-01: `workspace-layout.spec.js` の未終端文字列が解消される。
- AC-02: `node --check tests/e2e/workspace-layout.spec.js` が PASS する。
- AC-03: routing explanation verify を再実行可能な状態に戻る。

## リスク
- 置換文言が元意図と完全一致しない可能性があるが、今回の目的は parse 回復を優先する。

## 未解決事項
- Q-01: 他にも mojibake が残るかは別途必要なら整理する。

# delta-apply

## Delta ID
- DR-20260306-e2e-spec-string-repair

## 実装ステータス
- APPLIED

## 変更ファイル
- tests/e2e/workspace-layout.spec.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `guideInput` 2件、`settingsSkillModalKeyword` 1件の未終端文字列を通常の文字列へ置換した。
  - 理由: Playwright spec 全体の parse を回復するため。
- AC-02:
  - 変更点: plan に seed/archive を追記した。
  - 理由: delta 4ステップの記録を閉じるため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: テストロジックやアプリコードは変更していない。

# delta-verify

## Delta ID
- DR-20260306-e2e-spec-string-repair

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | 3 箇所の未終端文字列を解消した。 |
| AC-02 | PASS | `node --check tests/e2e/workspace-layout.spec.js` を通過した。 |
| AC-03 | PASS | 以後の Playwright verify が構文エラーで止まらない状態に戻った。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: テストファイルと plan のみを変更した。

## 主な確認コマンド
- R-01: `node --check tests/e2e/workspace-layout.spec.js`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-e2e-spec-string-repair

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: `workspace-layout.spec.js` の未終端文字列を修復して verify を再開可能にする。
- 変更対象範囲: E2E spec, plan
- 変更対象外: アプリ実装、テスト意味変更

## 実装結果
- 変更ファイル: `tests/e2e/workspace-layout.spec.js`, `docs/plan.md`
- AC達成状況: AC-01/02/03 PASS

## 検証要約
- verify結果: `node --check tests/e2e/workspace-layout.spec.js` PASS

## 未解決事項
- mojibake 整理は今回の対象外

## 次のdeltaへの引き継ぎ
- Seed-01: 必要なら E2E 文言の mojibake 整理を別 delta で扱う。
