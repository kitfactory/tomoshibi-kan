const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeSkillId,
  normalizeRegisteredSkillIds,
  searchSkillCatalogItems,
  installSkill,
  uninstallSkill,
} = require("../../wireframe/skill-catalog.js");

const ALLOWED = [
  "codex-file-search",
  "codex-file-read",
  "browser-chrome",
];

const CATALOG = [
  {
    id: "codex-file-search",
    name: "File Search",
    description: "Search files",
    packageName: "clawhub/codex-file-search",
    source: "ClawHub",
  },
  {
    id: "browser-chrome",
    name: "Chrome Browser",
    description: "Control browser",
    packageName: "clawhub/browser-chrome",
    source: "ClawHub",
  },
];

test("normalizeSkillId validates allowed ids", () => {
  assert.equal(normalizeSkillId("codex-file-search", ALLOWED), "codex-file-search");
  assert.equal(normalizeSkillId("unknown", ALLOWED), "");
  assert.equal(normalizeSkillId("", ALLOWED), "");
});

test("normalizeRegisteredSkillIds deduplicates and filters", () => {
  const result = normalizeRegisteredSkillIds(
    ["codex-file-search", "codex-file-search", "unknown", "browser-chrome"],
    ALLOWED
  );
  assert.deepEqual(result, ["codex-file-search", "browser-chrome"]);
});

test("searchSkillCatalogItems filters by keyword", () => {
  assert.equal(searchSkillCatalogItems(CATALOG, "").length, 2);
  assert.deepEqual(
    searchSkillCatalogItems(CATALOG, "browser").map((item) => item.id),
    ["browser-chrome"]
  );
  assert.equal(searchSkillCatalogItems(CATALOG, "no-match").length, 0);
});

test("installSkill appends new skill and blocks duplicates", () => {
  const ok = installSkill({
    skillId: "browser-chrome",
    registeredSkillIds: ["codex-file-search"],
    allowedSkillIds: ALLOWED,
  });
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.nextRegisteredSkillIds, ["codex-file-search", "browser-chrome"]);

  const duplicated = installSkill({
    skillId: "codex-file-search",
    registeredSkillIds: ["codex-file-search"],
    allowedSkillIds: ALLOWED,
  });
  assert.equal(duplicated.ok, false);
  assert.equal(duplicated.errorCode, "MSG-PPH-1006");
});

test("uninstallSkill removes skill and keeps normalized list", () => {
  const result = uninstallSkill({
    skillId: "codex-file-search",
    registeredSkillIds: ["codex-file-search", "browser-chrome"],
    allowedSkillIds: ALLOWED,
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.nextRegisteredSkillIds, ["browser-chrome"]);
});

test("installSkill supports non-standard skill ids when allowed list includes them", () => {
  const allowed = [...ALLOWED, "duckduckgo-search"];
  const installed = installSkill({
    skillId: "duckduckgo-search",
    registeredSkillIds: ["codex-file-search"],
    allowedSkillIds: allowed,
  });
  assert.equal(installed.ok, true);
  assert.deepEqual(installed.nextRegisteredSkillIds, ["codex-file-search", "duckduckgo-search"]);
});
