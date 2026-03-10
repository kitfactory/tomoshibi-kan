(function attachWorkspaceAgentStateUi(scope) {
function clonePalProfileRecord(pal) {
  return {
    ...pal,
    models: Array.isArray(pal?.models) ? [...pal.models] : [],
    cliTools: Array.isArray(pal?.cliTools) ? [...pal.cliTools] : [],
    skills: Array.isArray(pal?.skills) ? [...pal.skills] : [],
  };
}

function normalizePalProfileIdWithFallback(role, id) {
  const normalizedRole = normalizePalRole(role);
  const raw = normalizeText(id).toLowerCase();
  if (!raw) return "";
  if (normalizedRole === "guide" && raw === "pal-guide") return "guide-core";
  if (normalizedRole === "gate" && raw === "pal-gate") return "gate-core";
  const prefix = normalizedRole === "guide"
    ? "guide-"
    : (normalizedRole === "gate" ? "gate-" : "pal-");
  const withPrefix = raw.startsWith(prefix) ? raw : `${prefix}${raw}`;
  return withPrefix.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}

function defaultPalDisplayNameForRole(role) {
  if (role === "guide") return "Guide Core";
  if (role === "gate") return "Gate Core";
  return "住人";
}

function defaultPalPersonaForRole(role) {
  if (role === "guide") return "Guide";
  if (role === "gate") return "Gate";
  return "Worker";
}

function normalizePalProfileRecord(input, index = 0) {
  const role = normalizePalRole(input?.role);
  const fallbackId = role === "guide"
    ? (index === 0 ? DEFAULT_AGENT_SELECTION.activeGuideId : `guide-${index + 1}`)
    : (role === "gate"
      ? (index === 0 ? DEFAULT_AGENT_SELECTION.defaultGateId : `gate-${index + 1}`)
      : `pal-worker-${String(index + 1).padStart(3, "0")}`);
  const id = normalizePalProfileIdWithFallback(role, input?.id || fallbackId);
  const runtimeKind = normalizePalRuntimeKind(input?.runtimeKind);
  const models = Array.isArray(input?.models)
    ? input.models.map((model) => normalizeText(model)).filter(Boolean)
    : [];
  const cliTools = Array.isArray(input?.cliTools)
    ? input.cliTools.map((tool) => normalizeToolName(tool)).filter(Boolean)
    : [];
  const skills = Array.isArray(input?.skills)
    ? input.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  return {
    id,
    role,
    runtimeKind,
    displayName: normalizeText(input?.displayName) || defaultPalDisplayNameForRole(role),
    persona: normalizeText(input?.persona) || defaultPalPersonaForRole(role),
    provider: providerIdFromInput(input?.provider),
    models,
    cliTools,
    skills,
    status: normalizeText(input?.status) || "active",
  };
}

function resolveAgentSelectionSnapshotWithFallback(input = {}) {
  const external = resolvePalProfileModelApi();
  if (external && typeof external.resolveAgentSelection === "function") {
    return external.resolveAgentSelection(input);
  }
  const profiles = Array.isArray(input.palProfiles) ? input.palProfiles : [];
  const guides = profiles.filter((pal) => normalizePalRole(pal?.role) === "guide");
  const gates = profiles.filter((pal) => normalizePalRole(pal?.role) === "gate");
  const requestedGuideId = normalizeText(input.activeGuideId);
  const requestedGateId = normalizeText(input.defaultGateId);
  return {
    activeGuideId: guides.some((pal) => pal.id === requestedGuideId)
      ? requestedGuideId
      : (guides[0]?.id || ""),
    defaultGateId: gates.some((pal) => pal.id === requestedGateId)
      ? requestedGateId
      : (gates[0]?.id || ""),
  };
}

function syncWorkspaceAgentSelection() {
  const next = resolveAgentSelectionSnapshotWithFallback({
    palProfiles,
    activeGuideId: workspaceAgentSelection.activeGuideId,
    defaultGateId: workspaceAgentSelection.defaultGateId,
  });
  workspaceAgentSelection.activeGuideId = next.activeGuideId || "";
  workspaceAgentSelection.defaultGateId = next.defaultGateId || "";
}

function buildPalProfilesSnapshot() {
  syncWorkspaceAgentSelection();
  return {
    profiles: palProfiles.map((pal) => clonePalProfileRecord(pal)),
    activeGuideId: workspaceAgentSelection.activeGuideId,
    defaultGateId: workspaceAgentSelection.defaultGateId,
  };
}

function normalizePalProfilesSnapshot(snapshot) {
  const incomingProfiles = Array.isArray(snapshot?.profiles) ? snapshot.profiles : [];
  const normalized = incomingProfiles.length > 0
    ? incomingProfiles
      .map((profile, index) => normalizePalProfileRecord(profile, index))
      .filter((profile) => !LEGACY_BUILT_IN_PROFILE_IDS.has(normalizeText(profile.id)) || isBuiltInProfileId(profile.id))
      .filter((profile, index, list) => profile.id && list.findIndex((item) => item.id === profile.id) === index)
    : INITIAL_PAL_PROFILES.map((pal) => clonePalProfileRecord(pal));
  if (!normalized.some((pal) => pal.role === "guide")) {
    normalized.unshift(normalizePalProfileRecord(INITIAL_PAL_PROFILES[0], 0));
  }
  if (!normalized.some((pal) => pal.role === "gate")) {
    normalized.splice(1, 0, normalizePalProfileRecord(INITIAL_PAL_PROFILES[1], 1));
  }
  const selection = resolveAgentSelectionSnapshotWithFallback({
    palProfiles: normalized,
    activeGuideId: snapshot?.activeGuideId,
    defaultGateId: snapshot?.defaultGateId,
  });
  return {
    profiles: normalized.map((pal) => clonePalProfileRecord(pal)),
    activeGuideId: selection.activeGuideId,
    defaultGateId: selection.defaultGateId,
  };
}

function readPalProfilesSnapshotWithFallback() {
  try {
    const raw = readLocalStorageSnapshot(
      PAL_PROFILES_LOCAL_STORAGE_KEY,
      LEGACY_PAL_PROFILES_LOCAL_STORAGE_KEYS
    );
    if (!raw) return null;
    return normalizePalProfilesSnapshot(JSON.parse(raw));
  } catch (error) {
    return null;
  }
}

function writePalProfilesSnapshotWithFallback(snapshot = buildPalProfilesSnapshot()) {
  try {
    writeLocalStorageSnapshot(PAL_PROFILES_LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function applyPalProfilesSnapshot(snapshot) {
  const normalized = normalizePalProfilesSnapshot(snapshot);
  palProfiles.splice(0, palProfiles.length, ...normalized.profiles.map((pal) => clonePalProfileRecord(pal)));
  workspaceAgentSelection.activeGuideId = normalized.activeGuideId;
  workspaceAgentSelection.defaultGateId = normalized.defaultGateId;
  syncPalProfilesRegistryRefs();
}

function isBuiltInProfileId(profileId) {
  return BUILT_IN_PROFILE_IDS.has(normalizeText(profileId));
}

function resolveBuiltInProfileDefinition(profileId) {
  const normalizedId = normalizeText(profileId);
  return INITIAL_PAL_PROFILES.find((profile) => profile.id === normalizedId) || null;
}

function syncBuiltInProfileMetadata() {
  const nextProfiles = [];
  INITIAL_PAL_PROFILES.forEach((builtInProfile) => {
    const existing = palProfiles.find((profile) => profile.id === builtInProfile.id);
    if (existing) {
      nextProfiles.push({
        ...clonePalProfileRecord(existing),
        role: builtInProfile.role,
        displayName: builtInProfile.displayName,
        persona: builtInProfile.persona,
      });
      return;
    }
    nextProfiles.push(clonePalProfileRecord(builtInProfile));
  });
  palProfiles
    .filter((profile) => !LEGACY_BUILT_IN_PROFILE_IDS.has(normalizeText(profile.id)))
    .forEach((profile) => {
      nextProfiles.push(clonePalProfileRecord(profile));
    });
  palProfiles.splice(0, palProfiles.length, ...nextProfiles);
  syncWorkspaceAgentSelection();
  syncPalProfilesRegistryRefs();
}

function normalizeGateDecision(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (normalized === "approved" || normalized === "rejected") return normalized;
  return "none";
}

function parseGateFixes(value) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function normalizeGateResultRecord(input, legacy = {}) {
  const decision = normalizeGateDecision(input?.decision || legacy?.decisionSummary);
  const reason = normalizeText(input?.reason);
  const fixes = Array.isArray(input?.fixes)
    ? input.fixes.map((item) => normalizeText(item)).filter(Boolean)
    : parseGateFixes(input?.fixes || legacy?.fixCondition);
  return {
    decision,
    reason: reason || (decision === "approved" ? "-" : "-"),
    fixes,
    decisionSummary: decision === "approved" ? "approved" : (decision === "rejected" ? "rejected" : normalizeText(legacy?.decisionSummary) || "-"),
    fixCondition: fixes.length > 0 ? fixes.join("\n") : (normalizeText(legacy?.fixCondition) || "-"),
  };
}

function buildGateResultRecord(decision, reasonText) {
  const normalizedDecision = normalizeGateDecision(decision);
  const reason = normalizeText(reasonText);
  const fixes = normalizedDecision === "rejected" ? parseGateFixes(reasonText) : [];
  return {
    decision: normalizedDecision,
    reason: reason || (normalizedDecision === "approved"
      ? (locale === "ja" ? "根拠を満たしているため承認" : "Approved because the evidence is sufficient.")
      : "-"),
    fixes,
  };
}

function normalizeTaskRecord(input, index = 0) {
  const gateResult = normalizeGateResultRecord(input?.gateResult, {
    decisionSummary: input?.decisionSummary,
    fixCondition: input?.fixCondition,
  });
  return {
    id: normalizeText(input?.id) || `TASK-${String(index + 1).padStart(3, "0")}`,
    planId: normalizeText(input?.planId) || "PLAN-001",
    title: normalizeText(input?.title) || `Task ${index + 1}`,
    description: normalizeText(input?.description),
    palId: normalizeText(input?.palId),
    status: normalizeText(input?.status) || "assigned",
    updatedAt: normalizeText(input?.updatedAt) || "-",
    decisionSummary: normalizeText(input?.decisionSummary) || "-",
    constraintsCheckResult: normalizeText(input?.constraintsCheckResult) || "-",
    evidence: normalizeText(input?.evidence) || "-",
    replay: normalizeText(input?.replay) || "-",
    fixCondition: gateResult.fixCondition,
    gateResult,
    gateProfileId: normalizeText(input?.gateProfileId),
  };
}

function normalizeJobRecord(input, index = 0) {
  const gateResult = normalizeGateResultRecord(input?.gateResult, {
    decisionSummary: input?.decisionSummary,
    fixCondition: input?.fixCondition,
  });
  return {
    id: normalizeText(input?.id) || `JOB-${String(index + 1).padStart(3, "0")}`,
    planId: normalizeText(input?.planId) || "PLAN-001",
    title: normalizeText(input?.title) || `Job ${index + 1}`,
    description: normalizeText(input?.description),
    palId: normalizeText(input?.palId),
    schedule: normalizeText(input?.schedule) || "-",
    instruction: normalizeText(input?.instruction) || "-",
    status: normalizeText(input?.status) || "assigned",
    updatedAt: normalizeText(input?.updatedAt) || "-",
    decisionSummary: gateResult.decisionSummary,
    fixCondition: gateResult.fixCondition,
    gateResult,
    lastRunAt: normalizeText(input?.lastRunAt) || "-",
    evidence: normalizeText(input?.evidence) || "-",
    replay: normalizeText(input?.replay) || "-",
    gateProfileId: normalizeText(input?.gateProfileId),
  };
}

function buildBoardStateSnapshot() {
  return {
    selectedTaskId: normalizeText(selectedTaskId),
    tasks: tasks.map((task, index) => normalizeTaskRecord(task, index)),
    jobs: jobs.map((job, index) => normalizeJobRecord(job, index)),
  };
}

function normalizeBoardStateSnapshot(snapshot) {
  const nextTasks = Array.isArray(snapshot?.tasks)
    ? snapshot.tasks.map((task, index) => normalizeTaskRecord(task, index))
    : [];
  const nextJobs = Array.isArray(snapshot?.jobs)
    ? snapshot.jobs.map((job, index) => normalizeJobRecord(job, index))
    : [];
  const requestedSelectedTaskId = normalizeText(snapshot?.selectedTaskId);
  const selected = nextTasks.some((task) => task.id === requestedSelectedTaskId)
    ? requestedSelectedTaskId
    : (nextTasks[0]?.id || "");
  return {
    selectedTaskId: selected,
    tasks: nextTasks,
    jobs: nextJobs,
  };
}

function readBoardStateSnapshot() {
  try {
    const raw = readLocalStorageSnapshot(BOARD_STATE_LOCAL_STORAGE_KEY, LEGACY_BOARD_STATE_LOCAL_STORAGE_KEYS);
    if (!raw) return null;
    return normalizeBoardStateSnapshot(JSON.parse(raw));
  } catch (error) {
    return null;
  }
}

function writeBoardStateSnapshot(snapshot = buildBoardStateSnapshot()) {
  try {
    writeLocalStorageSnapshot(BOARD_STATE_LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function applyBoardStateSnapshot(snapshot) {
  const normalized = normalizeBoardStateSnapshot(snapshot);
  if (normalized.tasks.length > 0) {
    tasks.splice(0, tasks.length, ...normalized.tasks);
  }
  if (normalized.jobs.length > 0) {
    jobs.splice(0, jobs.length, ...normalized.jobs);
  }
  selectedTaskId = normalized.selectedTaskId || tasks[0]?.id || null;
}

function providerLabel(providerId) {
  const entry = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === providerId);
  return entry ? entry.label : providerId;
}

function providerIdFromInput(value) {
  if (!value) return DEFAULT_PROVIDER_ID;
  const asId = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === value);
  if (asId) return asId.id;
  const asLabel = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find((provider) => provider.label === value);
  return asLabel ? asLabel.id : DEFAULT_PROVIDER_ID;
}

function isApiKeyRequiredForProvider(providerId) {
  return !OPTIONAL_API_KEY_PROVIDERS.has(providerIdFromInput(providerId));
}

function resolveProviderForModelName(modelName, fallbackProviderId = DEFAULT_PROVIDER_ID) {
  const normalizedName = normalizeText(modelName);
  const preferredProviderId = providerIdFromInput(fallbackProviderId);
  if (!normalizedName) return preferredProviderId;
  const preferredPairExists = TOMOSHIBIKAN_CORE_MODEL_REGISTRY.some(
    (entry) => entry.name === normalizedName && providerIdFromInput(entry.provider) === preferredProviderId
  );
  if (preferredPairExists) return preferredProviderId;
  const matched = TOMOSHIBIKAN_CORE_MODEL_REGISTRY.find((entry) => entry.name === normalizedName);
  if (matched && PROVIDER_OPTIONS.includes(providerIdFromInput(matched.provider))) {
    return providerIdFromInput(matched.provider);
  }
  const inferred = inferProviderIdFromModelName(normalizedName);
  if (inferred) return inferred;
  return preferredProviderId;
}

function normalizeRegisteredModel(model) {
  const apiKey = String(model.apiKey || model.apiKeyInput || "").trim();
  const apiKeyConfigured = Boolean(model.apiKeyConfigured || apiKey);
  const name = String(model.name || "").trim();
  const requestedProvider = providerIdFromInput(model.provider);
  const resolvedProvider = name
    ? resolveProviderForModelName(name, requestedProvider)
    : requestedProvider;
  return {
    name,
    provider: resolvedProvider,
    apiKey,
    apiKeyConfigured,
    baseUrl: String(model.baseUrl || "").trim(),
    endpoint: String(model.endpoint || "").trim(),
  };
}

function normalizeToolName(toolName) {
  if (!toolName) return CLI_TOOL_OPTIONS[0];
  return CLI_TOOL_OPTIONS.includes(toolName) ? toolName : CLI_TOOL_OPTIONS[0];
}

function allowedSkillIdsForRole(role) {
  const normalized = normalizePalRole(role);
  const allowed = ROLE_SKILL_POLICY[normalized] || ROLE_SKILL_POLICY.worker;
  const dynamic = settingsState && Array.isArray(settingsState.registeredSkills)
    ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  return [...new Set([...allowed, ...dynamic])];
}

function normalizePalRole(role) {
  if (!role) return "worker";
  return PAL_ROLE_OPTIONS.includes(role) ? role : "worker";
}

function normalizePalRuntimeKind(kind) {
  if (!kind) return "model";
  return PAL_RUNTIME_KIND_OPTIONS.includes(kind) ? kind : "model";
}

function validatePalRuntimeSelectionWithFallback(input) {
  const external =
    typeof window !== "undefined" &&
    window.PalRuntimeValidation &&
    typeof window.PalRuntimeValidation.validatePalRuntimeSelection === "function"
      ? window.PalRuntimeValidation
      : null;
  if (external) {
    return external.validatePalRuntimeSelection(input);
  }

  const runtimeKind = normalizePalRuntimeKind(input?.runtimeKind);
  const availableModels = Array.isArray(input?.availableModels) ? input.availableModels : [];
  const availableTools = Array.isArray(input?.availableTools) ? input.availableTools : [];
  const requestedSkillIds = Array.isArray(input?.requestedSkillIds) ? input.requestedSkillIds : [];
  const allowedSkillIds = Array.isArray(input?.allowedSkillIds) ? input.allowedSkillIds : [];
  const runtimeTarget = String(input?.runtimeTarget || "").trim();

  if (runtimeKind === "model") {
    if (!runtimeTarget || !availableModels.includes(runtimeTarget)) {
      return {
        ok: false,
        errorCode: "MSG-PPH-1001",
        runtimeKind,
        models: [],
        cliTools: [],
        skills: [],
      };
    }
    return {
      ok: true,
      runtimeKind,
      models: [runtimeTarget],
      cliTools: [],
      skills: requestedSkillIds.filter((skillId) => allowedSkillIds.includes(skillId)),
    };
  }

  const normalizedTool = normalizeToolName(runtimeTarget);
  if (!runtimeTarget || !availableTools.includes(normalizedTool)) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1001",
      runtimeKind,
      models: [],
      cliTools: [],
      skills: [],
    };
  }
  return {
    ok: true,
    runtimeKind,
    models: [],
    cliTools: [normalizedTool],
    skills: [],
  };
}

function resolvePalProfileModelApi() {
  return typeof window !== "undefined" &&
    window.PalProfileModel &&
    typeof window.PalProfileModel.createPalProfile === "function" &&
    typeof window.PalProfileModel.canDeletePalProfile === "function" &&
    typeof window.PalProfileModel.applyRuntimeSelection === "function"
    ? window.PalProfileModel
    : null;
}

function createPalProfileWithFallback(input) {
  const external = resolvePalProfileModelApi();
  if (external) {
    return external.createPalProfile(input);
  }
  const role = normalizePalRole(input?.role);
  const runtimeKind = input.availableModels.length > 0 ? "model" : "tool";
  const defaultModel = input.availableModels[0] || "";
  const defaultTool = input.availableTools[0] || "";
  const defaultSkills = runtimeKind === "model" ? [...input.roleAllowedSkills] : [];
  return {
    id: normalizePalProfileIdWithFallback(role, input.id),
    role,
    runtimeKind,
    displayName: normalizeText(input.displayName) || (role === "guide" ? "New Guide" : (role === "gate" ? "New Gate" : "新しい住人")),
    persona: role === "guide" ? "Guide" : (role === "gate" ? "Gate" : "Worker"),
    provider: runtimeKind === "model" ? input.defaultProvider : "",
    models: runtimeKind === "model" && defaultModel ? [defaultModel] : [],
    cliTools: runtimeKind === "tool" && defaultTool ? [defaultTool] : [],
    skills: defaultSkills,
    status: "active",
  };
}

function canDeletePalProfileWithFallback(palId) {
  const external = resolvePalProfileModelApi();
  if (external) {
    return external.canDeletePalProfile({ palId, tasks, jobs, palProfiles });
  }
  const pal = palProfiles.find((item) => item.id === palId) || null;
  if (pal && normalizePalRole(pal.role) !== "worker") {
    return palProfiles.filter((item) => normalizePalRole(item.role) === normalizePalRole(pal.role)).length > 1;
  }
  const hasTask = tasks.some((task) => task.palId === palId);
  const hasJob = jobs.some((job) => job.palId === palId);
  return !hasTask && !hasJob;
}

function applyPalRuntimeSelectionWithFallback(input) {
  const external = resolvePalProfileModelApi();
  if (external) {
    return external.applyRuntimeSelection(input);
  }
  const next = { ...input.pal };
  const displayName = String(input.displayName || "").trim() || next.displayName || "Pal";
  next.displayName = displayName;
  next.runtimeKind = input.runtimeKind;
  if (input.runtimeKind === "model") {
    const selectedModel = input.runtimeResult.models[0] || "";
    next.models = selectedModel ? [selectedModel] : [];
    next.cliTools = [];
    next.skills = [...input.runtimeResult.skills];
    next.provider = selectedModel ? input.resolveProviderForModel(selectedModel) : "";
  } else {
    const selectedTool = input.runtimeResult.cliTools[0] || "";
    next.models = [];
    next.cliTools = selectedTool ? [selectedTool] : [];
    next.skills = [];
    next.provider = "";
  }
  return next;
}

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

function nextTaskSequenceNumber() {
  return tasks.reduce((max, task) => {
    const matched = String(task?.id || "").match(/^TASK-(\d+)$/i);
    if (!matched) return max;
    return Math.max(max, Number(matched[1] || 0));
  }, 0) + 1;
}

function nextJobSequenceNumber() {
  return jobs.reduce((max, job) => {
    const matched = String(job?.id || "").match(/^JOB-(\d+)$/i);
    if (!matched) return max;
    return Math.max(max, Number(matched[1] || 0));
  }, 0) + 1;
}

async function resolveWorkerAssignmentProfiles() {
  const workers = palProfiles.filter((pal) => pal.role === "worker");
  if (workers.length === 0) return [];
  const identityApi = resolveAgentIdentityApi();
  const skillResolverApi = resolveAgentSkillResolverApi();
  const installedSkillIds = Array.isArray(settingsState.registeredSkills)
    ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const skillCatalogItems = CLAWHUB_SKILL_REGISTRY.map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
  }));

  const profiles = await Promise.all(
    workers.map(async (pal) => {
      let identity = null;
      if (identityApi) {
        try {
          identity = await identityApi.load({
            agentType: "worker",
            agentId: pal.id,
          });
        } catch (error) {
          identity = null;
        }
      }
      const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
      const selectedToolNames = Array.isArray(pal.cliTools) ? pal.cliTools : [];
      const configuredSkillIds = identity && identity.hasIdentityFiles
        ? (Array.isArray(identity.enabledSkillIds)
          ? identity.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
          : [])
        : (Array.isArray(pal.skills)
          ? pal.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
          : []);
      const resolvedSkillSummaries = skillResolverApi
        ? skillResolverApi.resolveSkillSummariesForContext({
          runtimeKind,
          configuredSkillIds,
          installedSkillIds,
          catalogItems: skillCatalogItems,
          selectedToolNames,
          registeredToolCapabilities: resolveRegisteredToolCapabilitySnapshots(selectedToolNames),
        })
        : null;
      const skillSummaries = Array.isArray(resolvedSkillSummaries?.skillSummaries)
        ? resolvedSkillSummaries.skillSummaries
        : fallbackResolveSkillSummaries(
          runtimeKind,
          configuredSkillIds,
          installedSkillIds,
          skillCatalogItems,
          selectedToolNames,
          resolveRegisteredToolCapabilitySnapshots(selectedToolNames)
        );
      const roleText = identity && identity.hasIdentityFiles && normalizeText(identity.role)
        ? normalizeText(identity.role)
        : normalizeText(pal.persona || pal.displayName || pal.id);
      return {
        id: pal.id,
        displayName: pal.displayName || pal.id,
        persona: pal.persona || "",
        runtimeKind,
        roleText,
        enabledSkillIds: configuredSkillIds,
        skillSummaries,
      };
    })
  );
  return profiles;
}

function resolveRegisteredModelForPal(pal) {
  const selectedModelName = Array.isArray(pal?.models) ? normalizeText(pal.models[0]) : "";
  if (!selectedModelName) return null;
  const providerHint = providerIdFromInput(pal?.provider || "");
  const candidates = settingsState.registeredModels.filter((model) => (
    normalizeText(model?.name).toLowerCase() === selectedModelName.toLowerCase()
  ));
  if (candidates.length === 0) return null;
  if (!providerHint) return candidates[0];
  return candidates.find((model) => providerIdFromInput(model.provider) === providerHint) || candidates[0];
}

function resolvePalRuntimeConfigForExecution(pal) {
  if (!pal || normalizePalRuntimeKind(pal.runtimeKind) !== "model") return null;
  const model = resolveRegisteredModelForPal(pal);
  if (!model) return null;
  return {
    provider: providerIdFromInput(model.provider || pal.provider || DEFAULT_PROVIDER_ID),
    modelName: normalizeText(model.name),
    baseUrl: normalizeText(model.baseUrl),
    apiKey: normalizeText(model.apiKey),
  };
}

async function resolveConfiguredSkillIdsForPal(pal) {
  const fallback = Array.isArray(pal?.skills)
    ? pal.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi || !pal) return fallback;
  const role = normalizePalRole(pal.role);
  const agentType = role === "worker" ? "worker" : role;
  if (!agentType) return fallback;
  try {
    const identity = await identityApi.load({
      agentType,
      agentId: pal.id,
    });
    if (!identity || !identity.hasIdentityFiles) return fallback;
    return Array.isArray(identity.enabledSkillIds)
      ? identity.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [];
  } catch (error) {
    return fallback;
  }
}

