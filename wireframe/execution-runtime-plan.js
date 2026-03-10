(function attachExecutionRuntimePlanUi(scope) {
  function createTaskRecord(ctx, input) {
    return {
      id: input.id,
      planId: ctx.normalizeText(input?.planId) || "PLAN-001",
      projectId: ctx.normalizeText(input?.projectId),
      projectName: ctx.normalizeText(input?.projectName),
      projectDirectory: ctx.normalizeText(input?.projectDirectory),
      title: input.title,
      description: input.description,
      palId: input.palId,
      status: "assigned",
      updatedAt: ctx.formatNow(),
      decisionSummary: "-",
      constraintsCheckResult: "pass",
      evidence: "-",
      replay: "-",
      fixCondition: "-",
    };
  }

  async function createPlannedTasksFromGuideRequest(ctx, userText) {
    const planner = ctx.resolveGuideTaskPlannerApi();
    if (!planner) return { created: 0 };
    const workers = await ctx.resolveWorkerAssignmentProfiles();
    if (workers.length === 0) return { created: 0 };
    const taskDrafts = planner.buildTaskDraftsFromRequest({
      userText,
      maxTasks: 3,
    });
    if (!Array.isArray(taskDrafts) || taskDrafts.length === 0) return { created: 0 };
    const assignments = planner.assignTasksToWorkers({
      taskDrafts,
      workers,
    });
    if (!Array.isArray(assignments) || assignments.length === 0) return { created: 0 };
    let sequence = ctx.nextTaskSequenceNumber();
    const created = [];
    const createTask = typeof ctx.createTaskRecordForExecution === "function"
      ? ctx.createTaskRecordForExecution
      : (input) => createTaskRecord(ctx, input);
    const buildDispatchMessage = typeof ctx.buildDispatchConversationMessageForExecution === "function"
      ? ctx.buildDispatchConversationMessageForExecution
      : () => ({ messageJa: "", messageEn: "" });
    const displayName = typeof ctx.residentDisplayNameForExecution === "function"
      ? ctx.residentDisplayNameForExecution
      : (_workerId, fallback = "") => ctx.normalizeText(fallback);
    assignments.forEach((assignment, index) => {
      const fallbackWorker = workers[index % workers.length];
      const palId = ctx.normalizeText(assignment?.workerId || fallbackWorker?.id);
      if (!palId) return;
      const draft = assignment?.taskDraft || {};
      const id = `TASK-${String(sequence).padStart(3, "0")}`;
      sequence += 1;
      const task = createTask({
        id,
        title: ctx.normalizeText(draft.title) || `${id} Task`,
        description: ctx.normalizeText(draft.description) || ctx.normalizeText(userText),
        palId,
      });
      ctx.tasks.push(task);
      created.push(task);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(assignment?.explanation);
      const conversation = buildDispatchMessage(task, palId, routingExplanation);
      ctx.appendEvent("dispatch", task.id, "ok", conversation.messageJa, conversation.messageEn);
      void ctx.appendTaskProgressLogForTarget("task", task.id, "dispatch", {
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: conversation.messageJa,
        messageEn: conversation.messageEn,
        payload: {
          workerId: palId,
          workerDisplayName: displayName(palId, palId),
          taskTitle: task.title,
          taskDescription: task.description,
          routingExplanation,
        },
      });
    });
    if (created.length > 0 && !ctx.getSelectedTaskId()) {
      ctx.setSelectedTaskId(created[0].id);
    }
    ctx.renderTaskBoard();
    ctx.writeBoardStateSnapshot();
    return { created: created.length };
  }

  async function createPlannedTasksFromGuidePlan(ctx, plan, options = {}) {
    const normalizedPlan = plan && typeof plan === "object" ? plan : null;
    const taskList = Array.isArray(normalizedPlan?.tasks) ? normalizedPlan.tasks : [];
    const jobList = Array.isArray(normalizedPlan?.jobs) ? normalizedPlan.jobs : [];
    const project = normalizedPlan?.project && typeof normalizedPlan.project === "object" ? normalizedPlan.project : null;
    if (taskList.length === 0 && jobList.length === 0) return { created: 0 };
    const planId = ctx.normalizeText(options.planId) || "PLAN-001";
    const workers = await ctx.resolveWorkerAssignmentProfiles();
    if (workers.length === 0) return { created: 0 };
    const routingApi = ctx.resolveAgentRoutingApi();
    const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
    let taskSequence = ctx.nextTaskSequenceNumber();
    let jobSequence = ctx.nextJobSequenceNumber();
    const createdTasks = [];
    const createdJobs = [];
    const createTask = typeof ctx.createTaskRecordForExecution === "function"
      ? ctx.createTaskRecordForExecution
      : (input) => createTaskRecord(ctx, input);
    const displayName = typeof ctx.residentDisplayNameForExecution === "function"
      ? ctx.residentDisplayNameForExecution
      : (_workerId, fallback = "") => ctx.normalizeText(fallback);

    taskList.forEach((taskPlan, index) => {
      const explicitWorker = workers.find((worker) => worker.id === ctx.normalizeText(taskPlan?.assigneePalId)) || null;
      const taskDraft = {
        title: ctx.normalizeText(taskPlan?.title) || `Task ${index + 1}`,
        description: ctx.normalizeText(taskPlan?.description),
      };
      if (!taskDraft.description) return;

      let workerId = ctx.normalizeText(explicitWorker?.id);
      let explanation = null;
      if (workerId) {
        explanation = {
          matchedRoleTerms: ["explicit_assignee"],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedSkills: [],
        };
      } else if (routingApi && typeof routingApi.selectWorkerForTask === "function") {
        const selected = routingApi.selectWorkerForTask({
          taskDraft,
          workers,
          assignmentCounts,
          requiredSkills: Array.isArray(taskPlan?.requiredSkills) ? taskPlan.requiredSkills : [],
        });
        workerId = ctx.normalizeText(selected?.workerId);
        explanation = {
          matchedSkills: Array.isArray(selected?.matchedSkills) ? selected.matchedSkills : [],
          matchedResidentFocus: Array.isArray(selected?.matchedResidentFocus) ? selected.matchedResidentFocus : [],
          matchedPreferredOutputs: Array.isArray(selected?.matchedPreferredOutputs) ? selected.matchedPreferredOutputs : [],
          matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
        };
      }
      if (!workerId) {
        workerId = ctx.normalizeText(workers[index % workers.length]?.id);
        explanation = {
          matchedSkills: [],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedRoleTerms: [],
        };
      }
      if (!workerId) return;

      assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
      const id = `TASK-${String(taskSequence).padStart(3, "0")}`;
      taskSequence += 1;
      const task = createTask({
        id,
        planId,
        projectId: ctx.normalizeText(project?.id),
        projectName: ctx.normalizeText(project?.name),
        projectDirectory: ctx.normalizeText(project?.directory),
        title: taskDraft.title,
        description: taskDraft.description,
        palId: workerId,
      });
      ctx.tasks.push(task);
      createdTasks.push(task);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(explanation);
      const workerDisplayName = displayName(workerId, workerId);
      const summaryJa = routingExplanation.ja
        ? `${task.id} を ${workerDisplayName} に割り当てました (${routingExplanation.ja})。`
        : `${task.id} を ${workerDisplayName} に割り当てました。`;
      const summaryEn = routingExplanation.en
        ? `${task.id} dispatched to ${workerDisplayName} (${routingExplanation.en}).`
        : `${task.id} dispatched to ${workerDisplayName}.`;
      ctx.appendEvent("dispatch", task.id, "ok", summaryJa, summaryEn);
      void ctx.appendTaskProgressLogForTarget("task", task.id, "dispatch", {
        planId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: summaryJa,
        messageEn: summaryEn,
        payload: {
          workerId,
          routingExplanation,
        },
      });
    });

    jobList.forEach((jobPlan, index) => {
      const explicitWorker = workers.find((worker) => worker.id === ctx.normalizeText(jobPlan?.assigneePalId)) || null;
      const jobDraft = {
        title: ctx.normalizeText(jobPlan?.title) || `Job ${index + 1}`,
        description: ctx.normalizeText(jobPlan?.description),
        instruction: ctx.normalizeText(jobPlan?.instruction),
      };
      if (!jobDraft.description || !jobDraft.instruction) return;

      let workerId = ctx.normalizeText(explicitWorker?.id);
      let explanation = null;
      if (workerId) {
        explanation = {
          matchedRoleTerms: ["explicit_assignee"],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedSkills: [],
        };
      } else if (routingApi && typeof routingApi.selectWorkerForTask === "function") {
        const selected = routingApi.selectWorkerForTask({
          taskDraft: {
            title: jobDraft.title,
            description: `${jobDraft.description}\n${jobDraft.instruction}`,
          },
          workers,
          assignmentCounts,
          requiredSkills: Array.isArray(jobPlan?.requiredSkills) ? jobPlan.requiredSkills : [],
        });
        workerId = ctx.normalizeText(selected?.workerId);
        explanation = {
          matchedSkills: Array.isArray(selected?.matchedSkills) ? selected.matchedSkills : [],
          matchedResidentFocus: Array.isArray(selected?.matchedResidentFocus) ? selected.matchedResidentFocus : [],
          matchedPreferredOutputs: Array.isArray(selected?.matchedPreferredOutputs) ? selected.matchedPreferredOutputs : [],
          matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
        };
      }
      if (!workerId) {
        workerId = ctx.normalizeText(workers[index % workers.length]?.id);
        explanation = {
          matchedSkills: [],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedRoleTerms: [],
        };
      }
      if (!workerId) return;

      assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
      const id = `JOB-${String(jobSequence).padStart(3, "0")}`;
      jobSequence += 1;
      const createJobRecord = typeof ctx.createJobRecord === "function" ? ctx.createJobRecord : null;
      if (!createJobRecord) return;
      const job = createJobRecord({
        id,
        planId,
        projectId: ctx.normalizeText(project?.id),
        projectName: ctx.normalizeText(project?.name),
        projectDirectory: ctx.normalizeText(project?.directory),
        title: jobDraft.title,
        description: jobDraft.description,
        instruction: jobDraft.instruction,
        schedule: ctx.normalizeText(jobPlan?.schedule),
        palId: workerId,
      });
      ctx.jobs.push(job);
      createdJobs.push(job);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(explanation);
      const workerDisplayName = displayName(workerId, workerId);
      const summaryJa = routingExplanation.ja
        ? `${job.id} を ${workerDisplayName} に割り当てました (${routingExplanation.ja})。`
        : `${job.id} を ${workerDisplayName} に割り当てました。`;
      const summaryEn = routingExplanation.en
        ? `${job.id} dispatched to ${workerDisplayName} (${routingExplanation.en}).`
        : `${job.id} dispatched to ${workerDisplayName}.`;
      ctx.appendEvent("dispatch", job.id, "ok", summaryJa, summaryEn);
      void ctx.appendTaskProgressLogForTarget("job", job.id, "dispatch", {
        planId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: summaryJa,
        messageEn: summaryEn,
        payload: {
          workerId,
          routingExplanation,
        },
      });
    });

    if (createdTasks.length > 0 && !ctx.getSelectedTaskId()) {
      ctx.setSelectedTaskId(createdTasks[0].id);
    }
    ctx.renderTaskBoard();
    ctx.renderJobBoard();
    ctx.writeBoardStateSnapshot();
    return { created: createdTasks.length + createdJobs.length, createdTasks, createdJobs };
  }

  async function materializeApprovedPlanArtifact(ctx, artifact) {
    const normalizedPlanId = ctx.normalizeText(artifact?.planId);
    const status = ctx.normalizeText(artifact?.status || "approved");
    const plan = artifact?.plan && typeof artifact.plan === "object" ? artifact.plan : null;
    if (!normalizedPlanId || status !== "approved" || !plan) {
      return { created: 0 };
    }
    const orchestratorApi = ctx.resolvePlanOrchestratorApi();
    if (!orchestratorApi) {
      return createPlannedTasksFromGuidePlan(ctx, plan, {
        planId: normalizedPlanId,
      });
    }
    const workers = await ctx.resolveWorkerAssignmentProfiles();
    if (workers.length === 0) return { created: 0 };
    const buildRoutingApi = typeof ctx.buildPlanOrchestratorRoutingApiForExecution === "function"
      ? ctx.buildPlanOrchestratorRoutingApiForExecution
      : (baseRoutingApi) => baseRoutingApi || null;
    const routingApi = buildRoutingApi(ctx.resolveAgentRoutingApi());
    const result = await orchestratorApi.materializePlanArtifact({
      artifact,
      workers,
      nextTaskSequence: ctx.nextTaskSequenceNumber(),
      nextJobSequence: ctx.nextJobSequenceNumber(),
      routingApi,
      buildTaskRecord: (input) => (typeof ctx.createTaskRecordForExecution === "function" ? ctx.createTaskRecordForExecution(input) : createTaskRecord(ctx, input)),
      buildJobRecord: (input) => ctx.createJobRecord(input),
    });
    const createdTasks = Array.isArray(result?.createdTasks) ? result.createdTasks : [];
    const createdJobs = Array.isArray(result?.createdJobs) ? result.createdJobs : [];
    const created = [];
    const buildRerouteMessage = typeof ctx.buildRerouteConversationMessageForExecution === "function"
      ? ctx.buildRerouteConversationMessageForExecution
      : () => ({ messageJa: "", messageEn: "" });
    const displayName = typeof ctx.residentDisplayNameForExecution === "function"
      ? ctx.residentDisplayNameForExecution
      : (_workerId, fallback = "") => ctx.normalizeText(fallback);
    createdTasks.forEach((entry) => {
      const task = entry?.task;
      if (!task || typeof task !== "object") return;
      ctx.tasks.push(task);
      created.push(task);
      const workerId = ctx.normalizeText(entry?.workerId || task.palId);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(entry?.explanation);
      const rerouteFromWorkerId = ctx.normalizeText(entry?.explanation?.rerouteFromWorkerId);
      const shouldLogReroute = ctx.normalizeText(entry?.explanation?.fallbackAction) === "reroute" && rerouteFromWorkerId && rerouteFromWorkerId !== workerId;
      if (shouldLogReroute) {
        const rerouteConversation = buildRerouteMessage(task, rerouteFromWorkerId, workerId);
        ctx.appendEvent("dispatch", task.id, "reroute", rerouteConversation.messageJa, rerouteConversation.messageEn);
        void ctx.appendTaskProgressLogForTarget("task", task.id, "reroute", {
          planId: normalizedPlanId,
          actualActor: "orchestrator",
          displayActor: "Guide",
          status: "ok",
          messageJa: rerouteConversation.messageJa,
          messageEn: rerouteConversation.messageEn,
          payload: {
            fromWorkerId: rerouteFromWorkerId,
            fromWorkerDisplayName: displayName(rerouteFromWorkerId, rerouteFromWorkerId),
            workerId,
            workerDisplayName: displayName(workerId, workerId),
            taskTitle: task.title,
            taskDescription: task.description,
          },
        });
      }
      const summaryJa = routingExplanation.ja
        ? `${task.id} を ${displayName(workerId, workerId)} に割り当てました (${routingExplanation.ja})。`
        : `${task.id} を ${displayName(workerId, workerId)} に割り当てました。`;
      const summaryEn = routingExplanation.en
        ? `${task.id} dispatched to ${displayName(workerId, workerId)} (${routingExplanation.en}).`
        : `${task.id} dispatched to ${displayName(workerId, workerId)}.`;
      ctx.appendEvent("dispatch", task.id, "ok", summaryJa, summaryEn);
      void ctx.appendTaskProgressLogForTarget("task", task.id, "dispatch", {
        planId: normalizedPlanId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: summaryJa,
        messageEn: summaryEn,
        payload: {
          workerId,
          routingExplanation,
        },
      });
    });
    createdJobs.forEach((entry) => {
      const job = entry?.job;
      if (!job || typeof job !== "object") return;
      ctx.jobs.push(job);
      const workerId = ctx.normalizeText(entry?.workerId || job.palId);
      const routingExplanation = ctx.formatWorkerRoutingExplanation(entry?.explanation);
      const summaryJa = routingExplanation.ja
        ? `${job.id} を ${displayName(workerId, workerId)} に割り当てました (${routingExplanation.ja})。`
        : `${job.id} を ${displayName(workerId, workerId)} に割り当てました。`;
      const summaryEn = routingExplanation.en
        ? `${job.id} dispatched to ${displayName(workerId, workerId)} (${routingExplanation.en}).`
        : `${job.id} dispatched to ${displayName(workerId, workerId)}.`;
      ctx.appendEvent("dispatch", job.id, "ok", summaryJa, summaryEn);
      void ctx.appendTaskProgressLogForTarget("job", job.id, "dispatch", {
        planId: normalizedPlanId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: summaryJa,
        messageEn: summaryEn,
        payload: {
          workerId,
          routingExplanation,
        },
      });
    });
    if (created.length > 0 && !ctx.getSelectedTaskId()) {
      ctx.setSelectedTaskId(created[0].id);
    }
    ctx.renderTaskBoard();
    ctx.renderJobBoard();
    ctx.writeBoardStateSnapshot();
    return {
      created: createdTasks.length + createdJobs.length,
      createdTasks: createdTasks.map((entry) => entry?.task).filter(Boolean),
      createdJobs: createdJobs.map((entry) => entry?.job).filter(Boolean),
    };
  }

  const api = {
    createTaskRecord,
    createPlannedTasksFromGuideRequest,
    createPlannedTasksFromGuidePlan,
    materializeApprovedPlanArtifact,
  };

  scope.ExecutionRuntimePlanUi = api;
  if (scope.window && typeof scope.window === "object") {
    scope.window.ExecutionRuntimePlanUi = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
