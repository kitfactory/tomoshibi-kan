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
    "UI-PPH-0007": "Gate待ち",
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
    "UI-PPH-0207": "Resident Preview Slot",
    "UI-PPH-0208": "3D Coming Soon",
    "UI-PPH-0209": "Reject",
    "UI-PPH-0210": "Approve",
    "UI-PPH-0211": "Agent / Guide",
    "UI-PPH-0212": "Agent / Gate",
    "UI-PPH-0213": "Agent / Resident",
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
    "UI-PPH-0207": "Resident Preview Slot",
    "UI-PPH-0208": "3D Coming Soon",
    "UI-PPH-0209": "Reject",
    "UI-PPH-0210": "Approve",
    "UI-PPH-0211": "Agent / Guide",
    "UI-PPH-0212": "Agent / Gate",
    "UI-PPH-0213": "Agent / Resident",
    "UI-PPH-0214": "Safety",
    "UI-PPH-0215": "Workspace",
  },
};

const DYNAMIC_TEXT = {
  ja: {
    detail: "詳細",
    start: "開始",
    submit: "提出",
    gate: "Gate審査",
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
    noTask: "Taskはまだありません。",
    noJob: "Cronはまだありません。",
    schedule: "実行間隔",
    instruction: "指示",
    lastRun: "最終実行",
    gateProfile: "Gate",
    gateReviewBy: "Gate審査",
    gateOnlyToGate: "現在の状態ではGate審査は実行できません。",
    rejectReasonPlaceholder: "差し戻し理由（最大3項目）",
    gateReasonTemplateLabel: "理由テンプレート",
    settingsReadonly: "MVP: 設定は閲覧のみ",
    view: "表示",
    guideHint: "Guideと会話しながらタスク化と進捗更新ができます。",
    guideInputPlaceholder: "Guideへメッセージを入力（Enterで送信 / Shift+Enterで改行）",
    guideSend: "送信",
    guideSending: "送信中",
    senderGuide: "guide",
    senderYou: "you",
    senderSystem: "system",
    errorToastTitle: "Error",
    errorToastClose: "close",
    eventSearchPlaceholder: "イベント検索（ID/概要/種別）",
    eventTypeAll: "種別: すべて",
    eventTypeDispatch: "種別: dispatch",
    eventTypeGate: "種別: gate",
    eventTypeTask: "種別: task",
    eventTypeJob: "種別: cron",
    eventTypeResubmit: "種別: resubmit",
    eventTypePlan: "種別: plan",
    pagePrev: "前へ",
    pageNext: "次へ",
    eventNoMatch: "条件に一致するイベントはありません。",
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
    ja: "TaskをPalへ割り当てました。",
    en: "Tasks dispatched to resident.",
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
    ja: "Pal設定を適用しました。",
    en: "Resident constraints applied.",
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
    ja: "現在の状態ではこの操作は実行できません。",
    en: "This action is not available in the current state.",
  },
  "MSG-PPH-1007": {
    ja: "Reject入力が上限を超えています。",
    en: "Reject input exceeds limit.",
  },
  "MSG-PPH-1008": {
    ja: "完了状態に不整合があります。状態を確認してください。",
    en: "Completion state is inconsistent. Check statuses.",
  },
  "MSG-PPH-1010": {
    ja: "Guide モデルが未設定です。Settings でモデルを設定してください。",
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
        "- 結果は `decision`, `reason`, `fixes` が明確に分かる形で返す。",
        "- approve の場合は、なぜ証拠が十分かを明示する。",
        "- reject の場合は、具体的な修正条件を箇条書きで返す。",
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
        `- 割り当てられた${targetKind === "job" ? "Cron" : "Task"}を段階的に実行する。`,
        "- 実行結果は確認できた証拠と一緒に簡潔に報告する。",
        "- 進められない場合は、詰まりどころと不足情報を明示する。",
        "- 不要な議論へ広げず、実行と結果に集中する。",
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
      "- plan、task 分解、冬坂 / 久瀬 / 白峰 への分割、trace / fix / verify への分割、進め方の確定、調査依頼、実装依頼、確認依頼は work intent として扱う。",
      "- work intent であれば、目的を満たすために必要な情報を Guide から提案し、必要に応じて質問する。可能なら質問だけで止まらず提案で前へ進める。",
      "- 依頼の輪郭がまだ半分ほどで、対象・問題・期待結果がぼんやりしている段階では、3 案提示を急がない。まず相槌で受け止め、見立てや視点を 1 つ添え、答えやすいオープンな質問を 1 つ返す。",
      "- ぼんやりした段階では、少ないターンで結論を急ぎすぎず、5〜10ターンかけてもよいので自然に輪郭を整える。",
      "- 3 案提示は、対象や困りごとの輪郭がある程度見えてから使う。ユーザーが『まず何を見ればよいか』を求める時や、比較候補を出した方が前に進む時に限って使う。",
      "- 3 案を出す時は、これまでの会話からあり得そうな具体的な仕事案を 3 つ、可能性の高い順で提示し、最も有力な 1 案を推薦する。",
      "- 3 案は Markdown の番号付き箇条書きで出し、それぞれ、何に着目した案かを短く明示する。例えば、保存処理そのものを見る案、reload 後の再読込を見る案、UI state 反映を見る案、のように観点を分ける。",
      "- 提案は短く返答しやすい形にし、対象・問題・期待結果が分かる粒度で出す。",
      "- 推薦する案では、なぜそれを先に見るのかを一言で添える。",
      "- 3 案を出した後は、`1でよいですか？` のように番号や yes/no で返答しやすい締めにする。",
      "- work intent で、対象、問題、期待結果、再現手順、関連ファイル、使える tool のうち主要な材料が揃っていれば plan 作成を優先する。",
      "- task 作成を止める blocker が 1 つだけある時だけ追加確認する。軽微な不足情報は assumptions として constraints に残し、同じ確認質問を繰り返さない。",
      "- debug workspace で明示的に breakdown を求められた時は、冬坂 / 久瀬 / 白峰 の 3 段に整理することを優先する。",
      "- 候補 Pal や available tool が文脈にある時は、担当 Pal をユーザーへ聞き返さず自分で選ぶ。",
      "- どの Pal に何を担当させるかを決め、実行後にどの Gate で評価すべきかを意識して計画する。",
      "- 回答は簡潔にし、次の行動が分かる形で示す。",
    ].join("\n")
    : [
      "You are Guide.",
      "- First decide whether the latest user turn is moving toward a work request.",
      "- Treat requests for a plan, task breakdown, Fuyusaka / Kuze / Shiramine split, trace / fix / verify split, execution flow, investigation, implementation, or verification as work intent.",
      "- When work intent exists, help the user complete the request by proposing and, if needed, asking for the missing information. Prefer proposal over a bare follow-up question.",
      "- When the request shape is still under roughly half clear and the target, problem, or expected outcome is still blurry, do not rush into three options. First acknowledge the concern, offer one perspective, and ask one open question that helps the user keep talking.",
      "- Do not optimize for ending in very few turns when the request is still blurry. It is acceptable to spend 5-10 turns clarifying naturally before planning.",
      "- Use three options only after the rough request shape is visible, or when the user explicitly asks what to check first or asks for comparable paths forward.",
      "- When you do use three options, propose three concrete likely work options grounded in the conversation so far, ordered by likelihood, and recommend the most plausible one.",
      "- Render the options as a numbered Markdown list and make each option explicit about its angle, such as persistence itself, reload rehydration, or UI state reflection.",
      "- Make options easy to answer with a short choice, keep each option specific about target, problem, and expected outcome, and close with a short prompt such as `Shall we go with 1?`.",
      "- When you recommend one option, add one short reason for why that angle should be checked first.",
      "- When the main inputs are already present in a work request (target, problem, expected outcome, repro steps, relevant files, or available tools), prefer creating the plan.",
      "- Ask a follow-up only when one blocking fact prevents task creation. Treat minor gaps as assumptions in constraints and do not repeat the same clarification.",
      "- In the debug workspace, when the user explicitly wants a breakdown, prefer a three-step Fuyusaka / Kuze / Shiramine plan.",
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
    ja: "仕様との整合不足",
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

function safeStringify(value, fallback = "{}") {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
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

let TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY = resolveProviderRegistry(
  typeof window !== "undefined"
    ? (window.TOMOSHIBIKAN_CORE_PROVIDERS || window.PALPAL_CORE_PROVIDERS)
    : []
);

let PROVIDER_OPTIONS = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.map((provider) => provider.id);
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
  const matched = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find(
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

const FALLBACK_TOMOSHIBIKAN_CORE_MODELS = [
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

function resolveTomoshibikanCoreModels() {
  if (typeof window === "undefined") {
    return normalizeCoreModelCatalog(FALLBACK_TOMOSHIBIKAN_CORE_MODELS);
  }
  const direct = normalizeCoreModelCatalog(window.TOMOSHIBIKAN_CORE_MODELS || window.PALPAL_CORE_MODELS);
  if (direct.length > 0) return direct;

  const nestedModels = normalizeCoreModelCatalog(window.TOMOSHIBIKAN_CORE_MODEL_REGISTRY?.models || window.PALPAL_CORE_MODEL_REGISTRY?.models);
  if (nestedModels.length > 0) return nestedModels;

  const nestedByProvider = normalizeCoreModelCatalog(
    flattenProviderModelMapCatalog(window.TOMOSHIBIKAN_CORE_MODEL_REGISTRY || window.PALPAL_CORE_MODEL_REGISTRY)
  );
  if (nestedByProvider.length > 0) return nestedByProvider;

  if (hasRuntimeCatalogBridge()) {
    return [];
  }

  return normalizeCoreModelCatalog(FALLBACK_TOMOSHIBIKAN_CORE_MODELS);
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

let TOMOSHIBIKAN_CORE_MODEL_REGISTRY = resolveTomoshibikanCoreModels();
let TOMOSHIBIKAN_CORE_MODEL_OPTIONS_BY_PROVIDER = buildModelOptionsByProvider(
  TOMOSHIBIKAN_CORE_MODEL_REGISTRY,
  PROVIDER_OPTIONS
);
let MODEL_OPTIONS = buildModelOptionList(TOMOSHIBIKAN_CORE_MODEL_REGISTRY, [DEV_LMSTUDIO_MODEL_NAME]);
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
const SEEDED_SECONDARY_MODEL_PROVIDER = TOMOSHIBIKAN_CORE_MODEL_REGISTRY.find(
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
  registeredToolCapabilities: [],
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
window.DEFAULT_PROJECT_FILE_HINTS = DEFAULT_PROJECT_FILE_HINTS;
window.PROJECTS_LOCAL_STORAGE_KEY = PROJECTS_LOCAL_STORAGE_KEY;
window.LEGACY_PROJECTS_LOCAL_STORAGE_KEYS = LEGACY_PROJECTS_LOCAL_STORAGE_KEYS;
window.projectState = projectState;
window.getCurrentLocale = () => locale;

let guideMessages = [
  {
    timestamp: "09:20",
    sender: "guide",
    text: {
      ja: "Plan Cardを立てます。Taskを3件に分解します。",
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
    title: "Guideプランの確認",
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
    description: "Workspace / Task Detail / Gate / Settings のダミー画面を作成する",
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
    description: "UI-PPH-xxxx の ja/en 文言セットを定義する",
    palId: "pal-delta",
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
    title: "依存アップデートの朝会確認",
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
    description: "毎週金曜に E2E の成功率と失敗パターンを集計して Gate へ提出する",
    palId: "pal-delta",
    schedule: "Fri 17:00",
    instruction: "npm run test:e2e の実行結果を集計し、気になる点を1つ添えて報告する",
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
    displayName: "燈子さん",
    persona: "灯火館の管理人として来訪者を迎え、話を受け止め、住人たちへやわらかく橋渡しする。",
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
    displayName: "真壁",
    persona: "灯火館の古参住人として、流れと仕上がりの違和感を静かに見届け、最後に重い一言を添える。",
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
    displayName: "冬坂",
    persona: "灯火館の住人でありリサーチャーとして、市場・事例・利用者像などの外部調査を担い、比較やレポートで判断材料を持ち帰る。",
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
    displayName: "久瀬",
    persona: "灯火館の住人でありプログラマとして、ソフトウェアの調査・再現・原因分析・実装・修正を引き受け、手を動かしながら形を起こしていく。",
    provider: "anthropic",
    models: [],
    cliTools: ["Codex"],
    skills: ["codex-file-read", "codex-file-edit", "codex-shell-command"],
    status: "active",
  },
  {
    id: "pal-delta",
    role: "worker",
    runtimeKind: "tool",
    displayName: "白峰",
    persona: "灯火館の住人でありライターとして、説明・文書化・命名を整え、言葉で人と人をつなぐ。",
    provider: "openai",
    models: [],
    cliTools: ["Codex"],
    skills: ["codex-file-read", "codex-file-edit", "codex-test-runner"],
    status: "active",
  },
];
const BUILT_IN_PROFILE_IDS = new Set(INITIAL_PAL_PROFILES.map((pal) => pal.id));
const LEGACY_BUILT_IN_PROFILE_IDS = new Set([
  ...BUILT_IN_PROFILE_IDS,
  "pal-gamma",
]);
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
    ja: "TASK-001 を冬坂に割り当てました。",
    en: "TASK-001 dispatched to the Research resident.",
  }, "09:24"),
  makeEvent("gate", "TASK-003", "rejected", {
    ja: "TASK-003 を差し戻しました。",
    en: "TASK-003 was rejected.",
  }, "09:46"),
  makeEvent("dispatch", "JOB-001", "ok", {
    ja: "JOB-001 を冬坂に割り当てました。",
    en: "JOB-001 dispatched to the Research resident.",
  }, "09:52"),
];
let progressLogEntries = [];
let planArtifacts = [];
let detailRenderToken = 0;

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

function renderInlineMarkdown(text) {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, url) => {
    const safeLabel = label;
    const safeUrl = escapeHtml(url);
    return `<a href="${safeUrl}" target="_blank" rel="noreferrer noopener">${safeLabel}</a>`;
  });
  escaped = escaped.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return escaped;
}

function renderMarkdownText(text) {
  const normalized = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  const codeBlocks = [];
  const withPlaceholders = normalized.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_match, language, code) => {
    const index = codeBlocks.length;
    codeBlocks.push({
      language: escapeHtml(language || ""),
      code: escapeHtml(code.replace(/\n$/, "")),
    });
    return `@@CODE_BLOCK_${index}@@`;
  });

  const rendered = withPlaceholders
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^@@CODE_BLOCK_\d+@@$/.test(block)) return block;
      const lines = block.split("\n");
      const ordered = lines.every((line) => /^\d+\.\s+/.test(line.trim()));
      const unordered = lines.every((line) => /^[-*]\s+/.test(line.trim()));
      if (ordered || unordered) {
        const tag = ordered ? "ol" : "ul";
        const items = lines
          .map((line) => line.trim().replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""))
          .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
          .join("");
        return `<${tag}>${items}</${tag}>`;
      }
      return `<p>${lines.map((line) => renderInlineMarkdown(line.trim())).join("<br>")}</p>`;
    })
    .join("");

  return rendered.replace(/@@CODE_BLOCK_(\d+)@@/g, (_match, indexText) => {
    const block = codeBlocks[Number(indexText)];
    if (!block) return "";
    const languageClass = block.language ? ` class="language-${block.language}"` : "";
    return `<pre><code${languageClass}>${block.code}</code></pre>`;
  });
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
  return "住人";
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
      .filter((profile) => !LEGACY_BUILT_IN_PROFILE_IDS.has(normalizeText(profile.id)) || isBuiltInProfileId(profile.id))
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

