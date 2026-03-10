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
  const api = global.SettingsTabRenderUi || {};
  if (typeof api.renderSettingsTab === "function") {
    return api.renderSettingsTab();
  }
  return undefined;
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
