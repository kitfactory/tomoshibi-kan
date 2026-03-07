# delta-request

## Delta ID
- DR-20260307-opencode-lmstudio-run-check

## Goal
- `OpenCode` を `192.168.11.16:1234/v1` の `openai/gpt-oss-20b` に向けて実行できるか確認する。
- 必要な provider 設定と model 指定形式を特定する。

## In Scope
- temp workspace に `OpenCode` 用 provider 設定を置く。
- `opencode models` で対象 model が見えるか確認する。
- `opencode run` で最小メッセージを送り、応答可否を確認する。
- 結果を delta verify / archive に記録する。

## Out of Scope
- repo 本体への恒久設定追加
- app 実装への反映
- capability probe 実装
- commit / push

## Acceptance Criteria
- AC-01: temp workspace で `OpenCode` の provider/baseURL 設定を解決できる。
- AC-02: `opencode models` または等価確認で `openai/gpt-oss-20b` を選択可能にできる。
- AC-03: `opencode run` で最小の応答確認ができるか、失敗時は失敗条件を特定できる。
- AC-04: `node scripts/validate_delta_links.js --dir .` が PASS する。

# delta-apply

## Delta ID
- DR-20260307-opencode-lmstudio-run-check

## ステータス
- APPLIED

## 実施内容
- 公式 docs の custom provider 例に合わせて temp workspace に `opencode.json` を作成した。
- provider ID を `lmstudio` とし、`@ai-sdk/openai-compatible` を使って `baseURL=http://192.168.11.16:1234/v1` を設定した。
- model key は `openai/gpt-oss-20b` とした。
- `opencode models` で model 一覧を確認し、`opencode run` で最小メッセージを送った。

## 観測メモ
- workspace: `C:\Users\kitad\AppData\Local\Temp\opencode-lmstudio-run-afda9c6ee1e549029fb61d6590ea887d`
- `Set-Content -Encoding utf8` で書いた `opencode.json` は BOM 付きになり、JSONC parse error で失敗した。
- UTF-8 no BOM で書き直すと正常に読まれた。

# delta-verify

## Delta ID
- DR-20260307-opencode-lmstudio-run-check

## 受入条件検証
| AC | 判定 | 根拠 |
|---|---|---|
| AC-01 | PASS | temp workspace の `opencode.json` で custom provider `lmstudio` と `baseURL` を解決できた |
| AC-02 | PASS | `opencode models` で `lmstudio/openai/gpt-oss-20b` を確認できた |
| AC-03 | PASS | `opencode run -m 'lmstudio/openai/gpt-oss-20b' --format json 'Reply with exactly: OK'` が `OK` を返した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS |

## 実行結果
- config:
  - file: `C:\Users\kitad\AppData\Local\Temp\opencode-lmstudio-run-afda9c6ee1e549029fb61d6590ea887d\opencode.json`
  - provider:
    - `npm: @ai-sdk/openai-compatible`
    - `options.baseURL: http://192.168.11.16:1234/v1`
    - `options.apiKey: lm-studio`
- models:
  - `lmstudio/openai/gpt-oss-20b`
  - `lmstudio/qwen/qwen3-30b-a3b-2507`
  - `lmstudio/qwen/qwen3-coder-30b`
- run:
  - response text: `OK`
  - sessionID: `ses_3382c31a6ffepqIn1vO1fLhUHv`

## まとめ
- `OpenCode` は LM Studio の OpenAI-compatible endpoint を custom provider で普通に扱える。
- model 名は CLI 上では `lmstudio/openai/gpt-oss-20b` になる。
- config 書き込み時は BOM なし UTF-8 が必要。

## Overall
- PASS

verify status: PASS

# delta-archive

## Delta ID
- DR-20260307-opencode-lmstudio-run-check

## クローズ判定
- verify 判定: PASS
- archive 判定: クローズ済み

archive status: PASS

## まとめ
- `OpenCode` を `192.168.11.16:1234/v1` の `openai/gpt-oss-20b` に向けて実行できることを確認した
- 次はこの設定を probe / runtime 統合へ落とす段階
