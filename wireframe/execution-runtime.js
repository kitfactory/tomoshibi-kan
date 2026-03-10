(function attachExecutionRuntimeUi(scope) {
  let autoExecutionChain = Promise.resolve();

  function enqueueAutoExecution(work) {
    autoExecutionChain = autoExecutionChain
      .then(() => Promise.resolve().then(work))
      .catch(() => {});
    return autoExecutionChain;
  }

  function findResidentProfileById(ctx, profileId) {
    const normalizedProfileId = ctx.normalizeText(profileId);
    if (!normalizedProfileId) return null;
    return ctx.palProfiles.find((profile) => profile.id === normalizedProfileId) || null;
  }

  function residentDisplayName(ctx, profileId, fallback = "") {
    const profile = findResidentProfileById(ctx, profileId);
    return ctx.normalizeText(profile?.displayName || fallback || profileId);
  }

  function residentAddressName(ctx, profileId, fallback = "") {
    const display = residentDisplayName(ctx, profileId, fallback);
    if (!display) return "";
    return /さん$/.test(display) ? display : `${display}さん`;
  }

  function summarizeConversationIntent(ctx, text, fallback = "") {
    const normalized = ctx.normalizeText(text || fallback);
    if (!normalized) return "";
    const compact = normalized.replace(/\s+/g, " ");
    if (compact.length <= 72) return compact;
    return `${compact.slice(0, 69)}...`;
  }

  function firstMeaningfulLine(ctx, text) {
    const normalized = ctx.normalizeText(text);
    if (!normalized) return "";
    const line = normalized.split(/\r?\n/).map((item) => ctx.normalizeText(item)).find(Boolean) || "";
    if (!line) return "";
    return line.length <= 88 ? line : `${line.slice(0, 85)}...`;
  }

  function buildDispatchConversationMessage(ctx, target, workerId, routingExplanation) {
    const requestLine = summarizeConversationIntent(ctx, target?.title, target?.description || target?.instruction || target?.title);
    const workerAddress = residentAddressName(ctx, workerId, workerId);
    const workerDisplay = residentDisplayName(ctx, workerId, workerId);
    const routingNote = ctx.normalizeText(routingExplanation?.ja);
    return {
      messageJa: routingNote
        ? `${workerAddress}、${requestLine}をお願いします。${routingNote}。`
        : `${workerAddress}、${requestLine}をお願いします。`,
      messageEn: routingNote
        ? `${workerDisplay}, please handle "${requestLine}". ${routingNote}.`
        : `${workerDisplay}, please handle "${requestLine}".`,
    };
  }

  function buildRerouteConversationMessage(ctx, target, fromWorkerId, toWorkerId) {
    const requestLine = summarizeConversationIntent(ctx, target?.title, target?.description || target?.instruction || target?.title);
    const fromDisplay = residentDisplayName(ctx, fromWorkerId, fromWorkerId);
    const toAddress = residentAddressName(ctx, toWorkerId, toWorkerId);
    const toDisplay = residentDisplayName(ctx, toWorkerId, toWorkerId);
    return {
      messageJa: `${fromDisplay}よりも${toAddress}の方が合いそうです。${requestLine}をお願いし直します。`,
      messageEn: `${toDisplay} is a better fit than ${fromDisplay}. Reassigning "${requestLine}".`,
    };
  }

  function buildGateHandOffConversationMessage(ctx, target, gateProfileId, gateExplanation) {
    const requestLine = summarizeConversationIntent(ctx, target?.title, target?.description || target?.instruction || target?.title);
    const gateDisplay = residentDisplayName(ctx, gateProfileId, gateProfileId) || (ctx.locale === "ja" ? "古参住人" : "Gate");
    const routingNote = ctx.normalizeText(gateExplanation?.ja);
    return {
      messageJa: routingNote
        ? `${gateDisplay}にも見てもらいます。${requestLine}について、ここまでの結果を渡します。${routingNote}。`
        : `${gateDisplay}にも見てもらいます。${requestLine}について、ここまでの結果を渡します。`,
      messageEn: routingNote
        ? `Handing "${requestLine}" to ${gateDisplay} for review. ${routingNote}.`
        : `Handing "${requestLine}" to ${gateDisplay} for review.`,
    };
  }

  function buildResubmitConversationMessage(ctx, target, gateProfileId) {
    const requestLine = summarizeConversationIntent(ctx, target?.title, target?.description || target?.instruction || target?.title);
    const gateDisplay = residentDisplayName(ctx, gateProfileId, gateProfileId) || (ctx.locale === "ja" ? "古参住人" : "Gate");
    return {
      messageJa: `${gateDisplay}からの指摘を踏まえて手直ししました。${requestLine}をもう一度見てもらいます。`,
      messageEn: `The requested fixes are in. Sending "${requestLine}" back to ${gateDisplay}.`,
    };
  }

  function buildWorkerProgressConversationMessage(ctx, target, workerId, status, evidenceText) {
    const workerDisplay = residentDisplayName(ctx, workerId, workerId);
    const requestLine = summarizeConversationIntent(ctx, target?.title, target?.description || target?.instruction || target?.title);
    const evidenceLine = firstMeaningfulLine(ctx, evidenceText);
    if (status === "error" || status === "blocked") {
      return {
        messageJa: `${workerDisplay}です。${requestLine}を進めていて少し詰まりました。${evidenceLine || "いったん状況を共有します。"}`,
        messageEn: `${workerDisplay}: I hit a blocker while working on "${requestLine}". ${evidenceLine || "Sharing the current status."}`,
      };
    }
    return {
      messageJa: `${workerDisplay}です。${requestLine}ができました。${evidenceLine || "ひとまず結果をまとめました。"}`,
      messageEn: `${workerDisplay}: I finished "${requestLine}". ${evidenceLine || "I summarized the result."}`,
    };
  }

  function buildGateReviewConversationMessage(ctx, target, gateProfileId, gateResult, status) {
    const gateDisplay = residentDisplayName(ctx, gateProfileId, gateProfileId) || (ctx.locale === "ja" ? "真壁" : "Gate");
    const requestLine = summarizeConversationIntent(ctx, target?.title, target?.description || target?.instruction || target?.title);
    const reason = firstMeaningfulLine(ctx, gateResult?.reason);
    const firstFix = Array.isArray(gateResult?.fixes) ? firstMeaningfulLine(ctx, gateResult.fixes[0]) : "";
    if (status === "rejected") {
      return {
        messageJa: `${gateDisplay}です。${requestLine}は、このままだとまだ甘いかな。${reason || firstFix || "もう少し整えてから見せてほしいですね。"}`,
        messageEn: `${gateDisplay}: "${requestLine}" is not ready yet. ${reason || firstFix || "Please tighten it up and show it again."}`,
      };
    }
    return {
      messageJa: `${gateDisplay}です。${requestLine}なら、いいじゃないか。${reason || "この形で進めてよさそうです。"}`,
      messageEn: `${gateDisplay}: "${requestLine}" looks good. ${reason || "This is ready to move forward."}`,
    };
  }

  function buildPlanCompletedConversationMessage(ctx, planId) {
    const samePlanTasks = ctx.tasks.filter((item) => ctx.resolveTargetPlanId(item) === ctx.normalizeText(planId));
    const writerTask = samePlanTasks.find((item) => ctx.normalizeText(item.palId) === "pal-delta") || samePlanTasks[samePlanTasks.length - 1] || null;
    const writerSummary = firstMeaningfulLine(ctx, writerTask?.evidence);
    const titles = samePlanTasks.map((item) => summarizeConversationIntent(ctx, item.title)).filter(Boolean);
    const joinedTitles = titles.slice(0, 3).join("、");
    return {
      messageJa: writerSummary
        ? `${joinedTitles || "依頼"}まで形になりました。${writerSummary}`
        : `${joinedTitles || "依頼"}まで進みました。ひとまず、今の形でお返しできます。`,
      messageEn: writerSummary
        ? `${joinedTitles || "The request"} is now in shape. ${writerSummary}`
        : `${joinedTitles || "The request"} is ready to return in its current form.`,
    };
  }

  function createTaskRecord(ctx, input) {
    return {
      id: input.id,
      planId: ctx.normalizeText(input?.planId) || "PLAN-001",
      projectId: ctx.normalizeText(input?.projectId),
      projectName: ctx.normalizeText(input?.projectName),
      projectDirectory: ctx.normalizeText(input?.projectDirectory),
      title: input.title,
      description: input.description,
      palId: input.palId,
      status: "assigned",
      updatedAt: ctx.formatNow(),
      decisionSummary: "-",
      constraintsCheckResult: "pass",
      evidence: "-",
      replay: "-",
      fixCondition: "-",
    };
  }

  function resolveExecutionRuntimeRoutingApi() {
    return scope.ExecutionRuntimeRoutingUi || scope.window?.ExecutionRuntimeRoutingUi || null;
  }

  function resolveExecutionRuntimePlanApi() {
    return scope.ExecutionRuntimePlanUi || scope.window?.ExecutionRuntimePlanUi || null;
  }

  function resolveExecutionRuntimeReviewApi() {
    return scope.ExecutionRuntimeReviewUi || scope.window?.ExecutionRuntimeReviewUi || null;
  }

  function buildRoutingExecutionContext(ctx) {
    return {
      ...ctx,
      summarizeConversationIntentForExecution: (text, fallback = "") => summarizeConversationIntent(ctx, text, fallback),
    };
  }

  function buildPlanExecutionContext(ctx) {
    return {
      ...ctx,
      createTaskRecordForExecution: (input) => createTaskRecord(ctx, input),
      residentDisplayNameForExecution: (workerId, fallback = "") => residentDisplayName(ctx, workerId, fallback),
      buildDispatchConversationMessageForExecution: (target, workerId, routingExplanation) => buildDispatchConversationMessage(ctx, target, workerId, routingExplanation),
      buildRerouteConversationMessageForExecution: (target, fromWorkerId, toWorkerId) => buildRerouteConversationMessage(ctx, target, fromWorkerId, toWorkerId),
      buildPlanOrchestratorRoutingApiForExecution: (baseRoutingApi) => buildPlanOrchestratorRoutingApi(ctx, baseRoutingApi),
    };
  }

  function buildReviewExecutionContext(ctx) {
    return {
      ...ctx,
      residentDisplayNameForExecution: (workerId, fallback = "") => residentDisplayName(ctx, workerId, fallback),
      summarizeConversationIntentForExecution: (text, fallback = "") => summarizeConversationIntent(ctx, text, fallback),
      firstMeaningfulLineForExecution: (text) => firstMeaningfulLine(ctx, text),
      buildWorkerProgressConversationMessageForExecution: (target, workerId, status, evidenceText) => buildWorkerProgressConversationMessage(ctx, target, workerId, status, evidenceText),
      buildGateReviewConversationMessageForExecution: (target, gateProfileId, gateResult, status) => buildGateReviewConversationMessage(ctx, target, gateProfileId, gateResult, status),
    };
  }

  function buildGuideRoutingOperatingRulesPrompt(ctx, localeValue) {
    const routingApi = resolveExecutionRuntimeRoutingApi();
    return routingApi && typeof routingApi.buildGuideRoutingOperatingRulesPrompt === "function"
      ? routingApi.buildGuideRoutingOperatingRulesPrompt(buildRoutingExecutionContext(ctx), localeValue)
      : "";
  }

  function buildGuideRoutingUserText(ctx, routingInput) {
    const routingApi = resolveExecutionRuntimeRoutingApi();
    return routingApi && typeof routingApi.buildGuideRoutingUserText === "function"
      ? routingApi.buildGuideRoutingUserText(buildRoutingExecutionContext(ctx), routingInput)
      : "";
  }

  function requestGuideDrivenWorkerRoutingDecision(ctx, params = {}) {
    const routingApi = resolveExecutionRuntimeRoutingApi();
    return routingApi && typeof routingApi.requestGuideDrivenWorkerRoutingDecision === "function"
      ? routingApi.requestGuideDrivenWorkerRoutingDecision(buildRoutingExecutionContext(ctx), params)
      : Promise.resolve(null);
  }

  function buildPlanOrchestratorRoutingApi(ctx, baseRoutingApi) {
    const routingApi = resolveExecutionRuntimeRoutingApi();
    return routingApi && typeof routingApi.buildPlanOrchestratorRoutingApi === "function"
      ? routingApi.buildPlanOrchestratorRoutingApi(buildRoutingExecutionContext(ctx), baseRoutingApi)
      : baseRoutingApi || null;
  }

  function createPlannedTasksFromGuideRequest(ctx, userText) {
    const planApi = resolveExecutionRuntimePlanApi();
    return planApi && typeof planApi.createPlannedTasksFromGuideRequest === "function"
      ? planApi.createPlannedTasksFromGuideRequest(buildPlanExecutionContext(ctx), userText)
      : Promise.resolve({ created: 0 });
  }

  function createPlannedTasksFromGuidePlan(ctx, plan, options = {}) {
    const planApi = resolveExecutionRuntimePlanApi();
    return planApi && typeof planApi.createPlannedTasksFromGuidePlan === "function"
      ? planApi.createPlannedTasksFromGuidePlan(buildPlanExecutionContext(ctx), plan, options)
      : Promise.resolve({ created: 0 });
  }

  function materializeApprovedPlanArtifact(ctx, artifact) {
    const planApi = resolveExecutionRuntimePlanApi();
    return planApi && typeof planApi.materializeApprovedPlanArtifact === "function"
      ? planApi.materializeApprovedPlanArtifact(buildPlanExecutionContext(ctx), artifact)
      : Promise.resolve({ created: 0 });
  }

  function buildGuideReplanUserText(ctx, targetKind, target, planArtifact, gateResult) {
    const routingApi = resolveExecutionRuntimeRoutingApi();
    return routingApi && typeof routingApi.buildGuideReplanUserText === "function"
      ? routingApi.buildGuideReplanUserText(buildRoutingExecutionContext(ctx), targetKind, target, planArtifact, gateResult)
      : "";
  }

  function executeGuideDrivenReplanForTarget(ctx, targetKind, target, gateResult) {
    const routingApi = resolveExecutionRuntimeRoutingApi();
    return routingApi && typeof routingApi.executeGuideDrivenReplanForTarget === "function"
      ? routingApi.executeGuideDrivenReplanForTarget({
        ...buildRoutingExecutionContext(ctx),
        appendPlanArtifactWithFallback: (...args) => ctx.appendPlanArtifactWithFallback(...args),
        materializeApprovedPlanArtifact: (artifact) => materializeApprovedPlanArtifact(ctx, artifact),
        queueAutoExecutionForCreatedTargets: (created) => ctx.queueAutoExecutionForCreatedTargets(created),
      }, targetKind, target, gateResult)
      : Promise.resolve(null);
  }

  function resetGateRuntimeState(ctx) {
    const reviewApi = resolveExecutionRuntimeReviewApi();
    if (reviewApi && typeof reviewApi.resetGateRuntimeState === "function") {
      reviewApi.resetGateRuntimeState(buildReviewExecutionContext(ctx));
    }
  }

  function renderGateRuntimeSuggestion(ctx) {
    const reviewApi = resolveExecutionRuntimeReviewApi();
    if (reviewApi && typeof reviewApi.renderGateRuntimeSuggestion === "function") {
      reviewApi.renderGateRuntimeSuggestion(buildReviewExecutionContext(ctx));
    }
  }

  function requestGateRuntimeReviewSuggestion(ctx, target, targetKind = "task", gateProfile = null) {
    const reviewApi = resolveExecutionRuntimeReviewApi();
    return reviewApi && typeof reviewApi.requestGateRuntimeReviewSuggestion === "function"
      ? reviewApi.requestGateRuntimeReviewSuggestion(buildReviewExecutionContext(ctx), target, targetKind, gateProfile)
      : Promise.resolve(null);
  }

  function executeGateRuntimeReview(ctx, target, targetKind = "task", gateProfile = null) {
    const reviewApi = resolveExecutionRuntimeReviewApi();
    return reviewApi && typeof reviewApi.executeGateRuntimeReview === "function"
      ? reviewApi.executeGateRuntimeReview(buildReviewExecutionContext(ctx), target, targetKind, gateProfile)
      : Promise.resolve();
  }

  function summarizeRuntimeReplay(ctx, toolCalls) {
    const reviewApi = resolveExecutionRuntimeReviewApi();
    return reviewApi && typeof reviewApi.summarizeRuntimeReplay === "function"
      ? reviewApi.summarizeRuntimeReplay(buildReviewExecutionContext(ctx), toolCalls)
      : "";
  }

  function executePalRuntimeForTarget(ctx, targetId, targetKind = "task") {
    const reviewApi = resolveExecutionRuntimeReviewApi();
    return reviewApi && typeof reviewApi.executePalRuntimeForTarget === "function"
      ? reviewApi.executePalRuntimeForTarget(buildReviewExecutionContext(ctx), targetId, targetKind)
      : Promise.resolve();
  }

  const api = {
    enqueueAutoExecution,
    findResidentProfileById,
    residentDisplayName,
    residentAddressName,
    summarizeConversationIntent,
    firstMeaningfulLine,
    buildDispatchConversationMessage,
    buildRerouteConversationMessage,
    buildGateHandOffConversationMessage,
    buildResubmitConversationMessage,
    buildWorkerProgressConversationMessage,
    buildGateReviewConversationMessage,
    buildPlanCompletedConversationMessage,
    buildGuideRoutingOperatingRulesPrompt,
    buildGuideRoutingUserText,
    requestGuideDrivenWorkerRoutingDecision,
    buildPlanOrchestratorRoutingApi,
    createTaskRecord,
    createPlannedTasksFromGuideRequest,
    createPlannedTasksFromGuidePlan,
    materializeApprovedPlanArtifact,
    buildGuideReplanUserText,
    executeGuideDrivenReplanForTarget,
    resetGateRuntimeState,
    renderGateRuntimeSuggestion,
    requestGateRuntimeReviewSuggestion,
    executeGateRuntimeReview,
    summarizeRuntimeReplay,
    executePalRuntimeForTarget,
  };

  scope.ExecutionRuntimeUi = api;
  if (scope.window && typeof scope.window === "object") {
    scope.window.ExecutionRuntimeUi = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
