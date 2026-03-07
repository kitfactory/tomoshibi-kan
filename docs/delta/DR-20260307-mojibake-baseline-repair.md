# delta-request

## Delta ID
- DR-20260307-mojibake-baseline-repair

## 目的
- `wireframe/app.js` と `wireframe/debug-identity-seeds.js` に残っている日本語文字化けを修復し、Guide/Settings/Event Log 周辺の UI 文言と debug seed を正常化する。
- 文字化け修復と機能変更を混ぜず、次の Orchestrator / task log 実装に進めるための baseline を作る。

## 変更対象（In Scope）
- 対象1: `wireframe/app.js` の日本語 UI 辞書、主要メッセージ、主要な日本語 inline event/status 文言
- 対象2: `wireframe/debug-identity-seeds.js` の日本語 `SOUL.md / ROLE.md / RUBRIC.md` seed 文言
- 対象3: 修復した UI 文言に直接依存する最小限の test expectation 更新
- 対象4: `docs/plan.md` と本 delta 文書の request/apply/verify/archive 記録

## 非対象（Out of Scope）
- 非対象1: Orchestrator / task-centric progress log の実装
- 非対象2: repo 全体の日本語 docs の全面修復
- 非対象3: `Pal / Guide / Gate` の概念 rename
- 非対象4: `wireframe/app.js` の英語文言、ロジック、レイアウト、挙動変更
- 非対象5: ユーザー未追跡ファイル `docs/tomoshibikan_resident_set_v0_1.md`

## 差分仕様
- DS-01:
  - Given: `wireframe/app.js` の日本語 UI 辞書とメッセージ文言に mojibake が残っている
  - When: 日本語 UI 文言を baseline repair する
  - Then: 主要タブ、Task/Gate、Guide、Settings、Event Log、toast/message で読める日本語に戻る
- DS-02:
  - Given: `wireframe/debug-identity-seeds.js` の日本語 seed が文字化けしている
  - When: 日本語 seed 文言を修復する
  - Then: Guide/Gate/worker の日本語 `SOUL.md / ROLE.md / RUBRIC.md` seed が読める状態になる
- DS-03:
  - Given: 修復対象に直接依存する unit/e2e expectation がある
  - When: 必要最小限の expectation を修正する
  - Then: 修復対象の test が PASS する

## 受入条件（Acceptance Criteria）
- AC-01: `wireframe/app.js` の日本語 UI 辞書・主要メッセージ・主要 inline 日本語文言に mojibake 文字列が残らない
- AC-02: `wireframe/debug-identity-seeds.js` の日本語 seed 文言に mojibake 文字列が残らない
- AC-03: `node --check wireframe/app.js` と `node --check wireframe/debug-identity-seeds.js` が PASS する
- AC-04: 修復対象に関係する最小限の unit/e2e/validator が PASS する
- AC-05: Out of Scope の機能変更を含まない

## 制約
- 制約1: 日本語文言の修復は `apply_patch` を優先し、機能ロジックは変更しない
- 制約2: 文字化け確認は `rg "�"` を用いて対象ファイルごとに確認する
- 制約3: 既存 docs delta の未コミット変更とは混ぜず、本 delta は文字化け修復だけに閉じる

## 未確定事項
- Q-01: `tests/e2e/workspace-layout.spec.js` の日本語 expectation のうち、どこまで本 delta で修正が必要かは実際の失敗箇所を見て最小化する

# delta-apply

## 実施内容
- `wireframe/app.js` の日本語 UI 辞書、主要メッセージ、主要 inline event/status 文言を UTF-8 の正しい日本語へ復元した
- `tests/e2e/workspace-layout.spec.js` の日本語 stub / expectation / 入力文言の文字化けを、修復対象 UI 文言に対応する範囲で復元した
- `wireframe/debug-identity-seeds.js` は再確認のみ行い、今回の baseline repair では追加修正不要だった

## In Scope 実績
- DS-01: `wireframe/app.js` の主要 UI 文言 baseline repair を実施
- DS-02: `wireframe/debug-identity-seeds.js` の mojibake 再確認を実施し、対象範囲に残件なしを確認
- DS-03: `tests/e2e/workspace-layout.spec.js` の最小 expectation / stub 修正を実施

# delta-verify

## 実行結果
- AC-01: PASS
  - `rg -n "�" wireframe/app.js` -> hit なし
- AC-02: PASS
  - `rg -n "�" wireframe/debug-identity-seeds.js` -> hit なし
- AC-03: PASS
  - `node --check wireframe/app.js`
  - `node --check wireframe/debug-identity-seeds.js`
- AC-04: PASS
  - `rg -n "�" wireframe/app.js wireframe/debug-identity-seeds.js tests/e2e/workspace-layout.spec.js` -> `NO_MOJIBAKE_HITS`
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat is blocked when guide model is not configured|guide chat reflects focus and sending state in UI|guide chat creates planned tasks and assigns workers|guide chat keeps dialog open when plan is not ready|guide chat keeps conversation mode without touching plan tasks|guide controller assist is off by default and can be enabled in settings|settings tab shows model list and allows adding model|settings save button is enabled only when changed and keeps unsaved state across tabs|settings skill search normalizes full-width ddg keyword|identity files can be edited from pal settings modal|project tab supports add and /use focus switch|job board supports gate flow"` -> 36 passed
  - `node scripts/validate_delta_links.js --dir .` -> PASS
- AC-05: PASS
  - Orchestrator / task log / layout / runtime ロジック変更なし

## 所見
- baseline repair の主対象は `wireframe/app.js` と E2E 側の stub/expectation だった
- docs 全体、とくに `docs/plan.md` には既存の文字化けが残っているが、本 delta では scope 外として扱った
- verify result: PASS

# delta-archive

## archive
- PASS
- baseline mojibake repair は PASS
- 次の Orchestrator / task-centric progress log 実装へ進める前提として、主要 UI と test baseline の日本語を復元した
