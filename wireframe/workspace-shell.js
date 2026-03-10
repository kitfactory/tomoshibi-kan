(function (global) {
function residentPanelUi() {
  return global.ResidentPanelUi || {};
}

function settingsTabUi() {
  return global.SettingsTabUi || {};
}

function taskDetailPanelUi() {
  return global.TaskDetailPanelUi || {};
}

function renderSettingsTabViaModule() {
  if (typeof settingsTabUi().renderSettingsTab === "function") {
    return settingsTabUi().renderSettingsTab();
  }
  return undefined;
}

function renderPalListViaModule() {
  if (typeof residentPanelUi().renderPalList === "function") {
    return residentPanelUi().renderPalList();
  }
  return undefined;
}

function closePalConfigModalViaModule() {
  if (typeof residentPanelUi().closePalConfigModal === "function") {
    return residentPanelUi().closePalConfigModal();
  }
  return undefined;
}

function rerenderActiveTabPanel(tab) {
  if (tab === "guide") {
    renderGuideChat();
    return;
  }
  if (tab === "pal") {
    renderPalListViaModule();
    return;
  }
  if (tab === "project") {
    renderProjectTab();
    return;
  }
  if (tab === "job") {
    renderJobBoard();
    return;
  }
  if (tab === "task") {
    renderTaskBoard();
    return;
  }
  if (tab === "event") {
    renderEventLog();
    return;
  }
  if (tab === "settings") {
    renderSettingsTabViaModule();
  }
}

function setWorkspaceTab(tab) {
  workspaceTab = tab;
  if (tab !== "guide") {
    closeGuideMentionMenu();
  }
  if (tab !== "pal") {
    closePalConfigModalViaModule();
  }
  document.querySelectorAll(".workspace-tabs .tab-btn").forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("active", isActive);
    btn.classList.toggle("tab-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tab;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
  document.querySelector(".app-shell").classList.toggle("guide-mode", tab === "guide");
  syncGuideVisualState();
  rerenderActiveTabPanel(tab);
  if (typeof taskDetailPanelUi().renderDetail === "function") {
    taskDetailPanelUi().renderDetail();
  }
}

function applyI18n() {
  document.documentElement.lang = locale === "ja" ? "ja" : "en";
  document.querySelectorAll("[data-ui-id]").forEach((el) => {
    const id = el.getAttribute("data-ui-id");
    el.textContent = tUi(id);
  });
  const guideHint = document.getElementById("guideHint");
  if (guideHint) guideHint.textContent = tDyn("guideHint");
  document.getElementById("guideInput").placeholder = tDyn("guideInputPlaceholder");
  syncGuideVisualState();
  document.querySelector("#gateReason").placeholder = tDyn("rejectReasonPlaceholder");
  renderGateReasonTemplates();
  renderGuideProjectFocus();
  setWorkspaceTab(workspaceTab);
  renderGuideChat();
  renderJobBoard();
  renderTaskBoard();
  renderEventLog();
  renderPalListViaModule();
  renderProjectTab();
  renderSettingsTabViaModule();
  if (typeof taskDetailPanelUi().renderDetail === "function") {
    taskDetailPanelUi().renderDetail();
  }
  setMessage(messageId);
}

function renderGuideChat() {
  const ul = document.getElementById("guideChat");
  ul.innerHTML = guideMessages
    .map((m) => {
      const text = (m.text && (m.text[locale] || m.text.ja)) || "";
      const renderedText = renderMarkdownText(text);
      let alignClass = "chat-start";
      let rowClass = "guide-chat-item guide-chat-item-guide";
      let bubbleClass = "chat-bubble guide-bubble guide-bubble-guide";
      if (m.sender === "you") {
        alignClass = "chat-end";
        rowClass = "guide-chat-item guide-chat-item-user";
        bubbleClass = "chat-bubble guide-bubble guide-bubble-user";
      } else if (m.sender === "system") {
        alignClass = "chat-center";
        rowClass = "guide-chat-item guide-chat-item-system";
        bubbleClass = "chat-bubble guide-bubble guide-bubble-system";
      }
      return `<li class="chat ${alignClass} ${rowClass}" data-guide-sender="${escapeHtml(m.sender)}">
        <div class="chat-header guide-chat-meta text-xs text-base-content/60">${m.timestamp} / ${senderLabel(m.sender)}</div>
        <div class="${bubbleClass} max-w-[min(720px,100%)] text-sm leading-relaxed"><div class="guide-markdown">${renderedText}</div></div>
      </li>`;
    })
    .join("");
  ul.scrollTop = ul.scrollHeight;
}

function statusBadgeClass(status) {
  if (status === "to_gate") return "status-badge-attn";
  if (status === "rejected") return "status-badge-danger";
  return "status-badge-muted";
}

function taskActions(task) {
  const buttons = [
    `<button class="btn btn-xs btn-outline" data-action="detail" data-task-id="${task.id}">${tDyn("detail")}</button>`,
  ];
  if (task.status === "assigned") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="start" data-task-id="${task.id}">${tDyn("start")}</button>`
    );
  }
  if (task.status === "in_progress") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="submit" data-task-id="${task.id}">${tDyn("submit")}</button>`
    );
  }
  if (task.status === "to_gate") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="gate" data-task-id="${task.id}">${tDyn("gate")}</button>`
    );
  }
  if (task.status === "rejected") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="resubmit" data-task-id="${task.id}">${tDyn("resubmit")}</button>`
    );
  }
  return buttons.join("");
}

