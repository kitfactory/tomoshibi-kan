(function attachGuideTaskPlanner(scope) {
  function resolveAgentRoutingApi() {
    if (typeof module !== "undefined" && module.exports) {
      try {
        return require("./agent-routing.js");
      } catch (error) {
        return null;
      }
    }
    return scope && scope.AgentRouting ? scope.AgentRouting : null;
  }

  function normalizeString(value) {
    return String(value || "").trim();
  }

  function isLikelyJapanese(text) {
    return /[ぁ-んァ-ヴ一-龠]/.test(String(text || ""));
  }

  function normalizeTaskTitle(title, fallbackTitle) {
    const normalized = normalizeString(title);
    if (!normalized) return normalizeString(fallbackTitle) || "Task";
    return normalized.length > 42 ? `${normalized.slice(0, 42)}...` : normalized;
  }

  function splitRequestSegments(userText) {
    const source = normalizeString(userText);
    if (!source) return [];
    const lines = source
      .split(/\r?\n/)
      .map((line) => normalizeString(line.replace(/^[-*0-9.)\s]+/, "")))
      .filter(Boolean);
    if (lines.length >= 2) return lines;

    const sentences = source
      .split(/[。．.!?！？]+/)
      .map((line) => normalizeString(line))
      .filter(Boolean);
    if (sentences.length >= 2) return sentences;
    return [source];
  }

  function buildDefaultDrafts(userText) {
    const source = normalizeString(userText);
    const japanese = isLikelyJapanese(source);
    const clipped = source.length > 36 ? `${source.slice(0, 36)}...` : source;
    if (japanese) {
      return [
        {
          title: normalizeTaskTitle(`要件整理: ${clipped}`, "要件整理"),
          description: `${source} の要件と前提条件を整理する`,
        },
        {
          title: normalizeTaskTitle(`実装: ${clipped}`, "実装"),
          description: `${source} を実現するための作業を実装する`,
        },
        {
          title: normalizeTaskTitle(`検証: ${clipped}`, "検証"),
          description: `${source} の結果を確認し、必要なら修正する`,
        },
      ];
    }
    return [
      {
        title: normalizeTaskTitle(`Requirements: ${clipped}`, "Requirements"),
        description: `Clarify requirements and constraints for: ${source}`,
      },
      {
        title: normalizeTaskTitle(`Implementation: ${clipped}`, "Implementation"),
        description: `Implement the required changes for: ${source}`,
      },
      {
        title: normalizeTaskTitle(`Validation: ${clipped}`, "Validation"),
        description: `Verify outputs and adjust if needed for: ${source}`,
      },
    ];
  }

  function buildTaskDraftsFromRequest(input = {}) {
    const userText = normalizeString(input.userText);
    if (!userText) return [];
    const maxTasks = Number.isFinite(input.maxTasks) ? Math.max(1, Number(input.maxTasks)) : 3;
    const segments = splitRequestSegments(userText);
    if (segments.length <= 1) {
      return buildDefaultDrafts(userText).slice(0, maxTasks);
    }
    const drafts = segments
      .slice(0, maxTasks)
      .map((segment, index) => ({
        title: normalizeTaskTitle(segment, `Task ${index + 1}`),
        description: segment,
      }));
    if (drafts.length < Math.min(3, maxTasks)) {
      const defaults = buildDefaultDrafts(userText);
      while (drafts.length < Math.min(3, maxTasks)) {
        drafts.push(defaults[drafts.length]);
      }
    }
    return drafts.slice(0, maxTasks);
  }

  function tokenizeForMatching(text) {
  const source = String(text || "");
  const english = source.match(/[a-z0-9_+-]{2,}/gi) || [];
  const japaneseChunks = source.match(/[ぁ-んァ-ヴー一-龠]{2,}/g) || [];
  const japanese = japaneseChunks
    .flatMap((chunk) => chunk.split(/[のをにでとがはへやも・、。]/))
    .map((token) => normalizeString(token))
    .filter((token) => token.length >= 2);
  const tokens = [...english.map((token) => token.toLowerCase()), ...japanese];
  const seen = new Set();
  return tokens.filter((token) => {
    if (!token || seen.has(token)) return false;
    seen.add(token);
    return true;
    });
  }

  function workerSearchText(worker) {
    const roleText = normalizeString(worker?.roleText);
    const skillSummaries = Array.isArray(worker?.skillSummaries) ? worker.skillSummaries : [];
    const persona = normalizeString(worker?.persona);
    const displayName = normalizeString(worker?.displayName);
    const runtimeKind = normalizeString(worker?.runtimeKind);
    return [displayName, persona, runtimeKind, roleText, ...skillSummaries]
      .map((value) => String(value || "").toLowerCase())
      .join("\n");
  }

  function scoreWorkerForTask(taskDraft, worker) {
    const taskText = `${normalizeString(taskDraft?.title)}\n${normalizeString(taskDraft?.description)}`;
    const taskTokens = tokenizeForMatching(taskText);
    if (taskTokens.length === 0) return 0;
    const haystack = workerSearchText(worker);
    let score = 0;
    taskTokens.forEach((token) => {
      if (haystack.includes(token.toLowerCase())) {
        score += 1;
      }
    });
    return score;
  }

  function assignTasksToWorkers(input = {}) {
    const routingApi = resolveAgentRoutingApi();
    if (routingApi && typeof routingApi.assignTasksToWorkers === "function") {
      return routingApi.assignTasksToWorkers(input);
    }
    const taskDrafts = Array.isArray(input.taskDrafts) ? input.taskDrafts : [];
    const workers = Array.isArray(input.workers) ? input.workers : [];
    if (taskDrafts.length === 0 || workers.length === 0) return [];
    const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
    const assigned = [];

    taskDrafts.forEach((taskDraft, index) => {
      let bestWorker = workers[0];
      let bestScore = scoreWorkerForTask(taskDraft, bestWorker);
      workers.slice(1).forEach((worker) => {
        const score = scoreWorkerForTask(taskDraft, worker);
        const bestCount = assignmentCounts.get(bestWorker.id) || 0;
        const nextCount = assignmentCounts.get(worker.id) || 0;
        if (score > bestScore) {
          bestScore = score;
          bestWorker = worker;
          return;
        }
        if (score === bestScore && nextCount < bestCount) {
          bestWorker = worker;
        }
      });

      if (!bestWorker) {
        bestWorker = workers[index % workers.length];
        bestScore = 0;
      }
      assignmentCounts.set(bestWorker.id, (assignmentCounts.get(bestWorker.id) || 0) + 1);
      assigned.push({
        taskDraft,
        workerId: bestWorker.id,
        score: bestScore,
      });
    });

    return assigned;
  }

  const api = {
    buildTaskDraftsFromRequest,
    assignTasksToWorkers,
    scoreWorkerForTask,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.GuideTaskPlanner = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
