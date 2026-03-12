(function attachWorkspaceAgentGuideRuntimeUi(scope) {
const interopApi = scope.WorkspaceAgentGuideInteropUi || {};
const contextApi = scope.WorkspaceAgentGuideContextUi || {};

function resolveAssignmentApi() {
  return scope.WorkspaceAgentAssignmentUi || {};
}

function nextTaskSequenceNumber() {
  const assignmentApi = resolveAssignmentApi();
  return typeof assignmentApi.nextTaskSequenceNumber === "function"
    ? assignmentApi.nextTaskSequenceNumber()
    : 1;
}

function nextJobSequenceNumber() {
  const assignmentApi = resolveAssignmentApi();
  return typeof assignmentApi.nextJobSequenceNumber === "function"
    ? assignmentApi.nextJobSequenceNumber()
    : 1;
}

async function resolveWorkerAssignmentProfiles(...args) {
  const assignmentApi = resolveAssignmentApi();
  if (typeof assignmentApi.resolveWorkerAssignmentProfiles !== "function") return [];
  return assignmentApi.resolveWorkerAssignmentProfiles(...args);
}

function resolveRegisteredModelForPal(...args) {
  const assignmentApi = resolveAssignmentApi();
  if (typeof assignmentApi.resolveRegisteredModelForPal !== "function") return null;
  return assignmentApi.resolveRegisteredModelForPal(...args);
}

function resolvePalRuntimeConfigForExecution(...args) {
  const assignmentApi = resolveAssignmentApi();
  if (typeof assignmentApi.resolvePalRuntimeConfigForExecution !== "function") return null;
  return assignmentApi.resolvePalRuntimeConfigForExecution(...args);
}

async function resolveConfiguredSkillIdsForPal(...args) {
  const assignmentApi = resolveAssignmentApi();
  if (typeof assignmentApi.resolveConfiguredSkillIdsForPal !== "function") return [];
  return assignmentApi.resolveConfiguredSkillIdsForPal(...args);
}

const api = {
  ...interopApi,
  ...contextApi,
  nextTaskSequenceNumber,
  nextJobSequenceNumber,
  resolveWorkerAssignmentProfiles,
  resolveRegisteredModelForPal,
  resolvePalRuntimeConfigForExecution,
  resolveConfiguredSkillIdsForPal,
};

scope.WorkspaceAgentGuideRuntimeUi = api;
if (scope.window && scope.window !== scope) {
  scope.window.WorkspaceAgentGuideRuntimeUi = api;
}
})(typeof window !== "undefined" ? window : globalThis);