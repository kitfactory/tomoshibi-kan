# delta-request

## Delta ID
- DR-20260306-worker-handoff-runtime-payload

## 目的
- `Guide -> Worker` handoff を実際の runtime payload へ反映し、`WorkerExecutionInput` ベースの構造化入力へ置き換える。

## 変更対象範囲 (In Scope)
- `wireframe/app.js` の worker runtime payload 生成を `WorkerExecutionInput` ベースへ変更する。
- `Balanced` 相当の `handoffSummary` を payload に含める。
- project focus / default gate / fix condition など、現状 state から復元できる文脈を handoff text に含める。
- E2E で runtime payload を検証する回帰を追加する。
- `docs/plan.md` に seed/archive 完了記録を追加する。

## 変更対象外 (Out of Scope)
- `Context Handoff Policy` の Settings UI 追加。
- Worker/Gate 用の raw session transcript 継承。
- `GateReviewInput` の runtime 接続。
- `rubricVersion` や structured `projectContext` の実装。

## 受入条件
- DS-01:
  - Given: worker runtime を起動する
  - When: `palChat` に渡る `userText` を確認する
  - Then: `WorkerExecutionInput` の構造化 text になっている。
- DS-02:
  - Given: default gate と project focus が存在する
  - When: worker runtime payload を確認する
  - Then: `gate_profile_id` と `project_context` が含まれる。
- DS-03:
  - Given: Guide 会話履歴が存在する
  - When: worker runtime payload を確認する
  - Then: raw session transcript ではなく `HandoffSummary` が含まれる。

## Acceptance Criteria
- AC-01: worker runtime の `userText` が `WorkerExecutionInput` 形式へ置き換わっている。
- AC-02: payload に `handoffSummary` が含まれ、`Balanced` 相当の summary が組み立てられている。
- AC-03: payload に raw `guideMessages` を直接転記しない。
- AC-04: E2E で payload 文字列の主要キーを確認できる。

## リスク
- 既存モデルが自然文前提で tuned されている場合、応答の調子が変わる可能性。
- `constraints` や `expectedOutput` は現状 state からの暫定復元であり、今後 field 拡張が必要になる可能性。

## 未解決事項
- Q-01: `Context Handoff Policy` を runtime で `minimal|verbose` まで切り替えるのは別 delta とする。
- Q-02: `WorkerExecutionInput` を string ではなく structured payload として runtime へ渡すかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-worker-handoff-runtime-payload

## 実装ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `buildPalRuntimeUserText()` を `WorkerExecutionInput` の組み立て + text 化へ変更した。
  - 理由: runtime へ渡る handoff を構造化するため。
- AC-02:
  - 変更点: `handoffSummary` を生成し、Balanced 相当の summary を payload へ含めた。
  - 理由: raw session を渡さずに判断理由とリスクを伝えるため。
- AC-03:
  - 変更点: worker payload は target/job data, gate, project focus を使い、guideMessages を直接埋め込まないようにした。
  - 理由: session boundary を維持するため。
- AC-04:
  - 変更点: Playwright で `palChat` payload を回収し、主要キーを確認する回帰を追加した。
  - 理由: 文字列化された payload の退行を防ぐため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: docs 正本、Settings UI、Gate runtime は未変更。

# delta-verify

## Delta ID
- DR-20260306-worker-handoff-runtime-payload

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `WorkerExecutionInput` 形式の text を `userText` に渡すようにした。 |
| AC-02 | PASS | payload に `[HandoffSummary]` を含めた。 |
| AC-03 | PASS | E2E で `Plan Card` が payload に含まれないことを確認した。 |
| AC-04 | PASS | Playwright で payload の主要キーを検証した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 実装は worker payload と E2E のみに限定した。

## 主要確認
- R-01: `node --check wireframe/app.js`
- R-02: `node --check tests/e2e/workspace-layout.spec.js`
- R-03: `npx playwright test tests/e2e/workspace-layout.spec.js -g "worker runtime receives structured handoff payload|job board supports gate flow|pal list includes roles and allows name/model/tool settings"`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-worker-handoff-runtime-payload

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: Worker runtime payload を `WorkerExecutionInput` 形式へ移行する。
- 変更対象: `wireframe/app.js`, `tests/e2e/workspace-layout.spec.js`, `docs/plan.md`
- 非対象: Settings UI、Gate runtime、docs 正本更新

## 反映結果
- 変更ファイル: `wireframe/app.js`, `tests/e2e/workspace-layout.spec.js`, `docs/plan.md`
- AC充足: AC-01/02/03/04 PASS

## 検証記録
- verify要約: node check + Playwright targeted run
- 主因メモ: なし

## 未解決事項
- `minimal|verbose` の runtime 反映は未実装。
- `GateReviewInput` 接続は未実装。

## 次のdeltaへの引き継ぎ
- Seed-01: `Context Handoff Policy` を runtime へ反映し、`minimal|verbose` を切り替える delta を切る。
- Seed-02: Gate runtime に `GateReviewInput` を接続する delta を切る。
