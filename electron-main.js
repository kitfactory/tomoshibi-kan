const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, ipcMain, safeStorage, dialog, shell } = require("electron");
const { SqliteSettingsStore } = require("./runtime/settings-store");
const { AgentIdentityStore } = require("./runtime/agent-identity-store");
const {
  listCoreProviderModels,
  requestGuideChatCompletion,
  requestPalChatCompletion,
  __setCoreRuntimeBindingsForTest,
} = require("./runtime/palpal-core-runtime");
const {
  resolveWorkspaceRoot,
  resolveWorkspacePaths,
  resolveWritableWorkspacePaths,
} = require("./runtime/workspace-root");

let settingsStore = null;
let agentIdentityStore = null;
let runtimeDefaults = null;
let coreCatalog = { providers: [], models: [] };
let workspacePaths = null;

function normalizeString(value) {
  return String(value || "").trim();
}

function sanitizeRuntimePayloadForDebug(input = {}) {
  return {
    userText: typeof input.userText === "string" ? input.userText : "",
    systemPrompt: typeof input.systemPrompt === "string" ? input.systemPrompt : "",
    messages: Array.isArray(input.messages) ? input.messages : [],
    responseFormat: input.responseFormat && typeof input.responseFormat === "object"
      ? input.responseFormat
      : null,
    enabledSkillIds: Array.isArray(input.enabledSkillIds) ? input.enabledSkillIds : [],
    maxTurns: Number.isFinite(input.maxTurns) ? input.maxTurns : null,
    agentName: normalizeString(input.agentName),
  };
}

function sanitizeRuntimeResponseForDebug(output = {}) {
  return {
    text: typeof output.text === "string" ? output.text : "",
    provider: normalizeString(output.provider),
    modelName: normalizeString(output.modelName),
    toolCalls: Array.isArray(output.toolCalls) ? output.toolCalls : [],
  };
}

function configureDebugStubRuntimeIfEnabled() {
  if (!/^(1|true|yes)$/i.test(
    normalizeString(
      process.env.TOMOSHIBIKAN_DEBUG_STUB_RUNTIME || process.env.PALPAL_DEBUG_STUB_RUNTIME
    ).toLowerCase()
  )) {
    return;
  }
  __setCoreRuntimeBindingsForTest({
    listProviderModels: async () => ({
      providers: [
        { provider: "lmstudio", resolution: "dynamic", models: ["openai/gpt-oss-20b"] },
      ],
    }),
    getProvider: () => ({
      getModel: () => ({
        generate: async (request = {}) => {
          const inputText = normalizeString(request.inputText);
          const instructions = normalizeString(request.agent?.instructions);
          const agentName = normalizeString(request.agent?.name);
          const envelope = JSON.stringify({
            inputText,
            instructions,
            agentName,
          });
          if (envelope.includes("[GateReviewInput]")) {
            return {
              outputText: JSON.stringify({
                decision: "approved",
                reason: "Evidence and verification are sufficient.",
                fixes: [],
              }),
            };
          }
          if (/you are guide/i.test(instructions)) {
            return {
              outputText: "Plan prepared. Trace first, fix second, verify last.",
            };
          }
          if (agentName === "pal-alpha") {
            return {
              outputText: "Trace complete. Reproduction steps and evidence were collected.",
            };
          }
          if (agentName === "gate-core") {
            return {
              outputText: JSON.stringify({
                decision: "approved",
                reason: "Evidence and verification are sufficient.",
                fixes: [],
              }),
            };
          }
          return {
            outputText: `${agentName || "worker"} stub output`,
          };
        },
      }),
    }),
  });
}

async function appendOrchestrationDebugRunSafe(settings, record) {
  if (!settings || typeof settings.appendOrchestrationDebugRun !== "function") return;
  try {
    await settings.appendOrchestrationDebugRun(record);
  } catch (error) {
    console.warn("[tomoshibikan] failed to append orchestration debug run", error);
  }
}