function isBuiltInProfileId(profileId) {
  return BUILT_IN_PROFILE_IDS.has(normalizeText(profileId));
}

function resolveBuiltInProfileDefinition(profileId) {
  const normalizedId = normalizeText(profileId);
  return INITIAL_PAL_PROFILES.find((profile) => profile.id === normalizedId) || null;
}

function syncBuiltInProfileMetadata() {
  const nextProfiles = [];
  INITIAL_PAL_PROFILES.forEach((builtInProfile) => {
    const existing = palProfiles.find((profile) => profile.id === builtInProfile.id);
    if (existing) {
      nextProfiles.push({
        ...clonePalProfileRecord(existing),
        role: builtInProfile.role,
        displayName: builtInProfile.displayName,
        persona: builtInProfile.persona,
      });
      return;
    }
    nextProfiles.push(clonePalProfileRecord(builtInProfile));
  });
  palProfiles
    .filter((profile) => !LEGACY_BUILT_IN_PROFILE_IDS.has(normalizeText(profile.id)))
    .forEach((profile) => {
      nextProfiles.push(clonePalProfileRecord(profile));
    });
  palProfiles.splice(0, palProfiles.length, ...nextProfiles);
  syncWorkspaceAgentSelection();
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
      ? (locale === "ja" ? "根拠を満たしているため承認" : "Approved because the evidence is sufficient.")
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
    planId: normalizeText(input?.planId) || "PLAN-001",
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
    planId: normalizeText(input?.planId) || "PLAN-001",
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

function providerLabel(providerId) {
  const entry = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === providerId);
  return entry ? entry.label : providerId;
}

function providerIdFromInput(value) {
  if (!value) return DEFAULT_PROVIDER_ID;
  const asId = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find((provider) => provider.id === value);
  if (asId) return asId.id;
  const asLabel = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.find((provider) => provider.label === value);
  return asLabel ? asLabel.id : DEFAULT_PROVIDER_ID;
}

function isApiKeyRequiredForProvider(providerId) {
  return !OPTIONAL_API_KEY_PROVIDERS.has(providerIdFromInput(providerId));
}

