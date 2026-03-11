const {
  clampLimit,
  normalizeString,
  queryRows,
  safeJsonParse,
  safeJsonStringify,
} = require("./settings-store-shared.js");

function createDebugRunId() {
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `debug-${now}-${rand}`;
}

function createProgressLogId() {
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `progress-${now}-${rand}`;
}

function createPlanArtifactId() {
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `PLAN-${now}-${rand}`.toUpperCase();
}

function normalizeDebugRunPayload(payload) {
  const createdAt = normalizeString(payload?.createdAt) || new Date().toISOString();
  return {
    runId: normalizeString(payload?.runId) || createDebugRunId(),
    createdAt,
    stage: normalizeString(payload?.stage),
    agentRole: normalizeString(payload?.agentRole),
    agentId: normalizeString(payload?.agentId),
    targetKind: normalizeString(payload?.targetKind),
    targetId: normalizeString(payload?.targetId),
    status: normalizeString(payload?.status) || "ok",
    provider: normalizeString(payload?.provider),
    modelName: normalizeString(payload?.modelName),
    inputJson: safeJsonStringify(payload?.input ?? {}, "{}"),
    outputJson: safeJsonStringify(payload?.output ?? {}, "{}"),
    errorText: normalizeString(payload?.errorText),
    metaJson: safeJsonStringify(payload?.meta ?? {}, "{}"),
  };
}

function normalizeProgressActor(value, fallback) {
  const normalized = normalizeString(value);
  return normalized || fallback;
}

function normalizeTaskProgressLogPayload(payload) {
  const createdAt = normalizeString(payload?.createdAt) || new Date().toISOString();
  return {
    entryId: normalizeString(payload?.entryId) || createProgressLogId(),
    createdAt,
    planId: normalizeString(payload?.planId),
    targetKind: normalizeString(payload?.targetKind),
    targetId: normalizeString(payload?.targetId),
    actionType: normalizeString(payload?.actionType),
    status: normalizeString(payload?.status) || "ok",
    actualActor: normalizeProgressActor(payload?.actualActor, "orchestrator"),
    displayActor: normalizeProgressActor(payload?.displayActor, "Guide"),
    messageForUser: normalizeString(payload?.messageForUser),
    payloadJson: safeJsonStringify(payload?.payload ?? {}, "{}"),
    sourceRunId: normalizeString(payload?.sourceRunId),
  };
}

function normalizePlanArtifactPayload(payload) {
  const createdAt = normalizeString(payload?.createdAt) || new Date().toISOString();
  const status = normalizeString(payload?.status) || "approved";
  const approvedAt = status === "approved"
    ? (normalizeString(payload?.approvedAt) || createdAt)
    : normalizeString(payload?.approvedAt);
  return {
    planId: normalizeString(payload?.planId) || createPlanArtifactId(),
    createdAt,
    status,
    replyText: normalizeString(payload?.replyText),
    planJson: safeJsonStringify(payload?.plan ?? {}, "{}"),
    sourceRunId: normalizeString(payload?.sourceRunId),
    approvedAt,
  };
}

function initializeRepositoryTables(db) {
  db.run(`
      CREATE TABLE IF NOT EXISTS orchestration_debug_runs (
        run_id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        stage TEXT NOT NULL,
        agent_role TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        target_kind TEXT NOT NULL DEFAULT '',
        target_id TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL,
        provider TEXT NOT NULL DEFAULT '',
        model_name TEXT NOT NULL DEFAULT '',
        input_json TEXT NOT NULL,
        output_json TEXT NOT NULL,
        error_text TEXT NOT NULL DEFAULT '',
        meta_json TEXT NOT NULL DEFAULT '{}'
      );
    `);
  db.run(`
      CREATE INDEX IF NOT EXISTS idx_orchestration_debug_runs_created_at
      ON orchestration_debug_runs (created_at DESC);
    `);
  db.run(`
      CREATE TABLE IF NOT EXISTS task_progress_logs (
        entry_id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        plan_id TEXT NOT NULL DEFAULT '',
        target_kind TEXT NOT NULL,
        target_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        status TEXT NOT NULL,
        actual_actor TEXT NOT NULL,
        display_actor TEXT NOT NULL,
        message_for_user TEXT NOT NULL DEFAULT '',
        payload_json TEXT NOT NULL DEFAULT '{}',
        source_run_id TEXT NOT NULL DEFAULT ''
      );
    `);
  db.run(`
      CREATE INDEX IF NOT EXISTS idx_task_progress_logs_target_created_at
      ON task_progress_logs (target_kind, target_id, created_at DESC);
    `);
  db.run(`
      CREATE TABLE IF NOT EXISTS plan_artifacts (
        plan_id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL,
        reply_text TEXT NOT NULL DEFAULT '',
        plan_json TEXT NOT NULL DEFAULT '{}',
        source_run_id TEXT NOT NULL DEFAULT '',
        approved_at TEXT NOT NULL DEFAULT ''
      );
    `);
  db.run(`
      CREATE INDEX IF NOT EXISTS idx_plan_artifacts_created_at
      ON plan_artifacts (created_at DESC);
    `);
}

