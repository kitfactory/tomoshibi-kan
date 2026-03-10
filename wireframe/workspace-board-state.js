(function attachWorkspaceBoardStateUi(scope) {
function normalizeGateDecision(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (normalized === "approved" || normalized === "rejected") return normalized;
  return "none";
}

function parseGateFixes(value) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function normalizeGateResultRecord(input, legacy = {}) {
  const decision = normalizeGateDecision(input?.decision || legacy?.decisionSummary);
  const reason = normalizeText(input?.reason);
  const fixes = Array.isArray(input?.fixes)
    ? input.fixes.map((item) => normalizeText(item)).filter(Boolean)
    : parseGateFixes(input?.fixes || legacy?.fixCondition);
  return {
    decision,
    reason: reason || (decision === "approved" ? "-" : "-"),
    fixes,
    decisionSummary: decision === "approved" ? "approved" : (decision === "rejected" ? "rejected" : normalizeText(legacy?.decisionSummary) || "-"),
    fixCondition: fixes.length > 0 ? fixes.join("\n") : (normalizeText(legacy?.fixCondition) || "-"),
  };
}

function buildGateResultRecord(decision, reasonText) {
  const normalizedDecision = normalizeGateDecision(decision);
  const reason = normalizeText(reasonText);
  const fixes = normalizedDecision === "rejected" ? parseGateFixes(reasonText) : [];
  return {
    decision: normalizedDecision,
    reason: reason || (normalizedDecision === "approved"
      ? (locale === "ja" ? "根拠を満たしているため承認" : "Approved because the evidence is sufficient.")
      : "-"),
    fixes,
  };
}

function normalizeTaskRecord(input, index = 0) {
  const gateResult = normalizeGateResultRecord(input?.gateResult, {
    decisionSummary: input?.decisionSummary,
    fixCondition: input?.fixCondition,
  });
  return {
    id: normalizeText(input?.id) || `TASK-${String(index + 1).padStart(3, "0")}`,
    planId: normalizeText(input?.planId) || "PLAN-001",
    title: normalizeText(input?.title) || `Task ${index + 1}`,
    description: normalizeText(input?.description),
    palId: normalizeText(input?.palId),
    status: normalizeText(input?.status) || "assigned",
    updatedAt: normalizeText(input?.updatedAt) || "-",
    decisionSummary: normalizeText(input?.decisionSummary) || "-",
    constraintsCheckResult: normalizeText(input?.constraintsCheckResult) || "-",
    evidence: normalizeText(input?.evidence) || "-",
    replay: normalizeText(input?.replay) || "-",
    fixCondition: gateResult.fixCondition,
    gateResult,
    gateProfileId: normalizeText(input?.gateProfileId),
  };
}

function normalizeJobRecord(input, index = 0) {
  const gateResult = normalizeGateResultRecord(input?.gateResult, {
    decisionSummary: input?.decisionSummary,
    fixCondition: input?.fixCondition,
  });
  return {
    id: normalizeText(input?.id) || `JOB-${String(index + 1).padStart(3, "0")}`,
    planId: normalizeText(input?.planId) || "PLAN-001",
    title: normalizeText(input?.title) || `Job ${index + 1}`,
    description: normalizeText(input?.description),
    palId: normalizeText(input?.palId),
    schedule: normalizeText(input?.schedule) || "-",
    instruction: normalizeText(input?.instruction) || "-",
    status: normalizeText(input?.status) || "assigned",
    updatedAt: normalizeText(input?.updatedAt) || "-",
    decisionSummary: gateResult.decisionSummary,
    fixCondition: gateResult.fixCondition,
    gateResult,
    lastRunAt: normalizeText(input?.lastRunAt) || "-",
    evidence: normalizeText(input?.evidence) || "-",
    replay: normalizeText(input?.replay) || "-",
    gateProfileId: normalizeText(input?.gateProfileId),
  };
}

function buildBoardStateSnapshot() {
  return {
    selectedTaskId: normalizeText(selectedTaskId),
    tasks: tasks.map((task, index) => normalizeTaskRecord(task, index)),
    jobs: jobs.map((job, index) => normalizeJobRecord(job, index)),
  };
}

function normalizeBoardStateSnapshot(snapshot) {
  const nextTasks = Array.isArray(snapshot?.tasks)
    ? snapshot.tasks.map((task, index) => normalizeTaskRecord(task, index))
    : [];
  const nextJobs = Array.isArray(snapshot?.jobs)
    ? snapshot.jobs.map((job, index) => normalizeJobRecord(job, index))
    : [];
  const requestedSelectedTaskId = normalizeText(snapshot?.selectedTaskId);
  const selected = nextTasks.some((task) => task.id === requestedSelectedTaskId)
    ? requestedSelectedTaskId
    : (nextTasks[0]?.id || "");
  return {
    selectedTaskId: selected,
    tasks: nextTasks,
    jobs: nextJobs,
  };
}

function readBoardStateSnapshot() {
  try {
    const raw = readLocalStorageSnapshot(BOARD_STATE_LOCAL_STORAGE_KEY, LEGACY_BOARD_STATE_LOCAL_STORAGE_KEYS);
    if (!raw) return null;
    return normalizeBoardStateSnapshot(JSON.parse(raw));
  } catch (error) {
    return null;
  }
}

function writeBoardStateSnapshot(snapshot = buildBoardStateSnapshot()) {
  try {
    writeLocalStorageSnapshot(BOARD_STATE_LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function applyBoardStateSnapshot(snapshot) {
  const normalized = normalizeBoardStateSnapshot(snapshot);
  if (normalized.tasks.length > 0) {
    tasks.splice(0, tasks.length, ...normalized.tasks);
  }
  if (normalized.jobs.length > 0) {
    jobs.splice(0, jobs.length, ...normalized.jobs);
  }
  selectedTaskId = normalized.selectedTaskId || tasks[0]?.id || null;
}

const api = {
  normalizeGateDecision,
  parseGateFixes,
  normalizeGateResultRecord,
  buildGateResultRecord,
  normalizeTaskRecord,
  normalizeJobRecord,
  buildBoardStateSnapshot,
  normalizeBoardStateSnapshot,
  readBoardStateSnapshot,
  writeBoardStateSnapshot,
  applyBoardStateSnapshot,
};

scope.WorkspaceBoardStateUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceBoardStateUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);
