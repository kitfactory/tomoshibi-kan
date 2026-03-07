# delta-request

## Delta ID
- DR-20260306-guide-gate-multi-profile-impl

## Purpose
- Guide/Gate を複数 profile として追加・選択できるプロトタイプ実装を入れ、Guide Chat は active guide を実際の解決先として使う。

## In Scope
- `runtime/agent-identity-store.js` の Guide/Gate directory contract を `guides/<agentId>` / `gates/<agentId>` へ変更し、Guide/Gate でも `agentId` 必須にする
- `wireframe/pal-profile.js` に Guide/Gate/Worker 共通 profile 作成・selection 解決ロジックを追加する
- `wireframe/guide-chat.js` を active guide selection 対応にする
- `wireframe/app.js` に profile snapshot（localStorage）と `activeGuideId` / `defaultGateId` の保存・復元を追加する
- `wireframe/app.js` の Pal List に `Guide追加 / Gate追加 / Pal追加` と `active guide / default gate` 切替 UI を追加する
- `wireframe/app.js` の Agent Identity 初期化を `Guide/Gate/Worker` 全 role で `agentId` 付き保存にする
- `tests/unit/**` と `tests/e2e/workspace-layout.spec.js` を更新し、複数 Guide/Gate と selection を検証する
- `docs/plan.md` とこの delta を request/apply/verify/archive で閉じる

## Out of Scope
- Task/Job ごとの `gateProfileId` override UI
- SQLite への profile snapshot 永続化
- Gate runtime 実行で `defaultGateId` を実際の審査ロジックへ接続すること
- 既存 workspace の disk migration

## Acceptance Criteria
- AC-01: Agent Identity の save/load は Guide/Gate/Worker すべて `agentId` を受け、Guide/Gate は `guides/<agentId>` / `gates/<agentId>` に保存される
- AC-02: Pal List から Guide/Gate/Worker を追加でき、Guide/Gate 追加時も locale 別 template 初期化が走る
- AC-03: active guide / default gate を Pal List から切り替えでき、selection state は localStorage snapshot に保存・復元される
- AC-04: Guide Chat の model/skill 解決は active guide に紐づく
- AC-05: `node --test` の対象 unit と対象 Playwright が PASS する
- AC-06: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- localStorage snapshot を Settings 保存と分離したため、将来 SQLite 永続化へ切り替える際に移行 delta が別途必要
- Gate selection は今回 UI/state までで、runtime 実行接続は次の delta に残る

## Open Questions
- `defaultGateId` を Task/Job ごとの初期値へいつ接続するかは次の runtime delta で決める

# delta-apply

## status
- APPLIED

## changed files
- runtime/agent-identity-store.js
- wireframe/pal-profile.js
- wireframe/guide-chat.js
- wireframe/app.js
- tests/unit/agent-identity-store.test.js
- tests/unit/guide-chat.test.js
- tests/unit/pal-profile.test.js
- tests/e2e/workspace-layout.spec.js
- docs/plan.md
- docs/delta/DR-20260306-guide-gate-multi-profile-impl.md

## applied AC
- AC-01: Agent Identity path contract を plural directory + role 共通 `agentId` 必須へ変更した
- AC-02: Pal List に `Guide追加 / Gate追加 / Pal追加` を追加し、各 role の template init を `agentId` 付きで呼ぶようにした
- AC-03: `palpal-hive.agent-profiles.v1` snapshot に `profiles / activeGuideId / defaultGateId` を保存・復元するようにした
- AC-04: `GuideChatModel` と app fallback の guide 解決を active guide selection 対応にした
- AC-05: unit/E2E を追加・更新した
- AC-06: plan と delta 記録を追加した

## scope deviation
- Out of Scope への変更: No
- 補足: `defaultGateId` は Gate panel の state attribute まで反映し、runtime 審査ロジックへの接続は行っていない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `tests/unit/agent-identity-store.test.js` で plural path / Guide agentId 必須を検証 |
| AC-02 | PASS | `tests/e2e/workspace-layout.spec.js` の `guide and gate add initialize role-aware identity templates` が PASS |
| AC-03 | PASS | `tests/e2e/workspace-layout.spec.js` の `guide and gate profiles can be added and selected` が reload 後も PASS |
| AC-04 | PASS | `tests/unit/guide-chat.test.js` の active guide selection ケースが PASS |
| AC-05 | PASS | `node --test tests/unit/agent-identity-store.test.js`, `node --test tests/unit/guide-chat.test.js`, `node --test tests/unit/pal-profile.test.js`, `npx playwright test tests/e2e/workspace-layout.spec.js -g \"guide chat is blocked when guide model is not configured|guide chat resumes after registering model in settings|newly added model is immediately available in pal tab|pal list includes roles and allows name/model/tool settings|pal runtime save is blocked when tool target is not available|pal list supports add and delete profile|guide and gate profiles can be added and selected|pal add initializes localized SOUL and ROLE templates|guide and gate add initialize role-aware identity templates\"` が PASS |
| AC-06 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- 確認: Task/Job gate override、SQLite 永続化、Gate runtime 接続は未変更

## residual risks
- R-01: `defaultGateId` は UI/state のみで、Task/Job 実行経路の既定 Gate 反映は未着手
- R-02: profile snapshot は localStorage のため Electron 永続化との差分が残る

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - `defaultGateId` を Task/Job execution / gate runtime へ接続する次 delta が必要
  - profile snapshot を SQLite 系永続化へ寄せるかは別 delta で判断する
