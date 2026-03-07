const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const coreRuntime = require("../../runtime/palpal-core-runtime");
const originalFetch = global.fetch;

test.afterEach(() => {
  coreRuntime.__resetCoreRuntimeBindingsForTest();
  coreRuntime.__resetCliToolRuntimeBindingsForTest();
  global.fetch = originalFetch;
});

test("listCoreProviderModels excludes default-resolved models by default", async () => {
  coreRuntime.__setCoreRuntimeBindingsForTest({
    listProviderModels: async () => ({
      providers: [
        { provider: "openai", resolution: "default", models: ["gpt-4.1"] },
        { provider: "lmstudio", resolution: "dynamic", models: ["openai/gpt-oss-20b"] },
      ],
      byProvider: {
        lmstudio: {
          resolution: "dynamic",
          models: ["openai/gpt-oss-20b", "openai/gpt-oss-20b"],
        },
      },
    }),
  });

  const result = await coreRuntime.listCoreProviderModels();
  assert.ok(result.providers.some((provider) => provider.id === "lmstudio"));
  assert.equal(result.models.length, 1);
  assert.deepEqual(result.models[0], {
    provider: "lmstudio",
    name: "openai/gpt-oss-20b",
  });
});

test("listCoreProviderModels can include default-resolved models", async () => {
  coreRuntime.__setCoreRuntimeBindingsForTest({
    listProviderModels: async () => ({
      providers: [
        { provider: "openai", resolution: "default", models: ["gpt-4.1"] },
      ],
    }),
  });

  const result = await coreRuntime.listCoreProviderModels({ includeDefaultModels: true });
  assert.ok(result.models.some((model) => model.provider === "openai" && model.name === "gpt-4.1"));
});

test("requestGuideChatCompletion applies provider env patch during generate and restores after", async () => {
  const beforeBase = process.env.AGENTS_LMSTUDIO_BASE_URL;
  const beforeKey = process.env.AGENTS_LMSTUDIO_API_KEY;
  process.env.AGENTS_LMSTUDIO_BASE_URL = "http://old-base";
  process.env.AGENTS_LMSTUDIO_API_KEY = "old-key";

  let capturedEnv = null;
  let capturedGenerateInput = null;

  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async (input) => {
          capturedEnv = {
            baseUrl: process.env.AGENTS_LMSTUDIO_BASE_URL,
            apiKey: process.env.AGENTS_LMSTUDIO_API_KEY,
          };
          capturedGenerateInput = input;
          return { outputText: "ok" };
        },
      }),
    }),
  });

  const result = await coreRuntime.requestGuideChatCompletion({
    provider: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    baseUrl: "http://192.168.11.16:1234/v1",
    apiKey: "lmstudio-key",
    userText: "fallback-user",
    messages: [
      { role: "system", content: "system-rules" },
      { role: "assistant", content: "assistant-history" },
      { role: "user", content: "latest-user" },
    ],
  });

  assert.equal(result.text, "ok");
  assert.equal(capturedEnv.baseUrl, "http://192.168.11.16:1234/v1");
  assert.equal(capturedEnv.apiKey, "lmstudio-key");
  assert.equal(capturedGenerateInput.inputText, "latest-user");
  assert.match(capturedGenerateInput.agent.instructions, /Conversation Context:/);
  assert.match(capturedGenerateInput.agent.instructions, /assistant-history/);

  assert.equal(process.env.AGENTS_LMSTUDIO_BASE_URL, "http://old-base");
  assert.equal(process.env.AGENTS_LMSTUDIO_API_KEY, "old-key");

  if (typeof beforeBase === "undefined") delete process.env.AGENTS_LMSTUDIO_BASE_URL;
  else process.env.AGENTS_LMSTUDIO_BASE_URL = beforeBase;
  if (typeof beforeKey === "undefined") delete process.env.AGENTS_LMSTUDIO_API_KEY;
  else process.env.AGENTS_LMSTUDIO_API_KEY = beforeKey;
});

test("requestGuideChatCompletion executes tool-call loop when enabled skills are provided", async () => {
  let generateCallCount = 0;
  const capturedRequests = [];

  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async (request) => {
          generateCallCount += 1;
          capturedRequests.push(request);
          if (generateCallCount === 1) {
            return {
              toolCalls: [
                {
                  toolName: "codex-test-runner",
                  args: { command: "npm run test:unit" },
                },
              ],
            };
          }
          return {
            outputText: "tool-loop-ok",
          };
        },
      }),
    }),
  });

  const result = await coreRuntime.requestGuideChatCompletion({
    provider: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    baseUrl: "http://192.168.11.16:1234/v1",
    apiKey: "lmstudio-key",
    userText: "run tests",
    enabledSkillIds: ["codex-test-runner"],
  });

  assert.equal(result.text, "tool-loop-ok");
  assert.equal(generateCallCount, 2);
  assert.ok(Array.isArray(result.toolCalls));
  assert.equal(result.toolCalls.length, 1);
  assert.equal(result.toolCalls[0].tool_name, "codex-test-runner");
  assert.equal(capturedRequests[0].agent.tools.length, 1);
  assert.equal(capturedRequests[0].agent.tools[0].name, "codex-test-runner");
  assert.equal(capturedRequests[1].toolCalls.length, 1);
});

