function registerSettingsTests(test, expect) {
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
}
module.exports = { registerSettingsTests };
