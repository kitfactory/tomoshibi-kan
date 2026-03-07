(function attachSkillCatalogValidation(scope) {
  function unique(values) {
    return values.filter((value, index) => values.indexOf(value) === index);
  }

  function normalizeSkillId(skillId, allowedSkillIds) {
    if (!skillId) return "";
    const normalized = String(skillId).trim();
    if (!normalized) return "";
    if (!Array.isArray(allowedSkillIds) || allowedSkillIds.length === 0) return "";
    return allowedSkillIds.includes(normalized) ? normalized : "";
  }

  function normalizeRegisteredSkillIds(registeredSkillIds, allowedSkillIds) {
    if (!Array.isArray(registeredSkillIds)) return [];
    return unique(
      registeredSkillIds
        .map((skillId) => normalizeSkillId(skillId, allowedSkillIds))
        .filter(Boolean)
    );
  }

  function searchSkillCatalogItems(catalogItems, query) {
    const list = Array.isArray(catalogItems) ? catalogItems : [];
    const keyword = String(query || "").trim().toLowerCase();
    if (!keyword) return [...list];
    return list.filter((skill) => {
      const fields = [
        skill?.id,
        skill?.name,
        skill?.description,
        skill?.packageName,
        skill?.source,
      ];
      return fields.some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }

  function installSkill(input) {
    const allowedSkillIds = Array.isArray(input?.allowedSkillIds) ? input.allowedSkillIds : [];
    const registeredSkillIds = normalizeRegisteredSkillIds(input?.registeredSkillIds, allowedSkillIds);
    const skillId = normalizeSkillId(input?.skillId, allowedSkillIds);
    if (!skillId) {
      return {
        ok: false,
        errorCode: "MSG-PPH-1001",
        nextRegisteredSkillIds: registeredSkillIds,
      };
    }
    if (registeredSkillIds.includes(skillId)) {
      return {
        ok: false,
        errorCode: "MSG-PPH-1006",
        nextRegisteredSkillIds: registeredSkillIds,
      };
    }
    return {
      ok: true,
      nextRegisteredSkillIds: [...registeredSkillIds, skillId],
    };
  }

  function uninstallSkill(input) {
    const allowedSkillIds = Array.isArray(input?.allowedSkillIds) ? input.allowedSkillIds : [];
    const registeredSkillIds = normalizeRegisteredSkillIds(input?.registeredSkillIds, allowedSkillIds);
    const skillId = normalizeSkillId(input?.skillId, allowedSkillIds);
    if (!skillId) {
      return {
        ok: false,
        errorCode: "MSG-PPH-1001",
        nextRegisteredSkillIds: registeredSkillIds,
      };
    }
    return {
      ok: true,
      nextRegisteredSkillIds: registeredSkillIds.filter((id) => id !== skillId),
    };
  }

  const api = {
    normalizeSkillId,
    normalizeRegisteredSkillIds,
    searchSkillCatalogItems,
    installSkill,
    uninstallSkill,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.SkillCatalogValidation = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
