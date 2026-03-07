# delta-request

## Delta ID
- DR-20260306-orchestration-debug-smoke-cli

## 目的
- Electron 実経路で orchestration を最小 smoke 実行し、`settings.sqlite` に落ちた debug record を CLI からすぐ観測できるようにする。

## 変更対象範囲 (In Scope)
- Electron main に smoke 用 stub runtime 切替を追加する。
- Playwright Electron で app を起動して最小 flow を流す smoke script を追加する。
- `palpal debug smoke` CLI entry を追加する。
- 関連 unit test と `spec/architecture/plan` へ最小同期する。

## 変更対象外 (Out of Scope)
- 本番 runtime の挙動変更。
- debug UI 追加。
- retention/export/tail。
- smoke 以外の運用自動化。

## 受入条件
- DS-01:
  - Given: isolated workspace と stub runtime
  - When: `palpal debug smoke` を実行する
  - Then: Electron app が起動し、Guide -> Job worker -> Gate の最小 flow が完走する。
- DS-02:
  - Given: smoke 実行後の workspace
  - When: `palpal debug runs` を実行する
  - Then: `guide_chat / worker_runtime / gate_review` の record を確認できる。
- DS-03:
  - Given: `palpal --help`
  - When: help を表示する
  - Then: `palpal debug smoke` が usage に含まれる。

## Acceptance Criteria
- AC-01: env 有効時のみ使う stub runtime 切替が追加される。
- AC-02: smoke script が isolated workspace で Electron orchestration を流し、必要な debug stage を確認する。
- AC-03: `palpal debug smoke` が smoke script を起動できる。
- AC-04: CLI unit test と実 smoke verify が PASS する。
- AC-05: spec/architecture/plan の最小同期が完了する。

## リスク
- Electron smoke は UI 遅延の影響を受けやすいので、最小 flow と selector を安定させる必要がある。
- stub runtime は smoke 専用であり、通常起動で有効にならないことが重要。

## 未解決事項
- Q-01: smoke 後に `debug show` まで自動で出すかは別 delta とする。

# delta-apply

## Delta ID
- DR-20260306-orchestration-debug-smoke-cli

## 実装ステータス
- APPLIED

## 変更ファイル
- electron-main.js
- scripts/run_orchestration_debug_smoke.js
- cli/palpal.js
- tests/unit/palpal-cli.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `PALPAL_DEBUG_STUB_RUNTIME=1` の時だけ deterministic な stub runtime を `electron-main.js` で有効化した。
  - 理由: 外部 model availability に依存せず Electron 実経路を確認するため。
- AC-02:
  - 変更点: Playwright Electron で app を起動し、Settings -> Pal -> Guide -> Job/Gate の最小 flow を実行する smoke script を追加した。
  - 理由: debug DB に実 record を落とし、次の調整材料を作るため。
- AC-03:
  - 変更点: `cli/palpal.js` に `palpal debug smoke` を追加した。
  - 理由: 後続の debug loop を CLI で再実行しやすくするため。
- AC-04:
  - 変更点: CLI help unit test を追加し、実 smoke + `debug runs/show` verify を行う。
  - 理由: CLI 入口と smoke 実行結果の両方を確認するため。
- AC-05:
  - 変更点: debug CLI 節を `spec/architecture` と `plan` に最小同期した。
  - 理由: tooling 契約を正本へ反映するため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: 通常 runtime、debug UI、retention/export/tail は未変更。

# delta-verify

## Delta ID
- DR-20260306-orchestration-debug-smoke-cli

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | stub runtime は env 有効時のみ main 起動時に差し込まれる。 |
| AC-02 | PASS | smoke script が `guide_chat / worker_runtime / gate_review` を生成して確認した。 |
| AC-03 | PASS | `palpal debug smoke` 入口を追加した。 |
| AC-04 | PASS | CLI unit test と実 smoke verify、`debug runs/show` 確認が PASS。 |
| AC-05 | PASS | spec/architecture/plan に最小同期した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: smoke stub / script / CLI / docs 同期に限定した。

## 主要確認
- R-01: `node --check electron-main.js`
- R-02: `node --check cli/palpal.js`
- R-03: `node --check scripts/run_orchestration_debug_smoke.js`
- R-04: `node --test tests/unit/palpal-cli.test.js`
- R-05: `node scripts/run_orchestration_debug_smoke.js --workspace <temp-dir>`
- R-06: `set PALPAL_WS_ROOT=<temp-dir> && node cli/palpal.js debug runs --limit 10`
- R-07: `set PALPAL_WS_ROOT=<temp-dir> && node cli/palpal.js debug show <run_id>`
- R-08: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-orchestration-debug-smoke-cli

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: Electron 実経路の orchestration smoke を CLI から起動し、debug DB を即観測可能にする。
- 変更対象: `electron-main.js`, smoke script, CLI, CLI test, docs
- 非対象: 通常 runtime 変更、debug UI、retention/export/tail

## 反映結果
- 変更ファイル: `electron-main.js`, `scripts/run_orchestration_debug_smoke.js`, `cli/palpal.js`, `tests/unit/palpal-cli.test.js`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`
- AC充足: AC-01/02/03/04/05 PASS

## 検証記録
- verify要約: syntax check + CLI unit test + real Electron smoke + debug runs/show + delta link validation PASS
- 主因メモ: なし

## 未解決事項
- `debug tail/export` と smoke の詳細比較出力は未実装。

## 次のdeltaへの引き継ぎ
- Seed-01: smoke で取得した debug run をもとに、Guide/Gate/Worker の `ROLE.md / RUBRIC.md` を段階調整する。
