# docs/OVERVIEW.md（入口 / 運用の正本）

この文書は **プロジェクト運用の正本**です。`AGENTS.md` は最小ルールのみで、詳細はここに集約します。

---

## 現在地（必ず更新）
- 現在フェーズ: P0
- 今回スコープ（1〜5行）:
  - PalPal-Hive を Guide→Pal→Gate のMVPコアフローに絞って定義する
  - Guideチャット、Task配布、Pal提出、Gate判定、差し戻し再提出、完了通知を最小要件として確定する
  - `concept.md` のデータモデルを「フロー成立に必須な属性のみ」に縮約する
  - `spec.md` をコア要件（REQ-0001〜REQ-0008）へ整理する
  - `spec.md` に画面情報設計（表示項目/設定メニュー階層/デザインテイスト）のMVP最小基準を追加する
  - `architecture.md` に UseCase主体・Pal中心（Guide/Gateは役割）方針でレイヤー構造とPortを定義する
  - `design_assist.md` を汎用設計判断ガイドとして強化し、優先順位・抽象化ゲート・整合性チェックを明文化する
  - `palpal-core` と `Electron` 前提の技術方針を維持する
- 非ゴール（やらないこと）:
  - 3Dキャラクタ演出、背景演出の実装
  - Slack/Discord/Email など外部チャット連携
  - 本物の `palpal-core` 実装（MVPでは差し替え可能IF＋モック）
- 重要リンク:
  - concept: `./concept.md`
  - spec: `./spec.md`
  - architecture: `./architecture.md`
  - design assist: `./design_assist.md`
  - plan: `./plan.md`

---

## レビューゲート（必ず止まる）
共通原則：**自己レビュー → 完成と判断できたらユーザー確認 → 合意で次へ**

---

## 更新の安全ルール（判断用）
### 合意不要
- 誤字修正、リンク更新、意味を変えない追記
- plan のチェック更新
- 小さな明確化（既存方針に沿う）

### 提案→合意→適用（必須）
- 大量削除、章構成変更、移動/リネーム
- Spec ID / Error ID の変更
- API/データモデルの形を変える設計変更
- セキュリティ/重大バグ修正で挙動が変わるもの
