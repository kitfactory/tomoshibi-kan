const { spawn } = require("child_process");

function normalizeString(value) {
  return String(value || "").trim();
}

function stripAnsi(value) {
  return String(value || "").replace(/\x1B\[[0-9;]*m/g, "");
}

function uniqueBy(values, getKey) {
  const seen = new Set();
  const result = [];
  (Array.isArray(values) ? values : []).forEach((value) => {
    const key = getKey(value);
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(value);
  });
  return result;
}

function normalizeToolName(toolName) {
  const normalized = normalizeString(toolName).toLowerCase();
  if (normalized === "codex") return "Codex";
  if (normalized === "claudecode") return "ClaudeCode";
  if (normalized === "opencode") return "OpenCode";
  return normalizeString(toolName);
}

function runCommand(command, args = [], options = {}) {
  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 10000;
  const cwd = normalizeString(options.cwd) || process.cwd();
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      shell: process.platform === "win32",
      windowsHide: true,
      env: process.env,
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    const timer = setTimeout(() => {
      try {
        child.kill();
      } catch (error) {
        // ignore
      }
      finish({
        ok: false,
        code: -1,
        stdout,
        stderr,
        errorText: "timeout",
      });
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk || "");
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk || "");
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      finish({
        ok: false,
        code: -1,
        stdout,
        stderr,
        errorText: normalizeString(error?.message || error),
      });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      finish({
        ok: code === 0,
        code: Number.isFinite(code) ? code : -1,
        stdout,
        stderr,
        errorText: code === 0 ? "" : normalizeString(stderr || stdout || `exit ${code}`),
      });
    });
  });
}

function parseCodexCommandHelp(helpText) {
  const source = String(helpText || "");
  const lines = source.split(/\r?\n/);
  const commands = [];
  let inCommands = false;
  lines.forEach((line) => {
    if (!inCommands) {
      if (/^Commands:\s*$/.test(line.trim())) {
        inCommands = true;
      }
      return;
    }
    if (!line.trim()) return;
    if (/^(Arguments|Options):/.test(line.trim())) {
      inCommands = false;
      return;
    }
    const match = line.match(/^\s{2,}([a-z0-9-]+)\s{2,}(.+?)\s*$/i);
    if (!match) return;
    const name = normalizeString(match[1]);
    const description = normalizeString(match[2]).replace(/\s+\[aliases?:.+$/i, "");
    if (!name) return;
    commands.push({
      id: `codex.command.${name}`,
      name,
      kind: "command",
      description,
    });
  });
  return uniqueBy(commands, (entry) => entry.id);
}

function parseCodexMcpList(outputText) {
  const source = String(outputText || "").trim();
  if (!source || /No MCP servers configured yet/i.test(source)) return [];
  return source
    .split(/\r?\n/)
    .map((line) => normalizeString(line))
    .filter(Boolean)
    .map((line) => line.split(/\s+/)[0])
    .filter(Boolean)
    .map((name) => ({
      id: `codex.mcp.${name.toLowerCase()}`,
      name,
      kind: "mcp_server",
      description: "Configured MCP server",
    }));
}

function parseCodexFeatures(outputText) {
  const source = String(outputText || "");
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.match(/^([a-z0-9_]+)\s+([a-z_ ]+)\s+(true|false)$/i))
    .filter(Boolean)
    .map((match) => ({
      id: `codex.feature.${normalizeString(match[1]).toLowerCase()}`,
      name: normalizeString(match[1]),
      kind: "feature",
      stage: normalizeString(match[2]),
      enabled: String(match[3]).toLowerCase() === "true",
      description: `${normalizeString(match[2])} feature (${normalizeString(match[3]).toLowerCase()})`,
    }));
}

function parseOpenCodeCommandHelp(helpText) {
  const source = stripAnsi(helpText);
  const lines = source.split(/\r?\n/);
  const commands = [];
  let inCommands = false;
  lines.forEach((line) => {
    const trimmed = normalizeString(line);
    if (!inCommands) {
      if (/^Commands:\s*$/.test(trimmed)) {
        inCommands = true;
      }
      return;
    }
    if (!trimmed) return;
    if (/^(Positionals|Options):/.test(trimmed)) {
      inCommands = false;
      return;
    }
    const match = trimmed.match(/^opencode(?:\s+\[project\]|\s+<[^>]+>|\s+\[[^\]]+\])?\s+([a-z0-9-]+)(?:\s+[^\s].*?)?\s{2,}(.+?)$/i);
    if (!match) return;
    const name = normalizeString(match[1]);
    const description = normalizeString(match[2]);
    if (!name || !description) return;
    commands.push({
      id: `opencode.command.${name}`,
      name,
      kind: "command",
      description,
    });
  });
  return uniqueBy(commands, (entry) => entry.id);
}

