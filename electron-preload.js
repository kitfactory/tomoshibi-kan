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
  return parseBase64JsonArg("--tomoshibikan-runtime-defaults=") ||
    parseBase64JsonArg("--palpal-runtime-defaults=");
}

function parseCoreCatalogArg() {
  return parseBase64JsonArg("--tomoshibikan-core-catalog=") ||
    parseBase64JsonArg("--palpal-core-catalog=");
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

const settingsStorageBridge = {
  load: () => ipcRenderer.invoke("settings:load"),
  save: (payload) => ipcRenderer.invoke("settings:save", payload),
  resolveModelApiKey: (modelName) =>
    ipcRenderer.invoke("settings:resolve-model-api-key", modelName),
};

const agentIdentityBridge = {
  load: (payload) => ipcRenderer.invoke("agent-identity:load", payload),
  save: (payload) => ipcRenderer.invoke("agent-identity:save", payload),
};

const runtimeConfigBridge = {
  defaults: { ...runtimeDefaults },
  getDefaults: () => ({ ...runtimeDefaults }),
};

const coreRuntimeBridge = {
  listProviderModels: () => ipcRenderer.invoke("tomoshibikan-core:list-provider-models"),
  guideChat: (payload) => ipcRenderer.invoke("guide:chat", payload),
  palChat: (payload) => ipcRenderer.invoke("pal:chat", payload),
};

const debugRunsBridge = {
  list: (options) => ipcRenderer.invoke("debug-runs:list", options),
};

const progressLogBridge = {
  append: (payload) => ipcRenderer.invoke("progress-log:append", payload),
  list: (options) => ipcRenderer.invoke("progress-log:list", options),
  latest: (options) => ipcRenderer.invoke("progress-log:latest", options),
};

const planArtifactBridge = {
  append: (payload) => ipcRenderer.invoke("plan-artifact:append", payload),
  list: (options) => ipcRenderer.invoke("plan-artifact:list", options),
  latest: (options) => ipcRenderer.invoke("plan-artifact:latest", options),
};

const projectDialogBridge = {
  pickDirectory: () => ipcRenderer.invoke("project:pick-directory"),
};

const externalBridge = {
  openUrl: (url) => ipcRenderer.invoke("external:open", url),
};

contextBridge.exposeInMainWorld("TomoshibikanSettingsStorage", settingsStorageBridge);
contextBridge.exposeInMainWorld("PalpalSettingsStorage", settingsStorageBridge);
contextBridge.exposeInMainWorld("TomoshibikanAgentIdentity", agentIdentityBridge);
contextBridge.exposeInMainWorld("PalpalAgentIdentity", agentIdentityBridge);
contextBridge.exposeInMainWorld("TomoshibikanRuntimeConfig", runtimeConfigBridge);
contextBridge.exposeInMainWorld("PalpalRuntimeConfig", runtimeConfigBridge);
contextBridge.exposeInMainWorld("TOMOSHIBIKAN_CORE_PROVIDERS", [...coreCatalog.providers]);
contextBridge.exposeInMainWorld("PALPAL_CORE_PROVIDERS", [...coreCatalog.providers]);
contextBridge.exposeInMainWorld("TOMOSHIBIKAN_CORE_MODELS", [...coreCatalog.models]);
contextBridge.exposeInMainWorld("PALPAL_CORE_MODELS", [...coreCatalog.models]);
contextBridge.exposeInMainWorld("TomoshibikanCoreRuntime", coreRuntimeBridge);
contextBridge.exposeInMainWorld("PalpalCoreRuntime", coreRuntimeBridge);
contextBridge.exposeInMainWorld("TomoshibikanDebugRuns", debugRunsBridge);
contextBridge.exposeInMainWorld("PalpalDebugRuns", debugRunsBridge);
contextBridge.exposeInMainWorld("TomoshibikanProgressLog", progressLogBridge);
contextBridge.exposeInMainWorld("PalpalProgressLog", progressLogBridge);
contextBridge.exposeInMainWorld("TomoshibikanPlanArtifacts", planArtifactBridge);
contextBridge.exposeInMainWorld("PalpalPlanArtifacts", planArtifactBridge);
contextBridge.exposeInMainWorld("TomoshibikanProjectDialog", projectDialogBridge);
contextBridge.exposeInMainWorld("PalpalProjectDialog", projectDialogBridge);
contextBridge.exposeInMainWorld("TomoshibikanExternal", externalBridge);
contextBridge.exposeInMainWorld("PalpalExternal", externalBridge);
