# delta-request

## Delta ID
- DR-20260307-cli-tool-capability-probe

## 背景
- 現状の `tool` runtime は `skills=[]` として扱われ、CLIツールが内包する command / MCP / feature の能力が routing や context に一切反映されていない。
- その結果、CLIツールを runtime とする agent は「何ができるか」を Guide / Orchestrator が理解できず、適切な task 割当が難しい。
- まずは `Codex` を first-class 対象として、CLI へ実際に問い合わせた capability snapshot を保存し、tool runtime の routing/context へ反映したい。

## In Scope
- `Codex` CLI に対する capability probe を追加し、`--help` / `mcp list` / `features list` 由来の snapshot を取得する。
- settings 保存/読込に `registeredToolCapabilities` を追加し、`registeredTools` と一緒に persistence する。
- `tool` runtime の agent でも capability summary を routing/context へ渡せるようにする。
- Settings save 時に tool capability probe を実行し、保存結果に capability snapshot を含める。
- unit test と必要最小限の docs/plan 同期を行う。

## Out of Scope
- `Codex` 以外の CLI ツールの詳細 probe 実装
- arbitrary CLI 汎用プラグイン機構
- tool runtime の実行フロー自体の redesign
- UI 上の capability detail viewer / manual refresh button
- `Pal / Guide / Gate` の名称見直し

## Acceptance Criteria
- AC-01: `Codex` probe が command / MCP / feature 情報を含む capability snapshot を返す。
- AC-02: settings load/save で `registeredToolCapabilities` が保持される。
- AC-03: `tool` runtime の agent でも capability summary が routing/context へ渡る。
- AC-04: routing 単体テストで `Codex` capability summary を持つ tool runtime worker が task 語彙に反応できる。
- AC-05: 対象 unit test と `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-cli-tool-capability-probe

## ステータス
- APPLIED

## 変更ファイル
- runtime/cli-tool-capability-probe.js
- runtime/settings-store.js
- electron-main.js
- wireframe/settings-persistence.js
- wireframe/agent-skill-resolver.js
- wireframe/app.js
- tests/unit/cli-tool-capability-probe.test.js
- tests/unit/settings-store.test.js
- tests/unit/settings-persistence.test.js
- tests/unit/agent-skill-resolver.test.js
- tests/unit/agent-routing.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- `Codex` CLI へ `--help` / `mcp list` / `features list` / `--version` を問い合わせる capability probe を追加した。
- settings persistence に `registeredToolCapabilities[]` を追加し、tool name・status・capabilities・capability summaries を保持するようにした。
- Electron main の Settings load/save で CLI capability probe を補完し、renderer へ snapshot を返すようにした。
- `tool` runtime の agent でも capability summary を routing/context に流せるよう、resolver と app fallback を更新した。
- routing 単体テストへ、`Codex` capability summary を使う tool runtime worker の選定ケースを追加した。

# delta-verify

## Delta ID
- DR-20260307-cli-tool-capability-probe

## 検証結果
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `probeCodexCli()` 実行で `Codex|available|59|26` を確認し、unit でも command / MCP / feature 抽出を固定した。 |
| AC-02 | PASS | `settings-store` / `settings-persistence` unit で `registeredToolCapabilities` の save/load/snapshot を確認した。 |
| AC-03 | PASS | `agent-skill-resolver` と `wireframe/app.js` で tool runtime 時に capability summary を context/routing 入力へ流すよう更新した。 |
| AC-04 | PASS | `tests/unit/agent-routing.test.js` で `codex review` summary を持つ tool runtime worker への routing を確認した。 |
| AC-05 | PASS | 対象 unit test 一式と `node scripts/validate_delta_links.js --dir .` が PASS した。 |

## 実行コマンド
- `node --check runtime/cli-tool-capability-probe.js`
- `node --check runtime/settings-store.js`
- `node --check electron-main.js`
- `node --check wireframe/agent-skill-resolver.js`
- `node --check wireframe/settings-persistence.js`
- `node --check wireframe/app.js`
- `node --test tests/unit/cli-tool-capability-probe.test.js tests/unit/settings-store.test.js tests/unit/settings-persistence.test.js tests/unit/agent-skill-resolver.test.js tests/unit/agent-routing.test.js tests/unit/runtime-validation.test.js tests/unit/pal-profile.test.js tests/unit/guide-chat.test.js`
- `node -e "const { probeCodexCli } = require('./runtime/cli-tool-capability-probe'); probeCodexCli().then((snapshot)=>{ if (!snapshot || snapshot.toolName !== 'Codex') process.exit(1); console.log(snapshot.toolName + '|' + snapshot.status + '|' + snapshot.capabilities.length + '|' + snapshot.capabilitySummaries.length); }).catch((error)=>{ console.error(error); process.exit(1); });"`
- `node scripts/validate_delta_links.js --dir .`

## 既知事項
- 既存 E2E の一部は、日本語 UI 文字化けによる期待値不一致で FAIL した。今回の delta では CLI capability probe の実装に閉じ、既存 UI 文言回帰は修正対象に含めていない。
- `Codex` 以外の CLI ツール (`ClaudeCode`, `OpenCode`) は probe 未実装のため、status=`unavailable` として保持する。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-cli-tool-capability-probe

## クローズ条件
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- `Codex` first-class の CLI capability probe を追加し、Settings load/save で snapshot を保持するようにした。
- `tool` runtime の agent でも capability summaries を routing/context に流せるようになり、CLIツールの内包能力を割当判断へ反映できるようにした。
