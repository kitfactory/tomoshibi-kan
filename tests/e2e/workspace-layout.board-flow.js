function registerBoardFlowTests(test, expect) {
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
      await expect(page.locator('#detailConversationLog [data-detail-actor="guide"]').first()).toContainText(/管理人|Guide/);
      await expect(page.locator('#detailConversationLog [data-detail-action="dispatch"]')).toContainText(/依頼|Dispatch/);
      await expect(page.locator("#detailConversationLog")).toContainText(/再現確認/);
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
}
module.exports = { registerBoardFlowTests };
