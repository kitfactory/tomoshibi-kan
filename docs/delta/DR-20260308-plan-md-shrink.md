# DR-20260308-plan-md-shrink

## request

### Why
- `docs/plan.md` が肥大化し、`current / future / archive` の視認性が落ちている。
- 重複した `archive` と過去の文字化け混入により、作業入口として使いづらい。
- 日常運用では薄い `plan.md` を維持し、詳細履歴は別 archive へ退避したい。

### In Scope
- `docs/plan.md` を `current / future / archive summary` の薄い入口に再構成する。
- 既存の `docs/plan.md` 全体を archive ファイルへ退避する。
- `plan.md` から archive ファイルへの参照を追加する。

### Out of Scope
- archive 内容の意味修正、履歴の書き換え、完了判定の見直し。
- `docs/spec.md` / `docs/architecture.md` / `docs/concept.md` の更新。
- archive 内容の全面的な文字化け修復。

### Acceptance Criteria
1. `docs/plan.md` が `# current / # future / # archive` を 1 回ずつ持つ薄い入口になっている。
2. 旧 `docs/plan.md` の内容が新しい archive ファイルへ退避されている。
3. `docs/plan.md` から archive ファイルへの参照がある。
4. `node scripts/validate_delta_links.js --dir .` が PASS する。

## apply
- 既存 `docs/plan.md` 全体を `docs/plan_archive_2026_03.md` へ退避した。
- `docs/plan.md` を `current / future / archive` の薄い入口へ再構成した。
- validator が `plan.md` 本体だけを参照するため、archive section は日付ごとの Delta ID 圧縮参照へ置き換えた。

## verify
- `docs/plan.md` が `# current / # future / # archive` を 1 回ずつ持つことを確認した。
- `docs/plan_archive_2026_03.md` が旧 `docs/plan.md` の退避先として存在することを確認した。
- `node scripts/validate_delta_links.js --dir .` PASS

## archive
- delta-archive: PASS
- verify結果: PASS
