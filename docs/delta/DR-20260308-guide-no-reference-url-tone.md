# Delta Request: DR-20260308-guide-no-reference-url-tone

## Delta Type
FEATURE

## In Scope
- built-in `guide-core` の `SOUL.md` に、参照URLを記載しない方針を追加する
- 新規 Guide テンプレートの `SOUL.md` にも同じ方針を追加する
- 追随する unit test を最小更新する

## Out of Scope
- `ROLE.md` の変更
- Guide 以外の resident `SOUL.md` の変更
- routing / orchestrator / UI の変更

## Acceptance Criteria
- built-in `guide-core` の `SOUL.md` に、参照URLを記載しない旨が含まれる
- 新規 Guide テンプレートの `SOUL.md` にも同じ旨が含まれる
- 関連 unit test が PASS する
- delta validator が PASS する

## delta apply
- `wireframe/debug-identity-seeds.js` の `guide-core` `SOUL.md` に、参照URLは記載しない方針を追加
- `runtime/agent-identity-store.js` の Guide 既定 `SOUL.md` も同様に更新
- `tests/unit/debug-identity-seeds.test.js` と `tests/unit/agent-identity-store.test.js` を追随

## delta verify
- `node --check wireframe/debug-identity-seeds.js runtime/agent-identity-store.js` PASS
- `node --test tests/unit/debug-identity-seeds.test.js tests/unit/agent-identity-store.test.js` PASS
- `node scripts/validate_delta_links.js --dir .` PASS

## delta-archive
- archive可否: 可
- archive status: PASS

## 確定内容
- 管理人の `SOUL.md` に、要件外では参照URLを記載しない方針を追加した