function parseDotEnv(content) {
  const parsed = {};
  const lines = String(content || "").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const equalIndex = trimmed.indexOf("=");
    if (equalIndex <= 0) return;
    const key = trimmed.slice(0, equalIndex).trim();
    if (!key) return;
    let value = trimmed.slice(equalIndex + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  });
  return parsed;
}

function loadDotEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = parseDotEnv(content);
  Object.entries(parsed).forEach(([key, value]) => {
    if (typeof process.env[key] === "undefined") {
      process.env[key] = value;
    }
  });
  return parsed;
}

function resolveRuntimeDefaultsFromEnv() {
  return {
    providerId: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    baseUrl: normalizeString(process.env.LMSTUDIO_BASE_URL) || "http://192.168.11.16:1234/v1",
    apiKey: normalizeString(process.env.LMSTUDIO_API_KEY),
  };
}

function appPathOrEmpty(name) {
  try {
    return app.getPath(name);
  } catch (error) {
    return "";
  }
}

function resolveWorkspacePathsFromApp() {
  const primaryRoot = resolveWorkspaceRoot({
    platform: process.platform,
    envWorkspaceRoot: normalizeString(
      process.env.TOMOSHIBIKAN_WS_ROOT ||
      process.env.TOMOSHIBIKAN_WORKSPACE_ROOT ||
      process.env.PALPAL_WS_ROOT ||
      process.env.PALPAL_WORKSPACE_ROOT
    ),
    documentsPath: appPathOrEmpty("documents"),
    homePath: appPathOrEmpty("home"),
    userDataPath: appPathOrEmpty("userData"),
  });
  const userDataPath = appPathOrEmpty("userData");
  const tempPath = appPathOrEmpty("temp");
  const fallbackRoots = [
    primaryRoot,
    userDataPath ? path.join(userDataPath, "workspaces", "tomoshibi-kan") : "",
    tempPath ? path.join(tempPath, "tomoshibi-kan", "workspace") : "",
  ];
  const resolved = resolveWritableWorkspacePaths(fallbackRoots);
  if (resolved.fallbackUsed) {
    // English-only log: startup diagnostics should be locale-agnostic.
    console.warn(
      `[tomoshibikan] workspace root fallback applied: primary=${primaryRoot} selected=${resolved.wsRoot}`
    );
  }
  return resolved.paths;
}

function resolveRuntimeWorkspaceRoot(rawWorkspaceRoot) {
  const candidate = normalizeString(rawWorkspaceRoot);
  if (candidate) {
    const absolute = path.resolve(candidate);
    try {
      if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) {
        return absolute;
      }
    } catch (error) {
      // fallback below
    }
  }
  return normalizeString(workspacePaths?.wsRoot);
}

function createSettingsStore() {
  workspacePaths = workspacePaths || resolveWorkspacePathsFromApp();
  return new SqliteSettingsStore({
    dbPath: workspacePaths.dbPath,
    secretsPath: workspacePaths.secretsPath,
    safeStorage,
  });
}

function createAgentIdentityStore() {
  workspacePaths = workspacePaths || resolveWorkspacePathsFromApp();
  return new AgentIdentityStore({
    workspaceRoot: workspacePaths.wsRoot,
  });
}

