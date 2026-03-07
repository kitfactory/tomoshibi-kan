# delta-request

## Delta ID
- DR-20260306-guide-plan-boundary-doc

## 目的
- Guide と planner の責務重複を解消し、Guide が valid Plan を作るまで対話を継続し、Orchestrator は valid かつ approved な Plan からのみ開始する境界を正本へ固定する。

## 変更対象（In Scope）
- `docs/concept.md` に Guide Planning Boundary / Orchestrator Start Boundary を追加する。
- `docs/spec.md` に `Guide Plan Boundary` を追加し、valid Plan でない限り後段へ進めないことを明記する。
- `docs/architecture.md` に `GuideConversationUseCase` と `PlanExecutionOrchestrator` の境界を追記し、現行 `guide-task-planner.js` は正本の planning 主体ではないと明記する。
- `docs/plan.md` に seed/archive を記録する。

## 非対象（Out of Scope）
- `wireframe/guide-task-planner.js` の削除や rename。
- Guide 出力を actual `Plan` schema へ置き換える実装。
- `GuideConversationUseCase` / `PlanExecutionOrchestrator` の runtime 実装変更。

## 受入条件（Acceptance Criteria）
- AC-01: `concept/spec/architecture` で、Guide が valid Plan を作るまで対話を継続する境界が明記されている。
- AC-02: `PlanExecutionOrchestrator` が valid かつ approved な Plan からのみ開始すると明記されている。
- AC-03: 現行 `guide-task-planner.js` が正本の planning 主体ではなく、暫定補助であることが `architecture` に明記されている。
- AC-04: `docs/plan.md` と delta のリンク整合が PASS する。

## 制約
- 文書変更だけに閉じる。
- 既存の `REQ-0001` / `Execution Loop` 用語と矛盾しないこと。

## 未解決
- Q-01: `guide-task-planner.js` を `Plan parser/validator` 系へ実際に置き換える実装は別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-guide-plan-boundary-doc

## 適用ステータス
- APPLIED

## 変更ファイル
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更: `concept/spec/architecture` に Guide が valid Plan を作るまで対話を継続する境界を追加した。
  - 根拠: `Guide Planning Boundary` / `Guide Plan Boundary` / `GuideConversationUseCase` の追記。
- AC-02:
  - 変更: `PlanExecutionOrchestrator` は valid かつ approved な Plan からのみ開始する旨を追加した。
  - 根拠: `concept/spec/architecture` の Orchestrator 開始条件追記。
- AC-03:
  - 変更: `guide-task-planner.js` は正本の planning 主体ではなく暫定補助であると `architecture` に明記した。
  - 根拠: `未導入範囲` に補足を追加。
- AC-04:
  - 変更: `docs/plan.md` に seed/archive を追記した。
  - 根拠: delta link 整合検証に必要な参照を追加。

## Out of Scope 逸脱
- Out of Scope 変更の有無: No

## verify 申し送り
- `node scripts/validate_delta_links.js --dir .`
- `rg -n "Guide Plan Boundary|Guide Planning Boundary|approved Plan|guide-task-planner.js" docs`

# delta-verify

## Delta ID
- DR-20260306-guide-plan-boundary-doc

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `concept/spec/architecture` に Guide が valid Plan まで対話継続する記述を追加した。 |
| AC-02 | PASS | `spec/architecture` に Orchestrator は valid かつ approved な Plan からのみ開始すると追記した。 |
| AC-03 | PASS | `architecture` に `guide-task-planner.js` は暫定補助で正本の planning 主体ではないと追記した。 |
| AC-04 | PASS | `docs/plan.md` を更新し、delta link 検証が PASS した。 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 確認メモ: 文書以外の変更は行っていない。

## 実施コマンド
- `rg -n "Guide Plan Boundary|Guide Planning Boundary|approved Plan|guide-task-planner.js" docs`
- `node scripts/validate_delta_links.js --dir .`

## 総合判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-guide-plan-boundary-doc

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: Guide を唯一の planning 主体とし、valid Plan まで対話継続・approved Plan でのみ Orchestrator 開始とする境界を文書で固定した。
- 変更対象:
  - `docs/concept.md`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
- 非対象:
  - runtime 実装変更
  - `guide-task-planner.js` の削除/置換

## 検証
- `rg -n "Guide Plan Boundary|Guide Planning Boundary|approved Plan|guide-task-planner.js" docs`
- `node scripts/validate_delta_links.js --dir .`

## 未解決
- `guide-task-planner.js` を parser/validator 系へ置き換える実装 delta が次段になる。

## 次のdeltaへの引き継ぎ
- Seed-01: Guide の実出力を `Plan` schema として parse / validate し、valid Plan でない限り Guide loop を継続する実装 delta を切る。
