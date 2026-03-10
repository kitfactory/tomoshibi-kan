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

function resolveSkillCatalogValidationApi() {
  return typeof window !== "undefined" &&
    window.SkillCatalogValidation &&
    typeof window.SkillCatalogValidation.normalizeSkillId === "function" &&
    typeof window.SkillCatalogValidation.searchSkillCatalogItems === "function" &&
    typeof window.SkillCatalogValidation.installSkill === "function" &&
    typeof window.SkillCatalogValidation.uninstallSkill === "function"
    ? window.SkillCatalogValidation
    : null;
}

function normalizeGenericSkillId(skillId) {
  if (!skillId) return "";
  const normalized = String(skillId || "").trim();
  if (!normalized) return "";
  // Allow ClawHub-style slugs (letters/numbers/dash/underscore/dot).
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(normalized)) return "";
  return normalized;
}

function resolveAllowedSkillIdsForValidation(additionalSkillIds = []) {
  const result = [];
  const push = (value) => {
    const normalized = normalizeGenericSkillId(value);
    if (!normalized || result.includes(normalized)) return;
    result.push(normalized);
  };
  STANDARD_SKILL_IDS.forEach(push);
  CLAWHUB_SKILL_REGISTRY.forEach((skill) => push(skill?.id));
  ADDITIONAL_SKILL_REGISTRY.forEach((skill) => push(skill?.id));
  if (settingsState && Array.isArray(settingsState.registeredSkills)) {
    settingsState.registeredSkills.forEach(push);
  }
  if (settingsState && Array.isArray(settingsState.skillSearchResults)) {
    settingsState.skillSearchResults.forEach((skill) => push(skill?.id));
  }
  if (Array.isArray(additionalSkillIds)) {
    additionalSkillIds.forEach(push);
  }
  return result;
}

function normalizeSkillId(skillId) {
  const external = resolveSkillCatalogValidationApi();
  const allowedSkillIds = resolveAllowedSkillIdsForValidation();
  if (external) {
    const normalizedByExternal = external.normalizeSkillId(skillId, allowedSkillIds);
    if (normalizedByExternal) return normalizedByExternal;
  }
  return normalizeGenericSkillId(skillId);
}

function skillById(skillId) {
  const normalized = normalizeSkillId(skillId);
  if (!normalized) return null;
  return ADDITIONAL_SKILL_REGISTRY.find((skill) => normalizeSkillId(skill.id) === normalized) ||
    CLAWHUB_SKILL_REGISTRY.find((skill) => normalizeSkillId(skill.id) === normalized) ||
    null;
}

function skillName(skillId) {
  return skillById(skillId)?.name || skillId;
}

function normalizeIsoDateValue(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }
  const text = normalizeText(value);
  if (!text) return "";
  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? "" : new Date(parsed).toISOString();
}

function normalizeMetricValue(value, fallback = 0) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) return parsed;
  return Number.isFinite(Number(fallback)) ? Number(fallback) : 0;
}

function isUnknownSafetyValue(value) {
  const normalized = normalizeText(value).toLowerCase();
  return !normalized || normalized === "unknown";
}

function resolveSkillSuspiciousFlag(skill, localMeta) {
  if (typeof skill?.suspicious === "boolean") return skill.suspicious;
  if (typeof skill?.nonSuspicious === "boolean") return !skill.nonSuspicious;
  if (typeof localMeta?.suspicious === "boolean") return localMeta.suspicious;
  // ClawHub /search may omit suspicious metadata; treat unknown as non-suspicious
  // and rely on explicit flags when available.
  return false;
}

