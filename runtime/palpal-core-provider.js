const palpalCore = require("palpal-core");

let coreGetProvider = palpalCore.getProvider;
let coreListProviderModels = palpalCore.listProviderModels;

const PROVIDER_LABELS = {
  openai: "OpenAI",
  ollama: "Ollama",
  lmstudio: "LM Studio",
  gemini: "Gemini",
  anthropic: "Anthropic",
  openrouter: "OpenRouter",
};

const GUIDE_SYSTEM_PROMPT = [
  "You are Guide.",
  "- Talk with the user to clarify goals, constraints, and missing information.",
  "- Break requests into concrete tasks or cron jobs.",
  "- Decide which Pal should do what.",
  "- Plan with the expected Gate evaluation in mind.",
  "- Keep the response concise and action-oriented.",
].join("\n");

const RUNTIME_DEBUG_ENABLED = /^(1|true|yes)$/i.test(
  normalizeText(
    process.env.TOMOSHIBIKAN_RUNTIME_DEBUG || process.env.PALPAL_RUNTIME_DEBUG
  ).toLowerCase()
);

const STANDARD_PROVIDER_ENV_KEYS = {
  openai: { baseUrl: "OPENAI_BASE_URL", apiKey: "OPENAI_API_KEY" },
  ollama: { baseUrl: "OLLAMA_BASE_URL", apiKey: "OLLAMA_API_KEY" },
  lmstudio: { baseUrl: "LMSTUDIO_BASE_URL", apiKey: "LMSTUDIO_API_KEY" },
  gemini: { baseUrl: "GEMINI_BASE_URL", apiKey: "GEMINI_API_KEY" },
  anthropic: { baseUrl: "ANTHROPIC_BASE_URL", apiKey: "ANTHROPIC_API_KEY" },
  openrouter: { baseUrl: "OPENROUTER_BASE_URL", apiKey: "OPENROUTER_API_KEY" },
};

const PROVIDER_RUNTIME_ENV_PATCH_KEYS = {
  openai: { baseUrl: "OPENAI_BASE_URL", apiKey: "OPENAI_API_KEY" },
  ollama: { baseUrl: "AGENTS_OLLAMA_BASE_URL", apiKey: "AGENTS_OLLAMA_API_KEY" },
  lmstudio: {
    baseUrl: "AGENTS_LMSTUDIO_BASE_URL",
    apiKey: "AGENTS_LMSTUDIO_API_KEY",
  },
  gemini: { baseUrl: "AGENTS_GEMINI_BASE_URL", apiKey: "AGENTS_GEMINI_API_KEY" },
  anthropic: {
    baseUrl: "AGENTS_ANTHROPIC_BASE_URL",
    apiKey: "AGENTS_ANTHROPIC_API_KEY",
  },
  openrouter: {
    baseUrl: "AGENTS_OPENROUTER_BASE_URL",
    apiKey: "AGENTS_OPENROUTER_API_KEY",
  },
};

function normalizeText(value) {
  return String(value || "").trim();
}

function truncateText(text, maxLength = 240) {
  const value = String(text || "");
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}\n...(truncated)`;
}

function runtimeDebugLog(message, details = null) {
  if (!RUNTIME_DEBUG_ENABLED) return;
  if (details === null || typeof details === "undefined") {
    console.log(`[tomoshibikan-runtime] ${message}`);
    return;
  }
  console.log(`[tomoshibikan-runtime] ${message}`, details);
}

function safeStringify(value, fallback = "{}") {
  try {
    return JSON.stringify(value);
  } catch (_error) {
    return fallback;
  }
}

function summarizeValueForDebug(value, maxLength = 240) {
  if (value === null || typeof value === "undefined") return "";
  if (typeof value === "string") return truncateText(value, maxLength);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return truncateText(safeStringify(value, "{}"), maxLength);
}

function normalizeSkillId(skillId) {
  return normalizeText(skillId).toLowerCase();
}

function normalizeSkillIdList(skillIds) {
  if (!Array.isArray(skillIds)) return [];
  const seen = new Set();
  const list = [];
  skillIds.forEach((skillId) => {
    const normalized = normalizeSkillId(skillId);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    list.push(normalized);
  });
  return list;
}

function normalizeProviderName(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (normalized === "lm-studio" || normalized === "lm_studio") return "lmstudio";
  if (normalized === "local_ollama" || normalized === "local-ollama") return "ollama";
  return normalized;
}

function providerLabel(providerName) {
  return PROVIDER_LABELS[providerName] || providerName;
}

function standardEnvValue(provider, field) {
  const spec = STANDARD_PROVIDER_ENV_KEYS[provider] || {};
  if (provider === "openrouter" && field === "apiKey") {
    return normalizeText(process.env.OPENROUTER_API_KEY || process.env.OPENROTER_API_KEY);
  }
  const key = spec[field];
  return normalizeText(key ? process.env[key] : "");
}

function dedupeModels(entries) {
  const seen = new Set();
  const list = [];
  entries.forEach((entry) => {
    const provider = normalizeProviderName(entry.provider);
    const name = normalizeText(entry.name);
    if (!provider || !name) return;
    const key = `${provider}::${name}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    list.push({ provider, name });
  });
  return list;
}

