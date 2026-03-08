# Delta Request: DR-20260308-guide-builtin-soul-soften

## Delta Type
FEATURE

## In Scope
- built-in `guide-core` の `SOUL.md` を、傾聴寄り・ふんわりした表現へ更新する
- 新規 Guide テンプレートの `SOUL.md` も同じ方向へ更新する
- 変更に追随する unit test を最小更新する

## Out of Scope
- `ROLE.md` の変更
- routing / orchestrator / progress voice の変更
- built-in 以外の resident `SOUL.md` 変更

## Acceptance Criteria
- `guide-core` の built-in `SOUL.md` が、傾聴寄りでふんわりした語りに更新される
- 新規 Guide テンプレートの `SOUL.md` も同方向に更新される
- `debug-identity-seeds` / `agent-identity-store` の unit test が PASS する
- delta validator が PASS する

## delta apply
- `wireframe/debug-identity-seeds.js` の `guide-core` `SOUL.md` を、傾聴・相づち・余白を重視する表現へ更新
- `runtime/agent-identity-store.js` の Guide 既定 `SOUL.md` も同方向に更新
- `tests/unit/debug-identity-seeds.test.js` と `tests/unit/agent-identity-store.test.js` を追随

## delta verify
- `node --check wireframe/debug-identity-seeds.js runtime/agent-identity-store.js` PASS
- `node --test tests/unit/debug-identity-seeds.test.js tests/unit/agent-identity-store.test.js` PASS
- `node scripts/validate_delta_links.js --dir .` PASS

## delta-archive
- archive可否: 可
- archive status: PASS

## 確定内容
- built-in `guide-core` の `SOUL.md` を、要件以外は根拠を詰めすぎず、まず受け止める管理人の語りへ更新した
- 新規 Guide テンプレートの `SOUL.md` も同じトーンへ同期した
