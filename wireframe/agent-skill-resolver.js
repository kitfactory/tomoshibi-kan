(function attachAgentSkillResolver(scope) {
  function normalizeString(value) {
    return String(value || "").trim();
  }

  function normalizeRuntimeKind(value) {
    return normalizeString(value).toLowerCase() === "tool" ? "tool" : "model";
  }

  function normalizeSkillIds(values) {
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

  function buildCatalogMap(catalogItems) {
    const map = new Map();
    if (!Array.isArray(catalogItems)) return map;
    catalogItems.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const id = normalizeString(item.id);
      if (!id) return;
      map.set(id, {
        id,
        name: normalizeString(item.name) || id,
        description: normalizeString(item.description),
      });
    });
    return map;
  }

  function resolveEffectiveSkillIds(input = {}) {
    const runtimeKind = normalizeRuntimeKind(input.runtimeKind);
    if (runtimeKind !== "model") return [];
    const configuredSkillIds = normalizeSkillIds(input.configuredSkillIds);
    const installedSkillIds = new Set(normalizeSkillIds(input.installedSkillIds));
    return configuredSkillIds.filter((skillId) => installedSkillIds.has(skillId));
  }

  function toSkillSummary(entry) {
    if (!entry) return "";
    if (entry.description) return `${entry.name}: ${entry.description}`;
    return entry.name;
  }

  function resolveSkillSummariesForContext(input = {}) {
    const effectiveSkillIds = resolveEffectiveSkillIds(input);
    const catalogMap = buildCatalogMap(input.catalogItems);
    const skillSummaries = effectiveSkillIds
      .map((skillId) => {
        const entry = catalogMap.get(skillId);
        if (!entry) return skillId;
        return toSkillSummary(entry);
      })
      .filter(Boolean);
    return {
      effectiveSkillIds,
      skillSummaries,
    };
  }

  const api = {
    resolveEffectiveSkillIds,
    resolveSkillSummariesForContext,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.AgentSkillResolver = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