test("requestGuideChatCompletion uses native structured output when responseFormat is provided", async () => {
  let generateCalled = false;
  let capturedPayload = null;

  global.fetch = async (_url, options = {}) => {
    capturedPayload = JSON.parse(String(options.body || "{}"));
    return {
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                status: "plan_ready",
                reply: "plan ready",
                plan: {
                  goal: "debug",
                  completionDefinition: "done",
                  constraints: [],
                  tasks: [],
                },
              }),
            },
          },
        ],
      }),
    };
  };

  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async () => {
          generateCalled = true;
          return { outputText: "fallback" };
        },
      }),
    }),
  });

  const result = await coreRuntime.requestGuideChatCompletion({
    provider: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    baseUrl: "http://127.0.0.1:1234/v1",
    apiKey: "lmstudio-key",
    userText: "plan this",
    responseFormat: {
      type: "json_schema",
      json_schema: {
        name: "guide_plan_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            status: { type: "string" },
          },
        },
      },
    },
  });

  assert.equal(generateCalled, false);
  assert.equal(result.loopStopReason, "completed_structured");
  assert.equal(result.text.includes('"status":"plan_ready"'), true);
  assert.equal(capturedPayload.response_format.type, "json_schema");
  assert.equal(capturedPayload.response_format.json_schema.name, "guide_plan_response");
});

test("requestGuideChatCompletion delegates to Codex CLI when runtimeKind=tool", async () => {
  let capturedCall = null;
  coreRuntime.__setCliToolRuntimeBindingsForTest({
    shouldUsePwshCodexWrapper: () => false,
    spawnCommand: async (_command, args) => {
      capturedCall = args;
      const outputIndex = args.indexOf("-o");
      const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : "";
      fs.writeFileSync(outputPath, '{"status":"conversation","reply":"tool-ok"}', "utf8");
      return { ok: true, code: 0, stdout: "", stderr: "", errorText: "" };
    },
  });

  const result = await coreRuntime.requestGuideChatCompletion({
    runtimeKind: "tool",
    toolName: "Codex",
    workspaceRoot: process.cwd(),
    userText: "say ok",
    systemPrompt: "system-rules",
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

  assert.ok(Array.isArray(capturedCall));
  assert.ok(capturedCall.includes("exec"));
  assert.equal(result.provider, "codex-cli");
  assert.equal(result.modelName, "Codex");
  assert.equal(result.text, '{"status":"conversation","reply":"tool-ok"}');
});

test("requestGuideChatCompletion falls back to existing model path when structured output request fails", async () => {
  let generateCalled = false;

  global.fetch = async () => {
    throw new Error("structured failed");
  };

  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async () => {
          generateCalled = true;
          return { outputText: "fallback-ok" };
        },
      }),
    }),
  });

  const result = await coreRuntime.requestGuideChatCompletion({
    provider: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    baseUrl: "http://127.0.0.1:1234/v1",
    apiKey: "lmstudio-key",
    userText: "plan this",
    responseFormat: {
      type: "json_schema",
      json_schema: {
        name: "guide_plan_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            status: { type: "string" },
          },
        },
      },
    },
  });

  assert.equal(generateCalled, true);
  assert.equal(result.text, "fallback-ok");
});

test("requestPalChatCompletion uses passed agentName and returns tool call metadata", async () => {
  let capturedAgentName = "";
  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async (request) => {
          capturedAgentName = String(request?.agent?.name || "");
          return { outputText: "worker-ok" };
        },
      }),
    }),
  });

  const result = await coreRuntime.requestPalChatCompletion({
    provider: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    userText: "do task",
    agentName: "pal-alpha",
    enabledSkillIds: ["browser-chrome"],
  });

  assert.equal(capturedAgentName, "pal-alpha");
  assert.equal(result.text, "worker-ok");
  assert.deepEqual(result.toolCalls, []);
});

test("requestGuideChatCompletion returns fallback text instead of throwing when tool loop does not converge", async () => {
  let generateCallCount = 0;
  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async () => {
          generateCallCount += 1;
          return {
            toolCalls: [
              {
                toolName: "codex-test-runner",
                args: { command: "npm run test:unit" },
              },
            ],
          };
        },
      }),
    }),
  });

  const result = await coreRuntime.requestGuideChatCompletion({
    provider: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    userText: "open browser and summarize",
    enabledSkillIds: ["codex-test-runner"],
    maxTurns: 3,
  });

  assert.match(result.text, /Tool loop stopped/);
  assert.equal(result.loopStopReason, "repeated_plan");
  assert.equal(generateCallCount, 2);
  assert.ok(Array.isArray(result.loopTrace));
  assert.equal(result.loopTrace.length, 2);
});

