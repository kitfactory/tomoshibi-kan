# delta-request

## Delta ID
- DR-20260308-resident-variation-real-observation

## Delta Type
- FEATURE

## 目的
- real-model 条件で、`調べる人` 主体、`作り手` 主体、`書く人` 主体の依頼がどのように resident trio へ収束するかを観測し、次の改善点を明確にする。

## 変更対象（In Scope）
- 対象1:
  - resident variation の real-model 観測実施
- 対象2:
  - 観測結果の delta 記録
- 対象3:
  - `docs/plan.md`

## 非対象（Out of Scope）
- 非対象1:
  - Guide prompt / few-shot / parser の変更
- 非対象2:
  - resident `SOUL.md / ROLE.md / RUBRIC.md` の変更
- 非対象3:
  - Orchestrator / routing / progress log / UI の変更
- 非対象4:
  - 新しい runner や test code の追加

## 差分仕様
- DS-01:
  - Given:
    - assist OFF の Guide と real-model runtime
  - When:
    - `調べる人` 主体の依頼を与える
  - Then:
    - `plan_ready` 到達可否、materialize された task、resident 割当を観測できる
- DS-02:
  - Given:
    - assist OFF の Guide と real-model runtime
  - When:
    - `作り手` 主体 / `書く人` 主体の依頼を与える
  - Then:
    - それぞれについて同様に観測できる

## 受入条件（Acceptance Criteria）
- AC-01:
  - `調べる人` 主体、`作り手` 主体、`書く人` 主体の 3 ケースについて real-model 観測結果が残っている
- AC-02:
  - 各ケースで `conversation / needs_clarification / plan_ready`、task materialization、resident 割当の所見が delta にまとめられている
- AC-03:
  - `docs/plan.md` に archive 記録が残る
- AC-04:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - assist OFF を維持する
- 制約2:
  - 観測で留め、挙動修正はこの delta に含めない
- 制約3:
  - resident trio 前提を維持する

## Review Gate
- required: No
- reason:
  - 観測中心であり、機能追加や設計境界変更を含まない

## 未確定事項
- Q-01:
  - 3 ケースのうち、どこまで 1 resident 主体に寄るかは実際の model 出力に依存する

# delta-apply

## Delta ID
- DR-20260308-resident-variation-real-observation

## Delta Type
- FEATURE

## 実行ステータス
- APPLIED

## 実施内容
- assist OFF の real-model 条件で、次の 3 ケースを既存 runner で観測した。
  - `調べる人` 主体
  - `作り手` 主体
  - `書く人` 主体
- 変更は観測記録と `docs/plan.md` の更新に限定した。

## 実行コマンド
```powershell
node scripts/run_guide_autonomous_check.js --turn-timeout-ms 240000 --prompt "最近このアプリの使い心地どう思う？" --prompt "設定保存で何が起きているのか、まず調べたい。どこを見ればいい？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。まずは調べる人を中心に、必要なら他の住人にもつなぐ形で進めたい。"

node scripts/run_guide_autonomous_check.js --turn-timeout-ms 240000 --prompt "最近このアプリの使い心地どう思う？" --prompt "保存まわりの違和感を、最小修正で直す前提で考えたい。まず何を見ればいい？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。まずは作り手を中心に、必要な調査と確認を最小限つける形で進めたい。"

node scripts/run_guide_autonomous_check.js --turn-timeout-ms 240000 --prompt "最近このアプリの使い心地どう思う？" --prompt "保存まわりの問題を、利用者に伝える説明や整理まで含めて考えたい。まず何を見ればいい？" --prompt "Settingsタブの保存ボタンが押せるのに保存が反映されない。再現手順は Settings を開いて model を追加し Save を押して reload、期待結果は reload 後も model が残ること。まずは書く人を中心に、状況整理と返却文まで意識して進めたい。"
```

# delta-verify

## 観測結果

### 1. 調べる人 主体
- turn 1: `conversation`
- turn 2: 3案提示 + 推薦
- turn 3: `plan_ready` には到達せず、追加の観測材料を求める follow-up に戻った
- task materialization: なし (`3 -> 3`)
- 所見:
  - 調査中心の依頼は理解できるが、`ログや Console 出力が欲しい` 方向へ倒れやすい
  - `まず調べる人から始める` という resident 指向だけでは `plan_ready` を押し切れていない

### 2. 作り手 主体
- turn 1: `conversation`
- turn 2: 3案提示 + 推薦
- turn 3: `plan_ready` には到達せず、`作り手向けに整理しましょう` で止まった
- task materialization: なし (`3 -> 3`)
- 所見:
  - 修正中心の intent は拾えている
  - ただし resident へ task を切る前に、整理メッセージで収束が止まりやすい

### 3. 書く人 主体
- turn 1: `conversation`
- turn 2: 3案提示 + 推薦
- turn 3: local の progress query 判定に衝突し、`まだ進捗記録がありません` を返した
- task materialization: なし (`3 -> 3`)
- 所見:
  - `書く人` 主体の意図自体は理解できるが、進捗問い合わせと誤判定される経路がある
  - これは resident 指向の問題に加えて、progress query trigger が広すぎる問題でもある

## 受入条件の判定
- AC-01: PASS
- AC-02: PASS
- AC-03: PASS
- AC-04: PASS

## verify 実行
```powershell
node scripts/validate_delta_links.js --dir .
```

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-resident-variation-real-observation

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 結論
- resident trio 全体の基本収束は前進しているが、1 resident 主体の依頼はまだ弱い
- `調べる人` 主体と `作り手` 主体は `plan_ready` 直前で止まりやすい
- `書く人` 主体は progress query 誤判定が先に解消対象

## 次段への示唆
- `調べる人 / 作り手 / 書く人` 主体の resident-specific few-shot を追加する価値がある
- `Guide` の resident 主体依頼は、finalization summary から直接 `plan_ready` へ進む条件をもう一段強める余地がある
- progress query trigger は `書く人` 系の通常依頼を誤捕捉しないように狭めるべき
