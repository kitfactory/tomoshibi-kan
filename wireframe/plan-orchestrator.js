(function attachPlanOrchestrator(scope) {
  function normalizePlanOrchestratorText(value) {
    return String(value || "").trim();
  }

  async function selectWorkerForPlannedItem(itemPlan, itemDraft, index, workers, assignmentCounts, routingApi, artifact) {
    const explicitWorker = workers.find((worker) => worker.id === normalizePlanOrchestratorText(itemPlan?.assigneePalId)) || null;
    let workerId = normalizePlanOrchestratorText(explicitWorker?.id);
    let explanation = null;
    let baselineWorkerId = "";

    if (workerId) {
      explanation = {
        matchedRoleTerms: ["explicit_assignee"],
        matchedResidentFocus: [],
        matchedPreferredOutputs: [],
        matchedSkills: [],
        decisionSource: "explicit_assignee",
      };
    } else if (routingApi && typeof routingApi.selectWorkerForTaskWithGuideDecision === "function") {
      if (typeof routingApi.selectWorkerForTask === "function") {
        const baselineSelected = routingApi.selectWorkerForTask({
          taskDraft: itemDraft,
          workers,
          assignmentCounts,
          requiredSkills: Array.isArray(itemPlan?.requiredSkills) ? itemPlan.requiredSkills : [],
        });
        baselineWorkerId = normalizePlanOrchestratorText(baselineSelected?.workerId);
      }
      const selected = await routingApi.selectWorkerForTaskWithGuideDecision({
        artifact,
        taskDraft: itemDraft,
        taskPlan: itemPlan,
        index,
        workers,
        assignmentCounts,
      });
      workerId = normalizePlanOrchestratorText(selected?.workerId);
      if (workerId) {
        explanation = {
          matchedSkills: Array.isArray(selected?.matchedSkills) ? selected.matchedSkills : [],
          matchedResidentFocus: Array.isArray(selected?.matchedResidentFocus) ? selected.matchedResidentFocus : [],
          matchedPreferredOutputs: Array.isArray(selected?.matchedPreferredOutputs) ? selected.matchedPreferredOutputs : [],
          matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
          decisionSource: normalizePlanOrchestratorText(selected?.decisionSource) || "guide_routing",
          decisionReason: normalizePlanOrchestratorText(selected?.decisionReason),
          decisionConfidence: normalizePlanOrchestratorText(selected?.decisionConfidence),
          fallbackAction: normalizePlanOrchestratorText(selected?.fallbackAction),
          rerouteFromWorkerId: baselineWorkerId,
        };
      }
    } else if (routingApi && typeof routingApi.selectWorkerForTask === "function") {
      const selected = routingApi.selectWorkerForTask({
        taskDraft: itemDraft,
        workers,
        assignmentCounts,
        requiredSkills: Array.isArray(itemPlan?.requiredSkills) ? itemPlan.requiredSkills : [],
      });
      workerId = normalizePlanOrchestratorText(selected?.workerId);
      explanation = {
        matchedSkills: Array.isArray(selected?.matchedSkills) ? selected.matchedSkills : [],
        matchedResidentFocus: Array.isArray(selected?.matchedResidentFocus) ? selected.matchedResidentFocus : [],
        matchedPreferredOutputs: Array.isArray(selected?.matchedPreferredOutputs) ? selected.matchedPreferredOutputs : [],
        matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
        decisionSource: "rule_based",
      };
    }

    if (!workerId) {
      workerId = normalizePlanOrchestratorText(workers[index % workers.length]?.id);
      explanation = {
        matchedSkills: [],
        matchedResidentFocus: [],
        matchedPreferredOutputs: [],
        matchedRoleTerms: [],
        decisionSource: "round_robin_fallback",
      };
    }
    if (!workerId) return null;
    return {
      workerId,
      explanation,
    };
  }

  async function materializePlanArtifact(input) {
    const artifact = input && typeof input === "object" ? input.artifact : null;
    const plan = artifact && artifact.plan && typeof artifact.plan === "object" ? artifact.plan : null;
    const taskList = Array.isArray(plan?.tasks) ? plan.tasks : [];
    const jobList = Array.isArray(plan?.jobs) ? plan.jobs : [];
    const workers = Array.isArray(input?.workers) ? input.workers : [];
    const buildTaskRecord = typeof input?.buildTaskRecord === "function" ? input.buildTaskRecord : null;
    const buildJobRecord = typeof input?.buildJobRecord === "function" ? input.buildJobRecord : null;
    const startTaskSequence = Number(input?.nextTaskSequence ?? input?.nextSequence);
    const startJobSequence = Number(input?.nextJobSequence);
    const nextTaskSequence = Number.isFinite(startTaskSequence) && startTaskSequence > 0 ? Math.floor(startTaskSequence) : 1;
    const nextJobSequence = Number.isFinite(startJobSequence) && startJobSequence > 0 ? Math.floor(startJobSequence) : 1;
    const routingApi = input?.routingApi && typeof input.routingApi === "object" ? input.routingApi : null;

    if (!artifact || !plan || workers.length === 0 || (!buildTaskRecord && !buildJobRecord)) {
      return {
        createdTasks: [],
        createdJobs: [],
        nextTaskSequence,
        nextJobSequence,
      };
    }

    const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
    let taskSequence = nextTaskSequence;
    let jobSequence = nextJobSequence;
    const createdTasks = [];
    const createdJobs = [];

    for (const [index, taskPlan] of taskList.entries()) {
      if (!buildTaskRecord) break;
      const taskDraft = {
        title: normalizePlanOrchestratorText(taskPlan?.title) || `Task ${index + 1}`,
        description: normalizePlanOrchestratorText(taskPlan?.description),
      };
      if (!taskDraft.description) continue;
      const resolved = await selectWorkerForPlannedItem(taskPlan, taskDraft, index, workers, assignmentCounts, routingApi, artifact);
      if (!resolved) continue;
      assignmentCounts.set(resolved.workerId, (assignmentCounts.get(resolved.workerId) || 0) + 1);
      const task = buildTaskRecord({
        id: `TASK-${String(taskSequence).padStart(3, "0")}`,
        planId: normalizePlanOrchestratorText(artifact.planId) || "PLAN-001",
        title: taskDraft.title,
        description: taskDraft.description,
        palId: resolved.workerId,
      });
      taskSequence += 1;
      createdTasks.push({
        task,
        workerId: resolved.workerId,
        explanation: resolved.explanation,
      });
    }

    for (const [index, jobPlan] of jobList.entries()) {
      if (!buildJobRecord) break;
      const jobDraft = {
        title: normalizePlanOrchestratorText(jobPlan?.title) || `Job ${index + 1}`,
        description: normalizePlanOrchestratorText(jobPlan?.description),
        instruction: normalizePlanOrchestratorText(jobPlan?.instruction),
      };
      if (!jobDraft.description || !jobDraft.instruction) continue;
      const resolved = await selectWorkerForPlannedItem(jobPlan, jobDraft, index, workers, assignmentCounts, routingApi, artifact);
      if (!resolved) continue;
      assignmentCounts.set(resolved.workerId, (assignmentCounts.get(resolved.workerId) || 0) + 1);
      const job = buildJobRecord({
        id: `JOB-${String(jobSequence).padStart(3, "0")}`,
        planId: normalizePlanOrchestratorText(artifact.planId) || "PLAN-001",
        title: jobDraft.title,
        description: jobDraft.description,
        instruction: jobDraft.instruction,
        schedule: normalizePlanOrchestratorText(jobPlan?.schedule),
        palId: resolved.workerId,
      });
      jobSequence += 1;
      createdJobs.push({
        job,
        workerId: resolved.workerId,
        explanation: resolved.explanation,
      });
    }

    return {
      createdTasks,
      createdJobs,
      nextSequence: taskSequence,
      nextTaskSequence: taskSequence,
      nextJobSequence: jobSequence,
    };
  }

  const api = {
    materializePlanArtifact,
  };
  scope.PlanOrchestrator = api;
  if (scope.window && typeof scope.window === "object") {
    scope.window.PlanOrchestrator = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