function buildListOverrides(options = {}) {
  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 1200;
  return {
    lmstudio: {
      baseUrl: normalizeText(options.lmstudioBaseUrl || standardEnvValue("lmstudio", "baseUrl")),
      apiKey: normalizeText(options.lmstudioApiKey || standardEnvValue("lmstudio", "apiKey")),
      model: normalizeText(options.lmstudioModel),
      timeoutMs,
    },
    ollama: {
      baseUrl: normalizeText(options.ollamaBaseUrl || standardEnvValue("ollama", "baseUrl")),
      apiKey: normalizeText(options.ollamaApiKey || standardEnvValue("ollama", "apiKey")),
      model: normalizeText(options.ollamaModel),
      timeoutMs,
    },
  };
}

async function listCoreProviderModels(options = {}) {
  const includeDefaultModels = options.includeDefaultModels === true;
  const catalog = await coreListProviderModels({
    overrides: buildListOverrides(options),
  });
  const providers = [];
  const models = [];
  const seenProvider = new Set();

  const pushProvider = (rawProvider) => {
    const provider = normalizeProviderName(rawProvider);
    if (!provider || seenProvider.has(provider)) return;
    seenProvider.add(provider);
    providers.push({ id: provider, label: providerLabel(provider) });
  };

  (Array.isArray(catalog.providers) ? catalog.providers : []).forEach((entry) => {
    const provider = normalizeProviderName(
      entry?.provider || entry?.id || entry?.providerId || entry?.name
    );
    if (!provider) return;
    pushProvider(provider);
    const resolution = normalizeText(entry?.resolution).toLowerCase();
    if (!includeDefaultModels && resolution === "default") return;
    const names = Array.isArray(entry.models) ? entry.models : [];
    names.forEach((name) => {
      models.push({ provider, name: normalizeText(name) });
    });
  });

  const byProvider = catalog && typeof catalog.byProvider === "object" ? catalog.byProvider : null;
  if (byProvider) {
    Object.entries(byProvider).forEach(([providerName, providerModels]) => {
      const provider = normalizeProviderName(providerName);
      if (!provider) return;
      pushProvider(provider);
      const resolution = normalizeText(providerModels?.resolution).toLowerCase();
      if (!includeDefaultModels && resolution === "default") return;
      const names = Array.isArray(providerModels)
        ? providerModels
        : Array.isArray(providerModels?.models)
          ? providerModels.models
          : [];
      names.forEach((name) => {
        models.push({ provider, name: normalizeText(name) });
      });
    });
  }

  (Array.isArray(catalog.models) ? catalog.models : []).forEach((entry) => {
    const provider = normalizeProviderName(
      entry?.provider || entry?.providerId || entry?.provider_id
    );
    const name = normalizeText(entry?.name || entry?.modelName || entry?.model || entry);
    if (!provider || !name) return;
    pushProvider(provider);
    models.push({ provider, name });
  });

  const dedupedModels = dedupeModels(models);
  dedupedModels.forEach((entry) => {
    pushProvider(entry.provider);
  });

  return {
    providers,
    models: dedupedModels,
  };
}

let envPatchMutex = Promise.resolve();

async function withSerializedEnvPatch(work) {
  const previous = envPatchMutex;
  let release;
  envPatchMutex = new Promise((resolve) => {
    release = resolve;
  });
  await previous;
  try {
    return await work();
  } finally {
    release();
  }
}

async function withProviderEnv(providerName, config, work) {
  return withSerializedEnvPatch(async () => {
    const envKeys = PROVIDER_RUNTIME_ENV_PATCH_KEYS[providerName] || {};
    const patch = {
      [envKeys.baseUrl]: normalizeText(config.baseUrl),
      [envKeys.apiKey]: normalizeText(config.apiKey),
    };
    const keys = Object.keys(patch).filter(Boolean);
    const backup = {};
    keys.forEach((key) => {
      backup[key] = process.env[key];
      const next = normalizeText(patch[key]);
      if (next) process.env[key] = next;
      else delete process.env[key];
    });

    try {
      return await work();
    } finally {
      keys.forEach((key) => {
        const previousValue = backup[key];
        if (typeof previousValue === "undefined") delete process.env[key];
        else process.env[key] = previousValue;
      });
    }
  });
}

function normalizeGuideMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .map((message) => {
      if (!message || typeof message !== "object") return null;
      const role = normalizeText(message.role).toLowerCase();
      const content = normalizeText(message.content);
      if (!content) return null;
      if (role !== "system" && role !== "user" && role !== "assistant" && role !== "developer") {
        return null;
      }
      return { role, content };
    })
    .filter(Boolean);
}

