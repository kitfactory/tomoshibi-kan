# delta-request

## Delta ID
- DR-20260306-debug-purpose-identity-seeds

## 目的
- built-in debug profile (`guide-core` / `gate-core` / `pal-alpha` / `pal-beta` / `pal-gamma`) に concrete な `SOUL.md / ROLE.md / RUBRIC.md` を不足時だけ seed し、初回起動から debug routing/orchestration に使える状態へ揃える。

## 変更対象範囲 (In Scope)
- `wireframe` に built-in debug identity seed 定義を追加する。
- 起動時に built-in profile の identity file が未作成なら seed 保存する。
- unit test と E2E で seed 内容と init 配線を確認する。
- `docs/plan.md` に seed/archive 完了記録を追加する。

## 変更対象外 (Out of Scope)
- 既存 identity file の上書きや migrate。
- custom profile への自動 seed。
- routing 算出ロジック自体の変更。
- debug DB / CLI の拡張。

## 受入条件
- DS-01:
  - Given: built-in profile に identity file が存在しない
  - When: アプリを起動する
  - Then: role に応じた debug-purpose `SOUL + ROLE/RUBRIC` が保存される。
- DS-02:
  - Given: built-in debug identity seed が定義されている
  - When: role ごとの seed を取得する
  - Then: Guide/Gate/Trace/Fix/Verify に対応した文面が返る。
- DS-03:
  - Given: built-in debug identity seed が保存される
  - When: 既存の orchestration verify を実行する
  - Then: routing/orchestration の回帰が起きない。

## Acceptance Criteria
- AC-01: built-in debug identity seed module が追加され、Guide/Gate/Worker ごとの文面を返せる。
- AC-02: `init()` で built-in profile の identity file 不足時のみ seed 保存する。
- AC-03: unit test で seed 内容を確認できる。
- AC-04: E2E で built-in profile 初回 seed を確認できる。
- AC-05: 既存の targeted orchestration verify が PASS する。

## リスク
- 既存 user identity を上書きすると運用を壊すため、`hasIdentityFiles` がある場合は絶対に保存しない。
- seed 文面が routing token と噛み合わないと debug-purpose の意図が routing に出ない。

## 未解決事項
- Q-01: built-in debug identity の内容を debug run を見ながらどう改訂していくかは次 delta とする。

# delta-apply

## Delta ID
- DR-20260306-debug-purpose-identity-seeds

## 実装ステータス
- APPLIED

## 変更ファイル
- wireframe/debug-identity-seeds.js
- wireframe/index.html
- wireframe/app.js
- tests/unit/debug-identity-seeds.test.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `wireframe/debug-identity-seeds.js` を追加し、built-in Guide/Gate/Trace/Fix/Verify 向けの locale-aware identity seed を定義した。
  - 理由: generic template ではなく debug-purpose の concrete identity を固定するため。
- AC-02:
  - 変更点: `app.js` の `init()` で `ensureBuiltInDebugPurposeIdentities()` を呼び、`hasIdentityFiles` が false の built-in profile だけ save するようにした。
  - 理由: 既存 user file を壊さずに初回 seed だけ補うため。
- AC-03:
  - 変更点: unit test で role ごとの seed 文面と null fallback を追加した。
  - 理由: seed 文面の退行を検知するため。
- AC-04:
  - 変更点: Playwright で `PalpalAgentIdentity` を stub し、起動時に 5 profile 分の built-in seed が保存されることを確認する回帰を追加した。
  - 理由: init 配線の退行を検知するため。
- AC-05:
  - 変更点: 既存の orchestration targeted verify をそのまま再実行する。
  - 理由: seed 追加で routing/orchestration が壊れていないことを確認するため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: spec/architecture の契約変更はなく、custom profile や migrate は未着手。

# delta-verify

## Delta ID
- DR-20260306-debug-purpose-identity-seeds

## 検証結果
| AC | 結果 | 根拠 |
|---|---|---|
| AC-01 | PASS | `debug-identity-seeds.js` で built-in role ごとの seed を返す。 |
| AC-02 | PASS | `init()` で built-in identity 不足時のみ save する。 |
| AC-03 | PASS | unit test で Guide/Gate/Worker seed 内容と fallback を確認した。 |
| AC-04 | PASS | Playwright で built-in 5 profile の初回 seed を確認した。 |
| AC-05 | PASS | 既存 orchestration targeted verify が継続 PASS した。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: built-in identity seed / tests / plan に限定した。

## 主要確認
- R-01: `node --check wireframe/debug-identity-seeds.js`
- R-02: `node --check wireframe/app.js`
- R-03: `node --test tests/unit/debug-identity-seeds.test.js`
- R-04: `node --check tests/e2e/workspace-layout.spec.js`
- R-05: `npx playwright test tests/e2e/workspace-layout.spec.js -g "built-in debug identities are seeded on init when missing|guide chat creates planned tasks and assigns workers|worker runtime receives structured handoff payload|event log shows routing explanations for dispatch and gate submit|job board supports gate flow"`
- R-06: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-debug-purpose-identity-seeds

## クローズ状態
- verify結果: PASS
- archive可否: 可

## 要約
- 目的: built-in debug profile の identity file を不足時 seed し、初回起動から debug routing/orchestration に使える状態へ揃える。
- 変更対象: `wireframe/debug-identity-seeds.js`, `wireframe/index.html`, `wireframe/app.js`, tests, `docs/plan.md`
- 非対象: migrate, custom profile auto seed, routing logic change, debug DB/CLI 拡張

## 反映結果
- 変更ファイル: `wireframe/debug-identity-seeds.js`, `wireframe/index.html`, `wireframe/app.js`, `tests/unit/debug-identity-seeds.test.js`, `tests/e2e/workspace-layout.spec.js`, `docs/plan.md`
- AC充足: AC-01/02/03/04/05 PASS

## 検証記録
- verify要約: syntax check + unit test + Playwright targeted verify + delta link validation PASS
- 主因メモ: なし

## 未解決事項
- built-in debug identity 文面の改善は debug run 観測後に別 delta で扱う。

## 次のdeltaへの引き継ぎ
- Seed-01: Electron 実行で発生した debug run を `palpal debug runs/show` で観測し、Guide/Gate/Worker ごとの ROLE/RUBRIC 調整点を抽出する。
