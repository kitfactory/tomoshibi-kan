(function attachGuideContextMention(scope) {
  const guideMentionState = {
    open: false,
    activeIndex: 0,
    tokenStart: -1,
    tokenEnd: -1,
    items: [],
  };

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

  const api = {
    resolveGuideFocusCommandTarget,
    buildGuideProjectFocusUpdatedText,
    buildGuideProjectNotFoundText,
    pushGuideSystemMessage,
    handleGuideFocusCommand,
    normalizeGuideReferenceToken,
    collectGuideReferenceTokens,
    resolveGuideReferenceToken,
    buildGuideProjectContext,
    buildGuideProjectContextNote,
    extractGuideMentionToken,
    buildGuideMentionSuggestions,
    closeGuideMentionMenu,
    applyGuideMentionSuggestion,
    renderGuideMentionMenu,
    refreshGuideMentionMenu,
    handleGuideMentionMenuKeydown,
  };

  scope.GuideContextMention = api;
  Object.assign(scope, api);
  if (scope.window && typeof scope.window === "object") {
    scope.window.GuideContextMention = api;
    Object.assign(scope.window, api);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
