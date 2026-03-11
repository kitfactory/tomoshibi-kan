(function attachSettingsState(scope) {
function normalizeContextHandoffPolicy(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (normalized === "minimal" || normalized === "verbose") return normalized;
  return DEFAULT_CONTEXT_HANDOFF_POLICY;
}

function resolveSettingsPersistenceModelApi() {
  return typeof window !== "undefined" &&
    window.SettingsPersistenceModel &&
    typeof window.SettingsPersistenceModel.buildSettingsSavePayload === "function" &&
    typeof window.SettingsPersistenceModel.normalizeSettingsSnapshot === "function" &&
    typeof window.SettingsPersistenceModel.buildLocalStoredSnapshot === "function"
    ? window.SettingsPersistenceModel
    : null;
}

function resolveSettingsStorageApi() {
  const bridge = resolveWindowBridge("TomoshibikanSettingsStorage", "PalpalSettingsStorage");
  return bridge &&
    typeof bridge.load === "function" &&
    typeof bridge.save === "function"
    ? bridge
    : null;
}

function resolveTomoshibikanCoreRuntimeApi() {
  const runtime = resolveWindowBridge("TomoshibikanCoreRuntime", "PalpalCoreRuntime");
  if (!runtime || typeof runtime.guideChat !== "function") return null;
  return runtime;
}

function hasTomoshibikanCoreRuntimeApi() {
  return Boolean(resolveTomoshibikanCoreRuntimeApi());
}

function hasTomoshibikanCorePalChatApi() {
  const runtime = resolveTomoshibikanCoreRuntimeApi();
  return Boolean(runtime && typeof runtime.palChat === "function");
}

function isGuideControllerAssistEnabled() {
  return settingsState.guideControllerAssistEnabled === true;
}

function resolveRuntimeWorkspaceRootForChat() {
  const focus = focusedProject();
  const directory = normalizeText(focus?.directory);
  return directory || "";
}

function applyCoreCatalogSnapshot(catalog) {
  if (!catalog || typeof catalog !== "object") return false;
  const providers = resolveProviderRegistry(catalog.providers);
  const models = normalizeCoreModelCatalog(catalog.models);
  if (providers.length === 0 && models.length === 0) return false;

  TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY = providers;
  PROVIDER_OPTIONS = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.map((provider) => provider.id);
  DEFAULT_PROVIDER_ID = PROVIDER_OPTIONS[0] || DEFAULT_PROVIDER_ID || "openai";
  TOMOSHIBIKAN_CORE_MODEL_REGISTRY = models;
  TOMOSHIBIKAN_CORE_MODEL_OPTIONS_BY_PROVIDER = buildModelOptionsByProvider(
    TOMOSHIBIKAN_CORE_MODEL_REGISTRY,
    PROVIDER_OPTIONS
  );
  MODEL_OPTIONS = buildModelOptionList(TOMOSHIBIKAN_CORE_MODEL_REGISTRY, [DEV_LMSTUDIO_MODEL_NAME]);
  DEFAULT_MODEL_NAME = DEV_LMSTUDIO_MODEL_NAME || MODEL_OPTIONS[0] || "";

  if (typeof window !== "undefined") {
    window.TOMOSHIBIKAN_CORE_PROVIDERS = [...TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY];
    window.PALPAL_CORE_PROVIDERS = [...TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY];
    window.TOMOSHIBIKAN_CORE_MODELS = [...TOMOSHIBIKAN_CORE_MODEL_REGISTRY];
    window.PALPAL_CORE_MODELS = [...TOMOSHIBIKAN_CORE_MODEL_REGISTRY];
  }
  return true;
}

async function refreshCoreCatalogFromRuntime() {
  if (!hasRuntimeCatalogBridge()) return false;
  try {
    const runtime = resolveTomoshibikanCoreRuntimeApi();
    const latest = await runtime.listProviderModels();
    const applied = applyCoreCatalogSnapshot(latest);
    if (!applied) return false;
    syncSettingsModelsFromRegistry();
    syncPalProfilesRegistryRefs();
    bindGuideToFirstRegisteredModelWithFallback();
    return true;
  } catch (error) {
    return false;
  }
}

function buildSettingsSavePayloadWithFallback() {
  const external = resolveSettingsPersistenceModelApi();
  if (external) {
    return external.buildSettingsSavePayload({
      locale,
      contextHandoffPolicy: settingsState.contextHandoffPolicy,
      guideControllerAssistEnabled: settingsState.guideControllerAssistEnabled,
      registeredModels: settingsState.registeredModels,
      registeredTools: settingsState.registeredTools,
      registeredToolCapabilities: settingsState.registeredToolCapabilities,
      registeredSkills: settingsState.registeredSkills,
    });
  }
  return {
    locale: locale === "en" ? "en" : "ja",
    contextHandoffPolicy: normalizeContextHandoffPolicy(settingsState.contextHandoffPolicy),
    guideControllerAssistEnabled: settingsState.guideControllerAssistEnabled === true,
    registeredModels: settingsState.registeredModels
      .map((model) => ({
        name: String(model.name || "").trim(),
        provider: providerIdFromInput(model.provider),
        baseUrl: String(model.baseUrl || "").trim(),
        endpoint: String(model.endpoint || "").trim(),
        apiKeyInput: String(model.apiKey || "").trim(),
        apiKeyConfigured: Boolean(model.apiKeyConfigured),
      }))
      .filter((model) => Boolean(model.name)),
    registeredTools: [...new Set(settingsState.registeredTools.map((tool) => normalizeToolName(tool)))],
    registeredToolCapabilities: Array.isArray(settingsState.registeredToolCapabilities)
      ? settingsState.registeredToolCapabilities
        .map((entry) => ({
          toolName: normalizeToolName(entry?.toolName),
          status: normalizeText(entry?.status) || "unavailable",
          fetchedAt: normalizeText(entry?.fetchedAt),
          commandName: normalizeText(entry?.commandName),
          versionText: normalizeText(entry?.versionText),
          capabilities: Array.isArray(entry?.capabilities) ? entry.capabilities : [],
          capabilitySummaries: Array.isArray(entry?.capabilitySummaries) ? entry.capabilitySummaries : [],
          errorText: normalizeText(entry?.errorText),
        }))
        .filter((entry) => Boolean(entry.toolName))
      : [],
    registeredSkills: [...new Set(settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean))],
  };
}

function stableSettingsPayloadForSignature(payload = buildSettingsSavePayloadWithFallback()) {
  const input = payload || {};
  const localeValue = String(input.locale || "ja") === "en" ? "en" : "ja";
  const models = Array.isArray(input.registeredModels) ? input.registeredModels : [];
  const tools = Array.isArray(input.registeredTools) ? input.registeredTools : [];
  const skills = Array.isArray(input.registeredSkills) ? input.registeredSkills : [];

  const normalizedModels = models
    .map((model) => ({
      name: String(model?.name || "").trim(),
      provider: providerIdFromInput(model?.provider),
      baseUrl: String(model?.baseUrl || "").trim(),
      endpoint: String(model?.endpoint || "").trim(),
      apiKeyConfigured: Boolean(model?.apiKeyConfigured),
      apiKeyInputPresent: Boolean(String(model?.apiKeyInput || model?.apiKey || "").trim()),
    }))
    .filter((model) => Boolean(model.name))
    .sort((left, right) => {
      const leftKey = `${left.provider}:${left.name}`.toLowerCase();
      const rightKey = `${right.provider}:${right.name}`.toLowerCase();
      return leftKey.localeCompare(rightKey);
    });

  const normalizedTools = [...new Set(tools.map((tool) => normalizeToolName(tool)))]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));

  const normalizedSkills = [...new Set(skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));

  return {
    locale: localeValue,
    contextHandoffPolicy: normalizeContextHandoffPolicy(input.contextHandoffPolicy),
    guideControllerAssistEnabled: input.guideControllerAssistEnabled === true,
    registeredModels: normalizedModels,
    registeredTools: normalizedTools,
    registeredToolCapabilities: Array.isArray(input.registeredToolCapabilities)
      ? input.registeredToolCapabilities
        .map((entry) => ({
          toolName: normalizeToolName(entry?.toolName),
          status: normalizeText(entry?.status) || "unavailable",
          fetchedAt: normalizeText(entry?.fetchedAt),
          commandName: normalizeText(entry?.commandName),
          versionText: normalizeText(entry?.versionText),
          capabilities: Array.isArray(entry?.capabilities) ? entry.capabilities : [],
          capabilitySummaries: Array.isArray(entry?.capabilitySummaries) ? entry.capabilitySummaries : [],
          errorText: normalizeText(entry?.errorText),
        }))
        .filter((entry) => Boolean(entry.toolName))
        .sort((left, right) => left.toolName.localeCompare(right.toolName))
      : [],
    registeredSkills: normalizedSkills,
  };
}

