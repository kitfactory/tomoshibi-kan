# delta-request

## Delta ID
- DR-20260306-context-handoff-policy-runtime

## 目的
- workspace 設定の `Context Handoff Policy` を実装し、`Minimal / Balanced / Verbose` に応じて Worker runtime payload を切り替える。

## 変更対象範囲 (In Scope)
- `wireframe/settings-persistence.js` と `wireframe/app.js` に `contextHandoffPolicy` の保存・復元を追加する。
- Settings UI に `Context Handoff Policy` 選択 UI を追加する。
- `wireframe/app.js` の Worker payload shaping を policy 依存へ変更する。
- `tests/unit/settings-persistence.test.js` と `tests/e2e/workspace-layout.spec.js` に回帰を追加する。
- `docs/architecture.md` と `docs/plan.md` に最小同期を行う。

## 変更対象外 (Out of Scope)
- `GateReviewInput` の runtime 接続。
- agent ごとの handoff override。
- raw transcript の downstream 継承。
- Gate 用 Settings UI 追加。

## 受入条件
- DS-01:
  - Given: Settings で `Context Handoff Policy` を変更する
  - When: 保存して reload する
  - Then: 選択した policy が復元される。
- DS-02:
  - Given: policy が `minimal`
  - When: Worker runtime payload を確認する
  - Then: `handoffSummary` と `compressedHistorySummary` を含まない。
- DS-03:
  - Given: policy が `verbose`
  - When: Worker runtime payload を確認する
  - Then: `handoffSummary` と `compressedHistorySummary` を含む。

## Acceptance Criteria
- AC-01: Settings に `Context Handoff Policy` の保存対象フィールドが追加されている。
- AC-02: Worker runtime payload が `minimal|balanced|verbose` に応じて shaping される。
- AC-03: `verbose` では raw transcript ではなく圧縮済み history summary のみを含む。
- AC-04: unit/E2E で policy の保存と payload 差分を検証できる。

## リスク
- Settings save signature に新フィールドを加えるため、dirty 判定が崩れると保存導線全体に影響する。
- `verbose` summary が長くなりすぎると payload が冗長になる可能性がある。

## 未解決事項
- Q-01: `compressedHistorySummary` の compaction audit を payload 外で保持するかは別 delta とする。
- Q-02: `GateReviewInput` で同じ policy をどう適用するかは次 delta とする。

# delta-apply

## Delta ID
- DR-20260306-context-handoff-policy-runtime

## 実装ステータス
- APPLIED

## 変更ファイル
- wireframe/settings-persistence.js
- wireframe/app.js
- tests/unit/settings-persistence.test.js
- tests/e2e/workspace-layout.spec.js
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: Settings snapshot/payload/local storage に `contextHandoffPolicy` を追加し、Settings UI に選択欄を追加した。
  - 理由: workspace-level policy を保存・復元できるようにするため。
- AC-02:
  - 変更点: `resolveContextHandoffPolicy()` を Settings state 参照へ変更し、Worker payload が mode ごとに `handoffSummary` / `compressedHistorySummary` を出し分けるようにした。
  - 理由: runtime へ policy を反映するため。
- AC-03:
  - 変更点: `verbose` では `guideMessages` から圧縮済み preview のみを `compressedHistorySummary` に含めるようにした。
  - 理由: raw transcript を downstream へ流さないため。
- AC-04:
  - 変更点: unit test と Playwright で policy 永続化と payload 差分を検証した。
  - 理由: Settings save と runtime shaping の退行を防ぐため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: Gate runtime と agent override は未変更。

# delta-verify

## Delta ID
- DR-20260306-context-handoff-policy-runtime

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | Settings persistence と UI に `contextHandoffPolicy` を追加し、reload 後復元を E2E で確認した。 |
| AC-02 | PASS | `minimal` では summary を省略し、`verbose` では `handoffSummary` と `compressedHistorySummary` を含めた。 |
| AC-03 | PASS | `verbose` payload は `guide-guide:` 形式の圧縮 preview を含み、raw transcript を含まない。 |
| AC-04 | PASS | unit + Playwright targeted run が通過した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 変更は Settings persistence/UI、Worker payload shaping、最小の architecture 同期に限定した。

## 主要確認
- R-01: `node --check wireframe/app.js`
- R-02: `node --check wireframe/settings-persistence.js`
- R-03: `node --check tests/e2e/workspace-layout.spec.js`
- R-04: `node --test tests/unit/settings-persistence.test.js`
- R-05: `npx playwright test tests/e2e/workspace-layout.spec.js -g "settings context handoff policy persists and shapes worker payload|worker runtime receives structured handoff payload|settings save button is enabled only when changed and keeps unsaved state across tabs|settings footer reflects saving state and add form open state"`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-context-handoff-policy-runtime

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: workspace-level `Context Handoff Policy` を保存し、Worker payload shaping に反映する。
- 変更対象: Settings persistence/UI、Worker payload、tests、architecture/plan
- 非対象: Gate runtime、agent override

## 反映結果
- 変更ファイル: `wireframe/settings-persistence.js`, `wireframe/app.js`, `tests/unit/settings-persistence.test.js`, `tests/e2e/workspace-layout.spec.js`, `docs/architecture.md`, `docs/plan.md`
- AC充足: AC-01/02/03/04 PASS

## 検証記録
- verify要約: node check + node test + Playwright targeted run
- 主因メモ: 初回実装では Settings dirty 再描画が不足し save button が有効化されなかったため、`change -> renderSettingsTab()` を追加して修正した。

## 未解決事項
- `compressedHistorySummary` の audit 情報保持は未実装。
- Gate runtime に同じ policy を適用する処理は未実装。

## 次のdeltaへの引き継ぎ
- Seed-01: `GateReviewInput` を Gate runtime に接続する delta を切る。
