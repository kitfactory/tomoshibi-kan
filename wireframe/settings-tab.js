(function (global) {
function workspaceShellUi() {
  return global.WorkspaceShellUi || {};
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

function syncPalProfilesRegistryRefs() {
  const availableModels = settingsState.registeredModels.map((model) => model.name);
  const availableTools = [...settingsState.registeredTools];
  const availableSkills = [...settingsState.registeredSkills];
  const fallbackModel = availableModels[0] || "";
  const fallbackTool = availableTools[0] || "";

  palProfiles.forEach((pal, index) => {
    pal.role = normalizePalRole(pal.role);
    pal.runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
    pal.displayName = String(pal.displayName || "").trim() || `Pal ${index + 1}`;
    const roleAllowedSkills = allowedSkillIdsForRole(pal.role)
      .filter((skillId) => availableSkills.includes(skillId));
    const nextModels = Array.isArray(pal.models)
      ? pal.models.filter((model) => availableModels.includes(model))
      : [];
    const nextTools = Array.isArray(pal.cliTools)
      ? pal.cliTools
        .map((tool) => normalizeToolName(tool))
        .filter((tool) => availableTools.includes(tool))
      : [];
    const nextSkills = Array.isArray(pal.skills)
      ? pal.skills
        .map((skillId) => normalizeSkillId(skillId))
        .filter((skillId) => roleAllowedSkills.includes(skillId))
      : [];

    if (pal.runtimeKind === "tool") {
      pal.models = [];
      pal.cliTools = nextTools.length > 0
        ? [nextTools[0]]
        : (fallbackTool ? [fallbackTool] : []);
      pal.skills = [];
      if (pal.cliTools.length === 0 && fallbackModel) {
        pal.runtimeKind = "model";
        pal.models = [fallbackModel];
        pal.skills = [...roleAllowedSkills];
      }
    } else {
      pal.cliTools = [];
      pal.models = nextModels.length > 0
        ? [nextModels[0]]
        : (fallbackModel ? [fallbackModel] : []);
      pal.skills = nextSkills;
      if (pal.models.length === 0 && fallbackTool) {
        pal.runtimeKind = "tool";
        pal.cliTools = [fallbackTool];
        pal.skills = [];
      }
    }
    const primaryModel = settingsState.registeredModels.find((model) => model.name === pal.models[0]);
    pal.provider = primaryModel?.provider || "";
  });
  syncWorkspaceAgentSelection();
}

function createWorkerPalId() {
  let index = 1;
  while (true) {
    const candidate = `pal-worker-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
}

function createGuidePalId() {
  let index = 1;
  while (true) {
    const candidate = `guide-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
}

function createGatePalId() {
  let index = 1;
  while (true) {
    const candidate = `gate-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
}

function createPalIdForRole(role) {
  const normalizedRole = normalizePalRole(role);
  if (normalizedRole === "guide") return createGuidePalId();
  if (normalizedRole === "gate") return createGatePalId();
  return createWorkerPalId();
}

function getActiveGuideProfile() {
  return palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId) || null;
}

function getDefaultGateProfile() {
  return palProfiles.find((pal) => pal.id === workspaceAgentSelection.defaultGateId) || null;
}

function resolveIdentitySecondaryDescriptor(role) {
  const normalizedRole = normalizePalRole(role);
  if (normalizedRole === "gate") {
    return {
      fileKind: "rubric",
      fileName: "RUBRIC.md",
      label: "RUBRIC",
    };
  }
  return {
    fileKind: "role",
    fileName: "ROLE.md",
    label: "ROLE",
  };
}

function resolveIdentityEditorAgentInput(pal) {
  const role = normalizePalRole(pal?.role);
  const agentType = role === "worker" ? "worker" : role;
  return {
    agentType,
    agentId: normalizeText(pal?.id),
  };
}

function getGateProfileById(gateProfileId) {
  const normalizedId = normalizeText(gateProfileId);
  if (!normalizedId) return null;
  const gate = palProfiles.find((pal) => (
    normalizePalRole(pal.role) === "gate" && pal.id === normalizedId
  )) || null;
  return gate;
}

function resolveGateProfileForTarget(target) {
  const explicitGate = getGateProfileById(target?.gateProfileId);
  if (explicitGate) return explicitGate;
  return getDefaultGateProfile();
}

async function resolveGateRoutingProfiles() {
  const gates = palProfiles.filter((pal) => normalizePalRole(pal.role) === "gate");
  if (gates.length === 0) return [];
  const profiles = await Promise.all(gates.map(async (pal) => {
    const identity = await loadAgentIdentityForPal(pal);
    return {
      id: pal.id,
      displayName: pal.displayName || pal.id,
      persona: pal.persona || "",
      status: normalizeText(pal.status || "active"),
      soulText: normalizeText(identity?.soul),
      rubricText: normalizeText(identity?.rubric),
    };
  }));
  return profiles;
}

async function resolveGateProfileForTargetWithRouting(target) {
  const explicitGate = getGateProfileById(target?.gateProfileId);
  if (explicitGate) {
    return { gate: explicitGate, explanation: { matchedRubricTerms: [] } };
  }
  const routingApi = resolveAgentRoutingApi();
  if (!routingApi || typeof routingApi.selectGateForTarget !== "function") {
    return { gate: getDefaultGateProfile(), explanation: { matchedRubricTerms: [] } };
  }
  const routingProfiles = await resolveGateRoutingProfiles();
  if (routingProfiles.length === 0) {
    return { gate: getDefaultGateProfile(), explanation: { matchedRubricTerms: [] } };
  }
  const selected = routingApi.selectGateForTarget({
    target: {
      title: normalizeText(target?.title),
      instruction: normalizeText(target?.description || target?.instruction),
      expectedOutput: buildWorkerExpectedOutput(target?.schedule ? "job" : "task"),
      submission: normalizeText(target?.evidence),
      evidence: normalizeText(target?.evidence),
      replay: normalizeText(target?.replay),
      fixes: Array.isArray(target?.gateResult?.fixes) ? target.gateResult.fixes : parseGateFixes(target?.fixCondition),
    },
    gates: routingProfiles,
    defaultGateId: workspaceAgentSelection.defaultGateId,
  });
  return {
    gate: getGateProfileById(selected?.gateId) || getDefaultGateProfile(),
    explanation: {
      matchedRubricTerms: Array.isArray(selected?.matchedRubricTerms) ? selected.matchedRubricTerms : [],
      matchedReviewFocusTerms: Array.isArray(selected?.matchedReviewFocusTerms) ? selected.matchedReviewFocusTerms : [],
    },
  };
}

function assignGateProfileToTarget(target, preferredGateId = "") {
  if (!target || typeof target !== "object") return null;
  const explicitGate = getGateProfileById(preferredGateId);
  const resolvedGate = explicitGate || resolveGateProfileForTarget(target);
  target.gateProfileId = normalizeText(resolvedGate?.id);
  return resolvedGate;
}

async function assignGateProfileToTargetWithRouting(target, preferredGateId = "") {
  if (!target || typeof target !== "object") return null;
  const explicitGate = getGateProfileById(preferredGateId);
  const routed = explicitGate
    ? { gate: explicitGate, explanation: { matchedRubricTerms: [] } }
    : await resolveGateProfileForTargetWithRouting(target);
  const resolvedGate = routed?.gate || null;
  target.gateProfileId = normalizeText(resolvedGate?.id);
  return {
    gate: resolvedGate,
    explanation: routed?.explanation || { matchedRubricTerms: [] },
  };
}

function gateProfileSummaryText(target) {
  const gate = resolveGateProfileForTarget(target);
  if (!gate) {
    return `${tDyn("gateProfile")}: -`;
  }
  return `${tDyn("gateProfile")}: ${gate.displayName || gate.id}`;
}

function senderLabel(sender) {
  if (sender === "guide") return tDyn("senderGuide");
  if (sender === "you") return tDyn("senderYou");
  if (sender === "system") return tDyn("senderSystem");
  return sender;
}

function formatNow() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

function resolveProgressLogApi() {
  if (window.TomoshibikanProgressLog && typeof window.TomoshibikanProgressLog === "object") {
    return window.TomoshibikanProgressLog;
  }
  if (window.PalpalProgressLog && typeof window.PalpalProgressLog === "object") {
    return window.PalpalProgressLog;
  }
  return null;
}

function resolvePlanArtifactApi() {
  if (window.TomoshibikanPlanArtifacts && typeof window.TomoshibikanPlanArtifacts === "object") {
    return window.TomoshibikanPlanArtifacts;
  }
  if (window.PalpalPlanArtifacts && typeof window.PalpalPlanArtifacts === "object") {
    return window.PalpalPlanArtifacts;
  }
  return null;
}

function appendTaskProgressLogEntryLocal(payload) {
  const entry = {
    entryId: normalizeText(payload?.entryId) || `progress-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: normalizeText(payload?.createdAt) || new Date().toISOString(),
    planId: normalizeText(payload?.planId),
    targetKind: normalizeText(payload?.targetKind),
    targetId: normalizeText(payload?.targetId),
    actionType: normalizeText(payload?.actionType),
    status: normalizeText(payload?.status) || "ok",
    actualActor: normalizeText(payload?.actualActor) || "orchestrator",
    displayActor: normalizeText(payload?.displayActor) || "Guide",
    messageForUser: normalizeText(payload?.messageForUser),
    payload: payload?.payload && typeof payload.payload === "object" ? payload.payload : {},
    sourceRunId: normalizeText(payload?.sourceRunId),
  };
  progressLogEntries.unshift(entry);
  progressLogEntries = progressLogEntries.slice(0, 200);
  return entry;
}

async function appendTaskProgressLogEntryWithFallback(payload) {
  const api = resolveProgressLogApi();
  if (api && typeof api.append === "function") {
    return api.append(payload);
  }
  return appendTaskProgressLogEntryLocal(payload);
}

async function listTaskProgressLogEntriesWithFallback(options = {}) {
  const api = resolveProgressLogApi();
  if (api && typeof api.list === "function") {
    return api.list(options);
  }
  const targetKind = normalizeText(options.targetKind);
  const targetId = normalizeText(options.targetId);
  const planId = normalizeText(options.planId);
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 50;
  return progressLogEntries
    .filter((entry) => (!targetKind || entry.targetKind === targetKind))
    .filter((entry) => (!targetId || entry.targetId === targetId))
    .filter((entry) => (!planId || entry.planId === planId))
    .slice(0, limit);
}

async function getLatestTaskProgressLogEntryWithFallback(options = {}) {
  const api = resolveProgressLogApi();
  if (api && typeof api.latest === "function") {
    return api.latest(options);
  }
  const rows = await listTaskProgressLogEntriesWithFallback({ ...options, limit: 1 });
  return rows[0] || null;
}

function appendPlanArtifactLocal(payload) {
  const entry = {
    planId: normalizeText(payload?.planId) || `PLAN-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase(),
    createdAt: normalizeText(payload?.createdAt) || new Date().toISOString(),
    status: normalizeText(payload?.status) || "approved",
    replyText: normalizeText(payload?.replyText),
    plan: payload?.plan && typeof payload.plan === "object" ? payload.plan : {},
    sourceRunId: normalizeText(payload?.sourceRunId),
    approvedAt: normalizeText(payload?.approvedAt) || new Date().toISOString(),
  };
  planArtifacts.unshift(entry);
  planArtifacts = planArtifacts.slice(0, 50);
  return entry;
}

function updatePlanArtifactLocal(planId, patch = {}) {
  const normalizedPlanId = normalizeText(planId);
  if (!normalizedPlanId) return null;
  const index = planArtifacts.findIndex((entry) => normalizeText(entry?.planId) === normalizedPlanId);
  if (index < 0) return null;
  const current = planArtifacts[index];
  const next = {
    ...current,
    status: Object.prototype.hasOwnProperty.call(patch || {}, "status")
      ? normalizeText(patch?.status) || current.status
      : current.status,
    replyText: Object.prototype.hasOwnProperty.call(patch || {}, "replyText")
      ? normalizeText(patch?.replyText)
      : current.replyText,
    plan: Object.prototype.hasOwnProperty.call(patch || {}, "plan")
      ? (patch?.plan && typeof patch.plan === "object" ? patch.plan : {})
      : current.plan,
    sourceRunId: Object.prototype.hasOwnProperty.call(patch || {}, "sourceRunId")
      ? normalizeText(patch?.sourceRunId)
      : current.sourceRunId,
    approvedAt: Object.prototype.hasOwnProperty.call(patch || {}, "approvedAt")
      ? normalizeText(patch?.approvedAt)
      : (normalizeText(current.approvedAt) || (normalizeText(patch?.status) === "approved" ? new Date().toISOString() : "")),
  };
  planArtifacts[index] = next;
  return next;
}

async function appendPlanArtifactWithFallback(payload) {
  const api = resolvePlanArtifactApi();
  if (api && typeof api.append === "function") {
    return api.append(payload);
  }
  return appendPlanArtifactLocal(payload);
}

async function updatePlanArtifactWithFallback(planId, patch = {}) {
  const api = resolvePlanArtifactApi();
  if (api && typeof api.update === "function") {
    return api.update(planId, patch);
  }
  return updatePlanArtifactLocal(planId, patch);
}

async function listPlanArtifactsWithFallback(options = {}) {
  const api = resolvePlanArtifactApi();
  if (api && typeof api.list === "function") {
    return api.list(options);
  }
  const status = normalizeText(options.status);
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 50;
  return planArtifacts
    .filter((entry) => (!status || entry.status === status))
    .slice(0, limit);
}

async function getLatestPlanArtifactWithFallback(options = {}) {
  const api = resolvePlanArtifactApi();
  if (api && typeof api.latest === "function") {
    return api.latest(options);
  }
  const rows = await listPlanArtifactsWithFallback({ ...options, limit: 1 });
  return rows[0] || null;
}

async function findPlanArtifactByIdWithFallback(planId) {
  const normalizedPlanId = normalizeText(planId);
  if (!normalizedPlanId) return null;
  const rows = await listPlanArtifactsWithFallback({ limit: 50 });
  return rows.find((entry) => normalizeText(entry?.planId) === normalizedPlanId) || null;
}

if (typeof window !== "undefined" && (!window.TomoshibikanPlanArtifacts || typeof window.TomoshibikanPlanArtifacts !== "object")) {
  const fallbackPlanArtifactApi = {
    append: (payload) => appendPlanArtifactLocal(payload),
    update: (planId, patch = {}) => updatePlanArtifactLocal(planId, patch),
    list: (options = {}) => {
      const status = normalizeText(options.status);
      const limit = Number(options.limit) > 0 ? Number(options.limit) : 50;
      return planArtifacts
        .filter((entry) => (!status || entry.status === status))
        .slice(0, limit);
    },
    latest: (options = {}) => {
      const rows = fallbackPlanArtifactApi.list({ ...options, limit: 1 });
      return rows[0] || null;
    },
  };
  window.TomoshibikanPlanArtifacts = fallbackPlanArtifactApi;
  if (!window.PalpalPlanArtifacts || typeof window.PalpalPlanArtifacts !== "object") {
    window.PalpalPlanArtifacts = fallbackPlanArtifactApi;
  }
}

function appendEvent(type, targetId, result, summaryJa, summaryEn) {
  events.unshift(
    makeEvent(type, targetId, result, { ja: summaryJa, en: summaryEn }, formatNow().slice(11))
  );
  events = events.slice(0, 50);
  eventPage = 1;
}

function appendTaskProgressLogForTarget(targetKind, targetId, actionType, options = {}) {
  const messageForUser = locale === "ja"
    ? normalizeText(options.messageJa)
    : normalizeText(options.messageEn || options.messageJa);
  return appendTaskProgressLogEntryWithFallback({
    planId: normalizeText(options.planId || "PLAN-001"),
    targetKind,
    targetId,
    actionType,
    status: normalizeText(options.status || "ok"),
    actualActor: normalizeText(options.actualActor || "orchestrator"),
    displayActor: normalizeText(options.displayActor || "Guide"),
    messageForUser,
    payload: options.payload && typeof options.payload === "object" ? options.payload : {},
    sourceRunId: normalizeText(options.sourceRunId),
  });
}

function resolveTargetPlanId(target) {
  return normalizeText(target?.planId) || "PLAN-001";
}

function formatWorkerRoutingExplanation(explanation) {
  const matchedSkills = Array.isArray(explanation?.matchedSkills)
    ? explanation.matchedSkills.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedResidentFocus = Array.isArray(explanation?.matchedResidentFocus)
    ? explanation.matchedResidentFocus.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedPreferredOutputs = Array.isArray(explanation?.matchedPreferredOutputs)
    ? explanation.matchedPreferredOutputs.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedRoleTerms = Array.isArray(explanation?.matchedRoleTerms)
    ? explanation.matchedRoleTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const parts = [];
  if (matchedSkills.length > 0) {
    parts.push(`skills=${matchedSkills.join(",")}`);
  }
  if (matchedResidentFocus.length > 0) {
    parts.push(`focus=${matchedResidentFocus.join(",")}`);
  }
  if (matchedPreferredOutputs.length > 0) {
    parts.push(`outputs=${matchedPreferredOutputs.join(",")}`);
  }
  if (matchedRoleTerms.length > 0) {
    parts.push(`ROLE=${matchedRoleTerms.join(",")}`);
  }
  return {
    ja: parts.join(" / "),
    en: parts.join(" / "),
  };
}

function formatGateRoutingExplanation(explanation) {
  const matchedRubricTerms = Array.isArray(explanation?.matchedRubricTerms)
    ? explanation.matchedRubricTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedReviewFocusTerms = Array.isArray(explanation?.matchedReviewFocusTerms)
    ? explanation.matchedReviewFocusTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const gateTerms = matchedRubricTerms.length > 0 ? matchedRubricTerms : matchedReviewFocusTerms;
  const text = gateTerms.length > 0
    ? `RUBRIC=${gateTerms.join(",")}`
    : "";
  return {
    ja: text,
    en: text,
  };
}

function messageText(id) {
  const data = MESSAGE_TEXT[id];
  if (!data) return id;
  return data[locale] || data.ja || data.en || id;
}

function isErrorMessageId(id) {
  return /^MSG-PPH-1\d{3}$/.test(String(id || ""));
}

function hideErrorToast() {
  const toast = document.getElementById("errorToast");
  if (!toast) return;
  if (errorToastTimer) {
    window.clearTimeout(errorToastTimer);
    errorToastTimer = null;
  }
  toast.classList.remove("is-visible");
  window.setTimeout(() => {
    if (!toast.classList.contains("is-visible")) {
      toast.hidden = true;
    }
  }, 220);
}

function showErrorToast(id, text) {
  const toast = document.getElementById("errorToast");
  if (!toast) return;
  const titleEl = document.getElementById("errorToastTitle");
  const codeEl = document.getElementById("errorToastCode");
  const textEl = document.getElementById("errorToastText");
  const closeEl = document.getElementById("errorToastClose");
  if (titleEl) titleEl.textContent = tDyn("errorToastTitle");
  if (codeEl) codeEl.textContent = id;
  if (textEl) textEl.textContent = text;
  if (closeEl) closeEl.setAttribute("aria-label", tDyn("errorToastClose"));
  toast.hidden = false;
  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });
  if (errorToastTimer) window.clearTimeout(errorToastTimer);
  errorToastTimer = window.setTimeout(() => {
    hideErrorToast();
  }, 4600);
}

function setMessage(id) {
  if (!id) return;
  messageId = id;
  const text = messageText(id);
  if (isErrorMessageId(id)) {
    showErrorToast(id, text);
    return;
  }
  hideErrorToast();
}

function resolveBoardTargetRecord(targetKind, targetId) {
  if (targetKind === "job") {
    return jobs.find((job) => job.id === targetId) || null;
  }
  if (targetKind === "task") {
    return tasks.find((task) => task.id === targetId) || null;
  }
  return null;
}

function shouldRequireReplanFromGateResult(gateResult) {
  const decision = normalizeText(gateResult?.decision);
  if (decision !== "rejected") return false;
  const reason = normalizeText(gateResult?.reason).toLowerCase();
  const fixCondition = normalizeText(gateResult?.fixCondition).toLowerCase();
  const fixes = Array.isArray(gateResult?.fixes)
    ? gateResult.fixes.map((item) => normalizeText(item).toLowerCase()).filter(Boolean)
    : [];
  const haystacks = [reason, fixCondition, ...fixes].filter(Boolean);
  if (haystacks.length === 0) return false;
  const keywords = [
    "再計画",
    "再プラン",
    "進め方",
    "方針",
    "前提",
    "要件",
    "スコープ",
    "plan",
    "replan",
    "scope",
    "requirement",
    "requirements",
    "assumption",
    "approach",
  ];
  return haystacks.some((text) => keywords.some((keyword) => text.includes(keyword)));
}


function buildGuideModelFailedPrompt() {
  return {
    ja: "Guideモデルの応答取得に失敗しました。Settings の接続設定を確認してください。",
    en: "Failed to get response from Guide model. Check model settings and connectivity.",
  };
}


function syncPalProfilesFromSettings() {
  syncSettingsModelsFromRegistry();
  syncPalProfilesRegistryRefs();
  bindGuideToFirstRegisteredModelWithFallback();
  renderPalList();
}

function renderSettingsTab() {
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
  const getUninstalledSkillMarketItems = () => {
    const installedSkillIds = new Set(
      settingsState.registeredSkills
        .map((skillId) => normalizeSkillId(skillId))
        .filter(Boolean)
    );
    return CLAWHUB_SKILL_REGISTRY
      .filter((skill) => !installedSkillIds.has(normalizeSkillId(skill.id)));
  };

  const isInstalledStandardSkill = (skillId) => {
    const normalized = normalizeSkillId(skillId);
    if (!normalized) return false;
    return settingsState.registeredSkills.includes(normalized);
  };

  const buildSkillMarketModalResultsHtml = () => {
    if (!settingsState.skillSearchExecuted) {
      return `<li id="settingsSkillModalIdle" class="text-xs text-base-content/60">${escapeHtml(skillSearchIdleLabel)}</li>`;
    }
    if (settingsState.skillSearchLoading) {
      return `<li id="settingsSkillModalLoading" class="text-xs text-base-content/60">${escapeHtml(skillSearchLoadingLabel)}</li>`;
    }
    const sourceResults = Array.isArray(settingsState.skillSearchResults)
      ? settingsState.skillSearchResults
      : [];
    const matches = sourceResults.filter((skill) => !isInstalledStandardSkill(skill?.id));
    return matches.length === 0
      ? `<li id="settingsSkillModalNoResults" class="text-xs text-base-content/60">${escapeHtml(labels.skillSearchEmpty || "No matching skills on ClawHub")}</li>`
      : matches
        .map((skill) => {
          const normalizedSkillId = normalizeSkillId(skill.id) || normalizeText(skill.id);
          const linkUrl = buildClawHubSkillUrl(normalizedSkillId);
          const showSkillLink = !STANDARD_SKILL_IDS.includes(normalizedSkillId);
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
                <span class="badge badge-secondary badge-sm">${escapeHtml(skill.source || "ClawHub")}</span>
                <span class="font-semibold text-sm">${escapeHtml(skill.name)}</span>
              </div>
              <p class="text-xs text-base-content/70">${escapeHtml(skill.description || "-")}</p>
              <div class="settings-skill-modal-tags">
                <span class="badge badge-ghost badge-sm">${escapeHtml(skillDownloadsLabel)}: ${escapeHtml(downloadsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${escapeHtml(skillStarsLabel)}: ${escapeHtml(starsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${escapeHtml(skillInstallsLabel)}: ${escapeHtml(installsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${escapeHtml(skillRatingLabel)}: ${escapeHtml(ratingDisplay)}</span>
                <span class="badge badge-outline badge-sm">${escapeHtml(skill.packageName || `clawhub/${skill.id}`)}</span>
              </div>
            </div>
            <div class="settings-row-actions settings-skill-modal-actions" data-skill-actions="${escapeHtml(normalizedSkillId)}">
              ${showSkillLink ? `<a
                class="btn btn-outline btn-sm"
                href="${escapeHtml(linkUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                data-skill-link-id="${escapeHtml(normalizedSkillId)}"
              >${escapeHtml(skillOpenLinkLabel)}</a>` : ""}
              ${normalizedSkillId
    ? `<button class="btn btn-outline btn-sm" data-clawhub-download-skill="${escapeHtml(normalizedSkillId)}" type="button">${escapeHtml(labels.skillDownload || "Download")}</button>`
    : `<button class="btn btn-outline btn-sm" type="button" disabled>${escapeHtml(skillInstallUnsupportedLabel)}</button>`}
            </div>
          </li>`;
        })
        .join("");
  };
  const skillMarketModalResults = buildSkillMarketModalResultsHtml();

  const bindSkillMarketInstallHandlers = () => {
    root.querySelectorAll("[data-clawhub-download-skill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const skillId = normalizeSkillId(btn.getAttribute("data-clawhub-download-skill"));
        const result = installRegisteredSkillWithFallback(skillId, settingsState.registeredSkills);
        if (!result.ok) {
          setMessage(result.errorCode || "MSG-PPH-1001");
          return;
        }
        settingsState.registeredSkills = result.nextRegisteredSkillIds;
        setMessage("MSG-PPH-0007");
        renderSettingsTab();
      });
    });
  };

  const bindSkillLinkHandlers = () => {
    root.querySelectorAll("[data-skill-link-id]").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const href = normalizeText(anchor.getAttribute("href"));
        void openExternalUrlWithFallback(href);
      });
    });
  };

  const renderSkillMarketModalResults = () => {
    const listEl = document.getElementById("settingsSkillModalResults");
    if (!listEl) return;
    listEl.innerHTML = buildSkillMarketModalResultsHtml();
    bindSkillLinkHandlers();
    bindSkillMarketInstallHandlers();
  };

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
  const uninstalledSkillItems = getUninstalledSkillMarketItems();
  const skillMarketAvailableCount = uninstalledSkillItems.length;
  const skillMarketPreviewList = uninstalledSkillItems.length === 0
    ? `<li id="settingsSkillMarketPreviewEmpty" class="text-xs text-base-content/60">${escapeHtml(skillRecommendEmptyLabel)}</li>`
    : uninstalledSkillItems
      .map((skill) => {
        const normalizedSkillId = normalizeSkillId(skill.id) || normalizeText(skill.id);
        const description = normalizeText(skill.description || "");
        return `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-secondary badge-sm">${escapeHtml(skill.source || "ClawHub")}</span>
          <span class="badge badge-outline badge-sm">${escapeHtml(skill.name)}</span>
          ${description ? `<span class="text-xs text-base-content/60">${escapeHtml(description)}</span>` : ""}
        </div>
        <div class="settings-row-actions" data-skill-actions="${escapeHtml(normalizedSkillId)}">
          <button class="btn btn-outline btn-xs" data-clawhub-download-skill="${escapeHtml(normalizedSkillId)}" type="button">${escapeHtml(labels.skillDownload || "Install")}</button>
        </div>
      </li>`;
      })
      .join("");
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
  const runSkillMarketSearch = async () => {
    settingsState.skillSearchQuery = String(settingsState.skillSearchDraft || "").trim();
    settingsState.skillSearchFilters = normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft);
    settingsState.skillSearchExecuted = true;
    settingsState.skillSearchLoading = true;
    settingsState.skillSearchError = "";
    settingsState.skillSearchResults = [];
    const requestSeq = settingsState.skillSearchRequestSeq + 1;
    settingsState.skillSearchRequestSeq = requestSeq;
    renderSkillMarketModalResults();
    const result = await searchClawHubSkillsWithFallback(
      settingsState.skillSearchQuery,
      settingsState.skillSearchFilters
    );
    if (settingsState.skillSearchRequestSeq !== requestSeq) return;
    settingsState.skillSearchLoading = false;
    settingsState.skillSearchResults = result.items;
    renderSkillMarketModalResults();
  };

  const closeSkillMarketModal = () => {
    settingsState.skillMarketModalOpen = false;
    settingsState.skillSearchDraft = "";
    settingsState.skillSearchQuery = "";
    settingsState.skillSearchExecuted = false;
    settingsState.skillSearchFilters = { ...DEFAULT_SKILL_SEARCH_FILTERS };
    settingsState.skillSearchFilterDraft = { ...DEFAULT_SKILL_SEARCH_FILTERS };
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
      settingsState.skillSearchFilters = { ...DEFAULT_SKILL_SEARCH_FILTERS };
      settingsState.skillSearchFilterDraft = { ...DEFAULT_SKILL_SEARCH_FILTERS };
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
        ...normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
        sortBy: normalizeSkillMarketSortBy(skillModalSortEl.value),
      };
    });
  }
  if (skillModalNonSuspiciousEl) {
    skillModalNonSuspiciousEl.addEventListener("change", () => {
      settingsState.skillSearchFilterDraft = {
        ...normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
        nonSuspiciousOnly: skillModalNonSuspiciousEl.checked,
      };
    });
  }
  if (skillModalHighlightedOnlyEl) {
    skillModalHighlightedOnlyEl.addEventListener("change", () => {
      settingsState.skillSearchFilterDraft = {
        ...normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
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
  if (cancelAddModelEl) {
    cancelAddModelEl.addEventListener("click", () => {
      settingsState.itemAddOpen = false;
      resetModelItemDraft(settingsState.itemDraft.provider);
      renderSettingsTab();
    });
  }

  const addModel = () => {
    if (settingsState.itemDraft.type === "tool") {
      const toolName = normalizeToolName(settingsState.itemDraft.toolName);
      if (settingsState.registeredTools.includes(toolName)) {
        setMessage("MSG-PPH-1001");
        return;
      }
      settingsState.registeredTools.push(toolName);
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
    modelNameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addModel();
      }
    });
  }

  root.querySelectorAll("[data-remove-model-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-remove-model-index"));
      if (Number.isNaN(index)) return;
      settingsState.registeredModels.splice(index, 1);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-remove-tool-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-remove-tool-index"));
      if (Number.isNaN(index)) return;
      settingsState.registeredTools.splice(index, 1);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-remove-skill-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const skillId = normalizeSkillId(btn.getAttribute("data-remove-skill-id"));
      const result = uninstallRegisteredSkillWithFallback(skillId, settingsState.registeredSkills);
      if (!result.ok) {
        setMessage(result.errorCode || "MSG-PPH-1001");
        return;
      }
      settingsState.registeredSkills = result.nextRegisteredSkillIds;
      renderSettingsTab();
    });
  });
  bindSkillMarketInstallHandlers();
  bindSkillLinkHandlers();

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

  // Legacy aliases for tests and older wiring.
  global.appendTaskProgressLogEntryWithFallback = appendTaskProgressLogEntryWithFallback;
  global.appendTaskProgressLogForTarget = appendTaskProgressLogForTarget;

  global.SettingsTabUi = {
    appendEvent,
    appendPlanArtifactLocal,
    appendPlanArtifactWithFallback,
    appendTaskProgressLogEntryLocal,
    appendTaskProgressLogEntryWithFallback,
    appendTaskProgressLogForTarget,
    assignGateProfileToTarget,
    assignGateProfileToTargetWithRouting,
    buildGuideModelFailedPrompt,
    createGatePalId,
    createGuidePalId,
    createPalIdForRole,
    createWorkerPalId,
    findPlanArtifactByIdWithFallback,
    formatGateRoutingExplanation,
    formatNow,
    formatWorkerRoutingExplanation,
    gateProfileSummaryText,
    getActiveGuideProfile,
    getDefaultGateProfile,
    getGateProfileById,
    getLatestPlanArtifactWithFallback,
    getLatestTaskProgressLogEntryWithFallback,
    hideErrorToast,
    isErrorMessageId,
    selectableModelOptions,
    resolveDraftProviderWithAvailableModels,
    isValidProviderModelPair,
    listPlanArtifactsWithFallback,
    listTaskProgressLogEntriesWithFallback,
    messageText,
    resetModelItemDraft,
    resolveBoardTargetRecord,
    resolveGateProfileForTarget,
    resolveGateProfileForTargetWithRouting,
    resolveGateRoutingProfiles,
    resolveIdentityEditorAgentInput,
    resolveIdentitySecondaryDescriptor,
    resolvePlanArtifactApi,
    resolveProgressLogApi,
    resolveTargetPlanId,
    senderLabel,
    setMessage,
    shouldRequireReplanFromGateResult,
    showErrorToast,
    syncSettingsModelsFromRegistry,
    syncPalProfilesFromSettings,
    syncPalProfilesRegistryRefs,
    updatePlanArtifactLocal,
    updatePlanArtifactWithFallback,
    renderSettingsTab,
  };
})(window);
