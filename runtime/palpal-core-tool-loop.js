const {
  normalizeText,
  runtimeDebugLog,
  safeStringify,
  summarizeValueForDebug,
} = require("./palpal-core-provider");

const DEFAULT_TOOL_LOOP_MAX_TURNS = 4;
const MAX_TOOL_TEXT_CHARS = 1600;

function truncateText(text, maxLength = MAX_TOOL_TEXT_CHARS) {
  const value = String(text || "");
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}\n...(truncated)`;
}

function toJsonObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}
function normalizeRequestedToolCall(call) {
  const toolName = normalizeText(call?.toolName || call?.tool_name || call?.name);
  const args = toJsonObject(call?.args);
  return { toolName, args };
}

async function executeRequestedToolCalls(params) {
  const toolMap = new Map(params.tools.map((tool) => [tool.name, tool]));
  const executed = [];
  const requestedCalls = Array.isArray(params.requestedCalls) ? params.requestedCalls : [];
  for (const rawCall of requestedCalls) {
    const requested = normalizeRequestedToolCall(rawCall);
    if (!requested.toolName) continue;
    runtimeDebugLog("tool-call requested", {
      tool: requested.toolName,
      args: summarizeValueForDebug(requested.args),
    });
    const tool = toolMap.get(requested.toolName);
    if (!tool || typeof tool.execute !== "function") {
      executed.push({
        tool_name: requested.toolName,
        tool_kind: "function",
        args: requested.args,
        output: { ok: false, error: `tool not found: ${requested.toolName}` },
      });
      runtimeDebugLog("tool-call missing", {
        tool: requested.toolName,
        args: summarizeValueForDebug(requested.args),
      });
      continue;
    }
    try {
      const output = await tool.execute(requested.args, {
        runId: "tomoshibi-kan",
        agent: params.agent,
        inputText: params.inputText,
      });
      executed.push({
        tool_name: requested.toolName,
        tool_kind: tool.kind || "function",
        args: requested.args,
        output,
      });
      runtimeDebugLog("tool-call executed", {
        tool: requested.toolName,
        ok: toJsonObject(output).ok === true,
        args: summarizeValueForDebug(requested.args),
        output: summarizeValueForDebug(output, 320),
      });
    } catch (error) {
      executed.push({
        tool_name: requested.toolName,
        tool_kind: tool.kind || "function",
        args: requested.args,
        output: {
          ok: false,
          error: normalizeText(error?.message) || "tool execution failed",
        },
      });
      runtimeDebugLog("tool-call failed", {
        tool: requested.toolName,
        args: summarizeValueForDebug(requested.args),
        error: normalizeText(error?.message) || "tool execution failed",
      });
    }
  }
  return executed;
}

function buildToolCallSignature(call) {
  const normalized = normalizeRequestedToolCall(call);
  const args = safeStringify(normalized.args, "{}");
  return `${normalized.toolName}::${args}`;
}

function buildPlannedCallLabels(plannedCalls) {
  return (Array.isArray(plannedCalls) ? plannedCalls : [])
    .map((call) => normalizeRequestedToolCall(call).toolName)
    .filter(Boolean);
}

function buildPlannedCallDebugEntries(plannedCalls) {
  return (Array.isArray(plannedCalls) ? plannedCalls : [])
    .map((call) => {
      const normalized = normalizeRequestedToolCall(call);
      if (!normalized.toolName) return null;
      return {
        tool: normalized.toolName,
        args: summarizeValueForDebug(normalized.args),
      };
    })
    .filter(Boolean);
}

function summarizeToolOutputForFallback(output) {
  if (typeof output === "string") return truncateText(output, 180);
  if (output && typeof output === "object") {
    const record = output;
    const text =
      normalizeText(record.snippet) ||
      normalizeText(record.title) ||
      normalizeText(record.note) ||
      normalizeText(record.error) ||
      safeStringify(output, "");
    return truncateText(text, 180);
  }
  return truncateText(String(output || ""), 180);
}

function findLatestSuccessfulFileRead(executedCalls) {
  const calls = Array.isArray(executedCalls) ? executedCalls : [];
  for (let index = calls.length - 1; index >= 0; index -= 1) {
    const call = calls[index];
    const toolName = normalizeText(call?.tool_name || call?.toolName);
    if (toolName !== "codex-file-read") continue;
    const output = toJsonObject(call?.output);
    if (output.ok !== true) continue;
    const content = normalizeText(output.content);
    if (!content) continue;
    return {
      path: normalizeText(output.path || call?.args?.path),
      content,
    };
  }
  return null;
}

function findLatestFailedFileRead(executedCalls) {
  const calls = Array.isArray(executedCalls) ? executedCalls : [];
  for (let index = calls.length - 1; index >= 0; index -= 1) {
    const call = calls[index];
    const toolName = normalizeText(call?.tool_name || call?.toolName);
    if (toolName !== "codex-file-read") continue;
    const output = toJsonObject(call?.output);
    if (output.ok === true) continue;
    const errorText = normalizeText(output.error).toLowerCase();
    if (!errorText) continue;
    if (errorText.includes("file not found") || errorText.includes("outside workspace root")) {
      return {
        path: normalizeText(output.path || call?.args?.path),
        error: normalizeText(output.error),
      };
    }
  }
  return null;
}

function normalizeComparablePath(rawPath) {
  const value = normalizeText(rawPath);
  if (!value) return "";
  return process.platform === "win32" ? value.toLowerCase() : value;
}

function isFileReadNotFoundError(call) {
  const toolName = normalizeText(call?.tool_name || call?.toolName);
  if (toolName !== "codex-file-read") return false;
  const output = toJsonObject(call?.output);
  if (output.ok === true) return false;
  const errorText = normalizeText(output.error).toLowerCase();
  return errorText.includes("file not found") || errorText.includes("outside workspace root");
}

function findRepeatedNotFoundFileRead(executedCalls) {
  const latest = findLatestFailedFileRead(executedCalls);
  if (!latest) return null;
  const targetPath = normalizeComparablePath(latest.path);
  if (!targetPath) return null;
  const calls = Array.isArray(executedCalls) ? executedCalls : [];
  let seen = 0;
  for (let index = calls.length - 1; index >= 0; index -= 1) {
    const call = calls[index];
    if (!isFileReadNotFoundError(call)) continue;
    const output = toJsonObject(call?.output);
    const callPath = normalizeComparablePath(output.path || call?.args?.path);
    if (callPath !== targetPath) continue;
    seen += 1;
    if (seen >= 2) {
      return latest;
    }
  }
  return null;
}

function buildToolLoopFallbackText(inputText, executedCalls, stopReason, trace) {
  const reasonText = stopReason === "repeated_plan"
    ? "repeated tool plans"
    : stopReason === "repeated_file_read_not_found"
      ? "repeated file-read not found"
      : "max turns reached";
  const recoveredRead = findLatestSuccessfulFileRead(executedCalls);
  if (recoveredRead) {
    return [
      `Tool loop stopped (${reasonText}) before final response.`,
      `Recovered file read: ${recoveredRead.path || "(unknown path)"}`,
      recoveredRead.content,
    ].join("\n");
  }
  const failedRead = findLatestFailedFileRead(executedCalls);
  if (failedRead) {
    return [
      `Tool loop stopped (${reasonText}) before final response.`,
      "Requested file could not be read.",
      failedRead.path ? `Path: ${failedRead.path}` : "",
      failedRead.error ? `Reason: ${failedRead.error}` : "",
    ].filter(Boolean).join("\n");
  }

  const latestCall = Array.isArray(executedCalls) && executedCalls.length > 0
    ? executedCalls[executedCalls.length - 1]
    : null;
  const latestToolName = normalizeText(latestCall?.tool_name || latestCall?.toolName);
  const latestSummary = summarizeToolOutputForFallback(latestCall?.output);
  const traceSummary = Array.isArray(trace)
    ? trace
      .map((entry) => `t${entry.turn}:${(entry.plannedTools || []).join(",") || "-"}`)
      .join(" | ")
    : "";
  const user = normalizeText(inputText);
  const userPreview = user.length > 120 ? `${user.slice(0, 120)}...` : user;
  if (!latestToolName) {
    return `Tool loop stopped (${reasonText}) before final response. Request: ${userPreview}`;
  }
  return [
    `Tool loop stopped (${reasonText}) before final response.`,
    `Latest tool: ${latestToolName}`,
    latestSummary ? `Latest output: ${latestSummary}` : "",
    traceSummary ? `Trace: ${traceSummary}` : "",
  ].filter(Boolean).join("\n");
}

async function runModelToolLoop(params) {
  const maxTurnsRaw = Number(params.maxTurns);
  const maxTurns = Number.isFinite(maxTurnsRaw)
    ? Math.max(1, Math.min(8, Math.floor(maxTurnsRaw)))
    : DEFAULT_TOOL_LOOP_MAX_TURNS;
  let executedCalls = [];
  let previousPlanSignature = "";
  let repeatedPlanCount = 0;
  const trace = [];
  for (let turn = 0; turn < maxTurns; turn += 1) {
    const generated = await params.model.generate({
      agent: params.agent,
      inputText: params.inputText,
      toolCalls: executedCalls,
    });
    const plannedCalls = Array.isArray(generated?.toolCalls) ? generated.toolCalls : [];
    const plannedTools = buildPlannedCallLabels(plannedCalls);
    const plannedCallDetails = buildPlannedCallDebugEntries(plannedCalls);
    trace.push({
      turn: turn + 1,
      plannedTools,
      executedCount: executedCalls.length,
    });
    runtimeDebugLog("tool-loop turn", {
      turn: turn + 1,
      plannedTools,
      plannedCallDetails,
      executedCount: executedCalls.length,
    });
    if (plannedCalls.length === 0) {
      const outputText = normalizeText(generated?.outputText);
      if (outputText) {
        return {
          outputText,
          toolCalls: executedCalls,
          loopStopReason: "completed",
          loopTrace: trace,
        };
      }
      if (executedCalls.length > 0) {
        return {
          outputText: `Executed ${executedCalls.length} tool call(s).`,
          toolCalls: executedCalls,
          loopStopReason: "completed_no_text",
          loopTrace: trace,
        };
      }
      return {
        outputText: "",
        toolCalls: [],
        loopStopReason: "completed_empty",
        loopTrace: trace,
      };
    }
    const planSignature = plannedCalls.map(buildToolCallSignature).join("|");
    if (planSignature && planSignature === previousPlanSignature) {
      repeatedPlanCount += 1;
    } else {
      repeatedPlanCount = 0;
      previousPlanSignature = planSignature;
    }
    if (repeatedPlanCount >= 1) {
      runtimeDebugLog("tool-loop stopped by repeated plan", {
        turn: turn + 1,
        plannedTools,
        plannedCallDetails,
        repeatedPlanCount,
        planSignature: truncateText(planSignature, 320),
      });
      return {
        outputText: buildToolLoopFallbackText(
          params.inputText,
          executedCalls,
          "repeated_plan",
          trace
        ),
        toolCalls: executedCalls,
        loopStopReason: "repeated_plan",
        loopTrace: trace,
      };
    }
    const executed = await executeRequestedToolCalls({
      tools: params.tools,
      requestedCalls: plannedCalls,
      agent: params.agent,
      inputText: params.inputText,
    });
    executedCalls = [...executedCalls, ...executed];
    const repeatedMissingRead = findRepeatedNotFoundFileRead(executedCalls);
    if (repeatedMissingRead) {
      runtimeDebugLog("tool-loop stopped by repeated file-read not found", {
        turn: turn + 1,
        path: repeatedMissingRead.path,
        error: repeatedMissingRead.error,
      });
      return {
        outputText: buildToolLoopFallbackText(
          params.inputText,
          executedCalls,
          "repeated_file_read_not_found",
          trace
        ),
        toolCalls: executedCalls,
        loopStopReason: "repeated_file_read_not_found",
        loopTrace: trace,
      };
    }
  }
  runtimeDebugLog("tool-loop stopped by max turns", {
    maxTurns,
    executedCount: executedCalls.length,
    trace,
  });
  return {
    outputText: buildToolLoopFallbackText(
      params.inputText,
      executedCalls,
      "max_turns",
      trace
    ),
    toolCalls: executedCalls,
    loopStopReason: "max_turns",
    loopTrace: trace,
  };
}
module.exports = {
  runModelToolLoop,
};

