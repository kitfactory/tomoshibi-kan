const fs = require("fs");
const path = require("path");

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

function clampLimit(value, fallback = 50) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(1, Math.min(200, Math.floor(numeric)));
}

module.exports = {
  clampLimit,
  dedupeStrings,
  ensureDirForFile,
  normalizeLocale,
  normalizeModelInput,
  normalizeSettingsPayload,
  normalizeString,
  queryRows,
  safeJsonParse,
  safeJsonStringify,
};
