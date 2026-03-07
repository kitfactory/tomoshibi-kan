(function attachPalProfileModel(scope) {
  function normalizePalDisplayName(name, fallbackName) {
    const normalized = String(name || "").trim();
    if (normalized) return normalized;
    return String(fallbackName || "").trim() || "Pal";
  }

  function normalizePalRole(role) {
    const normalized = String(role || "").trim().toLowerCase();
    return normalized === "guide" || normalized === "gate" || normalized === "worker"
      ? normalized
      : "worker";
  }

  function normalizeProfileId(input) {
    const role = normalizePalRole(input?.role);
    const raw = String(input?.id || "").trim().toLowerCase();
    if (!raw) return "";
    if (role === "guide" && raw === "pal-guide") return "guide-core";
    if (role === "gate" && raw === "pal-gate") return "gate-core";
    const prefix = role === "guide" ? "guide-" : (role === "gate" ? "gate-" : "pal-");
    const withPrefix = raw.startsWith(prefix) ? raw : `${prefix}${raw}`;
    const sanitized = withPrefix.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
    return sanitized.replace(/^[-.]+|[-.]+$/g, "");
  }

  function unique(values) {
    return values.filter((value, index) => values.indexOf(value) === index);
  }

  function defaultDisplayNameForRole(role) {
    if (role === "guide") return "New Guide";
    if (role === "gate") return "New Gate";
    return "New Pal";
  }

  function defaultPersonaForRole(role) {
    if (role === "guide") return "Guide";
    if (role === "gate") return "Gate";
    return "Worker";
  }

  function createPalProfile(input) {
    const role = normalizePalRole(input?.role);
    const availableModels = unique(
      Array.isArray(input?.availableModels)
        ? input.availableModels.map((model) => String(model || "").trim()).filter(Boolean)
        : []
    );
    const availableTools = unique(
      Array.isArray(input?.availableTools)
        ? input.availableTools.map((tool) => String(tool || "").trim()).filter(Boolean)
        : []
    );
    const roleAllowedSkills = unique(
      Array.isArray(input?.roleAllowedSkills)
        ? input.roleAllowedSkills.map((skillId) => String(skillId || "").trim()).filter(Boolean)
        : []
    );
    const availableSkills = unique(
      Array.isArray(input?.availableSkills)
        ? input.availableSkills.map((skillId) => String(skillId || "").trim()).filter(Boolean)
        : []
    );

    const runtimeKind = availableModels.length > 0 ? "model" : "tool";
    const modelName = runtimeKind === "model" ? availableModels[0] || "" : "";
    const toolName = runtimeKind === "tool" ? availableTools[0] || "" : "";
    const displayName = normalizePalDisplayName(input?.displayName, defaultDisplayNameForRole(role));
    const provider = runtimeKind === "model" ? String(input?.defaultProvider || "") : "";
    const skills =
      runtimeKind === "model"
        ? roleAllowedSkills.filter((skillId) => availableSkills.includes(skillId))
        : [];

    return {
      id: normalizeProfileId({ role, id: input?.id }),
      role,
      runtimeKind,
      displayName,
      persona: String(input?.persona || "").trim() || defaultPersonaForRole(role),
      provider,
      models: modelName ? [modelName] : [],
      cliTools: toolName ? [toolName] : [],
      skills,
      status: "active",
    };
  }

  function createWorkerPalProfile(input) {
    return createPalProfile({
      ...input,
      role: "worker",
    });
  }

  function canDeletePalProfile(input) {
    const palId = String(input?.palId || "").trim();
    if (!palId) return false;
    const profiles = Array.isArray(input?.palProfiles) ? input.palProfiles : [];
    const matchedProfile = profiles.find((pal) => String(pal?.id || "").trim() === palId) || null;
    const role = normalizePalRole(matchedProfile?.role || input?.role);
    if (role !== "worker") {
      const sameRoleCount = profiles.filter((pal) => normalizePalRole(pal?.role) === role).length;
      return sameRoleCount > 1;
    }
    const tasks = Array.isArray(input?.tasks) ? input.tasks : [];
    const jobs = Array.isArray(input?.jobs) ? input.jobs : [];
    const taskAssigned = tasks.some((task) => String(task?.palId || "").trim() === palId);
    const jobAssigned = jobs.some((job) => String(job?.palId || "").trim() === palId);
    return !taskAssigned && !jobAssigned;
  }

  function resolveAgentSelection(input) {
    const profiles = Array.isArray(input?.palProfiles) ? input.palProfiles : [];
    const guides = profiles.filter((pal) => normalizePalRole(pal?.role) === "guide");
    const gates = profiles.filter((pal) => normalizePalRole(pal?.role) === "gate");
    const requestedGuideId = String(input?.activeGuideId || "").trim();
    const requestedGateId = String(input?.defaultGateId || "").trim();
    return {
      activeGuideId: guides.some((pal) => String(pal?.id || "").trim() === requestedGuideId)
        ? requestedGuideId
        : String(guides[0]?.id || "").trim(),
      defaultGateId: gates.some((pal) => String(pal?.id || "").trim() === requestedGateId)
        ? requestedGateId
        : String(gates[0]?.id || "").trim(),
    };
  }

  function applyRuntimeSelection(input) {
    const base = input?.pal ? { ...input.pal } : {};
    const runtimeKind = input?.runtimeKind === "tool" ? "tool" : "model";
    const runtimeResult = input?.runtimeResult || {};
    const displayName = normalizePalDisplayName(input?.displayName, base.displayName || "Pal");

    base.displayName = displayName;
    base.runtimeKind = runtimeKind;

    if (runtimeKind === "model") {
      const models = Array.isArray(runtimeResult.models)
        ? runtimeResult.models.map((model) => String(model || "").trim()).filter(Boolean)
        : [];
      const skills = Array.isArray(runtimeResult.skills)
        ? runtimeResult.skills.map((skillId) => String(skillId || "").trim()).filter(Boolean)
        : [];
      const primaryModel = models[0] || "";
      const provider =
        primaryModel && typeof input?.resolveProviderForModel === "function"
          ? String(input.resolveProviderForModel(primaryModel) || "")
          : "";
      base.models = primaryModel ? [primaryModel] : [];
      base.cliTools = [];
      base.skills = skills;
      base.provider = provider;
      return base;
    }

    const cliTools = Array.isArray(runtimeResult.cliTools)
      ? runtimeResult.cliTools.map((tool) => String(tool || "").trim()).filter(Boolean)
      : [];
    const primaryTool = cliTools[0] || "";
    base.models = [];
    base.cliTools = primaryTool ? [primaryTool] : [];
    base.skills = [];
    base.provider = "";
    return base;
  }

  const api = {
    normalizePalDisplayName,
    normalizeProfileId,
    createPalProfile,
    createWorkerPalProfile,
    canDeletePalProfile,
    applyRuntimeSelection,
    resolveAgentSelection,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.PalProfileModel = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
