const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  AgentIdentityStore,
  resolveAgentDirectory,
  parseEnabledSkillIdsYaml,
  serializeEnabledSkillIdsYaml,
  resolveSecondaryIdentityConfig,
  buildDefaultSoulTemplate,
  buildDefaultRoleTemplate,
  buildDefaultRubricTemplate,
} = require("../../runtime/agent-identity-store.js");

test("resolveAgentDirectory maps guide/gate/worker to expected paths", () => {
  const wsRoot = path.resolve("/tmp/tomoshibikan-workspace");
  assert.equal(
    resolveAgentDirectory(wsRoot, { agentType: "guide", agentId: "guide-core" }),
    path.join(wsRoot, "guides", "guide-core")
  );
  assert.equal(
    resolveAgentDirectory(wsRoot, { agentType: "gate", agentId: "gate-core" }),
    path.join(wsRoot, "gates", "gate-core")
  );
  assert.equal(
    resolveAgentDirectory(wsRoot, { agentType: "worker", agentId: "pal-alpha" }),
    path.join(wsRoot, "pals", "pal-alpha")
  );
});

test("serializeEnabledSkillIdsYaml and parseEnabledSkillIdsYaml round-trip", () => {
  const source = ["codex-file-search", "browser-chrome", "codex-file-search"];
  const yaml = serializeEnabledSkillIdsYaml(source);
  const parsed = parseEnabledSkillIdsYaml(yaml);
  assert.deepEqual(parsed, ["codex-file-search", "browser-chrome"]);
});