function buildSettingsSignature(payload = buildSettingsSavePayloadWithFallback()) {
  try {
    return JSON.stringify(stableSettingsPayloadForSignature(payload));
  } catch (error) {
    return "";
  }
}

function markSettingsSavedBaseline() {
  settingsSavedSignature = buildSettingsSignature();
}

function hasUnsavedSettingsChanges() {
  if (!settingsSavedSignature) return false;
  return buildSettingsSignature() !== settingsSavedSignature;
}

function normalizeSettingsSnapshotWithFallback(snapshot) {
  const external = resolveSettingsPersistenceModelApi();
  if (external) {
    return external.normalizeSettingsSnapshot(snapshot);
  }
  const input = snapshot || {};
  return {
    locale: input.locale === "en" ? "en" : "ja",
    contextHandoffPolicy: normalizeContextHandoffPolicy(input.contextHandoffPolicy),
    guideControllerAssistEnabled: input.guideControllerAssistEnabled === true,
    registeredModels: Array.isArray(input.registeredModels)
      ? input.registeredModels
        .map((model) => ({
          name: String(model.name || "").trim(),
          provider: providerIdFromInput(model.provider),
          baseUrl: String(model.baseUrl || "").trim(),
          endpoint: String(model.endpoint || "").trim(),
          apiKeyConfigured: Boolean(model.apiKeyConfigured),
          apiKey: "",
        }))
        .filter((model) => Boolean(model.name))
      : [],
    registeredTools: Array.isArray(input.registeredTools)
      ? input.registeredTools.map((tool) => normalizeToolName(tool))
      : [],
    registeredToolCapabilities: Array.isArray(input.registeredToolCapabilities)
      ? input.registeredToolCapabilities
        .map((entry) => ({
          toolName: normalizeToolName(entry?.toolName),
          status: normalizeText(entry?.status) || "unavailable",
          fetchedAt: normalizeText(entry?.fetchedAt),
          commandName: normalizeText(entry?.commandName),
          versionText: normalizeText(entry?.versionText),
          capabilities: Array.isArray(entry?.capabilities) ? entry.capabilities : [],
          capabilitySummaries: Array.isArray(entry?.capabilitySummaries) ? entry.capabilitySummaries : [],
          errorText: normalizeText(entry?.errorText),
        }))
        .filter((entry) => Boolean(entry.toolName))
      : [],
    registeredSkills: Array.isArray(input.registeredSkills)
      ? input.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [],
  };
}

