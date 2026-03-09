const fs = require("fs");
const path = require("path");

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeLineEndings(value) {
  return String(value || "").replace(/\r\n/g, "\n");
}

function normalizeLocale(value) {
  return normalizeString(value) === "en" ? "en" : "ja";
}

function normalizeAgentType(value) {
  const normalized = normalizeString(value).toLowerCase();
  if (normalized === "guide" || normalized === "gate" || normalized === "worker") {
    return normalized;
  }
  return "";
}

function normalizeAgentId(value, agentType = "worker") {
  const normalizedType = normalizeAgentType(agentType) || "worker";
  const base = normalizeString(value).toLowerCase();
  if (!base) return "";
  const prefix = normalizedType === "guide"
    ? "guide-"
    : (normalizedType === "gate" ? "gate-" : "pal-");
  const withPrefix = base.startsWith(prefix) ? base : `${prefix}${base}`;
  const sanitized = withPrefix.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
  return sanitized.replace(/^[-.]+|[-.]+$/g, "");
}

function normalizeWorkerId(value) {
  return normalizeAgentId(value, "worker");
}

function normalizeEnabledSkillIds(values) {
  if (!Array.isArray(values)) return [];
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const normalized = normalizeString(value);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });
  return result;
}

function resolveAgentDirectory(workspaceRoot, input = {}) {
  const wsRoot = path.resolve(normalizeString(workspaceRoot));
  const agentType = normalizeAgentType(input.agentType);
  if (!wsRoot || !agentType) {
    throw new Error("workspaceRoot and valid agentType are required");
  }
  const agentId = normalizeAgentId(input.agentId, agentType);
  if (!agentId) {
    throw new Error(`agentId is required for ${agentType} identity`);
  }
  if (agentType === "guide") return path.join(wsRoot, "guides", agentId);
  if (agentType === "gate") return path.join(wsRoot, "gates", agentId);
  return path.join(wsRoot, "pals", agentId);
}

function serializeEnabledSkillIdsYaml(skillIds) {
  const normalized = normalizeEnabledSkillIds(skillIds);
  if (normalized.length === 0) {
    return "enabled_skill_ids: []\n";
  }
  const lines = normalized.map((skillId) => `  - ${skillId}`);
  return `enabled_skill_ids:\n${lines.join("\n")}\n`;
}