function resolveProviderForModelName(modelName, fallbackProviderId = DEFAULT_PROVIDER_ID) {
  const normalizedName = normalizeText(modelName);
  const preferredProviderId = providerIdFromInput(fallbackProviderId);
  if (!normalizedName) return preferredProviderId;
  const preferredPairExists = TOMOSHIBIKAN_CORE_MODEL_REGISTRY.some(
    (entry) => entry.name === normalizedName && providerIdFromInput(entry.provider) === preferredProviderId
  );
  if (preferredPairExists) return preferredProviderId;
  const matched = TOMOSHIBIKAN_CORE_MODEL_REGISTRY.find((entry) => entry.name === normalizedName);
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

function resolveTomoshibikanCoreRuntimeApi() {
  const runtime = resolveWindowBridge("TomoshibikanCoreRuntime", "PalpalCoreRuntime");
  if (!runtime || typeof runtime.guideChat !== "function") return null;
  return runtime;
}

function hasTomoshibikanCoreRuntimeApi() {
  return Boolean(resolveTomoshibikanCoreRuntimeApi());
}

function hasTomoshibikanCorePalChatApi() {
  const runtime = resolveTomoshibikanCoreRuntimeApi();
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

  TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY = providers;
  PROVIDER_OPTIONS = TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY.map((provider) => provider.id);
  DEFAULT_PROVIDER_ID = PROVIDER_OPTIONS[0] || DEFAULT_PROVIDER_ID || "openai";
  TOMOSHIBIKAN_CORE_MODEL_REGISTRY = models;
  TOMOSHIBIKAN_CORE_MODEL_OPTIONS_BY_PROVIDER = buildModelOptionsByProvider(
    TOMOSHIBIKAN_CORE_MODEL_REGISTRY,
    PROVIDER_OPTIONS
  );
  MODEL_OPTIONS = buildModelOptionList(TOMOSHIBIKAN_CORE_MODEL_REGISTRY, [DEV_LMSTUDIO_MODEL_NAME]);
  DEFAULT_MODEL_NAME = DEV_LMSTUDIO_MODEL_NAME || MODEL_OPTIONS[0] || "";

  if (typeof window !== "undefined") {
    window.TOMOSHIBIKAN_CORE_PROVIDERS = [...TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY];
    window.PALPAL_CORE_PROVIDERS = [...TOMOSHIBIKAN_CORE_PROVIDER_REGISTRY];
    window.TOMOSHIBIKAN_CORE_MODELS = [...TOMOSHIBIKAN_CORE_MODEL_REGISTRY];
    window.PALPAL_CORE_MODELS = [...TOMOSHIBIKAN_CORE_MODEL_REGISTRY];
  }
  return true;
}

async function refreshCoreCatalogFromRuntime() {
  if (!hasRuntimeCatalogBridge()) return false;
  try {
    const runtime = resolveTomoshibikanCoreRuntimeApi();
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
      registeredToolCapabilities: settingsState.registeredToolCapabilities,
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
    registeredToolCapabilities: Array.isArray(settingsState.registeredToolCapabilities)
      ? settingsState.registeredToolCapabilities
        .map((entry) => ({
          toolName: normalizeToolName(entry?.toolName),
          status: normalizeText(entry?.status) || "unavailable",
          fetchedAt: normalizeText(entry?.fetchedAt),
          commandName: normalizeText(entry?.commandName),
          versionText: normalizeText(entry?.versionText),
          capabilities: Array.isArray(entry?.capabilities) ? entry.capabilities : [],
          capabilitySummaries: Array.isArray(entry?.capabilitySummaries) ? entry.capabilitySummaries : [],
          errorText: normalizeText(entry?.errorText),
        }))
        .filter((entry) => Boolean(entry.toolName))
      : [],
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
    registeredToolCapabilities: Array.isArray(input.registeredToolCapabilities)
      ? input.registeredToolCapabilities
        .map((entry) => ({
          toolName: normalizeToolName(entry?.toolName),
          status: normalizeText(entry?.status) || "unavailable",
          fetchedAt: normalizeText(entry?.fetchedAt),
          commandName: normalizeText(entry?.commandName),
          versionText: normalizeText(entry?.versionText),
          capabilities: Array.isArray(entry?.capabilities) ? entry.capabilities : [],
          capabilitySummaries: Array.isArray(entry?.capabilitySummaries) ? entry.capabilitySummaries : [],
          errorText: normalizeText(entry?.errorText),
        }))
        .filter((entry) => Boolean(entry.toolName))
        .sort((left, right) => left.toolName.localeCompare(right.toolName))
      : [],
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
    registeredToolCapabilities: Array.isArray(input.registeredToolCapabilities)
      ? input.registeredToolCapabilities
        .map((entry) => ({
          toolName: normalizeToolName(entry?.toolName),
          status: normalizeText(entry?.status) || "unavailable",
          fetchedAt: normalizeText(entry?.fetchedAt),
          commandName: normalizeText(entry?.commandName),
          versionText: normalizeText(entry?.versionText),
          capabilities: Array.isArray(entry?.capabilities) ? entry.capabilities : [],
          capabilitySummaries: Array.isArray(entry?.capabilitySummaries) ? entry.capabilitySummaries : [],
          errorText: normalizeText(entry?.errorText),
        }))
        .filter((entry) => Boolean(entry.toolName))
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
    registeredToolCapabilities: normalizedPayload.registeredToolCapabilities,
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
  settingsState.registeredToolCapabilities = Array.isArray(normalized.registeredToolCapabilities)
    ? normalized.registeredToolCapabilities
    : [];
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
    displayName: normalizeText(input.displayName) || (role === "guide" ? "New Guide" : (role === "gate" ? "New Gate" : "新しい住人")),
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

async function syncBuiltInResidentIdentitiesToWorkspace() {
  const identityApi = resolveAgentIdentityApi();
  const seedApi = resolveDebugIdentitySeedsApi();
  if (!identityApi || !seedApi) {
    setMessage("MSG-PPH-1003");
    return false;
  }
  syncBuiltInProfileMetadata();
  for (const profile of INITIAL_PAL_PROFILES) {
    const role = normalizePalRole(profile.role);
    const agentType = role === "worker" ? "worker" : role;
    if (!agentType) continue;
    const seed = seedApi.getBuiltInDebugIdentitySeed(profile, locale);
    if (!seed) continue;
    const currentProfile = palProfiles.find((item) => item.id === profile.id) || profile;
    try {
      await identityApi.save({
        agentType,
        agentId: profile.id,
        locale,
        soul: seed.soul,
        role: seed.role,
        rubric: seed.rubric,
        enabledSkillIds: Array.isArray(currentProfile.skills) ? currentProfile.skills : seed.enabledSkillIds,
      });
    } catch (error) {
      setMessage("MSG-PPH-1003");
      return false;
    }
  }
  writePalProfilesSnapshotWithFallback();
  renderPalList();
  renderSettingsTab();
  setMessage("MSG-PPH-0007");
  return true;
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

function resolvePlanOrchestratorApi() {
  return typeof window !== "undefined" &&
    window.PlanOrchestrator &&
    typeof window.PlanOrchestrator.materializePlanArtifact === "function"
    ? window.PlanOrchestrator
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
    : "ユーザーから明示的な言語指定がない限り、日本語で応答する。";
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

function normalizeToolCapabilitySnapshots(entries) {
  if (!Array.isArray(entries)) return [];
  const seen = new Set();
  const result = [];
  entries.forEach((entry) => {
    const toolName = normalizeToolName(entry?.toolName);
    if (!toolName) return;
    const key = toolName.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push({
      toolName,
      status: normalizeText(entry?.status) || "unavailable",
      fetchedAt: normalizeText(entry?.fetchedAt),
      commandName: normalizeText(entry?.commandName),
      versionText: normalizeText(entry?.versionText),
      capabilities: Array.isArray(entry?.capabilities) ? entry.capabilities : [],
      capabilitySummaries: Array.isArray(entry?.capabilitySummaries)
        ? entry.capabilitySummaries.map((summary) => normalizeText(summary)).filter(Boolean)
        : [],
      errorText: normalizeText(entry?.errorText),
    });
  });
  return result;
}

function resolveRegisteredToolCapabilitySnapshots(toolNames) {
  const selected = Array.isArray(toolNames)
    ? toolNames.map((toolName) => normalizeToolName(toolName)).filter(Boolean)
    : [];
  if (selected.length === 0) return [];
  const selectedSet = new Set(selected.map((toolName) => toolName.toLowerCase()));
  return normalizeToolCapabilitySnapshots(settingsState.registeredToolCapabilities)
    .filter((entry) => selectedSet.has(entry.toolName.toLowerCase()));
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

function fallbackResolveSkillSummaries(runtimeKind, configuredSkillIds, installedSkillIds, catalogItems, selectedToolNames = [], registeredToolCapabilities = []) {
  if (runtimeKind === "tool") {
    const selected = new Set(
      (Array.isArray(selectedToolNames) ? selectedToolNames : [])
        .map((toolName) => normalizeToolName(toolName).toLowerCase())
        .filter(Boolean)
    );
    return normalizeToolCapabilitySnapshots(registeredToolCapabilities)
      .filter((entry) => selected.has(entry.toolName.toLowerCase()))
      .flatMap((entry) => entry.capabilitySummaries);
  }
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
  const selectedToolNames = Array.isArray(guideProfile?.cliTools) ? guideProfile.cliTools : [];
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
      selectedToolNames,
      registeredToolCapabilities: resolveRegisteredToolCapabilitySnapshots(selectedToolNames),
    })
    : null;
  const skillSummaries = Array.isArray(resolvedByApi?.skillSummaries)
    ? resolvedByApi.skillSummaries
    : fallbackResolveSkillSummaries(
      runtimeKind,
      configuredSkillIds,
      installedSkillIds,
      skillCatalogItems,
      selectedToolNames,
      resolveRegisteredToolCapabilitySnapshots(selectedToolNames)
    );
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

function nextJobSequenceNumber() {
  return jobs.reduce((max, job) => {
    const matched = String(job?.id || "").match(/^JOB-(\d+)$/i);
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
      const selectedToolNames = Array.isArray(pal.cliTools) ? pal.cliTools : [];
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
          selectedToolNames,
          registeredToolCapabilities: resolveRegisteredToolCapabilitySnapshots(selectedToolNames),
        })
        : null;
      const skillSummaries = Array.isArray(resolvedSkillSummaries?.skillSummaries)
        ? resolvedSkillSummaries.skillSummaries
        : fallbackResolveSkillSummaries(
          runtimeKind,
          configuredSkillIds,
          installedSkillIds,
          skillCatalogItems,
          selectedToolNames,
          resolveRegisteredToolCapabilitySnapshots(selectedToolNames)
        );
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

function buildGuideRoutingOperatingRulesPrompt(localeValue) {
  const isJa = localeValue !== "en";
  return isJa
      ? [
        "あなたは灯火館の管理人として、住人への割り当て判断だけを行います。",
        "- 入力の task と候補住人一覧だけを見て、最も適した住人を 1 人選ぶ。",
        "- 候補外の住人は選ばない。",
        "- 各住人の ROLE.md 全文を最も重要な根拠として読み、Mission, 得意な依頼, 得意な作成物, Inputs, Outputs, Done Criteria, Constraints, Hand-off Rules を比較する。",
        "- capability summary は『その住人が今ここで実行できること』として使い、ROLE と矛盾しない候補を選ぶ。",
        "- software や codebase の task では、調査・再現・原因分析・修正・guard 追加・再発防止をまとめてプログラマの担当として考える。",
        "- settings、save、reload、state、model、file、patch、fix、validation のような software 文脈が見える時は、まずプログラマを選ぶ。",
        "- リサーチャーは、市場・競合・事例・利用者像・外部情報の調査や比較レポートに向く時だけ選び、software の不具合調査や修正には割り当てない。",
        "- 類似サービス、競合サービス、オンボーディング事例、導線比較、訴求比較のような外部サービス調査は、software という語が出ていてもリサーチャーを優先する。",
        "- resident の適性判断は ROLE.md 全文と capabilitySummary を優先し、displayName や印象で決めない。",
        "- `currentLoad` は補助材料として使うが、適性より優先しない。",
        "- 外部サービスや市場の調査 task では、まずリサーチャーを残し、プログラマは外してよい。",
        "- 適任が見当たらない時だけ `replan_required` を返す。",
        "- 返答は JSON schema に厳密に従い、余計な説明文を付けない。",
      ].join("\n")
    : [
        "As the Tomoshibi-kan manager, make only the resident assignment decision.",
        "- Choose exactly one resident from the provided candidates for the task.",
        "- Never choose a resident outside the provided candidates.",
        "- Read each resident's full ROLE.md contract as the primary source of fitness.",
        "- Compare Mission, preferred requests, preferred outputs, Inputs, Outputs, Done Criteria, Constraints, and Hand-off Rules before deciding.",
        "- Use capability summary as evidence of what the resident can execute right now.",
        "- For software or codebase work, treat investigation, reproduction, root-cause analysis, fixes, guard additions, and regression prevention as programmer work.",
        "- If the task mentions settings, save, reload, state, model, file, patch, fix, or validation in a software context, choose the programmer first.",
        "- Choose the researcher only for market research, competitive comparison, user insight, or external-information reports, and never for software bug investigation or fixes.",
        "- If the task is about similar services, competitor services, onboarding examples, flow comparisons, or messaging comparisons, prefer the researcher even when software products are mentioned.",
        "- Before selecting, eliminate candidates whose role contract says they do not handle this kind of work.",
        "- For software or codebase work, eliminate the researcher first and compare the remaining candidates.",
        "- For external research or marketing work, eliminate the programmer first and compare the remaining candidates.",
        "- Choose the writer only when the main job is wording, summary, naming, documentation, or audience-facing explanation.",
        "- Use the full ROLE.md contract and capabilitySummary as the primary decision source, and never decide by display name or impression.",
        "- Treat currentLoad as a secondary signal, not stronger than fitness.",
        "- Return `replan_required` only when none of the candidates is a reasonable fit.",
        "- Follow the JSON schema strictly and do not add extra prose.",
    ].join("\n");
}

function buildGuideRoutingUserText(routingInput) {
  const baseRoutingApi = resolveAgentRoutingApi();
  const rawPayload = routingInput && typeof routingInput === "object" ? routingInput : {};
  const payload = baseRoutingApi && typeof baseRoutingApi.buildWorkerRoutingLlmInput === "function"
    ? baseRoutingApi.buildWorkerRoutingLlmInput(rawPayload)
    : rawPayload;
  return [
    "Select the best resident for this task from the provided candidates.",
    "First eliminate candidates whose role contract clearly says they should not handle this kind of work.",
    "Then compare the remaining candidates and select the best fit.",
    "Return only the structured routing decision.",
    safeStringify(payload, "{}"),
  ].join("\n\n");
}

async function requestGuideDrivenWorkerRoutingDecision(params = {}) {
  const baseRoutingApi = resolveAgentRoutingApi();
  if (!baseRoutingApi || typeof baseRoutingApi.buildWorkerRoutingInput !== "function" || typeof baseRoutingApi.parseRoutingDecisionResponse !== "function" || typeof baseRoutingApi.buildRoutingDecisionResponseFormat !== "function") {
    return null;
  }
  const runtimeApi = resolveTomoshibikanCoreRuntimeApi();
  if (!runtimeApi || typeof runtimeApi.guideChat !== "function") return null;
  const guideState = resolveGuideModelStateWithFallback();
  if (!guideState?.ready) return null;
  const guideProfile = getActiveGuideProfile();
  if (!guideProfile) return null;
  const guideIdentity = await loadAgentIdentityForPal(guideProfile);
  const runtimeKind = normalizeText(guideState.runtimeKind) === "tool" ? "tool" : "model";
  const runtimeConfig = runtimeKind === "model" ? resolveGuideApiRuntimeConfig(guideState) : null;
  if (runtimeKind === "model" && (!runtimeConfig || !runtimeConfig.modelName)) return null;
  const routingInput = baseRoutingApi.buildWorkerRoutingInput({
    targetType: "task",
    targetId: `plan:${normalizeText(params?.artifact?.planId) || "PLAN-001"}:task:${Number(params?.index) + 1}`,
    planId: normalizeText(params?.artifact?.planId),
    goal: normalizeText(params?.artifact?.plan?.goal),
    expectedOutput: normalizeText(params?.taskPlan?.expectedOutput || params?.artifact?.plan?.completionDefinition),
    constraints: Array.isArray(params?.artifact?.plan?.constraints) ? params.artifact.plan.constraints : [],
    requiredSkills: Array.isArray(params?.taskPlan?.requiredSkills) ? params.taskPlan.requiredSkills : [],
    needsEvidence: /research|review/.test(String(params?.taskPlan?.title || "").toLowerCase()),
    scopeRisk: "medium",
    taskDraft: params?.taskDraft,
    workers: params?.workers,
    assignmentCounts: params?.assignmentCounts,
    historySummary: [],
  });
  if (!Array.isArray(routingInput.candidateResidents) || routingInput.candidateResidents.length === 0) {
    return null;
  }
  const responseFormat = baseRoutingApi.buildRoutingDecisionResponseFormat(locale);
  const systemPrompt = buildFallbackIdentitySystemPrompt(buildGuideRoutingOperatingRulesPrompt(locale), guideIdentity);
  const resolvedApiKey = runtimeKind === "model"
    ? await resolveStoredModelApiKeyWithFallback(runtimeConfig.modelName, runtimeConfig.apiKey)
    : "";
  try {
    const payload = await runtimeApi.guideChat({
      runtimeKind,
      toolName: runtimeKind === "tool" ? normalizeText(guideState.toolName) : "",
      provider: runtimeConfig?.provider || "",
      modelName: runtimeConfig?.modelName || "",
      baseUrl: runtimeConfig?.baseUrl || "",
      apiKey: resolvedApiKey,
      userText: buildGuideRoutingUserText(routingInput),
      systemPrompt,
      messages: [],
      responseFormat,
      enabledSkillIds: await resolveGuideConfiguredSkillIds(),
      workspaceRoot: resolveRuntimeWorkspaceRootForChat(),
      debugMeta: {
        stage: "orchestrator_routing",
        agentRole: "guide",
        agentId: normalizeText(guideProfile.id),
        targetKind: "task",
        targetId: routingInput.targetId,
        identityVersions: buildDebugIdentityVersions(guideIdentity),
      },
    });
    const parsed = baseRoutingApi.parseRoutingDecisionResponse(payload?.text || "", {
      allowedResidentIds: routingInput.candidateResidents.map((entry) => entry.residentId),
    });
    if (!parsed?.ok || !parsed.decision) return null;
    if (parsed.decision.confidence === "low") return null;
    return {
      workerId: parsed.decision.selectedResidentId,
      matchedSkills: [],
      matchedRoleTerms: [parsed.decision.fallbackAction === "reroute" ? "guide_reroute" : "guide_routing"],
      decisionSource: parsed.decision.fallbackAction === "reroute" ? "guide_reroute" : "guide_routing",
      decisionReason: parsed.decision.reason,
      decisionConfidence: parsed.decision.confidence,
      fallbackAction: parsed.decision.fallbackAction,
    };
  } catch (_error) {
    return null;
  }
}

function buildPlanOrchestratorRoutingApi(baseRoutingApi) {
  if (!baseRoutingApi) return null;
  return {
    ...baseRoutingApi,
    selectWorkerForTaskWithGuideDecision: async (input) => requestGuideDrivenWorkerRoutingDecision(input),
  };
}

function createTaskRecord(input) {
  return {
    id: input.id,
    planId: normalizeText(input?.planId) || "PLAN-001",
    projectId: normalizeText(input?.projectId),
    projectName: normalizeText(input?.projectName),
    projectDirectory: normalizeText(input?.projectDirectory),
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
    const conversation = buildDispatchConversationMessage(task, palId, routingExplanation);
    const summaryJa = conversation.messageJa;
    const summaryEn = conversation.messageEn;
    appendEvent(
      "dispatch",
      task.id,
      "ok",
      summaryJa,
      summaryEn
    );
    void appendTaskProgressLogForTarget("task", task.id, "dispatch", {
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: summaryJa,
      messageEn: summaryEn,
      payload: {
        workerId: palId,
        workerDisplayName: residentDisplayName(palId, palId),
        taskTitle: task.title,
        taskDescription: task.description,
        routingExplanation,
      },
    });
  });
  if (created.length > 0 && !selectedTaskId) {
    selectedTaskId = created[0].id;
  }
  renderTaskBoard();
  writeBoardStateSnapshot();
  return { created: created.length };
}

async function createPlannedTasksFromGuidePlan(plan, options = {}) {
  const normalizedPlan = plan && typeof plan === "object" ? plan : null;
  const taskList = Array.isArray(normalizedPlan?.tasks) ? normalizedPlan.tasks : [];
  const jobList = Array.isArray(normalizedPlan?.jobs) ? normalizedPlan.jobs : [];
  const project = normalizedPlan?.project && typeof normalizedPlan.project === "object" ? normalizedPlan.project : null;
  if (taskList.length === 0 && jobList.length === 0) return { created: 0 };
  const planId = normalizeText(options.planId) || "PLAN-001";
  const workers = await resolveWorkerAssignmentProfiles();
  if (workers.length === 0) return { created: 0 };
  const routingApi = resolveAgentRoutingApi();
  const assignmentCounts = new Map(workers.map((worker) => [worker.id, 0]));
  let taskSequence = nextTaskSequenceNumber();
  let jobSequence = nextJobSequenceNumber();
  const createdTasks = [];
  const createdJobs = [];

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
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
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
          matchedResidentFocus: Array.isArray(selected?.matchedResidentFocus) ? selected.matchedResidentFocus : [],
          matchedPreferredOutputs: Array.isArray(selected?.matchedPreferredOutputs) ? selected.matchedPreferredOutputs : [],
          matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
        };
      }
      if (!workerId) {
        workerId = normalizeText(workers[index % workers.length]?.id);
        explanation = {
          matchedSkills: [],
          matchedResidentFocus: [],
          matchedPreferredOutputs: [],
          matchedRoleTerms: [],
        };
      }
    if (!workerId) return;

    assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
    const id = `TASK-${String(taskSequence).padStart(3, "0")}`;
    taskSequence += 1;
    const task = createTaskRecord({
      id,
      planId,
      projectId: normalizeText(project?.id),
      projectName: normalizeText(project?.name),
      projectDirectory: normalizeText(project?.directory),
      title: taskDraft.title,
      description: taskDraft.description,
      palId: workerId,
    });
    tasks.push(task);
    createdTasks.push(task);
    const routingExplanation = formatWorkerRoutingExplanation(explanation);
    const workerDisplayName = residentDisplayName(workerId, workerId);
    const summaryJa = routingExplanation.ja
      ? `${task.id} を ${workerDisplayName} に割り当てました (${routingExplanation.ja})。`
      : `${task.id} を ${workerDisplayName} に割り当てました。`;
    const summaryEn = routingExplanation.en
      ? `${task.id} dispatched to ${workerDisplayName} (${routingExplanation.en}).`
      : `${task.id} dispatched to ${workerDisplayName}.`;
    appendEvent("dispatch", task.id, "ok", summaryJa, summaryEn);
    void appendTaskProgressLogForTarget("task", task.id, "dispatch", {
      planId,
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: summaryJa,
      messageEn: summaryEn,
      payload: {
        workerId,
        routingExplanation,
      },
    });
  });

  jobList.forEach((jobPlan, index) => {
    const explicitWorker = workers.find((worker) => worker.id === normalizeText(jobPlan?.assigneePalId)) || null;
    const jobDraft = {
      title: normalizeText(jobPlan?.title) || `Job ${index + 1}`,
      description: normalizeText(jobPlan?.description),
      instruction: normalizeText(jobPlan?.instruction),
    };
    if (!jobDraft.description || !jobDraft.instruction) return;

    let workerId = normalizeText(explicitWorker?.id);
    let explanation = null;
    if (workerId) {
      explanation = {
        matchedRoleTerms: ["explicit_assignee"],
        matchedResidentFocus: [],
        matchedPreferredOutputs: [],
        matchedSkills: [],
      };
    } else if (routingApi && typeof routingApi.selectWorkerForTask === "function") {
      const selected = routingApi.selectWorkerForTask({
        taskDraft: {
          title: jobDraft.title,
          description: `${jobDraft.description}\n${jobDraft.instruction}`,
        },
        workers,
        assignmentCounts,
        requiredSkills: Array.isArray(jobPlan?.requiredSkills) ? jobPlan.requiredSkills : [],
      });
      workerId = normalizeText(selected?.workerId);
      explanation = {
        matchedSkills: Array.isArray(selected?.matchedSkills) ? selected.matchedSkills : [],
        matchedResidentFocus: Array.isArray(selected?.matchedResidentFocus) ? selected.matchedResidentFocus : [],
        matchedPreferredOutputs: Array.isArray(selected?.matchedPreferredOutputs) ? selected.matchedPreferredOutputs : [],
        matchedRoleTerms: Array.isArray(selected?.matchedRoleTerms) ? selected.matchedRoleTerms : [],
      };
    }
    if (!workerId) {
      workerId = normalizeText(workers[index % workers.length]?.id);
      explanation = {
        matchedSkills: [],
        matchedResidentFocus: [],
        matchedPreferredOutputs: [],
        matchedRoleTerms: [],
      };
    }
    if (!workerId) return;

    assignmentCounts.set(workerId, (assignmentCounts.get(workerId) || 0) + 1);
    const id = `JOB-${String(jobSequence).padStart(3, "0")}`;
    jobSequence += 1;
    const job = createJobRecord({
      id,
      planId,
      projectId: normalizeText(project?.id),
      projectName: normalizeText(project?.name),
      projectDirectory: normalizeText(project?.directory),
      title: jobDraft.title,
      description: jobDraft.description,
      instruction: jobDraft.instruction,
      schedule: normalizeText(jobPlan?.schedule),
      palId: workerId,
    });
    jobs.push(job);
    createdJobs.push(job);
    const routingExplanation = formatWorkerRoutingExplanation(explanation);
    const workerDisplayName = residentDisplayName(workerId, workerId);
    const summaryJa = routingExplanation.ja
      ? `${job.id} を ${workerDisplayName} に割り当てました (${routingExplanation.ja})。`
      : `${job.id} を ${workerDisplayName} に割り当てました。`;
    const summaryEn = routingExplanation.en
      ? `${job.id} dispatched to ${workerDisplayName} (${routingExplanation.en}).`
      : `${job.id} dispatched to ${workerDisplayName}.`;
    appendEvent("dispatch", job.id, "ok", summaryJa, summaryEn);
    void appendTaskProgressLogForTarget("job", job.id, "dispatch", {
      planId,
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: summaryJa,
      messageEn: summaryEn,
      payload: {
        workerId,
        routingExplanation,
      },
    });
  });

  if (createdTasks.length > 0 && !selectedTaskId) {
    selectedTaskId = createdTasks[0].id;
  }
  renderTaskBoard();
  renderJobBoard();
  writeBoardStateSnapshot();
  return { created: createdTasks.length + createdJobs.length, createdTasks, createdJobs };
}

async function materializeApprovedPlanArtifact(artifact) {
  const normalizedPlanId = normalizeText(artifact?.planId);
  const status = normalizeText(artifact?.status || "approved");
  const plan = artifact?.plan && typeof artifact.plan === "object" ? artifact.plan : null;
  if (!normalizedPlanId || status !== "approved" || !plan) {
    return { created: 0 };
  }
  const orchestratorApi = resolvePlanOrchestratorApi();
  if (!orchestratorApi) {
    return createPlannedTasksFromGuidePlan(plan, {
      planId: normalizedPlanId,
    });
  }
  const workers = await resolveWorkerAssignmentProfiles();
  if (workers.length === 0) return { created: 0 };
  const routingApi = buildPlanOrchestratorRoutingApi(resolveAgentRoutingApi());
  const result = await orchestratorApi.materializePlanArtifact({
    artifact,
    workers,
    nextTaskSequence: nextTaskSequenceNumber(),
    nextJobSequence: nextJobSequenceNumber(),
    routingApi,
    buildTaskRecord: (input) => createTaskRecord(input),
    buildJobRecord: (input) => createJobRecord(input),
  });
  const createdTasks = Array.isArray(result?.createdTasks) ? result.createdTasks : [];
  const createdJobs = Array.isArray(result?.createdJobs) ? result.createdJobs : [];
  const created = [];
  createdTasks.forEach((entry) => {
    const task = entry?.task;
    if (!task || typeof task !== "object") return;
    tasks.push(task);
    created.push(task);
    const workerId = normalizeText(entry?.workerId || task.palId);
    const routingExplanation = formatWorkerRoutingExplanation(entry?.explanation);
    const rerouteFromWorkerId = normalizeText(entry?.explanation?.rerouteFromWorkerId);
    const shouldLogReroute = normalizeText(entry?.explanation?.fallbackAction) === "reroute" && rerouteFromWorkerId && rerouteFromWorkerId !== workerId;
    if (shouldLogReroute) {
      const rerouteConversation = buildRerouteConversationMessage(task, rerouteFromWorkerId, workerId);
      const rerouteMessageJa = rerouteConversation.messageJa;
      const rerouteMessageEn = rerouteConversation.messageEn;
      appendEvent("dispatch", task.id, "reroute", rerouteMessageJa, rerouteMessageEn);
      void appendTaskProgressLogForTarget("task", task.id, "reroute", {
        planId: normalizedPlanId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: rerouteMessageJa,
        messageEn: rerouteMessageEn,
        payload: {
          fromWorkerId: rerouteFromWorkerId,
          fromWorkerDisplayName: residentDisplayName(rerouteFromWorkerId, rerouteFromWorkerId),
          workerId,
          workerDisplayName: residentDisplayName(workerId, workerId),
          taskTitle: task.title,
          taskDescription: task.description,
          routingExplanation,
        },
      });
    }
    const conversation = buildDispatchConversationMessage(task, workerId, routingExplanation);
    const summaryJa = conversation.messageJa;
    const summaryEn = conversation.messageEn;
    appendEvent("dispatch", task.id, "ok", summaryJa, summaryEn);
    void appendTaskProgressLogForTarget("task", task.id, "dispatch", {
      planId: normalizedPlanId,
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: summaryJa,
      messageEn: summaryEn,
      payload: {
        workerId,
        workerDisplayName: residentDisplayName(workerId, workerId),
        taskTitle: task.title,
        taskDescription: task.description,
        routingExplanation,
      },
    });
  });
  createdJobs.forEach((entry) => {
    const job = entry?.job;
    if (!job || typeof job !== "object") return;
    jobs.push(job);
    created.push(job);
    const workerId = normalizeText(entry?.workerId || job.palId);
    const routingExplanation = formatWorkerRoutingExplanation(entry?.explanation);
    const rerouteFromWorkerId = normalizeText(entry?.explanation?.rerouteFromWorkerId);
    const shouldLogReroute = normalizeText(entry?.explanation?.fallbackAction) === "reroute" && rerouteFromWorkerId && rerouteFromWorkerId !== workerId;
    if (shouldLogReroute) {
      const rerouteConversation = buildRerouteConversationMessage(job, rerouteFromWorkerId, workerId);
      const rerouteMessageJa = rerouteConversation.messageJa;
      const rerouteMessageEn = rerouteConversation.messageEn;
      appendEvent("dispatch", job.id, "reroute", rerouteMessageJa, rerouteMessageEn);
      void appendTaskProgressLogForTarget("job", job.id, "reroute", {
        planId: normalizedPlanId,
        actualActor: "orchestrator",
        displayActor: "Guide",
        status: "ok",
        messageJa: rerouteMessageJa,
        messageEn: rerouteMessageEn,
        payload: {
          fromWorkerId: rerouteFromWorkerId,
          fromWorkerDisplayName: residentDisplayName(rerouteFromWorkerId, rerouteFromWorkerId),
          workerId,
          workerDisplayName: residentDisplayName(workerId, workerId),
          taskTitle: job.title,
          taskDescription: job.description,
          routingExplanation,
        },
      });
    }
    const conversation = buildDispatchConversationMessage(job, workerId, routingExplanation);
    const summaryJa = conversation.messageJa;
    const summaryEn = conversation.messageEn;
    appendEvent("dispatch", job.id, "ok", summaryJa, summaryEn);
    void appendTaskProgressLogForTarget("job", job.id, "dispatch", {
      planId: normalizedPlanId,
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "ok",
      messageJa: summaryJa,
      messageEn: summaryEn,
      payload: {
        workerId,
        workerDisplayName: residentDisplayName(workerId, workerId),
        taskTitle: job.title,
        taskDescription: job.description,
        routingExplanation,
      },
    });
  });
  if (created.length > 0 && !selectedTaskId) {
    selectedTaskId = created[0].id;
  }
  renderTaskBoard();
  renderJobBoard();
  writeBoardStateSnapshot();
  return { created: created.length, createdTasks, createdJobs };
}

let autoExecutionChain = Promise.resolve();

function enqueueAutoExecution(work) {
  autoExecutionChain = autoExecutionChain
    .then(() => Promise.resolve().then(work))
    .catch(() => {});
  return autoExecutionChain;
}


function findResidentProfileById(profileId) {
  const normalizedProfileId = normalizeText(profileId);
  if (!normalizedProfileId) return null;
  return palProfiles.find((profile) => profile.id === normalizedProfileId) || null;
}

function residentDisplayName(profileId, fallback = "") {
  const profile = findResidentProfileById(profileId);
  return normalizeText(profile?.displayName || fallback || profileId);
}

function residentAddressName(profileId, fallback = "") {
  const display = residentDisplayName(profileId, fallback);
  if (!display) return "";
  return /さん$/.test(display) ? display : `${display}さん`;
}

function summarizeConversationIntent(text, fallback = "") {
  const normalized = normalizeText(text || fallback);
  if (!normalized) return "";
  const compact = normalized.replace(/\s+/g, " ");
  if (compact.length <= 72) return compact;
  return `${compact.slice(0, 69)}...`;
}

function firstMeaningfulLine(text) {
  const normalized = normalizeText(text);
  if (!normalized) return "";
  const line = normalized.split(/\r?\n/).map((item) => normalizeText(item)).find(Boolean) || "";
  if (!line) return "";
  return line.length <= 88 ? line : `${line.slice(0, 85)}...`;
}

function buildDispatchConversationMessage(target, workerId, routingExplanation) {
  const requestLine = summarizeConversationIntent(target?.title, target?.description || target?.instruction || target?.title);
  const workerAddress = residentAddressName(workerId, workerId);
  const workerDisplay = residentDisplayName(workerId, workerId);
  const routingNote = normalizeText(routingExplanation?.ja);
  const messageJa = routingNote
    ? `${workerAddress}、${requestLine}をお願いします。${routingNote}。`
    : `${workerAddress}、${requestLine}をお願いします。`;
  const messageEn = routingNote
    ? `${workerDisplay}, please handle "${requestLine}". ${routingNote}.`
    : `${workerDisplay}, please handle "${requestLine}".`;
  return { messageJa, messageEn };
}

function buildRerouteConversationMessage(target, fromWorkerId, toWorkerId) {
  const requestLine = summarizeConversationIntent(target?.title, target?.description || target?.instruction || target?.title);
  const fromDisplay = residentDisplayName(fromWorkerId, fromWorkerId);
  const toAddress = residentAddressName(toWorkerId, toWorkerId);
  const toDisplay = residentDisplayName(toWorkerId, toWorkerId);
  return {
    messageJa: `${fromDisplay}よりも${toAddress}の方が合いそうです。${requestLine}をお願いし直します。`,
    messageEn: `${toDisplay} is a better fit than ${fromDisplay}. Reassigning "${requestLine}".`,
  };
}

function buildGateHandOffConversationMessage(target, gateProfileId, gateExplanation) {
  const requestLine = summarizeConversationIntent(target?.title, target?.description || target?.instruction || target?.title);
  const gateDisplay = residentDisplayName(gateProfileId, gateProfileId) || (locale === "ja" ? "古参住人" : "Gate");
  const routingNote = normalizeText(gateExplanation?.ja);
  return {
    messageJa: routingNote
      ? `${gateDisplay}にも見てもらいます。${requestLine}について、ここまでの結果を渡します。${routingNote}。`
      : `${gateDisplay}にも見てもらいます。${requestLine}について、ここまでの結果を渡します。`,
    messageEn: routingNote
      ? `Handing "${requestLine}" to ${gateDisplay} for review. ${routingNote}.`
      : `Handing "${requestLine}" to ${gateDisplay} for review.`,
  };
}

function buildResubmitConversationMessage(target, gateProfileId) {
  const requestLine = summarizeConversationIntent(target?.title, target?.description || target?.instruction || target?.title);
  const gateDisplay = residentDisplayName(gateProfileId, gateProfileId) || (locale === "ja" ? "古参住人" : "Gate");
  return {
    messageJa: `${gateDisplay}からの指摘を踏まえて手直ししました。${requestLine}をもう一度見てもらいます。`,
    messageEn: `The requested fixes are in. Sending "${requestLine}" back to ${gateDisplay}.`,
  };
}

function buildWorkerProgressConversationMessage(target, workerId, status, evidenceText) {
  const workerDisplay = residentDisplayName(workerId, workerId);
  const requestLine = summarizeConversationIntent(target?.title, target?.description || target?.instruction || target?.title);
  const evidenceLine = firstMeaningfulLine(evidenceText);
  if (status === "error" || status === "blocked") {
    return {
      messageJa: `${workerDisplay}です。${requestLine}を進めていて少し詰まりました。${evidenceLine || "いったん状況を共有します。"}`,
      messageEn: `${workerDisplay}: I hit a blocker while working on "${requestLine}". ${evidenceLine || "Sharing the current status."}`,
    };
  }
  return {
    messageJa: `${workerDisplay}です。${requestLine}ができました。${evidenceLine || "ひとまず結果をまとめました。"}`,
    messageEn: `${workerDisplay}: I finished "${requestLine}". ${evidenceLine || "I summarized the result."}`,
  };
}

function buildGateReviewConversationMessage(target, gateProfileId, gateResult, status) {
  const gateDisplay = residentDisplayName(gateProfileId, gateProfileId) || (locale === "ja" ? "真壁" : "Gate");
  const requestLine = summarizeConversationIntent(target?.title, target?.description || target?.instruction || target?.title);
  const reason = firstMeaningfulLine(gateResult?.reason);
  const firstFix = Array.isArray(gateResult?.fixes) ? firstMeaningfulLine(gateResult.fixes[0]) : "";
  if (status === "rejected") {
    return {
      messageJa: `${gateDisplay}です。${requestLine}は、このままだとまだ甘いかな。${reason || firstFix || "もう少し整えてから見せてほしいですね。"}`,
      messageEn: `${gateDisplay}: "${requestLine}" is not ready yet. ${reason || firstFix || "Please tighten it up and show it again."}`,
    };
  }
  return {
    messageJa: `${gateDisplay}です。${requestLine}なら、いいじゃないか。${reason || "この形で進めてよさそうです。"}`,
    messageEn: `${gateDisplay}: "${requestLine}" looks good. ${reason || "This is ready to move forward."}`,
  };
}

function buildPlanCompletedConversationMessage(planId) {
  const samePlanTasks = tasks.filter((item) => resolveTargetPlanId(item) === normalizeText(planId));
  const writerTask = samePlanTasks.find((item) => normalizeText(item.palId) === "pal-delta") || samePlanTasks[samePlanTasks.length - 1] || null;
  const writerSummary = firstMeaningfulLine(writerTask?.evidence);
  const titles = samePlanTasks.map((item) => summarizeConversationIntent(item.title)).filter(Boolean);
  const joinedTitles = titles.slice(0, 3).join("、");
  return {
    messageJa: writerSummary
      ? `${joinedTitles || "依頼"}まで形になりました。${writerSummary}`
      : `${joinedTitles || "依頼"}まで進みました。ひとまず、今の形でお返しできます。`,
    messageEn: writerSummary
      ? `${joinedTitles || "The request"} is now in shape. ${writerSummary}`
      : `${joinedTitles || "The request"} is ready to return in its current form.`,
  };
}

function buildGuideReplanUserText(targetKind, target, planArtifact, gateResult) {
  const targetLabel = targetKind === "job" ? "job" : "task";
  const payload = {
    targetKind,
    targetId: normalizeText(target?.id),
    targetTitle: normalizeText(target?.title),
    currentInstruction: normalizeText(target?.description || target?.instruction),
    currentPlanId: normalizeText(planArtifact?.planId || resolveTargetPlanId(target)),
    previousPlan: planArtifact?.plan && typeof planArtifact.plan === "object" ? planArtifact.plan : null,
    gateResult: gateResult && typeof gateResult === "object"
      ? {
        decision: normalizeText(gateResult.decision),
        reason: normalizeText(gateResult.reason),
        fixes: Array.isArray(gateResult.fixes) ? gateResult.fixes : [],
      }
      : null,
  };
  return [
    `Replan the current ${targetLabel}.`,
    "The previous execution was rejected and requires a revised plan.",
    "Return a valid Guide plan response. Keep the goal, revise tasks and constraints to address the rejection.",
    safeStringify(payload, "{}"),
  ].join("\n\n");
}

async function executeGuideDrivenReplanForTarget(targetKind, target, gateResult) {
  const guideState = resolveGuideModelStateWithFallback();
  if (!guideState?.ready || !target) return null;
  const currentPlanId = resolveTargetPlanId(target);
  const planArtifact = await findPlanArtifactByIdWithFallback(currentPlanId);
  const replanUserText = buildGuideReplanUserText(targetKind, target, planArtifact, gateResult);
  const contextBuild = await buildGuideContextWithFallback(replanUserText);
  const guideReplyRequester =
    typeof window !== "undefined" && typeof window.requestGuideModelReplyWithFallback === "function"
      ? window.requestGuideModelReplyWithFallback
      : requestGuideModelReplyWithFallback;
  const modelReply = await guideReplyRequester(replanUserText, guideState, contextBuild);
    const parsedPlanResponse = parseGuidePlanResponseWithFallback(modelReply?.text || "", {
      planningIntent: "replan_required",
      planningReadiness: "replan_required",
      projectContext: contextBuild?.context,
      locale,
    });
  if (!parsedPlanResponse?.ok || parsedPlanResponse.status !== "plan_ready" || !parsedPlanResponse.plan) {
    const replyText = normalizeText(parsedPlanResponse?.reply || modelReply?.text);
    await appendTaskProgressLogForTarget(targetKind, normalizeText(target.id), "replan_required", {
      planId: currentPlanId,
      actualActor: "orchestrator",
      displayActor: "Guide",
      status: "pending",
      messageJa: replyText || `${target.id} の再計画には、もう少し確認が必要です。`,
      messageEn: replyText || `${target.id} still needs more clarification before replanning.`,
      payload: {
        gateResult,
      },
      sourceRunId: normalizeText(modelReply?.runId),
    });
    rerenderAll();
    return null;
  }
  const nextArtifact = await appendPlanArtifactWithFallback({
    status: "approved",
    replyText: parsedPlanResponse.reply,
    plan: parsedPlanResponse.plan,
    sourceRunId: normalizeText(modelReply?.runId),
  });
  const created = await materializeApprovedPlanArtifact(nextArtifact);
  void queueAutoExecutionForCreatedTargets(created);
  await appendTaskProgressLogForTarget(targetKind, normalizeText(target.id), "replanned", {
    planId: currentPlanId,
    actualActor: "orchestrator",
    displayActor: "Guide",
    status: "ok",
    messageJa: `${summarizeConversationIntent(target?.title, target?.description || target?.instruction)}を組み直しました。新しい段取りで住人に引き継ぎます。`,
    messageEn: `${summarizeConversationIntent(target?.title, target?.description || target?.instruction)} was replanned and handed off with a revised path.`,
    payload: {
      previousPlanId: currentPlanId,
      nextPlanId: normalizeText(nextArtifact?.planId),
      createdCount: Number(created?.created || 0),
      taskTitle: normalizeText(target?.title),
      taskDescription: normalizeText(target?.description || target?.instruction),
      gateResult,
    },
    sourceRunId: normalizeText(modelReply?.runId),
  });
  rerenderAll();
  return {
    nextPlanId: normalizeText(nextArtifact?.planId),
    createdCount: Number(created?.created || 0),
  };
}

function createJobRecord(input) {
  return {
    id: input.id,
    planId: normalizeText(input?.planId) || "PLAN-001",
    projectId: normalizeText(input?.projectId),
    projectName: normalizeText(input?.projectName),
    projectDirectory: normalizeText(input?.projectDirectory),
    title: input.title,
    description: input.description,
    palId: input.palId,
    schedule: normalizeText(input?.schedule) || "-",
    instruction: normalizeText(input?.instruction) || "-",
    status: "assigned",
    updatedAt: formatNow(),
    decisionSummary: "-",
    fixCondition: "-",
    gateResult: buildGateResultRecord("none", ""),
    lastRunAt: "-",
    evidence: "-",
    replay: "-",
    gateProfileId: normalizeText(input?.gateProfileId),
  };
}

function resolveGuideModelStateWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.resolveGuideModelState({
      palProfiles,
      activeGuideId: workspaceAgentSelection.activeGuideId,
      registeredModels: settingsState.registeredModels,
      registeredTools: settingsState.registeredTools,
    });
  }
  const guide = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId);
  if (!guide) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  if (normalizePalRuntimeKind(guide.runtimeKind) === "tool") {
    const toolName = Array.isArray(guide.cliTools) ? normalizeText(guide.cliTools[0]) : "";
    if (!toolName || !settingsState.registeredTools.some((tool) => normalizeText(tool).toLowerCase() === toolName.toLowerCase())) {
      return { ready: false, errorCode: "MSG-PPH-1010" };
    }
    return {
      ready: true,
      guideId: guide.id,
      runtimeKind: "tool",
      toolName,
    };
  }
  if (guide.runtimeKind !== "model" || !guide.models[0]) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  const model = settingsState.registeredModels.find((item) => item.name === guide.models[0]);
  if (!model) {
    return { ready: false, errorCode: "MSG-PPH-1010" };
  }
  return {
    ready: true,
    guideId: guide.id,
    runtimeKind: "model",
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
      registeredTools: settingsState.registeredTools,
    });
  }
  const guide = palProfiles.find((pal) => pal.id === workspaceAgentSelection.activeGuideId);
  const activeToolName = guide && Array.isArray(guide.cliTools) ? normalizeText(guide.cliTools[0]) : "";
  if (
    guide &&
    normalizePalRuntimeKind(guide.runtimeKind) === "tool" &&
    activeToolName &&
    settingsState.registeredTools.some((tool) => normalizeText(tool).toLowerCase() === activeToolName.toLowerCase())
  ) {
    return { changed: false, guideId: guide.id };
  }
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
  const runtimeKind = normalizeText(guideState?.runtimeKind) === "tool" ? "tool" : "model";
  const provider = guideState.provider || "";
  const providerText = providerLabel(provider);
  const runtimeDisplay =
    runtimeKind === "tool"
      ? normalizeText(guideState?.toolName || guideState?.modelName || "CLI")
      : `${providerText}/${guideState.modelName}`;
  if (external) {
    return external.buildGuideModelReply({
      userText,
      modelName: runtimeKind === "tool" ? normalizeText(guideState?.toolName || guideState?.modelName) : guideState.modelName,
      providerLabel: runtimeKind === "tool" ? normalizeText(guideState?.toolName || "CLI") : providerText,
    });
  }
  const clipped = userText.length > 28 ? `${userText.slice(0, 28)}...` : userText;
  return {
    ja: `${runtimeDisplay} で受け取りました。「${clipped}」をもとに次のTaskを組み立てます。`,
    en: `Received via ${runtimeDisplay}. I will draft next tasks from "${clipped}".`,
  };
}

