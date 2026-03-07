# delta-request

## Delta ID
- DR-20260307-guide-plan-ready-empty-reply-recovery

## 目的
- Guide が `status=plan_ready` と valid な `plan` を返していても `reply` が空だと parser が弾いてしまい、task materialization に進めない。
- `plan_ready + plan valid + reply empty` の時だけ最小 recovery を入れ、3 task cycle の verify を再開できるようにする。

## 変更対象（In Scope）
- 対象1: `wireframe/guide-plan.js` の parser recovery
- 対象2: `tests/unit/guide-plan.test.js` の unit test 追加
- 対象3: 必要最小限の `docs/plan.md` / delta 同期

## 非対象（Out of Scope）
- 非対象1: Guide prompt や few-shot の変更
- 非対象2: Plan schema の変更
- 非対象3: Orchestrator / progress log の変更
- 非対象4: Guide reply 文体の大きな redesign

## 受入条件（Acceptance Criteria）
- AC-01: `status=plan_ready` かつ `plan` が valid で `reply` が空でも parser が `ok=true` を返す
- AC-02: recovery reply は minimal な既定文でよい
- AC-03: 既存 `conversation` / `needs_clarification` / `plan_ready with reply` を壊さない
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## 実施内容
- `wireframe/guide-plan.js` に `buildRecoveredPlanReadyReply()` を追加し、`status=plan_ready` かつ `plan` が valid で `reply` が空の時だけ既定 reply を補うようにした
- `conversation` / `needs_clarification` では引き続き `reply` を必須にした
- `tests/unit/guide-plan.test.js` に empty `reply` recovery の unit test を追加した

# delta-verify

## 実行結果
- AC-01: PASS
  - valid `plan_ready` + empty `reply` で `ok=true` と recovery reply を返す unit test を追加
- AC-02: PASS
  - recovery reply は `Trace の計画を用意しました。` 相当の minimal 文に留めた
- AC-03: PASS
  - `tests/unit/guide-plan.test.js` で既存 `conversation` / `needs_clarification` / wrapper / damaged JSON 系回帰なし
- AC-04: PASS
  - `node scripts/validate_delta_links.js --dir .` PASS

## 所見
- この recovery により、実モデルで `status=plan_ready` だが `reply` が空のケースでも task materialization に進めるようになった
- verify result: PASS

# delta-archive

## archive
- PASS
- `plan_ready + valid plan + empty reply` の時だけ parser が minimal reply を補い、Guide task materialization を継続できるようにした
