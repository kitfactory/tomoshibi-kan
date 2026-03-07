# delta-request

## Delta ID
- DR-20260307-resident-facing-ui-labels

## 目的
- ユーザーに見える UI の `Pal` 表記を `住人` へ寄せる。
- 技術/設計用語の `worker` や既存 ID は変えず、まずは表示ラベルと初期名だけを揃える。

## 変更対象（In Scope）
- 対象1: `wireframe/index.html` の tab / panel / modal title
- 対象2: `wireframe/app.js` の user-facing label / 初期 display name / fallback role label
- 対象3: `tests/e2e/workspace-layout.spec.js` の visible text expectation
- 対象4: `docs/concept.md` / `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` の最小同期

## 非対象（Out of Scope）
- 非対象1: `Pal -> Worker` の repo-wide rename
- 非対象2: variable / function / file 名の rename
- 非対象3: worldbuilding 本文の大規模修正
- 非対象4: 既存 workspace 保存済み profile の migration

## 受入条件（Acceptance Criteria）
- AC-01: UI 上の主要ラベルが `Pal List` / `Pal Settings` / `Add Pal` ではなく `住人` 系に置き換わる
- AC-02: 初期 fallback 名が `New Pal` / `Pal 1` ではなく `新しい住人` / `住人 1` へ変わる
- AC-03: 既存機能と E2E を壊さない
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## 実施内容
- `wireframe/index.html` の主要 visible label を `住人一覧` / `住人設定` へ更新した
- `wireframe/app.js` の user-facing label、fallback display name、skill hint を `住人` 基準へ更新した
- `wireframe/pal-profile.js` の worker fallback 名を `新しい住人` へ更新した
- `tests/e2e/workspace-layout.spec.js` の visible text expectation を新ラベルに同期した
- `docs/concept.md` / `docs/spec.md` / `docs/plan.md` を最小同期した

# delta-verify

## 実行結果
- AC-01: PASS
  - `住人一覧` / `住人設定` / `住人を追加` の visible label へ置換した
- AC-02: PASS
  - worker fallback 名は `新しい住人` へ更新した
- AC-03: PASS
  - `npx playwright test tests/e2e/workspace-layout.spec.js -g "pal list includes roles and allows name/model/tool settings|pal list supports add and delete profile|identity files can be edited from pal settings modal"` PASS
- AC-04: PASS
  - `node --check wireframe/app.js` PASS
  - `node --check wireframe/pal-profile.js` PASS
  - `node --check tests/e2e/workspace-layout.spec.js` PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 所見
- `Worker Pal` は system prompt の内部文言であり、user-facing label ではないため scope 外として維持した
- Out of Scope の variable / function / file 名 rename には手を付けていない
- verify result: PASS

# delta-archive

## archive
- PASS
- UI の主要 `Pal` 表記を `住人` に寄せ、worker の技術用語と分離した
