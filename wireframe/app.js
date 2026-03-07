const STATUS_UI_ID = {
  assigned: "UI-PPH-0005",
  in_progress: "UI-PPH-0006",
  to_gate: "UI-PPH-0007",
  rejected: "UI-PPH-0008",
  done: "UI-PPH-0009",
};

const UI_TEXT = {
  ja: {
    "UI-PPH-0001": "ワークスペース",
    "UI-PPH-0002": "Guide Chat",
    "UI-PPH-0003": "Task Board",
    "UI-PPH-0004": "Event Log",
    "UI-PPH-0005": "割り当て済み",
    "UI-PPH-0006": "実行中",
    "UI-PPH-0007": "判定待ち",
    "UI-PPH-0008": "差し戻し",
    "UI-PPH-0009": "完了",
    "UI-PPH-0010": "設定",
    "UI-PPH-0011": "Agent設定",
    "UI-PPH-0012": "Workspace設定",
    "UI-PPH-0201": "Sort: updated_at desc (固定)",
    "UI-PPH-0202": "Filter: none (MVP)",
    "UI-PPH-0203": "Limit: 50 (暫定)",
    "UI-PPH-0204": "Task Detail",
    "UI-PPH-0205": "Gate Panel",
    "UI-PPH-0206": "Reject Reason",
    "UI-PPH-0207": "Pal Preview Slot",
    "UI-PPH-0208": "3D Coming Soon",
    "UI-PPH-0209": "Reject",
    "UI-PPH-0210": "Approve",
    "UI-PPH-0211": "Agent / Guide",
    "UI-PPH-0212": "Agent / Gate",
    "UI-PPH-0213": "Agent / Pal",
    "UI-PPH-0214": "Safety",
    "UI-PPH-0215": "Workspace",
  },
  en: {
    "UI-PPH-0001": "Workspace",
    "UI-PPH-0002": "Guide Chat",
    "UI-PPH-0003": "Task Board",
    "UI-PPH-0004": "Event Log",
    "UI-PPH-0005": "Assigned",
    "UI-PPH-0006": "In Progress",
    "UI-PPH-0007": "Awaiting Gate",
    "UI-PPH-0008": "Rejected",
    "UI-PPH-0009": "Done",
    "UI-PPH-0010": "Settings",
    "UI-PPH-0011": "Agent",
    "UI-PPH-0012": "Workspace",
    "UI-PPH-0201": "Sort: updated_at desc (fixed)",
    "UI-PPH-0202": "Filter: none (MVP)",
    "UI-PPH-0203": "Limit: 50 (temporary)",
    "UI-PPH-0204": "Task Detail",
    "UI-PPH-0205": "Gate Panel",
    "UI-PPH-0206": "Reject Reason",
    "UI-PPH-0207": "Pal Preview Slot",
    "UI-PPH-0208": "3D Coming Soon",
    "UI-PPH-0209": "Reject",
    "UI-PPH-0210": "Approve",
    "UI-PPH-0211": "Agent / Guide",
    "UI-PPH-0212": "Agent / Gate",
    "UI-PPH-0213": "Agent / Pal",
    "UI-PPH-0214": "Safety",
    "UI-PPH-0215": "Workspace",
  },
};

const DYNAMIC_TEXT = {
  ja: {
    detail: "詳細",
    start: "着手",
    submit: "提出",
    gate: "Gate判定",
    resubmit: "再提出",
    selectedTask: "選択Task",
    description: "説明",
    constraints: "制約チェック",
    evidence: "Evidence",
    replay: "Replay",
    gateDecision: "Gate判定",
    gateReason: "判定理由",
    gateFixes: "修正項目",
    fixCondition: "修正条件",
    openGate: "Gate Panelを開く",
    close: "閉じる",
    noTaskSelected: "Taskを選択してください。",
    noTask: "Taskがありません。",
    noJob: "Cronがありません。",
    schedule: "実行周期",
    instruction: "指示",
    lastRun: "最終実行",
    gateProfile: "Gate",
    gateReviewBy: "Gate判定",
    gateOnlyToGate: "現在の状態ではGate判定は実行できません。",
    rejectReasonPlaceholder: "差し戻し理由（最大3項目）",
    gateReasonTemplateLabel: "理由テンプレート",
    settingsReadonly: "MVP: 設定は閲覧のみ",
    view: "表示",
    guideHint: "Guideと会話しながらタスク化・進捗更新できます。",
    guideInputPlaceholder: "Guideへメッセージを入力（Enterで送信 / Shift+Enterで改行）",
    guideSend: "送信",
    guideSending: "送信中",
    senderGuide: "guide",
    senderYou: "you",
    senderSystem: "system",
    errorToastTitle: "Error",
    errorToastClose: "close",
    eventSearchPlaceholder: "イベント検索（ID/要約/種別）",
    eventTypeAll: "種別: すべて",
    eventTypeDispatch: "種別: dispatch",
    eventTypeGate: "種別: gate",
    eventTypeTask: "種別: task",
    eventTypeJob: "種別: cron",
    eventTypeResubmit: "種別: resubmit",
    eventTypePlan: "種別: plan",
    pagePrev: "前へ",
    pageNext: "次へ",
    eventNoMatch: "条件に一致するイベントがありません。",
  },
  en: {
    detail: "Detail",
    start: "Start",
    submit: "Submit",
    gate: "Gate Review",
    resubmit: "Resubmit",
    selectedTask: "Selected Task",
    description: "Description",
    constraints: "Constraints Check",
    evidence: "Evidence",
    replay: "Replay",
    gateDecision: "Gate Decision",
    gateReason: "Reason",
    gateFixes: "Fixes",
    fixCondition: "Fix Condition",
    openGate: "Open Gate Panel",
    close: "Close",
    noTaskSelected: "Select a task first.",
    noTask: "No tasks yet.",
    noJob: "No cron jobs yet.",
    schedule: "Schedule",
    instruction: "Instruction",
    lastRun: "Last Run",
    gateProfile: "Gate",
    gateReviewBy: "Gate Review",
    gateOnlyToGate: "Gate review is only available for to_gate tasks.",
    rejectReasonPlaceholder: "Reject reasons (max 3)",
    gateReasonTemplateLabel: "Reason Templates",
    settingsReadonly: "MVP: read-only settings",
    view: "View",
    guideHint: "Talk with Guide to create tasks and update progress.",
    guideInputPlaceholder: "Message Guide (Enter to send / Shift+Enter for newline)",
    guideSend: "Send",
    guideSending: "Sending",
    senderGuide: "guide",
    senderYou: "you",
    senderSystem: "system",
    errorToastTitle: "Error",
    errorToastClose: "close",
    eventSearchPlaceholder: "Search events (id/summary/type)",
    eventTypeAll: "Type: all",
    eventTypeDispatch: "Type: dispatch",
    eventTypeGate: "Type: gate",
    eventTypeTask: "Type: task",
    eventTypeJob: "Type: cron",
    eventTypeResubmit: "Type: resubmit",
    eventTypePlan: "Type: plan",
    pagePrev: "Prev",
    pageNext: "Next",
    eventNoMatch: "No events match the current filter.",
  },
};

const MESSAGE_TEXT = {
  "MSG-PPH-0001": {
    ja: "Plan Cardを作成しました。",
    en: "Plan card created.",
  },
  "MSG-PPH-0002": {
    ja: "TaskをPalへ配布しました。",
    en: "Tasks dispatched to Pal.",
  },
  "MSG-PPH-0003": {
    ja: "Completion Ritualを保存してGateへ提出しました。",
    en: "Completion ritual saved and submitted to Gate.",
  },
  "MSG-PPH-0004": {
    ja: "Gate判定を記録しました。",
    en: "Gate decision recorded.",
  },
  "MSG-PPH-0005": {
    ja: "差し戻しTaskを再提出しました。",
    en: "Rejected task resubmitted.",
  },
  "MSG-PPH-0007": {
    ja: "Pal制約を適用しました。",
    en: "Pal constraints applied.",
  },
  "MSG-PPH-0008": {
    ja: "Plan完了を通知しました。",
    en: "Plan completion was posted.",
  },
  "MSG-PPH-0009": {
    ja: "Guideチャットを更新しました。",
    en: "Guide chat updated.",
  },
  "MSG-PPH-1001": {
    ja: "入力内容を確認してください。",
    en: "Check your input.",
  },
  "MSG-PPH-1002": {
    ja: "処理がタイムアウトしました。再試行してください。",
    en: "Operation timed out. Please retry.",
  },
  "MSG-PPH-1003": {
    ja: "保存に失敗しました。保存先を確認してください。",
    en: "Failed to save. Check storage destination.",
  },
  "MSG-PPH-1004": {
    ja: "対象データが見つかりません。",
    en: "Target data not found.",
  },
  "MSG-PPH-1005": {
    ja: "セーフティ制約により操作をブロックしました。",
    en: "Operation blocked by safety constraints.",
  },
  "MSG-PPH-1006": {
    ja: "現在の状態ではその操作は実行できません。",
    en: "This action is not available in the current state.",
  },
  "MSG-PPH-1007": {
    ja: "Reject入力が上限制約を超えています。",
    en: "Reject input exceeds limit.",
  },
  "MSG-PPH-1008": {
    ja: "完了判定に不整合があります。状態を再確認してください。",
    en: "Completion state is inconsistent. Check statuses.",
  },
  "MSG-PPH-1010": {
    ja: "Guideモデルが未設定です。Settingsでモデルを設定してください。",
    en: "Guide model is not configured. Configure a model in Settings.",
  },
};

const GUIDE_MODEL_REQUEST_TIMEOUT_MS = 1600;
const GUIDE_SYSTEM_PROMPT = "Guide operating rules are not configured.";

function buildOperatingRulesPrompt(role, localeValue, targetKind = "task") {
  const normalizedRole = normalizePalRole(role);
  const isJa = localeValue !== "en";
  if (normalizedRole === "gate") {
    return isJa
      ? [
        "あなたは Gate です。",
        "- 提出物を要件、制約、RUBRIC に照らして評価する。",
        "- 判定は `decision`, `reason`, `fixes` が分かる形で返す。",
        "- approve の場合は根拠が十分であることを明示する。",
        "- reject の場合は修正条件を具体的な箇条書きで返す。",
      ].join("\n")
      : [
        "You are Gate.",
        "- Evaluate submissions against requirements, constraints, and the RUBRIC.",
        "- Return the result in a shape that makes `decision`, `reason`, and `fixes` clear.",
        "- For approve, state why the evidence is sufficient.",
        "- For reject, return concrete fix conditions as bullet points.",
      ].join("\n");
  }
  if (normalizedRole === "worker") {
    const assignmentLabel = targetKind === "job" ? "cron job" : "task";
    return isJa
      ? [
        "あなたは Worker Pal です。",
        `- 割り当てられた${targetKind === "job" ? "Cron" : "Task"}を順序立てて実行する。`,
        "- 実行結果は確認できた事実と根拠を短く報告する。",
        "- できない場合は詰まった理由と不足情報を明示する。",
        "- 不要な雑談は避け、作業結果に集中する。",
      ].join("\n")
      : [
        "You are Worker Pal.",
        `- Execute the assigned ${assignmentLabel} step by step.`,
        "- Report concise evidence and confirmed outcomes.",
        "- If blocked, state the reason and what information is missing.",
        "- Stay focused on execution rather than general discussion.",
      ].join("\n");
  }
  return isJa
    ? [
      "あなたは Guide です。",
      "- まず最新のユーザー発話が、仕事の依頼へ進もうとしているかどうかを判定する。",
      "- plan、task 分解、trace / fix / verify への分割、進め方の確定、調査依頼、修正依頼、確認依頼は work intent として扱う。",
      "- work intent であれば、要件を満たすために必要な情報を Guide から提案・質問して具体化する。可能であれば質問だけで止まらず、提案で進める。",
      "- 短いターンで曖昧な時は、これまでの会話からあり得そうな案件を具体化した 3 つの選択肢を、可能性の高い順に提示し、最も妥当な候補を 1 つ推薦する。",
      "- 提案はユーザーが短く選べる形にし、抽象語ではなく対象・問題・期待結果が分かる粒度で出す。",
      "- 3 案を出した後は、`1でよいですか？` のように、番号や短い yes/no で返答できる締めを使う。",
      "- work intent で、対象、問題、期待結果、再現手順、関連ファイル、使える tool のうち主要な材料が揃っていれば plan 作成を優先する。",
      "- task 作成を止める blocker が 1 つだけある時だけ追加確認する。軽微な不足情報は assumptions として constraints に残し、同じ確認質問を繰り返さない。",
      "- debug workspace で明示的に breakdown を求められた時は、Trace / Fix / Verify の3段に整理することを優先する。",
      "- 候補 Pal や available tool が文脈にある時は、担当 Pal をユーザーへ聞き返さず自分で選ぶ。",
      "- どの Pal に何を担当させるかを決め、実行後にどの Gate で評価すべきかを意識して計画する。",
      "- 回答は簡潔にし、次の行動が分かる形で示す。",
    ].join("\n")
    : [
      "You are Guide.",
      "- First decide whether the latest user turn is moving toward a work request.",
      "- Treat requests for a plan, task breakdown, trace / fix / verify split, execution flow, investigation, implementation, or verification as work intent.",
      "- When work intent exists, help the user complete the request by proposing and, if needed, asking for the missing information. Prefer proposal over a bare follow-up question.",
      "- For a short ambiguous turn, propose three concrete likely work options grounded in the conversation so far, ordered by likelihood, and recommend the most plausible one.",
      "- Make options easy to answer with a short choice, keep each option specific about target, problem, and expected outcome, and close with a short prompt such as `Shall we go with 1?`.",
      "- When the main inputs are already present in a work request (target, problem, expected outcome, repro steps, relevant files, or available tools), prefer creating the plan.",
      "- Ask a follow-up only when one blocking fact prevents task creation. Treat minor gaps as assumptions in constraints and do not repeat the same clarification.",
      "- In the debug workspace, when the user explicitly wants a breakdown, prefer a three-step Trace / Fix / Verify plan.",
      "- If suitable Pals and tools are already available in context, choose the assignee yourself instead of asking the user to pick one.",
      "- Decide which Pal should do what and plan with the expected Gate evaluation in mind.",
      "- Keep the response concise and action-oriented.",
    ].join("\n");
}
const SETTINGS_LOCAL_STORAGE_KEY = "tomoshibi-kan.settings.v1";
const LEGACY_SETTINGS_LOCAL_STORAGE_KEYS = ["palpal-hive.settings.v1"];
const GATE_REASON_TEMPLATES = [
  {
    id: "missing-evidence",
    ja: "Evidence不足",
    en: "Missing evidence",
  },
  {
    id: "missing-test",
    ja: "テスト不足",
    en: "Insufficient tests",
  },
  {
    id: "spec-mismatch",
    ja: "仕様との差分あり",
    en: "Spec mismatch",
  },
  {
    id: "needs-retry-steps",
    ja: "再現手順を明確化",
    en: "Clarify repro steps",
  },
];

function normalizeText(value) {
  return String(value || "").trim();
}

function resolveWindowBridge(nextName, legacyName) {
  if (typeof window === "undefined") return null;
  return window[nextName] || window[legacyName] || null;
}

function readLocalStorageSnapshot(primaryKey, legacyKeys = []) {
  if (typeof window === "undefined" || !window.localStorage) return null;
  for (const key of [primaryKey, ...legacyKeys]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return raw;
    } catch (error) {
      return null;
    }
  }
  return null;
}

function writeLocalStorageSnapshot(primaryKey, payload) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(primaryKey, payload);
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function buildClawHubSkillUrl(skillId) {
  const normalized = normalizeGenericSkillId(skillId) || normalizeText(skillId);
  if (!normalized) return `${CLAWHUB_WEB_BASE_URL}/skills`;
  if (STANDARD_SKILL_IDS.includes(normalized)) {
    const searchParams = new URLSearchParams({
      sort: "downloads",
      nonSuspicious: "true",
      q: normalized,
    });
    return `${CLAWHUB_WEB_BASE_URL}/skills?${searchParams.toString()}`;
  }
  return `${CLAWHUB_WEB_BASE_URL}/skills/${encodeURIComponent(normalized)}`;
}

function resolveExternalLinkApi() {
  const bridge = resolveWindowBridge("TomoshibikanExternal", "PalpalExternal");
  return bridge && typeof bridge.openUrl === "function" ? bridge : null;
}

async function openExternalUrlWithFallback(url) {
  const target = normalizeText(url);
  if (!target) return false;
  const externalApi = resolveExternalLinkApi();
  if (externalApi) {
    try {
      const opened = await externalApi.openUrl(target);
      if (opened) return true;
    } catch (error) {
      // fallback below
    }
  }
  if (typeof window !== "undefined" && typeof window.open === "function") {
    window.open(target, "_blank", "noopener,noreferrer");
    return true;
  }
  return false;
}

function normalizeSearchKeyword(value) {
  const normalized = normalizeText(value);
  if (!normalized) return "";
  try {
    return normalized.normalize("NFKC").toLowerCase();
  } catch (error) {
    return normalized.toLowerCase();
  }
}

