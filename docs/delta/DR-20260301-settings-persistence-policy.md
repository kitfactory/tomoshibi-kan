# delta-request

## Delta ID
- DR-20260301-settings-persistence-policy

## 目的
- Settings の保存方式を確定し、API_KEY の取り扱いルールを明文化する。

## 変更対象（In Scope）
- `docs/plan.md` に保存方式決定タスクと実装タスクを current へ追加する。
- `docs/spec.md` に保存方式（非機密/機密）と API_KEY の扱いを追記する。
- `docs/architecture.md` に SecretStore 前提の設計方針を追記する。
- `docs/OVERVIEW.md` の現在スコープへ決定内容を反映する。

## 非対象（Out of Scope）
- 実コードへの永続化実装（SQLite / keychain adapter）。
- API_KEY の実保存・移行処理。
- UI 挙動の変更。

## 差分仕様
- DS-01:
  - Given: Settings の保存方式が未確定
  - When: 仕様・設計文書を更新する
  - Then: 「非機密=SQLite / API_KEY=OSキーチェーン+secret_ref」が一貫して参照可能になる
- DS-02:
  - Given: API_KEY 入力取り扱いが曖昧
  - When: 仕様に入力ルールを明記する
  - Then: write-only・再表示禁止・削除時連動削除・Export除外が定義される

## 受入条件（Acceptance Criteria）
- AC-01: `plan.md` current に保存方式決定と実装タスクが追加される。
- AC-02: `spec.md` に保存方式と API_KEY 取り扱い規則が追記される。
- AC-03: `architecture.md` に `SecretStorePort` と `apiKeyRef` 前提が反映される。
- AC-04: `OVERVIEW.md` の今回スコープに保存方式決定が反映される。

## 制約
- 既存の機能挙動は変更しない。
- 文書差分のみで完結する。

## 未確定事項
- なし

# delta-apply

## Delta ID
- DR-20260301-settings-persistence-policy

## 実行ステータス
- APPLIED

## 変更ファイル
- docs/plan.md
- docs/spec.md
- docs/architecture.md
- docs/OVERVIEW.md
- docs/delta/DR-20260301-settings-persistence-policy.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `plan.md` current に保存方式決定（完了）と実装タスク（未着手）を追加。
  - 根拠: `SEED-20260301-settings-persistence-policy` / `SEED-20260301-settings-persistence-impl` を追記。
- AC-02:
  - 変更: `spec.md` に「設定保存方式（決定）」と「API_KEY入力の扱い（必須）」を追記。
  - 根拠: 非機密はSQLite、API_KEYはOSキーチェーン+secret_ref、write-only等を明記。
- AC-03:
  - 変更: `architecture.md` に `OsKeychainSecretStoreAdapter`、`SecretStorePort`、`ModelConfig.apiKeyRef` を追加。
  - 根拠: 設計上の責務分離と秘密情報非平文保存方針を明記。
- AC-04:
  - 変更: `OVERVIEW.md` の現在スコープに保存方式決定を反映。
  - 根拠: 今回スコープとして参照可能な状態に更新。

## 非対象維持の確認
- Out of Scope への変更なし: Yes
- もし No の場合の理由: なし

## verify 依頼メモ
- 文書間の方針整合（plan/spec/architecture/overview）と delta リンク整合を確認する。

# delta-verify

## Delta ID
- DR-20260301-settings-persistence-policy

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `plan.md` current に保存方式決定/実装タスクを追加し、archive へ DR 記録を追加 |
| AC-02 | PASS | `spec.md` に保存方式と API_KEY 規則を追加 |
| AC-03 | PASS | `architecture.md` に SecretStorePort と apiKeyRef 前提を反映 |
| AC-04 | PASS | `OVERVIEW.md` の今回スコープを更新 |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: まだ実装未着手のため、設計と実装の乖離は次 delta で検証が必要。

## 判定
- Overall: PASS

## FAIL時の最小修正指示
- なし

# delta-archive

## Delta ID
- DR-20260301-settings-persistence-policy

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: 設定保存方式と API_KEY 取り扱い方針を決定し、正本へ反映する。
- 変更対象: `docs/plan.md`、`docs/spec.md`、`docs/architecture.md`、`docs/OVERVIEW.md`
- 非対象: 実コード実装、データ移行、UI変更

## 実装記録
- 変更ファイル:
  - docs/plan.md
  - docs/spec.md
  - docs/architecture.md
  - docs/OVERVIEW.md
  - docs/delta/DR-20260301-settings-persistence-policy.md
- AC達成状況: AC-01〜AC-04 すべて達成

## 検証記録
- verify要約: 文書4点に保存方針を反映し、plan↔delta整合を確認してPASS
- 主要な根拠:
  - `docs/plan.md`
  - `docs/spec.md`
  - `docs/architecture.md`
  - `docs/OVERVIEW.md`
  - `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- なし
