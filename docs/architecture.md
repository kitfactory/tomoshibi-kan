# アーキテクチャ

入口は `docs/OVERVIEW.md`。  
本書は「ユーザーI/Fはプロトタイプ準拠、内部設計は将来実装方針を正」とする前提で、`Execution Loop` と `Job`、`Settings` を含む最小設計を定義する。

## 1. 設計原則
- 実行主体は常に UseCase（Interactor）とする。
- `Guide/Pal/Gate` は役割であり、実行主体ではない。各 role は複数 profile を持てる。
- 依存方向は `Infrastructure -> Interface Adapter -> UseCase -> Domain` のみ許可する。
- UseCaseは外部I/Oを直接呼ばず、Port経由で扱う。
- データモデルは共通属性で集約し、差分は `details/meta` 等に閉じ込める。
- ユーザー向けI/Fは単純化し、内部都合の状態はPresenterで吸収する。
- `Runtime` は `model` と `cli_tool` を排他的に扱う。`runtime=cli_tool` 時はSkill選択不可。
- Skillカタログは `ClawHub` を唯一の導線として扱う（現段階は擬似Download実装）。

## 2. レイヤー階層と責務
### 2.1 Domain層
責務:
- 業務データ定義
- 状態遷移の不変条件
- ランタイム整合（Model/CLI/Skill）制約

主なエンティティ:
- `Plan`
- `Task`
- `Job`
- `PalProfile`
- `ModelConfig`
- `CliToolConfig`
- `SkillConfig`
- `CompletionRitual`
- `GateResult`
- `Event`
- `UserMessage`
- `GuideMessage`

### 2.2 UseCase層
責務:
- ユースケース単位の手順制御
- 状態遷移とバリデーション

主なUseCase:
- `GuideConversationUseCase`（相談受付、Plan生成、承認/却下）
- `GuideDispatchUseCase`（承認PlanをTaskへ分解しPalへ割当）
- `PalWorkUseCase`（Task実行、Ritual作成、Gate提出）
- `GateReviewUseCase`（Task/JobのApprove/Reject判定）
- `PalResubmitUseCase`（差し戻し理由反映の再提出）
- `GuideCompletionUseCase`（最終完了通知）
- `JobLifecycleUseCase`（Jobの開始/提出/再提出/判定連携）
- `RuntimeConfigUseCase`（モデル/CLIツール追加削除）
- `SkillCatalogUseCase`（ClawHub検索、擬似Download、Skill削除）
- `PalProfileUseCase`（Guide/Gate/Pal profile の Role/Runtime/Skill 保存）
- WorkspaceQueryUseCase（Tab表示向けデータ取得）
- PlanExecutionOrchestrator（GuideDispatchUseCase / PalWorkUseCase / GateReviewUseCase / PalResubmitUseCase / GuideCompletionUseCase を束ね、Execution Loop を進行させる実行系責務）

### 2.3 Interface Adapter層
責務:
- UI/IPC入出力をUseCase DTOへ変換
- Domainを表示DTOへ整形

主なコンポーネント:
- `WorkspaceController`
- `SettingsController`
- `WorkspacePresenter`
- `SettingsPresenter`

### 2.4 Infrastructure層
責務:
- 永続化実装
- 外部連携実装
- Electron IPC配線

主なコンポーネント:
- `SqliteWorkflowRepository`
- `SqliteSettingsRepository`
- `OsKeychainSecretStoreAdapter`
- `PalpalCoreGateJudgeAdapter`
- `LlmRuntimeAdapter`
- `RuntimeDefaultsProvider`（`.env` -> Electron preload bridge）
- `ClawHubSkillCatalogAdapter`（現段階は擬似Download）
- `ElectronIpcRouter`

## 3. ドメインモデル（最小）
```ts
type PlanStatus = "proposed" | "approved" | "rejected" | "completed";
type WorkStatus = "assigned" | "in_progress" | "to_gate" | "rejected" | "done";
type Decision = "approved" | "rejected";
type RuntimeKind = "model" | "tool";
type PalRole = "guide" | "gate" | "worker";

type Plan = {
  id: string;
  goal: string;
  status: PlanStatus;
};

type Task = {
  id: string;
  planId: string;
  title: string;
  description: string;
  palId: string;
  gateProfileId?: string;
  status: WorkStatus;
};

type Job = {
  id: string;
  title: string;
  schedule: string;
  instruction: string;
  palId: string;
  gateProfileId?: string;
  status: WorkStatus;
  lastRunAt: string;
};

type PalProfile = {
  id: string;
  role: PalRole;
  displayName: string;
  runtimeKind: RuntimeKind;
  models: string[];
  cliTools: string[];
  skills: string[];
};

type WorkspaceAgentSelection = {
  activeGuideProfileId: string;
  defaultGateProfileId: string;
};

type ModelConfig = {
  name: string;
  provider: string;
  apiKeyRef: string; // persisted reference to SecretStore
  apiKeyInput?: string; // write-only input, not persisted
  baseUrl: string;
};

type CliToolConfig = {
  toolName: string;
};

type SkillConfig = {
  id: string;
  name: string;
  source: "ClawHub";
  description: string;
};

type CompletionRitual = {
  id: string;
  targetId: string; // taskId or jobId
  targetType: "task" | "job";
  evidence: string;
  replay: string;
};

type GateResult = {
  id: string;
  targetId: string; // taskId or jobId
  targetType: "task" | "job";
  decision: Decision;
  reason: string;
  fixes: string[];
};
```

## 4. Port定義（Interface）
```ts
interface WorkflowRepositoryPort {
  findPlanById(id: string): Promise<Plan | null>;
  savePlan(plan: Plan): Promise<void>;
  listTasksByPlan(planId: string): Promise<Task[]>;
  findTaskById(id: string): Promise<Task | null>;
  saveTask(task: Task): Promise<void>;
  findJobById(id: string): Promise<Job | null>;
  saveJob(job: Job): Promise<void>;
  listJobs(): Promise<Job[]>;
  saveRitual(ritual: CompletionRitual): Promise<void>;
  findRitualByTarget(targetType: "task" | "job", targetId: string): Promise<CompletionRitual | null>;
  saveGateResult(result: GateResult): Promise<void>;
  findGateResultByTarget(targetType: "task" | "job", targetId: string): Promise<GateResult | null>;
  appendEvent(event: Event): Promise<void>;
  listRecentEvents(limit: number): Promise<Event[]>;
  saveUserMessage(msg: UserMessage): Promise<void>;
  saveGuideMessage(msg: GuideMessage): Promise<void>;
}

interface RuntimeConfigRepositoryPort {
  listModels(): Promise<ModelConfig[]>;
  saveModel(config: ModelConfig): Promise<void>;
  removeModel(name: string): Promise<void>;
  listCliTools(): Promise<CliToolConfig[]>;
  saveCliTool(config: CliToolConfig): Promise<void>;
  removeCliTool(toolName: string): Promise<void>;
  listSkills(): Promise<SkillConfig[]>;
  saveSkill(config: SkillConfig): Promise<void>;
  removeSkill(skillId: string): Promise<void>;
  listPalProfiles(): Promise<PalProfile[]>;
  savePalProfile(profile: PalProfile): Promise<void>;
  removePalProfile(id: string): Promise<void>;
}

interface SecretStorePort {
  set(secretRef: string, value: string): Promise<void>;
  get(secretRef: string): Promise<string | null>;
  remove(secretRef: string): Promise<void>;
}

interface SafetyCheckPort {
  canExecute(profile: PalProfile, requestedAction: string): boolean;
}

interface GateJudgePort {
  judge(input: GateJudgeInput): Promise<GateJudgeOutput>;
}

interface SkillCatalogPort {
  search(keyword: string): Promise<SkillCatalogItem[]>;
  download(skillId: string): Promise<SkillConfig>; // 現段階は擬似実装
}
```

