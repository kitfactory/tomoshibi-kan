# self_improvement.md

## 1. 目的

この文書は、LLM の入出力ログから改善を回す仕組みについての調査結果を整理し、`palpal-hive` に適用するための軽量な設計案をまとめる。

狙いは次の 3 点に絞る。

- 外部 SaaS に強く依存せず、ローカル中心で回せること
- 実装コストを抑えつつ、改善効果が見えること
- `prompt` だけでなく、`SOUL.md` / `ROLE.md` / `RUBRIC.md` / runtime loop / tool-call 挙動まで含めて改善対象にできること

## 2. エグゼクティブサマリ

プロンプト自己改善の分野は、すでに「良い一文を自動生成する」段階を超えている。現在の中心は、`観測 -> 評価 -> 問題の切り出し -> 改善提案 -> 再評価` というループをどう設計するかである。

`palpal-hive` においても、改善対象を単なる system prompt 文字列として扱うのは不適切である。実際の挙動は、少なくとも以下の合成結果として現れる。

- runtime 側の system prompt
- Agent Identity (`SOUL.md`, `ROLE.md`, `RUBRIC.md`)
- Context Builder が注入する文脈
- tool-call loop と fallback 制御
- Workspace 内のファイル状況や skill 有効化状態

このため、導入すべき仕組みは「自動 prompt 最適化器」ではなく、まずは `実行記録と失敗分析の基盤` である。

最初の実装は次の構成が最も軽く、かつ効果が高い。

1. `guide:chat` / `pal:chat` の実行を `.palpal/logs` に JSONL で記録する
2. ログから失敗パターンを抽出する
3. パターンごとに、どこを直すべきかを Markdown レポート化する
4. 自動書き換えは行わず、人が `SOUL.md` / `ROLE.md` / `RUBRIC.md` / runtime prompt を更新する
5. 更新後に再度ログを比較して、改善があったかを見る

## 3. 調査結果

### 3.1 自己改善研究の流れ

主要な流れは次の通りである。

- 2023: `Self-Refine` など、同一 LLM に自己批評させて改善する流れ
- 2023-2024: `ProTeGi`, `OPRO`, `Promptbreeder` など、探索・進化・最適化として prompt を扱う流れ
- 2024-2025: `PromptWizard`, `DSPy` など、prompt 単体ではなく examples や LM program 全体を最適化する流れ
- 2025-2026: `Braintrust`, `LangSmith`, `Phoenix` など、本番 trace から評価と改善ループを回す流れ

ここから読み取れる重要点は 2 つある。

- いま有効なのは、単発の self-reflection より、評価付き反復ループである
- 改善対象は prompt 単体ではなく、workflow 全体へ広がっている

### 3.2 現在の課題

調査から見える主要課題は以下である。

#### 1. 評価が難しい

自己改善は「何を良いとみなすか」が曖昧だと破綻する。LLM judge も使えるが、評価器自体の癖に最適化してしまう危険がある。

#### 2. 一般化が弱い

あるベンチマークで改善した prompt が、別タスクや本番会話で有効とは限らない。特に multi-turn、tool use、file-read を含む実運用では乖離が大きい。

#### 3. コストが高い

自動最適化は候補生成と再評価を何度も回すため、API コストも時間も増える。

#### 4. prompt だけ直しても足りない

実運用上の失敗は、prompt wording ではなく、context 注入不足、tool loop 制御不足、identity 文書の曖昧さ、fallback 設計不足で起きることが多い。

### 3.3 `palpal-hive` に対する含意

`palpal-hive` の現在構造では、改善対象を次の 4 層に分けるのが自然である。

- `Runtime layer`
  - `GUIDE_SYSTEM_PROMPT`
  - tool loop 制御
  - fallback 応答
- `Identity layer`
  - `SOUL.md`
  - `ROLE.md`
  - `RUBRIC.md`
- `Context layer`
  - Context Builder が何を注入したか
- `Interaction layer`
  - user input の曖昧さ
  - task/job 状態
  - tool-call の失敗状況

ここから分かるのは、「prompt optimizer を入れる」より、「各失敗がどの層の問題かを切り分ける」方が先だということである。

## 4. `palpal-hive` の現状と導入余地

現状の観測では、導入ポイントはかなり明確である。

- Electron IPC の LLM 入口は `guide:chat` / `pal:chat`
- 実行本体は `runtime/palpal-core-runtime.js`
- Workspace 内に `.palpal/logs` を置く前提が既にある
- Agent Identity は `SOUL.md` / `ROLE.md` / `RUBRIC.md` としてローカルファイル化されている
- tool loop には `loopStopReason` と `loopTrace` が既にある

