(function (global) {
function getUninstalledSkillMarketItems(settingsState, helpers) {
  const { normalizeSkillId, CLAWHUB_SKILL_REGISTRY } = helpers;
  const installedSkillIds = new Set(
    settingsState.registeredSkills
      .map((skillId) => normalizeSkillId(skillId))
      .filter(Boolean)
  );
  return CLAWHUB_SKILL_REGISTRY
    .filter((skill) => !installedSkillIds.has(normalizeSkillId(skill.id)));
}

function isInstalledStandardSkill(settingsState, skillId, helpers) {
  const normalized = helpers.normalizeSkillId(skillId);
  if (!normalized) return false;
  return settingsState.registeredSkills.includes(normalized);
}

function buildSkillMarketPreviewList(context) {
  const {
    settingsState,
    labels,
    helpers,
  } = context;
  const uninstalledSkillItems = getUninstalledSkillMarketItems(settingsState, helpers);
  const availableCount = uninstalledSkillItems.length;
  const previewList = uninstalledSkillItems.length === 0
    ? `<li id="settingsSkillMarketPreviewEmpty" class="text-xs text-base-content/60">${helpers.escapeHtml(labels.skillRecommendEmptyLabel)}</li>`
    : uninstalledSkillItems
      .map((skill) => {
        const normalizedSkillId = helpers.normalizeSkillId(skill.id) || helpers.normalizeText(skill.id);
        const description = helpers.normalizeText(skill.description || "");
        return `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-secondary badge-sm">${helpers.escapeHtml(skill.source || "ClawHub")}</span>
          <span class="badge badge-outline badge-sm">${helpers.escapeHtml(skill.name)}</span>
          ${description ? `<span class="text-xs text-base-content/60">${helpers.escapeHtml(description)}</span>` : ""}
        </div>
        <div class="settings-row-actions" data-skill-actions="${helpers.escapeHtml(normalizedSkillId)}">
          <button class="btn btn-outline btn-xs" data-clawhub-download-skill="${helpers.escapeHtml(normalizedSkillId)}" type="button">${helpers.escapeHtml(labels.skillDownloadLabel)}</button>
        </div>
      </li>`;
      })
      .join("");
  return {
    availableCount,
    previewList,
  };
}

function buildSkillMarketModalResultsHtml(context) {
  const {
    settingsState,
    labels,
    helpers,
    locale,
  } = context;
  if (!settingsState.skillSearchExecuted) {
    return `<li id="settingsSkillModalIdle" class="text-xs text-base-content/60">${helpers.escapeHtml(labels.skillSearchIdleLabel)}</li>`;
  }
  if (settingsState.skillSearchLoading) {
    return `<li id="settingsSkillModalLoading" class="text-xs text-base-content/60">${helpers.escapeHtml(labels.skillSearchLoadingLabel)}</li>`;
  }
  const sourceResults = Array.isArray(settingsState.skillSearchResults)
    ? settingsState.skillSearchResults
    : [];
  const matches = sourceResults.filter((skill) => !isInstalledStandardSkill(settingsState, skill?.id, helpers));
  return matches.length === 0
    ? `<li id="settingsSkillModalNoResults" class="text-xs text-base-content/60">${helpers.escapeHtml(labels.skillSearchEmptyLabel)}</li>`
    : matches
      .map((skill) => {
        const normalizedSkillId = helpers.normalizeSkillId(skill.id) || helpers.normalizeText(skill.id);
        const linkUrl = helpers.buildClawHubSkillUrl(normalizedSkillId);
        const showSkillLink = !helpers.STANDARD_SKILL_IDS.includes(normalizedSkillId);
        const ratingNumber = Number(skill.rating || 0);
        const ratingDisplay = Number.isFinite(ratingNumber) && ratingNumber > 0
          ? ratingNumber.toFixed(1)
          : "-";
        const starsNumber = Number(skill.stars || 0);
        const starsDisplay = Number.isFinite(starsNumber) && starsNumber >= 0
          ? starsNumber.toLocaleString(locale === "ja" ? "ja-JP" : "en-US")
          : "-";
        const downloadsNumber = Number(skill.downloads || 0);
        const downloadsDisplay = Number.isFinite(downloadsNumber) && downloadsNumber >= 0
          ? downloadsNumber.toLocaleString(locale === "ja" ? "ja-JP" : "en-US")
          : "-";
        const installsNumber = Number(skill.installs || 0);
        const installsDisplay = Number.isFinite(installsNumber) && installsNumber >= 0
          ? installsNumber.toLocaleString(locale === "ja" ? "ja-JP" : "en-US")
          : "-";
        return `<li class="settings-skill-modal-row">
            <div class="settings-skill-modal-meta">
              <div class="settings-skill-modal-title-row">
                <span class="badge badge-secondary badge-sm">${helpers.escapeHtml(skill.source || "ClawHub")}</span>
                <span class="font-semibold text-sm">${helpers.escapeHtml(skill.name)}</span>
              </div>
              <p class="text-xs text-base-content/70">${helpers.escapeHtml(skill.description || "-")}</p>
              <div class="settings-skill-modal-tags">
                <span class="badge badge-ghost badge-sm">${helpers.escapeHtml(labels.skillDownloadsLabel)}: ${helpers.escapeHtml(downloadsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${helpers.escapeHtml(labels.skillStarsLabel)}: ${helpers.escapeHtml(starsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${helpers.escapeHtml(labels.skillInstallsLabel)}: ${helpers.escapeHtml(installsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${helpers.escapeHtml(labels.skillRatingLabel)}: ${helpers.escapeHtml(ratingDisplay)}</span>
                <span class="badge badge-outline badge-sm">${helpers.escapeHtml(skill.packageName || `clawhub/${skill.id}`)}</span>
              </div>
            </div>
            <div class="settings-row-actions settings-skill-modal-actions" data-skill-actions="${helpers.escapeHtml(normalizedSkillId)}">
              ${showSkillLink ? `<a
                class="btn btn-outline btn-sm"
                href="${helpers.escapeHtml(linkUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                data-skill-link-id="${helpers.escapeHtml(normalizedSkillId)}"
              >${helpers.escapeHtml(labels.skillOpenLinkLabel)}</a>` : ""}
              ${normalizedSkillId
    ? `<button class="btn btn-outline btn-sm" data-clawhub-download-skill="${helpers.escapeHtml(normalizedSkillId)}" type="button">${helpers.escapeHtml(labels.skillDownloadLabel)}</button>`
    : `<button class="btn btn-outline btn-sm" type="button" disabled>${helpers.escapeHtml(labels.skillInstallUnsupportedLabel)}</button>`}
            </div>
          </li>`;
      })
      .join("");
}

function bindSkillLinkHandlers(context) {
  const { root, helpers } = context;
  root.querySelectorAll("[data-skill-link-id]").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const href = helpers.normalizeText(anchor.getAttribute("href"));
      void helpers.openExternalUrlWithFallback(href);
    });
  });
}

