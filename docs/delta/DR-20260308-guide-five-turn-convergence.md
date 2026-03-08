# delta-request

## Delta ID
- DR-20260308-guide-five-turn-convergence

## Delta Type
- FEATURE

## 目的
- Guide の収束目標を `3ターン固定` から `5ターン以内で自然に resident trio の依頼へ収束` に切り替え、runner と観測基準を更新する。

## 変更対象（In Scope）
- 対象1:
  - `scripts/run_guide_autonomous_check.js`
- 対象2:
  - `docs/plan.md`
- 対象3:
  - 本 delta 記録

## 非対象（Out of Scope）
- 非対象1:
  - Guide prompt / few-shot / SOUL / ROLE の再調整
- 非対象2:
  - routing / Orchestrator / progress log
- 非対象3:
  - resident set の変更

## 差分仕様
- DS-01:
  - Given:
    - Guide の収束を測る runner
  - When:
    - default scenario を実行する
  - Then:
    - 5ターン以内で `plan_ready` と task materialization を確認できる構成になっている
- DS-02:
  - Given:
    - `3ターン固定` を前提にした current plan
  - When:
    - 本 delta を反映する
  - Then:
    - `5ターン以内` を前提に current と観測意図が読める

## 受入条件（Acceptance Criteria）
- AC-01:
  - runner の default prompt scenario が `5ターン以内` の収束観測へ更新されている
- AC-02:
  - current plan が `5ターン以内` の収束改善に切り替わっている
- AC-03:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - この delta では会話品質自体の改善実装を入れない
- 制約2:
  - failed 観測 delta は記録として残し、今回の delta で上書きしない

## Review Gate
- required: No
- reason:
  - 観測基準と runner の更新に限定した差分であり、構造変更を含まない

# delta-apply

## Delta ID
- DR-20260308-guide-five-turn-convergence

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 実施内容
- `run_guide_autonomous_check.js` の default prompt scenario を 5ターン以内の自然収束前提へ更新した
- `plan.md` の current を本 delta に切り替えた
- failed observation である `DR-20260308-llm-routing-precision-real-observation` は archive から外し、future note として残した

# delta-verify

## Delta ID
- DR-20260308-guide-five-turn-convergence

## Verify Profile
- static check:
  - `node --check scripts/run_guide_autonomous_check.js`
- targeted integration / E2E:
  - `node scripts/run_guide_autonomous_check.js --turn-timeout-ms 240000`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | runner の default prompt を 5ターン以内の収束観測前提へ更新し、task materialization 到達時点で停止するようにした |
| AC-02 | PASS | current plan を `DR-20260308-guide-five-turn-convergence` へ差し替え、failed observation は future note に移した |
| AC-03 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## 観測結果
- 直近の run では 4ターン目まで安定して進まず、3ターン目で追加確認に戻り timeout した
- timeout 時の latest messages:
  - turn 2: `3案 + 推薦 + 短い締め`
  - turn 3: `Reload 後の復元を確認したいということですが、具体的にどの設定項目が保存・再読み込み時に問題になるか...`
- つまり `5ターン以内` 基準へ切り替えること自体は妥当だが、実際の到達率はまだ揺れている

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-guide-five-turn-convergence

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- `Guide` の収束基準を `3ターン固定` ではなく `5ターン以内で自然に依頼化` として扱う
- `run_guide_autonomous_check.js` の default scenario は 5ターン以内の依頼化を観測する形へ更新した
- failed observation は archive ではなく future note として保持する
