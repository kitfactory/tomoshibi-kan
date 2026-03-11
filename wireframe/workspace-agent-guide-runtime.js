(function attachWorkspaceAgentGuideRuntimeUi(scope) {
const runtimeConfigApi = scope.WorkspaceRuntimeConfigUi || {};

const {
  providerIdFromInput,
  normalizeToolName,
  normalizePalRole,
  normalizePalRuntimeKind,
  resolvePalProfileModelApi,
} = runtimeConfigApi;

function resolveGuideChatModelApi() {
  return typeof window !== "undefined" &&
    window.GuideChatModel &&
    typeof window.GuideChatModel.resolveGuideModelState === "function" &&
    typeof window.GuideChatModel.bindGuideToFirstRegisteredModel === "function" &&
    typeof window.GuideChatModel.buildGuideModelReply === "function" &&
    typeof window.GuideChatModel.buildGuideModelRequiredPrompt === "function"
    ? window.GuideChatModel
    : null;
}

function resolveGuideModelStateWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.resolveGuideModelState({
      palProfiles,
      activeGuideId: workspaceAgentSelection.activeGuideId,
      registeredModels: settingsState.registeredModels,
      registeredTools: settingsState.registeredTools,
    });
  }
  const guide = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId);
  if (!guide) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  if (normalizePalRuntimeKind(guide.runtimeKind) === "tool") {
    const toolName = Array.isArray(guide.cliTools) ? normalizeText(guide.cliTools[0]) : "";
    if (!toolName || !settingsState.registeredTools.some((tool) => normalizeText(tool).toLowerCase() === toolName.toLowerCase())) {
      return { ready: false, errorCode: "MSG-PPH-1010" };
    }
    return {
      ready: true,
      guideId: guide.id,
      runtimeKind: "tool",
      toolName,
    };
  }
  if (guide.runtimeKind !== "model" || !guide.models[0]) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  const model = settingsState.registeredModels.find((item) => item.name === guide.models[0]);
  if (!model) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  return {
    ready: true,
    guideId: guide.id,
    runtimeKind: "model",
    modelName: model.name,
    provider: model.provider,
  };
}

function bindGuideToFirstRegisteredModelWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.bindGuideToFirstRegisteredModel({
      palProfiles,
      activeGuideId: workspaceAgentSelection.activeGuideId,
      registeredModels: settingsState.registeredModels,
      registeredTools: settingsState.registeredTools,
    });
  }
  const guide = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId);
  const activeToolName = guide && Array.isArray(guide.cliTools) ? normalizeText(guide.cliTools[0]) : "";
  if (
    guide &&
    normalizePalRuntimeKind(guide.runtimeKind) === "tool" &&
    activeToolName &&
    settingsState.registeredTools.some((tool) => normalizeText(tool).toLowerCase() === activeToolName.toLowerCase())
  ) {
    return { changed: false, guideId: guide.id };
  }
  const firstModel = settingsState.registeredModels[0];
  if (!guide || !firstModel || !firstModel.name) return { changed: false };
  guide.runtimeKind = "model";
  guide.models = [firstModel.name];
  guide.cliTools = [];
  guide.provider = firstModel.provider || "";
  return { changed: true, guideId: guide.id, modelName: firstModel.name, provider: firstModel.provider || "" };
}

function buildGuideReplyWithFallback(userText, guideState) {
  const external = resolveGuideChatModelApi();
  const runtimeKind = normalizeText(guideState?.runtimeKind) === "tool" ? "tool" : "model";
  const provider = guideState?.provider || "";
  const providerText = providerLabel(provider);
  const runtimeDisplay =
    runtimeKind === "tool"
      ? normalizeText(guideState?.toolName || guideState?.modelName || "CLI")
      : `${providerText}/${guideState?.modelName}`;
  if (external) {
    return external.buildGuideModelReply({
      userText,
      modelName: runtimeKind === "tool" ? normalizeText(guideState?.toolName || guideState?.modelName) : guideState?.modelName,
      providerLabel: runtimeKind === "tool" ? normalizeText(guideState?.toolName || "CLI") : providerText,
    });
  }
  const clipped = userText.length > 28 ? `${userText.slice(0, 28)}...` : userText;
  return {
    ja: `${runtimeDisplay} で受け取りました。「${clipped}」をもとに次のTaskを組み立てます。`,
    en: `Received via ${runtimeDisplay}. I will draft next tasks from "${clipped}".`,
  };
}

function buildGuideModelRequiredPromptWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.buildGuideModelRequiredPrompt();
  }
  return {
    ja: "Guide の実行設定が未完了です。SettingsタブでモデルまたはCLIツールを設定してください。",
    en: "Guide runtime is not configured. Configure a model or CLI tool in Settings tab.",
  };
}

function resolveGuideRegisteredModel(guideState) {
  const modelName = String(guideState?.modelName || "").trim();
  if (!modelName) return null;
  return settingsState.registeredModels.find((model) => model.name === modelName) || null;
}

function resolveGuideApiRuntimeConfig(guideState) {
  const registered = resolveGuideRegisteredModel(guideState);
  if (!hasTomoshibikanCoreRuntimeApi() && isDevOrTestEnvironment()) {
    return {
      provider: DEV_LMSTUDIO_PROVIDER_ID,
      modelName: DEV_LMSTUDIO_MODEL_NAME,
      apiKey: DEV_LMSTUDIO_API_KEY,
      baseUrl: DEV_LMSTUDIO_BASE_URL,
    };
  }
  if (!registered) return null;
  return {
    provider: registered.provider || guideState.provider || DEFAULT_PROVIDER_ID,
    modelName: registered.name || guideState.modelName,
    apiKey: registered.apiKey || "",
    baseUrl: registered.baseUrl || "",
  };
}

async function requestGuideModelReplyWithFallback(userText, guideState, contextBuild) {
  const runtimeApi =
    typeof window !== "undefined" &&
    window.GuideChatRuntime &&
    typeof window.GuideChatRuntime.requestGuideModelReplyWithFallback === "function"
      ? window.GuideChatRuntime
      : null;
  if (!runtimeApi) return null;
  return runtimeApi.requestGuideModelReplyWithFallback(userText, guideState, contextBuild);
}

function buildFallbackGuidePlanOutputInstruction() {
  return locale === "en"
    ? [
      "Return compact JSON only. Do not use markdown fences.",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"project":{"id":"...","name":"...","directory":"..."},"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}],"jobs":[{"title":"...","description":"...","schedule":"...","instruction":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "Use status=conversation when the user is chatting, brainstorming, or not asking for task breakdown yet.",
      "Use status=needs_clarification only when a missing fact blocks task creation.",
      "If the user explicitly asks for a plan or task breakdown and gives the target, expected outcome, relevant files, or available tools, prefer status=plan_ready.",
      "When returning plan_ready, include the target project or folder in plan.project.",
      "If there is no clear target project or folder yet, stay in needs_clarification and guide the user to set it in the Project tab first.",
      "When minor details are missing, make reasonable assumptions and put them in constraints instead of asking another confirmation question.",
      "Do not ask the user to pick the assignee Pal when suitable Pals and tools are already available in context; choose the best fit yourself.",
      "In the debug workspace, prefer resident specialists: trace work to Fuyusaka, fixes to Kuze, and explanation or return wording to Shiramine.",
      "Use status=plan_ready only when you have enough information to create an actionable plan.",
    ].join("\n")
    : [
      "JSONのみで返す。Markdown や code fence は使わない。",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"project":{"id":"...","name":"...","directory":"..."},"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}],"jobs":[{"title":"...","description":"...","schedule":"...","instruction":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "ユーザーが雑談中、壁打ち中、またはまだtask分解を求めていないなら status=conversation を返す。",
      "task 作成を妨げる欠落情報がある時だけ status=needs_clarification を返す。",
      "ユーザーが plan や task 分解を明示し、対象・期待結果・関連ファイル・使える tools を示しているなら status=plan_ready を優先する。",
      "plan_ready を返す時は、対象の project / folder を plan.project に必ず入れる。",
      "対象の project / folder がまだ決まっていない時は、Project タブで先に設定するよう案内し、needs_clarification に留める。",
      "細部が不足しているだけなら、確認質問を増やさず assumptions を constraints に入れる。",
      "文脈に suitable Pals and tools があるなら、ユーザーに assignee Pal を選ばせず自分で選ぶ。",
      "debug workspace では住人の主担当を優先し、調査は冬坂、修正は久瀬、返却文や説明整理は白峰に割り当てる。",
      "実行可能な計画が作れる時だけ status=plan_ready を返す。",
    ].join("\n");
}

