# delta-request

## Delta ID
- DR-20260308-full-role-routing-real-observation

## Delta Type
- FEATURE

## 目的
- `ROLE全文 + summary` を resident routing に渡した状態で、real-model 条件の Guide / Orchestrator が resident trio をどう割り当てるかを観測し、偏りや explanation の妥当性を確認する。

## 変更対象（In Scope）
- 観測 script の実行
- 当該 delta 記録
- `docs/plan.md`

## 非対象（Out of Scope）
- routing ロジック変更
- Guide prompt / few-shot 変更
- resident `SOUL.md` / `ROLE.md` 再編集
- E2E / unit の追加変更

## 差分仕様
- DS-01:
  - Given:
    - current resident set と `ROLE全文 + summary` routing 実装
  - When:
    - real-model で Guide -> Plan -> Orchestrator を実行する
  - Then:
    - resident trio の task materialization と dispatch 結果を観測できる
- DS-02:
  - Given:
    - worker dispatch が行われた
  - When:
    - progress log / debug run を確認する
  - Then:
    - resident 割当と explanation を確認できる

## 受入条件（Acceptance Criteria）
- AC-01:
  - real-model 条件で resident trio の task materialization 結果を記録する
- AC-02:
  - 少なくとも 1 件の worker dispatch に対し resident 割当と explanation を記録する
- AC-03:
  - delta に observation と所見を記録する
- AC-04:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - この delta ではコード変更を行わない
- 制約2:
  - 失敗しても改善実装は次の delta に分離する

## Review Gate
- required: No
- reason:
  - 観測のみの差分であり、実装変更を含まない

# delta-apply

## Delta ID
- DR-20260308-full-role-routing-real-observation

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 実施内容
- `run_orchestrator_autonomous_check.js` を real-model 条件で実行した
- `task_progress_logs` と `orchestration_debug_runs` から resident 割当と explanation を確認した
- 観測結果を delta へ記録した

# delta-verify

## Delta ID
- DR-20260308-full-role-routing-real-observation

## Verify Profile
- real-model observation:
  - `node scripts/run_orchestrator_autonomous_check.js --turn-timeout-ms 240000`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | real-model 条件で resident trio の task materialization を確認した (`TASK-004/005/006`) |
| AC-02 | PASS | `TASK-004` の dispatch と progress log explanation を確認した |
| AC-03 | PASS | 本 delta に observation と所見を記録した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## 観測結果
- workspace:
  - `C:\\Users\\kitad\\AppData\\Local\\Temp\\tomoshibi-kan-orchestrator-check-G9biM4`
- turn 3:
  - Guide reply:
    - `この内容で依頼としてまとめます。調べる人 / 作り手 / 書く人 の3 task に分けました。`
  - materialized tasks:
    - `TASK-004 | 調べる人 -> pal-alpha`
    - `TASK-005 | 作り手 -> pal-beta`
    - `TASK-006 | 書く人 -> pal-delta`
- progress log (`TASK-004`):
  - `dispatch`
    - `TASK-004 を pal-alpha に割り当てました (ROLE=explicit_assignee)。`
  - `worker_runtime`
    - `TASK-004 の実行結果を更新しました`
  - `to_gate`
    - `TASK-004 を Gate 提出待ちに更新 (RUBRIC=task,evidence,app,を返す)`

## 所見
- `ROLE全文 + summary` を持たせた routing でも、resident trio の基本割当は崩れていない。
- 今回の `TASK-004` は `ROLE=explicit_assignee` で dispatch されており、Guide plan 側が resident を明示した場合はその意図が優先される。
- `ROLE全文` の追加で resident 割当が悪化した兆候は見られない。
- ただし今回の run は explicit assignee を含むため、`ROLE全文` が LLM routing の曖昧ケースでどれだけ効くかは、別の no-assignee 観測が必要である。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-full-role-routing-real-observation

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 結論
- `ROLE全文 + summary` を渡した real-model resident routing でも、resident trio の割当は維持された
- 今回の観測では explicit assignee 優先が支配的で、`ROLE全文` の効果は悪化要因になっていない
- 次に見るべきは `assignee なし task` での resident routing 観測である
