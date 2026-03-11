const fs = require("fs");
const path = require("path");
const palpalCore = require("palpal-core");
const {
  normalizeText,
  normalizeSkillIdList,
  runtimeDebugLog,
  safeStringify,
  summarizeValueForDebug,
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


module.exports = {
  buildSkillTools,
};

