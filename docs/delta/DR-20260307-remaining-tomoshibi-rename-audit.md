# delta-request

## Delta ID
- DR-20260307-remaining-tomoshibi-rename-audit

## 背景
- first-party rename は `Tomoshibi-kan` 基準へ一巡したが、current code/docs にはまだ `pal/palpal` 系の内部識別子と、`Pal / Guide / Gate` の用語揺れが残っている。
- `Pal / Guide / Gate` は単純な文字列置換ではなく、Execution Loop と UI の概念名に関わるため、rename 実装前に残件 inventory と target terminology を固定する必要がある。

## In Scope
- current code/docs（歴史的 archive を除く）に残る `pal/palpal` 系 first-party 識別子を棚卸しし、次の rename 対象をカテゴリ化する。
- `Pal / Guide / Gate` の現行使われ方を整理し、何を維持し、何を見直すべきかを方針としてまとめる。
- 次に切る delta を、`safe rename` と `concept rename` に分離できる状態まで整理する。
- `docs/plan.md` と当該 delta を archive まで閉じる。

## Out of Scope
- 実際の rename 実装
- `concept/spec/architecture` への用語変更反映
- 依存名 `palpal-core` の変更
- file/module の物理 rename

## Acceptance Criteria
- AC-01: current code/docs に残る `pal/palpal` 系 first-party 識別子がカテゴリ別に整理されている。
- AC-02: `Pal / Guide / Gate` について、維持候補と変更候補、および推奨方針が明文化されている。
- AC-03: 次に切る rename delta を 2 系統以上に分離できる状態になっている。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-remaining-tomoshibi-rename-audit

## ステータス
- APPLIED

## 棚卸し結果

### 1. safe rename 対象（概念変更なしで進められる）
- bridge / global alias
  - `PalpalSettingsStorage`, `PalpalAgentIdentity`, `PalpalRuntimeConfig`
  - `PalpalCoreRuntime`, `PalpalDebugRuns`, `PalpalProjectDialog`, `PalpalExternal`
  - `PALPAL_CORE_PROVIDERS`, `PALPAL_CORE_MODELS`
- IPC / registry / helper 識別子
  - `palpal-core:list-provider-models`
  - `PALPAL_CORE_PROVIDER_REGISTRY`, `PALPAL_CORE_MODEL_REGISTRY`
  - `resolvePalpalCoreModels`, `resolvePalpalCoreRuntimeApi`, `hasPalpalCoreRuntimeApi`
- env / temp / test fixture / legacy path でまだ残る `PALPAL_*` / `palpal-*`
  - 互換 fallback を除いた first-class 側の表記
- package / test / script 表記
  - `palpal-cli.test.js`
  - `palpal-core-runtime.test.js`
  - `palpal-agent-identity-*`, `palpal-settings-*` などの temp prefix

### 2. compatibility として残すべきもの
- `palpal-core`
  - 外部依存名なので即変更対象ではない。
- 旧 `PALPAL_*` env / `Palpal*` bridge alias
  - 既存環境移行用 fallback として、当面は併存が妥当。
- 旧 `.palpal`
  - workspace migration fallback として残す価値がある。

### 3. 概念変更を伴う要判断項目
- `Pal`
  - 現在は worker role を指す場面と、`Guide / Gate / Pal` を並べた総称 UI の場面が混在している。
  - `Guide / Gate / Pal` の並びでは `Pal` だけ意味の粒度が違い、Execution Loop の説明でも曖昧になりやすい。
- `Guide`
  - 対話主体として意味が明確で、現時点では変更優先度は低い。
- `Gate`
  - 評価主体として意味が明確で、`RUBRIC.md` 契約とも整合している。変更優先度は低い。

## 推奨方針
- ドメインの総称は `Agent` に寄せる。
- role 名は `Guide / Worker / Gate` を推奨する。
- `Pal` はブランド的な愛称としては残してよいが、Execution Loop / spec / architecture / debug / runtime などの core term には使わない。
- したがって、次の rename は次の 2 系統に分ける。
  1. technical safe rename
     - `pal/palpal` first-party 識別子を `tomoshibi*` へ寄せる。
  2. concept rename
     - `Pal` を core term から外し、`Worker` と `Agent` に整理する。

## 次の delta 候補
- DR-20260307-technical-identifier-rename-tomoshibi
  - safe rename のみ。互換 alias/fallback は維持。
- DR-20260307-agent-role-terminology-worker-agent
  - `Pal` 用語を `Worker` / `Agent` に整理し、`Guide / Gate` は維持する。

# delta-verify

## Delta ID
- DR-20260307-remaining-tomoshibi-rename-audit

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | current code/docs から `pal/palpal` 系残件を safe rename / compatibility / decision-needed に分けて整理した。 |
| AC-02 | PASS | `Pal / Guide / Gate` の現状整理と、`Agent / Worker / Guide / Gate` への推奨方針を明記した。 |
| AC-03 | PASS | 次の delta を `technical safe rename` と `concept rename` の 2 系統に分離した。 |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## 実行コマンド
- `rg -n "\\bpalpal\\b|Palpal|PALPAL|\\bPal\\b|\\bGuide\\b|\\bGate\\b" docs runtime wireframe cli tests package.json electron-main.js electron-preload.js -g "!docs/delta/**" -g "!docs/plan.md"`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-remaining-tomoshibi-rename-audit

## クローズ条件
- verify 判定: PASS
- archive 判定: 実施済み

archive status: PASS

## まとめ
- 残っている `pal/palpal` は、safe rename で進められる技術識別子と、互換のため残す識別子、概念再設計が必要な用語に分けられた。
- 概念上の主論点は `Pal` であり、`Guide / Gate` は現状維持、`Pal` は core term から外して `Worker` / `Agent` に整理するのが妥当と判断した。
