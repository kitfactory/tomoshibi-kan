const path = require("path");
const { pathToFileURL } = require("url");

const WIREFRAME_URL = pathToFileURL(
  path.resolve(__dirname, "../../wireframe/index.html")
).href;

const TAB_SPECS = [
  { key: "guide", button: '[data-tab="guide"]', panel: '[data-tab-panel="guide"]' },
  { key: "pal", button: '[data-tab="pal"]', panel: '[data-tab-panel="pal"]' },
  { key: "project", button: '[data-tab="project"]', panel: '[data-tab-panel="project"]' },
  { key: "job", button: '[data-tab="job"]', panel: '[data-tab-panel="job"]' },
  { key: "task", button: '[data-tab="task"]', panel: '[data-tab-panel="task"]' },
  { key: "event", button: '[data-tab="event"]', panel: '[data-tab-panel="event"]' },
  { key: "settings", button: '[data-tab="settings"]', panel: '[data-tab-panel="settings"]' },
];

const VIEWPORTS = [
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
];

const CLAWHUB_LIVE_MODE =
  process.env.TOMOSHIBIKAN_E2E_LIVE === "1" || process.env.PALPAL_E2E_LIVE === "1";
const CLAWHUB_MOCK_BASE_SKILLS = [
  {
    slug: "codex-file-search",
    displayName: "File Search",
    summary: "Search files and text quickly",
    safety: "High",
    rating: 4.8,
    downloads: 12420,
    stars: 932,
    installs: 4180,
    updatedAt: "2026-03-01T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
  {
    slug: "codex-file-read",
    displayName: "File Read",
    summary: "Open and inspect file contents",
    safety: "High",
    rating: 4.7,
    downloads: 11300,
    stars: 870,
    installs: 3950,
    updatedAt: "2026-02-20T08:00:00Z",
    highlighted: false,
    suspicious: false,
  },
  {
    slug: "codex-file-edit",
    displayName: "File Edit",
    summary: "Apply safe file edits and patches",
    safety: "Medium",
    rating: 4.5,
    downloads: 9850,
    stars: 721,
    installs: 3520,
    updatedAt: "2026-02-14T08:00:00Z",
    highlighted: false,
    suspicious: false,
  },
  {
    slug: "codex-shell-command",
    displayName: "Shell Command",
    summary: "Run terminal commands in workspace",
    safety: "Medium",
    rating: 4.2,
    downloads: 8120,
    stars: 604,
    installs: 2870,
    updatedAt: "2026-01-29T08:00:00Z",
    highlighted: false,
    suspicious: true,
  },
  {
    slug: "codex-test-runner",
    displayName: "Test Runner",
    summary: "Execute tests and inspect failures",
    safety: "High",
    rating: 4.6,
    downloads: 10450,
    stars: 788,
    installs: 3340,
    updatedAt: "2026-02-24T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
  {
    slug: "browser-chrome",
    displayName: "Chrome Browser",
    summary: "Chrome browser control skill",
    safety: "Medium",
    rating: 4.4,
    downloads: 9080,
    stars: 682,
    installs: 3010,
    updatedAt: "2026-02-10T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
  {
    slug: "duckduckgo-search",
    displayName: "DuckDuckGo Search",
    summary: "Performs web searches using DuckDuckGo.",
    safety: "Unknown",
    rating: 4.0,
    downloads: 4200,
    stars: 310,
    installs: 1100,
    updatedAt: "2026-03-04T08:00:00Z",
    highlighted: false,
    // intentionally omit suspicious to mirror /search payload gaps
  },
  {
    slug: "ddg",
    displayName: "Ddg",
    summary: "Privacy web search skill for terminal workflows.",
    safety: "Unknown",
    rating: 0,
    downloads: 1900,
    stars: 0,
    installs: 18,
    updatedAt: "2026-03-04T09:00:00Z",
    highlighted: false,
    suspicious: false,
  },
];
const CLAWHUB_MOCK_FILLER_SKILLS = Array.from({ length: 40 }, (_, index) => {
  const rank = 40 - index;
  const id = String(index + 1).padStart(2, "0");
  return {
    slug: `filler-skill-${id}`,
    displayName: `Filler Skill ${id}`,
    summary: "Filler skill for ranking and limit coverage.",
    safety: "High",
    rating: 4.1,
    downloads: 5000 + rank * 250,
    stars: 200 + rank,
    installs: 700 + rank,
    updatedAt: "2026-03-02T08:00:00Z",
    highlighted: false,
    suspicious: false,
  };
});
const CLAWHUB_MOCK_SKILLS = [...CLAWHUB_MOCK_BASE_SKILLS, ...CLAWHUB_MOCK_FILLER_SKILLS];

function sortSkillsForMock(items, sortBy) {
  const list = [...items];
  list.sort((left, right) => {
    const leftName = String(left.displayName || "");
    const rightName = String(right.displayName || "");
    if (sortBy === "stars") {
      const diff = Number(right.stars || 0) - Number(left.stars || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (sortBy === "installs") {
      const diff = Number(right.installs || 0) - Number(left.installs || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (sortBy === "updated") {
      const leftTime = Date.parse(left.updatedAt || "") || 0;
      const rightTime = Date.parse(right.updatedAt || "") || 0;
      const diff = rightTime - leftTime;
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (sortBy === "highlighted") {
      const highlightDiff = Number(Boolean(right.highlighted)) - Number(Boolean(left.highlighted));
      if (highlightDiff !== 0) return highlightDiff;
      const diff = Number(right.downloads || 0) - Number(left.downloads || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    const diff = Number(right.downloads || 0) - Number(left.downloads || 0);
    return diff !== 0 ? diff : leftName.localeCompare(rightName);
  });
  return list;
}

async function setupClawHubMock(page) {
  if (CLAWHUB_LIVE_MODE) return;
  await page.route("https://clawhub.ai/api/v1/**", async (route) => {
    const requestUrl = new URL(route.request().url());
    const pathName = requestUrl.pathname;
    const parsedLimit = Number(requestUrl.searchParams.get("limit") || "30");
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.floor(parsedLimit)
      : 30;
    const headers = {
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    };
    if (pathName.endsWith("/skills")) {
      const nonSuspiciousOnly = requestUrl.searchParams.get("nonSuspicious") === "true";
      const highlightedOnly = requestUrl.searchParams.get("highlighted") === "true";
      const sortBy = String(requestUrl.searchParams.get("sort") || "downloads");
      let items = [...CLAWHUB_MOCK_SKILLS];
      if (nonSuspiciousOnly) {
        items = items.filter((item) => !item.suspicious);
      }
      if (highlightedOnly) {
        items = items.filter((item) => item.highlighted);
      }
      items = sortSkillsForMock(items, sortBy);
      items = items.slice(0, limit);
      await route.fulfill({
        status: 200,
        headers,
        body: JSON.stringify({ items }),
      });
      return;
    }
    if (pathName.includes("/skills/")) {
      const slug = decodeURIComponent(pathName.split("/skills/")[1] || "").trim();
      const item = CLAWHUB_MOCK_SKILLS.find((entry) => entry.slug === slug);
      if (!item) {
        await route.fulfill({
          status: 404,
          headers,
          body: JSON.stringify({ error: "not_found" }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        headers,
        body: JSON.stringify({
          skill: {
            slug: item.slug,
            displayName: item.displayName,
            summary: item.summary,
            stats: {
              downloads: item.downloads,
              stars: item.stars,
              installsAllTime: item.installs,
              installsCurrent: item.installs,
            },
            updatedAt: item.updatedAt,
          },
        }),
      });
      return;
    }
    if (pathName.endsWith("/search")) {
      const keyword = String(requestUrl.searchParams.get("q") || "").toLowerCase();
      const results = CLAWHUB_MOCK_SKILLS
        .filter((item) => {
          const haystack = [item.slug, item.displayName, item.summary].join(" ").toLowerCase();
          return haystack.includes(keyword);
        })
        .slice(0, limit)
        .map((item) => ({
          slug: item.slug,
          displayName: item.displayName,
          summary: item.summary,
        }));
      await route.fulfill({
        status: 200,
        headers,
        body: JSON.stringify({ results }),
      });
      return;
    }
    await route.fulfill({
      status: 404,
      headers,
      body: JSON.stringify({ error: "not_found" }),
    });
  });
}

module.exports = {
  WIREFRAME_URL,
  TAB_SPECS,
  VIEWPORTS,
  setupClawHubMock,
};
