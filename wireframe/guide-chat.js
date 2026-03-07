(function attachGuideChatModel(scope) {
  function normalizeString(value) {
    return String(value || "").trim();
  }

  function findGuideProfile(palProfiles, activeGuideId) {
    if (!Array.isArray(palProfiles)) return null;
    const guides = palProfiles.filter((pal) => normalizeString(pal?.role) === "guide");
    if (guides.length === 0) return null;
    const requestedId = normalizeString(activeGuideId);
    if (!requestedId) return guides[0];
    return guides.find((pal) => normalizeString(pal?.id) === requestedId) || guides[0];
  }

  function resolveGuideModelState(input) {
    const palProfiles = Array.isArray(input?.palProfiles) ? input.palProfiles : [];
    const registeredModels = Array.isArray(input?.registeredModels) ? input.registeredModels : [];
    const guide = findGuideProfile(palProfiles, input?.activeGuideId);
    if (!guide) {
      return {
        ready: false,
        errorCode: "MSG-PPH-1010",
        reason: "guide_not_found",
      };
    }

    const runtimeKind = normalizeString(guide.runtimeKind);
    if (runtimeKind !== "model") {
      return {
        ready: false,
        errorCode: "MSG-PPH-1010",
        reason: "guide_runtime_not_model",
        guideId: normalizeString(guide.id),
      };
    }

    const modelName = normalizeString(Array.isArray(guide.models) ? guide.models[0] : "");
    if (!modelName) {
      return {
        ready: false,
        errorCode: "MSG-PPH-1010",
        reason: "guide_model_missing",
        guideId: normalizeString(guide.id),
      };
    }

    const matchedModel =
      registeredModels.find((model) => normalizeString(model?.name) === modelName) || null;
    if (!matchedModel) {
      return {
        ready: false,
        errorCode: "MSG-PPH-1010",
        reason: "registered_model_missing",
        guideId: normalizeString(guide.id),
        modelName,
      };
    }

    return {
      ready: true,
      guideId: normalizeString(guide.id),
      modelName,
      provider: normalizeString(matchedModel.provider),
    };
  }

  function bindGuideToFirstRegisteredModel(input) {
    const palProfiles = Array.isArray(input?.palProfiles) ? input.palProfiles : [];
    const registeredModels = Array.isArray(input?.registeredModels) ? input.registeredModels : [];
    const guide = findGuideProfile(palProfiles, input?.activeGuideId);
    const firstModel = registeredModels[0] || null;
    if (!guide || !firstModel || !normalizeString(firstModel.name)) {
      return {
        changed: false,
        guideId: guide ? normalizeString(guide.id) : "",
      };
    }

    const targetName = normalizeString(firstModel.name);
    const targetProvider = normalizeString(firstModel.provider);
    const changed =
      normalizeString(guide.runtimeKind) !== "model" ||
      normalizeString(Array.isArray(guide.models) ? guide.models[0] : "") !== targetName ||
      normalizeString(guide.provider) !== targetProvider ||
      (Array.isArray(guide.cliTools) && guide.cliTools.length > 0);

    if (!changed) {
      return {
        changed: false,
        guideId: normalizeString(guide.id),
      };
    }

    guide.runtimeKind = "model";
    guide.models = [targetName];
    guide.cliTools = [];
    guide.provider = targetProvider;
    return {
      changed: true,
      guideId: normalizeString(guide.id),
      modelName: targetName,
      provider: targetProvider,
    };
  }

  function buildGuideModelReply(input) {
    const userText = normalizeString(input?.userText);
    const modelName = normalizeString(input?.modelName);
    const providerLabel = normalizeString(input?.providerLabel) || "Provider";
    const clipped = userText.length > 48 ? `${userText.slice(0, 48)}...` : userText;
    return {
      ja: `${providerLabel}/${modelName} で受け取りました。「${clipped}」をもとに次のタスク案をまとめます。`,
      en: `Received via ${providerLabel}/${modelName}. I will draft next tasks from "${clipped}".`,
    };
  }

  function buildGuideModelRequiredPrompt() {
    return {
      ja: "Guideモデルが未設定です。Settingsタブでモデルを登録し、Guideに割り当ててください。",
      en: "Guide model is not configured. Register a model in Settings and assign it to Guide.",
    };
  }

  const api = {
    resolveGuideModelState,
    bindGuideToFirstRegisteredModel,
    buildGuideModelReply,
    buildGuideModelRequiredPrompt,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.GuideChatModel = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
