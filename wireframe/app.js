const STATUS_UI_ID = {
  assigned: "UI-PPH-0005",
  in_progress: "UI-PPH-0006",
  to_gate: "UI-PPH-0007",
  rejected: "UI-PPH-0008",
  done: "UI-PPH-0009",
};

const UI_TEXT = {
  ja: {
    "UI-PPH-0001": "ワークスペース",
    "UI-PPH-0002": "Guide Chat",
    "UI-PPH-0003": "Task Board",
    "UI-PPH-0004": "Event Log",
    "UI-PPH-0005": "割り当て済み",
    "UI-PPH-0006": "実行中",
    "UI-PPH-0007": "判定待ち",
    "UI-PPH-0008": "差し戻し",
    "UI-PPH-0009": "完了",
    "UI-PPH-0010": "設定",
    "UI-PPH-0011": "Agent設定",
    "UI-PPH-0012": "Workspace設定",
    "UI-PPH-0201": "Sort: updated_at desc (固定)",
    "UI-PPH-0202": "Filter: none (MVP)",
    "UI-PPH-0203": "Limit: 50 (暫定)",
    "UI-PPH-0204": "Task Detail",
    "UI-PPH-0205": "Gate Panel",
    "UI-PPH-0206": "Reject Reason",
    "UI-PPH-0207": "Pal Preview Slot",
    "UI-PPH-0208": "3D Coming Soon",
    "UI-PPH-0209": "Reject",
    "UI-PPH-0210": "Approve",
    "UI-PPH-0211": "Agent / Guide",
    "UI-PPH-0212": "Agent / Gate",
    "UI-PPH-0213": "Agent / Pal",
    "UI-PPH-0214": "Safety",
    "UI-PPH-0215": "Workspace",
  },
  en: {
    "UI-PPH-0001": "Workspace",
    "UI-PPH-0002": "Guide Chat",
    "UI-PPH-0003": "Task Board",
    "UI-PPH-0004": "Event Log",
    "UI-PPH-0005": "Assigned",
    "UI-PPH-0006": "In Progress",
    "UI-PPH-0007": "Awaiting Gate",
    "UI-PPH-0008": "Rejected",
    "UI-PPH-0009": "Done",
    "UI-PPH-0010": "Settings",
    "UI-PPH-0011": "Agent",
    "UI-PPH-0012": "Workspace",
    "UI-PPH-0201": "Sort: updated_at desc (fixed)",
    "UI-PPH-0202": "Filter: none (MVP)",
    "UI-PPH-0203": "Limit: 50 (temporary)",
    "UI-PPH-0204": "Task Detail",
    "UI-PPH-0205": "Gate Panel",
    "UI-PPH-0206": "Reject Reason",
    "UI-PPH-0207": "Pal Preview Slot",
    "UI-PPH-0208": "3D Coming Soon",
    "UI-PPH-0209": "Reject",
    "UI-PPH-0210": "Approve",
    "UI-PPH-0211": "Agent / Guide",
    "UI-PPH-0212": "Agent / Gate",
    "UI-PPH-0213": "Agent / Pal",
    "UI-PPH-0214": "Safety",
    "UI-PPH-0215": "Workspace",
  },
};

const DYNAMIC_TEXT = {
  ja: {
    detail: "詳細",
    start: "着手",
    submit: "提出",
    gate: "Gate判定",
    resubmit: "再提出",
    selectedTask: "選択Task",
    description: "説明",
    constraints: "制約チェック",
    evidence: "Evidence",
    replay: "Replay",
    fixCondition: "修正条件",
    openGate: "Gate Panelを開く",
    close: "閉じる",
    noTaskSelected: "Taskを選択してください。",
    noTask: "Taskがありません。",
    gateOnlyToGate: "現在の状態ではGate判定は実行できません。",
    rejectReasonPlaceholder: "差し戻し理由（最大3項目）",
    settingsReadonly: "MVP: 設定は閲覧のみ",
    view: "表示",
  },
  en: {
    detail: "Detail",
    start: "Start",
    submit: "Submit",
    gate: "Gate Review",
    resubmit: "Resubmit",
    selectedTask: "Selected Task",
    description: "Description",
    constraints: "Constraints Check",
    evidence: "Evidence",
    replay: "Replay",
    fixCondition: "Fix Condition",
    openGate: "Open Gate Panel",
    close: "Close",
    noTaskSelected: "Select a task first.",
    noTask: "No tasks yet.",
    gateOnlyToGate: "Gate review is only available for to_gate tasks.",
    rejectReasonPlaceholder: "Reject reasons (max 3)",
    settingsReadonly: "MVP: read-only settings",
    view: "View",
  },
};

