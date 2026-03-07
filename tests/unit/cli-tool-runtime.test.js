const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");

const cliToolRuntime = require("../../runtime/cli-tool-runtime");

test.afterEach(() => {
  cliToolRuntime.__resetCliToolRuntimeBindingsForTest();
});

test("buildGuideCliPrompt includes system, history, and user sections", () => {
  const prompt = cliToolRuntime.buildGuideCliPrompt({
    systemPrompt: "system-rules",
    messages: [
      { role: "assistant", content: "history-a" },
      { role: "user", content: "history-b" },
    ],
    userText: "latest-user",
  });
  assert.match(prompt, /\[System Instructions\]/);
  assert.match(prompt, /system-rules/);
  assert.match(prompt, /\[Conversation Context\]/);
  assert.match(prompt, /assistant: history-a/);
  assert.match(prompt, /\[User Request\]/);
  assert.match(prompt, /latest-user/);
});

test("runCodexGuideCliCompletion executes codex with output schema and reads output file", async () => {
  let captured = null;
  cliToolRuntime.__setCliToolRuntimeBindingsForTest({
    shouldUsePwshCodexWrapper: () => false,
    spawnCommand: async (command, args) => {
      captured = { command, args };
      const outputIndex = args.indexOf("-o");
      const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : "";
      fs.writeFileSync(outputPath, '{"status":"conversation","reply":"OK"}', "utf8");
      return {
        ok: true,
        code: 0,
        stdout: "",
        stderr: "",
        errorText: "",
      };
    },
  });

  const result = await cliToolRuntime.runCodexGuideCliCompletion({
    workspaceRoot: process.cwd(),
    systemPrompt: "system-rules",
    userText: "say ok",
    responseFormat: {
      type: "json_schema",
      json_schema: {
        name: "guide_plan_response",
        schema: {
          type: "object",
          properties: {
            status: { type: "string" },
            reply: { type: "string" },
          },
        },
      },
    },
  });

  assert.equal(captured.command, "codex");
  assert.ok(captured.args.includes("exec"));
  assert.ok(captured.args.includes("--output-schema"));
  assert.equal(result.provider, "codex-cli");
  assert.equal(result.modelName, "Codex");
  assert.equal(result.text, '{"status":"conversation","reply":"OK"}');
});
