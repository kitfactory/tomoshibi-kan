(function attachSettingsSkillMarketState(scope) {
function resolveSkillCatalogValidationApi() {
  return typeof window !== "undefined" &&
    window.SkillCatalogValidation &&
    typeof window.SkillCatalogValidation.normalizeSkillId === "function" &&
    typeof window.SkillCatalogValidation.searchSkillCatalogItems === "function" &&
    typeof window.SkillCatalogValidation.installSkill === "function" &&
    typeof window.SkillCatalogValidation.uninstallSkill === "function"
    ? window.SkillCatalogValidation
    : null;
}

function normalizeGenericSkillId(skillId) {
  if (!skillId) return "";
  const normalized = String(skillId || "").trim();
  if (!normalized) return "";
  // Allow ClawHub-style slugs (letters/numbers/dash/underscore/dot).
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(normalized)) return "";
  return normalized;
}

function resolveAllowedSkillIdsForValidation(additionalSkillIds = []) {
  const result = [];
  const push = (value) => {
    const normalized = normalizeGenericSkillId(value);
    if (!normalized || result.includes(normalized)) return;
    result.push(normalized);
  };
  STANDARD_SKILL_IDS.forEach(push);
  CLAWHUB_SKILL_REGISTRY.forEach((skill) => push(skill?.id));
  ADDITIONAL_SKILL_REGISTRY.forEach((skill) => push(skill?.id));
  if (settingsState && Array.isArray(settingsState.registeredSkills)) {
    settingsState.registeredSkills.forEach(push);
  }
  if (settingsState && Array.isArray(settingsState.skillSearchResults)) {
    settingsState.skillSearchResults.forEach((skill) => push(skill?.id));
  }
  if (Array.isArray(additionalSkillIds)) {
    additionalSkillIds.forEach(push);
  }
  return result;
}

function normalizeSkillId(skillId) {
  const external = resolveSkillCatalogValidationApi();
  const allowedSkillIds = resolveAllowedSkillIdsForValidation();
  if (external) {
    const normalizedByExternal = external.normalizeSkillId(skillId, allowedSkillIds);
    if (normalizedByExternal) return normalizedByExternal;
  }
  return normalizeGenericSkillId(skillId);
}

function skillById(skillId) {
  const normalized = normalizeSkillId(skillId);
  if (!normalized) return null;
  return ADDITIONAL_SKILL_REGISTRY.find((skill) => normalizeSkillId(skill.id) === normalized) ||
    CLAWHUB_SKILL_REGISTRY.find((skill) => normalizeSkillId(skill.id) === normalized) ||
    null;
}

function skillName(skillId) {
  return skillById(skillId)?.name || skillId;
}

function normalizeIsoDateValue(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }
  const text = normalizeText(value);
  if (!text) return "";
  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? "" : new Date(parsed).toISOString();
}

function normalizeMetricValue(value, fallback = 0) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) return parsed;
  return Number.isFinite(Number(fallback)) ? Number(fallback) : 0;
}

function isUnknownSafetyValue(value) {
  const normalized = normalizeText(value).toLowerCase();
  return !normalized || normalized === "unknown";
}

function resolveSkillSuspiciousFlag(skill, localMeta) {
  if (typeof skill?.suspicious === "boolean") return skill.suspicious;
  if (typeof skill?.nonSuspicious === "boolean") return !skill.nonSuspicious;
  if (typeof localMeta?.suspicious === "boolean") return localMeta.suspicious;
  // ClawHub /search may omit suspicious metadata; treat unknown as non-suspicious
  // and rely on explicit flags when available.
  return false;
}

function normalizeClawHubSkillRecord(skill, fallback = {}) {
  const id = normalizeText(skill?.id || skill?.slug || fallback.id);
  if (!id) return null;
  const localMeta = CLAWHUB_SKILL_META[id] || {};
  const stats = skill?.stats && typeof skill.stats === "object" ? skill.stats : {};
  const updatedAt = normalizeIsoDateValue(skill?.updatedAt) ||
    normalizeIsoDateValue(skill?.latestVersion?.createdAt) ||
    normalizeIsoDateValue(fallback.updatedAt) ||
    normalizeIsoDateValue(localMeta.updatedAt);
  return {
    id,
    name: normalizeText(skill?.name || skill?.displayName || fallback.name || id) || id,
    description: normalizeText(skill?.description || skill?.summary || fallback.description),
    packageName: normalizeText(skill?.packageName || fallback.packageName || `clawhub/${id}`),
    source: normalizeText(skill?.source || fallback.source || "ClawHub"),
    safety: normalizeText(skill?.safety || fallback.safety || localMeta.safety || "Unknown"),
    rating: normalizeMetricValue(skill?.rating, fallback.rating ?? localMeta.rating ?? 0),
    downloads: normalizeMetricValue(
      stats.downloads ?? skill?.downloads,
      fallback.downloads ?? localMeta.downloads ?? 0
    ),
    stars: normalizeMetricValue(
      stats.stars ?? skill?.stars,
      fallback.stars ?? localMeta.stars ?? 0
    ),
    installs: normalizeMetricValue(
      stats.installsAllTime ?? stats.installsCurrent ?? skill?.installs,
      fallback.installs ?? localMeta.installs ?? 0
    ),
    updatedAt,
    highlighted: Boolean(skill?.highlighted || fallback.highlighted || localMeta.highlighted),
    suspicious: resolveSkillSuspiciousFlag(skill, localMeta),
  };
}

