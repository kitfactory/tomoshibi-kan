# delta-request

## Delta ID
- DR-20260308-guide-gentle-clarification-and-chat-markdown

## Delta Type
- FEATURE

## 目的
- 管理人 Guide が、要件がまだぼんやりしている段階では 3 案提示を急がず、相槌＋視点提案＋オープン質問でゆっくり整理するようにする。
- Guide Chat の表示で Markdown を使えるようにし、箇条書き提案を読みやすくする。

## 変更対象（In Scope）
- 対象1:
  - Guide の `OPERATING_RULES` と few-shot を、曖昧段階では穏やかな聞き取りを優先する方針へ更新する。
- 対象2:
  - Guide の提案文を箇条書き前提で出しやすい prompt に整える。
- 対象3:
  - Guide Chat 表示に安全な Markdown レンダリングを追加する。
- 対象4:
  - 上記に対応する unit / targeted E2E / delta / plan を更新する。

## 非対象（Out of Scope）
- resident routing / Orchestrator の挙動変更
- resident の SOUL / ROLE / proper name 変更
- machine-readable JSON schema の変更
- task detail conversation log UI の redesign

## 差分仕様
- DS-01:
  - Given:
    - Guide が work intent の初期段階で、対象・成果物・制約の輪郭がまだ十分でない。
  - When:
    - Guide が応答する。
  - Then:
    - 3 案提示を急がず、まず相槌＋視点提案＋オープン質問を返す。
- DS-02:
  - Given:
    - Guide が複数案を提案する段階に入っている。
  - When:
    - Guide が options を返す。
  - Then:
    - 案は箇条書きまたは番号付きリストとして出しやすい prompt になる。
- DS-03:
  - Given:
    - Guide Chat にリスト、強調、インラインコード、コードブロックを含むメッセージがある。
  - When:
    - Chat を描画する。
  - Then:
    - Markdown が安全に HTML 表示され、プレーンテキスト化されない。

## 受入条件（Acceptance Criteria）
- AC-01:
  - Guide の operating rules / few-shot に、曖昧段階では相槌＋視点提案＋オープン質問を優先する方針が入っている。
- AC-02:
  - Guide の options 提案が箇条書き前提の wording へ更新されている。
- AC-03:
  - Guide Chat が Markdown の箇条書きとコード表現を描画できる。
- AC-04:
  - static check / targeted unit / targeted E2E / validator が PASS する。

## 制約
- Markdown レンダリングは依存追加なしで実装する。
- HTML 注入を避けるため、レンダリング前に危険な文字列は無害化する。

## Review Gate
- required: No
- reason:
  - prompt / UI 表示の中規模差分だが、レイヤー横断設計変更ではない。

## 未確定事項
- Q-01:
  - Markdown 対応を task detail conversation log にも広げるかは今回は未確定とする。

# delta-apply

## Delta ID
- DR-20260308-guide-gentle-clarification-and-chat-markdown

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- wireframe/context-builder.js
- wireframe/guide-plan.js
- wireframe/styles.css
- tests/unit/context-builder.test.js
- tests/unit/guide-plan.test.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260308-guide-gentle-clarification-and-chat-markdown.md

## 適用内容（AC対応）
- AC-01:
  - 変更:
    - Guide の `OPERATING_RULES` と few-shot を、曖昧段階では相槌＋視点提案＋オープン質問を優先する方針へ更新した
  - 根拠:
    - `3 案提示を急がない`
    - `5〜10ターン`
    - `相槌＋視点提案＋オープン質問`
    を rules と few-shot に追加した
- AC-02:
  - 変更:
    - Guide の複数案提案を Markdown の番号付き箇条書き前提へ更新した
  - 根拠:
    - 3案提示時の wording と few-shot reply を番号付きリストへ寄せた
- AC-03:
  - 変更:
    - Guide Chat に安全な Markdown renderer を追加した
  - 根拠:
    - リスト、強調、リンク、インラインコード、コードブロックを HTML 表示できる
