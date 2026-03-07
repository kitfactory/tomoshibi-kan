# delta-request

## Delta ID
- DR-20260308-built-in-resident-set-sync

## 目的
- `docs/tomoshibikan_resident_set_v0_1.md` の worldbuilding に沿って、built-in 初期住人セットを `管理人 / 古参 / 作り手 / 書く人 / 整える人 / 調べる人` へ更新する。
- Settings から built-in 住人定義を current workspace に同期できるようにし、既存 workspace の built-in identity を current seed/template へ揃えやすくする。

## 変更対象（In Scope）
- `wireframe/app.js` の built-in 初期住人セット、resident-facing metadata、Settings 同期導線
- `wireframe/debug-identity-seeds.js` の built-in debug identity seed
- `wireframe/guide-planning-intent.js` の resident-facing worker naming
- `tests/unit/debug-identity-seeds.test.js` / `tests/e2e/workspace-layout.spec.js`
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` / delta の最小同期

## 非対象（Out of Scope）
- Guide planning prompt / routing 精度の改善
- non built-in custom profile の identity 上書き
- full resident set に合わせた task taxonomy の全面見直し
- docs 全体の世界観文章の書き換え

## 受入条件（Acceptance Criteria）
- AC-01: built-in 初期住人セットが `guide-core / gate-core / pal-alpha / pal-beta / pal-gamma / pal-delta` の 6 件になり、表示名と persona が resident set に沿っている。
- AC-02: built-in debug identity seed が resident set に沿う文面へ更新されている。
- AC-03: Settings から built-in 住人定義の同期を実行すると、workspace 側の built-in identity が current seed/template 内容で上書きされる。
- AC-04: 同期時に不足 built-in profile が補完され、既存 built-in profile の resident-facing metadata が current built-in 定義へ揃う。
- AC-05: unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-built-in-resident-set-sync

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- wireframe/debug-identity-seeds.js
- wireframe/guide-planning-intent.js
- tests/unit/debug-identity-seeds.test.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- built-in 初期住人セットを resident set v0.1 に合わせて `guide-core / gate-core / pal-alpha / pal-beta / pal-gamma / pal-delta` の 6 件へ更新した。
- resident-facing の displayName / persona を `管理人 / 古参 / 調べる人 / 作り手 / 整える人 / 書く人` に揃えた。
- built-in debug identity seed を resident set に沿う `SOUL.md / ROLE.md / RUBRIC.md` へ更新し、`pal-delta` 用 seed を追加した。
- Settings に `built-in 住人定義を同期` action を追加し、current workspace の built-in identity と metadata を current built-in seed/template へ上書きできるようにした。
- 同期時は不足 built-in profile を補完し、既存 built-in profile は runtime/provider/tool 設定を保持しながら resident-facing metadata を current built-in 定義へ揃えるようにした。

# delta-verify

## Delta ID
- DR-20260308-built-in-resident-set-sync

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `INITIAL_PAL_PROFILES` を 6 件へ更新し、Playwright の `settings can sync built-in resident definitions to workspace` で `管理人 / 古参 / 調べる人 / 作り手 / 整える人 / 書く人` が表示されることを確認した。 |
| AC-02 | PASS | `tests/unit/debug-identity-seeds.test.js` で `guide-core / gate-core / pal-alpha / pal-beta / pal-gamma / pal-delta` の resident-facing seed を確認した。 |
| AC-03 | PASS | Settings の同期 action から `syncBuiltInResidentIdentitiesToWorkspace()` を呼び、workspace 側 identity save が 6 件行われることを E2E で確認した。 |
| AC-04 | PASS | 同期処理は built-in 以外を保持したまま `pal-delta` を補完し、既存 built-in profile の metadata を current built-in 定義へ揃える。E2E で 5 件 snapshot から 6 件へ補完されることを確認した。 |
| AC-05 | PASS | targeted unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check wireframe/app.js`
- `node --check wireframe/debug-identity-seeds.js`
- `node --check wireframe/guide-planning-intent.js`
- `node --test tests/unit/debug-identity-seeds.test.js tests/unit/guide-planning-intent.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "built-in debug identities are seeded on init when missing|settings can sync built-in resident definitions to workspace|identity files can be edited from pal settings modal|language switch exists in settings tab"`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "pal list includes roles and allows name/model/tool settings|guide chat creates planned tasks and assigns workers|job board supports gate flow"`
- `node scripts/validate_delta_links.js --dir .`

## 既知事項
- resident set の built-in 化は resident-facing naming と identity seed までであり、task taxonomy の全面見直しは scope 外。
- `書く人` は built-in resident として追加したが、現時点では debug-purpose routing の主経路にはまだ強く使っていない。
- docs 全体には既存の文字化けが残っているが、この delta では最小同期だけを行った。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-built-in-resident-set-sync

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- resident set v0.1 を built-in 初期住人セットへ反映し、resident-facing の built-in 6 人構成を current code に固定した。
- Settings から current workspace の built-in identity を同期できるようになり、既存 workspace を current seed/template に揃えやすくなった。
- non built-in custom profile は維持したまま、built-in profile だけを上書き・補完する境界を設けた。
