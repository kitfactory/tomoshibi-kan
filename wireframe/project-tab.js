(function (global) {
  function currentLocale() {
    if (typeof global.getCurrentLocale === "function") {
      return global.getCurrentLocale() === "en" ? "en" : "ja";
    }
    return "ja";
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
    const source = Array.isArray(values) ? values : global.DEFAULT_PROJECT_FILE_HINTS;
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
    return [...global.DEFAULT_PROJECT_FILE_HINTS];
  }

  function normalizeProjectRecord(input, fallbackId = "") {
    const name = normalizeProjectName(input?.name);
    const directory = normalizeProjectDirectory(input?.directory);
    const id = global.normalizeText(input?.id || fallbackId);
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
    const hasAttempt = () => global.projectState.projects.some((project) => project.id === attempt);
    while (hasAttempt()) {
      suffix += 1;
      attempt = `project-${base}-${suffix}`;
    }
    return attempt;
  }

  function projectById(projectId) {
    const id = global.normalizeText(projectId);
    if (!id) return null;
    return global.projectState.projects.find((project) => project.id === id) || null;
  }

  function projectByName(projectName) {
    const name = normalizeProjectName(projectName).toLowerCase();
    if (!name) return null;
    return global.projectState.projects.find((project) => project.name.toLowerCase() === name) || null;
  }

  function focusedProject() {
    return projectById(global.projectState.focusProjectId);
  }

  function ensureProjectStateConsistency() {
    const normalized = [];
    const seenIds = new Set();
    const seenNames = new Set();
    global.projectState.projects.forEach((project, index) => {
      const fallbackId = global.normalizeText(project?.id) || `project-${index + 1}`;
      const record = normalizeProjectRecord(project, fallbackId);
      if (!record) return;
      const idKey = record.id.toLowerCase();
      const nameKey = record.name.toLowerCase();
      if (seenIds.has(idKey) || seenNames.has(nameKey)) return;
      seenIds.add(idKey);
      seenNames.add(nameKey);
      normalized.push(record);
    });
    global.projectState.projects = normalized;
    if (normalized.length === 0) {
      global.projectState.focusProjectId = "";
    } else if (!projectById(global.projectState.focusProjectId)) {
      global.projectState.focusProjectId = normalized[0].id;
    }
    global.projectState.addDraft.name = normalizeProjectName(global.projectState.addDraft.name);
    global.projectState.addDraft.directory = normalizeProjectDirectory(global.projectState.addDraft.directory);
  }

  function buildProjectStateSnapshot() {
    ensureProjectStateConsistency();
    return {
      focusProjectId: global.projectState.focusProjectId,
      projects: global.projectState.projects.map((project) => ({
        id: project.id,
        name: project.name,
        directory: project.directory,
        files: [...project.files],
      })),
    };
  }

  function readProjectStateSnapshot() {
    try {
      const raw = global.readLocalStorageSnapshot(global.PROJECTS_LOCAL_STORAGE_KEY, global.LEGACY_PROJECTS_LOCAL_STORAGE_KEYS);
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
      global.writeLocalStorageSnapshot(global.PROJECTS_LOCAL_STORAGE_KEY, JSON.stringify(buildProjectStateSnapshot()));
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
    global.projectState.projects = incoming
      .map((project, index) => normalizeProjectRecord(project, `project-${index + 1}`))
      .filter(Boolean);
    global.projectState.focusProjectId = global.normalizeText(snapshot?.focusProjectId);
    ensureProjectStateConsistency();
  }

  function projectFocusLabel(project) {
    const locale = currentLocale();
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
    return global.projectState.projects.find(
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
    const message = currentLocale() === "ja" ? messageJa : messageEn;
    if (typeof global.alert === "function") {
      global.alert(message);
    }
  }

  function addProjectByDirectory(directory) {
    const normalizedDirectory = normalizeProjectDirectory(directory);
    if (!normalizedDirectory) {
      global.setMessage("MSG-PPH-1001");
      return { ok: false, reason: "empty" };
    }
    if (projectByDirectory(normalizedDirectory)) {
      showProjectInfoDialog(
        "プロジェクトは既に含まれています。",
        "Project is already included."
      );
      global.setMessage("MSG-PPH-1006");
      return { ok: false, reason: "duplicate" };
    }
    const baseName = projectNameFromDirectory(normalizedDirectory);
    const nextName = ensureUniqueProjectName(baseName);
    const newProject = normalizeProjectRecord({
      id: createProjectIdFromName(nextName),
      name: nextName,
      directory: normalizedDirectory,
      files: global.DEFAULT_PROJECT_FILE_HINTS,
    });
    if (!newProject) {
      global.setMessage("MSG-PPH-1001");
      return { ok: false, reason: "invalid" };
    }
    global.projectState.projects.push(newProject);
    global.projectState.focusProjectId = newProject.id;
    writeProjectStateSnapshot();
    renderGuideProjectFocus();
    renderProjectTab();
    global.setMessage("MSG-PPH-0007");
    return { ok: true, project: newProject };
  }

  function resolveProjectDialogBridge() {
    const bridge = global.resolveWindowBridge("TomoshibikanProjectDialog", "PalpalProjectDialog");
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
    const labels = currentLocale() === "ja"
      ? {
        name: "プロジェクト名",
        directory: "ディレクトリ",
        add: "プロジェクトを追加",
        remove: "一覧から外す",
        empty: "プロジェクトはありません",
        note: "@project / @project:file 参照、/use project でフォーカス切替（一覧から外してもフォルダは削除されません）",
        pickerHelp: "ディレクトリを選ぶと、最後のフォルダ名をプロジェクト名として追加します",
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

    const rows = global.projectState.projects.length === 0
      ? `<li class="rounded-box border border-base-300 bg-base-100 p-3 text-sm">${global.escapeHtml(labels.empty)}</li>`
      : global.projectState.projects
        .map((project) => {
          return `<li class="rounded-box border border-base-300 bg-base-100 p-3 shadow-sm mb-3">
            <div class="flex items-start justify-between gap-3">
              <div class="grid gap-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="badge badge-secondary badge-sm">@${global.escapeHtml(project.name)}</span>
                </div>
                <div class="text-xs text-base-content/70">${global.escapeHtml(project.directory)}</div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button class="btn btn-xs btn-ghost" type="button" data-project-remove-id="${global.escapeHtml(project.id)}">${global.escapeHtml(labels.remove)}</button>
              </div>
            </div>
          </li>`;
        })
        .join("");

    root.innerHTML = `<div class="project-tab-shell">
      <div class="project-note text-xs text-base-content/65">${global.escapeHtml(labels.note)}</div>
      <div class="project-toolbar">
        <button id="projectPickDirectory" type="button" class="btn btn-sm btn-primary">${global.escapeHtml(labels.add)}</button>
        <span class="text-xs text-base-content/60">${global.escapeHtml(labels.pickerHelp)}</span>
        <input id="projectDirectoryPicker" type="file" class="hidden" webkitdirectory directory />
      </div>
      <ul id="projectList" class="project-list">${rows}</ul>
    </div>`;

    root.querySelectorAll("[data-project-remove-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = global.normalizeText(button.getAttribute("data-project-remove-id"));
        const index = global.projectState.projects.findIndex((project) => project.id === targetId);
        if (index < 0) return;
        global.projectState.projects.splice(index, 1);
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
            global.setMessage("MSG-PPH-1003");
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
          global.setMessage("MSG-PPH-1001");
          return;
        }
        addProjectByDirectory(directory);
      });
    }
  }

  global.ProjectTabUi = {
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
  };
})(window);