function bindIpc(settings, identity) {
  ipcMain.handle("settings:load", async () => {
    return settings.load();
  });
  ipcMain.handle("settings:save", async (_event, payload) => {
    return settings.save(payload);
  });
  ipcMain.handle("settings:resolve-model-api-key", async (_event, modelName) => {
    return settings.resolveModelApiKey(modelName);
  });
  ipcMain.handle("debug-runs:list", async (_event, options) => {
    return settings.listOrchestrationDebugRuns(options);
  });
  ipcMain.handle("agent-identity:load", async (_event, payload) => {
    return identity.loadAgentIdentity(payload);
  });
  ipcMain.handle("agent-identity:save", async (_event, payload) => {
    return identity.saveAgentIdentity(payload);
  });
  const listProviderModelsHandler = async () => {
    const latest = await listCoreProviderModels({
      lmstudioBaseUrl: runtimeDefaults?.baseUrl,
      lmstudioApiKey: runtimeDefaults?.apiKey,
      lmstudioModel: runtimeDefaults?.modelName,
    });
    coreCatalog = latest;
    return latest;
  };
  ipcMain.handle("tomoshibikan-core:list-provider-models", listProviderModelsHandler);
  ipcMain.handle("palpal-core:list-provider-models", listProviderModelsHandler);
  ipcMain.handle("guide:chat", async (_event, payload) => {
    const input = payload && typeof payload === "object" ? payload : {};
    const modelName = normalizeString(input.modelName);
    const explicitApiKey = normalizeString(input.apiKey);
    const storedApiKey = modelName ? normalizeString(await settings.resolveModelApiKey(modelName)) : "";
    const runtimeInput = {
      provider: input.provider,
      modelName,
      baseUrl: input.baseUrl,
      apiKey: storedApiKey || explicitApiKey,
      userText: input.userText,
      systemPrompt: input.systemPrompt,
      messages: input.messages,
      responseFormat: input.responseFormat,
      enabledSkillIds: Array.isArray(input.enabledSkillIds) ? input.enabledSkillIds : [],
      workspaceRoot: resolveRuntimeWorkspaceRoot(input.workspaceRoot),
    };
    try {
      const result = await requestGuideChatCompletion(runtimeInput);
      await appendOrchestrationDebugRunSafe(settings, {
        stage: normalizeString(input.debugMeta?.stage) || "guide_chat",
        agentRole: normalizeString(input.debugMeta?.agentRole) || "guide",
        agentId: normalizeString(input.debugMeta?.agentId),
        targetKind: normalizeString(input.debugMeta?.targetKind) || "plan",
        targetId: normalizeString(input.debugMeta?.targetId),
        status: "ok",
        provider: normalizeString(result?.provider || runtimeInput.provider),
        modelName: normalizeString(result?.modelName || runtimeInput.modelName),
        input: sanitizeRuntimePayloadForDebug(runtimeInput),
        output: sanitizeRuntimeResponseForDebug(result),
        meta: input.debugMeta && typeof input.debugMeta === "object" ? input.debugMeta : {},
      });
      return result;
    } catch (error) {
      await appendOrchestrationDebugRunSafe(settings, {
        stage: normalizeString(input.debugMeta?.stage) || "guide_chat",
        agentRole: normalizeString(input.debugMeta?.agentRole) || "guide",
        agentId: normalizeString(input.debugMeta?.agentId),
        targetKind: normalizeString(input.debugMeta?.targetKind) || "plan",
        targetId: normalizeString(input.debugMeta?.targetId),
        status: "error",
        provider: normalizeString(runtimeInput.provider),
        modelName: normalizeString(runtimeInput.modelName),
        input: sanitizeRuntimePayloadForDebug(runtimeInput),
        output: {},
        errorText: normalizeString(error?.message || error),
        meta: input.debugMeta && typeof input.debugMeta === "object" ? input.debugMeta : {},
      });
      throw error;
    }
  });
  ipcMain.handle("pal:chat", async (_event, payload) => {
    const input = payload && typeof payload === "object" ? payload : {};
    const modelName = normalizeString(input.modelName);
    const explicitApiKey = normalizeString(input.apiKey);
    const storedApiKey = modelName ? normalizeString(await settings.resolveModelApiKey(modelName)) : "";
    const runtimeInput = {
      provider: input.provider,
      modelName,
      baseUrl: input.baseUrl,
      apiKey: storedApiKey || explicitApiKey,
      userText: input.userText,
      systemPrompt: input.systemPrompt,
      messages: input.messages,
      agentName: input.agentName,
      enabledSkillIds: Array.isArray(input.enabledSkillIds) ? input.enabledSkillIds : [],
      workspaceRoot: resolveRuntimeWorkspaceRoot(input.workspaceRoot),
      maxTurns: input.maxTurns,
    };
    try {
      const result = await requestPalChatCompletion(runtimeInput);
      await appendOrchestrationDebugRunSafe(settings, {
        stage: normalizeString(input.debugMeta?.stage) || "worker_runtime",
        agentRole: normalizeString(input.debugMeta?.agentRole) || "worker",
        agentId: normalizeString(input.debugMeta?.agentId || input.agentName),
        targetKind: normalizeString(input.debugMeta?.targetKind),
        targetId: normalizeString(input.debugMeta?.targetId),
        status: "ok",
        provider: normalizeString(result?.provider || runtimeInput.provider),
        modelName: normalizeString(result?.modelName || runtimeInput.modelName),
        input: sanitizeRuntimePayloadForDebug(runtimeInput),
        output: sanitizeRuntimeResponseForDebug(result),
        meta: input.debugMeta && typeof input.debugMeta === "object" ? input.debugMeta : {},
      });
      return result;
    } catch (error) {
      await appendOrchestrationDebugRunSafe(settings, {
        stage: normalizeString(input.debugMeta?.stage) || "worker_runtime",
        agentRole: normalizeString(input.debugMeta?.agentRole) || "worker",
        agentId: normalizeString(input.debugMeta?.agentId || input.agentName),
        targetKind: normalizeString(input.debugMeta?.targetKind),
        targetId: normalizeString(input.debugMeta?.targetId),
        status: "error",
        provider: normalizeString(runtimeInput.provider),
        modelName: normalizeString(runtimeInput.modelName),
        input: sanitizeRuntimePayloadForDebug(runtimeInput),
        output: {},
        errorText: normalizeString(error?.message || error),
        meta: input.debugMeta && typeof input.debugMeta === "object" ? input.debugMeta : {},
      });
      throw error;
    }
  });
  ipcMain.handle("project:pick-directory", async () => {
    const result = await dialog.showOpenDialog({
      title: "Select Project Directory",
      properties: ["openDirectory", "dontAddToRecent"],
    });
    if (result.canceled || !Array.isArray(result.filePaths) || result.filePaths.length === 0) {
      return "";
    }
    return normalizeString(result.filePaths[0]);
  });
  ipcMain.handle("external:open", async (_event, url) => {
    const target = normalizeString(url);
    if (!shouldOpenExternally(target)) return false;
    try {
      await shell.openExternal(target);
      return true;
    } catch (error) {
      return false;
    }
  });
}

