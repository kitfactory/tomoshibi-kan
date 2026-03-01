(function initPalpalCoreProviderRegistry(global) {
  const providers = [
    { id: "openai", label: "OpenAI" },
    { id: "anthropic", label: "Anthropic" },
    { id: "google", label: "Google" },
    { id: "azure_openai", label: "Azure OpenAI" },
    { id: "local_ollama", label: "Local / Ollama" },
  ];

  global.PALPAL_CORE_PROVIDERS = providers;
})(window);
