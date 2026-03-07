# delta-request

## Delta ID
- DR-20260304-settings-skill-safety-display

## In Scope
- Skills search result の Safety 表示で、`Unknown` が既存ラベルを上書きする不具合を修正する。
- ClawHub 検索時、Safety 未提供レコードの表示を `Unknown` 固定ではなく状態ベース表示にする。
- E2E で表示回帰を防止する。

## Out of Scope
- ClawHub API 側の仕様変更。
- Skills モーダルのレイアウト変更。

## Acceptance Criteria
- AC-01: merge 時に既存の Safety（High/Medium など）が `Unknown` で上書きされない。
- AC-02: Safety 未提供かつ nonSuspicious フィルタON時は `Non-suspicious`（ja: `疑わしい除外済み`）と表示される。
- AC-03: `npm run test:e2e -- --reporter=line tests/e2e/workspace-layout.spec.js -g "settings skill search"` が PASS する。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/delta/DR-20260304-settings-skill-safety-display.md

## applied AC
- AC-01:
  - `isUnknownSafetyValue` を追加し、`mergeSkillRecords` で unknown safety の上書きを抑止。
- AC-02:
  - モーダル描画時に `resolveSkillSafetyDisplay` を追加。
  - safety 不明時は `Suspicious / Non-suspicious / Unverified` の状態表示へ変更。
- AC-03:
  - `settings skill search` E2E を実行し、PASS を確認。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `mergeSkillRecords` で unknown safety overwrite を回避 |
| AC-02 | PASS | E2E で `安全性: 疑わしい除外済み` を確認 |
| AC-03 | PASS | `99 passed` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - なし
