const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseCodexCommandHelp,
  parseCodexMcpList,
  parseCodexFeatures,
  probeCodexCli,
  parseOpenCodeCommandHelp,
  parseOpenCodeAgentList,
  parseOpenCodeSkills,
  parseOpenCodeMcpList,
  parseOpenCodeDebugAgent,
  probeOpenCodeCli,
} = require("../../runtime/cli-tool-capability-probe.js");

test("parseCodexCommandHelp extracts command capabilities", () => {
  const commands = parseCodexCommandHelp(`
Codex CLI

Commands:
  exec        Run Codex non-interactively [aliases: e]
  review      Run a code review non-interactively
  mcp         Manage external MCP servers for Codex

Options:
  -h, --help  Print help
`);

  assert.deepEqual(commands, [
    {
      id: "codex.command.exec",
      name: "exec",
      kind: "command",
      description: "Run Codex non-interactively",
    },
    {
      id: "codex.command.review",
      name: "review",
      kind: "command",
      description: "Run a code review non-interactively",
    },
    {
      id: "codex.command.mcp",
      name: "mcp",
      kind: "command",
      description: "Manage external MCP servers for Codex",
    },
  ]);
});

test("parseCodexMcpList handles configured and empty output", () => {
  assert.deepEqual(parseCodexMcpList("No MCP servers configured yet. Try `codex mcp add my-tool -- my-command`."), []);
  assert.deepEqual(parseCodexMcpList("github  connected\nlocalfs connected"), [
    {
      id: "codex.mcp.github",
      name: "github",
      kind: "mcp_server",
      description: "Configured MCP server",
    },
    {
      id: "codex.mcp.localfs",
      name: "localfs",
      kind: "mcp_server",
      description: "Configured MCP server",
    },
  ]);
});

test("parseCodexFeatures extracts enabled state", () => {
  const features = parseCodexFeatures(`
shell_tool                       stable             true
artifact                         under development  false
sqlite                           stable             true
`);

  assert.deepEqual(features, [
    {
      id: "codex.feature.shell_tool",
      name: "shell_tool",
      kind: "feature",
      stage: "stable",
      enabled: true,
      description: "stable feature (true)",
    },
    {
      id: "codex.feature.artifact",
      name: "artifact",
      kind: "feature",
      stage: "under development",
      enabled: false,
      description: "under development feature (false)",
    },
    {
      id: "codex.feature.sqlite",
      name: "sqlite",
      kind: "feature",
      stage: "stable",
      enabled: true,
      description: "stable feature (true)",
    },
  ]);
});

test("probeCodexCli builds capability snapshot from command outputs", async () => {
  const calls = [];
  const snapshot = await probeCodexCli({
    runCommand: async (command, args) => {
      calls.push([command, ...args]);
      const key = `${command} ${args.join(" ")}`;
      if (key === "codex --version") {
        return { ok: true, stdout: "codex-cli 0.111.0\n", stderr: "", code: 0 };
      }
      if (key === "codex --help") {
        return {
          ok: true,
          stdout: "Commands:\n  exec        Run Codex non-interactively\n  review      Run a code review non-interactively\n  mcp         Manage external MCP servers for Codex\n\nOptions:\n  -h, --help  Print help\n",
          stderr: "",
          code: 0,
        };
      }
      if (key === "codex mcp list") {
        return { ok: true, stdout: "github  connected\n", stderr: "", code: 0 };
      }
      if (key === "codex features list") {
        return { ok: true, stdout: "shell_tool stable true\nsqlite stable true\n", stderr: "", code: 0 };
      }
      return { ok: false, stdout: "", stderr: "unexpected", code: 1, errorText: "unexpected" };
    },
  });

  assert.deepEqual(calls, [
    ["codex", "--version"],
    ["codex", "--help"],
    ["codex", "mcp", "list"],
    ["codex", "features", "list"],
  ]);
  assert.equal(snapshot.toolName, "Codex");
  assert.equal(snapshot.status, "available");
  assert.equal(snapshot.versionText, "codex-cli 0.111.0");
  assert.ok(snapshot.capabilities.some((entry) => entry.id === "codex.command.exec"));
  assert.ok(snapshot.capabilities.some((entry) => entry.id === "codex.mcp.github"));
  assert.ok(snapshot.capabilities.some((entry) => entry.id === "codex.feature.shell_tool"));
  assert.ok(snapshot.capabilitySummaries.includes("exec: Run Codex non-interactively"));
  assert.ok(snapshot.capabilitySummaries.includes("MCP github: configured"));
});

test("probeCodexCli returns unavailable snapshot when codex is missing", async () => {
  const snapshot = await probeCodexCli({
    runCommand: async (_command, args) => {
      if (args[0] === "--version") {
        return { ok: false, stdout: "", stderr: "not found", code: -1, errorText: "not found" };
      }
      return { ok: false, stdout: "", stderr: "not found", code: -1, errorText: "not found" };
    },
  });

  assert.equal(snapshot.status, "unavailable");
  assert.equal(snapshot.toolName, "Codex");
  assert.equal(snapshot.capabilities.length, 0);
});

