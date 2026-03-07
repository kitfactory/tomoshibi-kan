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

  function buildWorkerSearchText(worker) {
    return [
      normalizeString(worker?.displayName),
      normalizeString(worker?.persona),
      normalizeString(worker?.roleText),
      ...(Array.isArray(worker?.enabledSkillIds) ? worker.enabledSkillIds : []),
      ...(Array.isArray(worker?.skillSummaries) ? worker.skillSummaries : []),
    ].join("\n").toLowerCase();
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
    const taskTokens = tokenizeForMatching(`${normalizeString(taskDraft?.title)}\n${normalizeString(taskDraft?.description)}`);
    const roleText = normalizeString(worker?.roleText).toLowerCase();
    const enabledSkillIds = Array.isArray(worker?.enabledSkillIds)
      ? worker.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [];
    const matchedSkills = requiredSkills.filter((skillId) => enabledSkillIds.includes(normalizeSkillId(skillId)));
    const matchedRoleTerms = taskTokens.filter((token) => roleText.includes(token.toLowerCase()));
    const matchedSkillTerms = taskTokens.filter((token) => haystack.includes(token.toLowerCase()));
    const score = (matchedSkills.length * 100) + (matchedRoleTerms.length * 10) + matchedSkillTerms.length;
    return {
      score,
      matchedSkills: uniqueList(matchedSkills),
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
