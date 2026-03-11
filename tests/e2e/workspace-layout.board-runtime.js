function registerBoardRuntimeTests(test, expect) {

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
}
module.exports = { registerBoardRuntimeTests };

