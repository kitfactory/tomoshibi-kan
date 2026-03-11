const fs = require("fs");
const path = require("path");
const {
  runCodexGuideCliCompletion,
  __setCliToolRuntimeBindingsForTest,
  __resetCliToolRuntimeBindingsForTest,
} = require("./cli-tool-runtime");
const palpalCore = require("palpal-core");
const {
  GUIDE_SYSTEM_PROMPT,
  normalizeText,
  runtimeDebugLog,
  safeStringify,
  summarizeValueForDebug,
  normalizeSkillIdList,
  normalizeProviderName,
  standardEnvValue,
  listCoreProviderModels,
  withProviderEnv,
  normalizeGuideMessages,
  buildGuideGenerateInput,
  requestStructuredGuideChatCompletion,
  __setProviderRuntimeBindingsForTest,
  __resetProviderRuntimeBindingsForTest,
  getProviderModel,
} = require("./palpal-core-provider");
const DEFAULT_TOOL_LOOP_MAX_TURNS = 4;
const MAX_TOOL_TEXT_CHARS = 1600;
const DEFAULT_FILE_SEARCH_MAX_RESULTS = 8;
const DEFAULT_FILE_SEARCH_MAX_FILES = 1200;
const FILE_SEARCH_MAX_FILE_BYTES = 256 * 1024;
const FILE_SEARCH_IGNORE_DIR_NAMES = new Set([
  ".git",
  ".idea",
  ".vscode",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  ".tomoshibikan",
  ".palpal",
]);
function toJsonObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

