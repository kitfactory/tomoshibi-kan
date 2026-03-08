# delta-request

## Delta ID
- DR-20260308-role-strategy-for-task-conversation-log

## 目的
- task 詳細右列で、管理人・住人・古参住人のやり取りが task-centric progress log として読める体験を正本へ明示する。
- その体験を成立させるために、`ROLE.md` が持つべき必須項目を先に固定する。

## 変更対象（In Scope）
- `docs/concept.md`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- built-in `ROLE.md` 本文の実更新
- UI 実装変更
- progress log schema の追加変更
- `SOUL.md` の再編集

## 受入条件（Acceptance Criteria）
- AC-01: concept に、task 詳細右列が管理人・住人・古参住人の会話として履歴を見せる体験が明記されている。
- AC-02: spec に、`ROLE.md` が少なくとも `Mission / Inputs / Outputs / Done Criteria / Constraints / Hand-off Rules / Progress Voice / Progress Note Triggers` を持つ方針が明記されている。
- AC-03: architecture に、内部 actor と表示 actor を分けつつ、task detail が conversation-like timeline を表示する責務が明記されている。
- AC-04: `docs/plan.md` に、次の `ROLE rollout` 用 seed が追加されている。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-role-strategy-for-task-conversation-log

## ステータス
- APPLIED

## 変更ファイル
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- concept に task detail 右列が `Guide / 住人 / 古参住人` の会話として読める `Task Detail Conversation Log` を追加した。
- spec に `ROLE.md` の最小契約と `Progress Voice / Progress Note Triggers` を追加した。
- architecture に `TaskDetailPresenter` の conversation-like timeline 責務と `ROLE` 契約ガイダンスを追加した。
- plan に次段の `resident-role-rollout` seed と、当該 delta の archive 記録を追加した。

# delta-verify

## Delta ID
- DR-20260308-role-strategy-for-task-conversation-log

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `concept.md` に `Task Detail Conversation Log` を追加し、task detail 右列の体験を明記した。 |
| AC-02 | PASS | `spec.md` に `ROLE.md` の必須節と `Progress Voice / Progress Note Triggers` を追加した。 |
| AC-03 | PASS | `architecture.md` に `TaskDetailPresenter` の conversation-like timeline 責務を追加した。 |
| AC-04 | PASS | `plan.md` current に `resident-role-rollout` の seed と delta を追加した。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-role-strategy-for-task-conversation-log

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- task detail 右列を住人会話ログとして見せる前提を正本へ追加した。
- `ROLE.md` を人格説明ではなく作業契約として扱うための最小項目を固定した。
- 次段の built-in resident role rollout を進められる plan seed を追加した。