function appendOrchestrationDebugRun(db, persistDb, payload) {
  const normalized = normalizeDebugRunPayload(payload);
  db.run(
    `INSERT INTO orchestration_debug_runs (
      run_id, created_at, stage, agent_role, agent_id, target_kind, target_id,
      status, provider, model_name, input_json, output_json, error_text, meta_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      normalized.runId,
      normalized.createdAt,
      normalized.stage,
      normalized.agentRole,
      normalized.agentId,
      normalized.targetKind,
      normalized.targetId,
      normalized.status,
      normalized.provider,
      normalized.modelName,
      normalized.inputJson,
      normalized.outputJson,
      normalized.errorText,
      normalized.metaJson,
    ]
  );
  persistDb();
  return {
    runId: normalized.runId,
    createdAt: normalized.createdAt,
  };
}

function listOrchestrationDebugRuns(db, options = {}) {
  const limit = clampLimit(options.limit, 50);
  const rows = queryRows(
    db,
    `SELECT run_id, created_at, stage, agent_role, agent_id, target_kind, target_id,
            status, provider, model_name, input_json, output_json, error_text, meta_json
       FROM orchestration_debug_runs
      ORDER BY created_at DESC
      LIMIT ?`,
    [limit]
  );
  return rows.map((row) => ({
    runId: normalizeString(row.run_id),
    createdAt: normalizeString(row.created_at),
    stage: normalizeString(row.stage),
    agentRole: normalizeString(row.agent_role),
    agentId: normalizeString(row.agent_id),
    targetKind: normalizeString(row.target_kind),
    targetId: normalizeString(row.target_id),
    status: normalizeString(row.status),
    provider: normalizeString(row.provider),
    modelName: normalizeString(row.model_name),
    input: safeJsonParse(row.input_json, {}),
    output: safeJsonParse(row.output_json, {}),
    errorText: normalizeString(row.error_text),
    meta: safeJsonParse(row.meta_json, {}),
  }));
}

function appendTaskProgressLogEntry(db, persistDb, payload) {
  const normalized = normalizeTaskProgressLogPayload(payload);
  db.run(
    `INSERT INTO task_progress_logs (
      entry_id, created_at, plan_id, target_kind, target_id, action_type, status,
      actual_actor, display_actor, message_for_user, payload_json, source_run_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      normalized.entryId,
      normalized.createdAt,
      normalized.planId,
      normalized.targetKind,
      normalized.targetId,
      normalized.actionType,
      normalized.status,
      normalized.actualActor,
      normalized.displayActor,
      normalized.messageForUser,
      normalized.payloadJson,
      normalized.sourceRunId,
    ]
  );
  persistDb();
  return {
    entryId: normalized.entryId,
    createdAt: normalized.createdAt,
  };
}

function listTaskProgressLogEntries(db, options = {}) {
  const limit = clampLimit(options.limit, 50);
  const targetKind = normalizeString(options.targetKind);
  const targetId = normalizeString(options.targetId);
  const planId = normalizeString(options.planId);
  const clauses = [];
  const params = [];
  if (targetKind) {
    clauses.push("target_kind = ?");
    params.push(targetKind);
  }
  if (targetId) {
    clauses.push("target_id = ?");
    params.push(targetId);
  }
  if (planId) {
    clauses.push("plan_id = ?");
    params.push(planId);
  }
  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = queryRows(
    db,
    `SELECT entry_id, created_at, plan_id, target_kind, target_id, action_type, status,
            actual_actor, display_actor, message_for_user, payload_json, source_run_id
       FROM task_progress_logs
       ${whereClause}
      ORDER BY created_at DESC
      LIMIT ?`,
    [...params, limit]
  );
  return rows.map((row) => ({
    entryId: normalizeString(row.entry_id),
    createdAt: normalizeString(row.created_at),
    planId: normalizeString(row.plan_id),
    targetKind: normalizeString(row.target_kind),
    targetId: normalizeString(row.target_id),
    actionType: normalizeString(row.action_type),
    status: normalizeString(row.status),
    actualActor: normalizeString(row.actual_actor),
    displayActor: normalizeString(row.display_actor),
    messageForUser: normalizeString(row.message_for_user),
    payload: safeJsonParse(row.payload_json, {}),
    sourceRunId: normalizeString(row.source_run_id),
  }));
}