## 4.1 設定保存方針（決定）
- 非機密設定は `SqliteSettingsRepository` に保存する。
- API_KEY は `SecretStorePort`（OSキーチェーン実装）に保存し、DBへ平文保存しない。
- `ModelConfig` の永続化データは `apiKey` の代わりに `secretRef` を保持する。
- UI入力の API_KEY は write-only とし、読み出し時は「設定済み」状態のみ返す。
- モデル削除時は設定レコード削除と `SecretStorePort.remove(secretRef)` を同一トランザクション境界で扱う。
- 開発既定の model/provider/base_url/api_key は `.env`（`LMSTUDIO_*`）から解決し、preload bridge で Renderer に渡す。

## 5. Execution Loop とUseCase対応
1. 相談受付/Plan提示: `GuideConversationUseCase`
2. valid かつ approved な Plan 受理後の Execution Loop 開始: `PlanExecutionOrchestrator`
3. Task配布: `GuideDispatchUseCase`
4. Task実行/提出: `PalWorkUseCase`
5. Task/Job判定: `GateReviewUseCase`
6. Task再提出: `PalResubmitUseCase`
7. Job運用: `JobLifecycleUseCase`
8. 完了通知: `GuideCompletionUseCase`
9. 設定管理（Model/CLI/Guide・Gate・Pal）: `RuntimeConfigUseCase` + `PalProfileUseCase`
10. Skill管理（ClawHub導線）: `SkillCatalogUseCase`
11. 画面表示: `WorkspaceQueryUseCase`

## 6. プロトタイプ対応方針
- Tab構成（Guide/Pal/Cron/Task/Event/Settings）は現行プロトタイプをI/F基準として維持する。
- 将来実装では、Rendererの状態更新をPresenter経由に集約し、UseCase直接依存を排除する。
- 現在のClawHub導線は擬似Downloadだが、`SkillCatalogPort` を介して本実装へ差し替え可能にする。

### 6.0 Presentation State 境界（現行プロトタイプ）
- `focus / sending / saving / selection / open / filtered / paged` などの UI 状態は Renderer の presentation state として扱い、Domain 状態へ昇格させない。
- 具体例:
  - Guide Chat: composer focus と送信中状態に応じて send button / guide character を更新し、message text は safe Markdown renderer を通して表示する。
  - Settings: `saved / dirty / saving` と add form open state を Renderer で保持する。
  - Task Board / Cron / Gate: row 選択、detail drawer open、gate panel open を Renderer で描画する。
  - Event Log: toolbar filter 結果、pager 境界、row type/result を Renderer で描画する。
- これらの状態は MVP では DOM 属性や class として可視化し、E2E の観測点としても利用する。

### 6.1 Renderer検証ヘルパー（現段階）
- `runtime-validation.js`
  - `model/tool` 排他保存と skill 適用可否の判定を担当する。
- `skill-catalog.js`
  - ClawHub 検索、Skill 追加/削除、重複防止の判定を担当する。
- `pal-profile.js`
  - Pal 追加初期値生成、Runtime適用、削除可否判定を担当する。
- `agent-routing.js`
  - Worker/Gate selector の scoring と候補選定を担当する。
- `plan-orchestrator.js`
  - 保存済み `Plan artifact` から task materialization / worker selection を行う renderer-side Orchestrator helper を担当する。
- `board-execution.js`
  - Task/Job action 実行、Gate panel 開閉、Gate decision 適用、auto execution queue を担当する。
- `task-detail-conversation.js`
  - Task detail 右列の会話ログ本文整形と actor/status/action 表示ヘルパーを担当する。
- `task-detail-panel.js`
  - Task detail panel の対象選択、右列描画、detail action button wiring、task/job 状態更新 helper を担当する。
- `runtime-payloads.js`
  - Guide/Worker/Gate の runtime payload 組み立て、handoff summary、gate response parse helper を担当する。
- `ui-text.js`
  - UI 文言辞書、message text、Guide UI prompt の固定定数を担当する。
- `ui-foundation.js`
  - low-level UI helper（text normalize、safe stringify、window bridge、localStorage snapshot、model option list）を担当する。
- `ui-runtime-registry.js`
  - runtime defaults、provider/model registry、tool/skill registry、ClawHub registry を担当する。
- `ui-prototype-seeds.js`
  - prototype workspace の localStorage key、初期 seed、resident/profile 選択の既定値を担当する。
- `ui-copy.js`
  - `tUi / tDyn` による UI 文言 lookup helper を担当する。
- `ui-event-log.js`
  - prototype event helper `makeEvent()` を担当する。
- `ui-settings-state.js`
  - Settings / modal / gate review の mutable state を担当する。
- `ui-workspace-data-state.js`
  - project / task / job / resident / progress log / plan artifact の bootstrap state を担当する。
- `ui-session-state.js`
  - locale / selected task / workspace tab / event paging など session UI state を担当する。
- `ui-core.js`
  - UI state module の facade と読み込み入口を担当する。
- `ui-markdown.js`
  - markdown / HTML rendering helper を担当する。
- `ui-link-utils.js`
  - external link open helper と検索 keyword normalize helper を担当する。
- `workspace-bridge-facade.js`
  - `WorkspaceAgentStateUi` と関連 browser bridge への thin facade wrapper を担当する。
- `execution-runtime-routing.js`
  - Guide-driven resident routing / replan request の runtime helper を担当する。
- `execution-runtime-plan.js`
  - Plan artifact からの task/job materialization と dispatch progress helper を担当する。
- `execution-runtime-review.js`
  - worker runtime / gate runtime / review bridge と runtime replay helper を担当する。
- `execution-runtime.js`
  - execution runtime façade と共通 conversation helper を担当し、routing / plan / review module を束ねる。
- `runtime/palpal-core-provider.js`
  - provider catalog、環境変数 patch、Guide structured output helper を担当する。
- `runtime/palpal-core-workspace-tools.js`
  - workspace file/web helper と skill-backed tool 定義を担当する。
- `runtime/palpal-core-tool-loop.js`
  - model tool-loop 実行、tool call fallback、loop trace helper を担当する。
- `runtime/palpal-core-tool-runtime.js`
  - workspace tool helper と tool-loop helper の façade を担当する。
- `runtime/palpal-core-runtime.js`
  - provider/CLI runtime の façade と Guide/Pal chat public API を担当する。
- `settings-state.js`
  - Settings の persistence bridge / local snapshot / runtime bridge facade を担当する。
- `settings-skill-market-state.js`
  - skill market / ClawHub catalog / install-search helper を担当する。
- `workspace-profile-state.js`
  - resident profile snapshot / built-in metadata / Guide-Gate selection helper を担当する。
- `workspace-board-state.js`
  - Task/Job/Gate result normalization と board snapshot helper を担当する。
- `workspace-runtime-config.js`
    - resident runtime/provider/tool normalization と runtime selection helper を担当する。
- `workspace-agent-guide-runtime.js`
    - Guide/runtime/context helper、resident skill/capability 解決、Guide context build fallback を担当する。
- `workspace-agent-assignment.js`
    - board sequence number、worker assignment profile、resident runtime execution config helper を担当する。
- `workspace-agent-state.js`
    - workspace profile/board/runtime-config facade と built-in resident identity sync helper を担当する。
- `guide-progress-flow.js`
  - Guide の plan 承認、承認済み plan の重複防止、progress query の自然文生成ヘルパーを担当する。
- `guide-context-mention.js`
  - Guide の project context 構築、focus command、@mention menu state/helper を担当する。
