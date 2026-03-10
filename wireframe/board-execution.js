(function (global) {
function taskDetailPanelUi() {
  return global.TaskDetailPanelUi || {};
}

function findGateTarget() {
  if (!gateTarget) return null;
  if (gateTarget.kind === "job") {
    return jobs.find((job) => job.id === gateTarget.id) || null;
  }
  return tasks.find((task) => task.id === gateTarget.id) || null;
}

async function openGate(targetId, targetKind = "task") {
  const collection = targetKind === "job" ? jobs : tasks;
  const target = collection.find((item) => item.id === targetId);
  if (!target) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (target.status !== "to_gate") {
    setMessage("MSG-PPH-1006");
    return;
  }
  const gateSelection = await assignGateProfileToTargetWithRouting(target);
  const resolvedGate = gateSelection?.gate || null;
  gateTarget = {
    kind: targetKind,
    id: targetId,
    gateProfileId: normalizeText(resolvedGate?.id),
  };
  const gatePanel = document.getElementById("gatePanel");
  const gateProfileSummary = document.getElementById("gateProfileSummary");
  const reasonInput = document.getElementById("gateReason");
  const defaultGate = getDefaultGateProfile();
  const gateDisplayName = normalizeText(resolvedGate?.displayName || resolvedGate?.id || "");
  resetGateRuntimeState();
  if (reasonInput) reasonInput.value = "";
  if (gateProfileSummary) {
    gateProfileSummary.textContent = gateDisplayName
      ? `${tDyn("gateReviewBy")}: ${gateDisplayName}`
      : `${tDyn("gateReviewBy")}: -`;
  }
  renderGateReasonTemplates();
  if (gatePanel) {
    gatePanel.setAttribute("data-gate-state", "open");
    gatePanel.setAttribute("data-gate-kind", targetKind);
    gatePanel.setAttribute("data-default-gate-id", normalizeText(defaultGate?.id));
    gatePanel.setAttribute("data-gate-profile-id", normalizeText(resolvedGate?.id));
    gatePanel.setAttribute("data-gate-runtime-state", "idle");
    gatePanel.setAttribute("data-gate-suggested-decision", "none");
    gatePanel.classList.remove("hidden");
  }
  renderGateRuntimeSuggestion();
  void executeGateRuntimeReview(target, targetKind, resolvedGate);
  if (reasonInput) reasonInput.focus();
}

function closeGate() {
  gateTarget = null;
  resetGateRuntimeState();
  const gatePanel = document.getElementById("gatePanel");
  const gateProfileSummary = document.getElementById("gateProfileSummary");
  if (gateProfileSummary) gateProfileSummary.textContent = "";
  if (gatePanel) {
    gatePanel.setAttribute("data-gate-state", "closed");
    gatePanel.setAttribute("data-gate-kind", "none");
    gatePanel.setAttribute("data-default-gate-id", "");
    gatePanel.setAttribute("data-gate-profile-id", "");
    gatePanel.setAttribute("data-gate-runtime-state", "idle");
    gatePanel.setAttribute("data-gate-suggested-decision", "none");
    gatePanel.classList.add("hidden");
  }
  renderGateRuntimeSuggestion();
}

async function applyGateDecisionToTarget(target, targetKind = "task", decision = "approve", options = {}) {
  if (!target) return null;
  if (target.status !== "to_gate") {
    setMessage("MSG-PPH-1006");
    return null;
  }
  const isJob = targetKind === "job";
  const isRejectDecision = decision === "reject";
  const gateResult = normalizeGateResultRecord(
    options.gateResult || buildGateResultRecord(isRejectDecision ? "rejected" : "approved", options.reason || "")
  );
  const requiresReplan = isRejectDecision && shouldRequireReplanFromGateResult(gateResult);
  if (isRejectDecision) {
    const count = normalizeText(gateResult.fixCondition)
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter(Boolean).length;
    if (count > 3) {
      setMessage("MSG-PPH-1007");
      return;
    }
    if (isJob) {
      taskDetailPanelUi().touchJob(target, "rejected", "rejected", gateResult.fixCondition || "修正条件を追加", gateResult);
    } else {
      taskDetailPanelUi().touchTask(target, "rejected", "rejected", gateResult.fixCondition || "修正条件を追加", gateResult);
    }
    appendEvent("gate", target.id, "rejected", `${target.id} を差し戻しました`, `${target.id} rejected`);
    const gateReviewConversation = buildGateReviewConversationMessage(target, target.gateProfileId, gateResult, "rejected");
    void appendTaskProgressLogForTarget(isJob ? "job" : "task", target.id, "gate_review", {
      planId: resolveTargetPlanId(target),
      actualActor: "gate",
      displayActor: "Gate",
      status: "rejected",
      messageJa: gateReviewConversation.messageJa,
      messageEn: gateReviewConversation.messageEn,
      payload: {
        gateDisplayName: residentDisplayName(target.gateProfileId, target.gateProfileId),
        taskTitle: target.title,
        taskDescription: target.description || target.instruction,
        decision: "rejected",
        gateResult,
      },
    });
    if (requiresReplan) {
      void appendTaskProgressLogForTarget(isJob ? "job" : "task", target.id, "replan_required", {
        planId: resolveTargetPlanId(target),
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "blocked",
        messageJa: `${summarizeConversationIntent(target.title, target.description || target.instruction)}は、このまま進めるより段取りを見直した方がよさそうです。燈子さんが進め方を考え直します。`,
        messageEn: `${summarizeConversationIntent(target.title, target.description || target.instruction)} needs a revised approach. Toko will revisit the plan.`,
        payload: {
          taskTitle: target.title,
          taskDescription: target.description || target.instruction,
          decision: "rejected",
          gateResult,
        },
      });
    }
  } else {
    if (isJob) {
      taskDetailPanelUi().touchJob(target, "done", "approved", "-", gateResult);
    } else {
      taskDetailPanelUi().touchTask(target, "done", "approved", "-", gateResult);
    }
    appendEvent("gate", target.id, "approved", `${target.id} を承認しました`, `${target.id} approved`);
    const gateReviewConversation = buildGateReviewConversationMessage(target, target.gateProfileId, gateResult, "approved");
    void appendTaskProgressLogForTarget(isJob ? "job" : "task", target.id, "gate_review", {
      planId: resolveTargetPlanId(target),
      actualActor: "gate",
      displayActor: "Gate",
      status: "approved",
      messageJa: gateReviewConversation.messageJa,
      messageEn: gateReviewConversation.messageEn,
      payload: {
        gateDisplayName: residentDisplayName(target.gateProfileId, target.gateProfileId),
        taskTitle: target.title,
        taskDescription: target.description || target.instruction,
        decision: "approved",
        gateResult,
      },
    });
  }
  setMessage("MSG-PPH-0004");
  if (options.closePanel !== false) closeGate();
  const completedPlanId = resolveTargetPlanId(target);
  const samePlanTasks = tasks.filter((item) => resolveTargetPlanId(item) === completedPlanId);
  if (!isRejectDecision && !isJob && samePlanTasks.length > 0 && samePlanTasks.every((item) => item.status === "done")) {
    const completionConversation = buildPlanCompletedConversationMessage(completedPlanId);
    appendEvent("plan", completedPlanId, "completed", completionConversation.messageJa, completionConversation.messageEn);
    void appendTaskProgressLogForTarget("plan", completedPlanId, "plan_completed", {
      planId: completedPlanId,
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "completed",
      messageJa: completionConversation.messageJa,
      messageEn: completionConversation.messageEn,
      payload: {
        taskIds: samePlanTasks.map((item) => item.id),
        taskTitles: samePlanTasks.map((item) => item.title),
      },
    });
    setMessage("MSG-PPH-0008");
  }
  if (requiresReplan) {
    rerenderAll();
    void executeGuideDrivenReplanForTarget(isJob ? "job" : "task", target, gateResult);
    return { outcome: "replan_required", gateResult };
  }
  if (isRejectDecision) {
    if (options.navigateOnReject !== false) {
      navigateToResubmitTarget(target.id, isJob ? "job" : "task");
    }
    return { outcome: "rejected", gateResult };
  }
  rerenderAll();
  return { outcome: "approved", gateResult };
}

async function runGate(decision) {
  const target = findGateTarget();
  if (!target) {
    setMessage("MSG-PPH-1004");
    return;
  }
  const reasonInput = document.getElementById("gateReason");
  const typedReason = normalizeText(reasonInput?.value);
  const suggestedReason = decision === "reject"
    ? (gateRuntimeState.fixes.length > 0 ? gateRuntimeState.fixes.join("\n") : gateRuntimeState.reason)
    : gateRuntimeState.reason;
  const reason = typedReason || suggestedReason;
  return applyGateDecisionToTarget(target, gateTarget?.kind === "job" ? "job" : "task", decision, {
    reason,
    closePanel: true,
    navigateOnReject: true,
  });
}

async function autoExecuteTarget(targetKind, targetId) {
  const collection = targetKind === "job" ? jobs : tasks;
  const target = collection.find((item) => item.id === targetId);
  if (!target || targetKind !== "task") return null;
  if (target.status !== "assigned") return null;
  taskDetailPanelUi().touchTask(target, "in_progress", "working");
  appendEvent("task", target.id, "in_progress", `${target.id} を実行中へ更新`, `${target.id} moved to in_progress`);
  rerenderAll();
  await executePalRuntimeForTarget(target.id, "task");
  const latest = tasks.find((item) => item.id === target.id);
  if (!latest || latest.status !== "in_progress") return null;
  const gateSelection = await assignGateProfileToTargetWithRouting(latest);
  taskDetailPanelUi().touchTask(latest, "to_gate", "pending");
  const gateExplanation = formatGateRoutingExplanation(gateSelection?.explanation);
  const gateConversation = buildGateHandOffConversationMessage(latest, latest.gateProfileId, gateExplanation);
  appendEvent("task", latest.id, "to_gate", gateConversation.messageJa, gateConversation.messageEn);
  await appendTaskProgressLogForTarget("task", latest.id, "to_gate", {
    planId: resolveTargetPlanId(latest),
    actualActor: "orchestrator",
    displayActor: "Guide",
    status: "pending",
    messageJa: gateConversation.messageJa,
    messageEn: gateConversation.messageEn,
    payload: {
      gateProfileId: normalizeText(latest.gateProfileId),
      gateDisplayName: residentDisplayName(latest.gateProfileId, latest.gateProfileId),
      taskTitle: latest.title,
      taskDescription: latest.description,
      routingExplanation: gateExplanation,
    },
  });
  rerenderAll();
  const gateProfile = gateSelection?.gate || findResidentProfileById(latest.gateProfileId);
  const gateReview = await requestGateRuntimeReviewSuggestion(latest, "task", gateProfile);
  if (!gateReview) return null;
  return applyGateDecisionToTarget(latest, "task", gateReview.decision === "approved" ? "approve" : "reject", {
    gateResult: {
      decision: gateReview.decision,
      reason: gateReview.reason,
      fixes: gateReview.fixes,
    },
    closePanel: false,
    navigateOnReject: false,
  });
}

function queueAutoExecutionForCreatedTargets(created = {}) {
  const createdTasks = Array.isArray(created?.createdTasks) ? created.createdTasks : [];
  if (createdTasks.length === 0) return Promise.resolve();
  return enqueueAutoExecution(async () => {
    for (const task of createdTasks) {
      await autoExecuteTarget("task", normalizeText(task?.id));
    }
  });
}

async function runTaskAction(action, taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    setMessage("MSG-PPH-1004");
    return;
  }
  selectedTaskId = taskId;
  if (action === "detail") {
    writeBoardStateSnapshot();
    if (typeof taskDetailPanelUi().renderDetail === "function") {
      taskDetailPanelUi().renderDetail();
    }
    return;
  }
  if (action === "start") {
    if (task.status !== "assigned") {
      setMessage("MSG-PPH-1006");
      return;
    }
    taskDetailPanelUi().touchTask(task, "in_progress", "working");
    appendEvent("task", task.id, "in_progress", `${task.id} を実行中へ更新`, `${task.id} moved to in_progress`);
    void executePalRuntimeForTarget(task.id, "task");
    setMessage("MSG-PPH-0007");
  } else if (action === "submit") {
    if (task.status !== "in_progress") {
      setMessage("MSG-PPH-1006");
      return;
    }
    const gateSelection = await assignGateProfileToTargetWithRouting(task);
    taskDetailPanelUi().touchTask(task, "to_gate", "pending");
    const gateExplanation = formatGateRoutingExplanation(gateSelection?.explanation);
    const gateConversation = buildGateHandOffConversationMessage(task, task.gateProfileId, gateExplanation);
    appendEvent("task", task.id, "to_gate", gateConversation.messageJa, gateConversation.messageEn);
    void appendTaskProgressLogForTarget("task", task.id, "to_gate", {
      planId: resolveTargetPlanId(task),
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "pending",
      messageJa: gateConversation.messageJa,
      messageEn: gateConversation.messageEn,
      payload: {
        gateProfileId: normalizeText(task.gateProfileId),
        gateDisplayName: residentDisplayName(task.gateProfileId, task.gateProfileId),
        taskTitle: task.title,
        taskDescription: task.description,
        routingExplanation: gateExplanation,
      },
    });
    setMessage("MSG-PPH-0003");
  } else if (action === "gate") {
    await openGate(task.id, "task");
    return;
  } else if (action === "resubmit") {
    if (task.status !== "rejected") {
      setMessage("MSG-PPH-1006");
      return;
    }
    await assignGateProfileToTargetWithRouting(task, task.gateProfileId);
    taskDetailPanelUi().touchTask(task, "to_gate", "pending", "-", {
      decision: "none",
      reason: "-",
      fixes: [],
    });
    const resubmitConversation = buildResubmitConversationMessage(task, task.gateProfileId);
    appendEvent("resubmit", task.id, "ok", resubmitConversation.messageJa, resubmitConversation.messageEn);
    void appendTaskProgressLogForTarget("task", task.id, "resubmit", {
      planId: resolveTargetPlanId(task),
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: resubmitConversation.messageJa,
      messageEn: resubmitConversation.messageEn,
      payload: {
        gateProfileId: normalizeText(task.gateProfileId),
        gateDisplayName: residentDisplayName(task.gateProfileId, task.gateProfileId),
        taskTitle: task.title,
        taskDescription: task.description,
      },
    });
    setMessage("MSG-PPH-0005");
  }
  rerenderAll();
}

async function runJobAction(action, jobId) {
  const job = jobs.find((x) => x.id === jobId);
  if (!job) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (action === "start") {
    if (job.status !== "assigned") {
      setMessage("MSG-PPH-1006");
      return;
    }
    taskDetailPanelUi().touchJob(job, "in_progress", "working");
    appendEvent("job", job.id, "in_progress", `${job.id} を実行中へ更新`, `${job.id} moved to in_progress`);
    void executePalRuntimeForTarget(job.id, "job");
    setMessage("MSG-PPH-0007");
  } else if (action === "submit") {
    if (job.status !== "in_progress") {
      setMessage("MSG-PPH-1006");
      return;
    }
    const gateSelection = await assignGateProfileToTargetWithRouting(job);
    taskDetailPanelUi().touchJob(job, "to_gate", "pending");
    const gateExplanation = formatGateRoutingExplanation(gateSelection?.explanation);
    const gateConversation = buildGateHandOffConversationMessage(job, job.gateProfileId, gateExplanation);
    appendEvent("job", job.id, "to_gate", gateConversation.messageJa, gateConversation.messageEn);
    void appendTaskProgressLogForTarget("job", job.id, "to_gate", {
      planId: resolveTargetPlanId(job),
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "pending",
      messageJa: gateConversation.messageJa,
      messageEn: gateConversation.messageEn,
      payload: {
        gateProfileId: normalizeText(job.gateProfileId),
        gateDisplayName: residentDisplayName(job.gateProfileId, job.gateProfileId),
        taskTitle: job.title,
        taskDescription: job.description,
        routingExplanation: gateExplanation,
      },
    });
    setMessage("MSG-PPH-0003");
  } else if (action === "gate") {
    await openGate(job.id, "job");
    return;
  } else if (action === "resubmit") {
    if (job.status !== "rejected") {
      setMessage("MSG-PPH-1006");
      return;
    }
    await assignGateProfileToTargetWithRouting(job, job.gateProfileId);
    taskDetailPanelUi().touchJob(job, "to_gate", "pending", "-", {
      decision: "none",
      reason: "-",
      fixes: [],
    });
    const resubmitConversation = buildResubmitConversationMessage(job, job.gateProfileId);
    appendEvent("resubmit", job.id, "ok", resubmitConversation.messageJa, resubmitConversation.messageEn);
    void appendTaskProgressLogForTarget("job", job.id, "resubmit", {
      planId: resolveTargetPlanId(job),
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: resubmitConversation.messageJa,
      messageEn: resubmitConversation.messageEn,
      payload: {
        gateProfileId: normalizeText(job.gateProfileId),
        gateDisplayName: residentDisplayName(job.gateProfileId, job.gateProfileId),
        taskTitle: job.title,
        taskDescription: job.description,
      },
    });
    setMessage("MSG-PPH-0005");
  }
  rerenderAll();
}

global.BoardExecutionUi = {
  applyGateDecisionToTarget,
  autoExecuteTarget,
  closeGate,
  findGateTarget,
  openGate,
  queueAutoExecutionForCreatedTargets,
  runGate,
  runJobAction,
  runTaskAction,
};
})(window);
