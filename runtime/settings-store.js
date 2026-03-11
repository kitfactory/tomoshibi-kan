const fs = require("fs");
const initSqlJs = require("sql.js");
const {
  ensureDirForFile,
  normalizeLocale,
  normalizeSettingsPayload,
  normalizeString,
  queryRows,
  safeJsonParse,
  safeJsonStringify,
} = require("./settings-store-shared.js");
const {
  appendOrchestrationDebugRun,
  appendPlanArtifact,
  appendTaskProgressLogEntry,
  getLatestPlanArtifact,
  getLatestTaskProgressLogEntry,
  initializeRepositoryTables,
  listOrchestrationDebugRuns,
  listPlanArtifacts,
  listTaskProgressLogEntries,
  normalizeDebugRunPayload,
  normalizePlanArtifactPayload,
  normalizeTaskProgressLogPayload,
  updatePlanArtifact,
} = require("./settings-store-repositories.js");

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
    initializeRepositoryTables(db);
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
      return appendOrchestrationDebugRun(this.db, this.persistDb.bind(this), payload);
    });
  }

  async listOrchestrationDebugRuns(options = {}) {
    return this.withLock(async () => {
      return listOrchestrationDebugRuns(this.db, options);
    });
  }

  async appendTaskProgressLogEntry(payload) {
    return this.withLock(async () => {
      return appendTaskProgressLogEntry(this.db, this.persistDb.bind(this), payload);
    });
  }

  async listTaskProgressLogEntries(options = {}) {
    return this.withLock(async () => {
      return listTaskProgressLogEntries(this.db, options);
    });
  }

  async getLatestTaskProgressLogEntry(options = {}) {
    return this.withLock(async () => {
      return getLatestTaskProgressLogEntry(this.db, options);
    });
  }

  async appendPlanArtifact(payload) {
    return this.withLock(async () => {
      return appendPlanArtifact(this.db, this.persistDb.bind(this), payload);
    });
  }

  async updatePlanArtifact(planId, patch = {}) {
    return this.withLock(async () => {
      return updatePlanArtifact(this.db, this.persistDb.bind(this), planId, patch);
    });
  }

  async listPlanArtifacts(options = {}) {
    return this.withLock(async () => {
      return listPlanArtifacts(this.db, options);
    });
  }

  async getLatestPlanArtifact(options = {}) {
    return this.withLock(async () => {
      return getLatestPlanArtifact(this.db, options);
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
  normalizeTaskProgressLogPayload,
  normalizePlanArtifactPayload,
};