- `guide-chat-entry.js`
  - Guide の送信入口、project onboarding 判定、plan approval / progress query / model call 分岐を担当する。
- `guide-chat-runtime.js`
  - Guide composer の busy/focus 状態、model user text 組み立て、live reply 整形、runtime request helper、composer event wiring を担当する。
- `settings-persistence.js`
  - Settings保存ペイロード整形と Browser検証用 localStorage fallback（API_KEY非保存）を担当する。
- `settings-tab.js`
  - Settings タブの support/helper API、item-draft helper、resident sync helper を担当する。
- `settings-tab-skill-modal.js`
  - Settings の skill market preview / modal rendering と search/install event wiring を担当する。
- `settings-tab-controls.js`
  - Settings タブの DOM controls binding、item add/remove、resident sync、save action wiring を担当する。
- `settings-tab-markup.js`
  - Settings タブの labels 正規化、section/list/form/modal の shell markup 生成を担当する。
- `settings-tab-render.js`
  - Settings タブの描画 orchestration、state/context 準備、controls binding 呼び出しを担当する。
- `resident-panel.js`
  - 住人一覧、住人設定 modal、identity editor modal の描画と resident-facing UI helper を担当する。
- `workspace-shell.js`
  - Guide / Task / Job / Event / Gate など workspace shell 全体のタブ描画と i18n 再描画 wiring を担当する。
- `project-tab.js`
  - Project タブ描画、project state snapshot、directory picker helper、focused project 表示 helper を担当する。
- `tests/e2e/workspace-layout.shared.js`
  - workspace layout E2E の共通 fixture / mock / viewport 定義を担当する。
- `tests/e2e/workspace-layout.guide.js`
  - Guide / progress query / plan generation 系の E2E を担当する。
- `tests/e2e/workspace-layout.board.js`
  - board 系 E2E の thin aggregator と `flow/runtime` register を担当する。
- `tests/e2e/workspace-layout.board-flow.js`
  - Task / Job / Gate / detail conversation / reroute 表示系の E2E を担当する。
- `tests/e2e/workspace-layout.board-runtime.js`
  - runtime payload / event log / gate binding 系の E2E を担当する。
- `tests/e2e/workspace-layout.settings.js`
  - Settings tab 系の E2E を担当する。
- `tests/e2e/workspace-layout.profiles.js`
  - 住人一覧 / identity editor / profile sync 系の E2E を担当する。
- `tests/e2e/workspace-layout.spec.js`
  - workspace layout E2E の thin entrypoint と viewport loop を担当する。
- `palpal-core-registry.js`
  - `PALPAL_CORE_PROVIDERS` / `PALPAL_CORE_MODELS` を公開し、Settings の候補ソースを提供する。
- 位置づけ:
  - いずれも Renderer 側の MVP 検証ヘルパーであり、将来は UseCase / Domain へ移譲する。

## 7. 設計ガード（禁止事項）
- UseCaseからSQLiteやElectron APIを直接呼ばない。
- Domainに外部I/O依存を持ち込まない。
- `runtimeKind="tool"` のPalにSkillを保存しない。
- 未登録Model/CLI参照のPal設定保存を許可しない。
- `details/meta` に未定義キーを無制限に入れない（キー集合は仕様で管理する）。

## 追加設計 (2026-03-01): Workspace 境界契約

### 目的
- Pal ごとの Markdown 資産と、アプリ内部データ（非Git）を同一ルート内で分離する。
- Context Builder の入力ソース探索を安定化する。

### パス解決
- `WorkspaceRootResolver` を追加し、`ws-root` を OS 既定値または環境変数 override で決定する。
- `WorkspaceInternalPathResolver` は `<ws-root>/.tomoshibikan` 配下の `state/secrets/cache/logs` を解決する。

### 保存責務
- `SqliteSettingsRepository` は `state/settings.sqlite` を使用する。
- `SecretStorePort` は `secrets/secrets.json`（OS暗号化利用）を使用する。
- `.tomoshibikan` の下位ディレクトリは起動時に作成保証する。

### 読み取り責務
- `user.md` は `<ws-root>/user.md` を単一の共通ユーザー文脈として読む。
- Guide/Worker の個別文脈は `SOUL.md` / `ROLE.md`、Gate の個別文脈は `SOUL.md` / `RUBRIC.md` / `skills.yaml` から読む。
- `skills.yaml` は `enabled_skill_ids` の参照設定のみを保持し、詳細メタデータは Settings のインストール済み Skill 台帳から解決する。
- Workspace は `activeGuideProfileId` と `defaultGateProfileId` を保持し、Guide 系 UseCase は active guide、Gate 系 UseCase は対象別 `gateProfileId` または default gate を解決して使う。

### 非機能制約
- `.tomoshibikan` は Git 管理しない。
- 機密値は Markdown へ出力しない。

## 追加設計 (2026-03-01): PalContextBuilder

### コンポーネント分割
- `ContextSourceCollector`: ソース読み取り（Markdown/会話/メモリ/スキル/編集ファイル）
- `ContextPriorityPlanner`: 優先度付けと必須/任意判定
- `ContextBudgetPlanner`: token 予算配分
- `ContextCompactor`: truncate/summarize/drop の適用
- `ContextComposer`: LLM 送信 payload 生成
- `ContextAuditRecorder`: 監査ログを `.tomoshibikan/logs` へ保存

### Agent Identity Layer（Step1）
- `AgentIdentityRepository`（新設予定）:
  - `<ws-root>/{guides/guide-*|gates/gate-*|pals/pal-*}/SOUL.md` を読み書きする。
  - `<ws-root>/{guides/guide-*|pals/pal-*}/ROLE.md` を読み書きする。
  - `<ws-root>/gates/gate-*/RUBRIC.md` を読み書きする。
  - `<ws-root>/{guides/guide-*|gates/gate-*|pals/pal-*}/skills.yaml` の `enabled_skill_ids` を読み書きする。
- `AgentAddFlow`（Renderer）:
  - Guide/Worker 作成時に `AgentIdentityRepository` へ初期 save を行い、`locale` に応じた `SOUL.md` / `ROLE.md` テンプレートを生成する。
  - Gate 作成時に `AgentIdentityRepository` へ初期 save を行い、`locale` に応じた `SOUL.md` / `RUBRIC.md` テンプレートを生成する。
- `SkillCatalogResolver`（既存Settings状態を参照）:
  - `enabled_skill_ids` とインストール済み Skill 台帳を結合し、Context Builder 注入用の要約を生成する。
  - `runtimeKind="tool"` の場合は結合結果を破棄し、監査へ `skip-skill-context:tool-runtime` を残す。

### 境界契約
```ts
type ContextBuildInput = {
  palId: string;
  runtimeKind: "model" | "tool";
  modelName?: string;
  provider?: string;
  latestUserText: string;
  sessionMessages: ChatMessage[];
  workspaceRoot: string;
};

type ContextBuildResult = {
  ok: boolean;
  messages: Array<{ role: "system" | "developer" | "user" | "assistant"; content: string }>;
  audit: {
    included: string[];
    excluded: string[];
    estimatedInputTokens: number;
    budget: number;
    compaction: string[];
  };
  errorCode?: string;
};
```

### 運用方針
- `runtimeKind="tool"` の場合は Skill 文脈を注入しない。
- Guide/Gate/Worker で同一ビルダを使い、入力ソースの選択だけを role ごとに切り替える。
- 初期導入は Guide 経路のみで有効化し、Gate/Worker は段階展開する。

### 追加設計 (2026-03-01): ロール別コンテキスト方針
- `buildPalContext(role, runtimeKind, skillSummaries, ...)` を共通入口とする。
- role は `guide|gate|worker` で既定 system prompt を切り替える。
- runtimeKind が `tool` の場合は Skill 文脈を builder 層で遮断する（UI層の防御と二重化）。
- Guide は本サイクルで接続済み、Gate/Worker は同関数で段階導入する。

