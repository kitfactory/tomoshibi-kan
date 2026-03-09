(function attachGuideChatRuntime(scope) {
  let guideSendInFlight = false;
  let guideComposerFocused = false;

  function extractGuideAssistantText(payload) {
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content === "string") return content.trim();
    if (Array.isArray(content)) {
      const joined = content
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item.text === "string") return item.text;
          return "";
        })
        .filter(Boolean)
        .join("\n")
        .trim();
      return joined;
    }
    return "";
  }

  async function requestGuideModelReplyWithFallback(userText, guideState, contextBuild) {
    const isToolRuntime = normalizeText(guideState?.runtimeKind) === "tool";
    const runtime = isToolRuntime ? null : resolveGuideApiRuntimeConfig(guideState);
    if (!isToolRuntime && (!runtime || !runtime.modelName)) return null;
    const contextMessages = normalizeGuideContextMessages(contextBuild?.messages, userText);
    const guideOperatingRules = buildOperatingRulesPrompt("guide", locale);
    const promptEnvelope = splitSystemPromptFromContextMessages(
      contextMessages,
      guideOperatingRules,
      userText
    );
    const [enabledSkillIds, guideIdentity] = await Promise.all([
      resolveGuideConfiguredSkillIds(),
      loadAgentIdentityForPal(getActiveGuideProfile()),
    ]);
    const workspaceRoot = resolveRuntimeWorkspaceRootForChat();
    const guidePlanApi = resolveGuidePlanApi();
    const guidePlanningIntentApi = resolveGuidePlanningIntentApi();
    const planOutputInstruction = guidePlanApi
      ? guidePlanApi.buildGuidePlanOutputInstruction(locale)
      : buildFallbackGuidePlanOutputInstruction();
    const planFewShotExamples = guidePlanApi && typeof guidePlanApi.buildGuidePlanFewShotExamples === "function"
      ? guidePlanApi.buildGuidePlanFewShotExamples(locale)
      : "";
    const assistEnabled = isGuideControllerAssistEnabled();
    const planningIntent = assistEnabled && guidePlanningIntentApi
      ? guidePlanningIntentApi.detectPlanningIntent(userText)
      : { requested: false, cue: "none" };
    const planningReadiness = assistEnabled && guidePlanningIntentApi && typeof guidePlanningIntentApi.detectPlanningReadiness === "function"
      ? guidePlanningIntentApi.detectPlanningReadiness(userText, planningIntent)
      : { ready: false, cue: "none" };
    const planningAssistPrompt = assistEnabled && guidePlanningIntentApi
      ? guidePlanningIntentApi.buildPlanningIntentAssistPrompt(locale, planningIntent)
      : "";
    const planningReadinessPrompt = assistEnabled && guidePlanningIntentApi && typeof guidePlanningIntentApi.buildPlanningReadinessAssistPrompt === "function"
      ? guidePlanningIntentApi.buildPlanningReadinessAssistPrompt(locale, planningReadiness)
      : "";
    const planResponseFormat = guidePlanApi && typeof guidePlanApi.buildGuidePlanResponseFormat === "function"
      ? guidePlanApi.buildGuidePlanResponseFormat(locale)
      : null;
    const planningSystemPrompt = [promptEnvelope.systemPrompt, planningAssistPrompt, planningReadinessPrompt, planFewShotExamples, planOutputInstruction]
      .map((part) => normalizeText(part))
      .filter(Boolean)
      .join("\n\n");

    const coreRuntimeApi = resolveTomoshibikanCoreRuntimeApi();
    if (coreRuntimeApi) {
      try {
        const resolvedApiKey = !isToolRuntime
          ? await resolveStoredModelApiKeyWithFallback(runtime.modelName, runtime.apiKey)
          : "";
        const payload = await coreRuntimeApi.guideChat({
          runtimeKind: isToolRuntime ? "tool" : "model",
          toolName: isToolRuntime ? normalizeText(guideState?.toolName) : "",
          provider: runtime?.provider || "",
          modelName: runtime?.modelName || "",
          baseUrl: runtime?.baseUrl || "",
          apiKey: resolvedApiKey,
          userText,
          systemPrompt: planningSystemPrompt,
          messages: promptEnvelope.messages,
          responseFormat: planResponseFormat,
          enabledSkillIds,
          workspaceRoot,
          debugMeta: {
            stage: "guide_chat",
            agentRole: "guide",
            agentId: normalizeText(guideState?.guideId || getActiveGuideProfile()?.id),
            targetKind: "plan",
            targetId: "PLAN-001",
            planningIntent: planningIntent.cue,
            planningReadiness: planningReadiness.cue,
            identityVersions: buildDebugIdentityVersions(guideIdentity),
            enabledSkillIds,
          },
        });
        const text = String(payload?.text || "").trim();
        if (!text) return null;
        return {
          text,
          provider: payload?.provider || runtime?.provider || "codex-cli",
          modelName: payload?.modelName || runtime?.modelName || normalizeText(guideState?.toolName),
          toolCalls: Array.isArray(payload?.toolCalls) ? payload.toolCalls : [],
        };
      } catch (error) {
        return null;
      }
    }

    if (isToolRuntime) return null;
    if (typeof fetch !== "function") return null;
    const resolvedApiKey = await resolveStoredModelApiKeyWithFallback(runtime.modelName, runtime.apiKey);
    const endpoint = buildGuideChatCompletionsUrl(runtime.baseUrl);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), GUIDE_MODEL_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(resolvedApiKey ? { Authorization: `Bearer ${resolvedApiKey}` } : {}),
        },
        body: JSON.stringify({
          model: runtime.modelName,
          temperature: 0.2,
          messages: [
            { role: "system", content: planningSystemPrompt },
            ...promptEnvelope.messages,
          ],
        }),
        signal: controller.signal,
      });
      if (!response.ok) return null;
      const payload = await response.json();
      const replyText = extractGuideAssistantText(payload);
      if (!replyText) return null;
      return {
        text: replyText,
        provider: runtime.provider,
        modelName: runtime.modelName,
      };
    } catch (error) {
      return null;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function buildGuideLiveModelReply(modelReply, overrideText = "") {
    const providerText = providerLabel(modelReply.provider || "openai");
    const modelName = modelReply.modelName || DEV_LMSTUDIO_MODEL_NAME;
    const text = String(overrideText || modelReply.text || "").trim();
    const toolCalls = Array.isArray(modelReply.toolCalls) ? modelReply.toolCalls : [];
    const toolNames = [...new Set(
      toolCalls
        .map((call) => normalizeText(call?.tool_name || call?.toolName))
        .filter(Boolean)
    )];
    const toolLine = toolNames.length > 0
      ? `\n[tools] ${toolNames.join(", ")}`
      : "";
    return {
      ja: `${providerText}/${modelName}${toolLine}\n${text}`,
      en: `${providerText}/${modelName}${toolLine}\n${text}`,
    };
  }

  function isGuideComposerBusy() {
    return guideSendInFlight;
  }

  function setGuideComposerBusy(isBusy) {
    guideSendInFlight = Boolean(isBusy);
    const input = document.getElementById("guideInput");
    const send = document.getElementById("guideSend");
    if (input) input.disabled = guideSendInFlight;
    if (send) send.disabled = guideSendInFlight;
    syncGuideVisualState();
  }

  function setGuideComposerFocused(isFocused) {
    guideComposerFocused = Boolean(isFocused);
    syncGuideVisualState();
  }

  function syncGuideVisualState() {
    const shell = document.querySelector(".app-shell");
    const composer = document.getElementById("guideComposer");
    const input = document.getElementById("guideInput");
    const send = document.getElementById("guideSend");
    const isGuideTab = workspaceTab === "guide";
    const isFocused = isGuideTab && guideComposerFocused;
    const isBusy = isGuideTab && guideSendInFlight;
    if (shell) {
      shell.classList.toggle("guide-compose-active", isFocused);
      shell.classList.toggle("guide-busy", isBusy);
    }
    if (composer) {
      composer.classList.toggle("is-focused", isFocused);
      composer.classList.toggle("is-busy", isBusy);
      composer.setAttribute("data-guide-state", isBusy ? "busy" : (isFocused ? "focused" : "idle"));
    }
    if (input) {
      input.setAttribute("aria-busy", isBusy ? "true" : "false");
    }
    if (send) {
      send.classList.toggle("guide-send-busy", isBusy);
      send.setAttribute("aria-busy", isBusy ? "true" : "false");
      send.textContent = tDyn(isBusy ? "guideSending" : "guideSend");
    }
  }

  function buildGuideModelUserText(userText) {
    const context = buildGuideProjectContext(userText);
    const note = buildGuideProjectContextNote(context);
    if (!note) {
      return {
        modelUserText: userText,
        context,
      };
    }
    return {
      modelUserText: `${userText}\n\n${note}`,
      context,
    };
  }

  function bindGuideComposerEvents() {
    const composer = document.getElementById("guideComposer");
    const guideInput = document.getElementById("guideInput");
    if (!composer || !guideInput) return;
    composer.addEventListener("submit", (e) => {
      e.preventDefault();
      sendGuideMessage();
    });
    guideInput.addEventListener("focus", () => {
      setGuideComposerFocused(true);
    });
    guideInput.addEventListener("input", () => {
      refreshGuideMentionMenu();
    });
    guideInput.addEventListener("blur", () => {
      setGuideComposerFocused(false);
      window.setTimeout(() => {
        closeGuideMentionMenu();
      }, 80);
    });
    guideInput.addEventListener("keydown", (e) => {
      if (handleGuideMentionMenuKeydown(e)) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendGuideMessage();
      }
    });
  }

  const api = {
    extractGuideAssistantText,
    requestGuideModelReplyWithFallback,
    buildGuideLiveModelReply,
    isGuideComposerBusy,
    setGuideComposerBusy,
    setGuideComposerFocused,
    syncGuideVisualState,
    buildGuideModelUserText,
    bindGuideComposerEvents,
  };

  scope.GuideChatRuntime = api;
  Object.assign(scope, api);
  if (scope.window && typeof scope.window === "object") {
    scope.window.GuideChatRuntime = api;
    Object.assign(scope.window, api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
