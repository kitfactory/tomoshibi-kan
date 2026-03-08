# delta-request

## Delta ID
- DR-20260308-guide-short-turn-convergence-recovery

## 目的
- assist OFF の Guide が resident trio (`調べる人 / 作り手 / 書く人`) 前提でも、少ないターンで `3案提示 + 1案推薦 + 短い締め` を返しやすいようにする。

## 変更対象（In Scope）
- `wireframe/guide-plan.js`
- `wireframe/context-builder.js`
- `wireframe/app.js`
- `tests/unit/guide-plan.test.js`
- `tests/unit/context-builder.test.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- assist ON 時の planning readiness 変更
- parser recovery の resident trio 3 task 回復ロジック変更
- routing scorer / Orchestrator dispatch / reroute / replan 実装変更
- `SOUL.md / ROLE.md / RUBRIC.md` の編集
- E2E の大規模追加

## 受入条件（Acceptance Criteria）
- AC-01: Guide の few-shot と `OPERATING_RULES` が、assist OFF でも `3案提示 + 1案推薦 + 短い締め` を resident trio 前提で促す。
- AC-02: unit test で recommendation / short closing の resident trio 前提を固定する。
- AC-03: 実モデル観測で assist OFF の 2 ターン目応答が、単なる追加質問列挙より提案寄りに改善した所見を verify に残す。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

## delta-apply
- Guide の `OPERATING_RULES` に、3案それぞれの着目点を短く明示し、推薦案には「なぜ今その観点を見るか」を一言添える規則を追加した。
- `needs_clarification` few-shot を resident trio 前提のまま更新し、`reload 後の再読込 / 永続化そのもの / UI state 反映` の観点分けと推薦理由を含めた。
- unit test を更新し、観点明示と推薦理由を固定した。
- spec / architecture に assist OFF の短ターン収束契約を最小同期した。

## delta-verify
- AC-01: PASS
  - `wireframe/context-builder.js` と `wireframe/app.js` の Guide rules に、各案の観点明示と推薦理由を追加した。
  - `wireframe/guide-plan.js` の few-shot も同じ形に更新した。
- AC-02: PASS
  - `node --test tests/unit/guide-plan.test.js tests/unit/context-builder.test.js`
  - PASS
- AC-03: PASS
  - command: `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 240000`
  - workspace: `C:\\Users\\kitad\\AppData\\Local\\Temp\\tomoshibi-kan-guide-check-lNSxuJ`
  - assist OFF の 2 ターン目応答:
    - `1. 保存後に即時反映しているかを見る案`
    - `2. 永続化そのものに着目する案`
    - `3. 再読込時の復元に着目する案`
    - `まずは 2 が最も可能性が高いです。保存直後から消えるなら書き込み側を見る方が早いので、2 でよいですか？`
  - 所見:
    - 単なる追加質問列挙ではなく、3案・観点・推薦理由・短い締めまで返せた。
    - ただし 3 ターン目はまだ `plan_ready` ではなく提案継続に留まる。
- AC-04: PASS
  - `node scripts/validate_delta_links.js --dir .`
  - PASS

## delta-archive
- archive status: PASS
- assist OFF の短ターン収束力回復 delta を archive する。