## 追加設計 (2026-03-01): Job Scheduler / Run History

### レイヤ配置
- Application:
  - `JobScheduleUseCase`（schedule設定更新、enable/disable）
  - `JobSchedulerTickUseCase`（tick時に due 判定、single-flight 判定、run生成）
  - `JobRunFinalizeUseCase`（run 完了/失敗/skip の確定）
- Domain:
  - `JobSchedulePolicy`（cron/interval 妥当性、next_run_at 算出）
  - `JobRunPolicy`（同時実行禁止、状態遷移）
- Infrastructure:
  - `SchedulerAdapter`（Node timer ベース、1分tick）
  - `SqliteJobRunRepository`

### Port 追加
```ts
interface JobSchedulePort {
  listEnabledJobs(): Promise<Job[]>;
  saveJobSchedule(input: {
    jobId: string;
    scheduleKind: "cron" | "interval";
    scheduleValue: string;
    timezone: string;
    enabled: boolean;
  }): Promise<void>;
  computeNextRunAt(input: {
    scheduleKind: "cron" | "interval";
    scheduleValue: string;
    timezone: string;
    fromIso: string;
  }): string;
}

interface JobRunRepositoryPort {
  createRun(input: {
    runId: string;
    jobId: string;
    triggerKind: "manual" | "schedule" | "resubmit";
    scheduledAt: string;
    startedAt: string;
    status: "running";
  }): Promise<void>;
  completeRun(input: {
    runId: string;
    status: "succeeded" | "failed" | "skipped" | "cancelled";
    finishedAt: string;
    summary: string;
    errorCode?: string;
    errorMessage?: string;
  }): Promise<void>;
  listRunsByJob(jobId: string, limit: number): Promise<JobRun[]>;
  trimRunsByJob(jobId: string, keep: number): Promise<void>;
  hasRunningRun(jobId: string): Promise<boolean>;
}
```

### 状態遷移
- `running -> succeeded|failed|cancelled`
- scheduler miss は `skipped` を直接記録（`running` を経由しない）

### 監視/ログ
- Scheduler tick の結果（due件数、起動件数、skip件数）を `.tomoshibikan/logs` に記録する。
- Event Log と JobRunRepository の双方に記録し、UI は Event Log から概況、JobRun から詳細履歴を表示する。

### 境界制約
- `runtimeKind=tool` の Job でも scheduler 自体は動作可能。
- 実行本体の呼び出し可否は既存 Runtime 制約に従う（scheduler は bypass しない）。
- 失敗時は run を `failed` で確定し、次回スケジュールは継続する（連続失敗で自動disableしない）。

## 追加設計 (2026-03-01): Gate Template / Resubmit Navigation

### Presentation 追加責務
- `GatePanelPresenter`:
  - Reject 理由テンプレート一覧を locale に応じて描画する。
  - テンプレート選択で textarea へ bullet 追記する。
- `ResubmitNavigationCoordinator`:
  - reject 後の target (`task` / `job`) に応じてタブ遷移を実行。
  - 対象行へフォーカス演出（CSS class）を付与し、再提出導線を可視化。

### 既存フローとの整合
- Gate 判定の業務ルール（最大理由数、状態遷移）は既存 `GateReviewUseCase` を維持。
- 追加は UI ナビゲーション層に閉じ、Domain ルールは変更しない。

## 追加設計 (2026-03-01): Event Log Query Controls

### Presentation
- `EventLogQueryState`:
  - `searchQuery`, `typeFilter`, `page` を保持。
- `EventLogPresenter`:
  - query state を使って client-side filter + pagination を計算し描画する。
  - toolbar / pager / row の視覚状態を DOM 属性へ反映し、運用画面の状態を観測可能にする。

### 挙動
- `appendEvent` 後は `page=1` にリセット。
- query state 変更時は `EventLogPresenter` のみ再描画し、他タブ状態は変更しない。

### 境界
- MVP は renderer 内メモリ上の Event 配列に対して client-side で処理する。
- 将来の永続化導入時は `WorkspaceQueryUseCase` に query パラメータを移し替える。

## 追加設計 (2026-03-01): SecretRef Rotation / Migration

### Application
- `ApiKeyRotationUseCase` を追加し、Model 保存処理から呼び出す。
- 入力パターン:
  - `apiKeyInput` あり: 新規 `secret_ref` 発行 + DB参照切替 + 旧secret削除
  - `apiKeyInput` なし: 既存 `secret_ref` 維持

### Infrastructure
- `SecretRefGenerator`: `model:<name>:api_key:<version>` 形式で一意生成。
- `SecretStorePort` は `set/get/remove` を既存利用。

### 一貫性ルール
- DB更新と secret 操作は「新規 secret 保存 -> DB更新 -> 旧secret削除」の順。
- 旧secret削除失敗は warning 扱いで retry queue（MVP はログ記録）へ積む。
- モデル削除時は `remove(secret_ref)` を必ず呼び、失敗時は `ERR-PPH-0025` を返す。

### 観測性
- ローテーション実行時に `model_name`, `old_ref`, `new_ref`（値はmask）を debug ログへ記録。
- API_KEY 本文はログへ出力しない。

## 追加設計 (2026-03-01): palpal-core Adapter Swap Testability

### Adapter 境界
- `runtime/palpal-core-runtime.js` は `palpal-core` 依存を内部変数で保持し、テスト時のみ差し替え可能にする。
- 本番時は常に `palpal-core` の実実装を利用する。

### テスト注入
- `__setCoreRuntimeBindingsForTest` / `__resetCoreRuntimeBindingsForTest` を test-only hook として提供。
- hook は catalog 取得・model generate の契約検証に限定して使用する。

## 追加設計 (2026-03-01): i18n Dictionary Verification

### 実装
- `scripts/verify_i18n_dictionary.js` が `wireframe/app.js` の辞書定義を解析し、ID整合を静的検証する。
- Renderer は `tUi/tDyn/messageText` でフォールバック順を統一する。

### CI/運用
- `verify:i18n` を独立コマンドとして提供し、release 前ゲートで実行可能にする。

## 追加設計 (2026-03-01): Writable Workspace Resolver

### コンポーネント
- `resolveWritableWorkspacePaths(candidateRoots)`
  - candidate を正規化して順に `ensureWorkspaceLayout` を実行。
  - `EACCES/EPERM` は recoverable として次候補へ進む。
  - それ以外は fatal として即throw。

### Electron 起動連携
- `electron-main` は writable resolver の戻り値を `settings-store` の保存先として使用する。
- フォールバック時は warning ログを出す。

## 追加設計 (2026-03-02): Settings Dirty State

### State
- `settingsSavedSignature` を保持し、現在の保存payloadとの差分で dirty 判定する。
- `settingsSaveInFlight` で保存中の多重送信を防ぐ。

### UI
- Settings フッターで `dirty/saved` 状態を表示し、保存ボタン活性を切り替える。
- 保存中は `saving` state と busy button を表示する。
- add form open state は section 側へ反映し、どの追加導線が開いているかを見失わないようにする。
- タブ切替時の再描画でも settings state は保持する。

## �ǉ��݌v (2026-03-06): LANGUAGE System Prompt Layer

### Prompt Composition
- `PalContextBuilder.buildPalContext` �� system prompt �w�� `LANGUAGE`, `OPERATING_RULES`, `SOUL`, `ROLE`, `RUBRIC` �̃Z�N�V�����őg�ݗ��Ă�B
- `LANGUAGE` �� renderer �� `locale` ���琶�����Amodel reply �̊��茾��� app ����֌Œ肷��B
- Guide/Worker �� `ROLE.md`�AGate �� `RUBRIC.md` �� secondary prompt source �Ƃ��Ĉ����B

