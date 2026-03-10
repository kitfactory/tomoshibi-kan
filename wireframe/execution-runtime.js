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

  async function createPlannedTasksFromGuideRequest(ctx, userText) {
    const planner = ctx.resolveGuideTaskPlannerApi();
    if (!planner) return { created: 0 };
    const workers = await ctx.resolveWorkerAssignmentProfiles();
    if (workers.length === 0) return { created: 0 };
    const taskDrafts = planner.buildTaskDraftsFromRequest({
      userText,
      maxTasks: 3,
    });
    if (!Array.isArray(taskDrafts) || taskDrafts.length === 0) return { created: 0 };
    const assignments = planner.assignTasksToWorkers({
      taskDrafts,
      workers,
    });
    if (!Array.isArray(assignments) || assignments.length === 0) return { created: 0 };
    let sequence = ctx.nextTaskSequenceNumber();
    const created = [];
    assignments.forEach((assignment, index) => {
      const fallbackWorker = workers[index % workers.length];
      const palId = ctx.normalizeText(assignment?.workerId || fallbackWorker?.id);
      if (!palId) return;
      const draft = assignment?.taskDraft || {};
      const id = `TASK-${String(sequence).padStart(3, "0")}`;
      sequence += 1;
      const task = createTaskRecord(ctx, {
        id,
        title: ctx.normalizeText(draft.title) || `${id} Task`,
        description: ctx.normalizeText(draft.description) || ctx.normalizeText(userText),
        palId,
      });
      ctx.tasks.push(task);
      created.push(task);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(assignment?.explanation);
      const conversation = buildDispatchConversationMessage(ctx, task, palId, routingExplanation);
      ctx.appendEvent("dispatch", task.id, "ok", conversation.messageJa, conversation.messageEn);
      void ctx.appendTaskProgressLogForTarget("task", task.id, "dispatch", {
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: conversation.messageJa,
        messageEn: conversation.messageEn,
        payload: {
          workerId: palId,
          workerDisplayName: residentDisplayName(ctx, palId, palId),
          taskTitle: task.title,
          taskDescription: task.description,
          routingExplanation,
        },
      });
    });
    if (created.length > 0 && !ctx.getSelectedTaskId()) {
      ctx.setSelectedTaskId(created[0].id);
    }
    ctx.renderTaskBoard();
    ctx.writeBoardStateSnapshot();
    return { created: created.length };
  }

  async function createPlannedTasksFromGuidePlan(ctx, plan, options = {}) {
    const normalizedPlan = plan && typeof plan === "object" ? plan : null;
    const taskList = Array.isArray(normalizedPlan?.tasks) ? normalizedPlan.tasks : [];
    const jobList = Array.isArray(normalizedPlan?.jobs) ? normalizedPlan.jobs : [];
    const project = normalizedPlan?.project && typeof normalizedPlan.project === "object" ? normalizedPlan.project : null;
    if (taskList.length === 0 && jobList.length === 0) return { created: 0 };
    const planId = ctx.normalizeText(options.planId) || "PLAN-001";
    const workers = await ctx.resolveWorkerAssignmentProfiles();
    if (workers.length === 0) return { created: 0 };
    const routingApi = ctx.resolveAgentRoutingApi();
    const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
    let taskSequence = ctx.nextTaskSequenceNumber();
    let jobSequence = ctx.nextJobSequenceNumber();
    const createdTasks = [];
    const createdJobs = [];

    taskList.forEach((taskPlan, index) => {
      const explicitWorker = workers.find((worker) => worker.id === ctx.normalizeText(taskPlan?.assigneePalId)) || null;
      const taskDraft = {
        title: ctx.normalizeText(taskPlan?.title) || `Task ${index + 1}`,
        description: ctx.normalizeText(taskPlan?.description),
      };
      if (!taskDraft.description) return;

      let workerId = ctx.normalizeText(explicitWorker?.id);
      let explanation = null;
      if (workerId) {
        explanation = {
          matchedRoleTerms: ["explicit_assignee"],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedSkills: [],
        };
      } else if (routingApi && typeof routingApi.selectWorkerForTask === "function") {
        const selected = routingApi.selectWorkerForTask({
          taskDraft,
          workers,
          assignmentCounts,
          requiredSkills: Array.isArray(taskPlan?.requiredSkills) ? taskPlan.requiredSkills : [],
        });
        workerId = ctx.normalizeText(selected?.workerId);
        explanation = {
          matchedSkills: Array.isArray(selected?.matchedSkills) ? selected.matchedSkills : [],
          matchedResidentFocus: Array.isArray(selected?.matchedResidentFocus) ? selected.matchedResidentFocus : [],
          matchedPreferredOutputs: Array.isArray(selected?.matchedPreferredOutputs) ? selected.matchedPreferredOutputs : [],
          matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
        };
      }
      if (!workerId) {
        workerId = ctx.normalizeText(workers[index % workers.length]?.id);
        explanation = {
          matchedSkills: [],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedRoleTerms: [],
        };
      }
      if (!workerId) return;

      assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
      const id = `TASK-${String(taskSequence).padStart(3, "0")}`;
      taskSequence += 1;
      const task = createTaskRecord(ctx, {
        id,
        planId,
        projectId: ctx.normalizeText(project?.id),
        projectName: ctx.normalizeText(project?.name),
        projectDirectory: ctx.normalizeText(project?.directory),
        title: taskDraft.title,
        description: taskDraft.description,
        palId: workerId,
      });
      ctx.tasks.push(task);
      createdTasks.push(task);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(explanation);
      const workerDisplayName = residentDisplayName(ctx, workerId, workerId);
      const summaryJa = routingExplanation.ja
        ? `${task.id} を ${workerDisplayName} に割り当てました (${routingExplanation.ja})。`
        : `${task.id} を ${workerDisplayName} に割り当てました。`;
      const summaryEn = routingExplanation.en
        ? `${task.id} dispatched to ${workerDisplayName} (${routingExplanation.en}).`
        : `${task.id} dispatched to ${workerDisplayName}.`;
      ctx.appendEvent("dispatch", task.id, "ok", summaryJa, summaryEn);
      void ctx.appendTaskProgressLogForTarget("task", task.id, "dispatch", {
        planId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: summaryJa,
        messageEn: summaryEn,
        payload: {
          workerId,
          routingExplanation,
        },
      });
    });

    jobList.forEach((jobPlan, index) => {
      const explicitWorker = workers.find((worker) => worker.id === ctx.normalizeText(jobPlan?.assigneePalId)) || null;
      const jobDraft = {
        title: ctx.normalizeText(jobPlan?.title) || `Job ${index + 1}`,
        description: ctx.normalizeText(jobPlan?.description),
        instruction: ctx.normalizeText(jobPlan?.instruction),
      };
      if (!jobDraft.description || !jobDraft.instruction) return;

      let workerId = ctx.normalizeText(explicitWorker?.id);
      let explanation = null;
      if (workerId) {
        explanation = {
          matchedRoleTerms: ["explicit_assignee"],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedSkills: [],
        };
      } else if (routingApi && typeof routingApi.selectWorkerForTask === "function") {
        const selected = routingApi.selectWorkerForTask({
          taskDraft: {
            title: jobDraft.title,
            description: `${jobDraft.description}\n${jobDraft.instruction}`,
          },
          workers,
          assignmentCounts,
          requiredSkills: Array.isArray(jobPlan?.requiredSkills) ? jobPlan.requiredSkills : [],
        });
        workerId = ctx.normalizeText(selected?.workerId);
        explanation = {
          matchedSkills: Array.isArray(selected?.matchedSkills) ? selected.matchedSkills : [],
          matchedResidentFocus: Array.isArray(selected?.matchedResidentFocus) ? selected.matchedResidentFocus : [],
          matchedPreferredOutputs: Array.isArray(selected?.matchedPreferredOutputs) ? selected.matchedPreferredOutputs : [],
          matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
        };
      }
      if (!workerId) {
        workerId = ctx.normalizeText(workers[index % workers.length]?.id);
        explanation = {
          matchedSkills: [],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedRoleTerms: [],
        };
      }
      if (!workerId) return;

      assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
      const id = `JOB-${String(jobSequence).padStart(3, "0")}`;
      jobSequence += 1;
      const createJobRecord = typeof ctx.createJobRecord === "function" ? ctx.createJobRecord : null;
      if (!createJobRecord) return;
      const job = createJobRecord({
        id,
        planId,
        projectId: ctx.normalizeText(project?.id),
        projectName: ctx.normalizeText(project?.name),
        projectDirectory: ctx.normalizeText(project?.directory),
        title: jobDraft.title,
        description: jobDraft.description,
        instruction: jobDraft.instruction,
        schedule: ctx.normalizeText(jobPlan?.schedule),
        palId: workerId,
      });
      ctx.jobs.push(job);
      createdJobs.push(job);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(explanation);
      const workerDisplayName = residentDisplayName(ctx, workerId, workerId);
      const summaryJa = routingExplanation.ja
        ? `${job.id} を ${workerDisplayName} に割り当てました (${routingExplanation.ja})。`
        : `${job.id} を ${workerDisplayName} に割り当てました。`;
      const summaryEn = routingExplanation.en
        ? `${job.id} dispatched to ${workerDisplayName} (${routingExplanation.en}).`
        : `${job.id} dispatched to ${workerDisplayName}.`;
      ctx.appendEvent("dispatch", job.id, "ok", summaryJa, summaryEn);
      void ctx.appendTaskProgressLogForTarget("job", job.id, "dispatch", {
        planId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: summaryJa,
        messageEn: summaryEn,
        payload: {
          workerId,
          routingExplanation,
        },
      });
    });

    if (createdTasks.length > 0 && !ctx.getSelectedTaskId()) {
      ctx.setSelectedTaskId(createdTasks[0].id);
    }
    ctx.renderTaskBoard();
    ctx.renderJobBoard();
    ctx.writeBoardStateSnapshot();
    return { created: createdTasks.length + createdJobs.length, createdTasks, createdJobs };
  }

  async function materializeApprovedPlanArtifact(ctx, artifact) {
    const normalizedPlanId = ctx.normalizeText(artifact?.planId);
    const status = ctx.normalizeText(artifact?.status || "approved");
    const plan = artifact?.plan && typeof artifact.plan === "object" ? artifact.plan : null;
    if (!normalizedPlanId || status !== "approved" || !plan) {
      return { created: 0 };
    }
    const orchestratorApi = ctx.resolvePlanOrchestratorApi();
    if (!orchestratorApi) {
      return createPlannedTasksFromGuidePlan(ctx, plan, {
        planId: normalizedPlanId,
      });
    }
    const workers = await ctx.resolveWorkerAssignmentProfiles();
    if (workers.length === 0) return { created: 0 };
    const routingApi = buildPlanOrchestratorRoutingApi(ctx, ctx.resolveAgentRoutingApi());
    const result = await orchestratorApi.materializePlanArtifact({
      artifact,
      workers,
      nextTaskSequence: ctx.nextTaskSequenceNumber(),
      nextJobSequence: ctx.nextJobSequenceNumber(),
      routingApi,
      buildTaskRecord: (input) => createTaskRecord(ctx, input),
      buildJobRecord: (input) => ctx.createJobRecord(input),
    });
    const createdTasks = Array.isArray(result?.createdTasks) ? result.createdTasks : [];
    const createdJobs = Array.isArray(result?.createdJobs) ? result.createdJobs : [];
    const created = [];
    createdTasks.forEach((entry) => {
      const task = entry?.task;
      if (!task || typeof task !== "object") return;
      ctx.tasks.push(task);
      created.push(task);
      const workerId = ctx.normalizeText(entry?.workerId || task.palId);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(entry?.explanation);
      const rerouteFromWorkerId = ctx.normalizeText(entry?.explanation?.rerouteFromWorkerId);
      const shouldLogReroute = ctx.normalizeText(entry?.explanation?.fallbackAction) === "reroute" && rerouteFromWorkerId && rerouteFromWorkerId !== workerId;
      if (shouldLogReroute) {
        const rerouteConversation = buildRerouteConversationMessage(ctx, task, rerouteFromWorkerId, workerId);
        ctx.appendEvent("dispatch", task.id, "reroute", rerouteConversation.messageJa, rerouteConversation.messageEn);
        void ctx.appendTaskProgressLogForTarget("task", task.id, "reroute", {
          planId: normalizedPlanId,
          actualActor: "orchestrator",
          displayActor: "Guide",
          status: "ok",
          messageJa: rerouteConversation.messageJa,
          messageEn: rerouteConversation.messageEn,
          payload: {
            fromWorkerId: rerouteFromWorkerId,
            fromWorkerDisplayName: residentDisplayName(ctx, rerouteFromWorkerId, rerouteFromWorkerId),
            workerId,
            workerDisplayName: residentDisplayName(ctx, workerId, workerId),
            taskTitle: task.title,
            taskDescription: task.description,
          },
        });
      }
      const summaryJa = routingExplanation.ja
        ? `${task.id} を ${residentDisplayName(ctx, workerId, workerId)} に割り当てました (${routingExplanation.ja})。`
        : `${task.id} を ${residentDisplayName(ctx, workerId, workerId)} に割り当てました。`;
      const summaryEn = routingExplanation.en
        ? `${task.id} dispatched to ${residentDisplayName(ctx, workerId, workerId)} (${routingExplanation.en}).`
        : `${task.id} dispatched to ${residentDisplayName(ctx, workerId, workerId)}.`;
      ctx.appendEvent("dispatch", task.id, "ok", summaryJa, summaryEn);
      void ctx.appendTaskProgressLogForTarget("task", task.id, "dispatch", {
        planId: normalizedPlanId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: summaryJa,
        messageEn: summaryEn,
        payload: {
          workerId,
          routingExplanation,
        },
      });
    });
    createdJobs.forEach((entry) => {
      const job = entry?.job;
      if (!job || typeof job !== "object") return;
      ctx.jobs.push(job);
      const workerId = ctx.normalizeText(entry?.workerId || job.palId);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(entry?.explanation);
      const summaryJa = routingExplanation.ja
        ? `${job.id} を ${residentDisplayName(ctx, workerId, workerId)} に割り当てました (${routingExplanation.ja})。`
        : `${job.id} を ${residentDisplayName(ctx, workerId, workerId)} に割り当てました。`;
      const summaryEn = routingExplanation.en
        ? `${job.id} dispatched to ${residentDisplayName(ctx, workerId, workerId)} (${routingExplanation.en}).`
        : `${job.id} dispatched to ${residentDisplayName(ctx, workerId, workerId)}.`;
      ctx.appendEvent("dispatch", job.id, "ok", summaryJa, summaryEn);
      void ctx.appendTaskProgressLogForTarget("job", job.id, "dispatch", {
        planId: normalizedPlanId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: summaryJa,
        messageEn: summaryEn,
        payload: {
          workerId,
          routingExplanation,
        },
      });
    });
    if (created.length > 0 && !ctx.getSelectedTaskId()) {
      ctx.setSelectedTaskId(created[0].id);
    }
    ctx.renderTaskBoard();
    ctx.renderJobBoard();
    ctx.writeBoardStateSnapshot();
    return {
      created: createdTasks.length + createdJobs.length,
      createdTasks: createdTasks.map((entry) => entry?.task).filter(Boolean),
      createdJobs: createdJobs.map((entry) => entry?.job).filter(Boolean),
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
    await ctx.appendTaskProgressLogForTarget(targetKind, ctx.normalizeText(target.id), "replanned", {
      planId: currentPlanId,
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: `${summarizeConversationIntent(ctx, target?.title, target?.description || target?.instruction)}を組み直しました。新しい段取りで住人に引き継ぎます。`,
      messageEn: `${summarizeConversationIntent(ctx, target?.title, target?.description || target?.instruction)} was replanned and handed off with a revised path.`,
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
    } catch (error) {
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
      const workerProgressConversation = buildWorkerProgressConversationMessage(ctx, latest, latest.palId, "ok", latest.evidence);
      void ctx.appendTaskProgressLogForTarget(targetKind, latest.id, "worker_runtime", {
        planId: ctx.resolveTargetPlanId(latest),
        actualActor: "worker",
        displayActor: "Resident",
        status: "ok",
        messageJa: workerProgressConversation.messageJa,
        messageEn: workerProgressConversation.messageEn,
        payload: {
          assigneePalId: ctx.normalizeText(latest.palId),
          assigneeDisplayName: residentDisplayName(ctx, latest.palId, latest.palId),
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
      const workerProgressConversation = buildWorkerProgressConversationMessage(ctx, targetRecord, targetRecord?.palId, "error", ctx.normalizeText(error?.message || error));
      void ctx.appendTaskProgressLogForTarget(targetKind, targetId, "worker_runtime", {
        planId: ctx.resolveTargetPlanId(collection.find((item) => item.id === targetId)),
        actualActor: "worker",
        displayActor: "Resident",
        status: "error",
        messageJa: workerProgressConversation.messageJa,
        messageEn: workerProgressConversation.messageEn,
        payload: {
          assigneePalId: ctx.normalizeText(targetRecord?.palId),
          assigneeDisplayName: residentDisplayName(ctx, targetRecord?.palId, targetRecord?.palId),
          taskTitle: ctx.normalizeText(targetRecord?.title),
          taskDescription: ctx.normalizeText(targetRecord?.description || targetRecord?.instruction),
          errorText: ctx.normalizeText(error?.message || error),
        },
      });
      ctx.rerenderAll();
    }
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