これは非常に良い条件で、重い observability 基盤を入れなくても first slice を作れる。

## 5. 採用すべき設計方針

### 5.1 基本方針

- まずは `ローカル完結` を優先する
- `自動書き換え` より `分析と提案` を先に入れる
- 失敗分析は `prompt 単体` ではなく `runtime/identity/context/tool-loop` のどこに原因があるかで分類する
- 評価は大きく始めず、最初は決定論的ルールを中心にする
- 高価な LLM judge は「悪い事例の要約」に限定する

### 5.2 採用しない方がよいもの

first slice では次は避ける。

- 外部 SaaS 依存の常時トレース基盤
- 全会話に対する高価な LLM judge
- prompt の自動更新
- 初期段階からの複雑な評価 DB スキーマ

## 6. 推奨アーキテクチャ

### 6.1 First Slice

#### A. 実行ログ記録

`guide:chat` / `pal:chat` 実行ごとに、1 レコードを JSONL へ追記する。

保存先:

- `<ws-root>/.palpal/logs/llm-runs.jsonl`

最低限の記録項目:

- `timestamp`
- `agentRole` (`guide` / `worker` / `gate`)
- `agentName`
- `provider`
- `modelName`
- `workspaceRoot`
- `systemPrompt`
- `userText`
- `responseText`
- `toolCalls`
- `loopStopReason`
- `loopTrace`
- `error`
- `targetKind` (`task` / `job` / `guide-chat` など)
- `targetId`
- `enabledSkillIds`

目的は完全な observability ではなく、失敗原因の切り分けに足るだけの材料を残すこと。

#### B. ログ分析スクリプト

別スクリプトで JSONL を読み、失敗パターンを集計する。

候補例:

- `repeated_plan` 多発
- `repeated_file_read_not_found` 多発
- `max_turns` 停止
- `runtime_error`
- `toolCalls` が多いのに結果が薄い
- `responseText` が短すぎる
- 同種の質問に対して回答品質がばらつく

出力:

- `<ws-root>/.palpal/logs/self-improvement-report.md`

#### C. 改善提案生成

レポートでは、問題を次のどこに属するかで分類する。

- `runtime prompt issue`
- `identity issue`
- `context issue`
- `tool-loop issue`
- `user-input ambiguity`

この分類により、修正対象を具体化する。

- runtime prompt issue -> `GUIDE_SYSTEM_PROMPT` や runtime 指示を直す
- identity issue -> `SOUL.md`, `ROLE.md`, `RUBRIC.md` を直す
- context issue -> Context Builder の注入順や source を見直す
- tool-loop issue -> stop rule, fallback, search/read 方針を直す

### 6.2 Second Slice

first slice が回った後で、必要なら次を追加する。

- thumbs up/down の軽量フィードバック
- Task/Gate 結果を会話ログに紐づける
- 悪いセッションだけ LLM に要約させる
- `改善案 -> 修正候補 -> 検証項目` の自動ドラフト生成

## 7. ログスキーマ案

```json
{
  "timestamp": "2026-03-06T14:00:00.000Z",
  "agentRole": "guide",
  "agentName": "guide-core",
  "provider": "lmstudio",
  "modelName": "openai/gpt-oss-20b",
  "workspaceRoot": "C:/Users/kitad/palpal-hive",
  "systemPrompt": "You are Guide...",
  "userText": "README を見て次のタスクを提案して",
  "responseText": "README を確認し、次の作業として...",
  "enabledSkillIds": ["codex-file-read", "codex-file-search"],
  "toolCalls": [
    {
      "tool_name": "codex-file-read",
      "args": { "path": "README.md" },
      "output": { "ok": true }
    }
  ],
  "loopStopReason": "completed",
  "loopTrace": [
    { "turn": 1, "plannedTools": ["codex-file-read"], "executedCount": 0 }
  ],
  "targetKind": "guide-chat",
  "targetId": "guide-session-001",
  "error": ""
}
```

## 8. 分析ルール案

### 8.1 まず決定論的に判定する

最初は LLM judge に頼りすぎない。最低限、以下はルールベースで取れる。

- stop reason の分布
- ツール失敗率
- not-found 再発率
- tool call 回数の偏り
- 同一 agent / model 組み合わせでの失敗集中

### 8.2 その後に LLM で要約する

