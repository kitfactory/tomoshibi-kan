# delta-request

## Delta ID
- DR-20260304-agent-identity-step1-foundation

## 目的
- Agent Identity Layer（`SOUL.md` / `role.md` / `skills.yaml`）のStep1方針を仕様に固定し、実装を進めるための分解計画を作る。

## 変更対象（In Scope）
- `docs/plan.md` に Step1/Step2 へ進むための current チェックリスト（seed）を追加する。
- `docs/spec.md` の Pal Markdown / Context Builder 仕様を `SOUL.md` / `role.md` / `skills.yaml` 契約へ更新する。
- `docs/architecture.md` に Agent Identity 読み取り責務と Skill 参照（インストール済み台帳との結合）を追記する。

## 非対象（Out of Scope）
- Pal設定UIで `SOUL.md` / `role.md` を編集する機能追加。
- 実際のファイル読み書き実装（Electron IPC / Repository）。
- Guide の計画・アサインアルゴリズム本体の実装。

## 差分仕様
- DS-01:
  - Given: plan に次作業の分解が未定義
  - When: Step1 方針を plan へ反映する
  - Then: delta 単位で実行できる seed が current に追加される
- DS-02:
  - Given: spec/architecture に旧ファイル契約（`IDENTITY.md` 等）が残る
  - When: Agent Identity Layer 契約へ更新する
  - Then: `SOUL.md` / `role.md` / `skills.yaml` と Skill 台帳参照ルールが明記される

## 受入条件（Acceptance Criteria）
- AC-01: `docs/plan.md` に本方針の分解 current 項目（seed）が追加されている。
- AC-02: `docs/spec.md` / `docs/architecture.md` に Step1 契約（lowercase ファイル名、`skills.yaml` は参照設定、tool runtime では skill 文脈無効）が記載されている。
- AC-03: `node scripts/validate_delta_links.js --dir .` が PASS する。

## 制約
- 変更は docs のみ（コード実装は次 delta へ分離）。
- 既存の他 delta 範囲を巻き込まない。

## 未確定事項
- Q-01: `skills.yaml` の厳密スキーマ（将来の拡張キー）をどこまで Step1 で固定するか。

# delta-apply

## Delta ID
- DR-20260304-agent-identity-step1-foundation

## 実行ステータス
- APPLIED

## 変更ファイル
- docs/plan.md
- docs/spec.md
- docs/architecture.md
- docs/delta/DR-20260304-agent-identity-step1-foundation.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `docs/plan.md` に Agent Identity / Skill 参照 / Context Builder 接続の seed を current 追加。
  - 根拠: Step1 を delta 単位で進める順序を plan 上で固定。
- AC-02:
  - 変更: `docs/spec.md` と `docs/architecture.md` の Pal 文脈契約を `SOUL.md` / `role.md` / `skills.yaml` 基準へ更新。
  - 根拠: 旧契約（`IDENTITY.md` など）を Step1 方針へ統一。
- AC-03:
  - 変更: delta link 検証を実行し、必要な plan 記録を同期。
  - 根拠: delta 運用ルール（request/apply/verify/archive）準拠。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- plan の current seed が「実装可能な順序」になっていること。
- spec/architecture のファイル契約が lower-case で一貫していること。

# delta-verify

## Delta ID
- DR-20260304-agent-identity-step1-foundation

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `docs/plan.md` current に Step1 向け seed を追加 |
| AC-02 | PASS | `docs/spec.md` / `docs/architecture.md` に Agent Identity 契約を反映 |
| AC-03 | PASS | `node scripts/validate_delta_links.js --dir .` が OK |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: `skills.yaml` の詳細スキーマ（version/runtime_kind など）は実装 delta で追加確定が必要。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260304-agent-identity-step1-foundation

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Agent Identity Layer の Step1 契約と実装分解を文書で固定した。
- 変更対象: plan/spec/architecture の docs 差分。
- 非対象: UI機能追加、実装コード追加、Guide アサイン実装。

## 実装記録
- 変更ファイル:
  - docs/plan.md
  - docs/spec.md
  - docs/architecture.md
  - docs/delta/DR-20260304-agent-identity-step1-foundation.md
- AC達成状況:
  - AC-01: 達成
  - AC-02: 達成
  - AC-03: 達成

## 検証記録
- verify要約: plan/spec/architecture の差分と delta link を確認し PASS。
- 主要な根拠: `validate_delta_links` が errors=0/warnings=0。

## 未解決事項
- あり
  - `skills.yaml` の厳密スキーマ確定（実装 delta で固定）。

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: AgentIdentityRepository（読み書き）を実装し、`SOUL.md`/`role.md`/`skills.yaml` を ws-root 配下へ保存する。
- Seed-02: Context Builder が `enabled_skill_ids` をインストール済み Skill 台帳へ解決して注入する。
