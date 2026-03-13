# Delta ID
- DR-20260313-guide-convergence-criterion-reset

# Delta Type
- OPS

## Step 1: delta-request
- Arrival Point:
  - Guide 会話の収束基準を `3/5ターン固定` から `自然さ優先・必要なら15ターン以内` へ切り替え、verify の重さも到達点に応じた最小セットへ統一する。
- In Scope:
  - `AGENTS.md` に Guide 収束基準と verify 最小化を追記
  - `docs/OVERVIEW.md` に同じ運用を追記
  - `docs/delta/TEMPLATE.md` に verify weight の明示を追加
  - `docs/plan.md` の archive summary に今回の docs-only delta を記録
- Out of Scope:
  - 既存の historical delta / monthly archive の大規模書換え
  - Guide 実装や runner の挙動変更
  - Channel / Cron request の apply
- Acceptance Criteria:
  - AGENTS と OVERVIEW で `15ターン以内` / 自然さ優先 / verify 最小化が読める
  - TEMPLATE に verify の重さを明記できる
  - validator が PASS する

## Step 2: delta-apply
- changed files:
  - `AGENTS.md`
  - `docs/OVERVIEW.md`
  - `docs/delta/TEMPLATE.md`
  - `docs/plan.md`
  - `docs/delta/DR-20260313-guide-convergence-criterion-reset.md`
- applied AC:
  - Guide 収束基準を `15ターン以内` へ変更
  - verify は到達点に対して最小セットを選ぶ運用を追加
  - docs-only delta の記録を plan に追加
- status: APPLIED

## Step 3: delta-verify
- Verify Weight:
  - docs-only
- AC result table:
  - AGENTS に Guide 収束基準と verify 最小化を追記: PASS
  - OVERVIEW に同じ運用を追記: PASS
  - TEMPLATE に verify weight を追加: PASS
  - validator PASS: PASS
- scope deviation:
  - なし
- overall: PASS

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:
  - historical delta に残る 3/5ターン記述は履歴として保持する

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture:
  - plan: `docs/plan.md`

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
