# delta-request

## Delta ID
- DR-20260301-context-builder-rollout

## 目的
- Context Builder を Guide 専用 API から role 共通 API へ拡張する。
- `runtimeKind=model` 時のみ Skill 文脈を注入する方針を実装する。

## In Scope
- `buildPalContext(role, runtimeKind, skillSummaries, ...)` を追加する。
- Guide 側は `buildPalContext` を優先利用する接続へ切り替える。
- `runtimeKind=tool` 時の Skill 非注入を unit テストで固定する。
- spec/architecture にロール展開方針を追記する。

## Out of Scope
- Gate/Worker での実送信経路実装。
- SKILL.md 実ファイルロードの実装。
- 監査ログ永続化の本実装。

## Acceptance Criteria
- AC-01: Context Builder に role 共通 API (`buildPalContext`) が存在する。
- AC-02: `runtimeKind=tool` では Skill 文脈が messages に入らない。
- AC-03: Guide 経路で `buildPalContext` を利用できる。
- AC-04: unit と Guide E2E が PASS。

# delta-apply

## ステータス
- APPLIED

## 変更ファイル
- wireframe/context-builder.js
- wireframe/app.js
- tests/unit/context-builder.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-context-builder-rollout.md

## AC 対応
- AC-01:
  - `buildPalContext` を追加し、`buildGuideContext` は wrapper 化。
- AC-02:
  - `runtimeKind !== model` の場合は Skill 文脈注入を抑止。
  - `skip-skill-context:tool-runtime` を監査に残す。
- AC-03:
  - Guide 側接続を `buildPalContext` 優先に変更（fallback で `buildGuideContext`）。
- AC-04:
  - unit/E2E 実行で回帰確認。

# delta-verify

## 結果
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/context-builder.js` に `buildPalContext` を追加 |
| AC-02 | PASS | `tests/unit/context-builder.test.js` で tool runtime 非注入を検証 |
| AC-03 | PASS | `wireframe/app.js` で `buildPalContext` 優先接続 |
| AC-04 | PASS | `npm run test:unit` + Guide E2E PASS |

## 実行コマンド
- `node --check wireframe/context-builder.js; node --check wireframe/app.js; node --check runtime/palpal-core-runtime.js`
- `node --test tests/unit/context-builder.test.js`
- `npm run test:unit`
- `npx playwright test tests/e2e/workspace-layout.spec.js --grep "guide chat is blocked when guide model is not configured|guide chat resumes after registering model in settings"`

# delta-archive

## クローズ
- verify result: PASS
- archive: 完了

## 要約
- Context Builder を role 共通 API へ拡張した。
- Skill 注入は `runtimeKind=model` のみ有効にし、`tool` 実行時は抑止する実装を固定した。