function buildModelOptionList(catalogEntries, extraNames = []) {
  const seen = new Set();
  const result = [];
  const push = (value) => {
    const normalized = normalizeText(value);
    const dedupeKey = normalized.toLowerCase();
    if (!normalized || seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    result.push(normalized);
  };
  if (Array.isArray(catalogEntries)) {
    catalogEntries.forEach((entry) => {
      if (typeof entry === "string") {
        push(entry);
        return;
      }
      if (entry && typeof entry === "object") {
        push(entry.name);
      }
    });
  }
  if (Array.isArray(extraNames)) {
    extraNames.forEach((name) => push(name));
  }
  return result;
}

function resolveRuntimeDefaultsFromBridge() {
  const fallback = {
    providerId: "lmstudio",
    modelName: "openai/gpt-oss-20b",
    baseUrl: "http://192.168.11.16:1234/v1",
    apiKey: "lmstudio",
  };
  const runtimeConfig = resolveWindowBridge("TomoshibikanRuntimeConfig", "PalpalRuntimeConfig");
  if (!runtimeConfig) return fallback;
  const source = typeof runtimeConfig.getDefaults === "function"
    ? runtimeConfig.getDefaults()
    : runtimeConfig.defaults;
  if (!source || typeof source !== "object") return fallback;
  return {
    providerId: normalizeText(source.providerId) || fallback.providerId,
    modelName: normalizeText(source.modelName) || fallback.modelName,
    baseUrl: normalizeText(source.baseUrl) || fallback.baseUrl,
    apiKey: normalizeText(source.apiKey) || fallback.apiKey,
  };
}

const FALLBACK_PROVIDER_REGISTRY = [
  { id: "openai", label: "OpenAI" },
  { id: "ollama", label: "Ollama" },
  { id: "lmstudio", label: "LM Studio" },
  { id: "gemini", label: "Gemini" },
  { id: "anthropic", label: "Anthropic" },
  { id: "openrouter", label: "OpenRouter" },
];

function hasRuntimeCatalogBridge() {
  const runtime = resolveWindowBridge("TomoshibikanCoreRuntime", "PalpalCoreRuntime");
  return Boolean(
    runtime &&
    typeof runtime.listProviderModels === "function"
  );
}

function resolveProviderRegistry(rawProviders) {
  const normalized = new Map();
  if (Array.isArray(rawProviders)) {
    rawProviders.forEach((provider) => {
      if (!provider) return;
      if (typeof provider === "string") {
        const id = normalizeText(provider);
        if (!id) return;
        normalized.set(id, { id, label: id });
        return;
      }
      if (typeof provider !== "object") return;
      const id = normalizeText(provider.id || provider.provider || provider.providerId || provider.value);
      if (!id) return;
      const label = normalizeText(provider.label || provider.name || id);
      normalized.set(id, { id, label: label || id });
    });
  }
  if (normalized.size > 0) {
    return [...normalized.values()];
  }
  if (hasRuntimeCatalogBridge()) {
    return [];
  }
  return [...FALLBACK_PROVIDER_REGISTRY];
}

let PALPAL_CORE_PROVIDER_REGISTRY = resolveProviderRegistry(
  typeof window !== "undefined"
    ? (window.TOMOSHIBIKAN_CORE_PROVIDERS || window.PALPAL_CORE_PROVIDERS)
    : []
);

let PROVIDER_OPTIONS = PALPAL_CORE_PROVIDER_REGISTRY.map((provider) => provider.id);
let DEFAULT_PROVIDER_ID = PROVIDER_OPTIONS[0] || "openai";
const PROVIDER_ALIASES = {
  local_ollama: "ollama",
  "local-ollama": "ollama",
  lm_studio: "lmstudio",
  "lm-studio": "lmstudio",
};
const OPTIONAL_API_KEY_PROVIDERS = new Set(["ollama", "lmstudio"]);

function normalizeProviderIdForCatalog(value) {
  const normalized = normalizeText(value);
  if (!normalized) return "";
  const aliasResolved = PROVIDER_ALIASES[normalized] || normalized;
  const matched = PALPAL_CORE_PROVIDER_REGISTRY.find(
    (provider) => provider.id === aliasResolved || provider.label === aliasResolved
  );
  return matched ? matched.id : aliasResolved;
}

function inferProviderIdFromModelName(modelName) {
  const normalized = normalizeText(modelName);
  if (!normalized) return "";
  const prefix = normalized.split("/")[0];
  return PROVIDER_OPTIONS.includes(prefix) ? prefix : "";
}

function extractModelNameFromCatalogEntry(entry) {
  if (typeof entry === "string") return normalizeText(entry);
  if (!entry || typeof entry !== "object") return "";
  return normalizeText(
    entry.name ||
    entry.modelName ||
    entry.model ||
    entry.id ||
    entry.value
  );
}

function extractProviderIdFromCatalogEntry(entry, fallbackProviderId = "") {
  if (!entry || typeof entry !== "object") {
    return normalizeProviderIdForCatalog(fallbackProviderId);
  }
  const byEntry = normalizeProviderIdForCatalog(
    entry.provider ||
    entry.providerId ||
    entry.provider_id ||
    entry.vendor ||
    entry.owner
  );
  if (byEntry) return byEntry;
  return normalizeProviderIdForCatalog(fallbackProviderId);
}

function normalizeCoreModelCatalog(entries) {
  const seen = new Set();
  const result = [];
  if (!Array.isArray(entries)) return result;
  entries.forEach((entry) => {
    const name = extractModelNameFromCatalogEntry(entry);
    if (!name) return;
    const inferredProvider = inferProviderIdFromModelName(name);
    const provider = extractProviderIdFromCatalogEntry(entry, inferredProvider || DEFAULT_PROVIDER_ID);
    const providerId = PROVIDER_OPTIONS.includes(provider) ? provider : (inferredProvider || DEFAULT_PROVIDER_ID);
    const dedupeKey = `${providerId}::${name}`.toLowerCase();
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    result.push({ name, provider: providerId });
  });
  return result;
}

function flattenProviderModelMapCatalog(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return [];
  const entries = [];
  PROVIDER_OPTIONS.forEach((providerId) => {
    const providerModels = candidate[providerId];
    if (!Array.isArray(providerModels)) return;
    providerModels.forEach((entry) => {
      if (typeof entry === "string") {
        entries.push({ name: entry, provider: providerId });
        return;
      }
      if (entry && typeof entry === "object") {
        entries.push({ ...entry, provider: entry.provider || entry.providerId || providerId });
      }
    });
  });
  return entries;
}

const FALLBACK_PALPAL_CORE_MODELS = [
  { name: "openai/gpt-oss-20b", provider: "lmstudio" },
  { name: "openai/gpt-oss-20b", provider: "openai" },
  { name: "gpt-4.1", provider: "openai" },
  { name: "gpt-4o", provider: "openai" },
  { name: "gpt-4o-mini", provider: "openai" },
  { name: "o3", provider: "openai" },
  { name: "o4-mini", provider: "openai" },
  { name: "claude-3-7-sonnet", provider: "anthropic" },
  { name: "gemini-2.5-pro", provider: "google" },
];

function resolvePalpalCoreModels() {
  if (typeof window === "undefined") {
    return normalizeCoreModelCatalog(FALLBACK_PALPAL_CORE_MODELS);
  }
  const direct = normalizeCoreModelCatalog(window.PALPAL_CORE_MODELS);
  if (direct.length > 0) return direct;

  const nestedModels = normalizeCoreModelCatalog(window.PALPAL_CORE_MODEL_REGISTRY?.models);
  if (nestedModels.length > 0) return nestedModels;

  const nestedByProvider = normalizeCoreModelCatalog(
    flattenProviderModelMapCatalog(window.PALPAL_CORE_MODEL_REGISTRY)
  );
  if (nestedByProvider.length > 0) return nestedByProvider;

  if (hasRuntimeCatalogBridge()) {
    return [];
  }

  return normalizeCoreModelCatalog(FALLBACK_PALPAL_CORE_MODELS);
}

const RUNTIME_DEFAULTS = resolveRuntimeDefaultsFromBridge();
const DEV_LMSTUDIO_PROVIDER_ID = PROVIDER_OPTIONS.includes(RUNTIME_DEFAULTS.providerId)
  ? RUNTIME_DEFAULTS.providerId
  : DEFAULT_PROVIDER_ID;
const DEV_LMSTUDIO_MODEL_NAME = RUNTIME_DEFAULTS.modelName;
const DEV_LMSTUDIO_BASE_URL = RUNTIME_DEFAULTS.baseUrl;
const DEV_LMSTUDIO_API_KEY = RUNTIME_DEFAULTS.apiKey;

function buildModelOptionsByProvider(modelCatalog, providerOptions) {
  return providerOptions.reduce((map, providerId) => {
    const providerModels = buildModelOptionList(
      modelCatalog
        .filter((entry) => entry.provider === providerId)
        .map((entry) => entry.name)
    );
    map.set(providerId, providerModels);
    return map;
  }, new Map());
}

let PALPAL_CORE_MODEL_REGISTRY = resolvePalpalCoreModels();
let PALPAL_CORE_MODEL_OPTIONS_BY_PROVIDER = buildModelOptionsByProvider(
  PALPAL_CORE_MODEL_REGISTRY,
  PROVIDER_OPTIONS
);
let MODEL_OPTIONS = buildModelOptionList(PALPAL_CORE_MODEL_REGISTRY, [DEV_LMSTUDIO_MODEL_NAME]);
let DEFAULT_MODEL_NAME = DEV_LMSTUDIO_MODEL_NAME || MODEL_OPTIONS[0] || "";

const CLI_TOOL_OPTIONS = ["Codex", "ClaudeCode", "OpenCode"];
const STANDARD_SKILL_CATALOG = [
  {
    id: "codex-file-search",
    name: "File Search",
    mountPoint: "model-runtime",
    description: "Search files and text quickly",
  },
  {
    id: "codex-file-read",
    name: "File Read",
    mountPoint: "model-runtime",
    description: "Open and inspect file contents",
  },
  {
    id: "codex-file-edit",
    name: "File Edit",
    mountPoint: "model-runtime",
    description: "Apply safe file edits and patches",
  },
  {
    id: "codex-shell-command",
    name: "Shell Command",
    mountPoint: "model-runtime",
    description: "Run terminal commands in workspace",
  },
  {
    id: "codex-test-runner",
    name: "Test Runner",
    mountPoint: "model-runtime",
    description: "Execute tests and inspect failures",
  },
  {
    id: "browser-chrome",
    name: "Chrome Browser",
    mountPoint: "model-runtime",
    description: "Chrome browser control skill",
  },
];
const CLAWHUB_SKILL_META = {
  "codex-file-search": {
    safety: "High",
    rating: 4.8,
    downloads: 12420,
    stars: 932,
    installs: 4180,
    updatedAt: "2026-03-01T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
  "codex-file-read": {
    safety: "High",
    rating: 4.7,
    downloads: 11300,
    stars: 870,
    installs: 3950,
    updatedAt: "2026-02-20T08:00:00Z",
    highlighted: false,
    suspicious: false,
  },
  "codex-file-edit": {
    safety: "Medium",
    rating: 4.5,
    downloads: 9850,
    stars: 721,
    installs: 3520,
    updatedAt: "2026-02-14T08:00:00Z",
    highlighted: false,
    suspicious: false,
  },
  "codex-shell-command": {
    safety: "Medium",
    rating: 4.2,
    downloads: 8120,
    stars: 604,
    installs: 2870,
    updatedAt: "2026-01-29T08:00:00Z",
    highlighted: false,
    suspicious: true,
  },
  "codex-test-runner": {
    safety: "High",
    rating: 4.6,
    downloads: 10450,
    stars: 788,
    installs: 3340,
    updatedAt: "2026-02-24T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
  "browser-chrome": {
    safety: "Medium",
    rating: 4.4,
    downloads: 9080,
    stars: 682,
    installs: 3010,
    updatedAt: "2026-02-10T08:00:00Z",
    highlighted: true,
    suspicious: false,
  },
};
const SKILL_MARKET_SORT_OPTIONS = ["downloads", "stars", "installs", "updated", "highlighted"];
const DEFAULT_SKILL_SEARCH_FILTERS = {
  nonSuspiciousOnly: true,
  highlightedOnly: false,
  sortBy: "downloads",
};
const CLAWHUB_WEB_BASE_URL = "https://clawhub.ai";
const CLAWHUB_API_BASE_URL = "https://clawhub.ai/api/v1";
const CLAWHUB_API_REQUEST_TIMEOUT_MS = 5000;
const CLAWHUB_API_SEARCH_LIMIT = 30;
const CLAWHUB_API_BROWSE_LIMIT = 250;
const CLAWHUB_API_DETAIL_ENRICH_LIMIT = 12;
const CLAWHUB_SKILL_REGISTRY = STANDARD_SKILL_CATALOG.map((skill) => ({
  ...skill,
  packageName: `clawhub/${skill.id}`,
  source: "ClawHub",
  safety: CLAWHUB_SKILL_META[skill.id]?.safety || "Unknown",
  rating: Number(CLAWHUB_SKILL_META[skill.id]?.rating || 0),
  downloads: Number(CLAWHUB_SKILL_META[skill.id]?.downloads || 0),
  stars: Number(CLAWHUB_SKILL_META[skill.id]?.stars || 0),
  installs: Number(CLAWHUB_SKILL_META[skill.id]?.installs || 0),
  updatedAt: String(CLAWHUB_SKILL_META[skill.id]?.updatedAt || ""),
  highlighted: Boolean(CLAWHUB_SKILL_META[skill.id]?.highlighted),
  suspicious: Boolean(CLAWHUB_SKILL_META[skill.id]?.suspicious),
}));
const ADDITIONAL_SKILL_REGISTRY = [];
const STANDARD_SKILL_IDS = STANDARD_SKILL_CATALOG.map((skill) => skill.id);
const ROLE_SKILL_POLICY = {
  guide: ["codex-file-search", "codex-file-read", "browser-chrome"],
  gate: ["codex-file-search", "codex-file-read", "codex-test-runner", "browser-chrome"],
  worker: [...STANDARD_SKILL_IDS],
};
const PAL_ROLE_OPTIONS = ["guide", "gate", "worker"];
const PAL_RUNTIME_KIND_OPTIONS = ["model", "tool"];
const EVENT_LOG_PAGE_SIZE = 6;
const EVENT_TYPE_FILTER_KEYS = ["all", "dispatch", "gate", "task", "job", "resubmit", "plan"];
const PROJECTS_LOCAL_STORAGE_KEY = "tomoshibi-kan.projects.v1";
const LEGACY_PROJECTS_LOCAL_STORAGE_KEYS = ["palpal-hive.projects.v1"];
const PAL_PROFILES_LOCAL_STORAGE_KEY = "tomoshibi-kan.agent-profiles.v1";
const LEGACY_PAL_PROFILES_LOCAL_STORAGE_KEYS = ["palpal-hive.agent-profiles.v1"];
const BOARD_STATE_LOCAL_STORAGE_KEY = "tomoshibi-kan.board-state.v1";
const LEGACY_BOARD_STATE_LOCAL_STORAGE_KEYS = ["palpal-hive.board-state.v1"];
const DEFAULT_PROJECT_FILE_HINTS = [
  "README.md",
  "docs/OVERVIEW.md",
  "docs/spec.md",
  "docs/plan.md",
  "wireframe/index.html",
  "wireframe/app.js",
  "wireframe/styles.css",
  "package.json",
];
const INITIAL_PROJECTS = [
  {
    id: "project-tomoshibi-kan",
    name: "Tomoshibi-kan",
    directory: "C:/Users/kitad/palpal-hive",
    files: [...DEFAULT_PROJECT_FILE_HINTS],
  },
];

const PREFERRED_SECONDARY_MODEL_NAME = MODEL_OPTIONS.includes("gpt-4o-mini")
  ? "gpt-4o-mini"
  : MODEL_OPTIONS.find((name) => name !== DEV_LMSTUDIO_MODEL_NAME) || "";
const SEEDED_SECONDARY_MODEL_NAME = PREFERRED_SECONDARY_MODEL_NAME !== DEV_LMSTUDIO_MODEL_NAME
  ? PREFERRED_SECONDARY_MODEL_NAME
  : MODEL_OPTIONS.find((name) => name !== DEV_LMSTUDIO_MODEL_NAME) || "";
const SEEDED_SECONDARY_MODEL_PROVIDER = PALPAL_CORE_MODEL_REGISTRY.find(
  (entry) => entry.name === SEEDED_SECONDARY_MODEL_NAME
)?.provider || DEFAULT_PROVIDER_ID;
const INITIAL_REGISTERED_MODELS = [
  {
    name: DEV_LMSTUDIO_MODEL_NAME,
    provider: DEV_LMSTUDIO_PROVIDER_ID,
    apiKey: "",
    apiKeyConfigured: true,
    baseUrl: DEV_LMSTUDIO_BASE_URL,
    endpoint: "",
  },
  ...(SEEDED_SECONDARY_MODEL_NAME
    ? [{
      name: SEEDED_SECONDARY_MODEL_NAME,
      provider: SEEDED_SECONDARY_MODEL_PROVIDER,
      apiKey: "",
      apiKeyConfigured: false,
      baseUrl: "",
      endpoint: "",
    }]
    : []),
];

const DEFAULT_CONTEXT_HANDOFF_POLICY = "balanced";
const DEFAULT_GUIDE_CONTROLLER_ASSIST_ENABLED = false;

const settingsState = {
  provider: DEV_LMSTUDIO_PROVIDER_ID,
  endpoint: "",
  apiKey: "",
  models: INITIAL_REGISTERED_MODELS.map((model) => model.name),
  temperature: "0.2",
  contextHandoffPolicy: DEFAULT_CONTEXT_HANDOFF_POLICY,
  guideControllerAssistEnabled: DEFAULT_GUIDE_CONTROLLER_ASSIST_ENABLED,
  registeredModels: INITIAL_REGISTERED_MODELS.map((model) => ({ ...model })),
  registeredTools: ["Codex"],
  registeredSkills: [...STANDARD_SKILL_IDS],
  skillSearchQuery: "",
  skillSearchDraft: "",
  skillSearchExecuted: false,
  skillSearchFilters: { ...DEFAULT_SKILL_SEARCH_FILTERS },
  skillSearchFilterDraft: { ...DEFAULT_SKILL_SEARCH_FILTERS },
  skillSearchResults: [],
  skillSearchLoading: false,
  skillSearchError: "",
  skillSearchRequestSeq: 0,
  skillMarketModalOpen: false,
  itemAddOpen: false,
  itemDraft: {
    type: "model",
    modelName: DEFAULT_MODEL_NAME,
    provider: DEV_LMSTUDIO_PROVIDER_ID,
    apiKey: "",
    baseUrl: "",
    endpoint: "",
    toolName: CLI_TOOL_OPTIONS[0],
  },
};

let locale = "ja";
let selectedTaskId = null;
let gateTarget = null;
let messageId = "";
let errorToastTimer = null;
let workspaceTab = "guide";
let eventSeq = 0;
let guideSendInFlight = false;
let guideComposerFocused = false;
let eventSearchQuery = "";
let eventTypeFilter = "all";
let eventPage = 1;
let settingsSavedSignature = "";
let settingsSaveInFlight = false;
let projectSeq = INITIAL_PROJECTS.length;
const palConfigModalState = {
  open: false,
  palId: "",
};
const identityEditorState = {
  open: false,
  palId: "",
  fileKind: "soul",
  loading: false,
  saving: false,
  text: "",
  identity: null,
  requestSeq: 0,
};
const gateRuntimeState = {
  loading: false,
  requestSeq: 0,
  suggestedDecision: "none",
  reason: "",
  fixes: [],
  rawText: "",
  error: "",
};

const projectState = {
  projects: INITIAL_PROJECTS.map((item) => ({ ...item, files: [...item.files] })),
  focusProjectId: INITIAL_PROJECTS[0]?.id || "",
  addDraft: {
    name: "",
    directory: "",
  },
};

const guideMentionState = {
  open: false,
  activeIndex: 0,
  tokenStart: -1,
  tokenEnd: -1,
  items: [],
};

let guideMessages = [
  {
    timestamp: "09:20",
    sender: "guide",
    text: {
      ja: "Plan Cardを提案します。Taskを3件に分割します。",
      en: "I propose a plan card. Splitting into 3 tasks.",
    },
  },
  {
    timestamp: "09:23",
    sender: "system",
    text: {
      ja: "Planは承認済みです。Task配布済み。",
      en: "Plan approved. Tasks dispatched.",
    },
  },
];

const tasks = [
  {
    id: "TASK-001",
    title: "Guide要件の確認",
    description: "REQ-0001〜REQ-0008 と画面設計要件を突合する",
    palId: "pal-alpha",
    status: "in_progress",
    updatedAt: "2026-02-28 09:30",
    decisionSummary: "-",
    constraintsCheckResult: "pass",
    evidence: "docs/spec.md, docs/concept.md",
    replay: "review-checklist",
    fixCondition: "-",
  },
  {
    id: "TASK-002",
    title: "ワイヤーフレーム作成",
    description: "Workspace / Task Detail / Gate / Settings をダミー実装",
    palId: "pal-beta",
    status: "to_gate",
    updatedAt: "2026-02-28 09:41",
    decisionSummary: "pending",
    constraintsCheckResult: "pass",
    evidence: "wireframe/index.html",
    replay: "open-browser > click-flow",
    fixCondition: "-",
  },
  {
    id: "TASK-003",
    title: "i18n IDマッピング",
    description: "UI-PPH-xxxx と ja/en 辞書の初期セットを定義",
    palId: "pal-gamma",
    status: "rejected",
    updatedAt: "2026-02-28 09:46",
    decisionSummary: "rejected",
    constraintsCheckResult: "pass",
    evidence: "ui-id-table",
    replay: "switch-ja-en",
    fixCondition: "UI-ID不足項目を追加",
  },
];

const jobs = [
  {
    id: "JOB-001",
    title: "依存アップデートの定期確認",
    description: "平日 09:00 に依存更新と脆弱性を確認して、要点をまとめる",
    palId: "pal-alpha",
    schedule: "Weekdays 09:00",
    instruction: "npm outdated && npm audit --omit=dev の結果を3行で報告する",
    status: "assigned",
    updatedAt: "2026-02-28 09:10",
    decisionSummary: "-",
    fixCondition: "-",
    lastRunAt: "-",
  },
  {
    id: "JOB-002",
    title: "E2E結果の週次サマリー",
    description: "毎週金曜にE2Eの成功率と失敗パターンを集計してGateへ提出する",
    palId: "pal-beta",
    schedule: "Fri 17:00",
    instruction: "npm run test:e2e の実行結果を集計し、次回改善ポイントを1件提案する",
    status: "to_gate",
    updatedAt: "2026-02-28 17:12",
    decisionSummary: "pending",
    fixCondition: "-",
    lastRunAt: "2026-02-28 17:05",
  },
];

const INITIAL_PAL_PROFILES = [
  {
    id: "guide-core",
    role: "guide",
    runtimeKind: "model",
    displayName: "Debug Guide",
    persona: "Clarify the issue, break work into trace/fix/verify, and choose the right debug worker.",
    provider: DEV_LMSTUDIO_PROVIDER_ID,
    models: [DEV_LMSTUDIO_MODEL_NAME],
    cliTools: [],
    skills: [...STANDARD_SKILL_IDS],
    status: "active",
  },
  {
    id: "gate-core",
    role: "gate",
    runtimeKind: "model",
    displayName: "Debug Gate",
    persona: "Evaluate debug evidence, test results, and safety before approval.",
    provider: "anthropic",
    models: ["claude-3-7-sonnet"],
    cliTools: [],
    skills: [...STANDARD_SKILL_IDS],
    status: "active",
  },
  {
    id: "pal-alpha",
    role: "worker",
    runtimeKind: "tool",
    displayName: "Trace Worker",
    persona: "Do trace work only: reproduce the issue, inspect files, and hand off evidence without editing.",
    provider: "openai",
    models: [],
    cliTools: ["Codex"],
    skills: ["codex-file-search", "codex-file-read", "browser-chrome"],
    status: "active",
  },
  {
    id: "pal-beta",
    role: "worker",
    runtimeKind: "tool",
    displayName: "Fix Worker",
    persona: "Do fix work only: apply the smallest patch to the traced issue and stop before verification.",
    provider: "anthropic",
    models: [],
    cliTools: ["Codex"],
    skills: ["codex-file-read", "codex-file-edit"],
    status: "active",
  },
  {
    id: "pal-gamma",
    role: "worker",
    runtimeKind: "tool",
    displayName: "Verify Worker",
    persona: "Do verification work only: run tests, compare outcomes, and report pass/fail evidence without editing.",
    provider: "google",
    models: [],
    cliTools: ["Codex"],
    skills: ["codex-test-runner", "codex-file-read"],
    status: "active",
  },
];
const DEFAULT_AGENT_SELECTION = {
  activeGuideId: "guide-core",
  defaultGateId: "gate-core",
};
const palProfiles = INITIAL_PAL_PROFILES.map((pal) => ({
  ...pal,
  models: Array.isArray(pal.models) ? [...pal.models] : [],
  cliTools: Array.isArray(pal.cliTools) ? [...pal.cliTools] : [],
  skills: Array.isArray(pal.skills) ? [...pal.skills] : [],
}));
const workspaceAgentSelection = { ...DEFAULT_AGENT_SELECTION };

let events = [
  makeEvent("dispatch", "TASK-001", "ok", {
    ja: "TASK-001 をpal-alpha に配布しました。",
    en: "TASK-001 dispatched to pal-alpha.",
  }, "09:24"),
  makeEvent("gate", "TASK-003", "rejected", {
    ja: "TASK-003 を差し戻しました。",
    en: "TASK-003 was rejected.",
  }, "09:46"),
  makeEvent("dispatch", "JOB-001", "ok", {
    ja: "JOB-001 をpal-alpha に配布しました。",
    en: "JOB-001 dispatched to pal-alpha.",
  }, "09:52"),
];

function makeEvent(type, targetId, result, summary, timestamp) {
  eventSeq += 1;
  return {
    id: `EV-${String(eventSeq).padStart(4, "0")}`,
    timestamp,
    eventType: type,
    targetId,
    result,
    summary,
  };
}

function tUi(id) {
  return (UI_TEXT[locale] && UI_TEXT[locale][id]) || (UI_TEXT.ja && UI_TEXT.ja[id]) || id;
}

function tDyn(key) {
  return (DYNAMIC_TEXT[locale] && DYNAMIC_TEXT[locale][key])
    || (DYNAMIC_TEXT.ja && DYNAMIC_TEXT.ja[key])
    || (DYNAMIC_TEXT.en && DYNAMIC_TEXT.en[key])
    || key;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeProjectName(value) {
  return String(value || "").trim();
}

function normalizeProjectDirectory(value) {
  return String(value || "").trim();
}

function normalizeProjectFilePath(value) {
  return String(value || "").trim().replace(/\\/g, "/");
}

function normalizeProjectFileHints(values) {
  const source = Array.isArray(values) ? values : DEFAULT_PROJECT_FILE_HINTS;
  const seen = new Set();
  const result = [];
  source.forEach((item) => {
    const normalized = normalizeProjectFilePath(item);
    const key = normalized.toLowerCase();
    if (!normalized || seen.has(key)) return;
    seen.add(key);
    result.push(normalized);
  });
  if (result.length > 0) return result;
  return [...DEFAULT_PROJECT_FILE_HINTS];
}

function normalizeProjectRecord(input, fallbackId = "") {
  const name = normalizeProjectName(input?.name);
  const directory = normalizeProjectDirectory(input?.directory);
  const id = normalizeText(input?.id || fallbackId);
  if (!name || !directory || !id) return null;
  return {
    id,
    name,
    directory,
    files: normalizeProjectFileHints(input?.files),
  };
}

function createProjectIdFromName(name) {
  const base = normalizeProjectName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
  let attempt = `project-${base}`;
  let suffix = 1;
  const hasAttempt = () => projectState.projects.some((project) => project.id === attempt);
  while (hasAttempt()) {
    suffix += 1;
    attempt = `project-${base}-${suffix}`;
  }
  return attempt;
}

function projectById(projectId) {
  const id = normalizeText(projectId);
  if (!id) return null;
  return projectState.projects.find((project) => project.id === id) || null;
}

function projectByName(projectName) {
  const name = normalizeProjectName(projectName).toLowerCase();
  if (!name) return null;
  return projectState.projects.find((project) => project.name.toLowerCase() === name) || null;
}

function focusedProject() {
  return projectById(projectState.focusProjectId);
}

function ensureProjectStateConsistency() {
  const normalized = [];
  const seenIds = new Set();
  const seenNames = new Set();
  projectState.projects.forEach((project, index) => {
    const fallbackId = normalizeText(project?.id) || `project-${index + 1}`;
    const record = normalizeProjectRecord(project, fallbackId);
    if (!record) return;
    const idKey = record.id.toLowerCase();
    const nameKey = record.name.toLowerCase();
    if (seenIds.has(idKey) || seenNames.has(nameKey)) return;
    seenIds.add(idKey);
    seenNames.add(nameKey);
    normalized.push(record);
  });
  projectState.projects = normalized;
  if (normalized.length === 0) {
    projectState.focusProjectId = "";
  } else if (!projectById(projectState.focusProjectId)) {
    projectState.focusProjectId = normalized[0].id;
  }
  projectState.addDraft.name = normalizeProjectName(projectState.addDraft.name);
  projectState.addDraft.directory = normalizeProjectDirectory(projectState.addDraft.directory);
}

function buildProjectStateSnapshot() {
  ensureProjectStateConsistency();
  return {
    focusProjectId: projectState.focusProjectId,
    projects: projectState.projects.map((project) => ({
      id: project.id,
      name: project.name,
      directory: project.directory,
      files: [...project.files],
    })),
  };
}

function readProjectStateSnapshot() {
  try {
    const raw = readLocalStorageSnapshot(PROJECTS_LOCAL_STORAGE_KEY, LEGACY_PROJECTS_LOCAL_STORAGE_KEYS);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function writeProjectStateSnapshot() {
  try {
    writeLocalStorageSnapshot(PROJECTS_LOCAL_STORAGE_KEY, JSON.stringify(buildProjectStateSnapshot()));
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function applyProjectStateSnapshot(snapshot) {
  const incoming = Array.isArray(snapshot?.projects) ? snapshot.projects : [];
  if (incoming.length === 0) {
    ensureProjectStateConsistency();
    return;
  }
  projectState.projects = incoming
    .map((project, index) => normalizeProjectRecord(project, `project-${index + 1}`))
    .filter(Boolean);
  projectState.focusProjectId = normalizeText(snapshot?.focusProjectId);
  ensureProjectStateConsistency();
}

function clonePalProfileRecord(pal) {
  return {
    ...pal,
    models: Array.isArray(pal?.models) ? [...pal.models] : [],
    cliTools: Array.isArray(pal?.cliTools) ? [...pal.cliTools] : [],
    skills: Array.isArray(pal?.skills) ? [...pal.skills] : [],
  };
}

function normalizePalProfileIdWithFallback(role, id) {
  const normalizedRole = normalizePalRole(role);
  const raw = normalizeText(id).toLowerCase();
  if (!raw) return "";
  if (normalizedRole === "guide" && raw === "pal-guide") return "guide-core";
  if (normalizedRole === "gate" && raw === "pal-gate") return "gate-core";
  const prefix = normalizedRole === "guide"
    ? "guide-"
    : (normalizedRole === "gate" ? "gate-" : "pal-");
  const withPrefix = raw.startsWith(prefix) ? raw : `${prefix}${raw}`;
  return withPrefix.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}

function defaultPalDisplayNameForRole(role) {
  if (role === "guide") return "Guide Core";
  if (role === "gate") return "Gate Core";
  return "Pal";
}

function defaultPalPersonaForRole(role) {
  if (role === "guide") return "Guide";
  if (role === "gate") return "Gate";
  return "Worker";
}

function normalizePalProfileRecord(input, index = 0) {
  const role = normalizePalRole(input?.role);
  const fallbackId = role === "guide"
    ? (index === 0 ? DEFAULT_AGENT_SELECTION.activeGuideId : `guide-${index + 1}`)
    : (role === "gate"
      ? (index === 0 ? DEFAULT_AGENT_SELECTION.defaultGateId : `gate-${index + 1}`)
      : `pal-worker-${String(index + 1).padStart(3, "0")}`);
  const id = normalizePalProfileIdWithFallback(role, input?.id || fallbackId);
  const runtimeKind = normalizePalRuntimeKind(input?.runtimeKind);
  const models = Array.isArray(input?.models)
    ? input.models.map((model) => normalizeText(model)).filter(Boolean)
    : [];
  const cliTools = Array.isArray(input?.cliTools)
    ? input.cliTools.map((tool) => normalizeToolName(tool)).filter(Boolean)
    : [];
  const skills = Array.isArray(input?.skills)
    ? input.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  return {
    id,
    role,
    runtimeKind,
    displayName: normalizeText(input?.displayName) || defaultPalDisplayNameForRole(role),
    persona: normalizeText(input?.persona) || defaultPalPersonaForRole(role),
    provider: providerIdFromInput(input?.provider),
    models,
    cliTools,
    skills,
    status: normalizeText(input?.status) || "active",
  };
}

function resolveAgentSelectionSnapshotWithFallback(input = {}) {
  const external = resolvePalProfileModelApi();
  if (external && typeof external.resolveAgentSelection === "function") {
    return external.resolveAgentSelection(input);
  }
  const profiles = Array.isArray(input.palProfiles) ? input.palProfiles : [];
  const guides = profiles.filter((pal) => normalizePalRole(pal?.role) === "guide");
  const gates = profiles.filter((pal) => normalizePalRole(pal?.role) === "gate");
  const requestedGuideId = normalizeText(input.activeGuideId);
  const requestedGateId = normalizeText(input.defaultGateId);
  return {
    activeGuideId: guides.some((pal) => pal.id === requestedGuideId)
      ? requestedGuideId
      : (guides[0]?.id || ""),
    defaultGateId: gates.some((pal) => pal.id === requestedGateId)
      ? requestedGateId
      : (gates[0]?.id || ""),
  };
}

function syncWorkspaceAgentSelection() {
  const next = resolveAgentSelectionSnapshotWithFallback({
    palProfiles,
    activeGuideId: workspaceAgentSelection.activeGuideId,
    defaultGateId: workspaceAgentSelection.defaultGateId,
  });
  workspaceAgentSelection.activeGuideId = next.activeGuideId || "";
  workspaceAgentSelection.defaultGateId = next.defaultGateId || "";
}

function buildPalProfilesSnapshot() {
  syncWorkspaceAgentSelection();
  return {
    profiles: palProfiles.map((pal) => clonePalProfileRecord(pal)),
    activeGuideId: workspaceAgentSelection.activeGuideId,
    defaultGateId: workspaceAgentSelection.defaultGateId,
  };
}

function normalizePalProfilesSnapshot(snapshot) {
  const incomingProfiles = Array.isArray(snapshot?.profiles) ? snapshot.profiles : [];
  const normalized = incomingProfiles.length > 0
    ? incomingProfiles
      .map((profile, index) => normalizePalProfileRecord(profile, index))
      .filter((profile, index, list) => profile.id && list.findIndex((item) => item.id === profile.id) === index)
    : INITIAL_PAL_PROFILES.map((pal) => clonePalProfileRecord(pal));
  if (!normalized.some((pal) => pal.role === "guide")) {
    normalized.unshift(normalizePalProfileRecord(INITIAL_PAL_PROFILES[0], 0));
  }
  if (!normalized.some((pal) => pal.role === "gate")) {
    normalized.splice(1, 0, normalizePalProfileRecord(INITIAL_PAL_PROFILES[1], 1));
  }
  const selection = resolveAgentSelectionSnapshotWithFallback({
    palProfiles: normalized,
    activeGuideId: snapshot?.activeGuideId,
    defaultGateId: snapshot?.defaultGateId,
  });
  return {
    profiles: normalized.map((pal) => clonePalProfileRecord(pal)),
    activeGuideId: selection.activeGuideId,
    defaultGateId: selection.defaultGateId,
  };
}

function readPalProfilesSnapshotWithFallback() {
  try {
    const raw = readLocalStorageSnapshot(
      PAL_PROFILES_LOCAL_STORAGE_KEY,
      LEGACY_PAL_PROFILES_LOCAL_STORAGE_KEYS
    );
    if (!raw) return null;
    return normalizePalProfilesSnapshot(JSON.parse(raw));
  } catch (error) {
    return null;
  }
}

function writePalProfilesSnapshotWithFallback(snapshot = buildPalProfilesSnapshot()) {
  try {
    writeLocalStorageSnapshot(PAL_PROFILES_LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function applyPalProfilesSnapshot(snapshot) {
  const normalized = normalizePalProfilesSnapshot(snapshot);
  palProfiles.splice(0, palProfiles.length, ...normalized.profiles.map((pal) => clonePalProfileRecord(pal)));
  workspaceAgentSelection.activeGuideId = normalized.activeGuideId;
  workspaceAgentSelection.defaultGateId = normalized.defaultGateId;
  syncPalProfilesRegistryRefs();
}

function normalizeGateDecision(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (normalized === "approved" || normalized === "rejected") return normalized;
  return "none";
}

function parseGateFixes(value) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function normalizeGateResultRecord(input, legacy = {}) {
  const decision = normalizeGateDecision(input?.decision || legacy?.decisionSummary);
  const reason = normalizeText(input?.reason);
  const fixes = Array.isArray(input?.fixes)
    ? input.fixes.map((item) => normalizeText(item)).filter(Boolean)
    : parseGateFixes(input?.fixes || legacy?.fixCondition);
  return {
    decision,
    reason: reason || (decision === "approved" ? "-" : "-"),
    fixes,
    decisionSummary: decision === "approved" ? "approved" : (decision === "rejected" ? "rejected" : normalizeText(legacy?.decisionSummary) || "-"),
    fixCondition: fixes.length > 0 ? fixes.join("\n") : (normalizeText(legacy?.fixCondition) || "-"),
  };
}

function buildGateResultRecord(decision, reasonText) {
  const normalizedDecision = normalizeGateDecision(decision);
  const reason = normalizeText(reasonText);
  const fixes = normalizedDecision === "rejected" ? parseGateFixes(reasonText) : [];
  return {
    decision: normalizedDecision,
    reason: reason || (normalizedDecision === "approved"
      ? (locale === "ja" ? "根拠を満たしたため承認" : "Approved because the evidence is sufficient.")
      : "-"),
    fixes,
  };
}

function normalizeTaskRecord(input, index = 0) {
  const gateResult = normalizeGateResultRecord(input?.gateResult, {
    decisionSummary: input?.decisionSummary,
    fixCondition: input?.fixCondition,
  });
  return {
    id: normalizeText(input?.id) || `TASK-${String(index + 1).padStart(3, "0")}`,
    title: normalizeText(input?.title) || `Task ${index + 1}`,
    description: normalizeText(input?.description),
    palId: normalizeText(input?.palId),
    status: normalizeText(input?.status) || "assigned",
    updatedAt: normalizeText(input?.updatedAt) || "-",
    decisionSummary: normalizeText(input?.decisionSummary) || "-",
    constraintsCheckResult: normalizeText(input?.constraintsCheckResult) || "-",
    evidence: normalizeText(input?.evidence) || "-",
    replay: normalizeText(input?.replay) || "-",
    fixCondition: gateResult.fixCondition,
    gateResult,
    gateProfileId: normalizeText(input?.gateProfileId),
  };
}

function normalizeJobRecord(input, index = 0) {
  const gateResult = normalizeGateResultRecord(input?.gateResult, {
    decisionSummary: input?.decisionSummary,
    fixCondition: input?.fixCondition,
  });
  return {
    id: normalizeText(input?.id) || `JOB-${String(index + 1).padStart(3, "0")}`,
    title: normalizeText(input?.title) || `Job ${index + 1}`,
    description: normalizeText(input?.description),
    palId: normalizeText(input?.palId),
    schedule: normalizeText(input?.schedule) || "-",
    instruction: normalizeText(input?.instruction) || "-",
    status: normalizeText(input?.status) || "assigned",
    updatedAt: normalizeText(input?.updatedAt) || "-",
    decisionSummary: gateResult.decisionSummary,
    fixCondition: gateResult.fixCondition,
    gateResult,
    lastRunAt: normalizeText(input?.lastRunAt) || "-",
    evidence: normalizeText(input?.evidence) || "-",
    replay: normalizeText(input?.replay) || "-",
    gateProfileId: normalizeText(input?.gateProfileId),
  };
}

function buildBoardStateSnapshot() {
  return {
    selectedTaskId: normalizeText(selectedTaskId),
    tasks: tasks.map((task, index) => normalizeTaskRecord(task, index)),
    jobs: jobs.map((job, index) => normalizeJobRecord(job, index)),
  };
}

function normalizeBoardStateSnapshot(snapshot) {
  const nextTasks = Array.isArray(snapshot?.tasks)
    ? snapshot.tasks.map((task, index) => normalizeTaskRecord(task, index))
    : [];
  const nextJobs = Array.isArray(snapshot?.jobs)
    ? snapshot.jobs.map((job, index) => normalizeJobRecord(job, index))
    : [];
  const requestedSelectedTaskId = normalizeText(snapshot?.selectedTaskId);
  const selected = nextTasks.some((task) => task.id === requestedSelectedTaskId)
    ? requestedSelectedTaskId
    : (nextTasks[0]?.id || "");
  return {
    selectedTaskId: selected,
    tasks: nextTasks,
    jobs: nextJobs,
  };
}

function readBoardStateSnapshot() {
  try {
    const raw = readLocalStorageSnapshot(BOARD_STATE_LOCAL_STORAGE_KEY, LEGACY_BOARD_STATE_LOCAL_STORAGE_KEYS);
    if (!raw) return null;
    return normalizeBoardStateSnapshot(JSON.parse(raw));
  } catch (error) {
    return null;
  }
}

function writeBoardStateSnapshot(snapshot = buildBoardStateSnapshot()) {
  try {
    writeLocalStorageSnapshot(BOARD_STATE_LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // ignore localStorage write failures in prototype mode
  }
}

function applyBoardStateSnapshot(snapshot) {
  const normalized = normalizeBoardStateSnapshot(snapshot);
  if (normalized.tasks.length > 0) {
    tasks.splice(0, tasks.length, ...normalized.tasks);
  }
  if (normalized.jobs.length > 0) {
    jobs.splice(0, jobs.length, ...normalized.jobs);
  }
  selectedTaskId = normalized.selectedTaskId || tasks[0]?.id || null;
}

function projectFocusLabel(project) {
  if (!project) {
    return locale === "ja"
      ? "フォーカス: 未設定"
      : "Focus: Not set";
  }
  return locale === "ja"
    ? `フォーカス: ${project.name} (${project.directory})`
    : `Focus: ${project.name} (${project.directory})`;
}

function renderGuideProjectFocus() {
  const el = document.getElementById("guideProjectFocus");
  if (!el) return;
  el.textContent = projectFocusLabel(focusedProject());
}

function normalizeProjectDirectoryKey(directory) {
  return normalizeProjectDirectory(directory)
    .replace(/\\/g, "/")
    .replace(/\/+$/g, "")
    .toLowerCase();
}

function projectByDirectory(directory) {
  const key = normalizeProjectDirectoryKey(directory);
  if (!key) return null;
  return projectState.projects.find(
    (project) => normalizeProjectDirectoryKey(project.directory) === key
  ) || null;
}

function projectNameFromDirectory(directory) {
  const normalized = normalizeProjectDirectory(directory).replace(/\\/g, "/").replace(/\/+$/g, "");
  if (!normalized) return "";
  const parts = normalized.split("/");
  return normalizeProjectName(parts[parts.length - 1]);
}

function ensureUniqueProjectName(baseName) {
  const normalizedBase = normalizeProjectName(baseName) || "project";
  if (!projectByName(normalizedBase)) return normalizedBase;
  let index = 2;
  let candidate = `${normalizedBase}-${index}`;
  while (projectByName(candidate)) {
    index += 1;
    candidate = `${normalizedBase}-${index}`;
  }
  return candidate;
}

function showProjectInfoDialog(messageJa, messageEn) {
  const message = locale === "ja" ? messageJa : messageEn;
  if (typeof window !== "undefined" && typeof window.alert === "function") {
    window.alert(message);
  }
}

function addProjectByDirectory(directory) {
  const normalizedDirectory = normalizeProjectDirectory(directory);
  if (!normalizedDirectory) {
    setMessage("MSG-PPH-1001");
    return { ok: false, reason: "empty" };
  }
  if (projectByDirectory(normalizedDirectory)) {
    showProjectInfoDialog(
      "プロジェクトは既に含まれています。",
      "Project is already included."
    );
    setMessage("MSG-PPH-1006");
    return { ok: false, reason: "duplicate" };
  }
  const baseName = projectNameFromDirectory(normalizedDirectory);
  const nextName = ensureUniqueProjectName(baseName);
  const newProject = normalizeProjectRecord({
    id: createProjectIdFromName(nextName),
    name: nextName,
    directory: normalizedDirectory,
    files: DEFAULT_PROJECT_FILE_HINTS,
  });
  if (!newProject) {
    setMessage("MSG-PPH-1001");
    return { ok: false, reason: "invalid" };
  }
  projectState.projects.push(newProject);
  projectState.focusProjectId = newProject.id;
  writeProjectStateSnapshot();
  renderGuideProjectFocus();
  renderProjectTab();
  setMessage("MSG-PPH-0007");
  return { ok: true, project: newProject };
}

function resolveProjectDialogBridge() {
  const bridge = resolveWindowBridge("TomoshibikanProjectDialog", "PalpalProjectDialog");
  return bridge && typeof bridge.pickDirectory === "function" ? bridge : null;
}

function directoryFromPickerFile(file) {
  if (!file || typeof file !== "object") return "";
  const pathHint = normalizeProjectDirectory(file.path);
  if (pathHint) {
    const normalized = pathHint.replace(/\\/g, "/");
    const withoutTrailing = normalized.replace(/\/+$/g, "");
    const parts = withoutTrailing.split("/");
    if (parts.length > 1) {
      return parts.slice(0, -1).join("/");
    }
  }
  const relative = normalizeProjectDirectory(file.webkitRelativePath).replace(/\\/g, "/");
  if (relative.includes("/")) {
    const root = relative.split("/")[0];
    return normalizeProjectDirectory(root);
  }
  return "";
}

function renderProjectTab() {
  const root = document.getElementById("projectTabContent");
  if (!root) return;
  ensureProjectStateConsistency();
  const labels = locale === "ja"
    ? {
      name: "プロジェクト名",
      directory: "ディレクトリ",
      add: "プロジェクトを追加",
      remove: "一覧から外す",
      empty: "プロジェクトはありません",
      note: "@project / @project:file 参照、/use project でフォーカス更新（一覧から外してもフォルダは削除されません）",
      pickerHelp: "ディレクトリを選択すると、末尾フォルダ名をプロジェクト名として追加します",
    }
    : {
      name: "Project Name",
      directory: "Directory",
      add: "Add Project",
      remove: "Unlist",
      empty: "No projects",
      note: "Use @project / @project:file, and /use project to update focus (unlisting never deletes folders)",
      pickerHelp: "Select a directory. The last folder name becomes the project name",
    };

  const rows = projectState.projects.length === 0
    ? `<li class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${labels.empty}</li>`
    : projectState.projects
      .map((project) => {
        return `<li class="rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3">
          <div class="flex items-start justify-between gap-3">
            <div class="grid gap-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="badge badge-secondary badge-sm">@${escapeHtml(project.name)}</span>
              </div>
              <div class="text-xs text-base-content/70">${escapeHtml(project.directory)}</div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button class="btn btn-xs btn-ghost" type="button" data-project-remove-id="${escapeHtml(project.id)}">${escapeHtml(labels.remove)}</button>
            </div>
          </div>
        </li>`;
      })
      .join("");

  root.innerHTML = `<div class="project-tab-shell">
    <div class="project-note text-xs text-base-content/65">${escapeHtml(labels.note)}</div>
    <div class="project-toolbar">
      <button id="projectPickDirectory" type="button" class="btn btn-sm btn-primary">${escapeHtml(labels.add)}</button>
      <span class="text-xs text-base-content/60">${escapeHtml(labels.pickerHelp)}</span>
      <input id="projectDirectoryPicker" type="file" class="hidden" webkitdirectory directory />
    </div>
    <ul id="projectList" class="project-list">${rows}</ul>
  </div>`;

  root.querySelectorAll("[data-project-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = normalizeText(button.getAttribute("data-project-remove-id"));
      const index = projectState.projects.findIndex((project) => project.id === targetId);
      if (index < 0) return;
      projectState.projects.splice(index, 1);
      ensureProjectStateConsistency();
      writeProjectStateSnapshot();
      renderGuideProjectFocus();
      renderProjectTab();
    });
  });

  const pickButton = document.getElementById("projectPickDirectory");
  const pickerInput = document.getElementById("projectDirectoryPicker");
  if (pickButton) {
    pickButton.addEventListener("click", async () => {
      const bridge = resolveProjectDialogBridge();
      if (bridge) {
        try {
          const selected = normalizeProjectDirectory(await bridge.pickDirectory());
          if (!selected) return;
          addProjectByDirectory(selected);
          return;
        } catch (error) {
          setMessage("MSG-PPH-1003");
          return;
        }
      }
      if (pickerInput) {
        pickerInput.click();
      }
    });
  }
  if (pickerInput) {
    pickerInput.addEventListener("change", () => {
      const files = Array.from(pickerInput.files || []);
      const directory = files.length > 0 ? directoryFromPickerFile(files[0]) : "";
      pickerInput.value = "";
      if (!directory) {
        setMessage("MSG-PPH-1001");
        return;
      }
      addProjectByDirectory(directory);
    });
  }
}

function providerLabel(providerId) {
  const entry = PALPAL_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === providerId);
  return entry ? entry.label : providerId;
}

function providerIdFromInput(value) {
  if (!value) return DEFAULT_PROVIDER_ID;
  const asId = PALPAL_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === value);
  if (asId) return asId.id;
  const asLabel = PALPAL_CORE_PROVIDER_REGISTRY.find((provider) => provider.label === value);
  return asLabel ? asLabel.id : DEFAULT_PROVIDER_ID;
}

function isApiKeyRequiredForProvider(providerId) {
  return !OPTIONAL_API_KEY_PROVIDERS.has(providerIdFromInput(providerId));
}

function resolveProviderForModelName(modelName, fallbackProviderId = DEFAULT_PROVIDER_ID) {
  const normalizedName = normalizeText(modelName);
  const preferredProviderId = providerIdFromInput(fallbackProviderId);
  if (!normalizedName) return preferredProviderId;
  const preferredPairExists = PALPAL_CORE_MODEL_REGISTRY.some(
    (entry) => entry.name === normalizedName && providerIdFromInput(entry.provider) === preferredProviderId
  );
  if (preferredPairExists) return preferredProviderId;
  const matched = PALPAL_CORE_MODEL_REGISTRY.find((entry) => entry.name === normalizedName);
  if (matched && PROVIDER_OPTIONS.includes(providerIdFromInput(matched.provider))) {
    return providerIdFromInput(matched.provider);
  }
  const inferred = inferProviderIdFromModelName(normalizedName);
  if (inferred) return inferred;
  return preferredProviderId;
}

function normalizeRegisteredModel(model) {
  const apiKey = String(model.apiKey || model.apiKeyInput || "").trim();
  const apiKeyConfigured = Boolean(model.apiKeyConfigured || apiKey);
  const name = String(model.name || "").trim();
  const requestedProvider = providerIdFromInput(model.provider);
  const resolvedProvider = name
    ? resolveProviderForModelName(name, requestedProvider)
    : requestedProvider;
  return {
    name,
    provider: resolvedProvider,
    apiKey,
    apiKeyConfigured,
    baseUrl: String(model.baseUrl || "").trim(),
    endpoint: String(model.endpoint || "").trim(),
  };
}

function normalizeToolName(toolName) {
  if (!toolName) return CLI_TOOL_OPTIONS[0];
  return CLI_TOOL_OPTIONS.includes(toolName) ? toolName : CLI_TOOL_OPTIONS[0];
}

function normalizeContextHandoffPolicy(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (normalized === "minimal" || normalized === "verbose") return normalized;
  return DEFAULT_CONTEXT_HANDOFF_POLICY;
}

function resolveSettingsPersistenceModelApi() {
  return typeof window !== "undefined" &&
    window.SettingsPersistenceModel &&
    typeof window.SettingsPersistenceModel.buildSettingsSavePayload === "function" &&
    typeof window.SettingsPersistenceModel.normalizeSettingsSnapshot === "function" &&
    typeof window.SettingsPersistenceModel.buildLocalStoredSnapshot === "function"
    ? window.SettingsPersistenceModel
    : null;
}

function resolveSettingsStorageApi() {
  const bridge = resolveWindowBridge("TomoshibikanSettingsStorage", "PalpalSettingsStorage");
  return bridge &&
    typeof bridge.load === "function" &&
    typeof bridge.save === "function"
    ? bridge
    : null;
}

function resolvePalpalCoreRuntimeApi() {
  const runtime = resolveWindowBridge("TomoshibikanCoreRuntime", "PalpalCoreRuntime");
  if (!runtime || typeof runtime.guideChat !== "function") return null;
  return runtime;
}

function hasPalpalCoreRuntimeApi() {
  return Boolean(resolvePalpalCoreRuntimeApi());
}

function hasPalpalCorePalChatApi() {
  const runtime = resolvePalpalCoreRuntimeApi();
  return Boolean(runtime && typeof runtime.palChat === "function");
}

function isGuideControllerAssistEnabled() {
  return settingsState.guideControllerAssistEnabled === true;
}

function resolveRuntimeWorkspaceRootForChat() {
  const focus = focusedProject();
  const directory = normalizeText(focus?.directory);
  return directory || "";
}

function applyCoreCatalogSnapshot(catalog) {
  if (!catalog || typeof catalog !== "object") return false;
  const providers = resolveProviderRegistry(catalog.providers);
  const models = normalizeCoreModelCatalog(catalog.models);
  if (providers.length === 0 && models.length === 0) return false;

  PALPAL_CORE_PROVIDER_REGISTRY = providers;
  PROVIDER_OPTIONS = PALPAL_CORE_PROVIDER_REGISTRY.map((provider) => provider.id);
  DEFAULT_PROVIDER_ID = PROVIDER_OPTIONS[0] || DEFAULT_PROVIDER_ID || "openai";
  PALPAL_CORE_MODEL_REGISTRY = models;
  PALPAL_CORE_MODEL_OPTIONS_BY_PROVIDER = buildModelOptionsByProvider(
    PALPAL_CORE_MODEL_REGISTRY,
    PROVIDER_OPTIONS
  );
  MODEL_OPTIONS = buildModelOptionList(PALPAL_CORE_MODEL_REGISTRY, [DEV_LMSTUDIO_MODEL_NAME]);
  DEFAULT_MODEL_NAME = DEV_LMSTUDIO_MODEL_NAME || MODEL_OPTIONS[0] || "";

  if (typeof window !== "undefined") {
    window.TOMOSHIBIKAN_CORE_PROVIDERS = [...PALPAL_CORE_PROVIDER_REGISTRY];
    window.PALPAL_CORE_PROVIDERS = [...PALPAL_CORE_PROVIDER_REGISTRY];
    window.TOMOSHIBIKAN_CORE_MODELS = [...PALPAL_CORE_MODEL_REGISTRY];
    window.PALPAL_CORE_MODELS = [...PALPAL_CORE_MODEL_REGISTRY];
  }
  return true;
}

async function refreshCoreCatalogFromRuntime() {
  if (!hasRuntimeCatalogBridge()) return false;
  try {
    const runtime = resolvePalpalCoreRuntimeApi();
    const latest = await runtime.listProviderModels();
    const applied = applyCoreCatalogSnapshot(latest);
    if (!applied) return false;
    syncSettingsModelsFromRegistry();
    syncPalProfilesRegistryRefs();
    bindGuideToFirstRegisteredModelWithFallback();
    return true;
  } catch (error) {
    return false;
  }
}

function buildSettingsSavePayloadWithFallback() {
  const external = resolveSettingsPersistenceModelApi();
  if (external) {
    return external.buildSettingsSavePayload({
      locale,
      contextHandoffPolicy: settingsState.contextHandoffPolicy,
      guideControllerAssistEnabled: settingsState.guideControllerAssistEnabled,
      registeredModels: settingsState.registeredModels,
      registeredTools: settingsState.registeredTools,
      registeredSkills: settingsState.registeredSkills,
    });
  }
  return {
    locale: locale === "en" ? "en" : "ja",
    contextHandoffPolicy: normalizeContextHandoffPolicy(settingsState.contextHandoffPolicy),
    guideControllerAssistEnabled: settingsState.guideControllerAssistEnabled === true,
    registeredModels: settingsState.registeredModels
      .map((model) => ({
        name: String(model.name || "").trim(),
        provider: providerIdFromInput(model.provider),
        baseUrl: String(model.baseUrl || "").trim(),
        endpoint: String(model.endpoint || "").trim(),
        apiKeyInput: String(model.apiKey || "").trim(),
        apiKeyConfigured: Boolean(model.apiKeyConfigured),
      }))
      .filter((model) => Boolean(model.name)),
    registeredTools: [...new Set(settingsState.registeredTools.map((tool) => normalizeToolName(tool)))],
    registeredSkills: [...new Set(settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean))],
  };
}

function stableSettingsPayloadForSignature(payload = buildSettingsSavePayloadWithFallback()) {
  const input = payload || {};
  const localeValue = String(input.locale || "ja") === "en" ? "en" : "ja";
  const models = Array.isArray(input.registeredModels) ? input.registeredModels : [];
  const tools = Array.isArray(input.registeredTools) ? input.registeredTools : [];
  const skills = Array.isArray(input.registeredSkills) ? input.registeredSkills : [];

  const normalizedModels = models
    .map((model) => ({
      name: String(model?.name || "").trim(),
      provider: providerIdFromInput(model?.provider),
      baseUrl: String(model?.baseUrl || "").trim(),
      endpoint: String(model?.endpoint || "").trim(),
      apiKeyConfigured: Boolean(model?.apiKeyConfigured),
      apiKeyInputPresent: Boolean(String(model?.apiKeyInput || model?.apiKey || "").trim()),
    }))
    .filter((model) => Boolean(model.name))
    .sort((left, right) => {
      const leftKey = `${left.provider}:${left.name}`.toLowerCase();
      const rightKey = `${right.provider}:${right.name}`.toLowerCase();
      return leftKey.localeCompare(rightKey);
    });

  const normalizedTools = [...new Set(tools.map((tool) => normalizeToolName(tool)))]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));

  const normalizedSkills = [...new Set(skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));

  return {
    locale: localeValue,
    contextHandoffPolicy: normalizeContextHandoffPolicy(input.contextHandoffPolicy),
    guideControllerAssistEnabled: input.guideControllerAssistEnabled === true,
    registeredModels: normalizedModels,
    registeredTools: normalizedTools,
    registeredSkills: normalizedSkills,
  };
}

function buildSettingsSignature(payload = buildSettingsSavePayloadWithFallback()) {
  try {
    return JSON.stringify(stableSettingsPayloadForSignature(payload));
  } catch (error) {
    return "";
  }
}

function markSettingsSavedBaseline() {
  settingsSavedSignature = buildSettingsSignature();
}

function hasUnsavedSettingsChanges() {
  if (!settingsSavedSignature) return false;
  return buildSettingsSignature() !== settingsSavedSignature;
}

function normalizeSettingsSnapshotWithFallback(snapshot) {
  const external = resolveSettingsPersistenceModelApi();
  if (external) {
    return external.normalizeSettingsSnapshot(snapshot);
  }
  const input = snapshot || {};
  return {
    locale: input.locale === "en" ? "en" : "ja",
    contextHandoffPolicy: normalizeContextHandoffPolicy(input.contextHandoffPolicy),
    guideControllerAssistEnabled: input.guideControllerAssistEnabled === true,
    registeredModels: Array.isArray(input.registeredModels)
      ? input.registeredModels
        .map((model) => ({
          name: String(model.name || "").trim(),
          provider: providerIdFromInput(model.provider),
          baseUrl: String(model.baseUrl || "").trim(),
          endpoint: String(model.endpoint || "").trim(),
          apiKeyConfigured: Boolean(model.apiKeyConfigured),
          apiKey: "",
        }))
        .filter((model) => Boolean(model.name))
      : [],
    registeredTools: Array.isArray(input.registeredTools)
      ? input.registeredTools.map((tool) => normalizeToolName(tool))
      : [],
    registeredSkills: Array.isArray(input.registeredSkills)
      ? input.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [],
  };
}

function readLocalSettingsSnapshotWithFallback() {
  try {
    const raw = readLocalStorageSnapshot(
      SETTINGS_LOCAL_STORAGE_KEY,
      LEGACY_SETTINGS_LOCAL_STORAGE_KEYS
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeSettingsSnapshotWithFallback(parsed);
  } catch (error) {
    return null;
  }
}

function writeLocalSettingsSnapshotWithFallback(snapshot) {
  try {
    writeLocalStorageSnapshot(SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // ignore
  }
}

function buildLocalStoredSnapshotWithFallback(existingSnapshot, payload) {
  const external = resolveSettingsPersistenceModelApi();
  if (external) {
    return external.buildLocalStoredSnapshot({ existingSnapshot, payload });
  }
  const existing = normalizeSettingsSnapshotWithFallback(existingSnapshot);
  const normalizedPayload = payload || buildSettingsSavePayloadWithFallback();
  const existingByName = new Map(existing.registeredModels.map((model) => [model.name, model]));
  const nextModels = normalizedPayload.registeredModels.map((model) => {
    const previous = existingByName.get(model.name);
    return {
      name: model.name,
      provider: providerIdFromInput(model.provider),
      baseUrl: model.baseUrl,
      endpoint: model.endpoint,
      apiKeyConfigured: Boolean(model.apiKeyInput || previous?.apiKeyConfigured),
    };
  });
  return {
    locale: normalizedPayload.locale,
    contextHandoffPolicy: normalizeContextHandoffPolicy(normalizedPayload.contextHandoffPolicy),
    guideControllerAssistEnabled: normalizedPayload.guideControllerAssistEnabled === true,
    registeredModels: nextModels,
    registeredTools: normalizedPayload.registeredTools,
    registeredSkills: normalizedPayload.registeredSkills,
  };
}

function applySettingsSnapshot(snapshot) {
  if (!snapshot) return;
  const normalized = normalizeSettingsSnapshotWithFallback(snapshot);
  locale = normalized.locale === "en" ? "en" : "ja";
  settingsState.contextHandoffPolicy = normalizeContextHandoffPolicy(normalized.contextHandoffPolicy);
  settingsState.guideControllerAssistEnabled = normalized.guideControllerAssistEnabled === true;
  settingsState.registeredModels = normalized.registeredModels.map(normalizeRegisteredModel);
  settingsState.registeredTools = normalized.registeredTools.map((tool) => normalizeToolName(tool));
  settingsState.registeredSkills = normalized.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean);
  syncSettingsModelsFromRegistry();
  syncPalProfilesFromSettings();
  markSettingsSavedBaseline();
}

async function loadSettingsSnapshotWithFallback() {
  const storageApi = resolveSettingsStorageApi();
  if (storageApi) {
    try {
      const loaded = await storageApi.load();
      return normalizeSettingsSnapshotWithFallback(loaded);
    } catch (error) {
      return null;
    }
  }
  return readLocalSettingsSnapshotWithFallback();
}

async function saveSettingsSnapshotWithFallback() {
  const payload = buildSettingsSavePayloadWithFallback();
  const storageApi = resolveSettingsStorageApi();
  if (storageApi) {
    const saved = await storageApi.save(payload);
    return normalizeSettingsSnapshotWithFallback(saved);
  }
  const existing = readLocalSettingsSnapshotWithFallback();
  const localSnapshot = buildLocalStoredSnapshotWithFallback(existing, payload);
  writeLocalSettingsSnapshotWithFallback(localSnapshot);
  return normalizeSettingsSnapshotWithFallback(localSnapshot);
}

async function resolveStoredModelApiKeyWithFallback(modelName, fallbackApiKey) {
  const direct = String(fallbackApiKey || "").trim();
  if (direct) return direct;
  const storageApi = resolveSettingsStorageApi();
  if (!storageApi || typeof storageApi.resolveModelApiKey !== "function") return "";
  try {
    return String(await storageApi.resolveModelApiKey(modelName)).trim();
  } catch (error) {
    return "";
  }
}

function resolveSkillCatalogValidationApi() {
  return typeof window !== "undefined" &&
    window.SkillCatalogValidation &&
    typeof window.SkillCatalogValidation.normalizeSkillId === "function" &&
    typeof window.SkillCatalogValidation.searchSkillCatalogItems === "function" &&
    typeof window.SkillCatalogValidation.installSkill === "function" &&
    typeof window.SkillCatalogValidation.uninstallSkill === "function"
    ? window.SkillCatalogValidation
    : null;
}

function normalizeGenericSkillId(skillId) {
  if (!skillId) return "";
  const normalized = String(skillId || "").trim();
  if (!normalized) return "";
  // Allow ClawHub-style slugs (letters/numbers/dash/underscore/dot).
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(normalized)) return "";
  return normalized;
}

function resolveAllowedSkillIdsForValidation(additionalSkillIds = []) {
  const result = [];
  const push = (value) => {
    const normalized = normalizeGenericSkillId(value);
    if (!normalized || result.includes(normalized)) return;
    result.push(normalized);
  };
  STANDARD_SKILL_IDS.forEach(push);
  CLAWHUB_SKILL_REGISTRY.forEach((skill) => push(skill?.id));
  ADDITIONAL_SKILL_REGISTRY.forEach((skill) => push(skill?.id));
  if (settingsState && Array.isArray(settingsState.registeredSkills)) {
    settingsState.registeredSkills.forEach(push);
  }
  if (settingsState && Array.isArray(settingsState.skillSearchResults)) {
    settingsState.skillSearchResults.forEach((skill) => push(skill?.id));
  }
  if (Array.isArray(additionalSkillIds)) {
    additionalSkillIds.forEach(push);
  }
  return result;
}

function normalizeSkillId(skillId) {
  const external = resolveSkillCatalogValidationApi();
  const allowedSkillIds = resolveAllowedSkillIdsForValidation();
  if (external) {
    const normalizedByExternal = external.normalizeSkillId(skillId, allowedSkillIds);
    if (normalizedByExternal) return normalizedByExternal;
  }
  return normalizeGenericSkillId(skillId);
}

function skillById(skillId) {
  const normalized = normalizeSkillId(skillId);
  if (!normalized) return null;
  return ADDITIONAL_SKILL_REGISTRY.find((skill) => normalizeSkillId(skill.id) === normalized) ||
    CLAWHUB_SKILL_REGISTRY.find((skill) => normalizeSkillId(skill.id) === normalized) ||
    null;
}

function skillName(skillId) {
  return skillById(skillId)?.name || skillId;
}

function normalizeIsoDateValue(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }
  const text = normalizeText(value);
  if (!text) return "";
  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? "" : new Date(parsed).toISOString();
}

function normalizeMetricValue(value, fallback = 0) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) return parsed;
  return Number.isFinite(Number(fallback)) ? Number(fallback) : 0;
}

function isUnknownSafetyValue(value) {
  const normalized = normalizeText(value).toLowerCase();
  return !normalized || normalized === "unknown";
}

function resolveSkillSuspiciousFlag(skill, localMeta) {
  if (typeof skill?.suspicious === "boolean") return skill.suspicious;
  if (typeof skill?.nonSuspicious === "boolean") return !skill.nonSuspicious;
  if (typeof localMeta?.suspicious === "boolean") return localMeta.suspicious;
  // ClawHub /search may omit suspicious metadata; treat unknown as non-suspicious
  // and rely on explicit flags when available.
  return false;
}

function normalizeClawHubSkillRecord(skill, fallback = {}) {
  const id = normalizeText(skill?.id || skill?.slug || fallback.id);
  if (!id) return null;
  const localMeta = CLAWHUB_SKILL_META[id] || {};
  const stats = skill?.stats && typeof skill.stats === "object" ? skill.stats : {};
  const updatedAt = normalizeIsoDateValue(skill?.updatedAt) ||
    normalizeIsoDateValue(skill?.latestVersion?.createdAt) ||
    normalizeIsoDateValue(fallback.updatedAt) ||
    normalizeIsoDateValue(localMeta.updatedAt);
  return {
    id,
    name: normalizeText(skill?.name || skill?.displayName || fallback.name || id) || id,
    description: normalizeText(skill?.description || skill?.summary || fallback.description),
    packageName: normalizeText(skill?.packageName || fallback.packageName || `clawhub/${id}`),
    source: normalizeText(skill?.source || fallback.source || "ClawHub"),
    safety: normalizeText(skill?.safety || fallback.safety || localMeta.safety || "Unknown"),
    rating: normalizeMetricValue(skill?.rating, fallback.rating ?? localMeta.rating ?? 0),
    downloads: normalizeMetricValue(
      stats.downloads ?? skill?.downloads,
      fallback.downloads ?? localMeta.downloads ?? 0
    ),
    stars: normalizeMetricValue(
      stats.stars ?? skill?.stars,
      fallback.stars ?? localMeta.stars ?? 0
    ),
    installs: normalizeMetricValue(
      stats.installsAllTime ?? stats.installsCurrent ?? skill?.installs,
      fallback.installs ?? localMeta.installs ?? 0
    ),
    updatedAt,
    highlighted: Boolean(skill?.highlighted || fallback.highlighted || localMeta.highlighted),
    suspicious: resolveSkillSuspiciousFlag(skill, localMeta),
  };
}

function mergeSkillRecords(primaryItems, secondaryItems) {
  const map = new Map();
  const upsert = (record) => {
    const normalized = normalizeClawHubSkillRecord(record);
    if (!normalized) return;
    const key = normalized.id.toLowerCase();
    const previous = map.get(key);
    if (!previous) {
      map.set(key, normalized);
      return;
    }
    const normalizedSafety = normalizeText(normalized.safety);
    const previousSafety = normalizeText(previous.safety);
    const mergedSafety = isUnknownSafetyValue(normalizedSafety)
      ? (previousSafety || normalizedSafety || "Unknown")
      : normalizedSafety;
    map.set(key, {
      ...previous,
      ...normalized,
      name: normalized.name || previous.name,
      description: normalized.description || previous.description,
      packageName: normalized.packageName || previous.packageName,
      source: normalized.source || previous.source,
      safety: mergedSafety,
      rating: normalized.rating > 0 ? normalized.rating : previous.rating,
      downloads: normalized.downloads > 0 ? normalized.downloads : previous.downloads,
      stars: normalized.stars > 0 ? normalized.stars : previous.stars,
      installs: normalized.installs > 0 ? normalized.installs : previous.installs,
      updatedAt: normalized.updatedAt || previous.updatedAt,
      highlighted: Boolean(previous.highlighted || normalized.highlighted),
      suspicious: Boolean(normalized.suspicious),
    });
  };

  (Array.isArray(secondaryItems) ? secondaryItems : []).forEach(upsert);
  (Array.isArray(primaryItems) ? primaryItems : []).forEach(upsert);
  return [...map.values()];
}

function upsertSkillRegistryRecords(records) {
  const merged = mergeSkillRecords(records, ADDITIONAL_SKILL_REGISTRY);
  const filtered = merged.filter((record) => !STANDARD_SKILL_IDS.includes(normalizeSkillId(record?.id)));
  ADDITIONAL_SKILL_REGISTRY.splice(0, ADDITIONAL_SKILL_REGISTRY.length, ...filtered);
}

function filterSkillRecordsByKeyword(items, query) {
  const keyword = normalizeSearchKeyword(query);
  if (!keyword) return [...items];
  return items.filter((skill) => {
    const fields = [
      skill.id,
      skill.name,
      skill.description,
      skill.packageName,
      skill.source,
      skill.safety,
      skill.rating,
      skill.downloads,
      skill.stars,
      skill.installs,
      skill.updatedAt,
      skill.highlighted,
      skill.suspicious,
    ];
    return fields.some((field) => normalizeSearchKeyword(field).includes(keyword));
  });
}

function searchLocalClawHubSkills(query) {
  const searchableCatalog = [...CLAWHUB_SKILL_REGISTRY, ...ADDITIONAL_SKILL_REGISTRY];
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.searchSkillCatalogItems(searchableCatalog, query);
  }
  return filterSkillRecordsByKeyword(searchableCatalog, query);
}