LLM は全件採点ではなく、以下に限定して使う。

- 失敗率が高いクラスタの代表例の要約
- 問題パターンの自然言語ラベル付け
- 改善候補の下書き

### 8.3 評価の観点

最低限、以下の観点を持つ。

- `instruction following`
- `tool use appropriateness`
- `trace convergence`
- `error recovery`
- `evidence quality`
- `conciseness`

ただし first slice では、完全なスコアリングより、失敗の見える化を優先する。

## 9. 改善提案レポートの形

改善レポートは次の形が望ましい。

### 9.1 Summary

- 期間
- 総実行数
- 主要 stop reason
- 失敗率上位の agent/model

### 9.2 Pattern Findings

- 発生パターン
- 代表ログ
- 原因仮説
- 影響範囲

### 9.3 Improvement Proposals

各提案について以下を出す。

- `Problem`
- `Likely layer`
- `Suggested change`
- `Target file or component`
- `Expected effect`
- `How to validate`

例:

- Problem: `repeated_file_read_not_found` が Guide で頻発
- Likely layer: `tool-loop issue`
- Suggested change: file-search fallback を先行させ、read 失敗後の再読を抑止する
- Target file or component: `runtime/palpal-core-runtime.js`
- Expected effect: max turn 到達前の収束率改善
- How to validate: 失敗再現テストとログ比較

## 10. `palpal-hive` で最初に直すべき単位

改善対象は、最初から広げすぎない方がよい。

優先順位は以下を推奨する。

1. runtime loop
- 収束失敗は再発しやすく、ログで見つけやすい

2. Guide の system prompt
- 全体挙動への影響が大きい

3. `SOUL.md` / `ROLE.md`
- agent の振る舞い方針を調整しやすい

4. `RUBRIC.md`
- Gate の判定品質と reject 理由に効く

5. Context Builder
- 効果は大きいが、原因切り分けが難しいため first slice では後回し

## 11. 実装ステップ案

### Step 1

- `runtime/llm-improvement-log.js` を追加する
- `guide:chat` / `pal:chat` の成功・失敗を JSONL へ保存する
- 単体テストを追加する

### Step 2

- `scripts/analyze_llm_logs.js` を追加する
- ログから stop reason と tool failure を集計する
- Markdown レポートを出力する

### Step 3

- 代表失敗だけを LLM 要約するオプションを追加する
- 改善提案を `runtime` / `identity` / `context` / `loop` に分類する

### Step 4

- レポートを見て人が修正する
- 修正前後で同じ指標を比較する

## 12. 今後の拡張

将来的には次を検討できる。

- Event Log との統合
- thumbs up/down の手動フィードバック
- Task/Gate 判定との関連付け
- 悪いセッションの dataset 化
- 外部 observability 基盤との接続

ただし、first slice の成功条件は「改善のための意思決定ができること」であって、「完全な評価基盤を作ること」ではない。

## 13. 最終提案

`palpal-hive` に今必要なのは、自動 prompt optimizer ではない。必要なのは、以下の軽量ループである。

1. 実行を記録する
2. 失敗パターンを見つける
3. 問題層を切り分ける
4. 人が `runtime prompt` / `SOUL` / `ROLE` / `RUBRIC` を更新する
5. 再度ログで効果を見る

この設計は軽く、現行の `palpal-hive` アーキテクチャに素直に乗り、将来 Braintrust や LangSmith のような外部基盤へ接続する場合にも無駄になりにくい。

## 14. 参考ソース

- Self-Refine: https://selfrefine.info/
- ProTeGi: https://www.microsoft.com/en-us/research/publication/automatic-prompt-optimization-with-gradient-descent-and-beam-search/
- OPRO: https://github.com/google-deepmind/opro
- Promptbreeder: https://openreview.net/forum?id=9ZxnPZGmPU
- PromptWizard: https://github.com/microsoft/PromptWizard
- DSPy: https://dspy.ai/
- DLPO: https://aclanthology.org/2025.findings-emnlp.441/
- Revisiting OPRO: https://aclanthology.org/2024.findings-acl.100/
- Braintrust Observe: https://www.braintrust.dev/docs/observe
- Braintrust Loop: https://www.braintrust.dev/docs/core/loop
- LangSmith Polly: https://docs.langchain.com/langsmith/polly
- LangSmith Insights: https://docs.langchain.com/langsmith/insights
- CRITIC: https://openreview.net/forum?id=WSrRF5Wy6v
