(function (global) {
function workspaceUi() {
  return global.SettingsTabWorkspaceUi || {};
}

function senderLabel(sender) {
  if (sender === "guide") return tDyn("senderGuide");
  if (sender === "you") return tDyn("senderYou");
  if (sender === "system") return tDyn("senderSystem");
  return sender;
}

function formatNow() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

function resolveProgressLogApi() {
  if (window.TomoshibikanProgressLog && typeof window.TomoshibikanProgressLog === "object") {
    return window.TomoshibikanProgressLog;
  }
  if (window.PalpalProgressLog && typeof window.PalpalProgressLog === "object") {
    return window.PalpalProgressLog;
  }
  return null;
}

function resolvePlanArtifactApi() {
  if (window.TomoshibikanPlanArtifacts && typeof window.TomoshibikanPlanArtifacts === "object") {
    return window.TomoshibikanPlanArtifacts;
  }
  if (window.PalpalPlanArtifacts && typeof window.PalpalPlanArtifacts === "object") {
    return window.PalpalPlanArtifacts;
  }
  return null;
}

function appendTaskProgressLogEntryLocal(payload) {
  let progressLogEntries = workspaceUi().getProgressLogEntriesState();
  const entry = {
    entryId: normalizeText(payload?.entryId) || `progress-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: normalizeText(payload?.createdAt) || new Date().toISOString(),
    planId: normalizeText(payload?.planId),
    targetKind: normalizeText(payload?.targetKind),
    targetId: normalizeText(payload?.targetId),
    actionType: normalizeText(payload?.actionType),
    status: normalizeText(payload?.status) || "ok",
    actualActor: normalizeText(payload?.actualActor) || "orchestrator",
    displayActor: normalizeText(payload?.displayActor) || "Guide",
    messageForUser: normalizeText(payload?.messageForUser),
    payload: payload?.payload && typeof payload.payload === "object" ? payload.payload : {},
    sourceRunId: normalizeText(payload?.sourceRunId),
  };
  progressLogEntries.unshift(entry);
  progressLogEntries = progressLogEntries.slice(0, 200);
  global.progressLogEntries = progressLogEntries;
  return entry;
}

async function appendTaskProgressLogEntryWithFallback(payload) {
  const api = resolveProgressLogApi();
  if (api && typeof api.append === "function") {
    return api.append(payload);
  }
  return appendTaskProgressLogEntryLocal(payload);
}

async function listTaskProgressLogEntriesWithFallback(options = {}) {
  const api = resolveProgressLogApi();
  if (api && typeof api.list === "function") {
    return api.list(options);
  }
  const targetKind = normalizeText(options.targetKind);
  const targetId = normalizeText(options.targetId);
  const planId = normalizeText(options.planId);
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 50;
  const progressLogEntries = workspaceUi().getProgressLogEntriesState();
  return progressLogEntries
    .filter((entry) => (!targetKind || entry.targetKind === targetKind))
    .filter((entry) => (!targetId || entry.targetId === targetId))
    .filter((entry) => (!planId || entry.planId === planId))
    .slice(0, limit);
}

async function getLatestTaskProgressLogEntryWithFallback(options = {}) {
  const api = resolveProgressLogApi();
  if (api && typeof api.latest === "function") {
    return api.latest(options);
  }
  const rows = await listTaskProgressLogEntriesWithFallback({ ...options, limit: 1 });
  return rows[0] || null;
}

function appendPlanArtifactLocal(payload) {
  let planArtifacts = workspaceUi().getPlanArtifactsState();
  const entry = {
    planId: normalizeText(payload?.planId) || `PLAN-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase(),
    createdAt: normalizeText(payload?.createdAt) || new Date().toISOString(),
    status: normalizeText(payload?.status) || "approved",
    replyText: normalizeText(payload?.replyText),
    plan: payload?.plan && typeof payload.plan === "object" ? payload.plan : {},
    sourceRunId: normalizeText(payload?.sourceRunId),
    approvedAt: normalizeText(payload?.approvedAt) || new Date().toISOString(),
  };
  planArtifacts.unshift(entry);
  planArtifacts = planArtifacts.slice(0, 50);
  global.planArtifacts = planArtifacts;
  return entry;
}

function updatePlanArtifactLocal(planId, patch = {}) {
  const planArtifacts = workspaceUi().getPlanArtifactsState();
  const normalizedPlanId = normalizeText(planId);
  if (!normalizedPlanId) return null;
  const index = planArtifacts.findIndex((entry) => normalizeText(entry?.planId) === normalizedPlanId);
  if (index < 0) return null;
  const current = planArtifacts[index];
  const next = {
    ...current,
    status: Object.prototype.hasOwnProperty.call(patch || {}, "status")
      ? normalizeText(patch?.status) || current.status
      : current.status,
    replyText: Object.prototype.hasOwnProperty.call(patch || {}, "replyText")
      ? normalizeText(patch?.replyText)
      : current.replyText,
    plan: Object.prototype.hasOwnProperty.call(patch || {}, "plan")
      ? (patch?.plan && typeof patch.plan === "object" ? patch.plan : {})
      : current.plan,
    sourceRunId: Object.prototype.hasOwnProperty.call(patch || {}, "sourceRunId")
      ? normalizeText(patch?.sourceRunId)
      : current.sourceRunId,
    approvedAt: Object.prototype.hasOwnProperty.call(patch || {}, "approvedAt")
      ? normalizeText(patch?.approvedAt)
      : (normalizeText(current.approvedAt) || (normalizeText(patch?.status) === "approved" ? new Date().toISOString() : "")),
  };
  planArtifacts[index] = next;
  return next;
}

async function appendPlanArtifactWithFallback(payload) {
  const api = resolvePlanArtifactApi();
  if (api && typeof api.append === "function") {
    return api.append(payload);
  }
  return appendPlanArtifactLocal(payload);
}

async function updatePlanArtifactWithFallback(planId, patch = {}) {
  const api = resolvePlanArtifactApi();
  if (api && typeof api.update === "function") {
    return api.update(planId, patch);
  }
  return updatePlanArtifactLocal(planId, patch);
}

async function listPlanArtifactsWithFallback(options = {}) {
  const api = resolvePlanArtifactApi();
  if (api && typeof api.list === "function") {
    return api.list(options);
  }
  const status = normalizeText(options.status);
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 50;
  const planArtifacts = workspaceUi().getPlanArtifactsState();
  return planArtifacts
    .filter((entry) => (!status || entry.status === status))
    .slice(0, limit);
}

async function getLatestPlanArtifactWithFallback(options = {}) {
  const api = resolvePlanArtifactApi();
  if (api && typeof api.latest === "function") {
    return api.latest(options);
  }
  const rows = await listPlanArtifactsWithFallback({ ...options, limit: 1 });
  return rows[0] || null;
}

async function findPlanArtifactByIdWithFallback(planId) {
  const normalizedPlanId = normalizeText(planId);
  if (!normalizedPlanId) return null;
  const rows = await listPlanArtifactsWithFallback({ limit: 50 });
  return rows.find((entry) => normalizeText(entry?.planId) === normalizedPlanId) || null;
}

if (typeof window !== "undefined" && (!window.TomoshibikanPlanArtifacts || typeof window.TomoshibikanPlanArtifacts !== "object")) {
  const fallbackPlanArtifactApi = {
    append: (payload) => appendPlanArtifactLocal(payload),
    update: (planId, patch = {}) => updatePlanArtifactLocal(planId, patch),
    list: (options = {}) => {
      const status = normalizeText(options.status);
      const limit = Number(options.limit) > 0 ? Number(options.limit) : 50;
      const planArtifacts = workspaceUi().getPlanArtifactsState();
      return planArtifacts
        .filter((entry) => (!status || entry.status === status))
        .slice(0, limit);
    },
    latest: (options = {}) => {
      const rows = fallbackPlanArtifactApi.list({ ...options, limit: 1 });
      return rows[0] || null;
    },
  };
  window.TomoshibikanPlanArtifacts = fallbackPlanArtifactApi;
  if (!window.PalpalPlanArtifacts || typeof window.PalpalPlanArtifacts !== "object") {
    window.PalpalPlanArtifacts = fallbackPlanArtifactApi;
  }
}

function appendEvent(type, targetId, result, summaryJa, summaryEn) {
  let events = workspaceUi().getEventsState();
  events.unshift(
    makeEvent(type, targetId, result, { ja: summaryJa, en: summaryEn }, formatNow().slice(11))
  );
  events = events.slice(0, 50);
  global.events = events;
  eventPage = 1;
}

function appendTaskProgressLogForTarget(targetKind, targetId, actionType, options = {}) {
  const messageForUser = locale === "ja"
    ? normalizeText(options.messageJa)
    : normalizeText(options.messageEn || options.messageJa);
  return appendTaskProgressLogEntryWithFallback({
    planId: normalizeText(options.planId || "PLAN-001"),
    targetKind,
    targetId,
    actionType,
    status: normalizeText(options.status || "ok"),
    actualActor: normalizeText(options.actualActor || "orchestrator"),
    displayActor: normalizeText(options.displayActor || "Guide"),
    messageForUser,
    payload: options.payload && typeof options.payload === "object" ? options.payload : {},
    sourceRunId: normalizeText(options.sourceRunId),
  });
}

function resolveTargetPlanId(target) {
  return normalizeText(target?.planId) || "PLAN-001";
}

function formatWorkerRoutingExplanation(explanation) {
  const matchedSkills = Array.isArray(explanation?.matchedSkills)
    ? explanation.matchedSkills.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedResidentFocus = Array.isArray(explanation?.matchedResidentFocus)
    ? explanation.matchedResidentFocus.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedPreferredOutputs = Array.isArray(explanation?.matchedPreferredOutputs)
    ? explanation.matchedPreferredOutputs.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedRoleTerms = Array.isArray(explanation?.matchedRoleTerms)
    ? explanation.matchedRoleTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const parts = [];
  if (matchedSkills.length > 0) {
    parts.push(`skills=${matchedSkills.join(",")}`);
  }
  if (matchedResidentFocus.length > 0) {
    parts.push(`focus=${matchedResidentFocus.join(",")}`);
  }
  if (matchedPreferredOutputs.length > 0) {
    parts.push(`outputs=${matchedPreferredOutputs.join(",")}`);
  }
  if (matchedRoleTerms.length > 0) {
    parts.push(`ROLE=${matchedRoleTerms.join(",")}`);
  }
  return {
    ja: parts.join(" / "),
    en: parts.join(" / "),
  };
}

function formatGateRoutingExplanation(explanation) {
  const matchedRubricTerms = Array.isArray(explanation?.matchedRubricTerms)
    ? explanation.matchedRubricTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedReviewFocusTerms = Array.isArray(explanation?.matchedReviewFocusTerms)
    ? explanation.matchedReviewFocusTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const gateTerms = matchedRubricTerms.length > 0 ? matchedRubricTerms : matchedReviewFocusTerms;
  const text = gateTerms.length > 0
    ? `RUBRIC=${gateTerms.join(",")}`
    : "";
  return {
    ja: text,
    en: text,
  };
}

function messageText(id) {
  const data = MESSAGE_TEXT[id];
  if (!data) return id;
  return data[locale] || data.ja || data.en || id;
}

function isErrorMessageId(id) {
  return /^MSG-PPH-1\d{3}$/.test(String(id || ""));
}

function hideErrorToast() {
  const toast = document.getElementById("errorToast");
  if (!toast) return;
  if (errorToastTimer) {
    window.clearTimeout(errorToastTimer);
    errorToastTimer = null;
  }
  toast.classList.remove("is-visible");
  window.setTimeout(() => {
    if (!toast.classList.contains("is-visible")) {
      toast.hidden = true;
    }
  }, 220);
}

function showErrorToast(id, text) {
  const toast = document.getElementById("errorToast");
  if (!toast) return;
  const titleEl = document.getElementById("errorToastTitle");
  const codeEl = document.getElementById("errorToastCode");
  const textEl = document.getElementById("errorToastText");
  const closeEl = document.getElementById("errorToastClose");
  if (titleEl) titleEl.textContent = tDyn("errorToastTitle");
  if (codeEl) codeEl.textContent = id;
  if (textEl) textEl.textContent = text;
  if (closeEl) closeEl.setAttribute("aria-label", tDyn("errorToastClose"));
  toast.hidden = false;
  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });
  if (errorToastTimer) window.clearTimeout(errorToastTimer);
  errorToastTimer = window.setTimeout(() => {
    hideErrorToast();
  }, 4600);
}

