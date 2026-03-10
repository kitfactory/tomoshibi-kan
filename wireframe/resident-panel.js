(function (global) {
function settingsTabUi() {
  return global.SettingsTabUi || {};
}

function palStatusBadgeClass(status) {
  if (status === "paused") return "status-badge-attn";
  return "status-badge-muted";
}

function palAvatarFaceMarkup(role) {
  const normalizedRole = normalizePalRole(role);
  return `<span class="pal-avatar-face pal-avatar-face-${escapeHtml(normalizedRole)}" aria-hidden="true">
    <span class="pal-avatar-eye left"></span>
    <span class="pal-avatar-eye right"></span>
    <span class="pal-avatar-mouth"></span>
  </span>`;
}

function closePalConfigModal() {
  palConfigModalState.open = false;
  palConfigModalState.palId = "";
  const modal = document.getElementById("palConfigModal");
  if (modal) modal.classList.add("hidden");
}

function closeIdentityEditorModal() {
  identityEditorState.open = false;
  identityEditorState.palId = "";
  identityEditorState.fileKind = "soul";
  identityEditorState.loading = false;
  identityEditorState.saving = false;
  identityEditorState.text = "";
  identityEditorState.identity = null;
  const modal = document.getElementById("identityEditorModal");
  if (modal) modal.classList.add("hidden");
}

function openPalConfigModal(palId) {
  const normalizedPalId = normalizeText(palId);
  if (!normalizedPalId) return;
  const exists = palProfiles.some((pal) => pal.id === normalizedPalId);
  if (!exists) {
    setMessage("MSG-PPH-1004");
    return;
  }
  palConfigModalState.open = true;
  palConfigModalState.palId = normalizedPalId;
  renderPalList();
}

async function openIdentityEditorModal(palId, requestedFileKind) {
  const normalizedPalId = normalizeText(palId);
  const pal = palProfiles.find((item) => item.id === normalizedPalId);
  if (!pal) {
    setMessage("MSG-PPH-1004");
    return;
  }
  const secondary = settingsTabUi().resolveIdentitySecondaryDescriptor(pal.role);
  const fileKind = requestedFileKind === "soul" ? "soul" : secondary.fileKind;
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi) {
    setMessage("MSG-PPH-1003");
    return;
  }
  const requestSeq = identityEditorState.requestSeq + 1;
  identityEditorState.requestSeq = requestSeq;
  identityEditorState.open = true;
  identityEditorState.palId = normalizedPalId;
  identityEditorState.fileKind = fileKind;
  identityEditorState.loading = true;
  identityEditorState.saving = false;
  identityEditorState.text = "";
  identityEditorState.identity = null;
  renderIdentityEditorModal();
  try {
    const agentInput = settingsTabUi().resolveIdentityEditorAgentInput(pal);
    let identity = await identityApi.load(agentInput);
    if (!identity || !identity.hasIdentityFiles) {
      identity = await identityApi.save({
        ...agentInput,
        locale,
        initializeTemplates: true,
        enabledSkillIds: Array.isArray(pal.skills) ? pal.skills : [],
      });
    }
    if (identityEditorState.requestSeq !== requestSeq) return;
    identityEditorState.identity = identity;
    identityEditorState.text = fileKind === "soul"
      ? String(identity?.soul || "")
      : (fileKind === "rubric" ? String(identity?.rubric || "") : String(identity?.role || ""));
  } catch (error) {
    if (identityEditorState.requestSeq !== requestSeq) return;
    setMessage("MSG-PPH-1003");
  } finally {
    if (identityEditorState.requestSeq !== requestSeq) return;
    identityEditorState.loading = false;
    renderIdentityEditorModal();
  }
}

function renderIdentityEditorModal() {
  const modalEl = document.getElementById("identityEditorModal");
  const titleEl = document.getElementById("identityEditorTitle");
  const metaEl = document.getElementById("identityEditorMeta");
  const statusEl = document.getElementById("identityEditorStatus");
  const textareaEl = document.getElementById("identityEditorTextarea");
  const saveEl = document.getElementById("identityEditorSave");
  const cancelEl = document.getElementById("identityEditorCancel");
  if (!modalEl || !titleEl || !metaEl || !statusEl || !textareaEl || !saveEl || !cancelEl) return;

  const pal = palProfiles.find((item) => item.id === identityEditorState.palId) || null;
  if (!identityEditorState.open || !pal) {
    modalEl.classList.add("hidden");
    return;
  }

  const secondary = settingsTabUi().resolveIdentitySecondaryDescriptor(pal.role);
  const fileName = identityEditorState.fileKind === "soul" ? "SOUL.md" : secondary.fileName;
  const isJa = locale === "ja";
  titleEl.textContent = `${pal.displayName} / ${fileName}`;
  metaEl.textContent = isJa
    ? `${palRoleLabel(pal.role)} の ${fileName} を編集`
    : `Edit ${fileName} for ${palRoleLabel(pal.role)}`;
  statusEl.textContent = identityEditorState.loading
    ? (isJa ? "読み込み中..." : "Loading...")
    : (identityEditorState.saving ? (isJa ? "保存中..." : "Saving...") : "");
  textareaEl.value = identityEditorState.text;
  textareaEl.disabled = identityEditorState.loading || identityEditorState.saving;
  saveEl.textContent = isJa ? "保存" : "Save";
  cancelEl.textContent = isJa ? "キャンセル" : "Cancel";
  saveEl.disabled = identityEditorState.loading || identityEditorState.saving;
  cancelEl.disabled = identityEditorState.saving;

  textareaEl.oninput = () => {
    identityEditorState.text = textareaEl.value;
  };
  cancelEl.onclick = () => {
    closeIdentityEditorModal();
  };
  saveEl.onclick = async () => {
    if (identityEditorState.loading || identityEditorState.saving) return;
    const currentPal = palProfiles.find((item) => item.id === identityEditorState.palId) || null;
    const identityApi = resolveAgentIdentityApi();
    if (!currentPal || !identityApi) {
      setMessage("MSG-PPH-1003");
      return;
    }
    identityEditorState.saving = true;
    renderIdentityEditorModal();
    try {
      const currentIdentity = identityEditorState.identity || await identityApi.load(settingsTabUi().resolveIdentityEditorAgentInput(currentPal));
      const payload = {
        ...settingsTabUi().resolveIdentityEditorAgentInput(currentPal),
        locale,
        soul: identityEditorState.fileKind === "soul"
          ? identityEditorState.text
          : String(currentIdentity?.soul || ""),
        role: identityEditorState.fileKind === "role"
          ? identityEditorState.text
          : String(currentIdentity?.role || ""),
        rubric: identityEditorState.fileKind === "rubric"
          ? identityEditorState.text
          : String(currentIdentity?.rubric || ""),
        enabledSkillIds: Array.isArray(currentPal.skills) ? currentPal.skills : [],
      };
      const saved = await identityApi.save(payload);
      identityEditorState.identity = saved;
      identityEditorState.text = identityEditorState.fileKind === "soul"
        ? String(saved?.soul || "")
        : (identityEditorState.fileKind === "rubric" ? String(saved?.rubric || "") : String(saved?.role || ""));
      setMessage("MSG-PPH-0007");
      closeIdentityEditorModal();
    } catch (error) {
      setMessage("MSG-PPH-1003");
      identityEditorState.saving = false;
      renderIdentityEditorModal();
    }
  };

  modalEl.classList.remove("hidden");
}

function renderPalConfigModal({
  labels,
  availableModels,
  availableTools,
  availableSkills,
  hasModelOptions,
  hasToolOptions,
}) {
  const modalEl = document.getElementById("palConfigModal");
  const titleEl = document.getElementById("palConfigModalTitle");
  const bodyEl = document.getElementById("palConfigModalBody");
  const saveBtn = document.getElementById("palConfigSave");
  const deleteBtn = document.getElementById("palConfigDelete");
  if (!modalEl || !titleEl || !bodyEl || !saveBtn || !deleteBtn) return;

  saveBtn.textContent = labels.save;
  deleteBtn.textContent = labels.deletePal;

  const pal = palProfiles.find((item) => item.id === palConfigModalState.palId);
  if (!palConfigModalState.open || !pal) {
    modalEl.classList.add("hidden");
    bodyEl.innerHTML = "";
    titleEl.textContent = labels.modalTitleDefault;
    saveBtn.removeAttribute("data-pal-save-id");
    deleteBtn.removeAttribute("data-pal-delete-id");
    saveBtn.onclick = null;
    deleteBtn.onclick = null;
    return;
  }

  const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
  const selectedModel = hasModelOptions ? (pal.models[0] || availableModels[0] || "") : "";
  const selectedTool = hasToolOptions ? (pal.cliTools[0] || availableTools[0] || "") : "";
  const roleSelectableSkills = allowedSkillIdsForRole(pal.role)
    .filter((skillId) => availableSkills.includes(skillId));
  const hasRoleSkillOptions = roleSelectableSkills.length > 0;
  const selectedSkills = runtimeKind === "model" && Array.isArray(pal.skills)
    ? pal.skills
      .map((skillId) => normalizeSkillId(skillId))
      .filter((skillId) => roleSelectableSkills.includes(skillId))
    : [];

  const buildRuntimeTargetOptions = (kind, preferredValue = "") => {
    const source = kind === "model" ? availableModels : availableTools;
    const emptyLabel = kind === "model" ? labels.noModels : labels.noTools;
    const targetValue = source.includes(preferredValue) ? preferredValue : (source[0] || "");
    if (source.length === 0) {
      return {
        html: `<option value="" selected>${escapeHtml(emptyLabel)}</option>`,
        value: "",
      };
    }
    return {
      html: source
        .map((item) => `<option value="${escapeHtml(item)}"${item === targetValue ? " selected" : ""}>${escapeHtml(item)}</option>`)
        .join(""),
      value: targetValue,
    };
  };

  const runtimeTargetLabel = runtimeKind === "model"
    ? labels.runtimeTargetModel
    : labels.runtimeTargetTool;
  const runtimeTargetOptions = buildRuntimeTargetOptions(
    runtimeKind,
    runtimeKind === "model" ? selectedModel : selectedTool
  );
  const runtimeTargetDisabled = runtimeKind === "model"
    ? (!hasModelOptions ? " disabled" : "")
    : (!hasToolOptions ? " disabled" : "");

  const runtimeOptions = `<option value="model"${runtimeKind === "model" ? " selected" : ""}>${labels.runtimeModel}</option>
    <option value="tool"${runtimeKind === "tool" ? " selected" : ""}>${labels.runtimeTool}</option>`;

  const skillOptions = hasRoleSkillOptions
    ? roleSelectableSkills
      .map((skillId) => {
        const skill = skillById(skillId);
        const checked = selectedSkills.includes(skillId) ? " checked" : "";
        const disabled = runtimeKind === "model" ? "" : " disabled";
        const skillLabel = skill?.name || skillId;
        const skillDescription = skill?.description || "";
        return `<label class="pal-skill-item">
          <input type="checkbox" class="checkbox checkbox-sm" data-pal-skill-checkbox="${escapeHtml(pal.id)}" value="${escapeHtml(skillId)}"${checked}${disabled} />
          <span class="pal-skill-text">
            <span class="text-xs font-medium">${escapeHtml(skillLabel)}</span>
            <span class="text-[11px] text-base-content/55">${escapeHtml(skillDescription)}</span>
          </span>
        </label>`;
      })
      .join("")
    : `<span class="text-xs text-base-content/60">${escapeHtml(labels.noSkills)}</span>`;
  const secondaryIdentity = settingsTabUi().resolveIdentitySecondaryDescriptor(pal.role);
  const secondaryButtonLabel = `${labels.editSecondary} (${secondaryIdentity.label})`;

  titleEl.textContent = `${pal.displayName} / ${palRoleLabel(pal.role)}`;
  bodyEl.innerHTML = `<div class="pal-card">
    <div class="pal-category">
      <div class="pal-category-title">${labels.categoryName}</div>
      <label class="field">
        <span class="label-text text-xs text-base-content/70">${labels.name}</span>
        <input type="text" class="input input-bordered input-sm" data-pal-name-input="${escapeHtml(pal.id)}" value="${escapeHtml(pal.displayName)}" />
      </label>
    </div>

    <div class="pal-category">
      <div class="pal-category-title">${labels.categoryRuntime}</div>
      <div class="pal-runtime-row">
        <label class="field">
          <span class="label-text text-xs text-base-content/70">${labels.runtimeType}</span>
          <select class="select select-bordered select-sm" data-pal-runtime-select="${escapeHtml(pal.id)}">${runtimeOptions}</select>
        </label>
        <label class="field">
          <span id="palConfigRuntimeTargetLabel" class="label-text text-xs text-base-content/70">${escapeHtml(runtimeTargetLabel)}</span>
          <select class="select select-bordered select-sm" data-pal-runtime-target-select="${escapeHtml(pal.id)}"${runtimeTargetDisabled}>${runtimeTargetOptions.html}</select>
        </label>
      </div>
    </div>

    <div class="pal-category">
      <div class="pal-category-title">${labels.categorySkills}</div>
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs text-base-content/50">${escapeHtml(labels.skillsModelOnly)}</span>
      </div>
      <div class="pal-skill-grid">${skillOptions}</div>
    </div>

    <div class="pal-category">
      <div class="pal-category-title">${escapeHtml(labels.categoryIdentity)}</div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-sm btn-outline" data-pal-edit-identity="${escapeHtml(pal.id)}:soul">${escapeHtml(labels.editSoul)}</button>
        <button type="button" class="btn btn-sm btn-outline" data-pal-edit-identity="${escapeHtml(pal.id)}:${escapeHtml(secondaryIdentity.fileKind)}">${escapeHtml(secondaryButtonLabel)}</button>
      </div>
    </div>
  </div>`;

  const nameInput = bodyEl.querySelector(`[data-pal-name-input="${pal.id}"]`);
  const runtimeSelect = bodyEl.querySelector(`[data-pal-runtime-select="${pal.id}"]`);
  const runtimeTargetSelect = bodyEl.querySelector(`[data-pal-runtime-target-select="${pal.id}"]`);
  const runtimeTargetLabelEl = document.getElementById("palConfigRuntimeTargetLabel");
  const skillCheckboxes = bodyEl.querySelectorAll(`[data-pal-skill-checkbox="${pal.id}"]`);
  const identityButtons = bodyEl.querySelectorAll(`[data-pal-edit-identity^="${pal.id}:"]`);

  const applyRuntimeModeUi = () => {
    if (!runtimeSelect || !runtimeTargetSelect) return;
    const mode = normalizePalRuntimeKind(runtimeSelect.value);
    const nextLabel = mode === "model" ? labels.runtimeTargetModel : labels.runtimeTargetTool;
    const targetState = buildRuntimeTargetOptions(mode, runtimeTargetSelect.value);
    runtimeTargetSelect.innerHTML = targetState.html;
    runtimeTargetSelect.value = targetState.value;
    runtimeTargetSelect.disabled = mode === "model" ? !hasModelOptions : !hasToolOptions;
    if (runtimeTargetLabelEl) runtimeTargetLabelEl.textContent = nextLabel;

    const skillsDisabled = mode !== "model";
    skillCheckboxes.forEach((checkbox) => {
      if (skillsDisabled) checkbox.checked = false;
      checkbox.disabled = skillsDisabled;
    });
  };

  if (runtimeSelect) {
    runtimeSelect.onchange = () => {
      applyRuntimeModeUi();
    };
  }
  identityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const payload = normalizeText(button.getAttribute("data-pal-edit-identity"));
      const fileKind = payload.split(":")[1] || "soul";
      void openIdentityEditorModal(pal.id, fileKind);
    });
  });

  const canDelete = canDeletePalProfileWithFallback(pal.id);
  saveBtn.setAttribute("data-pal-save-id", pal.id);
  deleteBtn.setAttribute("data-pal-delete-id", pal.id);
  deleteBtn.disabled = !canDelete;
  deleteBtn.onclick = () => {
    if (!canDeletePalProfileWithFallback(pal.id)) {
      setMessage("MSG-PPH-1006");
      return;
    }
    const index = palProfiles.findIndex((item) => item.id === pal.id);
    if (index < 0) {
      setMessage("MSG-PPH-1004");
      return;
    }
    palProfiles.splice(index, 1);
    syncWorkspaceAgentSelection();
    writePalProfilesSnapshotWithFallback();
    setMessage("MSG-PPH-0007");
    closePalConfigModal();
    rerenderAll();
  };

  saveBtn.onclick = () => {
    const nextName = nameInput ? nameInput.value.trim() : "";
    const nextRuntime = runtimeSelect
      ? normalizePalRuntimeKind(runtimeSelect.value)
      : normalizePalRuntimeKind(pal.runtimeKind);
    const nextRuntimeTarget = runtimeTargetSelect ? runtimeTargetSelect.value : "";
    const requestedSkillIds = Array.from(skillCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => normalizeSkillId(checkbox.value))
      .filter((skillId, index, list) => skillId && list.indexOf(skillId) === index);

    if (!nextName) {
      setMessage("MSG-PPH-1001");
      return;
    }

    const runtimeResult = validatePalRuntimeSelectionWithFallback({
      runtimeKind: nextRuntime,
      runtimeTarget: nextRuntimeTarget,
      availableModels,
      availableTools,
      requestedSkillIds,
      allowedSkillIds: roleSelectableSkills,
    });
    if (!runtimeResult.ok) {
      setMessage(runtimeResult.errorCode || "MSG-PPH-1001");
      return;
    }

    const updatedPal = applyPalRuntimeSelectionWithFallback({
      pal,
      displayName: nextName,
      runtimeKind: runtimeResult.runtimeKind,
      runtimeResult,
      resolveProviderForModel: (modelName) =>
        settingsState.registeredModels.find((model) => model.name === modelName)?.provider || "",
    });
    Object.assign(pal, updatedPal);
    syncWorkspaceAgentSelection();
    writePalProfilesSnapshotWithFallback();

    setMessage("MSG-PPH-0007");
    closePalConfigModal();
    rerenderAll();
  };

  modalEl.classList.remove("hidden");
  applyRuntimeModeUi();
}

