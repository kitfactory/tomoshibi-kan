(function attachGuideChatEntry(scope) {
  function isNewProjectIntent(text) {
    const normalized = normalizeText(text).toLowerCase();
    if (!normalized) return false;
    return /新規プロジェクト|新しいプロジェクト|新しい企画|新規案件|new project|start a project|kick off a project/.test(normalized);
  }

  function isGuideWorkIntent(text) {
    const normalized = normalizeText(text).toLowerCase();
    if (!normalized) return false;
    return /依頼|タスク|job|cron|plan|進めたい|作って|修正|調査|確認|まとめて|schedule|recurring|event-driven|trace|fix|verify/.test(normalized);
  }

  function hasFocusedGuideProjectTarget(context) {
    if (!context || typeof context !== "object") return false;
    if (Array.isArray(context.references) && context.references.length > 0) return true;
    const focus = context.focus;
    if (!focus) return false;
    return Boolean(normalizeText(focus.id) && normalizeText(focus.directory));
  }

  function shouldGuideRequestProjectSetup(text, context) {
    if (isNewProjectIntent(text)) return true;
    if (isGuideWorkIntent(text)) return !hasFocusedGuideProjectTarget(context);
    return false;
  }

  function buildGuideProjectSetupReply() {
    if (locale === "en") {
      return "I can help once the target project or folder is set up.\n\n- Open the **Project** tab first\n- Add the target project or directory\n- If needed, switch focus to that project\n\nWhen that is ready, tell me what you want to do in that project and I will turn it into a request.";
    }
    return "その依頼は、まず **Project** タブで対象の project / folder を設定してから進めるのがよさそうです。\n\n- 先に **Project** タブを開く\n- 対象のプロジェクトやディレクトリを追加する\n- 必要ならそのプロジェクトを focus に切り替える\n\n準備ができたら、その project で何をしたいかを教えてください。そこから依頼の形に整えます。";
  }

  async function sendGuideMessage() {
    if (guideSendInFlight) return;
    const input = document.getElementById("guideInput");
    if (!input) return;
    const text = input.value.trim();
    if (!text) {
      setMessage("MSG-PPH-1001");
      return;
    }
    const focusCommandResult = handleGuideFocusCommand(text);
    if (focusCommandResult.handled) {
      input.value = "";
      closeGuideMentionMenu();
      return;
    }
    const modelInput = buildGuideModelUserText(text);
    const guidePlanningIntentApi = resolveGuidePlanningIntentApi();
    const assistEnabled = isGuideControllerAssistEnabled();
    const planningIntent = assistEnabled && guidePlanningIntentApi
      ? guidePlanningIntentApi.detectPlanningIntent(modelInput.modelUserText)
      : { requested: false, cue: "none" };
    const planningReadiness = assistEnabled && guidePlanningIntentApi && typeof guidePlanningIntentApi.detectPlanningReadiness === "function"
      ? guidePlanningIntentApi.detectPlanningReadiness(modelInput.modelUserText, planningIntent)
      : { ready: false, cue: "none" };
    const guideState = resolveGuideModelStateWithFallback();
    if (!guideState.ready) {
      guideMessages.push({
        timestamp: formatNow().slice(11),
        sender: "system",
        text: buildGuideModelRequiredPromptWithFallback(),
      });
      renderGuideChat();
      setMessage(guideState.errorCode || "MSG-PPH-1010");
      setWorkspaceTab("settings");
      return;
    }
    const timestamp = formatNow().slice(11);
    guideMessages.push({
      timestamp,
      sender: "you",
      text: { ja: text, en: text },
    });
    const pendingPlanArtifact = await getLatestPlanArtifactWithFallback({ status: "pending_approval" });
    if (pendingPlanArtifact && isGuidePlanApprovalIntent(text)) {
      const approvedArtifact = await updatePlanArtifactWithFallback(pendingPlanArtifact.planId, {
        status: "approved",
        approvedAt: new Date().toISOString(),
      });
      const created = await materializeApprovedPlanArtifact(approvedArtifact);
      void queueAutoExecutionForCreatedTargets(created);
      guideMessages.push({
        timestamp: formatNow().slice(11),
        sender: "guide",
        text: {
          ja: buildGuidePlanApprovalReply(approvedArtifact, created),
          en: buildGuidePlanApprovalReply(approvedArtifact, created),
        },
      });
      input.value = "";
      closeGuideMentionMenu();
      renderGuideChat();
      setMessage(created?.created > 0 ? "MSG-PPH-0001" : "MSG-PPH-0009");
      return;
    }
    if (isGuidePlanApprovalIntent(text)) {
      const approvedPlanArtifact = await getLatestPlanArtifactWithFallback({ status: "approved" });
      const materializedCounts = countMaterializedTargetsForPlan(approvedPlanArtifact?.planId);
      if (approvedPlanArtifact && materializedCounts.total > 0 && isRecentlyApprovedPlanArtifact(approvedPlanArtifact)) {
        guideMessages.push({
          timestamp: formatNow().slice(11),
          sender: "guide",
          text: {
            ja: buildGuidePlanAlreadyStartedReply(approvedPlanArtifact, materializedCounts),
            en: buildGuidePlanAlreadyStartedReply(approvedPlanArtifact, materializedCounts),
          },
        });
        input.value = "";
        closeGuideMentionMenu();
        renderGuideChat();
        setMessage("MSG-PPH-0009");
        return;
      }
    }
    const progressReply = await buildGuideProgressQueryReply(text);
    if (progressReply?.handled) {
      guideMessages.push({
        timestamp: formatNow().slice(11),
        sender: "guide",
        text: {
          ja: progressReply.text,
          en: progressReply.text,
        },
      });
      input.value = "";
      closeGuideMentionMenu();
      renderGuideChat();
      setMessage("MSG-PPH-0009");
      return;
    }
    if (shouldGuideRequestProjectSetup(text, modelInput.context)) {
      guideMessages.push({
        timestamp: formatNow().slice(11),
        sender: "guide",
        text: {
          ja: buildGuideProjectSetupReply(),
          en: buildGuideProjectSetupReply(),
        },
      });
      input.value = "";
      closeGuideMentionMenu();
      renderGuideChat();
      setWorkspaceTab("project");
      setMessage("MSG-PPH-0009");
      return;
    }
    guideSendInFlight = true;
    setGuideComposerBusy(true);
    try {
      const contextBuild = await buildGuideContextWithFallback(modelInput.modelUserText);
      const modelReply = await requestGuideModelReplyWithFallback(modelInput.modelUserText, guideState, contextBuild);
      if (!modelReply && hasTomoshibikanCoreRuntimeApi()) {
        guideMessages.push({
          timestamp: formatNow().slice(11),
          sender: "system",
          text: buildGuideModelFailedPrompt(),
        });
        renderGuideChat();
        setMessage("MSG-PPH-1002");
        return;
      }
      const parsedPlanResponse = parseGuidePlanResponseWithFallback(modelReply?.text || "", {
        planningIntent: planningIntent.cue,
        planningReadiness: planningReadiness.cue,
        projectContext: modelInput.context,
        locale,
      });
      const replyText = parsedPlanResponse?.ok
        ? parsedPlanResponse.reply
        : "";
      const nextReply = modelReply
        ? buildGuideLiveModelReply(modelReply, replyText)
        : buildGuideReplyWithFallback(text, guideState);
      guideMessages.push({
        timestamp: formatNow().slice(11),
        sender: "guide",
        text: nextReply,
      });
      let createdCount = 0;
      if (parsedPlanResponse?.ok && parsedPlanResponse.status === "plan_ready" && parsedPlanResponse.plan) {
        const planArtifact = await appendPlanArtifactWithFallback({
          status: "pending_approval",
          replyText,
          plan: parsedPlanResponse.plan,
          sourceRunId: normalizeText(modelReply?.runId),
        });
        createdCount = Number(planArtifact?.planId ? 1 : 0);
      }
      input.value = "";
      closeGuideMentionMenu();
      renderGuideChat();
      setMessage(createdCount > 0 ? "MSG-PPH-0009" : "MSG-PPH-0009");
    } finally {
      guideSendInFlight = false;
      setGuideComposerBusy(false);
    }
  }

  const api = {
    isNewProjectIntent,
    isGuideWorkIntent,
    hasFocusedGuideProjectTarget,
    shouldGuideRequestProjectSetup,
    buildGuideProjectSetupReply,
    sendGuideMessage,
  };

  scope.GuideChatEntry = api;
  Object.assign(scope, api);
  if (scope.window && typeof scope.window === "object") {
    scope.window.GuideChatEntry = api;
    Object.assign(scope.window, api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
