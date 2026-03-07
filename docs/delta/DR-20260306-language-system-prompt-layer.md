# delta-request

## Delta ID
- DR-20260306-language-system-prompt-layer

## Purpose
- app locale に従って model reply の既定言語を固定する `LANGUAGE` prompt layer を追加し、`LANGUAGE / SOUL / ROLE(RUBRIC)` を system prompt 層として扱う。

## In Scope
- `wireframe/context-builder.js` に `LANGUAGE + SOUL + ROLE(RUBRIC) + OPERATING_RULES` の system prompt 合成を追加する
- `wireframe/app.js` で Guide/worker runtime 呼び出し前に identity file と locale を Context Builder へ渡す
- `wireframe/app.js` で system role を runtime `systemPrompt` 引数へ集約する
- `tests/unit/context-builder.test.js` に system prompt layer の unit test を追加する
- `docs/spec.md` / `docs/architecture.md` に system prompt layer 契約を最小同期する
- `docs/plan.md` とこの delta を request/apply/verify/archive で閉じる

## Out of Scope
- `LANGUAGE.md` という実ファイルの導入
- Gate runtime の新規実装
- user が明示した多言語要求の高度判定
- UI で LANGUAGE prompt を編集する機能

## Acceptance Criteria
- AC-01: Context Builder が `LANGUAGE` セクションを system prompt に含める
- AC-02: Guide の model runtime 呼び出しで locale 由来 LANGUAGE prompt が system prompt に乗る
- AC-03: worker runtime 呼び出しで `SOUL/ROLE` と LANGUAGE prompt が system prompt に乗る
- AC-04: unit/E2E で既存 Guide/Pal runtime 回帰が通る
- AC-05: `spec/architecture` に system prompt layer 契約が追記される
- AC-06: `node scripts/validate_delta_links.js --dir .` が PASS する

## Risks
- system prompt を強くしすぎると token 使用量が増える
- system prompt 集約処理を誤ると Guide runtime で system 文脈が二重化する

## Open Questions
- user が明示的に別言語を要求した場合の override 判定強化は別 delta

# delta-apply

## status
- APPLIED

## changed files
- wireframe/context-builder.js
- wireframe/app.js
- tests/unit/context-builder.test.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260306-language-system-prompt-layer.md

## applied AC
- AC-01: Context Builder に `LANGUAGE` prompt と composite system prompt builder を追加した
- AC-02: Guide context build 時に locale と Guide identity (`SOUL/ROLE`) を渡すようにした
- AC-03: worker runtime 実行時に locale と identity を読み込み、system prompt に集約して `palChat` へ渡すようにした
- AC-04: unit/E2E を追加・再実行した
- AC-05: spec/architecture に system prompt layer 契約を追記した
- AC-06: plan と delta を更新した

## scope deviation
- Out of Scope への変更: No
- 補足: `LANGUAGE.md` 実ファイルや UI 編集機能は追加していない

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/context-builder.js` に `buildLanguagePrompt` / `buildCompositeSystemPrompt` を追加 |
| AC-02 | PASS | `wireframe/app.js` の `buildGuideContextWithFallback()` と `requestGuideModelReplyWithFallback()` で locale + identity を system prompt へ集約 |
| AC-03 | PASS | `wireframe/app.js` の `executePalRuntimeForTarget()` で identity + locale を runtime `systemPrompt` へ反映 |
| AC-04 | PASS | `node --test tests/unit/context-builder.test.js tests/unit/palpal-core-runtime.test.js` PASS / `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide chat resumes after registering model in settings|guide chat creates planned tasks and assigns workers|job board supports gate flow|identity files can be edited from pal settings modal"` PASS |
| AC-05 | PASS | `docs/spec.md` / `docs/architecture.md` に `LANGUAGE System Prompt Layer` を追記 |
| AC-06 | PASS | `node scripts/validate_delta_links.js --dir .` PASS |

## scope check
- Out of Scope 変更の混入: No
- `LANGUAGE.md` 実ファイル、Gate runtime 新規実装、UI 編集機能は未実施

## residual risks
- R-01: token budget が厳しい model では identity prompt の長文化に注意が必要
- R-02: user の明示言語要求を prompt 文だけで扱っているため、将来は会話解析ベースの override 強化余地がある

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - 明示的な多言語 override 判定強化は別 delta
