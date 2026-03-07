# delta-request

## Delta ID
- DR-20260306-orchestration-debug-cli-minimal

## 目的
- orchestration debug record を UI を待たずに確認できるよう、`palpal debug runs` と `palpal debug show <run_id>` を追加する。

## 変更対象範囲 (In Scope)
- `cli/palpal.js` に `debug runs` / `debug show` を追加する。
- `tests/unit` に CLI の最小回帰を追加する。
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に最小同期する。

## 変更対象外 (Out of Scope)
- `debug tail`
- `debug export`
- debug UI
- CLI からの DB 書き込み

## 受入条件
- DS-01:
  - Given: debug record が DB に存在する
  - When: `palpal debug runs` を実行する
  - Then: 最新一覧を role/stage/status で絞り込み表示できる
- DS-02:
  - Given: 特定 `run_id` が存在する
  - When: `palpal debug show <run_id>` を実行する
  - Then: `input/output/meta/error` を詳細表示できる

## Acceptance Criteria
- AC-01: `palpal debug runs` が一覧を表示する。
- AC-02: `palpal debug show <run_id>` が単票詳細を表示する。
- AC-03: unit test で `runs/show` の基本回帰が PASS する。
- AC-04: 正本同期は debug CLI の最小説明に留まる。

## リスク
- CLI は `PALPAL_WS_ROOT` 依存なので、workspace 解決を app とずらさないことが重要。

## 未解決事項
- Q-01: `tail/export` は別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-orchestration-debug-cli-minimal

## 実装ステータス
- APPLIED

## 変更ファイル
- cli/palpal.js
- tests/unit/palpal-cli.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `palpal debug runs` を追加し、`--limit/--role/--stage/--status` の絞り込みを実装した。
  - 理由: debug record 一覧を素早く確認するため。
- AC-02:
  - 変更点: `palpal debug show <run_id>` を追加した。
  - 理由: 1件の input/output/meta/error を深掘りするため。
- AC-03:
  - 変更点: unit test で `runs` と `show` の基本回帰を追加した。
  - 理由: 既存 launcher を壊さず debug CLI を維持するため。
- AC-04:
  - 変更点: spec/architecture/plan へ最小同期した。
  - 理由: debug CLI の責務境界を正本へ反映するため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: tail/export/UI は入れていない。

# delta-verify

## Delta ID
- DR-20260306-orchestration-debug-cli-minimal

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | `palpal debug runs` を unit test で検証した。 |
| AC-02 | PASS | `palpal debug show` を unit test で検証した。 |
| AC-03 | PASS | CLI unit test が PASS した。 |
| AC-04 | PASS | spec/architecture/plan の最小同期に留めた。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 変更は CLI/CLI test/docs のみに限定した。

## 主な確認コマンド
- R-01: `node --check cli/palpal.js`
- R-02: `node --test tests/unit/palpal-cli.test.js`
- R-03: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-orchestration-debug-cli-minimal

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: debug DB を UI を待たずに確認できる最小 CLI を追加する。
- 変更対象範囲: cli, unit test, spec/architecture/plan
- 変更対象外: tail/export/UI

## 実装結果
- 変更ファイル: `cli/palpal.js`, `tests/unit/palpal-cli.test.js`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`
- AC達成状況: AC-01/02/03/04 PASS

## 検証要約
- verify結果: syntax check + CLI unit test + delta link validation PASS

## 未解決事項
- `debug tail/export` は未実装

## 次のdeltaへの引き継ぎ
- Seed-01: debug record の見方が固まったら `tail` か UI を追加する。
