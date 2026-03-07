# delta-request

## Delta ID
- DR-20260306-orchestration-debug-db-minimal

## 目的
- orchestration がうまくいくかを改善前に追跡するため、最小の debug DB を既存 `settings.sqlite` に追加し、Guide/Worker/Gate の runtime I/O を保存する。

## 変更対象範囲 (In Scope)
- `runtime/settings-store.js` に orchestration debug table と append/list API を追加する。
- `electron-main.js` に Guide/Worker/Gate runtime request/response の sanitized record 保存を追加する。
- `electron-preload.js` に debug run の読み出し API を追加する。
- `wireframe/app.js` に debugMeta 付与を追加する。
- `tests/unit/settings-store.test.js` に debug table の unit test を追加する。
- `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` に最小同期する。

## 変更対象外 (Out of Scope)
- debug record の UI 表示
- 学習用データ抽出
- ROLE/RUBRIC 改訂支援 UI
- 別 DB ファイルの導入

## 受入条件
- DS-01:
  - Given: Guide/Worker/Gate runtime が実行される
  - When: Electron main が runtime request/response を処理する
  - Then: `settings.sqlite` に sanitized debug record が追加される
- DS-02:
  - Given: debug record を保存する
  - When: record を読み出す
  - Then: `input_json`, `output_json`, `meta_json` を object として取得できる
- DS-03:
  - Given: debug record へ secret が含まれうる runtime payload
  - When: record を保存する
  - Then: API_KEY は保存しない

## Acceptance Criteria
- AC-01: `orchestration_debug_runs` table が既存 `settings.sqlite` に追加される。
- AC-02: Guide/Worker/Gate runtime 呼び出しが sanitized debug record を保存する。
- AC-03: unit test で append/list の往復が PASS する。
- AC-04: spec/architecture/plan への同期は最小差分に留まる。

## リスク
- runtime payload をそのまま保存すると record が肥大化するため、sanitization を main で固定する必要がある。
- debug record が増え続ける retention 設計は今回は未対応。

## 未解決事項
- Q-01: retention / pruning は別 delta とする。
- Q-02: debug UI を付けるかは orchestration の手応え確認後に判断する。

# delta-apply

## Delta ID
- DR-20260306-orchestration-debug-db-minimal

## 実装ステータス
- APPLIED

## 変更ファイル
- runtime/settings-store.js
- electron-main.js
- electron-preload.js
- wireframe/app.js
- tests/unit/settings-store.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- AC-01:
  - 変更点: `settings.sqlite` に `orchestration_debug_runs` table と index、append/list API を追加した。
  - 理由: 追加インストールなしで debug record を残すため。
- AC-02:
  - 変更点: Electron main の `guide:chat` / `pal:chat` handler で sanitized record を保存するようにした。
  - 理由: runtime request/response を一元的に記録するため。
- AC-03:
  - 変更点: Renderer は `debugMeta` を payload に付与し、Guide/Worker/Gate の role/context/version を main 側へ渡すようにした。
  - 理由: 将来の ROLE/RUBRIC 見直しに必要な最小メタデータを持たせるため。
- AC-04:
  - 変更点: spec/architecture/plan に最小同期した。
  - 理由: debug DB の責務と保存境界を正本へ反映するため。

## Out of Scope 確認
- Out of Scope への変更なし: Yes
- 補足: UI、分析、retention は今回未実装。

# delta-verify

## Delta ID
- DR-20260306-orchestration-debug-db-minimal

## 検証結果
| AC | 判定 | 理由 |
|---|---|---|
| AC-01 | PASS | `runtime/settings-store.js` に table と append/list API を追加した。 |
| AC-02 | PASS | `electron-main.js` と `wireframe/app.js` で Guide/Worker/Gate の debug record 保存経路を接続した。 |
| AC-03 | PASS | `tests/unit/settings-store.test.js` で append/list 往復を検証した。 |
| AC-04 | PASS | spec/architecture/plan への同期は最小差分に留めた。 |

## スコープ整合チェック
- Out of Scope 変更の有無: No
- 整合メモ: 実装は DB/API/renderer metadata/test/docs の最小範囲に限定した。

## 主な確認コマンド
- R-01: `node --check runtime/settings-store.js`
- R-02: `node --check electron-main.js`
- R-03: `node --check electron-preload.js`
- R-04: `node --check wireframe/app.js`
- R-05: `node --test tests/unit/settings-store.test.js`
- R-06: `node scripts/validate_delta_links.js --dir .`

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260306-orchestration-debug-db-minimal

## クローズ状態
- verify判定: PASS
- archive可否: 可

## 要約
- 目的: orchestration debug 用の最小 DB を既存 `settings.sqlite` に追加する。
- 変更対象範囲: settings-store, electron-main, preload, app, unit test, spec/architecture/plan
- 変更対象外: UI、分析、retention、学習フロー

## 実装結果
- 変更ファイル: `runtime/settings-store.js`, `electron-main.js`, `electron-preload.js`, `wireframe/app.js`, `tests/unit/settings-store.test.js`, `docs/spec.md`, `docs/architecture.md`, `docs/plan.md`
- AC達成状況: AC-01/02/03/04 PASS

## 検証要約
- verify結果: syntax check + settings-store unit test + delta link validation PASS

## 未解決事項
- retention/pruning は未実装
- debug record の UI 表示は未実装

## 次のdeltaへの引き継ぎ
- Seed-01: orchestration が回り始めたら、debug record を見ながら ROLE/RUBRIC 改訂支援へ進む。