async function fetchClawHubJson(endpoint, queryParams = {}) {
  if (typeof fetch !== "function") return null;
  let url;
  try {
    url = new URL(String(endpoint || "").replace(/^\/+/, ""), `${CLAWHUB_API_BASE_URL}/`);
  } catch (error) {
    return null;
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = setTimeout(() => {
    if (controller) controller.abort();
  }, CLAWHUB_API_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeApiSearchResultRecord(item) {
  const id = normalizeText(item?.slug || item?.id);
  if (!id) return null;
  return normalizeClawHubSkillRecord({
    id,
    name: normalizeText(item?.displayName || item?.name || id) || id,
    description: normalizeText(item?.summary || item?.description),
    packageName: `clawhub/${id}`,
    source: "ClawHub",
    updatedAt: item?.updatedAt,
  });
}

function normalizeApiSkillItemRecord(item) {
  return normalizeClawHubSkillRecord({
    id: item?.slug || item?.id,
    name: item?.displayName || item?.name,
    description: item?.summary || item?.description,
    packageName: item?.packageName,
    source: "ClawHub",
    safety: item?.safety,
    rating: item?.rating,
    stats: item?.stats,
    downloads: item?.downloads,
    stars: item?.stars,
    installs: item?.installs,
    updatedAt: item?.updatedAt,
    latestVersion: item?.latestVersion,
    highlighted: item?.highlighted,
    suspicious: item?.suspicious,
    nonSuspicious: item?.nonSuspicious,
  });
}

function normalizeApiSkillDetailRecord(payload) {
  const skill = payload?.skill && typeof payload.skill === "object"
    ? payload.skill
    : null;
  if (!skill) return null;
  return normalizeApiSkillItemRecord({
    id: skill.slug,
    name: skill.displayName,
    description: skill.summary,
    packageName: skill.packageName,
    source: "ClawHub",
    safety: skill.safety,
    rating: skill.rating,
    stats: skill.stats,
    downloads: skill.downloads,
    stars: skill.stars,
    installs: skill.installs,
    updatedAt: skill.updatedAt,
    latestVersion: payload?.latestVersion,
    highlighted: skill.highlighted,
    suspicious: skill.suspicious,
    nonSuspicious: skill.nonSuspicious,
  });
}

async function fetchClawHubSkillDetailRecords(skillIds) {
  const ids = Array.isArray(skillIds)
    ? skillIds
      .map((skillId) => normalizeGenericSkillId(skillId))
      .filter(Boolean)
    : [];
  if (ids.length === 0) return [];
  const deduped = [...new Set(ids)].slice(0, CLAWHUB_API_DETAIL_ENRICH_LIMIT);
  const results = await Promise.all(
    deduped.map(async (skillId) => {
      const payload = await fetchClawHubJson(`skills/${encodeURIComponent(skillId)}`);
      return normalizeApiSkillDetailRecord(payload);
    })
  );
  return results.filter(Boolean);
}

async function searchClawHubSkillsApi(query, filters) {
  const normalizedFilters = normalizeSkillSearchFilters(filters);
  const keyword = normalizeSearchKeyword(query);
  const isKeywordSearch = Boolean(keyword);
  const catalogLimit = isKeywordSearch ? CLAWHUB_API_SEARCH_LIMIT : CLAWHUB_API_BROWSE_LIMIT;
  const baseParams = {
    limit: catalogLimit,
    sort: normalizedFilters.sortBy,
    nonSuspicious: normalizedFilters.nonSuspiciousOnly ? "true" : undefined,
    highlighted: normalizedFilters.highlightedOnly ? "true" : undefined,
  };

  const catalogPayload = await fetchClawHubJson("skills", baseParams);
  const catalogItems = Array.isArray(catalogPayload?.items)
    ? catalogPayload.items.map(normalizeApiSkillItemRecord).filter(Boolean)
    : [];

  if (!keyword) {
    return {
      ok: Array.isArray(catalogPayload?.items),
      items: catalogItems,
    };
  }

  const searchPayload = await fetchClawHubJson("search", {
    q: keyword,
    ...baseParams,
  });
  const searchItems = Array.isArray(searchPayload?.results)
    ? searchPayload.results.map(normalizeApiSearchResultRecord).filter(Boolean)
    : [];
  const detailItems = searchItems.length > 0
    ? await fetchClawHubSkillDetailRecords(searchItems.map((item) => item.id))
    : [];
  const enrichedCatalog = mergeSkillRecords(detailItems, catalogItems);

  if (searchItems.length > 0) {
    return {
      ok: true,
      items: mergeSkillRecords(searchItems, enrichedCatalog),
    };
  }

  if (Array.isArray(catalogPayload?.items)) {
    return {
      ok: true,
      items: filterSkillRecordsByKeyword(catalogItems, keyword),
    };
  }

  return {
    ok: false,
    items: [],
  };
}

async function searchClawHubSkillsWithFallback(query, filters) {
  const keyword = normalizeSearchKeyword(query);
  const normalizedFilters = normalizeSkillSearchFilters(filters);
  const localMatches = searchLocalClawHubSkills(keyword).map((item) => normalizeClawHubSkillRecord(item)).filter(Boolean);
  const apiResult = await searchClawHubSkillsApi(keyword, normalizedFilters);
  const merged = apiResult.ok
    ? mergeSkillRecords(localMatches, apiResult.items)
    : localMatches;
  if (apiResult.ok) {
    upsertSkillRegistryRecords(apiResult.items);
  }
  const keywordFiltered = keyword ? filterSkillRecordsByKeyword(merged, keyword) : merged;
  return {
    usedApi: apiResult.ok,
    items: applySkillSearchFilters(keywordFiltered, normalizedFilters),
  };
}

function normalizeSkillMarketSortBy(sortBy) {
  if (!sortBy) return DEFAULT_SKILL_SEARCH_FILTERS.sortBy;
  return SKILL_MARKET_SORT_OPTIONS.includes(sortBy)
    ? sortBy
    : DEFAULT_SKILL_SEARCH_FILTERS.sortBy;
}

function normalizeSkillSearchFilters(filters) {
  const input = filters || {};
  return {
    nonSuspiciousOnly: input.nonSuspiciousOnly !== false,
    highlightedOnly: Boolean(input.highlightedOnly),
    sortBy: normalizeSkillMarketSortBy(input.sortBy),
  };
}

function sortSkillMarketItems(items, sortBy) {
  const normalizedSortBy = normalizeSkillMarketSortBy(sortBy);
  const withFallback = [...items];
  withFallback.sort((left, right) => {
    const leftName = String(left?.name || "");
    const rightName = String(right?.name || "");

    if (normalizedSortBy === "downloads") {
      const diff = Number(right?.downloads || 0) - Number(left?.downloads || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "stars") {
      const diff = Number(right?.stars || 0) - Number(left?.stars || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "installs") {
      const diff = Number(right?.installs || 0) - Number(left?.installs || 0);
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "updated") {
      const leftUpdated = Date.parse(String(left?.updatedAt || "")) || 0;
      const rightUpdated = Date.parse(String(right?.updatedAt || "")) || 0;
      const diff = rightUpdated - leftUpdated;
      return diff !== 0 ? diff : leftName.localeCompare(rightName);
    }
    if (normalizedSortBy === "highlighted") {
      const diff = Number(Boolean(right?.highlighted)) - Number(Boolean(left?.highlighted));
      if (diff !== 0) return diff;
      const secondary = Number(right?.downloads || 0) - Number(left?.downloads || 0);
      return secondary !== 0 ? secondary : leftName.localeCompare(rightName);
    }
    return leftName.localeCompare(rightName);
  });
  return withFallback;
}

function applySkillSearchFilters(items, filters) {
  const normalized = normalizeSkillSearchFilters(filters);
  let next = [...items];
  if (normalized.nonSuspiciousOnly) {
    next = next.filter((skill) => !Boolean(skill?.suspicious));
  }
  if (normalized.highlightedOnly) {
    next = next.filter((skill) => Boolean(skill?.highlighted));
  }
  return sortSkillMarketItems(next, normalized.sortBy);
}

function installRegisteredSkillWithFallback(skillId, registeredSkillIds) {
  const allowedSkillIds = resolveAllowedSkillIdsForValidation([
    skillId,
    ...(Array.isArray(registeredSkillIds) ? registeredSkillIds : []),
  ]);
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.installSkill({
      skillId,
      registeredSkillIds,
      allowedSkillIds,
    });
  }

  const normalized = normalizeSkillId(skillId);
  if (!normalized) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1001",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  if (registeredSkillIds.includes(normalized)) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1006",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  return {
    ok: true,
    nextRegisteredSkillIds: [...registeredSkillIds, normalized],
  };
}

function uninstallRegisteredSkillWithFallback(skillId, registeredSkillIds) {
  const allowedSkillIds = resolveAllowedSkillIdsForValidation([
    skillId,
    ...(Array.isArray(registeredSkillIds) ? registeredSkillIds : []),
  ]);
  const external = resolveSkillCatalogValidationApi();
  if (external) {
    return external.uninstallSkill({
      skillId,
      registeredSkillIds,
      allowedSkillIds,
    });
  }

  const normalized = normalizeSkillId(skillId);
  if (!normalized) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1001",
      nextRegisteredSkillIds: [...registeredSkillIds],
    };
  }
  return {
    ok: true,
    nextRegisteredSkillIds: registeredSkillIds.filter((id) => id !== normalized),
  };
}

function allowedSkillIdsForRole(role) {
  const normalized = normalizePalRole(role);
  const allowed = ROLE_SKILL_POLICY[normalized] || ROLE_SKILL_POLICY.worker;
  const dynamic = settingsState && Array.isArray(settingsState.registeredSkills)
    ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  return [...new Set([...allowed, ...dynamic])];
}

function normalizePalRole(role) {
  if (!role) return "worker";
  return PAL_ROLE_OPTIONS.includes(role) ? role : "worker";
}

function normalizePalRuntimeKind(kind) {
  if (!kind) return "model";
  return PAL_RUNTIME_KIND_OPTIONS.includes(kind) ? kind : "model";
}

function validatePalRuntimeSelectionWithFallback(input) {
  const external =
    typeof window !== "undefined" &&
    window.PalRuntimeValidation &&
    typeof window.PalRuntimeValidation.validatePalRuntimeSelection === "function"
      ? window.PalRuntimeValidation
      : null;
  if (external) {
    return external.validatePalRuntimeSelection(input);
  }

  const runtimeKind = normalizePalRuntimeKind(input?.runtimeKind);
  const availableModels = Array.isArray(input?.availableModels) ? input.availableModels : [];
  const availableTools = Array.isArray(input?.availableTools) ? input.availableTools : [];
  const requestedSkillIds = Array.isArray(input?.requestedSkillIds) ? input.requestedSkillIds : [];
  const allowedSkillIds = Array.isArray(input?.allowedSkillIds) ? input.allowedSkillIds : [];
  const runtimeTarget = String(input?.runtimeTarget || "").trim();

  if (runtimeKind === "model") {
    if (!runtimeTarget || !availableModels.includes(runtimeTarget)) {
      return {
        ok: false,
        errorCode: "MSG-PPH-1001",
        runtimeKind,
        models: [],
        cliTools: [],
        skills: [],
      };
    }
    return {
      ok: true,
      runtimeKind,
      models: [runtimeTarget],
      cliTools: [],
      skills: requestedSkillIds.filter((skillId) => allowedSkillIds.includes(skillId)),
    };
  }

  const normalizedTool = normalizeToolName(runtimeTarget);
  if (!runtimeTarget || !availableTools.includes(normalizedTool)) {
    return {
      ok: false,
      errorCode: "MSG-PPH-1001",
      runtimeKind,
      models: [],
      cliTools: [],
      skills: [],
    };
  }
  return {
    ok: true,
    runtimeKind,
    models: [],
    cliTools: [normalizedTool],
    skills: [],
  };
}

function resolvePalProfileModelApi() {
  return typeof window !== "undefined" &&
    window.PalProfileModel &&
    typeof window.PalProfileModel.createPalProfile === "function" &&
    typeof window.PalProfileModel.canDeletePalProfile === "function" &&
    typeof window.PalProfileModel.applyRuntimeSelection === "function"
    ? window.PalProfileModel
    : null;
}

function createPalProfileWithFallback(input) {
  const external = resolvePalProfileModelApi();
  if (external) {
    return external.createPalProfile(input);
  }
  const role = normalizePalRole(input?.role);
  const runtimeKind = input.availableModels.length > 0 ? "model" : "tool";
  const defaultModel = input.availableModels[0] || "";
  const defaultTool = input.availableTools[0] || "";
  const defaultSkills = runtimeKind === "model" ? [...input.roleAllowedSkills] : [];
  return {
    id: normalizePalProfileIdWithFallback(role, input.id),
    role,
    runtimeKind,
    displayName: normalizeText(input.displayName) || (role === "guide" ? "New Guide" : (role === "gate" ? "New Gate" : "New Pal")),
    persona: role === "guide" ? "Guide" : (role === "gate" ? "Gate" : "Worker"),
    provider: runtimeKind === "model" ? input.defaultProvider : "",
    models: runtimeKind === "model" && defaultModel ? [defaultModel] : [],
    cliTools: runtimeKind === "tool" && defaultTool ? [defaultTool] : [],
    skills: defaultSkills,
    status: "active",
  };
}

function canDeletePalProfileWithFallback(palId) {
  const external = resolvePalProfileModelApi();
  if (external) {
    return external.canDeletePalProfile({ palId, tasks, jobs, palProfiles });
  }
  const pal = palProfiles.find((item) => item.id === palId) || null;
  if (pal && normalizePalRole(pal.role) !== "worker") {
    return palProfiles.filter((item) => normalizePalRole(item.role) === normalizePalRole(pal.role)).length > 1;
  }
  const hasTask = tasks.some((task) => task.palId === palId);
  const hasJob = jobs.some((job) => job.palId === palId);
  return !hasTask && !hasJob;
}

function applyPalRuntimeSelectionWithFallback(input) {
  const external = resolvePalProfileModelApi();
  if (external) {
    return external.applyRuntimeSelection(input);
  }
  const next = { ...input.pal };
  const displayName = String(input.displayName || "").trim() || next.displayName || "Pal";
  next.displayName = displayName;
  next.runtimeKind = input.runtimeKind;
  if (input.runtimeKind === "model") {
    const selectedModel = input.runtimeResult.models[0] || "";
    next.models = selectedModel ? [selectedModel] : [];
    next.cliTools = [];
    next.skills = [...input.runtimeResult.skills];
    next.provider = selectedModel ? input.resolveProviderForModel(selectedModel) : "";
  } else {
    const selectedTool = input.runtimeResult.cliTools[0] || "";
    next.models = [];
    next.cliTools = selectedTool ? [selectedTool] : [];
    next.skills = [];
    next.provider = "";
  }
  return next;
}

function resolveGuideChatModelApi() {
  return typeof window !== "undefined" &&
    window.GuideChatModel &&
    typeof window.GuideChatModel.resolveGuideModelState === "function" &&
    typeof window.GuideChatModel.bindGuideToFirstRegisteredModel === "function" &&
    typeof window.GuideChatModel.buildGuideModelReply === "function" &&
    typeof window.GuideChatModel.buildGuideModelRequiredPrompt === "function"
    ? window.GuideChatModel
    : null;
}

function resolvePalContextBuilderApi() {
  return typeof window !== "undefined" &&
    window.PalContextBuilder &&
    typeof window.PalContextBuilder.buildGuideContext === "function"
    ? window.PalContextBuilder
    : null;
}

function resolveAgentIdentityApi() {
  const bridge = resolveWindowBridge("TomoshibikanAgentIdentity", "PalpalAgentIdentity");
  return bridge &&
    typeof bridge.load === "function" &&
    typeof bridge.save === "function"
    ? bridge
    : null;
}

async function initializePalIdentityTemplates(pal) {
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi || !pal) return;
  const role = normalizePalRole(pal.role);
  const agentType = role === "worker" ? "worker" : role;
  if (!agentType) return;
  await identityApi.save({
    agentType,
    agentId: pal.id,
    locale,
    initializeTemplates: true,
    enabledSkillIds: Array.isArray(pal.skills) ? pal.skills : [],
  });
}

async function ensureBuiltInDebugPurposeIdentities() {
  const identityApi = resolveAgentIdentityApi();
  const seedApi = resolveDebugIdentitySeedsApi();
  if (!identityApi || !seedApi) return;
  const builtInProfiles = new Map(INITIAL_PAL_PROFILES.map((profile) => [profile.id, profile]));
  for (const pal of palProfiles) {
    const builtInProfile = builtInProfiles.get(pal.id);
    if (!builtInProfile) continue;
    const role = normalizePalRole(pal.role);
    const agentType = role === "worker" ? "worker" : role;
    if (!agentType) continue;
    const seed = seedApi.getBuiltInDebugIdentitySeed(builtInProfile, locale);
    if (!seed) continue;
    try {
      const existing = await identityApi.load({
        agentType,
        agentId: pal.id,
      });
      if (existing && existing.hasIdentityFiles) continue;
      await identityApi.save({
        agentType,
        agentId: pal.id,
        locale,
        soul: seed.soul,
        role: seed.role,
        rubric: seed.rubric,
        enabledSkillIds: seed.enabledSkillIds,
      });
    } catch (error) {
      continue;
    }
  }
}

function resolveAgentSkillResolverApi() {
  return typeof window !== "undefined" &&
    window.AgentSkillResolver &&
    typeof window.AgentSkillResolver.resolveSkillSummariesForContext === "function"
    ? window.AgentSkillResolver
    : null;
}

function resolveGuideTaskPlannerApi() {
  return typeof window !== "undefined" &&
    window.GuideTaskPlanner &&
    typeof window.GuideTaskPlanner.buildTaskDraftsFromRequest === "function" &&
    typeof window.GuideTaskPlanner.assignTasksToWorkers === "function"
    ? window.GuideTaskPlanner
    : null;
}

function resolveGuidePlanApi() {
  return typeof window !== "undefined" &&
    window.GuidePlan &&
    typeof window.GuidePlan.parseGuidePlanResponse === "function" &&
    typeof window.GuidePlan.buildGuidePlanOutputInstruction === "function"
    ? window.GuidePlan
    : null;
}

function resolveGuidePlanningIntentApi() {
  return typeof window !== "undefined" &&
    window.GuidePlanningIntent &&
    typeof window.GuidePlanningIntent.detectPlanningIntent === "function" &&
    typeof window.GuidePlanningIntent.buildPlanningIntentAssistPrompt === "function"
    ? window.GuidePlanningIntent
    : null;
}

function resolveAgentRoutingApi() {
  return typeof window !== "undefined" &&
    window.AgentRouting &&
    typeof window.AgentRouting.selectWorkerForTask === "function" &&
    typeof window.AgentRouting.selectGateForTarget === "function"
    ? window.AgentRouting
    : null;
}

function resolveDebugIdentitySeedsApi() {
  return typeof window !== "undefined" &&
    window.DebugIdentitySeeds &&
    typeof window.DebugIdentitySeeds.getBuiltInDebugIdentitySeed === "function"
    ? window.DebugIdentitySeeds
    : null;
}

function resolveDebugRunsApi() {
  const bridge = resolveWindowBridge("TomoshibikanDebugRuns", "PalpalDebugRuns");
  return bridge && typeof bridge.list === "function" ? bridge : null;
}

function guideMessageToContextMessage(message) {
  const sender = String(message?.sender || "").trim();
  const textSource = message?.text;
  const content = typeof textSource === "string"
    ? textSource
    : String((textSource && (textSource[locale] || textSource.ja || textSource.en)) || "").trim();
  if (!content) return null;
  const role = sender === "you"
    ? "user"
    : (sender === "guide" ? "assistant" : "system");
  return {
    role,
    content,
  };
}

function normalizeGuideContextMessages(messages, latestUserText) {
  const normalized = Array.isArray(messages)
    ? messages
      .map((message) => {
        if (!message || typeof message !== "object") return null;
        const role = String(message.role || "").trim();
        const content = String(message.content || "").trim();
        if (!role || !content) return null;
        return { role, content };
      })
      .filter(Boolean)
    : [];
  if (normalized.length === 0) {
    return [
      { role: "system", content: GUIDE_SYSTEM_PROMPT },
      { role: "user", content: latestUserText },
    ];
  }
  return normalized;
}

function splitSystemPromptFromContextMessages(messages, fallbackSystemPrompt, latestUserText) {
  const normalized = normalizeGuideContextMessages(messages, latestUserText);
  const systemParts = [];
  const remaining = [];
  normalized.forEach((message) => {
    if (message.role === "system") {
      systemParts.push(message.content);
      return;
    }
    remaining.push(message);
  });
  return {
    systemPrompt: systemParts.join("\n\n") || fallbackSystemPrompt,
    messages: remaining,
  };
}

function buildFallbackLanguagePrompt() {
  return locale === "en"
    ? "Unless the user explicitly requests another language, answer in English."
    : "ユーザーが明示的に別言語を要求しない限り、必ず日本語で回答する。";
}

function buildFallbackIdentitySystemPrompt(basePrompt, identity) {
  const sections = [];
  const languagePrompt = buildFallbackLanguagePrompt();
  if (languagePrompt) sections.push(`[LANGUAGE]\n${languagePrompt}`);
  if (basePrompt) sections.push(`[OPERATING_RULES]\n${basePrompt}`);
  const soulText = normalizeText(identity?.soul);
  const roleText = normalizeText(identity?.role);
  const rubricText = normalizeText(identity?.rubric);
  if (soulText) sections.push(`[SOUL]\n${soulText}`);
  if (roleText) sections.push(`[ROLE]\n${roleText}`);
  if (rubricText) sections.push(`[RUBRIC]\n${rubricText}`);
  return sections.join("\n\n") || basePrompt;
}

async function loadAgentIdentityForPal(pal) {
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi || !pal) return null;
  const role = normalizePalRole(pal.role);
  const agentType = role === "worker" ? "worker" : role;
  if (!agentType) return null;
  try {
    const identity = await identityApi.load({
      agentType,
      agentId: pal.id,
    });
    return identity && identity.hasIdentityFiles ? identity : null;
  } catch (error) {
    return null;
  }
}

function fallbackResolveSkillSummaries(runtimeKind, configuredSkillIds, installedSkillIds, catalogItems) {
  if (runtimeKind !== "model") return [];
  const installed = new Set(
    Array.isArray(installedSkillIds)
      ? installedSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : []
  );
  const catalogById = new Map(
    Array.isArray(catalogItems)
      ? catalogItems.map((item) => {
        const id = normalizeSkillId(item?.id);
        const name = normalizeText(item?.name || id);
        const description = normalizeText(item?.description);
        return [id, { name, description }];
      }).filter(([id]) => Boolean(id))
      : []
  );
  const selected = Array.isArray(configuredSkillIds)
    ? configuredSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  return selected
    .filter((skillId) => installed.has(skillId))
    .map((skillId) => {
      const entry = catalogById.get(skillId);
      if (!entry) return skillId;
      return entry.description ? `${entry.name}: ${entry.description}` : entry.name;
    });
}

