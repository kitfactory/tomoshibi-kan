const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

const WIREFRAME_URL = pathToFileURL(
  path.resolve(__dirname, "../../wireframe/index.html")
).href;

const LIVE_MODE = process.env.PALPAL_E2E_LIVE === "1";

test.describe("clawhub live @live", () => {
  test.skip(!LIVE_MODE, "Set PALPAL_E2E_LIVE=1 to run live network tests.");

  test("skill search reaches terminal state with live ClawHub", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(WIREFRAME_URL);

    await page.click('[data-tab="settings"]');
    await page.click("#settingsSkillMarketOpenModal");
    await page.fill("#settingsSkillModalKeyword", "browser");
    await page.click("#settingsSkillModalSearch");

    await expect
      .poll(async () => {
        const loading = await page.locator("#settingsSkillModalLoading").count();
        const noResults = await page.locator("#settingsSkillModalNoResults").count();
        const resultRows = await page.locator("#settingsSkillModalResults .settings-skill-modal-row").count();
        return loading === 0 && (noResults > 0 || resultRows > 0);
      }, { timeout: 20_000, intervals: [250, 500, 1_000] })
      .toBe(true);
  });
});