function mergeSkillRecords(primaryItems, secondaryItems) {
  const map = new Map();
  const upsert = (record) => {
    const normalized = normalizeClawHubSkillRecord(record);
    if (!normalized) return;
    const key = normalized.id.toLowerCase();
    const previous = map.get(key);
    if (!previous) {
      map.set(key, normalized);
      return;
    }
    const normalizedSafety = normalizeText(normalized.safety);
    const previousSafety = normalizeText(previous.safety);
    const mergedSafety = isUnknownSafetyValue(normalizedSafety)
      ? (previousSafety || normalizedSafety || "Unknown")
      : normalizedSafety;
    map.set(key, {
      ...previous,
      ...normalized,
      name: normalized.name || previous.name,
      description: normalized.description || previous.description,
      packageName: normalized.packageName || previous.packageName,
      source: normalized.source || previous.source,
      safety: mergedSafety,
      rating: normalized.rating > 0 ? normalized.rating : previous.rating,
      downloads: normalized.downloads > 0 ? normalized.downloads : previous.downloads,
      stars: normalized.stars > 0 ? normalized.stars : previous.stars,
      installs: normalized.installs > 0 ? normalized.installs : previous.installs,
      updatedAt: normalized.updatedAt || previous.updatedAt,
      highlighted: Boolean(previous.highlighted || normalized.highlighted),
      suspicious: Boolean(normalized.suspicious),
    });
  };

  (Array.isArray(secondaryItems) ? secondaryItems : []).forEach(upsert);
  (Array.isArray(primaryItems) ? primaryItems : []).forEach(upsert);
  return [...map.values()];
}

function upsertSkillRegistryRecords(records) {
  const merged = mergeSkillRecords(records, ADDITIONAL_SKILL_REGISTRY);
  const filtered = merged.filter((record) => !STANDARD_SKILL_IDS.includes(normalizeSkillId(record?.id)));
  ADDITIONAL_SKILL_REGISTRY.splice(0, ADDITIONAL_SKILL_REGISTRY.length, ...filtered);
}

function filterSkillRecordsByKeyword(items, query) {
  const keyword = normalizeSearchKeyword(query);
  if (!keyword) return [...items];
  return items.filter((skill) => {
    const fields = [
      skill.id,
      skill.name,
      skill.description,
      skill.packageName,
      skill.source,
      skill.safety,
      skill.rating,
      skill.downloads,
      skill.stars,
      skill.installs,
      skill.updatedAt,
      skill.highlighted,
      skill.suspicious,
    ];
    return fields.some((field) => normalizeSearchKeyword(field).includes(keyword));
  });
}

function searchLocalClawHubSkills(query) {
  const searchableCatalog = [...CLAWHUB_SKILL_REGISTRY, ...ADDITIONAL_SKILL_REGISTRY];
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.searchSkillCatalogItems(searchableCatalog, query);
  }
  return filterSkillRecordsByKeyword(searchableCatalog, query);
}

