const fs = require("fs");
const path = require("path");
const vm = require("vm");

function fail(message) {
  fs.writeSync(2, `[i18n-verify][ERROR] ${message}\n`);
}

function info(message) {
  fs.writeSync(1, `[i18n-verify] ${message}\n`);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function extractObjectLiteral(source, pattern, label) {
  const match = source.match(pattern);
  if (!match || !match[1]) {
    throw new Error(`Failed to extract ${label}`);
  }
  const literal = match[1].trim().replace(/;\s*$/, "");
  return vm.runInNewContext(`(${literal})`, Object.create(null));
}

function uniqueMatches(source, regex) {
  const matches = source.match(regex) || [];
  return [...new Set(matches)];
}

function assertString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function verify() {
  const projectRoot = process.cwd();
  const appJsPath = path.join(projectRoot, "wireframe", "app.js");
  const indexHtmlPath = path.join(projectRoot, "wireframe", "index.html");

  const appSource = readFile(appJsPath);
  const htmlSource = readFile(indexHtmlPath);

  const uiText = extractObjectLiteral(
    appSource,
    /const UI_TEXT = ([\s\S]*?)\r?\nconst DYNAMIC_TEXT =/,
    "UI_TEXT"
  );
  const messageText = extractObjectLiteral(
    appSource,
    /const MESSAGE_TEXT = ([\s\S]*?)\r?\nconst GUIDE_MODEL_REQUEST_TIMEOUT_MS =/,
    "MESSAGE_TEXT"
  );

  const errors = [];

  if (!uiText.ja || !uiText.en) {
    errors.push("UI_TEXT must define both ja and en locales");
  }

  const uiJaKeys = Object.keys(uiText.ja || {});
  const uiEnKeys = Object.keys(uiText.en || {});
  const allUiKeys = [...new Set([...uiJaKeys, ...uiEnKeys])];
  allUiKeys.forEach((id) => {
    if (!assertString(uiText.ja?.[id])) {
      errors.push(`UI_TEXT.ja missing or empty for ${id}`);
    }
    if (!assertString(uiText.en?.[id])) {
      errors.push(`UI_TEXT.en missing or empty for ${id}`);
    }
  });

  const htmlUiIds = uniqueMatches(htmlSource, /UI-PPH-\d{4}/g);
  const appUiIds = uniqueMatches(appSource, /UI-PPH-\d{4}/g);
  const usedUiIds = [...new Set([...htmlUiIds, ...appUiIds])];
  usedUiIds.forEach((id) => {
    if (!assertString(uiText.ja?.[id]) || !assertString(uiText.en?.[id])) {
      errors.push(`UI dictionary missing locale entry for used id: ${id}`);
    }
  });

  const usedMsgIds = uniqueMatches(appSource, /MSG-PPH-\d{4}/g);
  usedMsgIds.forEach((id) => {
    const entry = messageText[id];
    if (!entry || typeof entry !== "object") {
      errors.push(`MESSAGE_TEXT missing entry for used id: ${id}`);
      return;
    }
    if (!assertString(entry.ja)) {
      errors.push(`MESSAGE_TEXT.ja missing or empty for ${id}`);
    }
    if (!assertString(entry.en)) {
      errors.push(`MESSAGE_TEXT.en missing or empty for ${id}`);
    }
  });

  if (errors.length > 0) {
    errors.forEach((message) => fail(message));
    process.exit(1);
  }

  info(
    `OK: ui_ids=${usedUiIds.length}, msg_ids=${usedMsgIds.length}, ui_dict=${allUiKeys.length}`
  );
}

verify();

