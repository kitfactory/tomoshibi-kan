(function attachGuideProgressFlow(scope) {
  function isGuidePlanApprovalIntent(text) {
    const normalized = normalizeText(text)
      .toLowerCase()
      .replace(/[。.!！?？]/g, "")
      .trim();
    if (!normalized) return false;
    return [
      "はい",
      "ok",
      "okay",
      "進めて",
      "進めてください",
      "進めましょう",
      "お願いします",
      "その内容で",
      "その形で",
      "それで進めて",
      "この内容で進めてください",
      "この内容でお願いします",
      "go ahead",
      "looks good",
      "ship it",
    ].some((phrase) => normalized === phrase);
  }

  function buildGuidePlanApprovalReply(artifact, created) {
    const plan = artifact?.plan && typeof artifact.plan === "object" ? artifact.plan : {};
    const taskCount = Array.isArray(created?.createdTasks) ? created.createdTasks.length : 0;
    const jobCount = Array.isArray(created?.createdJobs) ? created.createdJobs.length : 0;
    const projectName = normalizeText(plan?.project?.name || plan?.project?.directory || "");
    if (locale === "en") {
      const parts = [];
      parts.push(projectName ? `I will proceed in ${projectName}.` : "I will proceed with this plan.");
      if (taskCount > 0) parts.push(`I handed off ${taskCount} task${taskCount === 1 ? "" : "s"} to the residents.`);
      if (jobCount > 0) parts.push(`I also prepared ${jobCount} recurring job${jobCount === 1 ? "" : "s"}.`);
      if (taskCount > 0) parts.push("The work is now running.");
      return parts.join(" ");
    }
    const parts = [];
    parts.push(projectName ? `${projectName} でこの依頼を進めます。` : "この内容で進めますね。");
    if (taskCount > 0) parts.push(`${taskCount}件の作業を住人にお願いしました。`);
    if (jobCount > 0) parts.push(`${jobCount}件の定期実行も準備しました。`);
    if (taskCount > 0) parts.push("作業はこのまま進めます。");
    return parts.join("");
  }

  function countMaterializedTargetsForPlan(planId) {
    const normalizedPlanId = normalizeText(planId);
    if (!normalizedPlanId) {
      return { taskCount: 0, jobCount: 0, total: 0 };
    }
    const taskCount = tasks.filter((task) => resolveTargetPlanId(task) === normalizedPlanId).length;
    const jobCount = jobs.filter((job) => resolveTargetPlanId(job) === normalizedPlanId).length;
    return {
      taskCount,
      jobCount,
      total: taskCount + jobCount,
    };
  }

  function isRecentlyApprovedPlanArtifact(artifact, now = Date.now()) {
    const approvedAtText = normalizeText(artifact?.approvedAt);
    if (!approvedAtText) return false;
    const approvedAt = Date.parse(approvedAtText);
    if (!Number.isFinite(approvedAt)) return false;
    return now - approvedAt <= 30 * 60 * 1000;
  }

  function buildGuidePlanAlreadyStartedReply(artifact, counts) {
    const plan = artifact?.plan && typeof artifact.plan === "object" ? artifact.plan : {};
    const projectName = normalizeText(plan?.project?.name || plan?.project?.directory || "");
    const taskCount = Number(counts?.taskCount) || 0;
    const jobCount = Number(counts?.jobCount) || 0;
    if (locale === "en") {
      const parts = [];
      parts.push(projectName ? `This request is already underway in ${projectName}.` : "This request is already underway.");
      if (taskCount > 0) parts.push(`There ${taskCount === 1 ? "is" : "are"} already ${taskCount} task${taskCount === 1 ? "" : "s"} in motion.`);
      if (jobCount > 0) parts.push(`There ${jobCount === 1 ? "is" : "are"} also ${jobCount} recurring job${jobCount === 1 ? "" : "s"} prepared.`);
      parts.push("I will keep things moving and report back through the task log.");
      return parts.join(" ");
    }
    const parts = [];
    parts.push(projectName ? `この依頼は、${projectName} で既に進めています。` : "この依頼は、もう進め始めています。");
    if (taskCount > 0) parts.push(`いまは ${taskCount} 件のタスクを動かしています。`);
    if (jobCount > 0) parts.push(`あわせて ${jobCount} 件の定期実行も準備できています。`);
    parts.push("進み具合はタスクのログで見えるようにしておきますね。");
    return parts.join("");
  }

  function isGuideProgressQuery(text) {
    const normalized = normalizeText(text).toLowerCase();
    if (!normalized) return false;
    const patterns = [
      "どうなった",
      "進捗",
      "状況",
      "今どこ",
      "終わった",
      "完了",
      "さっきお願い",
      "いまどう",
      "status",
      "progress",
      "how is",
      "what happened",
      "done yet",
    ];
    return patterns.some((pattern) => normalized.includes(pattern));
  }

  function resolveGuideProgressQueryTarget(text) {
    const normalized = normalizeText(text);
    const explicitTask = normalized.match(/\b(TASK-\d{3})\b/i);
    if (explicitTask && explicitTask[1]) {
      return {
        targetKind: "task",
        targetId: explicitTask[1].toUpperCase(),
      };
    }
    const explicitJob = normalized.match(/\b(JOB-\d{3})\b/i);
    if (explicitJob && explicitJob[1]) {
      return {
        targetKind: "job",
        targetId: explicitJob[1].toUpperCase(),
      };
    }
    return null;
  }

  function buildGuideReplanRequiredText(targetKind, target, latestEntry) {
    const label = targetKind === "job" ? "Job" : "Task";
    const display = normalizeText(target?.title) || normalizeText(target?.id) || label;
    const payload = latestEntry?.payload || {};
    const gateReason = normalizeText(payload?.gateResult?.reason);
    if (locale === "ja") {
      const suffix = gateReason ? ` Gate では「${gateReason}」という判断でした。` : "";
      return `${display} は再計画が必要な状態です。いまの進め方と前提を見直す段階に入っています。${suffix}`.trim();
    }
    const suffix = gateReason ? ` Gate noted: "${gateReason}".` : "";
    return `${display} requires replanning. The current approach and assumptions need to be revisited.${suffix}`.trim();
  }

  function buildGuideReplannedText(targetKind, target, latestEntry) {
    const label = targetKind === "job" ? "Job" : "Task";
    const display = normalizeText(target?.title) || normalizeText(target?.id) || label;
    const payload = latestEntry?.payload || {};
    const createdCount = Number(payload.createdCount || 0);
    const nextPlanId = normalizeText(payload.nextPlanId);
    if (locale === "ja") {
      const createdText = createdCount > 0 ? ` ${createdCount}件の新しいtaskに分け直しています。` : "";
      const planText = nextPlanId ? ` 新しいPlanは ${nextPlanId} です。` : "";
      return `${display} は再計画を作成しました。${createdText}${planText}`.trim();
    }
    const createdText = createdCount > 0 ? ` It has been split into ${createdCount} new tasks.` : "";
    const planText = nextPlanId ? ` The new plan is ${nextPlanId}.` : "";
    return `${display} has been replanned.${createdText}${planText}`.trim();
  }

  function buildGuideProgressStatusText(targetKind, target) {
    const label = targetKind === "job" ? "Job" : "Task";
    const display = normalizeText(target?.title) || normalizeText(target?.id) || label;
    const status = normalizeText(target?.status);
    if (locale === "ja") {
      if (status === "done") return `${display} は完了しています。直近では Gate が承認しました。`;
      if (status === "to_gate") return `${display} は Gate の確認待ちです。`;
      if (status === "rejected") return `${display} は差し戻しになっています。修正条件を確認して再提出が必要です。`;
      if (status === "in_progress") return `${display} は実行中です。住人が作業を進めています。`;
      if (status === "assigned") return `${display} は割り当て済みです。これから着手できます。`;
      return `${display} の最新状態を確認中です。`;
    }
    if (status === "done") return `${display} is complete. The latest gate review approved it.`;
    if (status === "to_gate") return `${display} is waiting for gate review.`;
    if (status === "rejected") return `${display} was rejected and needs fixes before resubmission.`;
    if (status === "in_progress") return `${display} is in progress. A resident is working on it.`;
    if (status === "assigned") return `${display} is assigned and ready to start.`;
    return `Checking the latest state for ${display}.`;
  }

  function buildGuideProgressLogSuffix(latestEntry) {
    const actor = normalizeText(latestEntry?.displayActor);
    const actionType = normalizeText(latestEntry?.actionType);
    if (!actionType) return "";
    if (locale === "ja") {
      if (actor && latestEntry?.messageForUser) return ` 直近の記録: ${actor} が「${latestEntry.messageForUser}」と残しています。`;
      if (latestEntry?.messageForUser) return ` 直近の記録: ${latestEntry.messageForUser}`;
      return "";
    }
    if (actor && latestEntry?.messageForUser) return ` Latest note: ${actor} recorded "${latestEntry.messageForUser}".`;
    if (latestEntry?.messageForUser) return ` Latest note: ${latestEntry.messageForUser}`;
    return "";
  }

  async function buildGuideProgressQueryReply(text) {
    if (!isGuideProgressQuery(text)) return null;
    const explicitTarget = resolveGuideProgressQueryTarget(text);
    let latestEntry = null;
    if (explicitTarget) {
      latestEntry = await getLatestTaskProgressLogEntryWithFallback(explicitTarget);
    } else {
      const rows = await listTaskProgressLogEntriesWithFallback({ limit: 1 });
      latestEntry = rows[0] || null;
    }
    if (!latestEntry) {
      return {
        handled: true,
        text: locale === "ja"
          ? "まだ進捗記録がありません。これから受け付けた依頼がある場合は、その task が動き出すと記録されます。"
          : "There are no progress records yet. Once a request starts moving, it will appear here.",
      };
    }
    const targetKind = normalizeText(latestEntry.targetKind);
    const targetId = normalizeText(latestEntry.targetId);
    const target = resolveBoardTargetRecord(targetKind, targetId);
    const summary = normalizeText(latestEntry.actionType) === "replan_required"
      ? buildGuideReplanRequiredText(targetKind, target || { id: targetId }, latestEntry)
      : normalizeText(latestEntry.actionType) === "replanned"
        ? buildGuideReplannedText(targetKind, target || { id: targetId }, latestEntry)
        : buildGuideProgressStatusText(targetKind, target || { id: targetId });
    const suffix = buildGuideProgressLogSuffix(latestEntry);
    return {
      handled: true,
      text: `${summary}${suffix}`.trim(),
    };
  }

  const api = {
    isGuidePlanApprovalIntent,
    buildGuidePlanApprovalReply,
    countMaterializedTargetsForPlan,
    isRecentlyApprovedPlanArtifact,
    buildGuidePlanAlreadyStartedReply,
    isGuideProgressQuery,
    resolveGuideProgressQueryTarget,
    buildGuideReplanRequiredText,
    buildGuideReplannedText,
    buildGuideProgressStatusText,
    buildGuideProgressLogSuffix,
    buildGuideProgressQueryReply,
  };

  scope.GuideProgressFlow = api;
  Object.assign(scope, api);
  if (scope.window && typeof scope.window === "object") {
    scope.window.GuideProgressFlow = api;
    Object.assign(scope.window, api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
