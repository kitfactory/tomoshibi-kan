(function (global) {
function settingsTabSupportApi() {
  return global.SettingsTabUi || {};
}

function settingsTabSkillModalApi() {
  return global.SettingsTabSkillModalUi || {};
}

function settingsTabControlsApi() {
  return global.SettingsTabControlsUi || {};
}

function settingsTabMarkupApi() {
  return global.SettingsTabMarkupUi || {};
}

function renderSettingsTab() {
  const {
    selectableModelOptions,
    syncSettingsModelsFromRegistry,
    setMessage,
  } = settingsTabSupportApi();
  const {
    buildSkillMarketPreviewList,
    buildSkillMarketModalResultsHtml,
  } = settingsTabSkillModalApi();
  const { bindSettingsTabControls } = settingsTabControlsApi();
  const {
    buildSettingsTabLabels,
    renderSettingsModelList,
    renderSettingsToolList,
    renderSettingsSkillList,
    buildSettingsAddModelForm,
    buildSettingsTabShellMarkup,
  } = settingsTabMarkupApi();
  const root = document.getElementById("settingsTabContent");
  if (!root) return;

  syncSettingsModelsFromRegistry();
  const isJa = locale === "ja";
  const labels = buildSettingsTabLabels(locale);

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

  const skillMarketContext = {
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
  const {
    availableCount: skillMarketAvailableCount,
    previewList: skillMarketPreviewList,
  } = buildSkillMarketPreviewList(skillMarketContext);
  const skillMarketModalResults = buildSkillMarketModalResultsHtml(skillMarketContext);

  root.innerHTML = buildSettingsTabShellMarkup({
    labels,
    settingsState,
    locale,
    escapeHtml,
    modelList,
    toolList,
    skillList,
    addModelForm,
    handoffOptions,
    guideControllerAssistEnabled: settingsState.guideControllerAssistEnabled === true,
    settingsVisualState,
    saveStatusText,
    saveStatusToneClass,
    settingsSaveInFlight,
    saveDisabledAttr: saveDisabled ? " disabled" : "",
    saveButtonText,
    sortOptions,
    skillMarketAvailableCount,
    skillMarketPreviewList,
    skillMarketModalResults,
    skillSearchDraftValue: String(settingsState.skillSearchDraft || settingsState.skillSearchQuery || ""),
    draftFilters,
  });

  bindSettingsTabControls({
    root,
    renderSettingsTab,
    skillMarketContext,
    elements: {
      localeJaEl: document.getElementById("settingsLocaleJa"),
      localeEnEl: document.getElementById("settingsLocaleEn"),
      handoffPolicyEl: document.getElementById("settingsContextHandoffPolicy"),
      guideControllerAssistEl: document.getElementById("settingsGuideControllerAssistEnabled"),
      syncBuiltInResidentsEl: document.getElementById("settingsSyncBuiltInResidents"),
      openAddModelEl: document.getElementById("settingsTabOpenAddItem"),
      entryTypeEl: document.getElementById("settingsTabEntryType"),
      addModelSubmitEl: document.getElementById("settingsTabAddItemSubmit"),
      cancelAddModelEl: document.getElementById("settingsTabCancelAddItem"),
      modelNameEl: document.getElementById("settingsTabModelName"),
      modelProviderEl: document.getElementById("settingsTabModelProvider"),
      modelBaseUrlEl: document.getElementById("settingsTabModelBaseUrl"),
      modelApiKeyEl: document.getElementById("settingsTabModelApiKey"),
      toolNameEl: document.getElementById("settingsTabToolName"),
      skillMarketOpenModalEl: document.getElementById("settingsSkillMarketOpenModal"),
      skillModalKeywordEl: document.getElementById("settingsSkillModalKeyword"),
      skillModalSortEl: document.getElementById("settingsSkillModalSort"),
      skillModalNonSuspiciousEl: document.getElementById("settingsSkillModalNonSuspicious"),
      skillModalHighlightedOnlyEl: document.getElementById("settingsSkillModalHighlightedOnly"),
      skillModalSearchEl: document.getElementById("settingsSkillModalSearch"),
      skillModalCloseEl: document.getElementById("settingsSkillModalClose"),
      skillModalCloseTopEl: document.getElementById("settingsSkillModalCloseTop"),
      skillModalBackdropCloseEl: document.getElementById("settingsSkillModalBackdropClose"),
      saveEl: document.getElementById("settingsTabSave"),
    },
  });
}

global.SettingsTabRenderUi = {
  renderSettingsTab,
};
})(window);
