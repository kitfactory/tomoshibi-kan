function normalizeText(value) {
  return String(value || "").trim();
}

function safeStringify(value, fallback = "{}") {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

function resolveWindowBridge(nextName, legacyName) {
  if (typeof window === "undefined") return null;
  return window[nextName] || window[legacyName] || null;
}

function readLocalStorageSnapshot(primaryKey, legacyKeys = []) {
  if (typeof window === "undefined" || !window.localStorage) return null;
  for (const key of [primaryKey, ...legacyKeys]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return raw;
    } catch (error) {
      return null;
    }
  }
  return null;
}

function writeLocalStorageSnapshot(primaryKey, payload) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(primaryKey, payload);
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function buildClawHubSkillUrl(skillId) {
  const normalized = normalizeGenericSkillId(skillId) || normalizeText(skillId);
  if (!normalized) return `${CLAWHUB_WEB_BASE_URL}/skills`;
  if (STANDARD_SKILL_IDS.includes(normalized)) {
    const searchParams = new URLSearchParams({
      sort: "downloads",
      nonSuspicious: "true",
      q: normalized,
    });
    return `${CLAWHUB_WEB_BASE_URL}/skills?${searchParams.toString()}`;
  }
  return `${CLAWHUB_WEB_BASE_URL}/skills/${encodeURIComponent(normalized)}`;
}

function resolveExternalLinkApi() {
  const bridge = resolveWindowBridge("TomoshibikanExternal", "PalpalExternal");
  return bridge && typeof bridge.openUrl === "function" ? bridge : null;
}

async function openExternalUrlWithFallback(url) {
  const target = normalizeText(url);
  if (!target) return false;
  const externalApi = resolveExternalLinkApi();
  if (externalApi) {
    try {
      const opened = await externalApi.openUrl(target);
      if (opened) return true;
    } catch (error) {
      // fallback below
    }
  }
  if (typeof window !== "undefined" && typeof window.open === "function") {
    window.open(target, "_blank", "noopener,noreferrer");
    return true;
  }
  return false;
}

function normalizeSearchKeyword(value) {
  const normalized = normalizeText(value);
  if (!normalized) return "";
  try {
    return normalized.normalize("NFKC").toLowerCase();
  } catch (error) {
    return normalized.toLowerCase();
  }
}

