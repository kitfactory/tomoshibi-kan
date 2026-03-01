const STATUS_UI_ID = {
  assigned: "UI-PPH-0005",
  in_progress: "UI-PPH-0006",
  to_gate: "UI-PPH-0007",
  rejected: "UI-PPH-0008",
  done: "UI-PPH-0009",
};

const UI_TEXT = {
  ja: {
    "UI-PPH-0001": "繝ｯ繝ｼ繧ｯ繧ｹ繝壹・繧ｹ",
    "UI-PPH-0002": "Guide Chat",
    "UI-PPH-0003": "Task Board",
    "UI-PPH-0004": "Event Log",
    "UI-PPH-0005": "蜑ｲ繧雁ｽ薙※貂医∩",
    "UI-PPH-0006": "螳溯｡御ｸｭ",
    "UI-PPH-0007": "蛻､螳壼ｾ・■",
    "UI-PPH-0008": "蟾ｮ縺玲綾縺・",
    "UI-PPH-0009": "螳御ｺ・",
    "UI-PPH-0010": "險ｭ螳・",
    "UI-PPH-0011": "Agent險ｭ螳・",
    "UI-PPH-0012": "Workspace險ｭ螳・",
    "UI-PPH-0201": "Sort: updated_at desc (蝗ｺ螳・",
    "UI-PPH-0202": "Filter: none (MVP)",
    "UI-PPH-0203": "Limit: 50 (證ｫ螳・",
    "UI-PPH-0204": "Task Detail",
    "UI-PPH-0205": "Gate Panel",
    "UI-PPH-0206": "Reject Reason",
    "UI-PPH-0207": "Pal Preview Slot",
    "UI-PPH-0208": "3D Coming Soon",
    "UI-PPH-0209": "Reject",
    "UI-PPH-0210": "Approve",
    "UI-PPH-0211": "Agent / Guide",
    "UI-PPH-0212": "Agent / Gate",
    "UI-PPH-0213": "Agent / Pal",
    "UI-PPH-0214": "Safety",
    "UI-PPH-0215": "Workspace",
  },
  en: {
    "UI-PPH-0001": "Workspace",
    "UI-PPH-0002": "Guide Chat",
    "UI-PPH-0003": "Task Board",
    "UI-PPH-0004": "Event Log",
    "UI-PPH-0005": "Assigned",
    "UI-PPH-0006": "In Progress",
    "UI-PPH-0007": "Awaiting Gate",
    "UI-PPH-0008": "Rejected",
    "UI-PPH-0009": "Done",
    "UI-PPH-0010": "Settings",
    "UI-PPH-0011": "Agent",
    "UI-PPH-0012": "Workspace",
    "UI-PPH-0201": "Sort: updated_at desc (fixed)",
    "UI-PPH-0202": "Filter: none (MVP)",
    "UI-PPH-0203": "Limit: 50 (temporary)",
    "UI-PPH-0204": "Task Detail",
    "UI-PPH-0205": "Gate Panel",
    "UI-PPH-0206": "Reject Reason",
    "UI-PPH-0207": "Pal Preview Slot",
    "UI-PPH-0208": "3D Coming Soon",
    "UI-PPH-0209": "Reject",
    "UI-PPH-0210": "Approve",
    "UI-PPH-0211": "Agent / Guide",
    "UI-PPH-0212": "Agent / Gate",
    "UI-PPH-0213": "Agent / Pal",
    "UI-PPH-0214": "Safety",
    "UI-PPH-0215": "Workspace",
  },
};

const DYNAMIC_TEXT = {
  ja: {
    detail: "隧ｳ邏ｰ",
    start: "逹謇・",
    submit: "謠仙・",
    gate: "Gate蛻､螳・",
    resubmit: "蜀肴署蜃ｺ",
    selectedTask: "驕ｸ謚杁ask",
    description: "隱ｬ譏・",
    constraints: "蛻ｶ邏・メ繧ｧ繝・け",
    evidence: "Evidence",
    replay: "Replay",
    fixCondition: "菫ｮ豁｣譚｡莉ｶ",
    openGate: "Gate Panel繧帝幕縺・",
    close: "髢峨§繧・",
    noTaskSelected: "Task繧帝∈謚槭＠縺ｦ縺上□縺輔＞縲・",
    noTask: "Task縺後≠繧翫∪縺帙ｓ縲・",
    noJob: "Job縺後≠繧翫∪縺帙ｓ縲・",
    schedule: "螳溯｡悟捉譛・",
    instruction: "謖・､ｺ",
    lastRun: "譛邨ょｮ溯｡・",
    gateOnlyToGate: "迴ｾ蝨ｨ縺ｮ迥ｶ諷九〒縺ｯGate蛻､螳壹・螳溯｡後〒縺阪∪縺帙ｓ縲・",
    rejectReasonPlaceholder: "蟾ｮ縺玲綾縺礼炊逕ｱ・域怙螟ｧ3鬆・岼・・",
    settingsReadonly: "MVP: 險ｭ螳壹・髢ｲ隕ｧ縺ｮ縺ｿ",
    view: "陦ｨ遉ｺ",
    guideHint: "Guide縺ｨ莨夊ｩｱ縺励↑縺後ｉ繧ｿ繧ｹ繧ｯ蛹悶・騾ｲ謐玲峩譁ｰ縺ｧ縺阪∪縺吶・",
    guideInputPlaceholder: "Guide縺ｸ繝｡繝・そ繝ｼ繧ｸ繧貞・蜉幢ｼ・nter縺ｧ騾∽ｿ｡ / Shift+Enter縺ｧ謾ｹ陦鯉ｼ・",
    guideSend: "騾∽ｿ｡",
    senderGuide: "guide",
    senderYou: "you",
    senderSystem: "system",
    errorToastTitle: "Error",
    errorToastClose: "close",
  },
  en: {
    detail: "Detail",
    start: "Start",
    submit: "Submit",
    gate: "Gate Review",
    resubmit: "Resubmit",
    selectedTask: "Selected Task",
    description: "Description",
    constraints: "Constraints Check",
    evidence: "Evidence",
    replay: "Replay",
    fixCondition: "Fix Condition",
    openGate: "Open Gate Panel",
    close: "Close",
    noTaskSelected: "Select a task first.",
    noTask: "No tasks yet.",
    noJob: "No jobs yet.",
    schedule: "Schedule",
    instruction: "Instruction",
    lastRun: "Last Run",
    gateOnlyToGate: "Gate review is only available for to_gate tasks.",
    rejectReasonPlaceholder: "Reject reasons (max 3)",
    settingsReadonly: "MVP: read-only settings",
    view: "View",
    guideHint: "Talk with Guide to create tasks and update progress.",
    guideInputPlaceholder: "Message Guide (Enter to send / Shift+Enter for newline)",
    guideSend: "Send",
    senderGuide: "guide",
    senderYou: "you",
    senderSystem: "system",
    errorToastTitle: "Error",
    errorToastClose: "close",
  },
};

const MESSAGE_TEXT = {
  "MSG-PPH-0001": {
    ja: "Plan Card繧剃ｽ懈・縺励∪縺励◆縲・",
    en: "Plan card created.",
  },
  "MSG-PPH-0002": {
    ja: "Task繧単al縺ｸ驟榊ｸ・＠縺ｾ縺励◆縲・",
    en: "Tasks dispatched to Pal.",
  },
  "MSG-PPH-0003": {
    ja: "Completion Ritual繧剃ｿ晏ｭ倥＠縺ｦGate縺ｸ謠仙・縺励∪縺励◆縲・",
    en: "Completion ritual saved and submitted to Gate.",
  },
  "MSG-PPH-0004": {
    ja: "Gate蛻､螳壹ｒ險倬鹸縺励∪縺励◆縲・",
    en: "Gate decision recorded.",
  },
  "MSG-PPH-0005": {
    ja: "蟾ｮ縺玲綾縺裕ask繧貞・謠仙・縺励∪縺励◆縲・",
    en: "Rejected task resubmitted.",
  },
  "MSG-PPH-0007": {
    ja: "Pal蛻ｶ邏・ｒ驕ｩ逕ｨ縺励∪縺励◆縲・",
    en: "Pal constraints applied.",
  },
  "MSG-PPH-0008": {
    ja: "Plan螳御ｺ・ｒ騾夂衍縺励∪縺励◆縲・",
    en: "Plan completion was posted.",
  },
  "MSG-PPH-0009": {
    ja: "Guide繝√Ε繝・ヨ繧呈峩譁ｰ縺励∪縺励◆縲・",
    en: "Guide chat updated.",
  },
  "MSG-PPH-1001": {
    ja: "蜈･蜉帛・螳ｹ繧堤｢ｺ隱阪＠縺ｦ縺上□縺輔＞縲・",
    en: "Check your input.",
  },
  "MSG-PPH-1002": {
    ja: "蜃ｦ逅・′繧ｿ繧､繝繧｢繧ｦ繝医＠縺ｾ縺励◆縲ょ・隧ｦ陦後＠縺ｦ縺上□縺輔＞縲・",
    en: "Operation timed out. Please retry.",
  },
  "MSG-PPH-1003": {
    ja: "菫晏ｭ倥↓螟ｱ謨励＠縺ｾ縺励◆縲ゆｿ晏ｭ伜・繧堤｢ｺ隱阪＠縺ｦ縺上□縺輔＞縲・",
    en: "Failed to save. Check storage destination.",
  },
  "MSG-PPH-1004": {
    ja: "蟇ｾ雎｡繝・・繧ｿ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縲・",
    en: "Target data not found.",
  },
  "MSG-PPH-1005": {
    ja: "繧ｻ繝ｼ繝輔ユ繧｣蛻ｶ邏・↓繧医ｊ謫堺ｽ懊ｒ繝悶Ο繝・け縺励∪縺励◆縲・",
    en: "Operation blocked by safety constraints.",
  },
  "MSG-PPH-1006": {
    ja: "迴ｾ蝨ｨ縺ｮ迥ｶ諷九〒縺ｯ縺昴・謫堺ｽ懊・螳溯｡後〒縺阪∪縺帙ｓ縲・",
    en: "This action is not available in the current state.",
  },
  "MSG-PPH-1007": {
    ja: "Reject蜈･蜉帙′荳企剞蛻ｶ邏・ｒ雜・∴縺ｦ縺・∪縺吶・",
    en: "Reject input exceeds limit.",
  },
  "MSG-PPH-1008": {
    ja: "螳御ｺ・愛螳壹↓荳肴紛蜷医′縺ゅｊ縺ｾ縺吶ら憾諷九ｒ蜀咲｢ｺ隱阪＠縺ｦ縺上□縺輔＞縲・",
    en: "Completion state is inconsistent. Check statuses.",
  },
};