async function fetchClawHubJson(endpoint, queryParams = {}) {
  if (typeof fetch !== "function") return null;
  let url;
  try {
    url = new URL(String(endpoint || "").replace(/^\/+/, ""), `${CLAWHUB_API_BASE_URL}/`);
  } catch (error) {
    return null;
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = setTimeout(() => {
    if (controller) controller.abort();
  }, CLAWHUB_API_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeApiSearchResultRecord(item) {
  const id = normalizeText(item?.slug || item?.id);
  if (!id) return null;
  return normalizeClawHubSkillRecord({
    id,
    name: normalizeText(item?.displayName || item?.name || id) || id,
    description: normalizeText(item?.summary || item?.description),
    packageName: `clawhub/${id}`,
    source: "ClawHub",
    updatedAt: item?.updatedAt,
  });
}

function normalizeApiSkillItemRecord(item) {
  return normalizeClawHubSkillRecord({
    id: item?.slug || item?.id,
    name: item?.displayName || item?.name,
    description: item?.summary || item?.description,
    packageName: item?.packageName,
    source: "ClawHub",
    safety: item?.safety,
    rating: item?.rating,
    stats: item?.stats,
    downloads: item?.downloads,
    stars: item?.stars,
    installs: item?.installs,
    updatedAt: item?.updatedAt,
    latestVersion: item?.latestVersion,
    highlighted: item?.highlighted,
    suspicious: item?.suspicious,
    nonSuspicious: item?.nonSuspicious,
  });
}

function normalizeApiSkillDetailRecord(payload) {
  const skill = payload?.skill && typeof payload.skill === "object"
    ? payload.skill
    : null;
  if (!skill) return null;
  return normalizeApiSkillItemRecord({
    id: skill.slug,
    name: skill.displayName,
    description: skill.summary,
    packageName: skill.packageName,
    source: "ClawHub",
    safety: skill.safety,
    rating: skill.rating,
    stats: skill.stats,
    downloads: skill.downloads,
    stars: skill.stars,
    installs: skill.installs,
    updatedAt: skill.updatedAt,
    latestVersion: payload?.latestVersion,
    highlighted: skill.highlighted,
    suspicious: skill.suspicious,
    nonSuspicious: skill.nonSuspicious,
  });
}

async function fetchClawHubSkillDetailRecords(skillIds) {
  const ids = Array.isArray(skillIds)
    ? skillIds
      .map((skillId) => normalizeGenericSkillId(skillId))
      .filter(Boolean)
    : [];
  if (ids.length === 0) return [];
  const deduped = [...new Set(ids)].slice(0, CLAWHUB_API_DETAIL_ENRICH_LIMIT);
  const results = await Promise.all(
    deduped.map(async (skillId) => {
      const payload = await fetchClawHubJson(`skills/${encodeURIComponent(skillId)}`);
      return normalizeApiSkillDetailRecord(payload);
    })
  );
  return results.filter(Boolean);
}

async function searchClawHubSkillsApi(query, filters) {
  const normalizedFilters = normalizeSkillSearchFilters(filters);
  const keyword = normalizeSearchKeyword(query);
  const isKeywordSearch = Boolean(keyword);
  const catalogLimit = isKeywordSearch ? CLAWHUB_API_SEARCH_LIMIT : CLAWHUB_API_BROWSE_LIMIT;
  const baseParams = {
    limit: catalogLimit,
    sort: normalizedFilters.sortBy,
    nonSuspicious: normalizedFilters.nonSuspiciousOnly ? "true" : undefined,
    highlighted: normalizedFilters.highlightedOnly ? "true" : undefined,
  };

  const catalogPayload = await fetchClawHubJson("skills", baseParams);
  const catalogItems = Array.isArray(catalogPayload?.items)
    ? catalogPayload.items.map(normalizeApiSkillItemRecord).filter(Boolean)
    : [];

  if (!keyword) {
    return {
      ok: Array.isArray(catalogPayload?.items),
      items: catalogItems,
    };
  }

  const searchPayload = await fetchClawHubJson("search", {
    q: keyword,
    ...baseParams,
  });
  const searchItems = Array.isArray(searchPayload?.results)
    ? searchPayload.results.map(normalizeApiSearchResultRecord).filter(Boolean)
    : [];
  const detailItems = searchItems.length > 0
    ? await fetchClawHubSkillDetailRecords(searchItems.map((item) => item.id))
    : [];
  const enrichedCatalog = mergeSkillRecords(detailItems, catalogItems);

  if (searchItems.length > 0) {
    return {
      ok: true,
      items: mergeSkillRecords(searchItems, enrichedCatalog),
    };
  }

  if (Array.isArray(catalogPayload?.items)) {
    return {
      ok: true,
      items: filterSkillRecordsByKeyword(catalogItems, keyword),
    };
  }

  return {
    ok: false,
    items: [],
  };
}

async function searchClawHubSkillsWithFallback(query, filters) {
  const keyword = normalizeSearchKeyword(query);
  const normalizedFilters = normalizeSkillSearchFilters(filters);
  const localMatches = searchLocalClawHubSkills(keyword).map((item) => normalizeClawHubSkillRecord(item)).filter(Boolean);
  const apiResult = await searchClawHubSkillsApi(keyword, normalizedFilters);
  const merged = apiResult.ok
    ? mergeSkillRecords(localMatches, apiResult.items)
    : localMatches;
  if (apiResult.ok) {
    upsertSkillRegistryRecords(apiResult.items);
  }
  const keywordFiltered = keyword ? filterSkillRecordsByKeyword(merged, keyword) : merged;
  return {
    usedApi: apiResult.ok,
    items: applySkillSearchFilters(keywordFiltered, normalizedFilters),
  };
}

function normalizeSkillMarketSortBy(sortBy) {
  if (!sortBy) return DEFAULT_SKILL_SEARCH_FILTERS.sortBy;
  return SKILL_MARKET_SORT_OPTIONS.includes(sortBy)
    ? sortBy
    : DEFAULT_SKILL_SEARCH_FILTERS.sortBy;
}

function normalizeSkillSearchFilters(filters) {
  const input = filters || {};
  return {
    nonSuspiciousOnly: input.nonSuspiciousOnly !== false,
    highlightedOnly: Boolean(input.highlightedOnly),
    sortBy: normalizeSkillMarketSortBy(input.sortBy),
  };
}

function sortSkillMarketItems(items, sortBy) {
  const normalizedSortBy = normalizeSkillMarketSortBy(sortBy);
  const withFallback = [...items];
  withFallback.sort((left, right) => {
    const leftName = String(left?.name || "");
    const rightName = String(right?.name || "");

    if (normalizedSortBy === "downloads") {
      const diff = Number(right?.downloads || 0) - Number(left?.downloads || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "stars") {
      const diff = Number(right?.stars || 0) - Number(left?.stars || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "installs") {
      const diff = Number(right?.installs || 0) - Number(left?.installs || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "updated") {
      const leftUpdated = Date.parse(String(left?.updatedAt || "")) || 0;
      const rightUpdated = Date.parse(String(right?.updatedAt || "")) || 0;
      const diff = rightUpdated - leftUpdated;
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "highlighted") {
      const diff = Number(Boolean(right?.highlighted)) - Number(Boolean(left?.highlighted));
      if (diff !== 0) return diff;
      const secondary = Number(right?.downloads || 0) - Number(left?.downloads || 0);
      return secondary !== 0 ? secondary : leftName.localeCompare(rightName);
    }
    return leftName.localeCompare(rightName);
  });
  return withFallback;
}

function applySkillSearchFilters(items, filters) {
  const normalized = normalizeSkillSearchFilters(filters);
  let next = [...items];
  if (normalized.nonSuspiciousOnly) {
    next = next.filter((skill) => !Boolean(skill?.suspicious));
  }
  if (normalized.highlightedOnly) {
    next = next.filter((skill) => Boolean(skill?.highlighted));
  }
  return sortSkillMarketItems(next, normalized.sortBy);
}

function installRegisteredSkillWithFallback(skillId, registeredSkillIds) {
  const allowedSkillIds = resolveAllowedSkillIdsForValidation([
    skillId,
    ...(Array.isArray(registeredSkillIds) ? registeredSkillIds : []),
  ]);
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.installSkill({
      skillId,
      registeredSkillIds,
      allowedSkillIds,
    });
  }

  const normalized = normalizeSkillId(skillId);
  if (!normalized) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1001",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  if (registeredSkillIds.includes(normalized)) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1006",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  return {
    ok: true,
    nextRegisteredSkillIds: [...registeredSkillIds, normalized],
  };
}

function uninstallRegisteredSkillWithFallback(skillId, registeredSkillIds) {
  const allowedSkillIds = resolveAllowedSkillIdsForValidation([
    skillId,
    ...(Array.isArray(registeredSkillIds) ? registeredSkillIds : []),
  ]);
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.uninstallSkill({
      skillId,
      registeredSkillIds,
      allowedSkillIds,
    });
  }

  const normalized = normalizeSkillId(skillId);
  if (!normalized) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1001",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  return {
    ok: true,
    nextRegisteredSkillIds: registeredSkillIds.filter((id) => id !== normalized),
  };
}

Object.assign(scope, {
  resolveSkillCatalogValidationApi,
  normalizeGenericSkillId,
  resolveAllowedSkillIdsForValidation,
  normalizeSkillId,
  skillById,
  skillName,
  normalizeIsoDateValue,
  normalizeMetricValue,
  isUnknownSafetyValue,
  resolveSkillSuspiciousFlag,
  normalizeClawHubSkillRecord,
  mergeSkillRecords,
  upsertSkillRegistryRecords,
  filterSkillRecordsByKeyword,
  searchLocalClawHubSkills,
  fetchClawHubJson,
  normalizeApiSearchResultRecord,
  normalizeApiSkillItemRecord,
  normalizeApiSkillDetailRecord,
  fetchClawHubSkillDetailRecords,
  searchClawHubSkillsApi,
  searchClawHubSkillsWithFallback,
  normalizeSkillMarketSortBy,
  normalizeSkillSearchFilters,
  sortSkillMarketItems,
  applySkillSearchFilters,
  installRegisteredSkillWithFallback,
  uninstallRegisteredSkillWithFallback,
});
})(typeof window !== "undefined" ? (window.SettingsSkillMarketState = window.SettingsSkillMarketState || {}) : globalThis);
