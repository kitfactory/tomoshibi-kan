const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseCodexCommandHelp,
  parseCodexMcpList,
  parseCodexFeatures,
  probeCodexCli,
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
