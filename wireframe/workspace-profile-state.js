(function attachWorkspaceProfileStateUi(scope) {
function resolveRuntimeConfigApi() {
  return scope.WorkspaceRuntimeConfigUi || {};
}

function providerIdFromInputWithFallback(value) {
  const api = resolveRuntimeConfigApi();
  if (typeof api.providerIdFromInput === "function") {
    return api.providerIdFromInput(value);
  }
  if (!value) return DEFAULT_PROVIDER_ID;
  const asId = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === value);
  if (asId) return asId.id;
  const asLabel = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find((provider) => provider.label === value);
  return asLabel ? asLabel.id : DEFAULT_PROVIDER_ID;
}

function normalizeToolNameWithFallback(toolName) {
  const api = resolveRuntimeConfigApi();
  if (typeof api.normalizeToolName === "function") {
    return api.normalizeToolName(toolName);
  }
  if (!toolName) return CLI_TOOL_OPTIONS[0];
  return CLI_TOOL_OPTIONS.includes(toolName) ? toolName : CLI_TOOL_OPTIONS[0];
}

function resolvePalProfileModelApiWithFallback() {
  const api = resolveRuntimeConfigApi();
  if (typeof api.resolvePalProfileModelApi === "function") {
    return api.resolvePalProfileModelApi();
  }
  return typeof window !== "undefined" &&
    window.PalProfileModel &&
    typeof window.PalProfileModel.createPalProfile === "function" &&
    typeof window.PalProfileModel.canDeletePalProfile === "function" &&
    typeof window.PalProfileModel.applyRuntimeSelection === "function"
    ? window.PalProfileModel
    : null;
}

function normalizePalRoleLocal(role) {
  if (!role) return "worker";
  return PAL_ROLE_OPTIONS.includes(role) ? role : "worker";
}

function normalizePalRuntimeKindLocal(kind) {
  if (!kind) return "model";
  return PAL_RUNTIME_KIND_OPTIONS.includes(kind) ? kind : "model";
}

function clonePalProfileRecord(pal) {
  return {
    ...pal,
    models: Array.isArray(pal?.models) ? [...pal.models] : [],
    cliTools: Array.isArray(pal?.cliTools) ? [...pal.cliTools] : [],
    skills: Array.isArray(pal?.skills) ? [...pal.skills] : [],
  };
}

function normalizePalProfileIdWithFallback(role, id) {
  const normalizedRole = normalizePalRoleLocal(role);
  const raw = normalizeText(id).toLowerCase();
  if (!raw) return "";
  if (normalizedRole === "guide" && raw === "pal-guide") return "guide-core";
  if (normalizedRole === "gate" && raw === "pal-gate") return "gate-core";
  const prefix = normalizedRole === "guide"
    ? "guide-"
    : (normalizedRole === "gate" ? "gate-" : "pal-");
  const withPrefix = raw.startsWith(prefix) ? raw : `${prefix}${raw}`;
  return withPrefix.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}

function defaultPalDisplayNameForRole(role) {
  if (role === "guide") return "Guide Core";
  if (role === "gate") return "Gate Core";
  return "住人";
}

function defaultPalPersonaForRole(role) {
  if (role === "guide") return "Guide";
  if (role === "gate") return "Gate";
  return "Worker";
}

function normalizePalProfileRecord(input, index = 0) {
  const role = normalizePalRoleLocal(input?.role);
  const fallbackId = role === "guide"
    ? (index === 0 ? DEFAULT_AGENT_SELECTION.activeGuideId : `guide-${index + 1}`)
    : (role === "gate"
      ? (index === 0 ? DEFAULT_AGENT_SELECTION.defaultGateId : `gate-${index + 1}`)
      : `pal-worker-${String(index + 1).padStart(3, "0")}`);
  const id = normalizePalProfileIdWithFallback(role, input?.id || fallbackId);
  const runtimeKind = normalizePalRuntimeKindLocal(input?.runtimeKind);
  const models = Array.isArray(input?.models)
    ? input.models.map((model) => normalizeText(model)).filter(Boolean)
    : [];
  const cliTools = Array.isArray(input?.cliTools)
    ? input.cliTools.map((tool) => normalizeToolNameWithFallback(tool)).filter(Boolean)
    : [];
  const skills = Array.isArray(input?.skills)
    ? input.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  return {
    id,
    role,
    runtimeKind,
    displayName: normalizeText(input?.displayName) || defaultPalDisplayNameForRole(role),
    persona: normalizeText(input?.persona) || defaultPalPersonaForRole(role),
    provider: providerIdFromInputWithFallback(input?.provider),
    models,
    cliTools,
    skills,
    status: normalizeText(input?.status) || "active",
  };
}

function resolveAgentSelectionSnapshotWithFallback(input = {}) {
  const modelApi = resolvePalProfileModelApiWithFallback();
  if (modelApi && typeof modelApi.resolveAgentSelection === "function") {
    return modelApi.resolveAgentSelection(input);
  }
  const profiles = Array.isArray(input.palProfiles) ? input.palProfiles : [];
  const guides = profiles.filter((pal) => normalizePalRoleLocal(pal?.role) === "guide");
  const gates = profiles.filter((pal) => normalizePalRoleLocal(pal?.role) === "gate");
  const requestedGuideId = normalizeText(input.activeGuideId);
  const requestedGateId = normalizeText(input.defaultGateId);
  return {
    activeGuideId: guides.some((pal) => pal.id === requestedGuideId)
      ? requestedGuideId
      : (guides[0]?.id || ""),
    defaultGateId: gates.some((pal) => pal.id === requestedGateId)
      ? requestedGateId
      : (gates[0]?.id || ""),
  };
}

function syncWorkspaceAgentSelection() {
  const next = resolveAgentSelectionSnapshotWithFallback({
    palProfiles,
    activeGuideId: workspaceAgentSelection.activeGuideId,
    defaultGateId: workspaceAgentSelection.defaultGateId,
  });
  workspaceAgentSelection.activeGuideId = next.activeGuideId || "";
  workspaceAgentSelection.defaultGateId = next.defaultGateId || "";
}

function buildPalProfilesSnapshot() {
  syncWorkspaceAgentSelection();
  return {
    profiles: palProfiles.map((pal) => clonePalProfileRecord(pal)),
    activeGuideId: workspaceAgentSelection.activeGuideId,
    defaultGateId: workspaceAgentSelection.defaultGateId,
  };
}

function normalizePalProfilesSnapshot(snapshot) {
  const incomingProfiles = Array.isArray(snapshot?.profiles) ? snapshot.profiles : [];
  const normalized = incomingProfiles.length > 0
    ? incomingProfiles
      .map((profile, index) => normalizePalProfileRecord(profile, index))
      .filter((profile) => !LEGACY_BUILT_IN_PROFILE_IDS.has(normalizeText(profile.id)) || isBuiltInProfileId(profile.id))
      .filter((profile, index, list) => profile.id && list.findIndex((item) => item.id === profile.id) === index)
    : INITIAL_PAL_PROFILES.map((pal) => clonePalProfileRecord(pal));
  if (!normalized.some((pal) => pal.role === "guide")) {
    normalized.unshift(normalizePalProfileRecord(INITIAL_PAL_PROFILES[0], 0));
  }
  if (!normalized.some((pal) => pal.role === "gate")) {
    normalized.splice(1, 0, normalizePalProfileRecord(INITIAL_PAL_PROFILES[1], 1));
  }
  const selection = resolveAgentSelectionSnapshotWithFallback({
    palProfiles: normalized,
    activeGuideId: snapshot?.activeGuideId,
    defaultGateId: snapshot?.defaultGateId,
  });
  return {
    profiles: normalized.map((pal) => clonePalProfileRecord(pal)),
    activeGuideId: selection.activeGuideId,
    defaultGateId: selection.defaultGateId,
  };
}

function readPalProfilesSnapshotWithFallback() {
  try {
    const raw = readLocalStorageSnapshot(
      PAL_PROFILES_LOCAL_STORAGE_KEY,
      LEGACY_PAL_PROFILES_LOCAL_STORAGE_KEYS
    );
    if (!raw) return null;
    return normalizePalProfilesSnapshot(JSON.parse(raw));
  } catch (error) {
    return null;
  }
}

function writePalProfilesSnapshotWithFallback(snapshot = buildPalProfilesSnapshot()) {
  try {
    writeLocalStorageSnapshot(PAL_PROFILES_LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function applyPalProfilesSnapshot(snapshot) {
  const normalized = normalizePalProfilesSnapshot(snapshot);
  palProfiles.splice(0, palProfiles.length, ...normalized.profiles.map((pal) => clonePalProfileRecord(pal)));
  workspaceAgentSelection.activeGuideId = normalized.activeGuideId;
  workspaceAgentSelection.defaultGateId = normalized.defaultGateId;
  syncPalProfilesRegistryRefs();
}

function isBuiltInProfileId(profileId) {
  return BUILT_IN_PROFILE_IDS.has(normalizeText(profileId));
}

function resolveBuiltInProfileDefinition(profileId) {
  const normalizedId = normalizeText(profileId);
  return INITIAL_PAL_PROFILES.find((profile) => profile.id === normalizedId) || null;
}

function syncBuiltInProfileMetadata() {
  const nextProfiles = [];
  INITIAL_PAL_PROFILES.forEach((builtInProfile) => {
    const existing = palProfiles.find((profile) => profile.id === builtInProfile.id);
    if (existing) {
      nextProfiles.push({
        ...clonePalProfileRecord(existing),
        role: builtInProfile.role,
        displayName: builtInProfile.displayName,
        persona: builtInProfile.persona,
      });
      return;
    }
    nextProfiles.push(clonePalProfileRecord(builtInProfile));
  });
  palProfiles
    .filter((profile) => !LEGACY_BUILT_IN_PROFILE_IDS.has(normalizeText(profile.id)))
    .forEach((profile) => {
      nextProfiles.push(clonePalProfileRecord(profile));
    });
  palProfiles.splice(0, palProfiles.length, ...nextProfiles);
  syncWorkspaceAgentSelection();
  syncPalProfilesRegistryRefs();
}

const api = {
  clonePalProfileRecord,
  normalizePalProfileIdWithFallback,
  defaultPalDisplayNameForRole,
  defaultPalPersonaForRole,
  normalizePalProfileRecord,
  resolveAgentSelectionSnapshotWithFallback,
  syncWorkspaceAgentSelection,
  buildPalProfilesSnapshot,
  normalizePalProfilesSnapshot,
  readPalProfilesSnapshotWithFallback,
  writePalProfilesSnapshotWithFallback,
  applyPalProfilesSnapshot,
  isBuiltInProfileId,
  resolveBuiltInProfileDefinition,
  syncBuiltInProfileMetadata,
};

scope.WorkspaceProfileStateUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceProfileStateUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);
