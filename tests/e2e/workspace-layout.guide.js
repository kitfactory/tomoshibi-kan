const { WIREFRAME_URL } = require('./workspace-layout.shared');

function registerGuideTests(test, expect) {
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

    test("guide chat reuses approved plan on repeated approval intent", async ({ page }) => {
      await page.click('[data-tab="guide"]');
      const beforeTaskCount = await page.locator('[data-task-row]').count();
      await page.evaluate(() => {
        const runtime = window.TomoshibikanCoreRuntime || {};
        window.requestGuideModelReplyWithFallback = async () => ({
          provider: "openai",
          modelName: "gpt-4.1",
          text: JSON.stringify({
            status: "plan_ready",
            reply: "依頼案を作成しました。",
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
                reason: "このままでよさそうです。",
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
      await page.fill("#guideInput", "設定画面の保存を改善してください");
      await page.click("#guideSend");
      await page.fill("#guideInput", "はい");
      await page.click("#guideSend");
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount + 1);
      await page.evaluate(() => {
        window.requestGuideModelReplyWithFallback = async () => {
          throw new Error("guide model should not be called for repeated approval intent");
        };
      });
      await page.click('[data-tab="guide"]');
      const beforeGuideEntryCount = await page.locator("#guideChat > li").count();
      await page.evaluate(async () => {
        const input = document.getElementById("guideInput");
        if (!(input instanceof HTMLTextAreaElement) || typeof window.sendGuideMessage !== "function") {
          throw new Error("guide send function is not available");
        }
        input.value = "進めて";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        await window.sendGuideMessage();
      });
      await expect(page.locator("#guideChat > li")).toHaveCount(beforeGuideEntryCount + 2);
      await expect(page.locator("#guideChat")).toContainText(/既に進めています|もう進め始めています|already underway/);
      await page.click('[data-tab="task"]');
      await expect(page.locator('[data-task-row]')).toHaveCount(beforeTaskCount + 1);
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
}
module.exports = { registerGuideTests };
