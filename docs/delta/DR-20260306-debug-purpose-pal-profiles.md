# delta-request

## Delta ID
- DR-20260306-debug-purpose-pal-profiles

## 目的
- 汎用 Worker seed を debug-purpose profile に置き換え、trace/fix/verify の役割で orchestration を確認しやすくする。

## 変更対象範囲 (In Scope)
- `wireframe/app.js` の初期 Guide/Gate/Worker profile の `displayName`, `persona`, `skills`, `status` を debug-purpose 構成へ更新する。
- `docs/plan.md` に seed/archive を反映する。
- orchestration 系の既存 verify を実行する。

## 変更対象外 (Out of Scope)
- agent ID の変更
- identity file 本体 (`SOUL.md` / `ROLE.md` / `RUBRIC.md`) の自動書き換え
- 新しい worker の追加/削除
- runtime kind の大幅変更

## 受入条件
- DS-01:
  - Given: 初期 Worker profile
  - When: seed を確認する
  - Then: `pal-alpha/pal-beta/pal-gamma` がそれぞれ trace/fix/verify の役割を持つ
- DS-02:
  - Given: orchestration 系テスト
  - When: Guide から task を作成して assignment する
  - Then: worker IDs は維持しつつ、routing に効く profile 情報が存在する

## Acceptance Criteria
- AC-01: `guide-core` と `gate-core` が debug-purpose な display/persona を持つ。
- AC-02: `pal-alpha/beta/gamma` が debug-purpose な display/persona/skills を持つ。
- AC-03: orchestration 系 targeted verify が PASS する。

## リスク
- ID を変えると既存 test/state が壊れるため、今回は ID を固定する。

## 未解決事項
- Q-01: debug-purpose identity file を seed と同時生成するかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-debug-purpose-pal-profiles

## 実装ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `guide-core` を `Debug Guide`、`gate-core` を `Debug Gate` として再定義した。
  - 理由: orchestration を debug 観点で扱う seed であることを明示するため。
- AC-02:
  - 変更点: `pal-alpha/beta/gamma` を `Trace Worker / Fix Worker / Verify Worker` に再定義し、skills と persona を付与した。
  - 理由: routing と debug 運用の意図を seed profile から読めるようにするため。
- AC-03:
  - 変更点: plan に seed/archive を反映した。
  - 理由: delta 管理を閉じるため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: IDs や identity file は変更していない。

# delta-verify

## Delta ID
- DR-20260306-debug-purpose-pal-profiles

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | `guide-core` / `gate-core` の display/persona を debug-purpose に更新した。 |
| AC-02 | PASS | `pal-alpha/beta/gamma` の display/persona/skills/status を debug-purpose に更新した。 |
| AC-03 | PASS | orchestration 系 targeted verify と debug CLI verify を実行して PASS した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 変更は initial profile seed と plan に限定した。

## 主な確認コマンド
- R-01: `node --check wireframe/app.js`
- R-02: `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat creates planned tasks and assigns workers|worker runtime receives structured handoff payload|event log shows routing explanations for dispatch and gate submit|job board supports gate flow"`
- R-03: `node --test tests/unit/agent-routing.test.js tests/unit/guide-task-planner.test.js`
- R-04: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-debug-purpose-pal-profiles

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: generic worker seed を debug-purpose seed に再定義する。
- 変更対象範囲: initial profile seed, plan
- 変更対象外: IDs, identity file, worker 数

## 実装結果
- 変更ファイル: `wireframe/app.js`, `docs/plan.md`
- AC達成状況: AC-01/02/03 PASS

## 検証要約
- verify結果: syntax check + targeted Playwright + unit + delta link validation PASS

## 未解決事項
- identity file の debug-purpose seed は未実装

## 次のdeltaへの引き継ぎ
- Seed-01: debug run を見ながら `ROLE.md` / `RUBRIC.md` の内容を具体化する。
