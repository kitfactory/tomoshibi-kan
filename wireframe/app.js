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

function workspaceAgentStateUiApi() {
  if (typeof window !== "undefined" && window && window.WorkspaceAgentStateUi) {
    return window.WorkspaceAgentStateUi;
  }
  return {};
}

function clonePalProfileRecord(...args) { return workspaceAgentStateUiApi().clonePalProfileRecord(...args); }
function normalizePalProfileIdWithFallback(...args) { return workspaceAgentStateUiApi().normalizePalProfileIdWithFallback(...args); }
function defaultPalDisplayNameForRole(...args) { return workspaceAgentStateUiApi().defaultPalDisplayNameForRole(...args); }
function defaultPalPersonaForRole(...args) { return workspaceAgentStateUiApi().defaultPalPersonaForRole(...args); }
function normalizePalProfileRecord(...args) { return workspaceAgentStateUiApi().normalizePalProfileRecord(...args); }
function resolveAgentSelectionSnapshotWithFallback(...args) { return workspaceAgentStateUiApi().resolveAgentSelectionSnapshotWithFallback(...args); }
function syncWorkspaceAgentSelection(...args) { return workspaceAgentStateUiApi().syncWorkspaceAgentSelection(...args); }
function buildPalProfilesSnapshot(...args) { return workspaceAgentStateUiApi().buildPalProfilesSnapshot(...args); }
function normalizePalProfilesSnapshot(...args) { return workspaceAgentStateUiApi().normalizePalProfilesSnapshot(...args); }
function readPalProfilesSnapshotWithFallback(...args) { return workspaceAgentStateUiApi().readPalProfilesSnapshotWithFallback(...args); }
function writePalProfilesSnapshotWithFallback(...args) { return workspaceAgentStateUiApi().writePalProfilesSnapshotWithFallback(...args); }
function applyPalProfilesSnapshot(...args) { return workspaceAgentStateUiApi().applyPalProfilesSnapshot(...args); }
function isBuiltInProfileId(...args) { return workspaceAgentStateUiApi().isBuiltInProfileId(...args); }
function resolveBuiltInProfileDefinition(...args) { return workspaceAgentStateUiApi().resolveBuiltInProfileDefinition(...args); }
function syncBuiltInProfileMetadata(...args) { return workspaceAgentStateUiApi().syncBuiltInProfileMetadata(...args); }
function normalizeGateDecision(...args) { return workspaceAgentStateUiApi().normalizeGateDecision(...args); }
function parseGateFixes(...args) { return workspaceAgentStateUiApi().parseGateFixes(...args); }
function normalizeGateResultRecord(...args) { return workspaceAgentStateUiApi().normalizeGateResultRecord(...args); }
function buildGateResultRecord(...args) { return workspaceAgentStateUiApi().buildGateResultRecord(...args); }
function normalizeTaskRecord(...args) { return workspaceAgentStateUiApi().normalizeTaskRecord(...args); }
function normalizeJobRecord(...args) { return workspaceAgentStateUiApi().normalizeJobRecord(...args); }
function buildBoardStateSnapshot(...args) { return workspaceAgentStateUiApi().buildBoardStateSnapshot(...args); }
function normalizeBoardStateSnapshot(...args) { return workspaceAgentStateUiApi().normalizeBoardStateSnapshot(...args); }
function readBoardStateSnapshot(...args) { return workspaceAgentStateUiApi().readBoardStateSnapshot(...args); }
function writeBoardStateSnapshot(...args) { return workspaceAgentStateUiApi().writeBoardStateSnapshot(...args); }
function applyBoardStateSnapshot(...args) { return workspaceAgentStateUiApi().applyBoardStateSnapshot(...args); }
function providerLabel(...args) { return workspaceAgentStateUiApi().providerLabel(...args); }
function providerIdFromInput(...args) { return workspaceAgentStateUiApi().providerIdFromInput(...args); }
function isApiKeyRequiredForProvider(...args) { return workspaceAgentStateUiApi().isApiKeyRequiredForProvider(...args); }
function resolveProviderForModelName(...args) { return workspaceAgentStateUiApi().resolveProviderForModelName(...args); }
function normalizeRegisteredModel(...args) { return workspaceAgentStateUiApi().normalizeRegisteredModel(...args); }
function normalizeToolName(...args) { return workspaceAgentStateUiApi().normalizeToolName(...args); }
function allowedSkillIdsForRole(...args) { return workspaceAgentStateUiApi().allowedSkillIdsForRole(...args); }
function normalizePalRole(...args) { return workspaceAgentStateUiApi().normalizePalRole(...args); }
function normalizePalRuntimeKind(...args) { return workspaceAgentStateUiApi().normalizePalRuntimeKind(...args); }
function validatePalRuntimeSelectionWithFallback(...args) { return workspaceAgentStateUiApi().validatePalRuntimeSelectionWithFallback(...args); }
function resolvePalProfileModelApi(...args) { return workspaceAgentStateUiApi().resolvePalProfileModelApi(...args); }
function createPalProfileWithFallback(...args) { return workspaceAgentStateUiApi().createPalProfileWithFallback(...args); }
function canDeletePalProfileWithFallback(...args) { return workspaceAgentStateUiApi().canDeletePalProfileWithFallback(...args); }
function applyPalRuntimeSelectionWithFallback(...args) { return workspaceAgentStateUiApi().applyPalRuntimeSelectionWithFallback(...args); }
function resolveGuideChatModelApi(...args) { return workspaceAgentStateUiApi().resolveGuideChatModelApi(...args); }
function resolveGuideModelStateWithFallback(...args) { return workspaceAgentStateUiApi().resolveGuideModelStateWithFallback(...args); }
function bindGuideToFirstRegisteredModelWithFallback(...args) { return workspaceAgentStateUiApi().bindGuideToFirstRegisteredModelWithFallback(...args); }
function buildGuideReplyWithFallback(...args) { return workspaceAgentStateUiApi().buildGuideReplyWithFallback(...args); }
function buildGuideModelRequiredPromptWithFallback(...args) { return workspaceAgentStateUiApi().buildGuideModelRequiredPromptWithFallback(...args); }
function resolveGuideRegisteredModel(...args) { return workspaceAgentStateUiApi().resolveGuideRegisteredModel(...args); }
function resolveGuideApiRuntimeConfig(...args) { return workspaceAgentStateUiApi().resolveGuideApiRuntimeConfig(...args); }
function requestGuideModelReplyWithFallback(...args) { return workspaceAgentStateUiApi().requestGuideModelReplyWithFallback(...args); }
function buildFallbackGuidePlanOutputInstruction(...args) { return workspaceAgentStateUiApi().buildFallbackGuidePlanOutputInstruction(...args); }
function parseGuidePlanResponseWithFallback(...args) { return workspaceAgentStateUiApi().parseGuidePlanResponseWithFallback(...args); }
function palRoleLabel(...args) { return workspaceAgentStateUiApi().palRoleLabel(...args); }
function coreModelOptionsByProvider(...args) { return workspaceAgentStateUiApi().coreModelOptionsByProvider(...args); }
function resolvePalContextBuilderApi(...args) { return workspaceAgentStateUiApi().resolvePalContextBuilderApi(...args); }
function resolveAgentIdentityApi(...args) { return workspaceAgentStateUiApi().resolveAgentIdentityApi(...args); }
function initializePalIdentityTemplates(...args) { return workspaceAgentStateUiApi().initializePalIdentityTemplates(...args); }
function ensureBuiltInDebugPurposeIdentities(...args) { return workspaceAgentStateUiApi().ensureBuiltInDebugPurposeIdentities(...args); }
function syncBuiltInResidentIdentitiesToWorkspace(...args) { return workspaceAgentStateUiApi().syncBuiltInResidentIdentitiesToWorkspace(...args); }
function resolveAgentSkillResolverApi(...args) { return workspaceAgentStateUiApi().resolveAgentSkillResolverApi(...args); }
function resolveGuideTaskPlannerApi(...args) { return workspaceAgentStateUiApi().resolveGuideTaskPlannerApi(...args); }
function resolveGuidePlanApi(...args) { return workspaceAgentStateUiApi().resolveGuidePlanApi(...args); }
function resolveGuidePlanningIntentApi(...args) { return workspaceAgentStateUiApi().resolveGuidePlanningIntentApi(...args); }
function resolveAgentRoutingApi(...args) { return workspaceAgentStateUiApi().resolveAgentRoutingApi(...args); }
function resolveDebugIdentitySeedsApi(...args) { return workspaceAgentStateUiApi().resolveDebugIdentitySeedsApi(...args); }
function resolvePlanOrchestratorApi(...args) { return workspaceAgentStateUiApi().resolvePlanOrchestratorApi(...args); }
function resolveDebugRunsApi(...args) { return workspaceAgentStateUiApi().resolveDebugRunsApi(...args); }
function guideMessageToContextMessage(...args) { return workspaceAgentStateUiApi().guideMessageToContextMessage(...args); }
function normalizeGuideContextMessages(...args) { return workspaceAgentStateUiApi().normalizeGuideContextMessages(...args); }
function splitSystemPromptFromContextMessages(...args) { return workspaceAgentStateUiApi().splitSystemPromptFromContextMessages(...args); }
function buildFallbackLanguagePrompt(...args) { return workspaceAgentStateUiApi().buildFallbackLanguagePrompt(...args); }
function buildFallbackIdentitySystemPrompt(...args) { return workspaceAgentStateUiApi().buildFallbackIdentitySystemPrompt(...args); }
function normalizeToolCapabilitySnapshots(...args) { return workspaceAgentStateUiApi().normalizeToolCapabilitySnapshots(...args); }
function resolveRegisteredToolCapabilitySnapshots(...args) { return workspaceAgentStateUiApi().resolveRegisteredToolCapabilitySnapshots(...args); }
function loadAgentIdentityForPal(...args) { return workspaceAgentStateUiApi().loadAgentIdentityForPal(...args); }
function fallbackResolveSkillSummaries(...args) { return workspaceAgentStateUiApi().fallbackResolveSkillSummaries(...args); }
function resolveGuideConfiguredSkillIds(...args) { return workspaceAgentStateUiApi().resolveGuideConfiguredSkillIds(...args); }
function buildGuideContextWithFallback(...args) { return workspaceAgentStateUiApi().buildGuideContextWithFallback(...args); }
function nextTaskSequenceNumber(...args) { return workspaceAgentStateUiApi().nextTaskSequenceNumber(...args); }
function nextJobSequenceNumber(...args) { return workspaceAgentStateUiApi().nextJobSequenceNumber(...args); }
function resolveWorkerAssignmentProfiles(...args) { return workspaceAgentStateUiApi().resolveWorkerAssignmentProfiles(...args); }