test("parseOpenCodeCommandHelp extracts top-level commands with ANSI stripped", () => {
  const commands = parseOpenCodeCommandHelp(`
\u001b[90mT\u001b[39m
Commands:
  opencode run [message..]     run opencode with a message
  opencode debug               debugging and troubleshooting tools
  opencode models [provider]   list all available models

Positionals:
  project  path to start opencode in
`);

  assert.deepEqual(commands, [
    {
      id: "opencode.command.run",
      name: "run",
      kind: "command",
      description: "run opencode with a message",
    },
    {
      id: "opencode.command.debug",
      name: "debug",
      kind: "command",
      description: "debugging and troubleshooting tools",
    },
    {
      id: "opencode.command.models",
      name: "models",
      kind: "command",
      description: "list all available models",
    },
  ]);
});

test("parseOpenCodeAgentList extracts agent rows from mixed output", () => {
  const agents = parseOpenCodeAgentList(`
build (primary)
  [
    { "permission": "*", "action": "allow" }
  ]
explore (subagent)
  [
    { "permission": "bash", "action": "allow" }
  ]
`);

  assert.deepEqual(agents, [
    {
      id: "opencode.agent.build",
      name: "build",
      kind: "agent",
      mode: "primary",
      description: "primary agent",
    },
    {
      id: "opencode.agent.explore",
      name: "explore",
      kind: "agent",
      mode: "subagent",
      description: "subagent agent",
    },
  ]);
});

test("parseOpenCodeSkills and parseOpenCodeDebugAgent extract capabilities", () => {
  assert.deepEqual(parseOpenCodeSkills('[{"name":"probe-skill","description":"Test skill"}]'), [
    {
      id: "opencode.skill.probe-skill",
      name: "probe-skill",
      kind: "skill",
      description: "Test skill",
    },
  ]);
  assert.deepEqual(parseOpenCodeMcpList('\u001b[33m!\u001b[39m  No MCP servers configured'), []);
  assert.deepEqual(parseOpenCodeDebugAgent('{"tools":{"bash":true,"read":true,"skill":false}}'), [
    {
      id: "opencode.tool.bash",
      name: "bash",
      kind: "builtin_tool",
      description: "Enabled built-in tool",
    },
    {
      id: "opencode.tool.read",
      name: "read",
      kind: "builtin_tool",
      description: "Enabled built-in tool",
    },
  ]);
});

test("probeOpenCodeCli builds capability snapshot from command outputs", async () => {
  const calls = [];
  const snapshot = await probeOpenCodeCli({
    runCommand: async (command, args) => {
      calls.push([command, ...args]);
      const key = `${command} ${args.join(" ")}`;
      if (key === "opencode --version") {
        return { ok: true, stdout: "1.2.20\n", stderr: "", code: 0 };
      }
      if (key === "opencode --help") {
        return {
          ok: false,
          stdout: "Commands:\n  opencode run [message..]     run opencode with a message\n  opencode debug               debugging and troubleshooting tools\n\nOptions:\n  -h, --help        show help\n",
          stderr: "",
          code: -1,
          errorText: "timeout",
        };
      }
      if (key === "opencode debug skill") {
        return { ok: true, stdout: '[{"name":"probe-skill","description":"Test skill"}]', stderr: "", code: 0 };
      }
      if (key === "opencode agent list") {
        return { ok: true, stdout: "build (primary)\nexplore (subagent)\n", stderr: "", code: 0 };
      }
      if (key === "opencode mcp list") {
        return { ok: true, stdout: "No MCP servers configured", stderr: "", code: 0 };
      }
      if (key === "opencode debug agent build") {
        return {
          ok: true,
          stdout: '{"name":"build","tools":{"bash":true,"read":true,"skill":true}}',
          stderr: "",
          code: 0,
        };
      }
      return { ok: false, stdout: "", stderr: "unexpected", code: 1, errorText: "unexpected" };
    },
  });

  assert.deepEqual(calls, [
    ["opencode", "--version"],
    ["opencode", "--help"],
    ["opencode", "debug", "skill"],
    ["opencode", "agent", "list"],
    ["opencode", "mcp", "list"],
    ["opencode", "debug", "agent", "build"],
  ]);
  assert.equal(snapshot.toolName, "OpenCode");
  assert.equal(snapshot.status, "available");
  assert.equal(snapshot.versionText, "1.2.20");
  assert.ok(snapshot.capabilities.some((entry) => entry.id === "opencode.command.run"));
  assert.ok(snapshot.capabilities.some((entry) => entry.id === "opencode.agent.build"));
  assert.ok(snapshot.capabilities.some((entry) => entry.id === "opencode.skill.probe-skill"));
  assert.ok(snapshot.capabilities.some((entry) => entry.id === "opencode.tool.bash"));
  assert.ok(snapshot.capabilitySummaries.includes("probe-skill: Test skill"));
  assert.ok(snapshot.capabilitySummaries.includes("bash: built-in tool enabled"));
});

test("probeOpenCodeCli returns unavailable snapshot when version/help are unusable", async () => {
  const snapshot = await probeOpenCodeCli({
    runCommand: async () => ({ ok: false, stdout: "", stderr: "not found", code: -1, errorText: "not found" }),
  });

  assert.equal(snapshot.status, "unavailable");
  assert.equal(snapshot.toolName, "OpenCode");
  assert.equal(snapshot.capabilities.length, 0);
});