### Runtime Binding
- Renderer �� Guide/Worker ���s�O�� identity repository ���� `SOUL.md` / `ROLE.md` / `RUBRIC.md` ��ǂݍ��݁AContext Builder ���͂֓n���B
- model runtime �Ăяo������ context messages ���� system role �𒊏o���Aruntime �� `systemPrompt` �����֏W�񂷂�B
- developer/history messages �� system prompt �ƕ������Atool summary ���b����̕����Ƃ��ēn���B

## �ǉ��݌v (2026-03-06): Role-Specific Operating Rules

### Prompt Profiles
- Guide profile �� user dialogue, task decomposition, Pal assignment, Gate-aware planning ��܂މ^�p�K������B
- Gate profile �� `decision / reason / fixes` �𖾊m������]���o�͋K������B
- Worker profile �� execution-first, evidence reporting, blocked-state disclosure ��܂މ^�p�K������B

## �ǉ��݌v (2026-03-06): Gate Decision Schema

### Prototype Shape
- Task/Job renderer state �� `gateResult = { decision, reason, fixes }` ��ێ�����B
- `decisionSummary / fixCondition` �͊��� row/detail �\�������� compatibility field �Ƃ��Ďc���B
- manual Gate panel �� approve/reject ����� `gateResult` �𐶐����� target state �֔��f����B

## 追加設計 (2026-03-06): Execution Loop Context Handoff Policy

### 基本方針
- `GuideConversationUseCase` は一次セッションを保持する唯一の対話起点とする。
- `GuideConversationUseCase` は planning の唯一の主体であり、valid な `Plan` オブジェクトを作れるまで対話を継続する。
- `GuideConversationUseCase` は `conversation | needs_clarification | plan_ready` を内部状態として扱える。`conversation` では通常対話のみを行い、Plan / Task / routing は開始しない。
- `GuideConversationUseCase` の runtime adapter は `response_format: json_schema` を使った native structured output を優先し、provider 非対応や失敗時のみ prompt-based JSON + parser hardening へ fallback する。
- `GuideConversationUseCase` は `runtimeKind=model | tool` を取りうる。first step では `toolName=Codex` のみを許可し、CLI bridge は `TomoshibikanCoreRuntime.guideChat` の I/F を維持したまま `runtimeKind` と `toolName` を受け取る。
- `GuideConversationUseCase` の output instruction は schema と形式制約だけを持ち、`conversation / needs_clarification / plan_ready` の使い分け判断は `OPERATING_RULES` 側へ集約する。
- `GuideConversationUseCase` の prompt contract は、ユーザーが明示的に plan / task 分解を依頼し、対象・期待結果・関連ファイル・利用 tool の主要情報が揃っている場合、軽微な不足は `constraints` の assumption として補って `plan_ready` を優先させる。
- `GuideConversationUseCase` の `OPERATING_RULES` は、latest user turn が仕事の依頼へ進もうとしているかどうかを判定し、plan / task 分解 / trace-fix-verify 分割 / 進め方の確定 / 調査 / 修正 / 確認依頼を `work intent` として扱う。
- `GuideConversationUseCase` の `OPERATING_RULES` は、依頼の輪郭がまだ半分ほどで対象・問題・期待結果がぼんやりしている段階では、3案提示を急がず、相槌 + 視点提案 + オープンな質問を優先する。
- `GuideConversationUseCase` の `OPERATING_RULES` は、task 作成を止める blocker が 1 つだけある時だけ follow-up を許し、軽微な不足は assumption として `constraints` に送る。
- `GuideConversationUseCase` の `OPERATING_RULES` は、3案提示が必要な時だけ Markdown の番号付き箇条書きで案を返せるようにする。
- `GuideConversationUseCase` の `OPERATING_RULES` は、短い `scope_unclear` turn では generic follow-up だけで止まらず、会話履歴からあり得そうな案件を具体化した 3 つの option を可能性順に提示し、1 つを recommendation として返し、短い choice で答えられる closing を付けられる。
- `GuideConversationUseCase` の 3 option は、各案の観点（例: 永続化、再読込、UI state 反映）を短く明示し、recommendation には「なぜ今その観点を見るか」の一言理由を付ける。
- `GuideConversationUseCase` の system prompt は、上記の `3 option + recommendation + short-answer closing` を few-shot example でも示し、model が rules を自然な返答へ写像しやすいよう補助してよい。
- debug-purpose workspace では、`GuideConversationUseCase` は resident set built-in (`冬坂 / 久瀬 / 白峰`) を優先候補として扱い、trace / fix / verify に分けやすい plan を出す。
- debug-purpose workspace で明示的な breakdown 要求がある場合、`GuideConversationUseCase` の `OPERATING_RULES` は `冬坂 / 久瀬 / 白峰` の resident trio plan を優先する。
- `GuideConversationUseCase` の controller は latest user text を planning trigger として再評価できる。trigger が立つ場合は runtime adapter に assist prompt を追加し、`conversation` に留まらず `needs_clarification` か `plan_ready` へ進める。
- `GuideConversationUseCase` の controller は planning trigger に加えて planning readiness も判定できる。`explicit_breakdown` かつ再現手順・期待結果が揃う時は readiness assist を追加し、軽微な不足を assumption に寄せて `plan_ready` を優先させる。
- `GuidePlan` parser は debug-purpose の explicit breakdown (`冬坂 / 久瀬 / 白峰`) を含む `plan_ready` で task 配列が壊れている場合、reply と controller cue (`planningIntent` / `planningReadiness`) を参照して resident trio 3 task に recovery する。
- `tool` runtime の Guide には外部 skill/tool を動的注入しない。CLI tool へ渡すのは `systemPrompt`, history, userText, response schema hint までとし、routing 用の capability snapshot は Guide/Orchestrator 側の判断材料としてだけ使う。
- CLI tool の structured output は弱いものとして扱う。`output-schema` や response format を渡しても、accept 条件は parser / repair / validate を通過した valid object で固定する。
- controller assist は `guideControllerAssistEnabled=true` の時だけ有効にする。既定では Guide 自身の判断に任せ、controller は planning cue を注入しない。
- Guide の応答が valid な `Plan` として parse / validate できない場合、`GuideConversationUseCase` から抜けず、Task/Job の materialize や routing は開始しない。
- `PlanExecutionOrchestrator` は Guide 会話履歴をそのまま downstream へ渡さず、`Task/Job/HandoffSummary/GateReviewInput` へ正規化して受け渡す。
- `PlanExecutionOrchestrator` の開始入力は `approved Plan` であり、raw user request や Guide の自然文返答ではない。
- `PalWorkUseCase` は `WorkerExecutionInput` を組み立て、`task/job structured fields + summary + identity prompt` を Worker runtime へ渡す。
- `GateReviewUseCase` は `GateReviewInput` を組み立て、`submission + ritual + task/job summary + reject history summary + rubric` を Gate 側へ渡す。

### 設定責務
- `RuntimeConfigRepositoryPort` は workspace-level の `contextHandoffPolicy: "minimal" | "balanced" | "verbose"` を保持できるようにする。
- `RuntimeConfigRepositoryPort` は workspace-level の `guideControllerAssistEnabled: boolean` を保持できるようにする。
- `SettingsPresenter` は 3 モードのみを表示し、細かい source 単位の ON/OFF は初期導入で扱わない。
- `SettingsPresenter` は `Guide controller assist` checkbox を表示し、既定 OFF / 明示 ON のみを扱う。
- `SettingsPresenter` は built-in 住人定義を current workspace へ同期する action を表示し、built-in profile の resident-facing metadata と identity file を current built-in seed へ揃えられるようにする。

