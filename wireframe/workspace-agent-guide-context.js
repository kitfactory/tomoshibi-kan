(function attachWorkspaceAgentGuideContextUi(scope) {
const runtimeConfigApi = scope.WorkspaceRuntimeConfigUi || {};

const {
  normalizeToolName,
  normalizePalRole,
  normalizePalRuntimeKind,
} = runtimeConfigApi;

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


const api = {
  resolvePalContextBuilderApi,
  resolveAgentIdentityApi,
  initializePalIdentityTemplates,
  ensureBuiltInDebugPurposeIdentities,
  syncBuiltInResidentIdentitiesToWorkspace,
  resolveAgentSkillResolverApi,
  resolveGuideTaskPlannerApi,
  resolveGuidePlanApi,
  resolveGuidePlanningIntentApi,
  resolveAgentRoutingApi,
  resolveDebugIdentitySeedsApi,
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
};

scope.WorkspaceAgentGuideContextUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceAgentGuideContextUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);