function renderPalList() {
  const ul = document.getElementById("palList");
  if (!ul) return;
  if (typeof settingsTabUi().syncSettingsModelsFromRegistry === "function") { settingsTabUi().syncSettingsModelsFromRegistry(); }
  if (typeof settingsTabUi().syncPalProfilesRegistryRefs === "function") { settingsTabUi().syncPalProfilesRegistryRefs(); }

  const availableModels = settingsState.registeredModels.map((model) => model.name);
  const availableTools = [...settingsState.registeredTools];
  const availableSkills = [...settingsState.registeredSkills];
  const hasModelOptions = availableModels.length > 0;
  const hasToolOptions = availableTools.length > 0;

  const labels = locale === "ja"
    ? {
      role: "タイプ",
      runtime: "使用ランタイム",
      runtimeModel: "Model",
      runtimeTool: "CLI",
      runtimeType: "実行方式",
      runtimeTargetModel: "LLMモデル",
      runtimeTargetTool: "CLIツール",
      categoryName: "名前",
      categoryRuntime: "Runtime",
      categorySkills: "Skills",
      categoryIdentity: "Identity Files",
      name: "表示名",
      save: "保存",
      addGuide: "Guideを追加",
      addGate: "Gateを追加",
      addPal: "Palを追加",
      setActiveGuide: "Guideに切替",
      setDefaultGate: "Gateに設定",
      activeGuideBadge: "Active Guide",
      defaultGateBadge: "Default Gate",
      editPal: "設定",
      editSoul: "SOULを編集",
      editSecondary: "補助ファイルを編集",
      deletePal: "削除",
      addHint: "Settingsで登録済みのLLMモデル / CLIツール / Skillsのみ利用できます",
      noModels: "利用可能なLLMモデルがありません",
      noTools: "利用可能なCLIツールがありません",
      noProfiles: "Palがありません。追加してください。",
      noSkills: "利用可能なSkillsがありません",
      noSkillsCompact: "スキルなし",
      skillsModelOnly: "Skillsはモデル実行時のみ有効です",
      modalTitleDefault: "Pal設定",
    }
    : {
      role: "Type",
      runtime: "Runtime",
      runtimeModel: "Model",
      runtimeTool: "CLI",
      runtimeType: "Runtime Type",
      runtimeTargetModel: "LLM Model",
      runtimeTargetTool: "CLI Tool",
      categoryName: "Name",
      categoryRuntime: "Runtime",
      categorySkills: "Skills",
      categoryIdentity: "Identity Files",
      name: "Name",
      save: "Save",
      addGuide: "Add Guide",
      addGate: "Add Gate",
      addPal: "住人を追加",
      setActiveGuide: "Use as Guide",
      setDefaultGate: "Use as Gate",
      activeGuideBadge: "Active Guide",
      defaultGateBadge: "Default Gate",
      editPal: "Settings",
      editSoul: "Edit SOUL",
      editSecondary: "Edit File",
      deletePal: "Delete",
      addHint: "Only models / CLI tools / skills registered in Settings can be used",
      noModels: "No LLM models available",
      noTools: "No CLI tools available",
      noProfiles: "住人プロフィールがありません。追加してください。",
      noSkills: "No skills available",
      noSkillsCompact: "No skills",
      skillsModelOnly: "Skills are enabled only in model runtime",
      modalTitleDefault: "住人設定",
    };

  const addDisabled = !hasModelOptions && !hasToolOptions;
  const toolbar = `<li class="pal-toolbar rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3">
    <div class="text-xs text-base-content/65">${labels.addHint}</div>
    <div class="flex flex-wrap gap-2 mt-2">
      <button type="button" id="palAddGuideProfile" class="btn btn-sm btn-outline"${addDisabled ? " disabled" : ""}>${labels.addGuide}</button>
      <button type="button" id="palAddGateProfile" class="btn btn-sm btn-outline"${addDisabled ? " disabled" : ""}>${labels.addGate}</button>
      <button type="button" id="palAddProfile" class="btn btn-sm btn-outline"${addDisabled ? " disabled" : ""}>${labels.addPal}</button>
    </div>
  </li>`;

  const bindAddProfileButtons = () => {
    const bindAdd = (selector, role) => {
      const button = ul.querySelector(selector);
      if (!button) return;
      button.addEventListener("click", async () => {
        if (!hasModelOptions && !hasToolOptions) {
          setMessage("MSG-PPH-1001");
          return;
        }
        const defaultModel = availableModels[0];
        const matchedModel = settingsState.registeredModels.find((model) => model.name === defaultModel);
        const defaultProvider = matchedModel?.provider || DEFAULT_PROVIDER_ID;
        const roleAllowedSkills = allowedSkillIdsForRole(role)
          .filter((skillId) => availableSkills.includes(skillId));
        const nextProfile = createPalProfileWithFallback({
          id: settingsTabUi().createPalIdForRole(role),
          role,
          availableModels,
          availableTools,
          roleAllowedSkills,
          availableSkills,
          defaultProvider,
          displayName: role === "guide" ? "New Guide" : (role === "gate" ? "New Gate" : "新しい住人"),
        });
        palProfiles.push(nextProfile);
        syncWorkspaceAgentSelection();
        if (role === "guide" && !workspaceAgentSelection.activeGuideId) {
          workspaceAgentSelection.activeGuideId = nextProfile.id;
        }
        if (role === "gate" && !workspaceAgentSelection.defaultGateId) {
          workspaceAgentSelection.defaultGateId = nextProfile.id;
        }
        try {
          await initializePalIdentityTemplates(nextProfile);
        } catch (error) {
          setMessage("MSG-PPH-1003");
        }
        writePalProfilesSnapshotWithFallback();
        setMessage("MSG-PPH-0007");
        openPalConfigModal(nextProfile.id);
      });
    };

    bindAdd("#palAddGuideProfile", "guide");
    bindAdd("#palAddGateProfile", "gate");
    bindAdd("#palAddProfile", "worker");
  };

  const activeGuideId = workspaceAgentSelection.activeGuideId;
  const defaultGateId = workspaceAgentSelection.defaultGateId;

  if (palProfiles.length === 0) {
    ul.innerHTML = `${toolbar}
      <li id="palEmpty" class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${labels.noProfiles}</li>`;
    bindAddProfileButtons();
    renderPalConfigModal({
      labels,
      availableModels,
      availableTools,
      availableSkills,
      hasModelOptions,
      hasToolOptions,
    });
    return;
  }

  const cards = palProfiles
    .map((pal) => {
      const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
      const selectedModel = hasModelOptions ? (pal.models[0] || availableModels[0]) : "";
      const selectedTool = hasToolOptions ? (pal.cliTools[0] || availableTools[0]) : "";
      const roleSelectableSkills = allowedSkillIdsForRole(pal.role)
        .filter((skillId) => availableSkills.includes(skillId));
      const runtimeTargetValue = runtimeKind === "model" ? selectedModel : selectedTool;

      const selectedSkills = runtimeKind === "model" && Array.isArray(pal.skills)
        ? pal.skills
          .map((skillId) => normalizeSkillId(skillId))
          .filter((skillId) => roleSelectableSkills.includes(skillId))
        : [];

      const runtimeLabel = runtimeKind === "model" ? labels.runtimeModel : labels.runtimeTool;
      const runtimeSummary = runtimeTargetValue
        ? `${runtimeLabel}: ${runtimeTargetValue}`
        : `${runtimeLabel}: -`;
      const skillBadges = selectedSkills.length > 0
        ? selectedSkills
          .map((skillId) => {
            const skillLabel = skillName(skillId);
            return `<span class="badge badge-neutral badge-sm">${escapeHtml(skillLabel)}</span>`;
          })
          .join("")
        : `<span class="badge badge-ghost badge-sm">${escapeHtml(labels.noSkillsCompact)}</span>`;
      const isActiveGuide = pal.role === "guide" && pal.id === activeGuideId;
      const isDefaultGate = pal.role === "gate" && pal.id === defaultGateId;
      const selectionBadge = isActiveGuide
        ? `<span class="badge badge-primary badge-sm">${escapeHtml(labels.activeGuideBadge)}</span>`
        : (isDefaultGate
          ? `<span class="badge badge-primary badge-sm">${escapeHtml(labels.defaultGateBadge)}</span>`
          : "");
      const selectionButton = pal.role === "guide"
        ? `<button type="button" class="btn btn-xs btn-ghost"${isActiveGuide ? " disabled" : ""} data-pal-set-active-guide-id="${escapeHtml(pal.id)}">${escapeHtml(labels.setActiveGuide)}</button>`
        : (pal.role === "gate"
          ? `<button type="button" class="btn btn-xs btn-ghost"${isDefaultGate ? " disabled" : ""} data-pal-set-default-gate-id="${escapeHtml(pal.id)}">${escapeHtml(labels.setDefaultGate)}</button>`
          : "");

      return `<li data-pal-row="${escapeHtml(pal.id)}" data-pal-role="${escapeHtml(pal.role)}" data-guide-active="${isActiveGuide ? "true" : "false"}" data-gate-default="${isDefaultGate ? "true" : "false"}" data-pal-open-id="${escapeHtml(pal.id)}" tabindex="0" role="button" class="rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3 pal-card pal-compact-row">
        <div class="pal-compact-main">
          ${palAvatarFaceMarkup(pal.role)}
          <div class="pal-compact-meta">
            <div class="pal-compact-top">
              <span class="font-semibold">${escapeHtml(pal.displayName)}</span>
              <span class="badge badge-outline badge-sm">${escapeHtml(palRoleLabel(pal.role))}</span>
              <span class="badge ${palStatusBadgeClass(pal.status)} badge-sm">${escapeHtml(pal.status)}</span>
              ${selectionBadge}
            </div>
            <div data-pal-runtime-summary="${escapeHtml(pal.id)}" class="text-xs text-base-content/65">${labels.runtime}: ${escapeHtml(runtimeSummary)}</div>
            <div data-pal-skills-summary="${escapeHtml(pal.id)}" class="pal-models">${skillBadges}</div>
          </div>
        </div>
        <div class="flex flex-wrap justify-end gap-2">
          ${selectionButton}
          <button type="button" class="btn btn-xs btn-outline" data-pal-open-id="${escapeHtml(pal.id)}">${labels.editPal}</button>
        </div>
      </li>`;
    })
    .join("");

  ul.innerHTML = `${toolbar}${cards}`;
  bindAddProfileButtons();

  ul.onclick = (event) => {
    const setGuideTrigger = event.target.closest("[data-pal-set-active-guide-id]");
    if (setGuideTrigger) {
      const palId = normalizeText(setGuideTrigger.getAttribute("data-pal-set-active-guide-id"));
      if (!palId) return;
      workspaceAgentSelection.activeGuideId = palId;
      writePalProfilesSnapshotWithFallback();
      rerenderAll();
      return;
    }
    const setGateTrigger = event.target.closest("[data-pal-set-default-gate-id]");
    if (setGateTrigger) {
      const palId = normalizeText(setGateTrigger.getAttribute("data-pal-set-default-gate-id"));
      if (!palId) return;
      workspaceAgentSelection.defaultGateId = palId;
      writePalProfilesSnapshotWithFallback();
      rerenderAll();
      return;
    }
    const trigger = event.target.closest("[data-pal-open-id]");
    if (!trigger) return;
    const palId = normalizeText(trigger.getAttribute("data-pal-open-id"));
    if (!palId) return;
    openPalConfigModal(palId);
  };

  ul.onkeydown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest("[data-pal-row][data-pal-open-id]");
    if (!row) return;
    event.preventDefault();
    const palId = normalizeText(row.getAttribute("data-pal-open-id"));
    if (!palId) return;
    openPalConfigModal(palId);
  };

  renderPalConfigModal({
    labels,
    availableModels,
    availableTools,
    availableSkills,
    hasModelOptions,
    hasToolOptions,
  });
}



  global.ResidentPanelUi = {
    palStatusBadgeClass,
    palAvatarFaceMarkup,
    closePalConfigModal,
    closeIdentityEditorModal,
    openPalConfigModal,
    openIdentityEditorModal,
    renderIdentityEditorModal,
    renderPalConfigModal,
    renderPalList,
  };
})(window);