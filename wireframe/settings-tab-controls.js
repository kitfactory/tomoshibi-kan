(function (global) {
function settingsTabSupportApi() {
  return global.SettingsTabUi || {};
}

function settingsTabSkillModalApi() {
  return global.SettingsTabSkillModalUi || {};
}

function bindSettingsTabControls(context) {
  const {
    root,
    renderSettingsTab,
    skillMarketContext,
    elements,
  } = context;
  const {
    selectableModelOptions,
    isValidProviderModelPair,
    resetModelItemDraft,
    syncPalProfilesFromSettings,
    setMessage,
  } = settingsTabSupportApi();
  const {
    bindSkillMarketControls,
    bindSkillMarketInstallHandlers,
    bindSkillLinkHandlers,
  } = settingsTabSkillModalApi();
  const {
    localeJaEl,
    localeEnEl,
    handoffPolicyEl,
    guideControllerAssistEl,
    syncBuiltInResidentsEl,
    openAddModelEl,
    entryTypeEl,
    addModelSubmitEl,
    cancelAddModelEl,
    modelNameEl,
    modelProviderEl,
    modelBaseUrlEl,
    modelApiKeyEl,
    toolNameEl,
    skillMarketOpenModalEl,
    skillModalKeywordEl,
    skillModalSortEl,
    skillModalNonSuspiciousEl,
    skillModalHighlightedOnlyEl,
    skillModalSearchEl,
    skillModalCloseEl,
    skillModalCloseTopEl,
    skillModalBackdropCloseEl,
    saveEl,
  } = elements;

  if (localeJaEl) {
    localeJaEl.addEventListener("click", () => {
      if (locale !== "ja") {
        locale = "ja";
        workspaceShellUi().applyI18n?.();
      }
    });
  }
  if (localeEnEl) {
    localeEnEl.addEventListener("click", () => {
      if (locale !== "en") {
        locale = "en";
        workspaceShellUi().applyI18n?.();
      }
    });
  }
  if (handoffPolicyEl) {
    handoffPolicyEl.addEventListener("change", () => {
      settingsState.contextHandoffPolicy = normalizeContextHandoffPolicy(handoffPolicyEl.value);
      renderSettingsTab();
    });
  }
  if (guideControllerAssistEl) {
    guideControllerAssistEl.addEventListener("change", () => {
      settingsState.guideControllerAssistEnabled = guideControllerAssistEl.checked;
      renderSettingsTab();
    });
  }
  if (syncBuiltInResidentsEl) {
    syncBuiltInResidentsEl.addEventListener("click", () => {
      void syncBuiltInResidentIdentitiesToWorkspace();
    });
  }
  if (openAddModelEl) {
    openAddModelEl.addEventListener("click", () => {
      settingsState.itemAddOpen = !settingsState.itemAddOpen;
      if (!settingsState.itemAddOpen) {
        resetModelItemDraft(settingsState.itemDraft.provider);
      }
      renderSettingsTab();
    });
  }
  if (entryTypeEl) {
    entryTypeEl.addEventListener("change", () => {
      settingsState.itemDraft.type = entryTypeEl.value === "tool" ? "tool" : "model";
      renderSettingsTab();
    });
  }
  if (modelNameEl) {
    modelNameEl.addEventListener("change", () => {
      settingsState.itemDraft.modelName = modelNameEl.value;
    });
  }
  if (modelProviderEl) {
    modelProviderEl.addEventListener("change", () => {
      const nextProviderId = providerIdFromInput(modelProviderEl.value);
      settingsState.itemDraft.provider = nextProviderId;
      const nextOptions = selectableModelOptions(nextProviderId);
      settingsState.itemDraft.modelName = nextOptions[0] || "";
      renderSettingsTab();
    });
  }
  if (modelBaseUrlEl) {
    modelBaseUrlEl.addEventListener("input", () => {
      settingsState.itemDraft.baseUrl = modelBaseUrlEl.value;
    });
  }
  if (modelApiKeyEl) {
    modelApiKeyEl.addEventListener("input", () => {
      settingsState.itemDraft.apiKey = modelApiKeyEl.value;
    });
  }
  if (toolNameEl) {
    toolNameEl.addEventListener("change", () => {
      settingsState.itemDraft.toolName = normalizeToolName(toolNameEl.value);
    });
  }

  bindSkillMarketControls({
    ...skillMarketContext,
    elements: {
      skillMarketOpenModalEl,
      skillModalKeywordEl,
      skillModalSortEl,
      skillModalNonSuspiciousEl,
      skillModalHighlightedOnlyEl,
      skillModalSearchEl,
      skillModalCloseEl,
      skillModalCloseTopEl,
      skillModalBackdropCloseEl,
    },
  });

  if (cancelAddModelEl) {
    cancelAddModelEl.addEventListener("click", () => {
      settingsState.itemAddOpen = false;
      resetModelItemDraft(settingsState.itemDraft.provider);
      renderSettingsTab();
    });
  }

  const addModel = () => {
    if (settingsState.itemDraft.type === "tool") {
      const nextToolName = normalizeToolName(settingsState.itemDraft.toolName);
      if (settingsState.registeredTools.includes(nextToolName)) {
        setMessage("MSG-PPH-1001");
        return;
      }
      settingsState.registeredTools.push(nextToolName);
      settingsState.itemAddOpen = false;
      renderSettingsTab();
      return;
    }

    const next = normalizeRegisteredModel({
      name: settingsState.itemDraft.modelName,
      provider: settingsState.itemDraft.provider,
      apiKey: settingsState.itemDraft.apiKey,
      baseUrl: settingsState.itemDraft.baseUrl,
      endpoint: settingsState.itemDraft.endpoint,
    });
    if (!next.name) {
      setMessage("MSG-PPH-1001");
      return;
    }
    if (!isValidProviderModelPair(next.provider, next.name)) {
      setMessage("MSG-PPH-1001");
      return;
    }
    if (isApiKeyRequiredForProvider(next.provider) && !next.apiKey) {
      setMessage("MSG-PPH-1001");
      return;
    }
    const existingIndex = settingsState.registeredModels.findIndex((model) => (
      providerIdFromInput(model.provider) === providerIdFromInput(next.provider) &&
      model.name.toLowerCase() === next.name.toLowerCase()
    ));
    if (existingIndex >= 0) {
      const existing = settingsState.registeredModels[existingIndex];
      settingsState.registeredModels[existingIndex] = {
        ...existing,
        ...next,
        apiKeyConfigured: Boolean(existing.apiKeyConfigured || next.apiKeyConfigured),
      };
    } else {
      settingsState.registeredModels.push(next);
    }
    resetModelItemDraft(next.provider);
    settingsState.itemAddOpen = false;
    renderSettingsTab();
  };

  if (addModelSubmitEl) {
    addModelSubmitEl.addEventListener("click", addModel);
  }
  if (modelNameEl) {
    modelNameEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addModel();
      }
    });
  }

  root.querySelectorAll("[data-remove-model-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-remove-model-index"));
      if (Number.isNaN(index)) return;
      settingsState.registeredModels.splice(index, 1);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-remove-tool-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-remove-tool-index"));
      if (Number.isNaN(index)) return;
      settingsState.registeredTools.splice(index, 1);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-remove-skill-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const skillId = normalizeSkillId(button.getAttribute("data-remove-skill-id"));
      const result = uninstallRegisteredSkillWithFallback(skillId, settingsState.registeredSkills);
      if (!result.ok) {
        setMessage(result.errorCode || "MSG-PPH-1001");
        return;
      }
      settingsState.registeredSkills = result.nextRegisteredSkillIds;
      renderSettingsTab();
    });
  });

  bindSkillMarketInstallHandlers(skillMarketContext);
  bindSkillLinkHandlers(skillMarketContext);

  if (saveEl) {
    saveEl.addEventListener("click", async () => {
      if (settingsSaveInFlight) return;
      if (!hasUnsavedSettingsChanges()) return;
      if (settingsState.registeredModels.length === 0 && settingsState.registeredTools.length === 0) {
        setMessage("MSG-PPH-1001");
        return;
      }
      syncPalProfilesFromSettings();
      settingsSaveInFlight = true;
      renderSettingsTab();
      try {
        const persisted = await saveSettingsSnapshotWithFallback();
        applySettingsSnapshot(persisted);
        writePalProfilesSnapshotWithFallback();
        setMessage("MSG-PPH-0007");
      } catch (error) {
        setMessage("MSG-PPH-1003");
      } finally {
        settingsSaveInFlight = false;
        renderSettingsTab();
      }
    });
  }
}

global.SettingsTabControlsUi = {
  bindSettingsTabControls,
};
})(window);