function setMessage(id) {
  if (!id) return;
  messageId = id;
  const text = messageText(id);
  if (isErrorMessageId(id)) {
    showErrorToast(id, text);
    return;
  }
  hideErrorToast();
}

function resolveBoardTargetRecord(targetKind, targetId) {
  const jobs = workspaceUi().getJobsState();
  const tasks = workspaceUi().getTasksState();
  if (targetKind === "job") {
    return jobs.find((job) => job.id === targetId) || null;
  }
  if (targetKind === "task") {
    return tasks.find((task) => task.id === targetId) || null;
  }
  return null;
}

function shouldRequireReplanFromGateResult(gateResult) {
  const decision = normalizeText(gateResult?.decision);
  if (decision !== "rejected") return false;
  const reason = normalizeText(gateResult?.reason).toLowerCase();
  const fixCondition = normalizeText(gateResult?.fixCondition).toLowerCase();
  const fixes = Array.isArray(gateResult?.fixes)
    ? gateResult.fixes.map((item) => normalizeText(item).toLowerCase()).filter(Boolean)
    : [];
  const haystacks = [reason, fixCondition, ...fixes].filter(Boolean);
  if (haystacks.length === 0) return false;
  const keywords = [
    "再計画",
    "再プラン",
    "進め方",
    "方針",
    "前提",
    "要件",
    "スコープ",
    "plan",
    "replan",
    "scope",
    "requirement",
    "requirements",
    "assumption",
    "approach",
  ];
  return haystacks.some((text) => keywords.some((keyword) => text.includes(keyword)));
}

