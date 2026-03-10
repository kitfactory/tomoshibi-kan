# plan.md（最新版）

# current
- なし

# review timing
- なし

# future
- resident routing の real-model 観測を増やし、Guide-driven routing の精度と fallback 境界を詰める
- resident ごとの `Progress Voice` を progress log の実メッセージ生成へさらに反映する
- OpenCode / Codex を含む tool runtime の capability snapshot を resident routing と handoff にさらに活かす
- `plan.md` archive を月次で分割し、入口を薄く保つ
- `app.js` の残り責務を継続分割し、2000 行未満を維持したままさらに縮小する

# archive summary
- 詳細な archive は monthly file に退避し、このファイルは current / future の入口として保つ
- 20260309: [DR-20260309-resident-name-rendering] resident proper-name rendering を archive 済み
- 20260309: [DR-20260309-plan-approval-and-auto-execution] plan approval と auto execution loop を archive 済み
- 20260309: [DR-20260309-multistep-request-observation] multi-step resident trio observation を archive 済み
- 20260309: guide plan project targeting を archive 済み
- 20260309: task conversation flow hardening を archive 済み
- 20260309: task conversation flow hardening を archive 済み
- 20260309: [DR-20260309-resident-dummy-task-observation] resident dummy task observation を archive 済み
- 20260309: [DR-20260309-multistep-request-observation] multi-step resident trio observation を archive 済み
- 20260309: [DR-20260309-programmer-researcher-role-separation] programmer/researcher role separation を archive 済み
- 20260309: [DR-20260309-resident-name-rendering] resident proper-name rendering を archive 済み
- 20260310: [DR-20260310-approved-plan-dispatch-dedup] 承認済み plan の重複再生成防止を archive 済み
- 20260310: [DR-20260310-project-validator-skill-unification] project-validator を skill 側に統一し、repo 側残骸を削除して archive 済み
- 20260310: [DR-20260310-app-js-split-task-detail-conversation] task detail conversation を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-guide-progress-flow] Guide の plan 承認 / progress query helper を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-guide-chat-entry] Guide の送信入口 / project onboarding / plan approval 分岐を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-guide-chat-runtime] Guide composer state / runtime helper / event wiring を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-guide-context-mention] Guide の project context / focus command / @mention menu helper を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-execution-runtime] execution runtime / settings-state / workspace-agent-state を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-settings-tab] Settings タブ描画を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-runtime-payloads] Guide/Worker/Gate の runtime payload helper 群を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-project-and-shell-panels] resident / workspace shell / project tab を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-workspace-agent-state-namespace-repair] `WorkspaceAgentStateUi` の namespaced export で `app.js` wrapper 再帰を修復して archive 済み
- 20260310: [DR-20260310-app-js-split-board-execution] Task/Job action / Gate panel / auto execution を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-task-detail-panel] task detail panel 描画と状態更新 helper を `app.js` から分割して archive 済み
- 20260310: [DR-20260310-app-js-split-project-and-shell-panels] resident / workspace shell / project tab を `app.js` から分割して archive 済み
- 20260311: [DR-20260311-settings-tab-support-split] `settings-tab.js` の描画本体を `settings-tab-render.js` へ分離して archive 済み
- 20260311: [DR-20260311-workspace-agent-state-split] `workspace-agent-state.js` を profile/state・board/state・runtime-config へ分離して archive 済み

