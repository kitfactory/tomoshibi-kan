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