function buildModelOptionList(catalogEntries, extraNames = []) {
  const seen = new Set();
  const result = [];
  const push = (value) => {
    const normalized = normalizeText(value);
    const dedupeKey = normalized.toLowerCase();
    if (!normalized || seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    result.push(normalized);
  };
  if (Array.isArray(catalogEntries)) {
    catalogEntries.forEach((entry) => {
      if (typeof entry === "string") {
        push(entry);
        return;
      }
      if (entry && typeof entry === "object") {
        push(entry.name);
      }
    });
  }
  if (Array.isArray(extraNames)) {
    extraNames.forEach((name) => push(name));
  }
  return result;
}

function resolveRuntimeDefaultsFromBridge() {
  const fallback = {
    providerId: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    baseUrl: "http://192.168.11.16:1234/v1",
    apiKey: "lmstudio",
  };
  const runtimeConfig = resolveWindowBridge("TomoshibikanRuntimeConfig", "PalpalRuntimeConfig");
  if (!runtimeConfig) return fallback;
  const source = typeof runtimeConfig.getDefaults === "function"
    ? runtimeConfig.getDefaults()
    : runtimeConfig.defaults;
  if (!source || typeof source !== "object") return fallback;
  return {
    providerId: normalizeText(source.providerId) || fallback.providerId,
    modelName: normalizeText(source.modelName) || fallback.modelName,
    baseUrl: normalizeText(source.baseUrl) || fallback.baseUrl,
    apiKey: normalizeText(source.apiKey) || fallback.apiKey,
  };
}

const FALLBACK_PROVIDER_REGISTRY = [
  { id: "openai", label: "OpenAI" },
  { id: "ollama", label: "Ollama" },
  { id: "lmstudio", label: "LM Studio" },
  { id: "gemini", label: "Gemini" },
  { id: "anthropic", label: "Anthropic" },
  { id: "openrouter", label: "OpenRouter" },
];

function hasRuntimeCatalogBridge() {
  const runtime = resolveWindowBridge("TomoshibikanCoreRuntime", "PalpalCoreRuntime");
  return Boolean(
    runtime &&
    typeof runtime.listProviderModels === "function"
  );
}

function resolveProviderRegistry(rawProviders) {
  const normalized = new Map();
  if (Array.isArray(rawProviders)) {
    rawProviders.forEach((provider) => {
      if (!provider) return;
      if (typeof provider === "string") {
        const id = normalizeText(provider);
        if (!id) return;
        normalized.set(id, { id, label: id });
        return;
      }
      if (typeof provider !== "object") return;
      const id = normalizeText(provider.id || provider.provider || provider.providerId || provider.value);
      if (!id) return;
      const label = normalizeText(provider.label || provider.name || id);
      normalized.set(id, { id, label: label || id });
    });
  }
  if (normalized.size > 0) {
    return [...normalized.values()];
  }
  if (hasRuntimeCatalogBridge()) {
    return [];
  }
  return [...FALLBACK_PROVIDER_REGISTRY];
}

let TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY = resolveProviderRegistry(
  typeof window !== "undefined"
    ? (window.TOMOSHIBIKAN_CORE_PROVIDERS || window.PALPAL_CORE_PROVIDERS)
    : []
);

let PROVIDER_OPTIONS = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.map((provider) => provider.id);
let DEFAULT_PROVIDER_ID = PROVIDER_OPTIONS[0] || "openai";
const PROVIDER_ALIASES = {
  local_ollama: "ollama",
  "local-ollama": "ollama",
  lm_studio: "lmstudio",
  "lm-studio": "lmstudio",
};
const OPTIONAL_API_KEY_PROVIDERS = new Set(["ollama", "lmstudio"]);

function normalizeProviderIdForCatalog(value) {
  const normalized = normalizeText(value);
  if (!normalized) return "";
  const aliasResolved = PROVIDER_ALIASES[normalized] || normalized;
  const matched = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find(
    (provider) => provider.id === aliasResolved || provider.label === aliasResolved
  );
  return matched ? matched.id : aliasResolved;
}

function inferProviderIdFromModelName(modelName) {
  const normalized = normalizeText(modelName);
  if (!normalized) return "";
  const prefix = normalized.split("/")[0];
  return PROVIDER_OPTIONS.includes(prefix) ? prefix : "";
}

function extractModelNameFromCatalogEntry(entry) {
  if (typeof entry === "string") return normalizeText(entry);
  if (!entry || typeof entry !== "object") return "";
  return normalizeText(
    entry.name ||
    entry.modelName ||
    entry.model ||
    entry.id ||
    entry.value
  );
}

function extractProviderIdFromCatalogEntry(entry, fallbackProviderId = "") {
  if (!entry || typeof entry !== "object") {
    return normalizeProviderIdForCatalog(fallbackProviderId);
  }
  const byEntry = normalizeProviderIdForCatalog(
    entry.provider ||
    entry.providerId ||
    entry.provider_id ||
    entry.vendor ||
    entry.owner
  );
  if (byEntry) return byEntry;
  return normalizeProviderIdForCatalog(fallbackProviderId);
}

function normalizeCoreModelCatalog(entries) {
  const seen = new Set();
  const result = [];
  if (!Array.isArray(entries)) return result;
  entries.forEach((entry) => {
    const name = extractModelNameFromCatalogEntry(entry);
    if (!name) return;
    const inferredProvider = inferProviderIdFromModelName(name);
    const provider = extractProviderIdFromCatalogEntry(entry, inferredProvider || DEFAULT_PROVIDER_ID);
    const providerId = PROVIDER_OPTIONS.includes(provider) ? provider : (inferredProvider || DEFAULT_PROVIDER_ID);
    const dedupeKey = `${providerId}::${name}`.toLowerCase();
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    result.push({ name, provider: providerId });
  });
  return result;
}

function flattenProviderModelMapCatalog(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return [];
  const entries = [];
  PROVIDER_OPTIONS.forEach((providerId) => {
    const providerModels = candidate[providerId];
    if (!Array.isArray(providerModels)) return;
    providerModels.forEach((entry) => {
      if (typeof entry === "string") {
        entries.push({ name: entry, provider: providerId });
        return;
      }
      if (entry && typeof entry === "object") {
        entries.push({ ...entry, provider: entry.provider || entry.providerId || providerId });
      }
    });
  });
  return entries;
}

const FALLBACK_TOMOSHIBIKAN_CORE_MODELS = [
  { name: "openai/gpt-oss-20b", provider: "lmstudio" },
  { name: "openai/gpt-oss-20b", provider: "openai" },
  { name: "gpt-4.1", provider: "openai" },
  { name: "gpt-4o", provider: "openai" },
  { name: "gpt-4o-mini", provider: "openai" },
  { name: "o3", provider: "openai" },
  { name: "o4-mini", provider: "openai" },
  { name: "claude-3-7-sonnet", provider: "anthropic" },
  { name: "gemini-2.5-pro", provider: "google" },
];

function resolveTomoshibikanCoreModels() {
  if (typeof window === "undefined") {
    return normalizeCoreModelCatalog(FALLBACK_TOMOSHIBIKAN_CORE_MODELS);
  }
  const direct = normalizeCoreModelCatalog(window.TOMOSHIBIKAN_CORE_MODELS || window.PALPAL_CORE_MODELS);
  if (direct.length > 0) return direct;

  const nestedModels = normalizeCoreModelCatalog(window.TOMOSHIBIKAN_CORE_MODEL_REGISTRY?.models || window.PALPAL_CORE_MODEL_REGISTRY?.models);
  if (nestedModels.length > 0) return nestedModels;

  const nestedByProvider = normalizeCoreModelCatalog(
    flattenProviderModelMapCatalog(window.TOMOSHIBIKAN_CORE_MODEL_REGISTRY || window.PALPAL_CORE_MODEL_REGISTRY)
  );
  if (nestedByProvider.length > 0) return nestedByProvider;

  if (hasRuntimeCatalogBridge()) {
    return [];
  }

  return normalizeCoreModelCatalog(FALLBACK_TOMOSHIBIKAN_CORE_MODELS);
}

const RUNTIME_DEFAULTS = resolveRuntimeDefaultsFromBridge();
const DEV_LMSTUDIO_PROVIDER_ID = PROVIDER_OPTIONS.includes(RUNTIME_DEFAULTS.providerId)
  ? RUNTIME_DEFAULTS.providerId
  : DEFAULT_PROVIDER_ID;
const DEV_LMSTUDIO_MODEL_NAME = RUNTIME_DEFAULTS.modelName;
const DEV_LMSTUDIO_BASE_URL = RUNTIME_DEFAULTS.baseUrl;
const DEV_LMSTUDIO_API_KEY = RUNTIME_DEFAULTS.apiKey;

function buildModelOptionsByProvider(modelCatalog, providerOptions) {
  return providerOptions.reduce((map, providerId) => {
    const providerModels = buildModelOptionList(
      modelCatalog
        .filter((entry) => entry.provider === providerId)
        .map((entry) => entry.name)
    );
    map.set(providerId, providerModels);
    return map;
  }, new Map());
}

let TOMOSHIBIKAN_CORE_MODEL_REGISTRY = resolveTomoshibikanCoreModels();
let TOMOSHIBIKAN_CORE_MODEL_OPTIONS_BY_PROVIDER = buildModelOptionsByProvider(
  TOMOSHIBIKAN_CORE_MODEL_REGISTRY,
  PROVIDER_OPTIONS
);
let MODEL_OPTIONS = buildModelOptionList(TOMOSHIBIKAN_CORE_MODEL_REGISTRY, [DEV_LMSTUDIO_MODEL_NAME]);
let DEFAULT_MODEL_NAME = DEV_LMSTUDIO_MODEL_NAME || MODEL_OPTIONS[0] || "";

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
const CLAWHUB_SKILL_META = {
  "codex-file-search": {
    safety: "High",
    rating: 4.8,
    downloads: 12420,
    stars: 932,
    installs: 4180,
    updatedAt: "2026-03-01T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
  "codex-file-read": {
    safety: "High",
    rating: 4.7,
    downloads: 11300,
    stars: 870,
    installs: 3950,
    updatedAt: "2026-02-20T08:00:00Z",
    highlighted: false,
    suspicious: false,
  },
  "codex-file-edit": {
    safety: "Medium",
    rating: 4.5,
    downloads: 9850,
    stars: 721,
    installs: 3520,
    updatedAt: "2026-02-14T08:00:00Z",
    highlighted: false,
    suspicious: false,
  },
  "codex-shell-command": {
    safety: "Medium",
    rating: 4.2,
    downloads: 8120,
    stars: 604,
    installs: 2870,
    updatedAt: "2026-01-29T08:00:00Z",
    highlighted: false,
    suspicious: true,
  },
  "codex-test-runner": {
    safety: "High",
    rating: 4.6,
    downloads: 10450,
    stars: 788,
    installs: 3340,
    updatedAt: "2026-02-24T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
  "browser-chrome": {
    safety: "Medium",
    rating: 4.4,
    downloads: 9080,
    stars: 682,
    installs: 3010,
    updatedAt: "2026-02-10T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
};
const SKILL_MARKET_SORT_OPTIONS = ["downloads", "stars", "installs", "updated", "highlighted"];
const DEFAULT_SKILL_SEARCH_FILTERS = {
  nonSuspiciousOnly: true,
  highlightedOnly: false,
  sortBy: "downloads",
};
const CLAWHUB_WEB_BASE_URL = "https://clawhub.ai";
const CLAWHUB_API_BASE_URL = "https://clawhub.ai/api/v1";
const CLAWHUB_API_REQUEST_TIMEOUT_MS = 5000;
const CLAWHUB_API_SEARCH_LIMIT = 30;
const CLAWHUB_API_BROWSE_LIMIT = 250;
const CLAWHUB_API_DETAIL_ENRICH_LIMIT = 12;
const CLAWHUB_SKILL_REGISTRY = STANDARD_SKILL_CATALOG.map((skill) => ({
  ...skill,
  packageName: `clawhub/${skill.id}`,
  source: "ClawHub",
  safety: CLAWHUB_SKILL_META[skill.id]?.safety || "Unknown",
  rating: Number(CLAWHUB_SKILL_META[skill.id]?.rating || 0),
  downloads: Number(CLAWHUB_SKILL_META[skill.id]?.downloads || 0),
  stars: Number(CLAWHUB_SKILL_META[skill.id]?.stars || 0),
  installs: Number(CLAWHUB_SKILL_META[skill.id]?.installs || 0),
  updatedAt: String(CLAWHUB_SKILL_META[skill.id]?.updatedAt || ""),
  highlighted: Boolean(CLAWHUB_SKILL_META[skill.id]?.highlighted),
  suspicious: Boolean(CLAWHUB_SKILL_META[skill.id]?.suspicious),
}));
const ADDITIONAL_SKILL_REGISTRY = [];
const STANDARD_SKILL_IDS = STANDARD_SKILL_CATALOG.map((skill) => skill.id);
const ROLE_SKILL_POLICY = {
  guide: ["codex-file-search", "codex-file-read", "browser-chrome"],
  gate: ["codex-file-search", "codex-file-read", "codex-test-runner", "browser-chrome"],
  worker: [...STANDARD_SKILL_IDS],
};
const PAL_ROLE_OPTIONS = ["guide", "gate", "worker"];
const PAL_RUNTIME_KIND_OPTIONS = ["model", "tool"];
const EVENT_LOG_PAGE_SIZE = 6;
const EVENT_TYPE_FILTER_KEYS = ["all", "dispatch", "gate", "task", "job", "resubmit", "plan"];
const PROJECTS_LOCAL_STORAGE_KEY = "tomoshibi-kan.projects.v1";
const LEGACY_PROJECTS_LOCAL_STORAGE_KEYS = ["palpal-hive.projects.v1"];
const PAL_PROFILES_LOCAL_STORAGE_KEY = "tomoshibi-kan.agent-profiles.v1";
const LEGACY_PAL_PROFILES_LOCAL_STORAGE_KEYS = ["palpal-hive.agent-profiles.v1"];
const BOARD_STATE_LOCAL_STORAGE_KEY = "tomoshibi-kan.board-state.v1";
const LEGACY_BOARD_STATE_LOCAL_STORAGE_KEYS = ["palpal-hive.board-state.v1"];
const DEFAULT_PROJECT_FILE_HINTS = [
  "README.md",
  "docs/OVERVIEW.md",
  "docs/spec.md",
  "docs/plan.md",
  "wireframe/index.html",
  "wireframe/app.js",
  "wireframe/styles.css",
  "package.json",
];
const INITIAL_PROJECTS = [
  {
    id: "project-tomoshibi-kan",
    name: "Tomoshibi-kan",
    directory: "C:/Users/kitad/palpal-hive",
    files: [...DEFAULT_PROJECT_FILE_HINTS],
  },
];

const PREFERRED_SECONDARY_MODEL_NAME = MODEL_OPTIONS.includes("gpt-4o-mini")
  ? "gpt-4o-mini"
  : MODEL_OPTIONS.find((name) => name !== DEV_LMSTUDIO_MODEL_NAME) || "";
const SEEDED_SECONDARY_MODEL_NAME = PREFERRED_SECONDARY_MODEL_NAME !== DEV_LMSTUDIO_MODEL_NAME
  ? PREFERRED_SECONDARY_MODEL_NAME
  : MODEL_OPTIONS.find((name) => name !== DEV_LMSTUDIO_MODEL_NAME) || "";
const SEEDED_SECONDARY_MODEL_PROVIDER = TOMOSHIBIKAN_CORE_MODEL_REGISTRY.find(
  (entry) => entry.name === SEEDED_SECONDARY_MODEL_NAME
)?.provider || DEFAULT_PROVIDER_ID;
const INITIAL_REGISTERED_MODELS = [
  {
    name: DEV_LMSTUDIO_MODEL_NAME,
    provider: DEV_LMSTUDIO_PROVIDER_ID,
    apiKey: "",
    apiKeyConfigured: true,
    baseUrl: DEV_LMSTUDIO_BASE_URL,
    endpoint: "",
  },
  ...(SEEDED_SECONDARY_MODEL_NAME
    ? [{
      name: SEEDED_SECONDARY_MODEL_NAME,
      provider: SEEDED_SECONDARY_MODEL_PROVIDER,
      apiKey: "",
      apiKeyConfigured: false,
      baseUrl: "",
      endpoint: "",
    }]
    : []),
];

const DEFAULT_CONTEXT_HANDOFF_POLICY = "balanced";
const DEFAULT_GUIDE_CONTROLLER_ASSIST_ENABLED = false;

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
window.DEFAULT_PROJECT_FILE_HINTS = DEFAULT_PROJECT_FILE_HINTS;
window.PROJECTS_LOCAL_STORAGE_KEY = PROJECTS_LOCAL_STORAGE_KEY;
window.LEGACY_PROJECTS_LOCAL_STORAGE_KEYS = LEGACY_PROJECTS_LOCAL_STORAGE_KEYS;
window.projectState = projectState;
window.getCurrentLocale = () => locale;

let guideMessages = [
  {
    timestamp: "09:20",
    sender: "guide",
    text: {
      ja: "Plan Cardを立てます。Taskを3件に分解します。",
      en: "I propose a plan card. Splitting into 3 tasks.",
    },
  },
  {
    timestamp: "09:23",
    sender: "system",
    text: {
      ja: "Planは承認済みです。Task配布済み。",
      en: "Plan approved. Tasks dispatched.",
    },
  },
];

const tasks = [
  {
    id: "TASK-001",
    title: "Guideプランの確認",
    description: "REQ-0001〜REQ-0008 と画面設計要件を突合する",
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
    title: "ワイヤーフレーム作成",
    description: "Workspace / Task Detail / Gate / Settings のダミー画面を作成する",
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
    title: "i18n IDマッピング",
    description: "UI-PPH-xxxx の ja/en 文言セットを定義する",
    palId: "pal-delta",
    status: "rejected",
    updatedAt: "2026-02-28 09:46",
    decisionSummary: "rejected",
    constraintsCheckResult: "pass",
    evidence: "ui-id-table",
    replay: "switch-ja-en",
    fixCondition: "UI-ID不足項目を追加",
  },
];

const jobs = [
  {
    id: "JOB-001",
    title: "依存アップデートの朝会確認",
    description: "平日 09:00 に依存更新と脆弱性を確認して、要点をまとめる",
    palId: "pal-alpha",
    schedule: "Weekdays 09:00",
    instruction: "npm outdated && npm audit --omit=dev の結果を3行で報告する",
    status: "assigned",
    updatedAt: "2026-02-28 09:10",
    decisionSummary: "-",
    fixCondition: "-",
    lastRunAt: "-",
  },
  {
    id: "JOB-002",
    title: "E2E結果の週次サマリー",
    description: "毎週金曜に E2E の成功率と失敗パターンを集計して Gate へ提出する",
    palId: "pal-delta",
    schedule: "Fri 17:00",
    instruction: "npm run test:e2e の実行結果を集計し、気になる点を1つ添えて報告する",
    status: "to_gate",
    updatedAt: "2026-02-28 17:12",
    decisionSummary: "pending",
    fixCondition: "-",
    lastRunAt: "2026-02-28 17:05",
  },
];

const INITIAL_PAL_PROFILES = [
  {
    id: "guide-core",
    role: "guide",
    runtimeKind: "model",
    displayName: "燈子さん",
    persona: "灯火館の管理人として来訪者を迎え、話を受け止め、住人たちへやわらかく橋渡しする。",
    provider: DEV_LMSTUDIO_PROVIDER_ID,
    models: [DEV_LMSTUDIO_MODEL_NAME],
    cliTools: [],
    skills: [...STANDARD_SKILL_IDS],
    status: "active",
  },
  {
    id: "gate-core",
    role: "gate",
    runtimeKind: "model",
    displayName: "真壁",
    persona: "灯火館の古参住人として、流れと仕上がりの違和感を静かに見届け、最後に重い一言を添える。",
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
    displayName: "冬坂",
    persona: "灯火館の住人でありリサーチャーとして、市場・事例・利用者像などの外部調査を担い、比較やレポートで判断材料を持ち帰る。",
    provider: "openai",
    models: [],
    cliTools: ["Codex"],
    skills: ["codex-file-search", "codex-file-read", "browser-chrome"],
    status: "active",
  },
  {
    id: "pal-beta",
    role: "worker",
    runtimeKind: "tool",
    displayName: "久瀬",
    persona: "灯火館の住人でありプログラマとして、ソフトウェアの調査・再現・原因分析・実装・修正を引き受け、手を動かしながら形を起こしていく。",
    provider: "anthropic",
    models: [],
    cliTools: ["Codex"],
    skills: ["codex-file-read", "codex-file-edit", "codex-shell-command"],
    status: "active",
  },
  {
    id: "pal-delta",
    role: "worker",
    runtimeKind: "tool",
    displayName: "白峰",
    persona: "灯火館の住人でありライターとして、説明・文書化・命名を整え、言葉で人と人をつなぐ。",
    provider: "openai",
    models: [],
    cliTools: ["Codex"],
    skills: ["codex-file-read", "codex-file-edit", "codex-test-runner"],
    status: "active",
  },
];
const BUILT_IN_PROFILE_IDS = new Set(INITIAL_PAL_PROFILES.map((pal) => pal.id));
const LEGACY_BUILT_IN_PROFILE_IDS = new Set([
  ...BUILT_IN_PROFILE_IDS,
  "pal-gamma",
]);
const DEFAULT_AGENT_SELECTION = {
  activeGuideId: "guide-core",
  defaultGateId: "gate-core",
};
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
  return (DYNAMIC_TEXT[locale] && DYNAMIC_TEXT[locale][key])
    || (DYNAMIC_TEXT.ja && DYNAMIC_TEXT.ja[key])
    || (DYNAMIC_TEXT.en && DYNAMIC_TEXT.en[key])
    || key;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineMarkdown(text) {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, url) => {
    const safeLabel = label;
    const safeUrl = escapeHtml(url);
    return `<a href="${safeUrl}" target="_blank" rel="noreferrer noopener">${safeLabel}</a>`;
  });
  escaped = escaped.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return escaped;
}

function renderMarkdownText(text) {
  const normalized = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  const codeBlocks = [];
  const withPlaceholders = normalized.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_match, language, code) => {
    const index = codeBlocks.length;
    codeBlocks.push({
      language: escapeHtml(language || ""),
      code: escapeHtml(code.replace(/\n$/, "")),
    });
    return `@@CODE_BLOCK_${index}@@`;
  });

  const rendered = withPlaceholders
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^@@CODE_BLOCK_\d+@@$/.test(block)) return block;
      const lines = block.split("\n");
      const ordered = lines.every((line) => /^\d+\.\s+/.test(line.trim()));
      const unordered = lines.every((line) => /^[-*]\s+/.test(line.trim()));
      if (ordered || unordered) {
        const tag = ordered ? "ol" : "ul";
        const items = lines
          .map((line) => line.trim().replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""))
          .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
          .join("");
        return `<${tag}>${items}</${tag}>`;
      }
      return `<p>${lines.map((line) => renderInlineMarkdown(line.trim())).join("<br>")}</p>`;
    })
    .join("");

  return rendered.replace(/@@CODE_BLOCK_(\d+)@@/g, (_match, indexText) => {
    const block = codeBlocks[Number(indexText)];
    if (!block) return "";
    const languageClass = block.language ? ` class="language-${block.language}"` : "";
    return `<pre><code${languageClass}>${block.code}</code></pre>`;
  });
}
