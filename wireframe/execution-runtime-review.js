(function attachExecutionRuntimeReviewUi(scope) {
  function resetGateRuntimeState(ctx) {
    ctx.gateRuntimeState.loading = false;
    ctx.gateRuntimeState.requestSeq = 0;
    ctx.gateRuntimeState.suggestedDecision = "none";
    ctx.gateRuntimeState.reason = "";
    ctx.gateRuntimeState.fixes = [];
    ctx.gateRuntimeState.rawText = "";
    ctx.gateRuntimeState.error = "";
  }

  function renderGateRuntimeSuggestion(ctx) {
    const gatePanel = document.getElementById("gatePanel");
    const statusEl = document.getElementById("gateRuntimeStatus");
    const suggestionEl = document.getElementById("gateRuntimeSuggestion");
    if (!gatePanel) return;
    const state = ctx.gateRuntimeState.loading
      ? "loading"
      : (ctx.gateRuntimeState.error ? "error" : (ctx.gateRuntimeState.suggestedDecision !== "none" ? "ready" : "idle"));
    gatePanel.setAttribute("data-gate-runtime-state", state);
    gatePanel.setAttribute("data-gate-suggested-decision", ctx.gateRuntimeState.suggestedDecision || "none");
    if (statusEl) {
      if (ctx.gateRuntimeState.loading) {
        statusEl.textContent = ctx.locale === "en" ? "Gate model is reviewing..." : "Gate モデルが審査中です...";
      } else if (ctx.gateRuntimeState.error) {
        statusEl.textContent = ctx.locale === "en" ? "Gate model review is unavailable." : "Gate モデル審査は利用できません。";
      } else if (ctx.gateRuntimeState.suggestedDecision !== "none") {
        const label = ctx.gateRuntimeState.suggestedDecision === "approved" ? "approve" : "reject";
        statusEl.textContent = ctx.locale === "en"
          ? `Gate model suggested: ${label}`
          : `Gate モデル審査: ${label}`;
      } else {
        statusEl.textContent = ctx.locale === "en" ? "Manual review" : "手動レビュー";
      }
    }
    if (!suggestionEl) return;
    if (ctx.gateRuntimeState.suggestedDecision === "none") {
      suggestionEl.classList.add("hidden");
      suggestionEl.innerHTML = "";
      return;
    }
    const fixes = ctx.gateRuntimeState.fixes.length > 0
      ? ctx.gateRuntimeState.fixes.map((item) => `<li>${ctx.escapeHtml(item)}</li>`).join("")
      : `<li>${ctx.escapeHtml(ctx.locale === "en" ? "No fixes" : "修正項目なし")}</li>`;
    suggestionEl.classList.remove("hidden");
    suggestionEl.innerHTML = `
      <div class="font-semibold">${ctx.escapeHtml(ctx.locale === "en" ? "Gate Suggestion" : "Gate 提案")}</div>
      <div class="mt-1 text-xs text-base-content/70">${ctx.escapeHtml(ctx.locale === "en" ? "decision" : "decision")}: ${ctx.escapeHtml(ctx.gateRuntimeState.suggestedDecision)}</div>
      <div class="mt-2 text-sm">${ctx.escapeHtml(ctx.gateRuntimeState.reason || "-")}</div>
      <ul class="mt-2 list-disc pl-5 text-xs text-base-content/75">${fixes}</ul>
    `;
  }

  async function requestGateRuntimeReviewSuggestion(ctx, target, targetKind = "task", gateProfile = null) {
    if (!target || !gateProfile) return null;
    const runtimeApi = ctx.resolveTomoshibikanCoreRuntimeApi();
    const runtimeConfig = ctx.resolvePalRuntimeConfigForExecution(gateProfile);
    if (!runtimeApi || typeof runtimeApi.palChat !== "function" || !runtimeConfig || !runtimeConfig.modelName) {
      return null;
    }
    const [enabledSkillIds, identity] = await Promise.all([
      ctx.resolveConfiguredSkillIdsForPal(gateProfile),
      ctx.loadAgentIdentityForPal(gateProfile),
    ]);
    const basePrompt = ctx.buildOperatingRulesPrompt("gate", ctx.locale, targetKind);
    const reviewInput = ctx.buildGateReviewInput(target, targetKind, gateProfile, identity);
    const latestUserText = ctx.buildGateReviewUserText(reviewInput);
    const contextBuilderApi = ctx.resolvePalContextBuilderApi();
    const builderInput = {
      latestUserText,
      sessionMessages: [],
      safetyPrompt: basePrompt,
      role: "gate",
      runtimeKind: "model",
      locale: ctx.locale,
      skillSummaries: [],
      soulText: identity?.soul || "",
      roleText: "",
      rubricText: identity?.rubric || "",
    };
    const builtContext = contextBuilderApi && typeof contextBuilderApi.buildPalContext === "function"
      ? contextBuilderApi.buildPalContext(builderInput)
      : null;
    const promptEnvelope = builtContext && builtContext.ok
      ? ctx.splitSystemPromptFromContextMessages(builtContext.messages, basePrompt, builderInput.latestUserText)
      : {
        systemPrompt: ctx.buildFallbackIdentitySystemPrompt(basePrompt, identity),
        messages: [],
      };
    const response = await runtimeApi.palChat({
      provider: runtimeConfig.provider,
      modelName: runtimeConfig.modelName,
      baseUrl: runtimeConfig.baseUrl,
      apiKey: runtimeConfig.apiKey,
      userText: latestUserText,
      systemPrompt: promptEnvelope.systemPrompt,
      messages: promptEnvelope.messages,
      agentName: gateProfile.id,
      enabledSkillIds,
      workspaceRoot: ctx.resolveRuntimeWorkspaceRootForChat(),
      maxTurns: 2,
      debugMeta: {
        stage: "gate_review",
        agentRole: "gate",
        agentId: ctx.normalizeText(gateProfile?.id),
        targetKind,
        targetId: ctx.normalizeText(target?.id),
        identityVersions: ctx.buildDebugIdentityVersions(identity),
        gateProfileId: ctx.normalizeText(gateProfile?.id),
        rubricVersion: reviewInput.rubricVersion,
      },
    });
    const rawText = ctx.normalizeText(response?.text);
    const parsed = ctx.parseGateRuntimeResponse(rawText);
    if (!parsed) return null;
    return {
      ...parsed,
      rawText,
      runId: ctx.normalizeText(response?.runId),
    };
  }

  async function executeGateRuntimeReview(ctx, target, targetKind = "task", gateProfile = null) {
    if (!target || !gateProfile) return;
    const requestSeq = ctx.gateRuntimeState.requestSeq + 1;
    ctx.gateRuntimeState.requestSeq = requestSeq;
    ctx.gateRuntimeState.loading = true;
    ctx.gateRuntimeState.error = "";
    ctx.gateRuntimeState.suggestedDecision = "none";
    ctx.gateRuntimeState.reason = "";
    ctx.gateRuntimeState.fixes = [];
    ctx.gateRuntimeState.rawText = "";
    renderGateRuntimeSuggestion(ctx);
    try {
      const response = await requestGateRuntimeReviewSuggestion(ctx, target, targetKind, gateProfile);
      const gateTarget = ctx.getGateTarget();
      if (ctx.gateRuntimeState.requestSeq !== requestSeq || !gateTarget || gateTarget.id !== target.id) return;
      ctx.gateRuntimeState.loading = false;
      ctx.gateRuntimeState.rawText = ctx.normalizeText(response?.rawText);
      if (!response) {
        ctx.gateRuntimeState.error = "parse";
        renderGateRuntimeSuggestion(ctx);
        return;
      }
      ctx.gateRuntimeState.suggestedDecision = response.decision;
      ctx.gateRuntimeState.reason = response.reason;
      ctx.gateRuntimeState.fixes = response.fixes;
      if (response.decision === "rejected") {
        const reasonInput = document.getElementById("gateReason");
        if (reasonInput && !ctx.normalizeText(reasonInput.value)) {
          reasonInput.value = response.fixes.length > 0 ? response.fixes.join("\n") : response.reason;
        }
      }
      renderGateRuntimeSuggestion(ctx);
    } catch (_error) {
      if (ctx.gateRuntimeState.requestSeq !== requestSeq) return;
      ctx.gateRuntimeState.loading = false;
      ctx.gateRuntimeState.error = "runtime";
      renderGateRuntimeSuggestion(ctx);
    }
  }

  function summarizeRuntimeReplay(ctx, toolCalls) {
    const names = [...new Set(
      (Array.isArray(toolCalls) ? toolCalls : [])
        .map((call) => ctx.normalizeText(call?.tool_name || call?.toolName))
        .filter(Boolean)
    )];
    if (names.length === 0) return "";
    return `tool-call: ${names.join(" > ")}`;
  }

  async function executePalRuntimeForTarget(ctx, targetId, targetKind = "task") {
    if (!ctx.hasTomoshibikanCorePalChatApi()) return;
    const collection = targetKind === "job" ? ctx.jobs : ctx.tasks;
    const target = collection.find((item) => item.id === targetId);
    if (!target) return;
    const pal = ctx.palProfiles.find((entry) => entry.id === target.palId);
    if (!pal) return;
    const runtimeConfig = ctx.resolvePalRuntimeConfigForExecution(pal);
    if (!runtimeConfig || !runtimeConfig.modelName) return;
    const runtimeApi = ctx.resolveTomoshibikanCoreRuntimeApi();
    if (!runtimeApi || typeof runtimeApi.palChat !== "function") return;
    try {
      const [enabledSkillIds, identity] = await Promise.all([
        ctx.resolveConfiguredSkillIdsForPal(pal),
        ctx.loadAgentIdentityForPal(pal),
      ]);
      const role = ctx.normalizePalRole(pal.role);
      const runtimeKind = ctx.normalizePalRuntimeKind(pal.runtimeKind);
      const selectedToolNames = Array.isArray(pal.cliTools) ? pal.cliTools : [];
      const installedSkillIds = Array.isArray(ctx.settingsState.registeredSkills)
        ? ctx.settingsState.registeredSkills.map((skillId) => ctx.normalizeSkillId(skillId)).filter(Boolean)
        : [];
      const skillCatalogItems = ctx.CLAWHUB_SKILL_REGISTRY.map((skill) => ({
        id: skill.id,
        name: skill.name,
        description: skill.description,
      }));
      const skillResolverApi = ctx.resolveAgentSkillResolverApi();
      const resolvedByApi = skillResolverApi
        ? skillResolverApi.resolveSkillSummariesForContext({
          runtimeKind,
          configuredSkillIds: enabledSkillIds,
          installedSkillIds,
          catalogItems: skillCatalogItems,
          selectedToolNames,
          registeredToolCapabilities: ctx.resolveRegisteredToolCapabilitySnapshots(selectedToolNames),
        })
        : null;
      const skillSummaries = Array.isArray(resolvedByApi?.skillSummaries)
        ? resolvedByApi.skillSummaries
        : ctx.fallbackResolveSkillSummaries(
          runtimeKind,
          enabledSkillIds,
          installedSkillIds,
          skillCatalogItems,
          selectedToolNames,
          ctx.resolveRegisteredToolCapabilitySnapshots(selectedToolNames)
        );
      const workspaceRoot = ctx.resolveRuntimeWorkspaceRootForChat();
      const basePrompt = ctx.buildOperatingRulesPrompt(role, ctx.locale, targetKind);
      const contextBuilderApi = ctx.resolvePalContextBuilderApi();
      const builderInput = {
        latestUserText: ctx.buildPalRuntimeUserText(target, targetKind),
        sessionMessages: [],
        safetyPrompt: basePrompt,
        role,
        runtimeKind,
        locale: ctx.locale,
        skillSummaries,
        soulText: identity?.soul || "",
        roleText: identity?.role || "",
        rubricText: identity?.rubric || "",
      };
      const builtContext = contextBuilderApi && typeof contextBuilderApi.buildPalContext === "function"
        ? contextBuilderApi.buildPalContext(builderInput)
        : null;
      const promptEnvelope = builtContext && builtContext.ok
        ? ctx.splitSystemPromptFromContextMessages(builtContext.messages, basePrompt, builderInput.latestUserText)
        : {
          systemPrompt: ctx.buildFallbackIdentitySystemPrompt(basePrompt, identity),
          messages: [],
        };
      const response = await runtimeApi.palChat({
        provider: runtimeConfig.provider,
        modelName: runtimeConfig.modelName,
        baseUrl: runtimeConfig.baseUrl,
        apiKey: runtimeConfig.apiKey,
        userText: builderInput.latestUserText,
        systemPrompt: promptEnvelope.systemPrompt,
        messages: promptEnvelope.messages,
        agentName: pal.id,
        enabledSkillIds,
        workspaceRoot,
        maxTurns: 4,
        debugMeta: {
          stage: "worker_runtime",
          agentRole: "worker",
          agentId: ctx.normalizeText(pal?.id),
          targetKind,
          targetId: ctx.normalizeText(target?.id),
          identityVersions: ctx.buildDebugIdentityVersions(identity),
          gateProfileId: ctx.normalizeText(target?.gateProfileId),
          handoffPolicy: ctx.normalizeText(ctx.settingsState.contextHandoffPolicy || "balanced"),
          enabledSkillIds,
        },
      });
      const latest = collection.find((item) => item.id === targetId);
      if (!latest) return;
      const text = ctx.normalizeText(response?.text);
      if (text) latest.evidence = text;
      const replaySummary = summarizeRuntimeReplay(ctx, response?.toolCalls);
      if (replaySummary) latest.replay = replaySummary;
      latest.updatedAt = ctx.formatNow();
      ctx.appendEvent(
        targetKind,
        latest.id,
        "runtime",
        `${latest.id} の実行結果を更新しました`,
        `${latest.id} runtime result updated`
      );
      const buildWorkerProgressMessage = typeof ctx.buildWorkerProgressConversationMessageForExecution === "function"
        ? ctx.buildWorkerProgressConversationMessageForExecution
        : (() => ({ messageJa: "", messageEn: "" }));
      const residentDisplayName = typeof ctx.residentDisplayNameForExecution === "function"
        ? ctx.residentDisplayNameForExecution
        : (_id, fallback = "") => ctx.normalizeText(fallback);
      const workerProgressConversation = buildWorkerProgressMessage(latest, latest.palId, "ok", latest.evidence);
      void ctx.appendTaskProgressLogForTarget(targetKind, latest.id, "worker_runtime", {
        planId: ctx.resolveTargetPlanId(latest),
        actualActor: "worker",
        displayActor: "Resident",
        status: "ok",
        messageJa: workerProgressConversation.messageJa,
        messageEn: workerProgressConversation.messageEn,
        payload: {
          assigneePalId: ctx.normalizeText(latest.palId),
          assigneeDisplayName: residentDisplayName(latest.palId, latest.palId),
          taskTitle: latest.title,
          taskDescription: latest.description || latest.instruction,
          evidence: ctx.normalizeText(latest.evidence),
          replay: ctx.normalizeText(latest.replay),
        },
      });
      ctx.rerenderAll();
    } catch (error) {
      ctx.appendEvent(
        targetKind,
        targetId,
        "runtime_error",
        `${targetId} の実行でエラーが発生しました`,
        `${targetId} runtime execution failed`
      );
      const targetRecord = collection.find((item) => item.id === targetId) || null;
      const buildWorkerProgressMessage = typeof ctx.buildWorkerProgressConversationMessageForExecution === "function"
        ? ctx.buildWorkerProgressConversationMessageForExecution
        : (() => ({ messageJa: "", messageEn: "" }));
      const residentDisplayName = typeof ctx.residentDisplayNameForExecution === "function"
        ? ctx.residentDisplayNameForExecution
        : (_id, fallback = "") => ctx.normalizeText(fallback);
      const workerProgressConversation = buildWorkerProgressMessage(targetRecord, targetRecord?.palId, "error", ctx.normalizeText(error?.message || error));
      void ctx.appendTaskProgressLogForTarget(targetKind, targetId, "worker_runtime", {
        planId: ctx.resolveTargetPlanId(collection.find((item) => item.id === targetId)),
        actualActor: "worker",
        displayActor: "Resident",
        status: "error",
        messageJa: workerProgressConversation.messageJa,
        messageEn: workerProgressConversation.messageEn,
        payload: {
          assigneePalId: ctx.normalizeText(targetRecord?.palId),
          assigneeDisplayName: residentDisplayName(targetRecord?.palId, targetRecord?.palId),
          taskTitle: ctx.normalizeText(targetRecord?.title),
          taskDescription: ctx.normalizeText(targetRecord?.description || targetRecord?.instruction),
          errorText: ctx.normalizeText(error?.message || error),
        },
      });
      ctx.rerenderAll();
    }
  }

  const api = {
    resetGateRuntimeState,
    renderGateRuntimeSuggestion,
    requestGateRuntimeReviewSuggestion,
    executeGateRuntimeReview,
    summarizeRuntimeReplay,
    executePalRuntimeForTarget,
  };

  scope.ExecutionRuntimeReviewUi = api;
  if (scope.window && typeof scope.window === "object") {
    scope.window.ExecutionRuntimeReviewUi = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
