# delta-request

## Delta ID
- DR-20260308-built-in-role-sync-verify

## 目的
- Settings の `built-in 住人定義を同期` 実行時に、新しい built-in `ROLE.md / RUBRIC.md` が current workspace の identity file へ反映されることを確認する。

## 変更対象（In Scope）
- `tests/e2e/workspace-layout.spec.js`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- アプリ本体コードの変更
- built-in seed 自体の再編集
- docs 正本の仕様変更

## 受入条件（Acceptance Criteria）
- AC-01: built-in sync 後、workspace 側 identity save に最新 `ROLE.md / RUBRIC.md` が含まれることを E2E で確認できる。
- AC-02: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260308-built-in-role-sync-verify

## ステータス
- APPLIED

## 変更ファイル
- tests/e2e/workspace-layout.spec.js
- docs/plan.md

## 適用内容
- 既存の `settings can sync built-in resident definitions to workspace` E2E を拡張した。
- built-in sync 後の identity save payload に、最新 `ROLE.md / RUBRIC.md` の `Progress Voice / Progress Note Triggers / Hand-off Rules` が含まれることを確認するようにした。
- 同期後に identity editor を開き、workspace 側の `guide-core ROLE.md` に `Progress Voice / Progress Note Triggers` が反映されていることも確認するようにした。

# delta-verify

## Delta ID
- DR-20260308-built-in-role-sync-verify

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | E2E で built-in sync 後の `guide-core / gate-core / pal-alpha` 保存 payload と `guide-core ROLE.md` editor 内容を確認した。 |
| AC-02 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check tests/e2e/workspace-layout.spec.js`
- `npx playwright test --grep "settings can sync built-in resident definitions to workspace"`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260308-built-in-role-sync-verify

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- Settings の built-in 住人定義同期が、新しい `ROLE.md / RUBRIC.md` を workspace 側 identity file へ反映することを E2E で確認した。
