# delta-request

## Delta ID
- DR-20260301-context-builder-spec

## 目的
- PalContextBuilder の仕様を実装可能な粒度で確定する。
- 次デルタ（Guide経路実装）へ渡す契約を固定する。

## In Scope
- `docs/spec.md` に Context Builder の入力ソース、優先度、token予算、出力、エラー方針を追記。
- `docs/architecture.md` にコンポーネント分割と境界契約を追記。
- `docs/plan.md` の seed 完了と archive 追記。

## Out of Scope
- Context Builder 本体コードの実装。
- Tokenizer 実装やモデル依存の厳密 token 計測。
- Guide/Gate/Worker への適用。

## Acceptance Criteria
- AC-01: `docs/spec.md` に Context Builder の入力ソースと優先度が明記されている。
- AC-02: `docs/spec.md` に token 予算式と超過時の圧縮順序が明記されている。
- AC-03: `docs/architecture.md` に Builder の分割コンポーネントと型契約が明記されている。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-context-builder-spec.md

## AC 対応
- AC-01:
  - spec に入力ソースと優先度を追記。
- AC-02:
  - token 予算式（reserved_output/safety_margin）と compaction 順序を追記。
- AC-03:
  - architecture に `ContextSourceCollector` などの分割と `ContextBuildInput/Result` 契約を追記。
- AC-04:
  - delta links validator 実行。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/spec.md` に入力ソース/優先度を追記 |
| AC-02 | PASS | `docs/spec.md` に予算式/圧縮順を追記 |
| AC-03 | PASS | `docs/architecture.md` に分割・型契約を追記 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` 実行 |

## 実行コマンド
- `node scripts/validate_delta_links.js --dir .`

# delta-archive

## クローズ
- verify result: PASS
- archive: 完了

## 要約
- Context Builder の仕様と設計契約を文書化した。
- 次デルタで Guide 経路へ実装するための前提を固定した。
