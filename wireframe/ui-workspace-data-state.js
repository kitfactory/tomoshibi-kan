// Workspace data/bootstrap state only.
var projectSeq = INITIAL_PROJECTS.length;

var projectState = {
  projects: INITIAL_PROJECTS.map((item) => ({ ...item, files: [...item.files] })),
  focusProjectId: INITIAL_PROJECTS[0]?.id || "",
  addDraft: {
    name: "",
    directory: "",
  },
};
window.projectState = projectState;

var guideMessages = INITIAL_GUIDE_MESSAGES.map((message) => ({
  ...message,
  text: { ...message.text },
}));
var tasks = INITIAL_TASKS.map((task) => ({ ...task }));
var jobs = INITIAL_JOBS.map((job) => ({ ...job }));
var palProfiles = INITIAL_PAL_PROFILES.map((pal) => ({
  ...pal,
  models: Array.isArray(pal.models) ? [...pal.models] : [],
  cliTools: Array.isArray(pal.cliTools) ? [...pal.cliTools] : [],
  skills: Array.isArray(pal.skills) ? [...pal.skills] : [],
}));
var workspaceAgentSelection = { ...DEFAULT_AGENT_SELECTION };

var events = [
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
var progressLogEntries = [];
var planArtifacts = [];

window.guideMessages = guideMessages;
window.tasks = tasks;
window.jobs = jobs;
window.palProfiles = palProfiles;
window.workspaceAgentSelection = workspaceAgentSelection;
window.events = events;
window.progressLogEntries = progressLogEntries;
window.planArtifacts = planArtifacts;