function parseGuidePlanResponseWithFallback(text, options = {}) {
  const guidePlanApi = resolveGuidePlanApi();
  if (guidePlanApi) {
    return guidePlanApi.parseGuidePlanResponse(text, options);
  }
  return { ok: false, error: "guide_plan_api_unavailable" };
}

function palRoleLabel(role) {
  const normalized = normalizePalRole(role);
  if (locale === "ja") {
    if (normalized === "guide") return "Guide役";
    if (normalized === "gate") return "Gate役";
    return "住人";
  }
  if (normalized === "guide") return "Guide";
  if (normalized === "gate") return "Gate";
  return "Worker / 住人";
}

function coreModelOptionsByProvider(providerId) {
  const normalizedProviderId = providerIdFromInput(providerId);
  return [...(TOMOSHIBIKAN_CORE_MODEL_OPTIONS_BY_PROVIDER.get(normalizedProviderId) || [])];
}

function resolvePalContextBuilderApi() {
  return typeof window !== "undefined" &&
    window.PalContextBuilder &&
    typeof window.PalContextBuilder.buildGuideContext === "function"
    ? window.PalContextBuilder
    : null;
}

function resolveAgentIdentityApi() {
  const bridge = resolveWindowBridge("TomoshibikanAgentIdentity", "PalpalAgentIdentity");
  return bridge &&
    typeof bridge.load === "function" &&
    typeof bridge.save === "function"
    ? bridge
    : null;
}

async function initializePalIdentityTemplates(pal) {
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi || !pal) return;
  const role = normalizePalRole(pal.role);
  const agentType = role === "worker" ? "worker" : role;
  if (!agentType) return;
  await identityApi.save({
    agentType,
    agentId: pal.id,
    locale,
    initializeTemplates: true,
    enabledSkillIds: Array.isArray(pal.skills) ? pal.skills : [],
  });
}

async function ensureBuiltInDebugPurposeIdentities() {
  const identityApi = resolveAgentIdentityApi();
  const seedApi = resolveDebugIdentitySeedsApi();
  if (!identityApi || !seedApi) return;
  const builtInProfiles = new Map(INITIAL_PAL_PROFILES.map((profile) => [profile.id, profile]));
  for (const pal of palProfiles) {
    const builtInProfile = builtInProfiles.get(pal.id);
    if (!builtInProfile) continue;
    const role = normalizePalRole(pal.role);
    const agentType = role === "worker" ? "worker" : role;
    if (!agentType) continue;
    const seed = seedApi.getBuiltInDebugIdentitySeed(builtInProfile, locale);
    if (!seed) continue;
    try {
      const existing = await identityApi.load({
        agentType,
        agentId: pal.id,
      });
      if (existing && existing.hasIdentityFiles) continue;
      await identityApi.save({
        agentType,
        agentId: pal.id,
        locale,
        soul: seed.soul,
        role: seed.role,
        rubric: seed.rubric,
        enabledSkillIds: seed.enabledSkillIds,
      });
    } catch (error) {
      continue;
    }
  }
}

async function syncBuiltInResidentIdentitiesToWorkspace() {
  const identityApi = resolveAgentIdentityApi();
  const seedApi = resolveDebugIdentitySeedsApi();
  if (!identityApi || !seedApi) {
    setMessage("MSG-PPH-1003");
    return false;
  }
  syncBuiltInProfileMetadata();
  for (const profile of INITIAL_PAL_PROFILES) {
    const role = normalizePalRole(profile.role);
    const agentType = role === "worker" ? "worker" : role;
    if (!agentType) continue;
    const seed = seedApi.getBuiltInDebugIdentitySeed(profile, locale);
    if (!seed) continue;
    const currentProfile = palProfiles.find((item) => item.id === profile.id) || profile;
    try {
      await identityApi.save({
        agentType,
        agentId: profile.id,
        locale,
        soul: seed.soul,
        role: seed.role,
        rubric: seed.rubric,
        enabledSkillIds: Array.isArray(currentProfile.skills) ? currentProfile.skills : seed.enabledSkillIds,
      });
    } catch (error) {
      setMessage("MSG-PPH-1003");
      return false;
    }
  }
  writePalProfilesSnapshotWithFallback();
  renderPalList();
  renderSettingsTab();
  setMessage("MSG-PPH-0007");
  return true;
}

function resolveAgentSkillResolverApi() {
  return typeof window !== "undefined" &&
    window.AgentSkillResolver &&
    typeof window.AgentSkillResolver.resolveSkillSummariesForContext === "function"
    ? window.AgentSkillResolver
    : null;
}

