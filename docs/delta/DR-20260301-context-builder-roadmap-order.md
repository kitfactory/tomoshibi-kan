# delta-request

## Delta ID
- DR-20260301-context-builder-roadmap-order

## 目的
- これまでの議論を、実装可能な順序で `plan` に落とし込む。
- 次サイクルの seed を明確化し、Context Builder 実装の入口を固定する。

## In Scope
- `docs/plan.md` に、次サイクル用の順序付き seed を追加する。
- 本 delta で追加した seed の意図と順序を記録する。

## Out of Scope
- アプリコード（`wireframe/` / `runtime/` / `electron-*`）の変更。
- OpenClaw 互換ローダーや Context Builder 本体の実装。

## Acceptance Criteria
- AC-01: `docs/plan.md` に、次サイクルの seed が実行順で追加されている。
- AC-02: seed は以下の論点を含む。
  - ws-root 既定値と単一ルート構成（`.palpal` 分離）
  - Pal ごとの Markdown フォルダ契約（`USER.md` は上位）
  - Context Builder 仕様（入力ソース/優先度/予算/監査）
  - Guide 経路への段階導入
  - Gate/Worker への展開
- AC-03: `node scripts/validate_delta_links.js --dir .` が PASS。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- docs/plan.md
- docs/delta/DR-20260301-context-builder-roadmap-order.md

## AC 対応
- AC-01:
  - `docs/plan.md` 末尾に `# current` ブロックを追加し、順序付き seed を追記。
- AC-02:
  - seed 名称に議論済み論点（ws-root / markdown 契約 / context builder / rollout）を反映。
- AC-03:
  - validate コマンドを実行して整合を確認。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/plan.md` に順序付き seed を追加 |
| AC-02 | PASS | 5論点を seed 項目に反映 |
| AC-03 | PASS | `node scripts/validate_delta_links.js --dir .` 実行 |

## 実行コマンド
- `node scripts/validate_delta_links.js --dir .`

# delta-archive

## クローズ
- verify result: PASS
- archive: 完了

## 要約
- Context Builder 実装に向けた次サイクル順序を `plan` に固定した。
- 実装差分は含まず、要件整理と進行順の定義のみを確定した。