function readLocalSettingsSnapshotWithFallback() {
  try {
    const raw = readLocalStorageSnapshot(
      SETTINGS_LOCAL_STORAGE_KEY,
      LEGACY_SETTINGS_LOCAL_STORAGE_KEYS
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeSettingsSnapshotWithFallback(parsed);
  } catch (error) {
    return null;
  }
}

function writeLocalSettingsSnapshotWithFallback(snapshot) {
  try {
    writeLocalStorageSnapshot(SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // ignore
  }
}

function buildLocalStoredSnapshotWithFallback(existingSnapshot, payload) {
  const external = resolveSettingsPersistenceModelApi();
  if (external) {
    return external.buildLocalStoredSnapshot({ existingSnapshot, payload });
  }
  const existing = normalizeSettingsSnapshotWithFallback(existingSnapshot);
  const normalizedPayload = payload || buildSettingsSavePayloadWithFallback();
  const existingByName = new Map(existing.registeredModels.map((model) => [model.name, model]));
  const nextModels = normalizedPayload.registeredModels.map((model) => {
    const previous = existingByName.get(model.name);
    return {
      name: model.name,
      provider: providerIdFromInput(model.provider),
      baseUrl: model.baseUrl,
      endpoint: model.endpoint,
      apiKeyConfigured: Boolean(model.apiKeyInput || previous?.apiKeyConfigured),
    };
  });
  return {
    locale: normalizedPayload.locale,
    contextHandoffPolicy: normalizeContextHandoffPolicy(normalizedPayload.contextHandoffPolicy),
    guideControllerAssistEnabled: normalizedPayload.guideControllerAssistEnabled === true,
    registeredModels: nextModels,
    registeredTools: normalizedPayload.registeredTools,
    registeredToolCapabilities: normalizedPayload.registeredToolCapabilities,
    registeredSkills: normalizedPayload.registeredSkills,
  };
}

function applySettingsSnapshot(snapshot) {
  if (!snapshot) return;
  const normalized = normalizeSettingsSnapshotWithFallback(snapshot);
  locale = normalized.locale === "en" ? "en" : "ja";
  settingsState.contextHandoffPolicy = normalizeContextHandoffPolicy(normalized.contextHandoffPolicy);
  settingsState.guideControllerAssistEnabled = normalized.guideControllerAssistEnabled === true;
  settingsState.registeredModels = normalized.registeredModels.map(normalizeRegisteredModel);
  settingsState.registeredTools = normalized.registeredTools.map((tool) => normalizeToolName(tool));
  settingsState.registeredToolCapabilities = Array.isArray(normalized.registeredToolCapabilities)
    ? normalized.registeredToolCapabilities
    : [];
  settingsState.registeredSkills = normalized.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean);
  syncSettingsModelsFromRegistry();
  syncPalProfilesFromSettings();
  markSettingsSavedBaseline();
}

async function loadSettingsSnapshotWithFallback() {
  const storageApi = resolveSettingsStorageApi();
  if (storageApi) {
    try {
      const loaded = await storageApi.load();
      return normalizeSettingsSnapshotWithFallback(loaded);
    } catch (error) {
      return null;
    }
  }
  return readLocalSettingsSnapshotWithFallback();
}

async function saveSettingsSnapshotWithFallback() {
  const payload = buildSettingsSavePayloadWithFallback();
  const storageApi = resolveSettingsStorageApi();
  if (storageApi) {
    const saved = await storageApi.save(payload);
    return normalizeSettingsSnapshotWithFallback(saved);
  }
  const existing = readLocalSettingsSnapshotWithFallback();
  const localSnapshot = buildLocalStoredSnapshotWithFallback(existing, payload);
  writeLocalSettingsSnapshotWithFallback(localSnapshot);
  return normalizeSettingsSnapshotWithFallback(localSnapshot);
}

async function resolveStoredModelApiKeyWithFallback(modelName, fallbackApiKey) {
  const direct = String(fallbackApiKey || "").trim();
  if (direct) return direct;
  const storageApi = resolveSettingsStorageApi();
  if (!storageApi || typeof storageApi.resolveModelApiKey !== "function") return "";
  try {
    return String(await storageApi.resolveModelApiKey(modelName)).trim();
  } catch (error) {
    return "";
  }
}

function resolveSkillMarketStateApi() {
  return typeof window !== "undefined" && window.SettingsSkillMarketState
    ? window.SettingsSkillMarketState
    : {};
}

function resolveSkillCatalogValidationApi() {
  return resolveSkillMarketStateApi().resolveSkillCatalogValidationApi?.();
}

function normalizeGenericSkillId(skillId) {
  return resolveSkillMarketStateApi().normalizeGenericSkillId?.(skillId) || "";
}

function resolveAllowedSkillIdsForValidation(additionalSkillIds = []) {
  return resolveSkillMarketStateApi().resolveAllowedSkillIdsForValidation?.(additionalSkillIds) || [];
}

function normalizeSkillId(skillId) {
  return resolveSkillMarketStateApi().normalizeSkillId?.(skillId) || "";
}

function skillById(skillId) {
  return resolveSkillMarketStateApi().skillById?.(skillId) || null;
}

function skillName(skillId) {
  return resolveSkillMarketStateApi().skillName?.(skillId) || skillId;
}

function normalizeIsoDateValue(value) {
  return resolveSkillMarketStateApi().normalizeIsoDateValue?.(value) || "";
}

function normalizeMetricValue(value, fallback = 0) {
  return resolveSkillMarketStateApi().normalizeMetricValue?.(value, fallback) ?? 0;
}

function isUnknownSafetyValue(value) {
  return resolveSkillMarketStateApi().isUnknownSafetyValue?.(value) ?? true;
}

function resolveSkillSuspiciousFlag(skill, localMeta) {
  return resolveSkillMarketStateApi().resolveSkillSuspiciousFlag?.(skill, localMeta) ?? false;
}

function normalizeClawHubSkillRecord(skill, fallback = {}) {
  return resolveSkillMarketStateApi().normalizeClawHubSkillRecord?.(skill, fallback) || null;
}

function mergeSkillRecords(primaryItems, secondaryItems) {
  return resolveSkillMarketStateApi().mergeSkillRecords?.(primaryItems, secondaryItems) || [];
}

function upsertSkillRegistryRecords(records) {
  return resolveSkillMarketStateApi().upsertSkillRegistryRecords?.(records);
}

function filterSkillRecordsByKeyword(items, query) {
  return resolveSkillMarketStateApi().filterSkillRecordsByKeyword?.(items, query) || [];
}

function searchLocalClawHubSkills(query) {
  return resolveSkillMarketStateApi().searchLocalClawHubSkills?.(query) || [];
}

async function fetchClawHubJson(endpoint, queryParams = {}) {
  return await resolveSkillMarketStateApi().fetchClawHubJson?.(endpoint, queryParams);
}

function normalizeApiSearchResultRecord(item) {
  return resolveSkillMarketStateApi().normalizeApiSearchResultRecord?.(item) || null;
}

function normalizeApiSkillItemRecord(item) {
  return resolveSkillMarketStateApi().normalizeApiSkillItemRecord?.(item) || null;
}

function normalizeApiSkillDetailRecord(payload) {
  return resolveSkillMarketStateApi().normalizeApiSkillDetailRecord?.(payload) || null;
}

async function fetchClawHubSkillDetailRecords(skillIds) {
  return await resolveSkillMarketStateApi().fetchClawHubSkillDetailRecords?.(skillIds) || [];
}

async function searchClawHubSkillsApi(query, filters) {
  return await resolveSkillMarketStateApi().searchClawHubSkillsApi?.(query, filters) || { ok: false, items: [] };
}

async function searchClawHubSkillsWithFallback(query, filters) {
  return await resolveSkillMarketStateApi().searchClawHubSkillsWithFallback?.(query, filters) || { usedApi: false, items: [] };
}

function normalizeSkillMarketSortBy(sortBy) {
  return resolveSkillMarketStateApi().normalizeSkillMarketSortBy?.(sortBy) || DEFAULT_SKILL_SEARCH_FILTERS.sortBy;
}

function normalizeSkillSearchFilters(filters) {
  return resolveSkillMarketStateApi().normalizeSkillSearchFilters?.(filters) || {
    nonSuspiciousOnly: true,
    highlightedOnly: false,
    sortBy: DEFAULT_SKILL_SEARCH_FILTERS.sortBy,
  };
}

function sortSkillMarketItems(items, sortBy) {
  return resolveSkillMarketStateApi().sortSkillMarketItems?.(items, sortBy) || [];
}

function applySkillSearchFilters(items, filters) {
  return resolveSkillMarketStateApi().applySkillSearchFilters?.(items, filters) || [];
}

function installRegisteredSkillWithFallback(skillId, registeredSkillIds) {
  return resolveSkillMarketStateApi().installRegisteredSkillWithFallback?.(skillId, registeredSkillIds) || {
    ok: false,
    errorCode: "MSG-PPH-1001",
    nextRegisteredSkillIds: Array.isArray(registeredSkillIds) ? [...registeredSkillIds] : [],
  };
}

function uninstallRegisteredSkillWithFallback(skillId, registeredSkillIds) {
  return resolveSkillMarketStateApi().uninstallRegisteredSkillWithFallback?.(skillId, registeredSkillIds) || {
    ok: false,
    errorCode: "MSG-PPH-1001",
    nextRegisteredSkillIds: Array.isArray(registeredSkillIds) ? [...registeredSkillIds] : [],
  };
}

Object.assign(scope, {
  normalizeContextHandoffPolicy,
  resolveSettingsPersistenceModelApi,
  resolveSettingsStorageApi,
  resolveTomoshibikanCoreRuntimeApi,
  hasTomoshibikanCoreRuntimeApi,
  hasTomoshibikanCorePalChatApi,
  isGuideControllerAssistEnabled,
  resolveRuntimeWorkspaceRootForChat,
  applyCoreCatalogSnapshot,
  refreshCoreCatalogFromRuntime,
  buildSettingsSavePayloadWithFallback,
  stableSettingsPayloadForSignature,
  buildSettingsSignature,
  markSettingsSavedBaseline,
  hasUnsavedSettingsChanges,
  normalizeSettingsSnapshotWithFallback,
  readLocalSettingsSnapshotWithFallback,
  writeLocalSettingsSnapshotWithFallback,
  buildLocalStoredSnapshotWithFallback,
  applySettingsSnapshot,
  loadSettingsSnapshotWithFallback,
  saveSettingsSnapshotWithFallback,
  resolveStoredModelApiKeyWithFallback,
  resolveSkillCatalogValidationApi,
  normalizeGenericSkillId,
  resolveAllowedSkillIdsForValidation,
  normalizeSkillId,
  skillById,
  skillName,
  normalizeIsoDateValue,
  normalizeMetricValue,
  isUnknownSafetyValue,
  resolveSkillSuspiciousFlag,
  normalizeClawHubSkillRecord,
  mergeSkillRecords,
  upsertSkillRegistryRecords,
  filterSkillRecordsByKeyword,
  searchLocalClawHubSkills,
  fetchClawHubJson,
  normalizeApiSearchResultRecord,
  normalizeApiSkillItemRecord,
  normalizeApiSkillDetailRecord,
  fetchClawHubSkillDetailRecords,
  searchClawHubSkillsApi,
  searchClawHubSkillsWithFallback,
  normalizeSkillMarketSortBy,
  normalizeSkillSearchFilters,
  sortSkillMarketItems,
  applySkillSearchFilters,
  installRegisteredSkillWithFallback,
  uninstallRegisteredSkillWithFallback,
});
})(typeof window !== "undefined" ? window : globalThis);
