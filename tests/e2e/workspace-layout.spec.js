const { test, expect } = require('@playwright/test');
const { WIREFRAME_URL, TAB_SPECS, VIEWPORTS, setupClawHubMock } = require('./workspace-layout.shared');
const { registerGuideTests } = require('./workspace-layout.guide');
const { registerBoardTests } = require('./workspace-layout.board');
const { registerSettingsTests } = require('./workspace-layout.settings');
const { registerProfileTests } = require('./workspace-layout.profiles');

for (const viewport of VIEWPORTS) {
  test.describe(`workspace fits viewport ${viewport.width}x${viewport.height}`, () => {
    test.beforeEach(async ({ page }) => {
      await setupClawHubMock(page);
      await page.addInitScript(() => {
        const queue = [
          'C:/workspace/hive-docs',
          'C:/workspace/hive-docs',
          'C:/workspace/alpha-work',
        ];
        window.TomoshibikanProjectDialog = {
          pickDirectory: async () => queue.shift() || 'C:/workspace/hive-docs',
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
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          };
        });

        expect(panelMetrics.top).toBeGreaterThanOrEqual(0);
        expect(panelMetrics.left).toBeGreaterThanOrEqual(0);
        expect(panelMetrics.right).toBeLessThanOrEqual(viewport.width + 1);
        expect(panelMetrics.bottom).toBeLessThanOrEqual(viewport.height + 1);
        expect(panelMetrics.width).toBeGreaterThan(0);
        expect(panelMetrics.height).toBeGreaterThan(0);
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

    registerGuideTests(test, expect);
    registerBoardTests(test, expect);
    registerSettingsTests(test, expect);
    registerProfileTests(test, expect);
  });
}