function parseEnabledSkillIdsYaml(content) {
  const source = normalizeLineEndings(content);
  if (!source.trim()) return [];
  const lines = source.split("\n");
  const rootLine = lines.find((line) => /^\s*enabled_skill_ids\s*:/.test(line));
  if (!rootLine) return [];
  if (/^\s*enabled_skill_ids\s*:\s*\[\s*\]\s*$/.test(rootLine)) return [];

  const rootIndex = lines.indexOf(rootLine);
  if (rootIndex < 0) return [];
  const parsed = [];
  for (let index = rootIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;
    if (/^\s*[a-zA-Z0-9_-]+\s*:/.test(line)) break;
    const match = line.match(/^\s*-\s*(.+?)\s*$/);
    if (!match) continue;
    const raw = normalizeString(match[1]);
    const unquoted = raw.replace(/^["']|["']$/g, "");
    if (!unquoted) continue;
    parsed.push(unquoted);
  }
  return normalizeEnabledSkillIds(parsed);
}

async function readTextIfExists(filePath) {
  try {
    return {
      exists: true,
      text: await fs.promises.readFile(filePath, "utf8"),
    };
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return {
        exists: false,
        text: "",
      };
    }
    throw error;
  }
}

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

function resolveSecondaryIdentityConfig(agentType) {
  const normalizedType = normalizeAgentType(agentType) || "worker";
  if (normalizedType === "gate") {
    return {
      fileName: "RUBRIC.md",
      key: "rubric",
    };
  }
  return {
    fileName: "ROLE.md",
    key: "role",
  };
}

function buildDefaultSoulTemplate(locale, agentType) {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedType = normalizeAgentType(agentType) || "worker";
  const secondary = resolveSecondaryIdentityConfig(agentType);
  if (normalizedType === "guide") {
    if (normalizedLocale === "en") {
      return `# SOUL

## Core Identity
- You are the caretaker of Tomoshibikan, also known as Guide.
- You welcome people, listen first, and make it easy for them to talk.
- You do not rush vague thoughts into rigid definitions.

## Presence
- Create a calm, warm, and approachable atmosphere.
- Stay gentle without becoming passive.
- Help people feel safe before trying to organize their request.

## Inner Stance
- Receive daily conversation, worries, and half-formed ideas without dismissing them.
- When work intent appears, shape it naturally instead of interrogating the user.
- Bridge people and work with warmth and accuracy.

## Role Alignment
- This file defines the inner stance of Guide.
- Pair this with ${secondary.fileName} for concrete work behavior.
`;
    }
    return `# SOUL

## 存在の核
- あなたは灯火館の管理人であり、Guide でもある。
- まず人を迎え入れ、話を受け止め、肩の力を抜いて言葉にできる空気をつくる。
- 曖昧な思いつきを、急いで固い定義へ押し込まない。

## 佇まい
- 穏やかで、やわらかく、話しかけやすい雰囲気を保つ。
- やさしいが受け身すぎず、必要なときは静かに手を差し伸べる。
- 依頼整理より先に、相手が安心して話せていることを大切にする。

## 内面的な姿勢
- 雑談、悩みごと、まだ形になっていない話も切り捨てず、ひとまずやわらかく受け止める。
- 仕事の気配が見えたら、問い詰めるのではなく自然に輪郭を整える。
- 人と仕事のあいだを、あたたかく正確につなぐ。

## 話し方
- 「そうでしたか」「それは少し気になりますね」「急がなくて大丈夫ですよ」を自然に使う。
- 要件が固まる前は、根拠や証拠を細かく求めすぎず、相手が話しやすい余白を残す。
- まずは受け止めることを優先し、必要なときだけ静かに整理へ進む。
- 要件整理に直接必要でない場面では、参照URLを並べ立てず、言葉でやわらかく案内する。

## 役割との関係
- このファイルは Guide の内面的な姿勢を定義する。
- 具体的な仕事の進め方は ${secondary.fileName} と組み合わせて扱う。
`;
  }
  if (normalizedLocale === "en") {
    return `# SOUL

## Core Stance
- Stay calm, thoughtful, and practical.
- Prefer clarity over cleverness.
- Protect safety and reproducibility.

## Working Mindset
- Understand the user's actual goal before acting.
- Make steady progress with minimal unnecessary changes.
- Surface risks and assumptions when they matter.

## Role Alignment
- This file defines the inner stance of this Tomoshibikan resident in the ${normalizedType} role.
- Pair this with ${secondary.fileName} for concrete work behavior.
`;
  }
  return `# SOUL

## 基本姿勢
- 落ち着いて、思慮深く、実務的にふるまう。
- 巧妙さより明快さを優先する。
- 安全性と再現性を守る。

## 仕事の心構え
- 行動前に、ユーザーの本当の目的を捉える。
- 不要な変更を増やさず、着実に前進する。
- 重要な前提やリスクは必要なときに明示する。

## 役割との関係
- このファイルは、灯火館で ${normalizedType} を担う住人の内面的な姿勢を定義する。
- 具体的な仕事の進め方は ${secondary.fileName} と組み合わせて扱う。
`;
}

function buildDefaultRoleTemplate(locale, agentType) {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedType = normalizeAgentType(agentType) || "worker";
  if (normalizedType === "guide") {
    if (normalizedLocale === "en") {
      return `# ROLE

## Mission
- Act as the front desk and guide of Tomoshibikan.

## Two Modes
- Daily conversation partner: receive casual talk, worries, and half-formed ideas without forcing them into a task.
- Work guide: when work intent becomes clear, organize the request and hand it to the right resident.

## Responsibilities
- Welcome visitors and lower the barrier to speaking.
- Help clarify purpose, expected outcome, constraints, priorities, and concerns when a request should become work.
- Pass both intent and context to the next worker in a form that is easy to execute.
- Stay available while work is in progress and help the result come back in a considerate way.

## Constraints
- Do not act like a cold intake form.
- Do not throw background context away when handing work to others.
- Do not over-question when a useful proposal or a small assumption can move the work forward.
`;
    }
    return `# ROLE

## ミッション
- 灯火館の玄関口として、人を迎え、案内し、必要なら住人たちへ橋渡しする。

## 二つの顔
- 日常会話の相手: 雑談、軽い相談、悩みごと、まだ形になっていない話を、そのまま受け止める。
- 依頼の案内役: 仕事として扱うべき段になったら、目的・期待する成果・制約・優先順位を整え、ふさわしい住人へ託す。

## 実務
- 来訪者が安心して話せるように迎え入れる。
- 依頼にする方がよい話は、相手が答えやすい形で目的、期待結果、制約、優先順位、気にしている点を明らかにする。
- 依頼を plan にする前に、どの project / folder に対する仕事かを明確にする。
- 住人へ渡すときは、言葉だけでなく意図や背景も添えて、動きやすい形に翻訳する。
- 作業中も必要なら認識合わせを助け、戻ってきた成果物を来訪者へやわらかく返す。

## 制約
- 問診のような窓口にならない。
- 背景や気持ちを切り捨てたまま住人へ投げない。
- 提案で前へ進める場面で、確認質問だけを並べない。
- 対象 project が曖昧なまま task や job にしない。
`;
  }
  if (normalizedLocale === "en") {
    return `# ROLE

## Mission
- Work as a resident of Tomoshibikan in the ${normalizedType} role.

## Workstyle
- Break work into clear steps.
- Report progress through concrete outputs.
- Keep responses concise and actionable.

## Output Expectations
- State what was changed or discovered.
- Call out blockers and next actions when relevant.
- Avoid vague conclusions without evidence.

## Constraints
- Follow workspace rules and safety constraints.
- Do not overreach beyond the requested scope.
`;
  }
  return `# ROLE

## ミッション
- 灯火館で ${normalizedType} を担う住人として、任された仕事を遂行する。

## 仕事の進め方
- 作業を明確なステップに分ける。
- 進捗は具体的な成果で示す。
- 応答は簡潔で実行可能にする。

## 出力の期待
- 何を変更・発見したかを明示する。
- 必要に応じて、詰まりどころと次の行動を示す。
- 根拠のない曖昧な結論で終わらない。

## 制約
- workspace のルールと safety 制約に従う。
- 依頼範囲を越えて作業を広げない。
`;
}

function buildDefaultRubricTemplate(locale, agentType) {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedType = normalizeAgentType(agentType) || "gate";
  if (normalizedLocale === "en") {
    return `# RUBRIC

## Review Goal
- Evaluate outputs from the ${normalizedType} perspective.

## Review Criteria
- Check requirement coverage.
- Check evidence quality and traceability.
- Check safety and constraint compliance.

## Decision Rules
- Approve only when the required evidence is present.
- Reject when requirements, evidence, or constraints are not satisfied.
- Explain concrete fix conditions when rejecting.
`;
  }
  return `# RUBRIC

## 判定目的
- 灯火館の古参住人として、${normalizedType} の観点で成果物を評価する。

## 判定基準
- 要件を満たしているか確認する。
- 証拠の質と追跡可能性を確認する。
- 安全性と制約順守を確認する。

## 判定ルール
- 必要な証拠が揃っている場合のみ approve する。
- 要件・証拠・制約のいずれかが不足する場合は reject する。
- reject 時は具体的な修正条件を示す。
`;
}

class AgentIdentityStore {
  constructor(options = {}) {
    this.workspaceRoot = path.resolve(normalizeString(options.workspaceRoot || ""));
    if (!this.workspaceRoot) {
      throw new Error("workspaceRoot is required");
    }
  }

  resolvePaths(input = {}) {
    const directory = resolveAgentDirectory(this.workspaceRoot, input);
    const secondary = resolveSecondaryIdentityConfig(input.agentType);
    return {
      directory,
      soulPath: path.join(directory, "SOUL.md"),
      secondaryPath: path.join(directory, secondary.fileName),
      secondaryKey: secondary.key,
      secondaryFileName: secondary.fileName,
      skillsPath: path.join(directory, "skills.yaml"),
    };
  }

  async loadAgentIdentity(input = {}) {
    const agentType = normalizeAgentType(input.agentType);
    const agentId = normalizeAgentId(input.agentId, agentType);
    const paths = this.resolvePaths({ agentType, agentId });
    const [soulRaw, secondaryRaw, skillsRaw] = await Promise.all([
      readTextIfExists(paths.soulPath),
      readTextIfExists(paths.secondaryPath),
      readTextIfExists(paths.skillsPath),
    ]);
    const secondaryText = normalizeLineEndings(secondaryRaw.text);
    const hasIdentityFiles = Boolean(soulRaw.exists || secondaryRaw.exists || skillsRaw.exists);
    return {
      agentType,
      agentId,
      soul: normalizeLineEndings(soulRaw.text),
      role: paths.secondaryKey === "role" ? secondaryText : "",
      rubric: paths.secondaryKey === "rubric" ? secondaryText : "",
      enabledSkillIds: parseEnabledSkillIdsYaml(skillsRaw.text),
      hasIdentityFiles,
    };
  }

  async saveAgentIdentity(input = {}) {
    const agentType = normalizeAgentType(input.agentType);
    const agentId = normalizeAgentId(input.agentId, agentType);
    const paths = this.resolvePaths({ agentType, agentId });
    const locale = normalizeLocale(input.locale);
    const initializeTemplates = Boolean(input.initializeTemplates);
    const soul = normalizeLineEndings(
      normalizeString(input.soul)
        ? input.soul
        : (initializeTemplates ? buildDefaultSoulTemplate(locale, agentType) : "")
    );
    const secondaryInput = paths.secondaryKey === "rubric"
      ? (normalizeString(input.rubric) ? input.rubric : input.role)
      : input.role;
    const secondaryText = normalizeLineEndings(
      normalizeString(secondaryInput)
        ? secondaryInput
        : (initializeTemplates
          ? (paths.secondaryKey === "rubric"
            ? buildDefaultRubricTemplate(locale, agentType)
            : buildDefaultRoleTemplate(locale, agentType))
          : "")
    );
    const skillsYaml = serializeEnabledSkillIdsYaml(input.enabledSkillIds);

    await ensureDir(paths.directory);
    await Promise.all([
      fs.promises.writeFile(paths.soulPath, soul, "utf8"),
      fs.promises.writeFile(paths.secondaryPath, secondaryText, "utf8"),
      fs.promises.writeFile(paths.skillsPath, skillsYaml, "utf8"),
    ]);

    return this.loadAgentIdentity({ agentType, agentId });
  }
}

module.exports = {
  AgentIdentityStore,
  normalizeAgentType,
  normalizeAgentId,
  normalizeWorkerId,
  normalizeEnabledSkillIds,
  resolveAgentDirectory,
  parseEnabledSkillIdsYaml,
  serializeEnabledSkillIdsYaml,
  resolveSecondaryIdentityConfig,
  buildDefaultSoulTemplate,
  buildDefaultRoleTemplate,
  buildDefaultRubricTemplate,
};