function buildGuideModelFailedPrompt() {
  return {
    ja: "Guideモデルの応答取得に失敗しました。Settings の接続設定を確認してください。",
    en: "Failed to get response from Guide model. Check model settings and connectivity.",
  };
}

global.SettingsTabFeedbackUi = {
  senderLabel,
  formatNow,
  resolveProgressLogApi,
  resolvePlanArtifactApi,
  appendTaskProgressLogEntryLocal,
  appendTaskProgressLogEntryWithFallback,
  listTaskProgressLogEntriesWithFallback,
  getLatestTaskProgressLogEntryWithFallback,
  appendPlanArtifactLocal,
  updatePlanArtifactLocal,
  appendPlanArtifactWithFallback,
  updatePlanArtifactWithFallback,
  listPlanArtifactsWithFallback,
  getLatestPlanArtifactWithFallback,
  findPlanArtifactByIdWithFallback,
  appendEvent,
  appendTaskProgressLogForTarget,
  resolveTargetPlanId,
  formatWorkerRoutingExplanation,
  formatGateRoutingExplanation,
  messageText,
  isErrorMessageId,
  hideErrorToast,
  showErrorToast,
  setMessage,
  resolveBoardTargetRecord,
  shouldRequireReplanFromGateResult,
  buildGuideModelFailedPrompt,
};
})(window);