function normalizeClawHubSkillRecord(skill, fallback = {}) {
  const id = normalizeText(skill?.id || skill?.slug || fallback.id);
  if (!id) return null;
  const localMeta = CLAWHUB_SKILL_META[id] || {};
  const stats = skill?.stats && typeof skill.stats === "object" ? skill.stats : {};
  const updatedAt = normalizeIsoDateValue(skill?.updatedAt) ||
    normalizeIsoDateValue(skill?.latestVersion?.createdAt) ||
    normalizeIsoDateValue(fallback.updatedAt) ||
    normalizeIsoDateValue(localMeta.updatedAt);
  return {
    id,
    name: normalizeText(skill?.name || skill?.displayName || fallback.name || id) || id,
    description: normalizeText(skill?.description || skill?.summary || fallback.description),
    packageName: normalizeText(skill?.packageName || fallback.packageName || `clawhub/${id}`),
    source: normalizeText(skill?.source || fallback.source || "ClawHub"),
    safety: normalizeText(skill?.safety || fallback.safety || localMeta.safety || "Unknown"),
    rating: normalizeMetricValue(skill?.rating, fallback.rating ?? localMeta.rating ?? 0),
    downloads: normalizeMetricValue(
      stats.downloads ?? skill?.downloads,
      fallback.downloads ?? localMeta.downloads ?? 0
    ),
    stars: normalizeMetricValue(
      stats.stars ?? skill?.stars,
      fallback.stars ?? localMeta.stars ?? 0
    ),
    installs: normalizeMetricValue(
      stats.installsAllTime ?? stats.installsCurrent ?? skill?.installs,
      fallback.installs ?? localMeta.installs ?? 0
    ),
    updatedAt,
    highlighted: Boolean(skill?.highlighted || fallback.highlighted || localMeta.highlighted),
    suspicious: resolveSkillSuspiciousFlag(skill, localMeta),
  };
}

function mergeSkillRecords(primaryItems, secondaryItems) {
  const map = new Map();
  const upsert = (record) => {
    const normalized = normalizeClawHubSkillRecord(record);
    if (!normalized) return;
    const key = normalized.id.toLowerCase();
    const previous = map.get(key);
    if (!previous) {
      map.set(key, normalized);
      return;
    }
    const normalizedSafety = normalizeText(normalized.safety);
    const previousSafety = normalizeText(previous.safety);
    const mergedSafety = isUnknownSafetyValue(normalizedSafety)
      ? (previousSafety || normalizedSafety || "Unknown")
      : normalizedSafety;
    map.set(key, {
      ...previous,
      ...normalized,
      name: normalized.name || previous.name,
      description: normalized.description || previous.description,
      packageName: normalized.packageName || previous.packageName,
      source: normalized.source || previous.source,
      safety: mergedSafety,
      rating: normalized.rating > 0 ? normalized.rating : previous.rating,
      downloads: normalized.downloads > 0 ? normalized.downloads : previous.downloads,
      stars: normalized.stars > 0 ? normalized.stars : previous.stars,
      installs: normalized.installs > 0 ? normalized.installs : previous.installs,
      updatedAt: normalized.updatedAt || previous.updatedAt,
      highlighted: Boolean(previous.highlighted || normalized.highlighted),
      suspicious: Boolean(normalized.suspicious),
    });
  };

  (Array.isArray(secondaryItems) ? secondaryItems : []).forEach(upsert);
  (Array.isArray(primaryItems) ? primaryItems : []).forEach(upsert);
  return [...map.values()];
}

function upsertSkillRegistryRecords(records) {
  const merged = mergeSkillRecords(records, ADDITIONAL_SKILL_REGISTRY);
  const filtered = merged.filter((record) => !STANDARD_SKILL_IDS.includes(normalizeSkillId(record?.id)));
  ADDITIONAL_SKILL_REGISTRY.splice(0, ADDITIONAL_SKILL_REGISTRY.length, ...filtered);
}

function filterSkillRecordsByKeyword(items, query) {
  const keyword = normalizeSearchKeyword(query);
  if (!keyword) return [...items];
  return items.filter((skill) => {
    const fields = [
      skill.id,
      skill.name,
      skill.description,
      skill.packageName,
      skill.source,
      skill.safety,
      skill.rating,
      skill.downloads,
      skill.stars,
      skill.installs,
      skill.updatedAt,
      skill.highlighted,
      skill.suspicious,
    ];
    return fields.some((field) => normalizeSearchKeyword(field).includes(keyword));
  });
}

function searchLocalClawHubSkills(query) {
  const searchableCatalog = [...CLAWHUB_SKILL_REGISTRY, ...ADDITIONAL_SKILL_REGISTRY];
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.searchSkillCatalogItems(searchableCatalog, query);
  }
  return filterSkillRecordsByKeyword(searchableCatalog, query);
}

