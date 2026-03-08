(function attachAgentRouting(scope) {
  function normalizeString(value) {
    return String(value || "").trim();
  }

  function normalizeSkillId(value) {
    return normalizeString(value).toLowerCase();
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

  function tokenizeForMatching(text) {
    const source = normalizeString(text);
    if (!source) return [];
    const asciiTokens = source.match(/[a-z0-9_+-]{2,}/gi) || [];
    const jpChunks = source.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]{2,}/gu) || [];
    return uniqueList([
      ...asciiTokens.map((token) => token.toLowerCase()),
      ...jpChunks,
    ]);
  }

  function extractLexicalHints(text) {
    const source = normalizeString(text);
    if (!source) return [];
    const japaneseTerms = source
      .split(/[、。・/\s()（）「」『』,:：]+/u)
      .flatMap((chunk) => chunk.split(/(?:を|に|で|と|や|へ|から|まで|より|したい|して|する|なる|した|です|ます|たい|よう|こと|もの|ため|及び|やすい|づらい)/u))
      .map((chunk) => normalizeString(chunk))
      .filter((chunk) => chunk.length >= 2);
    return uniqueList([
      ...tokenizeForMatching(source),
      ...japaneseTerms,
    ]);
  }

  function buildWorkerSearchText(worker) {
    return [
      normalizeString(worker?.displayName),
      normalizeString(worker?.persona),
      normalizeString(worker?.roleText),
      ...(Array.isArray(worker?.enabledSkillIds) ? worker.enabledSkillIds : []),
      ...(Array.isArray(worker?.skillSummaries) ? worker.skillSummaries : []),
    ].join("\n").toLowerCase();
  }

  function splitSummaryLines(value) {
    return uniqueList(
      normalizeString(value)
        .split(/\r?\n+/)
        .map((line) => line.replace(/^[-*]\s*/, "").trim())
        .filter(Boolean)
    );
  }

  function extractMarkdownSectionLines(markdown, headings = []) {
    const source = normalizeString(markdown);
    if (!source) return [];
    const lines = source.split(/\r?\n/);
    const normalizedHeadings = uniqueList(headings).map((item) => normalizeString(item).toLowerCase()).filter(Boolean);
    if (normalizedHeadings.length === 0) return [];
    const collected = [];
    let inSection = false;
    lines.forEach((line) => {
      const trimmed = normalizeString(line);
      const lower = trimmed.toLowerCase();
      if (/^##\s+/.test(trimmed)) {
        const heading = trimmed.replace(/^##\s+/, "").trim().toLowerCase();
        inSection = normalizedHeadings.includes(heading);
        return;
      }
      if (!inSection) return;
      if (/^#/.test(trimmed)) {
        inSection = false;
        return;
      }
      const bullet = trimmed.replace(/^[-*]\s*/, "").trim();
      if (bullet) collected.push(bullet);
    });
    return uniqueList(collected);
  }

  function buildResidentRoleSignals(worker) {
    const roleText = normalizeString(worker?.roleText);
    const residentFocus = uniqueList([
      ...extractMarkdownSectionLines(roleText, ["得意な依頼", "Preferred Requests", "Primary Responsibilities"]),
    ]);
    const preferredOutputs = uniqueList([
      ...extractMarkdownSectionLines(roleText, ["得意な作成物", "Preferred Outputs", "Outputs"]),
    ]);
    return {
      residentFocus,
      preferredOutputs,
    };
  }

  function buildCandidateResidentSummaries(workers = [], assignmentCounts = new Map(), requiredSkills = [], taskDraft = null) {
    return (Array.isArray(workers) ? workers : []).map((worker) => {
      const score = scoreWorkerCandidate(taskDraft || {}, worker, requiredSkills);
      const roleSignals = buildResidentRoleSignals(worker);
      return {
        residentId: normalizeString(worker?.id),
        role: "worker",
        displayName: normalizeString(worker?.displayName || worker?.id),
        status: normalizeString(worker?.status) || "available",
        currentLoad: Number(assignmentCounts.get(worker?.id) || 0),
        roleContractText: normalizeString(worker?.roleText),
        roleSummary: splitSummaryLines(worker?.roleText),
        residentFocus: roleSignals.residentFocus,
        preferredOutputs: roleSignals.preferredOutputs,
        capabilitySummary: uniqueList(worker?.skillSummaries),
        fitHints: uniqueList([
          ...score.matchedSkills.map((item) => `skill:${item}`),
          ...score.matchedResidentFocus.map((item) => `focus:${item}`),
          ...score.matchedPreferredOutputs.map((item) => `output:${item}`),
          ...score.matchedRoleTerms.map((item) => `role:${item}`),
        ]),
      };
    }).filter((entry) => entry.residentId);
  }

  function buildWorkerRoutingInput(input = {}) {
    const taskDraft = input?.taskDraft || {};
    const requiredSkills = uniqueList(
      Array.isArray(input?.requiredSkills) && input.requiredSkills.length > 0
        ? input.requiredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
        : inferRequiredSkills(taskDraft, input?.workers)
    );
    return {
      targetType: normalizeString(input?.targetType || "task") || "task",
      targetId: normalizeString(input?.targetId),
      planId: normalizeString(input?.planId),
      goal: normalizeString(input?.goal || taskDraft?.title || taskDraft?.description),
      title: normalizeString(taskDraft?.title),
      instruction: normalizeString(taskDraft?.description),
      constraints: uniqueList(input?.constraints),
      expectedOutput: normalizeString(input?.expectedOutput || taskDraft?.expectedOutput),
      requiredSkills,
      needsEvidence: Boolean(input?.needsEvidence),
      scopeRisk: ["low", "medium", "high"].includes(normalizeString(input?.scopeRisk)) ? normalizeString(input.scopeRisk) : "medium",
      candidateResidents: buildCandidateResidentSummaries(
        input?.workers,
        input?.assignmentCounts instanceof Map ? input.assignmentCounts : new Map(),
        requiredSkills,
        taskDraft
      ),
      historySummary: uniqueList(input?.historySummary),
    };
  }

  function stripCodeFence(text) {
    const source = normalizeString(text);
    if (!source) return "";
    return source.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
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
    return uniqueList(candidates);
  }

  function repairJsonText(text) {
    const source = normalizeString(text);
    if (!source) return [];
    return uniqueList([
      source.replace(/,\s*([}\]])/g, "$1"),
    ]);
  }

  function parseJsonWithRepairs(text) {
    const baseCandidates = buildJsonCandidates(text);
    const allCandidates = [];
    baseCandidates.forEach((candidate) => {
      allCandidates.push(candidate);
      repairJsonText(candidate).forEach((item) => allCandidates.push(item));
    });
    for (const candidate of uniqueList(allCandidates)) {
      try {
        return {
          ok: true,
          parsed: JSON.parse(candidate),
        };
      } catch (_error) {
        // continue
      }
    }
    return {
      ok: false,
      error: baseCandidates.length > 0 ? "json_parse_failed" : "json_not_found",
    };
  }

  function normalizeRoutingDecision(parsed, options = {}) {
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: "routing_decision_invalid" };
    }
    const selectedResidentId = normalizeString(parsed.selectedResidentId);
    const reason = normalizeString(parsed.reason);
    const confidence = normalizeString(parsed.confidence).toLowerCase();
    const fallbackAction = normalizeString(parsed.fallbackAction).toLowerCase();
    const allowedIds = new Set((Array.isArray(options?.allowedResidentIds) ? options.allowedResidentIds : []).map((item) => normalizeString(item)).filter(Boolean));
    if (!selectedResidentId) {
      return { ok: false, error: "selected_resident_required" };
    }
    if (allowedIds.size > 0 && !allowedIds.has(selectedResidentId)) {
      return { ok: false, error: "selected_resident_out_of_candidates" };
    }
    if (!reason) {
      return { ok: false, error: "reason_required" };
    }
    if (!["low", "medium", "high"].includes(confidence)) {
      return { ok: false, error: "confidence_invalid" };
    }
    if (!["dispatch", "reroute", "replan_required"].includes(fallbackAction)) {
      return { ok: false, error: "fallback_action_invalid" };
    }
    return {
      ok: true,
      decision: {
        selectedResidentId,
        reason,
        confidence,
        fallbackAction,
      },
    };
  }

  function parseRoutingDecisionResponse(text, options = {}) {
    const jsonResult = parseJsonWithRepairs(text);
    if (!jsonResult.ok) return jsonResult;
    return normalizeRoutingDecision(jsonResult.parsed, options);
  }

  function buildRoutingDecisionResponseFormat() {
    return {
      type: "json_schema",
      json_schema: {
        name: "routing_decision",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["selectedResidentId", "reason", "confidence", "fallbackAction"],
          properties: {
            selectedResidentId: { type: "string" },
            reason: { type: "string" },
            confidence: { type: "string", enum: ["low", "medium", "high"] },
            fallbackAction: { type: "string", enum: ["dispatch", "reroute", "replan_required"] },
          },
        },
      },
    };
  }

  function inferRequiredSkills(taskDraft, workers) {
    const taskText = `${normalizeString(taskDraft?.title)}\n${normalizeString(taskDraft?.description)}`.toLowerCase();
    if (!taskText) return [];
    const matched = [];
    (Array.isArray(workers) ? workers : []).forEach((worker) => {
      const skillIds = Array.isArray(worker?.enabledSkillIds) ? worker.enabledSkillIds : [];
      const skillSummaries = Array.isArray(worker?.skillSummaries) ? worker.skillSummaries : [];
      skillIds.forEach((skillId, index) => {
        const normalizedId = normalizeSkillId(skillId);
        if (!normalizedId) return;
        const summary = normalizeString(skillSummaries[index] || "");
        const summaryTokens = tokenizeForMatching(summary);
        const idTerms = normalizedId.split(/[-_.]/).filter((term) => term.length >= 2);
        const candidates = uniqueList([normalizedId, ...idTerms, ...summaryTokens]);
        if (candidates.some((term) => taskText.includes(term.toLowerCase()))) {
          matched.push(normalizedId);
        }
      });
    });
    return uniqueList(matched.map((item) => item.toLowerCase()));
  }

  function scoreWorkerCandidate(taskDraft, worker, requiredSkills = []) {
    const haystack = buildWorkerSearchText(worker);
    const taskTokens = extractLexicalHints(`${normalizeString(taskDraft?.title)}\n${normalizeString(taskDraft?.description)}`);
    const roleText = normalizeString(worker?.roleText).toLowerCase();
    const roleSignals = buildResidentRoleSignals(worker);
    const residentFocusTokens = extractLexicalHints(roleSignals.residentFocus.join("\n"));
    const preferredOutputsTokens = extractLexicalHints(roleSignals.preferredOutputs.join("\n"));
    const roleTokens = extractLexicalHints(roleText);
    const enabledSkillIds = Array.isArray(worker?.enabledSkillIds)
      ? worker.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [];
    const matchedSkills = requiredSkills.filter((skillId) => enabledSkillIds.includes(normalizeSkillId(skillId)));
    const matchedResidentFocus = taskTokens.filter((token) => residentFocusTokens.includes(token));
    const matchedPreferredOutputs = taskTokens.filter((token) => preferredOutputsTokens.includes(token));
    const matchedRoleTerms = taskTokens.filter((token) => roleTokens.includes(token));
    const matchedSkillTerms = taskTokens.filter((token) => haystack.includes(token.toLowerCase()));
    const score = (matchedSkills.length * 100) + (matchedResidentFocus.length * 25) + (matchedPreferredOutputs.length * 20) + (matchedRoleTerms.length * 10) + matchedSkillTerms.length;
    return {
      score,
      matchedSkills: uniqueList(matchedSkills),
      matchedResidentFocus: uniqueList(matchedResidentFocus),
      matchedPreferredOutputs: uniqueList(matchedPreferredOutputs),
      matchedRoleTerms: uniqueList(matchedRoleTerms),
    };
  }

  function selectWorkerForTask(input = {}) {
    const taskDraft = input?.taskDraft || {};
    const workers = Array.isArray(input?.workers) ? input.workers : [];
    if (workers.length === 0) {
      return {
        workerId: "",
        score: 0,
        matchedSkills: [],
        matchedRoleTerms: [],
      };
    }
    const requiredSkills = uniqueList(
      (Array.isArray(input?.requiredSkills) && input.requiredSkills.length > 0)
        ? input.requiredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
        : inferRequiredSkills(taskDraft, workers)
    );
    const assignmentCounts = input?.assignmentCounts instanceof Map ? input.assignmentCounts : new Map();
    let bestWorker = workers[0];
    let bestScore = scoreWorkerCandidate(taskDraft, bestWorker, requiredSkills);
    workers.slice(1).forEach((worker) => {
      const nextScore = scoreWorkerCandidate(taskDraft, worker, requiredSkills);
      if (nextScore.score > bestScore.score) {
        bestWorker = worker;
        bestScore = nextScore;
        return;
      }
      if (nextScore.score === bestScore.score) {
        const bestCount = assignmentCounts.get(bestWorker.id) || 0;
        const nextCount = assignmentCounts.get(worker.id) || 0;
        if (nextCount < bestCount) {
          bestWorker = worker;
          bestScore = nextScore;
        }
      }
    });
    return {
      workerId: normalizeString(bestWorker?.id),
      score: bestScore.score,
      matchedSkills: bestScore.matchedSkills,
      matchedResidentFocus: bestScore.matchedResidentFocus,
      matchedPreferredOutputs: bestScore.matchedPreferredOutputs,
      matchedRoleTerms: bestScore.matchedRoleTerms,
      requiredSkills,
    };
  }

  function assignTasksToWorkers(input = {}) {
    const taskDrafts = Array.isArray(input?.taskDrafts) ? input.taskDrafts : [];
    const workers = Array.isArray(input?.workers) ? input.workers : [];
    if (taskDrafts.length === 0 || workers.length === 0) return [];
    const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
    return taskDrafts.map((taskDraft) => {
      const selected = selectWorkerForTask({
        taskDraft,
        workers,
        assignmentCounts,
      });
      const workerId = normalizeString(selected.workerId) || normalizeString(workers[0]?.id);
      assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
        return {
          taskDraft,
          workerId,
          score: selected.score,
          requiredSkills: selected.requiredSkills,
          explanation: {
            matchedSkills: selected.matchedSkills,
            matchedResidentFocus: selected.matchedResidentFocus,
            matchedPreferredOutputs: selected.matchedPreferredOutputs,
            matchedRoleTerms: selected.matchedRoleTerms,
          },
        };
    });
  }

  function buildGateSearchText(gate) {
    return [
      normalizeString(gate?.displayName),
      normalizeString(gate?.persona),
      normalizeString(gate?.soulText),
      normalizeString(gate?.rubricText),
    ].join("\n").toLowerCase();
  }

  function inferReviewFocus(target) {
    const fixes = Array.isArray(target?.fixes) ? target.fixes : [];
    return tokenizeForMatching([
      normalizeString(target?.title),
      normalizeString(target?.instruction),
      normalizeString(target?.expectedOutput),
      normalizeString(target?.submission),
      normalizeString(target?.evidence),
      normalizeString(target?.replay),
      ...fixes.map((item) => normalizeString(item)),
    ].join("\n"));
  }

  function scoreGateCandidate(target, gate, reviewFocus = []) {
    const rubricText = normalizeString(gate?.rubricText).toLowerCase();
    const matchedRubricTerms = reviewFocus.filter((token) => rubricText.includes(token.toLowerCase()));
    const searchText = buildGateSearchText(gate);
    const matchedGeneralTerms = reviewFocus.filter((token) => searchText.includes(token.toLowerCase()));
    const score = (matchedRubricTerms.length * 100) + matchedGeneralTerms.length;
    return {
      score,
      matchedRubricTerms: uniqueList(matchedRubricTerms),
      matchedReviewFocusTerms: uniqueList(matchedGeneralTerms),
    };
  }

  function selectGateForTarget(input = {}) {
    const target = input?.target || {};
    const gates = Array.isArray(input?.gates) ? input.gates : [];
    const defaultGateId = normalizeString(input?.defaultGateId);
    if (gates.length === 0) {
      return {
        gateId: "",
        score: 0,
        matchedRubricTerms: [],
        matchedReviewFocusTerms: [],
      };
    }
    const reviewFocus = uniqueList(
      (Array.isArray(input?.reviewFocus) && input.reviewFocus.length > 0)
        ? input.reviewFocus
        : inferReviewFocus(target)
    );
    let bestGate = gates[0];
    let bestScore = scoreGateCandidate(target, bestGate, reviewFocus);
    gates.slice(1).forEach((gate) => {
      const nextScore = scoreGateCandidate(target, gate, reviewFocus);
      if (nextScore.score > bestScore.score) {
        bestGate = gate;
        bestScore = nextScore;
        return;
      }
      if (nextScore.score === bestScore.score && normalizeString(gate?.id) === defaultGateId) {
        bestGate = gate;
        bestScore = nextScore;
      }
    });
    return {
      gateId: normalizeString(bestGate?.id),
      score: bestScore.score,
      matchedRubricTerms: bestScore.matchedRubricTerms,
      matchedReviewFocusTerms: bestScore.matchedReviewFocusTerms,
      reviewFocus,
    };
  }

  const api = {
    inferRequiredSkills,
    buildResidentRoleSignals,
    buildCandidateResidentSummaries,
    buildWorkerRoutingInput,
    parseRoutingDecisionResponse,
    buildRoutingDecisionResponseFormat,
    scoreWorkerCandidate,
    selectWorkerForTask,
    assignTasksToWorkers,
    inferReviewFocus,
    scoreGateCandidate,
    selectGateForTarget,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.AgentRouting = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
