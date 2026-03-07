# delta-request

## Delta ID
- DR-20260307-guide-controller-assist-default-off

## 目的
- controller assist は暫定安定化策であり、標準では無効にしておきたい。Guide はまず素の対話/計画能力で動かし、必要な時だけ Settings から assist を有効化できるようにする。

## In Scope
- `guideControllerAssistEnabled` setting を追加し、既定値を `false` にする
- Settings に checkbox を追加し、保存・reload 後も状態を保持する
- Guide runtime / parser cue への `planningIntent / planningReadiness` 注入を setting で gated する
- unit / E2E を追加または更新する
- `docs/plan.md` に seed/archive を反映する

## Out of Scope
- assist ロジック自体の削除
- parser repair の変更
- Guide prompt / structured output 方針の再設計
- spec / architecture の大きな更新

## Acceptance Criteria
- AC-01: 新規状態では `guideControllerAssistEnabled=false` で保存・読込される
- AC-02: Settings checkbox を ON/OFF して保存すると reload 後も状態が保持される
- AC-03: assist OFF のとき Guide runtime payload の `planningIntent / planningReadiness` は `none` になる
- AC-04: assist ON のとき明示的な breakdown 入力で `planningIntent / planningReadiness` が cue を持つ
- AC-05: 関連 unit/E2E と `node scripts/validate_delta_links.js --dir .` が PASS する

# delta-apply

## Delta ID
- DR-20260307-guide-controller-assist-default-off

## ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- wireframe/settings-persistence.js
- tests/unit/settings-persistence.test.js
- tests/e2e/workspace-layout.spec.js
- docs/spec.md
- docs/architecture.md
- docs/plan.md

## 適用内容
- workspace setting `guideControllerAssistEnabled` を追加し、既定値を `false` にした
- Settings の `Execution Loop` section に `Guide controller assist` checkbox を追加し、保存・reload 後も保持できるようにした
- Guide runtime と parser cue 注入は setting が ON の時だけ `planningIntent / planningReadiness` を使うように gated した
- unit/E2E を追加し、標準OFFと明示ONの挙動を固定した

# delta-verify

## Delta ID
- DR-20260307-guide-controller-assist-default-off

## 検証結果
| AC | 状態 | 補足 |
|---|---|---|
| AC-01 | PASS | unit で未指定時 `guideControllerAssistEnabled=false` を確認した |
| AC-02 | PASS | Settings checkbox を保存後 reload して checked が維持されることを E2E で確認した |
| AC-03 | PASS | assist OFF 時の `window.__lastGuideChatInput.debugMeta.planningIntent / planningReadiness` が `none` になることを E2E で確認した |
| AC-04 | PASS | assist ON 時に `explicit_breakdown / debug_repro_ready` が payload に乗ることを E2E で確認した |
| AC-05 | PASS | unit/E2E と delta link validation が PASS した |

## 主な確認コマンド
- `node --check wireframe/app.js`
- `node --check wireframe/settings-persistence.js`
- `node --test tests/unit/settings-persistence.test.js`
- `npx playwright test tests/e2e/workspace-layout.spec.js -g "guide controller assist is off by default and can be enabled in settings|settings context handoff policy persists and shapes worker payload"`
- `node scripts/validate_delta_links.js --dir .`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-guide-controller-assist-default-off

## クローズ状態
- verify 状態: PASS
- archive 可否: 可

archive status: PASS

## 要約
- controller assist を標準では無効化し、Settings checkbox で明示ONした時だけ Guide planning cue を注入するようにした

## 次の delta への引き継ぎ
- Seed-01: assist を ON にした時にどこまで効果があるかを autonomous check で再比較する