const api = {
  clonePalProfileRecord,
  normalizePalProfileIdWithFallback,
  defaultPalDisplayNameForRole,
  defaultPalPersonaForRole,
  normalizePalProfileRecord,
  resolveAgentSelectionSnapshotWithFallback,
  syncWorkspaceAgentSelection,
  buildPalProfilesSnapshot,
  normalizePalProfilesSnapshot,
  readPalProfilesSnapshotWithFallback,
  writePalProfilesSnapshotWithFallback,
  applyPalProfilesSnapshot,
  isBuiltInProfileId,
  resolveBuiltInProfileDefinition,
  syncBuiltInProfileMetadata,
  normalizeGateDecision,
  parseGateFixes,
  normalizeGateResultRecord,
  buildGateResultRecord,
  normalizeTaskRecord,
  normalizeJobRecord,
  buildBoardStateSnapshot,
  normalizeBoardStateSnapshot,
  readBoardStateSnapshot,
  writeBoardStateSnapshot,
  applyBoardStateSnapshot,
  providerLabel,
  providerIdFromInput,
  isApiKeyRequiredForProvider,
  resolveProviderForModelName,
  normalizeRegisteredModel,
  normalizeToolName,
  allowedSkillIdsForRole,
  normalizePalRole,
  normalizePalRuntimeKind,
  validatePalRuntimeSelectionWithFallback,
  resolvePalProfileModelApi,
  createPalProfileWithFallback,
  canDeletePalProfileWithFallback,
  applyPalRuntimeSelectionWithFallback,
  resolveGuideChatModelApi,
  resolveGuideModelStateWithFallback,
  bindGuideToFirstRegisteredModelWithFallback,
  buildGuideReplyWithFallback,
  buildGuideModelRequiredPromptWithFallback,
  resolveGuideRegisteredModel,
  resolveGuideApiRuntimeConfig,
  requestGuideModelReplyWithFallback,
  buildFallbackGuidePlanOutputInstruction,
  parseGuidePlanResponseWithFallback,
  palRoleLabel,
  coreModelOptionsByProvider,
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
  nextTaskSequenceNumber,
  nextJobSequenceNumber,
  resolveWorkerAssignmentProfiles,
  resolveRegisteredModelForPal,
  resolvePalRuntimeConfigForExecution,
  resolveConfiguredSkillIdsForPal,
};

scope.WorkspaceAgentStateUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceAgentStateUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);
