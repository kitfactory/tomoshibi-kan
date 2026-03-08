# delta-request

## Delta ID
- DR-20260308-orchestrator-routing-llm-design

## 目的
- Orchestrator が管理人と同じ model / `SOUL.md` を使って routing 判断できるよう、前処理・structured decision・fallback 境界を設計し、正本へ同期する。

## 変更対象（In Scope）
- `docs/concept.md`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- routing 実装コードの変更
- resident `ROLE.md` の再編集
- Orchestrator 本体の LLM 呼び出し追加
- routing 精度改善そのもの

## 受入条件（Acceptance Criteria）
- AC-01: Orchestrator の LLM 利用範囲と deterministic core の境界が concept/spec/architecture に明記される。
- AC-02: routing 用 `RoutingInput` と `RoutingDecision` の最小 schema が定義される。
- AC-03: 前処理で resident 候補をどう絞り、何を LLM に渡すかが明記される。
- AC-04: fallback (`rule-based fallback`, `reroute`, `replan_required`) の扱いが定義される。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-orchestrator-routing-llm-design

## ステータス
- APPLIED

## 変更ファイル
- docs/concept.md
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- `docs/concept.md` に `Orchestrator Routing` と `Routing Fallback` を追加し、resident dispatch は Orchestrator core が前処理し、必要時だけ active Guide と同じ model / `SOUL.md` を使う境界を同期した。
- `docs/spec.md` に LLM-assisted routing の最小要件を追加し、`RoutingInput` / `RoutingDecision` の必須フィールド、candidate resident summary、fallback (`dispatch | reroute | replan_required`) を定義した。
- `docs/architecture.md` に `Guide-driven routing boundary` と `Guide-driven routing DTO` を追加し、deterministic core と Guide reasoning の責務分離、validation 規則、audit 観点を同期した。
- `docs/plan.md` の current/archive/future を最小同期した。

# delta-verify

## Delta ID
- DR-20260308-orchestrator-routing-llm-design

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | concept/spec/architecture に deterministic core と Guide-driven routing の境界を追加した。 |
| AC-02 | PASS | `RoutingInput` と `RoutingDecision` の最小 schema を spec/architecture に定義した。 |
| AC-03 | PASS | resident 候補の前処理と、LLM へ渡す `roleSummary / capabilitySummary / fitHints / currentLoad` を明記した。 |
| AC-04 | PASS | invalid / low-confidence / no-fit 時の fallback (`rule-based fallback`, `reroute`, `replan_required`) を concept/spec/architecture に定義した。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-orchestrator-routing-llm-design

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- Orchestrator core が resident 候補を前処理し、必要時だけ active Guide の model / `SOUL.md` を借りて routing 判断する境界を正本へ同期した。
- `RoutingInput / RoutingDecision` と fallback 契約を定義し、後続の LLM-assisted routing 実装 delta の前提を固定した。
- routing 実装コード、resident `ROLE` 再編集、精度改善そのものには入っていない。