# archive index
- [docs/plan_archive_2026_03.md](/abs/path/C:/Users/kitad/palpal-hive/docs/plan_archive_2026_03.md)
- [x] 20260301: [DR-20260301-api-key-rotation-policy] [DR-20260301-context-builder-guide] [DR-20260301-context-builder-roadmap-order] [DR-20260301-context-builder-rollout] [DR-20260301-context-builder-spec] [DR-20260301-core-adapter-swap-tests] [DR-20260301-core-catalog-direct] [DR-20260301-core-catalog-no-default-models] [DR-20260301-doc-sync] [DR-20260301-env-vars-provider-minimal] [DR-20260301-event-log-query-controls] [DR-20260301-gate-reason-template-nav] [DR-20260301-guide-chat-dialogue] [DR-20260301-guide-chat-mojibake-fix] [DR-20260301-guide-lmstudio-dev] [DR-20260301-guide-model-guard] [DR-20260301-i18n-dictionary-verify] [DR-20260301-job-scheduler-spec] [DR-20260301-optional-api-key-local] [DR-20260301-pal-markdown-contract] [DR-20260301-pal-profile] [DR-20260301-plan-clarify] [DR-20260301-plan-current-order-guide] [DR-20260301-runtime-validation] [DR-20260301-settings-lmstudio-provider] [DR-20260301-settings-model-catalog-env] [DR-20260301-settings-model-registration] [DR-20260301-settings-pal-model-immediate] [DR-20260301-settings-persistence-impl] [DR-20260301-settings-persistence-policy] [DR-20260301-settings-provider-model-link] [DR-20260301-settings-provider-selection-sticky] [DR-20260301-settings-skill-section-split] [DR-20260301-settings-structure-refine] [DR-20260301-skill-catalog] [DR-20260301-workspace-access-fallback] [DR-20260301-ws-root-env-appdata] [DR-20260301-ws-root-layout]
- [x] 20260302: [DR-20260302-settings-footer-save-dirty] [DR-20260302-settings-save-button-large-dirty] [DR-20260302-settings-save-disabled-visual]
- [x] 20260303: [DR-20260303-settings-skill-search-scroll]
- [x] 20260304: [DR-20260304-agent-identity-repository] [DR-20260304-agent-identity-step1-foundation] [DR-20260304-agent-skill-reference-resolver] [DR-20260304-doc-ui-label-cron] [DR-20260304-e2e-clawhub-mock-live-split] [DR-20260304-file-not-found-fallback] [DR-20260304-guide-assignment-readiness] [DR-20260304-guide-tool-loop-safeguard] [DR-20260304-job-tab-label-cron] [DR-20260304-pal-list-compact-modal-settings] [DR-20260304-pal-runtime-skill-execution] [DR-20260304-project-directory-picker-unlist-enabled] [DR-20260304-project-list-hide-focus-display] [DR-20260304-project-list-remove-focus-and-unlist-wording] [DR-20260304-project-tab-chat-reference-focus] [DR-20260304-repeated-file-read-not-found-stop] [DR-20260304-runtime-file-search-readme-recovery] [DR-20260304-runtime-workspace-root-from-project-focus] [DR-20260304-settings-skill-actions-link-layout] [DR-20260304-settings-skill-install-nonstandard] [DR-20260304-settings-skill-link-external-desc] [DR-20260304-settings-skill-market-button-layout] [DR-20260304-settings-skill-market-hide-installed] [DR-20260304-settings-skill-market-modal-flow] [DR-20260304-settings-skill-modal-advanced-filters] [DR-20260304-settings-skill-modal-explicit-search] [DR-20260304-settings-skill-modal-filter-layout] [DR-20260304-settings-skill-modal-input-layout] [DR-20260304-settings-skill-modal-search-button-align] [DR-20260304-settings-skill-modal-search-button-right] [DR-20260304-settings-skill-recommendation-install-button] [DR-20260304-settings-skill-recommendation-persistence] [DR-20260304-settings-skill-recommendation-visibility] [DR-20260304-settings-skill-safety-display] [DR-20260304-settings-skill-search-api] [DR-20260304-settings-skill-search-duckduckgo] [DR-20260304-settings-skill-search-fullwidth-query] [DR-20260304-settings-skill-search-metrics-display] [DR-20260304-settings-standard-skill-link-hide] [DR-20260304-tool-call-args-debug] [DR-20260304-workspace-name-prefix-path-normalize]
- [x] 20260306: [DR-20260306-agent-identity-light-editor] [DR-20260306-agent-routing-selector-impl] [DR-20260306-board-state-gate-profile-persistence] [DR-20260306-brand-tone-framing] [DR-20260306-context-handoff-policy-runtime] [DR-20260306-cron-tone-refine] [DR-20260306-debug-purpose-identity-seeds] [DR-20260306-debug-purpose-pal-profiles] [DR-20260306-default-gate-execution-binding] [DR-20260306-design-tone-principles] [DR-20260306-doc-sync-tone-rollout] [DR-20260306-e2e-spec-string-repair] [DR-20260306-event-log-tone-refine] [DR-20260306-execution-loop-context-handoff-policy] [DR-20260306-execution-loop-handoff-schema] [DR-20260306-execution-loop-terminology] [DR-20260306-experience-tone-doc] [DR-20260306-gate-decision-schema] [DR-20260306-gate-review-runtime] [DR-20260306-gate-rubric-contract] [DR-20260306-guide-autonomous-check] [DR-20260306-guide-chat-tone-refine] [DR-20260306-guide-conversation-boundary] [DR-20260306-guide-failure-mode-observation] [DR-20260306-guide-full-runner-stabilization] [DR-20260306-guide-gate-multi-profile-impl] [DR-20260306-guide-gate-multi-profile-requirement] [DR-20260306-guide-needs-clarification-controller-assist] [DR-20260306-guide-output-parser-hardening] [DR-20260306-guide-output-prompt-tightening] [DR-20260306-guide-plan-boundary-doc] [DR-20260306-guide-plan-debug-task-recovery] [DR-20260306-guide-plan-materialization-e2e-check] [DR-20260306-guide-plan-parse-gate] [DR-20260306-guide-planning-intent-controller-assist] [DR-20260306-guide-real-dialogue-check] [DR-20260306-guide-simple-role-worker-hint] [DR-20260306-guide-structured-output-adoption] [DR-20260306-language-system-prompt-layer] [DR-20260306-orchestration-debug-cli-minimal] [DR-20260306-orchestration-debug-db-minimal] [DR-20260306-orchestration-debug-smoke-cli] [DR-20260306-orchestrator-autonomous-check] [DR-20260306-pal-config-footer-compact] [DR-20260306-pal-config-modal-auto-height] [DR-20260306-pal-identity-template-init] [DR-20260306-role-specific-operating-rules] [DR-20260306-routing-explanation-event-log] [DR-20260306-settings-tone-refine] [DR-20260306-simple-role-debug-pals] [DR-20260306-soul-md-canonicalize] [DR-20260306-soul-md-fallback-removal] [DR-20260306-task-gate-tone-refine] [DR-20260306-ui-tone-application-guide] [DR-20260306-worker-gate-routing-basis-doc] [DR-20260306-worker-handoff-runtime-payload]
- [x] 20260307: [DR-20260307-brand-key-visual-commit] [DR-20260307-brand-tomoshibikan-and-origin-commit] [DR-20260307-cli-tool-capability-probe] [DR-20260307-first-party-rename-commit] [DR-20260307-first-party-rename-tomoshibi-kan] [DR-20260307-guide-autonomous-check-assist-off] [DR-20260307-guide-codex-cli-autonomous-check] [DR-20260307-guide-codex-cli-runtime] [DR-20260307-guide-controller-assist-default-off] [DR-20260307-guide-driven-orchestrator-log-doc] [DR-20260307-guide-few-shot-three-option-recommendation] [DR-20260307-guide-operating-rules-option-suggestion] [DR-20260307-guide-operating-rules-planning-guidance] [DR-20260307-guide-operating-rules-three-option-closing] [DR-20260307-guide-operating-rules-work-intent] [DR-20260307-guide-output-instruction-reduction] [DR-20260307-guide-plan-ready-empty-reply-recovery] [DR-20260307-guide-progress-query-minimal] [DR-20260307-guide-soul-role-real-check] [DR-20260307-guide-soul-role-refresh] [DR-20260307-mojibake-baseline-repair] [DR-20260307-mojibake-repair-and-encoding-guard] [DR-20260307-opencode-capability-audit] [DR-20260307-opencode-capability-probe-impl] [DR-20260307-opencode-lmstudio-run-check] [DR-20260307-opencode-skill-install-reobserve] [DR-20260307-orchestrator-cycle-recheck-after-progress-log] [DR-20260307-orchestrator-three-task-cycle-check] [DR-20260307-remaining-tomoshibi-rename-audit] [DR-20260307-replan-required-progress-log] [DR-20260307-resident-facing-default-seeds] [DR-20260307-resident-facing-ui-labels] [DR-20260307-resident-set-file-add] [DR-20260307-task-progress-log-minimal] [DR-20260307-technical-identifier-rename-tomoshibi] [DR-20260307-worldbuilding-file-git-check] [DR-20260307-worldbuilding-gate-reinforce]
- [x] 20260308: [DR-20260308-plan-md-shrink] [DR-20260308-open-delta-archive-normalization] [DR-20260308-plan-current-open-delta-cleanup] [DR-20260308-plan-editor-section-sync] [DR-20260308-guide-short-turn-convergence-recovery] [DR-20260308-guide-resident-plan-stabilization] [DR-20260308-resident-routing-real-observation] [DR-20260308-built-in-resident-set-sync] [DR-20260308-built-in-role-sync-verify] [DR-20260308-built-in-soul-deepen] [DR-20260308-orchestrator-dispatch-extraction] [DR-20260308-orchestrator-routing-llm-design] [DR-20260308-orchestrator-routing-llm-impl] [DR-20260308-orchestrator-replan-bridge] [DR-20260308-orchestrator-reroute-bridge] [DR-20260308-plan-artifact-boundary] [DR-20260308-resident-microtests] [DR-20260308-resident-role-rollout] [DR-20260308-resident-set-remove-arranger] [DR-20260308-resident-set-v04-soul-align] [DR-20260308-role-strategy-for-task-conversation-log] [DR-20260308-routing-precision-role-first] [DR-20260308-task-detail-conversation-ui] [DR-20260308-progress-voice-log-rendering] [DR-20260308-reroute-replan-real-observation] [DR-20260308-guide-finalization-proposal] [DR-20260308-assist-off-plan-ready-stability] [DR-20260308-resident-variation-real-observation] [DR-20260308-role-first-routing-without-taskkind] [DR-20260308-full-role-routing-context] [DR-20260308-full-role-routing-real-observation] [DR-20260308-fallback-scorer-necessity-evaluation] [DR-20260308-llm-routing-precision-improvement] [DR-20260308-guide-five-turn-convergence] [DR-20260308-resident-role-alignment-and-plan-preview-design] [DR-20260308-resident-proper-name-rollout] [DR-20260308-resident-name-adjustment] [DR-20260308-guide-builtin-soul-soften] [DR-20260308-guide-no-reference-url-tone] [DR-20260308-guide-gentle-clarification-and-chat-markdown]
- [x] 20260308: [DR-20260308-guide-cron-and-project-onboarding]
- [x] 20260309: [DR-20260309-task-conversation-flow-hardening] [DR-20260309-guide-plan-project-targeting]
- [x] 20260309: [DR-20260309-resident-dummy-task-observation] [DR-20260309-programmer-researcher-role-separation]
- [x] 20260309: [DR-20260309-multistep-request-observation]
- [x] 20260309: [DR-20260309-resident-name-rendering]
- [x] 20260309: [DR-20260309-plan-approval-and-auto-execution]
- [x] 20260310: [DR-20260310-approved-plan-dispatch-dedup] [DR-20260310-project-validator-skill-unification]
- [x] 20260310: [DR-20260310-app-js-split-task-detail-conversation]
- [x] 20260310: [DR-20260310-app-js-split-guide-progress-flow]
- [x] 20260310: [DR-20260310-app-js-split-guide-chat-entry]
- [x] 20260310: [DR-20260310-app-js-split-guide-chat-runtime]
- [x] 20260310: [DR-20260310-app-js-split-guide-context-mention]
- [x] 20260310: [DR-20260310-app-js-split-settings-tab] [DR-20260310-app-js-split-project-and-shell-panels]
- [x] 20260310: [DR-20260310-app-js-split-runtime-payloads]
- [x] 20260310: [DR-20260310-app-js-split-board-execution]
- [x] 20260310: [DR-20260310-app-js-split-task-detail-panel]
- [x] 20260310: [DR-20260310-app-js-split-execution-runtime] [DR-20260310-workspace-agent-state-namespace-repair]
- [x] 20260311: [DR-20260311-settings-tab-support-split]
- [x] 20260311: [DR-20260311-workspace-agent-state-split]