test("requestGuideChatCompletion resolves @ prefixed file path and returns recovered file content on max turns", async () => {
  const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-runtime-read-"));
  fs.writeFileSync(path.join(tempWorkspace, "README.md"), "Runtime fallback README content.", "utf8");

  let generateCount = 0;
  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async () => {
          generateCount += 1;
          if (generateCount % 2 === 1) {
            return {
              toolCalls: [
                {
                  toolName: "codex-file-read",
                  args: { path: "@README.md" },
                },
              ],
            };
          }
          return {
            toolCalls: [
              {
                toolName: "codex-file-search",
                args: { query: "README.md" },
              },
            ],
          };
        },
      }),
    }),
  });

  try {
    const result = await coreRuntime.requestGuideChatCompletion({
      provider: "lmstudio",
      modelName: "openai/gpt-oss-20b",
      userText: "@README.md の内容を教えて",
      enabledSkillIds: ["codex-file-read", "codex-file-search"],
      workspaceRoot: tempWorkspace,
      maxTurns: 4,
    });

    assert.equal(result.loopStopReason, "max_turns");
    assert.match(result.text, /Recovered file read:/);
    assert.match(result.text, /Runtime fallback README content\./);
    assert.ok(
      result.toolCalls.some(
        (call) =>
          call.tool_name === "codex-file-read" &&
          call.output &&
          call.output.ok === true &&
          String(call.output.path) === "README.md"
      )
    );
  } finally {
    fs.rmSync(tempWorkspace, { recursive: true, force: true });
  }
});

test("requestGuideChatCompletion codex-file-search returns concrete workspace matches", async () => {
  const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-runtime-search-"));
  fs.mkdirSync(path.join(tempWorkspace, "docs"), { recursive: true });
  fs.writeFileSync(path.join(tempWorkspace, "docs", "README.md"), "Guide search test content.", "utf8");

  const capturedGenerateRequests = [];
  let generateCount = 0;
  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async (request) => {
          generateCount += 1;
          capturedGenerateRequests.push(request);
          if (generateCount === 1) {
            return {
              toolCalls: [
                {
                  toolName: "codex-file-search",
                  args: { query: "README.md" },
                },
              ],
            };
          }
          return { outputText: "search-done" };
        },
      }),
    }),
  });

  try {
    const result = await coreRuntime.requestGuideChatCompletion({
      provider: "lmstudio",
      modelName: "openai/gpt-oss-20b",
      userText: "READMEを検索して",
      enabledSkillIds: ["codex-file-search"],
      workspaceRoot: tempWorkspace,
    });

    assert.equal(result.text, "search-done");
    assert.equal(capturedGenerateRequests.length, 2);
    const executedSearch = capturedGenerateRequests[1].toolCalls[0];
    assert.equal(executedSearch.tool_name, "codex-file-search");
    assert.equal(executedSearch.output.ok, true);
    assert.ok(Array.isArray(executedSearch.output.matches));
    assert.ok(executedSearch.output.matches.some((entry) => entry.path === "docs/README.md"));
  } finally {
    fs.rmSync(tempWorkspace, { recursive: true, force: true });
  }
});

test("requestGuideChatCompletion resolves workspace-name-prefixed file-read path", async () => {
  const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-runtime-prefix-read-"));
  const workspaceName = path.basename(tempWorkspace);
  fs.writeFileSync(path.join(tempWorkspace, "README.md"), "Workspace prefix read test.", "utf8");

  const capturedGenerateRequests = [];
  let generateCount = 0;
  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async (request) => {
          generateCount += 1;
          capturedGenerateRequests.push(request);
          if (generateCount === 1) {
            return {
              toolCalls: [
                {
                  toolName: "codex-file-read",
                  args: { path: `${workspaceName}/README.md`, maxChars: 2000 },
                },
              ],
            };
          }
          return { outputText: "prefixed-read-ok" };
        },
      }),
    }),
  });

  try {
    const result = await coreRuntime.requestGuideChatCompletion({
      provider: "lmstudio",
      modelName: "openai/gpt-oss-20b",
      userText: "READMEを読んで",
      enabledSkillIds: ["codex-file-read"],
      workspaceRoot: tempWorkspace,
    });

    assert.equal(result.text, "prefixed-read-ok");
    assert.equal(capturedGenerateRequests.length, 2);
    const executedRead = capturedGenerateRequests[1].toolCalls[0];
    assert.equal(executedRead.tool_name, "codex-file-read");
    assert.equal(executedRead.output.ok, true);
    assert.match(String(executedRead.output.content), /Workspace prefix read test\./);
  } finally {
    fs.rmSync(tempWorkspace, { recursive: true, force: true });
  }
});

