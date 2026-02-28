# アーキテクチャ

入口は `docs/OVERVIEW.md`。本書は MVP の `Guide -> Pal -> Gate` フローを、クリーンアーキテクチャで最小構成に固定する。

## 1. 設計原則
- 実行主体は常に UseCase クラス（Interactor）とする。
- `Guide/Pal/Gate` は UseCase 内で利用する役割であり、実行主体ではない。
- Domain には最小属性の業務データのみ置く。
- 依存方向は原則 `Infrastructure -> Interface Adapter -> UseCase -> Domain` のみ許可する。
- DB/IPC の直接呼び出しは UseCase に書かない（Repository/Adapter経由）。
- MVPでは LLM判定（計画化、承認解釈、Pal割当、Pal実行、差し戻し再提出）と `palpal-core` 判定は UseCase から直接呼ぶ（LLM/Gate用Portは設けない）。
- 上記の直接呼びは本プロジェクトのMVP例外ルールとし、依存逆流扱いにしない。
- ただし DB/IPC/UI 依存は UseCase に持ち込まない。

## 2. レイヤー階層とクラス配置
### 2.1 Domain 層
責務:
- 業務データ定義
- 状態遷移の不変条件

クラス/型:
- `Plan`
- `Task`
- `Pal`
- `CompletionRitual`
- `GateResult`
- `Event`
- `UserMessage`
- `GuideMessage`
- `PlanStatus`, `TaskStatus`, `Decision`

### 2.2 UseCase 層
責務:
- ユースケース単位の手順制御
- 保存/安全判定は Port 経由、LLM判定と `palpal-core` 判定は UseCase から直接呼ぶ

クラス:
- `GuideConversationUseCase`（相談受付、Plan生成、ユーザー応答を受けた承認/却下）
- `GuideDispatchUseCase`（承認PlanをTaskへ分解しPalへ割当）
- `PalWorkUseCase`（Task実行、Ritual作成、Gate提出）
- `GateReviewUseCase`（Approve/Reject判定）
- `PalResubmitUseCase`（差し戻し理由を反映した再提出）
- `GuideCompletionUseCase`（最終完了通知）

重要:
- UseCase が実行主体である。
- `Guide/Pal/Gate` の差分は UseCase 内の判定ロジック（LLM呼び出しを含む）で吸収する。

### 2.3 Interface Adapter 層
責務:
- UI/IPC 入出力を UseCase 入出力に変換
- Domain オブジェクトを表示 DTO へ整形

クラス:
- `AppController`
- `WorkspacePresenter`

### 2.4 Infrastructure 層
責務:
- DB 永続化実装
- palpal-core / LLM ランタイム実装（UseCaseから直接利用）
- Electron IPC 配線

クラス:
- `SqliteWorkflowRepository`
- `LlmRuntime`
- `PalpalCoreGateJudge`
- `ElectronIpcRouter`
- `GuideGateProfileLoader`（起動時にGuide/Gateの設定を読み込む）

## 3. 最小データクラス
命名整合:
- Domainでは `Plan` / `Task` を正規名とする。
- UI表示では `Plan Card` / `Task Card` を使用してよい（同一概念）。

```ts
type PlanStatus = "proposed" | "approved" | "rejected" | "completed";
type TaskStatus = "assigned" | "in_progress" | "to_gate" | "rejected" | "done";
type Decision = "approved" | "rejected";

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
  status: TaskStatus;
};

type Pal = {
  id: string;
  persona: string;
  skills: string[];
  constraints: string[];
};

type CompletionRitual = {
  id: string;
  taskId: string;
  evidence: string;
  replay: string;
};

type GateResult = {
  id: string;
  taskId: string;
  decision: Decision;
  reasons: string[];
  fixCondition: string;
};

type Event = {
  id: string;
  eventType: string;
  targetId: string;
  timestamp: number;
};

type UserMessage = {
  id: string;
  text: string;
};

type GuideMessage = {
  id: string;
  text: string;
};
```

## 4. UseCase Port（Interface）
```ts
interface WorkflowRepository {
  findPlanById(id: string): Promise<Plan | null>;
  savePlan(plan: Plan): Promise<void>;

  findTaskById(id: string): Promise<Task | null>;
  listTasksByPlan(planId: string): Promise<Task[]>;
  saveTask(task: Task): Promise<void>;

  findPalById(id: string): Promise<Pal | null>;
  listPals(): Promise<Pal[]>;

  findRitualByTaskId(taskId: string): Promise<CompletionRitual | null>;
  saveRitual(ritual: CompletionRitual): Promise<void>;

  findGateResultByTaskId(taskId: string): Promise<GateResult | null>;
  saveGateResult(result: GateResult): Promise<void>;

  appendEvent(event: Event): Promise<void>;
  listEventsByTarget(targetId: string): Promise<Event[]>;

  saveUserMessage(msg: UserMessage): Promise<void>;
  saveGuideMessage(msg: GuideMessage): Promise<void>;
}

interface SafetyCheckPort {
  canExecute(pal: Pal, requestedAction: string): boolean;
}
```

## 5. フローとUseCaseの対応
1. ユーザー相談:
`GuideConversationUseCase` が LLM を直接呼んで Plan を作成し、`WorkflowRepository` へ `Plan(proposed)` と `GuideMessage` を保存する。
2. 承認/却下:
`GuideConversationUseCase` がユーザー応答を受け、LLM判定で `approved/rejected` を確定して `Plan` 更新する。
3. 承認後配布:
`GuideDispatchUseCase` が `WorkflowRepository.listPals` でPal候補を取得し、LLM判定で `Task.palId` を決定して `assigned` 保存する。
4. Pal実行:
`PalWorkUseCase` が `WorkflowRepository.findPalById(task.palId) + SafetyCheckPort` で事前チェックし、LLM実行結果を `CompletionRitual` として保存して `to_gate` へ遷移する。
5. Gate判定:
`GateReviewUseCase` が LLM と `palpal-core` 判定結果を直接参照して `GateResult` 保存。`approved` なら `done`、`rejected` なら差し戻し。
6. 再提出:
`PalResubmitUseCase` が `WorkflowRepository.findGateResultByTaskId` で差し戻し理由を取得し、LLMで `CompletionRitual` を再作成して `to_gate` に戻す。
7. 最終通知:
`GuideCompletionUseCase` が全 `Task` 完了を確認し `Plan.completed` と完了通知 `GuideMessage/Event` を記録する。

## 6. 禁止事項（設計ガード）
- UseCase から SQLite API を直接呼ばない。
- Domain から `Date.now` や `Math.random` を直接呼ばない（必要なら Port 経由）。
- `Pal` を実行主体として直接実行しない（必ずUseCase経由）。
- UI DTO に Domain オブジェクトをそのまま露出しない。
