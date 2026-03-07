# delta-request

## Delta ID
- DR-20260301-pal-markdown-contract

## 目的
- Pal(Guide/Gate/Worker) ごとのフォルダ契約を仕様として固定する。
- `USER.md` を Pal 個別フォルダの上位（ws-root 直下）に置くルールを明文化する。

## In Scope
- `docs/spec.md` に workspace フォルダ契約を追記する。
- `docs/architecture.md` に path resolver と保存責務の境界を追記する。
- `docs/plan.md` の seed 完了と archive 追記。

## Out of Scope
- 実際の `USER.md` / `SOUL.md` ロード実装。
- Context Builder 本体の実装。
- UI 変更。

## Acceptance Criteria
- AC-01: `docs/spec.md` に ws-root 既定値とフォルダ構造が追記されている。
- AC-02: `docs/spec.md` に `USER.md` 上位配置と `.palpal` 非Git/機密分離ルールが追記されている。
- AC-03: `docs/architecture.md` に resolver・保存責務・読み取り責務が追記されている。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-pal-markdown-contract.md

## AC 対応
- AC-01:
  - `docs/spec.md` 末尾に「Pal Workspace フォルダ契約」を追記。
  - OS 別 ws-root 既定値と標準ディレクトリ構造を定義。
- AC-02:
  - `USER.md` 上位配置、`.palpal` 機密分離、Git 管理境界を明記。
- AC-03:
  - `docs/architecture.md` に Resolver と Repository/SecretStore の責務を追記。
- AC-04:
  - delta links validator 実行。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `docs/spec.md` に ws-root 既定値・構造追記 |
| AC-02 | PASS | `USER.md` 上位配置、`.palpal` 非Git/機密分離を追記 |
| AC-03 | PASS | `docs/architecture.md` に resolver/責務を追記 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` 実行 |

## 実行コマンド
- `node scripts/validate_delta_links.js --dir .`

# delta-archive

## クローズ
- verify result: PASS
- archive: 完了

## 要約
- Pal ごとの Markdown 管理契約と、`USER.md` 上位配置ルールを文書化した。
- `.palpal` を内部領域として分離する設計意図を spec/architecture に同期した。
