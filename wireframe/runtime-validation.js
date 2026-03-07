(function attachPalRuntimeValidation(scope) {
  function normalizeRuntimeKind(kind) {
    return kind === "tool" ? "tool" : "model";
  }

  function toTrimmedStringArray(values) {
    if (!Array.isArray(values)) return [];
    return values
      .map((value) => String(value || "").trim())
      .filter(Boolean);
  }

  function unique(values) {
    return values.filter((value, index) => values.indexOf(value) === index);
  }

  function resolveRuntimeTarget(targetValue, candidates) {
    const normalized = String(targetValue || "").trim();
    if (!normalized) return "";
    return candidates.includes(normalized) ? normalized : "";
  }

  function validatePalRuntimeSelection(input) {
    const runtimeKind = normalizeRuntimeKind(input?.runtimeKind);
    const availableModels = unique(toTrimmedStringArray(input?.availableModels));
    const availableTools = unique(toTrimmedStringArray(input?.availableTools));
    const allowedSkillIds = unique(toTrimmedStringArray(input?.allowedSkillIds));
    const requestedSkillIds = unique(toTrimmedStringArray(input?.requestedSkillIds));
    const runtimeTarget = String(input?.runtimeTarget || "").trim();

    if (runtimeKind === "model") {
      const selectedModel = resolveRuntimeTarget(runtimeTarget, availableModels);
      if (!selectedModel) {
        return {
          ok: false,
          errorCode: "MSG-PPH-1001",
          runtimeKind,
          models: [],
          cliTools: [],
          skills: [],
        };
      }
      return {
        ok: true,
        runtimeKind,
        models: [selectedModel],
        cliTools: [],
        skills: requestedSkillIds.filter((skillId) => allowedSkillIds.includes(skillId)),
      };
    }

    const selectedTool = resolveRuntimeTarget(runtimeTarget, availableTools);
    if (!selectedTool) {
      return {
        ok: false,
        errorCode: "MSG-PPH-1001",
        runtimeKind,
        models: [],
        cliTools: [],
        skills: [],
      };
    }

    return {
      ok: true,
      runtimeKind,
      models: [],
      cliTools: [selectedTool],
      skills: [],
    };
  }

  const api = {
    normalizeRuntimeKind,
    validatePalRuntimeSelection,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.PalRuntimeValidation = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
