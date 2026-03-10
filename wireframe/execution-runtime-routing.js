(function attachExecutionRuntimeRoutingUi(scope) {
  function buildGuideRoutingOperatingRulesPrompt(ctx, localeValue) {
    const isJa = localeValue !== "en";
    return isJa
      ? [
        "あなたは灯火館の管理人として、住人への割り当て判断だけを行います。",
        "- 入力の task と候補住人一覧だけを見て、最も適した住人を 1 人選ぶ。",
        "- 候補外の住人は選ばない。",
        "- 各住人の ROLE.md 全文を最も重要な根拠として読み、Mission, 得意な依頼, 得意な作成物, Inputs, Outputs, Done Criteria, Constraints, Hand-off Rules を比較する。",
        "- capability summary は『その住人が今ここで実行できること』として使い、ROLE と矛盾しない候補を選ぶ。",
        "- software や codebase の task では、調査・再現・原因分析・修正・guard 追加・再発防止をまとめてプログラマの担当として考える。",
        "- settings、save、reload、state、model、file、patch、fix、validation のような software 文脈が見える時は、まずプログラマを選ぶ。",
        "- リサーチャーは、市場・競合・事例・利用者像・外部情報の調査や比較レポートに向く時だけ選び、software の不具合調査や修正には割り当てない。",
        "- 類似サービス、競合サービス、オンボーディング事例、導線比較、訴求比較のような外部サービス調査は、software という語が出ていてもリサーチャーを優先する。",
        "- resident の適性判断は ROLE.md 全文と capabilitySummary を優先し、displayName や印象で決めない。",
        "- `currentLoad` は補助材料として使うが、適性より優先しない。",
        "- 外部サービスや市場の調査 task では、まずリサーチャーを残し、プログラマは外してよい。",
        "- 適任が見当たらない時だけ `replan_required` を返す。",
        "- 返答は JSON schema に厳密に従い、余計な説明文を付けない。",
      ].join("\n")
      : [
        "As the Tomoshibi-kan manager, make only the resident assignment decision.",
        "- Choose exactly one resident from the provided candidates for the task.",
        "- Never choose a resident outside the provided candidates.",
        "- Read each resident's full ROLE.md contract as the primary source of fitness.",
        "- Compare Mission, preferred requests, preferred outputs, Inputs, Outputs, Done Criteria, Constraints, and Hand-off Rules before deciding.",
        "- Use capability summary as evidence of what the resident can execute right now.",
        "- For software or codebase work, treat investigation, reproduction, root-cause analysis, fixes, guard additions, and regression prevention as programmer work.",
        "- If the task mentions settings, save, reload, state, model, file, patch, fix, or validation in a software context, choose the programmer first.",
        "- Choose the researcher only for market research, competitive comparison, user insight, or external-information reports, and never for software bug investigation or fixes.",
        "- If the task is about similar services, competitor services, onboarding examples, flow comparisons, or messaging comparisons, prefer the researcher even when software products are mentioned.",
        "- Before selecting, eliminate candidates whose role contract says they do not handle this kind of work.",
        "- For software or codebase work, eliminate the researcher first and compare the remaining candidates.",
        "- For external research or marketing work, eliminate the programmer first and compare the remaining candidates.",
        "- Choose the writer only when the main job is wording, summary, naming, documentation, or audience-facing explanation.",
        "- Use the full ROLE.md contract and capabilitySummary as the primary decision source, and never decide by display name or impression.",
        "- Treat currentLoad as a secondary signal, not stronger than fitness.",
        "- Return `replan_required` only when none of the candidates is a reasonable fit.",
        "- Follow the JSON schema strictly and do not add extra prose.",
      ].join("\n");
  }

  function buildGuideRoutingUserText(ctx, routingInput) {
    const baseRoutingApi = ctx.resolveAgentRoutingApi();
    const rawPayload = routingInput && typeof routingInput === "object" ? routingInput : {};
    const payload = baseRoutingApi && typeof baseRoutingApi.buildWorkerRoutingLlmInput === "function"
      ? baseRoutingApi.buildWorkerRoutingLlmInput(rawPayload)
      : rawPayload;
    return [
      "Select the best resident for this task from the provided candidates.",
      "First eliminate candidates whose role contract clearly says they should not handle this kind of work.",
      "Then compare the remaining candidates and select the best fit.",
      "Return only the structured routing decision.",
      ctx.safeStringify(payload, "{}"),
    ].join("\n\n");
  }

  async function requestGuideDrivenWorkerRoutingDecision(ctx, params = {}) {
    const baseRoutingApi = ctx.resolveAgentRoutingApi();
    if (!baseRoutingApi || typeof baseRoutingApi.buildWorkerRoutingInput !== "function" || typeof baseRoutingApi.parseRoutingDecisionResponse !== "function" || typeof baseRoutingApi.buildRoutingDecisionResponseFormat !== "function") {
      return null;
    }
    const runtimeApi = ctx.resolveTomoshibikanCoreRuntimeApi();
    if (!runtimeApi || typeof runtimeApi.guideChat !== "function") return null;
    const guideState = ctx.resolveGuideModelStateWithFallback();
    if (!guideState?.ready) return null;
    const guideProfile = ctx.getActiveGuideProfile();
    if (!guideProfile) return null;
    const guideIdentity = await ctx.loadAgentIdentityForPal(guideProfile);
    const runtimeKind = ctx.normalizeText(guideState.runtimeKind) === "tool" ? "tool" : "model";
    const runtimeConfig = runtimeKind === "model" ? ctx.resolveGuideApiRuntimeConfig(guideState) : null;
    if (runtimeKind === "model" && (!runtimeConfig || !runtimeConfig.modelName)) return null;
    const routingInput = baseRoutingApi.buildWorkerRoutingInput({
      targetType: "task",
      targetId: `plan:${ctx.normalizeText(params?.artifact?.planId) || "PLAN-001"}:task:${Number(params?.index) + 1}`,
      planId: ctx.normalizeText(params?.artifact?.planId),
      goal: ctx.normalizeText(params?.artifact?.plan?.goal),
      expectedOutput: ctx.normalizeText(params?.taskPlan?.expectedOutput || params?.artifact?.plan?.completionDefinition),
      constraints: Array.isArray(params?.artifact?.plan?.constraints) ? params.artifact.plan.constraints : [],
      requiredSkills: Array.isArray(params?.taskPlan?.requiredSkills) ? params.taskPlan.requiredSkills : [],
      needsEvidence: /research|review/.test(String(params?.taskPlan?.title || "").toLowerCase()),
      scopeRisk: "medium",
      taskDraft: params?.taskDraft,
      workers: params?.workers,
      assignmentCounts: params?.assignmentCounts,
      historySummary: [],
    });
    if (!Array.isArray(routingInput.candidateResidents) || routingInput.candidateResidents.length === 0) {
      return null;
    }
    const responseFormat = baseRoutingApi.buildRoutingDecisionResponseFormat(ctx.locale);
    const systemPrompt = ctx.buildFallbackIdentitySystemPrompt(buildGuideRoutingOperatingRulesPrompt(ctx, ctx.locale), guideIdentity);
    const resolvedApiKey = runtimeKind === "model"
      ? await ctx.resolveStoredModelApiKeyWithFallback(runtimeConfig.modelName, runtimeConfig.apiKey)
      : "";
    try {
      const payload = await runtimeApi.guideChat({
        runtimeKind,
        toolName: runtimeKind === "tool" ? ctx.normalizeText(guideState.toolName) : "",
        provider: runtimeConfig?.provider || "",
        modelName: runtimeConfig?.modelName || "",
        baseUrl: runtimeConfig?.baseUrl || "",
        apiKey: resolvedApiKey,
        userText: buildGuideRoutingUserText(ctx, routingInput),
        systemPrompt,
        messages: [],
        responseFormat,
        enabledSkillIds: await ctx.resolveGuideConfiguredSkillIds(),
        workspaceRoot: ctx.resolveRuntimeWorkspaceRootForChat(),
        debugMeta: {
          stage: "orchestrator_routing",
          agentRole: "guide",
          agentId: ctx.normalizeText(guideProfile.id),
          targetKind: "task",
          targetId: routingInput.targetId,
          identityVersions: ctx.buildDebugIdentityVersions(guideIdentity),
        },
      });
      const parsed = baseRoutingApi.parseRoutingDecisionResponse(payload?.text || "", {
        allowedResidentIds: routingInput.candidateResidents.map((entry) => entry.residentId),
      });
      if (!parsed?.ok || !parsed.decision) return null;
      if (parsed.decision.confidence === "low") return null;
      return {
        workerId: parsed.decision.selectedResidentId,
        matchedSkills: [],
        matchedRoleTerms: [parsed.decision.fallbackAction === "reroute" ? "guide_reroute" : "guide_routing"],
        decisionSource: parsed.decision.fallbackAction === "reroute" ? "guide_reroute" : "guide_routing",
        decisionReason: parsed.decision.reason,
        decisionConfidence: parsed.decision.confidence,
        fallbackAction: parsed.decision.fallbackAction,
      };
    } catch (_error) {
      return null;
    }
  }

  function buildPlanOrchestratorRoutingApi(ctx, baseRoutingApi) {
    if (!baseRoutingApi) return null;
    return {
      ...baseRoutingApi,
      selectWorkerForTaskWithGuideDecision: async (input) => requestGuideDrivenWorkerRoutingDecision(ctx, input),
    };
  }

  function buildGuideReplanUserText(ctx, targetKind, target, planArtifact, gateResult) {
    const targetLabel = targetKind === "job" ? "job" : "task";
    const payload = {
      targetKind,
      targetId: ctx.normalizeText(target?.id),
      targetTitle: ctx.normalizeText(target?.title),
      currentInstruction: ctx.normalizeText(target?.description || target?.instruction),
      currentPlanId: ctx.normalizeText(planArtifact?.planId || ctx.resolveTargetPlanId(target)),
      previousPlan: planArtifact?.plan && typeof planArtifact.plan === "object" ? planArtifact.plan : null,
      gateResult: gateResult && typeof gateResult === "object"
        ? {
          decision: ctx.normalizeText(gateResult.decision),
          reason: ctx.normalizeText(gateResult.reason),
          fixes: Array.isArray(gateResult.fixes) ? gateResult.fixes : [],
        }
        : null,
    };
    return [
      `Replan the current ${targetLabel}.`,
      "The previous execution was rejected and requires a revised plan.",
      "Return a valid Guide plan response. Keep the goal, revise tasks and constraints to address the rejection.",
      ctx.safeStringify(payload, "{}"),
    ].join("\n\n");
  }

  async function executeGuideDrivenReplanForTarget(ctx, targetKind, target, gateResult) {
    const guideState = ctx.resolveGuideModelStateWithFallback();
    if (!guideState?.ready || !target) return null;
    const currentPlanId = ctx.resolveTargetPlanId(target);
    const planArtifact = await ctx.findPlanArtifactByIdWithFallback(currentPlanId);
    const replanUserText = buildGuideReplanUserText(ctx, targetKind, target, planArtifact, gateResult);
    const contextBuild = await ctx.buildGuideContextWithFallback(replanUserText);
    const modelReply = await ctx.requestGuideModelReplyWithFallback(replanUserText, guideState, contextBuild);
    const parsedPlanResponse = ctx.parseGuidePlanResponseWithFallback(modelReply?.text || "", {
      planningIntent: "replan_required",
      planningReadiness: "replan_required",
      projectContext: contextBuild?.context,
      locale: ctx.locale,
    });
    if (!parsedPlanResponse?.ok || parsedPlanResponse.status !== "plan_ready" || !parsedPlanResponse.plan) {
      const replyText = ctx.normalizeText(parsedPlanResponse?.reply || modelReply?.text);
      await ctx.appendTaskProgressLogForTarget(targetKind, ctx.normalizeText(target.id), "replan_required", {
        planId: currentPlanId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "pending",
        messageJa: replyText || `${target.id} の再計画には、もう少し確認が必要です。`,
        messageEn: replyText || `${target.id} still needs more clarification before replanning.`,
        payload: {
          gateResult,
        },
        sourceRunId: ctx.normalizeText(modelReply?.runId),
      });
      ctx.rerenderAll();
      return null;
    }
    const nextArtifact = await ctx.appendPlanArtifactWithFallback({
      status: "approved",
      replyText: parsedPlanResponse.reply,
      plan: parsedPlanResponse.plan,
      sourceRunId: ctx.normalizeText(modelReply?.runId),
    });
    const created = await ctx.materializeApprovedPlanArtifact(nextArtifact);
    void ctx.queueAutoExecutionForCreatedTargets(created);
    const summarizeIntent = typeof ctx.summarizeConversationIntentForExecution === "function"
      ? ctx.summarizeConversationIntentForExecution
      : (_value, fallback = "") => ctx.normalizeText(fallback);
    await ctx.appendTaskProgressLogForTarget(targetKind, ctx.normalizeText(target.id), "replanned", {
      planId: currentPlanId,
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: `${summarizeIntent(target?.title, target?.description || target?.instruction)}を組み直しました。新しい段取りで住人に引き継ぎます。`,
      messageEn: `${summarizeIntent(target?.title, target?.description || target?.instruction)} was replanned and handed off with a revised path.`,
      payload: {
        previousPlanId: currentPlanId,
        nextPlanId: ctx.normalizeText(nextArtifact?.planId),
        createdCount: Number(created?.created || 0),
        taskTitle: ctx.normalizeText(target?.title),
        taskDescription: ctx.normalizeText(target?.description || target?.instruction),
        gateResult,
      },
      sourceRunId: ctx.normalizeText(modelReply?.runId),
    });
    ctx.rerenderAll();
    return {
      nextPlanId: ctx.normalizeText(nextArtifact?.planId),
      createdCount: Number(created?.created || 0),
    };
  }

  const api = {
    buildGuideRoutingOperatingRulesPrompt,
    buildGuideRoutingUserText,
    requestGuideDrivenWorkerRoutingDecision,
    buildPlanOrchestratorRoutingApi,
    buildGuideReplanUserText,
    executeGuideDrivenReplanForTarget,
  };

  scope.ExecutionRuntimeRoutingUi = api;
  if (scope.window && typeof scope.window === "object") {
    scope.window.ExecutionRuntimeRoutingUi = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
