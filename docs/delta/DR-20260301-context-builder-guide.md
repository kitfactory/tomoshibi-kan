# delta-request

## Delta ID
- DR-20260301-context-builder-guide

## 目的
- Guide Chat 経路へ Context Builder を段階導入する。
- 未設定ガードを維持しつつ、会話履歴の圧縮方針を送信前処理へ接続する。

## In Scope
- Guide 向け Context Builder（履歴取り込み・予算計算・圧縮）を追加。
- Guide 送信時に Context Builder の `messages` を利用してモデル呼び出しする。
- core runtime 側で `messages` 入力を受け取り、generate 入力へ反映する。
- unit/E2E を更新して回帰を確認する。

## Out of Scope
- Gate/Worker 経路への適用。
- SKILL.md 実体の読み込みと role 別ソース探索の本実装。
- 厳密 tokenizer による token 算出。

## Acceptance Criteria
- AC-01: `wireframe/context-builder.js` に Guide 用 `buildGuideContext` が追加される。
- AC-02: Guide 送信が `context messages` をモデル呼び出しへ渡す。
- AC-03: 未設定ガード（モデル未設定時の Settings 誘導）が回帰しない。
- AC-04: unit と既存 Guide E2E が PASS する。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- wireframe/context-builder.js
- wireframe/index.html
- wireframe/app.js
- runtime/palpal-core-runtime.js
- tests/unit/context-builder.test.js
- package.json
- docs/plan.md
- docs/delta/DR-20260301-context-builder-guide.md

## AC 対応
- AC-01:
  - `buildGuideContext` を追加し、予算計算・履歴圧縮・監査情報を返す。
- AC-02:
  - `app.js` で `buildGuideContextWithFallback` を追加し、`guideChat`/`fetch` 双方へ `messages` を渡すよう変更。
  - `runtime/palpal-core-runtime.js` で `messages` を受け取って generate 入力へ変換。
- AC-03:
  - `sendGuideMessage` の未設定ガード処理は維持。
- AC-04:
  - `tests/unit/context-builder.test.js` を追加。
  - `npm run test:unit` と Guide 経路の E2E を実行。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/context-builder.js` を追加 |
| AC-02 | PASS | `requestGuideModelReplyWithFallback` で `messages` 送信 |
| AC-03 | PASS | 既存 E2E `guide chat is blocked...` が PASS |
| AC-04 | PASS | unit + targeted E2E が PASS |

## 実行コマンド
- `node --check wireframe/app.js; node --check runtime/palpal-core-runtime.js; node --check wireframe/context-builder.js`
- `node --test tests/unit/context-builder.test.js`
- `npm run test:unit`
- `npx playwright test tests/e2e/workspace-layout.spec.js --grep "guide chat is blocked when guide model is not configured|guide chat resumes after registering model in settings"`

# delta-archive

## クローズ
- verify result: PASS
- archive: 完了

## 要約
- Guide 経路に Context Builder を導入し、履歴圧縮を伴う送信メッセージ構成へ移行した。
- 既存の未設定ガードと Guide E2E を維持して回帰なく適用した。
