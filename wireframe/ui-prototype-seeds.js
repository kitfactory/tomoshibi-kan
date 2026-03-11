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

const INITIAL_GUIDE_MESSAGES = [
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

const INITIAL_TASKS = [
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

const INITIAL_JOBS = [
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

window.DEFAULT_PROJECT_FILE_HINTS = DEFAULT_PROJECT_FILE_HINTS;
window.PROJECTS_LOCAL_STORAGE_KEY = PROJECTS_LOCAL_STORAGE_KEY;
window.LEGACY_PROJECTS_LOCAL_STORAGE_KEYS = LEGACY_PROJECTS_LOCAL_STORAGE_KEYS;
