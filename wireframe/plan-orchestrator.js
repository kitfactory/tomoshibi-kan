function normalizePlanOrchestratorText(value) {
  return String(value || "").trim();
}

async function selectWorkerForPlanTask(taskPlan, index, workers, assignmentCounts, routingApi, artifact) {
  const explicitWorker = workers.find((worker) => worker.id === normalizePlanOrchestratorText(taskPlan?.assigneePalId)) || null;
  const taskDraft = {
    title: normalizePlanOrchestratorText(taskPlan?.title) || `Task ${index + 1}`,
    description: normalizePlanOrchestratorText(taskPlan?.description),
  };
  if (!taskDraft.description) return null;

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
        taskDraft,
        workers,
        assignmentCounts,
        requiredSkills: Array.isArray(taskPlan?.requiredSkills) ? taskPlan.requiredSkills : [],
      });
      baselineWorkerId = normalizePlanOrchestratorText(baselineSelected?.workerId);
    }
    const selected = await routingApi.selectWorkerForTaskWithGuideDecision({
      artifact,
      taskDraft,
      taskPlan,
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
      taskDraft,
      workers,
      assignmentCounts,
      requiredSkills: Array.isArray(taskPlan?.requiredSkills) ? taskPlan.requiredSkills : [],
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
    taskDraft,
    workerId,
    explanation,
  };
}

async function materializePlanArtifact(input) {
  const artifact = input && typeof input === "object" ? input.artifact : null;
  const plan = artifact && artifact.plan && typeof artifact.plan === "object" ? artifact.plan : null;
  const taskList = Array.isArray(plan?.tasks) ? plan.tasks : [];
  const workers = Array.isArray(input?.workers) ? input.workers : [];
  const buildTaskRecord = typeof input?.buildTaskRecord === "function" ? input.buildTaskRecord : null;
  const startSequence = Number(input?.nextSequence);
  const nextSequence = Number.isFinite(startSequence) && startSequence > 0 ? Math.floor(startSequence) : 1;
  const routingApi = input?.routingApi && typeof input.routingApi === "object" ? input.routingApi : null;
  if (!artifact || !plan || taskList.length === 0 || workers.length === 0 || !buildTaskRecord) {
    return {
      createdTasks: [],
      nextSequence,
    };
  }

  const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
  let sequence = nextSequence;
  const createdTasks = [];

  for (const [index, taskPlan] of taskList.entries()) {
    const resolved = await selectWorkerForPlanTask(taskPlan, index, workers, assignmentCounts, routingApi, artifact);
    if (!resolved) continue;
    const { taskDraft, workerId, explanation } = resolved;
    assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
    const task = buildTaskRecord({
      id: `TASK-${String(sequence).padStart(3, "0")}`,
      planId: normalizePlanOrchestratorText(artifact.planId) || "PLAN-001",
      title: taskDraft.title,
      description: taskDraft.description,
      palId: workerId,
    });
    sequence += 1;
    createdTasks.push({
      task,
      workerId,
      explanation,
    });
  }

  return {
    createdTasks,
    nextSequence: sequence,
  };
}

window.PlanOrchestrator = {
  materializePlanArtifact,
};