const MESSAGE_TEXT = {
  "MSG-PPH-0001": {
    ja: "Plan Cardを作成しました。",
    en: "Plan card created.",
  },
  "MSG-PPH-0002": {
    ja: "TaskをPalへ配布しました。",
    en: "Tasks dispatched to Pal.",
  },
  "MSG-PPH-0003": {
    ja: "Completion Ritualを保存してGateへ提出しました。",
    en: "Completion ritual saved and submitted to Gate.",
  },
  "MSG-PPH-0004": {
    ja: "Gate判定を記録しました。",
    en: "Gate decision recorded.",
  },
  "MSG-PPH-0005": {
    ja: "差し戻しTaskを再提出しました。",
    en: "Rejected task resubmitted.",
  },
  "MSG-PPH-0006": {
    ja: "Workspaceを表示しました。",
    en: "Workspace is now displayed.",
  },
  "MSG-PPH-0007": {
    ja: "Pal制約を適用しました。",
    en: "Pal constraints applied.",
  },
  "MSG-PPH-0008": {
    ja: "Plan完了を通知しました。",
    en: "Plan completion was posted.",
  },
  "MSG-PPH-1001": {
    ja: "入力内容を確認してください。",
    en: "Check your input.",
  },
  "MSG-PPH-1002": {
    ja: "処理がタイムアウトしました。再試行してください。",
    en: "Operation timed out. Please retry.",
  },
  "MSG-PPH-1003": {
    ja: "保存に失敗しました。保存先を確認してください。",
    en: "Failed to save. Check storage destination.",
  },
  "MSG-PPH-1004": {
    ja: "対象データが見つかりません。",
    en: "Target data not found.",
  },
  "MSG-PPH-1005": {
    ja: "セーフティ制約により操作をブロックしました。",
    en: "Operation blocked by safety constraints.",
  },
  "MSG-PPH-1006": {
    ja: "現在の状態ではその操作は実行できません。",
    en: "This action is not available in the current state.",
  },
  "MSG-PPH-1007": {
    ja: "Reject入力が上限制約を超えています。",
    en: "Reject input exceeds limit.",
  },
  "MSG-PPH-1008": {
    ja: "完了判定に不整合があります。状態を再確認してください。",
    en: "Completion state is inconsistent. Check statuses.",
  },
};

const SETTINGS_DATA = {
  guide: [
    ["profile_name", "default-guide", "default-guide"],
    ["profile_version", "v1.0.0", "v1.0.0"],
    ["note", "MVP: 閲覧のみ", "MVP: read only"],
  ],
  gate: [
    ["profile_name", "default-gate", "default-gate"],
    ["rule_version", "v1.0.0", "v1.0.0"],
    ["note", "MVP: 閲覧のみ", "MVP: read only"],
  ],
  pal: [
    ["pal_id", "pal-alpha", "pal-alpha"],
    ["persona", "Builder", "Builder"],
    ["constraints", "no_network", "no_network"],
  ],
  safety: [
    ["block_mode", "pre_execute", "pre_execute"],
    ["network", "deny", "deny"],
    ["note", "MVP: ON固定", "MVP: fixed ON"],
  ],
  workspace: [
    ["event_log_limit", "50 (仮固定)", "50 (temporary fixed)"],
    ["task_sort", "updated_at desc", "updated_at desc"],
    ["task_filter", "none", "none"],
  ],
};

let locale = "ja";
let selectedTaskId = null;
let gateTaskId = null;
let messageId = "MSG-PPH-0006";
let settingsTab = "guide";
let eventSeq = 0;

const guideMessages = [
  {
    timestamp: "09:20",
    sender: "guide",
    text: {
      ja: "Plan Cardを提案します。Taskを3件に分割します。",
      en: "I propose a plan card. Splitting into 3 tasks.",
    },
  },
  {
    timestamp: "09:23",
    sender: "system",
    text: {
      ja: "Planは承認済みです。Task配布済み。",
      en: "Plan approved. Tasks dispatched.",
    },
  },
];

