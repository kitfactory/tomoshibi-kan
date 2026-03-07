const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeLocale(value) {
  return normalizeString(value) === "en" ? "en" : "ja";
}

function dedupeStrings(values) {
  if (!Array.isArray(values)) return [];
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const normalized = normalizeString(value);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });
  return result;
}

function normalizeModelInput(model) {
  const name = normalizeString(model?.name);
  if (!name) return null;
  return {
    name,
    provider: normalizeString(model?.provider) || "openai",
    baseUrl: normalizeString(model?.baseUrl),
    endpoint: normalizeString(model?.endpoint),
    apiKeyInput: normalizeString(model?.apiKeyInput || model?.apiKey),
  };
}

function normalizeSettingsPayload(payload) {
  const models = Array.isArray(payload?.registeredModels) ? payload.registeredModels : [];
  const modelMap = new Map();
  models.forEach((model) => {
    const normalized = normalizeModelInput(model);
    if (!normalized) return;
    const dedupeKey = normalized.name.toLowerCase();
    if (!modelMap.has(dedupeKey)) modelMap.set(dedupeKey, normalized);
  });
  const toolCapabilities = Array.isArray(payload?.registeredToolCapabilities)
    ? payload.registeredToolCapabilities
      .map((entry) => {
        const toolName = normalizeString(entry?.toolName);
        if (!toolName) return null;
        const capabilities = Array.isArray(entry?.capabilities)
          ? entry.capabilities
            .map((item) => {
              const id = normalizeString(item?.id);
              const name = normalizeString(item?.name);
              const kind = normalizeString(item?.kind);
              const description = normalizeString(item?.description);
              const stage = normalizeString(item?.stage);
              const enabled = item?.enabled === true;
              if (!id || !name || !kind) return null;
              return { id, name, kind, description, stage, enabled };
            })
            .filter(Boolean)
          : [];
        return {
          toolName,
          status: normalizeString(entry?.status) || "unavailable",
          fetchedAt: normalizeString(entry?.fetchedAt),
          commandName: normalizeString(entry?.commandName),
          versionText: normalizeString(entry?.versionText),
          capabilities,
          capabilitySummaries: dedupeStrings(entry?.capabilitySummaries),
          errorText: normalizeString(entry?.errorText),
        };
      })
      .filter(Boolean)
    : [];
  const toolCapabilityMap = new Map(toolCapabilities.map((entry) => [entry.toolName.toLowerCase(), entry]));
  return {
    locale: normalizeLocale(payload?.locale),
    registeredModels: [...modelMap.values()],
    registeredTools: dedupeStrings(payload?.registeredTools),
    registeredToolCapabilities: [...toolCapabilityMap.values()],
    registeredSkills: dedupeStrings(payload?.registeredSkills),
  };
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function queryRows(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function safeJsonStringify(value, fallback = "{}") {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return fallback;
  }
}

function safeJsonParse(value, fallback) {
  try {
    const parsed = JSON.parse(String(value || ""));
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

function createDebugRunId() {
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `debug-${now}-${rand}`;
}

function clampLimit(value, fallback = 50) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(1, Math.min(200, Math.floor(numeric)));
}

function normalizeDebugRunPayload(payload) {
  const createdAt = normalizeString(payload?.createdAt) || new Date().toISOString();
  return {
    runId: normalizeString(payload?.runId) || createDebugRunId(),
    createdAt,
    stage: normalizeString(payload?.stage),
    agentRole: normalizeString(payload?.agentRole),
    agentId: normalizeString(payload?.agentId),
    targetKind: normalizeString(payload?.targetKind),
    targetId: normalizeString(payload?.targetId),
    status: normalizeString(payload?.status) || "ok",
    provider: normalizeString(payload?.provider),
    modelName: normalizeString(payload?.modelName),
    inputJson: safeJsonStringify(payload?.input ?? {}, "{}"),
    outputJson: safeJsonStringify(payload?.output ?? {}, "{}"),
    errorText: normalizeString(payload?.errorText),
    metaJson: safeJsonStringify(payload?.meta ?? {}, "{}"),
  };
}

class FileSecretStore {
  constructor(options) {
    this.filePath = options.filePath;
    this.safeStorage = options.safeStorage;
  }

  readAll() {
    if (!fs.existsSync(this.filePath)) return {};
    try {
      const content = fs.readFileSync(this.filePath, "utf8");
      const parsed = JSON.parse(content);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  writeAll(map) {
    ensureDirForFile(this.filePath);
    fs.writeFileSync(this.filePath, JSON.stringify(map, null, 2), "utf8");
  }

  canEncrypt() {
    return Boolean(
      this.safeStorage &&
      typeof this.safeStorage.isEncryptionAvailable === "function" &&
      typeof this.safeStorage.encryptString === "function" &&
      typeof this.safeStorage.decryptString === "function" &&
      this.safeStorage.isEncryptionAvailable()
    );
  }

  async set(secretRef, value) {
    const ref = normalizeString(secretRef);
    const text = String(value || "");
    if (!ref || !text) return;
    const all = this.readAll();
    if (this.canEncrypt()) {
      const encrypted = this.safeStorage.encryptString(text);
      all[ref] = { kind: "encrypted", payload: Buffer.from(encrypted).toString("base64") };
    } else {
      all[ref] = { kind: "plain", payload: text };
    }
    this.writeAll(all);
  }

  async get(secretRef) {
    const ref = normalizeString(secretRef);
    if (!ref) return "";
    const all = this.readAll();
    const entry = all[ref];
    if (!entry || typeof entry !== "object") return "";
    if (entry.kind === "encrypted" && this.canEncrypt()) {
      try {
        const encrypted = Buffer.from(String(entry.payload || ""), "base64");
        return this.safeStorage.decryptString(encrypted) || "";
      } catch (error) {
        return "";
      }
    }
    if (entry.kind === "plain") return String(entry.payload || "");
    return "";
  }

  async remove(secretRef) {
    const ref = normalizeString(secretRef);
    if (!ref) return;
    const all = this.readAll();
    if (!Object.prototype.hasOwnProperty.call(all, ref)) return;
    delete all[ref];
    this.writeAll(all);
  }
}

class SqliteSettingsStore {
  constructor(options) {
    this.dbPath = options.dbPath;
    this.secretStore = new FileSecretStore({
      filePath: options.secretsPath,
      safeStorage: options.safeStorage,
    });
    this.initSqlJsImpl = options.initSqlJsImpl || initSqlJs;
    this.db = null;
    this.mutex = Promise.resolve();
    this.ready = this.initialize();
  }

  async initialize() {
    const wasmPath = require.resolve("sql.js/dist/sql-wasm.wasm");
    const SQL = await this.initSqlJsImpl({ locateFile: () => wasmPath });
    let db;
    if (fs.existsSync(this.dbPath)) {
      const file = fs.readFileSync(this.dbPath);
      db = new SQL.Database(file);
    } else {
      db = new SQL.Database();
    }
    db.run(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS model_configs (
        name TEXT PRIMARY KEY,
        provider TEXT NOT NULL,
        base_url TEXT NOT NULL DEFAULT '',
        endpoint TEXT NOT NULL DEFAULT '',
        api_key_ref TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL
      );
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS cli_tools (
        tool_name TEXT PRIMARY KEY
      );
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS cli_tool_capabilities (
        tool_name TEXT PRIMARY KEY,
        snapshot_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS skills (
        skill_id TEXT PRIMARY KEY
      );
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS orchestration_debug_runs (
        run_id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        stage TEXT NOT NULL,
        agent_role TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        target_kind TEXT NOT NULL DEFAULT '',
        target_id TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL,
        provider TEXT NOT NULL DEFAULT '',
        model_name TEXT NOT NULL DEFAULT '',
        input_json TEXT NOT NULL,
        output_json TEXT NOT NULL,
        error_text TEXT NOT NULL DEFAULT '',
        meta_json TEXT NOT NULL DEFAULT '{}'
      );
    `);
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_orchestration_debug_runs_created_at
      ON orchestration_debug_runs (created_at DESC);
    `);
    this.db = db;
    this.persistDb();
  }

  async withLock(work) {
    await this.ready;
    const previous = this.mutex;
    let release;
    this.mutex = new Promise((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      return await work();
    } finally {
      release();
    }
  }

  persistDb() {
    if (!this.db) return;
    const bytes = this.db.export();
    ensureDirForFile(this.dbPath);
    fs.writeFileSync(this.dbPath, Buffer.from(bytes));
  }

  mapLoadedSettings(localeValue, models, tools, toolCapabilities, skills) {
    return {
      locale: normalizeLocale(localeValue),
      registeredModels: models.map((row) => ({
        name: normalizeString(row.name),
        provider: normalizeString(row.provider) || "openai",
        baseUrl: normalizeString(row.base_url),
        endpoint: normalizeString(row.endpoint),
        apiKeyConfigured: Boolean(normalizeString(row.api_key_ref)),
      })),
      registeredTools: tools
        .map((row) => normalizeString(row.tool_name))
        .filter(Boolean),
      registeredToolCapabilities: toolCapabilities
        .map((row) => safeJsonParse(row.snapshot_json, {}))
        .filter((entry) => entry && typeof entry === "object" && normalizeString(entry.toolName)),
      registeredSkills: skills
        .map((row) => normalizeString(row.skill_id))
        .filter(Boolean),
    };
  }

  loadUnsafe() {
    const localeRows = queryRows(this.db, "SELECT value FROM app_settings WHERE key = 'locale' LIMIT 1");
    const localeValue = localeRows[0]?.value || "ja";
    const modelRows = queryRows(
      this.db,
      "SELECT name, provider, base_url, endpoint, api_key_ref FROM model_configs ORDER BY updated_at ASC, name ASC"
    );
    const toolRows = queryRows(this.db, "SELECT tool_name FROM cli_tools ORDER BY tool_name ASC");
    const toolCapabilityRows = queryRows(
      this.db,
      "SELECT tool_name, snapshot_json FROM cli_tool_capabilities ORDER BY tool_name ASC"
    );
    const skillRows = queryRows(this.db, "SELECT skill_id FROM skills ORDER BY skill_id ASC");
    return this.mapLoadedSettings(localeValue, modelRows, toolRows, toolCapabilityRows, skillRows);
  }

  async load() {
    return this.withLock(async () => {
      return this.loadUnsafe();
    });
  }

  async save(payload) {
    return this.withLock(async () => {
      const normalized = normalizeSettingsPayload(payload);
      const now = new Date().toISOString();
      const existingRows = queryRows(
        this.db,
        "SELECT name, api_key_ref FROM model_configs"
      );
      const existingByName = new Map(existingRows.map((row) => [normalizeString(row.name), normalizeString(row.api_key_ref)]));
      const incomingNames = new Set(normalized.registeredModels.map((model) => model.name));

      this.db.run("BEGIN TRANSACTION");
      try {
        existingByName.forEach((apiKeyRef, name) => {
          if (incomingNames.has(name)) return;
          if (apiKeyRef) {
            this.secretStore.remove(apiKeyRef);
          }
          this.db.run("DELETE FROM model_configs WHERE name = ?", [name]);
        });

        normalized.registeredModels.forEach((model) => {
          const previousRef = existingByName.get(model.name) || "";
          let apiKeyRef = previousRef || `model:${encodeURIComponent(model.name)}:api_key`;
          if (model.apiKeyInput) {
            this.secretStore.set(apiKeyRef, model.apiKeyInput);
          }
          if (!model.apiKeyInput && !previousRef) {
            apiKeyRef = "";
          }
          this.db.run(
            `INSERT INTO model_configs (name, provider, base_url, endpoint, api_key_ref, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(name) DO UPDATE SET
               provider = excluded.provider,
               base_url = excluded.base_url,
               endpoint = excluded.endpoint,
               api_key_ref = excluded.api_key_ref,
               updated_at = excluded.updated_at`,
            [model.name, model.provider, model.baseUrl, model.endpoint, apiKeyRef, now]
          );
        });

        this.db.run("DELETE FROM cli_tools");
        normalized.registeredTools.forEach((toolName) => {
          this.db.run("INSERT INTO cli_tools (tool_name) VALUES (?)", [toolName]);
        });

        this.db.run("DELETE FROM cli_tool_capabilities");
        normalized.registeredToolCapabilities
          .filter((entry) => normalized.registeredTools.includes(entry.toolName))
          .forEach((entry) => {
            this.db.run(
              `INSERT INTO cli_tool_capabilities (tool_name, snapshot_json, updated_at)
               VALUES (?, ?, ?)
               ON CONFLICT(tool_name) DO UPDATE SET
                 snapshot_json = excluded.snapshot_json,
                 updated_at = excluded.updated_at`,
              [entry.toolName, safeJsonStringify(entry, "{}"), now]
            );
          });

        this.db.run("DELETE FROM skills");
        normalized.registeredSkills.forEach((skillId) => {
          this.db.run("INSERT INTO skills (skill_id) VALUES (?)", [skillId]);
        });

        this.db.run(
          `INSERT INTO app_settings (key, value)
           VALUES ('locale', ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
          [normalized.locale]
        );

        this.db.run("COMMIT");
      } catch (error) {
        this.db.run("ROLLBACK");
        throw error;
      }

      this.persistDb();
      return this.loadUnsafe();
    });
  }

  async resolveModelApiKey(modelName) {
    return this.withLock(async () => {
      const name = normalizeString(modelName);
      if (!name) return "";
      const rows = queryRows(
        this.db,
        "SELECT api_key_ref FROM model_configs WHERE name = ? LIMIT 1",
        [name]
      );
      const apiKeyRef = normalizeString(rows[0]?.api_key_ref);
      if (!apiKeyRef) return "";
      return this.secretStore.get(apiKeyRef);
    });
  }

  async appendOrchestrationDebugRun(payload) {
    return this.withLock(async () => {
      const normalized = normalizeDebugRunPayload(payload);
      this.db.run(
        `INSERT INTO orchestration_debug_runs (
          run_id, created_at, stage, agent_role, agent_id, target_kind, target_id,
          status, provider, model_name, input_json, output_json, error_text, meta_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          normalized.runId,
          normalized.createdAt,
          normalized.stage,
          normalized.agentRole,
          normalized.agentId,
          normalized.targetKind,
          normalized.targetId,
          normalized.status,
          normalized.provider,
          normalized.modelName,
          normalized.inputJson,
          normalized.outputJson,
          normalized.errorText,
          normalized.metaJson,
        ]
      );
      this.persistDb();
      return {
        runId: normalized.runId,
        createdAt: normalized.createdAt,
      };
    });
  }

  async listOrchestrationDebugRuns(options = {}) {
    return this.withLock(async () => {
      const limit = clampLimit(options.limit, 50);
      const rows = queryRows(
        this.db,
        `SELECT run_id, created_at, stage, agent_role, agent_id, target_kind, target_id,
                status, provider, model_name, input_json, output_json, error_text, meta_json
           FROM orchestration_debug_runs
          ORDER BY created_at DESC
          LIMIT ?`,
        [limit]
      );
      return rows.map((row) => ({
        runId: normalizeString(row.run_id),
        createdAt: normalizeString(row.created_at),
        stage: normalizeString(row.stage),
        agentRole: normalizeString(row.agent_role),
        agentId: normalizeString(row.agent_id),
        targetKind: normalizeString(row.target_kind),
        targetId: normalizeString(row.target_id),
        status: normalizeString(row.status),
        provider: normalizeString(row.provider),
        modelName: normalizeString(row.model_name),
        input: safeJsonParse(row.input_json, {}),
        output: safeJsonParse(row.output_json, {}),
        errorText: normalizeString(row.error_text),
        meta: safeJsonParse(row.meta_json, {}),
      }));
    });
  }

  async close() {
    return this.withLock(async () => {
      if (!this.db) return;
      this.persistDb();
      this.db.close();
      this.db = null;
    });
  }
}

module.exports = {
  SqliteSettingsStore,
  normalizeSettingsPayload,
  normalizeDebugRunPayload,
};
