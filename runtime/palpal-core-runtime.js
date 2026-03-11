const {
  runCodexGuideCliCompletion,
  __setCliToolRuntimeBindingsForTest,
  __resetCliToolRuntimeBindingsForTest,
} = require("./cli-tool-runtime");
const {
  GUIDE_SYSTEM_PROMPT,
  normalizeText,
  runtimeDebugLog,
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
const { buildSkillTools, runModelToolLoop } = require("./palpal-core-tool-runtime");

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

