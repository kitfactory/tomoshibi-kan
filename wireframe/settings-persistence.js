(function attachSettingsPersistenceModel(scope) {
  const DEFAULT_LOCALE = "ja";
  const DEFAULT_PROVIDER = "openai";
  const DEFAULT_CONTEXT_HANDOFF_POLICY = "balanced";
  const DEFAULT_GUIDE_CONTROLLER_ASSIST_ENABLED = false;

  function normalizeString(value) {
    return String(value || "").trim();
  }

  function normalizeLocale(value) {
    return normalizeString(value) === "en" ? "en" : DEFAULT_LOCALE;
  }

  function dedupeStrings(values) {
    if (!Array.isArray(values)) return [];
    const seen = new Set();
    const result = [];
    values.forEach((value) => {
      const normalized = normalizeString(value);
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      result.push(normalized);
    });
    return result;
  }

  function normalizeContextHandoffPolicy(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "minimal" || normalized === "verbose") return normalized;
    return DEFAULT_CONTEXT_HANDOFF_POLICY;
  }

  function normalizeGuideControllerAssistEnabled(value) {
    return value === true;
  }

  function normalizeModelForPayload(model) {
    const name = normalizeString(model?.name);
    if (!name) return null;
    return {
      name,
      provider: normalizeString(model?.provider) || DEFAULT_PROVIDER,
      baseUrl: normalizeString(model?.baseUrl),
      endpoint: normalizeString(model?.endpoint),
      apiKeyInput: normalizeString(model?.apiKey || model?.apiKeyInput),
      apiKeyConfigured: Boolean(model?.apiKeyConfigured),
    };
  }

  function buildSettingsSavePayload(input) {
    const models = Array.isArray(input?.registeredModels) ? input.registeredModels : [];
    const modelMap = new Map();
    models.forEach((model) => {
      const normalized = normalizeModelForPayload(model);
      if (!normalized) return;
      const dedupeKey = normalized.name.toLowerCase();
      if (!modelMap.has(dedupeKey)) modelMap.set(dedupeKey, normalized);
    });
    return {
      locale: normalizeLocale(input?.locale),
      contextHandoffPolicy: normalizeContextHandoffPolicy(input?.contextHandoffPolicy),
      guideControllerAssistEnabled: normalizeGuideControllerAssistEnabled(input?.guideControllerAssistEnabled),
      registeredModels: [...modelMap.values()],
      registeredTools: dedupeStrings(input?.registeredTools),
      registeredSkills: dedupeStrings(input?.registeredSkills),
    };
  }

  function normalizePersistedModel(model) {
    const name = normalizeString(model?.name);
    if (!name) return null;
    return {
      name,
      provider: normalizeString(model?.provider) || DEFAULT_PROVIDER,
      baseUrl: normalizeString(model?.baseUrl),
      endpoint: normalizeString(model?.endpoint),
      apiKeyConfigured: Boolean(model?.apiKeyConfigured),
      apiKey: "",
    };
  }

  function normalizeSettingsSnapshot(snapshot) {
    const models = Array.isArray(snapshot?.registeredModels) ? snapshot.registeredModels : [];
    const normalizedModels = models
      .map(normalizePersistedModel)
      .filter(Boolean);
    return {
      locale: normalizeLocale(snapshot?.locale),
      contextHandoffPolicy: normalizeContextHandoffPolicy(snapshot?.contextHandoffPolicy),
      guideControllerAssistEnabled: normalizeGuideControllerAssistEnabled(snapshot?.guideControllerAssistEnabled),
      registeredModels: normalizedModels,
      registeredTools: dedupeStrings(snapshot?.registeredTools),
      registeredSkills: dedupeStrings(snapshot?.registeredSkills),
    };
  }

  function buildLocalStoredSnapshot(input) {
    const existing = normalizeSettingsSnapshot(input?.existingSnapshot);
    const payload = buildSettingsSavePayload(input?.payload);
    const existingByName = new Map(existing.registeredModels.map((model) => [model.name, model]));
    const nextModels = payload.registeredModels.map((model) => {
      const previous = existingByName.get(model.name);
      const configured = Boolean(model.apiKeyInput || previous?.apiKeyConfigured);
      return {
        name: model.name,
        provider: model.provider,
        baseUrl: model.baseUrl,
        endpoint: model.endpoint,
        apiKeyConfigured: configured,
      };
    });
    return {
      locale: payload.locale,
      contextHandoffPolicy: payload.contextHandoffPolicy,
      guideControllerAssistEnabled: payload.guideControllerAssistEnabled,
      registeredModels: nextModels,
      registeredTools: payload.registeredTools,
      registeredSkills: payload.registeredSkills,
    };
  }

  const api = {
    buildSettingsSavePayload,
    normalizeSettingsSnapshot,
    buildLocalStoredSnapshot,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.SettingsPersistenceModel = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
