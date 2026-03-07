(function attachGuidePlan(scope) {
  function normalizeString(value) {
    return String(value || "").trim();
  }

  function uniqueList(values) {
    const seen = new Set();
    const result = [];
    (Array.isArray(values) ? values : []).forEach((value) => {
      const normalized = normalizeString(value);
      if (!normalized) return;
      const key = normalized.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      result.push(normalized);
    });
    return result;
  }

  function stripCodeFence(text) {
    const source = normalizeString(text);
    if (!source) return "";
    return source
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
  }

  function uniqueTextList(values) {
    const seen = new Set();
    const result = [];
    (Array.isArray(values) ? values : []).forEach((value) => {
      const normalized = normalizeString(value);
      if (!normalized) return;
      if (seen.has(normalized)) return;
      seen.add(normalized);
      result.push(normalized);
    });
    return result;
  }

  function stripWrapperTokens(text) {
    const source = normalizeString(text);
    if (!source) return "";
    return source.replace(/<\|[^>]+?\|>/g, "").trim();
  }

  function buildJsonCandidates(text) {
    const stripped = stripWrapperTokens(stripCodeFence(text));
    if (!stripped) return [];
    const candidates = [stripped];
    const firstBrace = stripped.indexOf("{");
    const lastBrace = stripped.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      candidates.push(stripped.slice(firstBrace, lastBrace + 1));
    }
    return uniqueTextList(candidates);
  }

  function repairJsonText(text) {
    const source = normalizeString(text);
    if (!source) return [];
    const repairedObjectQuotes = source
      .replace(/([:\[,]\s*)"\{/g, "$1{")
      .replace(/\}"(\s*[,}\]])/g, "}$1");
    const withoutTrailingCommas = repairedObjectQuotes.replace(/,\s*([}\]])/g, "$1");
    return uniqueTextList([
      repairedObjectQuotes,
      withoutTrailingCommas,
    ]);
  }

  function parseJsonWithRepairs(text) {
    const baseCandidates = buildJsonCandidates(text);
    const candidates = [];
    baseCandidates.forEach((candidate) => {
      candidates.push(candidate);
      repairJsonText(candidate).forEach((repaired) => candidates.push(repaired));
    });
    for (const candidate of uniqueTextList(candidates)) {
      try {
        return {
          ok: true,
          parsed: JSON.parse(candidate),
        };
      } catch (error) {
        // continue
      }
    }
    return {
      ok: false,
      error: baseCandidates.length > 0 ? "json_parse_failed" : "json_not_found",
    };
  }

  function normalizeGuidePlanTask(task, index) {
    if (!task || typeof task !== "object" || Array.isArray(task)) return null;
    const title = normalizeString(task.title) || `Task ${index + 1}`;
    const description = normalizeString(task.description);
    if (!description) return null;
    return {
      title,
      description,
      expectedOutput: normalizeString(task.expectedOutput),
      requiredSkills: uniqueList(task.requiredSkills),
      reviewFocus: uniqueList(task.reviewFocus),
      assigneePalId: normalizeString(task.assigneePalId),
    };
  }

  function hasExplicitDebugBreakdown(reply) {
    const text = normalizeString(reply).toLowerCase();
    if (!text) return false;
    return /trace/.test(text) && /fix/.test(text) && /verify/.test(text);
  }

  function hasExplicitDebugBreakdownContext(options) {
    const planningIntent = normalizeString(options?.planningIntent);
    const planningReadiness = normalizeString(options?.planningReadiness);
    return planningIntent === "explicit_breakdown" || planningReadiness === "debug_repro_ready";
  }

  function isSuspiciousTask(task) {
    const title = normalizeString(task?.title);
    const description = normalizeString(task?.description);
    const combined = `${title}\n${description}`;
    if (!title || !description) return true;
    if (/Task\s*\d+/i.test(title)) return true;
    if (/[?]{3,}|[.]{5,}|[…]{2,}|�/.test(combined)) return true;
    return false;
  }

  function buildRecoveredDebugTasks() {
    return [
      {
        title: "Trace",
        description: "保存処理の再現手順、イベントハンドラ、関連ファイルを確認して証拠を集める。",
        expectedOutput: "再現結果、関連ファイル、原因候補の trace summary",
        requiredSkills: ["browser-chrome", "codex-file-search", "codex-file-read"],
        reviewFocus: ["repro", "traceability"],
        assigneePalId: "",
      },
      {
        title: "Fix",
        description: "trace の結果に基づいて保存処理の不整合を最小変更で修正する。",
        expectedOutput: "修正内容、影響ファイル、残リスクの summary",
        requiredSkills: ["codex-file-read", "codex-file-edit"],
        reviewFocus: ["scope", "minimal_fix"],
        assigneePalId: "",
      },
      {
        title: "Verify",
        description: "再現手順を再実行し、reload 後も model が残ることを確認する。",
        expectedOutput: "pass/fail evidence と残っている不確実性",
        requiredSkills: ["codex-test-runner", "codex-file-read"],
        reviewFocus: ["expected_outcome", "regression"],
        assigneePalId: "",
      },
    ];
  }

  function recoverGuidePlanTasks(tasks, reply, options = {}) {
    const normalizedTasks = Array.isArray(tasks) ? tasks : [];
    if (!hasExplicitDebugBreakdown(reply) && !hasExplicitDebugBreakdownContext(options)) {
      return normalizedTasks;
    }
    const suspiciousCount = normalizedTasks.filter((task) => isSuspiciousTask(task)).length;
    if (normalizedTasks.length >= 3 && suspiciousCount === 0) return normalizedTasks;
    return buildRecoveredDebugTasks();
  }

  function normalizeGuidePlan(plan, reply = "", options = {}) {
    if (!plan || typeof plan !== "object" || Array.isArray(plan)) return null;
    const goal = normalizeString(plan.goal);
    const completionDefinition = normalizeString(
      plan.completionDefinition || plan.expectedOutcome || plan.doneDefinition
    );
    const constraints = uniqueList(plan.constraints);
    const tasks = recoverGuidePlanTasks((Array.isArray(plan.tasks) ? plan.tasks : [])
      .map((task, index) => normalizeGuidePlanTask(task, index))
      .filter(Boolean)
      .slice(0, 5), reply, options);
    if (!goal || !completionDefinition || tasks.length === 0) return null;
    return {
      goal,
      completionDefinition,
      constraints,
      tasks,
    };
  }

  function buildRecoveredPlanReadyReply(plan, localeValue = "ja") {
    const taskTitles = Array.isArray(plan?.tasks)
      ? plan.tasks.map((task) => normalizeString(task?.title)).filter(Boolean)
      : [];
    const joined = taskTitles.join(" / ");
    if (normalizeString(localeValue).toLowerCase() === "en") {
      return joined
        ? `I prepared a plan with ${joined}.`
        : "I prepared a plan.";
    }
    return joined
      ? `${joined} の計画を用意しました。`
      : "計画を用意しました。";
  }

  function parseGuidePlanResponse(text, options = {}) {
    const jsonResult = parseJsonWithRepairs(text);
    if (!jsonResult.ok) {
      return jsonResult;
    }
    const parsed = jsonResult.parsed;
    const status = normalizeString(parsed.status).toLowerCase();
    const rawReply = normalizeString(parsed.reply);
    if (status === "conversation" || status === "needs_clarification") {
      if (!rawReply) {
        return {
          ok: false,
          error: "reply_required",
        };
      }
      return {
        ok: true,
        status,
        reply: rawReply,
        plan: null,
      };
    }
    if (status !== "plan_ready") {
      return {
        ok: false,
        error: "status_invalid",
      };
    }
    const plan = normalizeGuidePlan(parsed.plan, rawReply, options);
    if (!plan) {
      return {
        ok: false,
        error: "plan_invalid",
      };
    }
    return {
      ok: true,
      status,
      reply: rawReply || buildRecoveredPlanReadyReply(plan, options?.locale || "ja"),
      plan,
    };
  }

  function buildGuidePlanResponseFormat() {
    return {
      type: "json_schema",
      json_schema: {
        name: "guide_plan_response",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["status", "reply", "plan"],
          properties: {
            status: {
              type: "string",
              enum: ["conversation", "needs_clarification", "plan_ready"],
            },
            reply: {
              type: "string",
            },
            plan: {
              anyOf: [
                { type: "null" },
                {
                  type: "object",
                  additionalProperties: false,
                  required: ["goal", "completionDefinition", "constraints", "tasks"],
                  properties: {
                    goal: { type: "string" },
                    completionDefinition: { type: "string" },
                    constraints: {
                      type: "array",
                      items: { type: "string" },
                    },
                    tasks: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        required: [
                          "title",
                          "description",
                          "expectedOutput",
                          "requiredSkills",
                          "reviewFocus",
                          "assigneePalId",
                        ],
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                          expectedOutput: { type: "string" },
                          requiredSkills: {
                            type: "array",
                            items: { type: "string" },
                          },
                          reviewFocus: {
                            type: "array",
                            items: { type: "string" },
                          },
                          assigneePalId: { type: "string" },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    };
  }

  function buildGuidePlanOutputInstruction(localeValue = "ja") {
    if (localeValue === "en") {
      return [
        "Return compact JSON only. Do not use markdown fences.",
        'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
        "Use only the status values defined in the schema.",
        "Return all required fields. Do not add extra keys.",
      ].join("\n");
    }
    return [
      "JSONのみを返す。Markdown や code fence は使わない。",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "status は schema に定義された値だけを使う。",
      "必須フィールドをすべて返し、余分なキーを追加しない。",
    ].join("\n");
  }

  function buildGuidePlanFewShotExamples(localeValue = "ja") {
    const exampleOneJa = {
      status: "needs_clarification",
      reply: "まずありそうなのは次の3案です。1. 保存自体は通っているが reload 後の再読込で落ちている 2. Save 時の永続化そのものが失敗している 3. model 一覧の state 反映だけ保存対象から漏れている。まずは 2 が最も可能性が高いです。2 でよいですか？",
      plan: null,
    };
    const exampleTwoJa = {
      status: "plan_ready",
      reply: "2 を前提に進めます。Trace / Fix / Verify の3段に分けました。",
      plan: {
        goal: "Settings 保存後に reload しても model が残る状態に戻す",
        completionDefinition: "Save 後に reload しても登録した model が一覧に残り、Verify で再現不能を確認できる",
        constraints: ["既存設定フローは壊さない", "最小修正で進める"],
        tasks: [
          {
            title: "Trace",
            description: "Save と reload 周辺の状態遷移と永続化ポイントを追跡し、消失箇所を特定する",
            expectedOutput: "trace summary と再現手順",
            requiredSkills: ["browser-chrome", "codex-file-search", "codex-file-read"],
            reviewFocus: ["repro", "traceability"],
            assigneePalId: "",
          },
          {
            title: "Fix",
            description: "Trace で特定した箇所に最小修正を入れて model 一覧が再読込後も残るようにする",
            expectedOutput: "修正 diff と変更要約",
            requiredSkills: ["codex-file-read", "codex-file-edit"],
            reviewFocus: ["scope", "minimal_fix"],
            assigneePalId: "",
          },
          {
            title: "Verify",
            description: "Save から reload まで再実行し、model が残ることと副作用がないことを確認する",
            expectedOutput: "pass/fail evidence",
            requiredSkills: ["codex-test-runner", "codex-file-read"],
            reviewFocus: ["expected_outcome", "regression"],
            assigneePalId: "",
          },
        ],
      },
    };
    const exampleOneEn = {
      status: "needs_clarification",
      reply: "The three most likely options are: 1. Saving succeeds but reload fails to rehydrate the state 2. The save itself is not persisted 3. Only the model list state is skipped during persistence. I recommend 2 first. Shall we go with 2?",
      plan: null,
    };
    const exampleTwoEn = {
      status: "plan_ready",
      reply: "Proceeding with option 2. I split the work into Trace / Fix / Verify.",
      plan: {
        goal: "Keep the saved model visible after reload",
        completionDefinition: "After Save and reload, the registered model still appears and Verify confirms the issue no longer reproduces",
        constraints: ["Do not break the existing settings flow", "Prefer the smallest viable fix"],
        tasks: [
          {
            title: "Trace",
            description: "Trace the save and reload path to find where the model entry disappears",
            expectedOutput: "trace summary and reproduction notes",
            requiredSkills: ["browser-chrome", "codex-file-search", "codex-file-read"],
            reviewFocus: ["repro", "traceability"],
            assigneePalId: "",
          },
          {
            title: "Fix",
            description: "Apply the smallest fix that keeps the model list after reload",
            expectedOutput: "diff summary",
            requiredSkills: ["codex-file-read", "codex-file-edit"],
            reviewFocus: ["scope", "minimal_fix"],
            assigneePalId: "",
          },
          {
            title: "Verify",
            description: "Repeat Save and reload, then confirm the model remains and no regression appears",
            expectedOutput: "pass/fail evidence",
            requiredSkills: ["codex-test-runner", "codex-file-read"],
            reviewFocus: ["expected_outcome", "regression"],
            assigneePalId: "",
          },
        ],
      },
    };
    if (localeValue === "en") {
      return [
        "Few-shot examples for Guide behavior:",
        `Example 1 user: Settings save feels wrong. What should we check first?\nExample 1 assistant: ${JSON.stringify(exampleOneEn)}`,
        `Example 2 user: After Save and reload, the model disappears. Split it into Trace / Fix / Verify tasks.\nExample 2 assistant: ${JSON.stringify(exampleTwoEn)}`,
      ].join("\n\n");
    }
    return [
      "Guide の振る舞い例:",
      `例1 ユーザー: Settings の保存が変です。まずどこから見ればいい？\n例1 Guide: ${JSON.stringify(exampleOneJa)}`,
      `例2 ユーザー: Save 後に reload すると model が消えます。Trace / Fix / Verify の Task に分けて進めたいです。\n例2 Guide: ${JSON.stringify(exampleTwoJa)}`,
    ].join("\n\n");
  }

  const api = {
    parseGuidePlanResponse,
    buildGuidePlanOutputInstruction,
    buildGuidePlanResponseFormat,
    buildGuidePlanFewShotExamples,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.GuidePlan = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