function renderTaskBoard() {
  const ul = document.getElementById("taskBoard");
  if (tasks.length === 0) {
    ul.innerHTML = `<li class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${tDyn("noTask")}</li>`;
    return;
  }
  ul.innerHTML = tasks
    .map((task) => {
      const isSelected = selectedTaskId === task.id;
      const selected = isSelected
        ? "ring-2 ring-primary/40 border-primary/50"
        : "border-base-300";
      const statusText = tUi(STATUS_UI_ID[task.status]);
      const gateProfile = resolveGateProfileForTarget(task);
      const gateProfileId = normalizeText(gateProfile?.id);
      return `<li data-task-row="${task.id}" data-plan-id="${escapeHtml(task.planId || "")}" data-board-kind="task" data-board-status="${task.status}" data-board-state="${isSelected ? "selected" : "idle"}" data-gate-profile-id="${escapeHtml(gateProfileId)}" data-gate-decision="${escapeHtml(task.gateResult?.decision || "none")}" class="task-board-row rounded-box border ${selected} bg-base-100 p-3 shadow-sm mb-3">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold">${task.title}</span>
          <span class="badge ${statusBadgeClass(task.status)} badge-sm">${statusText}</span>
        </div>
        <div class="mt-2 grid gap-1 text-xs text-base-content/65">
          <span>${task.id} / ${escapeHtml(residentDisplayName(task.palId, task.palId))}</span>
          <span>updated_at: ${task.updatedAt}</span>
          <span>${escapeHtml(gateProfileSummaryText(task))}</span>
          <span>gate: ${task.decisionSummary}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">${taskActions(task)}</div>
      </li>`;
    })
    .join("");
}

function jobActions(job) {
  const buttons = [];
  if (job.status === "assigned") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="start" data-job-id="${job.id}">${tDyn("start")}</button>`
    );
  }
  if (job.status === "in_progress") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="submit" data-job-id="${job.id}">${tDyn("submit")}</button>`
    );
  }
  if (job.status === "to_gate") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="gate" data-job-id="${job.id}">${tDyn("gate")}</button>`
    );
  }
  if (job.status === "rejected") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="resubmit" data-job-id="${job.id}">${tDyn("resubmit")}</button>`
    );
  }
  return buttons.join("");
}

