# delta 記録テンプレート

正本は Markdown（`docs/delta/*.md`）で管理し、JSON/YAML の副管理を要求しない。

## Delta ID
- DR-YYYYMMDD-<short-name>

## Step 1: delta-request
- Arrival Point:
- In Scope:
- Out of Scope:
- Acceptance Criteria:

## Step 2: delta-apply
- changed files:
- applied AC:
- status: APPLIED / BLOCKED

## Step 3: delta-verify
- AC result table:
- scope deviation:
- overall: PASS / FAIL

## Step 4: delta-archive
- verify result: PASS
- archive status: archived
- unresolved items:

## Canonical Sync
- synced docs:
  - concept:
  - spec:
  - architecture:
  - plan:

## Validation Command
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\validate_delta_links.js --dir .`
- `node C:\Users\kitad\.codex\skills\project-validator\scripts\check_code_size.js --dir .`