function buildGuideRoutingOperatingRulesPrompt(localeValue) {
  const api = executionRuntimeUiApi();
  if (!api || typeof api.buildGuideRoutingOperatingRulesPrompt !== "function") return "";
  return api.buildGuideRoutingOperatingRulesPrompt(buildExecutionRuntimeContext(), localeValue);
}

function buildGuideRoutingUserText(routingInput) {
  const api = executionRuntimeUiApi();
  if (!api || typeof api.buildGuideRoutingUserText !== "function") return safeStringify(routingInput, "{}");
  return api.buildGuideRoutingUserText(buildExecutionRuntimeContext(), routingInput);
}

async function requestGuideDrivenWorkerRoutingDecision(params = {}) {
  const api = executionRuntimeUiApi();
  if (!api || typeof api.requestGuideDrivenWorkerRoutingDecision !== "function") return null;
  return api.requestGuideDrivenWorkerRoutingDecision(buildExecutionRuntimeContext(), params);
}

function buildPlanOrchestratorRoutingApi(baseRoutingApi) {
  const api = executionRuntimeUiApi();
  if (!api || typeof api.buildPlanOrchestratorRoutingApi !== "function") return baseRoutingApi || null;
  return api.buildPlanOrchestratorRoutingApi(buildExecutionRuntimeContext(), baseRoutingApi);
}