async function resolveGuideConfiguredSkillIds() {
  const guideProfile = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId) || null;
  const fallback = Array.isArray(guideProfile?.skills)
    ? guideProfile.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi) return fallback;
  try {
    const identity = await identityApi.load({
      agentType: "guide",
      agentId: guideProfile?.id,
    });
    if (!identity || !identity.hasIdentityFiles) return fallback;
    return Array.isArray(identity.enabledSkillIds)
      ? identity.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [];
  } catch (error) {
    return fallback;
  }
}

async function buildGuideContextWithFallback(latestUserText) {
  const external = resolvePalContextBuilderApi();
  const sessionMessages = guideMessages
    .map((message) => guideMessageToContextMessage(message))
    .filter(Boolean);
  const guideProfile = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId) || null;
  const guideIdentity = await loadAgentIdentityForPal(guideProfile);
  const runtimeKind = normalizePalRuntimeKind(guideProfile?.runtimeKind);
  const guideOperatingRules = buildOperatingRulesPrompt("guide", locale);
  const configuredSkillIds = await resolveGuideConfiguredSkillIds();
  const installedSkillIds = Array.isArray(settingsState.registeredSkills)
    ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const skillCatalogItems = CLAWHUB_SKILL_REGISTRY.map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
  }));
  const skillResolverApi = resolveAgentSkillResolverApi();
  const resolvedByApi = skillResolverApi
    ? skillResolverApi.resolveSkillSummariesForContext({
      runtimeKind,
      configuredSkillIds,
      installedSkillIds,
      catalogItems: skillCatalogItems,
    })
    : null;
  const skillSummaries = Array.isArray(resolvedByApi?.skillSummaries)
    ? resolvedByApi.skillSummaries
    : fallbackResolveSkillSummaries(runtimeKind, configuredSkillIds, installedSkillIds, skillCatalogItems);
  if (external) {
    const builderInput = {
      latestUserText,
      sessionMessages,
      contextWindow: 8192,
      reservedOutput: 1024,
      safetyMargin: 512,
      maxHistoryMessages: 12,
      safetyPrompt: guideOperatingRules,
      role: "guide",
      runtimeKind,
      locale,
      skillSummaries,
      soulText: guideIdentity?.soul || "",
      roleText: guideIdentity?.role || "",
    };
    const built = typeof external.buildPalContext === "function"
      ? external.buildPalContext(builderInput)
      : external.buildGuideContext(builderInput);
    if (built && built.ok && Array.isArray(built.messages)) {
      return {
        ok: true,
        messages: normalizeGuideContextMessages(built.messages, latestUserText),
        audit: built.audit || null,
      };
    }
  }
  return {
    ok: true,
    messages: [
      { role: "system", content: buildFallbackIdentitySystemPrompt(guideOperatingRules, guideIdentity) },
      { role: "user", content: latestUserText },
    ],
    audit: null,
  };
}

function nextTaskSequenceNumber() {
  return tasks.reduce((max, task) => {
    const matched = String(task?.id || "").match(/^TASK-(\d+)$/i);
    if (!matched) return max;
    return Math.max(max, Number(matched[1] || 0));
  }, 0) + 1;
}

async function resolveWorkerAssignmentProfiles() {
  const workers = palProfiles.filter((pal) => pal.role === "worker");
  if (workers.length === 0) return [];
  const identityApi = resolveAgentIdentityApi();
  const skillResolverApi = resolveAgentSkillResolverApi();
  const installedSkillIds = Array.isArray(settingsState.registeredSkills)
    ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const skillCatalogItems = CLAWHUB_SKILL_REGISTRY.map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
  }));

  const profiles = await Promise.all(
    workers.map(async (pal) => {
      let identity = null;
      if (identityApi) {
        try {
          identity = await identityApi.load({
            agentType: "worker",
            agentId: pal.id,
          });
        } catch (error) {
          identity = null;
        }
      }
      const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
      const configuredSkillIds = identity && identity.hasIdentityFiles
        ? (Array.isArray(identity.enabledSkillIds)
          ? identity.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
          : [])
        : (Array.isArray(pal.skills)
          ? pal.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
          : []);
      const resolvedSkillSummaries = skillResolverApi
        ? skillResolverApi.resolveSkillSummariesForContext({
          runtimeKind,
          configuredSkillIds,
          installedSkillIds,
          catalogItems: skillCatalogItems,
        })
        : null;
      const skillSummaries = Array.isArray(resolvedSkillSummaries?.skillSummaries)
        ? resolvedSkillSummaries.skillSummaries
        : fallbackResolveSkillSummaries(runtimeKind, configuredSkillIds, installedSkillIds, skillCatalogItems);
      const roleText = identity && identity.hasIdentityFiles && normalizeText(identity.role)
        ? normalizeText(identity.role)
        : normalizeText(pal.persona || pal.displayName || pal.id);
      return {
        id: pal.id,
        displayName: pal.displayName || pal.id,
        persona: pal.persona || "",
        runtimeKind,
        roleText,
        enabledSkillIds: configuredSkillIds,
        skillSummaries,
      };
    })
  );
  return profiles;
}

function createTaskRecord(input) {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    palId: input.palId,
    status: "assigned",
    updatedAt: formatNow(),
    decisionSummary: "-",
    constraintsCheckResult: "pass",
    evidence: "-",
    replay: "-",
    fixCondition: "-",
  };
}

async function createPlannedTasksFromGuideRequest(userText) {
  const planner = resolveGuideTaskPlannerApi();
  if (!planner) return { created: 0 };
  const workers = await resolveWorkerAssignmentProfiles();
  if (workers.length === 0) return { created: 0 };
  const taskDrafts = planner.buildTaskDraftsFromRequest({
    userText,
    maxTasks: 3,
  });
  if (!Array.isArray(taskDrafts) || taskDrafts.length === 0) return { created: 0 };
  const assignments = planner.assignTasksToWorkers({
    taskDrafts,
    workers,
  });
  if (!Array.isArray(assignments) || assignments.length === 0) return { created: 0 };
  let sequence = nextTaskSequenceNumber();
  const created = [];
  assignments.forEach((assignment, index) => {
    const fallbackWorker = workers[index % workers.length];
    const palId = normalizeText(assignment?.workerId || fallbackWorker?.id);
    if (!palId) return;
    const draft = assignment?.taskDraft || {};
    const id = `TASK-${String(sequence).padStart(3, "0")}`;
    sequence += 1;
    const task = createTaskRecord({
      id,
      title: normalizeText(draft.title) || `${id} Task`,
      description: normalizeText(draft.description) || normalizeText(userText),
      palId,
    });
    tasks.push(task);
    created.push(task);
    const routingExplanation = formatWorkerRoutingExplanation(assignment?.explanation);
    const summaryJa = routingExplanation.ja
      ? `${task.id} を${palId} に配布しました (${routingExplanation.ja})。`
      : `${task.id} を${palId} に配布しました。`;
    const summaryEn = routingExplanation.en
      ? `${task.id} dispatched to ${palId} (${routingExplanation.en}).`
      : `${task.id} dispatched to ${palId}.`;
    appendEvent(
      "dispatch",
      task.id,
      "ok",
      summaryJa,
      summaryEn
    );
  });
  if (created.length > 0 && !selectedTaskId) {
    selectedTaskId = created[0].id;
  }
  renderTaskBoard();
  writeBoardStateSnapshot();
  return { created: created.length };
}

async function createPlannedTasksFromGuidePlan(plan) {
  const normalizedPlan = plan && typeof plan === "object" ? plan : null;
  const taskList = Array.isArray(normalizedPlan?.tasks) ? normalizedPlan.tasks : [];
  if (taskList.length === 0) return { created: 0 };
  const workers = await resolveWorkerAssignmentProfiles();
  if (workers.length === 0) return { created: 0 };
  const routingApi = resolveAgentRoutingApi();
  const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
  let sequence = nextTaskSequenceNumber();
  const created = [];

  taskList.forEach((taskPlan, index) => {
    const explicitWorker = workers.find((worker) => worker.id === normalizeText(taskPlan?.assigneePalId)) || null;
    const taskDraft = {
      title: normalizeText(taskPlan?.title) || `Task ${index + 1}`,
      description: normalizeText(taskPlan?.description),
    };
    if (!taskDraft.description) return;

    let workerId = normalizeText(explicitWorker?.id);
    let explanation = null;
    if (workerId) {
      explanation = {
        matchedRoleTerms: ["explicit_assignee"],
        matchedSkills: [],
      };
    } else if (routingApi && typeof routingApi.selectWorkerForTask === "function") {
      const selected = routingApi.selectWorkerForTask({
        taskDraft,
        workers,
        assignmentCounts,
        requiredSkills: Array.isArray(taskPlan?.requiredSkills) ? taskPlan.requiredSkills : [],
      });
      workerId = normalizeText(selected?.workerId);
      explanation = {
        matchedSkills: Array.isArray(selected?.matchedSkills) ? selected.matchedSkills : [],
        matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
      };
    }
    if (!workerId) {
      workerId = normalizeText(workers[index % workers.length]?.id);
      explanation = {
        matchedSkills: [],
        matchedRoleTerms: [],
      };
    }
    if (!workerId) return;

    assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
    const id = `TASK-${String(sequence).padStart(3, "0")}`;
    sequence += 1;
    const task = createTaskRecord({
      id,
      title: taskDraft.title,
      description: taskDraft.description,
      palId: workerId,
    });
    tasks.push(task);
    created.push(task);
    const routingExplanation = formatWorkerRoutingExplanation(explanation);
    const summaryJa = routingExplanation.ja
      ? `${task.id} を${workerId} に配布しました (${routingExplanation.ja})。`
      : `${task.id} を${workerId} に配布しました。`;
    const summaryEn = routingExplanation.en
      ? `${task.id} dispatched to ${workerId} (${routingExplanation.en}).`
      : `${task.id} dispatched to ${workerId}.`;
    appendEvent("dispatch", task.id, "ok", summaryJa, summaryEn);
  });

  if (created.length > 0 && !selectedTaskId) {
    selectedTaskId = created[0].id;
  }
  renderTaskBoard();
  writeBoardStateSnapshot();
  return { created: created.length };
}

function resolveGuideModelStateWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.resolveGuideModelState({
      palProfiles,
      activeGuideId: workspaceAgentSelection.activeGuideId,
      registeredModels: settingsState.registeredModels,
    });
  }
  const guide = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId);
  if (!guide || guide.runtimeKind !== "model" || !guide.models[0]) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  const model = settingsState.registeredModels.find((item) => item.name === guide.models[0]);
  if (!model) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  return {
    ready: true,
    guideId: guide.id,
    modelName: model.name,
    provider: model.provider,
  };
}

function bindGuideToFirstRegisteredModelWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.bindGuideToFirstRegisteredModel({
      palProfiles,
      activeGuideId: workspaceAgentSelection.activeGuideId,
      registeredModels: settingsState.registeredModels,
    });
  }
  const guide = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId);
  const firstModel = settingsState.registeredModels[0];
  if (!guide || !firstModel || !firstModel.name) return { changed: false };
  guide.runtimeKind = "model";
  guide.models = [firstModel.name];
  guide.cliTools = [];
  guide.provider = firstModel.provider || "";
  return { changed: true, guideId: guide.id, modelName: firstModel.name, provider: firstModel.provider || "" };
}

function buildGuideReplyWithFallback(userText, guideState) {
  const external = resolveGuideChatModelApi();
  const provider = guideState.provider || "";
  const providerText = providerLabel(provider);
  if (external) {
    return external.buildGuideModelReply({
      userText,
      modelName: guideState.modelName,
      providerLabel: providerText,
    });
  }
  const clipped = userText.length > 28 ? `${userText.slice(0, 28)}...` : userText;
  return {
    ja: `${providerText}/${guideState.modelName} で受け取りました。「${clipped}」を元に次のTask案を作成します。`,
    en: `Received via ${providerText}/${guideState.modelName}. I will draft next tasks from "${clipped}".`,
  };
}

function buildGuideModelRequiredPromptWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.buildGuideModelRequiredPrompt();
  }
  return {
    ja: "Guideモデルが未設定です。Settingsタブでモデルを設定してください。",
    en: "Guide model is not configured. Configure a model in Settings tab.",
  };
}

function isDevOrTestEnvironment() {
  if (typeof window === "undefined" || !window.location) return false;
  const protocol = String(window.location.protocol || "");
  const hostname = String(window.location.hostname || "");
  return protocol === "file:" || hostname === "localhost" || hostname === "127.0.0.1";
}

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || "").trim().replace(/\/+$/, "");
}

function buildGuideChatCompletionsUrl(baseUrl) {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) return "https://api.openai.com/v1/chat/completions";
  if (normalized.endsWith("/chat/completions")) return normalized;
  if (normalized.endsWith("/v1")) return `${normalized}/chat/completions`;
  return `${normalized}/v1/chat/completions`;
}

function resolveGuideRegisteredModel(guideState) {
  const modelName = String(guideState?.modelName || "").trim();
  if (!modelName) return null;
  return settingsState.registeredModels.find((model) => model.name === modelName) || null;
}

function resolveGuideApiRuntimeConfig(guideState) {
  const registered = resolveGuideRegisteredModel(guideState);
  if (!hasPalpalCoreRuntimeApi() && isDevOrTestEnvironment()) {
    return {
      provider: DEV_LMSTUDIO_PROVIDER_ID,
      modelName: DEV_LMSTUDIO_MODEL_NAME,
      apiKey: DEV_LMSTUDIO_API_KEY,
      baseUrl: DEV_LMSTUDIO_BASE_URL,
    };
  }
  if (!registered) return null;
  return {
    provider: registered.provider || guideState.provider || DEFAULT_PROVIDER_ID,
    modelName: registered.name || guideState.modelName,
    apiKey: registered.apiKey || "",
    baseUrl: registered.baseUrl || "",
  };
}

function extractGuideAssistantText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    const joined = content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item.text === "string") return item.text;
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
    return joined;
  }
  return "";
}

async function requestGuideModelReplyWithFallback(userText, guideState, contextBuild) {
  const runtime = resolveGuideApiRuntimeConfig(guideState);
  if (!runtime || !runtime.modelName) return null;
  const contextMessages = normalizeGuideContextMessages(contextBuild?.messages, userText);
  const guideOperatingRules = buildOperatingRulesPrompt("guide", locale);
  const promptEnvelope = splitSystemPromptFromContextMessages(
    contextMessages,
    guideOperatingRules,
    userText
  );
  const [enabledSkillIds, guideIdentity] = await Promise.all([
    resolveGuideConfiguredSkillIds(),
    loadAgentIdentityForPal(getActiveGuideProfile()),
  ]);
  const workspaceRoot = resolveRuntimeWorkspaceRootForChat();
  const guidePlanApi = resolveGuidePlanApi();
  const guidePlanningIntentApi = resolveGuidePlanningIntentApi();
  const planOutputInstruction = guidePlanApi
    ? guidePlanApi.buildGuidePlanOutputInstruction(locale)
    : buildFallbackGuidePlanOutputInstruction();
  const planFewShotExamples = guidePlanApi && typeof guidePlanApi.buildGuidePlanFewShotExamples === "function"
    ? guidePlanApi.buildGuidePlanFewShotExamples(locale)
    : "";
  const assistEnabled = isGuideControllerAssistEnabled();
  const planningIntent = assistEnabled && guidePlanningIntentApi
    ? guidePlanningIntentApi.detectPlanningIntent(userText)
    : { requested: false, cue: "none" };
  const planningReadiness = assistEnabled && guidePlanningIntentApi && typeof guidePlanningIntentApi.detectPlanningReadiness === "function"
    ? guidePlanningIntentApi.detectPlanningReadiness(userText, planningIntent)
    : { ready: false, cue: "none" };
  const planningAssistPrompt = assistEnabled && guidePlanningIntentApi
    ? guidePlanningIntentApi.buildPlanningIntentAssistPrompt(locale, planningIntent)
    : "";
  const planningReadinessPrompt = assistEnabled && guidePlanningIntentApi && typeof guidePlanningIntentApi.buildPlanningReadinessAssistPrompt === "function"
    ? guidePlanningIntentApi.buildPlanningReadinessAssistPrompt(locale, planningReadiness)
    : "";
  const planResponseFormat = guidePlanApi && typeof guidePlanApi.buildGuidePlanResponseFormat === "function"
    ? guidePlanApi.buildGuidePlanResponseFormat(locale)
    : null;
  const planningSystemPrompt = [promptEnvelope.systemPrompt, planningAssistPrompt, planningReadinessPrompt, planFewShotExamples, planOutputInstruction]
    .map((part) => normalizeText(part))
    .filter(Boolean)
    .join("\n\n");

  const coreRuntimeApi = resolvePalpalCoreRuntimeApi();
  if (coreRuntimeApi) {
    try {
      const resolvedApiKey = await resolveStoredModelApiKeyWithFallback(runtime.modelName, runtime.apiKey);
      const payload = await coreRuntimeApi.guideChat({
        provider: runtime.provider,
        modelName: runtime.modelName,
        baseUrl: runtime.baseUrl,
        apiKey: resolvedApiKey,
        userText,
        systemPrompt: planningSystemPrompt,
        messages: promptEnvelope.messages,
        responseFormat: planResponseFormat,
        enabledSkillIds,
        workspaceRoot,
        debugMeta: {
          stage: "guide_chat",
          agentRole: "guide",
          agentId: normalizeText(guideState?.guideId || getActiveGuideProfile()?.id),
          targetKind: "plan",
          targetId: "PLAN-001",
          planningIntent: planningIntent.cue,
          planningReadiness: planningReadiness.cue,
          identityVersions: buildDebugIdentityVersions(guideIdentity),
          enabledSkillIds,
        },
      });
      const text = String(payload?.text || "").trim();
      if (!text) return null;
      return {
        text,
        provider: payload?.provider || runtime.provider,
        modelName: payload?.modelName || runtime.modelName,
        toolCalls: Array.isArray(payload?.toolCalls) ? payload.toolCalls : [],
      };
    } catch (error) {
      return null;
    }
  }

  if (typeof fetch !== "function") return null;
  const resolvedApiKey = await resolveStoredModelApiKeyWithFallback(runtime.modelName, runtime.apiKey);
  const endpoint = buildGuideChatCompletionsUrl(runtime.baseUrl);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), GUIDE_MODEL_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(resolvedApiKey ? { Authorization: `Bearer ${resolvedApiKey}` } : {}),
      },
      body: JSON.stringify({
        model: runtime.modelName,
        temperature: 0.2,
        messages: [
          { role: "system", content: planningSystemPrompt },
          ...promptEnvelope.messages,
        ],
      }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const payload = await response.json();
    const replyText = extractGuideAssistantText(payload);
    if (!replyText) return null;
    return {
      text: replyText,
      provider: runtime.provider,
      modelName: runtime.modelName,
    };
  } catch (error) {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function buildGuideLiveModelReply(modelReply) {
  const providerText = providerLabel(modelReply.provider || "openai");
  const modelName = modelReply.modelName || DEV_LMSTUDIO_MODEL_NAME;
  const overrideText = arguments.length > 1 ? arguments[1] : "";
  const text = String(overrideText || modelReply.text || "").trim();
  const toolCalls = Array.isArray(modelReply.toolCalls) ? modelReply.toolCalls : [];
  const toolNames = [...new Set(
    toolCalls
      .map((call) => normalizeText(call?.tool_name || call?.toolName))
      .filter(Boolean)
  )];
  const toolLine = toolNames.length > 0
    ? `\n[tools] ${toolNames.join(", ")}`
    : "";
  return {
    ja: `${providerText}/${modelName}${toolLine}\n${text}`,
    en: `${providerText}/${modelName}${toolLine}\n${text}`,
  };
}

function buildFallbackGuidePlanOutputInstruction() {
  return locale === "en"
    ? [
      "Return compact JSON only. Do not use markdown fences.",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "Use status=conversation when the user is chatting, brainstorming, or not asking for task breakdown yet.",
      "Use status=needs_clarification only when a missing fact blocks task creation.",
      "If the user explicitly asks for a plan or task breakdown and gives the target, expected outcome, relevant files, or available tools, prefer status=plan_ready.",
      "When minor details are missing, make reasonable assumptions and put them in constraints instead of asking another confirmation question.",
      "Do not ask the user to pick the assignee Pal when suitable Pals and tools are already available in context; choose the best fit yourself.",
      "In the debug workspace, prefer simple-role workers: trace work to Trace Worker, fix work to Fix Worker, and verification work to Verify Worker.",
      "Use status=plan_ready only when you have enough information to create an actionable plan.",
    ].join("\n")
    : [
      "JSONのみで返す。Markdown の code fence は使わない。",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "雑談・壁打ち・相談段階で、まだタスク化を求められていない時は status=conversation を返す。",
      "task 化を止める唯一の欠落情報がある時だけ status=needs_clarification を返す。",
      "ユーザーが plan や task 分解を明示し、対象・期待結果・関連ファイル・使える tool の多くを渡している場合は、残りを assumptions として constraints に入れて status=plan_ready を返す。",
      "軽微な不足情報であれば、追加確認ではなく constraints に仮定を残して plan_ready を優先する。",
      "候補 Pal や使える tool が文脈にある時は、担当 Pal をユーザーへ聞き返さず Guide 自身が選ぶ。",
      "debug workspace では simple-role worker を優先し、trace は Trace Worker、fix は Fix Worker、verification は Verify Worker に寄せる。",
      "実行可能な計画を作れる時だけ status=plan_ready を返す。",
    ].join("\n");
}

function parseGuidePlanResponseWithFallback(text, options = {}) {
  const guidePlanApi = resolveGuidePlanApi();
  if (guidePlanApi) {
    return guidePlanApi.parseGuidePlanResponse(text, options);
  }
  return { ok: false, error: "guide_plan_api_unavailable" };
}

function setGuideComposerBusy(isBusy) {
  const input = document.getElementById("guideInput");
  const send = document.getElementById("guideSend");
  if (input) input.disabled = Boolean(isBusy);
  if (send) send.disabled = Boolean(isBusy);
  syncGuideVisualState();
}

function setGuideComposerFocused(isFocused) {
  guideComposerFocused = Boolean(isFocused);
  syncGuideVisualState();
}

function syncGuideVisualState() {
  const shell = document.querySelector(".app-shell");
  const composer = document.getElementById("guideComposer");
  const input = document.getElementById("guideInput");
  const send = document.getElementById("guideSend");
  const isGuideTab = workspaceTab === "guide";
  const isFocused = isGuideTab && guideComposerFocused;
  const isBusy = isGuideTab && guideSendInFlight;
  if (shell) {
    shell.classList.toggle("guide-compose-active", isFocused);
    shell.classList.toggle("guide-busy", isBusy);
  }
  if (composer) {
    composer.classList.toggle("is-focused", isFocused);
    composer.classList.toggle("is-busy", isBusy);
    composer.setAttribute("data-guide-state", isBusy ? "busy" : (isFocused ? "focused" : "idle"));
  }
  if (input) {
    input.setAttribute("aria-busy", isBusy ? "true" : "false");
  }
  if (send) {
    send.classList.toggle("guide-send-busy", isBusy);
    send.setAttribute("aria-busy", isBusy ? "true" : "false");
    send.textContent = tDyn(isBusy ? "guideSending" : "guideSend");
  }
}

function palRoleLabel(role) {
  const normalized = normalizePalRole(role);
  if (locale === "ja") {
    if (normalized === "guide") return "Guide役";
    if (normalized === "gate") return "Gate役";
    return "通常Pal";
  }
  if (normalized === "guide") return "Guide";
  if (normalized === "gate") return "Gate";
  return "Worker Pal";
}

function coreModelOptionsByProvider(providerId) {
  const normalizedProviderId = providerIdFromInput(providerId);
  return [...(PALPAL_CORE_MODEL_OPTIONS_BY_PROVIDER.get(normalizedProviderId) || [])];
}

function selectableModelOptions(providerId = settingsState.itemDraft.provider) {
  const normalizedProviderId = providerIdFromInput(providerId);
  const registered = settingsState.registeredModels
    .filter((model) => providerIdFromInput(model.provider) === normalizedProviderId)
    .map((model) => model.name);
  return buildModelOptionList(coreModelOptionsByProvider(normalizedProviderId), registered);
}

function resolveDraftProviderWithAvailableModels(preferredProviderId = settingsState.itemDraft.provider) {
  const normalized = providerIdFromInput(preferredProviderId);
  if (PROVIDER_OPTIONS.includes(normalized)) return normalized;
  return PROVIDER_OPTIONS[0] || normalized || DEFAULT_PROVIDER_ID;
}

function isValidProviderModelPair(providerId, modelName) {
  const normalizedModelName = normalizeText(modelName);
  if (!normalizedModelName) return false;
  const options = selectableModelOptions(providerId);
  return options.includes(normalizedModelName);
}

function resetModelItemDraft(nextProviderId = settingsState.itemDraft.provider) {
  const providerId = resolveDraftProviderWithAvailableModels(nextProviderId);
  const options = selectableModelOptions(providerId);
  settingsState.itemDraft.modelName = options[0] || "";
  settingsState.itemDraft.provider = providerId;
  settingsState.itemDraft.apiKey = "";
  settingsState.itemDraft.baseUrl = "";
  settingsState.itemDraft.endpoint = "";
}

function syncSettingsModelsFromRegistry() {
  settingsState.registeredModels = settingsState.registeredModels
    .map(normalizeRegisteredModel)
    .filter((model) => Boolean(model.name));
  settingsState.registeredTools = settingsState.registeredTools
    .map((tool) => normalizeToolName(String(tool || "").trim()))
    .filter((tool, index, list) => tool && list.indexOf(tool) === index);
  settingsState.registeredSkills = settingsState.registeredSkills
    .map((skillId) => normalizeSkillId(String(skillId || "").trim()))
    .filter((skillId, index, list) => skillId && list.indexOf(skillId) === index);
  settingsState.models = settingsState.registeredModels.map((model) => model.name);
  settingsState.provider = settingsState.registeredModels[0]?.provider || DEFAULT_PROVIDER_ID;
  settingsState.itemDraft.provider = resolveDraftProviderWithAvailableModels(settingsState.itemDraft.provider);
  const options = selectableModelOptions(settingsState.itemDraft.provider);
  settingsState.itemDraft.modelName = options.includes(settingsState.itemDraft.modelName)
    ? settingsState.itemDraft.modelName
    : (options[0] || "");
  settingsState.itemDraft.toolName = normalizeToolName(settingsState.itemDraft.toolName);
  settingsState.itemDraft.type = settingsState.itemDraft.type === "tool" ? "tool" : "model";
  settingsState.skillSearchQuery = String(settingsState.skillSearchQuery || "");
  settingsState.skillSearchDraft = String(settingsState.skillSearchDraft || "");
  settingsState.skillSearchExecuted = Boolean(settingsState.skillSearchExecuted);
  settingsState.skillSearchFilters = normalizeSkillSearchFilters(settingsState.skillSearchFilters);
  settingsState.skillSearchFilterDraft = normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft);
}

function syncPalProfilesRegistryRefs() {
  const availableModels = settingsState.registeredModels.map((model) => model.name);
  const availableTools = [...settingsState.registeredTools];
  const availableSkills = [...settingsState.registeredSkills];
  const fallbackModel = availableModels[0] || "";
  const fallbackTool = availableTools[0] || "";

  palProfiles.forEach((pal, index) => {
    pal.role = normalizePalRole(pal.role);
    pal.runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
    pal.displayName = String(pal.displayName || "").trim() || `Pal ${index + 1}`;
    const roleAllowedSkills = allowedSkillIdsForRole(pal.role)
      .filter((skillId) => availableSkills.includes(skillId));
    const nextModels = Array.isArray(pal.models)
      ? pal.models.filter((model) => availableModels.includes(model))
      : [];
    const nextTools = Array.isArray(pal.cliTools)
      ? pal.cliTools
        .map((tool) => normalizeToolName(tool))
        .filter((tool) => availableTools.includes(tool))
      : [];
    const nextSkills = Array.isArray(pal.skills)
      ? pal.skills
        .map((skillId) => normalizeSkillId(skillId))
        .filter((skillId) => roleAllowedSkills.includes(skillId))
      : [];

    if (pal.runtimeKind === "tool") {
      pal.models = [];
      pal.cliTools = nextTools.length > 0
        ? [nextTools[0]]
        : (fallbackTool ? [fallbackTool] : []);
      pal.skills = [];
      if (pal.cliTools.length === 0 && fallbackModel) {
        pal.runtimeKind = "model";
        pal.models = [fallbackModel];
        pal.skills = [...roleAllowedSkills];
      }
    } else {
      pal.cliTools = [];
      pal.models = nextModels.length > 0
        ? [nextModels[0]]
        : (fallbackModel ? [fallbackModel] : []);
      pal.skills = nextSkills;
      if (pal.models.length === 0 && fallbackTool) {
        pal.runtimeKind = "tool";
        pal.cliTools = [fallbackTool];
        pal.skills = [];
      }
    }
    const primaryModel = settingsState.registeredModels.find((model) => model.name === pal.models[0]);
    pal.provider = primaryModel?.provider || "";
  });
  syncWorkspaceAgentSelection();
}

function createWorkerPalId() {
  let index = 1;
  while (true) {
    const candidate = `pal-worker-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
}

function createGuidePalId() {
  let index = 1;
  while (true) {
    const candidate = `guide-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
}

function createGatePalId() {
  let index = 1;
  while (true) {
    const candidate = `gate-${String(index).padStart(3, "0")}`;
    if (!palProfiles.some((pal) => pal.id === candidate)) return candidate;
    index += 1;
  }
}

function createPalIdForRole(role) {
  const normalizedRole = normalizePalRole(role);
  if (normalizedRole === "guide") return createGuidePalId();
  if (normalizedRole === "gate") return createGatePalId();
  return createWorkerPalId();
}

function getActiveGuideProfile() {
  return palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId) || null;
}

function getDefaultGateProfile() {
  return palProfiles.find((pal) => pal.id === workspaceAgentSelection.defaultGateId) || null;
}

function resolveIdentitySecondaryDescriptor(role) {
  const normalizedRole = normalizePalRole(role);
  if (normalizedRole === "gate") {
    return {
      fileKind: "rubric",
      fileName: "RUBRIC.md",
      label: "RUBRIC",
    };
  }
  return {
    fileKind: "role",
    fileName: "ROLE.md",
    label: "ROLE",
  };
}

function resolveIdentityEditorAgentInput(pal) {
  const role = normalizePalRole(pal?.role);
  const agentType = role === "worker" ? "worker" : role;
  return {
    agentType,
    agentId: normalizeText(pal?.id),
  };
}

function getGateProfileById(gateProfileId) {
  const normalizedId = normalizeText(gateProfileId);
  if (!normalizedId) return null;
  const gate = palProfiles.find((pal) => (
    normalizePalRole(pal.role) === "gate" && pal.id === normalizedId
  )) || null;
  return gate;
}

function resolveGateProfileForTarget(target) {
  const explicitGate = getGateProfileById(target?.gateProfileId);
  if (explicitGate) return explicitGate;
  return getDefaultGateProfile();
}

async function resolveGateRoutingProfiles() {
  const gates = palProfiles.filter((pal) => normalizePalRole(pal.role) === "gate");
  if (gates.length === 0) return [];
  const profiles = await Promise.all(gates.map(async (pal) => {
    const identity = await loadAgentIdentityForPal(pal);
    return {
      id: pal.id,
      displayName: pal.displayName || pal.id,
      persona: pal.persona || "",
      status: normalizeText(pal.status || "active"),
      soulText: normalizeText(identity?.soul),
      rubricText: normalizeText(identity?.rubric),
    };
  }));
  return profiles;
}

async function resolveGateProfileForTargetWithRouting(target) {
  const explicitGate = getGateProfileById(target?.gateProfileId);
  if (explicitGate) {
    return { gate: explicitGate, explanation: { matchedRubricTerms: [] } };
  }
  const routingApi = resolveAgentRoutingApi();
  if (!routingApi || typeof routingApi.selectGateForTarget !== "function") {
    return { gate: getDefaultGateProfile(), explanation: { matchedRubricTerms: [] } };
  }
  const routingProfiles = await resolveGateRoutingProfiles();
  if (routingProfiles.length === 0) {
    return { gate: getDefaultGateProfile(), explanation: { matchedRubricTerms: [] } };
  }
  const selected = routingApi.selectGateForTarget({
    target: {
      title: normalizeText(target?.title),
      instruction: normalizeText(target?.description || target?.instruction),
      expectedOutput: buildWorkerExpectedOutput(target?.schedule ? "job" : "task"),
      submission: normalizeText(target?.evidence),
      evidence: normalizeText(target?.evidence),
      replay: normalizeText(target?.replay),
      fixes: Array.isArray(target?.gateResult?.fixes) ? target.gateResult.fixes : parseGateFixes(target?.fixCondition),
    },
    gates: routingProfiles,
    defaultGateId: workspaceAgentSelection.defaultGateId,
  });
  return {
    gate: getGateProfileById(selected?.gateId) || getDefaultGateProfile(),
    explanation: {
      matchedRubricTerms: Array.isArray(selected?.matchedRubricTerms) ? selected.matchedRubricTerms : [],
      matchedReviewFocusTerms: Array.isArray(selected?.matchedReviewFocusTerms) ? selected.matchedReviewFocusTerms : [],
    },
  };
}

function assignGateProfileToTarget(target, preferredGateId = "") {
  if (!target || typeof target !== "object") return null;
  const explicitGate = getGateProfileById(preferredGateId);
  const resolvedGate = explicitGate || resolveGateProfileForTarget(target);
  target.gateProfileId = normalizeText(resolvedGate?.id);
  return resolvedGate;
}

async function assignGateProfileToTargetWithRouting(target, preferredGateId = "") {
  if (!target || typeof target !== "object") return null;
  const explicitGate = getGateProfileById(preferredGateId);
  const routed = explicitGate
    ? { gate: explicitGate, explanation: { matchedRubricTerms: [] } }
    : await resolveGateProfileForTargetWithRouting(target);
  const resolvedGate = routed?.gate || null;
  target.gateProfileId = normalizeText(resolvedGate?.id);
  return {
    gate: resolvedGate,
    explanation: routed?.explanation || { matchedRubricTerms: [] },
  };
}

function gateProfileSummaryText(target) {
  const gate = resolveGateProfileForTarget(target);
  if (!gate) {
    return `${tDyn("gateProfile")}: -`;
  }
  return `${tDyn("gateProfile")}: ${gate.displayName || gate.id}`;
}

function senderLabel(sender) {
  if (sender === "guide") return tDyn("senderGuide");
  if (sender === "you") return tDyn("senderYou");
  if (sender === "system") return tDyn("senderSystem");
  return sender;
}

function formatNow() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

function appendEvent(type, targetId, result, summaryJa, summaryEn) {
  events.unshift(
    makeEvent(type, targetId, result, { ja: summaryJa, en: summaryEn }, formatNow().slice(11))
  );
  events = events.slice(0, 50);
  eventPage = 1;
}

function formatWorkerRoutingExplanation(explanation) {
  const matchedSkills = Array.isArray(explanation?.matchedSkills)
    ? explanation.matchedSkills.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedRoleTerms = Array.isArray(explanation?.matchedRoleTerms)
    ? explanation.matchedRoleTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const parts = [];
  if (matchedSkills.length > 0) {
    parts.push(`skills=${matchedSkills.join(",")}`);
  }
  if (matchedRoleTerms.length > 0) {
    parts.push(`ROLE=${matchedRoleTerms.join(",")}`);
  }
  return {
    ja: parts.join(" / "),
    en: parts.join(" / "),
  };
}

function formatGateRoutingExplanation(explanation) {
  const matchedRubricTerms = Array.isArray(explanation?.matchedRubricTerms)
    ? explanation.matchedRubricTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const matchedReviewFocusTerms = Array.isArray(explanation?.matchedReviewFocusTerms)
    ? explanation.matchedReviewFocusTerms.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const gateTerms = matchedRubricTerms.length > 0 ? matchedRubricTerms : matchedReviewFocusTerms;
  const text = gateTerms.length > 0
    ? `RUBRIC=${gateTerms.join(",")}`
    : "";
  return {
    ja: text,
    en: text,
  };
}

function messageText(id) {
  const data = MESSAGE_TEXT[id];
  if (!data) return id;
  return data[locale] || data.ja || data.en || id;
}

function isErrorMessageId(id) {
  return /^MSG-PPH-1\d{3}$/.test(String(id || ""));
}

function hideErrorToast() {
  const toast = document.getElementById("errorToast");
  if (!toast) return;
  if (errorToastTimer) {
    window.clearTimeout(errorToastTimer);
    errorToastTimer = null;
  }
  toast.classList.remove("is-visible");
  window.setTimeout(() => {
    if (!toast.classList.contains("is-visible")) {
      toast.hidden = true;
    }
  }, 220);
}

function showErrorToast(id, text) {
  const toast = document.getElementById("errorToast");
  if (!toast) return;
  const titleEl = document.getElementById("errorToastTitle");
  const codeEl = document.getElementById("errorToastCode");
  const textEl = document.getElementById("errorToastText");
  const closeEl = document.getElementById("errorToastClose");
  if (titleEl) titleEl.textContent = tDyn("errorToastTitle");
  if (codeEl) codeEl.textContent = id;
  if (textEl) textEl.textContent = text;
  if (closeEl) closeEl.setAttribute("aria-label", tDyn("errorToastClose"));
  toast.hidden = false;
  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });
  if (errorToastTimer) window.clearTimeout(errorToastTimer);
  errorToastTimer = window.setTimeout(() => {
    hideErrorToast();
  }, 4600);
}

