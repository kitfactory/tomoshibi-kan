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

function renderSettingsTab() {
  const {
    selectableModelOptions,
    resolveDraftProviderWithAvailableModels,
    isValidProviderModelPair,
    resetModelItemDraft,
    syncSettingsModelsFromRegistry,
    syncPalProfilesFromSettings,
    setMessage,
    appendEvent,
    messageText,
    showErrorToast,
    hideErrorToast,
    buildGuideModelFailedPrompt,
  } = settingsTabSupportApi();
  const root = document.getElementById("settingsTabContent");
  if (!root) return;

  syncSettingsModelsFromRegistry();
  const isJa = locale === "ja";
  const labels = isJa
    ? {
      language: "Language",
      languageItem: "表示言語",
      languageSection: "Language",
      handoffSection: "Execution Loop",
      handoffItem: "Context Handoff Policy",
      handoffHint: "Guide から Worker/Gate へ渡す文脈量を制御します",
      guideAssistItem: "Guide controller assist",
      guideAssistHint: "既定は OFF。ON にすると planning trigger / readiness を controller が補助します",
      residentSection: "Built-in 住人定義",
      residentItem: "住人定義を同期",
      residentHint: "燈子さん / 真壁 / 冬坂 / 久瀬 / 白峰 の built-in 定義で workspace 側の identity を上書きします",
      residentSync: "built-in 定義を workspace に同期",
      handoffMinimal: "Minimal",
      handoffBalanced: "Balanced",
      handoffVerbose: "Verbose",
      modelSection: "モデル / CLI",
      skillCategorySection: "Skills",
      models: "LLM models",
      tools: "CLI tools",
      skillSection: "Model Runtime Skills",
      skillSectionHint: "モデル実行時に利用可能。Palごとに有効化できます",
      installedSkillsPanel: "インストール済みスキル",
      skillMarketPanel: "ClawHub 検索 / インストール",
      skillCatalogHint: "ClawHub からスキルを検索してインストール",
      skillSearchPlaceholder: "検索キーワード（例: browser, file, test）",
      skillSearchEmpty: "該当なし",
      skillSearchIdle: "キーワードを入力して検索を実行してください",
      skillSearchLoading: "ClawHub を検索中...",
      skillFilterGroup: "絞り込み",
      skillFilterNonSuspicious: "怪しいスキルを除外",
      skillFilterHighlightedOnly: "Highlighted のみ",
      skillSortLabel: "並び順",
      skillSortDownloads: "Downloads順",
      skillSortStars: "Stars順",
      skillSortInstalls: "インストール数順",
      skillSortUpdated: "最新更新順",
      skillSortHighlighted: "Highlighted 優先",
      skillRecommendTitle: "未インストールのおすすめ",
      skillRecommendEmpty: "おすすめ候補はありません",
      skillMarketOpen: "ClawHub から検索・インストール",
      skillModalTitle: "ClawHub スキル検索",
      skillModalKeyword: "検索キーワード",
      skillModalSearch: "検索実行",
      skillModalClose: "閉じる",
      skillSafety: "安全性",
      skillRating: "評価",
      skillDownloads: "Downloads",
      skillStars: "Stars",
      skillInstalls: "Installs",
      skillOpenLink: "リンク",
      skillDownload: "インストール",
      skillInstallUnsupported: "標準 Skill のみ対応",
      noModels: "モデルはありません",
      noTools: "CLIツールはありません",
      noSkills: "Skill はありません",
      addOpen: "項目を追加",
      addClose: "追加フォームを閉じる",
      add: "追加",
      cancel: "キャンセル",
      save: "設定を保存",
      saveAll: "設定全体を保存",
      saving: "保存中",
      summary: "models",
      summaryTools: "tools",
      summarySkills: "skills",
      selectedModels: "selected_models",
      modelPlaceholder: "モデル名 (例: gpt-4.1)",
      unsavedChanges: "未保存の変更があります",
      savedState: "保存済み",
    }
    : {
      language: "Language",
      languageItem: "Display language",
      languageSection: "Language",
      handoffSection: "Execution Loop",
      handoffItem: "Context Handoff Policy",
      handoffHint: "Controls how much context Guide passes to Worker/Gate",
      guideAssistItem: "Guide controller assist",
      guideAssistHint: "Off by default. When enabled, the controller helps Guide with planning trigger/readiness cues",
      residentSection: "Built-in Residents",
      residentItem: "Sync resident definitions",
      residentHint: "Overwrite workspace identities for caretaker, veteran, maker, writer, arranger, and researcher with the current built-in definitions",
      residentSync: "Sync built-in definitions to workspace",
      handoffMinimal: "Minimal",
      handoffBalanced: "Balanced",
      handoffVerbose: "Verbose",
      modelSection: "Model / CLI",
      skillCategorySection: "Skills",
      models: "models",
      tools: "cli tools",
      skillSection: "Model Runtime Skills",
      skillSectionHint: "Mounted on model runtime, selectable per resident",
      installedSkillsPanel: "Installed Skills",
      skillMarketPanel: "ClawHub Search / Install",
      skillCatalogHint: "Search and install skills from ClawHub",
      skillSearchPlaceholder: "Search keyword (ex: browser, file, test)",
      skillSearchEmpty: "No matches",
      skillSearchIdle: "Enter keyword and press Search",
      skillSearchLoading: "Searching ClawHub...",
      skillFilterGroup: "Filters",
      skillFilterNonSuspicious: "Exclude suspicious skills",
      skillFilterHighlightedOnly: "Highlighted only",
      skillSortLabel: "Sort",
      skillSortDownloads: "Downloads",
      skillSortStars: "Stars",
      skillSortInstalls: "Installs",
      skillSortUpdated: "Latest update",
      skillSortHighlighted: "Highlighted first",
      skillRecommendTitle: "Recommended (Not Installed)",
      skillRecommendEmpty: "No recommended skills",
      skillMarketOpen: "Search / Install from ClawHub",
      skillModalTitle: "ClawHub Skill Search",
      skillModalKeyword: "Keyword",
      skillModalSearch: "Search",
      skillModalClose: "Close",
      skillSafety: "Safety",
      skillRating: "Rating",
      skillDownloads: "Downloads",
      skillStars: "Stars",
      skillInstalls: "Installs",
      skillOpenLink: "Link",
      skillDownload: "Install",
      skillInstallUnsupported: "Standard skills only",
      noModels: "No models registered",
      noTools: "No CLI tools registered",
      noSkills: "No skills registered",
      addOpen: "Add item",
      addClose: "Close add form",
      add: "Add",
      cancel: "Cancel",
      save: "Save Settings",
      saveAll: "Save All Settings",
      saving: "Saving",
      summary: "models",
      summaryTools: "tools",
      summarySkills: "skills",
      selectedModels: "selected_models",
      modelPlaceholder: "Model name (ex: gpt-4.1)",
      unsavedChanges: "Unsaved changes",
      savedState: "Saved",
    };
  const noSkillsLabel = labels.noSkills || "No skills registered";
  const skillSectionLabel = labels.skillSection || "Model Runtime Skills";
  const skillSectionHintLabel =
    labels.skillSectionHint || "Mounted on model runtime, selectable per resident";
  const skillSearchPlaceholderLabel =
    labels.skillSearchPlaceholder || "Search on ClawHub";
  const skillSearchIdleLabel = labels.skillSearchIdle || "Enter keyword and press Search";
  const skillSearchLoadingLabel = labels.skillSearchLoading || "Searching ClawHub...";
  const skillFilterGroupLabel = labels.skillFilterGroup || "Filters";
  const skillFilterNonSuspiciousLabel = labels.skillFilterNonSuspicious || "Exclude suspicious skills";
  const skillFilterHighlightedOnlyLabel = labels.skillFilterHighlightedOnly || "Highlighted only";
  const skillSortLabel = labels.skillSortLabel || "Sort";
  const skillSortDownloadsLabel = labels.skillSortDownloads || "Downloads";
  const skillSortStarsLabel = labels.skillSortStars || "Stars";
  const skillSortInstallsLabel = labels.skillSortInstalls || "Installs";
  const skillSortUpdatedLabel = labels.skillSortUpdated || "Latest update";
  const skillSortHighlightedLabel = labels.skillSortHighlighted || "Highlighted first";
  const skillCategoryTitle = labels.skillCategorySection || "Skills";
  const languageItemLabel = labels.languageItem || "Display language";
  const handoffSectionLabel = labels.handoffSection || "Execution Loop";
  const handoffItemLabel = labels.handoffItem || "Context Handoff Policy";
  const handoffHintLabel = labels.handoffHint || "Controls how much context Guide passes to Worker/Gate";
  const residentSectionLabel = labels.residentSection || "Built-in Residents";
  const residentItemLabel = labels.residentItem || "Sync resident definitions";
  const residentHintLabel = labels.residentHint || "Overwrite workspace identities with the current built-in definitions";
  const residentSyncLabel = labels.residentSync || "Sync built-in definitions to workspace";
  const installedSkillsPanelLabel = labels.installedSkillsPanel || "Installed Skills";
  const skillMarketPanelLabel = labels.skillMarketPanel || "ClawHub Search / Install";
  const summarySkillsLabel = labels.summarySkills || "skills";
  const skillMarketOpenLabel = labels.skillMarketOpen || "Search / Install from ClawHub";
  const skillModalTitleLabel = labels.skillModalTitle || "ClawHub Skill Search";
  const skillModalKeywordLabel = labels.skillModalKeyword || "Keyword";
  const skillModalSearchLabel = labels.skillModalSearch || "Search";
  const skillModalCloseLabel = labels.skillModalClose || "Close";
  const skillRatingLabel = labels.skillRating || "Rating";
  const skillDownloadsLabel = labels.skillDownloads || "Downloads";
  const skillStarsLabel = labels.skillStars || "Stars";
  const skillInstallsLabel = labels.skillInstalls || "Installs";
  const skillOpenLinkLabel = labels.skillOpenLink || "Link";
  const skillInstallUnsupportedLabel = labels.skillInstallUnsupported || "Standard skills only";
  const skillRecommendTitleLabel = labels.skillRecommendTitle || "Recommended (Not Installed)";
  const skillRecommendEmptyLabel = labels.skillRecommendEmpty || "No recommended skills";
  const skillDownloadLabel = labels.skillDownload || "Install";
  const {
    buildSkillMarketPreviewList,
    buildSkillMarketModalResultsHtml,
    renderSkillMarketModalResults,
  } = settingsTabSkillModalApi();
  const {
    bindSettingsTabControls,
  } = settingsTabControlsApi();

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

  const modelList = settingsState.registeredModels.length === 0
    ? `<li id="settingsTabModelEmpty" class="text-xs text-base-content/60">${labels.noModels}</li>`
    : settingsState.registeredModels
      .map((model, index) => `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-primary badge-sm">Model</span>
          <span class="badge badge-outline badge-sm">${escapeHtml(model.name)}</span>
          <span class="text-xs text-base-content/70">${escapeHtml(providerLabel(model.provider))}</span>
          ${model.apiKeyConfigured ? `<span class="text-xs text-base-content/60">api_key: configured</span>` : ""}
          ${model.baseUrl ? `<span class="text-xs text-base-content/60">base_url: ${escapeHtml(model.baseUrl)}</span>` : ""}
        </div>
        <button class="btn btn-ghost btn-xs" data-remove-model-index="${index}" type="button">${isJa ? "削除" : "Remove"}</button>
      </li>`)
      .join("");

  const toolList = settingsState.registeredTools.length === 0
    ? `<li id="settingsTabToolEmpty" class="text-xs text-base-content/60">${labels.noTools}</li>`
    : settingsState.registeredTools
      .map((tool, index) => `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-accent badge-sm">CLI</span>
          <span class="badge badge-ghost badge-sm">${escapeHtml(tool)}</span>
        </div>
        <button class="btn btn-ghost btn-xs" data-remove-tool-index="${index}" type="button">${isJa ? "削除" : "Remove"}</button>
      </li>`)
      .join("");

  const skillList = settingsState.registeredSkills.length === 0
    ? `<li id="settingsTabSkillEmpty" class="text-xs text-base-content/60">${escapeHtml(noSkillsLabel)}</li>`
    : settingsState.registeredSkills
      .map((skillId) => {
        const normalizedSkillId = normalizeSkillId(skillId) || normalizeText(skillId);
        const skill = skillById(normalizedSkillId);
        const name = skill?.name || normalizedSkillId;
        const description = skill?.description || "";
        const linkUrl = buildClawHubSkillUrl(normalizedSkillId);
        const showSkillLink = !STANDARD_SKILL_IDS.includes(normalizedSkillId);
        return `<li class="settings-model-row">
          <div class="settings-model-meta">
            <span class="badge badge-neutral badge-sm">Skill</span>
            <span class="badge badge-outline badge-sm">${escapeHtml(name)}</span>
            ${description ? `<span class="text-xs text-base-content/60">${escapeHtml(description)}</span>` : ""}
          </div>
          <div class="settings-row-actions" data-skill-actions="${escapeHtml(normalizedSkillId)}">
            ${showSkillLink ? `<a
              class="btn btn-outline btn-xs"
              href="${escapeHtml(linkUrl)}"
              target="_blank"
              rel="noopener noreferrer"
              data-skill-link-id="${escapeHtml(normalizedSkillId)}"
            >${escapeHtml(skillOpenLinkLabel)}</a>` : ""}
            <button class="btn btn-ghost btn-xs" data-remove-skill-id="${escapeHtml(normalizedSkillId)}" type="button">${isJa ? "削除" : "Remove"}</button>
          </div>
        </li>`;
      })
      .join("");
  const skillMarketContext = {
    root,
    locale,
    settingsState,
    renderSettingsTab,
    labels: {
      skillRecommendEmptyLabel,
      skillSearchIdleLabel,
      skillSearchLoadingLabel,
      skillSearchEmptyLabel: labels.skillSearchEmpty || "No matching skills on ClawHub",
      skillDownloadsLabel,
      skillStarsLabel,
      skillInstallsLabel,
      skillRatingLabel,
      skillOpenLinkLabel,
      skillDownloadLabel,
      skillInstallUnsupportedLabel,
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
  const skillMarketModalResults = buildSkillMarketModalResultsHtml(skillMarketContext);

  const modelNameOptions = selectableModelOptions(settingsState.itemDraft.provider);
  const noModelOptionsForProviderLabel = isJa
    ? "選択した provider に対応するモデルがありません"
    : "No models available for selected provider";
  const modelOptions = modelNameOptions.length === 0
    ? `<option value="">-</option>`
    : modelNameOptions
      .map((modelName) => {
        const selected = modelName === settingsState.itemDraft.modelName ? " selected" : "";
        return `<option value="${escapeHtml(modelName)}"${selected}>${escapeHtml(modelName)}</option>`;
      })
      .join("");
  const addModelDisabled = settingsState.itemDraft.type === "model" && modelNameOptions.length === 0;
  const addModelDisabledAttr = addModelDisabled ? " disabled" : "";
  const apiKeyRequired = isApiKeyRequiredForProvider(settingsState.itemDraft.provider);
  const apiKeyPlaceholder = apiKeyRequired
    ? "api_key (required)"
    : "api_key (optional)";
  const addItemFields = settingsState.itemDraft.type === "model"
    ? `<select id="settingsTabModelProvider" class="select select-bordered select-sm">${providerOptions}</select>
       <select id="settingsTabModelName" class="select select-bordered select-sm">${modelOptions}</select>
       <input id="settingsTabModelApiKey" type="password" class="input input-bordered input-sm" placeholder="${apiKeyPlaceholder}" value="${escapeHtml(settingsState.itemDraft.apiKey)}" />
       <input id="settingsTabModelBaseUrl" type="text" class="input input-bordered input-sm" placeholder="base_url (optional)" value="${escapeHtml(settingsState.itemDraft.baseUrl)}" />
       ${modelNameOptions.length === 0 ? `<span class="text-xs text-warning">${escapeHtml(noModelOptionsForProviderLabel)}</span>` : ""}`
    : `<select id="settingsTabToolName" class="select select-bordered select-sm">${cliToolOptions}</select>`;

  const addModelForm = settingsState.itemAddOpen
    ? `<div id="settingsTabAddModelRow" class="settings-add-model-row">
        <select id="settingsTabEntryType" class="select select-bordered select-sm">
          <option value="model"${settingsState.itemDraft.type === "model" ? " selected" : ""}>Model</option>
          <option value="tool"${settingsState.itemDraft.type === "tool" ? " selected" : ""}>CLI Tool</option>
        </select>
        ${addItemFields}
        <button id="settingsTabAddItemSubmit" class="btn btn-sm btn-outline" type="button"${addModelDisabledAttr}>${labels.add}</button>
        <button id="settingsTabCancelAddItem" class="btn btn-sm btn-ghost" type="button">${labels.cancel}</button>
      </div>`
    : "";

  const settingsDirty = hasUnsavedSettingsChanges();
  const saveDisabled = !settingsDirty || settingsSaveInFlight;
  const saveDisabledAttr = saveDisabled ? " disabled" : "";
  const settingsVisualState = settingsSaveInFlight ? "saving" : (settingsDirty ? "dirty" : "saved");
  const saveStatusText = settingsSaveInFlight
    ? labels.saving
    : (settingsDirty ? labels.unsavedChanges : labels.savedState);
  const saveStatusToneClass = settingsSaveInFlight
    ? "settings-status-saving"
    : (settingsDirty ? "settings-status-dirty" : "settings-status-saved");
  const saveButtonText = settingsSaveInFlight ? labels.saving : (labels.saveAll || labels.save);
  const skillModalOpenClass = settingsState.skillMarketModalOpen ? " is-open" : "";
  const skillSearchDraftValue = String(settingsState.skillSearchDraft || settingsState.skillSearchQuery || "");
  const draftFilters = normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft);
  const sortOptions = [
    { value: "downloads", label: skillSortDownloadsLabel },
    { value: "stars", label: skillSortStarsLabel },
    { value: "installs", label: skillSortInstallsLabel },
    { value: "updated", label: skillSortUpdatedLabel },
    { value: "highlighted", label: skillSortHighlightedLabel },
  ]
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === draftFilters.sortBy ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");
  const {
    availableCount: skillMarketAvailableCount,
    previewList: skillMarketPreviewList,
  } = buildSkillMarketPreviewList(skillMarketContext);
  const handoffPolicy = normalizeContextHandoffPolicy(settingsState.contextHandoffPolicy);
  const guideControllerAssistEnabled = settingsState.guideControllerAssistEnabled === true;
  const handoffOptions = [
    { value: "minimal", label: labels.handoffMinimal || "Minimal" },
    { value: "balanced", label: labels.handoffBalanced || "Balanced" },
    { value: "verbose", label: labels.handoffVerbose || "Verbose" },
  ]
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === handoffPolicy ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");

  root.innerHTML = `<div class="settings-shell" data-add-form-open="${settingsState.itemAddOpen ? "true" : "false"}">
    <section class="settings-section">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.languageSection}</h3>
      </div>
      <div class="field settings-locale-row">
        <label class="label-text text-xs text-base-content/70">${languageItemLabel}</label>
        <div class="join settings-locale-actions" role="group" aria-label="${labels.language}">
          <button id="settingsLocaleJa" type="button" class="btn btn-sm join-item ${locale === "ja" ? "btn-primary" : "btn-ghost"}">JA</button>
          <button id="settingsLocaleEn" type="button" class="btn btn-sm join-item ${locale === "en" ? "btn-primary" : "btn-ghost"}">EN</button>
        </div>
      </div>
    </section>
    <section class="settings-section" data-settings-section="handoff">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${handoffSectionLabel}</h3>
      </div>
      <div class="field settings-subpanel">
        <label class="label-text text-xs text-base-content/70" for="settingsContextHandoffPolicy">${handoffItemLabel}</label>
        <select id="settingsContextHandoffPolicy" class="select select-bordered select-sm settings-handoff-select">${handoffOptions}</select>
        <span class="text-xs text-base-content/60">${escapeHtml(handoffHintLabel)}</span>
        <label class="mt-3 flex items-center gap-2 text-sm" for="settingsGuideControllerAssistEnabled">
          <input id="settingsGuideControllerAssistEnabled" type="checkbox" class="checkbox checkbox-sm"${guideControllerAssistEnabled ? " checked" : ""} />
          <span>${escapeHtml(labels.guideAssistItem)}</span>
        </label>
        <span class="text-xs text-base-content/60">${escapeHtml(labels.guideAssistHint)}</span>
      </div>
    </section>
    <section class="settings-section" data-settings-section="resident-sync">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${residentSectionLabel}</h3>
      </div>
      <div class="field settings-subpanel">
        <label class="label-text text-xs text-base-content/70">${residentItemLabel}</label>
        <span class="text-xs text-base-content/60">${escapeHtml(residentHintLabel)}</span>
        <div class="settings-inline">
          <button id="settingsSyncBuiltInResidents" class="btn btn-sm btn-outline" type="button">${escapeHtml(residentSyncLabel)}</button>
        </div>
      </div>
    </section>
    <section class="settings-section${settingsState.itemAddOpen ? " is-adding" : ""}" data-settings-section="model">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.modelSection}</h3>
      </div>
      <div class="settings-columns">
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${labels.models}</label>
          <ul id="settingsTabModelList" class="settings-model-list">${modelList}</ul>
        </div>
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${labels.tools}</label>
          <ul id="settingsTabToolList" class="settings-model-list">${toolList}</ul>
        </div>
      </div>
      <div class="settings-inline">
        <button id="settingsTabOpenAddItem" class="btn btn-sm btn-outline" type="button">${settingsState.itemAddOpen ? labels.addClose : labels.addOpen}</button>
        <span class="text-xs text-base-content/65">${labels.summary}: <strong>${settingsState.registeredModels.length}</strong> / ${labels.summaryTools}: <strong>${settingsState.registeredTools.length}</strong></span>
      </div>
      ${addModelForm}
    </section>
    <section class="settings-section">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${skillCategoryTitle}</h3>
      </div>
      <div class="settings-stack">
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${installedSkillsPanelLabel}</label>
          <ul id="settingsTabSkillList" class="settings-model-list">${skillList}</ul>
          <span class="text-xs text-base-content/60">${skillSectionHintLabel}</span>
        </div>
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${skillMarketPanelLabel}</label>
          <span class="text-xs text-base-content/70">${escapeHtml(skillRecommendTitleLabel)}: <strong>${skillMarketAvailableCount}</strong></span>
          <ul id="settingsSkillMarketPreview" class="settings-model-list">${skillMarketPreviewList}</ul>
          <button id="settingsSkillMarketOpenModal" class="btn btn-sm btn-outline settings-skill-market-open-btn" type="button">${escapeHtml(skillMarketOpenLabel)}</button>
        </div>
      </div>
    </section>
    <footer class="settings-footer" data-settings-state="${settingsVisualState}">
      <div class="settings-footer-row">
        <div class="settings-footer-meta">
          <span class="text-xs text-base-content/65">${labels.summary}: <strong>${settingsState.registeredModels.length}</strong> / ${labels.summaryTools}: <strong>${settingsState.registeredTools.length}</strong> / ${summarySkillsLabel}: <strong>${settingsState.registeredSkills.length}</strong></span>
          <span id="settingsDirtyHint" class="text-xs settings-status-text ${saveStatusToneClass}">${escapeHtml(saveStatusText)}</span>
        </div>
        <button
          id="settingsTabSave"
          class="btn btn-lg btn-primary settings-save-btn"
          type="button"
          data-settings-state="${settingsVisualState}"
          aria-busy="${settingsSaveInFlight ? "true" : "false"}"${saveDisabledAttr}
        >${escapeHtml(saveButtonText)}</button>
      </div>
    </footer>
  </div>
  <div id="settingsSkillMarketModal" class="settings-skill-modal${skillModalOpenClass}">
    <div id="settingsSkillModalBackdropClose" class="settings-skill-modal-backdrop" aria-hidden="true"></div>
    <div class="settings-skill-modal-box" role="dialog" aria-modal="true" aria-label="${escapeHtml(skillModalTitleLabel)}">
      <div class="settings-skill-modal-header">
        <h3 class="font-semibold text-base">${escapeHtml(skillModalTitleLabel)}</h3>
        <button id="settingsSkillModalCloseTop" type="button" class="btn btn-ghost btn-xs" aria-label="${escapeHtml(skillModalCloseLabel)}">x</button>
      </div>
      <label class="label-text text-xs text-base-content/70">${escapeHtml(skillModalKeywordLabel)}</label>
      <input
        id="settingsSkillModalKeyword"
        type="text"
        class="input input-bordered input-sm settings-skill-modal-keyword"
        placeholder="${escapeHtml(skillSearchPlaceholderLabel)}"
        value="${escapeHtml(skillSearchDraftValue)}"
      />
      <div class="settings-skill-modal-filter-stack">
        <div class="settings-skill-modal-filter-group">
          <span class="label-text text-xs text-base-content/70">${escapeHtml(skillFilterGroupLabel)}</span>
          <div class="settings-skill-modal-check-row">
            <label class="settings-skill-modal-check">
              <input id="settingsSkillModalNonSuspicious" type="checkbox" class="checkbox checkbox-sm"${draftFilters.nonSuspiciousOnly ? " checked" : ""} />
              <span class="text-xs">${escapeHtml(skillFilterNonSuspiciousLabel)}</span>
            </label>
            <label class="settings-skill-modal-check">
              <input id="settingsSkillModalHighlightedOnly" type="checkbox" class="checkbox checkbox-sm"${draftFilters.highlightedOnly ? " checked" : ""} />
              <span class="text-xs">${escapeHtml(skillFilterHighlightedOnlyLabel)}</span>
            </label>
          </div>
        </div>
        <div class="settings-skill-modal-controls-row">
          <div class="settings-skill-modal-sort-group">
            <span class="label-text text-xs text-base-content/70">${escapeHtml(skillSortLabel)}</span>
            <select id="settingsSkillModalSort" class="select select-bordered select-sm">${sortOptions}</select>
          </div>
          <button id="settingsSkillModalSearch" class="btn btn-sm btn-primary settings-skill-modal-search-btn" type="button">${escapeHtml(skillModalSearchLabel)}</button>
        </div>
      </div>
      <hr class="settings-skill-modal-divider" />
      <ul id="settingsSkillModalResults" class="settings-skill-modal-results">${skillMarketModalResults}</ul>
      <div class="settings-skill-modal-footer">
        <button id="settingsSkillModalClose" class="btn btn-sm btn-ghost" type="button">${escapeHtml(skillModalCloseLabel)}</button>
      </div>
    </div>
  </div>`;

  const localeJaEl = document.getElementById("settingsLocaleJa");
  const localeEnEl = document.getElementById("settingsLocaleEn");
  const handoffPolicyEl = document.getElementById("settingsContextHandoffPolicy");
  const guideControllerAssistEl = document.getElementById("settingsGuideControllerAssistEnabled");
  const syncBuiltInResidentsEl = document.getElementById("settingsSyncBuiltInResidents");
  const openAddModelEl = document.getElementById("settingsTabOpenAddItem");
  const entryTypeEl = document.getElementById("settingsTabEntryType");
  const addModelSubmitEl = document.getElementById("settingsTabAddItemSubmit");
  const cancelAddModelEl = document.getElementById("settingsTabCancelAddItem");
  const modelNameEl = document.getElementById("settingsTabModelName");
  const modelProviderEl = document.getElementById("settingsTabModelProvider");
  const modelBaseUrlEl = document.getElementById("settingsTabModelBaseUrl");
  const modelApiKeyEl = document.getElementById("settingsTabModelApiKey");
  const toolNameEl = document.getElementById("settingsTabToolName");
  const skillMarketOpenModalEl = document.getElementById("settingsSkillMarketOpenModal");
  const skillModalKeywordEl = document.getElementById("settingsSkillModalKeyword");
  const skillModalSortEl = document.getElementById("settingsSkillModalSort");
  const skillModalNonSuspiciousEl = document.getElementById("settingsSkillModalNonSuspicious");
  const skillModalHighlightedOnlyEl = document.getElementById("settingsSkillModalHighlightedOnly");
  const skillModalSearchEl = document.getElementById("settingsSkillModalSearch");
  const skillModalCloseEl = document.getElementById("settingsSkillModalClose");
  const skillModalCloseTopEl = document.getElementById("settingsSkillModalCloseTop");
  const skillModalBackdropCloseEl = document.getElementById("settingsSkillModalBackdropClose");
  const saveEl = document.getElementById("settingsTabSave");
  bindSettingsTabControls({
    root,
    renderSettingsTab,
    skillMarketContext,
    elements: {
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
    },
  });
}

global.SettingsTabRenderUi = {
  renderSettingsTab,
};
})(window);
