function detailActorLabel(displayActor) {
  const actor = normalizeText(displayActor).toLowerCase();
  if (locale === "ja") {
    if (actor === "guide") return "管理人";
    if (actor === "gate") return "古参住人";
    if (actor === "resident") return "住人";
    return normalizeText(displayActor) || "住人";
  }
  if (actor === "guide") return "Guide";
  if (actor === "gate") return "Gate";
  if (actor === "resident") return "Resident";
  return normalizeText(displayActor) || "Resident";
}

function detailActorToneClass(displayActor) {
  const actor = normalizeText(displayActor).toLowerCase();
  if (actor === "guide") return "detail-log-entry-guide";
  if (actor === "gate") return "detail-log-entry-gate";
  return "detail-log-entry-resident";
}

function detailActionLabel(actionType) {
  const action = normalizeText(actionType).toLowerCase();
  const labels = locale === "ja"
    ? {
      dispatch: "依頼",
      reroute: "振り直し",
      worker_runtime: "作業",
      to_gate: "見てもらう",
      gate_review: "見立て",
      resubmit: "再提出",
      replan_required: "見直し",
      replanned: "再計画",
      plan_completed: "完了",
    }
    : {
      dispatch: "Dispatch",
      reroute: "Reroute",
      worker_runtime: "Work",
      to_gate: "To Gate",
      gate_review: "Review",
      resubmit: "Resubmit",
      replan_required: "Replan",
      replanned: "Replanned",
      plan_completed: "Completed",
    };
  return labels[action] || normalizeText(actionType) || "-";
}

function detailStatusLabel(status) {
  const normalized = normalizeText(status).toLowerCase();
  if (normalized === "approved") return locale === "ja" ? "承認" : "Approved";
  if (normalized === "rejected") return locale === "ja" ? "差し戻し" : "Rejected";
  if (normalized === "pending") return locale === "ja" ? "保留" : "Pending";
  if (normalized === "ok") return locale === "ja" ? "記録" : "Recorded";
  return normalizeText(status) || "-";
}

function detailConversationMessage(entry) {
  const actor = normalizeText(entry?.displayActor).toLowerCase();
  const action = normalizeText(entry?.actionType).toLowerCase();
  const status = normalizeText(entry?.status).toLowerCase();
  const message = normalizeText(entry?.messageForUser);
  const payload = entry?.payload && typeof entry.payload === "object" ? entry.payload : {};
  const taskTitle = normalizeText(payload.taskTitle || payload.title);
  const workerDisplayName = normalizeText(payload.workerDisplayName || payload.assigneeDisplayName || payload.workerId);
  const fromWorkerDisplayName = normalizeText(payload.fromWorkerDisplayName || payload.fromWorkerId);
  const gateDisplayName = normalizeText(payload.gateDisplayName || payload.gateProfileId);
  const gateResult = payload.gateResult && typeof payload.gateResult === "object" ? payload.gateResult : {};
  const gateReason = firstMeaningfulLine(gateResult.reason);
  const gateFix = Array.isArray(gateResult.fixes) ? firstMeaningfulLine(gateResult.fixes[0]) : "";
  const createdTaskTitles = Array.isArray(payload.taskTitles)
    ? payload.taskTitles.map((item) => summarizeConversationIntent(item)).filter(Boolean)
    : [];
  if (!message) return "-";
  if (locale !== "ja") return message;
  if (actor === "guide") {
    if (action === "dispatch" && workerDisplayName && taskTitle) return `${workerDisplayName}さん、${taskTitle}をお願いします。`;
    if (action === "reroute" && workerDisplayName && taskTitle) {
      if (fromWorkerDisplayName) return `${fromWorkerDisplayName}よりも${workerDisplayName}さんの方が合いそうです。${taskTitle}をお願いし直します。`;
      return `${workerDisplayName}さんに、${taskTitle}をお願いし直します。`;
    }
    if (action === "to_gate" && taskTitle) return `${gateDisplayName || "真壁"}にも見てもらいます。${taskTitle}について、ここまでの結果を渡します。`;
    if (action === "replan_required" && taskTitle) return `${taskTitle}は、このまま進めるより段取りを見直した方がよさそうです。いったん燈子さんが整え直します。`;
    if (action === "replanned" && createdTaskTitles.length > 0) return `進め方を組み直しました。次は ${createdTaskTitles.join("、")} の順で進めます。`;
    if (action === "replanned") return `進め方を組み直しました。${message}`;
    if (action === "resubmit" && taskTitle) return `${taskTitle}は手直しが済みました。もう一度見てもらいます。`;
    if (action === "plan_completed") return `ひとまず形になりました。${message}`;
    return `いまのところ、${message}`;
  }
  if (actor === "resident") {
    if (action === "worker_runtime") {
      if (status === "ok" || status === "done") return message;
      if (status === "blocked" || status === "error") return message;
      return `いま見ているところでは、${message}`;
    }
    return message;
  }
  if (actor === "gate") {
    if (action === "gate_review") {
      if (status === "approved") return gateReason ? `いいじゃないか。${gateReason}` : `いいじゃないか。${message}`;
      if (status === "rejected") return gateReason || gateFix ? `このままだとまだ甘いかな。${gateReason || gateFix}` : `このままだとまだ甘いかな。${message}`;
      return `少し別の面から見ると、${message}`;
    }
    return `見立てとしては、${message}`;
  }
  return message;
}

function renderTaskConversationLog(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return `<div class="detail-log-empty text-sm text-base-content/60">${escapeHtml(locale === "ja" ? "まだ会話ログはありません。" : "No conversation log yet.")}</div>`;
  }
  const ordered = [...entries].reverse();
  return ordered.map((entry) => {
    const actorLabel = detailActorLabel(entry.displayActor);
    const actionLabel = detailActionLabel(entry.actionType);
    const statusLabel = detailStatusLabel(entry.status);
    const createdAt = normalizeText(entry.createdAt).replace("T", " ").replace("Z", "");
    const message = detailConversationMessage(entry);
    return `<article class="detail-log-entry ${detailActorToneClass(entry.displayActor)} rounded-box border border-base-300 bg-base-100 p-3" data-detail-actor="${escapeHtml(normalizeText(entry.displayActor).toLowerCase() || "resident")}" data-detail-action="${escapeHtml(normalizeText(entry.actionType))}" data-detail-status="${escapeHtml(normalizeText(entry.status))}">
      <div class="detail-log-meta flex flex-wrap items-center gap-2 text-xs text-base-content/60">
        <span class="badge badge-outline badge-sm">${escapeHtml(actorLabel)}</span>
        <span class="detail-log-action font-semibold text-base-content/70">${escapeHtml(actionLabel)}</span>
        <span>${escapeHtml(statusLabel)}</span>
        <span>${escapeHtml(createdAt || "-")}</span>
      </div>
      <div class="detail-log-message mt-2 text-sm leading-6">${escapeHtml(message)}</div>
    </article>`;
  }).join("");
}
