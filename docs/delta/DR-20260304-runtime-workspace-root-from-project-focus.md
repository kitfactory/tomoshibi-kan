# delta-request

## Delta ID
- DR-20260304-runtime-workspace-root-from-project-focus

## 目的
- `codex-file-read` / `codex-file-search` が workspace root 不一致で失敗する問題を解消し、Guide/Pal runtime が現在フォーカス中プロジェクト配下を読めるようにする。

## 変更対象（In Scope）
- `wireframe/app.js` の Guide 実行・Pal 実行 payload に `workspaceRoot` を追加する（Project focus の directory を優先）。
- `electron-main.js` で renderer から受け取る `workspaceRoot` を安全に正規化・検証し、runtime へ渡す。
- 不正/未存在パス時は既存の `workspacePaths.wsRoot` へフォールバックする。

## 非対象（Out of Scope）
- 複数プロジェクトを跨ぐ自動ルーティング。
- Taskごとの project 紐づけデータモデル追加。
- ファイルアクセス権限モデルの刷新。

## 差分仕様
- DS-01:
  - Given: Project focus が `C:/Users/kitad/palpal-hive`
  - When: Guide/Pal runtime が file-read を実行
  - Then: `workspaceRoot` として focus directory が使われ、`README.md` の相対参照が可能になる
- DS-02:
  - Given: payload の `workspaceRoot` が空/不正/未存在
  - When: main process が runtime を呼ぶ
  - Then: `workspacePaths.wsRoot` を使って従来挙動を維持する

## 受入条件（Acceptance Criteria）
- AC-01: Guide runtime payload に `workspaceRoot` が含まれる。
- AC-02: Pal runtime payload に `workspaceRoot` が含まれる。
- AC-03: main process 側で `workspaceRoot` の検証とフォールバックが実装される。
- AC-04: `npm run test:unit` が PASS する。

## 制約
- 既存の guide/task/job フローや UI 構造は変更しない。
- パスの検証失敗で runtime 呼び出し自体を止めず、フォールバックする。

## 未確定事項
- Q-01: 将来、Task単位で project を固定する仕様にするか。

# delta-apply

## Delta ID
- DR-20260304-runtime-workspace-root-from-project-focus

## 実行ステータス
- APPLIED

## 変更ファイル
- wireframe/app.js
- electron-main.js
- docs/delta/DR-20260304-runtime-workspace-root-from-project-focus.md

## 適用内容（AC対応）
- AC-01:
  - 変更: Guide runtime payload へ `workspaceRoot` を追加し、Project focus directory を渡す。
  - 根拠: `resolveRuntimeWorkspaceRootForChat` を追加し、`requestGuideModelReplyWithFallback` から利用。
- AC-02:
  - 変更: Pal runtime payload へ `workspaceRoot` を追加。
  - 根拠: `executePalRuntimeForTarget` で `runtimeApi.palChat` 呼び出し時に `workspaceRoot` を設定。
- AC-03:
  - 変更: main process 側で `workspaceRoot` を `exists + isDirectory` で検証し、失敗時は既定 root へフォールバック。
  - 根拠: `resolveRuntimeWorkspaceRoot` を追加し、`guide:chat`/`pal:chat` 双方で使用。
- AC-04:
  - 変更: 構文チェックと unit test を再実行。
  - 根拠: `node --check wireframe/app.js`, `node --check electron-main.js`, `npm run test:unit` PASS。

## 非対象維持の確認
- Out of Scope への変更なし: Yes

## verify 依頼メモ
- Project focus を `palpal-hive` にして `@README.md` を問い合わせたとき、`path is outside workspace root` が解消されること。

# delta-verify

## Delta ID
- DR-20260304-runtime-workspace-root-from-project-focus

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | Guide runtime payload に `workspaceRoot` を追加 |
| AC-02 | PASS | Pal runtime payload に `workspaceRoot` を追加 |
| AC-03 | PASS | `electron-main.js` に `resolveRuntimeWorkspaceRoot` を追加し検証 + fallback を実装 |
| AC-04 | PASS | `npm run test:unit` PASS |

## スコープ逸脱チェック
- Out of Scope 変更の有無: No
- 逸脱内容:

## 不整合/回帰リスク
- R-01: Taskに project 紐づけがないため、focus 未設定時は既定 root へフォールバックする（意図どおり）。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260304-runtime-workspace-root-from-project-focus

## クローズ判定
- verify結果: PASS
- archive可否: 可

## 確定内容
- 目的: Guide/Pal runtime の file skill が Project focus 配下で動作するようにした。
- 変更対象: renderer payload（workspaceRoot）と main 側検証/フォールバック。
- 非対象: Taskごとの project モデル追加、アクセス権モデル刷新。

## 実装記録
- 変更ファイル:
  - wireframe/app.js
  - electron-main.js
  - docs/delta/DR-20260304-runtime-workspace-root-from-project-focus.md
- AC達成状況:
  - AC-01: 達成
  - AC-02: 達成
  - AC-03: 達成
  - AC-04: 達成

## 検証記録
- verify要約: runtime root 受け渡しを追加し、構文/単体テスト回帰を確認した。
- 主要な根拠:
  - `node --check wireframe/app.js`
  - `node --check electron-main.js`
  - `npm run test:unit`

## 未解決事項
- あり
  - Q-01（Task単位のproject固定モデル）

## 次のdeltaへの引き継ぎ（任意）
- Seed-01: Task/Job に `projectId` を持たせ、runtime root を focus ではなく task binding で解決する。