function parseOpenCodeAgentList(outputText) {
  const source = stripAnsi(outputText);
  return uniqueBy(
    source
      .split(/\r?\n/)
      .map((line) => normalizeString(line))
      .map((line) => line.match(/^([a-z0-9_-]+)\s+\((primary|subagent)\)$/i))
      .filter(Boolean)
      .map((match) => ({
        id: `opencode.agent.${normalizeString(match[1]).toLowerCase()}`,
        name: normalizeString(match[1]),
        kind: "agent",
        mode: normalizeString(match[2]).toLowerCase(),
        description: `${normalizeString(match[2]).toLowerCase()} agent`,
      })),
    (entry) => entry.id
  );
}

function parseOpenCodeSkills(outputText) {
  try {
    const parsed = JSON.parse(String(outputText || "[]"));
    return uniqueBy(
      (Array.isArray(parsed) ? parsed : [])
        .map((entry) => {
          const name = normalizeString(entry?.name);
          if (!name) return null;
          return {
            id: `opencode.skill.${name.toLowerCase()}`,
            name,
            kind: "skill",
            description: normalizeString(entry?.description) || "Installed OpenCode skill",
          };
        })
        .filter(Boolean),
      (entry) => entry.id
    );
  } catch (_error) {
    return [];
  }
}

function parseOpenCodeMcpList(outputText) {
  const source = stripAnsi(outputText);
  if (!source || /No MCP servers configured/i.test(source)) return [];
  return uniqueBy(
    source
      .split(/\r?\n/)
      .map((line) => normalizeString(line))
      .filter(Boolean)
      .map((line) => line.match(/^([a-z0-9_-]+)\b/i))
      .filter(Boolean)
      .map((match) => ({
        id: `opencode.mcp.${normalizeString(match[1]).toLowerCase()}`,
        name: normalizeString(match[1]),
        kind: "mcp_server",
        description: "Configured MCP server",
      })),
    (entry) => entry.id
  );
}

function parseOpenCodeDebugAgent(outputText) {
  try {
    const parsed = JSON.parse(String(outputText || "{}"));
    const tools = parsed && typeof parsed === "object" && parsed.tools && typeof parsed.tools === "object"
      ? parsed.tools
      : {};
    return uniqueBy(
      Object.entries(tools)
        .filter(([, enabled]) => enabled === true)
        .map(([name]) => ({
          id: `opencode.tool.${normalizeString(name).toLowerCase()}`,
          name: normalizeString(name),
          kind: "builtin_tool",
          description: "Enabled built-in tool",
        })),
      (entry) => entry.id
    );
  } catch (_error) {
    return [];
  }
}

function resultLooksUsable(result) {
  if (!result || typeof result !== "object") return false;
  if (result.ok) return true;
  return Boolean(normalizeString(result.stdout));
}

function buildCapabilitySummaries(snapshot) {
  const capabilities = Array.isArray(snapshot?.capabilities) ? snapshot.capabilities : [];
  const commandSummaries = capabilities
    .filter((entry) => entry.kind === "command")
    .map((entry) => normalizeString(entry.description) ? `${entry.name}: ${entry.description}` : entry.name);
  const agentSummaries = capabilities
    .filter((entry) => entry.kind === "agent")
    .map((entry) => `${entry.name}: ${entry.description || "agent"}`);
  const skillSummaries = capabilities
    .filter((entry) => entry.kind === "skill")
    .map((entry) => `${entry.name}: ${entry.description || "skill"}`);
  const featureSummaries = capabilities
    .filter((entry) => entry.kind === "feature" && entry.enabled)
    .map((entry) => `${entry.name}: ${entry.stage || "feature"} enabled`);
  const mcpSummaries = capabilities
    .filter((entry) => entry.kind === "mcp_server")
    .map((entry) => `MCP ${entry.name}: configured`);
  const builtinToolSummaries = capabilities
    .filter((entry) => entry.kind === "builtin_tool")
    .map((entry) => `${entry.name}: built-in tool enabled`);
  return uniqueBy(
    [...commandSummaries, ...agentSummaries, ...skillSummaries, ...featureSummaries, ...mcpSummaries, ...builtinToolSummaries]
      .map((value) => normalizeString(value))
      .filter(Boolean),
    (value) => value.toLowerCase()
  );
}