const tasks = [
  {
    id: "TASK-001",
    title: "Guide要件の確認",
    description: "REQ-0001〜REQ-0008 と画面設計要件を突合する",
    palId: "pal-alpha",
    status: "in_progress",
    updatedAt: "2026-02-28 09:30",
    decisionSummary: "-",
    constraintsCheckResult: "pass",
    evidence: "docs/spec.md, docs/concept.md",
    replay: "review-checklist",
    fixCondition: "-",
  },
  {
    id: "TASK-002",
    title: "ワイヤーフレーム作成",
    description: "Workspace / Task Detail / Gate / Settings をダミー実装",
    palId: "pal-beta",
    status: "to_gate",
    updatedAt: "2026-02-28 09:41",
    decisionSummary: "pending",
    constraintsCheckResult: "pass",
    evidence: "wireframe/index.html",
    replay: "open-browser > click-flow",
    fixCondition: "-",
  },
  {
    id: "TASK-003",
    title: "i18n IDマッピング",
    description: "UI-PPH-xxxx と ja/en 辞書の初期セットを定義",
    palId: "pal-gamma",
    status: "rejected",
    updatedAt: "2026-02-28 09:46",
    decisionSummary: "rejected",
    constraintsCheckResult: "pass",
    evidence: "ui-id-table",
    replay: "switch-ja-en",
    fixCondition: "UI-ID不足項目を追加",
  },
];

let events = [
  makeEvent("workspace", "SCR-WS-001", "ok", {
    ja: "Workspaceを初期表示しました。",
    en: "Workspace initialized.",
  }, "09:20"),
  makeEvent("dispatch", "TASK-001", "ok", {
    ja: "TASK-001 を pal-alpha に配布しました。",
    en: "TASK-001 dispatched to pal-alpha.",
  }, "09:24"),
  makeEvent("gate", "TASK-003", "rejected", {
    ja: "TASK-003 を差し戻しました。",
    en: "TASK-003 was rejected.",
  }, "09:46"),
];

function makeEvent(type, targetId, result, summary, timestamp) {
  eventSeq += 1;
  return {
    id: `EV-${String(eventSeq).padStart(4, "0")}`,
    timestamp,
    eventType: type,
    targetId,
    result,
    summary,
  };
}

function tUi(id) {
  return (UI_TEXT[locale] && UI_TEXT[locale][id]) || (UI_TEXT.ja && UI_TEXT.ja[id]) || id;
}

