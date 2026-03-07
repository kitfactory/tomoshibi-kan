# delta-request

## Delta ID
- DR-20260306-gate-review-runtime

## 目的
- Gate panel から `GateReviewInput` を model runtime へ渡し、`decision / reason / fixes` の suggestion を panel に反映する。

## 変更対象範囲 (In Scope)
- `wireframe/app.js` に `GateReviewInput` の組み立て、text 化、runtime 呼び出し、response parse を追加する。
- Gate panel に runtime status / suggestion 表示を追加する。
- reject 実行時に suggestion を補助入力として再利用できるようにする。
- E2E で `GateReviewInput` payload と suggestion 反映を検証する。
- `docs/architecture.md` と `docs/plan.md` に最小同期を行う。

## 変更対象外 (Out of Scope)
- Gate suggestion の自動 approve/reject 確定。
- Gate runtime 用の dedicated API 追加。
- `Context Handoff Policy` の agent override。
- `rubricVersion` の永続 hash 管理。

## 受入条件
- DS-01:
  - Given: Gate profile に model runtime がある
  - When: Gate panel を開く
  - Then: runtime に `GateReviewInput` が渡る。
- DS-02:
  - Given: Gate runtime が `decision / reason / fixes` を返す
  - When: Gate panel を表示する
  - Then: suggestion が panel に表示され、reject 時は reason textarea に反映される。
- DS-03:
  - Given: Gate runtime が使えない
  - When: Gate panel を開く
  - Then: manual review のまま動作し、既存 approve/reject flow を壊さない。

## Acceptance Criteria
- AC-01: Gate panel open 時に `GateReviewInput` を含む runtime request を発行する。
- AC-02: runtime response を `decision / reason / fixes` へ parse して panel state へ反映する。
- AC-03: suggestion unavailable 時も既存 Gate flow が維持される。
- AC-04: E2E で payload と suggestion 表示を検証できる。

## リスク
- model 出力が JSON 形式を外すと parse に失敗する可能性がある。
- Gate runtime が遅い場合、panel open 直後に loading 表示が増える。

## 未解決事項
- Q-01: Gate suggestion を auto-apply するかは別 delta とする。
- Q-02: `rubricVersion` を file mtime/hash で canonical に取るかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-gate-review-runtime

## 実装ステータス
- APPLIED

## 変更ファイル
- wireframe/index.html
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `buildGateReviewInput()` / `buildGateReviewUserText()` を追加し、Gate panel open 時に `palChat` へ request を送るようにした。
  - 理由: `GateReviewInput` を runtime へ実際に接続するため。
- AC-02:
  - 変更点: Gate runtime state と response parser を追加し、`decision / reason / fixes` suggestion を panel へ反映した。
  - 理由: model 判定を manual review の補助として使えるようにするため。
- AC-03:
  - 変更点: runtime unavailable / parse failure 時は manual review state にフォールバックするようにした。
  - 理由: 既存の approve/reject flow を壊さないため。
- AC-04:
  - 変更点: Playwright で `GateReviewInput` payload と suggestion の UI 反映を確認する回帰を追加した。
  - 理由: Gate runtime 接続の退行を防ぐため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: Gate auto-approval、dedicated API、rubricVersion 永続化は未変更。

# delta-verify

## Delta ID
- DR-20260306-gate-review-runtime

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | E2E で `window.__lastPalChatInput.userText` に `[GateReviewInput]` を含むことを確認した。 |
| AC-02 | PASS | response を parse し、panel attr と suggestion UI、textarea autofill に反映した。 |
| AC-03 | PASS | 既存 `job board supports gate flow` と `gate reject uses templates...` が継続 PASS。 |
| AC-04 | PASS | Gate runtime 専用 E2E を追加し targeted run が通過した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 変更は Gate panel/runtime と最小の architecture 同期に限定した。

## 主要確認
- R-01: `node --check wireframe/app.js`
- R-02: `node --check tests/e2e/workspace-layout.spec.js`
- R-03: `npx playwright test tests/e2e/workspace-layout.spec.js -g "gate runtime receives structured review payload and applies suggestion|job board supports gate flow|gate reject uses templates and navigates to resubmit target|task board and gate expose visual state attributes"`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-gate-review-runtime

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: `GateReviewInput` を runtime へ接続し、Gate panel 上で suggestion を使えるようにする。
- 変更対象: Gate panel/runtime、E2E、architecture/plan
- 非対象: auto-approval、dedicated API、rubricVersion canonicalization

## 反映結果
- 変更ファイル: `wireframe/index.html`, `wireframe/app.js`, `tests/e2e/workspace-layout.spec.js`, `docs/architecture.md`, `docs/plan.md`
- AC充足: AC-01/02/03/04 PASS

## 検証記録
- verify要約: node check + Playwright targeted run
- 主因メモ: テスト初回は Gate profile 選択肢の固定 model 名に依存して失敗したため、先頭 option を使うよう修正した。

## 未解決事項
- Gate suggestion の自動確定は未導入。
- `rubricVersion` は現状 content hash 相当の簡易値。

## 次のdeltaへの引き継ぎ
- Seed-01: Gate suggestion を one-click apply するかどうかの UX を別 delta で切る。
