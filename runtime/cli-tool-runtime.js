const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

function normalizeText(value) {
  return String(value || "").trim();
}

let spawnCommand = function defaultSpawnCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd || process.cwd(),
      env: options.env || process.env,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      resolve({
        ok: false,
        code: -1,
        stdout,
        stderr,
        errorText: normalizeText(error?.message || error),
      });
    });
    child.on("close", (code) => {
      resolve({
        ok: code === 0,
        code,
        stdout,
        stderr,
        errorText: normalizeText(stderr || ""),
      });
    });
  });
};
let shouldUsePwshCodexWrapper = () => process.platform === "win32";

function escapePwshLiteral(value) {
  return String(value || "").replace(/'/g, "''");
}

function buildGuideCliPrompt(input = {}) {
  const parts = [
    "Follow the system instructions and reply only with the final response required by the output schema.",
    "[System Instructions]",
    normalizeText(input.systemPrompt),
  ];
  const messages = Array.isArray(input.messages) ? input.messages : [];
  if (messages.length > 0) {
    parts.push("[Conversation Context]");
    messages.forEach((message) => {
      const role = normalizeText(message?.role || "system") || "system";
      const content = normalizeText(message?.content);
      if (!content) return;
      parts.push(`${role}: ${content}`);
    });
  }
  parts.push("[User Request]");
  parts.push(normalizeText(input.userText));
  return parts.filter(Boolean).join("\n\n");
}

async function runCodexGuideCliCompletion(input = {}) {
  const workspaceRoot = normalizeText(input.workspaceRoot) || process.cwd();
  const prompt = buildGuideCliPrompt(input);
  if (!prompt) {
    throw new Error("Guide CLI prompt is empty");
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-codex-guide-"));
  const outputPath = path.join(tempDir, "last-message.txt");
  const schemaPath = path.join(tempDir, "schema.json");
  const promptPath = path.join(tempDir, "prompt.txt");
  try {
    const responseFormat = input.responseFormat;
    fs.writeFileSync(promptPath, prompt, { encoding: "utf8" });
    const args = [
      "exec",
      "--skip-git-repo-check",
      "--full-auto",
      "--color",
      "never",
      "-C",
      workspaceRoot,
      "-o",
      outputPath,
    ];
    if (
      responseFormat &&
      responseFormat.type === "json_schema" &&
      responseFormat.json_schema &&
      responseFormat.json_schema.schema
    ) {
      fs.writeFileSync(
        schemaPath,
        JSON.stringify(responseFormat.json_schema.schema, null, 2),
        { encoding: "utf8" }
      );
      args.push("--output-schema", schemaPath);
    }
    let result;
    if (shouldUsePwshCodexWrapper()) {
      const pwshScriptLines = [
        `$prompt = Get-Content -Raw -LiteralPath '${escapePwshLiteral(promptPath)}'`,
        `$args = @(${args.map((arg) => `'${escapePwshLiteral(arg)}'`).join(", ")})`,
        "$args += @($prompt)",
        "& codex @args",
      ];
      result = await spawnCommand("pwsh", ["-NoProfile", "-Command", pwshScriptLines.join("; ")], {
        cwd: workspaceRoot,
      });
    } else {
      args.push(prompt);
      result = await spawnCommand("codex", args, {
        cwd: workspaceRoot,
      });
    }
    if (!result.ok) {
      throw new Error(normalizeText(result.errorText || result.stderr || `codex exec failed (${result.code})`));
    }
    const text = normalizeText(fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : result.stdout);
    if (!text) {
      throw new Error("Codex CLI returned empty output");
    }
    return {
      provider: "codex-cli",
      modelName: "Codex",
      text,
      toolCalls: [],
      loopStopReason: "completed_cli",
      loopTrace: [],
    };
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      // ignore temp cleanup failures
    }
  }
}

function __setCliToolRuntimeBindingsForTest(bindings = {}) {
  if (typeof bindings.spawnCommand === "function") {
    spawnCommand = bindings.spawnCommand;
  }
  if (typeof bindings.shouldUsePwshCodexWrapper === "function") {
    shouldUsePwshCodexWrapper = bindings.shouldUsePwshCodexWrapper;
  }
}

function __resetCliToolRuntimeBindingsForTest() {
  spawnCommand = function defaultSpawnCommand(command, args, options = {}) {
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        cwd: options.cwd || process.cwd(),
        env: options.env || process.env,
        windowsHide: true,
        shell: process.platform === "win32",
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => {
        stdout += String(chunk);
      });
      child.stderr.on("data", (chunk) => {
        stderr += String(chunk);
      });
      child.on("error", (error) => {
        resolve({
          ok: false,
          code: -1,
          stdout,
          stderr,
          errorText: normalizeText(error?.message || error),
        });
      });
      child.on("close", (code) => {
        resolve({
          ok: code === 0,
          code,
          stdout,
          stderr,
          errorText: normalizeText(stderr || ""),
        });
      });
    });
  };
  shouldUsePwshCodexWrapper = () => process.platform === "win32";
}

module.exports = {
  buildGuideCliPrompt,
  runCodexGuideCliCompletion,
  __setCliToolRuntimeBindingsForTest,
  __resetCliToolRuntimeBindingsForTest,
};
