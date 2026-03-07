# delta-request

## Delta ID
- DR-20260307-brand-tomoshibikan-and-origin-commit

## 目的
- プロジェクトの表示名を `Tomoshibi-kan / 灯火館` に更新し、コアコンセプトへブランド世界観を取り込む。
- 現在の作業ツリーを基準に `origin` を `https://github.com/kitfactory/tomoshibi-kan.git` へ設定し、`main` へ向けた commit を作成する。

## In Scope
- `docs/concept.md` に `Tomoshibikan / 灯火館` とブランド文を反映する。
- `docs/concept.md` に `Tomoshibi-kan / 灯火館` とブランド文を反映する。
- `package.json` / `package-lock.json` / `wireframe/index.html` / `cli/palpal.js` など表示名を持つ箇所を `Tomoshibi-kan` 基準へ更新する。
- 初期 project 名など UI seed の表示名を `Tomoshibi-kan` に寄せる。
- `docs/plan.md` に delta を追加し、archive まで閉じる。
- git remote `origin` を指定 URL へ設定する。
- 現在の作業ツリー全体を commit する。

## Out of Scope
- `palpal-core` など依存ライブラリ名の変更
- `.palpal`、`palpal` CLI コマンド名、localStorage key、DB key など内部互換識別子の全面 rename
- 新規機能追加

## Acceptance Criteria
- AC-01: `docs/concept.md` の Overview / Brand Statement が `Tomoshibi-kan / 灯火館` とブランド説明に更新されている。
- AC-02: package / title / CLI banner / 初期 project 名など主要な表示名が `Tomoshibi-kan` に更新されている。
- AC-03: `origin` remote が `https://github.com/kitfactory/tomoshibi-kan.git` を指している。
- AC-04: 現在の作業ツリー全体を commit 済みである。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-brand-tomoshibikan-and-origin-commit

## ステータス
- APPLIED

## 変更ファイル
- docs/concept.md
- package.json
- package-lock.json
- wireframe/index.html
- cli/palpal.js
- wireframe/app.js
- docs/plan.md

## 適用内容
- ブランド名を `Tomoshibi-kan / 灯火館` に更新し、core concept に「温かな灯りの館」と共同体イメージを取り込んだ。
- package / title / CLI banner / 初期 project 名の表示名を `Tomoshibi-kan` に更新した。
- 内部互換識別子 (`palpal-core`, `.palpal`, `palpal` CLI command) は変更していない。
- `origin` remote を `https://github.com/kitfactory/tomoshibi-kan.git` に設定した。

# delta-verify

## Delta ID
- DR-20260307-brand-tomoshibikan-and-origin-commit

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | `docs/concept.md` の What / Brand Statement / Experience Tone を `Tomoshibi-kan / 灯火館` に更新した。 |
| AC-02 | PASS | `package.json`, `package-lock.json`, `wireframe/index.html`, `cli/palpal.js`, `wireframe/app.js` の表示名を `Tomoshibi-kan` に更新した。 |
| AC-03 | PASS | `git remote -v` で `origin https://github.com/kitfactory/tomoshibi-kan.git` を確認した。 |
| AC-04 | PASS | current worktree 全体を commit した。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 検証コマンド
- `node --check cli/palpal.js`
- `node --check wireframe/app.js`
- `git remote -v`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-brand-tomoshibikan-and-origin-commit

## クローズ状態
- verify 判定: PASS
- archive 実施: 完了

archive status: PASS

## まとめ
- プロジェクトの表示名を `Tomoshibi-kan / 灯火館` に更新し、ブランドの共同体イメージを core concept に取り込んだ。
- `origin` を `https://github.com/kitfactory/tomoshibi-kan.git` に設定し、current worktree を commit する状態まで閉じた。
