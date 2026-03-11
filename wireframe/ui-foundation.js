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