### Handoff DTO 方針
- `Guide -> Worker` は `WorkerExecutionInput` を用い、raw `sessionMessages` は含めない。
- `Guide/Worker -> Gate` は `GateReviewInput` を用い、raw `sessionMessages` は含めない。
- `Balanced` 以上では `handoffSummary` を含める。
- `Verbose` では `handoffSummary` に加え `compressedHistorySummary[]` を含められる。

### 圧縮方針
- `ContextCompactor` は handoff 時、まず構造化フィールドを固定し、自由文だけを対象に圧縮する。
- 優先順は `structure-preserve -> summarize -> drop detail` とする。
- `Minimal` は summary 生成を省略可能、`Balanced`/`Verbose` は summary 生成を優先する。
- compaction audit には `source`, `mode`, `droppedFields`, `summaryCount`, `tokenEstimate` を残す。

### 未導入範囲
- prototype の現状では Guide のみ raw `sessionMessages` を runtime へ接続済みとし、Worker は workspace-level `Context Handoff Policy` (`minimal|balanced|verbose`) に従って `WorkerExecutionInput` を shaping する。
- Gate は `GateReviewInput` を model runtime へ渡し、panel 上の suggestion (`decision / reason / fixes`) として反映する。
- Gate の suggestion をそのまま自動確定する full auto review は未導入とする。
- agent ごとの個別 override は別 delta とする。
- `wireframe/guide-task-planner.js` は現行 prototype の task draft 生成補助であり、正本の planning 主体ではない。将来は Guide 出力の `Plan` parse / validate / normalize 補助へ置き換える。
- built-in resident sync は non built-in custom profile を上書きせず、`guide-core / gate-core / pal-alpha / pal-beta / pal-delta` だけを対象に current built-in seed/template を適用する。legacy built-in `pal-gamma` は sync 時に profile list から外す。

### Handoff Schema
```ts
type HandoffSummary = {
  goal: string;
  decisionContext: string;
  risks: string[];
  openQuestions: string[];
  sourceRefs: Array<"guide-session" | "task-card" | "job-card" | "submission" | "reject-history">;
};

type WorkerExecutionInput = {
  targetType: "task" | "job";
  targetId: string;
  title: string;
  instruction: string;
  constraints: string[];
  expectedOutput: string;
  assigneePalId: string;
  gateProfileId: string;
  projectContext?: string;
  handoffSummary?: HandoffSummary;
  compressedHistorySummary?: string[];
};

type GateReviewInput = {
  targetType: "task" | "job";
  targetId: string;
  title: string;
  instruction: string;
  constraints: string[];
  expectedOutput: string;
  submission: string;
  ritual: {
    evidence: string;
    replay: string;
  };
  gateProfileId: string;
  rubricVersion: string;
  handoffSummary?: HandoffSummary;
  rejectHistorySummary?: string[];
  compressedHistorySummary?: string[];
};
```

### DTO 生成責務
- `PlanExecutionOrchestrator` は Guide 会話と Plan/Task/Job から `HandoffSummary` を生成する。
- `PalWorkUseCase` は `WorkerExecutionInput` を組み立て、runtime へ渡す直前に policy (`minimal|balanced|verbose`) を反映する。
- `GateReviewUseCase` は `GateReviewInput` を組み立て、`submission`, `ritual`, `reject history` を統合する。
- `rubricVersion` は `RUBRIC.md` の更新時刻または content hash から導出する。

### Routing 責務
- `PlanExecutionOrchestrator` は routing の最終決定を束ねるが、Worker/Gate の候補抽出と説明生成は専用 selector に委譲できる。
- `WorkerRoutingSelector` は `Task/Job requirements + enabled skills + ROLE.md` を入力に取り、候補 Worker と選定理由を返す。
- `GateRoutingSelector` は `review focus + expected output + RUBRIC.md` を入力に取り、候補 Gate と選定理由を返す。
- selector は display name の文字列一致ではなく、identity file と構造化 profile 属性を評価する。
- `runtimeKind="tool"` の Worker は `registeredToolCapabilities[]` を追加入力として持ち、CLI probe から得た capability summaries を `enabled skills` 相当の routing/context signal として評価する。

### Routing Input
```ts
type WorkerRoutingInput = {
  targetType: "task" | "job";
  title: string;
  instruction: string;
  constraints: string[];
  expectedOutput: string;
  requiredSkills: string[];
};

type GateRoutingInput = {
  targetType: "task" | "job";
  title: string;
  instruction: string;
  constraints: string[];
  expectedOutput: string;
  reviewFocus: string[];
};
```

### Routing Evaluation
- `WorkerRoutingSelector` はまず `requiredSkills` と `enabled_skill_ids` の一致で候補を絞り、その後 `ROLE.md` の責務・作業方針・期待アウトプット一致で順位付けする。
- `runtimeKind="tool"` の場合、`enabled_skill_ids` が空でも `registeredToolCapabilities[].capabilitySummaries` を skill summary と同列に扱い、CLI 内包 command / MCP / feature 情報から一致語彙を拾う。
- `GateRoutingSelector` はまず `RUBRIC.md` の評価観点・合格条件・reject 条件一致で候補を絞り、その後 `defaultGateId` や Gate status を補助的に使って順位付けする。
- Worker/Gate ともに、選定理由は audit/event に残せる短い explanation DTO として返す。
- Renderer は selector explanation DTO を `dispatch` / `to_gate` event summary へ短く埋め込み、Event Log から routing 根拠を追えるようにする。

### Guide-driven routing boundary
- `PlanExecutionOrchestrator` は routing の deterministic core を保持する。resident 候補抽出、status filter、load 計算、capability probe 反映、invalid decision fallback は Orchestrator 側で行う。
- resident 候補の意味判断が必要な時だけ、Orchestrator は active Guide の model / `SOUL.md` / `ROLE.md` を `GuideReasoningContext` として借りる。
- Guide-driven routing で LLM に渡すのは raw transcript 全文ではなく、`RoutingInput` に正規化した task 情報と `GuideRoutingCandidateResident[]` のみとする。
- `GuideRoutingCandidateResident` は resident の display name を含めず、判断の一次ソースを `roleContractText / capabilitySummary / fitHints` に絞る。
- LLM 返答は `RoutingDecision` として parse / validate し、`selectedResidentId` が候補外、`reason` が空、`fallbackAction` が不正な場合は invalid とする。
- invalid / low-confidence / no-fit の `RoutingDecision` では dispatch せず、core は rule-based fallback または `reroute / replan_required` を起こす。
- rule-based fallback scorer は resident routing の主役ではなく safety net であり、`invalid / low-confidence / no-fit / runtime unavailable` の時だけ resident 選定に使う。
- `reroute` は同じ task を別 resident 候補へ回す決定、`replan_required` は Guide へ戻して Plan 自体の見直しを要求する決定として扱う。
- routing の audit には、前処理 summary、LLM decision、採用した fallback を残せること。

### Guide-driven routing DTO
```ts
type RoutingInput = {
  targetType: "task" | "job";
  targetId: string;
  planId: string;
  goal: string;
  title: string;
  instruction: string;
  constraints: string[];
  expectedOutput: string;
  requiredSkills: string[];
  needsEvidence: boolean;
  scopeRisk: "low" | "medium" | "high";
  candidateResidents: CandidateResidentSummary[];
  historySummary?: string[];
};

type CandidateResidentSummary = {
  residentId: string;
  role: "guide" | "worker" | "gate";
  displayName: string;
  status: string;
  currentLoad: number;
  roleContractText: string;
  roleSummary: string[];
  residentFocus: string[];
  preferredOutputs: string[];
  capabilitySummary: string[];
  fitHints: string[];
};

type GuideRoutingCandidateResident = {
  residentId: string;
  status: string;
  currentLoad: number;
  roleContractText: string;
  capabilitySummary: string[];
  fitHints: string[];
};

type RoutingDecision = {
  selectedResidentId: string;
  reason: string;
  confidence: "low" | "medium" | "high";
  fallbackAction: "dispatch" | "reroute" | "replan_required";
};
```

