# delta-request

## Delta ID
- DR-20260307-resident-facing-default-seeds

## 目的
- Tomoshibi-kan の worldbuilding に合わせ、初期 Guide/Gate/Worker の見え方を `管理人 / 住人 / 古参住人` に寄せる。
- 技術用語としての `worker` は維持しつつ、ユーザーに見える初期値と identity seed を世界観へ整合させる。

## 変更対象（In Scope）
- 対象1: `wireframe/app.js` の built-in initial profile display name / persona
- 対象2: `wireframe/debug-identity-seeds.js` の built-in Guide/Gate/Worker seed 文言
- 対象3: `runtime/agent-identity-store.js` の default `SOUL.md / ROLE.md / RUBRIC.md` 文言
- 対象4: 最小限の unit/docs/plan/delta 同期

## 非対象（Out of Scope）
- 非対象1: `Pal -> Worker` の repo-wide rename
- 非対象2: Guide planning rules / few-shot / routing ロジック変更
- 非対象3: worldbuilding 本文の大規模修正
- 非対象4: 既存 workspace 上の profile 名の自動 migration

## 受入条件（Acceptance Criteria）
- AC-01: built-in Guide は管理人、Gate は古参住人、worker は住人として読める初期表示になる
- AC-02: 技術用語の `worker` や既存 debug harness を壊さない
- AC-03: default template (`SOUL/ROLE/RUBRIC`) が worldbuilding と矛盾しない
- AC-04: unit / targeted verify / `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## 実施内容
- `wireframe/app.js` の built-in initial profile display name / persona を `管理人 Guide` / `古参住人 Gate` / `○○担当の住人 (○○ Worker)` に更新した
- `wireframe/debug-identity-seeds.js` の Guide/Gate/Worker seed 文言を、管理人 / 古参住人 / 住人として読める表現へ更新した
- `runtime/agent-identity-store.js` の default template 文言を、技術 role は維持しつつ worldbuilding と矛盾しない resident language に更新した
- `docs/concept.md` / `docs/spec.md` / `docs/architecture.md` に `worker` と `Resident/住人` の境界を最小同期した
- `tests/unit/agent-identity-store.test.js` / `tests/unit/debug-identity-seeds.test.js` を更新した

# delta-verify

## 実行結果
- AC-01: PASS
  - built-in initial profile の表示が `管理人 Guide` / `古参住人 Gate` / `担当の住人` になった
- AC-02: PASS
  - 技術 role は `worker` のまま維持し、display name は括弧で `Trace Worker` 等を残した
- AC-03: PASS
  - default `SOUL/ROLE/RUBRIC` は住人 / 古参住人 / 管理人の文脈で読めるようになった
- AC-04: PASS
  - `node --test tests/unit/agent-identity-store.test.js tests/unit/debug-identity-seeds.test.js` PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 所見
- `docs/tomoshibikan_worldbuilding_jp.md` 自体はすでに git 管理対象だったため、今回は seed / template 側のみを反映した
- `Pal -> Worker` の repo-wide rename は保留のまま残している
- verify result: PASS

# delta-archive

## archive
- PASS
- 初期表示と identity seed / default template を `管理人 / 住人 / 古参住人` の worldbuilding に寄せ、技術用語 `worker` との境界を固定した