function resolveGuideTaskPlannerApi() {
  return typeof window !== "undefined" &&
    window.GuideTaskPlanner &&
    typeof window.GuideTaskPlanner.buildTaskDraftsFromRequest === "function" &&
    typeof window.GuideTaskPlanner.assignTasksToWorkers === "function"
    ? window.GuideTaskPlanner
    : null;
}

function resolveGuidePlanApi() {
  return typeof window !== "undefined" &&
    window.GuidePlan &&
    typeof window.GuidePlan.parseGuidePlanResponse === "function" &&
    typeof window.GuidePlan.buildGuidePlanOutputInstruction === "function"
    ? window.GuidePlan
    : null;
}

function resolveGuidePlanningIntentApi() {
  return typeof window !== "undefined" &&
    window.GuidePlanningIntent &&
    typeof window.GuidePlanningIntent.detectPlanningIntent === "function" &&
    typeof window.GuidePlanningIntent.buildPlanningIntentAssistPrompt === "function"
    ? window.GuidePlanningIntent
    : null;
}

function resolveAgentRoutingApi() {
  return typeof window !== "undefined" &&
    window.AgentRouting &&
    typeof window.AgentRouting.selectWorkerForTask === "function" &&
    typeof window.AgentRouting.selectGateForTarget === "function"
    ? window.AgentRouting
    : null;
}

function resolveDebugIdentitySeedsApi() {
  return typeof window !== "undefined" &&
    window.DebugIdentitySeeds &&
    typeof window.DebugIdentitySeeds.getBuiltInDebugIdentitySeed === "function"
      ? window.DebugIdentitySeeds
      : null;
}

function resolvePlanOrchestratorApi() {
  return typeof window !== "undefined" &&
    window.PlanOrchestrator &&
    typeof window.PlanOrchestrator.materializePlanArtifact === "function"
    ? window.PlanOrchestrator
    : null;
}

function resolveDebugRunsApi() {
  const bridge = resolveWindowBridge("TomoshibikanDebugRuns", "PalpalDebugRuns");
  return bridge && typeof bridge.list === "function" ? bridge : null;
}

function guideMessageToContextMessage(message) {
  const sender = String(message?.sender || "").trim();
  const textSource = message?.text;
  const content = typeof textSource === "string"
    ? textSource
    : String((textSource && (textSource[locale] || textSource.ja || textSource.en)) || "").trim();
  if (!content) return null;
  const role = sender === "you"
    ? "user"
    : (sender === "guide" ? "assistant" : "system");
  return {
    role,
    content,
  };
}

function normalizeGuideContextMessages(messages, latestUserText) {
  const normalized = Array.isArray(messages)
    ? messages
      .map((message) => {
        if (!message || typeof message !== "object") return null;
        const role = String(message.role || "").trim();
        const content = String(message.content || "").trim();
        if (!role || !content) return null;
        return { role, content };
      })
      .filter(Boolean)
    : [];
  if (normalized.length === 0) {
    return [
      { role: "system", content: GUIDE_SYSTEM_PROMPT },
      { role: "user", content: latestUserText },
    ];
  }
  return normalized;
}

function splitSystemPromptFromContextMessages(messages, fallbackSystemPrompt, latestUserText) {
  const normalized = normalizeGuideContextMessages(messages, latestUserText);
  const systemParts = [];
  const remaining = [];
  normalized.forEach((message) => {
    if (message.role === "system") {
      systemParts.push(message.content);
      return;
    }
    remaining.push(message);
  });
  return {
    systemPrompt: systemParts.join("\n\n") || fallbackSystemPrompt,
    messages: remaining,
  };
}

function buildFallbackLanguagePrompt() {
  return locale === "en"
    ? "Unless the user explicitly requests another language, answer in English."
    : "ユーザーから明示的な言語指定がない限り、日本語で応答する。";
}

function buildFallbackIdentitySystemPrompt(basePrompt, identity) {
  const sections = [];
  const languagePrompt = buildFallbackLanguagePrompt();
  if (languagePrompt) sections.push(`[LANGUAGE]\n${languagePrompt}`);
  if (basePrompt) sections.push(`[OPERATING_RULES]\n${basePrompt}`);
  const soulText = normalizeText(identity?.soul);
  const roleText = normalizeText(identity?.role);
  const rubricText = normalizeText(identity?.rubric);
  if (soulText) sections.push(`[SOUL]\n${soulText}`);
  if (roleText) sections.push(`[ROLE]\n${roleText}`);
  if (rubricText) sections.push(`[RUBRIC]\n${rubricText}`);
  return sections.join("\n\n") || basePrompt;
}

