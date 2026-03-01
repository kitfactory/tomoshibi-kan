const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

const WIREFRAME_URL = pathToFileURL(
  path.resolve(__dirname, "../../wireframe/index.html")
).href;

const TAB_SPECS = [
  { key: "guide", button: '[data-tab="guide"]', panel: '[data-tab-panel="guide"]' },
  { key: "pal", button: '[data-tab="pal"]', panel: '[data-tab-panel="pal"]' },
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

for (const viewport of VIEWPORTS) {
  test.describe(`workspace fits viewport ${viewport.width}x${viewport.height}`, () => {
    test.beforeEach(async ({ page }) => {
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
      await page.click('[data-job-action="start"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="submit"][data-job-id="JOB-001"]');
      await page.click('[data-job-action="gate"][data-job-id="JOB-001"]');
      await expect(page.locator("#gatePanel")).not.toHaveClass(/hidden/);
      await page.click("#approveTask");
      await expect(page.locator("#gatePanel")).toHaveClass(/hidden/);
      await expect(page.locator('[data-job-row="JOB-001"]')).toContainText(/Done|螳御ｺ・/);
    });

    test("settings tab shows model list and allows adding model", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsTabContent")).toBeVisible();
      await expect(page.locator("#settingsTabSkillList")).toContainText("File Search");
      await expect(page.locator("#settingsTabSkillList")).toContainText("File Edit");
      await expect(page.locator("#settingsTabClawHubList")).toContainText("ClawHub");
      while ((await page.locator("[data-remove-model-index]").count()) > 0) {
        await page.locator("[data-remove-model-index]").first().click();
      }
      while ((await page.locator("[data-remove-tool-index]").count()) > 0) {
        await page.locator("[data-remove-tool-index]").first().click();
      }
      await expect(page.locator("#settingsTabModelEmpty")).toContainText("モデルはありません");
      await page.click("#settingsTabOpenAddItem");
      await page.selectOption("#settingsTabModelProvider", "anthropic");
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
      await expect(page.locator("#palList")).toContainText("Anthropic");
      await expect(page.locator("#palList")).toContainText("claude-3-7-sonnet");
      await expect(page.locator("#palList")).toContainText("ClaudeCode");
    });

    test("settings tab supports skill uninstall and install", async ({ page }) => {
      await page.click('[data-tab="settings"]');
      await expect(page.locator("#settingsTabSkillList")).toContainText("File Search");

      await page.click('[data-remove-skill-id="codex-file-search"]');
      await expect(page.locator('[data-remove-skill-id="codex-file-search"]')).toHaveCount(0);

      await page.fill("#settingsTabSkillSearch", "file search");
      await page.click('[data-clawhub-download-skill="codex-file-search"]');
      await expect(page.locator('[data-remove-skill-id="codex-file-search"]')).toHaveCount(1);
    });

    test("pal list includes roles and allows name/model/tool settings", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await expect(page.locator("#palList")).toContainText(/Guide役|Guide/);
      await expect(page.locator("#palList")).toContainText(/Gate役|Gate/);
      await expect(page.locator("#palList")).toContainText(/通常Pal|Worker Pal/);

      await expect(page.locator('[data-pal-runtime-select="pal-guide"]')).toHaveValue("model");
      await expect(page.locator('[data-pal-runtime-target-select="pal-guide"]')).toBeEnabled();
      await expect(
        page.locator('[data-pal-skill-checkbox="pal-guide"][value="codex-file-search"]')
      ).toBeEnabled();
      await expect(
        page.locator('[data-pal-skill-checkbox="pal-guide"][value="browser-chrome"]')
      ).toBeChecked();

      await page.fill('[data-pal-name-input="pal-guide"]', "Guide Prime");
      await page.selectOption('[data-pal-runtime-target-select="pal-guide"]', "gpt-4o-mini");
      await page.uncheck('[data-pal-skill-checkbox="pal-guide"][value="codex-file-read"]');
      await page.click('[data-pal-save-id="pal-guide"]');
      await expect(page.locator("#palList")).toContainText("Guide Prime");
      await expect(page.locator("#palList")).toContainText("gpt-4o-mini");
      await expect(
        page.locator('[data-pal-skill-checkbox="pal-guide"][value="codex-file-read"]')
      ).not.toBeChecked();

      await page.selectOption('[data-pal-runtime-select="pal-guide"]', "tool");
      await expect(page.locator('[data-pal-runtime-select="pal-guide"]')).toHaveValue("tool");
      await expect(page.locator('[data-pal-runtime-target-select="pal-guide"]')).toBeEnabled();
      await expect(
        page.locator('[data-pal-skill-checkbox="pal-guide"][value="codex-file-search"]')
      ).toBeDisabled();
      await page.selectOption('[data-pal-runtime-target-select="pal-guide"]', "Codex");
      await page.click('[data-pal-save-id="pal-guide"]');
      await expect(page.locator("#palList")).toContainText("Codex");
    });

    test("error toast appears from bottom on validation error", async ({ page }) => {
      await page.click('[data-tab="pal"]');
      await page.fill('[data-pal-name-input="pal-guide"]', "");
      await page.click('[data-pal-save-id="pal-guide"]');

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

      await newRow.locator(`[data-pal-delete-id="${palId}"]`).click();
      await expect(rows).toHaveCount(before);
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
