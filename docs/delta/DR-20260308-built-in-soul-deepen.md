# delta-request

## Delta ID
- DR-20260308-built-in-soul-deepen

## 目的
- built-in 6人の `SOUL.md` を resident set / worldbuilding に沿って厚くし、管理人・古参・住人たちのキャラクター性を明確にする。
- `ROLE.md` や routing/harness を壊さず、Settings の built-in 同期からそのまま workspace へ反映できる seed を整える。

## 変更対象（In Scope）
- `wireframe/debug-identity-seeds.js` の built-in 6人分の `SOUL.md`
- `tests/unit/debug-identity-seeds.test.js` の必要最小限の期待値
- `docs/plan.md` と当該 delta の記録

## 非対象（Out of Scope）
- `ROLE.md` の構造変更
- routing / planning / orchestrator のロジック変更
- `agent-identity-store.js` の default template 更新
- UI / Settings の追加変更

## 受入条件（Acceptance Criteria）
- AC-01: built-in 6人 (`guide-core / gate-core / pal-alpha / pal-beta / pal-gamma / pal-delta`) の `SOUL.md` が以前より厚くなり、resident set に沿うキャラクター性を持つ。
- AC-02: `ROLE.md` は機能的に不変で、debug harness や routing 前提を崩さない。
- AC-03: `tests/unit/debug-identity-seeds.test.js` が PASS する。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-built-in-soul-deepen

## ステータス
- APPLIED

## 変更ファイル
- wireframe/debug-identity-seeds.js
- tests/unit/debug-identity-seeds.test.js
- docs/plan.md

## 適用内容
- built-in 6人分の `SOUL.md` を resident set / worldbuilding に沿って厚くし、管理人・古参・住人たちの人となりと大切にすることを追記した。
- `ROLE.md` は変更せず、routing / debug harness に効く機能的な役割定義は維持した。
- unit test に `SOUL.md` の厚みを示す代表的な文言断面を追加した。

# delta-verify

## Delta ID
- DR-20260308-built-in-soul-deepen

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `guide-core / gate-core / pal-alpha / pal-beta / pal-gamma / pal-delta` すべての `SOUL.md` に `人となり` や `大切にすること` を追加し、resident set のキャラクター性を厚くした。 |
| AC-02 | PASS | `ROLE.md` は未変更で、built-in の機能的な役割定義を維持した。 |
| AC-03 | PASS | `node --test tests/unit/debug-identity-seeds.test.js` が PASS した。 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check wireframe/debug-identity-seeds.js`
- `node --test tests/unit/debug-identity-seeds.test.js`
- `node scripts/validate_delta_links.js --dir .`

## 既知事項
- この delta は built-in seed の `SOUL.md` のみを対象としており、default template や既存 workspace の identity 実体は Settings の built-in 同期を実行した時に更新される。
- `ROLE.md` と routing ロジックは scope 外のため未変更。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-built-in-soul-deepen

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- built-in 6人の `SOUL.md` を resident set / worldbuilding に沿って厚くし、住人ごとの気配と価値観が見える seed に更新した。
- `ROLE.md` や routing/harness はそのまま維持し、キャラクター性だけを安全に強めた。
