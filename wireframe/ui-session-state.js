// Session/navigation state only.
var locale = "ja";
var selectedTaskId = null;
var gateTarget = null;
var workspaceTab = "guide";
var eventSeq = 0;
var eventSearchQuery = "";
var eventTypeFilter = "all";
var eventPage = 1;
var detailRenderToken = 0;

window.getCurrentLocale = () => locale;
