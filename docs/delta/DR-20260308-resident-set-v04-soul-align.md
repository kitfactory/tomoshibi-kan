# delta-request

## Delta ID
- DR-20260308-resident-set-v04-soul-align

## 目的
- `docs/tomoshibikan_resident_set_v0_4.md` に合わせて、built-in 5人 (`guide-core / gate-core / pal-alpha / pal-beta / pal-delta`) の `SOUL.md` を更新する。
- resident set v0.4 で定義された人となり・嗜好・話し方の芯を built-in seed へ反映し、Settings の built-in 同期からそのまま workspace に入れられる状態にする。

## 変更対象（In Scope）
- `wireframe/debug-identity-seeds.js` の built-in 5人分の `SOUL.md`
- `tests/unit/debug-identity-seeds.test.js` の必要最小限の期待値
- `docs/plan.md` と当該 delta 記録

## 非対象（Out of Scope）
- `ROLE.md` の構造変更
- resident set 文書自体の改稿
- routing / planning / orchestrator のロジック変更
- `agent-identity-store.js` の default template 更新

## 受入条件（Acceptance Criteria）
- AC-01: built-in 5人の `SOUL.md` が resident set v0.4 の人物像と話し方の方向に沿っている。
- AC-02: `ROLE.md` は機能的に不変で、debug harness / routing 前提を崩さない。
- AC-03: `tests/unit/debug-identity-seeds.test.js` が PASS する。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

---

# delta-apply

## Delta ID
- DR-20260308-resident-set-v04-soul-align

## ステータス
- APPLIED

## 変更ファイル
- docs/tomoshibikan_resident_set_v0_4.md
- wireframe/debug-identity-seeds.js
- tests/unit/debug-identity-seeds.test.js
- docs/plan.md

## 適用内容
- `docs/tomoshibikan_resident_set_v0_4.md` を git 管理対象へ追加した。
- `wireframe/debug-identity-seeds.js` の built-in 5人 (`guide-core / gate-core / pal-alpha / pal-beta / pal-delta`) の日本語 `SOUL.md` を resident set v0.4 準拠へ更新した。
- 変更は性格・気質・話し方の層に限定し、`ROLE.md` は変更していない。
- `tests/unit/debug-identity-seeds.test.js` の期待値を resident set v0.4 の断面へ更新した。
- `docs/plan.md` に current/archive を同期した。

## 実装メモ
- 管理人: 少し古風で受け止める話し方を強化した。
- 古参: 飄々としつつ別の面を差し出す話し方へ寄せた。
- 調べる人: 静かだが引っかかると強く口を挟む性格へ寄せた。
- 作り手: 試したくなる性格と率直な話し方を強めた。
- 書く人: 通訳役・接続役としての人格と言葉の交通整理を強めた。

---

# delta-verify

## Delta ID
- DR-20260308-resident-set-v04-soul-align

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | built-in 5人の日本語 `SOUL.md` を resident set v0.4 の性格・話し方に沿う内容へ更新した。 |
| AC-02 | PASS | `wireframe/debug-identity-seeds.js` の `ROLE/RUBRIC` は未変更で、機能的な harness 前提は維持した。 |
| AC-03 | PASS | `node --test tests/unit/debug-identity-seeds.test.js` が PASS した。 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `git status --short docs\\tomoshibikan_resident_set_v0_4.md wireframe\\debug-identity-seeds.js tests\\unit\\debug-identity-seeds.test.js docs\\plan.md docs\\delta\\DR-20260308-resident-set-v04-soul-align.md`
- `node --check wireframe/debug-identity-seeds.js`
- `node --test tests/unit/debug-identity-seeds.test.js`
- `node scripts/validate_delta_links.js --dir .`

## スコープ確認
- Out of Scope の `ROLE.md`、routing、planning、orchestrator、default template は未変更。

## Overall
- PASS

verify status: PASS

---

# delta-archive

## Delta ID
- DR-20260308-resident-set-v04-soul-align

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- resident set v0.4 を git 管理対象へ追加した。
- built-in 5人の `SOUL.md` を resident set v0.4 準拠へ同期した。
- character layer だけを厚くし、job / harness layer は保持した。
