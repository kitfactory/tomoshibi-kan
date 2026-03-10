
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

