(function (global) {
function workspaceShellUi() {
  return global.WorkspaceShellUi || {};
}

function ensureGlobalArrayState(key) {
  if (!Array.isArray(global[key])) {
    global[key] = [];
  }
  return global[key];
}

function getPalProfilesState() {
  return ensureGlobalArrayState("palProfiles");
}

function getTasksState() {
  return ensureGlobalArrayState("tasks");
}

function getJobsState() {
  return ensureGlobalArrayState("jobs");
}

function getEventsState() {
  return ensureGlobalArrayState("events");
}

function getProgressLogEntriesState() {
  return ensureGlobalArrayState("progressLogEntries");
}

function getPlanArtifactsState() {
  return ensureGlobalArrayState("planArtifacts");
}

function syncPalProfilesRegistryRefs() {
  const availableModels = settingsState.registeredModels.map((model) => model.name);
  const availableTools = [...settingsState.registeredTools];
  const availableSkills = [...settingsState.registeredSkills];
  const fallbackModel = availableModels[0] || "";
  const fallbackTool = availableTools[0] || "";
  const palProfiles = getPalProfilesState();

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
  const palProfiles = getPalProfilesState();
  let index = 1;
  while (true) {
    const candidate = `pal-worker-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
}

function createGuidePalId() {
  const palProfiles = getPalProfilesState();
  let index = 1;
  while (true) {
    const candidate = `guide-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
}

function createGatePalId() {
  const palProfiles = getPalProfilesState();
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
  const palProfiles = getPalProfilesState();
  return palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId) || null;
}

function getDefaultGateProfile() {
  const palProfiles = getPalProfilesState();
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
  const palProfiles = getPalProfilesState();
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
  const palProfiles = getPalProfilesState();
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

global.SettingsTabWorkspaceUi = {
  ensureGlobalArrayState,
  getPalProfilesState,
  getTasksState,
  getJobsState,
  getEventsState,
  getProgressLogEntriesState,
  getPlanArtifactsState,
  syncPalProfilesRegistryRefs,
  createWorkerPalId,
  createGuidePalId,
  createGatePalId,
  createPalIdForRole,
  getActiveGuideProfile,
  getDefaultGateProfile,
  resolveIdentitySecondaryDescriptor,
  resolveIdentityEditorAgentInput,
  getGateProfileById,
  resolveGateProfileForTarget,
  resolveGateRoutingProfiles,
  resolveGateProfileForTargetWithRouting,
  assignGateProfileToTarget,
  assignGateProfileToTargetWithRouting,
  gateProfileSummaryText,
};
})(window);
