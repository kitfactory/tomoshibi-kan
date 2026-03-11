// Settings-related mutable UI state/bootstrap only.
var settingsState = {
  provider: DEV_LMSTUDIO_PROVIDER_ID,
  endpoint: "",
  apiKey: "",
  models: INITIAL_REGISTERED_MODELS.map((model) => model.name),
  temperature: "0.2",
  contextHandoffPolicy: DEFAULT_CONTEXT_HANDOFF_POLICY,
  guideControllerAssistEnabled: DEFAULT_GUIDE_CONTROLLER_ASSIST_ENABLED,
  registeredModels: INITIAL_REGISTERED_MODELS.map((model) => ({ ...model })),
  registeredTools: ["Codex"],
  registeredToolCapabilities: [],
  registeredSkills: [...STANDARD_SKILL_IDS],
  skillSearchQuery: "",
  skillSearchDraft: "",
  skillSearchExecuted: false,
  skillSearchFilters: { ...DEFAULT_SKILL_SEARCH_FILTERS },
  skillSearchFilterDraft: { ...DEFAULT_SKILL_SEARCH_FILTERS },
  skillSearchResults: [],
  skillSearchLoading: false,
  skillSearchError: "",
  skillSearchRequestSeq: 0,
  skillMarketModalOpen: false,
  itemAddOpen: false,
  itemDraft: {
    type: "model",
    modelName: DEFAULT_MODEL_NAME,
    provider: DEV_LMSTUDIO_PROVIDER_ID,
    apiKey: "",
    baseUrl: "",
    endpoint: "",
    toolName: CLI_TOOL_OPTIONS[0],
  },
};

var messageId = "";
var errorToastTimer = null;
var settingsSavedSignature = "";
var settingsSaveInFlight = false;

var palConfigModalState = {
  open: false,
  palId: "",
};

var identityEditorState = {
  open: false,
  palId: "",
  fileKind: "soul",
  loading: false,
  saving: false,
  text: "",
  identity: null,
  requestSeq: 0,
};

var gateRuntimeState = {
  loading: false,
  requestSeq: 0,
  suggestedDecision: "none",
  reason: "",
  fixes: [],
  rawText: "",
  error: "",
};

window.settingsState = settingsState;
window.palConfigModalState = palConfigModalState;
window.identityEditorState = identityEditorState;
window.gateRuntimeState = gateRuntimeState;