function truncateText(text, maxLength = MAX_TOOL_TEXT_CHARS) {
  const value = String(text || "");
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}\n...(truncated)`;
}

function stripHtmlTags(text) {
  return String(text || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHtmlTitle(htmlText) {
  const match = String(htmlText || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return "";
  return stripHtmlTags(match[1]);
}

function withTimeoutController(timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timer };
}

async function fetchTextWithTimeout(url, timeoutMs = 8000) {
  if (typeof fetch !== "function") {
    throw new Error("fetch is not available");
  }
  const { controller, timer } = withTimeoutController(timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "tomoshibikan-runtime/0.1",
      },
    });
    const body = await response.text();
    return {
      url: String(response.url || url),
      status: Number(response.status || 0),
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

function isPathInsideRoot(rootPath, targetPath) {
  const root = path.resolve(rootPath);
  const target = path.resolve(targetPath);
  const normalizedRoot = process.platform === "win32" ? root.toLowerCase() : root;
  const normalizedTarget = process.platform === "win32" ? target.toLowerCase() : target;
  return normalizedTarget === normalizedRoot || normalizedTarget.startsWith(`${normalizedRoot}${path.sep}`);
}

function normalizeWorkspacePathInput(rawPath) {
  return normalizeText(rawPath)
    .replace(/^@+/, "")
    .replace(/^["']+|["']+$/g, "");
}

function normalizePathSegmentForCompare(value) {
  const text = normalizeText(value);
  return process.platform === "win32" ? text.toLowerCase() : text;
}

function buildWorkspacePathCandidates(workspaceRoot, rawPath, fallbackPath = "") {
  const base = normalizeText(workspaceRoot) ? path.resolve(workspaceRoot) : process.cwd();
  const requested = normalizeWorkspacePathInput(rawPath) || normalizeText(fallbackPath);
  const normalizedRequested = requested.replace(/\\/g, "/").replace(/^\.?\//, "");
  const workspaceName = normalizeText(path.basename(base));
  const candidates = [];

  const pushCandidate = (value) => {
    const normalized = normalizeText(value);
    if (!normalized) return;
    if (candidates.includes(normalized)) return;
    candidates.push(normalized);
  };

  if (normalizeText(requested)) {
    pushCandidate(requested);
  } else if (normalizeText(fallbackPath)) {
    pushCandidate(fallbackPath);
  }

  if (normalizedRequested && workspaceName) {
    const parts = normalizedRequested.split("/").filter(Boolean);
    if (parts.length > 0) {
      const first = normalizePathSegmentForCompare(parts[0]);
      const workspaceCompare = normalizePathSegmentForCompare(workspaceName);
      if (first === workspaceCompare) {
        const stripped = parts.slice(1).join("/");
        if (stripped) pushCandidate(stripped);
        else pushCandidate(".");
      }
    }
  }

  if (candidates.length === 0) {
    pushCandidate(fallbackPath || ".");
  }

  return candidates;
}

function resolveWorkspaceFilePath(workspaceRoot, rawPath) {
  const base = normalizeText(workspaceRoot) ? path.resolve(workspaceRoot) : process.cwd();
  const candidates = buildWorkspacePathCandidates(base, rawPath);
  let fallbackAbsolute = null;
  for (const candidate of candidates) {
    const absolute = path.resolve(base, candidate);
    if (!isPathInsideRoot(base, absolute)) continue;
    if (fs.existsSync(absolute)) return absolute;
    if (!fallbackAbsolute) fallbackAbsolute = absolute;
  }
  return fallbackAbsolute;
}

function resolveWorkspaceDirectoryPath(workspaceRoot, rawPath) {
  const base = normalizeText(workspaceRoot) ? path.resolve(workspaceRoot) : process.cwd();
  const candidates = buildWorkspacePathCandidates(base, rawPath, ".");
  for (const candidate of candidates) {
    const absolute = path.resolve(base, candidate);
    if (!isPathInsideRoot(base, absolute)) continue;
    try {
      if (!fs.statSync(absolute).isDirectory()) continue;
      return absolute;
    } catch (_error) {
      // Continue to next candidate.
    }
  }
  return null;
}

function parseSearchInteger(value, fallback, minValue, maxValue) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.max(minValue, Math.min(maxValue, Math.floor(numberValue)));
}

function listWorkspaceFiles(rootPath, maxFiles) {
  const files = [];
  const pending = [rootPath];
  while (pending.length > 0 && files.length < maxFiles) {
    const currentDir = pending.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (_error) {
      continue;
    }
    for (const entry of entries) {
      const entryName = normalizeText(entry?.name);
      if (!entryName) continue;
      const absolute = path.join(currentDir, entryName);
      if (entry.isDirectory()) {
        if (FILE_SEARCH_IGNORE_DIR_NAMES.has(entryName.toLowerCase())) continue;
        pending.push(absolute);
        continue;
      }
      if (!entry.isFile()) continue;
      files.push(absolute);
      if (files.length >= maxFiles) break;
    }
  }
  return {
    files,
    truncated: pending.length > 0,
  };
}

function normalizePathForResponse(workspaceRoot, absolutePath) {
  const relative = path.relative(path.resolve(workspaceRoot), absolutePath);
  return relative ? relative.replace(/\\/g, "/") : ".";
}

function extractSearchSnippet(text, index) {
  const source = String(text || "");
  const start = Math.max(0, index - 80);
  const end = Math.min(source.length, index + 80);
  return truncateText(source.slice(start, end).replace(/\s+/g, " "), 180);
}

function createFileSearchTool(workspaceRoot) {
  return palpalCore.tool({
    name: "codex-file-search",
    description: "Search files by query in workspace.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        path: { type: "string" },
        maxResults: { type: "number" },
        maxFiles: { type: "number" },
      },
      required: ["query"],
    },
    execute: async (args) => {
      const query = normalizeWorkspacePathInput(args?.query || args?.keyword);
      if (!query) {
        return { ok: false, error: "query is required" };
      }
      const searchRoot = resolveWorkspaceDirectoryPath(workspaceRoot, args?.path || ".");
      if (!searchRoot) {
        return {
          ok: false,
          error: "path is outside workspace root or not found",
          path: normalizeWorkspacePathInput(args?.path || "."),
        };
      }
      const maxResults = parseSearchInteger(
        args?.maxResults,
        DEFAULT_FILE_SEARCH_MAX_RESULTS,
        1,
        20
      );
      const maxFiles = parseSearchInteger(args?.maxFiles, DEFAULT_FILE_SEARCH_MAX_FILES, 50, 4000);
      const listed = listWorkspaceFiles(searchRoot, maxFiles);
      const queryLower = query.toLowerCase();
      const matches = [];
      for (const absolutePath of listed.files) {
        const relativePath = normalizePathForResponse(workspaceRoot, absolutePath);
        const relativeLower = relativePath.toLowerCase();
        if (relativeLower.includes(queryLower)) {
          matches.push({
            path: relativePath,
            match: "path",
          });
        } else {
          let stat = null;
          try {
            stat = fs.statSync(absolutePath);
          } catch (_error) {
            stat = null;
          }
          if (!stat || stat.size > FILE_SEARCH_MAX_FILE_BYTES) {
            // Skip large files for predictable latency.
          } else {
            try {
              const content = fs.readFileSync(absolutePath, "utf8");
              const contentLower = content.toLowerCase();
              const contentIndex = contentLower.indexOf(queryLower);
              if (contentIndex >= 0) {
                matches.push({
                  path: relativePath,
                  match: "content",
                  snippet: extractSearchSnippet(content, contentIndex),
                });
              }
            } catch (_error) {
              // Ignore unreadable/binary files.
            }
          }
        }
        if (matches.length >= maxResults) break;
      }
      return {
        ok: true,
        query,
        path: normalizePathForResponse(workspaceRoot, searchRoot),
        matches,
        scannedFiles: listed.files.length,
        truncated: listed.truncated,
      };
    },
  });
}

function createFileReadTool(workspaceRoot) {
  return palpalCore.tool({
    name: "codex-file-read",
    description: "Read a file from workspace.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
        maxChars: { type: "number" },
      },
      required: ["path"],
    },
    execute: async (args) => {
      const filePath = normalizeWorkspacePathInput(args?.path || args?.filePath || args?.file);
      if (!filePath) {
        return { ok: false, error: "path is required" };
      }
      const absolutePath = resolveWorkspaceFilePath(workspaceRoot, filePath);
      if (!absolutePath) {
        return {
          ok: false,
          error: "path is outside workspace root",
          path: filePath,
          workspaceRoot,
        };
      }
      if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
        return { ok: false, error: "file not found" };
      }
      try {
        const raw = fs.readFileSync(absolutePath, "utf8");
        const maxChars = Number.isFinite(Number(args?.maxChars))
          ? Math.max(200, Math.min(8000, Number(args.maxChars)))
          : MAX_TOOL_TEXT_CHARS;
        return {
          ok: true,
          path: filePath,
          content: truncateText(raw, maxChars),
        };
      } catch (error) {
        return {
          ok: false,
          error: normalizeText(error?.message) || "failed to read file",
        };
      }
    },
  });
}

function createFileEditTool() {
  return palpalCore.tool({
    name: "codex-file-edit",
    description: "Apply file edits (prototype accepts but does not mutate files).",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
        patch: { type: "string" },
        content: { type: "string" },
      },
    },
    execute: async (args) => ({
      ok: true,
      path: normalizeText(args?.path),
      patch: truncateText(normalizeText(args?.patch || args?.content), 600),
      note: "Prototype mode: edit request accepted, no filesystem mutation was applied.",
    }),
  });
}

function createShellCommandTool() {
  return palpalCore.tool({
    name: "codex-shell-command",
    description: "Run shell command (disabled in prototype runtime).",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string" },
      },
      required: ["command"],
    },
    execute: async (args) => ({
      ok: false,
      command: normalizeText(args?.command),
      error: "shell command tool is disabled in prototype runtime",
    }),
  });
}

function createTestRunnerTool() {
  return palpalCore.tool({
    name: "codex-test-runner",
    description: "Execute tests (prototype summary runner).",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string" },
      },
    },
    execute: async (args) => ({
      ok: true,
      command: normalizeText(args?.command) || "npm run test:unit",
      note: "Prototype mode: test runner execution is summarized only.",
    }),
  });
}

function createBrowserChromeTool() {
  return palpalCore.tool({
    name: "browser-chrome",
    description: "Open URL or search the web and return a short page summary.",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string" },
        query: { type: "string" },
      },
    },
    execute: async (args) => {
      const explicitUrl = normalizeText(args?.url);
      const query = normalizeText(args?.query || args?.q || args?.keyword);
      if (!explicitUrl && !query) {
        return { ok: false, error: "url or query is required" };
      }
      const targetUrl = explicitUrl || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      try {
        const response = await fetchTextWithTimeout(targetUrl, 9000);
        return {
          ok: true,
          url: response.url,
          status: response.status,
          title: extractHtmlTitle(response.body),
          snippet: truncateText(stripHtmlTags(response.body), 320),
        };
      } catch (error) {
        return {
          ok: false,
          url: targetUrl,
          error: normalizeText(error?.message) || "browser fetch failed",
        };
      }
    },
  });
}

function buildSkillTools(enabledSkillIds, options = {}) {
  const skillIds = normalizeSkillIdList(enabledSkillIds);
  if (skillIds.length === 0) return [];
  const workspaceRoot = normalizeText(options.workspaceRoot) || process.cwd();
  const built = [];
  skillIds.forEach((skillId) => {
    if (skillId === "codex-file-search") {
      built.push(createFileSearchTool(workspaceRoot));
      return;
    }
    if (skillId === "codex-file-read") {
      built.push(createFileReadTool(workspaceRoot));
      return;
    }
    if (skillId === "codex-file-edit") {
      built.push(createFileEditTool());
      return;
    }
    if (skillId === "codex-shell-command") {
      built.push(createShellCommandTool());
      return;
    }
    if (skillId === "codex-test-runner") {
      built.push(createTestRunnerTool());
      return;
    }
    if (skillId === "browser-chrome") {
      built.push(createBrowserChromeTool());
    }
  });
  return built;
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

async function requestGuideChatCompletion(input = {}) {
  return requestPalChatCompletion({
    ...input,
    agentName: "guide",
    systemPrompt: normalizeText(input.systemPrompt) || GUIDE_SYSTEM_PROMPT,
    emptyResponseError: "Guide response is empty",
  });
}

async function requestPalChatCompletion(input = {}) {
  const runtimeKind = normalizeText(input.runtimeKind || "model").toLowerCase() === "tool" ? "tool" : "model";
  const toolName = normalizeText(input.toolName);
  if (runtimeKind === "tool") {
    if (normalizeText(input.agentName) !== "guide") {
      throw new Error("CLI tool runtime is currently supported only for Guide");
    }
    if (toolName.toLowerCase() !== "codex") {
      throw new Error(`Unsupported CLI tool runtime: ${toolName || "unknown"}`);
    }
    return runCodexGuideCliCompletion(input);
  }
  const provider = normalizeProviderName(input.provider || "lmstudio");
  const modelName = normalizeText(input.modelName);
  const baseUrl = normalizeText(input.baseUrl || standardEnvValue(provider, "baseUrl"));
  const apiKey = normalizeText(input.apiKey || standardEnvValue(provider, "apiKey"));
  const userText = normalizeText(input.userText);
  const systemPrompt = normalizeText(input.systemPrompt) || GUIDE_SYSTEM_PROMPT;
  const agentName = normalizeText(input.agentName) || "agent";
  const messages = normalizeGuideMessages(input.messages);
  const enabledSkillIds = normalizeSkillIdList(input.enabledSkillIds);
  const workspaceRoot = normalizeText(input.workspaceRoot) || process.cwd();
  const emptyResponseError = normalizeText(input.emptyResponseError) || "Agent response is empty";

  if (!provider) {
    throw new Error("provider is required");
  }
  if (!modelName) {
    throw new Error("modelName is required");
  }
  if (!userText) {
    throw new Error("userText is required");
  }

  return withProviderEnv(
    provider,
    { modelName, baseUrl, apiKey },
    async () => {
      if (agentName === "guide") {
        try {
          const structuredResult = await requestStructuredGuideChatCompletion({
            provider,
            modelName,
            baseUrl,
            apiKey,
            userText,
            systemPrompt,
            messages,
            responseFormat: input.responseFormat,
          });
          if (structuredResult && normalizeText(structuredResult.text)) {
            return structuredResult;
          }
        } catch (error) {
          runtimeDebugLog("guide structured output fallback", {
            provider,
            modelName,
            error: normalizeText(error?.message || error),
          });
        }
      }
      const generateInput = buildGuideGenerateInput({
        systemPrompt,
        userText,
        messages,
      });
      const model = getProviderModel(provider, modelName);
      const tools = buildSkillTools(enabledSkillIds, { workspaceRoot });
      const agent = {
        name: agentName,
        instructions: generateInput.instructions,
        tools,
        model,
      };
      const result = await runModelToolLoop({
        model,
        agent,
        tools,
        inputText: generateInput.inputText,
        maxTurns: input.maxTurns,
      });
      const outputText = normalizeText(result.outputText);
      if (!outputText) {
        throw new Error(emptyResponseError);
      }
      return {
        provider,
        modelName,
        text: outputText,
        toolCalls: result.toolCalls || [],
        loopStopReason: normalizeText(result.loopStopReason) || "completed",
        loopTrace: Array.isArray(result.loopTrace) ? result.loopTrace : [],
      };
    }
  );
}

function __setCoreRuntimeBindingsForTest(bindings = {}) {
  __setProviderRuntimeBindingsForTest(bindings);
}

function __resetCoreRuntimeBindingsForTest() {
  __resetProviderRuntimeBindingsForTest();
}

module.exports = {
  listCoreProviderModels,
  requestGuideChatCompletion,
  requestPalChatCompletion,
  __setCoreRuntimeBindingsForTest,
  __resetCoreRuntimeBindingsForTest,
  __setCliToolRuntimeBindingsForTest,
  __resetCliToolRuntimeBindingsForTest,
};