async function probeCodexCli(options = {}) {
  const run = typeof options.runCommand === "function" ? options.runCommand : runCommand;
  const fetchedAt = new Date().toISOString();
  const versionResult = await run("codex", ["--version"], options);
  const helpResult = await run("codex", ["--help"], options);
  const mcpResult = await run("codex", ["mcp", "list"], options);
  const featuresResult = await run("codex", ["features", "list"], options);
  if (!versionResult.ok || !helpResult.ok) {
    return {
      toolName: "Codex",
      status: "unavailable",
      fetchedAt,
      commandName: "codex",
      versionText: normalizeString(versionResult.stdout || versionResult.stderr),
      capabilities: [],
      capabilitySummaries: [],
      errorText: normalizeString(helpResult.errorText || versionResult.errorText || "codex probe failed"),
    };
  }
  const commandCapabilities = parseCodexCommandHelp(helpResult.stdout);
  const mcpCapabilities = mcpResult.ok ? parseCodexMcpList(mcpResult.stdout) : [];
  const featureCapabilities = featuresResult.ok ? parseCodexFeatures(featuresResult.stdout) : [];
  const capabilities = uniqueBy(
    [...commandCapabilities, ...mcpCapabilities, ...featureCapabilities],
    (entry) => normalizeString(entry?.id).toLowerCase()
  );
  const snapshot = {
    toolName: "Codex",
    status: "available",
    fetchedAt,
    commandName: "codex",
    versionText: normalizeString(versionResult.stdout || versionResult.stderr),
    capabilities,
    capabilitySummaries: [],
    errorText: "",
  };
  snapshot.capabilitySummaries = buildCapabilitySummaries(snapshot);
  return snapshot;
}

async function probeOpenCodeCli(options = {}) {
  const run = typeof options.runCommand === "function" ? options.runCommand : runCommand;
  const fetchedAt = new Date().toISOString();
  const probeOptions = { ...options, timeoutMs: Math.max(Number(options.timeoutMs) || 0, 20000) || 20000 };
  const versionResult = await run("opencode", ["--version"], probeOptions);
  const helpResult = await run("opencode", ["--help"], probeOptions);
  const skillResult = await run("opencode", ["debug", "skill"], probeOptions);
  const agentListResult = await run("opencode", ["agent", "list"], probeOptions);
  const mcpResult = await run("opencode", ["mcp", "list"], probeOptions);
  const debugAgentResult = await run("opencode", ["debug", "agent", "build"], probeOptions);
  if (!resultLooksUsable(versionResult) || !resultLooksUsable(helpResult)) {
    return {
      toolName: "OpenCode",
      status: "unavailable",
      fetchedAt,
      commandName: "opencode",
      versionText: normalizeString(versionResult.stdout || versionResult.stderr),
      capabilities: [],
      capabilitySummaries: [],
      errorText: normalizeString(helpResult.errorText || versionResult.errorText || "opencode probe failed"),
    };
  }
  const commandCapabilities = parseOpenCodeCommandHelp(helpResult.stdout);
  const skillCapabilities = resultLooksUsable(skillResult) ? parseOpenCodeSkills(skillResult.stdout) : [];
  const agentCapabilities = resultLooksUsable(agentListResult) ? parseOpenCodeAgentList(agentListResult.stdout) : [];
  const mcpCapabilities = resultLooksUsable(mcpResult) ? parseOpenCodeMcpList(mcpResult.stdout) : [];
  const builtinToolCapabilities = resultLooksUsable(debugAgentResult) ? parseOpenCodeDebugAgent(debugAgentResult.stdout) : [];
  const capabilities = uniqueBy(
    [...commandCapabilities, ...skillCapabilities, ...agentCapabilities, ...mcpCapabilities, ...builtinToolCapabilities],
    (entry) => normalizeString(entry?.id).toLowerCase()
  );
  const snapshot = {
    toolName: "OpenCode",
    status: "available",
    fetchedAt,
    commandName: "opencode",
    versionText: normalizeString(versionResult.stdout || versionResult.stderr),
    capabilities,
    capabilitySummaries: [],
    errorText: "",
  };
  snapshot.capabilitySummaries = buildCapabilitySummaries(snapshot);
  return snapshot;
}

async function probeCliToolCapabilities(toolNames, options = {}) {
  const names = uniqueBy(
    (Array.isArray(toolNames) ? toolNames : [])
      .map((name) => normalizeToolName(name))
      .filter(Boolean),
    (name) => name.toLowerCase()
  );
  const snapshots = [];
  for (const toolName of names) {
    if (toolName === "Codex") {
      snapshots.push(await probeCodexCli(options));
      continue;
    }
    if (toolName === "OpenCode") {
      snapshots.push(await probeOpenCodeCli(options));
      continue;
    }
    snapshots.push({
      toolName,
      status: "unavailable",
      fetchedAt: new Date().toISOString(),
      commandName: toolName,
      versionText: "",
      capabilities: [],
      capabilitySummaries: [],
      errorText: "capability probe is not implemented for this CLI tool",
    });
  }
  return snapshots;
}

module.exports = {
  normalizeToolName,
  runCommand,
  parseCodexCommandHelp,
  parseCodexMcpList,
  parseCodexFeatures,
  parseOpenCodeCommandHelp,
  parseOpenCodeAgentList,
  parseOpenCodeSkills,
  parseOpenCodeMcpList,
  parseOpenCodeDebugAgent,
  buildCapabilitySummaries,
  probeCodexCli,
  probeOpenCodeCli,
  probeCliToolCapabilities,
};