const MODEL_OPTIONS = [
  "gpt-4.1",
  "gpt-4o",
  "gpt-4o-mini",
  "o3",
  "o4-mini",
  "claude-3-7-sonnet",
  "gemini-2.5-pro",
];
const DEFAULT_MODEL_NAME = MODEL_OPTIONS[0] || "";

const PALPAL_CORE_PROVIDER_REGISTRY =
  typeof window !== "undefined" &&
  Array.isArray(window.PALPAL_CORE_PROVIDERS) &&
  window.PALPAL_CORE_PROVIDERS.length > 0
    ? window.PALPAL_CORE_PROVIDERS
    : [
      { id: "openai", label: "OpenAI" },
      { id: "anthropic", label: "Anthropic" },
      { id: "google", label: "Google" },
      { id: "azure_openai", label: "Azure OpenAI" },
      { id: "local_ollama", label: "Local / Ollama" },
    ];

const PROVIDER_OPTIONS = PALPAL_CORE_PROVIDER_REGISTRY.map((provider) => provider.id);

const CLI_TOOL_OPTIONS = ["Codex", "ClaudeCode", "OpenCode"];
const STANDARD_SKILL_CATALOG = [
  {
    id: "codex-file-search",
    name: "File Search",
    mountPoint: "model-runtime",
    description: "Search files and text quickly",
  },
  {
    id: "codex-file-read",
    name: "File Read",
    mountPoint: "model-runtime",
    description: "Open and inspect file contents",
  },
  {
    id: "codex-file-edit",
    name: "File Edit",
    mountPoint: "model-runtime",
    description: "Apply safe file edits and patches",
  },
  {
    id: "codex-shell-command",
    name: "Shell Command",
    mountPoint: "model-runtime",
    description: "Run terminal commands in workspace",
  },
  {
    id: "codex-test-runner",
    name: "Test Runner",
    mountPoint: "model-runtime",
    description: "Execute tests and inspect failures",
  },
  {
    id: "browser-chrome",
    name: "Chrome Browser",
    mountPoint: "model-runtime",
    description: "Chrome browser control skill",
  },
];
const CLAWHUB_SITE_URL = "https://clawhub.dev";
const CLAWHUB_SKILL_REGISTRY = STANDARD_SKILL_CATALOG.map((skill) => ({
  ...skill,
  packageName: `clawhub/${skill.id}`,
  source: "ClawHub",
}));
const STANDARD_SKILL_IDS = STANDARD_SKILL_CATALOG.map((skill) => skill.id);
const ROLE_SKILL_POLICY = {
  guide: ["codex-file-search", "codex-file-read", "browser-chrome"],
  gate: ["codex-file-search", "codex-file-read", "codex-test-runner", "browser-chrome"],
  worker: [...STANDARD_SKILL_IDS],
};
const DEFAULT_PROVIDER_ID = PROVIDER_OPTIONS[0] || "openai";
const PAL_ROLE_OPTIONS = ["guide", "gate", "worker"];
const PAL_RUNTIME_KIND_OPTIONS = ["model", "tool"];

