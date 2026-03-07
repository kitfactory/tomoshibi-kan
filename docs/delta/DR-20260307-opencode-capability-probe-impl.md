# delta-request

## Delta ID
- DR-20260307-opencode-capability-probe-impl

## Goal
- `OpenCode` の CLI 能力を `Codex` と同じ capability snapshot 枠で取得できるようにする。
- settings persistence と tool runtime routing/context は既存配線を再利用し、probe 本体と unit/docs だけを追加する。

## In Scope
- `runtime/cli-tool-capability-probe.js` に `OpenCode` probe を追加する。
- `OpenCode` の command / agent / skill / MCP / built-in tool を capability と summary に落とす。
- unit test を追加する。
- `spec.md` / `architecture.md` / `plan.md` / delta を最小同期する。

## Out of Scope
- `OpenCode` 用の新 UI
- `OpenCode` skill の恒久導入
- app runtime の redesign
- commit / push

## Acceptance Criteria
- AC-01: `probeCliToolCapabilities(["OpenCode"])` が `OpenCode` snapshot を返せる。
- AC-02: `OpenCode` snapshot に command / agent / skill / MCP / built-in tool の少なくとも一部が入る。
- AC-03: unit test で `OpenCode` probe の parser と snapshot 生成を固定できる。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-opencode-capability-probe-impl

## ステータス
- APPLIED

## 変更ファイル
- `runtime/cli-tool-capability-probe.js`
- `tests/unit/cli-tool-capability-probe.test.js`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`

## 適用内容
- `OpenCode` 用 parser を追加した。
  - top-level commands
  - agent list
  - installed skills
  - MCP list
  - `debug agent build` 由来の built-in tools
- `probeOpenCodeCli()` を追加し、`probeCliToolCapabilities()` から `OpenCode` を first-class に扱うよう更新した。
- `buildCapabilitySummaries()` を拡張し、agent / skill / built-in tool summary も routing/context へ渡せるようにした。
- unit test を追加した。
- docs の CLI capability probe 説明を `Codex + OpenCode` へ更新した。

# delta-verify

## Delta ID
- DR-20260307-opencode-capability-probe-impl

## 受入条件検証
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | `probeCliToolCapabilities(['OpenCode'])` 実行で `OpenCode|available|39|39` を確認した |
| AC-02 | PASS | snapshot に command / agent / skill / built-in tool capability が入ることを unit / 実機 probe で確認した |
| AC-03 | PASS | `tests/unit/cli-tool-capability-probe.test.js` に parser / snapshot 生成テストを追加し PASS |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS |

## 検証コマンド
- `node --check runtime/cli-tool-capability-probe.js`
- `node --test tests/unit/cli-tool-capability-probe.test.js tests/unit/settings-store.test.js tests/unit/settings-persistence.test.js tests/unit/agent-skill-resolver.test.js tests/unit/agent-routing.test.js`
- `node -e "const { probeCliToolCapabilities } = require('./runtime/cli-tool-capability-probe'); probeCliToolCapabilities(['OpenCode']).then((snapshots)=>{ const snapshot=snapshots[0]; if(!snapshot || snapshot.toolName!=='OpenCode') process.exit(1); console.log([snapshot.toolName,snapshot.status,snapshot.capabilities.length,snapshot.capabilitySummaries.length].join('|')); }).catch((error)=>{ console.error(error); process.exit(1); });"`
- `node scripts/validate_delta_links.js --dir .`

## 実機所見
- 実 probe では `OpenCode|available|39|39`
- 現環境では skill 0 件でも、agent / command / built-in tool だけで十分な capability summary が得られる
- `OpenCode` の `--help` は遅いことがあるため、probe は `stdout` が得られれば利用可能扱いにしている

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-opencode-capability-probe-impl

## クローズ判定
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- `OpenCode` を既存 CLI capability probe 枠へ追加した
- settings persistence / tool runtime routing/context は既存配線のままで `OpenCode` snapshot を利用できる
