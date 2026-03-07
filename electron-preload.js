const { contextBridge, ipcRenderer } = require("electron");

function normalizeString(value) {
  return String(value || "").trim();
}

function parseBase64JsonArg(prefix) {
  const argv = Array.isArray(process.argv) ? process.argv : [];
  const encoded = argv.find((arg) => typeof arg === "string" && arg.startsWith(prefix));
  if (!encoded) return null;
  try {
    const decoded = Buffer.from(encoded.slice(prefix.length), "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function parseRuntimeDefaultsArg() {
  return parseBase64JsonArg("--palpal-runtime-defaults=");
}

function parseCoreCatalogArg() {
  return parseBase64JsonArg("--palpal-core-catalog=");
}

function resolveRuntimeDefaults() {
  const fromArg = parseRuntimeDefaultsArg() || {};
  return {
    providerId: normalizeString(fromArg.providerId) || "lmstudio",
    modelName: normalizeString(fromArg.modelName) || "openai/gpt-oss-20b",
    baseUrl: normalizeString(fromArg.baseUrl || process.env.LMSTUDIO_BASE_URL) || "http://192.168.11.16:1234/v1",
    apiKey: normalizeString(fromArg.apiKey || process.env.LMSTUDIO_API_KEY),
  };
}

function resolveCoreCatalog() {
  const fromArg = parseCoreCatalogArg() || {};
  const providers = Array.isArray(fromArg.providers) ? fromArg.providers : [];
  const models = Array.isArray(fromArg.models) ? fromArg.models : [];
  return {
    providers,
    models,
  };
}

const runtimeDefaults = resolveRuntimeDefaults();
const coreCatalog = resolveCoreCatalog();

contextBridge.exposeInMainWorld("PalpalSettingsStorage", {
  load: () => ipcRenderer.invoke("settings:load"),
  save: (payload) => ipcRenderer.invoke("settings:save", payload),
  resolveModelApiKey: (modelName) =>
    ipcRenderer.invoke("settings:resolve-model-api-key", modelName),
});

contextBridge.exposeInMainWorld("PalpalAgentIdentity", {
  load: (payload) => ipcRenderer.invoke("agent-identity:load", payload),
  save: (payload) => ipcRenderer.invoke("agent-identity:save", payload),
});

contextBridge.exposeInMainWorld("PalpalRuntimeConfig", {
  defaults: { ...runtimeDefaults },
  getDefaults: () => ({ ...runtimeDefaults }),
});

contextBridge.exposeInMainWorld("PALPAL_CORE_PROVIDERS", [...coreCatalog.providers]);
contextBridge.exposeInMainWorld("PALPAL_CORE_MODELS", [...coreCatalog.models]);

contextBridge.exposeInMainWorld("PalpalCoreRuntime", {
  listProviderModels: () => ipcRenderer.invoke("palpal-core:list-provider-models"),
  guideChat: (payload) => ipcRenderer.invoke("guide:chat", payload),
  palChat: (payload) => ipcRenderer.invoke("pal:chat", payload),
});

contextBridge.exposeInMainWorld("PalpalDebugRuns", {
  list: (options) => ipcRenderer.invoke("debug-runs:list", options),
});

contextBridge.exposeInMainWorld("PalpalProjectDialog", {
  pickDirectory: () => ipcRenderer.invoke("project:pick-directory"),
});

contextBridge.exposeInMainWorld("PalpalExternal", {
  openUrl: (url) => ipcRenderer.invoke("external:open", url),
});
