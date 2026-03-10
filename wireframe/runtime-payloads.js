(() => {
  function pickLocaleText(text, locale) {
    if (typeof text === "string") return text;
    if (!text || typeof text !== "object") return "";
    return String(text?.[locale] || text?.ja || text?.en || "");
  }

  function resolveContextHandoffPolicy(context) {
    return context.normalizeContextHandoffPolicy(context.settingsState.contextHandoffPolicy);
  }

  function buildCompressedHistorySummary(context, target, targetKind = "task") {
    const summaries = [];
    const latestGuideMessages = Array.isArray(context.guideMessages) ? context.guideMessages.slice(-3) : [];
    latestGuideMessages.forEach((message) => {
      const sender = context.normalizeText(message?.sender || message?.role || "system");
      const content = context.normalizeText(
        typeof message?.content === "string"
          ? message.content
          : (typeof message?.text === "string" ? message.text : pickLocaleText(message?.text, context.locale))
      );
      if (!content) return;
      const preview = content.length > 96 ? `${content.slice(0, 93)}...` : content;
      summaries.push(`guide-${sender}: ${preview}`);
    });
    const targetSummary = context.normalizeText(target?.description || target?.instruction);
    if (targetSummary) {
      summaries.push(`${targetKind}-card: ${targetSummary.length > 96 ? `${targetSummary.slice(0, 93)}...` : targetSummary}`);
    }
    const gateReason = context.normalizeText(target?.gateResult?.reason);
    if (gateReason && gateReason !== "-") {
      summaries.push(`reject-history: ${gateReason.length > 96 ? `${gateReason.slice(0, 93)}...` : gateReason}`);
    }
    return summaries.slice(0, 4);
  }

  function buildWorkerExecutionConstraints(context, target) {
    const constraints = [];
    const checkResult = context.normalizeText(target?.constraintsCheckResult);
    if (checkResult && checkResult !== "-") {
      constraints.push(`constraints_check_result: ${checkResult}`);
    }
    const gateFixes = Array.isArray(target?.gateResult?.fixes)
      ? target.gateResult.fixes.map((item) => context.normalizeText(item)).filter(Boolean)
      : [];
    if (gateFixes.length > 0) {
      gateFixes.forEach((item) => constraints.push(`fix: ${item}`));
    } else {
      const fixCondition = context.normalizeText(target?.fixCondition);
      if (fixCondition && fixCondition !== "-") {
        constraints.push(`fix_condition: ${fixCondition}`);
      }
    }
    return constraints;
  }

  function buildWorkerExpectedOutput(context, targetKind = "task") {
    if (context.locale === "en") {
      return targetKind === "job"
        ? "Complete the scheduled job, summarize the result, and provide evidence for gate review."
        : "Complete the task and provide evidence for gate review.";
    }
    return targetKind === "job"
      ? "Cron を実行し、結果要約と Gate 審査用の evidence を返す。"
      : "Task を完了し、Gate 審査用の evidence を返す。";
  }

  function buildWorkerProjectContext(context) {
    const focus = context.focusedProject();
    if (!focus) return "";
    return `focus_project: ${focus.name}\nfocus_directory: ${focus.directory}`;
  }

  function buildWorkerHandoffSummary(context, target, targetKind = "task", pal = null, gateProfile = null) {
    const sourceRefs = [targetKind === "job" ? "job-card" : "task-card"];
    const gateFixes = Array.isArray(target?.gateResult?.fixes)
      ? target.gateResult.fixes.map((item) => context.normalizeText(item)).filter(Boolean)
      : [];
    if (gateFixes.length > 0 || (context.normalizeText(target?.fixCondition) && context.normalizeText(target?.fixCondition) !== "-")) {
      sourceRefs.push("reject-history");
    }
    const title = context.normalizeText(target?.title || target?.id || "");
    const description = context.normalizeText(target?.description || target?.instruction || "");
    const gateName = context.normalizeText(gateProfile?.displayName || gateProfile?.id);
    const palName = context.normalizeText(pal?.displayName || pal?.id || target?.palId);
    const goal = description || title || context.normalizeText(target?.id);
    const decisionContext = context.locale === "en"
      ? `Assigned to ${palName || "worker"} and reviewed by ${gateName || "default gate"}.`
      : `${palName || "担当Pal"} が実行し、${gateName || "既定Gate"} が審査する。`;
    const risks = [];
    if (gateFixes.length > 0) {
      risks.push(...gateFixes);
    } else {
      const fixCondition = context.normalizeText(target?.fixCondition);
      if (fixCondition && fixCondition !== "-") risks.push(fixCondition);
    }
    const openQuestions = [];
    if (!description) {
      openQuestions.push(context.locale === "en" ? "Instruction detail is minimal." : "指示詳細が少ない。");
    }
    return {
      goal,
      decisionContext,
      risks,
      openQuestions,
      sourceRefs,
    };
  }

  function buildWorkerExecutionInput(context, target, targetKind = "task") {
    const gateProfile = context.resolveGateProfileForTarget(target);
    const pal = context.palProfiles.find((entry) => entry.id === context.normalizeText(target?.palId)) || null;
    const instruction = context.normalizeText(
      targetKind === "job"
        ? (target?.instruction || target?.description || target?.title || target?.id)
        : (target?.description || target?.title || target?.id)
    );
    const policy = resolveContextHandoffPolicy(context);
    const input = {
      targetType: targetKind,
      targetId: context.normalizeText(target?.id),
      title: context.normalizeText(target?.title || target?.id || ""),
      instruction,
      constraints: buildWorkerExecutionConstraints(context, target),
      expectedOutput: buildWorkerExpectedOutput(context, targetKind),
      assigneePalId: context.normalizeText(target?.palId),
      gateProfileId: context.normalizeText(gateProfile?.id),
      projectContext: buildWorkerProjectContext(context),
    };
    if (policy !== "minimal") {
      input.handoffSummary = buildWorkerHandoffSummary(context, target, targetKind, pal, gateProfile);
    }
    if (policy === "verbose") {
      input.compressedHistorySummary = buildCompressedHistorySummary(context, target, targetKind);
    }
    return input;
  }

  function buildWorkerExecutionUserText(context, executionInput) {
    const labels = context.locale === "en"
      ? {
        header: "[WorkerExecutionInput]",
        targetType: "target_type",
        targetId: "target_id",
        title: "title",
        instruction: "instruction",
        constraints: "constraints",
        expectedOutput: "expected_output",
        assigneePalId: "assignee_pal_id",
        gateProfileId: "gate_profile_id",
        projectContext: "project_context",
        handoffSummary: "[HandoffSummary]",
        compressedHistorySummary: "[CompressedHistorySummary]",
        goal: "goal",
        decisionContext: "decision_context",
        risks: "risks",
        openQuestions: "open_questions",
        sourceRefs: "source_refs",
        none: "- none",
      }
      : {
        header: "[WorkerExecutionInput]",
        targetType: "target_type",
        targetId: "target_id",
        title: "title",
        instruction: "instruction",
        constraints: "constraints",
        expectedOutput: "expected_output",
        assigneePalId: "assignee_pal_id",
        gateProfileId: "gate_profile_id",
        projectContext: "project_context",
        handoffSummary: "[HandoffSummary]",
        compressedHistorySummary: "[CompressedHistorySummary]",
        goal: "goal",
        decisionContext: "decision_context",
        risks: "risks",
        openQuestions: "open_questions",
        sourceRefs: "source_refs",
        none: "- なし",
      };
    const lines = [
      labels.header,
      `${labels.targetType}: ${executionInput.targetType}`,
      `${labels.targetId}: ${executionInput.targetId}`,
      `${labels.title}: ${executionInput.title}`,
      `${labels.instruction}:`,
      executionInput.instruction || "-",
      `${labels.constraints}:`,
    ];
    if (Array.isArray(executionInput.constraints) && executionInput.constraints.length > 0) {
      executionInput.constraints.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(labels.none);
    }
    lines.push(`${labels.expectedOutput}:`);
    lines.push(executionInput.expectedOutput || "-");
    lines.push(`${labels.assigneePalId}: ${executionInput.assigneePalId || "-"}`);
    lines.push(`${labels.gateProfileId}: ${executionInput.gateProfileId || "-"}`);
    if (context.normalizeText(executionInput.projectContext)) {
      lines.push(`${labels.projectContext}:`);
      lines.push(executionInput.projectContext);
    }
    const summary = executionInput.handoffSummary;
    if (summary && typeof summary === "object") {
      lines.push("");
      lines.push(labels.handoffSummary);
      lines.push(`${labels.goal}: ${context.normalizeText(summary.goal) || "-"}`);
      lines.push(`${labels.decisionContext}: ${context.normalizeText(summary.decisionContext) || "-"}`);
      lines.push(`${labels.risks}:`);
      if (Array.isArray(summary.risks) && summary.risks.length > 0) {
        summary.risks.forEach((item) => lines.push(`- ${item}`));
      } else {
        lines.push(labels.none);
      }
      lines.push(`${labels.openQuestions}:`);
      if (Array.isArray(summary.openQuestions) && summary.openQuestions.length > 0) {
        summary.openQuestions.forEach((item) => lines.push(`- ${item}`));
      } else {
        lines.push(labels.none);
      }
      lines.push(`${labels.sourceRefs}:`);
      if (Array.isArray(summary.sourceRefs) && summary.sourceRefs.length > 0) {
        summary.sourceRefs.forEach((item) => lines.push(`- ${item}`));
      } else {
        lines.push(labels.none);
      }
    }
    if (Array.isArray(executionInput.compressedHistorySummary) && executionInput.compressedHistorySummary.length > 0) {
      lines.push("");
      lines.push(labels.compressedHistorySummary);
      executionInput.compressedHistorySummary.forEach((item) => lines.push(`- ${item}`));
    }
    return lines.join("\n");
  }

  function buildPalRuntimeUserText(context, target, targetKind = "task") {
    return buildWorkerExecutionUserText(context, buildWorkerExecutionInput(context, target, targetKind));
  }

  function hashTextForVersion(context, value, prefix = "content") {
    const source = context.normalizeText(value);
    if (!source) return "none";
    let hash = 0;
    for (let index = 0; index < source.length; index += 1) {
      hash = ((hash * 31) + source.charCodeAt(index)) >>> 0;
    }
    return `${prefix}-${hash.toString(16)}`;
  }

  function buildDebugIdentityVersions(context, identity) {
    return {
      soulVersion: hashTextForVersion(context, identity?.soul || "", "soul"),
      roleVersion: hashTextForVersion(context, identity?.role || "", "role"),
      rubricVersion: hashTextForVersion(context, identity?.rubric || "", "rubric"),
    };
  }

  function buildGateRejectHistorySummary(context, target) {
    const items = [];
    const reason = context.normalizeText(target?.gateResult?.reason);
    if (reason && reason !== "-") items.push(reason);
    const fixes = Array.isArray(target?.gateResult?.fixes)
      ? target.gateResult.fixes.map((item) => context.normalizeText(item)).filter(Boolean)
      : [];
    fixes.forEach((item) => items.push(`fix: ${item}`));
    const fixCondition = context.normalizeText(target?.fixCondition);
    if (items.length === 0 && fixCondition && fixCondition !== "-") {
      items.push(fixCondition);
    }
    return items.slice(0, 4);
  }

  function buildGateReviewInput(context, target, targetKind = "task", gateProfile = null, identity = null) {
    const policy = resolveContextHandoffPolicy(context);
    const reviewInput = {
      targetType: targetKind,
      targetId: context.normalizeText(target?.id),
      title: context.normalizeText(target?.title || target?.id || ""),
      instruction: context.normalizeText(
        targetKind === "job"
          ? (target?.instruction || target?.description || target?.title || target?.id)
          : (target?.description || target?.title || target?.id)
      ),
      constraints: buildWorkerExecutionConstraints(context, target),
      expectedOutput: buildWorkerExpectedOutput(context, targetKind),
      submission: context.normalizeText(target?.evidence || ""),
      ritual: {
        evidence: context.normalizeText(target?.evidence || ""),
        replay: context.normalizeText(target?.replay || ""),
      },
      gateProfileId: context.normalizeText(gateProfile?.id),
      rubricVersion: hashTextForVersion(context, identity?.rubric || "", "rubric"),
    };
    if (policy !== "minimal") {
      const pal = context.palProfiles.find((entry) => entry.id === context.normalizeText(target?.palId)) || null;
      reviewInput.handoffSummary = buildWorkerHandoffSummary(context, target, targetKind, pal, gateProfile);
    }
    const rejectHistorySummary = buildGateRejectHistorySummary(context, target);
    if (rejectHistorySummary.length > 0) {
      reviewInput.rejectHistorySummary = rejectHistorySummary;
    }
    if (policy === "verbose") {
      reviewInput.compressedHistorySummary = buildCompressedHistorySummary(context, target, targetKind);
    }
    return reviewInput;
  }

  function buildGateReviewUserText(context, reviewInput) {
    const labels = context.locale === "en"
      ? {
        header: "[GateReviewInput]",
        targetType: "target_type",
        targetId: "target_id",
        title: "title",
        instruction: "instruction",
        constraints: "constraints",
        expectedOutput: "expected_output",
        submission: "submission",
        ritual: "[CompletionRitual]",
        evidence: "evidence",
        replay: "replay",
        gateProfileId: "gate_profile_id",
        rubricVersion: "rubric_version",
        handoffSummary: "[HandoffSummary]",
        compressedHistorySummary: "[CompressedHistorySummary]",
        rejectHistorySummary: "[RejectHistorySummary]",
        goal: "goal",
        decisionContext: "decision_context",
        risks: "risks",
        openQuestions: "open_questions",
        sourceRefs: "source_refs",
        outputFormat: "[OutputFormat]",
        none: "- none",
        outputRule: 'Return compact JSON only: {"decision":"approved|rejected","reason":"...","fixes":["..."]}',
      }
      : {
        header: "[GateReviewInput]",
        targetType: "target_type",
        targetId: "target_id",
        title: "title",
        instruction: "instruction",
        constraints: "constraints",
        expectedOutput: "expected_output",
        submission: "submission",
        ritual: "[CompletionRitual]",
        evidence: "evidence",
        replay: "replay",
        gateProfileId: "gate_profile_id",
        rubricVersion: "rubric_version",
        handoffSummary: "[HandoffSummary]",
        compressedHistorySummary: "[CompressedHistorySummary]",
        rejectHistorySummary: "[RejectHistorySummary]",
        goal: "goal",
        decisionContext: "decision_context",
        risks: "risks",
        openQuestions: "open_questions",
        sourceRefs: "source_refs",
        outputFormat: "[OutputFormat]",
        none: "- なし",
        outputRule: 'JSONのみで返す: {"decision":"approved|rejected","reason":"...","fixes":["..."]}',
      };
    const lines = [
      labels.header,
      `${labels.targetType}: ${reviewInput.targetType}`,
      `${labels.targetId}: ${reviewInput.targetId}`,
      `${labels.title}: ${reviewInput.title}`,
      `${labels.instruction}:`,
      reviewInput.instruction || "-",
      `${labels.constraints}:`,
    ];
    if (Array.isArray(reviewInput.constraints) && reviewInput.constraints.length > 0) {
      reviewInput.constraints.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(labels.none);
    }
    lines.push(`${labels.expectedOutput}:`);
    lines.push(reviewInput.expectedOutput || "-");
    lines.push(`${labels.submission}:`);
    lines.push(reviewInput.submission || labels.none);
    lines.push("");
    lines.push(labels.ritual);
    lines.push(`${labels.evidence}:`);
    lines.push(reviewInput.ritual?.evidence || labels.none);
    lines.push(`${labels.replay}:`);
    lines.push(reviewInput.ritual?.replay || labels.none);
    lines.push(`${labels.gateProfileId}: ${reviewInput.gateProfileId || "-"}`);
    lines.push(`${labels.rubricVersion}: ${reviewInput.rubricVersion || "-"}`);
    if (reviewInput.handoffSummary && typeof reviewInput.handoffSummary === "object") {
      const summary = reviewInput.handoffSummary;
      lines.push("");
      lines.push(labels.handoffSummary);
      lines.push(`${labels.goal}: ${context.normalizeText(summary.goal) || "-"}`);
      lines.push(`${labels.decisionContext}: ${context.normalizeText(summary.decisionContext) || "-"}`);
      lines.push(`${labels.risks}:`);
      if (Array.isArray(summary.risks) && summary.risks.length > 0) {
        summary.risks.forEach((item) => lines.push(`- ${item}`));
      } else {
        lines.push(labels.none);
      }
      lines.push(`${labels.openQuestions}:`);
      if (Array.isArray(summary.openQuestions) && summary.openQuestions.length > 0) {
        summary.openQuestions.forEach((item) => lines.push(`- ${item}`));
      } else {
        lines.push(labels.none);
      }
      lines.push(`${labels.sourceRefs}:`);
      if (Array.isArray(summary.sourceRefs) && summary.sourceRefs.length > 0) {
        summary.sourceRefs.forEach((item) => lines.push(`- ${item}`));
      } else {
        lines.push(labels.none);
      }
    }
    if (Array.isArray(reviewInput.rejectHistorySummary) && reviewInput.rejectHistorySummary.length > 0) {
      lines.push("");
      lines.push(labels.rejectHistorySummary);
      reviewInput.rejectHistorySummary.forEach((item) => lines.push(`- ${item}`));
    }
    if (Array.isArray(reviewInput.compressedHistorySummary) && reviewInput.compressedHistorySummary.length > 0) {
      lines.push("");
      lines.push(labels.compressedHistorySummary);
      reviewInput.compressedHistorySummary.forEach((item) => lines.push(`- ${item}`));
    }
    lines.push("");
    lines.push(labels.outputFormat);
    lines.push(labels.outputRule);
    return lines.join("\n");
  }

  function parseGateRuntimeResponse(context, text) {
    const normalized = context.normalizeText(text);
    if (!normalized) return null;
    const fencedMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fencedMatch ? fencedMatch[1].trim() : normalized;
    const jsonMatch = candidate.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : candidate;
    try {
      const parsed = JSON.parse(jsonText);
      const decision = context.normalizeGateDecision(parsed?.decision || parsed?.result);
      const reason = context.normalizeText(parsed?.reason || parsed?.summary || parsed?.comment);
      const fixes = Array.isArray(parsed?.fixes)
        ? parsed.fixes.map((item) => context.normalizeText(item)).filter(Boolean)
        : context.parseGateFixes(parsed?.fixes || "");
      if (decision === "none") return null;
      return {
        decision,
        reason: reason || "-",
        fixes,
      };
    } catch (error) {
      const decision = context.normalizeGateDecision(
        /rejected|reject/i.test(normalized) ? "rejected"
          : (/approved|approve/i.test(normalized) ? "approved" : "")
      );
      if (decision === "none") return null;
      return {
        decision,
        reason: normalized,
        fixes: decision === "rejected" ? context.parseGateFixes(normalized) : [],
      };
    }
  }

  window.RuntimePayloadUi = {
    resolveContextHandoffPolicy,
    buildCompressedHistorySummary,
    buildWorkerExecutionConstraints,
    buildWorkerExpectedOutput,
    buildWorkerProjectContext,
    buildWorkerHandoffSummary,
    buildWorkerExecutionInput,
    buildWorkerExecutionUserText,
    buildPalRuntimeUserText,
    hashTextForVersion,
    buildDebugIdentityVersions,
    buildGateRejectHistorySummary,
    buildGateReviewInput,
    buildGateReviewUserText,
    parseGateRuntimeResponse,
  };
})();