function setMessage(id) {
  if (!id) return;
  messageId = id;
  const text = messageText(id);
  if (isErrorMessageId(id)) {
    showErrorToast(id, text);
    return;
  }
  hideErrorToast();
}

function rerenderActiveTabPanel(tab) {
  if (tab === "guide") {
    renderGuideChat();
    return;
  }
  if (tab === "pal") {
    renderPalList();
    return;
  }
  if (tab === "project") {
    renderProjectTab();
    return;
  }
  if (tab === "job") {
    renderJobBoard();
    return;
  }
  if (tab === "task") {
    renderTaskBoard();
    return;
  }
  if (tab === "event") {
    renderEventLog();
    return;
  }
  if (tab === "settings") {
    renderSettingsTab();
  }
}

function setWorkspaceTab(tab) {
  workspaceTab = tab;
  if (tab !== "guide") {
    closeGuideMentionMenu();
  }
  if (tab !== "pal") {
    closePalConfigModal();
  }
  document.querySelectorAll(".workspace-tabs .tab-btn").forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle("active", isActive);
    btn.classList.toggle("tab-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tab;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
  document.querySelector(".app-shell").classList.toggle("guide-mode", tab === "guide");
  syncGuideVisualState();
  rerenderActiveTabPanel(tab);
  renderDetail();
}

function applyI18n() {
  document.documentElement.lang = locale === "ja" ? "ja" : "en";
  document.querySelectorAll("[data-ui-id]").forEach((el) => {
    const id = el.getAttribute("data-ui-id");
    el.textContent = tUi(id);
  });
  const guideHint = document.getElementById("guideHint");
  if (guideHint) guideHint.textContent = tDyn("guideHint");
  document.getElementById("guideInput").placeholder = tDyn("guideInputPlaceholder");
  syncGuideVisualState();
  document.querySelector("#gateReason").placeholder = tDyn("rejectReasonPlaceholder");
  renderGateReasonTemplates();
  renderGuideProjectFocus();
  setWorkspaceTab(workspaceTab);
  renderGuideChat();
  renderJobBoard();
  renderTaskBoard();
  renderEventLog();
  renderPalList();
  renderProjectTab();
  renderSettingsTab();
  renderDetail();
  setMessage(messageId);
}

function renderGuideChat() {
  const ul = document.getElementById("guideChat");
  ul.innerHTML = guideMessages
    .map((m) => {
      const text = (m.text && (m.text[locale] || m.text.ja)) || "";
      const escapedText = escapeHtml(text).replace(/\n/g, "<br>");
      let alignClass = "chat-start";
      let rowClass = "guide-chat-item guide-chat-item-guide";
      let bubbleClass = "chat-bubble guide-bubble guide-bubble-guide";
      if (m.sender === "you") {
        alignClass = "chat-end";
        rowClass = "guide-chat-item guide-chat-item-user";
        bubbleClass = "chat-bubble guide-bubble guide-bubble-user";
      } else if (m.sender === "system") {
        alignClass = "chat-center";
        rowClass = "guide-chat-item guide-chat-item-system";
        bubbleClass = "chat-bubble guide-bubble guide-bubble-system";
      }
      return `<li class="chat ${alignClass} ${rowClass}" data-guide-sender="${escapeHtml(m.sender)}">
        <div class="chat-header guide-chat-meta text-xs text-base-content/60">${m.timestamp} / ${senderLabel(m.sender)}</div>
        <div class="${bubbleClass} max-w-[min(720px,100%)] text-sm leading-relaxed">${escapedText}</div>
      </li>`;
    })
    .join("");
  ul.scrollTop = ul.scrollHeight;
  renderGuideProjectFocus();
}

function resolveGuideFocusCommandTarget(text) {
  const trimmed = normalizeText(text);
  if (!trimmed) return "";
  const slashUse = trimmed.match(/^\/use\s+(.+)$/i);
  if (slashUse && slashUse[1]) return normalizeProjectName(slashUse[1]);
  const openJa = trimmed.match(/^(.+?)を開いて$/);
  if (openJa && openJa[1]) return normalizeProjectName(openJa[1]);
  const openEn = trimmed.match(/^open\s+(.+)$/i);
  if (openEn && openEn[1]) return normalizeProjectName(openEn[1]);
  return "";
}

function buildGuideProjectFocusUpdatedText(project) {
  if (!project) return "";
  if (locale === "ja") {
    return `プロジェクトフォーカスを ${project.name} に切り替えました。`;
  }
  return `Project focus switched to ${project.name}.`;
}

function buildGuideProjectNotFoundText(projectName) {
  if (locale === "ja") {
    return `プロジェクト「${projectName}」が見つかりません。Projectタブで登録してください。`;
  }
  return `Project "${projectName}" was not found. Add it from the Project tab.`;
}

function pushGuideSystemMessage(text) {
  const normalized = normalizeText(text);
  if (!normalized) return;
  guideMessages.push({
    timestamp: formatNow().slice(11),
    sender: "system",
    text: {
      ja: normalized,
      en: normalized,
    },
  });
}

function handleGuideFocusCommand(userText) {
  const targetName = resolveGuideFocusCommandTarget(userText);
  if (!targetName) return { handled: false };
  const project = projectByName(targetName);
  if (!project) {
    pushGuideSystemMessage(buildGuideProjectNotFoundText(targetName));
    setMessage("MSG-PPH-1004");
    renderGuideChat();
    return { handled: true, ok: false };
  }
  projectState.focusProjectId = project.id;
  writeProjectStateSnapshot();
  renderProjectTab();
  renderGuideProjectFocus();
  pushGuideSystemMessage(buildGuideProjectFocusUpdatedText(project));
  setMessage("MSG-PPH-0009");
  renderGuideChat();
  return { handled: true, ok: true };
}

function normalizeGuideReferenceToken(rawToken) {
  return String(rawToken || "")
    .trim()
    .replace(/^@+/, "")
    .replace(/[),.;!?]+$/g, "");
}

function collectGuideReferenceTokens(text) {
  const input = String(text || "");
  const regex = /(^|\s)@([^\s@]+)/g;
  const tokens = [];
  let match = regex.exec(input);
  while (match) {
    const token = normalizeGuideReferenceToken(match[2]);
    if (token) tokens.push(token);
    match = regex.exec(input);
  }
  return tokens;
}

function resolveGuideReferenceToken(token, focusProject) {
  const normalized = normalizeGuideReferenceToken(token);
  if (!normalized) return null;
  const colonIndex = normalized.indexOf(":");
  if (colonIndex >= 0) {
    const projectName = normalizeProjectName(normalized.slice(0, colonIndex));
    const filePath = normalizeProjectFilePath(normalized.slice(colonIndex + 1));
    if (!projectName || !filePath) return null;
    const project = projectByName(projectName);
    if (!project) return null;
    return {
      kind: "file",
      project,
      filePath,
    };
  }

  const byProject = projectByName(normalized);
  if (byProject) {
    return {
      kind: "project",
      project: byProject,
      filePath: "",
    };
  }

  if (focusProject) {
    return {
      kind: "file",
      project: focusProject,
      filePath: normalizeProjectFilePath(normalized),
    };
  }
  return null;
}

function buildGuideProjectContext(userText) {
  const focus = focusedProject();
  const tokens = collectGuideReferenceTokens(userText);
  const references = [];
  const unresolved = [];
  const seen = new Set();
  tokens.forEach((token) => {
    const resolved = resolveGuideReferenceToken(token, focus);
    if (!resolved) {
      unresolved.push(token);
      return;
    }
    const key = `${resolved.kind}:${resolved.project.id}:${resolved.filePath}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    references.push(resolved);
  });
  return {
    focus,
    references,
    unresolved,
  };
}

function buildGuideProjectContextNote(context) {
  if (!context) return "";
  const focus = context.focus;
  const references = Array.isArray(context.references) ? context.references : [];
  if (!focus && references.length === 0) return "";
  const lines = [];
  lines.push("[Project Context]");
  if (focus) {
    lines.push(`focus_project: ${focus.name}`);
    lines.push(`focus_directory: ${focus.directory}`);
  }
  if (references.length > 0) {
    lines.push("references:");
    references.forEach((reference) => {
      if (reference.kind === "project") {
        lines.push(`- project:${reference.project.name}`);
      } else {
        lines.push(`- file:${reference.project.name}:${reference.filePath}`);
      }
    });
  }
  return lines.join("\n");
}

function buildGuideModelUserText(userText) {
  const context = buildGuideProjectContext(userText);
  const note = buildGuideProjectContextNote(context);
  if (!note) {
    return {
      modelUserText: userText,
      context,
    };
  }
  return {
    modelUserText: `${userText}\n\n${note}`,
    context,
  };
}

function extractGuideMentionToken(text, caretIndex) {
  const input = String(text || "");
  const caret = Number.isInteger(caretIndex) ? caretIndex : input.length;
  const uptoCaret = input.slice(0, caret);
  const atIndex = uptoCaret.lastIndexOf("@");
  if (atIndex < 0) return null;
  const prevChar = atIndex === 0 ? "" : uptoCaret[atIndex - 1];
  if (prevChar && !/\s/.test(prevChar)) return null;
  const query = uptoCaret.slice(atIndex + 1);
  if (/\s/.test(query)) return null;
  return {
    tokenStart: atIndex,
    tokenEnd: caret,
    query,
  };
}

function buildGuideMentionSuggestions(inputText, caretIndex) {
  const token = extractGuideMentionToken(inputText, caretIndex);
  if (!token) return null;
  const focus = focusedProject();
  const query = String(token.query || "");
  const normalizedQuery = query.toLowerCase();
  const suggestions = [];
  if (query.includes(":")) {
    const divider = query.indexOf(":");
    const projectPart = normalizeProjectName(query.slice(0, divider));
    const filePart = normalizeProjectFilePath(query.slice(divider + 1)).toLowerCase();
    const project = projectByName(projectPart);
    if (project) {
      project.files
        .filter((file) => !filePart || file.toLowerCase().includes(filePart))
        .slice(0, 12)
        .forEach((file) => {
          suggestions.push({
            value: `@${project.name}:${file}`,
            label: `@${project.name}:${file}`,
            type: "file",
          });
        });
    } else {
      projectState.projects
        .filter((item) => !projectPart || item.name.toLowerCase().includes(projectPart.toLowerCase()))
        .slice(0, 8)
        .forEach((item) => {
          suggestions.push({
            value: `@${item.name}:`,
            label: `@${item.name}:`,
            type: "project",
          });
        });
    }
  } else {
    projectState.projects
      .filter((project) => !normalizedQuery || project.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 8)
      .forEach((project) => {
        suggestions.push({
          value: `@${project.name}`,
          label: `@${project.name}`,
          type: "project",
        });
      });
    if (focus) {
      focus.files
        .filter((file) => !normalizedQuery || file.toLowerCase().includes(normalizedQuery))
        .slice(0, 8)
        .forEach((file) => {
          suggestions.push({
            value: `@${file}`,
            label: `@${file} (${focus.name})`,
            type: "file",
          });
        });
    }
  }
  return {
    tokenStart: token.tokenStart,
    tokenEnd: token.tokenEnd,
    items: suggestions.slice(0, 12),
  };
}

function closeGuideMentionMenu() {
  guideMentionState.open = false;
  guideMentionState.activeIndex = 0;
  guideMentionState.tokenStart = -1;
  guideMentionState.tokenEnd = -1;
  guideMentionState.items = [];
  const menu = document.getElementById("guideMentionMenu");
  if (!menu) return;
  menu.classList.add("hidden");
  menu.innerHTML = "";
}

function applyGuideMentionSuggestion(index) {
  const input = document.getElementById("guideInput");
  if (!input) return;
  const item = guideMentionState.items[index];
  if (!item) return;
  const before = input.value.slice(0, guideMentionState.tokenStart);
  const after = input.value.slice(guideMentionState.tokenEnd);
  const insertion = `${item.value} `;
  const nextValue = `${before}${insertion}${after}`;
  input.value = nextValue;
  const caret = before.length + insertion.length;
  input.focus();
  input.setSelectionRange(caret, caret);
  closeGuideMentionMenu();
}

function renderGuideMentionMenu() {
  const menu = document.getElementById("guideMentionMenu");
  if (!menu) return;
  if (!guideMentionState.open || guideMentionState.items.length === 0) {
    menu.classList.add("hidden");
    menu.innerHTML = "";
    return;
  }
  menu.classList.remove("hidden");
  menu.innerHTML = guideMentionState.items
    .map((item, index) => {
      const active = index === guideMentionState.activeIndex;
      return `<li class="guide-mention-item${active ? " active" : ""}" role="option" aria-selected="${active ? "true" : "false"}" data-mention-index="${index}">
        <span class="guide-mention-label">${escapeHtml(item.label)}</span>
      </li>`;
    })
    .join("");
  menu.querySelectorAll("[data-mention-index]").forEach((row) => {
    row.addEventListener("mousedown", (event) => {
      event.preventDefault();
      const index = Number(row.getAttribute("data-mention-index"));
      if (Number.isNaN(index)) return;
      applyGuideMentionSuggestion(index);
    });
  });
}

function refreshGuideMentionMenu() {
  const input = document.getElementById("guideInput");
  if (!input) return;
  const caret = Number.isInteger(input.selectionStart) ? input.selectionStart : input.value.length;
  const suggestion = buildGuideMentionSuggestions(input.value, caret);
  if (!suggestion || suggestion.items.length === 0) {
    closeGuideMentionMenu();
    return;
  }
  guideMentionState.open = true;
  guideMentionState.activeIndex = 0;
  guideMentionState.tokenStart = suggestion.tokenStart;
  guideMentionState.tokenEnd = suggestion.tokenEnd;
  guideMentionState.items = suggestion.items;
  renderGuideMentionMenu();
}

function handleGuideMentionMenuKeydown(event) {
  if (!guideMentionState.open || guideMentionState.items.length === 0) return false;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    guideMentionState.activeIndex = (guideMentionState.activeIndex + 1) % guideMentionState.items.length;
    renderGuideMentionMenu();
    return true;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    guideMentionState.activeIndex = (guideMentionState.activeIndex - 1 + guideMentionState.items.length) % guideMentionState.items.length;
    renderGuideMentionMenu();
    return true;
  }
  if (event.key === "Enter" || event.key === "Tab") {
    event.preventDefault();
    applyGuideMentionSuggestion(guideMentionState.activeIndex);
    return true;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeGuideMentionMenu();
    return true;
  }
  return false;
}

function buildGuideModelFailedPrompt() {
  return {
    ja: "Guideモデルの応答取得に失敗しました。Settingsの接続情報を確認してください。",
    en: "Failed to get response from Guide model. Check model settings and connectivity.",
  };
}

async function sendGuideMessage() {
  if (guideSendInFlight) return;
  const input = document.getElementById("guideInput");
  if (!input) return;
  const text = input.value.trim();
  if (!text) {
    setMessage("MSG-PPH-1001");
    return;
  }
  const focusCommandResult = handleGuideFocusCommand(text);
  if (focusCommandResult.handled) {
    input.value = "";
    closeGuideMentionMenu();
    return;
  }
  const modelInput = buildGuideModelUserText(text);
  const guidePlanningIntentApi = resolveGuidePlanningIntentApi();
  const assistEnabled = isGuideControllerAssistEnabled();
  const planningIntent = assistEnabled && guidePlanningIntentApi
    ? guidePlanningIntentApi.detectPlanningIntent(modelInput.modelUserText)
    : { requested: false, cue: "none" };
  const planningReadiness = assistEnabled && guidePlanningIntentApi && typeof guidePlanningIntentApi.detectPlanningReadiness === "function"
    ? guidePlanningIntentApi.detectPlanningReadiness(modelInput.modelUserText, planningIntent)
    : { ready: false, cue: "none" };
  const guideState = resolveGuideModelStateWithFallback();
  if (!guideState.ready) {
    guideMessages.push({
      timestamp: formatNow().slice(11),
      sender: "system",
      text: buildGuideModelRequiredPromptWithFallback(),
    });
    renderGuideChat();
    setMessage(guideState.errorCode || "MSG-PPH-1010");
    setWorkspaceTab("settings");
    return;
  }
  const timestamp = formatNow().slice(11);
  guideMessages.push({
    timestamp,
    sender: "you",
    text: { ja: text, en: text },
  });
  guideSendInFlight = true;
  setGuideComposerBusy(true);
  try {
    const contextBuild = await buildGuideContextWithFallback(modelInput.modelUserText);
    const modelReply = await requestGuideModelReplyWithFallback(modelInput.modelUserText, guideState, contextBuild);
    if (!modelReply && hasPalpalCoreRuntimeApi()) {
      guideMessages.push({
        timestamp: formatNow().slice(11),
        sender: "system",
        text: buildGuideModelFailedPrompt(),
      });
      renderGuideChat();
      setMessage("MSG-PPH-1002");
      return;
    }
    const parsedPlanResponse = parseGuidePlanResponseWithFallback(modelReply?.text || "", {
      planningIntent: planningIntent.cue,
      planningReadiness: planningReadiness.cue,
    });
    const replyText = parsedPlanResponse?.ok
      ? parsedPlanResponse.reply
      : "";
    const nextReply = modelReply
      ? buildGuideLiveModelReply(modelReply, replyText)
      : buildGuideReplyWithFallback(text, guideState);
    guideMessages.push({
      timestamp: formatNow().slice(11),
      sender: "guide",
      text: nextReply,
    });
    let createdCount = 0;
    if (parsedPlanResponse?.ok && parsedPlanResponse.status === "plan_ready" && parsedPlanResponse.plan) {
      const created = await createPlannedTasksFromGuidePlan(parsedPlanResponse.plan);
      createdCount = Number(created?.created || 0);
    }
    input.value = "";
    closeGuideMentionMenu();
    renderGuideChat();
    setMessage(createdCount > 0 ? "MSG-PPH-0001" : "MSG-PPH-0009");
  } finally {
    guideSendInFlight = false;
    setGuideComposerBusy(false);
  }
}

function statusBadgeClass(status) {
  if (status === "to_gate") return "status-badge-attn";
  if (status === "rejected") return "status-badge-danger";
  return "status-badge-muted";
}

function taskActions(task) {
  const buttons = [
    `<button class="btn btn-xs btn-outline" data-action="detail" data-task-id="${task.id}">${tDyn("detail")}</button>`,
  ];
  if (task.status === "assigned") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="start" data-task-id="${task.id}">${tDyn("start")}</button>`
    );
  }
  if (task.status === "in_progress") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="submit" data-task-id="${task.id}">${tDyn("submit")}</button>`
    );
  }
  if (task.status === "to_gate") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="gate" data-task-id="${task.id}">${tDyn("gate")}</button>`
    );
  }
  if (task.status === "rejected") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-action="resubmit" data-task-id="${task.id}">${tDyn("resubmit")}</button>`
    );
  }
  return buttons.join("");
}

function renderTaskBoard() {
  const ul = document.getElementById("taskBoard");
  if (tasks.length === 0) {
    ul.innerHTML = `<li class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${tDyn("noTask")}</li>`;
    return;
  }
  ul.innerHTML = tasks
    .map((task) => {
      const isSelected = selectedTaskId === task.id;
      const selected = isSelected
        ? "ring-2 ring-primary/40 border-primary/50"
        : "border-base-300";
      const statusText = tUi(STATUS_UI_ID[task.status]);
      const gateProfile = resolveGateProfileForTarget(task);
      const gateProfileId = normalizeText(gateProfile?.id);
      return `<li data-task-row="${task.id}" data-board-kind="task" data-board-status="${task.status}" data-board-state="${isSelected ? "selected" : "idle"}" data-gate-profile-id="${escapeHtml(gateProfileId)}" data-gate-decision="${escapeHtml(task.gateResult?.decision || "none")}" class="task-board-row rounded-box border ${selected} bg-base-100 p-3 shadow-sm mb-3">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold">${task.title}</span>
          <span class="badge ${statusBadgeClass(task.status)} badge-sm">${statusText}</span>
        </div>
        <div class="mt-2 grid gap-1 text-xs text-base-content/65">
          <span>${task.id} / ${task.palId}</span>
          <span>updated_at: ${task.updatedAt}</span>
          <span>${escapeHtml(gateProfileSummaryText(task))}</span>
          <span>gate: ${task.decisionSummary}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">${taskActions(task)}</div>
      </li>`;
    })
    .join("");
}

function jobActions(job) {
  const buttons = [];
  if (job.status === "assigned") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="start" data-job-id="${job.id}">${tDyn("start")}</button>`
    );
  }
  if (job.status === "in_progress") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="submit" data-job-id="${job.id}">${tDyn("submit")}</button>`
    );
  }
  if (job.status === "to_gate") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="gate" data-job-id="${job.id}">${tDyn("gate")}</button>`
    );
  }
  if (job.status === "rejected") {
    buttons.push(
      `<button class="btn btn-xs btn-primary" data-job-action="resubmit" data-job-id="${job.id}">${tDyn("resubmit")}</button>`
    );
  }
  return buttons.join("");
}

function renderJobBoard() {
  const ul = document.getElementById("jobBoard");
  if (!ul) return;
  if (jobs.length === 0) {
    ul.innerHTML = `<li class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${tDyn("noJob")}</li>`;
    return;
  }
  ul.innerHTML = jobs
    .map((job) => {
      const statusText = tUi(STATUS_UI_ID[job.status]);
      const hasLastRun = normalizeText(job.lastRunAt) && normalizeText(job.lastRunAt) !== "-";
      const gateProfile = resolveGateProfileForTarget(job);
      const gateProfileId = normalizeText(gateProfile?.id);
      return `<li data-job-row="${job.id}" data-board-kind="job" data-board-status="${job.status}" data-last-run-state="${hasLastRun ? "recorded" : "empty"}" data-gate-profile-id="${escapeHtml(gateProfileId)}" data-gate-decision="${escapeHtml(job.gateResult?.decision || "none")}" class="job-board-row cron-board-row rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold">${escapeHtml(job.title)}</span>
          <span class="badge ${statusBadgeClass(job.status)} badge-sm">${statusText}</span>
        </div>
        <div class="cron-meta mt-2 grid gap-1 text-xs text-base-content/65">
          <span class="cron-id-row">${escapeHtml(job.id)} / ${escapeHtml(job.palId)}</span>
          <span class="cron-schedule-row">${escapeHtml(tDyn("schedule"))}: ${escapeHtml(job.schedule)}</span>
          <span class="cron-last-run-row">${escapeHtml(tDyn("lastRun"))}: ${escapeHtml(job.lastRunAt)}</span>
          <span class="cron-gate-row">${escapeHtml(gateProfileSummaryText(job))}</span>
          <span class="cron-instruction-row">${escapeHtml(tDyn("instruction"))}: ${escapeHtml(job.instruction)}</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">${jobActions(job)}</div>
      </li>`;
    })
    .join("");
}

function eventSummaryText(event) {
  if (!event || typeof event !== "object") return "";
  if (!event.summary || typeof event.summary !== "object") return "";
  return String(event.summary[locale] || event.summary.ja || event.summary.en || "");
}

