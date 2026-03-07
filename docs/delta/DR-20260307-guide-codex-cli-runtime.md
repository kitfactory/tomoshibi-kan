# delta-request

## Delta ID
- DR-20260307-guide-codex-cli-runtime

## 目的
- Guide に `Codex` CLI tool runtime を設定した時、送信時に `guide_runtime_not_model` で落ちず実行できるようにする。
- `palpal-core` 相当の Guide 実行 I/F を CLI runtime にも持たせる最小差分として、まずは `Codex` を first-class 対象にする。

## 変更対象（In Scope）
- 対象1: `wireframe/guide-chat.js` と `wireframe/app.js` の Guide runtime state / send 経路
- 対象2: `electron-main.js` / `electron-preload.js` / `runtime/palpal-core-runtime.js` の Guide CLI runtime bridge
- 対象3: `tests/unit/guide-chat.test.js` / `tests/unit/palpal-core-runtime.test.js` / 必要最小限の E2E
- 対象4: `docs/spec.md` / `docs/architecture.md` / `docs/plan.md` / delta の最小同期

## 非対象（Out of Scope）
- 非対象1: Worker / Gate の CLI runtime 実行
- 非対象2: `OpenCode` / `ClaudeCode` の CLI runtime 実装
- 非対象3: Settings UI の大規模 redesign
- 非対象4: CLI runtime の成功率最適化や prompt tuning

## 受入条件（Acceptance Criteria）
- AC-01: Guide が `runtimeKind=tool` かつ `cliTools=["Codex"]` の時、send 前 validation で弾かれない
- AC-02: `TomoshibikanCoreRuntime.guideChat` が `runtimeKind=tool` と `toolName=Codex` を受け、Codex CLI 経由で応答を返せる
- AC-03: 既存の Guide model runtime フローを壊さない
- AC-04: unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-codex-cli-runtime

## ステータス
- APPLIED

## 変更ファイル
- runtime/cli-tool-runtime.js
- runtime/palpal-core-runtime.js
- electron-main.js
- wireframe/guide-chat.js
- wireframe/app.js
- tests/unit/cli-tool-runtime.test.js
- tests/unit/guide-chat.test.js
- tests/unit/palpal-core-runtime.test.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- Guide runtime state が `runtimeKind=tool` かつ `cliTools=["Codex"]` を ready として扱えるようにした。
- `TomoshibikanCoreRuntime.guideChat` に `runtimeKind` と `toolName` を通し、Guide だけ `Codex` CLI bridge へ委譲できるようにした。
- `runtime/cli-tool-runtime.js` を追加し、`codex exec` を使って Guide prompt / history / response schema hint を CLI へ渡す最小 adapter を実装した。
- renderer fallback は tool runtime の Guide reply 表示にも対応し、既存 model runtime は維持した。
- Guide E2E は、`blocked` 条件を「model/tool 両方未設定」に更新し、model resume は Guide を明示的に model runtime に戻して確認するよう揃えた。

# delta-verify

## Delta ID
- DR-20260307-guide-codex-cli-runtime

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `resolveGuideModelState` / renderer fallback を更新し、`guide chat accepts Codex CLI runtime` E2E で send 前 validation を通ることを確認した。 |
| AC-02 | PASS | `requestGuideChatCompletion({ runtimeKind: "tool", toolName: "Codex" })` unit と E2E stub で `TomoshibikanCoreRuntime.guideChat` が CLI bridge 入力を受けることを確認した。 |
| AC-03 | PASS | 既存 model runtime の unit と `guide chat resumes after registering model in settings` E2E が PASS した。 |
| AC-04 | PASS | targeted unit / targeted E2E / `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check runtime/cli-tool-runtime.js`
- `node --check runtime/palpal-core-runtime.js`
- `node --check electron-main.js`
- `node --check wireframe/guide-chat.js`
- `node --check wireframe/app.js`
- `node --check tests/unit/cli-tool-runtime.test.js`
- `node --check tests/unit/guide-chat.test.js`
- `node --check tests/unit/palpal-core-runtime.test.js`
- `node --check tests/e2e/workspace-layout.spec.js`
- `node --test tests/unit/cli-tool-runtime.test.js tests/unit/guide-chat.test.js tests/unit/palpal-core-runtime.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat is blocked when guide model is not configured|guide chat resumes after registering model in settings|guide chat accepts Codex CLI runtime|pal list includes roles and allows name/model/tool settings"`
- `node scripts/validate_delta_links.js --dir .`

## 既知事項
- first step では `Guide + Codex` だけを対象にしている。Worker / Gate の CLI runtime は今回の scope 外。
- CLI runtime の structured output は強い保証ではないため、Guide の `plan_ready` 採用条件は parser / repair / validate を通った valid object に固定している。
- CLI tool の capability summary は routing/context 用であり、実行時に CLI tool へ skill/tool を動的注入するものではない。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-codex-cli-runtime

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- Guide は `Codex` を tool runtime として実行できるようになり、send 前 validation でも弾かれなくなった。
- `TomoshibikanCoreRuntime.guideChat` は model/runtimeKind/toolName を受け取る単一 I/F を維持したまま、Guide + Codex の CLI bridge を持つようになった。
- CLI runtime では capability summary を判断材料として使う一方、skill/tool の動的注入は行わず、structured output は hint 扱いに留める前提を spec / architecture に明記した。
