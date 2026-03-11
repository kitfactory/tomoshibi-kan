(function attachWorkspaceAgentAssignmentUi(scope) {
const runtimeConfigApi = scope.WorkspaceRuntimeConfigUi || {};
const guideRuntimeApi = scope.WorkspaceAgentGuideRuntimeUi || {};

const {
  providerIdFromInput,
  normalizePalRole,
  normalizePalRuntimeKind,
} = runtimeConfigApi;

const {
  resolveAgentIdentityApi,
  resolveAgentSkillResolverApi,
  fallbackResolveSkillSummaries,
  resolveRegisteredToolCapabilitySnapshots,
} = guideRuntimeApi;

function nextTaskSequenceNumber() {
  return tasks.reduce((max, task) => {
    const matched = String(task?.id || "").match(/^TASK-(\d+)$/i);
    if (!matched) return max;
    return Math.max(max, Number(matched[1] || 0));
  }, 0) + 1;
}

function nextJobSequenceNumber() {
  return jobs.reduce((max, job) => {
    const matched = String(job?.id || "").match(/^JOB-(\d+)$/i);
    if (!matched) return max;
    return Math.max(max, Number(matched[1] || 0));
  }, 0) + 1;
}

async function resolveWorkerAssignmentProfiles() {
  const workers = palProfiles.filter((pal) => pal.role === "worker");
  if (workers.length === 0) return [];
  const identityApi = resolveAgentIdentityApi();
  const skillResolverApi = resolveAgentSkillResolverApi();
  const installedSkillIds = Array.isArray(settingsState.registeredSkills)
    ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const skillCatalogItems = CLAWHUB_SKILL_REGISTRY.map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
  }));

  const profiles = await Promise.all(
    workers.map(async (pal) => {
      let identity = null;
      if (identityApi) {
        try {
          identity = await identityApi.load({
            agentType: "worker",
            agentId: pal.id,
          });
        } catch (error) {
          identity = null;
        }
      }
      const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
      const selectedToolNames = Array.isArray(pal.cliTools) ? pal.cliTools : [];
      const configuredSkillIds = identity && identity.hasIdentityFiles
        ? (Array.isArray(identity.enabledSkillIds)
          ? identity.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
          : [])
        : (Array.isArray(pal.skills)
          ? pal.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
          : []);
      const resolvedSkillSummaries = skillResolverApi
        ? skillResolverApi.resolveSkillSummariesForContext({
          runtimeKind,
          configuredSkillIds,
          installedSkillIds,
          catalogItems: skillCatalogItems,
          selectedToolNames,
          registeredToolCapabilities: resolveRegisteredToolCapabilitySnapshots(selectedToolNames),
        })
        : null;
      const skillSummaries = Array.isArray(resolvedSkillSummaries?.skillSummaries)
        ? resolvedSkillSummaries.skillSummaries
        : fallbackResolveSkillSummaries(
          runtimeKind,
          configuredSkillIds,
          installedSkillIds,
          skillCatalogItems,
          selectedToolNames,
          resolveRegisteredToolCapabilitySnapshots(selectedToolNames)
        );
      const roleText = identity && identity.hasIdentityFiles && normalizeText(identity.role)
        ? normalizeText(identity.role)
        : normalizeText(pal.persona || pal.displayName || pal.id);
      return {
        id: pal.id,
        displayName: pal.displayName || pal.id,
        persona: pal.persona || "",
        runtimeKind,
        roleText,
        enabledSkillIds: configuredSkillIds,
        skillSummaries,
      };
    })
  );
  return profiles;
}

function resolveRegisteredModelForPal(pal) {
  const selectedModelName = Array.isArray(pal?.models) ? normalizeText(pal.models[0]) : "";
  if (!selectedModelName) return null;
  const providerHint = providerIdFromInput(pal?.provider || "");
  const candidates = settingsState.registeredModels.filter((model) => (
    normalizeText(model?.name).toLowerCase() === selectedModelName.toLowerCase()
  ));
  if (candidates.length === 0) return null;
  if (!providerHint) return candidates[0];
  return candidates.find((model) => providerIdFromInput(model.provider) === providerHint) || candidates[0];
}

function resolvePalRuntimeConfigForExecution(pal) {
  if (!pal || normalizePalRuntimeKind(pal.runtimeKind) !== "model") return null;
  const model = resolveRegisteredModelForPal(pal);
  if (!model) return null;
  return {
    provider: providerIdFromInput(model.provider || pal.provider || DEFAULT_PROVIDER_ID),
    modelName: normalizeText(model.name),
    baseUrl: normalizeText(model.baseUrl),
    apiKey: normalizeText(model.apiKey),
  };
}

async function resolveConfiguredSkillIdsForPal(pal) {
  const fallback = Array.isArray(pal?.skills)
    ? pal.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi || !pal) return fallback;
  const role = normalizePalRole(pal.role);
  const agentType = role === "worker" ? "worker" : role;
  if (!agentType) return fallback;
  try {
    const identity = await identityApi.load({
      agentType,
      agentId: pal.id,
    });
    if (!identity || !identity.hasIdentityFiles) return fallback;
    return Array.isArray(identity.enabledSkillIds)
      ? identity.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [];
  } catch (error) {
    return fallback;
  }
}

const api = {
  nextTaskSequenceNumber,
  nextJobSequenceNumber,
  resolveWorkerAssignmentProfiles,
  resolveRegisteredModelForPal,
  resolvePalRuntimeConfigForExecution,
  resolveConfiguredSkillIdsForPal,
};

scope.WorkspaceAgentAssignmentUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceAgentAssignmentUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);
