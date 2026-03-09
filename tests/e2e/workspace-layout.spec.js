const { test, expect } = require("@playwright/test");
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

for (const viewport of VIEWPORTS) {
  test.describe(`workspace fits viewport ${viewport.width}x${viewport.height}`, () => {
    test.beforeEach(async ({ page }) => {
      await setupClawHubMock(page);
      await page.addInitScript(() => {
        const queue = [
          "C:/workspace/hive-docs",
          "C:/workspace/hive-docs",
          "C:/workspace/alpha-work",
        ];
        window.TomoshibikanProjectDialog = {
          pickDirectory: async () => queue.shift() || "C:/workspace/hive-docs",
        };
      });
      await page.setViewportSize(viewport);
      await page.goto(WIREFRAME_URL);
    });

    for (const tab of TAB_SPECS) {
      test(`${tab.key} panel stays inside viewport`, async ({ page }) => {
        await page.click(tab.button);
        await expect(page.locator(tab.panel)).toBeVisible();

        const panelMetrics = await page.locator(tab.panel).evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return {
            top: rect.top,
            bottom: rect.bottom,
            viewportHeight: window.innerHeight,
          };
        });

        expect(panelMetrics.top).toBeGreaterThanOrEqual(0);
        expect(panelMetrics.bottom).toBeLessThanOrEqual(
          panelMetrics.viewportHeight + 1
        );
      });
    }

    test("guide composer sticks to panel bottom", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      await expect(page.locator('[data-tab-panel="guide"]')).toBeVisible();

      const metrics = await page.evaluate(() => {
        const panel = document.querySelector('[data-tab-panel="guide"]');
        const composer = document.getElementById("guideComposer");
        if (!panel || !composer) return null;

        const panelRect = panel.getBoundingClientRect();
        const composerRect = composer.getBoundingClientRect();
        return {
          panelBottom: panelRect.bottom,
          composerBottom: composerRect.bottom,
        };
      });

      expect(metrics).not.toBeNull();
      const distance = Math.abs(metrics.panelBottom - metrics.composerBottom);
      expect(distance).toBeLessThanOrEqual(2);
    });

    test("guide chat is blocked when guide model is not configured", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      while ((await page.locator("[data-remove-model-index]").count()) > 0) {
        await page.locator("[data-remove-model-index]").first().click();
      }
      while ((await page.locator("[data-remove-tool-index]").count()) > 0) {
        await page.locator("[data-remove-tool-index]").first().click();
      }
      await page.click("#settingsTabSave");

      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "モデルなしで送信");
      await page.click("#guideSend");

      await expect(page.locator("#errorToastCode")).toContainText("MSG-PPH-1010");
      await expect(page.locator('[data-tab="settings"]')).toHaveClass(/active/);
      await expect(page.locator("#guideChat")).toContainText(/Guide の実行設定が未完了|Guide runtime is not configured/);
    });

    test("guide chat resumes after registering model in settings", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      while ((await page.locator("[data-remove-model-index]").count()) > 0) {
        await page.locator("[data-remove-model-index]").first().click();
      }
      await page.click("#settingsTabSave");

      await page.click("#settingsTabOpenAddItem");
      await page.selectOption("#settingsTabModelProvider", "openai");
      await page.selectOption("#settingsTabModelName", "gpt-4.1");
      await page.fill("#settingsTabModelApiKey", "guide-key");
      await page.click("#settingsTabAddItemSubmit");
      await page.click("#settingsTabSave");

      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.selectOption('[data-pal-runtime-select="guide-core"]', "model");
      await page.selectOption('[data-pal-runtime-target-select="guide-core"]', "gpt-4.1");
      await page.click("#palConfigSave");

      await page.click('[data-tab="guide"]');
      const messages = page.locator("#guideChat .chat");
      const before = await messages.count();
      await page.fill("#guideInput", "この設計をお願いします");
      await page.click("#guideSend");
      await expect(messages).toHaveCount(before + 2);
      await expect(page.locator("#guideChat")).toContainText(/gpt-4\.1|openai\/gpt-oss-20b/);
    });

    test("guide chat accepts Codex CLI runtime", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.selectOption('[data-pal-runtime-select="guide-core"]', "tool");
      await page.selectOption('[data-pal-runtime-target-select="guide-core"]', "Codex");
      await page.click("#palConfigSave");

      await page.evaluate(() => {
        window.__lastGuideChatInput = null;
        const runtime = window.TomoshibikanCoreRuntime || {};
        const originalGuideChat = runtime.guideChat;
        runtime.guideChat = async (input) => {
          window.__lastGuideChatInput = input;
          return {
            provider: "codex-cli",
            modelName: "Codex",
            text: JSON.stringify({
              status: "conversation",
              reply: "tool-guide-ok",
            }),
            toolCalls: [],
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
        window.__restoreGuideChat = () => {
          runtime.guideChat = originalGuideChat;
        };
      });

      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "住人たちの作業の進め方を相談したい");
      await page.click("#guideSend");

      await expect.poll(async () => page.evaluate(() => window.__lastGuideChatInput?.runtimeKind || "")).toBe("tool");
      await expect.poll(async () => page.evaluate(() => window.__lastGuideChatInput?.toolName || "")).toBe("Codex");
      await expect(page.locator("#guideChat")).toContainText("tool-guide-ok");

      await page.evaluate(() => {
        if (typeof window.__restoreGuideChat === "function") {
          window.__restoreGuideChat();
        }
      });
    });

    test("guide chat reflects focus and sending state in UI", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      await page.locator("#guideInput").focus();
      await expect(page.locator(".app-shell")).toHaveClass(/guide-compose-active/);

      await page.evaluate(() => {
        if (typeof window.requestGuideModelReplyWithFallback !== "function") {
          throw new Error("guide reply request function is unavailable");
        }
        const original = window.requestGuideModelReplyWithFallback;
        window.requestGuideModelReplyWithFallback = async (...args) => {
          await new Promise((resolve) => window.setTimeout(resolve, 250));
          return original(...args);
        };
      });

      await page.fill("#guideInput", "Guide の送信状態を確認します");
      await page.click("#guideSend");

      await expect(page.locator(".app-shell")).toHaveClass(/guide-busy/);
      await expect(page.locator("#guideComposer")).toHaveAttribute("data-guide-state", "busy");
      await expect(page.locator("#guideSend")).toHaveAttribute("aria-busy", "true");
      await expect(page.locator("#guideSend")).toContainText(/送信中|Sending/);
      await expect(page.locator("#guideSend")).toHaveAttribute("aria-busy", "false");
      await expect(page.locator("#guideComposer")).toHaveAttribute("data-guide-state", "idle");
    });

    test("guide chat creates planned tasks and assigns workers", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.evaluate(() => {
        if (typeof window.requestGuideModelReplyWithFallback !== "function") {
          throw new Error("guide reply request function is unavailable");
        }
        const runtime = window.TomoshibikanCoreRuntime || {};
        window.requestGuideModelReplyWithFallback = async () => ({
          provider: "openai",
          modelName: "gpt-4.1",
          text: JSON.stringify({
            status: "plan_ready",
            reply: "実行プランを作成しました。3つの Task に分けます。",
            plan: {
              project: {
                id: "project-tomoshibi-kan",
                name: "tomoshibi-kan",
                directory: "C:/Users/kitad/palpal-hive",
              },
              goal: "設定画面の保存不具合を解消する",
              completionDefinition: "保存と再読み込みが成功する",
              constraints: ["既存設定フローは壊さない"],
              tasks: [
                {
                  title: "再現確認",
                  description: "保存不具合の再現手順を確認し、症状を整理する",
                  requiredSkills: ["browser-chrome", "codex-file-search"],
                },
                {
                  title: "修正実装",
                  description: "原因を修正し、保存処理の正常性を回復する",
                  requiredSkills: ["codex-file-edit"],
                },
                {
                  title: "検証",
                  description: "回帰テストを回し、修正実装を確認する",
                  requiredSkills: ["codex-test-runner"],
                },
              ],
            },
          }),
          toolCalls: [],
        });
        runtime.palChat = async (input) => {
          if (input?.debugMeta?.stage === "gate_review") {
            return {
              provider: "openai",
              modelName: "gpt-4.1",
              text: JSON.stringify({
                decision: "approved",
                reason: "確認できたので、このままでよさそうです。",
                fixes: [],
              }),
              toolCalls: [],
              runId: "debug-auto-gate-run",
            };
          }
          return {
            provider: input?.provider || "openai",
            modelName: input?.modelName || "gpt-4.1",
            text: "worker-payload-ok",
            toolCalls: [],
            runId: "debug-auto-worker-run",
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
      });
      await page.fill("#guideInput", "設定画面の保存を改善して、モデル登録と検証を進めてください");
      await page.click("#guideSend");
      const pendingPlan = await page.evaluate(async () => {
        const api = window.TomoshibikanPlanArtifacts || window.PalpalPlanArtifacts;
        if (!api || typeof api.latest !== "function") return null;
        return api.latest({ status: "pending_approval" });
      });
      expect(pendingPlan).toBeTruthy();
      expect(pendingPlan.plan.goal).toBe("設定画面の保存不具合を解消する");
      expect(pendingPlan.plan.project.id).toBe("project-tomoshibi-kan");
      expect(pendingPlan.status).toBe("pending_approval");
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount);
      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "はい");
      await page.click("#guideSend");
      const latestPlan = await page.evaluate(async () => {
        const api = window.TomoshibikanPlanArtifacts || window.PalpalPlanArtifacts;
        if (!api || typeof api.latest !== "function") return null;
        return api.latest({ status: "approved" });
      });
      expect(latestPlan).toBeTruthy();
      expect(latestPlan.planId).toBe(pendingPlan.planId);
      expect(latestPlan.status).toBe("approved");
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount + 3);
      const latestTask = page.locator('[data-task-row="TASK-004"]');
      await expect(latestTask).toHaveAttribute("data-plan-id", String(latestPlan.planId));
      await expect(latestTask).toContainText(/冬坂|久瀬|白峰/);
      await expect(page.locator("#guideChat")).toContainText(/進めます|実行を始めます/);
    });

    test("guide chat can materialize cron jobs from approved plan", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeJobCount = await page.locator('[data-job-row]').count();
      await page.evaluate(() => {
        window.requestGuideModelReplyWithFallback = async () => ({
          provider: "openai",
          modelName: "gpt-4.1",
          text: JSON.stringify({
            status: "plan_ready",
            reply: "定期確認の依頼としてまとめました。",
            plan: {
              project: {
                id: "project-tomoshibi-kan",
                name: "tomoshibi-kan",
                directory: "C:/Users/kitad/palpal-hive",
              },
              goal: "毎朝の保存確認を回す",
              completionDefinition: "毎朝の確認結果が残る",
              constraints: ["Project は設定済み"],
              tasks: [],
              jobs: [
                {
                  title: "毎朝 Settings 保存まわりを確認する",
                  description: "毎朝の保存確認を行う",
                  schedule: "0 9 * * 1-5",
                  instruction: "Settings を開いて保存と reload 復元を確認する",
                  expectedOutput: "確認結果",
                  requiredSkills: ["browser-chrome"],
                  reviewFocus: ["consistency"],
                  assigneePalId: "pal-alpha",
                },
              ],
            },
          }),
          toolCalls: [],
        });
      });
      await page.fill("#guideInput", "毎営業日の朝に保存確認を回したい");
      await page.click("#guideSend");
      const pendingPlan = await page.evaluate(async () => {
        const api = window.TomoshibikanPlanArtifacts || window.PalpalPlanArtifacts;
        if (!api || typeof api.latest !== "function") return null;
        return api.latest({ status: "pending_approval" });
      });
      expect(pendingPlan).toBeTruthy();
      await page.click('[data-tab="job"]');
      await expect(page.locator('[data-job-row]')).toHaveCount(beforeJobCount);
      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "進めて");
      await page.click("#guideSend");
      const approvedPlan = await page.evaluate(async () => {
        const api = window.TomoshibikanPlanArtifacts || window.PalpalPlanArtifacts;
        if (!api || typeof api.latest !== "function") return null;
        return api.latest({ status: "approved" });
      });
      expect(approvedPlan).toBeTruthy();
      expect(approvedPlan.planId).toBe(pendingPlan.planId);
      await page.click('[data-tab="job"]');
      await expect(page.locator('[data-job-row]')).toHaveCount(beforeJobCount + 1);
      const latestJob = page.locator('[data-job-row]').last();
      await expect(latestJob).toContainText(/毎朝 Settings 保存まわりを確認する/);
      await expect(latestJob).toContainText(/冬坂/);
    });

    test("guide prompts project setup before starting a new project request", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      const beforeJobCount = await page.locator('[data-job-row]').count();
      await page.fill("#guideInput", "新規プロジェクトを立ち上げて、最初の依頼を整理したい");
      await page.click("#guideSend");
      await expect(page.locator('[data-tab="project"]')).toHaveClass(/tab-active/);
      await expect(page.locator("#guideChat")).toContainText(/Project/);
      await expect(page.locator("#guideChat")).toContainText(/プロジェクト/);
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount);
      await page.click('[data-tab="job"]');
      await expect(page.locator('[data-job-row]')).toHaveCount(beforeJobCount);
    });

    test("guide prompts project setup before planning when no project is focused", async ({ page }) => {
      await page.click('[data-tab="project"]');
      while ((await page.locator("[data-project-remove-id]").count()) > 0) {
        await page.locator("[data-project-remove-id]").first().click();
      }
      await expect(page.locator("#projectList")).toContainText(/プロジェクトはありません|No projects/);
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      const beforeJobCount = await page.locator('[data-job-row]').count();
      await page.fill("#guideInput", "保存処理の不具合を調べて修正したい");
      await page.click("#guideSend");
      await expect(page.locator('[data-tab="project"]')).toHaveClass(/tab-active/);
      await expect(page.locator("#guideChat")).toContainText(/対象のプロジェクト|target project/i);
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount);
      await page.click('[data-tab="job"]');
      await expect(page.locator('[data-job-row]')).toHaveCount(beforeJobCount);
    });

    test("guide chat keeps dialog open when plan is not ready", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.evaluate(() => {
        if (typeof window.requestGuideModelReplyWithFallback !== "function") {
          throw new Error("guide reply request function is unavailable");
        }
        window.requestGuideModelReplyWithFallback = async () => ({
          provider: "openai",
          modelName: "gpt-4.1",
          text: JSON.stringify({
            status: "needs_clarification",
            reply: "対象、再現手順、期待結果が見えると組み立てやすいです。",
            plan: null,
          }),
          toolCalls: [],
        });
      });
      await page.fill("#guideInput", "設定画面を直したい");
      await page.click("#guideSend");
      await expect(page.locator("#guideChat")).toContainText(/再現手順|期待結果/);
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount);
    });

    test("guide chat keeps conversation mode without touching plan tasks", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.evaluate(() => {
        if (typeof window.requestGuideModelReplyWithFallback !== "function") {
          throw new Error("guide reply request function is unavailable");
        }
        window.requestGuideModelReplyWithFallback = async () => ({
          provider: "openai",
          modelName: "gpt-4.1",
          text: JSON.stringify({
            status: "conversation",
            reply: "その観点は重要です。まずはどの点が気になっているかを整理しましょう。",
            plan: null,
          }),
          toolCalls: [],
        });
      });
      await page.fill("#guideInput", "最近このアプリの使い心地どう思う？");
      await page.click("#guideSend");
      await expect(page.locator("#guideChat")).toContainText(/気になっている|整理しましょう/);
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount);
    });

    test("guide chat renders markdown lists and code blocks", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      await page.evaluate(() => {
        if (typeof window.requestGuideModelReplyWithFallback !== "function") {
          throw new Error("guide reply request function is unavailable");
        }
        window.requestGuideModelReplyWithFallback = async () => ({
          provider: "openai",
          modelName: "gpt-4.1",
          text: JSON.stringify({
            status: "needs_clarification",
            reply: "まず見たいのは次の2点です。\n\n1. **保存処理そのもの**\n2. **reload 後の復元**\n\n```ts\nconsole.log('save-check');\n```",
            plan: null,
          }),
          toolCalls: [],
        });
      });
      await page.fill("#guideInput", "保存まわりの違和感を見て");
      await page.click("#guideSend");
      const lastGuideMarkdown = page.locator("#guideChat .guide-markdown").last();
      await expect(lastGuideMarkdown.locator("ol li")).toHaveCount(2);
      await expect(lastGuideMarkdown).toContainText(/保存処理そのもの/);
      await expect(lastGuideMarkdown.locator("pre code")).toContainText(/save-check/);
    });

    test("project tab supports add and /use focus switch", async ({ page }) => {
      await page.click('[data-tab="project"]');
      await expect(page.locator("#projectTabContent")).toBeVisible();
      await page.click("#projectPickDirectory");
      await expect(page.locator("#projectTabContent")).toContainText("@hive-docs");
      await expect(page.locator("[data-project-remove-id]").first()).toBeEnabled();

      let duplicateMessage = "";
      page.once("dialog", async (dialog) => {
        duplicateMessage = dialog.message();
        await dialog.accept();
      });
      await page.click("#projectPickDirectory");
      expect(duplicateMessage).toMatch(/プロジェクトは既に含まれています|Project is already included/);
      await expect(page.locator('#projectList .badge:has-text("@hive-docs")')).toHaveCount(1);

      while ((await page.locator("[data-project-remove-id]").count()) > 0) {
        await page.locator("[data-project-remove-id]").first().click();
      }
      await expect(page.locator("#projectList")).toContainText(/プロジェクトはありません|No projects/);

      await page.click("#projectPickDirectory");
      await expect(page.locator("#projectTabContent")).toContainText("@alpha-work");

      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "/use alpha-work");
      await page.click("#guideSend");
      await expect(page.locator("#guideProjectFocus")).toContainText("alpha-work");
    });

    test("guide chat supports @ completion with focus and project:file", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "@wire");
      await expect(page.locator("#guideMentionMenu")).toBeVisible();
      await expect(page.locator("#guideMentionMenu")).toContainText("@wireframe/app.js");
      await page.click('#guideMentionMenu .guide-mention-item:has-text("@wireframe/app.js")');
      await expect(page.locator("#guideInput")).toHaveValue("@wireframe/app.js ");

      await page.fill("#guideInput", "@Tomoshibi-kan:");
      await expect(page.locator("#guideMentionMenu")).toBeVisible();
      await expect(page.locator("#guideMentionMenu")).toContainText("@Tomoshibi-kan:wireframe/app.js");
    });

    test("task detail drawer is visible only on task tab", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      await expect(page.locator("#detailDrawer")).toBeHidden();

      await page.click('[data-tab="task"]');
      await expect(page.locator("#detailDrawer")).toBeVisible();

      await page.click('[data-tab="event"]');
      await expect(page.locator("#detailDrawer")).toBeHidden();
    });

    test("job board supports gate flow", async ({ page }) => {
      await page.click('[data-tab="job"]');
      await expect(page.locator("#jobBoard")).toBeVisible();
      await expect(page.locator('[data-job-row="JOB-001"]')).toHaveAttribute("data-last-run-state", "empty");
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');
      await expect(page.locator("#gatePanel")).not.toHaveClass(/hidden/);
      await page.click("#approveTask");
      await expect(page.locator("#gatePanel")).toHaveClass(/hidden/);
      await expect(page.locator('[data-job-row="JOB-001"]')).toContainText(/Done|完了/);
      await expect(page.locator('[data-job-row="JOB-001"]')).toHaveAttribute("data-last-run-state", "recorded");
      await expect(page.locator('[data-job-row="JOB-001"]')).toHaveAttribute("data-gate-decision", "approved");
    });

    test("task progress log stores dispatch and gate flow entries", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.evaluate(() => {
        if (typeof window.requestGuideModelReplyWithFallback !== "function") {
          throw new Error("guide reply request function is unavailable");
        }
        const runtime = window.TomoshibikanCoreRuntime || {};
        window.requestGuideModelReplyWithFallback = async () => ({
          provider: "openai",
          modelName: "gpt-4.1",
          text: JSON.stringify({
            status: "plan_ready",
            reply: "実行プランを作成しました。",
            plan: {
              goal: "保存不具合を解消する",
              completionDefinition: "保存と再読み込みが成功する",
              constraints: ["既存フローを壊さない"],
              tasks: [
                {
                  title: "再現確認",
                  description: "保存不具合の再現手順を確認する",
                  requiredSkills: ["browser-chrome", "codex-file-search"],
                },
                {
                  title: "修正実装",
                  description: "原因を修正する",
                  requiredSkills: ["codex-file-edit"],
                },
                {
                  title: "検証",
                  description: "回帰テストを実行する",
                  requiredSkills: ["codex-test-runner"],
                },
              ],
            },
          }),
          toolCalls: [],
        });
        runtime.palChat = async (input) => {
          if (input?.debugMeta?.stage === "gate_review") {
            return {
              provider: "openai",
              modelName: "gpt-4.1",
              text: JSON.stringify({
                decision: "approved",
                reason: "確認できたので、このままで問題ありません。",
                fixes: [],
              }),
              toolCalls: [],
              runId: "debug-gate-progress-log",
            };
          }
          return {
            provider: input?.provider || "openai",
            modelName: input?.modelName || "gpt-4.1",
            text: "worker-ok",
            toolCalls: [],
            runId: "debug-worker-progress-log",
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
      });
      await page.fill("#guideInput", "設定保存の不具合を trace / fix / verify に分けて進めたい");
      await page.click("#guideSend");
      const pendingPlan = await page.evaluate(async () => {
        const api = window.TomoshibikanPlanArtifacts || window.PalpalPlanArtifacts;
        if (!api || typeof api.latest !== "function") return null;
        return api.latest({ status: "pending_approval" });
      });
      expect(pendingPlan).toBeTruthy();
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount);
      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "進めて");
      await page.click("#guideSend");
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount + 3);

      await expect.poll(async () => {
        return page.evaluate(async () => {
          const rows = await window.listTaskProgressLogEntriesWithFallback({
            targetKind: "task",
            targetId: "TASK-004",
            limit: 10,
          });
          return rows.map((row) => row.actionType).join(",");
        });
      }).toContain("dispatch");

      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await expect(page.locator('[data-job-row="JOB-001"]')).toHaveAttribute("data-last-run-state", "recorded");
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');
      await page.click("#approveTask");

      await expect.poll(async () => {
        return page.evaluate(async () => {
          const rows = await window.listTaskProgressLogEntriesWithFallback({
            targetKind: "job",
            targetId: "JOB-001",
            limit: 10,
          });
          return rows.map((row) => `${row.actionType}:${row.actualActor}:${row.displayActor}:${row.status}`).join("|");
        });
      }).toContain("to_gate:orchestrator:Guide:pending");

      await expect.poll(async () => {
        return page.evaluate(async () => {
          const latest = await window.getLatestTaskProgressLogEntryWithFallback({
            targetKind: "job",
            targetId: "JOB-001",
          });
          return latest ? `${latest.actionType}:${latest.actualActor}:${latest.displayActor}:${latest.status}` : "";
        });
      }).toContain("gate_review:gate:Gate:approved");
    });

    test("task detail drawer renders conversation log timeline", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.evaluate(() => {
        const runtime = window.TomoshibikanCoreRuntime || {};
        window.requestGuideModelReplyWithFallback = async () => ({
          provider: "openai",
          modelName: "gpt-4.1",
          text: JSON.stringify({
            status: "plan_ready",
            reply: "実行プランを作成しました。",
            plan: {
              goal: "保存不具合を解消する",
              completionDefinition: "保存と再読み込みが成功する",
              constraints: ["既存フローを壊さない"],
              tasks: [
                {
                  title: "再現確認",
                  description: "保存不具合の再現手順を確認する",
                  requiredSkills: ["browser-chrome", "codex-file-search"],
                },
              ],
            },
          }),
          toolCalls: [],
        });
        runtime.palChat = async (input) => {
          if (input?.debugMeta?.stage === "gate_review") {
            return {
              provider: "openai",
              modelName: "gpt-4.1",
              text: JSON.stringify({
                decision: "approved",
                reason: "十分形になっているかな。",
                fixes: [],
              }),
              toolCalls: [],
              runId: "debug-gate-detail-log",
            };
          }
          return {
            provider: input?.provider || "openai",
            modelName: input?.modelName || "gpt-4.1",
            text: "worker-ok",
            toolCalls: [],
            runId: "debug-worker-detail-log",
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
      });
      await page.fill("#guideInput", "設定保存の不具合を調べたい");
      await page.click("#guideSend");
      const pendingPlan = await page.evaluate(async () => {
        const api = window.TomoshibikanPlanArtifacts || window.PalpalPlanArtifacts;
        if (!api || typeof api.latest !== "function") return null;
        return api.latest({ status: "pending_approval" });
      });
      expect(pendingPlan).toBeTruthy();
      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "はい");
      await page.click("#guideSend");
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount + 1);

      await page.click('[data-action="detail"][data-task-id="TASK-004"]');
      await expect(page.locator("#detailConversationLog")).toBeVisible();
      await expect(page.locator('#detailConversationLog [data-detail-actor="guide"]')).toContainText(/管理人|Guide/);
      await expect(page.locator('#detailConversationLog [data-detail-action="dispatch"]')).toContainText(/依頼|Dispatch/);
      await expect(page.locator("#detailConversationLog")).toContainText(/再現確認をお願いします|please handle "再現確認"/);
    });

    test("task detail conversation log applies progress voice per actor", async ({ page }) => {
      await page.evaluate(async () => {
        await window.appendTaskProgressLogEntryWithFallback({
          planId: "PLAN-VOICE-001",
          targetKind: "task",
          targetId: "TASK-001",
          actionType: "reroute",
          status: "ok",
          actualActor: "orchestrator",
          displayActor: "Guide",
          messageForUser: "久瀬ではなく白峰にお願いし直しました。",
          payload: { fromWorkerId: "pal-beta", fromWorkerDisplayName: "久瀬", workerId: "pal-delta", workerDisplayName: "白峰", taskTitle: "返却文を整える" },
        });
        await window.appendTaskProgressLogEntryWithFallback({
          planId: "PLAN-VOICE-001",
          targetKind: "task",
          targetId: "TASK-001",
          actionType: "worker_runtime",
          status: "ok",
          actualActor: "worker",
          displayActor: "Resident",
          messageForUser: "要点を整理して返却文を整えました。",
          payload: { assigneePalId: "pal-delta", assigneeDisplayName: "白峰", taskTitle: "返却文を整える" },
        });
        await window.appendTaskProgressLogEntryWithFallback({
          planId: "PLAN-VOICE-001",
          targetKind: "task",
          targetId: "TASK-001",
          actionType: "gate_review",
          status: "rejected",
          actualActor: "gate",
          displayActor: "Gate",
          messageForUser: "説明はよいが、前提がまだ甘いです。",
          payload: { gateDisplayName: "真壁", taskTitle: "返却文を整える", gateResult: { reason: "説明はよいが、前提がまだ甘いです。", fixes: [] } },
        });
        await window.appendTaskProgressLogEntryWithFallback({
          planId: "PLAN-VOICE-001",
          targetKind: "task",
          targetId: "TASK-001",
          actionType: "replan_required",
          status: "blocked",
          actualActor: "orchestrator",
          displayActor: "Guide",
          messageForUser: "進め方と前提を見直します。",
          payload: { taskTitle: "返却文を整える" },
        });
        await window.appendTaskProgressLogEntryWithFallback({
          planId: "PLAN-VOICE-001",
          targetKind: "task",
          targetId: "TASK-001",
          actionType: "replanned",
          status: "ok",
          actualActor: "orchestrator",
          displayActor: "Guide",
          messageForUser: "新しい段取りで再開しました。",
          payload: { taskTitle: "返却文を整える", taskTitles: ["調査メモをまとめる", "返却文を整える"] },
        });
      });

      await page.click('[data-tab="task"]');
      await page.click('[data-action="detail"][data-task-id="TASK-001"]');
      await expect(page.locator("#detailConversationLog")).toContainText(/白峰さんの方が合いそうです/);
      await expect(page.locator("#detailConversationLog")).toContainText(/要点を整理して返却文を整えました/);
      await expect(page.locator("#detailConversationLog")).toContainText(/このままだとまだ甘いかな。/);
      await expect(page.locator("#detailConversationLog")).toContainText(/段取りを見直した方がよさそうです。/);
      await expect(page.locator("#detailConversationLog")).toContainText(/進め方を組み直しました。/);
    });

    test("task detail conversation log shows guide return after plan completion", async ({ page }) => {
      await page.evaluate(async () => {
        await window.appendTaskProgressLogEntryWithFallback({
          planId: "PLAN-001",
          targetKind: "plan",
          targetId: "PLAN-001",
          actionType: "plan_completed",
          status: "completed",
          actualActor: "orchestrator",
          displayActor: "Guide",
          messageForUser: "再現確認、修正実装、検証まで進みました。ひとまず、今の形でお返しできます。",
          payload: {
            taskIds: ["TASK-001", "TASK-002", "TASK-003"],
            taskTitles: ["再現確認", "修正実装", "検証"],
          },
        });
      });

      await page.click('[data-tab="task"]');
      await page.click('[data-action="detail"][data-task-id="TASK-001"]');
      await expect(page.locator("#detailConversationLog")).toContainText(/ひとまず形になりました。/);
    });

    test("guide progress query reports completed task without model call", async ({ page }) => {
      await page.evaluate(() => {
        window.__guideProgressModelCalled = false;
        if (typeof window.requestGuideModelReplyWithFallback !== "function") {
          throw new Error("guide reply request function is unavailable");
        }
        const original = window.requestGuideModelReplyWithFallback;
        window.requestGuideModelReplyWithFallback = async (...args) => {
          window.__guideProgressModelCalled = true;
          return original(...args);
        };
      });

      await page.click('[data-tab="task"]');
      await page.click('[data-action="submit"][data-task-id="TASK-001"]');
      await page.click('[data-action="gate"][data-task-id="TASK-001"]');
      await page.click("#approveTask");
      await expect(page.locator('[data-task-row="TASK-001"]')).toContainText(/Done|完了/);

      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "TASK-001 はどうなった？");
      await page.click("#guideSend");

      await expect(page.locator("#guideChat")).toContainText(/完了しています|Gate が承認しました/);
      await expect.poll(async () => page.evaluate(() => window.__guideProgressModelCalled)).toBe(false);
    });

    test("guide progress query explains replan required after gate reject", async ({ page }) => {
      await page.click('[data-tab="task"]');
      await page.click('[data-action="submit"][data-task-id="TASK-001"]');
      await page.click('[data-action="gate"][data-task-id="TASK-001"]');
      await page.fill("#gateReason", "この件は再計画が必要です。進め方と前提を見直してください。");
      await page.click("#rejectTask");

      await expect.poll(async () => {
        return page.evaluate(async () => {
          const latest = await window.getLatestTaskProgressLogEntryWithFallback({
            targetKind: "task",
            targetId: "TASK-001",
          });
          return latest ? `${latest.actionType}:${latest.actualActor}:${latest.displayActor}:${latest.status}` : "";
        });
      }).toContain("replan_required:orchestrator:Guide:blocked");

      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "TASK-001 はどうなった？");
      await page.click("#guideSend");

      await expect(page.locator("#guideChat")).toContainText(/再計画が必要|進め方と前提を見直す/);
    });

    test("gate replan bridge creates new tasks and updates progress query", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.selectOption('[data-pal-runtime-select="guide-core"]', "model");
      const guideRuntimeTarget = await page.locator('[data-pal-runtime-target-select="guide-core"] option').first().getAttribute("value");
      expect(guideRuntimeTarget).toBeTruthy();
      await page.selectOption('[data-pal-runtime-target-select="guide-core"]', String(guideRuntimeTarget));
      await page.click("#palConfigSave");

      await page.evaluate(() => {
        window.__replanGuideCalls = 0;
        window.requestGuideModelReplyWithFallback = async (userText) => {
          window.__replanGuideCalls += 1;
          if (String(userText || "").includes("Replan the current")) {
            return {
              provider: "openai",
              modelName: "gpt-4.1",
              text: JSON.stringify({
                status: "plan_ready",
                reply: "進め方を組み直しました。",
                plan: {
                  goal: "保存不具合の進め方を見直す",
                  completionDefinition: "原因切り分けと修正方針が揃う",
                  constraints: ["旧taskは履歴として残す"],
                  tasks: [
                    {
                      title: "前提確認",
                      description: "保存処理と再読込処理の前提差を確認する",
                      requiredSkills: ["codex-file-search"],
                    },
                    {
                      title: "修正方針整理",
                      description: "修正前提を文章で整理する",
                      requiredSkills: ["codex-file-read"],
                    },
                  ],
                },
              }),
              toolCalls: [],
              runId: "debug-replan-run",
            };
          }
          return {
            provider: "openai",
            modelName: "gpt-4.1",
            text: JSON.stringify({
              status: "conversation",
              reply: "ok",
              plan: null,
            }),
            toolCalls: [],
          };
        };
      });

      await page.click('[data-tab="task"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.click('[data-action="submit"][data-task-id="TASK-001"]');
      await page.click('[data-action="gate"][data-task-id="TASK-001"]');
      await page.fill("#gateReason", "この件は再計画が必要です。進め方と前提を見直してください。");
      await page.click("#rejectTask");

      await expect.poll(async () => page.locator('[data-task-row]').count()).toBe(beforeTaskCount + 2);
      await expect.poll(async () => page.evaluate(() => window.__replanGuideCalls)).toBeGreaterThan(0);
      await expect.poll(async () => {
        return page.evaluate(async () => {
          const latest = await window.getLatestTaskProgressLogEntryWithFallback({
            targetKind: "task",
            targetId: "TASK-001",
          });
          return latest ? `${latest.actionType}:${latest.status}:${latest.payload?.createdCount || 0}` : "";
        });
      }).toContain("replanned:ok:2");

      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "TASK-001 はどうなった？");
      await page.click("#guideSend");
      await expect(page.locator("#guideChat")).toContainText(/再計画を作成しました|新しいPlan/);
    });

    test("guide-driven reroute keeps dispatch but records reroute progress", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.selectOption('[data-pal-runtime-select="guide-core"]', "model");
      const guideRuntimeTarget = await page.locator('[data-pal-runtime-target-select="guide-core"] option').first().getAttribute("value");
      expect(guideRuntimeTarget).toBeTruthy();
      await page.selectOption('[data-pal-runtime-target-select="guide-core"]', String(guideRuntimeTarget));
      await page.click("#palConfigSave");

      await page.evaluate(() => {
        const runtime = window.TomoshibikanCoreRuntime || window.PalpalCoreRuntime || {};
        window.__routingCalls = 0;
        const originalGuideChat = typeof runtime.guideChat === "function" ? runtime.guideChat.bind(runtime) : null;
        runtime.guideChat = async (input) => {
          if (input?.debugMeta?.stage === "orchestrator_routing") {
            window.__routingCalls += 1;
            return {
              provider: "openai",
              modelName: "gpt-4.1",
              text: JSON.stringify({
                selectedResidentId: "pal-delta",
                reason: "この task は結果の整理と返却文の形づくりが主なので、白峰へ振り直す。",
                confidence: "high",
                fallbackAction: "reroute",
              }),
              toolCalls: [],
              runId: "debug-reroute-run",
            };
          }
          if (originalGuideChat) return originalGuideChat(input);
          return {
            provider: input?.provider || "openai",
            modelName: input?.modelName || "gpt-4.1",
            text: JSON.stringify({
              status: "conversation",
              reply: "ok",
              plan: null,
            }),
            toolCalls: [],
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
      });

      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.evaluate(async () => {
        const artifact = await window.appendPlanArtifactWithFallback({
          status: "approved",
          replyText: "reroute test",
          plan: {
            goal: "返却文と説明を整理する",
            completionDefinition: "読み手向けの説明方針がまとまる",
            constraints: ["最小の1 taskだけ作る"],
            tasks: [
              {
                title: "返却文の整理",
                description: "保存不具合の説明を読み手向けに整理する",
                requiredSkills: ["codex-file-read"],
              },
            ],
          },
          sourceRunId: "debug-reroute-plan",
        });
        await window.materializeApprovedPlanArtifact(artifact);
      });

      await expect.poll(async () => page.locator('[data-task-row]').count()).toBe(beforeTaskCount + 1);
      await expect.poll(async () => page.evaluate(() => window.__routingCalls)).toBeGreaterThan(0);

      const latestTaskId = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("[data-task-row]"));
        return rows.at(-1)?.getAttribute("data-task-row") || "";
      });
      expect(latestTaskId).toMatch(/^TASK-/);
      await expect(page.locator(`[data-task-row="${latestTaskId}"]`)).toContainText("白峰");

      await expect.poll(async () => {
        return page.evaluate(async (taskId) => {
          const entries = await window.listTaskProgressLogEntriesWithFallback({
            targetKind: "task",
            targetId: taskId,
            limit: 10,
          });
          return entries.map((entry) => `${entry.actionType}:${entry.payload?.fromWorkerId || "-"}:${entry.payload?.workerId || "-"}`);
        }, latestTaskId);
      }).toContain(`reroute:pal-alpha:pal-delta`);

      await page.click('[data-tab="task"]');
      await page.click(`[data-action="detail"][data-task-id="${latestTaskId}"]`);
      await expect(page.locator("#detailConversationLog")).toContainText(/振り直し|Reroute/);
      await expect(page.locator("#detailConversationLog")).toContainText(/冬坂/);
      await expect(page.locator("#detailConversationLog")).toContainText(/白峰/);
    });

    test("worker runtime receives structured handoff payload", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="pal-alpha"]');
      await page.selectOption('[data-pal-runtime-select="pal-alpha"]', "model");
      await page.selectOption('[data-pal-runtime-target-select="pal-alpha"]', "gpt-4o-mini");
      await page.click("#palConfigSave");

      await page.evaluate(() => {
        window.__lastPalChatInput = null;
        const runtime = window.TomoshibikanCoreRuntime || {};
        const original = runtime.palChat;
        const originalGuideChat = runtime.guideChat;
        runtime.guideChat = typeof runtime.guideChat === "function"
          ? runtime.guideChat
          : async () => ({ text: "guide-ok", toolCalls: [] });
        runtime.palChat = async (input) => {
          window.__lastPalChatInput = input;
          return {
            provider: input.provider,
            modelName: input.modelName,
            text: "worker-payload-ok",
            toolCalls: [],
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
        window.__restorePalChat = () => {
          runtime.palChat = original;
          runtime.guideChat = originalGuideChat;
        };
      });

      await page.evaluate(() => window.executePalRuntimeForTarget("JOB-001", "job"));

      await expect.poll(async () => page.evaluate(() => window.__lastPalChatInput?.userText || "")).toContain("[WorkerExecutionInput]");
      const payload = await page.evaluate(() => window.__lastPalChatInput);
      expect(payload.userText).toContain("target_type: job");
      expect(payload.userText).toContain("target_id: JOB-001");
      expect(payload.userText).toContain("assignee_pal_id: pal-alpha");
      expect(payload.userText).toContain("gate_profile_id: gate-core");
      expect(payload.userText).toContain("[HandoffSummary]");
      expect(payload.userText).toContain("source_refs:");
      expect(payload.userText).toContain("focus_project:");
      expect(payload.userText).not.toContain("Plan Card");

      await page.evaluate(() => {
        if (typeof window.__restorePalChat === "function") {
          window.__restorePalChat();
        }
      });
    });

    test("settings context handoff policy persists and shapes worker payload", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await page.selectOption("#settingsContextHandoffPolicy", "minimal");
      await page.click("#settingsTabSave");

      await page.reload();
      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsContextHandoffPolicy")).toHaveValue("minimal");

      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="pal-alpha"]');
      await page.selectOption('[data-pal-runtime-select="pal-alpha"]', "model");
      await page.selectOption('[data-pal-runtime-target-select="pal-alpha"]', "gpt-4o-mini");
      await page.click("#palConfigSave");

      await page.evaluate(() => {
        window.__lastPalChatInput = null;
        const runtime = window.TomoshibikanCoreRuntime || {};
        const original = runtime.palChat;
        const originalGuideChat = runtime.guideChat;
        runtime.guideChat = typeof runtime.guideChat === "function"
          ? runtime.guideChat
          : async () => ({ text: "guide-ok", toolCalls: [] });
        runtime.palChat = async (input) => {
          window.__lastPalChatInput = input;
          return {
            provider: input.provider,
            modelName: input.modelName,
            text: "worker-payload-ok",
            toolCalls: [],
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
        window.__restorePalChat = () => {
          runtime.palChat = original;
          runtime.guideChat = originalGuideChat;
        };
      });

      await page.evaluate(() => window.executePalRuntimeForTarget("JOB-001", "job"));
      await expect.poll(async () => page.evaluate(() => window.__lastPalChatInput?.userText || "")).toContain("[WorkerExecutionInput]");
      let payload = await page.evaluate(() => window.__lastPalChatInput);
      expect(payload.userText).not.toContain("[HandoffSummary]");
      expect(payload.userText).not.toContain("[CompressedHistorySummary]");

      await page.click('[data-tab="settings"]');
      await page.selectOption("#settingsContextHandoffPolicy", "verbose");
      await page.click("#settingsTabSave");
      await expect(page.locator("#settingsContextHandoffPolicy")).toHaveValue("verbose");

      await page.evaluate(() => {
        window.__lastPalChatInput = null;
      });
      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await expect.poll(async () => page.evaluate(() => window.__lastPalChatInput?.userText || "")).toContain("[CompressedHistorySummary]");
      payload = await page.evaluate(() => window.__lastPalChatInput);
      expect(payload.userText).toContain("[HandoffSummary]");
      expect(payload.userText).toContain("guide-guide:");

      await page.evaluate(() => {
        if (typeof window.__restorePalChat === "function") {
          window.__restorePalChat();
        }
      });
    });

    test("guide controller assist is off by default and can be enabled in settings", async ({ page }) => {
      await page.evaluate(() => {
        window.__lastGuideChatInput = null;
        const runtime = window.TomoshibikanCoreRuntime || {};
        const originalGuideChat = runtime.guideChat;
        runtime.guideChat = async (input) => {
          window.__lastGuideChatInput = input;
          return {
            provider: input.provider,
            modelName: input.modelName,
            text: JSON.stringify({
              status: "conversation",
              reply: "ok",
              plan: null,
            }),
            toolCalls: [],
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
        window.__restoreGuideChat = () => {
          runtime.guideChat = originalGuideChat;
        };
      });

      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsGuideControllerAssistEnabled")).not.toBeChecked();

      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "Settingsタブの保存ボタンを押したのに保存結果が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。trace / fix / verify の Task に分けて進めたい。");
      await page.click("#guideSend");
      await expect.poll(async () => page.evaluate(() => window.__lastGuideChatInput?.debugMeta?.planningIntent || "")).toBe("none");
      let payload = await page.evaluate(() => window.__lastGuideChatInput);
      expect(payload.debugMeta.planningIntent).toBe("none");
      expect(payload.debugMeta.planningReadiness).toBe("none");

      await page.click('[data-tab="settings"]');
      await page.check("#settingsGuideControllerAssistEnabled");
      await page.click("#settingsTabSave");
      await page.reload();
      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsGuideControllerAssistEnabled")).toBeChecked();

      await page.evaluate(() => {
        window.__lastGuideChatInput = null;
        const runtime = window.TomoshibikanCoreRuntime || {};
        const originalGuideChat = runtime.guideChat;
        runtime.guideChat = async (input) => {
          window.__lastGuideChatInput = input;
          return {
            provider: input.provider,
            modelName: input.modelName,
            text: JSON.stringify({
              status: "conversation",
              reply: "ok",
              plan: null,
            }),
            toolCalls: [],
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
        window.__restoreGuideChat = () => {
          runtime.guideChat = originalGuideChat;
        };
      });
      await page.click('[data-tab="guide"]');
      await page.fill("#guideInput", "Settingsタブの保存ボタンを押したのに保存結果が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。trace / fix / verify の Task に分けて進めたい。");
      await page.click("#guideSend");
      await expect.poll(async () => page.evaluate(() => window.__lastGuideChatInput?.debugMeta?.planningIntent || "")).toBe("explicit_breakdown");
      payload = await page.evaluate(() => window.__lastGuideChatInput);
      expect(payload.debugMeta.planningIntent).toBe("explicit_breakdown");

      await page.evaluate(() => {
        if (typeof window.__restoreGuideChat === "function") {
          window.__restoreGuideChat();
        }
      });
    });

    test("gate reject uses templates and navigates to resubmit target", async ({ page }) => {
      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');

      await expect(page.locator("#gatePanel")).not.toHaveClass(/hidden/);
      await page.click('[data-gate-template-id="missing-test"]');
      await expect(page.locator("#gateReason")).toHaveValue(/テスト不足|Insufficient tests/);

      await page.click("#rejectTask");
      await expect(page.locator("#gatePanel")).toHaveClass(/hidden/);
      await expect(page.locator('[data-tab="job"]')).toHaveClass(/active/);
      await expect(page.locator('[data-job-row="JOB-001"]')).toContainText(/Resubmit|再提出/);
      await expect(page.locator('[data-job-row="JOB-001"]')).toHaveClass(/board-row-focus/);
      await expect(page.locator('[data-job-row="JOB-001"]')).toHaveAttribute("data-gate-decision", "rejected");
    });

    test("gate runtime receives structured review payload and applies suggestion", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="gate-core"]');
      await page.selectOption('[data-pal-runtime-select="gate-core"]', "model");
      const gateRuntimeTarget = await page.locator('[data-pal-runtime-target-select="gate-core"] option').first().getAttribute("value");
      expect(gateRuntimeTarget).toBeTruthy();
      await page.selectOption('[data-pal-runtime-target-select="gate-core"]', String(gateRuntimeTarget));
      await page.click("#palConfigSave");

      await page.evaluate(() => {
        window.__lastPalChatInput = null;
        const runtime = window.TomoshibikanCoreRuntime || {};
        const original = runtime.palChat;
        const originalGuideChat = runtime.guideChat;
        runtime.guideChat = typeof runtime.guideChat === "function"
          ? runtime.guideChat
          : async () => ({ text: "guide-ok", toolCalls: [] });
        runtime.palChat = async (input) => {
          window.__lastPalChatInput = input;
          return {
            provider: input.provider,
            modelName: input.modelName,
            text: JSON.stringify({
              decision: "rejected",
              reason: "Evidence is too thin",
              fixes: ["add evidence", "add test result"],
            }),
            toolCalls: [],
          };
        };
        window.TomoshibikanCoreRuntime = runtime;
        window.__restorePalChat = () => {
          runtime.palChat = original;
          runtime.guideChat = originalGuideChat;
        };
      });

      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');

      await expect.poll(async () => page.evaluate(() => window.__lastPalChatInput?.userText || "")).toContain("[GateReviewInput]");
      const payload = await page.evaluate(() => window.__lastPalChatInput);
      expect(payload.userText).toContain("target_type: job");
      expect(payload.userText).toContain("target_id: JOB-001");
      expect(payload.userText).toContain("gate_profile_id: gate-core");
      expect(payload.userText).toContain("[CompletionRitual]");
      expect(payload.userText).toContain("[OutputFormat]");

      await expect(page.locator("#gatePanel")).toHaveAttribute("data-gate-runtime-state", "ready");
      await expect(page.locator("#gatePanel")).toHaveAttribute("data-gate-suggested-decision", "rejected");
      await expect(page.locator("#gateRuntimeSuggestion")).toContainText("Evidence is too thin");
      await expect(page.locator("#gateReason")).toHaveValue(/add evidence/);

      await page.evaluate(() => {
        if (typeof window.__restorePalChat === "function") {
          window.__restorePalChat();
        }
      });
    });

    test("task board and gate expose visual state attributes", async ({ page }) => {
      await page.click('[data-tab="task"]');
      await page.click('[data-action="detail"][data-task-id="TASK-001"]');
      await expect(page.locator('[data-task-row="TASK-001"]')).toHaveAttribute("data-board-state", "selected");
      await expect(page.locator("#detailDrawer")).toHaveAttribute("data-detail-state", "open");

      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');
      await expect(page.locator("#gatePanel")).toHaveAttribute("data-gate-state", "open");
      await expect(page.locator("#gatePanel")).toHaveAttribute("data-gate-kind", "job");
      await page.click("#closeGate");
      await expect(page.locator("#gatePanel")).toHaveAttribute("data-gate-state", "closed");
      await expect(page.locator("#gatePanel")).toHaveAttribute("data-gate-kind", "none");
    });

    test("task detail shows gate decision schema fields", async ({ page }) => {
      await page.click('[data-tab="task"]');
      await page.click('[data-action="detail"][data-task-id="TASK-003"]');
      await expect(page.locator("#detailBody")).toContainText(/Gate Decision/);
      await expect(page.locator("#detailBody")).toContainText(/Reason/);
      await expect(page.locator("#detailBody")).toContainText(/Fixes/);
    });

    test("default gate is assigned to task and cron gate flow", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click("#palAddGateProfile");
      const gateRows = page.locator('[data-pal-role="gate"]');
      const gateId = await gateRows.last().getAttribute("data-pal-row");
      expect(gateId).toBeTruthy();
      await page.click("#closePalConfigModal");
      await page.click(`[data-pal-set-default-gate-id="${gateId}"]`);

      await page.click('[data-tab="task"]');
      await page.click('[data-action="submit"][data-task-id="TASK-001"]');
      await expect(page.locator('[data-task-row="TASK-001"]')).toHaveAttribute("data-gate-profile-id", String(gateId));
      await expect(page.locator('[data-task-row="TASK-001"]')).toContainText("New Gate");
      await page.click('[data-action="gate"][data-task-id="TASK-001"]');
      await expect(page.locator("#gatePanel")).toHaveAttribute("data-gate-profile-id", String(gateId));
      await expect(page.locator("#gateProfileSummary")).toContainText("New Gate");
      await page.click("#closeGate");

      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await expect(page.locator('[data-job-row="JOB-001"]')).toHaveAttribute("data-gate-profile-id", String(gateId));
      await expect(page.locator('[data-job-row="JOB-001"]')).toContainText("New Gate");
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');
      await expect(page.locator("#gatePanel")).toHaveAttribute("data-gate-profile-id", String(gateId));
      await expect(page.locator("#gateProfileSummary")).toContainText("New Gate");

      await page.reload();
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row="TASK-001"]')).toHaveAttribute("data-gate-profile-id", String(gateId));
      await expect(page.locator('[data-task-row="TASK-001"]')).toContainText("New Gate");
      await page.click('[data-tab="job"]');
      await expect(page.locator('[data-job-row="JOB-001"]')).toHaveAttribute("data-gate-profile-id", String(gateId));
      await expect(page.locator('[data-job-row="JOB-001"]')).toContainText("New Gate");
    });

    test("event log supports search, filter, and pagination", async ({ page }) => {
      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');
      await page.click("#approveTask");
      await page.click('[data-tab="task"]');
      await page.click('[data-action="submit"][data-task-id="TASK-001"]');

      await page.click('[data-tab="event"]');
      await expect(page.locator("#eventLog")).toBeVisible();
      await expect(page.locator("#eventPageInfo")).toContainText("1 / 2");

      await page.click("#eventNextPage");
      await expect(page.locator("#eventPageInfo")).toContainText("2 / 2");

      await page.selectOption("#eventTypeFilter", "gate");
      await expect(page.locator("#eventLog")).toContainText("/ gate /");

      await page.fill("#eventSearchInput", "JOB-001");
      await expect(page.locator("#eventLog")).toContainText("JOB-001");
      await expect(page.locator("#eventLog")).not.toContainText("TASK-003");
    });

    test("event log exposes toolbar, pager, and row state attributes", async ({ page }) => {
      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');
      await page.click("#approveTask");
      await page.click('[data-tab="task"]');
      await page.click('[data-action="submit"][data-task-id="TASK-001"]');

      await page.click('[data-tab="event"]');
      await expect(page.locator(".event-toolbar")).toHaveAttribute("data-event-toolbar-state", "idle");
      await expect(page.locator(".event-pager-controls")).toHaveAttribute("data-event-page-state", "paged");

      await page.selectOption("#eventTypeFilter", "gate");
      await expect(page.locator(".event-toolbar")).toHaveAttribute("data-event-toolbar-state", "filtered");
      await expect(page.locator('#eventLog .event-log-row[data-event-type="gate"]').first()).toBeVisible();

      await page.fill("#eventSearchInput", "no-match");
      await expect(page.locator(".event-pager-controls")).toHaveAttribute("data-event-page-state", "empty");
      await expect(page.locator("#eventPageInfo")).toHaveAttribute("data-page-current", "0");
    });

        test("event log shows routing explanations for dispatch and gate submit", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.fill("#guideInput", "Use browser and file search to inspect the UI flow and validate the results");
      await page.click("#guideSend");

      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount + 3);
      await page.click('[data-tab="event"]');
      await expect(page.locator("#eventLog")).toContainText(/skills=|ROLE=/);

      await page.click('[data-tab="job"]');
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-tab="event"]');
      await page.fill("#eventSearchInput", "JOB-001");
      await expect(page.locator("#eventLog")).toContainText(/RUBRIC=/);
    });

    test("settings tab shows model list and allows adding model", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsTabContent")).toBeVisible();
      await expect(page.locator("#settingsTabSkillList")).toContainText("File Search");
      await expect(page.locator("#settingsTabSkillList")).toContainText("File Edit");
      await expect(page.locator("#settingsSkillMarketOpenModal")).toBeVisible();
      while ((await page.locator("[data-remove-model-index]").count()) > 0) {
        await page.locator("[data-remove-model-index]").first().click();
      }
      while ((await page.locator("[data-remove-tool-index]").count()) > 0) {
        await page.locator("[data-remove-tool-index]").first().click();
      }
      await expect(page.locator("#settingsTabModelEmpty")).toContainText("モデルはありません");
      await page.click("#settingsTabOpenAddItem");
      await expect(page.locator('#settingsTabModelProvider option[value="lmstudio"]')).toHaveCount(1);
      await page.selectOption("#settingsTabModelProvider", "anthropic");
      await expect(page.locator("#settingsTabModelName")).toHaveValue("claude-3-7-sonnet");
      await expect(page.locator('#settingsTabModelName option[value="gpt-4.1"]')).toHaveCount(0);
      await page.selectOption("#settingsTabModelName", "claude-3-7-sonnet");
      await page.fill("#settingsTabModelApiKey", "test-api-key");
      await page.click("#settingsTabAddItemSubmit");
      await expect(page.locator("#settingsTabModelList")).toContainText("claude-3-7-sonnet");
      await page.click("#settingsTabOpenAddItem");
      await page.selectOption("#settingsTabEntryType", "tool");
      await page.selectOption("#settingsTabToolName", "ClaudeCode");
      await page.click("#settingsTabAddItemSubmit");
      await expect(page.locator("#settingsTabToolList")).toContainText("ClaudeCode");
      await page.click("#settingsTabSave");

      await page.click('[data-tab="pal"]');
      await expect(page.locator("#palList")).toContainText("claude-3-7-sonnet");
      await expect(page.locator("#palList")).toContainText("ClaudeCode");
      await page.click('[data-pal-open-id="guide-core"]');
      await expect(page.locator('[data-pal-runtime-select="guide-core"]')).toHaveValue("model");
      await expect(page.locator('[data-pal-runtime-target-select="guide-core"]')).toHaveValue("claude-3-7-sonnet");
    });

    test("newly added model is immediately available in pal tab", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      while ((await page.locator("[data-remove-model-index]").count()) > 0) {
        await page.locator("[data-remove-model-index]").first().click();
      }

      await page.click("#settingsTabOpenAddItem");
      await page.selectOption("#settingsTabModelProvider", "anthropic");
      await page.selectOption("#settingsTabModelName", "claude-3-7-sonnet");
      await page.fill("#settingsTabModelApiKey", "test-api-key");
      await page.click("#settingsTabAddItemSubmit");

      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.selectOption('[data-pal-runtime-select="guide-core"]', "model");
      await expect(
        page.locator('[data-pal-runtime-target-select="guide-core"] option[value="claude-3-7-sonnet"]')
      ).toHaveCount(1);
    });

    test("settings save button is enabled only when changed and keeps unsaved state across tabs", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      const saveButton = page.locator("#settingsTabSave");
      const footer = page.locator(".settings-footer");
      const dirtyHint = page.locator("#settingsDirtyHint");
      await expect(saveButton).toBeDisabled();
      await expect(footer).toHaveAttribute("data-settings-state", "saved");
      await expect(dirtyHint).toContainText(/保存済み|Saved/);
      const disabledBackground = await saveButton.evaluate((el) => getComputedStyle(el).backgroundColor);
      const disabledCursor = await saveButton.evaluate((el) => getComputedStyle(el).cursor);
      expect(disabledCursor).toBe("not-allowed");

      await page.click('[data-remove-skill-id="codex-file-search"]');
      await expect(saveButton).toBeEnabled();
      await expect(footer).toHaveAttribute("data-settings-state", "dirty");
      await expect(dirtyHint).toContainText(/未保存の変更があります|Unsaved changes/);
      const enabledBackground = await saveButton.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(enabledBackground).not.toBe(disabledBackground);

      await page.click('[data-tab="guide"]');
      await page.click('[data-tab="settings"]');

      await expect(page.locator('[data-remove-skill-id="codex-file-search"]')).toHaveCount(0);
      await expect(saveButton).toBeEnabled();

      await page.click('[data-clawhub-download-skill="codex-file-search"]');
      await expect(page.locator('[data-remove-skill-id="codex-file-search"]')).toHaveCount(1);
      await expect(saveButton).toBeDisabled();
      await expect(footer).toHaveAttribute("data-settings-state", "saved");
      const disabledBackgroundAgain = await saveButton.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(disabledBackgroundAgain).toBe(disabledBackground);
    });

    test("settings footer reflects saving state and add form open state", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await expect(page.locator(".settings-shell")).toHaveAttribute("data-add-form-open", "false");

      await page.click("#settingsTabOpenAddItem");
      await expect(page.locator(".settings-shell")).toHaveAttribute("data-add-form-open", "true");
      await expect(page.locator('[data-settings-section="model"]')).toHaveClass(/is-adding/);

      await page.click('[data-remove-skill-id="codex-file-search"]');
      await expect(page.locator(".settings-footer")).toHaveAttribute("data-settings-state", "dirty");

      await page.evaluate(() => {
        if (typeof window.saveSettingsSnapshotWithFallback !== "function") {
          throw new Error("saveSettingsSnapshotWithFallback is unavailable");
        }
        const original = window.saveSettingsSnapshotWithFallback;
        window.saveSettingsSnapshotWithFallback = async (...args) => {
          await new Promise((resolve) => window.setTimeout(resolve, 250));
          return original(...args);
        };
      });

      await page.click("#settingsTabSave");
      await expect(page.locator(".settings-footer")).toHaveAttribute("data-settings-state", "saving");
      await expect(page.locator("#settingsTabSave")).toHaveAttribute("aria-busy", "true");
      await expect(page.locator("#settingsDirtyHint")).toContainText(/保存中|Saving/);
      await expect(page.locator(".settings-footer")).toHaveAttribute("data-settings-state", "saved");
      await expect(page.locator("#settingsTabSave")).toHaveAttribute("aria-busy", "false");
    });

    test("settings skill search modal supports keyword search flow", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      if ((await page.locator('[data-remove-skill-id="codex-file-search"]').count()) > 0) {
        await page.click('[data-remove-skill-id="codex-file-search"]');
      }
      await page.click("#settingsSkillMarketOpenModal");
      await expect(page.locator("#settingsSkillMarketModal")).toHaveClass(/is-open/);
      await expect(page.locator("#settingsSkillModalIdle")).toBeVisible();
      await expect(page.locator('#settingsSkillModalResults [data-clawhub-download-skill]')).toHaveCount(0);
      await expect(page.locator("#settingsSkillModalSort")).toBeVisible();
      await expect(page.locator("#settingsSkillModalNonSuspicious")).toBeChecked();
      await expect(page.locator("#settingsSkillModalHighlightedOnly")).not.toBeChecked();
      const keyword = page.locator("#settingsSkillModalKeyword");
      await keyword.fill("browser");
      await page.click("#settingsSkillModalSearch");
      await expect(keyword).toHaveValue("browser");
      await expect(page.locator("#settingsSkillModalResults")).toBeVisible();
      await page.click("#settingsSkillModalClose");
      await expect(page.locator("#settingsSkillMarketModal")).not.toHaveClass(/is-open/);

      await page.click("#settingsSkillMarketOpenModal");
      await page.fill("#settingsSkillModalKeyword", "no-such-skill");
      await page.click("#settingsSkillModalSearch");
      await expect(page.locator("#settingsSkillModalNoResults")).toBeVisible();
      await page.click("#settingsSkillModalClose");

      await page.click("#settingsSkillMarketOpenModal");
      await expect(page.locator("#settingsSkillModalNoResults")).toHaveCount(0);
      await expect(page.locator("#settingsSkillModalIdle")).toBeVisible();
      const remainingRecommendations = await page.locator('[data-clawhub-download-skill]').count();
      expect(remainingRecommendations).toBeGreaterThan(0);
    });

    test("settings skill search keeps duckduckgo result and allows install", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await page.click("#settingsSkillMarketOpenModal");
      await page.fill("#settingsSkillModalKeyword", "duckduckgo");
      await page.click("#settingsSkillModalSearch");

      await expect(page.locator("#settingsSkillModalNoResults")).toHaveCount(0);
      await expect(page.locator("#settingsSkillModalResults")).toContainText("DuckDuckGo");
      await expect(page.locator("#settingsSkillModalResults")).toContainText(/Downloads:\s*(4,?200|-)/);
      await expect(page.locator("#settingsSkillModalResults .settings-skill-modal-row")).toHaveCount(1);
      await expect(page.locator('#settingsSkillModalResults [data-skill-link-id="duckduckgo-search"]')).toHaveCount(1);
      await expect(page.locator('#settingsSkillModalResults [data-skill-link-id="duckduckgo-search"]')).toHaveAttribute("href", /\/skills\/duckduckgo-search$/);
      await page.click('#settingsSkillModalResults [data-clawhub-download-skill="duckduckgo-search"]');
      await expect(page.locator('[data-remove-skill-id="duckduckgo-search"]')).toHaveCount(1);
    });

    test("settings skill search normalizes full-width ddg keyword", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await page.click("#settingsSkillMarketOpenModal");
      await page.fill("#settingsSkillModalKeyword", "ｄｄｇ");
      await page.click("#settingsSkillModalSearch");

      await expect(page.locator("#settingsSkillModalNoResults")).toHaveCount(0);
      await expect(page.locator("#settingsSkillModalResults")).toContainText("Ddg");
      await expect(page.locator("#settingsSkillModalResults")).not.toContainText("安全性:");
      await expect(page.locator("#settingsSkillModalResults")).toContainText("Downloads: 1,900");
      await expect(page.locator("#settingsSkillModalResults")).toContainText("Stars: 0");
      await expect(page.locator("#settingsSkillModalResults")).toContainText("Installs: 18");
    });

    test("settings skill search without keyword still includes lower-ranked duckduckgo", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await page.click("#settingsSkillMarketOpenModal");
      await page.fill("#settingsSkillModalKeyword", "");
      await page.click("#settingsSkillModalSearch");
      await expect(page.locator("#settingsSkillModalResults")).toContainText("DuckDuckGo Search");
    });

    test("settings skill modal supports non-suspicious, highlighted, and sort controls", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      if ((await page.locator('[data-remove-skill-id="codex-shell-command"]').count()) > 0) {
        await page.click('[data-remove-skill-id="codex-shell-command"]');
      }
      if ((await page.locator('[data-remove-skill-id="browser-chrome"]').count()) > 0) {
        await page.click('[data-remove-skill-id="browser-chrome"]');
      }
      await page.click("#settingsSkillMarketOpenModal");

      await page.fill("#settingsSkillModalKeyword", "shell");
      await page.click("#settingsSkillModalSearch");
      await expect(page.locator("#settingsSkillModalNoResults")).toBeVisible();

      await page.uncheck("#settingsSkillModalNonSuspicious");
      await page.click("#settingsSkillModalSearch");
      await expect(page.locator("#settingsSkillModalResults")).toContainText("Shell Command");

      await page.fill("#settingsSkillModalKeyword", "");
      await page.check("#settingsSkillModalHighlightedOnly");
      await page.selectOption("#settingsSkillModalSort", "highlighted");
      await page.click("#settingsSkillModalSearch");
      await expect(page.locator("#settingsSkillModalResults")).toContainText("Chrome Browser");
    });

    test("settings persist after reload and api key is not displayed", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      while ((await page.locator("[data-remove-model-index]").count()) > 0) {
        await page.locator("[data-remove-model-index]").first().click();
      }
      while ((await page.locator("[data-remove-tool-index]").count()) > 0) {
        await page.locator("[data-remove-tool-index]").first().click();
      }
      await page.click("#settingsTabOpenAddItem");
      await page.selectOption("#settingsTabModelProvider", "openai");
      await page.selectOption("#settingsTabModelName", "gpt-4.1");
      await page.fill("#settingsTabModelApiKey", "api-key-secret-123");
      await page.fill("#settingsTabModelBaseUrl", "http://127.0.0.1:1234/v1");
      await page.click("#settingsTabAddItemSubmit");
      await page.click("#settingsTabSave");

      await page.reload();
      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsTabModelList")).toContainText("gpt-4.1");
      await expect(page.locator("#settingsTabModelList")).toContainText("api_key: configured");
      await expect(page.locator("#settingsTabModelList")).not.toContainText("api-key-secret-123");
      await page.click("#settingsTabOpenAddItem");
      await expect(page.locator("#settingsTabModelApiKey")).toHaveValue("");
    });

    test("settings allows LMStudio model without api key", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      while ((await page.locator("[data-remove-model-index]").count()) > 0) {
        await page.locator("[data-remove-model-index]").first().click();
      }

      await page.click("#settingsTabOpenAddItem");
      await page.selectOption("#settingsTabModelProvider", "lmstudio");
      await page.selectOption("#settingsTabModelName", "openai/gpt-oss-20b");
      await page.fill("#settingsTabModelBaseUrl", "http://192.168.11.16:1234/v1");
      await expect(page.locator("#settingsTabModelApiKey")).toHaveValue("");
      await page.click("#settingsTabAddItemSubmit");

      await expect(page.locator("#settingsTabModelList")).toContainText("openai/gpt-oss-20b");
      await page.click("#settingsTabSave");
      await expect(page.locator("#errorToast")).toBeHidden();
    });

    test("settings tab supports skill uninstall and install", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsTabSkillList")).toContainText("File Search");
      await expect(page.locator('#settingsTabSkillList [data-skill-link-id="codex-file-search"]')).toHaveCount(0);

      await page.click('[data-remove-skill-id="codex-file-search"]');
      await expect(page.locator('[data-remove-skill-id="codex-file-search"]')).toHaveCount(0);
      await expect(page.locator("#settingsSkillMarketPreview")).toContainText("File Search");
      await expect(page.locator("#settingsSkillMarketPreview")).toContainText("Search files and text quickly");
      await expect(page.locator('#settingsSkillMarketPreview [data-skill-link-id="codex-file-search"]')).toHaveCount(0);
      await expect(page.locator('#settingsSkillMarketPreview [data-clawhub-download-skill="codex-file-search"]')).toHaveCount(1);
      await page.click('#settingsSkillMarketPreview [data-clawhub-download-skill="codex-file-search"]');
      await expect(page.locator('[data-remove-skill-id="codex-file-search"]')).toHaveCount(1);
      await expect(page.locator('#settingsSkillMarketPreview [data-clawhub-download-skill="codex-file-search"]')).toHaveCount(0);

      await page.click("#settingsSkillMarketOpenModal");
      await page.fill("#settingsSkillModalKeyword", "no-such-skill");
      await page.click("#settingsSkillModalSearch");
      await expect(page.locator("#settingsSkillModalNoResults")).toBeVisible();

      await page.click("#settingsSkillModalClose");
      await page.click('[data-remove-skill-id="codex-file-search"]');
      await expect(page.locator('[data-remove-skill-id="codex-file-search"]')).toHaveCount(0);
      await page.click("#settingsSkillMarketOpenModal");
      await page.fill("#settingsSkillModalKeyword", "file search");
      await page.click("#settingsSkillModalSearch");
      await page.click('#settingsSkillModalResults [data-clawhub-download-skill="codex-file-search"]');
      await expect(page.locator('[data-remove-skill-id="codex-file-search"]')).toHaveCount(1);
      await expect(page.locator('[data-clawhub-download-skill="codex-file-search"]')).toHaveCount(0);
      await expect(page.locator("#settingsSkillModalResults")).not.toContainText("File Search");
      await expect(page.locator("#settingsSkillMarketPreview")).not.toContainText("File Search");
    });

    test("pal list includes roles and allows name/model/tool settings", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await expect(page.locator("#palList")).toContainText(/Guide役|Guide/);
      await expect(page.locator("#palList")).toContainText(/Gate役|Gate/);
      await expect(page.locator("#palList")).toContainText(/住人|Worker \/ 住人/);

      await page.click('[data-pal-open-id="guide-core"]');
      await expect(page.locator('[data-pal-runtime-select="guide-core"]')).toHaveValue("model");
      await expect(page.locator('[data-pal-runtime-target-select="guide-core"]')).toBeEnabled();
      await expect(
        page.locator('[data-pal-skill-checkbox="guide-core"][value="codex-file-search"]')
      ).toBeEnabled();
      await expect(
        page.locator('[data-pal-skill-checkbox="guide-core"][value="browser-chrome"]')
      ).toBeChecked();

      await page.fill('[data-pal-name-input="guide-core"]', "Guide Prime");
      await page.selectOption('[data-pal-runtime-target-select="guide-core"]', "gpt-4o-mini");
      await page.uncheck('[data-pal-skill-checkbox="guide-core"][value="codex-file-read"]');
      await page.click("#palConfigSave");
      await expect(page.locator("#palList")).toContainText("Guide Prime");
      await expect(page.locator("#palList")).toContainText("gpt-4o-mini");

      await page.click('[data-pal-open-id="guide-core"]');
      await expect(
        page.locator('[data-pal-skill-checkbox="guide-core"][value="codex-file-read"]')
      ).not.toBeChecked();

      await page.selectOption('[data-pal-runtime-select="guide-core"]', "tool");
      await expect(page.locator('[data-pal-runtime-select="guide-core"]')).toHaveValue("tool");
      await expect(page.locator('[data-pal-runtime-target-select="guide-core"]')).toBeEnabled();
      await expect(
        page.locator('[data-pal-skill-checkbox="guide-core"][value="codex-file-search"]')
      ).toBeDisabled();
      await expect(
        page.locator('[data-pal-skill-checkbox="guide-core"][value="codex-file-search"]')
      ).not.toBeChecked();
      await page.selectOption('[data-pal-runtime-target-select="guide-core"]', "Codex");
      await page.click("#palConfigSave");
      await expect(page.locator("#palList")).toContainText("Codex");
    });

    test("pal runtime save is blocked when tool target is not available", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      while ((await page.locator("[data-remove-model-index]").count()) > 0) {
        await page.locator("[data-remove-model-index]").first().click();
      }
      while ((await page.locator("[data-remove-tool-index]").count()) > 0) {
        await page.locator("[data-remove-tool-index]").first().click();
      }

      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.selectOption('[data-pal-runtime-select="guide-core"]', "tool");
      await expect(page.locator('[data-pal-runtime-target-select="guide-core"]')).toBeDisabled();

      await page.click("#palConfigSave");
      await expect(page.locator("#errorToast")).toBeVisible();
      await expect(page.locator("#errorToastCode")).toContainText("MSG-PPH-1001");
    });

    test("error toast appears from bottom on validation error", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.fill('[data-pal-name-input="guide-core"]', "");
      await page.click("#palConfigSave");

      await expect(page.locator("#errorToast")).toBeVisible();
      await expect(page.locator("#errorToast")).toHaveClass(/is-visible/);
      await expect(page.locator("#errorToastCode")).toContainText("MSG-PPH-1001");

      const metrics = await page.locator("#errorToast").evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          viewportHeight: window.innerHeight,
        };
      });

      expect(metrics.viewportHeight - metrics.bottom).toBeLessThanOrEqual(40);
    });

    test("pal config footer stays compact", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');

      await expect(page.locator("#palConfigDelete")).toBeVisible();
      await expect(page.locator("#palConfigSave")).toBeVisible();

      const metrics = await page.locator(".pal-config-modal-footer").evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          height: rect.height,
          paddingTop: window.getComputedStyle(el).paddingTop,
          paddingBottom: window.getComputedStyle(el).paddingBottom,
        };
      });

      expect(metrics.height).toBeLessThanOrEqual(40);
      expect(metrics.paddingTop).toBe("4px");
      expect(metrics.paddingBottom).toBe("4px");
    });

    test("pal config modal does not leave a large gap below footer", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.locator("#palConfigModalBody").evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });

      const metrics = await page.evaluate(() => {
        const modal = document.querySelector("#palConfigModal .pal-config-modal");
        const footer = document.querySelector("#palConfigModal .pal-config-modal-footer");
        const modalRect = modal.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        return {
          gapBelowFooter: modalRect.bottom - footerRect.bottom,
          modalHeight: modalRect.height,
          footerHeight: footerRect.height,
        };
      });

      expect(metrics.gapBelowFooter).toBeLessThanOrEqual(12);
      expect(metrics.modalHeight).toBeGreaterThan(metrics.footerHeight);
    });

    test("pal list supports add and delete profile", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      const rows = page.locator("[data-pal-row]");
      const before = await rows.count();

      await expect(page.locator("#palAddProfile")).toBeVisible();
      await page.click("#palAddProfile");
      await expect(rows).toHaveCount(before + 1);

      const newRow = rows.nth(before);
      const palId = await newRow.getAttribute("data-pal-row");
      expect(palId).toBeTruthy();
      await expect(page.locator(`[data-pal-name-input="${palId}"]`)).toHaveValue("新しい住人");
      await expect(page.locator(`[data-pal-runtime-select="${palId}"]`)).toHaveValue("model");
      await expect(page.locator(`[data-pal-runtime-target-select="${palId}"]`)).toBeEnabled();
      await expect(
        page.locator(`[data-pal-skill-checkbox="${palId}"][value="codex-file-search"]`)
      ).toBeChecked();

      await page.click(`[data-pal-delete-id="${palId}"]`);
      await expect(rows).toHaveCount(before);
    });

    test("guide and gate profiles can be added and selected", async ({ page }) => {
      await page.click('[data-tab="pal"]');

      await page.click("#palAddGuideProfile");
      const guideRows = page.locator('[data-pal-role="guide"]');
      const guideId = await guideRows.last().getAttribute("data-pal-row");
      expect(guideId).toBeTruthy();
      await expect(page.locator(`[data-pal-name-input="${guideId}"]`)).toHaveValue("New Guide");
      await page.click("#closePalConfigModal");

      await page.click("#palAddGateProfile");
      const gateRows = page.locator('[data-pal-role="gate"]');
      const gateId = await gateRows.last().getAttribute("data-pal-row");
      expect(gateId).toBeTruthy();
      await expect(page.locator(`[data-pal-name-input="${gateId}"]`)).toHaveValue("New Gate");
      await page.click("#closePalConfigModal");

      await page.click(`[data-pal-set-active-guide-id="${guideId}"]`);
      await page.click(`[data-pal-set-default-gate-id="${gateId}"]`);
      await expect(page.locator(`[data-pal-row="${guideId}"]`)).toHaveAttribute("data-guide-active", "true");
      await expect(page.locator(`[data-pal-row="${gateId}"]`)).toHaveAttribute("data-gate-default", "true");

      await page.reload();
      await page.click('[data-tab="pal"]');
      await expect(page.locator(`[data-pal-row="${guideId}"]`)).toHaveAttribute("data-guide-active", "true");
      await expect(page.locator(`[data-pal-row="${gateId}"]`)).toHaveAttribute("data-gate-default", "true");
    });

    test("pal add initializes localized SOUL and ROLE templates", async ({ page }) => {
      await page.evaluate(() => {
        window.__palpalIdentitySaves = [];
        window.TomoshibikanAgentIdentity = {
          load: async () => ({
            agentType: "worker",
            agentId: "",
            soul: "",
            role: "",
            enabledSkillIds: [],
            hasIdentityFiles: false,
          }),
          save: async (payload) => {
            window.__palpalIdentitySaves.push(payload);
            return {
              agentType: payload.agentType,
              agentId: payload.agentId || "",
              soul: "# SOUL",
              role: "# ROLE",
              enabledSkillIds: Array.isArray(payload.enabledSkillIds) ? payload.enabledSkillIds : [],
              hasIdentityFiles: true,
            };
          },
        };
      });

      await page.click('[data-tab="settings"]');
      await page.click("#settingsLocaleEn");
      await page.click('[data-tab="pal"]');
      await page.click("#palAddProfile");

      const saves = await page.evaluate(() => window.__palpalIdentitySaves);
      expect(saves).toHaveLength(1);
      expect(saves[0].agentType).toBe("worker");
      expect(saves[0].locale).toBe("en");
      expect(saves[0].initializeTemplates).toBe(true);
      expect(saves[0].enabledSkillIds).toContain("codex-file-search");
    });

    test("guide and gate add initialize role-aware identity templates", async ({ page }) => {
      await page.evaluate(() => {
        window.__palpalIdentitySaves = [];
        window.TomoshibikanAgentIdentity = {
          load: async () => ({
            agentType: "worker",
            agentId: "",
            soul: "",
            role: "",
            rubric: "",
            enabledSkillIds: [],
            hasIdentityFiles: false,
          }),
          save: async (payload) => {
            window.__palpalIdentitySaves.push(payload);
            return {
              agentType: payload.agentType,
              agentId: payload.agentId || "",
              soul: "# SOUL",
              role: payload.agentType === "gate" ? "" : "# ROLE",
              rubric: payload.agentType === "gate" ? "# RUBRIC" : "",
              enabledSkillIds: Array.isArray(payload.enabledSkillIds) ? payload.enabledSkillIds : [],
              hasIdentityFiles: true,
            };
          },
        };
      });

      await page.click('[data-tab="pal"]');
      await page.click("#palAddGuideProfile");
      await page.click("#closePalConfigModal");
      await page.click("#palAddGateProfile");

      const saves = await page.evaluate(() => window.__palpalIdentitySaves);
      expect(saves).toHaveLength(2);
      expect(saves[0].agentType).toBe("guide");
      expect(saves[0].agentId).toMatch(/^guide-/);
      expect(saves[0].initializeTemplates).toBe(true);
      expect(saves[1].agentType).toBe("gate");
      expect(saves[1].agentId).toMatch(/^gate-/);
      expect(saves[1].initializeTemplates).toBe(true);
    });

    test("built-in debug identities are seeded on init when missing", async ({ page }) => {
      await page.addInitScript(() => {
        window.__palpalIdentitySaves = [];
        window.__palpalIdentityStore = {};
        window.TomoshibikanAgentIdentity = {
          load: async (payload) => {
            const key = `${payload.agentType}:${payload.agentId || ""}`;
            const stored = window.__palpalIdentityStore[key];
            if (stored) return { ...stored };
            return {
              agentType: payload.agentType,
              agentId: payload.agentId || "",
              soul: "",
              role: "",
              rubric: "",
              enabledSkillIds: [],
              hasIdentityFiles: false,
            };
          },
          save: async (payload) => {
            window.__palpalIdentitySaves.push(payload);
            const key = `${payload.agentType}:${payload.agentId || ""}`;
            const next = {
              agentType: payload.agentType,
              agentId: payload.agentId || "",
              soul: payload.soul || "",
              role: payload.role || "",
              rubric: payload.rubric || "",
              enabledSkillIds: Array.isArray(payload.enabledSkillIds) ? payload.enabledSkillIds : [],
              hasIdentityFiles: true,
            };
            window.__palpalIdentityStore[key] = next;
            return next;
          },
        };
      });

      await page.goto(WIREFRAME_URL);

      const saves = await page.evaluate(() => window.__palpalIdentitySaves);
      expect(saves).toHaveLength(5);

      const guide = saves.find((item) => item.agentId === "guide-core");
      const gate = saves.find((item) => item.agentId === "gate-core");
      const researchResident = saves.find((item) => item.agentId === "pal-alpha");
      const makerResident = saves.find((item) => item.agentId === "pal-beta");
      const writerResident = saves.find((item) => item.agentId === "pal-delta");

      expect(guide.role).toMatch(/trace \/ fix \/ verify/);
      expect(gate.rubric).toMatch(/Decision Shape/);
      expect(researchResident.role).toMatch(/リサーチャー|researcher resident/);
      expect(makerResident.role).toMatch(/プログラマ|maker resident/);
      expect(writerResident.role).toMatch(/ライター|writer resident/);
      expect(researchResident.enabledSkillIds).toContain("codex-file-search");
      expect(writerResident.enabledSkillIds).toContain("codex-test-runner");
    });

    test("identity files can be edited from pal settings modal", async ({ page }) => {
      await page.evaluate(() => {
        window.__palpalIdentitySaves = [];
        window.__palpalIdentityStore = {
          "guide:guide-core": {
            agentType: "guide",
            agentId: "guide-core",
            soul: "# SOUL\nGuide calmness",
            role: "# ROLE\nGuide routing",
            rubric: "",
            enabledSkillIds: ["codex-file-search"],
            hasIdentityFiles: true,
          },
          "gate:gate-core": {
            agentType: "gate",
            agentId: "gate-core",
            soul: "# SOUL\nGate carefulness",
            role: "",
            rubric: "# RUBRIC\nCheck evidence",
            enabledSkillIds: [],
            hasIdentityFiles: true,
          },
        };
        window.TomoshibikanAgentIdentity = {
          load: async (payload) => {
            const key = `${payload.agentType}:${payload.agentId || ""}`;
            const stored = window.__palpalIdentityStore[key];
            if (!stored) {
              return {
                agentType: payload.agentType,
                agentId: payload.agentId || "",
                soul: "",
                role: "",
                rubric: "",
                enabledSkillIds: [],
                hasIdentityFiles: false,
              };
            }
            return { ...stored };
          },
          save: async (payload) => {
            window.__palpalIdentitySaves.push(payload);
            const key = `${payload.agentType}:${payload.agentId || ""}`;
            const next = {
              agentType: payload.agentType,
              agentId: payload.agentId || "",
              soul: payload.soul || "",
              role: payload.role || "",
              rubric: payload.rubric || "",
              enabledSkillIds: Array.isArray(payload.enabledSkillIds) ? payload.enabledSkillIds : [],
              hasIdentityFiles: true,
            };
            window.__palpalIdentityStore[key] = next;
            return next;
          },
        };
      });

      await page.click('[data-tab="pal"]');
      await page.click('[data-pal-open-id="guide-core"]');
      await page.click('[data-pal-edit-identity="guide-core:soul"]');
      await expect(page.locator("#identityEditorModal")).not.toHaveClass(/hidden/);
      await expect(page.locator("#identityEditorTitle")).toContainText("SOUL.md");
      await expect(page.locator("#identityEditorTextarea")).toHaveValue(/Guide calmness/);
      await page.fill("#identityEditorTextarea", "# SOUL\nGuide curiosity");
      await page.click("#identityEditorSave");

      await page.click("#closePalConfigModal");
      await page.click('[data-pal-open-id="gate-core"]');
      await page.click('[data-pal-edit-identity="gate-core:rubric"]');
      await expect(page.locator("#identityEditorTitle")).toContainText("RUBRIC.md");
      await expect(page.locator("#identityEditorTextarea")).toHaveValue(/Check evidence/);
      await page.fill("#identityEditorTextarea", "# RUBRIC\nCheck evidence and safety");
      await page.click("#identityEditorSave");

      const saves = await page.evaluate(() => window.__palpalIdentitySaves);
      expect(saves).toHaveLength(2);
      expect(saves[0].agentType).toBe("guide");
      expect(saves[0].agentId).toBe("guide-core");
      expect(saves[0].soul).toContain("Guide curiosity");
      expect(saves[0].role).toContain("Guide routing");
      expect(saves[1].agentType).toBe("gate");
      expect(saves[1].agentId).toBe("gate-core");
      expect(saves[1].rubric).toContain("safety");
      expect(saves[1].soul).toContain("Gate carefulness");
    });

    test("settings can sync built-in resident definitions to workspace", async ({ page }) => {
      await page.addInitScript(() => {
        const oldSnapshot = {
          profiles: [
            { id: "guide-core", role: "guide", runtimeKind: "model", displayName: "燈子さん", persona: "old guide", provider: "openai", models: ["gpt-4o-mini"], cliTools: [], skills: ["codex-file-search"], status: "active" },
            { id: "gate-core", role: "gate", runtimeKind: "model", displayName: "真壁", persona: "old gate", provider: "openai", models: ["gpt-4o-mini"], cliTools: [], skills: ["codex-file-read"], status: "active" },
            { id: "pal-alpha", role: "worker", runtimeKind: "tool", displayName: "冬坂", persona: "old trace", provider: "openai", models: [], cliTools: ["Codex"], skills: ["codex-file-search"], status: "active" },
            { id: "pal-beta", role: "worker", runtimeKind: "tool", displayName: "久瀬", persona: "old fix", provider: "openai", models: [], cliTools: ["Codex"], skills: ["codex-file-edit"], status: "active" },
            { id: "pal-gamma", role: "worker", runtimeKind: "tool", displayName: "整える人", persona: "old arranger", provider: "openai", models: [], cliTools: ["Codex"], skills: ["codex-test-runner"], status: "active" },
          ],
          activeGuideId: "guide-core",
          defaultGateId: "gate-core",
        };
        localStorage.setItem("tomoshibi-kan.agent-profiles.v1", JSON.stringify(oldSnapshot));
        window.__palpalIdentitySaves = [];
        window.__palpalIdentityStore = {
          "guide:guide-core": { agentType: "guide", agentId: "guide-core", soul: "# SOUL\nold", role: "# ROLE\nold", rubric: "", enabledSkillIds: ["codex-file-search"], hasIdentityFiles: true },
          "gate:gate-core": { agentType: "gate", agentId: "gate-core", soul: "# SOUL\nold", role: "", rubric: "# RUBRIC\nold", enabledSkillIds: ["codex-file-read"], hasIdentityFiles: true },
          "worker:pal-alpha": { agentType: "worker", agentId: "pal-alpha", soul: "# SOUL\nold", role: "# ROLE\nold", rubric: "", enabledSkillIds: ["codex-file-search"], hasIdentityFiles: true },
          "worker:pal-beta": { agentType: "worker", agentId: "pal-beta", soul: "# SOUL\nold", role: "# ROLE\nold", rubric: "", enabledSkillIds: ["codex-file-edit"], hasIdentityFiles: true },
          "worker:pal-gamma": { agentType: "worker", agentId: "pal-gamma", soul: "# SOUL\nold", role: "# ROLE\nold", rubric: "", enabledSkillIds: ["codex-test-runner"], hasIdentityFiles: true },
        };
        window.TomoshibikanAgentIdentity = {
          load: async (payload) => {
            const key = `${payload.agentType}:${payload.agentId || ""}`;
            return window.__palpalIdentityStore[key] || {
              agentType: payload.agentType,
              agentId: payload.agentId || "",
              soul: "",
              role: "",
              rubric: "",
              enabledSkillIds: [],
              hasIdentityFiles: false,
            };
          },
          save: async (payload) => {
            window.__palpalIdentitySaves.push(payload);
            const key = `${payload.agentType}:${payload.agentId || ""}`;
            const next = {
              agentType: payload.agentType,
              agentId: payload.agentId || "",
              soul: payload.soul || "",
              role: payload.role || "",
              rubric: payload.rubric || "",
              enabledSkillIds: Array.isArray(payload.enabledSkillIds) ? payload.enabledSkillIds : [],
              hasIdentityFiles: true,
            };
            window.__palpalIdentityStore[key] = next;
            return next;
          },
        };
      });

      await page.goto(WIREFRAME_URL);
      await page.click('[data-tab="settings"]');
      await page.click("#settingsSyncBuiltInResidents");

      const saves = await page.evaluate(() => window.__palpalIdentitySaves);
      expect(saves).toHaveLength(5);
      expect(saves.some((item) => item.agentId === "pal-delta")).toBeTruthy();
      expect(saves.some((item) => item.agentId === "pal-gamma")).toBeFalsy();
      const guideSave = saves.find((item) => item.agentId === "guide-core");
      const gateSave = saves.find((item) => item.agentId === "gate-core");
      const researcherSave = saves.find((item) => item.agentId === "pal-alpha");
      expect(guideSave.role).toContain("Progress Voice");
      expect(guideSave.role).toContain("Progress Note Triggers");
      expect(gateSave.rubric).toContain("Progress Voice");
      expect(gateSave.rubric).toContain("Progress Note Triggers");
      expect(researcherSave.role).toContain("Hand-off Rules");

      await page.click('[data-tab="pal"]');
      await expect(page.locator("#palList")).toContainText("白峰");
      await expect(page.locator("#palList")).toContainText("冬坂");
      await expect(page.locator("#palList")).toContainText("久瀬");
      await expect(page.locator("#palList")).toContainText("真壁");
      await expect(page.locator("#palList")).toContainText("燈子さん");

      await page.click('[data-pal-open-id="guide-core"]');
      await page.click('[data-pal-edit-identity="guide-core:role"]');
      await expect(page.locator("#identityEditorTextarea")).toHaveValue(/Progress Voice/);
      await expect(page.locator("#identityEditorTextarea")).toHaveValue(/Progress Note Triggers/);
      await page.click("#identityEditorCancel");
    });

    test("language switch exists in settings tab", async ({ page }) => {
      await expect(page.locator("#localeJa")).toHaveCount(0);
      await expect(page.locator("#localeEn")).toHaveCount(0);

      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsLocaleJa")).toBeVisible();
      await expect(page.locator("#settingsLocaleEn")).toBeVisible();

      await page.click("#settingsLocaleEn");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator("#settingsTabOpenAddItem")).toContainText("Add");

      await page.click("#settingsLocaleJa");
      await expect(page.locator("html")).toHaveAttribute("lang", "ja");
      await expect(page.locator("#settingsTabOpenAddItem")).toContainText("項目を追加");
    });
  });
}


