// Mutable UI state/bootstrap only. Prototype seeds live in ui-prototype-seeds.js,
// copy helpers live in ui-copy.js, and event helper lives in ui-event-log.js.
const settingsState = {
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

let locale = "ja";
let selectedTaskId = null;
let gateTarget = null;
let messageId = "";
let errorToastTimer = null;
let workspaceTab = "guide";
let eventSeq = 0;
let eventSearchQuery = "";
let eventTypeFilter = "all";
let eventPage = 1;
let settingsSavedSignature = "";
let settingsSaveInFlight = false;
let projectSeq = INITIAL_PROJECTS.length;
const palConfigModalState = {
  open: false,
  palId: "",
};
const identityEditorState = {
  open: false,
  palId: "",
  fileKind: "soul",
  loading: false,
  saving: false,
  text: "",
  identity: null,
  requestSeq: 0,
};
const gateRuntimeState = {
  loading: false,
  requestSeq: 0,
  suggestedDecision: "none",
  reason: "",
  fixes: [],
  rawText: "",
  error: "",
};

const projectState = {
  projects: INITIAL_PROJECTS.map((item) => ({ ...item, files: [...item.files] })),
  focusProjectId: INITIAL_PROJECTS[0]?.id || "",
  addDraft: {
    name: "",
    directory: "",
  },
};
window.projectState = projectState;
window.getCurrentLocale = () => locale;

let guideMessages = INITIAL_GUIDE_MESSAGES.map((message) => ({
  ...message,
  text: { ...message.text },
}));
const tasks = INITIAL_TASKS.map((task) => ({ ...task }));
const jobs = INITIAL_JOBS.map((job) => ({ ...job }));
const palProfiles = INITIAL_PAL_PROFILES.map((pal) => ({
  ...pal,
  models: Array.isArray(pal.models) ? [...pal.models] : [],
  cliTools: Array.isArray(pal.cliTools) ? [...pal.cliTools] : [],
  skills: Array.isArray(pal.skills) ? [...pal.skills] : [],
}));
const workspaceAgentSelection = { ...DEFAULT_AGENT_SELECTION };

let events = [
  makeEvent("dispatch", "TASK-001", "ok", {
    ja: "TASK-001 を冬坂に割り当てました。",
    en: "TASK-001 dispatched to the Research resident.",
  }, "09:24"),
  makeEvent("gate", "TASK-003", "rejected", {
    ja: "TASK-003 を差し戻しました。",
    en: "TASK-003 was rejected.",
  }, "09:46"),
  makeEvent("dispatch", "JOB-001", "ok", {
    ja: "JOB-001 を冬坂に割り当てました。",
    en: "JOB-001 dispatched to the Research resident.",
  }, "09:52"),
];
let progressLogEntries = [];
let planArtifacts = [];
let detailRenderToken = 0;
