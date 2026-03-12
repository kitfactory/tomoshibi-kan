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

function settingsTabRenderContextApi() {
  return global.SettingsTabRenderContextUi || {};
}

function renderSettingsTab() {
  const { bindSettingsTabControls } = settingsTabControlsApi();
  const {
    buildSettingsTabShellMarkup,
  } = settingsTabMarkupApi();
  const { buildSettingsTabRenderContext } = settingsTabRenderContextApi();
  const root = document.getElementById("settingsTabContent");
  if (!root) return;
  const renderContext = buildSettingsTabRenderContext(root, renderSettingsTab);
  const {
    labels,
    selectOptions,
    lists,
    saveState,
    skillMarketContext,
    skillMarketAvailableCount,
    skillMarketPreviewList,
    skillMarketModalResults,
  } = renderContext;

  root.innerHTML = buildSettingsTabShellMarkup({
    labels,
    settingsState,
    locale,
    escapeHtml,
    modelList: lists.modelList,
    toolList: lists.toolList,
    skillList: lists.skillList,
    addModelForm: lists.addModelForm,
    handoffOptions: selectOptions.handoffOptions,
    guideControllerAssistEnabled: settingsState.guideControllerAssistEnabled === true,
    settingsVisualState: saveState.settingsVisualState,
    saveStatusText: saveState.saveStatusText,
    saveStatusToneClass: saveState.saveStatusToneClass,
    settingsSaveInFlight,
    saveDisabledAttr: saveState.saveDisabledAttr,
    saveButtonText: saveState.saveButtonText,
    sortOptions: selectOptions.sortOptions,
    skillMarketAvailableCount,
    skillMarketPreviewList,
    skillMarketModalResults,
    skillSearchDraftValue: String(settingsState.skillSearchDraft || settingsState.skillSearchQuery || ""),
    draftFilters: selectOptions.draftFilters,
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
