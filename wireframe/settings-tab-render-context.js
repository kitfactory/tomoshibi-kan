(function (global) {
function settingsTabSupportApi() {
  return global.SettingsTabUi || {};
}

function settingsTabSkillModalApi() {
  return global.SettingsTabSkillModalUi || {};
}

function settingsTabMarkupApi() {
  return global.SettingsTabMarkupUi || {};
}

function buildSettingsSelectOptions(context) {
  const {
    labels,
    settingsState,
    selectableModelOptions,
  } = context;
  const providerOptions = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY
    .map((provider) => {
      const selected = provider.id === settingsState.itemDraft.provider ? " selected" : "";
      return `<option value="${escapeHtml(provider.id)}"${selected}>${escapeHtml(provider.label)}</option>`;
    })
    .join("");
  const cliToolOptions = CLI_TOOL_OPTIONS
    .map((tool) => {
      const selected = tool === settingsState.itemDraft.toolName ? " selected" : "";
      return `<option value="${escapeHtml(tool)}"${selected}>${escapeHtml(tool)}</option>`;
    })
    .join("");
  const modelNameOptions = selectableModelOptions(settingsState.itemDraft.provider);
  const modelOptions = modelNameOptions.length === 0
    ? `<option value="">-</option>`
    : modelNameOptions
      .map((modelName) => {
        const selected = modelName === settingsState.itemDraft.modelName ? " selected" : "";
        return `<option value="${escapeHtml(modelName)}"${selected}>${escapeHtml(modelName)}</option>`;
      })
      .join("");
  const draftFilters = normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft);
  const handoffPolicy = normalizeContextHandoffPolicy(settingsState.contextHandoffPolicy);
  const handoffOptions = [
    { value: "minimal", label: labels.handoffMinimal || "Minimal" },
    { value: "balanced", label: labels.handoffBalanced || "Balanced" },
    { value: "verbose", label: labels.handoffVerbose || "Verbose" },
  ]
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === handoffPolicy ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");
  const sortOptions = [
    { value: "downloads", label: labels.skillSortDownloadsLabel },
    { value: "stars", label: labels.skillSortStarsLabel },
    { value: "installs", label: labels.skillSortInstallsLabel },
    { value: "updated", label: labels.skillSortUpdatedLabel },
    { value: "highlighted", label: labels.skillSortHighlightedLabel },
  ]
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === draftFilters.sortBy ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");
  return {
    providerOptions,
    cliToolOptions,
    modelNameOptions,
    modelOptions,
    draftFilters,
    handoffOptions,
    sortOptions,
  };
}

function buildSettingsLists(context) {
  const {
    labels,
    settingsState,
    isJa,
  } = context;
  const {
    renderSettingsModelList,
    renderSettingsToolList,
    renderSettingsSkillList,
    buildSettingsAddModelForm,
  } = settingsTabMarkupApi();
  const {
    providerOptions,
    cliToolOptions,
    modelNameOptions,
    modelOptions,
  } = context.selectOptions;
  const modelList = renderSettingsModelList({
    labels,
    settingsState,
    escapeHtml,
    providerLabel,
    isJa,
  });
  const toolList = renderSettingsToolList({
    labels,
    settingsState,
    escapeHtml,
    isJa,
  });
  const skillList = renderSettingsSkillList({
    labels,
    settingsState,
    escapeHtml,
    normalizeSkillId,
    normalizeText,
    skillById,
    buildClawHubSkillUrl,
    STANDARD_SKILL_IDS,
    isJa,
  });
  const addModelDisabled = settingsState.itemDraft.type === "model" && modelNameOptions.length === 0;
  const addModelForm = buildSettingsAddModelForm({
    labels,
    settingsState,
    addModelDisabled,
    providerOptions,
    modelOptions,
    cliToolOptions,
    modelNameOptions,
    isApiKeyRequiredForProvider,
    escapeHtml,
    isJa,
  });
  return {
    modelList,
    toolList,
    skillList,
    addModelForm,
  };
}

function buildSettingsSaveState(labels) {
  const settingsDirty = hasUnsavedSettingsChanges();
  const saveDisabled = !settingsDirty || settingsSaveInFlight;
  const settingsVisualState = settingsSaveInFlight ? "saving" : (settingsDirty ? "dirty" : "saved");
  const saveStatusText = settingsSaveInFlight
    ? labels.saving
    : (settingsDirty ? labels.unsavedChanges : labels.savedState);
  const saveStatusToneClass = settingsSaveInFlight
    ? "settings-status-saving"
    : (settingsDirty ? "settings-status-dirty" : "settings-status-saved");
  const saveButtonText = settingsSaveInFlight ? labels.saving : (labels.saveAll || labels.save);
  return {
    settingsVisualState,
    saveStatusText,
    saveStatusToneClass,
    saveButtonText,
    saveDisabledAttr: saveDisabled ? " disabled" : "",
  };
}

function buildSettingsSkillMarketContext(context) {
  const { root, locale, settingsState, renderSettingsTab, labels, setMessage } = context;
  return {
    root,
    locale,
    settingsState,
    renderSettingsTab,
    labels: {
      skillRecommendEmptyLabel: labels.skillRecommendEmptyLabel,
      skillSearchIdleLabel: labels.skillSearchIdleLabel,
      skillSearchLoadingLabel: labels.skillSearchLoadingLabel,
      skillSearchEmptyLabel: labels.skillSearchEmpty || "No matching skills on ClawHub",
      skillDownloadsLabel: labels.skillDownloadsLabel,
      skillStarsLabel: labels.skillStarsLabel,
      skillInstallsLabel: labels.skillInstallsLabel,
      skillRatingLabel: labels.skillRatingLabel,
      skillOpenLinkLabel: labels.skillOpenLinkLabel,
      skillDownloadLabel: labels.skillDownloadLabel,
      skillInstallUnsupportedLabel: labels.skillInstallUnsupportedLabel,
    },
    helpers: {
      escapeHtml,
      normalizeText,
      normalizeSkillId,
      buildClawHubSkillUrl,
      installRegisteredSkillWithFallback,
      openExternalUrlWithFallback,
      searchClawHubSkillsWithFallback,
      normalizeSkillSearchFilters,
      normalizeSkillMarketSortBy,
      DEFAULT_SKILL_SEARCH_FILTERS,
      STANDARD_SKILL_IDS,
      CLAWHUB_SKILL_REGISTRY,
      setMessage,
    },
  };
}

function buildSettingsTabRenderContext(root, renderSettingsTab) {
  const {
    selectableModelOptions,
    syncSettingsModelsFromRegistry,
    setMessage,
  } = settingsTabSupportApi();
  const {
    buildSkillMarketPreviewList,
    buildSkillMarketModalResultsHtml,
  } = settingsTabSkillModalApi();
  const { buildSettingsTabLabels } = settingsTabMarkupApi();

  syncSettingsModelsFromRegistry();
  const isJa = locale === "ja";
  const labels = buildSettingsTabLabels(locale);
  const selectOptions = buildSettingsSelectOptions({
    labels,
    settingsState,
    selectableModelOptions,
  });
  const lists = buildSettingsLists({
    labels,
    settingsState,
    isJa,
    selectOptions,
  });
  const saveState = buildSettingsSaveState(labels);
  const skillMarketContext = buildSettingsSkillMarketContext({
    root,
    locale,
    settingsState,
    renderSettingsTab,
    labels,
    setMessage,
  });
  const {
    availableCount: skillMarketAvailableCount,
    previewList: skillMarketPreviewList,
  } = buildSkillMarketPreviewList(skillMarketContext);
  const skillMarketModalResults = buildSkillMarketModalResultsHtml(skillMarketContext);
  return {
    labels,
    isJa,
    selectOptions,
    lists,
    saveState,
    skillMarketContext,
    skillMarketAvailableCount,
    skillMarketPreviewList,
    skillMarketModalResults,
  };
}

global.SettingsTabRenderContextUi = {
  buildSettingsTabRenderContext,
};
})(window);
