# delta-request

## Delta ID
- DR-20260307-first-party-rename-tomoshibi-kan

## 背景
- first-party の表示・識別子を `Tomoshibi-kan` 基準へ揃え、CLI / env / workspace / localStorage / current docs のブランド表記を統一する。
- 既存利用者向けに、旧 `palpal` 系の env / localStorage / CLI alias は fallback として残す。

## In Scope
- `tomoshibikan` CLI / npm script / help 表示を first-class にし、旧 `palpal` alias を互換維持する。
- env prefix を `TOMOSHIBIKAN_*` 基準へ追加し、旧 `PALPAL_*` を fallback にする。
- workspace root / internal dir / temp dir / localStorage key / user agent / run id の first-party 識別子を `tomoshibi-kan` 基準へ更新する。
- preload bridge に `Tomoshibikan*` 名を追加し、旧 `Palpal*` は alias として残す。
- current docs に残る `PalPal-Hive` / `palpal-hive` / `.palpal` / `palpal debug` などの first-party 記述を `Tomoshibi-kan / 灯火館 / .tomoshibikan / tomoshibikan debug` へ更新する。
- unit / e2e / script の最小回帰を更新し、rename 後の first-party フローを検証する。
- `docs/plan.md` と delta を archive まで閉じる。

## Out of Scope
- 依存名 `palpal-core` の変更
- 深い module/file rename（例: `cli/palpal.js`, `runtime/palpal-core-runtime.js` の物理 rename）
- GitHub repo URL の変更
- 歴史的 delta / archive 記録の全面 rename

## Acceptance Criteria
- AC-01: `tomoshibikan` が first-class CLI として追加され、旧 `palpal` alias も継続利用できる。
- AC-02: env / workspace root / localStorage key / temp prefix / current docs の first-party 識別子が `Tomoshibi-kan` 基準へ更新されている。
- AC-03: preload / renderer は `Tomoshibikan*` bridge を優先しつつ、旧 `Palpal*` alias を fallback として受けられる。
- AC-04: 主対象の check/test が PASS する。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-first-party-rename-tomoshibi-kan

## ステータス
- APPLIED

## 変更ファイル
- cli/palpal.js
- electron-main.js
- electron-preload.js
- runtime/workspace-root.js
- runtime/palpal-core-runtime.js
- wireframe/app.js
- scripts/run_guide_autonomous_check.js
- scripts/run_guide_plan_materialization_check.js
- scripts/run_orchestrator_autonomous_check.js
- scripts/run_orchestrator_three_task_cycle_check.js
- scripts/run_orchestration_debug_smoke.js
- scripts/run_e2e_live.js
- tests/unit/workspace-root.test.js
- tests/unit/palpal-cli.test.js
- tests/unit/palpal-core-runtime.test.js
- tests/e2e/workspace-layout.spec.js
- tests/e2e/clawhub-live.spec.js
- docs/spec.md
- docs/architecture.md
- docs/experience_tone.md
- docs/design_assist.md
- docs/self_improvement.md
- docs/plan.md

## 適用内容
- `tomoshibikan` CLI / npm script を first-class にし、help 表示を動的 CLI 名基準にした。
- `TOMOSHIBIKAN_*` env を追加し、`PALPAL_*` を fallback にした。
- workspace root を `tomoshibi-kan`、internal dir を `.tomoshibikan` 優先へ変更し、旧 `.palpal` は fallback で読めるようにした。
- preload bridge に `Tomoshibikan*` を追加し、旧 `Palpal*` は alias として残した。
- renderer localStorage key を `tomoshibi-kan.*.v1` へ更新し、旧 `palpal-hive.*.v1` は read fallback として残した。
- current docs の first-party ブランド表記を `Tomoshibi-kan / 灯火館` 基準へ更新した。

# delta-verify

## Delta ID
- DR-20260307-first-party-rename-tomoshibi-kan

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `package.json` に `tomoshibikan` bin/script を追加し、`palpal` alias も残した。 |
| AC-02 | PASS | env / workspace / localStorage / temp prefix / current docs を `Tomoshibi-kan` 基準へ更新した。 |
| AC-03 | PASS | `electron-preload.js` で `Tomoshibikan*` bridge を公開し、旧 `Palpal*` alias も併存させた。 |
| AC-04 | PASS | 対象 `node --check` / unit / e2e が PASS した。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check electron-main.js`
- `node --check electron-preload.js`
- `node --check wireframe/app.js`
- `node --check runtime/workspace-root.js`
- `node --check runtime/palpal-core-runtime.js`
- `node --test tests/unit/workspace-root.test.js tests/unit/palpal-cli.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat supports @ completion with focus and project:file|guide controller assist is off by default and can be enabled in settings"`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-first-party-rename-tomoshibi-kan

## クローズ条件
- verify 判定: PASS
- archive 判定: 実施済み

archive status: PASS

## まとめ
- first-party の CLI / env / workspace / localStorage / current docs を `Tomoshibi-kan` 基準へ揃えた。
- 旧 `palpal` 系は alias / fallback として残し、既存環境を壊さない移行形にした。