function renderJobBoard() {
  const ul = document.getElementById("jobBoard");
  if (!ul) return;
  if (jobs.length === 0) {
    ul.innerHTML = `<li class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${tDyn("noJob")}</li>`;
    return;
  }
  ul.innerHTML = jobs
    .map((job) => {
      const statusText = tUi(STATUS_UI_ID[job.status]);
      const hasLastRun = normalizeText(job.lastRunAt) && normalizeText(job.lastRunAt) !== "-";
      const gateProfile = resolveGateProfileForTarget(job);
      const gateProfileId = normalizeText(gateProfile?.id);
      return `<li data-job-row="${job.id}" data-plan-id="${escapeHtml(job.planId || "")}" data-board-kind="job" data-board-status="${job.status}" data-last-run-state="${hasLastRun ? "recorded" : "empty"}" data-gate-profile-id="${escapeHtml(gateProfileId)}" data-gate-decision="${escapeHtml(job.gateResult?.decision || "none")}" class="job-board-row cron-board-row rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold">${escapeHtml(job.title)}</span>
          <span class="badge ${statusBadgeClass(job.status)} badge-sm">${statusText}</span>
        </div>
        <div class="cron-meta mt-2 grid gap-1 text-xs text-base-content/65">
          <span class="cron-id-row">${escapeHtml(job.id)} / ${escapeHtml(residentDisplayName(job.palId, job.palId))}</span>
          <span class="cron-schedule-row">${escapeHtml(tDyn("schedule"))}: ${escapeHtml(job.schedule)}</span>
          <span class="cron-last-run-row">${escapeHtml(tDyn("lastRun"))}: ${escapeHtml(job.lastRunAt)}</span>
          <span class="cron-gate-row">${escapeHtml(gateProfileSummaryText(job))}</span>
          <span class="cron-instruction-row">${escapeHtml(tDyn("instruction"))}: ${escapeHtml(job.instruction)}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">${jobActions(job)}</div>
      </li>`;
    })
    .join("");
}

function eventSummaryText(event) {
  if (!event || typeof event !== "object") return "";
  if (!event.summary || typeof event.summary !== "object") return "";
  return String(event.summary[locale] || event.summary.ja || event.summary.en || "");
}