function filteredEvents() {
  const query = String(eventSearchQuery || "").trim().toLowerCase();
  return events.filter((event) => {
    if (eventTypeFilter !== "all" && event.eventType !== eventTypeFilter) return false;
    if (!query) return true;
    const fields = [
      event.id,
      event.timestamp,
      event.eventType,
      event.targetId,
      event.result,
      eventSummaryText(event),
    ];
    const haystack = fields.join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderEventFilterControls(totalFiltered, pageCount) {
  const toolbar = document.querySelector(".event-toolbar");
  const searchInput = document.getElementById("eventSearchInput");
  const typeFilter = document.getElementById("eventTypeFilter");
  const pager = document.querySelector(".event-pager-controls");
  const prevBtn = document.getElementById("eventPrevPage");
  const nextBtn = document.getElementById("eventNextPage");
  const pageInfo = document.getElementById("eventPageInfo");
  const hasFilter = Boolean(String(eventSearchQuery || "").trim()) || eventTypeFilter !== "all";

  if (toolbar) {
    toolbar.setAttribute("data-event-toolbar-state", hasFilter ? "filtered" : "idle");
  }

  if (searchInput) {
    searchInput.placeholder = tDyn("eventSearchPlaceholder");
    if (searchInput.value !== eventSearchQuery) {
      searchInput.value = eventSearchQuery;
    }
  }

  if (typeFilter) {
    typeFilter.innerHTML = EVENT_TYPE_FILTER_KEYS.map((key) => {
      const textKey = key === "all"
        ? "eventTypeAll"
        : `eventType${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      return `<option value="${key}">${escapeHtml(tDyn(textKey))}</option>`;
    }).join("");
    typeFilter.value = EVENT_TYPE_FILTER_KEYS.includes(eventTypeFilter) ? eventTypeFilter : "all";
  }

  if (prevBtn) {
    prevBtn.textContent = tDyn("pagePrev");
    prevBtn.disabled = eventPage <= 1 || totalFiltered === 0;
  }
  if (nextBtn) {
    nextBtn.textContent = tDyn("pageNext");
    nextBtn.disabled = eventPage >= pageCount || totalFiltered === 0;
  }
  if (pageInfo) {
    const safeTotal = Math.max(pageCount, 1);
    const current = totalFiltered === 0 ? 0 : eventPage;
    pageInfo.textContent = `${current} / ${safeTotal}`;
    pageInfo.setAttribute("data-page-current", String(current));
    pageInfo.setAttribute("data-page-total", String(safeTotal));
  }
  if (pager) {
    const pageState = totalFiltered === 0
      ? "empty"
      : (pageCount > 1 ? "paged" : "single");
    pager.setAttribute("data-event-page-state", pageState);
  }
}

function renderEventLog() {
  const ul = document.getElementById("eventLog");
  if (!ul) return;
  const filtered = filteredEvents();
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / EVENT_LOG_PAGE_SIZE));
  eventPage = Math.min(Math.max(1, eventPage), pageCount);
  const start = (eventPage - 1) * EVENT_LOG_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + EVENT_LOG_PAGE_SIZE);

  renderEventFilterControls(total, pageCount);

  if (pageItems.length === 0) {
    ul.innerHTML = `<li class="mb-2 rounded-box border border-base-300 bg-base-100 p-3 text-sm">${escapeHtml(tDyn("eventNoMatch"))}</li>`;
    return;
  }

  ul.innerHTML = pageItems
    .map(
      (e) => `<li class="event-log-row mb-2 rounded-box border border-base-300 bg-base-100 p-3" data-event-type="${escapeHtml(e.eventType)}" data-event-result="${escapeHtml(e.result)}">
      <div class="event-log-meta text-xs text-base-content/60">${e.timestamp} / ${e.eventType} / ${e.targetId} / ${e.result}</div>
      <div class="event-log-summary mt-1 text-sm">${escapeHtml(eventSummaryText(e))}</div>
    </li>`
    )
    .join("");
}

function gateReasonTemplateLabel(template) {
  if (!template || typeof template !== "object") return "";
  if (locale === "en") return String(template.en || template.ja || "");
  return String(template.ja || template.en || "");
}

function appendGateReasonTemplateById(templateId) {
  const template = GATE_REASON_TEMPLATES.find((item) => item.id === templateId);
  if (!template) return;
  const input = document.getElementById("gateReason");
  if (!input) return;
  const line = gateReasonTemplateLabel(template);
  if (!line) return;
  const current = input.value.trim();
  input.value = current ? `${current}\n- ${line}` : `- ${line}`;
  input.focus();
}

function renderGateReasonTemplates() {
  const labelEl = document.getElementById("gateReasonTemplateLabel");
  const listEl = document.getElementById("gateReasonTemplateList");
  if (labelEl) labelEl.textContent = tDyn("gateReasonTemplateLabel");
  if (!listEl) return;
  listEl.innerHTML = GATE_REASON_TEMPLATES.map((template) => {
    const label = escapeHtml(gateReasonTemplateLabel(template));
    return `<button type="button" class="btn btn-xs btn-outline" data-gate-template-id="${template.id}">${label}</button>`;
  }).join("");
}

function focusBoardRow(targetKind, targetId) {
  const selector = targetKind === "job"
    ? `[data-job-row="${targetId}"]`
    : `[data-task-row="${targetId}"]`;
  const row = document.querySelector(selector);
  if (!row) return;
  row.classList.add("board-row-focus");
  row.scrollIntoView({ block: "nearest", behavior: "smooth" });
  window.setTimeout(() => {
    row.classList.remove("board-row-focus");
  }, 1200);
}

function navigateToResubmitTarget(targetId, targetKind) {
  if (targetKind === "task") {
    selectedTaskId = targetId;
    setWorkspaceTab("task");
  } else {
    setWorkspaceTab("job");
  }
  rerenderAll();
  focusBoardRow(targetKind, targetId);
}

function palStatusBadgeClass(status) {
  if (status === "paused") return "status-badge-attn";
  return "status-badge-muted";
}

function palAvatarFaceMarkup(role) {
  const normalizedRole = normalizePalRole(role);
  return `<span class="pal-avatar-face pal-avatar-face-${escapeHtml(normalizedRole)}" aria-hidden="true">
    <span class="pal-avatar-eye left"></span>
    <span class="pal-avatar-eye right"></span>
    <span class="pal-avatar-mouth"></span>
  </span>`;
}

function closePalConfigModal() {
  palConfigModalState.open = false;
  palConfigModalState.palId = "";
  const modal = document.getElementById("palConfigModal");
  if (modal) modal.classList.add("hidden");
}

function closeIdentityEditorModal() {
  identityEditorState.open = false;
  identityEditorState.palId = "";
  identityEditorState.fileKind = "soul";
  identityEditorState.loading = false;
  identityEditorState.saving = false;
  identityEditorState.text = "";
  identityEditorState.identity = null;
  const modal = document.getElementById("identityEditorModal");
  if (modal) modal.classList.add("hidden");
}

function openPalConfigModal(palId) {
  const normalizedPalId = normalizeText(palId);
  if (!normalizedPalId) return;
  const exists = palProfiles.some((pal) => pal.id === normalizedPalId);
  if (!exists) {
    setMessage("MSG-PPH-1004");
    return;
  }
  palConfigModalState.open = true;
  palConfigModalState.palId = normalizedPalId;
  renderPalList();
}

async function openIdentityEditorModal(palId, requestedFileKind) {
  const normalizedPalId = normalizeText(palId);
  const pal = palProfiles.find((item) => item.id === normalizedPalId);
  if (!pal) {
    setMessage("MSG-PPH-1004");
    return;
  }
  const secondary = resolveIdentitySecondaryDescriptor(pal.role);
  const fileKind = requestedFileKind === "soul" ? "soul" : secondary.fileKind;
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi) {
    setMessage("MSG-PPH-1003");
    return;
  }
  const requestSeq = identityEditorState.requestSeq + 1;
  identityEditorState.requestSeq = requestSeq;
  identityEditorState.open = true;
  identityEditorState.palId = normalizedPalId;
  identityEditorState.fileKind = fileKind;
  identityEditorState.loading = true;
  identityEditorState.saving = false;
  identityEditorState.text = "";
  identityEditorState.identity = null;
  renderIdentityEditorModal();
  try {
    const agentInput = resolveIdentityEditorAgentInput(pal);
    let identity = await identityApi.load(agentInput);
    if (!identity || !identity.hasIdentityFiles) {
      identity = await identityApi.save({
        ...agentInput,
        locale,
        initializeTemplates: true,
        enabledSkillIds: Array.isArray(pal.skills) ? pal.skills : [],
      });
    }
    if (identityEditorState.requestSeq !== requestSeq) return;
    identityEditorState.identity = identity;
    identityEditorState.text = fileKind === "soul"
      ? String(identity?.soul || "")
      : (fileKind === "rubric" ? String(identity?.rubric || "") : String(identity?.role || ""));
  } catch (error) {
    if (identityEditorState.requestSeq !== requestSeq) return;
    setMessage("MSG-PPH-1003");
  } finally {
    if (identityEditorState.requestSeq !== requestSeq) return;
    identityEditorState.loading = false;
    renderIdentityEditorModal();
  }
}

function renderIdentityEditorModal() {
  const modalEl = document.getElementById("identityEditorModal");
  const titleEl = document.getElementById("identityEditorTitle");
  const metaEl = document.getElementById("identityEditorMeta");
  const statusEl = document.getElementById("identityEditorStatus");
  const textareaEl = document.getElementById("identityEditorTextarea");
  const saveEl = document.getElementById("identityEditorSave");
  const cancelEl = document.getElementById("identityEditorCancel");
  if (!modalEl || !titleEl || !metaEl || !statusEl || !textareaEl || !saveEl || !cancelEl) return;

  const pal = palProfiles.find((item) => item.id === identityEditorState.palId) || null;
  if (!identityEditorState.open || !pal) {
    modalEl.classList.add("hidden");
    return;
  }

  const secondary = resolveIdentitySecondaryDescriptor(pal.role);
  const fileName = identityEditorState.fileKind === "soul" ? "SOUL.md" : secondary.fileName;
  const isJa = locale === "ja";
  titleEl.textContent = `${pal.displayName} / ${fileName}`;
  metaEl.textContent = isJa
    ? `${palRoleLabel(pal.role)} の ${fileName} を編集`
    : `Edit ${fileName} for ${palRoleLabel(pal.role)}`;
  statusEl.textContent = identityEditorState.loading
    ? (isJa ? "読み込み中..." : "Loading...")
    : (identityEditorState.saving ? (isJa ? "保存中..." : "Saving...") : "");
  textareaEl.value = identityEditorState.text;
  textareaEl.disabled = identityEditorState.loading || identityEditorState.saving;
  saveEl.textContent = isJa ? "保存" : "Save";
  cancelEl.textContent = isJa ? "キャンセル" : "Cancel";
  saveEl.disabled = identityEditorState.loading || identityEditorState.saving;
  cancelEl.disabled = identityEditorState.saving;

  textareaEl.oninput = () => {
    identityEditorState.text = textareaEl.value;
  };
  cancelEl.onclick = () => {
    closeIdentityEditorModal();
  };
  saveEl.onclick = async () => {
    if (identityEditorState.loading || identityEditorState.saving) return;
    const currentPal = palProfiles.find((item) => item.id === identityEditorState.palId) || null;
    const identityApi = resolveAgentIdentityApi();
    if (!currentPal || !identityApi) {
      setMessage("MSG-PPH-1003");
      return;
    }
    identityEditorState.saving = true;
    renderIdentityEditorModal();
    try {
      const currentIdentity = identityEditorState.identity || await identityApi.load(resolveIdentityEditorAgentInput(currentPal));
      const payload = {
        ...resolveIdentityEditorAgentInput(currentPal),
        locale,
        soul: identityEditorState.fileKind === "soul"
          ? identityEditorState.text
          : String(currentIdentity?.soul || ""),
        role: identityEditorState.fileKind === "role"
          ? identityEditorState.text
          : String(currentIdentity?.role || ""),
        rubric: identityEditorState.fileKind === "rubric"
          ? identityEditorState.text
          : String(currentIdentity?.rubric || ""),
        enabledSkillIds: Array.isArray(currentPal.skills) ? currentPal.skills : [],
      };
      const saved = await identityApi.save(payload);
      identityEditorState.identity = saved;
      identityEditorState.text = identityEditorState.fileKind === "soul"
        ? String(saved?.soul || "")
        : (identityEditorState.fileKind === "rubric" ? String(saved?.rubric || "") : String(saved?.role || ""));
      setMessage("MSG-PPH-0007");
      closeIdentityEditorModal();
    } catch (error) {
      setMessage("MSG-PPH-1003");
      identityEditorState.saving = false;
      renderIdentityEditorModal();
    }
  };

  modalEl.classList.remove("hidden");
}

function renderPalConfigModal({
  labels,
  availableModels,
  availableTools,
  availableSkills,
  hasModelOptions,
  hasToolOptions,
}) {
  const modalEl = document.getElementById("palConfigModal");
  const titleEl = document.getElementById("palConfigModalTitle");
  const bodyEl = document.getElementById("palConfigModalBody");
  const saveBtn = document.getElementById("palConfigSave");
  const deleteBtn = document.getElementById("palConfigDelete");
  if (!modalEl || !titleEl || !bodyEl || !saveBtn || !deleteBtn) return;

  saveBtn.textContent = labels.save;
  deleteBtn.textContent = labels.deletePal;

  const pal = palProfiles.find((item) => item.id === palConfigModalState.palId);
  if (!palConfigModalState.open || !pal) {
    modalEl.classList.add("hidden");
    bodyEl.innerHTML = "";
    titleEl.textContent = labels.modalTitleDefault;
    saveBtn.removeAttribute("data-pal-save-id");
    deleteBtn.removeAttribute("data-pal-delete-id");
    saveBtn.onclick = null;
    deleteBtn.onclick = null;
    return;
  }

  const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
  const selectedModel = hasModelOptions ? (pal.models[0] || availableModels[0] || "") : "";
  const selectedTool = hasToolOptions ? (pal.cliTools[0] || availableTools[0] || "") : "";
  const roleSelectableSkills = allowedSkillIdsForRole(pal.role)
    .filter((skillId) => availableSkills.includes(skillId));
  const hasRoleSkillOptions = roleSelectableSkills.length > 0;
  const selectedSkills = runtimeKind === "model" && Array.isArray(pal.skills)
    ? pal.skills
      .map((skillId) => normalizeSkillId(skillId))
      .filter((skillId) => roleSelectableSkills.includes(skillId))
    : [];

  const buildRuntimeTargetOptions = (kind, preferredValue = "") => {
    const source = kind === "model" ? availableModels : availableTools;
    const emptyLabel = kind === "model" ? labels.noModels : labels.noTools;
    const targetValue = source.includes(preferredValue) ? preferredValue : (source[0] || "");
    if (source.length === 0) {
      return {
        html: `<option value="" selected>${escapeHtml(emptyLabel)}</option>`,
        value: "",
      };
    }
    return {
      html: source
        .map((item) => `<option value="${escapeHtml(item)}"${item === targetValue ? " selected" : ""}>${escapeHtml(item)}</option>`)
        .join(""),
      value: targetValue,
    };
  };

  const runtimeTargetLabel = runtimeKind === "model"
    ? labels.runtimeTargetModel
    : labels.runtimeTargetTool;
  const runtimeTargetOptions = buildRuntimeTargetOptions(
    runtimeKind,
    runtimeKind === "model" ? selectedModel : selectedTool
  );
  const runtimeTargetDisabled = runtimeKind === "model"
    ? (!hasModelOptions ? " disabled" : "")
    : (!hasToolOptions ? " disabled" : "");

  const runtimeOptions = `<option value="model"${runtimeKind === "model" ? " selected" : ""}>${labels.runtimeModel}</option>
    <option value="tool"${runtimeKind === "tool" ? " selected" : ""}>${labels.runtimeTool}</option>`;

  const skillOptions = hasRoleSkillOptions
    ? roleSelectableSkills
      .map((skillId) => {
        const skill = skillById(skillId);
        const checked = selectedSkills.includes(skillId) ? " checked" : "";
        const disabled = runtimeKind === "model" ? "" : " disabled";
        const skillLabel = skill?.name || skillId;
        const skillDescription = skill?.description || "";
        return `<label class="pal-skill-item">
          <input type="checkbox" class="checkbox checkbox-sm" data-pal-skill-checkbox="${escapeHtml(pal.id)}" value="${escapeHtml(skillId)}"${checked}${disabled} />
          <span class="pal-skill-text">
            <span class="text-xs font-medium">${escapeHtml(skillLabel)}</span>
            <span class="text-[11px] text-base-content/55">${escapeHtml(skillDescription)}</span>
          </span>
        </label>`;
      })
      .join("")
    : `<span class="text-xs text-base-content/60">${escapeHtml(labels.noSkills)}</span>`;
  const secondaryIdentity = resolveIdentitySecondaryDescriptor(pal.role);
  const secondaryButtonLabel = `${labels.editSecondary} (${secondaryIdentity.label})`;

  titleEl.textContent = `${pal.displayName} / ${palRoleLabel(pal.role)}`;
  bodyEl.innerHTML = `<div class="pal-card">
    <div class="pal-category">
      <div class="pal-category-title">${labels.categoryName}</div>
      <label class="field">
        <span class="label-text text-xs text-base-content/70">${labels.name}</span>
        <input type="text" class="input input-bordered input-sm" data-pal-name-input="${escapeHtml(pal.id)}" value="${escapeHtml(pal.displayName)}" />
      </label>
    </div>

    <div class="pal-category">
      <div class="pal-category-title">${labels.categoryRuntime}</div>
      <div class="pal-runtime-row">
        <label class="field">
          <span class="label-text text-xs text-base-content/70">${labels.runtimeType}</span>
          <select class="select select-bordered select-sm" data-pal-runtime-select="${escapeHtml(pal.id)}">${runtimeOptions}</select>
        </label>
        <label class="field">
          <span id="palConfigRuntimeTargetLabel" class="label-text text-xs text-base-content/70">${escapeHtml(runtimeTargetLabel)}</span>
          <select class="select select-bordered select-sm" data-pal-runtime-target-select="${escapeHtml(pal.id)}"${runtimeTargetDisabled}>${runtimeTargetOptions.html}</select>
        </label>
      </div>
    </div>

    <div class="pal-category">
      <div class="pal-category-title">${labels.categorySkills}</div>
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs text-base-content/50">${escapeHtml(labels.skillsModelOnly)}</span>
      </div>
      <div class="pal-skill-grid">${skillOptions}</div>
    </div>

    <div class="pal-category">
      <div class="pal-category-title">${escapeHtml(labels.categoryIdentity)}</div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-sm btn-outline" data-pal-edit-identity="${escapeHtml(pal.id)}:soul">${escapeHtml(labels.editSoul)}</button>
        <button type="button" class="btn btn-sm btn-outline" data-pal-edit-identity="${escapeHtml(pal.id)}:${escapeHtml(secondaryIdentity.fileKind)}">${escapeHtml(secondaryButtonLabel)}</button>
      </div>
    </div>
  </div>`;

  const nameInput = bodyEl.querySelector(`[data-pal-name-input="${pal.id}"]`);
  const runtimeSelect = bodyEl.querySelector(`[data-pal-runtime-select="${pal.id}"]`);
  const runtimeTargetSelect = bodyEl.querySelector(`[data-pal-runtime-target-select="${pal.id}"]`);
  const runtimeTargetLabelEl = document.getElementById("palConfigRuntimeTargetLabel");
  const skillCheckboxes = bodyEl.querySelectorAll(`[data-pal-skill-checkbox="${pal.id}"]`);
  const identityButtons = bodyEl.querySelectorAll(`[data-pal-edit-identity^="${pal.id}:"]`);

  const applyRuntimeModeUi = () => {
    if (!runtimeSelect || !runtimeTargetSelect) return;
    const mode = normalizePalRuntimeKind(runtimeSelect.value);
    const nextLabel = mode === "model" ? labels.runtimeTargetModel : labels.runtimeTargetTool;
    const targetState = buildRuntimeTargetOptions(mode, runtimeTargetSelect.value);
    runtimeTargetSelect.innerHTML = targetState.html;
    runtimeTargetSelect.value = targetState.value;
    runtimeTargetSelect.disabled = mode === "model" ? !hasModelOptions : !hasToolOptions;
    if (runtimeTargetLabelEl) runtimeTargetLabelEl.textContent = nextLabel;

    const skillsDisabled = mode !== "model";
    skillCheckboxes.forEach((checkbox) => {
      if (skillsDisabled) checkbox.checked = false;
      checkbox.disabled = skillsDisabled;
    });
  };

  if (runtimeSelect) {
    runtimeSelect.onchange = () => {
      applyRuntimeModeUi();
    };
  }
  identityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const payload = normalizeText(button.getAttribute("data-pal-edit-identity"));
      const fileKind = payload.split(":")[1] || "soul";
      void openIdentityEditorModal(pal.id, fileKind);
    });
  });

  const canDelete = canDeletePalProfileWithFallback(pal.id);
  saveBtn.setAttribute("data-pal-save-id", pal.id);
  deleteBtn.setAttribute("data-pal-delete-id", pal.id);
  deleteBtn.disabled = !canDelete;
  deleteBtn.onclick = () => {
    if (!canDeletePalProfileWithFallback(pal.id)) {
      setMessage("MSG-PPH-1006");
      return;
    }
    const index = palProfiles.findIndex((item) => item.id === pal.id);
    if (index < 0) {
      setMessage("MSG-PPH-1004");
      return;
    }
    palProfiles.splice(index, 1);
    syncWorkspaceAgentSelection();
    writePalProfilesSnapshotWithFallback();
    setMessage("MSG-PPH-0007");
    closePalConfigModal();
    rerenderAll();
  };

  saveBtn.onclick = () => {
    const nextName = nameInput ? nameInput.value.trim() : "";
    const nextRuntime = runtimeSelect
      ? normalizePalRuntimeKind(runtimeSelect.value)
      : normalizePalRuntimeKind(pal.runtimeKind);
    const nextRuntimeTarget = runtimeTargetSelect ? runtimeTargetSelect.value : "";
    const requestedSkillIds = Array.from(skillCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => normalizeSkillId(checkbox.value))
      .filter((skillId, index, list) => skillId && list.indexOf(skillId) === index);

    if (!nextName) {
      setMessage("MSG-PPH-1001");
      return;
    }

    const runtimeResult = validatePalRuntimeSelectionWithFallback({
      runtimeKind: nextRuntime,
      runtimeTarget: nextRuntimeTarget,
      availableModels,
      availableTools,
      requestedSkillIds,
      allowedSkillIds: roleSelectableSkills,
    });
    if (!runtimeResult.ok) {
      setMessage(runtimeResult.errorCode || "MSG-PPH-1001");
      return;
    }

    const updatedPal = applyPalRuntimeSelectionWithFallback({
      pal,
      displayName: nextName,
      runtimeKind: runtimeResult.runtimeKind,
      runtimeResult,
      resolveProviderForModel: (modelName) =>
        settingsState.registeredModels.find((model) => model.name === modelName)?.provider || "",
    });
    Object.assign(pal, updatedPal);
    syncWorkspaceAgentSelection();
    writePalProfilesSnapshotWithFallback();

    setMessage("MSG-PPH-0007");
    closePalConfigModal();
    rerenderAll();
  };

  modalEl.classList.remove("hidden");
  applyRuntimeModeUi();
}

function renderPalList() {
  const ul = document.getElementById("palList");
  if (!ul) return;
  syncSettingsModelsFromRegistry();
  syncPalProfilesRegistryRefs();

  const availableModels = settingsState.registeredModels.map((model) => model.name);
  const availableTools = [...settingsState.registeredTools];
  const availableSkills = [...settingsState.registeredSkills];
  const hasModelOptions = availableModels.length > 0;
  const hasToolOptions = availableTools.length > 0;

  const labels = locale === "ja"
    ? {
      role: "タイプ",
      runtime: "使用ランタイム",
      runtimeModel: "Model",
      runtimeTool: "CLI",
      runtimeType: "実行方式",
      runtimeTargetModel: "LLMモデル",
      runtimeTargetTool: "CLIツール",
      categoryName: "名前",
      categoryRuntime: "Runtime",
      categorySkills: "Skills",
      categoryIdentity: "Identity Files",
      name: "表示名",
      save: "保存",
      addGuide: "Guideを追加",
      addGate: "Gateを追加",
      addPal: "Palを追加",
      setActiveGuide: "Guideに切替",
      setDefaultGate: "Gateに設定",
      activeGuideBadge: "Active Guide",
      defaultGateBadge: "Default Gate",
      editPal: "設定",
      editSoul: "SOULを編集",
      editSecondary: "役割ファイルを編集",
      deletePal: "削除",
      addHint: "Settingsで登録済みのLLMモデル / CLIツール / Skillsのみ利用できます",
      noModels: "利用可能なLLMモデルがありません",
      noTools: "利用可能なCLIツールがありません",
      noProfiles: "Palがありません。追加してください。",
      noSkills: "利用可能なSkillsがありません",
      noSkillsCompact: "スキルなし",
      skillsModelOnly: "Skillsはモデル実行時のみ有効です",
      modalTitleDefault: "Pal設定",
    }
    : {
      role: "Type",
      runtime: "Runtime",
      runtimeModel: "Model",
      runtimeTool: "CLI",
      runtimeType: "Runtime Type",
      runtimeTargetModel: "LLM Model",
      runtimeTargetTool: "CLI Tool",
      categoryName: "Name",
      categoryRuntime: "Runtime",
      categorySkills: "Skills",
      categoryIdentity: "Identity Files",
      name: "Name",
      save: "Save",
      addGuide: "Add Guide",
      addGate: "Add Gate",
      addPal: "Add Pal",
      setActiveGuide: "Use as Guide",
      setDefaultGate: "Use as Gate",
      activeGuideBadge: "Active Guide",
      defaultGateBadge: "Default Gate",
      editPal: "Settings",
      editSoul: "Edit SOUL",
      editSecondary: "Edit File",
      deletePal: "Delete",
      addHint: "Only models / CLI tools / skills registered in Settings can be used",
      noModels: "No LLM models available",
      noTools: "No CLI tools available",
      noProfiles: "No Pal profiles. Add one.",
      noSkills: "No skills available",
      noSkillsCompact: "No skills",
      skillsModelOnly: "Skills are enabled only in model runtime",
      modalTitleDefault: "Pal Settings",
    };

  const addDisabled = !hasModelOptions && !hasToolOptions;
  const toolbar = `<li class="pal-toolbar rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3">
    <div class="text-xs text-base-content/65">${labels.addHint}</div>
    <div class="flex flex-wrap gap-2 mt-2">
      <button type="button" id="palAddGuideProfile" class="btn btn-sm btn-outline"${addDisabled ? " disabled" : ""}>${labels.addGuide}</button>
      <button type="button" id="palAddGateProfile" class="btn btn-sm btn-outline"${addDisabled ? " disabled" : ""}>${labels.addGate}</button>
      <button type="button" id="palAddProfile" class="btn btn-sm btn-outline"${addDisabled ? " disabled" : ""}>${labels.addPal}</button>
    </div>
  </li>`;

  const bindAddProfileButtons = () => {
    const bindAdd = (selector, role) => {
      const button = ul.querySelector(selector);
      if (!button) return;
      button.addEventListener("click", async () => {
        if (!hasModelOptions && !hasToolOptions) {
          setMessage("MSG-PPH-1001");
          return;
        }
        const defaultModel = availableModels[0];
        const matchedModel = settingsState.registeredModels.find((model) => model.name === defaultModel);
        const defaultProvider = matchedModel?.provider || DEFAULT_PROVIDER_ID;
        const roleAllowedSkills = allowedSkillIdsForRole(role)
          .filter((skillId) => availableSkills.includes(skillId));
        const nextProfile = createPalProfileWithFallback({
          id: createPalIdForRole(role),
          role,
          availableModels,
          availableTools,
          roleAllowedSkills,
          availableSkills,
          defaultProvider,
          displayName: role === "guide" ? "New Guide" : (role === "gate" ? "New Gate" : "New Pal"),
        });
        palProfiles.push(nextProfile);
        syncWorkspaceAgentSelection();
        if (role === "guide" && !workspaceAgentSelection.activeGuideId) {
          workspaceAgentSelection.activeGuideId = nextProfile.id;
        }
        if (role === "gate" && !workspaceAgentSelection.defaultGateId) {
          workspaceAgentSelection.defaultGateId = nextProfile.id;
        }
        try {
          await initializePalIdentityTemplates(nextProfile);
        } catch (error) {
          setMessage("MSG-PPH-1003");
        }
        writePalProfilesSnapshotWithFallback();
        setMessage("MSG-PPH-0007");
        openPalConfigModal(nextProfile.id);
      });
    };

    bindAdd("#palAddGuideProfile", "guide");
    bindAdd("#palAddGateProfile", "gate");
    bindAdd("#palAddProfile", "worker");
  };

  const activeGuideId = workspaceAgentSelection.activeGuideId;
  const defaultGateId = workspaceAgentSelection.defaultGateId;

  if (palProfiles.length === 0) {
    ul.innerHTML = `${toolbar}
      <li id="palEmpty" class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${labels.noProfiles}</li>`;
    bindAddProfileButtons();
    renderPalConfigModal({
      labels,
      availableModels,
      availableTools,
      availableSkills,
      hasModelOptions,
      hasToolOptions,
    });
    return;
  }

  const cards = palProfiles
    .map((pal) => {
      const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
      const selectedModel = hasModelOptions ? (pal.models[0] || availableModels[0]) : "";
      const selectedTool = hasToolOptions ? (pal.cliTools[0] || availableTools[0]) : "";
      const roleSelectableSkills = allowedSkillIdsForRole(pal.role)
        .filter((skillId) => availableSkills.includes(skillId));
      const runtimeTargetValue = runtimeKind === "model" ? selectedModel : selectedTool;

      const selectedSkills = runtimeKind === "model" && Array.isArray(pal.skills)
        ? pal.skills
          .map((skillId) => normalizeSkillId(skillId))
          .filter((skillId) => roleSelectableSkills.includes(skillId))
        : [];

      const runtimeLabel = runtimeKind === "model" ? labels.runtimeModel : labels.runtimeTool;
      const runtimeSummary = runtimeTargetValue
        ? `${runtimeLabel}: ${runtimeTargetValue}`
        : `${runtimeLabel}: -`;
      const skillBadges = selectedSkills.length > 0
        ? selectedSkills
          .map((skillId) => {
            const skillLabel = skillName(skillId);
            return `<span class="badge badge-neutral badge-sm">${escapeHtml(skillLabel)}</span>`;
          })
          .join("")
        : `<span class="badge badge-ghost badge-sm">${escapeHtml(labels.noSkillsCompact)}</span>`;
      const isActiveGuide = pal.role === "guide" && pal.id === activeGuideId;
      const isDefaultGate = pal.role === "gate" && pal.id === defaultGateId;
      const selectionBadge = isActiveGuide
        ? `<span class="badge badge-primary badge-sm">${escapeHtml(labels.activeGuideBadge)}</span>`
        : (isDefaultGate
          ? `<span class="badge badge-primary badge-sm">${escapeHtml(labels.defaultGateBadge)}</span>`
          : "");
      const selectionButton = pal.role === "guide"
        ? `<button type="button" class="btn btn-xs btn-ghost"${isActiveGuide ? " disabled" : ""} data-pal-set-active-guide-id="${escapeHtml(pal.id)}">${escapeHtml(labels.setActiveGuide)}</button>`
        : (pal.role === "gate"
          ? `<button type="button" class="btn btn-xs btn-ghost"${isDefaultGate ? " disabled" : ""} data-pal-set-default-gate-id="${escapeHtml(pal.id)}">${escapeHtml(labels.setDefaultGate)}</button>`
          : "");

      return `<li data-pal-row="${escapeHtml(pal.id)}" data-pal-role="${escapeHtml(pal.role)}" data-guide-active="${isActiveGuide ? "true" : "false"}" data-gate-default="${isDefaultGate ? "true" : "false"}" data-pal-open-id="${escapeHtml(pal.id)}" tabindex="0" role="button" class="rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3 pal-card pal-compact-row">
        <div class="pal-compact-main">
          ${palAvatarFaceMarkup(pal.role)}
          <div class="pal-compact-meta">
            <div class="pal-compact-top">
              <span class="font-semibold">${escapeHtml(pal.displayName)}</span>
              <span class="badge badge-outline badge-sm">${escapeHtml(palRoleLabel(pal.role))}</span>
              <span class="badge ${palStatusBadgeClass(pal.status)} badge-sm">${escapeHtml(pal.status)}</span>
              ${selectionBadge}
            </div>
            <div data-pal-runtime-summary="${escapeHtml(pal.id)}" class="text-xs text-base-content/65">${labels.runtime}: ${escapeHtml(runtimeSummary)}</div>
            <div data-pal-skills-summary="${escapeHtml(pal.id)}" class="pal-models">${skillBadges}</div>
          </div>
        </div>
        <div class="flex flex-wrap justify-end gap-2">
          ${selectionButton}
          <button type="button" class="btn btn-xs btn-outline" data-pal-open-id="${escapeHtml(pal.id)}">${labels.editPal}</button>
        </div>
      </li>`;
    })
    .join("");

  ul.innerHTML = `${toolbar}${cards}`;
  bindAddProfileButtons();

  ul.onclick = (event) => {
    const setGuideTrigger = event.target.closest("[data-pal-set-active-guide-id]");
    if (setGuideTrigger) {
      const palId = normalizeText(setGuideTrigger.getAttribute("data-pal-set-active-guide-id"));
      if (!palId) return;
      workspaceAgentSelection.activeGuideId = palId;
      writePalProfilesSnapshotWithFallback();
      rerenderAll();
      return;
    }
    const setGateTrigger = event.target.closest("[data-pal-set-default-gate-id]");
    if (setGateTrigger) {
      const palId = normalizeText(setGateTrigger.getAttribute("data-pal-set-default-gate-id"));
      if (!palId) return;
      workspaceAgentSelection.defaultGateId = palId;
      writePalProfilesSnapshotWithFallback();
      rerenderAll();
      return;
    }
    const trigger = event.target.closest("[data-pal-open-id]");
    if (!trigger) return;
    const palId = normalizeText(trigger.getAttribute("data-pal-open-id"));
    if (!palId) return;
    openPalConfigModal(palId);
  };

  ul.onkeydown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest("[data-pal-row][data-pal-open-id]");
    if (!row) return;
    event.preventDefault();
    const palId = normalizeText(row.getAttribute("data-pal-open-id"));
    if (!palId) return;
    openPalConfigModal(palId);
  };

  renderPalConfigModal({
    labels,
    availableModels,
    availableTools,
    availableSkills,
    hasModelOptions,
    hasToolOptions,
  });
}

function syncPalProfilesFromSettings() {
  syncSettingsModelsFromRegistry();
  syncPalProfilesRegistryRefs();
  bindGuideToFirstRegisteredModelWithFallback();
  renderPalList();
}

function renderSettingsTab() {
  const root = document.getElementById("settingsTabContent");
  if (!root) return;

  syncSettingsModelsFromRegistry();
  const isJa = locale === "ja";
  const labels = isJa
    ? {
      language: "Language",
      languageItem: "表示言語",
      languageSection: "Language",
      handoffSection: "Execution Loop",
      handoffItem: "Context Handoff Policy",
      handoffHint: "Guide から Worker/Gate へ渡す文脈量を制御します",
      guideAssistItem: "Guide controller assist",
      guideAssistHint: "既定はOFF。ONにすると planning trigger / readiness を controller が補助します",
      handoffMinimal: "Minimal",
      handoffBalanced: "Balanced",
      handoffVerbose: "Verbose",
      modelSection: "モデル / CLI",
      skillCategorySection: "Skills",
      models: "LLM models",
      tools: "CLI tools",
      skillSection: "Model Runtime Skills",
      skillSectionHint: "モデル実行時に利用可能。Palごとに有効化できます",
      installedSkillsPanel: "インストール済みスキル",
      skillMarketPanel: "ClawHub 検索 / インストール",
      skillCatalogHint: "ClawHubからスキルを検索してインストール",
      skillSearchPlaceholder: "検索キーワード（例: browser, file, test）",
      skillSearchEmpty: "該当なし",
      skillSearchIdle: "キーワードを入力して検索実行してください",
      skillSearchLoading: "ClawHubを検索中...",
      skillFilterGroup: "検索条件",
      skillFilterNonSuspicious: "疑わしいスキルを除外",
      skillFilterHighlightedOnly: "Highlightedのみ",
      skillSortLabel: "並び順",
      skillSortDownloads: "Downloads順",
      skillSortStars: "Stars順",
      skillSortInstalls: "インストール数順",
      skillSortUpdated: "最新更新順",
      skillSortHighlighted: "Highlighted優先",
      skillRecommendTitle: "未インストールおすすめ",
      skillRecommendEmpty: "おすすめ候補はありません",
      skillMarketOpen: "ClawHubから検索・インストール",
      skillModalTitle: "ClawHub スキル検索",
      skillModalKeyword: "検索キーワード",
      skillModalSearch: "検索実行",
      skillModalClose: "閉じる",
      skillSafety: "安全性",
      skillRating: "評価",
      skillDownloads: "Downloads",
      skillStars: "Stars",
      skillInstalls: "Installs",
      skillOpenLink: "リンク",
      skillDownload: "インストール",
      skillInstallUnsupported: "標準Skillのみ対応",
      noModels: "モデルはありません",
      noTools: "CLIツールはありません",
      noSkills: "Skillはありません",
      addOpen: "項目を追加",
      addClose: "追加フォームを閉じる",
      add: "追加",
      cancel: "キャンセル",
      save: "設定を保存",
      saveAll: "設定全体を保存",
      saving: "保存中",
      summary: "models",
      summaryTools: "tools",
      summarySkills: "skills",
      selectedModels: "selected_models",
      modelPlaceholder: "モデル名 (例: gpt-4.1)",
      unsavedChanges: "未保存の変更があります",
      savedState: "保存済み",
    }
    : {
      language: "Language",
      languageItem: "Display language",
      languageSection: "Language",
      handoffSection: "Execution Loop",
      handoffItem: "Context Handoff Policy",
      handoffHint: "Controls how much context Guide passes to Worker/Gate",
      guideAssistItem: "Guide controller assist",
      guideAssistHint: "Off by default. When enabled, the controller helps Guide with planning trigger/readiness cues",
      handoffMinimal: "Minimal",
      handoffBalanced: "Balanced",
      handoffVerbose: "Verbose",
      modelSection: "Model / CLI",
      skillCategorySection: "Skills",
      models: "models",
      tools: "cli tools",
      skillSection: "Model Runtime Skills",
      skillSectionHint: "Mounted on model runtime, selectable per Pal",
      installedSkillsPanel: "Installed Skills",
      skillMarketPanel: "ClawHub Search / Install",
      skillCatalogHint: "Search and install skills from ClawHub",
      skillSearchPlaceholder: "Search keyword (ex: browser, file, test)",
      skillSearchEmpty: "No matches",
      skillSearchIdle: "Enter keyword and press Search",
      skillSearchLoading: "Searching ClawHub...",
      skillFilterGroup: "Filters",
      skillFilterNonSuspicious: "Exclude suspicious skills",
      skillFilterHighlightedOnly: "Highlighted only",
      skillSortLabel: "Sort",
      skillSortDownloads: "Downloads",
      skillSortStars: "Stars",
      skillSortInstalls: "Installs",
      skillSortUpdated: "Latest update",
      skillSortHighlighted: "Highlighted first",
      skillRecommendTitle: "Recommended (Not Installed)",
      skillRecommendEmpty: "No recommended skills",
      skillMarketOpen: "Search / Install from ClawHub",
      skillModalTitle: "ClawHub Skill Search",
      skillModalKeyword: "Keyword",
      skillModalSearch: "Search",
      skillModalClose: "Close",
      skillSafety: "Safety",
      skillRating: "Rating",
      skillDownloads: "Downloads",
      skillStars: "Stars",
      skillInstalls: "Installs",
      skillOpenLink: "Link",
      skillDownload: "Install",
      skillInstallUnsupported: "Standard skills only",
      noModels: "No models registered",
      noTools: "No CLI tools registered",
      noSkills: "No skills registered",
      addOpen: "Add item",
      addClose: "Close add form",
      add: "Add",
      cancel: "Cancel",
      save: "Save Settings",
      saveAll: "Save All Settings",
      saving: "Saving",
      summary: "models",
      summaryTools: "tools",
      summarySkills: "skills",
      selectedModels: "selected_models",
      modelPlaceholder: "Model name (ex: gpt-4.1)",
      unsavedChanges: "Unsaved changes",
      savedState: "Saved",
    };
  const noSkillsLabel = labels.noSkills || "No skills registered";
  const skillSectionLabel = labels.skillSection || "Model Runtime Skills";
  const skillSectionHintLabel =
    labels.skillSectionHint || "Mounted on model runtime, selectable per Pal";
  const skillSearchPlaceholderLabel =
    labels.skillSearchPlaceholder || "Search on ClawHub";
  const skillSearchIdleLabel = labels.skillSearchIdle || "Enter keyword and press Search";
  const skillSearchLoadingLabel = labels.skillSearchLoading || "Searching ClawHub...";
  const skillFilterGroupLabel = labels.skillFilterGroup || "Filters";
  const skillFilterNonSuspiciousLabel = labels.skillFilterNonSuspicious || "Exclude suspicious skills";
  const skillFilterHighlightedOnlyLabel = labels.skillFilterHighlightedOnly || "Highlighted only";
  const skillSortLabel = labels.skillSortLabel || "Sort";
  const skillSortDownloadsLabel = labels.skillSortDownloads || "Downloads";
  const skillSortStarsLabel = labels.skillSortStars || "Stars";
  const skillSortInstallsLabel = labels.skillSortInstalls || "Installs";
  const skillSortUpdatedLabel = labels.skillSortUpdated || "Latest update";
  const skillSortHighlightedLabel = labels.skillSortHighlighted || "Highlighted first";
  const skillCategoryTitle = labels.skillCategorySection || "Skills";
  const languageItemLabel = labels.languageItem || "Display language";
  const handoffSectionLabel = labels.handoffSection || "Execution Loop";
  const handoffItemLabel = labels.handoffItem || "Context Handoff Policy";
  const handoffHintLabel = labels.handoffHint || "Controls how much context Guide passes to Worker/Gate";
  const installedSkillsPanelLabel = labels.installedSkillsPanel || "Installed Skills";
  const skillMarketPanelLabel = labels.skillMarketPanel || "ClawHub Search / Install";
  const summarySkillsLabel = labels.summarySkills || "skills";
  const skillMarketOpenLabel = labels.skillMarketOpen || "Search / Install from ClawHub";
  const skillModalTitleLabel = labels.skillModalTitle || "ClawHub Skill Search";
  const skillModalKeywordLabel = labels.skillModalKeyword || "Keyword";
  const skillModalSearchLabel = labels.skillModalSearch || "Search";
  const skillModalCloseLabel = labels.skillModalClose || "Close";
  const skillRatingLabel = labels.skillRating || "Rating";
  const skillDownloadsLabel = labels.skillDownloads || "Downloads";
  const skillStarsLabel = labels.skillStars || "Stars";
  const skillInstallsLabel = labels.skillInstalls || "Installs";
  const skillOpenLinkLabel = labels.skillOpenLink || "Link";
  const skillInstallUnsupportedLabel = labels.skillInstallUnsupported || "Standard skills only";
  const skillRecommendTitleLabel = labels.skillRecommendTitle || "Recommended (Not Installed)";
  const skillRecommendEmptyLabel = labels.skillRecommendEmpty || "No recommended skills";

  const providerOptions = PALPAL_CORE_PROVIDER_REGISTRY
    .map((provider) => {
      const selected = provider.id === settingsState.itemDraft.provider ? " selected" : "";
      return `<option value="${escapeHtml(provider.id)}"${selected}>${escapeHtml(provider.label)}</option>`;
    })
    .join("");
  const cliToolOptions = CLI_TOOL_OPTIONS
    .map((tool) => {
      const selected = tool === settingsState.itemDraft.toolName ? " selected" : "";
      return `<option value="${escapeHtml(tool)}"${selected}>${escapeHtml(tool)}</option>`;
    })
    .join("");

  const modelList = settingsState.registeredModels.length === 0
    ? `<li id="settingsTabModelEmpty" class="text-xs text-base-content/60">${labels.noModels}</li>`
    : settingsState.registeredModels
      .map((model, index) => `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-primary badge-sm">Model</span>
          <span class="badge badge-outline badge-sm">${escapeHtml(model.name)}</span>
          <span class="text-xs text-base-content/70">${escapeHtml(providerLabel(model.provider))}</span>
          ${model.apiKeyConfigured ? `<span class="text-xs text-base-content/60">api_key: configured</span>` : ""}
          ${model.baseUrl ? `<span class="text-xs text-base-content/60">base_url: ${escapeHtml(model.baseUrl)}</span>` : ""}
        </div>
        <button class="btn btn-ghost btn-xs" data-remove-model-index="${index}" type="button">${isJa ? "削除" : "Remove"}</button>
      </li>`)
      .join("");

  const toolList = settingsState.registeredTools.length === 0
    ? `<li id="settingsTabToolEmpty" class="text-xs text-base-content/60">${labels.noTools}</li>`
    : settingsState.registeredTools
      .map((tool, index) => `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-accent badge-sm">CLI</span>
          <span class="badge badge-ghost badge-sm">${escapeHtml(tool)}</span>
        </div>
        <button class="btn btn-ghost btn-xs" data-remove-tool-index="${index}" type="button">${isJa ? "削除" : "Remove"}</button>
      </li>`)
      .join("");

  const skillList = settingsState.registeredSkills.length === 0
    ? `<li id="settingsTabSkillEmpty" class="text-xs text-base-content/60">${escapeHtml(noSkillsLabel)}</li>`
    : settingsState.registeredSkills
      .map((skillId) => {
        const normalizedSkillId = normalizeSkillId(skillId) || normalizeText(skillId);
        const skill = skillById(normalizedSkillId);
        const name = skill?.name || normalizedSkillId;
        const description = skill?.description || "";
        const linkUrl = buildClawHubSkillUrl(normalizedSkillId);
        const showSkillLink = !STANDARD_SKILL_IDS.includes(normalizedSkillId);
        return `<li class="settings-model-row">
          <div class="settings-model-meta">
            <span class="badge badge-neutral badge-sm">Skill</span>
            <span class="badge badge-outline badge-sm">${escapeHtml(name)}</span>
            ${description ? `<span class="text-xs text-base-content/60">${escapeHtml(description)}</span>` : ""}
          </div>
          <div class="settings-row-actions" data-skill-actions="${escapeHtml(normalizedSkillId)}">
            ${showSkillLink ? `<a
              class="btn btn-outline btn-xs"
              href="${escapeHtml(linkUrl)}"
              target="_blank"
              rel="noopener noreferrer"
              data-skill-link-id="${escapeHtml(normalizedSkillId)}"
            >${escapeHtml(skillOpenLinkLabel)}</a>` : ""}
            <button class="btn btn-ghost btn-xs" data-remove-skill-id="${escapeHtml(normalizedSkillId)}" type="button">${isJa ? "削除" : "Remove"}</button>
          </div>
        </li>`;
      })
      .join("");
  const getUninstalledSkillMarketItems = () => {
    const installedSkillIds = new Set(
      settingsState.registeredSkills
        .map((skillId) => normalizeSkillId(skillId))
        .filter(Boolean)
    );
    return CLAWHUB_SKILL_REGISTRY
      .filter((skill) => !installedSkillIds.has(normalizeSkillId(skill.id)));
  };

  const isInstalledStandardSkill = (skillId) => {
    const normalized = normalizeSkillId(skillId);
    if (!normalized) return false;
    return settingsState.registeredSkills.includes(normalized);
  };

  const buildSkillMarketModalResultsHtml = () => {
    if (!settingsState.skillSearchExecuted) {
      return `<li id="settingsSkillModalIdle" class="text-xs text-base-content/60">${escapeHtml(skillSearchIdleLabel)}</li>`;
    }
    if (settingsState.skillSearchLoading) {
      return `<li id="settingsSkillModalLoading" class="text-xs text-base-content/60">${escapeHtml(skillSearchLoadingLabel)}</li>`;
    }
    const sourceResults = Array.isArray(settingsState.skillSearchResults)
      ? settingsState.skillSearchResults
      : [];
    const matches = sourceResults.filter((skill) => !isInstalledStandardSkill(skill?.id));
    return matches.length === 0
      ? `<li id="settingsSkillModalNoResults" class="text-xs text-base-content/60">${escapeHtml(labels.skillSearchEmpty || "No matching skills on ClawHub")}</li>`
      : matches
        .map((skill) => {
          const normalizedSkillId = normalizeSkillId(skill.id) || normalizeText(skill.id);
          const linkUrl = buildClawHubSkillUrl(normalizedSkillId);
          const showSkillLink = !STANDARD_SKILL_IDS.includes(normalizedSkillId);
          const ratingNumber = Number(skill.rating || 0);
          const ratingDisplay = Number.isFinite(ratingNumber) && ratingNumber > 0
            ? ratingNumber.toFixed(1)
            : "-";
          const starsNumber = Number(skill.stars || 0);
          const starsDisplay = Number.isFinite(starsNumber) && starsNumber >= 0
            ? starsNumber.toLocaleString(locale === "ja" ? "ja-JP" : "en-US")
            : "-";
          const downloadsNumber = Number(skill.downloads || 0);
          const downloadsDisplay = Number.isFinite(downloadsNumber) && downloadsNumber >= 0
            ? downloadsNumber.toLocaleString(locale === "ja" ? "ja-JP" : "en-US")
            : "-";
          const installsNumber = Number(skill.installs || 0);
          const installsDisplay = Number.isFinite(installsNumber) && installsNumber >= 0
            ? installsNumber.toLocaleString(locale === "ja" ? "ja-JP" : "en-US")
            : "-";
          return `<li class="settings-skill-modal-row">
            <div class="settings-skill-modal-meta">
              <div class="settings-skill-modal-title-row">
                <span class="badge badge-secondary badge-sm">${escapeHtml(skill.source || "ClawHub")}</span>
                <span class="font-semibold text-sm">${escapeHtml(skill.name)}</span>
              </div>
              <p class="text-xs text-base-content/70">${escapeHtml(skill.description || "-")}</p>
              <div class="settings-skill-modal-tags">
                <span class="badge badge-ghost badge-sm">${escapeHtml(skillDownloadsLabel)}: ${escapeHtml(downloadsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${escapeHtml(skillStarsLabel)}: ${escapeHtml(starsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${escapeHtml(skillInstallsLabel)}: ${escapeHtml(installsDisplay)}</span>
                <span class="badge badge-ghost badge-sm">${escapeHtml(skillRatingLabel)}: ${escapeHtml(ratingDisplay)}</span>
                <span class="badge badge-outline badge-sm">${escapeHtml(skill.packageName || `clawhub/${skill.id}`)}</span>
              </div>
            </div>
            <div class="settings-row-actions settings-skill-modal-actions" data-skill-actions="${escapeHtml(normalizedSkillId)}">
              ${showSkillLink ? `<a
                class="btn btn-outline btn-sm"
                href="${escapeHtml(linkUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                data-skill-link-id="${escapeHtml(normalizedSkillId)}"
              >${escapeHtml(skillOpenLinkLabel)}</a>` : ""}
              ${normalizedSkillId
    ? `<button class="btn btn-outline btn-sm" data-clawhub-download-skill="${escapeHtml(normalizedSkillId)}" type="button">${escapeHtml(labels.skillDownload || "Download")}</button>`
    : `<button class="btn btn-outline btn-sm" type="button" disabled>${escapeHtml(skillInstallUnsupportedLabel)}</button>`}
            </div>
          </li>`;
        })
        .join("");
  };
  const skillMarketModalResults = buildSkillMarketModalResultsHtml();

  const bindSkillMarketInstallHandlers = () => {
    root.querySelectorAll("[data-clawhub-download-skill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const skillId = normalizeSkillId(btn.getAttribute("data-clawhub-download-skill"));
        const result = installRegisteredSkillWithFallback(skillId, settingsState.registeredSkills);
        if (!result.ok) {
          setMessage(result.errorCode || "MSG-PPH-1001");
          return;
        }
        settingsState.registeredSkills = result.nextRegisteredSkillIds;
        setMessage("MSG-PPH-0007");
        renderSettingsTab();
      });
    });
  };

  const bindSkillLinkHandlers = () => {
    root.querySelectorAll("[data-skill-link-id]").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const href = normalizeText(anchor.getAttribute("href"));
        void openExternalUrlWithFallback(href);
      });
    });
  };

  const renderSkillMarketModalResults = () => {
    const listEl = document.getElementById("settingsSkillModalResults");
    if (!listEl) return;
    listEl.innerHTML = buildSkillMarketModalResultsHtml();
    bindSkillLinkHandlers();
    bindSkillMarketInstallHandlers();
  };

  const modelNameOptions = selectableModelOptions(settingsState.itemDraft.provider);
  const noModelOptionsForProviderLabel = isJa
    ? "選択したproviderに対応するモデルがありません"
    : "No models available for selected provider";
  const modelOptions = modelNameOptions.length === 0
    ? `<option value="">-</option>`
    : modelNameOptions
      .map((modelName) => {
        const selected = modelName === settingsState.itemDraft.modelName ? " selected" : "";
        return `<option value="${escapeHtml(modelName)}"${selected}>${escapeHtml(modelName)}</option>`;
      })
      .join("");
  const addModelDisabled = settingsState.itemDraft.type === "model" && modelNameOptions.length === 0;
  const addModelDisabledAttr = addModelDisabled ? " disabled" : "";
  const apiKeyRequired = isApiKeyRequiredForProvider(settingsState.itemDraft.provider);
  const apiKeyPlaceholder = apiKeyRequired
    ? "api_key (required)"
    : "api_key (optional)";
  const addItemFields = settingsState.itemDraft.type === "model"
    ? `<select id="settingsTabModelProvider" class="select select-bordered select-sm">${providerOptions}</select>
       <select id="settingsTabModelName" class="select select-bordered select-sm">${modelOptions}</select>
       <input id="settingsTabModelApiKey" type="password" class="input input-bordered input-sm" placeholder="${apiKeyPlaceholder}" value="${escapeHtml(settingsState.itemDraft.apiKey)}" />
       <input id="settingsTabModelBaseUrl" type="text" class="input input-bordered input-sm" placeholder="base_url (optional)" value="${escapeHtml(settingsState.itemDraft.baseUrl)}" />
       ${modelNameOptions.length === 0 ? `<span class="text-xs text-warning">${escapeHtml(noModelOptionsForProviderLabel)}</span>` : ""}`
    : `<select id="settingsTabToolName" class="select select-bordered select-sm">${cliToolOptions}</select>`;

  const addModelForm = settingsState.itemAddOpen
    ? `<div id="settingsTabAddModelRow" class="settings-add-model-row">
        <select id="settingsTabEntryType" class="select select-bordered select-sm">
          <option value="model"${settingsState.itemDraft.type === "model" ? " selected" : ""}>Model</option>
          <option value="tool"${settingsState.itemDraft.type === "tool" ? " selected" : ""}>CLI Tool</option>
        </select>
        ${addItemFields}
        <button id="settingsTabAddItemSubmit" class="btn btn-sm btn-outline" type="button"${addModelDisabledAttr}>${labels.add}</button>
        <button id="settingsTabCancelAddItem" class="btn btn-sm btn-ghost" type="button">${labels.cancel}</button>
      </div>`
    : "";

  const settingsDirty = hasUnsavedSettingsChanges();
  const saveDisabled = !settingsDirty || settingsSaveInFlight;
  const saveDisabledAttr = saveDisabled ? " disabled" : "";
  const settingsVisualState = settingsSaveInFlight ? "saving" : (settingsDirty ? "dirty" : "saved");
  const saveStatusText = settingsSaveInFlight
    ? labels.saving
    : (settingsDirty ? labels.unsavedChanges : labels.savedState);
  const saveStatusToneClass = settingsSaveInFlight
    ? "settings-status-saving"
    : (settingsDirty ? "settings-status-dirty" : "settings-status-saved");
  const saveButtonText = settingsSaveInFlight ? labels.saving : (labels.saveAll || labels.save);
  const skillModalOpenClass = settingsState.skillMarketModalOpen ? " is-open" : "";
  const skillSearchDraftValue = String(settingsState.skillSearchDraft || settingsState.skillSearchQuery || "");
  const draftFilters = normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft);
  const sortOptions = [
    { value: "downloads", label: skillSortDownloadsLabel },
    { value: "stars", label: skillSortStarsLabel },
    { value: "installs", label: skillSortInstallsLabel },
    { value: "updated", label: skillSortUpdatedLabel },
    { value: "highlighted", label: skillSortHighlightedLabel },
  ]
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === draftFilters.sortBy ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");
  const uninstalledSkillItems = getUninstalledSkillMarketItems();
  const skillMarketAvailableCount = uninstalledSkillItems.length;
  const skillMarketPreviewList = uninstalledSkillItems.length === 0
    ? `<li id="settingsSkillMarketPreviewEmpty" class="text-xs text-base-content/60">${escapeHtml(skillRecommendEmptyLabel)}</li>`
    : uninstalledSkillItems
      .map((skill) => {
        const normalizedSkillId = normalizeSkillId(skill.id) || normalizeText(skill.id);
        const description = normalizeText(skill.description || "");
        return `<li class="settings-model-row">
        <div class="settings-model-meta">
          <span class="badge badge-secondary badge-sm">${escapeHtml(skill.source || "ClawHub")}</span>
          <span class="badge badge-outline badge-sm">${escapeHtml(skill.name)}</span>
          ${description ? `<span class="text-xs text-base-content/60">${escapeHtml(description)}</span>` : ""}
        </div>
        <div class="settings-row-actions" data-skill-actions="${escapeHtml(normalizedSkillId)}">
          <button class="btn btn-outline btn-xs" data-clawhub-download-skill="${escapeHtml(normalizedSkillId)}" type="button">${escapeHtml(labels.skillDownload || "Install")}</button>
        </div>
      </li>`;
      })
      .join("");
  const handoffPolicy = normalizeContextHandoffPolicy(settingsState.contextHandoffPolicy);
  const guideControllerAssistEnabled = settingsState.guideControllerAssistEnabled === true;
  const handoffOptions = [
    { value: "minimal", label: labels.handoffMinimal || "Minimal" },
    { value: "balanced", label: labels.handoffBalanced || "Balanced" },
    { value: "verbose", label: labels.handoffVerbose || "Verbose" },
  ]
    .map((option) => `<option value="${escapeHtml(option.value)}"${option.value === handoffPolicy ? " selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");

  root.innerHTML = `<div class="settings-shell" data-add-form-open="${settingsState.itemAddOpen ? "true" : "false"}">
    <section class="settings-section">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.languageSection}</h3>
      </div>
      <div class="field settings-locale-row">
        <label class="label-text text-xs text-base-content/70">${languageItemLabel}</label>
        <div class="join settings-locale-actions" role="group" aria-label="${labels.language}">
          <button id="settingsLocaleJa" type="button" class="btn btn-sm join-item ${locale === "ja" ? "btn-primary" : "btn-ghost"}">JA</button>
          <button id="settingsLocaleEn" type="button" class="btn btn-sm join-item ${locale === "en" ? "btn-primary" : "btn-ghost"}">EN</button>
        </div>
      </div>
    </section>
    <section class="settings-section" data-settings-section="handoff">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${handoffSectionLabel}</h3>
      </div>
      <div class="field settings-subpanel">
        <label class="label-text text-xs text-base-content/70" for="settingsContextHandoffPolicy">${handoffItemLabel}</label>
        <select id="settingsContextHandoffPolicy" class="select select-bordered select-sm settings-handoff-select">${handoffOptions}</select>
        <span class="text-xs text-base-content/60">${escapeHtml(handoffHintLabel)}</span>
        <label class="mt-3 flex items-center gap-2 text-sm" for="settingsGuideControllerAssistEnabled">
          <input id="settingsGuideControllerAssistEnabled" type="checkbox" class="checkbox checkbox-sm"${guideControllerAssistEnabled ? " checked" : ""} />
          <span>${escapeHtml(labels.guideAssistItem)}</span>
        </label>
        <span class="text-xs text-base-content/60">${escapeHtml(labels.guideAssistHint)}</span>
      </div>
    </section>
    <section class="settings-section${settingsState.itemAddOpen ? " is-adding" : ""}" data-settings-section="model">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${labels.modelSection}</h3>
      </div>
      <div class="settings-columns">
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${labels.models}</label>
          <ul id="settingsTabModelList" class="settings-model-list">${modelList}</ul>
        </div>
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${labels.tools}</label>
          <ul id="settingsTabToolList" class="settings-model-list">${toolList}</ul>
        </div>
      </div>
      <div class="settings-inline">
        <button id="settingsTabOpenAddItem" class="btn btn-sm btn-outline" type="button">${settingsState.itemAddOpen ? labels.addClose : labels.addOpen}</button>
        <span class="text-xs text-base-content/65">${labels.summary}: <strong>${settingsState.registeredModels.length}</strong> / ${labels.summaryTools}: <strong>${settingsState.registeredTools.length}</strong></span>
      </div>
      ${addModelForm}
    </section>
    <section class="settings-section">
      <div class="settings-section-head">
        <h3 class="settings-section-title">${skillCategoryTitle}</h3>
      </div>
      <div class="settings-stack">
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${installedSkillsPanelLabel}</label>
          <ul id="settingsTabSkillList" class="settings-model-list">${skillList}</ul>
          <span class="text-xs text-base-content/60">${skillSectionHintLabel}</span>
        </div>
        <div class="field settings-subpanel">
          <label class="label-text text-xs text-base-content/70">${skillMarketPanelLabel}</label>
          <span class="text-xs text-base-content/70">${escapeHtml(skillRecommendTitleLabel)}: <strong>${skillMarketAvailableCount}</strong></span>
          <ul id="settingsSkillMarketPreview" class="settings-model-list">${skillMarketPreviewList}</ul>
          <button id="settingsSkillMarketOpenModal" class="btn btn-sm btn-outline settings-skill-market-open-btn" type="button">${escapeHtml(skillMarketOpenLabel)}</button>
        </div>
      </div>
    </section>
    <footer class="settings-footer" data-settings-state="${settingsVisualState}">
      <div class="settings-footer-row">
        <div class="settings-footer-meta">
          <span class="text-xs text-base-content/65">${labels.summary}: <strong>${settingsState.registeredModels.length}</strong> / ${labels.summaryTools}: <strong>${settingsState.registeredTools.length}</strong> / ${summarySkillsLabel}: <strong>${settingsState.registeredSkills.length}</strong></span>
          <span id="settingsDirtyHint" class="text-xs settings-status-text ${saveStatusToneClass}">${escapeHtml(saveStatusText)}</span>
        </div>
        <button
          id="settingsTabSave"
          class="btn btn-lg btn-primary settings-save-btn"
          type="button"
          data-settings-state="${settingsVisualState}"
          aria-busy="${settingsSaveInFlight ? "true" : "false"}"${saveDisabledAttr}
        >${escapeHtml(saveButtonText)}</button>
      </div>
    </footer>
  </div>
  <div id="settingsSkillMarketModal" class="settings-skill-modal${skillModalOpenClass}">
    <div id="settingsSkillModalBackdropClose" class="settings-skill-modal-backdrop" aria-hidden="true"></div>
    <div class="settings-skill-modal-box" role="dialog" aria-modal="true" aria-label="${escapeHtml(skillModalTitleLabel)}">
      <div class="settings-skill-modal-header">
        <h3 class="font-semibold text-base">${escapeHtml(skillModalTitleLabel)}</h3>
        <button id="settingsSkillModalCloseTop" type="button" class="btn btn-ghost btn-xs" aria-label="${escapeHtml(skillModalCloseLabel)}">x</button>
      </div>
      <label class="label-text text-xs text-base-content/70">${escapeHtml(skillModalKeywordLabel)}</label>
      <input
        id="settingsSkillModalKeyword"
        type="text"
        class="input input-bordered input-sm settings-skill-modal-keyword"
        placeholder="${escapeHtml(skillSearchPlaceholderLabel)}"
        value="${escapeHtml(skillSearchDraftValue)}"
      />
      <div class="settings-skill-modal-filter-stack">
        <div class="settings-skill-modal-filter-group">
          <span class="label-text text-xs text-base-content/70">${escapeHtml(skillFilterGroupLabel)}</span>
          <div class="settings-skill-modal-check-row">
            <label class="settings-skill-modal-check">
              <input id="settingsSkillModalNonSuspicious" type="checkbox" class="checkbox checkbox-sm"${draftFilters.nonSuspiciousOnly ? " checked" : ""} />
              <span class="text-xs">${escapeHtml(skillFilterNonSuspiciousLabel)}</span>
            </label>
            <label class="settings-skill-modal-check">
              <input id="settingsSkillModalHighlightedOnly" type="checkbox" class="checkbox checkbox-sm"${draftFilters.highlightedOnly ? " checked" : ""} />
              <span class="text-xs">${escapeHtml(skillFilterHighlightedOnlyLabel)}</span>
            </label>
          </div>
        </div>
        <div class="settings-skill-modal-controls-row">
          <div class="settings-skill-modal-sort-group">
            <span class="label-text text-xs text-base-content/70">${escapeHtml(skillSortLabel)}</span>
            <select id="settingsSkillModalSort" class="select select-bordered select-sm">${sortOptions}</select>
          </div>
          <button id="settingsSkillModalSearch" class="btn btn-sm btn-primary settings-skill-modal-search-btn" type="button">${escapeHtml(skillModalSearchLabel)}</button>
        </div>
      </div>
      <hr class="settings-skill-modal-divider" />
      <ul id="settingsSkillModalResults" class="settings-skill-modal-results">${skillMarketModalResults}</ul>
      <div class="settings-skill-modal-footer">
        <button id="settingsSkillModalClose" class="btn btn-sm btn-ghost" type="button">${escapeHtml(skillModalCloseLabel)}</button>
      </div>
    </div>
  </div>`;

  const localeJaEl = document.getElementById("settingsLocaleJa");
  const localeEnEl = document.getElementById("settingsLocaleEn");
  const handoffPolicyEl = document.getElementById("settingsContextHandoffPolicy");
  const guideControllerAssistEl = document.getElementById("settingsGuideControllerAssistEnabled");
  const openAddModelEl = document.getElementById("settingsTabOpenAddItem");
  const entryTypeEl = document.getElementById("settingsTabEntryType");
  const addModelSubmitEl = document.getElementById("settingsTabAddItemSubmit");
  const cancelAddModelEl = document.getElementById("settingsTabCancelAddItem");
  const modelNameEl = document.getElementById("settingsTabModelName");
  const modelProviderEl = document.getElementById("settingsTabModelProvider");
  const modelBaseUrlEl = document.getElementById("settingsTabModelBaseUrl");
  const modelApiKeyEl = document.getElementById("settingsTabModelApiKey");
  const toolNameEl = document.getElementById("settingsTabToolName");
  const skillMarketOpenModalEl = document.getElementById("settingsSkillMarketOpenModal");
  const skillModalKeywordEl = document.getElementById("settingsSkillModalKeyword");
  const skillModalSortEl = document.getElementById("settingsSkillModalSort");
  const skillModalNonSuspiciousEl = document.getElementById("settingsSkillModalNonSuspicious");
  const skillModalHighlightedOnlyEl = document.getElementById("settingsSkillModalHighlightedOnly");
  const skillModalSearchEl = document.getElementById("settingsSkillModalSearch");
  const skillModalCloseEl = document.getElementById("settingsSkillModalClose");
  const skillModalCloseTopEl = document.getElementById("settingsSkillModalCloseTop");
  const skillModalBackdropCloseEl = document.getElementById("settingsSkillModalBackdropClose");
  const saveEl = document.getElementById("settingsTabSave");

  if (localeJaEl) {
    localeJaEl.addEventListener("click", () => {
      if (locale !== "ja") {
        locale = "ja";
        applyI18n();
      }
    });
  }
  if (localeEnEl) {
    localeEnEl.addEventListener("click", () => {
      if (locale !== "en") {
        locale = "en";
        applyI18n();
      }
    });
  }
  if (handoffPolicyEl) {
    handoffPolicyEl.addEventListener("change", () => {
      settingsState.contextHandoffPolicy = normalizeContextHandoffPolicy(handoffPolicyEl.value);
      renderSettingsTab();
    });
  }
  if (guideControllerAssistEl) {
    guideControllerAssistEl.addEventListener("change", () => {
      settingsState.guideControllerAssistEnabled = guideControllerAssistEl.checked;
      renderSettingsTab();
    });
  }

  if (openAddModelEl) {
    openAddModelEl.addEventListener("click", () => {
      settingsState.itemAddOpen = !settingsState.itemAddOpen;
      if (!settingsState.itemAddOpen) {
        resetModelItemDraft(settingsState.itemDraft.provider);
      }
      renderSettingsTab();
    });
  }

  if (entryTypeEl) {
    entryTypeEl.addEventListener("change", () => {
      settingsState.itemDraft.type = entryTypeEl.value === "tool" ? "tool" : "model";
      renderSettingsTab();
    });
  }
  if (modelNameEl) {
    modelNameEl.addEventListener("change", () => {
      settingsState.itemDraft.modelName = modelNameEl.value;
    });
  }
  if (modelProviderEl) {
    modelProviderEl.addEventListener("change", () => {
      const nextProviderId = providerIdFromInput(modelProviderEl.value);
      settingsState.itemDraft.provider = nextProviderId;
      const nextOptions = selectableModelOptions(nextProviderId);
      settingsState.itemDraft.modelName = nextOptions[0] || "";
      renderSettingsTab();
    });
  }
  if (modelBaseUrlEl) {
    modelBaseUrlEl.addEventListener("input", () => {
      settingsState.itemDraft.baseUrl = modelBaseUrlEl.value;
    });
  }
  if (modelApiKeyEl) {
    modelApiKeyEl.addEventListener("input", () => {
      settingsState.itemDraft.apiKey = modelApiKeyEl.value;
    });
  }
  if (toolNameEl) {
    toolNameEl.addEventListener("change", () => {
      settingsState.itemDraft.toolName = normalizeToolName(toolNameEl.value);
    });
  }
  const runSkillMarketSearch = async () => {
    settingsState.skillSearchQuery = String(settingsState.skillSearchDraft || "").trim();
    settingsState.skillSearchFilters = normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft);
    settingsState.skillSearchExecuted = true;
    settingsState.skillSearchLoading = true;
    settingsState.skillSearchError = "";
    settingsState.skillSearchResults = [];
    const requestSeq = settingsState.skillSearchRequestSeq + 1;
    settingsState.skillSearchRequestSeq = requestSeq;
    renderSkillMarketModalResults();
    const result = await searchClawHubSkillsWithFallback(
      settingsState.skillSearchQuery,
      settingsState.skillSearchFilters
    );
    if (settingsState.skillSearchRequestSeq !== requestSeq) return;
    settingsState.skillSearchLoading = false;
    settingsState.skillSearchResults = result.items;
    renderSkillMarketModalResults();
  };

  const closeSkillMarketModal = () => {
    settingsState.skillMarketModalOpen = false;
    settingsState.skillSearchDraft = "";
    settingsState.skillSearchQuery = "";
    settingsState.skillSearchExecuted = false;
    settingsState.skillSearchFilters = { ...DEFAULT_SKILL_SEARCH_FILTERS };
    settingsState.skillSearchFilterDraft = { ...DEFAULT_SKILL_SEARCH_FILTERS };
    settingsState.skillSearchResults = [];
    settingsState.skillSearchLoading = false;
    settingsState.skillSearchError = "";
    settingsState.skillSearchRequestSeq += 1;
    renderSettingsTab();
  };
  if (skillMarketOpenModalEl) {
    skillMarketOpenModalEl.addEventListener("click", () => {
      settingsState.skillSearchDraft = "";
      settingsState.skillSearchQuery = "";
      settingsState.skillSearchExecuted = false;
      settingsState.skillSearchFilters = { ...DEFAULT_SKILL_SEARCH_FILTERS };
      settingsState.skillSearchFilterDraft = { ...DEFAULT_SKILL_SEARCH_FILTERS };
      settingsState.skillSearchResults = [];
      settingsState.skillSearchLoading = false;
      settingsState.skillSearchError = "";
      settingsState.skillSearchRequestSeq += 1;
      settingsState.skillMarketModalOpen = true;
      renderSettingsTab();
    });
  }
  if (skillModalKeywordEl) {
    skillModalKeywordEl.addEventListener("input", () => {
      settingsState.skillSearchDraft = skillModalKeywordEl.value;
    });
  }
  if (skillModalSortEl) {
    skillModalSortEl.addEventListener("change", () => {
      settingsState.skillSearchFilterDraft = {
        ...normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
        sortBy: normalizeSkillMarketSortBy(skillModalSortEl.value),
      };
    });
  }
  if (skillModalNonSuspiciousEl) {
    skillModalNonSuspiciousEl.addEventListener("change", () => {
      settingsState.skillSearchFilterDraft = {
        ...normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
        nonSuspiciousOnly: skillModalNonSuspiciousEl.checked,
      };
    });
  }
  if (skillModalHighlightedOnlyEl) {
    skillModalHighlightedOnlyEl.addEventListener("change", () => {
      settingsState.skillSearchFilterDraft = {
        ...normalizeSkillSearchFilters(settingsState.skillSearchFilterDraft),
        highlightedOnly: skillModalHighlightedOnlyEl.checked,
      };
    });
  }
  if (skillModalSearchEl) {
    skillModalSearchEl.addEventListener("click", () => {
      void runSkillMarketSearch();
    });
  }
  if (skillModalCloseEl) {
    skillModalCloseEl.addEventListener("click", closeSkillMarketModal);
  }
  if (skillModalCloseTopEl) {
    skillModalCloseTopEl.addEventListener("click", closeSkillMarketModal);
  }
  if (skillModalBackdropCloseEl) {
    skillModalBackdropCloseEl.addEventListener("click", closeSkillMarketModal);
  }
  if (cancelAddModelEl) {
    cancelAddModelEl.addEventListener("click", () => {
      settingsState.itemAddOpen = false;
      resetModelItemDraft(settingsState.itemDraft.provider);
      renderSettingsTab();
    });
  }

  const addModel = () => {
    if (settingsState.itemDraft.type === "tool") {
      const toolName = normalizeToolName(settingsState.itemDraft.toolName);
      if (settingsState.registeredTools.includes(toolName)) {
        setMessage("MSG-PPH-1001");
        return;
      }
      settingsState.registeredTools.push(toolName);
      settingsState.itemAddOpen = false;
      renderSettingsTab();
      return;
    }

    const next = normalizeRegisteredModel({
      name: settingsState.itemDraft.modelName,
      provider: settingsState.itemDraft.provider,
      apiKey: settingsState.itemDraft.apiKey,
      baseUrl: settingsState.itemDraft.baseUrl,
      endpoint: settingsState.itemDraft.endpoint,
    });
    if (!next.name) {
      setMessage("MSG-PPH-1001");
      return;
    }
    if (!isValidProviderModelPair(next.provider, next.name)) {
      setMessage("MSG-PPH-1001");
      return;
    }
    if (isApiKeyRequiredForProvider(next.provider) && !next.apiKey) {
      setMessage("MSG-PPH-1001");
      return;
    }
    const existingIndex = settingsState.registeredModels.findIndex((model) => (
      providerIdFromInput(model.provider) === providerIdFromInput(next.provider) &&
      model.name.toLowerCase() === next.name.toLowerCase()
    ));
    if (existingIndex >= 0) {
      const existing = settingsState.registeredModels[existingIndex];
      settingsState.registeredModels[existingIndex] = {
        ...existing,
        ...next,
        apiKeyConfigured: Boolean(existing.apiKeyConfigured || next.apiKeyConfigured),
      };
    } else {
      settingsState.registeredModels.push(next);
    }
    resetModelItemDraft(next.provider);
    settingsState.itemAddOpen = false;
    renderSettingsTab();
  };

  if (addModelSubmitEl) {
    addModelSubmitEl.addEventListener("click", addModel);
  }
  if (modelNameEl) {
    modelNameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addModel();
      }
    });
  }

  root.querySelectorAll("[data-remove-model-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-remove-model-index"));
      if (Number.isNaN(index)) return;
      settingsState.registeredModels.splice(index, 1);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-remove-tool-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-remove-tool-index"));
      if (Number.isNaN(index)) return;
      settingsState.registeredTools.splice(index, 1);
      renderSettingsTab();
    });
  });
  root.querySelectorAll("[data-remove-skill-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const skillId = normalizeSkillId(btn.getAttribute("data-remove-skill-id"));
      const result = uninstallRegisteredSkillWithFallback(skillId, settingsState.registeredSkills);
      if (!result.ok) {
        setMessage(result.errorCode || "MSG-PPH-1001");
        return;
      }
      settingsState.registeredSkills = result.nextRegisteredSkillIds;
      renderSettingsTab();
    });
  });
  bindSkillMarketInstallHandlers();
  bindSkillLinkHandlers();

  if (saveEl) {
    saveEl.addEventListener("click", async () => {
      if (settingsSaveInFlight) return;
      if (!hasUnsavedSettingsChanges()) return;
      if (settingsState.registeredModels.length === 0 && settingsState.registeredTools.length === 0) {
        setMessage("MSG-PPH-1001");
        return;
      }
      syncPalProfilesFromSettings();
      settingsSaveInFlight = true;
      renderSettingsTab();
      try {
        const persisted = await saveSettingsSnapshotWithFallback();
        applySettingsSnapshot(persisted);
        writePalProfilesSnapshotWithFallback();
        setMessage("MSG-PPH-0007");
      } catch (error) {
        setMessage("MSG-PPH-1003");
      } finally {
        settingsSaveInFlight = false;
        renderSettingsTab();
      }
    });
  }
}