function normalizeToolCapabilitySnapshots(entries) {
  if (!Array.isArray(entries)) return [];
  const seen = new Set();
  const result = [];
  entries.forEach((entry) => {
    const toolName = normalizeToolName(entry?.toolName);
    if (!toolName) return;
    const key = toolName.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push({
      toolName,
      status: normalizeText(entry?.status) || "unavailable",
      fetchedAt: normalizeText(entry?.fetchedAt),
      commandName: normalizeText(entry?.commandName),
      versionText: normalizeText(entry?.versionText),
      capabilities: Array.isArray(entry?.capabilities) ? entry.capabilities : [],
      capabilitySummaries: Array.isArray(entry?.capabilitySummaries)
        ? entry.capabilitySummaries.map((summary) => normalizeText(summary)).filter(Boolean)
        : [],
      errorText: normalizeText(entry?.errorText),
    });
  });
  return result;
}

function resolveRegisteredToolCapabilitySnapshots(toolNames) {
  const selected = Array.isArray(toolNames)
    ? toolNames.map((toolName) => normalizeToolName(toolName)).filter(Boolean)
    : [];
  if (selected.length === 0) return [];
  const selectedSet = new Set(selected.map((toolName) => toolName.toLowerCase()));
  return normalizeToolCapabilitySnapshots(settingsState.registeredToolCapabilities)
    .filter((entry) => selectedSet.has(entry.toolName.toLowerCase()));
}

async function loadAgentIdentityForPal(pal) {
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi || !pal) return null;
  const role = normalizePalRole(pal.role);
  const agentType = role === "worker" ? "worker" : role;
  if (!agentType) return null;
  try {
    const identity = await identityApi.load({
      agentType,
      agentId: pal.id,
    });
    return identity && identity.hasIdentityFiles ? identity : null;
  } catch (error) {
    return null;
  }
}

function fallbackResolveSkillSummaries(runtimeKind, configuredSkillIds, installedSkillIds, catalogItems, selectedToolNames = [], registeredToolCapabilities = []) {
  if (runtimeKind === "tool") {
    const selected = new Set(
      (Array.isArray(selectedToolNames) ? selectedToolNames : [])
        .map((toolName) => normalizeToolName(toolName).toLowerCase())
        .filter(Boolean)
    );
    return normalizeToolCapabilitySnapshots(registeredToolCapabilities)
      .filter((entry) => selected.has(entry.toolName.toLowerCase()))
      .flatMap((entry) => entry.capabilitySummaries);
  }
  if (runtimeKind !== "model") return [];
  const installed = new Set(
    Array.isArray(installedSkillIds)
      ? installedSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : []
  );
  const catalogById = new Map(
    Array.isArray(catalogItems)
      ? catalogItems.map((item) => {
        const id = normalizeSkillId(item?.id);
        const name = normalizeText(item?.name || id);
        const description = normalizeText(item?.description);
        return [id, { name, description }];
      }).filter(([id]) => Boolean(id))
      : []
  );
  const selected = Array.isArray(configuredSkillIds)
    ? configuredSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  return selected
    .filter((skillId) => installed.has(skillId))
    .map((skillId) => {
      const entry = catalogById.get(skillId);
      if (!entry) return skillId;
      return entry.description ? `${entry.name}: ${entry.description}` : entry.name;
    });
}

async function resolveGuideConfiguredSkillIds() {
  const guideProfile = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId) || null;
  const fallback = Array.isArray(guideProfile?.skills)
    ? guideProfile.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi) return fallback;
  try {
    const identity = await identityApi.load({
      agentType: "guide",
      agentId: guideProfile?.id,
    });
    if (!identity || !identity.hasIdentityFiles) return fallback;
    return Array.isArray(identity.enabledSkillIds)
      ? identity.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [];
  } catch (error) {
    return fallback;
  }
}