function encodeRuntimeDefaultsArg(defaults) {
  const payload = Buffer.from(JSON.stringify(defaults), "utf8").toString("base64");
  return `--tomoshibikan-runtime-defaults=${payload}`;
}

function encodeCoreCatalogArg(catalog) {
  const payload = Buffer.from(JSON.stringify(catalog || { providers: [], models: [] }), "utf8").toString("base64");
  return `--tomoshibikan-core-catalog=${payload}`;
}

function shouldOpenExternally(url) {
  try {
    const parsed = new URL(String(url || ""));
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function createMainWindow(defaults, catalog) {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#F7FAFC",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      additionalArguments: [encodeRuntimeDefaultsArg(defaults), encodeCoreCatalogArg(catalog)],
      preload: path.join(__dirname, "electron-preload.js"),
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (shouldOpenExternally(url)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    const currentUrl = mainWindow.webContents.getURL();
    if (url === currentUrl) return;
    if (shouldOpenExternally(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.loadFile(path.join(__dirname, "wireframe", "index.html"));
}

app.whenReady().then(async () => {
  loadDotEnvFile(path.join(__dirname, ".env"));
  configureDebugStubRuntimeIfEnabled();
  runtimeDefaults = resolveRuntimeDefaultsFromEnv();
  try {
    coreCatalog = await listCoreProviderModels({
      lmstudioBaseUrl: runtimeDefaults.baseUrl,
      lmstudioApiKey: runtimeDefaults.apiKey,
      lmstudioModel: runtimeDefaults.modelName,
    });
  } catch (error) {
    coreCatalog = { providers: [], models: [] };
  }
  settingsStore = createSettingsStore();
  agentIdentityStore = createAgentIdentityStore();
  bindIpc(settingsStore, agentIdentityStore);
  createMainWindow(runtimeDefaults, coreCatalog);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(runtimeDefaults, coreCatalog);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (!settingsStore) return;
  settingsStore.close();
});