function selectedTask() {
  return tasks.find((t) => t.id === selectedTaskId) || null;
}

function renderDetail() {
  const drawer = document.getElementById("detailDrawer");
  const body = document.getElementById("detailBody");
  const task = selectedTask();
  if (!task || workspaceTab !== "task") {
    drawer.classList.add("hidden");
    drawer.setAttribute("data-detail-state", "closed");
    body.innerHTML = "";
    return;
  }
  drawer.classList.remove("hidden");
  drawer.setAttribute("data-detail-state", "open");
  body.innerHTML = `<div class="grid gap-3">
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("selectedTask")}</span>
      <div><strong>${task.id}</strong> / ${task.title}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("description")}</span>
      <div>${task.description}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("constraints")}</span>
      <div>${task.constraintsCheckResult}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("evidence")}</span>
      <div>${task.evidence}</div>
      <span class="mt-2 inline-block text-xs text-base-content/60">${tDyn("replay")}</span>
      <div>${task.replay}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("gateDecision")}</span>
      <div>${task.gateResult?.decision || "-"}</div>
      <span class="mt-2 inline-block text-xs text-base-content/60">${tDyn("gateReason")}</span>
      <div>${task.gateResult?.reason || "-"}</div>
      <span class="mt-2 inline-block text-xs text-base-content/60">${tDyn("gateFixes")}</span>
      <div>${task.gateResult?.fixes?.length ? task.gateResult.fixes.join("<br>") : "-"}</div>
    </div>
    <div class="detail-card rounded-box border border-base-300 bg-base-100 p-3">
      <span class="text-xs text-base-content/60">${tDyn("fixCondition")}</span>
      <div>${task.fixCondition}</div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-sm btn-outline" id="detailStart">${tDyn("start")}</button>
      <button class="btn btn-sm btn-outline" id="detailSubmit">${tDyn("submit")}</button>
      <button class="btn btn-sm btn-outline" id="detailResubmit">${tDyn("resubmit")}</button>
      <button class="btn btn-sm btn-primary" id="detailGate">${tDyn("openGate")}</button>
    </div>
  </div>`;
  bindDetailButtons(task);
}

function bindDetailButtons(task) {
  const start = document.getElementById("detailStart");
  const submit = document.getElementById("detailSubmit");
  const resubmit = document.getElementById("detailResubmit");
  const gate = document.getElementById("detailGate");
  start.disabled = task.status !== "assigned";
  submit.disabled = task.status !== "in_progress";
  resubmit.disabled = task.status !== "rejected";
  gate.disabled = task.status !== "to_gate";
  start.onclick = () => runTaskAction("start", task.id);
  submit.onclick = () => runTaskAction("submit", task.id);
  resubmit.onclick = () => runTaskAction("resubmit", task.id);
  gate.onclick = () => openGate(task.id, "task");
}

function touchTask(task, status, decisionSummary, fixCondition, gateResultInput = null) {
  task.status = status;
  task.decisionSummary = decisionSummary ?? task.decisionSummary;
  task.fixCondition = fixCondition ?? task.fixCondition;
  task.gateResult = gateResultInput
    ? normalizeGateResultRecord(gateResultInput, { decisionSummary, fixCondition })
    : normalizeGateResultRecord(task.gateResult, { decisionSummary: task.decisionSummary, fixCondition: task.fixCondition });
  task.updatedAt = formatNow();
}

function touchJob(job, status, decisionSummary, fixCondition, gateResultInput = null) {
  job.status = status;
  job.decisionSummary = decisionSummary ?? job.decisionSummary;
  job.fixCondition = fixCondition ?? job.fixCondition;
  job.gateResult = gateResultInput
    ? normalizeGateResultRecord(gateResultInput, { decisionSummary, fixCondition })
    : normalizeGateResultRecord(job.gateResult, { decisionSummary: job.decisionSummary, fixCondition: job.fixCondition });
  job.updatedAt = formatNow();
  if (status === "in_progress") job.lastRunAt = formatNow();
}

function resolveRegisteredModelForPal(pal) {
  const selectedModelName = Array.isArray(pal?.models) ? normalizeText(pal.models[0]) : "";
  if (!selectedModelName) return null;
  const providerHint = providerIdFromInput(pal?.provider || "");
  const candidates = settingsState.registeredModels.filter((model) => (
    normalizeText(model?.name).toLowerCase() === selectedModelName.toLowerCase()
  ));
  if (candidates.length === 0) return null;
  if (!providerHint) return candidates[0];
  return candidates.find((model) => providerIdFromInput(model.provider) === providerHint) || candidates[0];
}

function resolvePalRuntimeConfigForExecution(pal) {
  if (!pal || normalizePalRuntimeKind(pal.runtimeKind) !== "model") return null;
  const model = resolveRegisteredModelForPal(pal);
  if (!model) return null;
  return {
    provider: providerIdFromInput(model.provider || pal.provider || DEFAULT_PROVIDER_ID),
    modelName: normalizeText(model.name),
    baseUrl: normalizeText(model.baseUrl),
    apiKey: normalizeText(model.apiKey),
  };
}

async function resolveConfiguredSkillIdsForPal(pal) {
  const fallback = Array.isArray(pal?.skills)
    ? pal.skills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
    : [];
  const identityApi = resolveAgentIdentityApi();
  if (!identityApi || !pal) return fallback;
  const role = normalizePalRole(pal.role);
  const agentType = role === "worker" ? "worker" : role;
  if (!agentType) return fallback;
  try {
    const identity = await identityApi.load({
      agentType,
      agentId: pal.id,
    });
    if (!identity || !identity.hasIdentityFiles) return fallback;
    return Array.isArray(identity.enabledSkillIds)
      ? identity.enabledSkillIds.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [];
  } catch (error) {
    return fallback;
  }
}

function resolveContextHandoffPolicy() {
  return normalizeContextHandoffPolicy(settingsState.contextHandoffPolicy);
}

function buildCompressedHistorySummary(target, targetKind = "task") {
  const summaries = [];
  const latestGuideMessages = Array.isArray(guideMessages) ? guideMessages.slice(-3) : [];
  latestGuideMessages.forEach((message) => {
    const sender = normalizeText(message?.sender || message?.role || "system");
    const content = normalizeText(
      typeof message?.content === "string"
        ? message.content
        : (typeof message?.text === "string"
          ? message.text
          : (message?.text?.[locale] || message?.text?.ja || message?.text?.en || ""))
    );
    if (!content) return;
    const preview = content.length > 96 ? `${content.slice(0, 93)}...` : content;
    summaries.push(`guide-${sender}: ${preview}`);
  });
  const targetSummary = normalizeText(target?.description || target?.instruction);
  if (targetSummary) {
    summaries.push(`${targetKind}-card: ${targetSummary.length > 96 ? `${targetSummary.slice(0, 93)}...` : targetSummary}`);
  }
  const gateReason = normalizeText(target?.gateResult?.reason);
  if (gateReason && gateReason !== "-") {
    summaries.push(`reject-history: ${gateReason.length > 96 ? `${gateReason.slice(0, 93)}...` : gateReason}`);
  }
  return summaries.slice(0, 4);
}

function buildWorkerExecutionConstraints(target) {
  const constraints = [];
  const checkResult = normalizeText(target?.constraintsCheckResult);
  if (checkResult && checkResult !== "-") {
    constraints.push(`constraints_check_result: ${checkResult}`);
  }
  const gateFixes = Array.isArray(target?.gateResult?.fixes)
    ? target.gateResult.fixes.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  if (gateFixes.length > 0) {
    gateFixes.forEach((item) => constraints.push(`fix: ${item}`));
  } else {
    const fixCondition = normalizeText(target?.fixCondition);
    if (fixCondition && fixCondition !== "-") {
      constraints.push(`fix_condition: ${fixCondition}`);
    }
  }
  return constraints;
}

function buildWorkerExpectedOutput(targetKind = "task") {
  if (locale === "en") {
    return targetKind === "job"
      ? "Complete the scheduled job, summarize the result, and provide evidence for gate review."
      : "Complete the task and provide evidence for gate review.";
  }
  return targetKind === "job"
    ? "定期実行を完了し、結果要約と Gate 判定用の evidence を返す。"
    : "Task を完了し、Gate 判定用の evidence を返す。";
}

function buildWorkerProjectContext() {
  const focus = focusedProject();
  if (!focus) return "";
  return `focus_project: ${focus.name}\nfocus_directory: ${focus.directory}`;
}

function buildWorkerHandoffSummary(target, targetKind = "task", pal = null, gateProfile = null) {
  const sourceRefs = [targetKind === "job" ? "job-card" : "task-card"];
  const gateFixes = Array.isArray(target?.gateResult?.fixes)
    ? target.gateResult.fixes.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  if (gateFixes.length > 0 || (normalizeText(target?.fixCondition) && normalizeText(target?.fixCondition) !== "-")) {
    sourceRefs.push("reject-history");
  }
  const title = normalizeText(target?.title || target?.id || "");
  const description = normalizeText(target?.description || target?.instruction || "");
  const gateName = normalizeText(gateProfile?.displayName || gateProfile?.id);
  const palName = normalizeText(pal?.displayName || pal?.id || target?.palId);
  const goal = description || title || normalizeText(target?.id);
  const decisionContext = locale === "en"
    ? `Assigned to ${palName || "worker"} and reviewed by ${gateName || "default gate"}.`
    : `${palName || "担当Pal"} が実行し、${gateName || "既定Gate"} が判定する。`;
  const risks = [];
  if (gateFixes.length > 0) {
    risks.push(...gateFixes);
  } else {
    const fixCondition = normalizeText(target?.fixCondition);
    if (fixCondition && fixCondition !== "-") risks.push(fixCondition);
  }
  if (normalizeText(target?.constraintsCheckResult) && normalizeText(target?.constraintsCheckResult) !== "pass") {
    risks.push(normalizeText(target?.constraintsCheckResult));
  }
  const openQuestions = [];
  if (!description) {
    openQuestions.push(locale === "en" ? "Instruction detail is minimal." : "指示詳細が少ない。");
  }
  return {
    goal,
    decisionContext,
    risks,
    openQuestions,
    sourceRefs,
  };
}

function buildWorkerExecutionInput(target, targetKind = "task") {
  const gateProfile = resolveGateProfileForTarget(target);
  const pal = palProfiles.find((entry) => entry.id === normalizeText(target?.palId)) || null;
  const instruction = normalizeText(
    targetKind === "job"
      ? (target?.instruction || target?.description || target?.title || target?.id)
      : (target?.description || target?.title || target?.id)
  );
  const policy = resolveContextHandoffPolicy();
  const input = {
    targetType: targetKind,
    targetId: normalizeText(target?.id),
    title: normalizeText(target?.title || target?.id || ""),
    instruction,
    constraints: buildWorkerExecutionConstraints(target),
    expectedOutput: buildWorkerExpectedOutput(targetKind),
    assigneePalId: normalizeText(target?.palId),
    gateProfileId: normalizeText(gateProfile?.id),
    projectContext: buildWorkerProjectContext(),
  };
  if (policy !== "minimal") {
    input.handoffSummary = buildWorkerHandoffSummary(target, targetKind, pal, gateProfile);
  }
  if (policy === "verbose") {
    input.compressedHistorySummary = buildCompressedHistorySummary(target, targetKind);
  }
  return input;
}

