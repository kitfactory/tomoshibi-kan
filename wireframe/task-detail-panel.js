(function (global) {
function selectedTask() {
  return tasks.find((t) => t.id === selectedTaskId) || null;
}

async function renderDetail() {
  const drawer = document.getElementById("detailDrawer");
  const body = document.getElementById("detailBody");
  const renderToken = ++detailRenderToken;
  const task = selectedTask();
  if (!task || workspaceTab !== "task") {
    drawer.classList.add("hidden");
    drawer.setAttribute("data-detail-state", "closed");
    body.innerHTML = "";
    return;
  }
  drawer.classList.remove("hidden");
  drawer.setAttribute("data-detail-state", "open");
  body.innerHTML = `<div class="grid gap-3">
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span class="text-xs text-base-content/60">${escapeHtml(locale === "ja" ? "プラン / タスク / 状態" : "Plan / Task / Status")}</span>
          <div class="mt-1"><strong>${escapeHtml(task.planId || "-")}</strong> / ${escapeHtml(task.id)} / ${escapeHtml(tUi(STATUS_UI_ID[task.status]))}</div>
        </div>
        <span class="badge ${statusBadgeClass(task.status)} badge-sm">${escapeHtml(tUi(STATUS_UI_ID[task.status]))}</span>
      </div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("selectedTask")}</span>
      <div><strong>${escapeHtml(task.id)}</strong> / ${escapeHtml(task.title)}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("description")}</span>
      <div>${escapeHtml(task.description)}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("constraints")}</span>
      <div>${escapeHtml(task.constraintsCheckResult)}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("evidence")}</span>
      <div>${escapeHtml(task.evidence)}</div>
      <span class="mt-2 inline-block text-xs text-base-content/60">${tDyn("replay")}</span>
      <div>${escapeHtml(task.replay)}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("gateDecision")}</span>
      <div>${escapeHtml(task.gateResult?.decision || "-")}</div>
      <span class="mt-2 inline-block text-xs text-base-content/60">${tDyn("gateReason")}</span>
      <div>${escapeHtml(task.gateResult?.reason || "-")}</div>
      <span class="mt-2 inline-block text-xs text-base-content/60">${tDyn("gateFixes")}</span>
      <div>${task.gateResult?.fixes?.length ? task.gateResult.fixes.map((item) => escapeHtml(item)).join("<br>") : "-"}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("fixCondition")}</span>
      <div>${escapeHtml(task.fixCondition)}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs text-base-content/60">${escapeHtml(locale === "ja" ? "館のやり取り" : "Conversation Log")}</span>
        <span class="text-xs text-base-content/50">${escapeHtml(locale === "ja" ? "管理人 / 住人 / 古参住人" : "Guide / Resident / Gate")}</span>
      </div>
      <div id="detailConversationLog" class="detail-conversation-log mt-3">
        <div class="detail-log-empty text-sm text-base-content/60">${escapeHtml(locale === "ja" ? "会話ログを読み込んでいます..." : "Loading conversation log...")}</div>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-sm btn-outline" id="detailStart">${tDyn("start")}</button>
      <button class="btn btn-sm btn-outline" id="detailSubmit">${tDyn("submit")}</button>
      <button class="btn btn-sm btn-outline" id="detailResubmit">${tDyn("resubmit")}</button>
      <button class="btn btn-sm btn-primary" id="detailGate">${tDyn("openGate")}</button>
    </div>
  </div>`;
  const logEl = document.getElementById("detailConversationLog");
  if (logEl) {
    const targetEntries = await listTaskProgressLogEntriesWithFallback({
      targetKind: "task",
      targetId: task.id,
      limit: 30,
    });
    const planEntries = await listTaskProgressLogEntriesWithFallback({
      targetKind: "plan",
      targetId: resolveTargetPlanId(task),
      limit: 10,
    });
    if (renderToken !== detailRenderToken || selectedTaskId !== task.id || workspaceTab !== "task") return;
    const combinedEntries = [...targetEntries, ...planEntries]
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, 40);
    logEl.innerHTML = renderTaskConversationLog(combinedEntries);
  }
  bindDetailButtons(task);
}

function bindDetailButtons(task) {
  const start = document.getElementById("detailStart");
  const submit = document.getElementById("detailSubmit");
  const resubmit = document.getElementById("detailResubmit");
  const gate = document.getElementById("detailGate");
  start.disabled = task.status !== "assigned";
  submit.disabled = task.status !== "in_progress";
  resubmit.disabled = task.status !== "rejected";
  gate.disabled = task.status !== "to_gate";
  start.onclick = () => runTaskAction("start", task.id);
  submit.onclick = () => runTaskAction("submit", task.id);
  resubmit.onclick = () => runTaskAction("resubmit", task.id);
  gate.onclick = () => openGate(task.id, "task");
}

function touchTask(task, status, decisionSummary, fixCondition, gateResultInput = null) {
  task.status = status;
  task.decisionSummary = decisionSummary ?? task.decisionSummary;
  task.fixCondition = fixCondition ?? task.fixCondition;
  task.gateResult = gateResultInput
    ? normalizeGateResultRecord(gateResultInput, { decisionSummary, fixCondition })
    : normalizeGateResultRecord(task.gateResult, { decisionSummary: task.decisionSummary, fixCondition: task.fixCondition });
  task.updatedAt = formatNow();
}

function touchJob(job, status, decisionSummary, fixCondition, gateResultInput = null) {
  job.status = status;
  job.decisionSummary = decisionSummary ?? job.decisionSummary;
  job.fixCondition = fixCondition ?? job.fixCondition;
  job.gateResult = gateResultInput
    ? normalizeGateResultRecord(gateResultInput, { decisionSummary, fixCondition })
    : normalizeGateResultRecord(job.gateResult, { decisionSummary: job.decisionSummary, fixCondition: job.fixCondition });
  job.updatedAt = formatNow();
  if (status === "in_progress") job.lastRunAt = formatNow();
}

global.TaskDetailPanelUi = {
  selectedTask,
  renderDetail,
  touchTask,
  touchJob,
};
})(window);