- AC-04:
  - 変更:
    - unit / targeted E2E / validator を更新予定
  - 根拠:
    - prompt と表示の両方を verify で固定する

## 非対象維持の確認
- Out of Scope 変更の有無: No
- もし No の場合の理由:

## コード分割健全性
- 500行超のファイルあり: Yes
- 800行超のファイルあり: Yes
- 1000行超のファイルあり: Yes
- 長大な関数なし: Yes
- 責務過多のモジュールなし: Yes

## verify 依頼メモ
- 検証してほしい観点:
  - 曖昧段階で 3案提示を急がない rules が両 locale で入っているか
  - Guide Chat の Markdown が安全に表示されるか
- review evidence:
  - static
  - unit
  - targeted E2E
  - validator

# delta-verify

## Delta ID
- DR-20260308-guide-gentle-clarification-and-chat-markdown

## Verify Profile
- static check: `node --check wireframe/app.js wireframe/context-builder.js wireframe/guide-plan.js tests/unit/context-builder.test.js tests/unit/guide-plan.test.js tests/e2e/workspace-layout.spec.js`
- targeted unit: `node --test tests/unit/context-builder.test.js tests/unit/guide-plan.test.js`
- targeted integration / E2E: `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat renders markdown lists and code blocks|guide chat keeps dialog open when plan is not ready|guide chat keeps conversation mode without touching plan tasks"`
- project-validator: `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `context-builder` rules と `guide-plan` few-shot に、曖昧段階では相槌＋視点提案＋オープン質問を優先する文言を追加し、unit で確認した |
| AC-02 | PASS | 3案提示の wording と few-shot reply が Markdown 番号付きリスト前提であることを unit で確認した |
| AC-03 | PASS | Guide Chat で番号付きリストとコードブロックを描画できることを targeted Playwright で確認した |
| AC-04 | PASS | static / unit / targeted E2E / validator がすべて PASS した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- R-01:
  - task detail conversation log への Markdown 適用は今回は未対応

## Review Gate
- required: No
- checklist: `docs/delta/REVIEW_CHECKLIST.md`
- layer integrity: NOT CHECKED
- docs sync: PASS
- data size: NOT CHECKED
- code split health: PASS
- file-size threshold: PASS

## Review Delta Outcome
- pass: Yes
- follow-up delta seeds:

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260308-guide-gentle-clarification-and-chat-markdown

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的:
  - 管理人 Guide が曖昧段階では 3案提示を急がず、相槌＋視点提案＋オープン質問でゆっくり整理するようにした
  - Guide Chat で Markdown を安全に表示できるようにした
- 変更対象:
  - `wireframe/app.js`
  - `wireframe/context-builder.js`
  - `wireframe/guide-plan.js`
  - `wireframe/styles.css`
  - `tests/unit/context-builder.test.js`
  - `tests/unit/guide-plan.test.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
  - 本 delta 記録
- 非対象:
  - resident routing / Orchestrator 挙動
  - resident identity
  - schema 変更
  - task detail conversation log への Markdown 拡張

## 実装記録
- 変更ファイル:
  - `wireframe/app.js`
  - `wireframe/context-builder.js`
  - `wireframe/guide-plan.js`
  - `wireframe/styles.css`
  - `tests/unit/context-builder.test.js`
  - `tests/unit/guide-plan.test.js`
  - `tests/e2e/workspace-layout.spec.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
  - `docs/delta/DR-20260308-guide-gentle-clarification-and-chat-markdown.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS

## 検証記録
- verify要約:
  - Guide の曖昧段階応答を穏やかな聞き取り寄りに戻し、Guide Chat の Markdown 表示を追加した
- 主要な根拠:
  - static check PASS
  - targeted unit PASS
  - targeted Playwright PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- Markdown を task detail conversation log にも広げるかは未着手

## 次のdeltaへの引き継ぎ（任意）
- なし
