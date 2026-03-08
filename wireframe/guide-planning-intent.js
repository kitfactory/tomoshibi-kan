(function attachGuidePlanningIntent(scope) {
  function normalizeString(value) {
    return String(value || "").trim();
  }

  function containsAny(text, patterns) {
    return patterns.some((pattern) => pattern.test(text));
  }

  function detectPlanningIntent(text) {
    const source = normalizeString(text);
    const lower = source.toLowerCase();
    if (!source) {
      return {
        requested: false,
        cue: "none",
      };
    }
    const planningRequested = containsAny(lower, [
      /plan/,
      /task/,
      /breakdown/,
      /trace/,
      /fix/,
      /verify/,
      /repair/,
      /debug/,
      /分けて/,
      /分解/,
      /計画/,
      /タスク/,
      /進めたい/,
      /進めて/,
      /修正/,
      /検証/,
      /デバッグ/,
    ]);
    if (!planningRequested) {
      return {
        requested: false,
        cue: "none",
      };
    }
    const explicitBreakdown = containsAny(lower, [
      /trace\s*\/\s*fix\s*\/\s*verify/,
      /task に分け/,
      /taskに分け/,
      /plan にして/,
      /planにして/,
      /タスクに分け/,
      /計画化/,
      /実行計画/,
    ]);
    return {
      requested: true,
      cue: explicitBreakdown ? "explicit_breakdown" : "planning_request",
    };
  }

  function buildPlanningIntentAssistPrompt(locale, intent) {
    if (!intent || !intent.requested) return "";
    if (normalizeString(locale).toLowerCase() === "en") {
      return [
        "The latest user message is an explicit planning trigger.",
        "Do not stay in status=conversation.",
        "Return status=needs_clarification only if one blocking fact prevents task creation.",
        "Otherwise prefer status=plan_ready.",
      ].join("\n");
    }
    return [
      "最新のユーザー発話は planning trigger と判定された。",
      "status=conversation に留まらない。",
      "task 作成を止める blocker が 1 つだけある時だけ status=needs_clarification を返す。",
      "それ以外は status=plan_ready を優先する。",
    ].join("\n");
  }

  function detectPlanningReadiness(text, intent) {
    if (!intent || intent.cue !== "explicit_breakdown") {
      return {
        ready: false,
        cue: "none",
      };
    }
    const source = normalizeString(text);
    const lower = source.toLowerCase();
    const hasTargetArea = containsAny(lower, [
      /settings/,
      /model/,
      /save/,
      /reload/,
      /tab/,
      /画面/,
      /設定/,
      /保存/,
      /再現/,
    ]);
    const hasRepro = containsAny(lower, [
      /steps?/,
      /repro/,
      /reload/,
      /open/,
      /押して/,
      /開いて/,
      /再現手順/,
      /手順/,
    ]);
    const hasExpected = containsAny(lower, [
      /expected/,
      /should/,
      /残る/,
      /維持/,
      /期待結果/,
      /期待/,
    ]);
    return {
      ready: Boolean(hasTargetArea && hasRepro && hasExpected),
      cue: hasTargetArea && hasRepro && hasExpected ? "debug_repro_ready" : "none",
    };
  }

  function buildPlanningReadinessAssistPrompt(locale, readiness) {
    if (!readiness || !readiness.ready) return "";
    if (normalizeString(locale).toLowerCase() === "en") {
      return [
        "The latest user message already includes a target area, reproducible steps, and an expected result.",
        "Treat minor missing details as assumptions in constraints.",
        "Do not stay in status=needs_clarification for missing file paths or logs alone.",
        "Prefer status=plan_ready and produce exactly three tasks: Trace, Fix, Verify.",
        "When possible, assign the Research resident for Trace, the Maker resident for Fix, and the Writer resident for Verify.",
      ].join("\n");
    }
    return [
      "最新のユーザー発話には対象画面、再現手順、期待結果がすでに含まれている。",
      "軽微な不足情報は constraints の assumptions として扱う。",
      "ファイルパスやログが未提示という理由だけで status=needs_clarification に留まらない。",
      "status=plan_ready を優先し、Task は Trace / Fix / Verify の3件を返す。",
      "可能なら 調べる人 を Trace、作り手 を Fix、書く人 を Verify に割り当てる。",
    ].join("\n");
  }

  const api = {
    detectPlanningIntent,
    buildPlanningIntentAssistPrompt,
    detectPlanningReadiness,
    buildPlanningReadinessAssistPrompt,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (scope) {
    scope.GuidePlanningIntent = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
