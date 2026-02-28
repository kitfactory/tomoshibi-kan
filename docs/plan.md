# plan.md（必ず書く：最新版）

# current
- [x] wireframe を Electron で起動できる最小実装を追加する（最優先）
- [x] architecture.md のLLM呼び出し方針（依存方向との整合）を確定する（MVP例外: LLM/palpal-coreはUseCase直接呼び）
- [x] 主要画面ワイヤーフレームを実装する（Workspace/Task Detail/Gate/Settings + ダミー操作）
- [ ] 文書横断の最終整合チェックを実施する（OVERVIEW/concept/spec/architecture/design_assist）

# future
- UI-ID辞書（`UI-PPH-xxxx`）の不足項目を追加し、画面要素と1対1対応にする
- Event Logの運用結果を踏まえ、検索/ページング/保持期間を再定義する

# archive
- [x] design_assist.md を運用テンプレート化し、規模別レイヤー方針を追加した
- [x] spec.md に画面情報設計（表示項目/設定メニュー階層/デザインテイスト）を追加した
- [x] spec.md に UI実装方針（Tailwind + CSS Variables）を追加した
- [x] spec.md に i18n / UIメッセージID管理（`UI-PPH-xxxx`）を追加した
- [x] Task Boardのソート/フィルタをMVP外とし、Event Logを暫定仕様化した
- [x] Domain名（Plan/Task）とUI表示名（Plan Card/Task Card）の命名整合ルールを明文化した
- [x] wireframe/ に主要画面の静的プロトタイプ（index/styles/app）を追加した
- [x] Electron最小起動構成（package.json, electron-main.js）を追加した
- [x] CLI起動コマンド `palpal`（bin + npm script）を追加した
