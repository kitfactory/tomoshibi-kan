const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveWorkspaceRoot,
  resolveWorkspacePaths,
  ensureWorkspaceLayout,
  isValidWorkspaceRootOverride,
  resolveWritableWorkspacePaths,
} = require("../../runtime/workspace-root.js");

test("resolveWorkspaceRoot uses Documents/palpal on Windows", () => {
  const root = resolveWorkspaceRoot({
    platform: "win32",
    documentsPath: "C:\\Users\\kitad\\Documents",
    homePath: "C:\\Users\\kitad",
    userDataPath: "C:\\Users\\kitad\\AppData\\Roaming\\palpal-hive",
  });
  assert.equal(
    root,
    path.join("C:\\Users\\kitad\\Documents", "palpal")
  );
});

test("resolveWorkspaceRoot uses Documents/palpal on macOS", () => {
  const root = resolveWorkspaceRoot({
    platform: "darwin",
    documentsPath: "/Users/kitad/Documents",
    homePath: "/Users/kitad",
    userDataPath: "/Users/kitad/Library/Application Support/palpal-hive",
  });
  assert.equal(root, path.join("/Users/kitad/Documents", "palpal"));
});

test("resolveWorkspaceRoot uses Documents/palpal on Linux when Documents exists", () => {
  const root = resolveWorkspaceRoot({
    platform: "linux",
    documentsPath: "/home/kitad/Documents",
    documentsExists: true,
    homePath: "/home/kitad",
    userDataPath: "/home/kitad/.config/palpal-hive",
  });
  assert.equal(root, path.join("/home/kitad/Documents", "palpal"));
});

test("resolveWorkspaceRoot falls back to ~/.local/share/palpal on Linux when Documents is missing", () => {
  const root = resolveWorkspaceRoot({
    platform: "linux",
    documentsPath: "/home/kitad/Documents",
    documentsExists: false,
    homePath: "/home/kitad",
    userDataPath: "/home/kitad/.config/palpal-hive",
  });
  assert.equal(root, path.join("/home/kitad", ".local", "share", "palpal"));
});

test("resolveWorkspaceRoot prioritizes env override", () => {
  const root = resolveWorkspaceRoot({
    platform: "linux",
    envWorkspaceRoot: "/tmp/custom-palpal-root",
    documentsPath: "/home/kitad/Documents",
    documentsExists: true,
  });
  assert.equal(root, path.resolve("/tmp/custom-palpal-root"));
});

test("resolveWorkspaceRoot ignores invalid env override and falls back to default path", () => {
  const root = resolveWorkspaceRoot({
    platform: "win32",
    envWorkspaceRoot: "C:\\Users\\kitad\\Invalid|Path",
    documentsPath: "C:\\Users\\kitad\\Documents",
    homePath: "C:\\Users\\kitad",
    userDataPath: "C:\\Users\\kitad\\AppData\\Roaming\\palpal-hive",
  });
  assert.equal(root, path.join("C:\\Users\\kitad\\Documents", "palpal"));
});

test("isValidWorkspaceRootOverride validates Windows-invalid characters", () => {
  assert.equal(isValidWorkspaceRootOverride("C:\\Users\\kitad\\AppData\\Local\\palpal\\workspace", "win32"), true);
  assert.equal(isValidWorkspaceRootOverride("C:\\Users\\kitad\\Invalid|Path", "win32"), false);
});

test("resolveWorkspacePaths + ensureWorkspaceLayout creates .palpal sub-directories", () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "palpal-ws-"));
  try {
    const wsRoot = path.join(tmpRoot, "workspace");
    const paths = resolveWorkspacePaths(wsRoot);
    ensureWorkspaceLayout(paths);

    assert.equal(fs.existsSync(paths.wsRoot), true);
    assert.equal(fs.existsSync(paths.internalRoot), true);
    assert.equal(fs.existsSync(paths.stateDir), true);
    assert.equal(fs.existsSync(paths.secretsDir), true);
    assert.equal(fs.existsSync(paths.cacheDir), true);
    assert.equal(fs.existsSync(paths.logsDir), true);
    assert.equal(paths.dbPath, path.join(paths.stateDir, "settings.sqlite"));
    assert.equal(paths.secretsPath, path.join(paths.secretsDir, "secrets.json"));
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test("resolveWritableWorkspacePaths falls back when primary root is access denied", () => {
  const blockedRoot = path.resolve(path.join(os.tmpdir(), "palpal-blocked-root"));
  const fallbackRoot = path.resolve(path.join(os.tmpdir(), "palpal-fallback-root"));
  const touched = [];

  const result = resolveWritableWorkspacePaths([blockedRoot, fallbackRoot], {
    resolvePathsFn: (root) => resolveWorkspacePaths(root),
    ensureLayoutFn: (paths) => {
      touched.push(paths.wsRoot);
      if (paths.wsRoot === blockedRoot) {
        const error = new Error("blocked");
        error.code = "EACCES";
        throw error;
      }
    },
  });

  assert.equal(result.wsRoot, fallbackRoot);
  assert.equal(result.fallbackUsed, true);
  assert.deepEqual(touched, [blockedRoot, fallbackRoot]);
});

test("resolveWritableWorkspacePaths throws immediately on non-access error", () => {
  const primaryRoot = path.resolve(path.join(os.tmpdir(), "palpal-primary-root"));
  const fallbackRoot = path.resolve(path.join(os.tmpdir(), "palpal-secondary-root"));

  assert.throws(
    () => resolveWritableWorkspacePaths([primaryRoot, fallbackRoot], {
      ensureLayoutFn: () => {
        const error = new Error("unexpected");
        error.code = "EINVAL";
        throw error;
      },
    }),
    /unexpected/
  );
});
