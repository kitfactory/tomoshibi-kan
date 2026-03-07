# delta-request

## Delta ID
- DR-20260301-skill-catalog

## 目的
- Settings の Skill 管理（ClawHub 検索 / 擬似Download / 削除）の状態遷移を pure 関数化し、回帰を防ぐ。
- Skill 管理ロジックを unit/E2E で検証可能にする。

## 変更対象（In Scope）
- Skill Catalog ロジックを `wireframe` の独立モジュールとして追加する。
- `wireframe/app.js` の Skill 検索/追加/削除処理を共通ロジック経由に変更する。
- Skill Catalog の unit テストを追加する。
- Skill 管理の E2E シナリオを追加/強化する。
- `docs/plan.md` に skill-catalog seed の進捗を反映する。

## 非対象（Out of Scope）
- Pal Runtime ロジックの再変更。
- Pal List 追加/削除UIの仕様変更。
- concept/spec/architecture 本文の改訂。

## 差分仕様
- DS-01:
  - Given: Skill 管理ロジックが UI イベントに分散している
  - When: Skill Catalog ヘルパーへ集約する
  - Then: 検索/追加/削除の判定が一貫する
- DS-02:
  - Given: Skill 管理に unit テストがない
  - When: Skill Catalog ヘルパーの unit テストを追加する
  - Then: 検索・重複追加防止・削除判定を自動検証できる
- DS-03:
  - Given: Skill 管理の E2E が最小検証に留まる
  - When: E2E を追加/強化する
  - Then: 検索結果表示と重複追加防止を回帰検出できる

## 受入条件（Acceptance Criteria）
- AC-01: Skill 検索/追加/削除の判定が共通ヘルパー経由になる。
- AC-02: unit テストで Skill Catalog ロジック（検索、追加、削除、重複防止）が検証される。
- AC-03: E2E テストで Skill の検索表示と追加/削除導線が検証される。
- AC-04: `docs/plan.md` の skill-catalog seed が完了として反映される。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

## 制約
- 変更は Skill Catalog 管理に必要な最小差分に限定する。
- UI レイアウトやデザイン調整は行わない。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-skill-catalog

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/skill-catalog.js
- wireframe/index.html
- wireframe/app.js
- tests/unit/skill-catalog.test.js
- tests/e2e/workspace-layout.spec.js
- package.json
- docs/plan.md
- docs/delta/DR-20260301-skill-catalog.md

## 適用内容（AC対応）
- AC-01:
  - 変更: Skill Catalog ヘルパーを追加し、検索/追加/削除を共通判定経由へ変更した。
  - 根拠: `wireframe/skill-catalog.js` を追加し、`wireframe/app.js` で `resolveSkillCatalogValidationApi` 経由に変更。
- AC-02:
  - 変更: Skill Catalog ロジックの unit テストを追加した。
  - 根拠: `tests/unit/skill-catalog.test.js` で検索・重複防止・削除を検証。
- AC-03:
  - 変更: Skill 管理の E2E を強化した。
  - 根拠: `tests/e2e/workspace-layout.spec.js` に検索 empty 表示確認と再インストール不可確認を追加。
- AC-04:
  - 変更: `docs/plan.md` の skill-catalog seed を完了チェックに更新し archive に DR を追加した。
  - 根拠: current の 3項目を `[x]` にし、`[DR-20260301-skill-catalog]` を archive へ追加。
- AC-05:
  - 変更: delta 整合検証可能な状態へ更新した。
  - 根拠: 本ファイルへ verify/archive セクションを追加。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 検証してほしい観点: Skill 検索表示、重複追加防止、削除導線、unit/E2E 実行結果、delta リンク整合

# delta-verify

## Delta ID
- DR-20260301-skill-catalog

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `wireframe/app.js` の Skill 処理が `skill-catalog.js` 経由（フォールバック付き）に変更 |
| AC-02 | PASS | `npm run test:unit` で Skill Catalog unit を含む 10件 PASS |
| AC-03 | PASS | Skill 関連 E2E 9件 PASS（3 viewport） |
| AC-04 | PASS | `docs/plan.md` の skill-catalog seed 完了、archive に DR 追加済み |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が成功 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: ClawHub 連携は擬似Downloadのまま（実ネットワーク実装は非対象）。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-skill-catalog

## クローズ判定
- verify結果: PASS
- verify result: PASS
- archive可否: 可

## 確定内容
- 目的: Skill Catalog 管理ロジックを共通化し、回帰をテストで固定する。
- 変更対象: `wireframe/skill-catalog.js`、`wireframe/index.html`、`wireframe/app.js`、`tests/unit/skill-catalog.test.js`、`tests/e2e/workspace-layout.spec.js`、`package.json`、`docs/plan.md`
- 非対象: Runtimeロジック再変更、Pal List UI 仕様変更、canonical docs 改訂

## 実装記録
- 変更ファイル:
  - wireframe/skill-catalog.js
  - wireframe/index.html
  - wireframe/app.js
  - tests/unit/skill-catalog.test.js
  - tests/e2e/workspace-layout.spec.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260301-skill-catalog.md
- AC達成状況: AC-01〜AC-05 すべて達成

## 検証記録
- verify要約: unit/E2E/delta整合の全AC PASS
- 主要な根拠:
  - `npm run test:unit`
  - `npx playwright test tests/e2e/workspace-layout.spec.js --grep 'settings tab supports skill uninstall and install|pal list includes roles and allows name/model/tool settings|pal runtime save is blocked when tool target is not available'`
  - `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- なし

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: SEED-20260301-pal-profile
