# delta-request

## Delta ID
- DR-20260308-resident-name-adjustment

## Delta Type
- FEATURE

## 目的
- built-in resident の proper name を更新し、管理人は `月見里 燈子`、古参住人は `真壁 匡人` を正とする。

## 変更対象（In Scope）
- 対象1:
  - `wireframe/app.js`
- 対象2:
  - `wireframe/debug-identity-seeds.js`
- 対象3:
  - `tests/e2e/workspace-layout.spec.js`
- 対象4:
  - `docs/spec.md`
- 対象5:
  - `docs/plan.md`
- 対象6:
  - `docs/delta/DR-20260308-resident-proper-name-rollout.md`
- 対象7:
  - 本 delta 記録

## 非対象（Out of Scope）
- 非対象1:
  - 住人の人数変更
- 非対象2:
  - Guide / Orchestrator の routing ロジック変更
- 非対象3:
  - 冬坂 / 久瀬 / 白峰 の名前変更

## 受入条件（Acceptance Criteria）
- AC-01:
  - built-in 表示名は `燈子さん / 真壁 / 冬坂 / 久瀬 / 白峰` になる
- AC-02:
  - built-in seed 内の古参住人参照は `真壁` に揃う
- AC-03:
  - Settings sync E2E の resident 表示期待が `真壁` に更新される
- AC-04:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - 管理人の user-facing 表示名は従来どおり `燈子さん` を維持する
- 制約2:
  - 古参住人の user-facing 表示名は `真壁` とする
- 制約3:
  - 既存 proper-name rollout の方針は維持し、今回は名前差し替えだけに閉じる

# delta-apply

## Delta ID
- DR-20260308-resident-name-adjustment

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 実施内容
- built-in gate resident の display name を `真壁` に更新した
- built-in seed の古参住人参照を `真壁` に揃えた
- current doc と E2E expectation を `古参住人 / 真壁` 前提へ更新した

# delta-verify

## Delta ID
- DR-20260308-resident-name-adjustment

## Verify Profile
- static:
  - `node --check wireframe/app.js wireframe/debug-identity-seeds.js tests/e2e/workspace-layout.spec.js`
- unit:
  - `node --test tests/unit/debug-identity-seeds.test.js`
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | built-in display は `燈子さん / 真壁 / 冬坂 / 久瀬 / 白峰` に更新した。 |
| AC-02 | PASS | built-in seed 内の gate 参照を `真壁` と `古参住人` に揃えた。 |
| AC-03 | PASS | Settings sync E2E の resident 表示期待を `真壁` に更新した。 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` は PASS。 |

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-resident-name-adjustment

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- 管理人の proper name は `月見里 燈子`、resident-facing 表示は `燈子さん`
- 古参住人の proper name は `真壁 匡人`、resident-facing 表示は `真壁`
- current seed / current docs / E2E expectation をこの命名へ揃えた