const settingsState = {
  provider: DEFAULT_PROVIDER_ID,
  endpoint: "",
  apiKey: "",
  models: ["gpt-4.1", "gpt-4o-mini"],
  temperature: "0.2",
  registeredModels: [
    {
      name: "gpt-4.1",
      provider: DEFAULT_PROVIDER_ID,
      apiKey: "",
      baseUrl: "",
      endpoint: "",
    },
    {
      name: "gpt-4o-mini",
      provider: DEFAULT_PROVIDER_ID,
      apiKey: "",
      baseUrl: "",
      endpoint: "",
    },
  ],
  registeredTools: ["Codex"],
  registeredSkills: [...STANDARD_SKILL_IDS],
  skillSearchQuery: "",
  itemAddOpen: false,
  itemDraft: {
    type: "model",
    modelName: DEFAULT_MODEL_NAME,
    provider: DEFAULT_PROVIDER_ID,
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

let guideMessages = [
  {
    timestamp: "09:20",
    sender: "guide",
    text: {
      ja: "Plan Card繧呈署譯医＠縺ｾ縺吶５ask繧・莉ｶ縺ｫ蛻・牡縺励∪縺吶・",
      en: "I propose a plan card. Splitting into 3 tasks.",
    },
  },
  {
    timestamp: "09:23",
    sender: "system",
    text: {
      ja: "Plan縺ｯ謇ｿ隱肴ｸ医∩縺ｧ縺吶５ask驟榊ｸ・ｸ医∩縲・",
      en: "Plan approved. Tasks dispatched.",
    },
  },
];

const tasks = [
  {
    id: "TASK-001",
    title: "Guide隕∽ｻｶ縺ｮ遒ｺ隱・",
    description: "REQ-0001縲彝EQ-0008 縺ｨ逕ｻ髱｢險ｭ險郁ｦ∽ｻｶ繧堤ｪ∝粋縺吶ｋ",
    palId: "pal-alpha",
    status: "in_progress",
    updatedAt: "2026-02-28 09:30",
    decisionSummary: "-",
    constraintsCheckResult: "pass",
    evidence: "docs/spec.md, docs/concept.md",
    replay: "review-checklist",
    fixCondition: "-",
  },
  {
    id: "TASK-002",
    title: "繝ｯ繧､繝､繝ｼ繝輔Ξ繝ｼ繝菴懈・",
    description: "Workspace / Task Detail / Gate / Settings 繧偵ム繝溘・螳溯｣・",
    palId: "pal-beta",
    status: "to_gate",
    updatedAt: "2026-02-28 09:41",
    decisionSummary: "pending",
    constraintsCheckResult: "pass",
    evidence: "wireframe/index.html",
    replay: "open-browser > click-flow",
    fixCondition: "-",
  },
  {
    id: "TASK-003",
    title: "i18n ID繝槭ャ繝斐Φ繧ｰ",
    description: "UI-PPH-xxxx 縺ｨ ja/en 霎樊嶌縺ｮ蛻晄悄繧ｻ繝・ヨ繧貞ｮ夂ｾｩ",
    palId: "pal-gamma",
    status: "rejected",
    updatedAt: "2026-02-28 09:46",
    decisionSummary: "rejected",
    constraintsCheckResult: "pass",
    evidence: "ui-id-table",
    replay: "switch-ja-en",
    fixCondition: "UI-ID荳崎ｶｳ鬆・岼繧定ｿｽ蜉",
  },
];

const jobs = [
  {
    id: "JOB-001",
    title: "萓晏ｭ倥い繝・・繝・・繝医・螳壽悄遒ｺ隱・",
    description: "蟷ｳ譌･ 09:00 縺ｫ萓晏ｭ俶峩譁ｰ縺ｨ閼・ｼｱ諤ｧ繧堤｢ｺ隱阪＠縺ｦ縲∬ｦ∫せ繧偵∪縺ｨ繧√ｋ",
    palId: "pal-alpha",
    schedule: "Weekdays 09:00",
    instruction: "npm outdated && npm audit --omit=dev 縺ｮ邨先棡繧・陦後〒蝣ｱ蜻翫☆繧・",
    status: "assigned",
    updatedAt: "2026-02-28 09:10",
    decisionSummary: "-",
    fixCondition: "-",
    lastRunAt: "-",
  },
  {
    id: "JOB-002",
    title: "E2E邨先棡縺ｮ騾ｱ谺｡繧ｵ繝槭Μ繝ｼ",
    description: "豈朱ｱ驥第屆縺ｫE2E縺ｮ謌仙粥邇・→螟ｱ謨励ヱ繧ｿ繝ｼ繝ｳ繧帝寔險医＠縺ｦGate縺ｸ謠仙・縺吶ｋ",
    palId: "pal-beta",
    schedule: "Fri 17:00",
    instruction: "npm run test:e2e 縺ｮ螳溯｡檎ｵ先棡繧帝寔險医＠縲∵ｬ｡蝗樊隼蝟・・繧､繝ｳ繝医ｒ1莉ｶ謠先｡医☆繧・",
    status: "to_gate",
    updatedAt: "2026-02-28 17:12",
    decisionSummary: "pending",
    fixCondition: "-",
    lastRunAt: "2026-02-28 17:05",
  },
];

const palProfiles = [
  {
    id: "pal-guide",
    role: "guide",
    runtimeKind: "model",
    displayName: "Guide Core",
    persona: "Guide",
    provider: "openai",
    models: ["gpt-4.1"],
    cliTools: [],
    skills: [...STANDARD_SKILL_IDS],
    status: "active",
  },
  {
    id: "pal-gate",
    role: "gate",
    runtimeKind: "model",
    displayName: "Gate Core",
    persona: "Gate",
    provider: "anthropic",
    models: ["claude-3-7-sonnet"],
    cliTools: [],
    skills: [...STANDARD_SKILL_IDS],
    status: "active",
  },
  {
    id: "pal-alpha",
    role: "worker",
    runtimeKind: "tool",
    displayName: "Pal Alpha",
    persona: "Builder",
    provider: "openai",
    models: [],
    cliTools: ["Codex"],
    skills: [],
    status: "active",
  },
  {
    id: "pal-beta",
    role: "worker",
    runtimeKind: "tool",
    displayName: "Pal Beta",
    persona: "Reviewer",
    provider: "anthropic",
    models: [],
    cliTools: ["Codex"],
    skills: [],
    status: "active",
  },
  {
    id: "pal-gamma",
    role: "worker",
    runtimeKind: "tool",
    displayName: "Pal Gamma",
    persona: "Ops",
    provider: "google",
    models: [],
    cliTools: ["Codex"],
    skills: [],
    status: "idle",
  },
];

let events = [
  makeEvent("dispatch", "TASK-001", "ok", {
    ja: "TASK-001 繧・pal-alpha 縺ｫ驟榊ｸ・＠縺ｾ縺励◆縲・",
    en: "TASK-001 dispatched to pal-alpha.",
  }, "09:24"),
  makeEvent("gate", "TASK-003", "rejected", {
    ja: "TASK-003 繧貞ｷｮ縺玲綾縺励∪縺励◆縲・",
    en: "TASK-003 was rejected.",
  }, "09:46"),
  makeEvent("dispatch", "JOB-001", "ok", {
    ja: "JOB-001 繧・pal-alpha 縺ｫ驟榊ｸ・＠縺ｾ縺励◆縲・",
    en: "JOB-001 dispatched to pal-alpha.",
  }, "09:52"),
];

function makeEvent(type, targetId, result, summary, timestamp) {
  eventSeq += 1;
  return {
    id: `EV-${String(eventSeq).padStart(4, "0")}`,
    timestamp,
    eventType: type,
    targetId,
    result,
    summary,
  };
}

function tUi(id) {
  return (UI_TEXT[locale] && UI_TEXT[locale][id]) || (UI_TEXT.ja && UI_TEXT.ja[id]) || id;
}

function tDyn(key) {
  return (DYNAMIC_TEXT[locale] && DYNAMIC_TEXT[locale][key]) || key;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function providerLabel(providerId) {
  const entry = PALPAL_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === providerId);
  return entry ? entry.label : providerId;
}

function providerIdFromInput(value) {
  if (!value) return DEFAULT_PROVIDER_ID;
  const asId = PALPAL_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === value);
  if (asId) return asId.id;
  const asLabel = PALPAL_CORE_PROVIDER_REGISTRY.find((provider) => provider.label === value);
  return asLabel ? asLabel.id : DEFAULT_PROVIDER_ID;
}

function normalizeRegisteredModel(model) {
  return {
    name: String(model.name || "").trim(),
    provider: providerIdFromInput(model.provider),
    apiKey: String(model.apiKey || "").trim(),
    baseUrl: String(model.baseUrl || "").trim(),
    endpoint: String(model.endpoint || "").trim(),
  };
}

function normalizeToolName(toolName) {
  if (!toolName) return CLI_TOOL_OPTIONS[0];
  return CLI_TOOL_OPTIONS.includes(toolName) ? toolName : CLI_TOOL_OPTIONS[0];
}

function normalizeSkillId(skillId) {
  if (!skillId) return "";
  const normalized = String(skillId).trim();
  return STANDARD_SKILL_IDS.includes(normalized) ? normalized : "";
}

function skillById(skillId) {
  return STANDARD_SKILL_CATALOG.find((skill) => skill.id === skillId) || null;
}

function skillName(skillId) {
  return skillById(skillId)?.name || skillId;
}

function searchClawHubSkills(query) {
  const keyword = String(query || "").trim().toLowerCase();
  if (!keyword) return [...CLAWHUB_SKILL_REGISTRY];
  return CLAWHUB_SKILL_REGISTRY.filter((skill) => {
    const fields = [
      skill.id,
      skill.name,
      skill.description,
      skill.packageName,
      skill.source,
    ];
    return fields.some((field) => String(field || "").toLowerCase().includes(keyword));
  });
}

function allowedSkillIdsForRole(role) {
  const normalized = normalizePalRole(role);
  const allowed = ROLE_SKILL_POLICY[normalized] || ROLE_SKILL_POLICY.worker;
  return [...allowed];
}

function normalizePalRole(role) {
  if (!role) return "worker";
  return PAL_ROLE_OPTIONS.includes(role) ? role : "worker";
}

function normalizePalRuntimeKind(kind) {
  if (!kind) return "model";
  return PAL_RUNTIME_KIND_OPTIONS.includes(kind) ? kind : "model";
}

function palRoleLabel(role) {
  const normalized = normalizePalRole(role);
  if (locale === "ja") {
    if (normalized === "guide") return "Guide役";
    if (normalized === "gate") return "Gate役";
    return "通常Pal";
  }
  if (normalized === "guide") return "Guide";
  if (normalized === "gate") return "Gate";
  return "Worker Pal";
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
  settingsState.itemDraft.provider = providerIdFromInput(settingsState.itemDraft.provider);
  settingsState.itemDraft.modelName = MODEL_OPTIONS.includes(settingsState.itemDraft.modelName)
    ? settingsState.itemDraft.modelName
    : DEFAULT_MODEL_NAME;
  settingsState.itemDraft.toolName = normalizeToolName(settingsState.itemDraft.toolName);
  settingsState.itemDraft.type = settingsState.itemDraft.type === "tool" ? "tool" : "model";
  settingsState.skillSearchQuery = String(settingsState.skillSearchQuery || "");
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
}

function createWorkerPalId() {
  let index = 1;
  while (true) {
    const candidate = `pal-worker-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
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

function appendEvent(type, targetId, result, summaryJa, summaryEn) {
  events.unshift(
    makeEvent(type, targetId, result, { ja: summaryJa, en: summaryEn }, formatNow().slice(11))
  );
  events = events.slice(0, 50);
}

function messageText(id) {
  const data = MESSAGE_TEXT[id];
  return data ? data[locale] : id;
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

function setWorkspaceTab(tab) {
  workspaceTab = tab;
  document.querySelectorAll(".workspace-tabs .tab-btn").forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("active", isActive);
    btn.classList.toggle("tab-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tab;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
  document.querySelector(".app-shell").classList.toggle("guide-mode", tab === "guide");
  renderDetail();
}

function applyI18n() {
  document.documentElement.lang = locale === "ja" ? "ja" : "en";
  document.querySelectorAll("[data-ui-id]").forEach((el) => {
    const id = el.getAttribute("data-ui-id");
    el.textContent = tUi(id);
  });
  const guideHint = document.getElementById("guideHint");
  if (guideHint) guideHint.textContent = tDyn("guideHint");
  document.getElementById("guideInput").placeholder = tDyn("guideInputPlaceholder");
  document.getElementById("guideSend").textContent = tDyn("guideSend");
  document.querySelector("#gateReason").placeholder = tDyn("rejectReasonPlaceholder");
  setWorkspaceTab(workspaceTab);
  renderGuideChat();
  renderJobBoard();
  renderTaskBoard();
  renderEventLog();
  renderPalList();
  renderSettingsTab();
  renderDetail();
  setMessage(messageId);
}

function renderGuideChat() {
  const ul = document.getElementById("guideChat");
  ul.innerHTML = guideMessages
    .map((m) => {
      const text = (m.text && (m.text[locale] || m.text.ja)) || "";
      const escapedText = escapeHtml(text).replace(/\n/g, "<br>");
      let alignClass = "chat-start";
      let bubbleClass = "chat-bubble guide-bubble guide-bubble-guide";
      if (m.sender === "you") {
        alignClass = "chat-end";
        bubbleClass = "chat-bubble guide-bubble guide-bubble-user";
      } else if (m.sender === "system") {
        alignClass = "chat-center";
        bubbleClass = "chat-bubble guide-bubble guide-bubble-system";
      }
      return `<li class="chat ${alignClass}">
        <div class="chat-header text-xs text-base-content/60">${m.timestamp} / ${senderLabel(m.sender)}</div>
        <div class="${bubbleClass} max-w-[min(720px,100%)] text-sm leading-relaxed">${escapedText}</div>
      </li>`;
    })
    .join("");
  ul.scrollTop = ul.scrollHeight;
}

function buildGuideReply(userText) {
  const clipped = userText.length > 28 ? `${userText.slice(0, 28)}...` : userText;
  return {
    ja: `受け取りました。「${clipped}」を元に次のTask案を作成します。`,
    en: `Received. I will draft next tasks from "${clipped}".`,
  };
}

function sendGuideMessage() {
  const input = document.getElementById("guideInput");
  const text = input.value.trim();
  if (!text) {
    setMessage("MSG-PPH-1001");
    return;
  }
  const timestamp = formatNow().slice(11);
  guideMessages.push({
    timestamp,
    sender: "you",
    text: { ja: text, en: text },
  });
  guideMessages.push({
    timestamp: formatNow().slice(11),
    sender: "guide",
    text: buildGuideReply(text),
  });
  input.value = "";
  renderGuideChat();
  setMessage("MSG-PPH-0009");
}

function statusBadgeClass(status) {
  if (status === "to_gate") return "status-badge-attn";
  if (status === "rejected") return "status-badge-danger";
  return "status-badge-muted";
}

function taskActions(task) {
  const buttons = [
    `<button class="btn btn-xs btn-outline" data-action="detail" data-task-id="${task.id}">${tDyn("detail")}</button>`,
  ];
  if (task.status === "assigned") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="start" data-task-id="${task.id}">${tDyn("start")}</button>`
    );
  }
  if (task.status === "in_progress") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="submit" data-task-id="${task.id}">${tDyn("submit")}</button>`
    );
  }
  if (task.status === "to_gate") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="gate" data-task-id="${task.id}">${tDyn("gate")}</button>`
    );
  }
  if (task.status === "rejected") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="resubmit" data-task-id="${task.id}">${tDyn("resubmit")}</button>`
    );
  }
  return buttons.join("");
}

function renderTaskBoard() {
  const ul = document.getElementById("taskBoard");
  if (tasks.length === 0) {
    ul.innerHTML = `<li class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${tDyn("noTask")}</li>`;
    return;
  }
  ul.innerHTML = tasks
    .map((task) => {
      const selected = selectedTaskId === task.id
        ? "ring-2 ring-primary/40 border-primary/50"
        : "border-base-300";
      const statusText = tUi(STATUS_UI_ID[task.status]);
      return `<li class="rounded-box border ${selected} bg-base-100 p-3 shadow-sm mb-3">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold">${task.title}</span>
          <span class="badge ${statusBadgeClass(task.status)} badge-sm">${statusText}</span>
        </div>
        <div class="mt-2 grid gap-1 text-xs text-base-content/65">
          <span>${task.id} / ${task.palId}</span>
          <span>updated_at: ${task.updatedAt}</span>
          <span>gate: ${task.decisionSummary}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">${taskActions(task)}</div>
      </li>`;
    })
    .join("");
}

function jobActions(job) {
  const buttons = [];
  if (job.status === "assigned") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="start" data-job-id="${job.id}">${tDyn("start")}</button>`
    );
  }
  if (job.status === "in_progress") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="submit" data-job-id="${job.id}">${tDyn("submit")}</button>`
    );
  }
  if (job.status === "to_gate") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="gate" data-job-id="${job.id}">${tDyn("gate")}</button>`
    );
  }
  if (job.status === "rejected") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="resubmit" data-job-id="${job.id}">${tDyn("resubmit")}</button>`
    );
  }
  return buttons.join("");
}

function renderJobBoard() {
  const ul = document.getElementById("jobBoard");
  if (!ul) return;
  if (jobs.length === 0) {
    ul.innerHTML = `<li class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${tDyn("noJob")}</li>`;
    return;
  }
  ul.innerHTML = jobs
    .map((job) => {
      const statusText = tUi(STATUS_UI_ID[job.status]);
      return `<li data-job-row="${job.id}" class="rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold">${escapeHtml(job.title)}</span>
          <span class="badge ${statusBadgeClass(job.status)} badge-sm">${statusText}</span>
        </div>
        <div class="mt-2 grid gap-1 text-xs text-base-content/65">
          <span>${escapeHtml(job.id)} / ${escapeHtml(job.palId)}</span>
          <span>${escapeHtml(tDyn("schedule"))}: ${escapeHtml(job.schedule)}</span>
          <span>${escapeHtml(tDyn("lastRun"))}: ${escapeHtml(job.lastRunAt)}</span>
          <span>${escapeHtml(tDyn("instruction"))}: ${escapeHtml(job.instruction)}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">${jobActions(job)}</div>
      </li>`;
    })
    .join("");
}

function renderEventLog() {
  const ul = document.getElementById("eventLog");
  ul.innerHTML = events
    .map(
      (e) => `<li class="mb-2 rounded-box border border-base-300 bg-base-100 p-3">
      <div class="text-xs text-base-content/60">${e.timestamp} / ${e.eventType} / ${e.targetId} / ${e.result}</div>
      <div class="mt-1 text-sm">${e.summary[locale]}</div>
    </li>`
    )
    .join("");
}

function palStatusBadgeClass(status) {
  if (status === "paused") return "status-badge-attn";
  return "status-badge-muted";
}

function renderPalList() {
  const ul = document.getElementById("palList");
  if (!ul) return;
  syncSettingsModelsFromRegistry();
  syncPalProfilesRegistryRefs();

  const availableModels = settingsState.registeredModels.map((model) => model.name);
  const availableTools = [...settingsState.registeredTools];
  const availableSkills = [...settingsState.registeredSkills];
  const hasModelOptions = availableModels.length > 0;
  const hasToolOptions = availableTools.length > 0;

  const labels = locale === "ja"
    ? {
      assignedTasks: "割当タスク",
      role: "ロール",
      runtime: "ランタイム",
      runtimeModel: "モデル実行",
      runtimeTool: "CLI実行",
      runtimeType: "実行方式",
      runtimeTargetModel: "LLMモデル",
      runtimeTargetTool: "CLIツール",
      categoryName: "名前",
      categoryRuntime: "Runtime",
      categorySkills: "Skills",
      name: "表示名",
      save: "保存",
      addPal: "Palを追加",
      deletePal: "削除",
      addHint: "Settingsで登録済みのLLMモデル / CLIツール / Skillsのみ利用できます",
      noModels: "利用可能なLLMモデルがありません",
      noTools: "利用可能なCLIツールがありません",
      noProfiles: "Palがありません。追加してください。",
      noSkills: "利用可能なSkillsがありません",
      skillsModelOnly: "Skillsはモデル実行時のみ有効です",
    }
    : {
      assignedTasks: "assigned_tasks",
      role: "role",
      runtime: "runtime",
      runtimeModel: "Model Runtime",
      runtimeTool: "CLI Runtime",
      runtimeType: "Runtime Type",
      runtimeTargetModel: "LLM Model",
      runtimeTargetTool: "CLI Tool",
      categoryName: "Name",
      categoryRuntime: "Runtime",
      categorySkills: "Skills",
      name: "Name",
      save: "Save",
      addPal: "Add Pal",
      deletePal: "Delete",
      addHint: "Only models / CLI tools / skills registered in Settings can be used",
      noModels: "No LLM models available",
      noTools: "No CLI tools available",
      noProfiles: "No Pal profiles. Add one.",
      noSkills: "No skills available",
      skillsModelOnly: "Skills are enabled only in model runtime",
    };

  const addDisabled = !hasModelOptions && !hasToolOptions;
  const toolbar = `<li class="pal-toolbar rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3">
    <div class="text-xs text-base-content/65">${labels.addHint}</div>
    <button type="button" id="palAddProfile" class="btn btn-sm btn-outline"${addDisabled ? " disabled" : ""}>${labels.addPal}</button>
  </li>`;

  const bindAddProfileButton = () => {
    const addButton = ul.querySelector("#palAddProfile");
    if (!addButton) return;
    addButton.addEventListener("click", () => {
      if (!hasModelOptions && !hasToolOptions) {
        setMessage("MSG-PPH-1001");
        return;
      }
      const defaultModel = availableModels[0];
      const matchedModel = settingsState.registeredModels.find((model) => model.name === defaultModel);
      const defaultProvider = matchedModel?.provider || DEFAULT_PROVIDER_ID;
      const defaultTool = availableTools[0];
      const runtimeKind = hasModelOptions ? "model" : "tool";
      const workerRoleSkills = allowedSkillIdsForRole("worker")
        .filter((skillId) => availableSkills.includes(skillId));
      const defaultSkills = runtimeKind === "model" ? [...workerRoleSkills] : [];

      palProfiles.push({
        id: createWorkerPalId(),
        role: "worker",
        runtimeKind,
        displayName: "New Pal",
        persona: "Worker",
        provider: runtimeKind === "model" ? defaultProvider : "",
        models: runtimeKind === "model" && defaultModel ? [defaultModel] : [],
        cliTools: runtimeKind === "tool" && defaultTool ? [defaultTool] : [],
        skills: defaultSkills,
        status: "active",
      });
      setMessage("MSG-PPH-0007");
      renderPalList();
    });
  };

  if (palProfiles.length === 0) {
    ul.innerHTML = `${toolbar}
      <li id="palEmpty" class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${labels.noProfiles}</li>`;
    bindAddProfileButton();
    return;
  }

  const cards = palProfiles
    .map((pal) => {
      const taskCount = tasks.filter((task) => task.palId === pal.id).length;
      const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
      const selectedModel = hasModelOptions ? (pal.models[0] || availableModels[0]) : "";
      const selectedTool = hasToolOptions ? (pal.cliTools[0] || availableTools[0]) : "";
      const roleSelectableSkills = allowedSkillIdsForRole(pal.role)
        .filter((skillId) => availableSkills.includes(skillId));
      const hasRoleSkillOptions = roleSelectableSkills.length > 0;
      const runtimeTargetValue = runtimeKind === "model" ? selectedModel : selectedTool;
      const runtimeTargetLabel = runtimeKind === "model"
        ? labels.runtimeTargetModel
        : labels.runtimeTargetTool;

      const selectedSkills = runtimeKind === "model" && Array.isArray(pal.skills)
        ? pal.skills
          .map((skillId) => normalizeSkillId(skillId))
          .filter((skillId) => roleSelectableSkills.includes(skillId))
        : [];

      const modelOptions = hasModelOptions
        ? availableModels
          .map((model) => {
            const selected = model === selectedModel ? " selected" : "";
            return `<option value="${escapeHtml(model)}"${selected}>${escapeHtml(model)}</option>`;
          })
          .join("")
        : `<option value="" selected>${labels.noModels}</option>`;

      const toolOptions = hasToolOptions
        ? availableTools
          .map((tool) => {
            const selected = tool === selectedTool ? " selected" : "";
            return `<option value="${escapeHtml(tool)}"${selected}>${escapeHtml(tool)}</option>`;
          })
          .join("")
        : `<option value="" selected>${labels.noTools}</option>`;

      const runtimeTargetOptions = runtimeKind === "model" ? modelOptions : toolOptions;
      const runtimeTargetDisabled = runtimeKind === "model"
        ? (!hasModelOptions ? " disabled" : "")
        : (!hasToolOptions ? " disabled" : "");

      const runtimeOptions = `<option value="model"${runtimeKind === "model" ? " selected" : ""}>${labels.runtimeModel}</option>
        <option value="tool"${runtimeKind === "tool" ? " selected" : ""}>${labels.runtimeTool}</option>`;

      const runtimeTargetBadge = runtimeTargetValue
        ? `<span class="badge badge-outline badge-sm">${escapeHtml(runtimeTargetLabel)}: ${escapeHtml(runtimeTargetValue)}</span>`
        : "";

      const skillBadges = runtimeKind === "model" && selectedSkills.length > 0
        ? selectedSkills
          .map((skillId) => `<span class="badge badge-neutral badge-sm">${escapeHtml(skillName(skillId))}</span>`)
          .join("")
        : "";

      const providerText = runtimeKind === "model"
        ? escapeHtml(providerLabel(pal.provider))
        : "-";

      const skillOptions = hasRoleSkillOptions
        ? roleSelectableSkills
          .map((skillId) => {
            const skill = skillById(skillId);
            const checked = selectedSkills.includes(skillId) ? " checked" : "";
            const disabled = runtimeKind === "model" ? "" : " disabled";
            const skillLabel = skill?.name || skillId;
            const skillDescription = skill?.description || "";
            return `<label class="pal-skill-item">
              <input type="checkbox" class="checkbox checkbox-sm" data-pal-skill-checkbox="${escapeHtml(pal.id)}" value="${escapeHtml(skillId)}"${checked}${disabled} />
              <span class="pal-skill-text">
                <span class="text-xs font-medium">${escapeHtml(skillLabel)}</span>
                <span class="text-[11px] text-base-content/55">${escapeHtml(skillDescription)}</span>
              </span>
            </label>`;
          })
          .join("")
        : `<span class="text-xs text-base-content/60">${escapeHtml(labels.noSkills)}</span>`;

      return `<li data-pal-row="${escapeHtml(pal.id)}" class="rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3 pal-card">
        <div class="flex items-center justify-between gap-2">
          <div class="font-semibold">${escapeHtml(pal.displayName)} <span class="text-xs text-base-content/60">(${escapeHtml(pal.id)})</span></div>
          <span class="badge ${palStatusBadgeClass(pal.status)} badge-sm">${escapeHtml(pal.status)}</span>
        </div>
        <div class="text-xs text-base-content/65">${labels.role}: ${escapeHtml(palRoleLabel(pal.role))} / ${labels.runtime}: ${escapeHtml(runtimeKind === "model" ? labels.runtimeModel : labels.runtimeTool)} / provider: ${providerText}</div>
        <div class="text-xs text-base-content/65">${labels.assignedTasks}: ${taskCount}</div>
        <div class="pal-models">${runtimeTargetBadge}${skillBadges}</div>

        <div class="pal-category">
          <div class="pal-category-title">${labels.categoryName}</div>
          <label class="field">
            <span class="label-text text-xs text-base-content/70">${labels.name}</span>
            <input type="text" class="input input-bordered input-sm" data-pal-name-input="${escapeHtml(pal.id)}" value="${escapeHtml(pal.displayName)}" />
          </label>
        </div>

        <div class="pal-category">
          <div class="pal-category-title">${labels.categoryRuntime}</div>
          <div class="pal-runtime-row">
            <label class="field">
              <span class="label-text text-xs text-base-content/70">${labels.runtimeType}</span>
              <select class="select select-bordered select-sm" data-pal-runtime-select="${escapeHtml(pal.id)}">${runtimeOptions}</select>
            </label>
            <label class="field">
              <span class="label-text text-xs text-base-content/70">${escapeHtml(runtimeTargetLabel)}</span>
              <select class="select select-bordered select-sm" data-pal-runtime-target-select="${escapeHtml(pal.id)}"${runtimeTargetDisabled}>${runtimeTargetOptions}</select>
            </label>
          </div>
        </div>

        <div class="pal-category">
          <div class="pal-category-title">${labels.categorySkills}</div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs text-base-content/50">${escapeHtml(labels.skillsModelOnly)}</span>
          </div>
          <div class="pal-skill-grid">${skillOptions}</div>
        </div>

        <div class="pal-actions">
          <button type="button" class="btn btn-xs btn-primary" data-pal-save-id="${escapeHtml(pal.id)}">${labels.save}</button>
          <button type="button" class="btn btn-xs btn-error btn-outline" data-pal-delete-id="${escapeHtml(pal.id)}">${labels.deletePal}</button>
        </div>
      </li>`;
    })
    .join("");

  ul.innerHTML = `${toolbar}${cards}`;
  bindAddProfileButton();

  ul.querySelectorAll("[data-pal-runtime-select]").forEach((select) => {
    select.addEventListener("change", () => {
      const palId = select.getAttribute("data-pal-runtime-select");
      const pal = palProfiles.find((item) => item.id === palId);
      if (!pal) return;
      pal.runtimeKind = normalizePalRuntimeKind(select.value);
      renderPalList();
    });
  });

  ul.querySelectorAll("[data-pal-save-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const palId = btn.getAttribute("data-pal-save-id");
      const pal = palProfiles.find((item) => item.id === palId);
      if (!pal) {
        setMessage("MSG-PPH-1004");
        return;
      }

      const nameInput = ul.querySelector(`[data-pal-name-input="${palId}"]`);
      const runtimeSelect = ul.querySelector(`[data-pal-runtime-select="${palId}"]`);
      const runtimeTargetSelect = ul.querySelector(`[data-pal-runtime-target-select="${palId}"]`);
      const skillCheckboxes = ul.querySelectorAll(`[data-pal-skill-checkbox="${palId}"]`);

      const nextName = nameInput ? nameInput.value.trim() : "";
      const nextRuntime = runtimeSelect
        ? normalizePalRuntimeKind(runtimeSelect.value)
        : normalizePalRuntimeKind(pal.runtimeKind);
      const nextRuntimeTarget = runtimeTargetSelect ? runtimeTargetSelect.value : "";
      const nextModel = nextRuntime === "model" ? nextRuntimeTarget : "";
      const nextTool = nextRuntime === "tool" ? normalizeToolName(nextRuntimeTarget) : "";
      const roleSelectableSkills = allowedSkillIdsForRole(pal.role)
        .filter((skillId) => availableSkills.includes(skillId));
      const nextSkills = nextRuntime === "model"
        ? Array.from(skillCheckboxes)
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => normalizeSkillId(checkbox.value))
          .filter((skillId, index, list) =>
            skillId && list.indexOf(skillId) === index && roleSelectableSkills.includes(skillId))
        : [];

      if (!nextName) {
        setMessage("MSG-PPH-1001");
        return;
      }
      if (nextRuntime === "model" && (!nextModel || !hasModelOptions)) {
        setMessage("MSG-PPH-1001");
        return;
      }
      if (nextRuntime === "tool" && (!nextTool || !hasToolOptions)) {
        setMessage("MSG-PPH-1001");
        return;
      }

      pal.displayName = nextName;
      pal.runtimeKind = nextRuntime;
      if (nextRuntime === "model") {
        pal.models = [nextModel];
        pal.cliTools = [];
        pal.skills = nextSkills;
        const matchedModel = settingsState.registeredModels.find((model) => model.name === nextModel);
        pal.provider = matchedModel?.provider || "";
      } else {
        pal.models = [];
        pal.cliTools = [nextTool];
        pal.skills = [];
        pal.provider = "";
      }

      setMessage("MSG-PPH-0007");
      renderPalList();
    });
  });

  ul.querySelectorAll("[data-pal-delete-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const palId = btn.getAttribute("data-pal-delete-id");
      const hasAssignment = tasks.some((task) => task.palId === palId) || jobs.some((job) => job.palId === palId);
      if (hasAssignment) {
        setMessage("MSG-PPH-1006");
        return;
      }
      const index = palProfiles.findIndex((item) => item.id === palId);
      if (index < 0) {
        setMessage("MSG-PPH-1004");
        return;
      }
      palProfiles.splice(index, 1);
      setMessage("MSG-PPH-0007");
      renderPalList();
    });
  });
}

function syncPalProfilesFromSettings() {
  syncSettingsModelsFromRegistry();
  syncPalProfilesRegistryRefs();
  renderPalList();
}

function renderSettingsTab() {
  const root = document.getElementById("settingsTabContent");
  if (!root) return;

  syncSettingsModelsFromRegistry();
  const isJa = locale === "ja";
  const labels = isJa
    ? {
      language: "Language",
      languageHint: "表示言語",
      languageSection: "Language",
      modelSection: "モデル / CLI / Skills",
      modelSectionHint: "登録・追加・保存",
      models: "LLM models",
      tools: "CLI tools",
      skillSection: "Model Runtime Skills",
      skillSectionHint: "モデル実行時に利用可能。Palごとに有効化できます",
      skillCatalogHint: "ClawHub を検索してスキルをダウンロード",
      skillSearchPlaceholder: "ClawHubで検索（例: browser, file, test）",
      skillSearchEmpty: "ClawHubに一致するSkillはありません",
      skillOpenSite: "ClawHubを開く",
      skillDownload: "Download",
      skillInstalled: "Installed",
      noModels: "モデルはありません",
      noTools: "CLIツールはありません",
      noSkills: "Skillはありません",
      addOpen: "項目を追加",
      addClose: "追加フォームを閉じる",
      add: "追加",
      cancel: "キャンセル",
      save: "設定を保存",
      summary: "models",
      summaryTools: "tools",
      summarySkills: "skills",
      selectedModels: "selected_models",
      modelPlaceholder: "モデル名 (例: gpt-4.1)",
    }
    : {
      language: "Language",
      languageHint: "Display language",
      languageSection: "Language",
      modelSection: "Model / CLI / Skills",
      modelSectionHint: "Register / Add / Save",
      models: "models",
      tools: "cli tools",
      skillSection: "Model Runtime Skills",
      skillSectionHint: "Mounted on model runtime, selectable per Pal",
      skillCatalogHint: "Search on ClawHub and download skills",
      skillSearchPlaceholder: "Search on ClawHub (ex: browser, file, test)",
      skillSearchEmpty: "No matching skills on ClawHub",
      skillOpenSite: "Open ClawHub",
      skillDownload: "Download",
      skillInstalled: "Installed",
      noModels: "No models registered",
      noTools: "No CLI tools registered",
      noSkills: "No skills registered",
      addOpen: "Add item",
      addClose: "Close add form",
      add: "Add",
      cancel: "Cancel",
      save: "Save Settings",
      summary: "models",
      summaryTools: "tools",
      summarySkills: "skills",
      selectedModels: "selected_models",
      modelPlaceholder: "Model name (ex: gpt-4.1)",
    };
  const noSkillsLabel = labels.noSkills || "No skills registered";
  const skillSectionLabel = labels.skillSection || "Model Runtime Skills";
  const skillSectionHintLabel =
    labels.skillSectionHint || "Mounted on model runtime, selectable per Pal";
  const skillCatalogHintLabel =
    labels.skillCatalogHint || "Search on ClawHub and download skills";
  const skillSearchPlaceholderLabel =
    labels.skillSearchPlaceholder || "Search on ClawHub";
  const summarySkillsLabel = labels.summarySkills || "skills";

  const providerOptions = PALPAL_CORE_PROVIDER_REGISTRY
    .map((provider) => {
      const selected = provider.id === settingsState.itemDraft.provider ? " selected" : "";
      return `<option value="${escapeHtml(provider.id)}"${selected}>${escapeHtml(provider.label)}</option>`;
    })
    .join("");
  const cliToolOptions = CLI_TOOL_OPTIONS
    .map((tool) => {
      const selected = tool === settingsState.itemDraft.toolName ? " selected" : "";
      return `<option value="${escapeHtml(tool)}"${selected}>${escapeHtml(tool)}</option>`;
    })
    .join("");
  const clawHubMatches = searchClawHubSkills(settingsState.skillSearchQuery);

  const modelList = settingsState.registeredModels.length === 0
    ? `<li id="settingsTabModelEmpty" class="text-xs text-base-content/60">${labels.noModels}</li>`
    : settingsState.registeredModels
      .map((model, index) => `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-primary badge-sm">Model</span>
          <span class="badge badge-outline badge-sm">${escapeHtml(model.name)}</span>
          <span class="text-xs text-base-content/70">${escapeHtml(providerLabel(model.provider))}</span>
          ${model.baseUrl ? `<span class="text-xs text-base-content/60">base_url: ${escapeHtml(model.baseUrl)}</span>` : ""}
        </div>
        <button class="btn btn-ghost btn-xs" data-remove-model-index="${index}" type="button">${isJa ? "蜑企勁" : "Remove"}</button>
      </li>`)
      .join("");

  const toolList = settingsState.registeredTools.length === 0
    ? `<li id="settingsTabToolEmpty" class="text-xs text-base-content/60">${labels.noTools}</li>`
    : settingsState.registeredTools
      .map((tool, index) => `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-accent badge-sm">CLI</span>
          <span class="badge badge-ghost badge-sm">${escapeHtml(tool)}</span>
        </div>
        <button class="btn btn-ghost btn-xs" data-remove-tool-index="${index}" type="button">${isJa ? "蜑企勁" : "Remove"}</button>
      </li>`)
      .join("");

  const skillList = settingsState.registeredSkills.length === 0
    ? `<li id="settingsTabSkillEmpty" class="text-xs text-base-content/60">${escapeHtml(noSkillsLabel)}</li>`
    : settingsState.registeredSkills
      .map((skillId) => {
        const skill = skillById(skillId);
        const name = skill?.name || skillId;
        const description = skill?.description || "";
        return `<li class="settings-model-row">
          <div class="settings-model-meta">
            <span class="badge badge-neutral badge-sm">Skill</span>
            <span class="badge badge-outline badge-sm">${escapeHtml(name)}</span>
            ${description ? `<span class="text-xs text-base-content/60">${escapeHtml(description)}</span>` : ""}
          </div>
          <button class="btn btn-ghost btn-xs" data-remove-skill-id="${escapeHtml(skillId)}" type="button">${isJa ? "削除" : "Remove"}</button>
        </li>`;
      })
      .join("");
  const clawHubSkillList = clawHubMatches.length === 0
    ? `<li id="settingsTabClawHubEmpty" class="text-xs text-base-content/60">${escapeHtml(labels.skillSearchEmpty || "No matching skills on ClawHub")}</li>`
    : clawHubMatches
      .map((skill) => {
        const installed = settingsState.registeredSkills.includes(skill.id);
        return `<li class="settings-model-row settings-skill-market-row">
          <div class="settings-model-meta">
            <span class="badge badge-secondary badge-sm">${escapeHtml(skill.source || "ClawHub")}</span>
            <span class="badge badge-outline badge-sm">${escapeHtml(skill.name)}</span>
            ${skill.description ? `<span class="text-xs text-base-content/60">${escapeHtml(skill.description)}</span>` : ""}
            <span class="text-[11px] text-base-content/50">${escapeHtml(skill.packageName)}</span>
          </div>
          ${installed
    ? `<span class="badge badge-success badge-sm">${escapeHtml(labels.skillInstalled || "Installed")}</span>`
    : `<button class="btn btn-outline btn-xs" data-clawhub-download-skill="${escapeHtml(skill.id)}" type="button">${escapeHtml(labels.skillDownload || "Download")}</button>`}
        </li>`;
      })
      .join("");

  const modelOptions = MODEL_OPTIONS
    .map((modelName) => {
      const selected = modelName === settingsState.itemDraft.modelName ? " selected" : "";
      return `<option value="${escapeHtml(modelName)}"${selected}>${escapeHtml(modelName)}</option>`;
    })
    .join("");
  const addItemFields = settingsState.itemDraft.type === "model"
    ? `<select id="settingsTabModelProvider" class="select select-bordered select-sm">${providerOptions}</select>
       <select id="settingsTabModelName" class="select select-bordered select-sm">${modelOptions}</select>
       <input id="settingsTabModelApiKey" type="password" class="input input-bordered input-sm" placeholder="api_key (required)" value="${escapeHtml(settingsState.itemDraft.apiKey)}" required />
       <input id="settingsTabModelBaseUrl" type="text" class="input input-bordered input-sm" placeholder="base_url (optional)" value="${escapeHtml(settingsState.itemDraft.baseUrl)}" />`
    : `<select id="settingsTabToolName" class="select select-bordered select-sm">${cliToolOptions}</select>`;

  const addModelForm = settingsState.itemAddOpen
    ? `<div id="settingsTabAddModelRow" class="settings-add-model-row">
        <select id="settingsTabEntryType" class="select select-bordered select-sm">
          <option value="model"${settingsState.itemDraft.type === "model" ? " selected" : ""}>Model</option>
          <option value="tool"${settingsState.itemDraft.type === "tool" ? " selected" : ""}>CLI Tool</option>
        </select>
        ${addItemFields}
        <button id="settingsTabAddItemSubmit" class="btn btn-sm btn-outline" type="button">${labels.add}</button>
        <button id="settingsTabCancelAddItem" class="btn btn-sm btn-ghost" type="button">${labels.cancel}</button>
      </div>`
    : "";

  root.innerHTML = `<div class="settings-shell">
    <section class="settings-section">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.languageSection}</h3>
        <p class="settings-section-sub">${labels.languageHint}</p>
      </div>
      <div class="field settings-locale-row">
        <div class="settings-locale-meta">
          <label class="label-text text-xs text-base-content/70">${labels.language}</label>
          <span class="text-xs text-base-content/60">${labels.languageHint}</span>
        </div>
        <div class="join settings-locale-actions" role="group" aria-label="${labels.language}">
          <button id="settingsLocaleJa" type="button" class="btn btn-sm join-item ${locale === "ja" ? "btn-primary" : "btn-ghost"}">JA</button>
          <button id="settingsLocaleEn" type="button" class="btn btn-sm join-item ${locale === "en" ? "btn-primary" : "btn-ghost"}">EN</button>
        </div>
      </div>
    </section>
    <section class="settings-section">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.modelSection}</h3>
        <p class="settings-section-sub">${labels.modelSectionHint}</p>
      </div>
      <div class="settings-columns">
        <div class="field">
          <label class="label-text text-xs text-base-content/70">${labels.models}</label>
          <ul id="settingsTabModelList" class="settings-model-list">${modelList}</ul>
        </div>
        <div class="field">
          <label class="label-text text-xs text-base-content/70">${labels.tools}</label>
          <ul id="settingsTabToolList" class="settings-model-list">${toolList}</ul>
        </div>
        <div class="field">
          <label class="label-text text-xs text-base-content/70">${skillSectionLabel}</label>
          <ul id="settingsTabSkillList" class="settings-model-list">${skillList}</ul>
          <span class="text-xs text-base-content/60">${skillSectionHintLabel}</span>
          <div class="settings-skill-market-head">
            <input
              id="settingsTabSkillSearch"
              type="search"
              class="input input-bordered input-sm"
              placeholder="${escapeHtml(skillSearchPlaceholderLabel)}"
              value="${escapeHtml(settingsState.skillSearchQuery)}"
            />
            <a
              id="settingsTabOpenClawHub"
              class="btn btn-sm btn-outline"
              href="${CLAWHUB_SITE_URL}"
              target="_blank"
              rel="noreferrer noopener"
            >${escapeHtml(labels.skillOpenSite || "Open ClawHub")}</a>
          </div>
          <span class="text-xs text-base-content/60">${escapeHtml(skillCatalogHintLabel)}</span>
          <ul id="settingsTabClawHubList" class="settings-model-list settings-skill-market-list">${clawHubSkillList}</ul>
        </div>
      </div>
      <div class="settings-inline">
        <button id="settingsTabOpenAddItem" class="btn btn-sm btn-outline" type="button">${settingsState.itemAddOpen ? labels.addClose : labels.addOpen}</button>
        <span class="text-xs text-base-content/65">${labels.summary}: <strong>${settingsState.registeredModels.length}</strong> / ${labels.summaryTools}: <strong>${settingsState.registeredTools.length}</strong> / ${summarySkillsLabel}: <strong>${settingsState.registeredSkills.length}</strong></span>
      </div>
      ${addModelForm}
      <div class="field settings-save-row">
        <span class="text-xs text-base-content/65">${labels.selectedModels}: <strong>${settingsState.models.length}</strong></span>
        <button id="settingsTabSave" class="btn btn-sm btn-primary" type="button">${labels.save}</button>
      </div>
    </section>
  </div>`;

  const localeJaEl = document.getElementById("settingsLocaleJa");
  const localeEnEl = document.getElementById("settingsLocaleEn");
  const openAddModelEl = document.getElementById("settingsTabOpenAddItem");
  const entryTypeEl = document.getElementById("settingsTabEntryType");
  const addModelSubmitEl = document.getElementById("settingsTabAddItemSubmit");
  const cancelAddModelEl = document.getElementById("settingsTabCancelAddItem");
  const modelNameEl = document.getElementById("settingsTabModelName");
  const modelProviderEl = document.getElementById("settingsTabModelProvider");
  const modelBaseUrlEl = document.getElementById("settingsTabModelBaseUrl");
  const modelApiKeyEl = document.getElementById("settingsTabModelApiKey");
  const toolNameEl = document.getElementById("settingsTabToolName");
  const skillSearchEl = document.getElementById("settingsTabSkillSearch");
  const saveEl = document.getElementById("settingsTabSave");

  if (localeJaEl) {
    localeJaEl.addEventListener("click", () => {
      if (locale !== "ja") {
        locale = "ja";
        applyI18n();
      }
    });
  }
  if (localeEnEl) {
    localeEnEl.addEventListener("click", () => {
      if (locale !== "en") {
        locale = "en";
        applyI18n();
      }
    });
  }

  if (openAddModelEl) {
    openAddModelEl.addEventListener("click", () => {
      settingsState.itemAddOpen = !settingsState.itemAddOpen;
      if (!settingsState.itemAddOpen) {
        settingsState.itemDraft.modelName = DEFAULT_MODEL_NAME;
        settingsState.itemDraft.apiKey = "";
        settingsState.itemDraft.baseUrl = "";
        settingsState.itemDraft.endpoint = "";
      }
      renderSettingsTab();
    });
  }

  if (entryTypeEl) {
    entryTypeEl.addEventListener("change", () => {
      settingsState.itemDraft.type = entryTypeEl.value === "tool" ? "tool" : "model";
      renderSettingsTab();
    });
  }
  if (modelNameEl) {
    modelNameEl.addEventListener("change", () => {
      settingsState.itemDraft.modelName = modelNameEl.value;
    });
  }
  if (modelProviderEl) {
    modelProviderEl.addEventListener("change", () => {
      settingsState.itemDraft.provider = providerIdFromInput(modelProviderEl.value);
    });
  }
  if (modelBaseUrlEl) {
    modelBaseUrlEl.addEventListener("input", () => {
      settingsState.itemDraft.baseUrl = modelBaseUrlEl.value;
    });
  }
  if (modelApiKeyEl) {
    modelApiKeyEl.addEventListener("input", () => {
      settingsState.itemDraft.apiKey = modelApiKeyEl.value;
    });
  }
  if (toolNameEl) {
    toolNameEl.addEventListener("change", () => {
      settingsState.itemDraft.toolName = normalizeToolName(toolNameEl.value);
    });
  }
  if (skillSearchEl) {
    skillSearchEl.addEventListener("input", () => {
      settingsState.skillSearchQuery = skillSearchEl.value;
      renderSettingsTab();
    });
  }
  if (cancelAddModelEl) {
    cancelAddModelEl.addEventListener("click", () => {
      settingsState.itemAddOpen = false;
      settingsState.itemDraft.modelName = DEFAULT_MODEL_NAME;
      settingsState.itemDraft.apiKey = "";
      settingsState.itemDraft.baseUrl = "";
      settingsState.itemDraft.endpoint = "";
      renderSettingsTab();
    });
  }

  const addModel = () => {
    if (settingsState.itemDraft.type === "tool") {
      const toolName = normalizeToolName(settingsState.itemDraft.toolName);
      if (settingsState.registeredTools.includes(toolName)) {
        setMessage("MSG-PPH-1001");
        return;
      }
      settingsState.registeredTools.push(toolName);
      settingsState.itemAddOpen = false;
      renderSettingsTab();
      return;
    }

    const next = normalizeRegisteredModel({
      name: settingsState.itemDraft.modelName,
      provider: settingsState.itemDraft.provider,
      apiKey: settingsState.itemDraft.apiKey,
      baseUrl: settingsState.itemDraft.baseUrl,
      endpoint: settingsState.itemDraft.endpoint,
    });
    if (!next.name) {
      setMessage("MSG-PPH-1001");
      return;
    }
    if (!next.apiKey) {
      setMessage("MSG-PPH-1001");
      return;
    }
    const isDuplicate = settingsState.registeredModels.some(
      (model) => model.name.toLowerCase() === next.name.toLowerCase()
    );
    if (isDuplicate) {
      setMessage("MSG-PPH-1001");
      return;
    }
    settingsState.registeredModels.push(next);
    if (!MODEL_OPTIONS.includes(next.name)) MODEL_OPTIONS.push(next.name);
    settingsState.itemDraft.modelName = DEFAULT_MODEL_NAME;
    settingsState.itemDraft.provider = next.provider;
    settingsState.itemDraft.apiKey = "";
    settingsState.itemDraft.baseUrl = "";
    settingsState.itemDraft.endpoint = "";
    settingsState.itemAddOpen = false;
    renderSettingsTab();
  };

  if (addModelSubmitEl) {
    addModelSubmitEl.addEventListener("click", addModel);
  }
  if (modelNameEl) {
    modelNameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addModel();
      }
    });
  }

  root.querySelectorAll("[data-remove-model-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-remove-model-index"));
      if (Number.isNaN(index)) return;
      settingsState.registeredModels.splice(index, 1);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-remove-tool-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-remove-tool-index"));
      if (Number.isNaN(index)) return;
      settingsState.registeredTools.splice(index, 1);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-remove-skill-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const skillId = normalizeSkillId(btn.getAttribute("data-remove-skill-id"));
      if (!skillId) return;
      settingsState.registeredSkills = settingsState.registeredSkills.filter((id) => id !== skillId);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-clawhub-download-skill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const skillId = normalizeSkillId(btn.getAttribute("data-clawhub-download-skill"));
      if (!skillId) {
        setMessage("MSG-PPH-1001");
        return;
      }
      if (settingsState.registeredSkills.includes(skillId)) {
        setMessage("MSG-PPH-1006");
        return;
      }
      settingsState.registeredSkills.push(skillId);
      setMessage("MSG-PPH-0007");
      renderSettingsTab();
    });
  });

  if (saveEl) {
    saveEl.addEventListener("click", () => {
      if (settingsState.registeredModels.length === 0 && settingsState.registeredTools.length === 0) {
        setMessage("MSG-PPH-1001");
        return;
      }
      syncPalProfilesFromSettings();
      setMessage("MSG-PPH-0007");
    });
  }
}

function selectedTask() {
  return tasks.find((t) => t.id === selectedTaskId) || null;
}

function renderDetail() {
  const drawer = document.getElementById("detailDrawer");
  const body = document.getElementById("detailBody");
  const task = selectedTask();
  if (!task || workspaceTab !== "task") {
    drawer.classList.add("hidden");
    body.innerHTML = "";
    return;
  }
  drawer.classList.remove("hidden");
  body.innerHTML = `<div class="grid gap-3">
    <div class="rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("selectedTask")}</span>
      <div><strong>${task.id}</strong> / ${task.title}</div>
    </div>
    <div class="rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("description")}</span>
      <div>${task.description}</div>
    </div>
    <div class="rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("constraints")}</span>
      <div>${task.constraintsCheckResult}</div>
    </div>
    <div class="rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("evidence")}</span>
      <div>${task.evidence}</div>
      <span class="mt-2 inline-block text-xs text-base-content/60">${tDyn("replay")}</span>
      <div>${task.replay}</div>
    </div>
    <div class="rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("fixCondition")}</span>
      <div>${task.fixCondition}</div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-sm btn-outline" id="detailStart">${tDyn("start")}</button>
      <button class="btn btn-sm btn-outline" id="detailSubmit">${tDyn("submit")}</button>
      <button class="btn btn-sm btn-outline" id="detailResubmit">${tDyn("resubmit")}</button>
      <button class="btn btn-sm btn-primary" id="detailGate">${tDyn("openGate")}</button>
    </div>
  </div>`;
  bindDetailButtons(task);
}

function bindDetailButtons(task) {
  const start = document.getElementById("detailStart");
  const submit = document.getElementById("detailSubmit");
  const resubmit = document.getElementById("detailResubmit");
  const gate = document.getElementById("detailGate");
  start.disabled = task.status !== "assigned";
  submit.disabled = task.status !== "in_progress";
  resubmit.disabled = task.status !== "rejected";
  gate.disabled = task.status !== "to_gate";
  start.onclick = () => runTaskAction("start", task.id);
  submit.onclick = () => runTaskAction("submit", task.id);
  resubmit.onclick = () => runTaskAction("resubmit", task.id);
  gate.onclick = () => openGate(task.id, "task");
}

function touchTask(task, status, decisionSummary, fixCondition) {
  task.status = status;
  task.decisionSummary = decisionSummary ?? task.decisionSummary;
  task.fixCondition = fixCondition ?? task.fixCondition;
  task.updatedAt = formatNow();
}

function touchJob(job, status, decisionSummary, fixCondition) {
  job.status = status;
  job.decisionSummary = decisionSummary ?? job.decisionSummary;
  job.fixCondition = fixCondition ?? job.fixCondition;
  job.updatedAt = formatNow();
  if (status === "in_progress") job.lastRunAt = formatNow();
}

function runTaskAction(action, taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    setMessage("MSG-PPH-1004");
    return;
  }
  selectedTaskId = taskId;
  if (action === "detail") {
    renderDetail();
    return;
  }
  if (action === "start") {
    if (task.status !== "assigned") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchTask(task, "in_progress", "working");
    appendEvent("task", task.id, "in_progress", `${task.id} 繧貞ｮ溯｡御ｸｭ縺ｸ驕ｷ遘ｻ`, `${task.id} moved to in_progress`);
    setMessage("MSG-PPH-0007");
  } else if (action === "submit") {
    if (task.status !== "in_progress") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchTask(task, "to_gate", "pending");
    appendEvent("task", task.id, "to_gate", `${task.id} 繧竪ate謠仙・蠕・■縺ｫ譖ｴ譁ｰ`, `${task.id} moved to to_gate`);
    setMessage("MSG-PPH-0003");
  } else if (action === "gate") {
    openGate(task.id, "task");
    return;
  } else if (action === "resubmit") {
    if (task.status !== "rejected") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchTask(task, "to_gate", "pending", "-");
    appendEvent("resubmit", task.id, "ok", `${task.id} 繧貞・謠仙・`, `${task.id} resubmitted`);
    setMessage("MSG-PPH-0005");
  }
  rerenderAll();
}

function runJobAction(action, jobId) {
  const job = jobs.find((x) => x.id === jobId);
  if (!job) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (action === "start") {
    if (job.status !== "assigned") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchJob(job, "in_progress", "working");
    appendEvent("job", job.id, "in_progress", `${job.id} 繧貞ｮ溯｡御ｸｭ縺ｸ驕ｷ遘ｻ`, `${job.id} moved to in_progress`);
    setMessage("MSG-PPH-0007");
  } else if (action === "submit") {
    if (job.status !== "in_progress") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchJob(job, "to_gate", "pending");
    appendEvent("job", job.id, "to_gate", `${job.id} 繧竪ate謠仙・蠕・■縺ｫ譖ｴ譁ｰ`, `${job.id} moved to to_gate`);
    setMessage("MSG-PPH-0003");
  } else if (action === "gate") {
    openGate(job.id, "job");
    return;
  } else if (action === "resubmit") {
    if (job.status !== "rejected") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchJob(job, "to_gate", "pending", "-");
    appendEvent("resubmit", job.id, "ok", `${job.id} 繧貞・謠仙・`, `${job.id} resubmitted`);
    setMessage("MSG-PPH-0005");
  }
  rerenderAll();
}

function findGateTarget() {
  if (!gateTarget) return null;
  if (gateTarget.kind === "job") {
    return jobs.find((job) => job.id === gateTarget.id) || null;
  }
  return tasks.find((task) => task.id === gateTarget.id) || null;
}

function openGate(targetId, targetKind = "task") {
  const collection = targetKind === "job" ? jobs : tasks;
  const target = collection.find((item) => item.id === targetId);
  if (!target) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (target.status !== "to_gate") {
    setMessage("MSG-PPH-1006");
    return;
  }
  gateTarget = { kind: targetKind, id: targetId };
  document.getElementById("gateReason").value = "";
  document.getElementById("gatePanel").classList.remove("hidden");
}

function closeGate() {
  gateTarget = null;
  document.getElementById("gatePanel").classList.add("hidden");
}

function runGate(decision) {
  const target = findGateTarget();
  if (!target) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (target.status !== "to_gate") {
    setMessage("MSG-PPH-1006");
    return;
  }
  const isJob = gateTarget?.kind === "job";
  const reason = document.getElementById("gateReason").value.trim();
  if (decision === "reject") {
    const count = reason
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter(Boolean).length;
    if (count > 3) {
      setMessage("MSG-PPH-1007");
      return;
    }
    if (isJob) {
      touchJob(target, "rejected", "rejected", reason || "菫ｮ豁｣譚｡莉ｶ繧定ｿｽ蜉");
    } else {
      touchTask(target, "rejected", "rejected", reason || "菫ｮ豁｣譚｡莉ｶ繧定ｿｽ蜉");
    }
    appendEvent("gate", target.id, "rejected", `${target.id} を差し戻しました`, `${target.id} rejected`);
  } else {
    if (isJob) {
      touchJob(target, "done", "approved", "-");
    } else {
      touchTask(target, "done", "approved", "-");
    }
    appendEvent("gate", target.id, "approved", `${target.id} を承認しました`, `${target.id} approved`);
  }
  setMessage("MSG-PPH-0004");
  closeGate();
  if (!isJob && tasks.every((t) => t.status === "done")) {
    appendEvent("plan", "PLAN-001", "completed", "Plan螳御ｺ・ｒ騾夂衍", "Plan completion announced");
    setMessage("MSG-PPH-0008");
  }
  rerenderAll();
}

function rerenderAll() {
  renderJobBoard();
  renderTaskBoard();
  renderEventLog();
  renderPalList();
  renderSettingsTab();
  renderDetail();
}

function bindStaticEvents() {
  document.querySelector(".workspace-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn[data-tab]");
    if (!btn) return;
    setWorkspaceTab(btn.dataset.tab);
  });

  document.getElementById("closeDrawer").onclick = () => {
    selectedTaskId = null;
    renderDetail();
  };

  document.getElementById("closeGate").onclick = closeGate;
  document.getElementById("approveTask").onclick = () => runGate("approve");
  document.getElementById("rejectTask").onclick = () => runGate("reject");
  const errorToastClose = document.getElementById("errorToastClose");
  if (errorToastClose) {
    errorToastClose.onclick = () => hideErrorToast();
  }

  document.getElementById("taskBoard").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;
    runTaskAction(button.dataset.action, button.dataset.taskId);
  });

  document.getElementById("jobBoard").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-job-action]");
    if (!button) return;
    runJobAction(button.dataset.jobAction, button.dataset.jobId);
  });

  document.getElementById("guideComposer").addEventListener("submit", (e) => {
    e.preventDefault();
    sendGuideMessage();
  });

  document.getElementById("guideInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendGuideMessage();
    }
  });

  document.getElementById("gatePanel").addEventListener("click", (e) => {
    if (e.target.id === "gatePanel") {
      closeGate();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeGate();
    hideErrorToast();
  });
}

function init() {
  selectedTaskId = tasks[0].id;
  setWorkspaceTab("guide");
  bindStaticEvents();
  applyI18n();
}

init();