function bindSkillMarketInstallHandlers(context) {
  const { root, settingsState, helpers, renderSettingsTab } = context;
  root.querySelectorAll("[data-clawhub-download-skill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const skillId = helpers.normalizeSkillId(btn.getAttribute("data-clawhub-download-skill"));
      const result = helpers.installRegisteredSkillWithFallback(skillId, settingsState.registeredSkills);
      if (!result.ok) {
        helpers.setMessage(result.errorCode || "MSG-PPH-1001");
        return;
      }
      settingsState.registeredSkills = result.nextRegisteredSkillIds;
      helpers.setMessage("MSG-PPH-0007");
      renderSettingsTab();
    });
  });
}

function renderSkillMarketModalResults(context) {
  const listEl = document.getElementById("settingsSkillModalResults");
  if (!listEl) return;
  listEl.innerHTML = buildSkillMarketModalResultsHtml(context);
  bindSkillLinkHandlers(context);
  bindSkillMarketInstallHandlers(context);
}

function bindSkillMarketControls(context) {
  const {
    settingsState,
    helpers,
    renderSettingsTab,
    elements,
  } = context;
  const {
    skillMarketOpenModalEl,
    skillModalKeywordEl,
    skillModalSortEl,
    skillModalNonSuspiciousEl,
    skillModalHighlightedOnlyEl,
    skillModalSearchEl,
    skillModalCloseEl,
    skillModalCloseTopEl,
    skillModalBackdropCloseEl,
  } = elements;

  const runSkillMarketSearch = async () => {
    settingsState.skillSearchQuery = String(settingsState.skillSearchDraft || "").trim();
    settingsState.skillSearchFilters = helpers.normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft);
    settingsState.skillSearchExecuted = true;
    settingsState.skillSearchLoading = true;
    settingsState.skillSearchError = "";
    settingsState.skillSearchResults = [];
    const requestSeq = settingsState.skillSearchRequestSeq + 1;
    settingsState.skillSearchRequestSeq = requestSeq;
    renderSkillMarketModalResults(context);
    const result = await helpers.searchClawHubSkillsWithFallback(
      settingsState.skillSearchQuery,
      settingsState.skillSearchFilters
    );
    if (settingsState.skillSearchRequestSeq !== requestSeq) return;
    settingsState.skillSearchLoading = false;
    settingsState.skillSearchResults = result.items;
    renderSkillMarketModalResults(context);
  };

  const closeSkillMarketModal = () => {
    settingsState.skillMarketModalOpen = false;
    settingsState.skillSearchDraft = "";
    settingsState.skillSearchQuery = "";
    settingsState.skillSearchExecuted = false;
    settingsState.skillSearchFilters = { ...helpers.DEFAULT_SKILL_SEARCH_FILTERS };
    settingsState.skillSearchFilterDraft = { ...helpers.DEFAULT_SKILL_SEARCH_FILTERS };
    settingsState.skillSearchResults = [];
    settingsState.skillSearchLoading = false;
    settingsState.skillSearchError = "";
    settingsState.skillSearchRequestSeq += 1;
    renderSettingsTab();
  };

  if (skillMarketOpenModalEl) {
    skillMarketOpenModalEl.addEventListener("click", () => {
      settingsState.skillSearchDraft = "";
      settingsState.skillSearchQuery = "";
      settingsState.skillSearchExecuted = false;
      settingsState.skillSearchFilters = { ...helpers.DEFAULT_SKILL_SEARCH_FILTERS };
      settingsState.skillSearchFilterDraft = { ...helpers.DEFAULT_SKILL_SEARCH_FILTERS };
      settingsState.skillSearchResults = [];
      settingsState.skillSearchLoading = false;
      settingsState.skillSearchError = "";
      settingsState.skillSearchRequestSeq += 1;
      settingsState.skillMarketModalOpen = true;
      renderSettingsTab();
    });
  }
  if (skillModalKeywordEl) {
    skillModalKeywordEl.addEventListener("input", () => {
      settingsState.skillSearchDraft = skillModalKeywordEl.value;
    });
  }
  if (skillModalSortEl) {
    skillModalSortEl.addEventListener("change", () => {
      settingsState.skillSearchFilterDraft = {
        ...helpers.normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
        sortBy: helpers.normalizeSkillMarketSortBy(skillModalSortEl.value),
      };
    });
  }
  if (skillModalNonSuspiciousEl) {
    skillModalNonSuspiciousEl.addEventListener("change", () => {
      settingsState.skillSearchFilterDraft = {
        ...helpers.normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
        nonSuspiciousOnly: skillModalNonSuspiciousEl.checked,
      };
    });
  }
  if (skillModalHighlightedOnlyEl) {
    skillModalHighlightedOnlyEl.addEventListener("change", () => {
      settingsState.skillSearchFilterDraft = {
        ...helpers.normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
        highlightedOnly: skillModalHighlightedOnlyEl.checked,
      };
    });
  }
  if (skillModalSearchEl) {
    skillModalSearchEl.addEventListener("click", () => {
      void runSkillMarketSearch();
    });
  }
  if (skillModalCloseEl) {
    skillModalCloseEl.addEventListener("click", closeSkillMarketModal);
  }
  if (skillModalCloseTopEl) {
    skillModalCloseTopEl.addEventListener("click", closeSkillMarketModal);
  }
  if (skillModalBackdropCloseEl) {
    skillModalBackdropCloseEl.addEventListener("click", closeSkillMarketModal);
  }
}

global.SettingsTabSkillModalUi = {
  buildSkillMarketPreviewList,
  buildSkillMarketModalResultsHtml,
  bindSkillLinkHandlers,
  bindSkillMarketInstallHandlers,
  renderSkillMarketModalResults,
  bindSkillMarketControls,
};
})(window);