function filteredEvents() {
  const query = String(eventSearchQuery || "").trim().toLowerCase();
  return events.filter((event) => {
    if (eventTypeFilter !== "all" && event.eventType !== eventTypeFilter) return false;
    if (!query) return true;
    const fields = [
      event.id,
      event.timestamp,
      event.eventType,
      event.targetId,
      event.result,
      eventSummaryText(event),
    ];
    const haystack = fields.join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderEventFilterControls(totalFiltered, pageCount) {
  const toolbar = document.querySelector(".event-toolbar");
  const searchInput = document.getElementById("eventSearchInput");
  const typeFilter = document.getElementById("eventTypeFilter");
  const pager = document.querySelector(".event-pager-controls");
  const prevBtn = document.getElementById("eventPrevPage");
  const nextBtn = document.getElementById("eventNextPage");
  const pageInfo = document.getElementById("eventPageInfo");
  const hasFilter = Boolean(String(eventSearchQuery || "").trim()) || eventTypeFilter !== "all";

  if (toolbar) {
    toolbar.setAttribute("data-event-toolbar-state", hasFilter ? "filtered" : "idle");
  }

  if (searchInput) {
    searchInput.placeholder = tDyn("eventSearchPlaceholder");
    if (searchInput.value !== eventSearchQuery) {
      searchInput.value = eventSearchQuery;
    }
  }

  if (typeFilter) {
    typeFilter.innerHTML = EVENT_TYPE_FILTER_KEYS.map((key) => {
      const textKey = key === "all"
        ? "eventTypeAll"
        : `eventType${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      return `<option value="${key}">${escapeHtml(tDyn(textKey))}</option>`;
    }).join("");
    typeFilter.value = EVENT_TYPE_FILTER_KEYS.includes(eventTypeFilter) ? eventTypeFilter : "all";
  }

  if (prevBtn) {
    prevBtn.textContent = tDyn("pagePrev");
    prevBtn.disabled = eventPage <= 1 || totalFiltered === 0;
  }
  if (nextBtn) {
    nextBtn.textContent = tDyn("pageNext");
    nextBtn.disabled = eventPage >= pageCount || totalFiltered === 0;
  }
  if (pageInfo) {
    const safeTotal = Math.max(pageCount, 1);
    const current = totalFiltered === 0 ? 0 : eventPage;
    pageInfo.textContent = `${current} / ${safeTotal}`;
    pageInfo.setAttribute("data-page-current", String(current));
    pageInfo.setAttribute("data-page-total", String(safeTotal));
  }
  if (pager) {
    const pageState = totalFiltered === 0
      ? "empty"
      : (pageCount > 1 ? "paged" : "single");
    pager.setAttribute("data-event-page-state", pageState);
  }
}

function renderEventLog() {
  const ul = document.getElementById("eventLog");
  if (!ul) return;
  const filtered = filteredEvents();
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / EVENT_LOG_PAGE_SIZE));
  eventPage = Math.min(Math.max(1, eventPage), pageCount);
  const start = (eventPage - 1) * EVENT_LOG_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + EVENT_LOG_PAGE_SIZE);

  renderEventFilterControls(total, pageCount);

  if (pageItems.length === 0) {
    ul.innerHTML = `<li class="mb-2 rounded-box border border-base-300 bg-base-100 p-3 text-sm">${escapeHtml(tDyn("eventNoMatch"))}</li>`;
    return;
  }

  ul.innerHTML = pageItems
    .map(
      (e) => `<li class="event-log-row mb-2 rounded-box border border-base-300 bg-base-100 p-3" data-event-type="${escapeHtml(e.eventType)}" data-event-result="${escapeHtml(e.result)}">
      <div class="event-log-meta text-xs text-base-content/60">${e.timestamp} / ${e.eventType} / ${e.targetId} / ${e.result}</div>
      <div class="event-log-summary mt-1 text-sm">${escapeHtml(eventSummaryText(e))}</div>
    </li>`
    )
    .join("");
}

function gateReasonTemplateLabel(template) {
  if (!template || typeof template !== "object") return "";
  if (locale === "en") return String(template.en || template.ja || "");
  return String(template.ja || template.en || "");
}

function appendGateReasonTemplateById(templateId) {
  const template = GATE_REASON_TEMPLATES.find((item) => item.id === templateId);
  if (!template) return;
  const input = document.getElementById("gateReason");
  if (!input) return;
  const line = gateReasonTemplateLabel(template);
  if (!line) return;
  const current = input.value.trim();
  input.value = current ? `${current}\n- ${line}` : `- ${line}`;
  input.focus();
}

function renderGateReasonTemplates() {
  const labelEl = document.getElementById("gateReasonTemplateLabel");
  const listEl = document.getElementById("gateReasonTemplateList");
  if (labelEl) labelEl.textContent = tDyn("gateReasonTemplateLabel");
  if (!listEl) return;
  listEl.innerHTML = GATE_REASON_TEMPLATES.map((template) => {
    const label = escapeHtml(gateReasonTemplateLabel(template));
    return `<button type="button" class="btn btn-xs btn-outline" data-gate-template-id="${template.id}">${label}</button>`;
  }).join("");
}

function focusBoardRow(targetKind, targetId) {
  const selector = targetKind === "job"
    ? `[data-job-row="${targetId}"]`
    : `[data-task-row="${targetId}"]`;
  const row = document.querySelector(selector);
  if (!row) return;
  row.classList.add("board-row-focus");
  row.scrollIntoView({ block: "nearest", behavior: "smooth" });
  window.setTimeout(() => {
    row.classList.remove("board-row-focus");
  }, 1200);
}

function navigateToResubmitTarget(targetId, targetKind) {
  if (targetKind === "task") {
    selectedTaskId = targetId;
    setWorkspaceTab("task");
  } else {
    setWorkspaceTab("job");
  }
  rerenderAll();
  focusBoardRow(targetKind, targetId);
}

global.WorkspaceShellUi = {
  appendGateReasonTemplateById,
  applyI18n,
  eventSummaryText,
  filteredEvents,
  focusBoardRow,
  gateReasonTemplateLabel,
  jobActions,
  navigateToResubmitTarget,
  renderEventFilterControls,
  renderEventLog,
  renderGateReasonTemplates,
  renderGuideChat,
  renderJobBoard,
  renderTaskBoard,
  rerenderActiveTabPanel,
  setWorkspaceTab,
  statusBadgeClass,
  taskActions,
};
})(window);