function buildWorkerExecutionUserText(executionInput) {
  const labels = locale === "en"
    ? {
      header: "[WorkerExecutionInput]",
      targetType: "target_type",
      targetId: "target_id",
      title: "title",
      instruction: "instruction",
      constraints: "constraints",
      expectedOutput: "expected_output",
      assigneePalId: "assignee_pal_id",
      gateProfileId: "gate_profile_id",
      projectContext: "project_context",
      handoffSummary: "[HandoffSummary]",
      compressedHistorySummary: "[CompressedHistorySummary]",
      goal: "goal",
      decisionContext: "decision_context",
      risks: "risks",
      openQuestions: "open_questions",
      sourceRefs: "source_refs",
      none: "- none",
    }
    : {
      header: "[WorkerExecutionInput]",
      targetType: "target_type",
      targetId: "target_id",
      title: "title",
      instruction: "instruction",
      constraints: "constraints",
      expectedOutput: "expected_output",
      assigneePalId: "assignee_pal_id",
      gateProfileId: "gate_profile_id",
      projectContext: "project_context",
      handoffSummary: "[HandoffSummary]",
      compressedHistorySummary: "[CompressedHistorySummary]",
      goal: "goal",
      decisionContext: "decision_context",
      risks: "risks",
      openQuestions: "open_questions",
      sourceRefs: "source_refs",
      none: "- なし",
    };
  const lines = [
    labels.header,
    `${labels.targetType}: ${executionInput.targetType}`,
    `${labels.targetId}: ${executionInput.targetId}`,
    `${labels.title}: ${executionInput.title}`,
    `${labels.instruction}:`,
    executionInput.instruction || "-",
    `${labels.constraints}:`,
  ];
  if (Array.isArray(executionInput.constraints) && executionInput.constraints.length > 0) {
    executionInput.constraints.forEach((item) => lines.push(`- ${item}`));
  } else {
    lines.push(labels.none);
  }
  lines.push(`${labels.expectedOutput}:`);
  lines.push(executionInput.expectedOutput || "-");
  lines.push(`${labels.assigneePalId}: ${executionInput.assigneePalId || "-"}`);
  lines.push(`${labels.gateProfileId}: ${executionInput.gateProfileId || "-"}`);
  if (normalizeText(executionInput.projectContext)) {
    lines.push(`${labels.projectContext}:`);
    lines.push(executionInput.projectContext);
  }
  const summary = executionInput.handoffSummary;
  if (summary && typeof summary === "object") {
    lines.push("");
    lines.push(labels.handoffSummary);
    lines.push(`${labels.goal}: ${normalizeText(summary.goal) || "-"}`);
    lines.push(`${labels.decisionContext}: ${normalizeText(summary.decisionContext) || "-"}`);
    lines.push(`${labels.risks}:`);
    if (Array.isArray(summary.risks) && summary.risks.length > 0) {
      summary.risks.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(labels.none);
    }
    lines.push(`${labels.openQuestions}:`);
    if (Array.isArray(summary.openQuestions) && summary.openQuestions.length > 0) {
      summary.openQuestions.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(labels.none);
    }
    lines.push(`${labels.sourceRefs}:`);
    if (Array.isArray(summary.sourceRefs) && summary.sourceRefs.length > 0) {
      summary.sourceRefs.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(labels.none);
    }
  }
  if (Array.isArray(executionInput.compressedHistorySummary) && executionInput.compressedHistorySummary.length > 0) {
    lines.push("");
    lines.push(labels.compressedHistorySummary);
    executionInput.compressedHistorySummary.forEach((item) => lines.push(`- ${item}`));
  }
  return lines.join("\n");
}

function buildPalRuntimeUserText(target, targetKind = "task") {
  return buildWorkerExecutionUserText(buildWorkerExecutionInput(target, targetKind));
}

function hashTextForVersion(value, prefix = "content") {
  const source = normalizeText(value);
  if (!source) return "none";
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash * 31) + source.charCodeAt(index)) >>> 0;
  }
  return `${prefix}-${hash.toString(16)}`;
}

function buildDebugIdentityVersions(identity) {
  return {
    soulVersion: hashTextForVersion(identity?.soul || "", "soul"),
    roleVersion: hashTextForVersion(identity?.role || "", "role"),
    rubricVersion: hashTextForVersion(identity?.rubric || "", "rubric"),
  };
}

function buildGateRejectHistorySummary(target) {
  const items = [];
  const reason = normalizeText(target?.gateResult?.reason);
  if (reason && reason !== "-") items.push(reason);
  const fixes = Array.isArray(target?.gateResult?.fixes)
    ? target.gateResult.fixes.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  fixes.forEach((item) => items.push(`fix: ${item}`));
  const fixCondition = normalizeText(target?.fixCondition);
  if (items.length === 0 && fixCondition && fixCondition !== "-") {
    items.push(fixCondition);
  }
  return items.slice(0, 4);
}

function buildGateReviewInput(target, targetKind = "task", gateProfile = null, identity = null) {
  const policy = resolveContextHandoffPolicy();
  const reviewInput = {
    targetType: targetKind,
    targetId: normalizeText(target?.id),
    title: normalizeText(target?.title || target?.id || ""),
    instruction: normalizeText(
      targetKind === "job"
        ? (target?.instruction || target?.description || target?.title || target?.id)
        : (target?.description || target?.title || target?.id)
    ),
    constraints: buildWorkerExecutionConstraints(target),
    expectedOutput: buildWorkerExpectedOutput(targetKind),
    submission: normalizeText(target?.evidence || ""),
    ritual: {
      evidence: normalizeText(target?.evidence || ""),
      replay: normalizeText(target?.replay || ""),
    },
    gateProfileId: normalizeText(gateProfile?.id),
    rubricVersion: hashTextForVersion(identity?.rubric || "", "rubric"),
  };
  if (policy !== "minimal") {
    const pal = palProfiles.find((entry) => entry.id === normalizeText(target?.palId)) || null;
    reviewInput.handoffSummary = buildWorkerHandoffSummary(target, targetKind, pal, gateProfile);
  }
  const rejectHistorySummary = buildGateRejectHistorySummary(target);
  if (rejectHistorySummary.length > 0) {
    reviewInput.rejectHistorySummary = rejectHistorySummary;
  }
  if (policy === "verbose") {
    reviewInput.compressedHistorySummary = buildCompressedHistorySummary(target, targetKind);
  }
  return reviewInput;
}

function buildGateReviewUserText(reviewInput) {
  const labels = locale === "en"
    ? {
      header: "[GateReviewInput]",
      targetType: "target_type",
      targetId: "target_id",
      title: "title",
      instruction: "instruction",
      constraints: "constraints",
      expectedOutput: "expected_output",
      submission: "submission",
      ritual: "[CompletionRitual]",
      evidence: "evidence",
      replay: "replay",
      gateProfileId: "gate_profile_id",
      rubricVersion: "rubric_version",
      handoffSummary: "[HandoffSummary]",
      compressedHistorySummary: "[CompressedHistorySummary]",
      rejectHistorySummary: "[RejectHistorySummary]",
      goal: "goal",
      decisionContext: "decision_context",
      risks: "risks",
      openQuestions: "open_questions",
      sourceRefs: "source_refs",
      outputFormat: "[OutputFormat]",
      none: "- none",
      outputRule: 'Return compact JSON only: {"decision":"approved|rejected","reason":"...","fixes":["..."]}',
    }
    : {
      header: "[GateReviewInput]",
      targetType: "target_type",
      targetId: "target_id",
      title: "title",
      instruction: "instruction",
      constraints: "constraints",
      expectedOutput: "expected_output",
      submission: "submission",
      ritual: "[CompletionRitual]",
      evidence: "evidence",
      replay: "replay",
      gateProfileId: "gate_profile_id",
      rubricVersion: "rubric_version",
      handoffSummary: "[HandoffSummary]",
      compressedHistorySummary: "[CompressedHistorySummary]",
      rejectHistorySummary: "[RejectHistorySummary]",
      goal: "goal",
      decisionContext: "decision_context",
      risks: "risks",
      openQuestions: "open_questions",
      sourceRefs: "source_refs",
      outputFormat: "[OutputFormat]",
      none: "- なし",
      outputRule: 'JSONのみで返す: {"decision":"approved|rejected","reason":"...","fixes":["..."]}',
    };
  const lines = [
    labels.header,
    `${labels.targetType}: ${reviewInput.targetType}`,
    `${labels.targetId}: ${reviewInput.targetId}`,
    `${labels.title}: ${reviewInput.title}`,
    `${labels.instruction}:`,
    reviewInput.instruction || "-",
    `${labels.constraints}:`,
  ];
  if (Array.isArray(reviewInput.constraints) && reviewInput.constraints.length > 0) {
    reviewInput.constraints.forEach((item) => lines.push(`- ${item}`));
  } else {
    lines.push(labels.none);
  }
  lines.push(`${labels.expectedOutput}:`);
  lines.push(reviewInput.expectedOutput || "-");
  lines.push(`${labels.submission}:`);
  lines.push(reviewInput.submission || labels.none);
  lines.push("");
  lines.push(labels.ritual);
  lines.push(`${labels.evidence}:`);
  lines.push(reviewInput.ritual?.evidence || labels.none);
  lines.push(`${labels.replay}:`);
  lines.push(reviewInput.ritual?.replay || labels.none);
  lines.push(`${labels.gateProfileId}: ${reviewInput.gateProfileId || "-"}`);
  lines.push(`${labels.rubricVersion}: ${reviewInput.rubricVersion || "-"}`);
  if (reviewInput.handoffSummary && typeof reviewInput.handoffSummary === "object") {
    const summary = reviewInput.handoffSummary;
    lines.push("");
    lines.push(labels.handoffSummary);
    lines.push(`${labels.goal}: ${normalizeText(summary.goal) || "-"}`);
    lines.push(`${labels.decisionContext}: ${normalizeText(summary.decisionContext) || "-"}`);
    lines.push(`${labels.risks}:`);
    if (Array.isArray(summary.risks) && summary.risks.length > 0) {
      summary.risks.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(labels.none);
    }
    lines.push(`${labels.openQuestions}:`);
    if (Array.isArray(summary.openQuestions) && summary.openQuestions.length > 0) {
      summary.openQuestions.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(labels.none);
    }
    lines.push(`${labels.sourceRefs}:`);
    if (Array.isArray(summary.sourceRefs) && summary.sourceRefs.length > 0) {
      summary.sourceRefs.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push(labels.none);
    }
  }
  if (Array.isArray(reviewInput.rejectHistorySummary) && reviewInput.rejectHistorySummary.length > 0) {
    lines.push("");
    lines.push(labels.rejectHistorySummary);
    reviewInput.rejectHistorySummary.forEach((item) => lines.push(`- ${item}`));
  }
  if (Array.isArray(reviewInput.compressedHistorySummary) && reviewInput.compressedHistorySummary.length > 0) {
    lines.push("");
    lines.push(labels.compressedHistorySummary);
    reviewInput.compressedHistorySummary.forEach((item) => lines.push(`- ${item}`));
  }
  lines.push("");
  lines.push(labels.outputFormat);
  lines.push(labels.outputRule);
  return lines.join("\n");
}

function parseGateRuntimeResponse(text) {
  const normalized = normalizeText(text);
  if (!normalized) return null;
  const fencedMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1].trim() : normalized;
  const jsonMatch = candidate.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? jsonMatch[0] : candidate;
  try {
    const parsed = JSON.parse(jsonText);
    const decision = normalizeGateDecision(parsed?.decision || parsed?.result);
    const reason = normalizeText(parsed?.reason || parsed?.summary || parsed?.comment);
    const fixes = Array.isArray(parsed?.fixes)
      ? parsed.fixes.map((item) => normalizeText(item)).filter(Boolean)
      : parseGateFixes(parsed?.fixes || "");
    if (decision === "none") return null;
    return {
      decision,
      reason: reason || "-",
      fixes,
    };
  } catch (error) {
    const decision = normalizeGateDecision(
      /rejected|reject/i.test(normalized) ? "rejected"
        : (/approved|approve/i.test(normalized) ? "approved" : "")
    );
    if (decision === "none") return null;
    return {
      decision,
      reason: normalized,
      fixes: decision === "rejected" ? parseGateFixes(normalized) : [],
    };
  }
}

function resetGateRuntimeState() {
  gateRuntimeState.loading = false;
  gateRuntimeState.requestSeq = 0;
  gateRuntimeState.suggestedDecision = "none";
  gateRuntimeState.reason = "";
  gateRuntimeState.fixes = [];
  gateRuntimeState.rawText = "";
  gateRuntimeState.error = "";
}

function renderGateRuntimeSuggestion() {
  const gatePanel = document.getElementById("gatePanel");
  const statusEl = document.getElementById("gateRuntimeStatus");
  const suggestionEl = document.getElementById("gateRuntimeSuggestion");
  if (!gatePanel) return;
  const state = gateRuntimeState.loading
    ? "loading"
    : (gateRuntimeState.error ? "error" : (gateRuntimeState.suggestedDecision !== "none" ? "ready" : "idle"));
  gatePanel.setAttribute("data-gate-runtime-state", state);
  gatePanel.setAttribute("data-gate-suggested-decision", gateRuntimeState.suggestedDecision || "none");
  if (statusEl) {
    if (gateRuntimeState.loading) {
      statusEl.textContent = locale === "en" ? "Gate model is reviewing..." : "Gate モデルが判定中です...";
    } else if (gateRuntimeState.error) {
      statusEl.textContent = locale === "en" ? "Gate model review is unavailable." : "Gate モデル判定は利用できません。";
    } else if (gateRuntimeState.suggestedDecision !== "none") {
      const label = gateRuntimeState.suggestedDecision === "approved"
        ? (locale === "en" ? "approve" : "approve")
        : (locale === "en" ? "reject" : "reject");
      statusEl.textContent = locale === "en"
        ? `Gate model suggested: ${label}`
        : `Gate モデル提案: ${label}`;
    } else {
      statusEl.textContent = locale === "en" ? "Manual review" : "手動レビュー";
    }
  }
  if (!suggestionEl) return;
  if (gateRuntimeState.suggestedDecision === "none") {
    suggestionEl.classList.add("hidden");
    suggestionEl.innerHTML = "";
    return;
  }
  const fixes = gateRuntimeState.fixes.length > 0
    ? gateRuntimeState.fixes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
    : `<li>${escapeHtml(locale === "en" ? "No fixes" : "修正条件なし")}</li>`;
  suggestionEl.classList.remove("hidden");
  suggestionEl.innerHTML = `
    <div class="font-semibold">${escapeHtml(locale === "en" ? "Gate Suggestion" : "Gate 提案")}</div>
    <div class="mt-1 text-xs text-base-content/70">${escapeHtml(locale === "en" ? "decision" : "decision")}: ${escapeHtml(gateRuntimeState.suggestedDecision)}</div>
    <div class="mt-2 text-sm">${escapeHtml(gateRuntimeState.reason || "-")}</div>
    <ul class="mt-2 list-disc pl-5 text-xs text-base-content/75">${fixes}</ul>
  `;
}

async function executeGateRuntimeReview(target, targetKind = "task", gateProfile = null) {
  if (!target || !gateProfile) return;
  const runtimeApi = resolvePalpalCoreRuntimeApi();
  const runtimeConfig = resolvePalRuntimeConfigForExecution(gateProfile);
  if (!runtimeApi || typeof runtimeApi.palChat !== "function" || !runtimeConfig || !runtimeConfig.modelName) {
    gateRuntimeState.error = "unavailable";
    gateRuntimeState.loading = false;
    renderGateRuntimeSuggestion();
    return;
  }
  const requestSeq = gateRuntimeState.requestSeq + 1;
  gateRuntimeState.requestSeq = requestSeq;
  gateRuntimeState.loading = true;
  gateRuntimeState.error = "";
  gateRuntimeState.suggestedDecision = "none";
  gateRuntimeState.reason = "";
  gateRuntimeState.fixes = [];
  gateRuntimeState.rawText = "";
  renderGateRuntimeSuggestion();
  try {
    const [enabledSkillIds, identity] = await Promise.all([
      resolveConfiguredSkillIdsForPal(gateProfile),
      loadAgentIdentityForPal(gateProfile),
    ]);
    const basePrompt = buildOperatingRulesPrompt("gate", locale, targetKind);
    const reviewInput = buildGateReviewInput(target, targetKind, gateProfile, identity);
    const latestUserText = buildGateReviewUserText(reviewInput);
    const contextBuilderApi = resolvePalContextBuilderApi();
    const builderInput = {
      latestUserText,
      sessionMessages: [],
      safetyPrompt: basePrompt,
      role: "gate",
      runtimeKind: "model",
      locale,
      skillSummaries: [],
      soulText: identity?.soul || "",
      roleText: "",
      rubricText: identity?.rubric || "",
    };
    const builtContext = contextBuilderApi && typeof contextBuilderApi.buildPalContext === "function"
      ? contextBuilderApi.buildPalContext(builderInput)
      : null;
    const promptEnvelope = builtContext && builtContext.ok
      ? splitSystemPromptFromContextMessages(builtContext.messages, basePrompt, builderInput.latestUserText)
      : {
        systemPrompt: buildFallbackIdentitySystemPrompt(basePrompt, identity),
        messages: [],
      };
    const response = await runtimeApi.palChat({
      provider: runtimeConfig.provider,
      modelName: runtimeConfig.modelName,
      baseUrl: runtimeConfig.baseUrl,
      apiKey: runtimeConfig.apiKey,
      userText: latestUserText,
      systemPrompt: promptEnvelope.systemPrompt,
      messages: promptEnvelope.messages,
      agentName: gateProfile.id,
      enabledSkillIds,
      workspaceRoot: resolveRuntimeWorkspaceRootForChat(),
      maxTurns: 2,
      debugMeta: {
        stage: "gate_review",
        agentRole: "gate",
        agentId: normalizeText(gateProfile?.id),
        targetKind,
        targetId: normalizeText(target?.id),
        identityVersions: buildDebugIdentityVersions(identity),
        gateProfileId: normalizeText(gateProfile?.id),
        rubricVersion: reviewInput.rubricVersion,
      },
    });
    if (gateRuntimeState.requestSeq !== requestSeq || !gateTarget || gateTarget.id !== target.id) return;
    gateRuntimeState.loading = false;
    gateRuntimeState.rawText = normalizeText(response?.text);
    const parsed = parseGateRuntimeResponse(gateRuntimeState.rawText);
    if (!parsed) {
      gateRuntimeState.error = "parse";
      renderGateRuntimeSuggestion();
      return;
    }
    gateRuntimeState.suggestedDecision = parsed.decision;
    gateRuntimeState.reason = parsed.reason;
    gateRuntimeState.fixes = parsed.fixes;
    if (parsed.decision === "rejected") {
      const reasonInput = document.getElementById("gateReason");
      if (reasonInput && !normalizeText(reasonInput.value)) {
        reasonInput.value = parsed.fixes.length > 0 ? parsed.fixes.join("\n") : parsed.reason;
      }
    }
    renderGateRuntimeSuggestion();
  } catch (error) {
    if (gateRuntimeState.requestSeq !== requestSeq) return;
    gateRuntimeState.loading = false;
    gateRuntimeState.error = "runtime";
    renderGateRuntimeSuggestion();
  }
}

function summarizeRuntimeReplay(toolCalls) {
  const names = [...new Set(
    (Array.isArray(toolCalls) ? toolCalls : [])
      .map((call) => normalizeText(call?.tool_name || call?.toolName))
      .filter(Boolean)
  )];
  if (names.length === 0) return "";
  return `tool-call: ${names.join(" > ")}`;
}

async function executePalRuntimeForTarget(targetId, targetKind = "task") {
  if (!hasPalpalCorePalChatApi()) return;
  const collection = targetKind === "job" ? jobs : tasks;
  const target = collection.find((item) => item.id === targetId);
  if (!target) return;
  const pal = palProfiles.find((entry) => entry.id === target.palId);
  if (!pal) return;
  const runtimeConfig = resolvePalRuntimeConfigForExecution(pal);
  if (!runtimeConfig || !runtimeConfig.modelName) return;
  const runtimeApi = resolvePalpalCoreRuntimeApi();
  if (!runtimeApi || typeof runtimeApi.palChat !== "function") return;
  try {
    const [enabledSkillIds, identity] = await Promise.all([
      resolveConfiguredSkillIdsForPal(pal),
      loadAgentIdentityForPal(pal),
    ]);
    const role = normalizePalRole(pal.role);
    const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
    const installedSkillIds = Array.isArray(settingsState.registeredSkills)
      ? settingsState.registeredSkills.map((skillId) => normalizeSkillId(skillId)).filter(Boolean)
      : [];
    const skillCatalogItems = CLAWHUB_SKILL_REGISTRY.map((skill) => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
    }));
    const skillResolverApi = resolveAgentSkillResolverApi();
    const resolvedByApi = skillResolverApi
      ? skillResolverApi.resolveSkillSummariesForContext({
        runtimeKind,
        configuredSkillIds: enabledSkillIds,
        installedSkillIds,
        catalogItems: skillCatalogItems,
      })
      : null;
    const skillSummaries = Array.isArray(resolvedByApi?.skillSummaries)
      ? resolvedByApi.skillSummaries
      : fallbackResolveSkillSummaries(runtimeKind, enabledSkillIds, installedSkillIds, skillCatalogItems);
    const workspaceRoot = resolveRuntimeWorkspaceRootForChat();
    const basePrompt = buildOperatingRulesPrompt(role, locale, targetKind);
    const contextBuilderApi = resolvePalContextBuilderApi();
    const builderInput = {
      latestUserText: buildPalRuntimeUserText(target, targetKind),
      sessionMessages: [],
      safetyPrompt: basePrompt,
      role,
      runtimeKind,
      locale,
      skillSummaries,
      soulText: identity?.soul || "",
      roleText: identity?.role || "",
      rubricText: identity?.rubric || "",
    };
    const builtContext = contextBuilderApi && typeof contextBuilderApi.buildPalContext === "function"
      ? contextBuilderApi.buildPalContext(builderInput)
      : null;
    const promptEnvelope = builtContext && builtContext.ok
      ? splitSystemPromptFromContextMessages(builtContext.messages, basePrompt, builderInput.latestUserText)
      : {
        systemPrompt: buildFallbackIdentitySystemPrompt(basePrompt, identity),
        messages: [],
      };
    const response = await runtimeApi.palChat({
      provider: runtimeConfig.provider,
      modelName: runtimeConfig.modelName,
      baseUrl: runtimeConfig.baseUrl,
      apiKey: runtimeConfig.apiKey,
      userText: builderInput.latestUserText,
      systemPrompt: promptEnvelope.systemPrompt,
      messages: promptEnvelope.messages,
      agentName: pal.id,
      enabledSkillIds,
      workspaceRoot,
      maxTurns: 4,
      debugMeta: {
        stage: "worker_runtime",
        agentRole: "worker",
        agentId: normalizeText(pal?.id),
        targetKind,
        targetId: normalizeText(target?.id),
        identityVersions: buildDebugIdentityVersions(identity),
        gateProfileId: normalizeText(target?.gateProfileId),
        handoffPolicy: normalizeText(settingsState.contextHandoffPolicy || "balanced"),
        enabledSkillIds,
      },
    });
    const latest = collection.find((item) => item.id === targetId);
    if (!latest) return;
    const text = normalizeText(response?.text);
    if (text) latest.evidence = text;
    const replaySummary = summarizeRuntimeReplay(response?.toolCalls);
    if (replaySummary) latest.replay = replaySummary;
    latest.updatedAt = formatNow();
    appendEvent(
      targetKind,
      latest.id,
      "runtime",
      `${latest.id} の実行結果を更新しました`,
      `${latest.id} runtime result updated`
    );
    rerenderAll();
  } catch (error) {
    appendEvent(
      targetKind,
      targetId,
      "runtime_error",
      `${targetId} の実行でエラーが発生しました`,
      `${targetId} runtime execution failed`
    );
    rerenderAll();
  }
}

async function runTaskAction(action, taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    setMessage("MSG-PPH-1004");
    return;
  }
  selectedTaskId = taskId;
  if (action === "detail") {
    writeBoardStateSnapshot();
    renderDetail();
    return;
  }
  if (action === "start") {
    if (task.status !== "assigned") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchTask(task, "in_progress", "working");
    appendEvent("task", task.id, "in_progress", `${task.id} を実行中へ遷移`, `${task.id} moved to in_progress`);
    void executePalRuntimeForTarget(task.id, "task");
    setMessage("MSG-PPH-0007");
  } else if (action === "submit") {
    if (task.status !== "in_progress") {
      setMessage("MSG-PPH-1006");
      return;
    }
    const gateSelection = await assignGateProfileToTargetWithRouting(task);
    touchTask(task, "to_gate", "pending");
    const gateExplanation = formatGateRoutingExplanation(gateSelection?.explanation);
    appendEvent(
      "task",
      task.id,
      "to_gate",
      gateExplanation.ja
        ? `${task.id} をGate提出待ちに更新 (${gateExplanation.ja})`
        : `${task.id} をGate提出待ちに更新`,
      gateExplanation.en
        ? `${task.id} moved to to_gate (${gateExplanation.en})`
        : `${task.id} moved to to_gate`
    );
    setMessage("MSG-PPH-0003");
  } else if (action === "gate") {
    await openGate(task.id, "task");
    return;
  } else if (action === "resubmit") {
    if (task.status !== "rejected") {
      setMessage("MSG-PPH-1006");
      return;
    }
    await assignGateProfileToTargetWithRouting(task, task.gateProfileId);
    touchTask(task, "to_gate", "pending", "-", {
      decision: "none",
      reason: "-",
      fixes: [],
    });
    appendEvent("resubmit", task.id, "ok", `${task.id} を再提出`, `${task.id} resubmitted`);
    setMessage("MSG-PPH-0005");
  }
  rerenderAll();
}

async function runJobAction(action, jobId) {
  const job = jobs.find((x) => x.id === jobId);
  if (!job) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (action === "start") {
    if (job.status !== "assigned") {
      setMessage("MSG-PPH-1006");
      return;
    }
    touchJob(job, "in_progress", "working");
    appendEvent("job", job.id, "in_progress", `${job.id} を実行中へ遷移`, `${job.id} moved to in_progress`);
    void executePalRuntimeForTarget(job.id, "job");
    setMessage("MSG-PPH-0007");
  } else if (action === "submit") {
    if (job.status !== "in_progress") {
      setMessage("MSG-PPH-1006");
      return;
    }
    const gateSelection = await assignGateProfileToTargetWithRouting(job);
    touchJob(job, "to_gate", "pending");
    const gateExplanation = formatGateRoutingExplanation(gateSelection?.explanation);
    appendEvent(
      "job",
      job.id,
      "to_gate",
      gateExplanation.ja
        ? `${job.id} をGate提出待ちに更新 (${gateExplanation.ja})`
        : `${job.id} をGate提出待ちに更新`,
      gateExplanation.en
        ? `${job.id} moved to to_gate (${gateExplanation.en})`
        : `${job.id} moved to to_gate`
    );
    setMessage("MSG-PPH-0003");
  } else if (action === "gate") {
    await openGate(job.id, "job");
    return;
  } else if (action === "resubmit") {
    if (job.status !== "rejected") {
      setMessage("MSG-PPH-1006");
      return;
    }
    await assignGateProfileToTargetWithRouting(job, job.gateProfileId);
    touchJob(job, "to_gate", "pending", "-", {
      decision: "none",
      reason: "-",
      fixes: [],
    });
    appendEvent("resubmit", job.id, "ok", `${job.id} を再提出`, `${job.id} resubmitted`);
    setMessage("MSG-PPH-0005");
  }
  rerenderAll();
}

function findGateTarget() {
  if (!gateTarget) return null;
  if (gateTarget.kind === "job") {
    return jobs.find((job) => job.id === gateTarget.id) || null;
  }
  return tasks.find((task) => task.id === gateTarget.id) || null;
}

async function openGate(targetId, targetKind = "task") {
  const collection = targetKind === "job" ? jobs : tasks;
  const target = collection.find((item) => item.id === targetId);
  if (!target) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (target.status !== "to_gate") {
    setMessage("MSG-PPH-1006");
    return;
  }
  const gateSelection = await assignGateProfileToTargetWithRouting(target);
  const resolvedGate = gateSelection?.gate || null;
  gateTarget = {
    kind: targetKind,
    id: targetId,
    gateProfileId: normalizeText(resolvedGate?.id),
  };
  const gatePanel = document.getElementById("gatePanel");
  const gateProfileSummary = document.getElementById("gateProfileSummary");
  const reasonInput = document.getElementById("gateReason");
  const defaultGate = getDefaultGateProfile();
  const gateDisplayName = normalizeText(resolvedGate?.displayName || resolvedGate?.id || "");
  resetGateRuntimeState();
  if (reasonInput) reasonInput.value = "";
  if (gateProfileSummary) {
    gateProfileSummary.textContent = gateDisplayName
      ? `${tDyn("gateReviewBy")}: ${gateDisplayName}`
      : `${tDyn("gateReviewBy")}: -`;
  }
  renderGateReasonTemplates();
  if (gatePanel) {
    gatePanel.setAttribute("data-gate-state", "open");
    gatePanel.setAttribute("data-gate-kind", targetKind);
    gatePanel.setAttribute("data-default-gate-id", normalizeText(defaultGate?.id));
    gatePanel.setAttribute("data-gate-profile-id", normalizeText(resolvedGate?.id));
    gatePanel.setAttribute("data-gate-runtime-state", "idle");
    gatePanel.setAttribute("data-gate-suggested-decision", "none");
    gatePanel.classList.remove("hidden");
  }
  renderGateRuntimeSuggestion();
  void executeGateRuntimeReview(target, targetKind, resolvedGate);
  if (reasonInput) reasonInput.focus();
}

function closeGate() {
  gateTarget = null;
  resetGateRuntimeState();
  const gatePanel = document.getElementById("gatePanel");
  const gateProfileSummary = document.getElementById("gateProfileSummary");
  if (gateProfileSummary) gateProfileSummary.textContent = "";
  if (gatePanel) {
    gatePanel.setAttribute("data-gate-state", "closed");
    gatePanel.setAttribute("data-gate-kind", "none");
    gatePanel.setAttribute("data-default-gate-id", "");
    gatePanel.setAttribute("data-gate-profile-id", "");
    gatePanel.setAttribute("data-gate-runtime-state", "idle");
    gatePanel.setAttribute("data-gate-suggested-decision", "none");
    gatePanel.classList.add("hidden");
  }
  renderGateRuntimeSuggestion();
}

function runGate(decision) {
  const target = findGateTarget();
  if (!target) {
    setMessage("MSG-PPH-1004");
    return;
  }
  if (target.status !== "to_gate") {
    setMessage("MSG-PPH-1006");
    return;
  }
  const isJob = gateTarget?.kind === "job";
  const isRejectDecision = decision === "reject";
  const reasonInput = document.getElementById("gateReason");
  const typedReason = normalizeText(reasonInput?.value);
  const suggestedReason = decision === "reject"
    ? (gateRuntimeState.fixes.length > 0 ? gateRuntimeState.fixes.join("\n") : gateRuntimeState.reason)
    : gateRuntimeState.reason;
  const reason = typedReason || suggestedReason;
  const gateResult = buildGateResultRecord(
    isRejectDecision ? "rejected" : "approved",
    reason
  );
  if (isRejectDecision) {
    const count = reason
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter(Boolean).length;
    if (count > 3) {
      setMessage("MSG-PPH-1007");
      return;
    }
    if (isJob) {
      touchJob(target, "rejected", "rejected", gateResult.fixCondition || "修正条件を追加", gateResult);
    } else {
      touchTask(target, "rejected", "rejected", gateResult.fixCondition || "修正条件を追加", gateResult);
    }
    appendEvent("gate", target.id, "rejected", `${target.id} を差し戻しました`, `${target.id} rejected`);
  } else {
    if (isJob) {
      touchJob(target, "done", "approved", "-", gateResult);
    } else {
      touchTask(target, "done", "approved", "-", gateResult);
    }
    appendEvent("gate", target.id, "approved", `${target.id} を承認しました`, `${target.id} approved`);
  }
  setMessage("MSG-PPH-0004");
  closeGate();
  if (!isRejectDecision && !isJob && tasks.every((t) => t.status === "done")) {
    appendEvent("plan", "PLAN-001", "completed", "Plan完了を通知", "Plan completion announced");
    setMessage("MSG-PPH-0008");
  }
  if (isRejectDecision) {
    navigateToResubmitTarget(target.id, isJob ? "job" : "task");
    return;
  }
  rerenderAll();
}

function rerenderAll() {
  writeBoardStateSnapshot();
  renderJobBoard();
  renderTaskBoard();
  renderEventLog();
  renderPalList();
  renderIdentityEditorModal();
  renderProjectTab();
  renderGuideProjectFocus();
  renderSettingsTab();
  renderDetail();
}

function bindStaticEvents() {
  document.querySelector(".workspace-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn[data-tab]");
    if (!btn) return;
    setWorkspaceTab(btn.dataset.tab);
  });

  document.getElementById("closeDrawer").onclick = () => {
    selectedTaskId = null;
    writeBoardStateSnapshot();
    renderDetail();
  };

  document.getElementById("closeGate").onclick = closeGate;
  const closePalConfig = document.getElementById("closePalConfigModal");
  if (closePalConfig) closePalConfig.onclick = closePalConfigModal;
  document.getElementById("approveTask").onclick = () => runGate("approve");
  document.getElementById("rejectTask").onclick = () => runGate("reject");
  const gateTemplateList = document.getElementById("gateReasonTemplateList");
  if (gateTemplateList) {
    gateTemplateList.addEventListener("click", (e) => {
      const button = e.target.closest("button[data-gate-template-id]");
      if (!button) return;
      appendGateReasonTemplateById(button.dataset.gateTemplateId);
    });
  }
  const errorToastClose = document.getElementById("errorToastClose");
  if (errorToastClose) {
    errorToastClose.onclick = () => hideErrorToast();
  }

  document.getElementById("taskBoard").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;
    runTaskAction(button.dataset.action, button.dataset.taskId);
  });

  document.getElementById("jobBoard").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-job-action]");
    if (!button) return;
    runJobAction(button.dataset.jobAction, button.dataset.jobId);
  });

  const eventSearchInput = document.getElementById("eventSearchInput");
  if (eventSearchInput) {
    eventSearchInput.addEventListener("input", (e) => {
      eventSearchQuery = String(e.target.value || "");
      eventPage = 1;
      renderEventLog();
    });
  }

  const eventTypeFilterSelect = document.getElementById("eventTypeFilter");
  if (eventTypeFilterSelect) {
    eventTypeFilterSelect.addEventListener("change", (e) => {
      eventTypeFilter = String(e.target.value || "all");
      eventPage = 1;
      renderEventLog();
    });
  }

  const eventPrevPage = document.getElementById("eventPrevPage");
  if (eventPrevPage) {
    eventPrevPage.addEventListener("click", () => {
      if (eventPage <= 1) return;
      eventPage -= 1;
      renderEventLog();
    });
  }

  const eventNextPage = document.getElementById("eventNextPage");
  if (eventNextPage) {
    eventNextPage.addEventListener("click", () => {
      const total = filteredEvents().length;
      const pageCount = Math.max(1, Math.ceil(total / EVENT_LOG_PAGE_SIZE));
      if (eventPage >= pageCount) return;
      eventPage += 1;
      renderEventLog();
    });
  }

  document.getElementById("guideComposer").addEventListener("submit", (e) => {
    e.preventDefault();
    sendGuideMessage();
  });

  const guideInput = document.getElementById("guideInput");
  guideInput.addEventListener("focus", () => {
    setGuideComposerFocused(true);
  });
  guideInput.addEventListener("input", () => {
    refreshGuideMentionMenu();
  });
  guideInput.addEventListener("blur", () => {
    setGuideComposerFocused(false);
    window.setTimeout(() => {
      closeGuideMentionMenu();
    }, 80);
  });
  guideInput.addEventListener("keydown", (e) => {
    if (handleGuideMentionMenuKeydown(e)) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendGuideMessage();
    }
  });

  document.getElementById("gatePanel").addEventListener("click", (e) => {
    if (e.target.id === "gatePanel") {
      closeGate();
    }
  });
  const palConfigModal = document.getElementById("palConfigModal");
  if (palConfigModal) {
    palConfigModal.addEventListener("click", (e) => {
      if (e.target.id === "palConfigModal") {
        closePalConfigModal();
      }
    });
  }
  const identityEditorModal = document.getElementById("identityEditorModal");
  if (identityEditorModal) {
    identityEditorModal.addEventListener("click", (e) => {
      if (e.target.id === "identityEditorModal") {
        closeIdentityEditorModal();
      }
    });
  }
  const closeIdentityEditor = document.getElementById("closeIdentityEditorModal");
  if (closeIdentityEditor) closeIdentityEditor.onclick = closeIdentityEditorModal;

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeGate();
    closePalConfigModal();
    closeIdentityEditorModal();
    hideErrorToast();
  });
}

async function init() {
  await refreshCoreCatalogFromRuntime();
  const projectSnapshot = readProjectStateSnapshot();
  if (projectSnapshot) {
    applyProjectStateSnapshot(projectSnapshot);
  } else {
    ensureProjectStateConsistency();
    writeProjectStateSnapshot();
  }
  selectedTaskId = tasks[0].id;
  setWorkspaceTab("guide");
  bindStaticEvents();
  const persisted = await loadSettingsSnapshotWithFallback();
  if (persisted) {
    applySettingsSnapshot(persisted);
  } else {
    markSettingsSavedBaseline();
  }
  const profileSnapshot = readPalProfilesSnapshotWithFallback();
  if (profileSnapshot) {
    applyPalProfilesSnapshot(profileSnapshot);
  } else {
    syncPalProfilesRegistryRefs();
  }
  await ensureBuiltInDebugPurposeIdentities();
  const boardSnapshot = readBoardStateSnapshot();
  if (boardSnapshot) {
    applyBoardStateSnapshot(boardSnapshot);
  }
  applyI18n();
}

void init();