async function buildGuideContextWithFallback(latestUserText) {
  const external = resolvePalContextBuilderApi();
  const sessionMessages = guideMessages
    .map((message) => guideMessageToContextMessage(message))
    .filter(Boolean);
  const guideProfile = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId) || null;
  const guideIdentity = await loadAgentIdentityForPal(guideProfile);
  const runtimeKind = normalizePalRuntimeKind(guideProfile?.runtimeKind);
  const selectedToolNames = Array.isArray(guideProfile?.cliTools) ? guideProfile.cliTools : [];
  const guideOperatingRules = buildOperatingRulesPrompt("guide", locale);
  const configuredSkillIds = await resolveGuideConfiguredSkillIds();
  const installedSkillIds = Array.isArray(settingsState.registeredSkills)
    ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const skillCatalogItems = CLAWHUB_SKILL_REGISTRY.map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
  }));
  const skillResolverApi = resolveAgentSkillResolverApi();
  const resolvedByApi = skillResolverApi
    ? skillResolverApi.resolveSkillSummariesForContext({
      runtimeKind,
      configuredSkillIds,
      installedSkillIds,
      catalogItems: skillCatalogItems,
      selectedToolNames,
      registeredToolCapabilities: resolveRegisteredToolCapabilitySnapshots(selectedToolNames),
    })
    : null;
  const skillSummaries = Array.isArray(resolvedByApi?.skillSummaries)
    ? resolvedByApi.skillSummaries
    : fallbackResolveSkillSummaries(
      runtimeKind,
      configuredSkillIds,
      installedSkillIds,
      skillCatalogItems,
      selectedToolNames,
      resolveRegisteredToolCapabilitySnapshots(selectedToolNames)
    );
  if (external) {
    const builderInput = {
      latestUserText,
      sessionMessages,
      contextWindow: 8192,
      reservedOutput: 1024,
      safetyMargin: 512,
      maxHistoryMessages: 12,
      safetyPrompt: guideOperatingRules,
      role: "guide",
      runtimeKind,
      locale,
      skillSummaries,
      soulText: guideIdentity?.soul || "",
      roleText: guideIdentity?.role || "",
    };
    const built = typeof external.buildPalContext === "function"
      ? external.buildPalContext(builderInput)
      : external.buildGuideContext(builderInput);
    if (built && built.ok && Array.isArray(built.messages)) {
      return {
        ok: true,
        messages: normalizeGuideContextMessages(built.messages, latestUserText),
        audit: built.audit || null,
      };
    }
  }
  return {
    ok: true,
    messages: [
      { role: "system", content: buildFallbackIdentitySystemPrompt(guideOperatingRules, guideIdentity) },
      { role: "user", content: latestUserText },
    ],
    audit: null,
  };
}

const assignmentApi = scope.WorkspaceAgentAssignmentUi || {};

const {
  nextTaskSequenceNumber,
  nextJobSequenceNumber,
  resolveWorkerAssignmentProfiles,
  resolveRegisteredModelForPal,
  resolvePalRuntimeConfigForExecution,
  resolveConfiguredSkillIdsForPal,
} = assignmentApi;

const api = {
  resolveGuideChatModelApi,
  resolveGuideModelStateWithFallback,
  bindGuideToFirstRegisteredModelWithFallback,
  buildGuideReplyWithFallback,
  buildGuideModelRequiredPromptWithFallback,
  resolveGuideRegisteredModel,
  resolveGuideApiRuntimeConfig,
  buildFallbackGuidePlanOutputInstruction,
  parseGuidePlanResponseWithFallback,
  palRoleLabel,
  coreModelOptionsByProvider,
  resolvePalContextBuilderApi,
  resolveAgentIdentityApi,
  resolveAgentSkillResolverApi,
  resolveGuideTaskPlannerApi,
  resolveGuidePlanApi,
  resolveGuidePlanningIntentApi,
  resolveAgentRoutingApi,
  resolvePlanOrchestratorApi,
  resolveDebugRunsApi,
  guideMessageToContextMessage,
  normalizeGuideContextMessages,
  splitSystemPromptFromContextMessages,
  buildFallbackLanguagePrompt,
  buildFallbackIdentitySystemPrompt,
  normalizeToolCapabilitySnapshots,
  resolveRegisteredToolCapabilitySnapshots,
  loadAgentIdentityForPal,
  fallbackResolveSkillSummaries,
  resolveGuideConfiguredSkillIds,
  buildGuideContextWithFallback,
  nextTaskSequenceNumber,
  nextJobSequenceNumber,
  resolveWorkerAssignmentProfiles,
  resolveRegisteredModelForPal,
  resolvePalRuntimeConfigForExecution,
  resolveConfiguredSkillIdsForPal,
};

scope.WorkspaceAgentGuideRuntimeUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceAgentGuideRuntimeUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);