function buildGuideGenerateInput({ systemPrompt, userText, messages }) {
  const normalizedMessages = normalizeGuideMessages(messages);
  if (normalizedMessages.length === 0) {
    return {
      instructions: systemPrompt,
      inputText: userText,
    };
  }

  const latestUser =
    [...normalizedMessages].reverse().find((message) => message.role === "user") || null;
  const history = normalizedMessages.filter((message) => message !== latestUser);
  const historyText = history.map((message) => `[${message.role}] ${message.content}`).join("\n\n");
  const instructions = historyText
    ? `${systemPrompt}\n\nConversation Context:\n${historyText}`
    : systemPrompt;

  return {
    instructions,
    inputText: latestUser ? latestUser.content : userText,
  };
}

function normalizeResponseFormat(responseFormat) {
  if (!responseFormat || typeof responseFormat !== "object" || Array.isArray(responseFormat)) {
    return null;
  }
  const type = normalizeText(responseFormat.type).toLowerCase();
  if (type !== "json_schema") return null;
  const jsonSchema = responseFormat.json_schema;
  if (!jsonSchema || typeof jsonSchema !== "object" || Array.isArray(jsonSchema)) return null;
  const name = normalizeText(jsonSchema.name) || "guide_plan_response";
  const schema =
    jsonSchema.schema && typeof jsonSchema.schema === "object" && !Array.isArray(jsonSchema.schema)
      ? jsonSchema.schema
      : null;
  if (!schema) return null;
  return {
    type: "json_schema",
    json_schema: {
      name,
      strict: jsonSchema.strict === true,
      schema,
    },
  };
}

function supportsStructuredOutput(provider) {
  return (
    provider === "openai" ||
    provider === "lmstudio" ||
    provider === "ollama" ||
    provider === "gemini" ||
    provider === "openrouter"
  );
}

function buildCompatChatHeaders(apiKey) {
  const headers = {
    "Content-Type": "application/json",
  };
  const normalizedApiKey = normalizeText(apiKey);
  if (normalizedApiKey) {
    headers.Authorization = `Bearer ${normalizedApiKey}`;
  }
  return headers;
}

function extractCompatContentText(content) {
  if (typeof content === "string") return normalizeText(content);
  if (!Array.isArray(content)) return "";
  return content
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item.text === "string") return item.text;
      return "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

async function requestStructuredGuideChatCompletion(input = {}) {
  const provider = normalizeProviderName(input.provider || "lmstudio");
  const responseFormat = normalizeResponseFormat(input.responseFormat);
  if (!responseFormat || !supportsStructuredOutput(provider)) return null;
  const modelName = normalizeText(input.modelName);
  const baseUrl = normalizeText(input.baseUrl || standardEnvValue(provider, "baseUrl"));
  const apiKey = normalizeText(input.apiKey || standardEnvValue(provider, "apiKey"));
  const systemPrompt = normalizeText(input.systemPrompt) || GUIDE_SYSTEM_PROMPT;
  const userText = normalizeText(input.userText);
  const messages = normalizeGuideMessages(input.messages);
  if (!modelName || !baseUrl || !userText || typeof fetch !== "function") return null;

  const guideInput = buildGuideGenerateInput({
    systemPrompt,
    userText,
    messages,
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: buildCompatChatHeaders(apiKey),
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: guideInput.instructions },
          { role: "user", content: guideInput.inputText },
        ],
        response_format: responseFormat,
        stream: false,
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(
        `Structured output request failed (${response.status} ${response.statusText})`
      );
    }
    const json = await response.json();
    const choice = Array.isArray(json?.choices) ? json.choices[0] : null;
    const message = choice && typeof choice === "object" ? choice.message : null;
    const text = extractCompatContentText(message?.content);
    if (!text) {
      throw new Error("Structured output response is empty");
    }
    return {
      provider,
      modelName,
      text,
      toolCalls: [],
      loopStopReason: "completed_structured",
      loopTrace: [],
    };
  } finally {
    clearTimeout(timeout);
  }
}

function __setProviderRuntimeBindingsForTest(bindings = {}) {
  if (typeof bindings.getProvider === "function") {
    coreGetProvider = bindings.getProvider;
  }
  if (typeof bindings.listProviderModels === "function") {
    coreListProviderModels = bindings.listProviderModels;
  }
}

function __resetProviderRuntimeBindingsForTest() {
  coreGetProvider = palpalCore.getProvider;
  coreListProviderModels = palpalCore.listProviderModels;
}

module.exports = {
  GUIDE_SYSTEM_PROMPT,
  normalizeText,
  runtimeDebugLog,
  safeStringify,
  summarizeValueForDebug,
  normalizeSkillIdList,
  normalizeProviderName,
  standardEnvValue,
  listCoreProviderModels,
  withProviderEnv,
  normalizeGuideMessages,
  buildGuideGenerateInput,
  requestStructuredGuideChatCompletion,
  __setProviderRuntimeBindingsForTest,
  __resetProviderRuntimeBindingsForTest,
  getProviderModel: (providerName, modelName) =>
    coreGetProvider(providerName).getModel(modelName),
};
