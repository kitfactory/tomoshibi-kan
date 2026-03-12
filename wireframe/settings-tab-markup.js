(function (global) {
function buildSettingsTabLabels(localeValue) {
  const isJa = localeValue === "ja";
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
      residentHint: "月見里 燈子 / 真壁 / 冬坂 / 久瀬 / 白峰 の built-in 定義で workspace 側の identity を上書きします",
      residentSync: "built-in 定義を workspace に同期",
      handoffMinimal: "Minimal",
      handoffBalanced: "Balanced",
      handoffVerbose: "Verbose",
      modelSection: "モデル / CLI",
      skillCategorySection: "Skills",
      models: "LLM models",
      tools: "CLI tools",
      skillSection: "Model Runtime Skills",
      skillSectionHint: "モデル実行時に利用可能。住人ごとに有効化できます",
      installedSkillsPanel: "インストール済みスキル",
      skillMarketPanel: "ClawHub 検索 / インストール",
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
      residentHint: "Overwrite workspace identities for Tsukimisato Toko, Makabe, Fuyusaka, Kuze, and Shiramine with the current built-in definitions",
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
      unsavedChanges: "Unsaved changes",
      savedState: "Saved",
    };
  return {
    ...labels,
    noSkillsLabel: labels.noSkills || "No skills registered",
    skillSectionLabel: labels.skillSection || "Model Runtime Skills",
    skillSectionHintLabel: labels.skillSectionHint || "Mounted on model runtime, selectable per resident",
    skillSearchPlaceholderLabel: labels.skillSearchPlaceholder || "Search on ClawHub",
    skillSearchIdleLabel: labels.skillSearchIdle || "Enter keyword and press Search",
    skillSearchLoadingLabel: labels.skillSearchLoading || "Searching ClawHub...",
    skillFilterGroupLabel: labels.skillFilterGroup || "Filters",
    skillFilterNonSuspiciousLabel: labels.skillFilterNonSuspicious || "Exclude suspicious skills",
    skillFilterHighlightedOnlyLabel: labels.skillFilterHighlightedOnly || "Highlighted only",
    skillSortLabelText: labels.skillSortLabel || "Sort",
    skillSortDownloadsLabel: labels.skillSortDownloads || "Downloads",
    skillSortStarsLabel: labels.skillSortStars || "Stars",
    skillSortInstallsLabel: labels.skillSortInstalls || "Installs",
    skillSortUpdatedLabel: labels.skillSortUpdated || "Latest update",
    skillSortHighlightedLabel: labels.skillSortHighlighted || "Highlighted first",
    skillCategoryTitle: labels.skillCategorySection || "Skills",
    languageItemLabel: labels.languageItem || "Display language",
    handoffSectionLabel: labels.handoffSection || "Execution Loop",
    handoffItemLabel: labels.handoffItem || "Context Handoff Policy",
    handoffHintLabel: labels.handoffHint || "Controls how much context Guide passes to Worker/Gate",
    residentSectionLabel: labels.residentSection || "Built-in Residents",
    residentItemLabel: labels.residentItem || "Sync resident definitions",
    residentHintLabel: labels.residentHint || "Overwrite workspace identities with the current built-in definitions",
    residentSyncLabel: labels.residentSync || "Sync built-in definitions to workspace",
    installedSkillsPanelLabel: labels.installedSkillsPanel || "Installed Skills",
    skillMarketPanelLabel: labels.skillMarketPanel || "ClawHub Search / Install",
    summarySkillsLabel: labels.summarySkills || "skills",
    skillMarketOpenLabel: labels.skillMarketOpen || "Search / Install from ClawHub",
    skillModalTitleLabel: labels.skillModalTitle || "ClawHub Skill Search",
    skillModalKeywordLabel: labels.skillModalKeyword || "Keyword",
    skillModalSearchLabel: labels.skillModalSearch || "Search",
    skillModalCloseLabel: labels.skillModalClose || "Close",
    skillRatingLabel: labels.skillRating || "Rating",
    skillDownloadsLabel: labels.skillDownloads || "Downloads",
    skillStarsLabel: labels.skillStars || "Stars",
    skillInstallsLabel: labels.skillInstalls || "Installs",
    skillOpenLinkLabel: labels.skillOpenLink || "Link",
    skillInstallUnsupportedLabel: labels.skillInstallUnsupported || "Standard skills only",
    skillRecommendTitleLabel: labels.skillRecommendTitle || "Recommended (Not Installed)",
    skillRecommendEmptyLabel: labels.skillRecommendEmpty || "No recommended skills",
    skillDownloadLabel: labels.skillDownload || "Install",
  };
}

function renderSettingsModelList(context) {
  const { labels, settingsState, escapeHtml, providerLabel } = context;
  if (settingsState.registeredModels.length === 0) {
    return `<li id="settingsTabModelEmpty" class="text-xs text-base-content/60">${labels.noModels}</li>`;
  }
  return settingsState.registeredModels
    .map((model, index) => `<li class="settings-model-row">
      <div class="settings-model-meta">
        <span class="badge badge-primary badge-sm">Model</span>
        <span class="badge badge-outline badge-sm">${escapeHtml(model.name)}</span>
        <span class="text-xs text-base-content/70">${escapeHtml(providerLabel(model.provider))}</span>
        ${model.apiKeyConfigured ? `<span class="text-xs text-base-content/60">api_key: configured</span>` : ""}
        ${model.baseUrl ? `<span class="text-xs text-base-content/60">base_url: ${escapeHtml(model.baseUrl)}</span>` : ""}
      </div>
      <button class="btn btn-ghost btn-xs" data-remove-model-index="${index}" type="button">${context.isJa ? "削除" : "Remove"}</button>
    </li>`)
    .join("");
}

function renderSettingsToolList(context) {
  const { labels, settingsState, escapeHtml } = context;
  if (settingsState.registeredTools.length === 0) {
    return `<li id="settingsTabToolEmpty" class="text-xs text-base-content/60">${labels.noTools}</li>`;
  }
  return settingsState.registeredTools
    .map((tool, index) => `<li class="settings-model-row">
      <div class="settings-model-meta">
        <span class="badge badge-accent badge-sm">CLI</span>
        <span class="badge badge-ghost badge-sm">${escapeHtml(tool)}</span>
      </div>
      <button class="btn btn-ghost btn-xs" data-remove-tool-index="${index}" type="button">${context.isJa ? "削除" : "Remove"}</button>
    </li>`)
    .join("");
}

function renderSettingsSkillList(context) {
  const { labels, settingsState, escapeHtml, normalizeSkillId, normalizeText, skillById, buildClawHubSkillUrl, STANDARD_SKILL_IDS } = context;
  if (settingsState.registeredSkills.length === 0) {
    return `<li id="settingsTabSkillEmpty" class="text-xs text-base-content/60">${escapeHtml(labels.noSkillsLabel)}</li>`;
  }
  return settingsState.registeredSkills
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
          ${showSkillLink ? `<a class="btn btn-outline btn-xs" href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener noreferrer" data-skill-link-id="${escapeHtml(normalizedSkillId)}">${escapeHtml(labels.skillOpenLinkLabel)}</a>` : ""}
          <button class="btn btn-ghost btn-xs" data-remove-skill-id="${escapeHtml(normalizedSkillId)}" type="button">${context.isJa ? "削除" : "Remove"}</button>
        </div>
      </li>`;
    })
    .join("");
}

function buildSettingsAddItemFields(context) {
  const { labels, settingsState, escapeHtml, providerOptions, modelOptions, cliToolOptions, modelNameOptions, isApiKeyRequiredForProvider } = context;
  const noModelOptionsForProviderLabel = context.isJa
    ? "選択した provider に対応するモデルがありません"
    : "No models available for selected provider";
  if (settingsState.itemDraft.type === "model") {
    const apiKeyPlaceholder = isApiKeyRequiredForProvider(settingsState.itemDraft.provider)
      ? "api_key (required)"
      : "api_key (optional)";
    return `<select id="settingsTabModelProvider" class="select select-bordered select-sm">${providerOptions}</select>
      <select id="settingsTabModelName" class="select select-bordered select-sm">${modelOptions}</select>
      <input id="settingsTabModelApiKey" type="password" class="input input-bordered input-sm" placeholder="${apiKeyPlaceholder}" value="${escapeHtml(settingsState.itemDraft.apiKey)}" />
      <input id="settingsTabModelBaseUrl" type="text" class="input input-bordered input-sm" placeholder="base_url (optional)" value="${escapeHtml(settingsState.itemDraft.baseUrl)}" />
      ${modelNameOptions.length === 0 ? `<span class="text-xs text-warning">${escapeHtml(noModelOptionsForProviderLabel)}</span>` : ""}`;
  }
  return `<select id="settingsTabToolName" class="select select-bordered select-sm">${cliToolOptions}</select>`;
}

function buildSettingsAddModelForm(context) {
  const { labels, settingsState, addModelDisabled, escapeHtml } = context;
  if (!settingsState.itemAddOpen) return "";
  const addModelDisabledAttr = addModelDisabled ? " disabled" : "";
  const addItemFields = buildSettingsAddItemFields(context);
  return `<div id="settingsTabAddModelRow" class="settings-add-model-row">
    <select id="settingsTabEntryType" class="select select-bordered select-sm">
      <option value="model"${settingsState.itemDraft.type === "model" ? " selected" : ""}>Model</option>
      <option value="tool"${settingsState.itemDraft.type === "tool" ? " selected" : ""}>CLI Tool</option>
    </select>
    ${addItemFields}
    <button id="settingsTabAddItemSubmit" class="btn btn-sm btn-outline" type="button"${addModelDisabledAttr}>${escapeHtml(labels.add)}</button>
    <button id="settingsTabCancelAddItem" class="btn btn-sm btn-ghost" type="button">${escapeHtml(labels.cancel)}</button>
  </div>`;
}

function buildSettingsTabShellMarkup(context) {
  const {
    labels,
    settingsState,
    locale,
    escapeHtml,
    modelList,
    toolList,
    skillList,
    addModelForm,
    handoffOptions,
    guideControllerAssistEnabled,
    settingsVisualState,
    saveStatusText,
    saveStatusToneClass,
    settingsSaveInFlight,
    saveDisabledAttr,
    saveButtonText,
    sortOptions,
    skillMarketAvailableCount,
    skillMarketPreviewList,
    skillMarketModalResults,
    skillSearchDraftValue,
    draftFilters,
  } = context;
  return `<div class="settings-shell" data-add-form-open="${settingsState.itemAddOpen ? "true" : "false"}">
    <section class="settings-section">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.languageSection}</h3>
      </div>
      <div class="field settings-locale-row">
        <label class="label-text text-xs text-base-content/70">${labels.languageItemLabel}</label>
        <div class="join settings-locale-actions" role="group" aria-label="${labels.language}">
          <button id="settingsLocaleJa" type="button" class="btn btn-sm join-item ${locale === "ja" ? "btn-primary" : "btn-ghost"}">JA</button>
          <button id="settingsLocaleEn" type="button" class="btn btn-sm join-item ${locale === "en" ? "btn-primary" : "btn-ghost"}">EN</button>
        </div>
      </div>
    </section>
    <section class="settings-section" data-settings-section="handoff">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.handoffSectionLabel}</h3>
      </div>
      <div class="field settings-subpanel">
        <label class="label-text text-xs text-base-content/70" for="settingsContextHandoffPolicy">${labels.handoffItemLabel}</label>
        <select id="settingsContextHandoffPolicy" class="select select-bordered select-sm settings-handoff-select">${handoffOptions}</select>
        <span class="text-xs text-base-content/60">${escapeHtml(labels.handoffHintLabel)}</span>
        <label class="mt-3 flex items-center gap-2 text-sm" for="settingsGuideControllerAssistEnabled">
          <input id="settingsGuideControllerAssistEnabled" type="checkbox" class="checkbox checkbox-sm"${guideControllerAssistEnabled ? " checked" : ""} />
          <span>${escapeHtml(labels.guideAssistItem)}</span>
        </label>
        <span class="text-xs text-base-content/60">${escapeHtml(labels.guideAssistHint)}</span>
      </div>
    </section>
    <section class="settings-section" data-settings-section="resident-sync">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.residentSectionLabel}</h3>
      </div>
      <div class="field settings-subpanel">
        <label class="label-text text-xs text-base-content/70">${labels.residentItemLabel}</label>
        <span class="text-xs text-base-content/60">${escapeHtml(labels.residentHintLabel)}</span>
        <div class="settings-inline">
          <button id="settingsSyncBuiltInResidents" class="btn btn-sm btn-outline" type="button">${escapeHtml(labels.residentSyncLabel)}</button>
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
        <h3 class="settings-section-title">${labels.skillCategoryTitle}</h3>
      </div>
      <div class="settings-stack">
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${labels.installedSkillsPanelLabel}</label>
          <ul id="settingsTabSkillList" class="settings-model-list">${skillList}</ul>
          <span class="text-xs text-base-content/60">${labels.skillSectionHintLabel}</span>
        </div>
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${labels.skillMarketPanelLabel}</label>
          <span class="text-xs text-base-content/70">${escapeHtml(labels.skillRecommendTitleLabel)}: <strong>${skillMarketAvailableCount}</strong></span>
          <ul id="settingsSkillMarketPreview" class="settings-model-list">${skillMarketPreviewList}</ul>
          <button id="settingsSkillMarketOpenModal" class="btn btn-sm btn-outline settings-skill-market-open-btn" type="button">${escapeHtml(labels.skillMarketOpenLabel)}</button>
        </div>
      </div>
    </section>
    <footer class="settings-footer" data-settings-state="${settingsVisualState}">
      <div class="settings-footer-row">
        <div class="settings-footer-meta">
          <span class="text-xs text-base-content/65">${labels.summary}: <strong>${settingsState.registeredModels.length}</strong> / ${labels.summaryTools}: <strong>${settingsState.registeredTools.length}</strong> / ${labels.summarySkillsLabel}: <strong>${settingsState.registeredSkills.length}</strong></span>
          <span id="settingsDirtyHint" class="text-xs settings-status-text ${saveStatusToneClass}">${escapeHtml(saveStatusText)}</span>
        </div>
        <button id="settingsTabSave" class="btn btn-lg btn-primary settings-save-btn" type="button" data-settings-state="${settingsVisualState}" aria-busy="${settingsSaveInFlight ? "true" : "false"}"${saveDisabledAttr}>${escapeHtml(saveButtonText)}</button>
      </div>
    </footer>
  </div>
  <div id="settingsSkillMarketModal" class="settings-skill-modal${settingsState.skillMarketModalOpen ? " is-open" : ""}">
    <div id="settingsSkillModalBackdropClose" class="settings-skill-modal-backdrop" aria-hidden="true"></div>
    <div class="settings-skill-modal-box" role="dialog" aria-modal="true" aria-label="${escapeHtml(labels.skillModalTitleLabel)}">
      <div class="settings-skill-modal-header">
        <h3 class="font-semibold text-base">${escapeHtml(labels.skillModalTitleLabel)}</h3>
        <button id="settingsSkillModalCloseTop" type="button" class="btn btn-ghost btn-xs" aria-label="${escapeHtml(labels.skillModalCloseLabel)}">x</button>
      </div>
      <label class="label-text text-xs text-base-content/70">${escapeHtml(labels.skillModalKeywordLabel)}</label>
      <input id="settingsSkillModalKeyword" type="text" class="input input-bordered input-sm settings-skill-modal-keyword" placeholder="${escapeHtml(labels.skillSearchPlaceholderLabel)}" value="${escapeHtml(skillSearchDraftValue)}" />
      <div class="settings-skill-modal-filter-stack">
        <div class="settings-skill-modal-filter-group">
          <span class="label-text text-xs text-base-content/70">${escapeHtml(labels.skillFilterGroupLabel)}</span>
          <div class="settings-skill-modal-check-row">
            <label class="settings-skill-modal-check">
              <input id="settingsSkillModalNonSuspicious" type="checkbox" class="checkbox checkbox-sm"${draftFilters.nonSuspiciousOnly ? " checked" : ""} />
              <span class="text-xs">${escapeHtml(labels.skillFilterNonSuspiciousLabel)}</span>
            </label>
            <label class="settings-skill-modal-check">
              <input id="settingsSkillModalHighlightedOnly" type="checkbox" class="checkbox checkbox-sm"${draftFilters.highlightedOnly ? " checked" : ""} />
              <span class="text-xs">${escapeHtml(labels.skillFilterHighlightedOnlyLabel)}</span>
            </label>
          </div>
        </div>
        <div class="settings-skill-modal-controls-row">
          <div class="settings-skill-modal-sort-group">
            <span class="label-text text-xs text-base-content/70">${escapeHtml(labels.skillSortLabelText)}</span>
            <select id="settingsSkillModalSort" class="select select-bordered select-sm">${sortOptions}</select>
          </div>
          <button id="settingsSkillModalSearch" class="btn btn-sm btn-primary settings-skill-modal-search-btn" type="button">${escapeHtml(labels.skillModalSearchLabel)}</button>
        </div>
      </div>
      <hr class="settings-skill-modal-divider" />
      <ul id="settingsSkillModalResults" class="settings-skill-modal-results">${skillMarketModalResults}</ul>
      <div class="settings-skill-modal-footer">
        <button id="settingsSkillModalClose" class="btn btn-sm btn-ghost" type="button">${escapeHtml(labels.skillModalCloseLabel)}</button>
      </div>
    </div>
  </div>`;
}

global.SettingsTabMarkupUi = {
  buildSettingsTabLabels,
  renderSettingsModelList,
  renderSettingsToolList,
  renderSettingsSkillList,
  buildSettingsAddModelForm,
  buildSettingsTabShellMarkup,
};
})(window);