async function fetchClawHubJson(endpoint, queryParams = {}) {
  if (typeof fetch !== "function") return null;
  let url;
  try {
    url = new URL(String(endpoint || "").replace(/^\/+/, ""), `${CLAWHUB_API_BASE_URL}/`);
  } catch (error) {
    return null;
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = setTimeout(() => {
    if (controller) controller.abort();
  }, CLAWHUB_API_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeApiSearchResultRecord(item) {
  const id = normalizeText(item?.slug || item?.id);
  if (!id) return null;
  return normalizeClawHubSkillRecord({
    id,
    name: normalizeText(item?.displayName || item?.name || id) || id,
    description: normalizeText(item?.summary || item?.description),
    packageName: `clawhub/${id}`,
    source: "ClawHub",
    updatedAt: item?.updatedAt,
  });
}

function normalizeApiSkillItemRecord(item) {
  return normalizeClawHubSkillRecord({
    id: item?.slug || item?.id,
    name: item?.displayName || item?.name,
    description: item?.summary || item?.description,
    packageName: item?.packageName,
    source: "ClawHub",
    safety: item?.safety,
    rating: item?.rating,
    stats: item?.stats,
    downloads: item?.downloads,
    stars: item?.stars,
    installs: item?.installs,
    updatedAt: item?.updatedAt,
    latestVersion: item?.latestVersion,
    highlighted: item?.highlighted,
    suspicious: item?.suspicious,
    nonSuspicious: item?.nonSuspicious,
  });
}

function normalizeApiSkillDetailRecord(payload) {
  const skill = payload?.skill && typeof payload.skill === "object"
    ? payload.skill
    : null;
  if (!skill) return null;
  return normalizeApiSkillItemRecord({
    id: skill.slug,
    name: skill.displayName,
    description: skill.summary,
    packageName: skill.packageName,
    source: "ClawHub",
    safety: skill.safety,
    rating: skill.rating,
    stats: skill.stats,
    downloads: skill.downloads,
    stars: skill.stars,
    installs: skill.installs,
    updatedAt: skill.updatedAt,
    latestVersion: payload?.latestVersion,
    highlighted: skill.highlighted,
    suspicious: skill.suspicious,
    nonSuspicious: skill.nonSuspicious,
  });
}

async function fetchClawHubSkillDetailRecords(skillIds) {
  const ids = Array.isArray(skillIds)
    ? skillIds
      .map((skillId) => normalizeGenericSkillId(skillId))
      .filter(Boolean)
    : [];
  if (ids.length === 0) return [];
  const deduped = [...new Set(ids)].slice(0, CLAWHUB_API_DETAIL_ENRICH_LIMIT);
  const results = await Promise.all(
    deduped.map(async (skillId) => {
      const payload = await fetchClawHubJson(`skills/${encodeURIComponent(skillId)}`);
      return normalizeApiSkillDetailRecord(payload);
    })
  );
  return results.filter(Boolean);
}

async function searchClawHubSkillsApi(query, filters) {
  const normalizedFilters = normalizeSkillSearchFilters(filters);
  const keyword = normalizeSearchKeyword(query);
  const isKeywordSearch = Boolean(keyword);
  const catalogLimit = isKeywordSearch ? CLAWHUB_API_SEARCH_LIMIT : CLAWHUB_API_BROWSE_LIMIT;
  const baseParams = {
    limit: catalogLimit,
    sort: normalizedFilters.sortBy,
    nonSuspicious: normalizedFilters.nonSuspiciousOnly ? "true" : undefined,
    highlighted: normalizedFilters.highlightedOnly ? "true" : undefined,
  };

  const catalogPayload = await fetchClawHubJson("skills", baseParams);
  const catalogItems = Array.isArray(catalogPayload?.items)
    ? catalogPayload.items.map(normalizeApiSkillItemRecord).filter(Boolean)
    : [];

  if (!keyword) {
    return {
      ok: Array.isArray(catalogPayload?.items),
      items: catalogItems,
    };
  }

  const searchPayload = await fetchClawHubJson("search", {
    q: keyword,
    ...baseParams,
  });
  const searchItems = Array.isArray(searchPayload?.results)
    ? searchPayload.results.map(normalizeApiSearchResultRecord).filter(Boolean)
    : [];
  const detailItems = searchItems.length > 0
    ? await fetchClawHubSkillDetailRecords(searchItems.map((item) => item.id))
    : [];
  const enrichedCatalog = mergeSkillRecords(detailItems, catalogItems);

  if (searchItems.length > 0) {
    return {
      ok: true,
      items: mergeSkillRecords(searchItems, enrichedCatalog),
    };
  }

  if (Array.isArray(catalogPayload?.items)) {
    return {
      ok: true,
      items: filterSkillRecordsByKeyword(catalogItems, keyword),
    };
  }

  return {
    ok: false,
    items: [],
  };
}

async function searchClawHubSkillsWithFallback(query, filters) {
  const keyword = normalizeSearchKeyword(query);
  const normalizedFilters = normalizeSkillSearchFilters(filters);
  const localMatches = searchLocalClawHubSkills(keyword).map((item) => normalizeClawHubSkillRecord(item)).filter(Boolean);
  const apiResult = await searchClawHubSkillsApi(keyword, normalizedFilters);
  const merged = apiResult.ok
    ? mergeSkillRecords(localMatches, apiResult.items)
    : localMatches;
  if (apiResult.ok) {
    upsertSkillRegistryRecords(apiResult.items);
  }
  const keywordFiltered = keyword ? filterSkillRecordsByKeyword(merged, keyword) : merged;
  return {
    usedApi: apiResult.ok,
    items: applySkillSearchFilters(keywordFiltered, normalizedFilters),
  };
}

function normalizeSkillMarketSortBy(sortBy) {
  if (!sortBy) return DEFAULT_SKILL_SEARCH_FILTERS.sortBy;
  return SKILL_MARKET_SORT_OPTIONS.includes(sortBy)
    ? sortBy
    : DEFAULT_SKILL_SEARCH_FILTERS.sortBy;
}

function normalizeSkillSearchFilters(filters) {
  const input = filters || {};
  return {
    nonSuspiciousOnly: input.nonSuspiciousOnly !== false,
    highlightedOnly: Boolean(input.highlightedOnly),
    sortBy: normalizeSkillMarketSortBy(input.sortBy),
  };
}

function sortSkillMarketItems(items, sortBy) {
  const normalizedSortBy = normalizeSkillMarketSortBy(sortBy);
  const withFallback = [...items];
  withFallback.sort((left, right) => {
    const leftName = String(left?.name || "");
    const rightName = String(right?.name || "");

    if (normalizedSortBy === "downloads") {
      const diff = Number(right?.downloads || 0) - Number(left?.downloads || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "stars") {
      const diff = Number(right?.stars || 0) - Number(left?.stars || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "installs") {
      const diff = Number(right?.installs || 0) - Number(left?.installs || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "updated") {
      const leftUpdated = Date.parse(String(left?.updatedAt || "")) || 0;
      const rightUpdated = Date.parse(String(right?.updatedAt || "")) || 0;
      const diff = rightUpdated - leftUpdated;
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "highlighted") {
      const diff = Number(Boolean(right?.highlighted)) - Number(Boolean(left?.highlighted));
      if (diff !== 0) return diff;
      const secondary = Number(right?.downloads || 0) - Number(left?.downloads || 0);
      return secondary !== 0 ? secondary : leftName.localeCompare(rightName);
    }
    return leftName.localeCompare(rightName);
  });
  return withFallback;
}

function applySkillSearchFilters(items, filters) {
  const normalized = normalizeSkillSearchFilters(filters);
  let next = [...items];
  if (normalized.nonSuspiciousOnly) {
    next = next.filter((skill) => !Boolean(skill?.suspicious));
  }
  if (normalized.highlightedOnly) {
    next = next.filter((skill) => Boolean(skill?.highlighted));
  }
  return sortSkillMarketItems(next, normalized.sortBy);
}

function installRegisteredSkillWithFallback(skillId, registeredSkillIds) {
  const allowedSkillIds = resolveAllowedSkillIdsForValidation([
    skillId,
    ...(Array.isArray(registeredSkillIds) ? registeredSkillIds : []),
  ]);
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.installSkill({
      skillId,
      registeredSkillIds,
      allowedSkillIds,
    });
  }

  const normalized = normalizeSkillId(skillId);
  if (!normalized) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1001",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  if (registeredSkillIds.includes(normalized)) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1006",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  return {
    ok: true,
    nextRegisteredSkillIds: [...registeredSkillIds, normalized],
  };
}

function uninstallRegisteredSkillWithFallback(skillId, registeredSkillIds) {
  const allowedSkillIds = resolveAllowedSkillIdsForValidation([
    skillId,
    ...(Array.isArray(registeredSkillIds) ? registeredSkillIds : []),
  ]);
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.uninstallSkill({
      skillId,
      registeredSkillIds,
      allowedSkillIds,
    });
  }

  const normalized = normalizeSkillId(skillId);
  if (!normalized) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1001",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  return {
    ok: true,
    nextRegisteredSkillIds: registeredSkillIds.filter((id) => id !== normalized),
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
