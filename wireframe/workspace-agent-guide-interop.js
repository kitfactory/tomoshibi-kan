(function attachWorkspaceAgentGuideInteropUi(scope) {
const runtimeConfigApi = scope.WorkspaceRuntimeConfigUi || {};

const {
  providerIdFromInput,
  normalizeToolName,
  normalizePalRole,
  normalizePalRuntimeKind,
} = runtimeConfigApi;

function resolveGuideChatModelApi() {
  return typeof window !== "undefined" &&
    window.GuideChatModel &&
    typeof window.GuideChatModel.resolveGuideModelState === "function" &&
    typeof window.GuideChatModel.bindGuideToFirstRegisteredModel === "function" &&
    typeof window.GuideChatModel.buildGuideModelReply === "function" &&
    typeof window.GuideChatModel.buildGuideModelRequiredPrompt === "function"
    ? window.GuideChatModel
    : null;
}

function resolveGuideModelStateWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.resolveGuideModelState({
      palProfiles,
      activeGuideId: workspaceAgentSelection.activeGuideId,
      registeredModels: settingsState.registeredModels,
      registeredTools: settingsState.registeredTools,
    });
  }
  const guide = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId);
  if (!guide) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  if (normalizePalRuntimeKind(guide.runtimeKind) === "tool") {
    const toolName = Array.isArray(guide.cliTools) ? normalizeText(guide.cliTools[0]) : "";
    if (!toolName || !settingsState.registeredTools.some((tool) => normalizeText(tool).toLowerCase() === toolName.toLowerCase())) {
      return { ready: false, errorCode: "MSG-PPH-1010" };
    }
    return {
      ready: true,
      guideId: guide.id,
      runtimeKind: "tool",
      toolName,
    };
  }
  if (guide.runtimeKind !== "model" || !guide.models[0]) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  const model = settingsState.registeredModels.find((item) => item.name === guide.models[0]);
  if (!model) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  return {
    ready: true,
    guideId: guide.id,
    runtimeKind: "model",
    modelName: model.name,
    provider: model.provider,
  };
}

function bindGuideToFirstRegisteredModelWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.bindGuideToFirstRegisteredModel({
      palProfiles,
      activeGuideId: workspaceAgentSelection.activeGuideId,
      registeredModels: settingsState.registeredModels,
      registeredTools: settingsState.registeredTools,
    });
  }
  const guide = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId);
  const activeToolName = guide && Array.isArray(guide.cliTools) ? normalizeText(guide.cliTools[0]) : "";
  if (
    guide &&
    normalizePalRuntimeKind(guide.runtimeKind) === "tool" &&
    activeToolName &&
    settingsState.registeredTools.some((tool) => normalizeText(tool).toLowerCase() === activeToolName.toLowerCase())
  ) {
    return { changed: false, guideId: guide.id };
  }
  const firstModel = settingsState.registeredModels[0];
  if (!guide || !firstModel || !firstModel.name) return { changed: false };
  guide.runtimeKind = "model";
  guide.models = [firstModel.name];
  guide.cliTools = [];
  guide.provider = firstModel.provider || "";
  return { changed: true, guideId: guide.id, modelName: firstModel.name, provider: firstModel.provider || "" };
}

function buildGuideReplyWithFallback(userText, guideState) {
  const external = resolveGuideChatModelApi();
  const runtimeKind = normalizeText(guideState?.runtimeKind) === "tool" ? "tool" : "model";
  const provider = guideState?.provider || "";
  const providerText = providerLabel(provider);
  const runtimeDisplay =
    runtimeKind === "tool"
      ? normalizeText(guideState?.toolName || guideState?.modelName || "CLI")
      : `${providerText}/${guideState?.modelName}`;
  if (external) {
    return external.buildGuideModelReply({
      userText,
      modelName: runtimeKind === "tool" ? normalizeText(guideState?.toolName || guideState?.modelName) : guideState?.modelName,
      providerLabel: runtimeKind === "tool" ? normalizeText(guideState?.toolName || "CLI") : providerText,
    });
  }
  const clipped = userText.length > 28 ? `${userText.slice(0, 28)}...` : userText;
  return {
    ja: `${runtimeDisplay} で受け取りました。「${clipped}」をもとに次のTaskを組み立てます。`,
    en: `Received via ${runtimeDisplay}. I will draft next tasks from "${clipped}".`,
  };
}

function buildGuideModelRequiredPromptWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.buildGuideModelRequiredPrompt();
  }
  return {
    ja: "Guide の実行設定が未完了です。SettingsタブでモデルまたはCLIツールを設定してください。",
    en: "Guide runtime is not configured. Configure a model or CLI tool in Settings tab.",
  };
}

function resolveGuideRegisteredModel(guideState) {
  const modelName = String(guideState?.modelName || "").trim();
  if (!modelName) return null;
  return settingsState.registeredModels.find((model) => model.name === modelName) || null;
}