function createTaskRecord(input) {
  const api = executionRuntimeUiApi();
  if (!api || typeof api.createTaskRecord !== "function") return null;
  return api.createTaskRecord(buildExecutionRuntimeContext(), input);
}

async function createPlannedTasksFromGuideRequest(userText) {
  const api = executionRuntimeUiApi();
  if (!api || typeof api.createPlannedTasksFromGuideRequest !== "function") return { created: 0 };
  return api.createPlannedTasksFromGuideRequest(buildExecutionRuntimeContext(), userText);
}

async function createPlannedTasksFromGuidePlan(plan, options = {}) {
  const api = executionRuntimeUiApi();
  if (!api || typeof api.createPlannedTasksFromGuidePlan !== "function") return { created: 0 };
  return api.createPlannedTasksFromGuidePlan(buildExecutionRuntimeContext(), plan, options);
}

async function materializeApprovedPlanArtifact(artifact) {
  const api = executionRuntimeUiApi();
  if (!api || typeof api.materializeApprovedPlanArtifact !== "function") return { created: 0 };
  return api.materializeApprovedPlanArtifact(buildExecutionRuntimeContext(), artifact);
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

function resolveRegisteredModelForPal(...args) { return workspaceAgentStateUiApi().resolveRegisteredModelForPal(...args); }
function resolvePalRuntimeConfigForExecution(...args) { return workspaceAgentStateUiApi().resolvePalRuntimeConfigForExecution(...args); }
async function resolveConfiguredSkillIdsForPal(...args) { return workspaceAgentStateUiApi().resolveConfiguredSkillIdsForPal(...args); }

function runtimePayloadUiApi() {
  return window.RuntimePayloadUi || {};
}

function executionRuntimeUiApi() {
  return window.ExecutionRuntimeUi || {};
}

function buildRuntimePayloadContext() {
  return {
    locale,
    settingsState,
    guideMessages,
    normalizeText,
    normalizeContextHandoffPolicy,
    focusedProject,
    resolveGateProfileForTarget,
    palProfiles,
    normalizeGateDecision,
    parseGateFixes,
  };
}

function buildExecutionRuntimeContext() {
  return {
    locale,
    palProfiles,
    tasks,
    jobs,
    settingsState,
    gateRuntimeState,
    normalizeText,
    escapeHtml,
    safeStringify,
    formatNow,
    appendEvent,
    appendTaskProgressLogForTarget,
    resolveTargetPlanId,
    rerenderAll,
    renderTaskBoard,
    renderJobBoard,
    writeBoardStateSnapshot,
    findPlanArtifactByIdWithFallback,
    appendPlanArtifactWithFallback,
    materializeApprovedPlanArtifact,
    queueAutoExecutionForCreatedTargets,
    resolveGuideModelStateWithFallback,
    resolveGuideApiRuntimeConfig,
    resolveStoredModelApiKeyWithFallback,
    resolveGuideConfiguredSkillIds,
    getActiveGuideProfile,
    buildGuideContextWithFallback,
    requestGuideModelReplyWithFallback,
    parseGuidePlanResponseWithFallback,
    resolveGuideTaskPlannerApi,
    resolveAgentRoutingApi,
    resolveWorkerAssignmentProfiles,
    nextTaskSequenceNumber,
    nextJobSequenceNumber,
    resolvePalRuntimeConfigForExecution,
    resolveTomoshibikanCoreRuntimeApi,
    resolveConfiguredSkillIdsForPal,
    loadAgentIdentityForPal,
    normalizePalRole,
    normalizePalRuntimeKind,
    resolveAgentSkillResolverApi,
    normalizeSkillId,
    resolveRegisteredToolCapabilitySnapshots,
    fallbackResolveSkillSummaries,
    resolveRuntimeWorkspaceRootForChat,
    buildOperatingRulesPrompt,
    resolvePalContextBuilderApi,
    splitSystemPromptFromContextMessages,
    buildFallbackIdentitySystemPrompt,
    buildPalRuntimeUserText,
    buildGateReviewInput,
    buildGateReviewUserText,
    parseGateRuntimeResponse,
    buildDebugIdentityVersions,
    hasTomoshibikanCorePalChatApi,
    CLAWHUB_SKILL_REGISTRY,
    formatWorkerRoutingExplanation,
    resolvePlanOrchestratorApi,
    createJobRecord: typeof createJobRecord === "function" ? createJobRecord : null,
    getSelectedTaskId: () => selectedTaskId,
    setSelectedTaskId: (value) => {
      selectedTaskId = value;
    },
    getGateTarget: () => gateTarget,
  };
}

function resolveContextHandoffPolicy() {
  return runtimePayloadUiApi().resolveContextHandoffPolicy(buildRuntimePayloadContext());
}

function buildCompressedHistorySummary(target, targetKind = "task") {
  return runtimePayloadUiApi().buildCompressedHistorySummary(buildRuntimePayloadContext(), target, targetKind);
}

function buildWorkerExecutionConstraints(target) {
  return runtimePayloadUiApi().buildWorkerExecutionConstraints(buildRuntimePayloadContext(), target);
}

function buildWorkerExpectedOutput(targetKind = "task") {
  return runtimePayloadUiApi().buildWorkerExpectedOutput(buildRuntimePayloadContext(), targetKind);
}

function buildWorkerProjectContext() {
  return runtimePayloadUiApi().buildWorkerProjectContext(buildRuntimePayloadContext());
}

function buildWorkerHandoffSummary(target, targetKind = "task", pal = null, gateProfile = null) {
  return runtimePayloadUiApi().buildWorkerHandoffSummary(buildRuntimePayloadContext(), target, targetKind, pal, gateProfile);
}

function buildWorkerExecutionInput(target, targetKind = "task") {
  return runtimePayloadUiApi().buildWorkerExecutionInput(buildRuntimePayloadContext(), target, targetKind);
}

function buildWorkerExecutionUserText(executionInput) {
  return runtimePayloadUiApi().buildWorkerExecutionUserText(buildRuntimePayloadContext(), executionInput);
}

function buildPalRuntimeUserText(target, targetKind = "task") {
  return runtimePayloadUiApi().buildPalRuntimeUserText(buildRuntimePayloadContext(), target, targetKind);
}

function hashTextForVersion(value, prefix = "content") {
  return runtimePayloadUiApi().hashTextForVersion(buildRuntimePayloadContext(), value, prefix);
}

function buildDebugIdentityVersions(identity) {
  return runtimePayloadUiApi().buildDebugIdentityVersions(buildRuntimePayloadContext(), identity);
}

function buildGateRejectHistorySummary(target) {
  return runtimePayloadUiApi().buildGateRejectHistorySummary(buildRuntimePayloadContext(), target);
}

function buildGateReviewInput(target, targetKind = "task", gateProfile = null, identity = null) {
  return runtimePayloadUiApi().buildGateReviewInput(buildRuntimePayloadContext(), target, targetKind, gateProfile, identity);
}

function buildGateReviewUserText(reviewInput) {
  return runtimePayloadUiApi().buildGateReviewUserText(buildRuntimePayloadContext(), reviewInput);
}

function parseGateRuntimeResponse(text) {
  return runtimePayloadUiApi().parseGateRuntimeResponse(buildRuntimePayloadContext(), text);
}

function enqueueAutoExecution(work) {
  return executionRuntimeUiApi().enqueueAutoExecution(work);
}

function findResidentProfileById(profileId) {
  return executionRuntimeUiApi().findResidentProfileById(buildExecutionRuntimeContext(), profileId);
}

function residentDisplayName(profileId, fallback = "") {
  return executionRuntimeUiApi().residentDisplayName(buildExecutionRuntimeContext(), profileId, fallback);
}

function residentAddressName(profileId, fallback = "") {
  return executionRuntimeUiApi().residentAddressName(buildExecutionRuntimeContext(), profileId, fallback);
}

function summarizeConversationIntent(text, fallback = "") {
  return executionRuntimeUiApi().summarizeConversationIntent(buildExecutionRuntimeContext(), text, fallback);
}

function firstMeaningfulLine(text) {
  return executionRuntimeUiApi().firstMeaningfulLine(buildExecutionRuntimeContext(), text);
}

function buildDispatchConversationMessage(target, workerId, routingExplanation) {
  return executionRuntimeUiApi().buildDispatchConversationMessage(buildExecutionRuntimeContext(), target, workerId, routingExplanation);
}

function buildRerouteConversationMessage(target, fromWorkerId, toWorkerId) {
  return executionRuntimeUiApi().buildRerouteConversationMessage(buildExecutionRuntimeContext(), target, fromWorkerId, toWorkerId);
}

function buildGateHandOffConversationMessage(target, gateProfileId, gateExplanation) {
  return executionRuntimeUiApi().buildGateHandOffConversationMessage(buildExecutionRuntimeContext(), target, gateProfileId, gateExplanation);
}

function buildResubmitConversationMessage(target, gateProfileId) {
  return executionRuntimeUiApi().buildResubmitConversationMessage(buildExecutionRuntimeContext(), target, gateProfileId);
}

function buildWorkerProgressConversationMessage(target, workerId, status, evidenceText) {
  return executionRuntimeUiApi().buildWorkerProgressConversationMessage(buildExecutionRuntimeContext(), target, workerId, status, evidenceText);
}

function buildGateReviewConversationMessage(target, gateProfileId, gateResult, status) {
  return executionRuntimeUiApi().buildGateReviewConversationMessage(buildExecutionRuntimeContext(), target, gateProfileId, gateResult, status);
}

function buildPlanCompletedConversationMessage(planId) {
  return executionRuntimeUiApi().buildPlanCompletedConversationMessage(buildExecutionRuntimeContext(), planId);
}

function buildGuideReplanUserText(targetKind, target, planArtifact, gateResult) {
  return executionRuntimeUiApi().buildGuideReplanUserText(buildExecutionRuntimeContext(), targetKind, target, planArtifact, gateResult);
}

function executeGuideDrivenReplanForTarget(targetKind, target, gateResult) {
  return executionRuntimeUiApi().executeGuideDrivenReplanForTarget(buildExecutionRuntimeContext(), targetKind, target, gateResult);
}

function resetGateRuntimeState() {
  return executionRuntimeUiApi().resetGateRuntimeState(buildExecutionRuntimeContext());
}

function renderGateRuntimeSuggestion() {
  return executionRuntimeUiApi().renderGateRuntimeSuggestion(buildExecutionRuntimeContext());
}

function requestGateRuntimeReviewSuggestion(target, targetKind = "task", gateProfile = null) {
  return executionRuntimeUiApi().requestGateRuntimeReviewSuggestion(buildExecutionRuntimeContext(), target, targetKind, gateProfile);
}

function executeGateRuntimeReview(target, targetKind = "task", gateProfile = null) {
  return executionRuntimeUiApi().executeGateRuntimeReview(buildExecutionRuntimeContext(), target, targetKind, gateProfile);
}

function summarizeRuntimeReplay(toolCalls) {
  return executionRuntimeUiApi().summarizeRuntimeReplay(buildExecutionRuntimeContext(), toolCalls);
}

function executePalRuntimeForTarget(targetId, targetKind = "task") {
  return executionRuntimeUiApi().executePalRuntimeForTarget(buildExecutionRuntimeContext(), targetId, targetKind);
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


