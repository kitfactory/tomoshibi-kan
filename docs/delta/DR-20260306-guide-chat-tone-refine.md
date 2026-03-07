# delta-request

## Delta ID
- DR-20260306-guide-chat-tone-refine

## Purpose
- `Guide Chat` を `温かみと知性` のトーンへ一段寄せる。柔らかさは残しつつ、常時アニメと強すぎる質感を抑え、送信中の状態を視覚的に理解しやすくする。

## In Scope
- `wireframe/styles.css` の `Guide Chat` 専用スタイルを調整し、履歴面・入力面・bubble の質感を静かで落ち着いた方向へ補正する
- `wireframe/app.js` と必要最小限の `wireframe/index.html` を更新し、Guide キャラクターを常時 bob ではなく `入力フォーカス` / `送信中` に連動させる
- `Guide Chat` の送信ボタンに送信中フィードバックを追加し、既存の送信フローと整合させる
- `tests/e2e/workspace-layout.spec.js` に Guide Chat の状態連動/送信中フィードバックの回帰確認を追加する
- `docs/plan.md` に今回の seed/archive を反映する

## Out of Scope
- `Task Board` / `Gate` / `Event Log` / `Settings` など他画面のトーン調整
- Guide Chat の文言内容、会話ロジック、Task 作成ロジックの変更
- 全体テーマ変数の大規模整理やデザインシステム化

## Acceptance Criteria
- AC-01: `Guide Chat` の履歴面・composer・bubble が、既存よりもグラデーション/影の主張を抑えた静かな見た目になっている
- AC-02: Guide キャラクターは常時 bob せず、`guideInput` のフォーカス時と送信中にだけ状態変化し、送信ボタンは送信中の視覚フィードバックを持つ
- AC-03: `workspace-layout` の Guide 系 Playwright が通り、新規 UI 状態確認も PASS する
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- 送信中フィードバック追加で既存の Guide 送信テストがタイミング依存になる可能性がある
- Guide キャラクターの状態クラス制御が `guide` タブ以外へ漏れると他画面に影響する

## Open Questions
- なし

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- wireframe/styles.css
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260306-guide-chat-tone-refine.md

## applied AC
- AC-01: `Guide Chat` 専用の履歴面 / composer / bubble スタイルを調整し、グラデーションと影の主張を弱めて階層を整理した
- AC-02: `guideSendInFlight` と `guideInput` focus を再利用して `guide-busy` / `guide-compose-active` を配線し、Guide キャラクターと送信ボタンを状態連動にした
- AC-03: `tests/e2e/workspace-layout.spec.js` に Guide Chat の UI 状態確認を追加し、既存 Guide 系シナリオと合わせて回帰確認できるようにした
- AC-04: `docs/plan.md` に今回の seed/archive を反映する

## scope deviation
- Out of Scope への変更: No
- 補足: `Guide Chat` 関連の CSS/JS/E2E のみに限定し、他タブや文書正本は変更していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/styles.css` の `Guide Chat` 専用スタイルを更新し、履歴面・composer・bubble の質感を調整 |
| AC-02 | PASS | `wireframe/app.js` に `syncGuideVisualState` / `setGuideComposerFocused` を追加し、送信ボタンの `aria-busy` とキャラクター状態クラスを実装 |
| AC-03 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat is blocked when guide model is not configured|guide chat resumes after registering model in settings|guide chat reflects focus and sending state in UI|guide chat creates planned tasks and assigns workers|guide chat supports @ completion with focus and project:file"` が 15 passed |
| AC-04 | PASS | `node --check wireframe/app.js` PASS、`node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の有無: No
- 確認内容: `Guide Chat` 以外の画面構造・会話ロジック・Task 生成ロジックには変更を入れていない

## residual risks
- R-01: 視覚トーンの評価は実機確認が必要で、今回の検証は DOM 状態と E2E 回帰まで

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
