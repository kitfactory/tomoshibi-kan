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