function buildGuideModelRequiredPromptWithFallback() {
  const external = resolveGuideChatModelApi();
  if (external) {
    return external.buildGuideModelRequiredPrompt();
  }
  return {
    ja: "Guide の実行設定が未完了です。SettingsタブでモデルまたはCLIツールを設定してください。",
    en: "Guide runtime is not configured. Configure a model or CLI tool in Settings tab.",
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
  if (!hasTomoshibikanCoreRuntimeApi() && isDevOrTestEnvironment()) {
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

function buildFallbackGuidePlanOutputInstruction() {
  return locale === "en"
    ? [
      "Return compact JSON only. Do not use markdown fences.",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"project":{"id":"...","name":"...","directory":"..."},"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}],"jobs":[{"title":"...","description":"...","schedule":"...","instruction":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "Use status=conversation when the user is chatting, brainstorming, or not asking for task breakdown yet.",
      "Use status=needs_clarification only when a missing fact blocks task creation.",
      "If the user explicitly asks for a plan or task breakdown and gives the target, expected outcome, relevant files, or available tools, prefer status=plan_ready.",
      "When returning plan_ready, include the target project or folder in plan.project.",
      "If there is no clear target project or folder yet, stay in needs_clarification and guide the user to set it in the Project tab first.",
      "When minor details are missing, make reasonable assumptions and put them in constraints instead of asking another confirmation question.",
      "Do not ask the user to pick the assignee Pal when suitable Pals and tools are already available in context; choose the best fit yourself.",
      "In the debug workspace, prefer resident specialists: trace work to the Research resident, fix work to the Maker resident, and verification work to the Writer resident.",
      "Use status=plan_ready only when you have enough information to create an actionable plan.",
    ].join("\n")
    : [
      "JSONのみで返す。Markdown や code fence は使わない。",
      'Schema: {"status":"conversation|needs_clarification|plan_ready","reply":"...","plan":null|{"project":{"id":"...","name":"...","directory":"..."},"goal":"...","completionDefinition":"...","constraints":["..."],"tasks":[{"title":"...","description":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}],"jobs":[{"title":"...","description":"...","schedule":"...","instruction":"...","expectedOutput":"...","requiredSkills":["..."],"reviewFocus":["..."],"assigneePalId":""}]}}',
      "ユーザーが雑談中、壁打ち中、またはまだtask分解を求めていないなら status=conversation を返す。",
      "task 作成を妨げる欠落情報がある時だけ status=needs_clarification を返す。",
      "ユーザーが plan や task 分解を明示し、対象・期待結果・関連ファイル・使える tools を示しているなら status=plan_ready を優先する。",
      "plan_ready を返す時は、対象の project / folder を plan.project に必ず入れる。",
      "対象の project / folder がまだ決まっていない時は、Project タブで先に設定するよう案内し、needs_clarification に留める。",
      "細部が不足しているだけなら、確認質問を増やさず assumptions を constraints に入れる。",
      "文脈に suitable Pals and tools があるなら、ユーザーに assignee Pal を選ばせず自分で選ぶ。",
      "debug workspace では住人の主担当を優先し、調査は冬坂、修正は久瀬、返却文や説明整理は白峰に割り当てる。",
      "実行可能な計画が作れる時だけ status=plan_ready を返す。",
    ].join("\n");
}

function parseGuidePlanResponseWithFallback(text, options = {}) {
  const guidePlanApi = resolveGuidePlanApi();
  if (guidePlanApi) {
    return guidePlanApi.parseGuidePlanResponse(text, options);
  }
  return { ok: false, error: "guide_plan_api_unavailable" };
}

function palRoleLabel(role) {
  const normalized = normalizePalRole(role);
  if (locale === "ja") {
    if (normalized === "guide") return "Guide役";
    if (normalized === "gate") return "Gate役";
    return "住人";
  }
  if (normalized === "guide") return "Guide";
  if (normalized === "gate") return "Gate";
  return "Worker / 住人";
}

function coreModelOptionsByProvider(providerId) {
  const normalizedProviderId = providerIdFromInput(providerId);
  return [...(TOMOSHIBIKAN_CORE_MODEL_OPTIONS_BY_PROVIDER.get(normalizedProviderId) || [])];
}

function settingsTabUiApi() {
  return window.SettingsTabUi || {};
}

function residentPanelUiApi() {
  return window.ResidentPanelUi || {};
}

function workspaceShellUiApi() {
  return window.WorkspaceShellUi || {};
}

function projectTabUiApi() {
  return window.ProjectTabUi || {};
}

function boardExecutionUiApi() {
  return window.BoardExecutionUi || {};
}

function taskDetailPanelUiApi() {
  return window.TaskDetailPanelUi || {};
}

const {
  appendEvent,
  appendPlanArtifactLocal,
  appendPlanArtifactWithFallback,
  appendTaskProgressLogEntryLocal,
  appendTaskProgressLogEntryWithFallback,
  appendTaskProgressLogForTarget,
  assignGateProfileToTarget,
  assignGateProfileToTargetWithRouting,
  buildGuideModelFailedPrompt,
  createGatePalId,
  createGuidePalId,
  createPalIdForRole,
  createWorkerPalId,
  findPlanArtifactByIdWithFallback,
  formatGateRoutingExplanation,
  formatNow,
  formatWorkerRoutingExplanation,
  gateProfileSummaryText,
  getActiveGuideProfile,
  getDefaultGateProfile,
  getGateProfileById,
  getLatestPlanArtifactWithFallback,
  getLatestTaskProgressLogEntryWithFallback,
  hideErrorToast,
  isErrorMessageId,
  listPlanArtifactsWithFallback,
  listTaskProgressLogEntriesWithFallback,
  messageText,
  resolveBoardTargetRecord,
  resolveGateProfileForTarget,
  resolveGateProfileForTargetWithRouting,
  resolveGateRoutingProfiles,
  resolveIdentityEditorAgentInput,
  resolveIdentitySecondaryDescriptor,
  resolvePlanArtifactApi,
  resolveProgressLogApi,
  resolveTargetPlanId,
  senderLabel,
  setMessage,
  shouldRequireReplanFromGateResult,
  showErrorToast,
  syncPalProfilesRegistryRefs,
  updatePlanArtifactLocal,
  updatePlanArtifactWithFallback,
} = settingsTabUiApi();

const {
  openIdentityEditorModal,
  openPalConfigModal,
  palAvatarFaceMarkup,
  palStatusBadgeClass,
  renderPalConfigModal,
} = residentPanelUiApi();

const {
  appendGateReasonTemplateById,
  applyI18n,
  eventSummaryText,
  filteredEvents,
  focusBoardRow,
  gateReasonTemplateLabel,
  jobActions,
  navigateToResubmitTarget,
  renderEventFilterControls,
  renderEventLog,
  renderGateReasonTemplates,
  renderGuideChat,
  renderJobBoard,
  renderTaskBoard,
  rerenderActiveTabPanel,
  setWorkspaceTab,
  statusBadgeClass,
  taskActions,
} = workspaceShellUiApi();
const {
  addProjectByDirectory,
  applyProjectStateSnapshot,
  buildProjectStateSnapshot,
  createProjectIdFromName,
  directoryFromPickerFile,
  ensureProjectStateConsistency,
  ensureUniqueProjectName,
  focusedProject,
  normalizeProjectDirectory,
  normalizeProjectDirectoryKey,
  normalizeProjectFileHints,
  normalizeProjectFilePath,
  normalizeProjectName,
  normalizeProjectRecord,
  projectByDirectory,
  projectById,
  projectByName,
  projectFocusLabel,
  projectNameFromDirectory,
  readProjectStateSnapshot,
  renderGuideProjectFocus,
  renderProjectTab,
  resolveProjectDialogBridge,
  writeProjectStateSnapshot,
} = projectTabUiApi();
const {
  applyGateDecisionToTarget,
  autoExecuteTarget,
  closeGate,
  openGate,
  queueAutoExecutionForCreatedTargets,
  runGate,
  runJobAction,
  runTaskAction,
} = boardExecutionUiApi();
const {
  selectedTask,
  renderDetail,
  touchTask,
  touchJob,
} = taskDetailPanelUiApi();

function syncSettingsModelsFromRegistry() {
  if (typeof settingsTabUiApi().syncSettingsModelsFromRegistry === "function") {
    return settingsTabUiApi().syncSettingsModelsFromRegistry();
  }
  return undefined;
}

function syncPalProfilesFromSettings() {
  if (typeof settingsTabUiApi().syncPalProfilesFromSettings === "function") {
    return settingsTabUiApi().syncPalProfilesFromSettings();
  }
  return undefined;
}

function renderSettingsTab() {
  if (typeof settingsTabUiApi().renderSettingsTab === "function") {
    return settingsTabUiApi().renderSettingsTab();
  }
  return undefined;
}

function closePalConfigModal() {
  if (typeof residentPanelUiApi().closePalConfigModal === "function") {
    return residentPanelUiApi().closePalConfigModal();
  }
  return undefined;
}

function closeIdentityEditorModal() {
  if (typeof residentPanelUiApi().closeIdentityEditorModal === "function") {
    return residentPanelUiApi().closeIdentityEditorModal();
  }
  return undefined;
}

function renderIdentityEditorModal() {
  if (typeof residentPanelUiApi().renderIdentityEditorModal === "function") {
    return residentPanelUiApi().renderIdentityEditorModal();
  }
  return undefined;
}

function renderPalList() {
  if (typeof residentPanelUiApi().renderPalList === "function") {
    return residentPanelUiApi().renderPalList();
  }
  return undefined;
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
    ? "Cron を実行し、結果要約と Gate 審査用の evidence を返す。"
    : "Task を完了し、Gate 審査用の evidence を返す。";
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
    : `${palName || "担当Pal"} が実行し、${gateName || "既定Gate"} が審査する。`;
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
      statusEl.textContent = locale === "en" ? "Gate model is reviewing..." : "Gate モデルが審査中です...";
    } else if (gateRuntimeState.error) {
      statusEl.textContent = locale === "en" ? "Gate model review is unavailable." : "Gate モデル審査は利用できません。";
    } else if (gateRuntimeState.suggestedDecision !== "none") {
      const label = gateRuntimeState.suggestedDecision === "approved"
        ? (locale === "en" ? "approve" : "approve")
        : (locale === "en" ? "reject" : "reject");
      statusEl.textContent = locale === "en"
        ? `Gate model suggested: ${label}`
        : `Gate モデル審査: ${label}`;
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
    : `<li>${escapeHtml(locale === "en" ? "No fixes" : "修正項目なし")}</li>`;
  suggestionEl.classList.remove("hidden");
  suggestionEl.innerHTML = `
    <div class="font-semibold">${escapeHtml(locale === "en" ? "Gate Suggestion" : "Gate 提案")}</div>
    <div class="mt-1 text-xs text-base-content/70">${escapeHtml(locale === "en" ? "decision" : "decision")}: ${escapeHtml(gateRuntimeState.suggestedDecision)}</div>
    <div class="mt-2 text-sm">${escapeHtml(gateRuntimeState.reason || "-")}</div>
    <ul class="mt-2 list-disc pl-5 text-xs text-base-content/75">${fixes}</ul>
  `;
}

async function requestGateRuntimeReviewSuggestion(target, targetKind = "task", gateProfile = null) {
  if (!target || !gateProfile) return null;
  const runtimeApi = resolveTomoshibikanCoreRuntimeApi();
  const runtimeConfig = resolvePalRuntimeConfigForExecution(gateProfile);
  if (!runtimeApi || typeof runtimeApi.palChat !== "function" || !runtimeConfig || !runtimeConfig.modelName) {
    return null;
  }
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
  const rawText = normalizeText(response?.text);
  const parsed = parseGateRuntimeResponse(rawText);
  if (!parsed) return null;
  return {
    ...parsed,
    rawText,
    runId: normalizeText(response?.runId),
  };
}

async function executeGateRuntimeReview(target, targetKind = "task", gateProfile = null) {
  if (!target || !gateProfile) return;
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
    const response = await requestGateRuntimeReviewSuggestion(target, targetKind, gateProfile);
    if (gateRuntimeState.requestSeq !== requestSeq || !gateTarget || gateTarget.id !== target.id) return;
    gateRuntimeState.loading = false;
    gateRuntimeState.rawText = normalizeText(response?.rawText);
    if (!response) {
      gateRuntimeState.error = "parse";
      renderGateRuntimeSuggestion();
      return;
    }
    gateRuntimeState.suggestedDecision = response.decision;
    gateRuntimeState.reason = response.reason;
    gateRuntimeState.fixes = response.fixes;
    if (response.decision === "rejected") {
      const reasonInput = document.getElementById("gateReason");
      if (reasonInput && !normalizeText(reasonInput.value)) {
        reasonInput.value = response.fixes.length > 0 ? response.fixes.join("\n") : response.reason;
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
  if (!hasTomoshibikanCorePalChatApi()) return;
  const collection = targetKind === "job" ? jobs : tasks;
  const target = collection.find((item) => item.id === targetId);
  if (!target) return;
  const pal = palProfiles.find((entry) => entry.id === target.palId);
  if (!pal) return;
  const runtimeConfig = resolvePalRuntimeConfigForExecution(pal);
  if (!runtimeConfig || !runtimeConfig.modelName) return;
  const runtimeApi = resolveTomoshibikanCoreRuntimeApi();
  if (!runtimeApi || typeof runtimeApi.palChat !== "function") return;
  try {
    const [enabledSkillIds, identity] = await Promise.all([
      resolveConfiguredSkillIdsForPal(pal),
      loadAgentIdentityForPal(pal),
    ]);
    const role = normalizePalRole(pal.role);
    const runtimeKind = normalizePalRuntimeKind(pal.runtimeKind);
    const selectedToolNames = Array.isArray(pal.cliTools) ? pal.cliTools : [];
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
        selectedToolNames,
        registeredToolCapabilities: resolveRegisteredToolCapabilitySnapshots(selectedToolNames),
      })
      : null;
    const skillSummaries = Array.isArray(resolvedByApi?.skillSummaries)
      ? resolvedByApi.skillSummaries
      : fallbackResolveSkillSummaries(
        runtimeKind,
        enabledSkillIds,
        installedSkillIds,
        skillCatalogItems,
        selectedToolNames,
        resolveRegisteredToolCapabilitySnapshots(selectedToolNames)
      );
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
    const workerProgressConversation = buildWorkerProgressConversationMessage(latest, latest.palId, "ok", latest.evidence);
    void appendTaskProgressLogForTarget(targetKind, latest.id, "worker_runtime", {
      planId: resolveTargetPlanId(latest),
      actualActor: "worker",
      displayActor: "Resident",
      status: "ok",
      messageJa: workerProgressConversation.messageJa,
      messageEn: workerProgressConversation.messageEn,
      payload: {
        assigneePalId: normalizeText(latest.palId),
        assigneeDisplayName: residentDisplayName(latest.palId, latest.palId),
        taskTitle: latest.title,
        taskDescription: latest.description || latest.instruction,
        evidence: normalizeText(latest.evidence),
        replay: normalizeText(latest.replay),
      },
    });
    rerenderAll();
  } catch (error) {
    appendEvent(
      targetKind,
      targetId,
      "runtime_error",
      `${targetId} の実行でエラーが発生しました`,
      `${targetId} runtime execution failed`
    );
    const targetRecord = collection.find((item) => item.id === targetId) || null;
    const workerProgressConversation = buildWorkerProgressConversationMessage(targetRecord, targetRecord?.palId, "error", normalizeText(error?.message || error));
    void appendTaskProgressLogForTarget(targetKind, targetId, "worker_runtime", {
      planId: resolveTargetPlanId(collection.find((item) => item.id === targetId)),
      actualActor: "worker",
      displayActor: "Resident",
      status: "error",
      messageJa: workerProgressConversation.messageJa,
      messageEn: workerProgressConversation.messageEn,
      payload: {
        assigneePalId: normalizeText(targetRecord?.palId),
        assigneeDisplayName: residentDisplayName(targetRecord?.palId, targetRecord?.palId),
        taskTitle: normalizeText(targetRecord?.title),
        taskDescription: normalizeText(targetRecord?.description || targetRecord?.instruction),
        errorText: normalizeText(error?.message || error),
      },
    });
    rerenderAll();
  }
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

  bindGuideComposerEvents();

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