function tDyn(key) {
  return (DYNAMIC_TEXT[locale] && DYNAMIC_TEXT[locale][key]) || key;
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

function appendEvent(type, targetId, result, summaryJa, summaryEn) {
  events.unshift(
    makeEvent(type, targetId, result, { ja: summaryJa, en: summaryEn }, formatNow().slice(11))
  );
  events = events.slice(0, 50);
}

function setMessage(id) {
  messageId = id;
  const data = MESSAGE_TEXT[id];
  const text = data ? data[locale] : id;
  document.querySelector("#messageBar .msg-id").textContent = id;
  document.querySelector("#messageBar .msg-text").textContent = text;
}

function applyI18n() {
  document.documentElement.lang = locale === "ja" ? "ja" : "en";
  document.querySelectorAll("[data-ui-id]").forEach((el) => {
    const id = el.getAttribute("data-ui-id");
    el.textContent = tUi(id);
  });
  document.querySelector("#gateReason").placeholder = tDyn("rejectReasonPlaceholder");
  document.getElementById("localeJa").classList.toggle("active", locale === "ja");
  document.getElementById("localeEn").classList.toggle("active", locale === "en");
  renderSettings();
  renderGuideChat();
  renderTaskBoard();
  renderEventLog();
  renderDetail();
  setMessage(messageId);
}

function renderGuideChat() {
  const ul = document.getElementById("guideChat");
  ul.innerHTML = guideMessages
    .map(
      (m) => `<li class="chat-item">
        <div class="chat-meta">${m.timestamp} / ${m.sender}</div>
        <div class="chat-text">${m.text[locale]}</div>
      </li>`
    )
    .join("");
}

function taskActions(task) {
  const buttons = [
    `<button class="mini-btn" data-action="detail" data-task-id="${task.id}">${tDyn("detail")}</button>`,
  ];
  if (task.status === "assigned") {
    buttons.push(
      `<button class="mini-btn primary" data-action="start" data-task-id="${task.id}">${tDyn("start")}</button>`
    );
  }
  if (task.status === "in_progress") {
    buttons.push(
      `<button class="mini-btn primary" data-action="submit" data-task-id="${task.id}">${tDyn("submit")}</button>`
    );
  }
  if (task.status === "to_gate") {
    buttons.push(
      `<button class="mini-btn primary" data-action="gate" data-task-id="${task.id}">${tDyn("gate")}</button>`
    );
  }
  if (task.status === "rejected") {
    buttons.push(
      `<button class="mini-btn primary" data-action="resubmit" data-task-id="${task.id}">${tDyn("resubmit")}</button>`
    );
  }
  return buttons.join("");
}

function renderTaskBoard() {
  const ul = document.getElementById("taskBoard");
  if (tasks.length === 0) {
    ul.innerHTML = `<li class="task-item">${tDyn("noTask")}</li>`;
    return;
  }
  ul.innerHTML = tasks
    .map((task) => {
      const selected = selectedTaskId === task.id ? "active" : "";
      const statusText = tUi(STATUS_UI_ID[task.status]);
      return `<li class="task-item ${selected}">
        <div class="task-top">
          <span class="task-title">${task.title}</span>
          <span class="status-badge status-${task.status}">${statusText}</span>
        </div>
        <div class="task-sub">
          <span>${task.id} / ${task.palId}</span>
          <span>updated_at: ${task.updatedAt}</span>
          <span>gate: ${task.decisionSummary}</span>
        </div>
        <div class="task-actions">${taskActions(task)}</div>
      </li>`;
    })
    .join("");
}

function renderEventLog() {
  const ul = document.getElementById("eventLog");
  ul.innerHTML = events
    .map(
      (e) => `<li class="event-item">
      <div class="event-type">${e.timestamp} / ${e.eventType} / ${e.targetId} / ${e.result}</div>
      <div class="event-summary">${e.summary[locale]}</div>
    </li>`
    )
    .join("");
}

function selectedTask() {
  return tasks.find((t) => t.id === selectedTaskId) || null;
}

function renderDetail() {
  const drawer = document.getElementById("detailDrawer");
  const body = document.getElementById("detailBody");
  const task = selectedTask();
  if (!task) {
    drawer.classList.add("hidden");
    body.innerHTML = "";
    return;
  }
  drawer.classList.remove("hidden");
  body.innerHTML = `<div class="detail-grid">
    <div class="detail-row">
      <span class="detail-label">${tDyn("selectedTask")}</span>
      <div><strong>${task.id}</strong> / ${task.title}</div>
    </div>
    <div class="detail-row">
      <span class="detail-label">${tDyn("description")}</span>
      <div>${task.description}</div>
    </div>
    <div class="detail-row">
      <span class="detail-label">${tDyn("constraints")}</span>
      <div>${task.constraintsCheckResult}</div>
    </div>
    <div class="detail-row">
      <span class="detail-label">${tDyn("evidence")}</span>
      <div>${task.evidence}</div>
      <span class="detail-label">${tDyn("replay")}</span>
      <div>${task.replay}</div>
    </div>
    <div class="detail-row">
      <span class="detail-label">${tDyn("fixCondition")}</span>
      <div>${task.fixCondition}</div>
    </div>
    <div class="detail-actions">
      <button class="mini-btn" id="detailStart">${tDyn("start")}</button>
      <button class="mini-btn" id="detailSubmit">${tDyn("submit")}</button>
      <button class="mini-btn" id="detailResubmit">${tDyn("resubmit")}</button>
      <button class="mini-btn primary" id="detailGate">${tDyn("openGate")}</button>
    </div>
  </div>`;
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
  gate.onclick = () => openGate(task.id);
}

function touchTask(task, status, decisionSummary, fixCondition) {
  task.status = status;
  task.decisionSummary = decisionSummary ?? task.decisionSummary;
  task.fixCondition = fixCondition ?? task.fixCondition;
  task.updatedAt = formatNow();
}

function runTaskAction(action, taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    setMessage("MSG-PPH-1004");
    return;
  }
  selectedTaskId = taskId;
  if (action === "detail") {
    renderDetail();
    return;
  }
  if (action === "start") {
    if (task.status !== "assigned") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchTask(task, "in_progress", "working");
    appendEvent("task", task.id, "in_progress", `${task.id} を実行中へ遷移`, `${task.id} moved to in_progress`);
    setMessage("MSG-PPH-0007");
  } else if (action === "submit") {
    if (task.status !== "in_progress") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchTask(task, "to_gate", "pending");
    appendEvent("task", task.id, "to_gate", `${task.id} をGate提出待ちに更新`, `${task.id} moved to to_gate`);
    setMessage("MSG-PPH-0003");
  } else if (action === "gate") {
    openGate(task.id);
    return;
  } else if (action === "resubmit") {
    if (task.status !== "rejected") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchTask(task, "to_gate", "pending", "-");
    appendEvent("resubmit", task.id, "ok", `${task.id} を再提出`, `${task.id} resubmitted`);
    setMessage("MSG-PPH-0005");
  }
  rerenderAll();
}

