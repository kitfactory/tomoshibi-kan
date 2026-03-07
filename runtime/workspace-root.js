const fs = require("fs");
const path = require("path");

function normalizeString(value) {
  return String(value || "").trim();
}

function isValidWorkspaceRootOverride(inputPath, platform = process.platform) {
  const value = normalizeString(inputPath);
  if (!value) return false;
  if (value.includes("\0")) return false;

  if (String(platform).toLowerCase() === "win32") {
    // Allow drive letter colon (e.g. C:\) and UNC paths.
    const tail = value.replace(/^[A-Za-z]:[\\/]/, "").replace(/^\\\\[^\\]+\\[^\\]+[\\/]?/, "");
    if (/[<>:"|?*]/.test(tail)) return false;
  }
  return true;
}

function resolveWorkspaceRoot(input = {}) {
  const platform = normalizeString(input.platform || process.platform).toLowerCase();
  const envWorkspaceRoot = normalizeString(input.envWorkspaceRoot);
  if (envWorkspaceRoot && isValidWorkspaceRootOverride(envWorkspaceRoot, platform)) {
    return path.resolve(envWorkspaceRoot);
  }

  const documentsPath = normalizeString(input.documentsPath);
  const homePath = normalizeString(input.homePath);
  const userDataPath = normalizeString(input.userDataPath);
  const documentsExists =
    typeof input.documentsExists === "boolean"
      ? input.documentsExists
      : (documentsPath ? fs.existsSync(documentsPath) : false);

  // Linux fallback is ~/.local/share/palpal when Documents is missing.
  if (platform === "linux") {
    if (documentsPath && documentsExists) return path.join(documentsPath, "palpal");
    if (homePath) return path.join(homePath, ".local", "share", "palpal");
    if (userDataPath) return path.join(userDataPath, "workspaces", "palpal");
    return path.resolve("palpal");
  }

  // Windows/macOS default to Documents/palpal.
  if (documentsPath) return path.join(documentsPath, "palpal");
  if (homePath) return path.join(homePath, "Documents", "palpal");
  if (userDataPath) return path.join(userDataPath, "workspaces", "palpal");
  return path.resolve("palpal");
}

function resolveWorkspacePaths(wsRoot) {
  const root = path.resolve(normalizeString(wsRoot));
  const internalRoot = path.join(root, ".palpal");
  const stateDir = path.join(internalRoot, "state");
  const secretsDir = path.join(internalRoot, "secrets");
  const cacheDir = path.join(internalRoot, "cache");
  const logsDir = path.join(internalRoot, "logs");
  return {
    wsRoot: root,
    internalRoot,
    stateDir,
    secretsDir,
    cacheDir,
    logsDir,
    dbPath: path.join(stateDir, "settings.sqlite"),
    secretsPath: path.join(secretsDir, "secrets.json"),
  };
}

function ensureWorkspaceLayout(paths) {
  const targets = [
    paths?.wsRoot,
    paths?.internalRoot,
    paths?.stateDir,
    paths?.secretsDir,
    paths?.cacheDir,
    paths?.logsDir,
  ].filter(Boolean);
  targets.forEach((target) => {
    fs.mkdirSync(target, { recursive: true });
  });
}

function isAccessDeniedError(error) {
  const code = normalizeString(error?.code).toUpperCase();
  return code === "EACCES" || code === "EPERM";
}

function resolveWritableWorkspacePaths(candidateRoots = [], options = {}) {
  const resolvePathsFn =
    typeof options.resolvePathsFn === "function" ? options.resolvePathsFn : resolveWorkspacePaths;
  const ensureLayoutFn =
    typeof options.ensureLayoutFn === "function" ? options.ensureLayoutFn : ensureWorkspaceLayout;

  const normalizedRoots = [...new Set(
    (Array.isArray(candidateRoots) ? candidateRoots : [])
      .map((root) => normalizeString(root))
      .filter(Boolean)
      .map((root) => path.resolve(root))
  )];

  if (normalizedRoots.length === 0) {
    throw new Error("workspace root candidates are required");
  }

  let lastDeniedError = null;
  for (let index = 0; index < normalizedRoots.length; index += 1) {
    const wsRoot = normalizedRoots[index];
    const paths = resolvePathsFn(wsRoot);
    try {
      ensureLayoutFn(paths);
      return {
        wsRoot,
        paths,
        fallbackUsed: index > 0,
      };
    } catch (error) {
      if (isAccessDeniedError(error)) {
        lastDeniedError = error;
        continue;
      }
      throw error;
    }
  }

  if (lastDeniedError) {
    throw lastDeniedError;
  }
  throw new Error("failed to resolve writable workspace root");
}

module.exports = {
  resolveWorkspaceRoot,
  resolveWorkspacePaths,
  ensureWorkspaceLayout,
  isAccessDeniedError,
  isValidWorkspaceRootOverride,
  resolveWritableWorkspacePaths,
};