function resolveGuideApiRuntimeConfig(guideState) {
  const registered = resolveGuideRegisteredModel(guideState);
  if (!hasTomoshibikanCoreRuntimeApi() && isDevOrTestEnvironment()) {
    return {
      provider: DEV_LMSTUDIO_PROVIDER_ID,
      modelName: DEV_LMSTUDIO_MODEL_NAME,
      apiKey: DEV_LMSTUDIO_API_KEY,
      baseUrl: DEV_LMSTUDIO_BASE_URL,
    };
  }
  if (!registered) return null;
  return {
    provider: registered.provider || guideState.provider || DEFAULT_PROVIDER_ID,
    modelName: registered.name || guideState.modelName,
    apiKey: registered.apiKey || "",
    baseUrl: registered.baseUrl || "",
  };
}

async function requestGuideModelReplyWithFallback(userText, guideState, contextBuild) {
  const runtimeApi =
    typeof window !== "undefined" &&
    window.GuideChatRuntime &&
    typeof window.GuideChatRuntime.requestGuideModelReplyWithFallback === "function"
      ? window.GuideChatRuntime
      : null;
  if (!runtimeApi) return null;
  return runtimeApi.requestGuideModelReplyWithFallback(userText, guideState, contextBuild);
}

function buildFallbackGuidePlanOutputInstruction() {
  return locale === "en"
    ? [
      "Return compact JSON only. Do not use markdown fences.",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"project":{"id":"...","name":"...","directory":"..."},"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}],"jobs":[{"title":"...","description":"...","schedule":"...","instruction":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "Use status=conversation when the user is chatting, brainstorming, or not asking for task breakdown yet.",
      "Use status=needs_clarification only when a missing fact blocks task creation.",
      "If the user explicitly asks for a plan or task breakdown and gives the target, expected outcome, relevant files, or available tools, prefer status=plan_ready.",
      "When returning plan_ready, include the target project or folder in plan.project.",
      "If there is no clear target project or folder yet, stay in needs_clarification and guide the user to set it in the Project tab first.",
      "When minor details are missing, make reasonable assumptions and put them in constraints instead of asking another confirmation question.",
      "Do not ask the user to pick the assignee Pal when suitable Pals and tools are already available in context; choose the best fit yourself.",
      "In the debug workspace, prefer resident specialists: trace work to Fuyusaka, fixes to Kuze, and explanation or return wording to Shiramine.",
      "Use status=plan_ready only when you have enough information to create an actionable plan.",
    ].join("\n")
    : [
      "JSONのみで返す。Markdown や code fence は使わない。",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"project":{"id":"...","name":"...","directory":"..."},"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}],"jobs":[{"title":"...","description":"...","schedule":"...","instruction":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "ユーザーが雑談中、壁打ち中、またはまだtask分解を求めていないなら status=conversation を返す。",
      "task 作成を妨げる欠落情報がある時だけ status=needs_clarification を返す。",
      "ユーザーが plan や task 分解を明示し、対象・期待結果・関連ファイル・使える tools を示しているなら status=plan_ready を優先する。",
      "plan_ready を返す時は、対象の project / folder を plan.project に必ず入れる。",
      "対象の project / folder がまだ決まっていない時は、Project タブで先に設定するよう案内し、needs_clarification に留める。",
      "細部が不足しているだけなら、確認質問を増やさず assumptions を constraints に入れる。",
      "文脈に suitable Pals and tools があるなら、ユーザーに assignee Pal を選ばせず自分で選ぶ。",
      "debug workspace では住人の主担当を優先し、調査は冬坂、修正は久瀬、返却文や説明整理は白峰に割り当てる。",
      "実行可能な計画が作れる時だけ status=plan_ready を返す。",
    ].join("\n");
}

function parseGuidePlanResponseWithFallback(text, options = {}) {
  const contextApi = scope.WorkspaceAgentGuideContextUi || {};
  const guidePlanApi = typeof contextApi.resolveGuidePlanApi === "function" ? contextApi.resolveGuidePlanApi() : null;
  if (guidePlanApi) {
    return guidePlanApi.parseGuidePlanResponse(text, options);
  }
  return { ok: false, error: "guide_plan_api_unavailable" };
}

function palRoleLabel(role) {
  const normalized = normalizePalRole(role);
  if (locale === "ja") {
    if (normalized === "guide") return "Guide役";
    if (normalized === "gate") return "Gate役";
    return "住人";
  }
  if (normalized === "guide") return "Guide";
  if (normalized === "gate") return "Gate";
  return "Worker / 住人";
}

function coreModelOptionsByProvider(providerId) {
  const normalizedProviderId = providerIdFromInput(providerId);
  return [...(TOMOSHIBIKAN_CORE_MODEL_OPTIONS_BY_PROVIDER.get(normalizedProviderId) || [])];
}


const api = {
  resolveGuideChatModelApi,
  resolveGuideModelStateWithFallback,
  bindGuideToFirstRegisteredModelWithFallback,
  buildGuideReplyWithFallback,
  buildGuideModelRequiredPromptWithFallback,
  resolveGuideRegisteredModel,
  resolveGuideApiRuntimeConfig,
  requestGuideModelReplyWithFallback,
  buildFallbackGuidePlanOutputInstruction,
  parseGuidePlanResponseWithFallback,
  palRoleLabel,
  coreModelOptionsByProvider,
};

scope.WorkspaceAgentGuideInteropUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceAgentGuideInteropUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);
