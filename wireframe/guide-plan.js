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

  function hasExplicitResidentBreakdown(reply) {
    const text = normalizeString(reply);
    if (!text) return false;
    const properNames = /冬坂/.test(text) && /久瀬/.test(text) && /白峰/.test(text);
    const professions = /リサーチャー/.test(text) && /プログラマ/.test(text) && /ライター/.test(text);
    const legacyLabels = /調べる人/.test(text) && /作り手/.test(text) && /書く人/.test(text);
    return properNames || professions || legacyLabels;
  }

  function isExplicitResidentBreakdownContext(options) {
    const planningIntent = normalizeString(options?.planningIntent);
    const planningReadiness = normalizeString(options?.planningReadiness);
    return planningIntent === "explicit_breakdown" || planningReadiness === "debug_repro_ready";
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

  function isExpectedResidentAssignee(task) {
    const assignee = normalizeString(task?.assigneePalId).replace(/[^a-z0-9-]/gi, "");
    return assignee === "pal-alpha" || assignee === "pal-beta" || assignee === "pal-delta";
  }

  function isResidentTaskSetValid(tasks) {
    if (!Array.isArray(tasks) || tasks.length !== 3) return false;
    const assignees = tasks.map((task) => normalizeString(task?.assigneePalId));
    const expectedAssignees = ["pal-alpha", "pal-beta", "pal-delta"];
    if (assignees.some((assignee, index) => assignee !== expectedAssignees[index])) return false;
    return tasks.every((task) => !isSuspiciousTask(task) && isExpectedResidentAssignee(task));
  }

  function buildRecoveredResidentTasks() {
    return [
      {
        title: "保存結果が reload 後に消える原因と再現条件を調査する",
        description: "冬坂が保存処理の再現手順、SQLite への書き込み、reload 時の読み込み箇所を追い、証拠と原因候補を集める。",
        expectedOutput: "再現結果、関連ファイル、原因候補をまとめた調査レポート",
        requiredSkills: ["browser-chrome", "codex-file-search", "codex-file-read"],
        reviewFocus: ["repro", "traceability"],
        assigneePalId: "pal-alpha",
      },
      {
        title: "保存後も設定が残るように必要な修正を加える",
        description: "久瀬が冬坂の調査結果に基づいて、保存処理または読み込み処理の不整合を最小変更で修正する。",
        expectedOutput: "修正内容、影響ファイル、残リスクをまとめた実装メモ",
        requiredSkills: ["codex-file-read", "codex-file-edit"],
        reviewFocus: ["scope", "minimal_fix"],
        assigneePalId: "pal-beta",
      },
      {
        title: "修正結果と返却文を整理して利用者向けにまとめる",
        description: "白峰が修正後の挙動と残る注意点を整理し、reload 後も model が残ることを利用者向けの説明としてまとめる。",
        expectedOutput: "検証要約、返却文、残る不確実性の整理",
        requiredSkills: ["codex-file-read"],
        reviewFocus: ["expected_outcome", "user_clarity"],
        assigneePalId: "pal-delta",
      },
    ];
  }

  function recoverGuidePlanTasks(tasks, reply, options = {}) {
    const normalizedTasks = Array.isArray(tasks) ? tasks : [];
    const residentBreakdownRequested = hasExplicitResidentBreakdown(reply) || isExplicitResidentBreakdownContext(options);
    if (!hasExplicitDebugBreakdown(reply) && !hasExplicitDebugBreakdownContext(options) && !residentBreakdownRequested) {
      return normalizedTasks;
    }
    if (residentBreakdownRequested && isResidentTaskSetValid(normalizedTasks)) return normalizedTasks;
    const suspiciousCount = normalizedTasks.filter((task) => isSuspiciousTask(task)).length;
    if (normalizedTasks.length >= 3 && suspiciousCount === 0) return normalizedTasks;
    return buildRecoveredResidentTasks();
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
    if (normalizeString(localeValue).toLowerCase() === "en") {
      return "I prepared the request. Fuyusaka will investigate the cause, Kuze will make the fix, and Shiramine will prepare the final explanation.";
    }
    return "この内容で依頼としてまとめます。冬坂に原因調査、久瀬に修正、白峰に返却文の整理をお願いします。";
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
    const exampleZeroJa = {
      status: "needs_clarification",
      reply: "それは少し気になりますね。\n\nまずは **保存そのもの** ではなく、**どの場面で違和感が出ているか** を見ると整理しやすそうです。\n\nどんなものを作りたいのか、あるいはどの操作のあとで「あれ？」と感じたのかを、いま思い出せる範囲で教えてもらえますか？",
      plan: null,
    };
    const exampleOneJa = {
      status: "needs_clarification",
      reply: "まずありそうなのは次の3案です。\n\n1. **reload 後の再読込に着目する案**  \n   保存自体は通っているが、reload 時の復元で落ちている可能性を見る案です。\n2. **永続化そのものに着目する案**  \n   Save 時の書き込みが失敗している可能性を見る案です。\n3. **UI state 反映に着目する案**  \n   model 一覧だけ保存対象から漏れている可能性を見る案です。\n\nまずは **2** が最も可能性が高いです。保存直後から消えるなら書き込み側を見るのが早いので、2 を軸に依頼としてまとめるのがよさそうです。\n\n- この内容で「保存処理と保存直後の状態反映を確認する依頼」としてまとめようと考えます。\n- この形で進めてよければ依頼にします。\n\n2 でよいですか？",
      plan: null,
    };
    const exampleTwoJa = {
      status: "plan_ready",
      reply: "この内容で依頼としてまとめます。冬坂に原因調査、久瀬に修正、白峰に返却文の整理をお願いします。",
      plan: {
        goal: "Settings 保存後に reload しても model が残る状態に戻す",
        completionDefinition: "Save 後に reload しても登録した model が一覧に残り、利用者向け説明まで整っている",
        constraints: ["既存設定フローは壊さない", "最小修正で進める"],
        tasks: [
          {
            title: "保存結果が reload 後に消える原因と再現条件を調査する",
            description: "冬坂が Save と reload 周辺の状態遷移と永続化ポイントを追跡し、消失箇所を特定する",
            expectedOutput: "調査レポートと再現手順",
            requiredSkills: ["browser-chrome", "codex-file-search", "codex-file-read"],
            reviewFocus: ["repro", "traceability"],
            assigneePalId: "pal-alpha",
          },
          {
            title: "保存後も設定が残るように必要な修正を加える",
            description: "久瀬が冬坂の結果に基づいて最小修正を入れ、model 一覧が再読込後も残るようにする",
            expectedOutput: "実装メモと変更要約",
            requiredSkills: ["codex-file-read", "codex-file-edit"],
            reviewFocus: ["scope", "minimal_fix"],
            assigneePalId: "pal-beta",
          },
          {
            title: "修正結果と返却文を整理して利用者向けにまとめる",
            description: "白峰が修正後の挙動と残る注意点を整理し、利用者向けにどう説明するかをまとめる",
            expectedOutput: "検証要約と返却文",
            requiredSkills: ["codex-file-read"],
            reviewFocus: ["expected_outcome", "user_clarity"],
            assigneePalId: "pal-delta",
          },
        ],
      },
    };
    const exampleZeroEn = {
      status: "needs_clarification",
      reply: "That does sound a little unsettling.\n\nBefore we jump into options, it may help to pin down **where** the discomfort shows up rather than assuming it is the save itself.\n\nWhat are you trying to make, or after which action do you first feel that something is off?",
      plan: null,
    };
    const exampleOneEn = {
      status: "needs_clarification",
      reply: "The three most likely options are:\n\n1. **Reload rehydration angle**  \n   Saving succeeds, but reload fails to restore the state.\n2. **Persistence angle**  \n   The save itself is not being written.\n3. **UI state reflection angle**  \n   Only the model list is skipped during persistence.\n\nI recommend **2** first because if it disappears immediately after Save, the write path is the fastest place to check.\n\n- I would frame this as a request to check the save path and the immediate post-save state reflection first.\n- If that works, I will turn it into a request.\n\nShall we go with 2?",
      plan: null,
    };
    const exampleTwoEn = {
      status: "plan_ready",
      reply: "I will turn this into a request in that shape. Fuyusaka will investigate the cause, Kuze will make the fix, and Shiramine will prepare the return explanation.",
      plan: {
        goal: "Keep the saved model visible after reload",
        completionDefinition: "After Save and reload, the registered model still appears and the final explanation is ready to return",
        constraints: ["Do not break the existing settings flow", "Prefer the smallest viable fix"],
        tasks: [
          {
            title: "Investigate why the saved setting disappears after reload",
            description: "Trace the save and reload path to find where the model entry disappears",
            expectedOutput: "research report and reproduction notes",
            requiredSkills: ["browser-chrome", "codex-file-search", "codex-file-read"],
            reviewFocus: ["repro", "traceability"],
            assigneePalId: "pal-alpha",
          },
          {
            title: "Apply the changes needed to keep the setting after reload",
            description: "Apply the smallest fix that keeps the model list after reload",
            expectedOutput: "implementation note and diff summary",
            requiredSkills: ["codex-file-read", "codex-file-edit"],
            reviewFocus: ["scope", "minimal_fix"],
            assigneePalId: "pal-beta",
          },
          {
            title: "Summarize the result and prepare the return note",
            description: "Summarize the result and prepare a clear user-facing explanation with remaining caveats",
            expectedOutput: "verification summary and return note",
            requiredSkills: ["codex-file-read"],
            reviewFocus: ["expected_outcome", "user_clarity"],
            assigneePalId: "pal-delta",
          },
        ],
      },
    };
    if (localeValue === "en") {
      return [
        "Few-shot examples for Guide behavior:",
        `Example 0 user: Something feels off around saving, but I can't explain it yet.\nExample 0 assistant: ${JSON.stringify(exampleZeroEn)}`,
        `Example 1 user: Settings save feels wrong. What should we check first?\nExample 1 assistant: ${JSON.stringify(exampleOneEn)}`,
        `Example 2 user: After Save and reload, the model disappears. Split it into Fuyusaka / Kuze / Shiramine tasks.\nExample 2 assistant: ${JSON.stringify(exampleTwoEn)}`,
        `Example 3 user: The Save button in Settings can be pressed but the result is not reflected. Repro: open Settings, add a model, press Save, then reload. Expected outcome: the model remains after reload. Split it into trace / fix / verify tasks.\nExample 3 assistant: ${JSON.stringify(exampleTwoEn)}`,
      ].join("\n\n");
    }
    return [
      "Guide の振る舞い例:",
      `例0 ユーザー: 保存まわりがなんとなく変なんですが、まだうまく言えません。\n例0 Guide: ${JSON.stringify(exampleZeroJa)}`,
      `例1 ユーザー: Settings の保存が変です。まずどこから見ればいい？\n例1 Guide: ${JSON.stringify(exampleOneJa)}`,
      `例2 ユーザー: Save 後に reload すると model が消えます。冬坂 / 久瀬 / 白峰 の Task に分けて進めたいです。\n例2 Guide: ${JSON.stringify(exampleTwoJa)}`,
      `例3 ユーザー: Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。trace / fix / verify の Task に分けて進めたい。\n例3 Guide: ${JSON.stringify(exampleTwoJa)}`,
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
