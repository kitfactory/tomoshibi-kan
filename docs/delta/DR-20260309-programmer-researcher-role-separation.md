# delta-request

## Delta ID
DR-20260309-programmer-researcher-role-separation

## Delta Type
FEATURE

## Requirement Links
- [SEED-20260309-programmer-researcher-role-separation](/abs/path/C:/Users/kitad/palpal-hive/docs/plan.md)

## Background
- resident dummy task 観測で、`program-guard` が冬坂へ寄った。
- ユーザー要求として、ソフトウェアのこと全般はプログラマが担い、リサーチャーはマーケティングや外部調査に寄せたい。

## In Scope
- built-in resident の `ROLE` と persona を更新し、リサーチャーを外部調査/比較/マーケ寄りへ寄せる。
- プログラマの `ROLE` をソフトウェア調査・再現・原因分析・修正・guard 実装まで担う契約へ寄せる。
- Guide-driven routing prompt に、software/codebase task はプログラマ優先、リサーチャーは外部調査 task のみという境界を追加する。
- dummy task 観測で誤配分改善を確認する。

## Out of Scope
- resident 固有名の変更
- Guide の plan wording 改修
- Gate / Writer の ROLE 変更
- fallback scorer 全廃

## Acceptance Criteria
- `pal-alpha` の ROLE が外部調査/比較/マーケ寄りに更新されている。
- `pal-beta` の ROLE がソフトウェア調査・再現・原因分析・修正・guard 実装寄りに更新されている。
- routing prompt に上記境界が明記されている。
- relevant unit と dummy task 観測が PASS し、`program-guard` がプログラマへ寄ることを確認できる。

# delta-apply

## Implementation Notes
- built-in seed と routing prompt を更新する。
- malformed routing decision で fallback へ落ちていたため、routing decision parser を harden した。
- 外部サービス事例（類似サービス、競合サービス、オンボーディング、導線比較）は software 製品が対象でもリサーチャー優先となるよう prompt と ROLE を補強した。

# delta-verify

## Delta ID
- DR-20260309-programmer-researcher-role-separation

## Verify Profile
- static check:
  - `node --check wireframe/agent-routing.js wireframe/app.js wireframe/debug-identity-seeds.js scripts/run_resident_dummy_task_observation.js`
- targeted unit:
  - `node --test tests/unit/debug-identity-seeds.test.js tests/unit/agent-routing.test.js tests/unit/plan-orchestrator.test.js`
- targeted integration / E2E:
  - `node scripts/run_resident_dummy_task_observation.js`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `pal-alpha` の ROLE が市場/競合/事例/外部サービス比較へ寄り、 software 不具合調査を引き受けない契約へ更新された |
| AC-02 | PASS | `pal-beta` の ROLE が software 調査・再現・原因分析・修正・guard 実装を担う契約へ更新された |
| AC-03 | PASS | Guide-driven routing prompt に `software/codebase は久瀬優先 / 外部サービス比較は冬坂優先` の境界を追加した |
| AC-04 | PASS | resident dummy observation で `research-repro/research-compare -> pal-alpha`, `program-fix/program-guard -> pal-beta`, `writer-return/writer-note -> pal-delta` を確認した |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- なし

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260309-programmer-researcher-role-separation

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 目的: リサーチャーを市場/外部調査へ寄せ、ソフトウェア実務をプログラマ優先へ再定義した。
- 変更対象: `wireframe/debug-identity-seeds.js`、`wireframe/app.js`、`wireframe/agent-routing.js`、`scripts/run_resident_dummy_task_observation.js`、`docs/spec.md`、`docs/architecture.md`、`docs/plan.md`、本 delta 記録
- 非対象: resident 固有名の変更、Guide の plan wording 改修、Gate/Writer の ROLE 変更、fallback scorer 全廃

## 実装記録
- 変更ファイル:
  - `wireframe/debug-identity-seeds.js`
  - `wireframe/app.js`
  - `wireframe/agent-routing.js`
  - `scripts/run_resident_dummy_task_observation.js`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/plan.md`
  - `docs/delta/DR-20260309-programmer-researcher-role-separation.md`
- AC達成状況:
  - AC-01 PASS
  - AC-02 PASS
  - AC-03 PASS
  - AC-04 PASS

## 検証記録
- verify要約: ROLE と routing 境界を更新し、 malformed routing decision recovery を含めて resident dummy observation で 6 / 6 の意図どおり割当を確認した。
- 主要な根拠:
  - `node --check wireframe/agent-routing.js wireframe/app.js wireframe/debug-identity-seeds.js scripts/run_resident_dummy_task_observation.js` PASS
  - `node --test tests/unit/debug-identity-seeds.test.js tests/unit/agent-routing.test.js tests/unit/plan-orchestrator.test.js` PASS
  - `node scripts/run_resident_dummy_task_observation.js` PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 未解決事項
- なし