function openGate(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (task.status !== "to_gate") {
    setMessage("MSG-PPH-1006");
    return;
  }
  gateTaskId = taskId;
  document.getElementById("gateReason").value = "";
  document.getElementById("gatePanel").classList.remove("hidden");
}

function closeGate() {
  gateTaskId = null;
  document.getElementById("gatePanel").classList.add("hidden");
}

function runGate(decision) {
  const task = tasks.find((t) => t.id === gateTaskId);
  if (!task) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (task.status !== "to_gate") {
    setMessage("MSG-PPH-1006");
    return;
  }
  const reason = document.getElementById("gateReason").value.trim();
  if (decision === "reject") {
    const count = reason
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter(Boolean).length;
    if (count > 3) {
      setMessage("MSG-PPH-1007");
      return;
    }
    touchTask(task, "rejected", "rejected", reason || "修正条件を追加");
    appendEvent("gate", task.id, "rejected", `${task.id} を差し戻し`, `${task.id} rejected`);
  } else {
    touchTask(task, "done", "approved", "-");
    appendEvent("gate", task.id, "approved", `${task.id} を承認`, `${task.id} approved`);
  }
  setMessage("MSG-PPH-0004");
  closeGate();
  if (tasks.every((t) => t.status === "done")) {
    appendEvent("plan", "PLAN-001", "completed", "Plan完了を通知", "Plan completion announced");
    setMessage("MSG-PPH-0008");
  }
  rerenderAll();
}

function renderSettings() {
  document.querySelectorAll(".settings-nav .nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.setting === settingsTab);
  });
  const [f1, f2, f3] = SETTINGS_DATA[settingsTab];
  document.getElementById("settingsLabel1").textContent = f1[0];
  document.getElementById("settingsLabel2").textContent = f2[0];
  document.getElementById("settingsLabel3").textContent = f3[0];
  document.getElementById("settingsValue1").value = locale === "ja" ? f1[1] : f1[2];
  document.getElementById("settingsValue2").value = locale === "ja" ? f2[1] : f2[2];
  document.getElementById("settingsValue3").value = locale === "ja" ? f3[1] : f3[2];
}

function rerenderAll() {
  renderTaskBoard();
  renderEventLog();
  renderDetail();
}

function bindStaticEvents() {
  document.getElementById("localeJa").onclick = () => {
    locale = "ja";
    applyI18n();
  };
  document.getElementById("localeEn").onclick = () => {
    locale = "en";
    applyI18n();
  };

  document.getElementById("openSettings").onclick = () => {
    document.getElementById("settingsPanel").classList.remove("hidden");
    setMessage("MSG-PPH-0006");
  };

  document.getElementById("closeSettings").onclick = () => {
    document.getElementById("settingsPanel").classList.add("hidden");
  };

  document.querySelectorAll(".settings-nav .nav-item").forEach((btn) => {
    btn.onclick = () => {
      settingsTab = btn.dataset.setting;
      renderSettings();
    };
  });

  document.getElementById("closeDrawer").onclick = () => {
    selectedTaskId = null;
    renderDetail();
  };

  document.getElementById("closeGate").onclick = closeGate;
  document.getElementById("approveTask").onclick = () => runGate("approve");
  document.getElementById("rejectTask").onclick = () => runGate("reject");

  document.getElementById("taskBoard").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;
    runTaskAction(button.dataset.action, button.dataset.taskId);
  });

  document.getElementById("settingsPanel").addEventListener("click", (e) => {
    if (e.target.id === "settingsPanel") {
      document.getElementById("settingsPanel").classList.add("hidden");
    }
  });

  document.getElementById("gatePanel").addEventListener("click", (e) => {
    if (e.target.id === "gatePanel") {
      closeGate();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.getElementById("settingsPanel").classList.add("hidden");
    closeGate();
  });
}

function init() {
  selectedTaskId = tasks[0].id;
  bindStaticEvents();
  applyI18n();
  setMessage("MSG-PPH-0006");
}

init();
