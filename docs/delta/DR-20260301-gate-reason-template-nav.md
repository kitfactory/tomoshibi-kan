# delta-request

## Delta ID
- DR-20260301-gate-reason-template-nav

## In Scope
- Gate Panel に理由テンプレート選択 UI を追加する。
- Reject 後に対象 Task/Job へ自動ナビゲーションし、再提出しやすい視認性を追加する。
- 該当挙動の E2E テストを追加/更新する。
- spec/architecture/plan へ最小同期する。

## Out of Scope
- Gate 判定ロジック（業務ルール）そのものの変更。
- Task/Job の永続化仕様変更。
- 新しい runtime や provider 追加。

## Acceptance Criteria
- AC-01: Gate Panel にテンプレートボタンが表示され、クリックで reject textarea に追記される。
- AC-02: Reject 実行後、対象が task/job に応じて該当タブへ遷移し対象行がハイライトされる。
- AC-03: E2E で job gate approve の既存フローと reject+template+navigation が PASS する。
- AC-04: spec/architecture/plan/delta link が整合している。

# delta-apply

## status
- APPLIED

## changed files
- wireframe/index.html
- wireframe/styles.css
- wireframe/app.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- docs/delta/DR-20260301-gate-reason-template-nav.md

## applied AC
- AC-01:
  - `#gateReasonTemplateList` を追加し、`data-gate-template-id` ボタンで textarea 追記を実装。
- AC-02:
  - `navigateToResubmitTarget` / `focusBoardRow` を追加し、reject 後にタブ遷移 + ハイライトを実装。
- AC-03:
  - E2E に reject + template + navigation シナリオを追加。
  - 既存 job gate flow の期待文言を `Done|完了` へ補正。
- AC-04:
  - spec/architecture へ追記、plan と delta 参照を追加。

# delta-verify

## AC result
| AC | Result | Evidence |
|---|---|---|
| AC-01 | PASS | `wireframe/index.html`, `wireframe/app.js` の template UI + append 実装 |
| AC-02 | PASS | `wireframe/app.js` の `navigateToResubmitTarget` / `focusBoardRow` |
| AC-03 | PASS | `npx playwright test tests/e2e/workspace-layout.spec.js --grep "job board supports gate flow|gate reject uses templates and navigates to resubmit target"` |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` |

## scope deviation
- なし

## overall
- PASS

# delta-archive

- verify result: PASS
- archive status: archived
- unresolved items:
  - Gate理由テンプレートの内容カスタマイズは次deltaで扱う。