function getLatestTaskProgressLogEntry(db, options = {}) {
  const rows = listTaskProgressLogEntries(db, {
    ...options,
    limit: 1,
  });
  return rows[0] || null;
}

function appendPlanArtifact(db, persistDb, payload) {
  const normalized = normalizePlanArtifactPayload(payload);
  db.run(
    `INSERT INTO plan_artifacts (
      plan_id, created_at, status, reply_text, plan_json, source_run_id, approved_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      normalized.planId,
      normalized.createdAt,
      normalized.status,
      normalized.replyText,
      normalized.planJson,
      normalized.sourceRunId,
      normalized.approvedAt,
    ]
  );
  persistDb();
  return {
    planId: normalized.planId,
    createdAt: normalized.createdAt,
    status: normalized.status,
    replyText: normalized.replyText,
    plan: safeJsonParse(normalized.planJson, {}),
    sourceRunId: normalized.sourceRunId,
    approvedAt: normalized.approvedAt,
  };
}

function updatePlanArtifact(db, persistDb, planId, patch = {}) {
  const normalizedPlanId = normalizeString(planId);
  if (!normalizedPlanId) return null;
  const rows = queryRows(
    db,
    `SELECT plan_id, created_at, status, reply_text, plan_json, source_run_id, approved_at
       FROM plan_artifacts
      WHERE plan_id = ?
      LIMIT 1`,
    [normalizedPlanId]
  );
  const current = rows[0];
  if (!current) return null;
  const nextStatus = normalizeString(patch?.status) || normalizeString(current.status);
  const nextReplyText = Object.prototype.hasOwnProperty.call(patch || {}, "replyText")
    ? normalizeString(patch?.replyText)
    : normalizeString(current.reply_text);
  const nextPlanJson = Object.prototype.hasOwnProperty.call(patch || {}, "plan")
    ? safeJsonStringify(patch?.plan ?? {}, "{}")
    : String(current.plan_json || "{}");
  const nextSourceRunId = Object.prototype.hasOwnProperty.call(patch || {}, "sourceRunId")
    ? normalizeString(patch?.sourceRunId)
    : normalizeString(current.source_run_id);
  const nextApprovedAt = Object.prototype.hasOwnProperty.call(patch || {}, "approvedAt")
    ? normalizeString(patch?.approvedAt)
    : (nextStatus === "approved"
      ? (normalizeString(current.approved_at) || new Date().toISOString())
      : normalizeString(current.approved_at));
  db.run(
    `UPDATE plan_artifacts
        SET status = ?, reply_text = ?, plan_json = ?, source_run_id = ?, approved_at = ?
      WHERE plan_id = ?`,
    [nextStatus, nextReplyText, nextPlanJson, nextSourceRunId, nextApprovedAt, normalizedPlanId]
  );
  persistDb();
  return {
    planId: normalizedPlanId,
    createdAt: normalizeString(current.created_at),
    status: nextStatus,
    replyText: nextReplyText,
    plan: safeJsonParse(nextPlanJson, {}),
    sourceRunId: nextSourceRunId,
    approvedAt: nextApprovedAt,
  };
}

function listPlanArtifacts(db, options = {}) {
  const limit = clampLimit(options.limit, 50);
  const status = normalizeString(options.status);
  const clauses = [];
  const params = [];
  if (status) {
    clauses.push("status = ?");
    params.push(status);
  }
  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = queryRows(
    db,
    `SELECT plan_id, created_at, status, reply_text, plan_json, source_run_id, approved_at
       FROM plan_artifacts
       ${whereClause}
      ORDER BY created_at DESC
      LIMIT ?`,
    [...params, limit]
  );
  return rows.map((row) => ({
    planId: normalizeString(row.plan_id),
    createdAt: normalizeString(row.created_at),
    status: normalizeString(row.status),
    replyText: normalizeString(row.reply_text),
    plan: safeJsonParse(row.plan_json, {}),
    sourceRunId: normalizeString(row.source_run_id),
    approvedAt: normalizeString(row.approved_at),
  }));
}

function getLatestPlanArtifact(db, options = {}) {
  const rows = listPlanArtifacts(db, {
    ...options,
    limit: 1,
  });
  return rows[0] || null;
}

module.exports = {
  appendOrchestrationDebugRun,
  appendPlanArtifact,
  appendTaskProgressLogEntry,
  getLatestPlanArtifact,
  getLatestTaskProgressLogEntry,
  initializeRepositoryTables,
  listOrchestrationDebugRuns,
  listPlanArtifacts,
  listTaskProgressLogEntries,
  normalizeDebugRunPayload,
  normalizePlanArtifactPayload,
  normalizeTaskProgressLogPayload,
  updatePlanArtifact,
};