test("requestGuideChatCompletion resolves workspace-name-prefixed file-search path", async () => {
  const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-runtime-prefix-search-"));
  const workspaceName = path.basename(tempWorkspace);
  fs.mkdirSync(path.join(tempWorkspace, "docs"), { recursive: true });
  fs.writeFileSync(path.join(tempWorkspace, "docs", "README.md"), "Workspace prefix search.", "utf8");

  const capturedGenerateRequests = [];
  let generateCount = 0;
  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async (request) => {
          generateCount += 1;
          capturedGenerateRequests.push(request);
          if (generateCount === 1) {
            return {
              toolCalls: [
                {
                  toolName: "codex-file-search",
                  args: { query: "README.md", path: workspaceName, maxResults: 10 },
                },
              ],
            };
          }
          return { outputText: "prefixed-search-ok" };
        },
      }),
    }),
  });

  try {
    const result = await coreRuntime.requestGuideChatCompletion({
      provider: "lmstudio",
      modelName: "openai/gpt-oss-20b",
      userText: "READMEを検索して",
      enabledSkillIds: ["codex-file-search"],
      workspaceRoot: tempWorkspace,
    });

    assert.equal(result.text, "prefixed-search-ok");
    assert.equal(capturedGenerateRequests.length, 2);
    const executedSearch = capturedGenerateRequests[1].toolCalls[0];
    assert.equal(executedSearch.tool_name, "codex-file-search");
    assert.equal(executedSearch.output.ok, true);
    assert.ok(Array.isArray(executedSearch.output.matches));
    assert.ok(executedSearch.output.matches.some((entry) => entry.path === "docs/README.md"));
  } finally {
    fs.rmSync(tempWorkspace, { recursive: true, force: true });
  }
});

test("requestGuideChatCompletion returns file-not-found fallback when read fails and loop stops", async () => {
  const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-runtime-missing-"));

  let generateCount = 0;
  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async () => {
          generateCount += 1;
          if (generateCount === 1) {
            return {
              toolCalls: [
                {
                  toolName: "codex-file-read",
                  args: { path: "README.md", maxChars: 2000 },
                },
              ],
            };
          }
          return {
            toolCalls: [
              {
                toolName: "codex-file-search",
                args: { query: "README.md", path: ".", maxResults: 10 },
              },
            ],
          };
        },
      }),
    }),
  });

  try {
    const result = await coreRuntime.requestGuideChatCompletion({
      provider: "lmstudio",
      modelName: "openai/gpt-oss-20b",
      userText: "@README.md の内容を教えて",
      enabledSkillIds: ["codex-file-read", "codex-file-search"],
      workspaceRoot: tempWorkspace,
      maxTurns: 4,
    });

    assert.equal(result.loopStopReason, "repeated_plan");
    assert.match(result.text, /Requested file could not be read\./);
    assert.match(result.text, /Path: README\.md/);
    assert.match(result.text, /Reason: file not found/);
  } finally {
    fs.rmSync(tempWorkspace, { recursive: true, force: true });
  }
});

test("requestGuideChatCompletion stops early when the same file-read not-found repeats", async () => {
  const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-runtime-repeated-missing-"));
  let generateCount = 0;

  coreRuntime.__setCoreRuntimeBindingsForTest({
    getProvider: () => ({
      getModel: () => ({
        generate: async () => {
          generateCount += 1;
          if (generateCount === 1) {
            return {
              toolCalls: [
                {
                  toolName: "codex-file-read",
                  args: { path: "README.md", maxChars: 2000 },
                },
              ],
            };
          }
          if (generateCount === 2) {
            return {
              toolCalls: [
                {
                  toolName: "codex-file-search",
                  args: { query: "README.md", path: ".", maxResults: 10 },
                },
              ],
            };
          }
          return {
            toolCalls: [
              {
                toolName: "codex-file-read",
                args: { path: "README.md", maxChars: 2000 },
              },
            ],
          };
        },
      }),
    }),
  });

  try {
    const result = await coreRuntime.requestGuideChatCompletion({
      provider: "lmstudio",
      modelName: "openai/gpt-oss-20b",
      userText: "@README.md の内容を教えて",
      enabledSkillIds: ["codex-file-read", "codex-file-search"],
      workspaceRoot: tempWorkspace,
      maxTurns: 6,
    });

    assert.equal(result.loopStopReason, "repeated_file_read_not_found");
    assert.match(result.text, /Requested file could not be read\./);
    assert.match(result.text, /Path: README\.md/);
    assert.equal(generateCount, 3);
  } finally {
    fs.rmSync(tempWorkspace, { recursive: true, force: true });
  }
});

