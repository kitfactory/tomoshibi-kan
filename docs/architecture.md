# アーキテクチャ

入口は `docs/OVERVIEW.md`。  
本書は「ユーザーI/Fはプロトタイプ準拠、内部設計は将来実装方針を正」とする前提で、`Guide -> Pal -> Gate` と `Job`、`Settings` を含む最小設計を定義する。

## 1. 設計原則
- 実行主体は常に UseCase（Interactor）とする。
- `Guide/Pal/Gate` は役割であり、実行主体ではない。
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
- `PalProfileUseCase`（Pal名/Role/Runtime/Skillの保存）
- `WorkspaceQueryUseCase`（Tab表示向けデータ取得）

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
- `PalpalCoreGateJudgeAdapter`
- `LlmRuntimeAdapter`
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
  status: WorkStatus;
};

type Job = {
  id: string;
  title: string;
  schedule: string;
  instruction: string;
  palId: string;
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

type ModelConfig = {
  name: string;
  provider: string;
  apiKey: string;
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
  reasons: string[];
  fixCondition: string;
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

## 5. 主要フローとUseCase対応
1. 相談受付/Plan提示: `GuideConversationUseCase`
2. Task配布: `GuideDispatchUseCase`
3. Task実行/提出: `PalWorkUseCase`
4. Task/Job判定: `GateReviewUseCase`
5. Task再提出: `PalResubmitUseCase`
6. Job運用: `JobLifecycleUseCase`
7. 完了通知: `GuideCompletionUseCase`
8. 設定管理（Model/CLI/Pal）: `RuntimeConfigUseCase` + `PalProfileUseCase`
9. Skill管理（ClawHub導線）: `SkillCatalogUseCase`
10. 画面表示: `WorkspaceQueryUseCase`

## 6. プロトタイプ対応方針
- Tab構成（Guide/Pal/Job/Task/Event/Settings）は現行プロトタイプをI/F基準として維持する。
- 将来実装では、Rendererの状態更新をPresenter経由に集約し、UseCase直接依存を排除する。
- 現在のClawHub導線は擬似Downloadだが、`SkillCatalogPort` を介して本実装へ差し替え可能にする。

## 7. 設計ガード（禁止事項）
- UseCaseからSQLiteやElectron APIを直接呼ばない。
- Domainに外部I/O依存を持ち込まない。
- `runtimeKind="tool"` のPalにSkillを保存しない。
- 未登録Model/CLI参照のPal設定保存を許可しない。
- `details/meta` に未定義キーを無制限に入れない（キー集合は仕様で管理する）。