- `AgentRouting.buildWorkerRoutingInput()` は resident summary へ `roleContractText`, `residentFocus`, `preferredOutputs` を付与する。
- `AgentRouting.buildWorkerRoutingLlmInput()` は `CandidateResidentSummary[]` から、LLM routing 用の `GuideRoutingCandidateResident[]` を切り出す。
- `AgentRouting.selectWorkerForTask()` は lexical match に加え、`ROLE.md` の `得意な依頼` と `得意な作成物` の一致へ強い重みを与える role-first scorer とする。

### CLI Capability Probe
- Electron main は Settings load/save 時に登録済み CLI ツールへ問い合わせ、`registeredToolCapabilities[]` を補完する。
- first step では `Codex` と `OpenCode` を first-class 対象とする。
- `Codex` は `codex --help`, `codex mcp list`, `codex features list`, `codex --version` の結果から snapshot を生成する。
- `OpenCode` は `opencode --help`, `opencode agent list`, `opencode debug skill`, `opencode debug agent build`, `opencode mcp list`, `opencode --version` の結果から snapshot を生成する。
- probe 失敗時も Settings save 自体は失敗させず、tool capability status を `unavailable` として保持する。

### Compaction 適用順
- 1. 構造化フィールドを固定する。
- 2. `handoffSummary` を短文化する。
- 3. `compressedHistorySummary[]` を source 単位で削る。
- 4. なお不足する場合のみ `openQuestions` や `risks` の detail を落とす。
- raw transcript は DTO に含めないため、compaction 対象外とする。

## 追加設計 (2026-03-06): Orchestration Debug DB

### 保存先
- 追加の DB ファイルは作らず、既存 `settings.sqlite` に `orchestration_debug_runs` テーブルを追加する。
- 理由はインストール負荷を増やさず、既存の `sql.js` 運用に乗せるため。

### Table
```sql
CREATE TABLE orchestration_debug_runs (
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
```

### 責務
- `SqliteSettingsStore` は app settings facade として振る舞い、`orchestration_debug_runs` / `task_progress_logs` / `plan_artifacts` の repository 実装は `settings-store-repositories.js` に分離する。
- Electron main の `guide:chat` / `pal:chat` IPC handler が runtime 呼び出しの前後で sanitized record を保存する。
- Renderer は debug DB へ直接書かず、`debugMeta` を payload に添えるだけに留める。

### Sanitized record
- `input_json` には `userText`, `systemPrompt`, `messages`, `enabledSkillIds`, `maxTurns`, `agentName` などを保存する。
- `output_json` には `text`, `provider`, `modelName`, `toolCalls` を保存する。
- `meta_json` には `identityVersions`, `handoffPolicy`, `gateProfileId`, `rubricVersion` などの軽量メタデータを保存する。
- `apiKey` や secret reference は保存しない。

### Debug CLI
- `cli/palpal.js` は Electron launcher のまま維持しつつ、`debug runs` / `debug show` / `debug smoke` を追加する。
- `cli/palpal.js` の `debug guide-failures` は `guide_chat` record の `output.text` を `GuidePlan.parseGuidePlanResponse` で再解釈し、`status + blocking cue` を集計する。
- CLI は `TOMOSHIBIKAN_WS_ROOT` から workspace を解決し、`SqliteSettingsStore.listOrchestrationDebugRuns()` を使って debug record を読む。
- `debug smoke` は Playwright Electron launcher を使って app を起動し、isolated workspace に対して Settings -> Guide -> Job/Gate の最小経路を実行する。
- 出力は plain text とし、一覧・詳細・smoke summary の 3 形態のみを初期対応とする。

## 追加設計 (2026-03-07): Guide-driven Orchestrator と Task-centric Progress Log

### Orchestrator core と Guide reasoning boundary
- `PlanExecutionOrchestrator` は独立モジュールとして保持し、dispatch、retry、reroute、gate submit、status 遷移、完了判定などの deterministic 制御を担当する。
- `PlanExecutionOrchestrator` は planning の主体ではない。新しい Plan が必要な場合は `replan_required` を起こし、Guide へ差し戻す。
- `GuideConversationUseCase` は初回 plan だけでなく replan の生成主体でもある。
- `GuideConversationUseCase` が valid な `plan_ready` を受理した時は、まず `Plan artifact` を persistent に保存し、その保存済み artifact を起点に後段の materialize / dispatch を呼び出す。
- `GuideConversationUseCase` は raw user request や未保存の plan object から直接 dispatch せず、保存済み `Plan artifact` を境界として `PlanExecutionOrchestrator` 側へ渡す。
- `GuideConversationUseCase` は `plan_ready` を採用する時、`plan.project` を必須とする。focused project がある通常依頼では、それを `plan.project` の既定値として recovery してよい。
- `PlanExecutionOrchestrator` が LLM に依存する意味判断を行う場合、`activeGuideProfileId` から解決した Guide の model / `SOUL.md` / `ROLE.md` を使う。これを `GuideReasoningContext` として扱う。
- `GuideReasoningContext` を使う対象は、少なくとも `replan`, `outcome interpretation`, `user-facing progress summary` のような意味判断に限る。
- `dispatch`, `retry count`, `timeout`, `gate submit`, `state machine` は `GuideReasoningContext` に依存せず、Orchestrator core の責務に留める。
- `GuideConversationUseCase` は recurring / event-driven work を `plan.jobs[]` として返してよい。
- `PlanExecutionOrchestrator` は `Plan artifact` の `tasks[]` だけでなく `jobs[]` も materialize 対象とし、Task Board と Cron Board をそれぞれ更新する。
- Guide が新規 project 前提の依頼を受けた時は、model 呼び出し前に onboarding guard を評価し、Project タブへの案内 reply を返して Orchestrator を開始しない。
- focused project が存在しない work request も同様に onboarding guard を通し、task/job の materialize を開始しない。
- `PlanExecutionOrchestrator` が materialize する task/job record は `projectId / projectName / projectDirectory` を保持する。

### Plan Artifact
```ts
type PlanArtifact = {
  planId: string;
  createdAt: string;
  status: "pending_approval" | "approved" | "draft";
  replyText: string;
  planJson: string;
  sourceRunId?: string;
  approvedAt?: string;
};
```

### Task-centric Progress Log
- progress log は event log の一種だが、task/job を主キーに途中経過を追えることを最優先とする。
- 1 レコードは内部監査向けの actor と、ユーザー表示向けの actor/message を同時に持つ。
- 表示上は `Guide` を語り手として使ってよいが、内部では `actualActor=orchestrator` のような記録を必ず保持する。

```ts
type ProgressActualActor = "orchestrator" | "guide" | "worker" | "gate";
type ProgressDisplayActor = "Guide" | "Resident" | "Gate";

type TaskProgressLogEntry = {
  id: string;
  createdAt: string;
  planId?: string;
  targetType: "plan" | "task" | "job";
  targetId: string;
  actualActor: ProgressActualActor;
  displayActor: ProgressDisplayActor;
  actionType:
    | "dispatch"
    | "reroute"
    | "worker_runtime"
    | "to_gate"
    | "gate_review"
    | "replan_required"
    | "replanned"
    | "resubmit"
    | "plan_completed";
  status: "ok" | "pending" | "approved" | "rejected" | "blocked" | "completed" | "error";
  messageForUser: string;
  payloadJson: string;
  sourceRunId?: string;
};
```

