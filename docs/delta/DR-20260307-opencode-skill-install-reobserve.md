# delta-request

## Delta ID
- DR-20260307-opencode-skill-install-reobserve

## Goal
- `OpenCode` skills の導入方法を一次情報と実観測で確認する。
- 一時 skill を配置して `opencode debug skill` が検出する条件を特定する。

## In Scope
- 公式 doc / local SDK 型定義から skills の導入場所と設定項目を確認する。
- 一時 workspace を作成し、project-local な skill を配置して `opencode debug skill` を再観測する。
- 必要なら frontmatter / `SKILL.md` の最小形を調整し、発見条件を記録する。
- 結果を delta verify / archive に記録する。

## Out of Scope
- `OpenCode` probe の本実装
- repo 本体への恒久的な skill 追加
- app routing/settings への反映
- commit / push

## Acceptance Criteria
- AC-01: skills の導入場所または設定項目（path/url）の一次情報を確認できる。
- AC-02: 一時 skill を配置して `opencode debug skill` の再観測結果を取得できる。
- AC-03: `OpenCode` が skill を見つけるための最小条件を verify に残せる。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-opencode-skill-install-reobserve

## ステータス
- APPLIED

## 一次情報
- 公式 docs:
  - `https://opencode.ai/docs/skills`
  - `https://opencode.ai/docs/config/`
- local SDK 型定義:
  - `C:\Users\kitad\.config\opencode\node_modules\@opencode-ai\sdk\dist\v2\gen\types.gen.d.ts`

## 実施内容
- 公式 docs で skills の配置場所と frontmatter を確認した。
- temp git workspace を作成し、`.opencode/skills/probe-skill/SKILL.md` を配置して `opencode debug skill` を実行した。
- temp config dir を作成し、`skills/global-probe-skill/SKILL.md` を配置して `OPENCODE_CONFIG_DIR` 経由でも `opencode debug skill` を実行した。

## 観測メモ
- 公式 docs では以下が明記されている。
  - project-local: `.opencode/skills/<name>/SKILL.md`
  - global: `~/.config/opencode/skills/<name>/SKILL.md`
  - Claude/Agents 互換パス: `.claude/skills`, `.agents/skills`
  - `SKILL.md` は YAML frontmatter 必須
  - `name`, `description` が required
  - project-local は current working directory から git worktree まで遡って探索する
- local SDK 型定義には `skills.paths` と `skills.urls` がある。
- 実観測では project-local skill も `OPENCODE_CONFIG_DIR/skills/...` も `opencode debug skill` で検出できた。

# delta-verify

## Delta ID
- DR-20260307-opencode-skill-install-reobserve

## 受入条件検証
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | 公式 docs と SDK 型定義で配置場所・frontmatter・`skills.paths` / `skills.urls` を確認した |
| AC-02 | PASS | temp workspace の `.opencode/skills/probe-skill/SKILL.md` が `opencode debug skill` で検出された |
| AC-03 | PASS | project-local / config-dir 両経路の最小条件を整理した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS |

## 再観測結果
- project-local:
  - workspace: `C:\Users\kitad\AppData\Local\Temp\opencode-skill-probe-d0f735efbe11414bb4245cc7cbb62170`
  - path: `.opencode/skills/probe-skill/SKILL.md`
  - `opencode debug skill` 結果: `probe-skill` を検出
- config-dir:
  - config dir: `C:\Users\kitad\AppData\Local\Temp\opencode-config-probe-7df3e5b9d8f64a36b271f4d8f7d941c7`
  - path: `skills/global-probe-skill/SKILL.md`
  - `OPENCODE_CONFIG_DIR=<dir> opencode debug skill` 結果: `global-probe-skill` を検出

## 最小条件
- project-local で置くなら:
  - git worktree 配下
  - `.opencode/skills/<name>/SKILL.md`
  - YAML frontmatter に `name`, `description`
  - `name` はディレクトリ名と一致
- global で置くなら:
  - `~/.config/opencode/skills/<name>/SKILL.md`
- custom config dir を使うなら:
  - `OPENCODE_CONFIG_DIR=<dir>`
  - `<dir>/skills/<name>/SKILL.md`
- `compatibility: opencode` は今回の最小例では有効だったが、必須条件としては docs 上 `optional`

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-opencode-skill-install-reobserve

## クローズ判定
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- `OpenCode` skill は project-local と config-dir の両方で検出できた
- 導入方法は local docs と実観測で十分に特定できた
- 次はこの結果を使って `OpenCode` capability probe 実装へ進める
