# docs/OVERVIEW.md（入口 / 運用の正本）

この文書は **プロジェクト運用の正本**です。`AGENTS.md` は最小ルールのみで、詳細はここに集約します。

---

## 現在地（必ず更新）
- 現在フェーズ: P0
- 今回スコープ（1〜5行）:
  - ユーザーI/Fは現行プロトタイプ（Tab UI）の見た目・振る舞いを基準に据える
  - 内部設計は将来実装方針（UseCase中心・レイヤー分離・Port境界）を正として整理する
  - `spec.md` を Task + Job + Settings + Skill運用（ClawHub擬似Download導線）まで拡張する
  - `architecture.md` に Jobフロー・設定管理・SkillCatalog Port を追加し、差し替え可能性を明確化する
  - `concept.md` のデータモデルを Plan/Task/Job/Runtime設定で再整備する
- 非ゴール（やらないこと）:
  - 3Dキャラクタ演出、背景演出の実装
  - Slack/Discord/Email など外部チャット連携
  - 本物の `palpal-core` 実装（MVPでは差し替え可能IF＋モック）
  - ClawHubの本ネットワーク配布連携（現段階は擬似Download導線）
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