### Repository / bridge
- `SqliteSettingsStore` は `plan_artifacts` table を持ち、`appendPlanArtifact`, `updatePlanArtifact`, `listPlanArtifacts`, `getLatestPlanArtifact` を提供する。
- `SqliteSettingsStore` は `task_progress_logs` table を持ち、`appendTaskProgressLogEntry`, `listTaskProgressLogEntries`, `getLatestTaskProgressLogEntry` を提供する。
- 保存先は既存 `settings.sqlite` とし、新しい DB ファイルは増やさない。
- Electron main は `plan-artifact:append`, `plan-artifact:list`, `plan-artifact:latest` IPC handler を公開し、preload は `TomoshibikanPlanArtifacts` bridge を expose する。
- Electron main は `progress-log:append`, `progress-log:list`, `progress-log:latest` IPC handler を公開し、preload は `TomoshibikanProgressLog` bridge を expose する。
- renderer は direct DB access を持たず、bridge が無い browser verify では in-memory fallback を使ってよい。

### Append points
- `Guide -> Plan -> Task materialize` の dispatch で `actualActor=orchestrator`, `displayActor=Guide`, `actionType=dispatch` を残す。
- worker runtime 完了/失敗時に `actualActor=worker`, `displayActor=Resident`, `actionType=worker_runtime` を残す。
- Gate 提出待ちへ移した時に `actualActor=orchestrator`, `displayActor=Guide`, `actionType=to_gate` を残す。
- Gate approve/reject 時に `actualActor=gate`, `displayActor=Gate`, `actionType=gate_review` を残す。
- Gate reject のうち進め方や前提の見直しが必要と判断した場合、続けて `actualActor=orchestrator`, `displayActor=Guide`, `actionType=replan_required`, `status=blocked` を残してよい。
- `replan_required` の後に Guide-driven replan が成功した場合、old target へ `actualActor=orchestrator`, `displayActor=Guide`, `actionType=replanned`, `status=ok` を残し、`previousPlanId`, `nextPlanId`, `createdCount` を payload に保持する。
- Guide-driven routing が `fallbackAction=reroute` を返した場合、dispatch 前に `actualActor=orchestrator`, `displayActor=Guide`, `actionType=reroute`, `status=ok` を残し、`fromWorkerId`, `workerId` を payload に保持する。
- resubmit と plan completion も同じ table に append し、task/job 単位の直近イベント列で追えるようにする。

### Progress query
- `WorkspaceQueryUseCase` は task/job 単位の `latest progress summary` と `recent progress entries` を返せるようにする。
- `GuideConversationUseCase` は、ユーザーが途中経過を尋ねた時に progress log を読んで自然文へ整形してよい。
- progress query は `task_id/job_id` が明示される場合だけでなく、「さっきお願いした件」のような最新依頼照会にも対応できるよう、`plan_id -> latest task/job` の補助解決を持ってよい。
- minimal 実装では renderer helper `guide-progress-flow.js` に `buildGuideProgressQueryReply()` を置き、progress query 判定・target 解決・簡易自然文生成を行う。
- progress query path は model 呼び出し前に処理し、追加の LLM 呼び出しなしで completion / pending / rejected / replan_required / in_progress / assigned を返す。
- `GuideConversationUseCase` は `plan_ready` を受けた時、直ちに dispatch せず `pending_approval` の `Plan artifact` を保存してよい。承認意図の短い返答を受けた時だけ `approved` に更新し、同一 `plan_id` の artifact を `PlanExecutionOrchestrator` へ渡す。
- `GuideConversationUseCase` は最新 `approved` artifact が既に materialize 済みである場合、同種の短い承認入力で新しい plan を作らず、既存 plan の進行案内 reply を返してよい。
- `PlanExecutionOrchestrator` の最小自動 execution loop は、その approval で生成された created task に限定して `dispatch -> worker_runtime -> to_gate -> gate_review -> done | rejected | replan_required` まで進める。
- `PlanExecutionOrchestrator` は Gate reject が `replan_required` を示す時、active Guide の runtime / `SOUL.md` を使って replan request を生成してよい。replan 成功時は new Plan artifact 保存 -> materialize -> old target に `replanned` append の順で橋渡しする。
- `PlanExecutionOrchestrator` は Guide-driven routing が `reroute` を返した時、baseline resident との差分を `reroute` として記録してから selected resident へ dispatch してよい。

### 表示責務
- `WorkspacePresenter` は内部の `actualActor` をそのまま前面表示せず、`displayActor + messageForUser` を通常表示の主材料にする。
- `Event Log` や将来の debug view では `actualActor` と `displayActor` の両方を出し分けられるようにする。
- `PlanExecutionOrchestrator` が内部で付与した progress comment も、通常 UX では Guide の進行メモとして見せてよい。
- `TaskDetailPresenter` は task detail 右列に `Guide / 住人 / 古参住人` の conversation-like timeline を描画してよい。内部的には progress log entry の列だが、通常 UX では住人同士のやり取りとして読めることを優先する。
- `TaskDetailPresenter` は `dispatch` を render する時、resident の固有名と task title/intent を使って「誰に」「何をお願いしたか」を明示する。
- `TaskDetailPresenter` は target の progress log に加えて同じ `plan_id` の `plan_completed` entry もマージし、右列の最後に管理人からの返却として読めるようにしてよい。
- `TaskDetailPresenter` の会話文生成は event code そのものを露出せず、`Progress Voice` と payload (`workerDisplayName`, `gateDisplayName`, `taskTitle`, `taskTitles`) から resident-facing な文へ整形する。
- resident trio の表示は `冬坂 / 久瀬 / 白峰` に固定する。役割の意味は表示レイヤーで増やさず、`ROLE.md` に `リサーチャー / プログラマ / ライター` として明記して判断材料に使う。
- resident routing の判断境界として、`冬坂` は外部調査・市場/競合/事例比較・利用者像整理を担い、`久瀬` は software/codebase の調査・再現・原因分析・修正・guard 追加・再発防止を担う。software 製品を題材にした外部サービス比較は `冬坂` の候補に残し、内部 codebase の不具合分析は `久瀬` を優先する。

### ROLE contract guidance
- built-in resident rollout では、`ROLE.md` を personality file として使わず、作業契約として扱う。
- `GuideConversationUseCase` は `plan_ready` 直前または `needs_clarification` の最終段階で `PlanPreview` を生成してよい。`PlanPreview` は `taskTitle`, `residentLabel`, `oneLineIntent`, `expectedOutput` を持ち、dispatch 前にユーザーが承認しやすい短文へ整形する。`residentLabel` は固有名を使う。
- `PlanExecutionOrchestrator` は dispatch 時に resident id と worker runtime を確定するが、ユーザー向けの説明は `PlanPreview` と progress voice を一次ソースとして扱う。
- `ROLE.md` の最小契約は次の 8 節とする。
  - `Mission`
  - `Primary Responsibilities`
  - `Inputs`
  - `Outputs`
  - `Done Criteria`
  - `Constraints`
  - `Hand-off Rules`
  - `Progress Voice`
  - `Progress Note Triggers`
- `Progress Voice` は `TaskDetailPresenter` が progress log を conversation-like timeline として見せる時の語り口の基準になる。
- `Progress Note Triggers` は `PlanExecutionOrchestrator` または各 UseCase が progress log を append する判断材料になる。
- `SOUL.md` が人格と気質を持ち、`ROLE.md` が task 入出力と hand-off 境界を固定する。この責務を混ぜない。



