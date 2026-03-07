(function attachPalContextBuilder(scope) {
  const DEFAULT_CONTEXT_WINDOW = 8192;
  const DEFAULT_RESERVED_OUTPUT = 1024;
  const DEFAULT_SAFETY_MARGIN = 512;
  const DEFAULT_MAX_HISTORY_MESSAGES = 12;
  const DEFAULT_ROLE_PROMPTS = {
    ja: {
      guide: [
        "あなたは Guide です。",
        "- まず最新のユーザー発話が、仕事の依頼へ進もうとしているかどうかを判定する。",
        "- plan、task 分解、trace / fix / verify への分割、進め方の確定、調査依頼、修正依頼、確認依頼は work intent として扱う。",
        "- work intent であれば、要件を満たすために必要な情報を Guide から提案・質問して具体化する。可能であれば質問だけで止まらず、提案で進める。",
        "- 短いターンで曖昧な時は、これまでの会話からあり得そうな案件を具体化した 3 つの選択肢を、可能性の高い順に提示し、最も妥当な候補を 1 つ推薦する。",
        "- 提案はユーザーが短く選べる形にし、抽象語ではなく対象・問題・期待結果が分かる粒度で出す。",
        "- 3 案を出した後は、`1でよいですか？` のように、番号や短い yes/no で返答できる締めを使う。",
        "- work intent で、対象、問題、期待結果、再現手順、関連ファイル、使える tool のうち主要な材料が揃っていれば plan 作成を優先する。",
        "- task 作成を止める blocker が 1 つだけある時だけ追加確認する。軽微な不足情報は assumptions として constraints に残す。",
        "- debug workspace で明示的に breakdown を求められた時は、Trace / Fix / Verify の3段に整理することを優先する。",
        "- 候補 Pal や available tool が文脈にある時は、担当 Pal をユーザーへ聞き返さず自分で選ぶ。",
        "- どの Pal に何を担当させるかを決め、実行後にどの Gate で評価すべきかを意識して計画する。",
        "- 回答は簡潔で、次の行動が分かる形で示す。",
      ].join("\n"),
      gate: [
        "あなたは Gate です。",
        "- 提出物を要件、制約、RUBRIC に照らして評価する。",
        "- 判定は `decision`, `reason`, `fixes` が分かる形で返す。",
        "- approve の場合は根拠が十分であることを明示する。",
        "- reject の場合は修正条件を具体的な箇条書きで返す。",
        "- 評価者として振る舞い、雑談はしない。",
      ].join("\n"),
      worker: [
        "あなたは Worker Pal です。",
        "- 割り当てられた Task/Cron を順序立てて実行する。",
        "- 実行結果は確認できた事実と根拠を短く報告する。",
        "- できない場合は詰まった理由と不足情報を明示する。",
        "- 不要な雑談は避け、作業結果に集中する。",
      ].join("\n"),
    },
    en: {
      guide: [
        "You are Guide.",
        "- First decide whether the latest user turn is moving toward a work request.",
        "- Treat requests for a plan, task breakdown, trace / fix / verify split, execution flow, investigation, implementation, or verification as work intent.",
        "- When work intent exists, help the user complete the request by proposing and, if needed, asking for the missing information. Prefer proposal over a bare follow-up question.",
        "- For a short ambiguous turn, propose three concrete likely work options grounded in the conversation so far, ordered by likelihood, and recommend the most plausible one.",
        "- Make options easy to answer with a short choice, keep each option specific about target, problem, and expected outcome, and close with a short prompt such as `Shall we go with 1?`.",
        "- When the main inputs are already present in a work request (target, problem, expected outcome, repro steps, relevant files, or available tools), prefer creating the plan.",
        "- Ask a follow-up only when one blocking fact prevents task creation. Treat minor gaps as assumptions in constraints.",
        "- In the debug workspace, when the user explicitly wants a breakdown, prefer a three-step Trace / Fix / Verify plan.",
        "- If suitable Pals and tools are already available in context, choose the assignee yourself instead of asking the user to pick one.",
        "- Decide which Pal should do what and plan with the expected Gate evaluation in mind.",
        "- Keep the response concise and action-oriented.",
      ].join("\n"),
      gate: [
        "You are Gate.",
        "- Evaluate submissions against requirements, constraints, and the RUBRIC.",
        "- Return the result in a shape that makes `decision`, `reason`, and `fixes` clear.",
        "- For approve, state why the evidence is sufficient.",
        "- For reject, return concrete fix conditions as bullet points.",
        "- Respond as an evaluator, not as a general commentator.",
      ].join("\n"),
      worker: [
        "You are Worker Pal.",
        "- Execute the assigned task or cron job step by step.",
        "- Report concise evidence and confirmed outcomes.",
        "- If blocked, state the reason and what information is missing.",
        "- Stay focused on execution rather than general discussion.",
      ].join("\n"),
    },
  };

  function normalizeString(value) {
    return String(value || "").trim();
  }

  function normalizeLocale(value) {
    return normalizeString(value).toLowerCase() === "en" ? "en" : "ja";
  }

  function buildLanguagePrompt(locale) {
    if (normalizeLocale(locale) === "en") {
      return "Unless the user explicitly requests another language, answer in English.";
    }
    return "ユーザーが明示的に別言語を要求しない限り、必ず日本語で回答する。";
  }

  function appendPromptSection(sections, title, body) {
    const normalizedBody = normalizeString(body);
    if (!normalizedBody) return;
    sections.push(`[${title}]\n${normalizedBody}`);
  }

  function estimateTokens(text) {
    const normalized = normalizeString(text);
    if (!normalized) return 0;
    return Math.ceil(normalized.length / 4);
  }

  function normalizeRole(role) {
    const normalized = normalizeString(role).toLowerCase();
    if (normalized === "assistant" || normalized === "guide") return "assistant";
    if (normalized === "system") return "system";
    if (normalized === "you") return "user";
    return "user";
  }

  function normalizeMessageContent(message) {
    if (!message || typeof message !== "object") return "";
    if (typeof message.content === "string") return normalizeString(message.content);
    if (typeof message.text === "string") return normalizeString(message.text);
    if (message.text && typeof message.text === "object") {
      return normalizeString(message.text.ja || message.text.en || "");
    }
    return "";
  }

  function normalizeHistoryMessages(rawMessages) {
    if (!Array.isArray(rawMessages)) return [];
    return rawMessages
      .map((raw) => {
        const role = normalizeRole(raw.role || raw.sender);
        const content = normalizeMessageContent(raw);
        if (!content) return null;
        return { role, content };
      })
      .filter(Boolean);
  }

  function toAuditLabel(message, index) {
    return `${index}:${message.role}`;
  }

  function budgetFromInput(input) {
    const contextWindow = Number.isFinite(input?.contextWindow)
      ? Number(input.contextWindow)
      : DEFAULT_CONTEXT_WINDOW;
    const reservedOutput = Number.isFinite(input?.reservedOutput)
      ? Number(input.reservedOutput)
      : DEFAULT_RESERVED_OUTPUT;
    const safetyMargin = Number.isFinite(input?.safetyMargin)
      ? Number(input.safetyMargin)
      : DEFAULT_SAFETY_MARGIN;
    const budget = Math.max(256, contextWindow - reservedOutput - safetyMargin);
    return {
      contextWindow,
      reservedOutput,
      safetyMargin,
      budget,
    };
  }

  function tokenCount(messages) {
    return messages.reduce((sum, message) => sum + estimateTokens(message.content) + 6, 0);
  }

  function resolveRolePrompt(role, promptOverride, locale) {
    const explicit = normalizeString(promptOverride);
    if (explicit) return explicit;
    const normalizedRole = normalizeString(role).toLowerCase();
    const localeKey = normalizeLocale(locale);
    const rolePrompts = DEFAULT_ROLE_PROMPTS[localeKey] || DEFAULT_ROLE_PROMPTS.ja;
    if (normalizedRole === "gate") return rolePrompts.gate;
    if (normalizedRole === "worker") return rolePrompts.worker;
    return rolePrompts.guide;
  }

  function normalizeSkillSummaries(skillSummaries) {
    if (!Array.isArray(skillSummaries)) return [];
    return skillSummaries
      .map((skill) => normalizeString(skill))
      .filter(Boolean);
  }

  function buildCompositeSystemPrompt(input) {
    const sections = [];
    const languagePrompt = normalizeString(input?.languagePrompt) || buildLanguagePrompt(input?.locale);
    const operatingPrompt = resolveRolePrompt(input?.role, input?.safetyPrompt, input?.locale);
    appendPromptSection(sections, "LANGUAGE", languagePrompt);
    appendPromptSection(sections, "OPERATING_RULES", operatingPrompt);
    appendPromptSection(sections, "SOUL", input?.soulText);
    appendPromptSection(sections, "ROLE", input?.roleText);
    appendPromptSection(sections, "RUBRIC", input?.rubricText);
    return sections.join("\n\n");
  }

  function buildPalContext(input) {
    const latestUserText = normalizeString(input?.latestUserText);
    if (!latestUserText) {
      return {
        ok: false,
        messages: [],
        audit: {
          included: [],
          excluded: [],
          estimatedInputTokens: 0,
          budget: 0,
          compaction: ["missing-latest-user-text"],
        },
        errorCode: "MSG-PPH-1001",
      };
    }

    const role = normalizeString(input?.role).toLowerCase() || "guide";
    const runtimeKind = normalizeString(input?.runtimeKind).toLowerCase() || "model";
    const compositeSystemPrompt = buildCompositeSystemPrompt({
      ...input,
      role,
    });
    const memorySummary = normalizeString(input?.memorySummary);
    const skills = normalizeSkillSummaries(input?.skillSummaries);
    const maxHistoryMessages = Number.isFinite(input?.maxHistoryMessages)
      ? Math.max(0, Number(input.maxHistoryMessages))
      : DEFAULT_MAX_HISTORY_MESSAGES;
    const historyAll = normalizeHistoryMessages(input?.sessionMessages);
    const history = maxHistoryMessages > 0
      ? historyAll.slice(Math.max(0, historyAll.length - maxHistoryMessages))
      : [];

    const required = [{ role: "system", content: compositeSystemPrompt }];
    if (memorySummary) {
      required.push({
        role: "system",
        content: `Memory Summary:\n${memorySummary}`,
      });
    }
    if (runtimeKind === "model" && skills.length > 0) {
      required.push({
        role: "developer",
        content: `Enabled Skills:\n- ${skills.join("\n- ")}`,
      });
    }
    const latestUserMessage = { role: "user", content: latestUserText };
    const budgetInfo = budgetFromInput(input);

    const included = [];
    const excluded = [];
    const compaction = [];
    if (runtimeKind !== "model" && skills.length > 0) {
      compaction.push("skip-skill-context:tool-runtime");
    }

    const selectedHistory = [];
    let working = [...required, latestUserMessage];
    let totalTokens = tokenCount(working);

    // Keep the newest history messages that fit in the budget.
    for (let i = history.length - 1; i >= 0; i -= 1) {
      const candidate = history[i];
      const next = [...required, candidate, ...selectedHistory, latestUserMessage];
      const nextTokens = tokenCount(next);
      if (nextTokens <= budgetInfo.budget) {
        selectedHistory.unshift(candidate);
        totalTokens = nextTokens;
        included.push(toAuditLabel(candidate, i));
      } else {
        excluded.push(toAuditLabel(candidate, i));
        compaction.push(`drop-history:${i}`);
      }
    }

    working = [...required, ...selectedHistory, latestUserMessage];
    totalTokens = tokenCount(working);

    if (totalTokens > budgetInfo.budget) {
      // Last resort: truncate user text while preserving a non-empty request.
      const allowedChars = Math.max(64, Math.floor((budgetInfo.budget * 4) / 2));
      const truncated = latestUserText.slice(0, allowedChars);
      working[working.length - 1] = {
        role: "user",
        content: truncated,
      };
      totalTokens = tokenCount(working);
      compaction.push("truncate-latest-user");
    }

    return {
      ok: true,
      messages: working,
      audit: {
        included,
        excluded,
        estimatedInputTokens: totalTokens,
        budget: budgetInfo.budget,
        compaction,
      },
    };
  }

  function buildGuideContext(input) {
    return buildPalContext({
      ...input,
      role: "guide",
      runtimeKind: "model",
    });
  }

  const api = {
    buildPalContext,
    buildGuideContext,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.PalContextBuilder = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);


