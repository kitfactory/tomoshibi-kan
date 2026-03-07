# delta-request

## Delta ID
- DR-20260307-technical-identifier-rename-tomoshibi

## 背景
- `Tomoshibi-kan` への first-party rename 後も、bridge / IPC / registry / helper には `pal/palpal` 系の first-class 技術識別子が残っている。
- 互換 alias は維持しつつ、先に安全に寄せられる識別子だけを `tomoshibi*` 側へ揃えたい。

## In Scope
- Electron IPC の first-class channel 名を `tomoshibikan-core:*` 側へ寄せ、旧 channel は alias として残す。
- preload / renderer / registry の first-class global / helper / variable 名を `Tomoshibikan*` / `TOMOSHIBIKAN_*` へ寄せる。
- unit / e2e test の first-class 表記と fixture prefix を `Tomoshibi-kan` 基準へ寄せる。
- `docs/plan.md` と delta を archive まで閉じる。

## Out of Scope
- file/module の物理 rename
- `palpal-core` 依存名の変更
- `Pal / Guide / Gate` の概念 rename
- 互換 alias / fallback の削除

## Acceptance Criteria
- AC-01: Electron first-class channel は `tomoshibikan-core:list-provider-models` を使用し、旧 `palpal-core:list-provider-models` も alias として動く。
- AC-02: preload / registry / renderer の first-class 技術識別子が `Tomoshibikan*` / `TOMOSHIBIKAN_*` へ寄っている。
- AC-03: test の first-class 表記と tmp prefix が `Tomoshibi-kan` 基準へ更新されている。
- AC-04: 対象 check/test が PASS する。
- AC-05: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-technical-identifier-rename-tomoshibi

## ステータス
- APPLIED

## 変更ファイル
- electron-main.js
- electron-preload.js
- wireframe/palpal-core-registry.js
- wireframe/app.js
- tests/unit/palpal-cli.test.js
- tests/unit/settings-store.test.js
- tests/unit/agent-identity-store.test.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md

## 適用内容
- first-class IPC channel を `tomoshibikan-core:list-provider-models` へ寄せ、旧 channel は alias handler として残した。
- preload の core runtime bridge は新 channel を使うよう変更した。
- renderer / registry の first-class helper / variable / global 名を `Tomoshibikan*` / `TOMOSHIBIKAN_*` 側へ寄せ、旧 `Palpal*` / `PALPAL_*` は fallback として残した。
- test の first-class 名称と tmp prefix を `Tomoshibi-kan` 基準へ更新した。

# delta-verify

## Delta ID
- DR-20260307-technical-identifier-rename-tomoshibi

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `electron-main.js` は `tomoshibikan-core:list-provider-models` を first-class とし、旧 channel も alias handler として残した。 |
| AC-02 | PASS | preload / registry / renderer の first-class 識別子を `Tomoshibikan*` / `TOMOSHIBIKAN_*` へ寄せた。 |
| AC-03 | PASS | CLI test 名・tmp prefix・E2E stub の first-class 表記を更新した。 |
| AC-04 | PASS | 対象 `node --check` / unit / e2e が PASS した。 |
| AC-05 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `node --check electron-main.js`
- `node --check electron-preload.js`
- `node --check wireframe/palpal-core-registry.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/palpal-cli.test.js tests/unit/settings-store.test.js tests/unit/agent-identity-store.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "worker runtime receives structured handoff payload|identity files can be edited from pal settings modal|guide controller assist is off by default and can be enabled in settings"`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-technical-identifier-rename-tomoshibi

## クローズ条件
- verify 判定: PASS
- archive 判定: 実施済み

archive status: PASS

## まとめ
- `pal/palpal` の safe rename を first-class 技術識別子に限定して適用した。
- 旧 alias / fallback は残したため、既存環境との互換は維持されている。
- `Pal / Guide / Gate` の概念 rename にはまだ踏み込んでいない。
