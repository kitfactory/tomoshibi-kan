# delta-request

## Delta ID
- DR-20260304-agent-skill-reference-resolver

## 目的
- `skills.yaml` の `enabled_skill_ids` を Settings のインストール済み Skill 台帳へ解決し、Guide Context Builder に渡す skill context を runtime kind に応じて制御する。

## 変更対象（In Scope）
- Guide 送信経路で `PalpalAgentIdentity.load({ agentType: "guide" })` を参照し、`enabled_skill_ids` を取得する。
- `enabled_skill_ids` と `settingsState.registeredSkills` を突合する resolver を追加する。
- `runtimeKind="tool"` の場合は skill context を空にする制御を維持する。
- resolver の unit test を追加し、既存テストを更新する。

## 非対象（Out of Scope）
- Pal/Gate/Worker 全ロールへの identity 読み取り接続。
- Settings UI で `skills.yaml` を直接編集する機能。
- Context Builder の token 予算アルゴリズム変更。

## 差分仕様
- DS-01:
  - Given: `enabled_skill_ids` に複数 skill id が設定されている
  - When: Guide の context build を実行する
  - Then: インストール済み skill に絞った summary のみが builder へ渡る
- DS-02:
  - Given: Guide runtime が `tool`
  - When: context build を実行する
  - Then: skill summary は注入されない
- DS-03:
  - Given: identity ファイルが未配置
  - When: Guide が context build する
  - Then: 既存の Pal profile skill 設定へフォールバックする

## 受入条件（Acceptance Criteria）
- AC-01: skill resolver の unit test が追加され、`model/tool` 分岐と installed filtering を検証できる。
- AC-02: Guide context build が identity API を参照し、`enabled_skill_ids` を installed skills に解決した結果を使用する。
- AC-03: `npm run test:unit` と `npm run test:e2e -- --reporter=list` が PASS する。

## 制約
- Guide 経路の最小差分に限定し、他ロール挙動を変更しない。
- 既存の `runtimeKind=tool` の skill 非注入ルールを壊さない。

## 未確定事項
- Q-01: Gate/Worker 経路へ同 resolver を展開するタイミング。

# delta-apply

## Delta ID
- DR-20260304-agent-skill-reference-resolver

## 実行ステータス
- APPLIED

## 変更ファイル
- runtime/agent-identity-store.js
- wireframe/agent-skill-resolver.js
- wireframe/app.js
- wireframe/index.html
- tests/unit/agent-identity-store.test.js
- tests/unit/agent-skill-resolver.test.js
- package.json
- docs/plan.md
- docs/delta/DR-20260304-agent-skill-reference-resolver.md

## 適用内容（AC対応）
- AC-01:
  - 変更: `wireframe/agent-skill-resolver.js` と `tests/unit/agent-skill-resolver.test.js` を追加し、installed filtering / runtime分岐を検証。
  - 根拠: `resolveEffectiveSkillIds` と `resolveSkillSummariesForContext` を unit test で確認。
- AC-02:
  - 変更: `wireframe/app.js` の Guide context build を async 化し、identity API + resolver を経由して skill summaries を生成。
  - 根拠: `resolveGuideConfiguredSkillIds` と `buildGuideContextWithFallback` が `enabled_skill_ids` を使用。
- AC-03:
  - 変更: `package.json` の unit test 対象へ新規 test を追加し、unit/e2e を実行。
  - 根拠: `npm run test:unit` と `npm run test:e2e -- --reporter=list` の PASS。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- identity 未配置時のフォールバックが有効であること。
- tool runtime で skill summary が空になること。

# delta-verify

## Delta ID
- DR-20260304-agent-skill-reference-resolver

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | `tests/unit/agent-skill-resolver.test.js` 追加、`npm run test:unit` で PASS |
| AC-02 | PASS | `wireframe/app.js` で identity + installed skill resolver に接続 |
| AC-03 | PASS | `npm run test:unit` => 51 passed、`npm run test:e2e -- --reporter=list` => 87 passed / 1 skipped |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容: なし

## 不整合/回帰リスク
- R-01: identity 設定編集UIが未実装のため、現状は file 手動配置または API 呼び出しが前提。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260304-agent-skill-reference-resolver

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Guide context の skill 解決を `skills.yaml` + Settings installed skills 基準へ接続した。
- 変更対象: resolver追加、Guide context build 接続、関連unit test。
- 非対象: 他ロール展開、UI編集導線、budgetロジック変更。

## 実装記録
- 変更ファイル:
  - runtime/agent-identity-store.js
  - wireframe/agent-skill-resolver.js
  - wireframe/app.js
  - wireframe/index.html
  - tests/unit/agent-identity-store.test.js
  - tests/unit/agent-skill-resolver.test.js
  - package.json
  - docs/plan.md
  - docs/delta/DR-20260304-agent-skill-reference-resolver.md
- AC達成状況:
  - AC-01: 達成
  - AC-02: 達成
  - AC-03: 達成

## 検証記録
- verify要約: unit/e2e と delta link 整合を確認して PASS。
- 主要な根拠: `npm run test:unit` / `npm run test:e2e -- --reporter=list` / `node scripts/validate_delta_links.js --dir .`

## 未解決事項
- あり
  - Gate/Worker 経路への同 resolver 展開は次 delta へ継続。

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: Guide 計画/アサイン判断に使う Agent 要約 DTO（role/runtime/skills）を定義し、Guide 経路へ接続する。
