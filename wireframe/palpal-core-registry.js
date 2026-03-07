(function initPalpalCoreProviderRegistry(global) {
  if (
    global.PalpalCoreRuntime &&
    typeof global.PalpalCoreRuntime.listProviderModels === "function"
  ) {
    return;
  }

  if (
    Array.isArray(global.PALPAL_CORE_PROVIDERS) &&
    Array.isArray(global.PALPAL_CORE_MODELS)
  ) {
    return;
  }

  const providers = [
    { id: "openai", label: "OpenAI" },
    { id: "ollama", label: "Ollama" },
    { id: "lmstudio", label: "LM Studio" },
    { id: "gemini", label: "Gemini" },
    { id: "anthropic", label: "Anthropic" },
    { id: "openrouter", label: "OpenRouter" },
  ];

  const models = [
    { name: "openai/gpt-oss-20b", provider: "lmstudio" },
    { name: "openai/gpt-oss-20b", provider: "openai" },
    { name: "qwen3.5-32b", provider: "ollama" },
    { name: "gpt-4.1", provider: "openai" },
    { name: "gpt-4o", provider: "openai" },
    { name: "gpt-4o-mini", provider: "openai" },
    { name: "o3", provider: "openai" },
    { name: "o4-mini", provider: "openai" },
    { name: "claude-3-7-sonnet", provider: "anthropic" },
    { name: "gemini-2.0-flash", provider: "gemini" },
    { name: "openrouter/auto", provider: "openrouter" },
  ];

  global.PALPAL_CORE_PROVIDERS = providers;
  global.PALPAL_CORE_MODELS = models;
})(window);
