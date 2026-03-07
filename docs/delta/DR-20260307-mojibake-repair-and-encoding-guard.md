# delta-request

## Delta ID
- DR-20260307-mojibake-repair-and-encoding-guard

## 背景
- Guide identity 更新後、UI 文言の一部が文字化けして見える状態になった。
- 少なくとも `wireframe/app.js` の日本語 rules / seed task/job 文言と、`wireframe/debug-identity-seeds.js` の日本語 identity seed が壊れている。
- 再発防止のため、`AGENTS.md` にエンコーディング運用ルールを追加する。

## In Scope
- `wireframe/app.js` の確定している日本語文字化け文言を修復する
- `wireframe/debug-identity-seeds.js` の built-in debug seed 日本語文言を修復する
- `AGENTS.md` に UTF-8 / `apply_patch` 優先 / verify 時の文字化け確認ルールを追加する
- 最小限の検証を行い、delta を archive まで閉じる

## Out of Scope
- 文言意味の再設計
- `OPERATING_RULES` や few-shot のロジック変更
- 文字化けしていない既存文言のリライト
- commit / push

## Acceptance Criteria
- AC-01: `wireframe/app.js` の確定している日本語文字化け文言が UTF-8 の正常な日本語へ戻る
- AC-02: `wireframe/debug-identity-seeds.js` の日本語 seed が正常な日本語へ戻る
- AC-03: `AGENTS.md` に再発防止ルールが追記される
- AC-04: `node --check wireframe/app.js` と `node --check wireframe/debug-identity-seeds.js` が PASS する
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-mojibake-repair-and-encoding-guard

## ステータス
- APPLIED

## 実施内容
- `wireframe/app.js` の日本語文字化け文言を修復
- `wireframe/debug-identity-seeds.js` の日本語 seed を全面修復
- `AGENTS.md` に文字化け防止ルールを追記

# delta-verify

## Delta ID
- DR-20260307-mojibake-repair-and-encoding-guard

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `app.js` の rules / task / job seed / error message の文字化けを修復した |
| AC-02 | PASS | `debug-identity-seeds.js` の日本語 seed を修復した |
| AC-03 | PASS | `AGENTS.md` に UTF-8 と verify ルールを追記した |
| AC-04 | PASS | `node --check wireframe/app.js` / `node --check wireframe/debug-identity-seeds.js` PASS |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check wireframe/app.js`
- `node --check wireframe/debug-identity-seeds.js`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-mojibake-repair-and-encoding-guard

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- UI seed/rules の日本語文字化けを修復し、AGENTS に再発防止ルールを追加した
