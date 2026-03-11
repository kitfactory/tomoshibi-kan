const { WIREFRAME_URL } = require('./workspace-layout.shared');

function registerProfileTests(test, expect) {
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
}
module.exports = { registerProfileTests };