test("default identity templates switch by locale", () => {
  assert.match(buildDefaultSoulTemplate("ja", "worker"), /# SOUL/);
  assert.match(buildDefaultRoleTemplate("ja", "worker"), /# ROLE/);
  assert.match(buildDefaultSoulTemplate("ja", "worker"), /住人/);
  assert.match(buildDefaultSoulTemplate("en", "worker"), /Core Stance/);
  assert.match(buildDefaultRoleTemplate("en", "worker"), /resident of Tomoshibikan/);
  assert.match(buildDefaultRoleTemplate("en", "worker"), /Workstyle/);
  assert.match(buildDefaultSoulTemplate("ja", "guide"), /Guide/);
  assert.match(buildDefaultSoulTemplate("ja", "guide"), /安心して言葉にできる空気/);
  assert.match(buildDefaultRoleTemplate("ja", "guide"), /日常会話の相手/);
  assert.match(buildDefaultSoulTemplate("en", "guide"), /caretaker of Tomoshibikan/);
  assert.match(buildDefaultRoleTemplate("en", "guide"), /Daily conversation partner/);
  assert.match(buildDefaultRubricTemplate("ja", "gate"), /# RUBRIC/);
  assert.match(buildDefaultRubricTemplate("ja", "gate"), /古参住人/);
  assert.match(buildDefaultRubricTemplate("en", "gate"), /Review Criteria/);
});

test("secondary identity config uses ROLE for worker and RUBRIC for gate", () => {
  assert.deepEqual(resolveSecondaryIdentityConfig("worker"), {
    fileName: "ROLE.md",
    key: "role",
  });
  assert.deepEqual(resolveSecondaryIdentityConfig("guide"), {
    fileName: "ROLE.md",
    key: "role",
  });
  assert.deepEqual(resolveSecondaryIdentityConfig("gate"), {
    fileName: "RUBRIC.md",
    key: "rubric",
  });
});

test("AgentIdentityStore load returns empty defaults when files are missing", async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-agent-identity-"));
  const store = new AgentIdentityStore({ workspaceRoot: tmpRoot });
  try {
    const loaded = await store.loadAgentIdentity({ agentType: "guide", agentId: "guide-core" });
    assert.equal(loaded.agentType, "guide");
    assert.equal(loaded.agentId, "guide-core");
    assert.equal(loaded.soul, "");
    assert.equal(loaded.role, "");
    assert.deepEqual(loaded.enabledSkillIds, []);
    assert.equal(loaded.hasIdentityFiles, false);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test("AgentIdentityStore saves and loads worker identity files", async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-agent-identity-"));
  const store = new AgentIdentityStore({ workspaceRoot: tmpRoot });
  try {
    const saved = await store.saveAgentIdentity({
      agentType: "worker",
      agentId: "pal-alpha",
      soul: "You are a calm engineer.\n",
      role: "1. Analyze\n2. Implement\n3. Review\n",
      enabledSkillIds: ["codex-file-search", "browser-chrome", "codex-file-search"],
    });
    assert.equal(saved.agentType, "worker");
    assert.equal(saved.agentId, "pal-alpha");
    assert.deepEqual(saved.enabledSkillIds, ["codex-file-search", "browser-chrome"]);
    assert.equal(saved.hasIdentityFiles, true);

    const workerDir = path.join(tmpRoot, "pals", "pal-alpha");
    const skillsYamlPath = path.join(workerDir, "skills.yaml");
    const names = fs.readdirSync(workerDir);
    assert.equal(names.includes("SOUL.md"), true);
    assert.equal(fs.existsSync(path.join(workerDir, "ROLE.md")), true);
    assert.equal(fs.existsSync(skillsYamlPath), true);
    const yaml = fs.readFileSync(skillsYamlPath, "utf8");
    assert.match(yaml, /^enabled_skill_ids:/m);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test("AgentIdentityStore initializes localized templates when requested", async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-agent-identity-"));
  const store = new AgentIdentityStore({ workspaceRoot: tmpRoot });
  try {
    const saved = await store.saveAgentIdentity({
      agentType: "worker",
      agentId: "pal-template",
      locale: "en",
      initializeTemplates: true,
      enabledSkillIds: ["codex-file-search"],
    });
    assert.match(saved.soul, /Core Stance/);
    assert.match(saved.role, /Workstyle/);

    const workerDir = path.join(tmpRoot, "pals", "pal-template");
    assert.equal(fs.existsSync(path.join(workerDir, "SOUL.md")), true);
    assert.equal(fs.existsSync(path.join(workerDir, "ROLE.md")), true);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test("AgentIdentityStore initializes localized templates for guide", async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-agent-identity-"));
  const store = new AgentIdentityStore({ workspaceRoot: tmpRoot });
  try {
    const saved = await store.saveAgentIdentity({
      agentType: "guide",
      agentId: "guide-core",
      locale: "ja",
      initializeTemplates: true,
      enabledSkillIds: ["codex-file-search"],
    });
    assert.match(saved.soul, /灯火館の管理人/);
    assert.match(saved.role, /日常会話の相手/);

    const guideDir = path.join(tmpRoot, "guides", "guide-core");
    assert.equal(fs.existsSync(path.join(guideDir, "SOUL.md")), true);
    assert.equal(fs.existsSync(path.join(guideDir, "ROLE.md")), true);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test("AgentIdentityStore saves and loads gate identity files with RUBRIC", async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-agent-identity-"));
  const store = new AgentIdentityStore({ workspaceRoot: tmpRoot });
  try {
    const saved = await store.saveAgentIdentity({
      agentType: "gate",
      agentId: "gate-core",
      soul: "You are a strict reviewer.\n",
      rubric: "1. Requirements\n2. Evidence\n3. Safety\n",
      enabledSkillIds: [],
    });
    assert.equal(saved.agentType, "gate");
    assert.equal(saved.role, "");
    assert.equal(saved.rubric, "1. Requirements\n2. Evidence\n3. Safety\n");

    const gateDir = path.join(tmpRoot, "gates", "gate-core");
    assert.equal(fs.existsSync(path.join(gateDir, "SOUL.md")), true);
    assert.equal(fs.existsSync(path.join(gateDir, "RUBRIC.md")), true);
    assert.equal(fs.existsSync(path.join(gateDir, "ROLE.md")), false);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test("AgentIdentityStore initializes localized rubric template for gate", async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-agent-identity-"));
  const store = new AgentIdentityStore({ workspaceRoot: tmpRoot });
  try {
    const saved = await store.saveAgentIdentity({
      agentType: "gate",
      agentId: "gate-core",
      locale: "ja",
      initializeTemplates: true,
      enabledSkillIds: [],
    });
    assert.match(saved.soul, /# SOUL/);
    assert.equal(saved.role, "");
    assert.match(saved.rubric, /# RUBRIC/);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test("AgentIdentityStore rejects worker identity save without agentId", async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-agent-identity-"));
  const store = new AgentIdentityStore({ workspaceRoot: tmpRoot });
  try {
    await assert.rejects(
      () => store.saveAgentIdentity({
        agentType: "worker",
        agentId: "",
        soul: "",
        role: "",
        enabledSkillIds: [],
      }),
      /agentId is required/
    );
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test("AgentIdentityStore rejects guide identity save without agentId", async () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tomoshibikan-agent-identity-"));
  const store = new AgentIdentityStore({ workspaceRoot: tmpRoot });
  try {
    await assert.rejects(
      () => store.saveAgentIdentity({
        agentType: "guide",
        agentId: "",
        soul: "",
        role: "",
        enabledSkillIds: [],
      }),
      /agentId is required/
    );
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});
