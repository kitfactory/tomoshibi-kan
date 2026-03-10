(function attachWorkspaceRuntimeConfigUi(scope) {
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

function normalizePalRole(role) {
  if (!role) return "worker";
  return PAL_ROLE_OPTIONS.includes(role) ? role : "worker";
}

function normalizePalRuntimeKind(kind) {
  if (!kind) return "model";
  return PAL_RUNTIME_KIND_OPTIONS.includes(kind) ? kind : "model";
}

function allowedSkillIdsForRole(role) {
  const normalized = normalizePalRole(role);
  const allowed = ROLE_SKILL_POLICY[normalized] || ROLE_SKILL_POLICY.worker;
  const dynamic = settingsState && Array.isArray(settingsState.registeredSkills)
    ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  return [...new Set([...allowed, ...dynamic])];
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

const api = {
  providerLabel,
  providerIdFromInput,
  isApiKeyRequiredForProvider,
  resolveProviderForModelName,
  normalizeRegisteredModel,
  normalizeToolName,
  normalizePalRole,
  normalizePalRuntimeKind,
  allowedSkillIdsForRole,
  validatePalRuntimeSelectionWithFallback,
  resolvePalProfileModelApi,
  createPalProfileWithFallback,
  canDeletePalProfileWithFallback,
  applyPalRuntimeSelectionWithFallback,
};

scope.WorkspaceRuntimeConfigUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceRuntimeConfigUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);
