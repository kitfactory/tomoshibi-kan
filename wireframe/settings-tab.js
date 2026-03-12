(function (global) {
function workspaceHelpers() {
  return global.SettingsTabWorkspaceUi || {};
}

function feedbackHelpers() {
  return global.SettingsTabFeedbackUi || {};
}

function selectableModelOptions(providerId = settingsState.itemDraft.provider) {
  const normalizedProviderId = providerIdFromInput(providerId);
  const registered = settingsState.registeredModels
    .filter((model) => providerIdFromInput(model.provider) === normalizedProviderId)
    .map((model) => model.name);
  return buildModelOptionList(coreModelOptionsByProvider(normalizedProviderId), registered);
}

function resolveDraftProviderWithAvailableModels(preferredProviderId = settingsState.itemDraft.provider) {
  const normalized = providerIdFromInput(preferredProviderId);
  if (PROVIDER_OPTIONS.includes(normalized)) return normalized;
  return PROVIDER_OPTIONS[0] || normalized || DEFAULT_PROVIDER_ID;
}

function isValidProviderModelPair(providerId, modelName) {
  const normalizedModelName = normalizeText(modelName);
  if (!normalizedModelName) return false;
  const options = selectableModelOptions(providerId);
  return options.includes(normalizedModelName);
}

function resetModelItemDraft(nextProviderId = settingsState.itemDraft.provider) {
  const providerId = resolveDraftProviderWithAvailableModels(nextProviderId);
  const options = selectableModelOptions(providerId);
  settingsState.itemDraft.modelName = options[0] || "";
  settingsState.itemDraft.provider = providerId;
  settingsState.itemDraft.apiKey = "";
  settingsState.itemDraft.baseUrl = "";
  settingsState.itemDraft.endpoint = "";
}

function syncSettingsModelsFromRegistry() {
  settingsState.registeredModels = settingsState.registeredModels
    .map(normalizeRegisteredModel)
    .filter((model) => Boolean(model.name));
  settingsState.registeredTools = settingsState.registeredTools
    .map((tool) => normalizeToolName(String(tool || "").trim()))
    .filter((tool, index, list) => tool && list.indexOf(tool) === index);
  settingsState.registeredSkills = settingsState.registeredSkills
    .map((skillId) => normalizeSkillId(String(skillId || "").trim()))
    .filter((skillId, index, list) => skillId && list.indexOf(skillId) === index);
  settingsState.models = settingsState.registeredModels.map((model) => model.name);
  settingsState.provider = settingsState.registeredModels[0]?.provider || DEFAULT_PROVIDER_ID;
  settingsState.itemDraft.provider = resolveDraftProviderWithAvailableModels(settingsState.itemDraft.provider);
  const options = selectableModelOptions(settingsState.itemDraft.provider);
  settingsState.itemDraft.modelName = options.includes(settingsState.itemDraft.modelName)
    ? settingsState.itemDraft.modelName
    : (options[0] || "");
  settingsState.itemDraft.toolName = normalizeToolName(settingsState.itemDraft.toolName);
  settingsState.itemDraft.type = settingsState.itemDraft.type === "tool" ? "tool" : "model";
  settingsState.skillSearchQuery = String(settingsState.skillSearchQuery || "");
  settingsState.skillSearchDraft = String(settingsState.skillSearchDraft || "");
  settingsState.skillSearchExecuted = Boolean(settingsState.skillSearchExecuted);
  settingsState.skillSearchFilters = normalizeSkillSearchFilters(settingsState.skillSearchFilters);
  settingsState.skillSearchFilterDraft = normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft);
}

function syncPalProfilesFromSettings() {
  const workspace = workspaceHelpers();
  syncSettingsModelsFromRegistry();
  if (typeof workspace.syncPalProfilesRegistryRefs === "function") {
    workspace.syncPalProfilesRegistryRefs();
  }
  bindGuideToFirstRegisteredModelWithFallback();
  renderPalList();
}

function renderSettingsTab() {
  const api = global.SettingsTabRenderUi || {};
  if (typeof api.renderSettingsTab === "function") {
    return api.renderSettingsTab();
  }
  return undefined;
}

const composedApi = {
  ...workspaceHelpers(),
  ...feedbackHelpers(),
  selectableModelOptions,
  resolveDraftProviderWithAvailableModels,
  isValidProviderModelPair,
  resetModelItemDraft,
  syncSettingsModelsFromRegistry,
  syncPalProfilesFromSettings,
  renderSettingsTab,
};

global.appendTaskProgressLogEntryWithFallback = composedApi.appendTaskProgressLogEntryWithFallback;
global.appendTaskProgressLogForTarget = composedApi.appendTaskProgressLogForTarget;
global.appendPlanArtifactWithFallback = composedApi.appendPlanArtifactWithFallback;
global.setMessage = composedApi.setMessage;
global.hideErrorToast = composedApi.hideErrorToast;
global.showErrorToast = composedApi.showErrorToast;
global.SettingsTabUi = composedApi;
})(window);
