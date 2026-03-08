# delta-request

## Delta ID
- DR-20260308-resident-role-alignment-and-plan-preview-design

## Delta Type
- FEATURE

## 目的
- built-in 住人の職業設定を整理し、Guide が依頼確定前に `誰に何を頼むか` を短く見せる `PlanPreview` を整理する。

## 変更対象（In Scope）
- 対象1:
  - `docs/concept.md`
- 対象2:
  - `docs/spec.md`
- 対象3:
  - `docs/architecture.md`
- 対象4:
  - `docs/plan.md`
- 対象5:
  - `wireframe/debug-identity-seeds.js`
- 対象6:
  - `tests/unit/debug-identity-seeds.test.js`
- 対象7:
  - 本 delta 記録

## 非対象（Out of Scope）
- 非対象1:
  - Guide prompt / few-shot / parser / routing 実装変更
- 非対象2:
  - task detail UI の実装変更
- 非対象3:
  - 既存 workspace の resident identity 自動移行

## 差分仕様
- DS-01:
  - Given:
    - built-in 住人の表示名と職業設定が混ざっている
  - When:
    - `ROLE` の職業設定を整理する
  - Then:
    - `管理人 / 古参住人 / リサーチャー / プログラマ / ライター` の職業設定が明確になる
- DS-02:
  - Given:
    - Guide は依頼確定前に resident 名だけ見せているケースがある
  - When:
    - plan preview の責務を定義する
  - Then:
    - `誰に何を頼むか` を依頼前に短く確認できる設計が定義される

## 受入条件（Acceptance Criteria）
- AC-01:
  - built-in 住人の職業設定と role alignment 方針が concept/spec/architecture に記録されている
- AC-02:
  - Guide の plan preview で `taskTitle / residentLabel / oneLineIntent / expectedOutput` を見せる設計が定義されている
- AC-03:
  - built-in resident seed の `ROLE` に職業設定が反映されている
- AC-03:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - 表示名と職業設定は混ぜない
- 制約2:
  - `PlanPreview` は複雑な二層ラベルを導入しない

## Review Gate
- required: No
- reason:
  - 構造整理の設計差分であり、実装・データ移行を含まない

# delta-apply

## Delta ID
- DR-20260308-resident-role-alignment-and-plan-preview-design

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 実施内容
- `concept/spec/architecture` に built-in 住人の職業設定と `PlanPreview` 項目を追記した
- `PlanPreview` は `taskTitle / residentLabel / oneLineIntent / expectedOutput` のみを持つ形へ整理した
- built-in resident seed の `ROLE` に `リサーチャー / プログラマ / ライター` を反映した

# delta-verify

## Delta ID
- DR-20260308-resident-role-alignment-and-plan-preview-design

## Verify Profile
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | concept/spec/architecture に built-in 住人の職業設定と role alignment 方針を追加した |
| AC-02 | PASS | Guide の plan preview で `taskTitle / residentLabel / oneLineIntent / expectedOutput` を見せる設計へ整理した |
| AC-03 | PASS | built-in resident seed の `ROLE` に職業設定を反映した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-resident-role-alignment-and-plan-preview-design

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 確定内容
- built-in 住人の表示名とは別に、`ROLE` で `管理人 / 古参住人 / リサーチャー / プログラマ / ライター` の職業設定を持たせる
- Guide は依頼確定前に `誰に何を頼むか` を読める `PlanPreview` を出す
