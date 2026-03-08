# delta-request

## Delta ID
- DR-20260308-fallback-scorer-necessity-evaluation

## Delta Type
- DESIGN

## 目的
- resident routing において `fallback scorer` がまだ必要かを評価し、必要ならどの責務に限定して残すかを明文化する。

## 変更対象（In Scope）
- `docs/spec.md`
- `docs/architecture.md`
- `docs/plan.md`
- 当該 delta 記録

## 非対象（Out of Scope）
- routing ロジック実装の変更
- Guide prompt / few-shot 調整
- resident `SOUL.md / ROLE.md` 再編集
- progress log / task detail UI の変更

## 差分仕様
- DS-01:
  - Given:
    - current resident routing は LLM decision と fallback scorer の二段構え
  - When:
    - 既存観測と current code path を評価する
  - Then:
    - `fallback scorer` を削除できる条件と、現時点で残すべき理由を明文化する
- DS-02:
  - Given:
    - resident routing の設計境界
  - When:
    - spec / architecture を読む
  - Then:
    - fallback scorer の責務が `safety net` に限定されることが同期される

## 受入条件（Acceptance Criteria）
- AC-01:
  - 現時点で fallback scorer を残す/外す判断が docs に明文化される
- AC-02:
  - fallback scorer の責務が `invalid / low-confidence / no-fit / runtime unavailable` に限定されることが spec / architecture に反映される
- AC-03:
  - `docs/plan.md` current が本 delta に更新される
- AC-04:
  - `node scripts/validate_delta_links.js --dir .` が PASS する

## 制約
- 制約1:
  - この delta ではコード変更を行わない
- 制約2:
  - 観測済み事実と current 実装だけで判断し、追加改善は次の delta に分離する

## Review Gate
- required: No
- reason:
  - 設計判断と docs 同期のみであり、review 必須の大きな仕様変更ではない

# delta-apply

## Delta ID
- DR-20260308-fallback-scorer-necessity-evaluation

## Delta Type
- DESIGN

## 実行ステータス
- APPLIED

## 変更ファイル
- docs/spec.md
- docs/architecture.md
- docs/plan.md
- 当該 delta 記録

## 適用内容（AC対応）
- AC-01:
  - fallback scorer を残す/外す判断を docs へ反映した
- AC-02:
  - fallback scorer の責務を safety net に限定する文言を spec / architecture へ追加した
- AC-03:
  - `docs/plan.md` current を本 delta に更新した
- AC-04:
  - validator 実行予定

## 非対象維持の確認
- Out of Scope への変更なし: Yes

# delta-verify

## Delta ID
- DR-20260308-fallback-scorer-necessity-evaluation

## Verify Profile
- project-validator:
  - `node scripts/validate_delta_links.js --dir .`

## 検証結果（AC単位）
| AC | 結果(PASS/FAIL) | 根拠 |
|---|---|---|
| AC-01 | PASS | 現時点では fallback scorer を削除せず、safety net として残す判断を docs に明文化した |
| AC-02 | PASS | spec / architecture に `invalid / low-confidence / no-fit / runtime unavailable` 時のみ使う責務を追記した |
| AC-03 | PASS | `docs/plan.md` current を本 delta に更新した |
| AC-04 | PASS | `node scripts/validate_delta_links.js --dir .` が PASS した |

## 判断
- 現時点で fallback scorer は必要である。
- 理由:
  - LLM routing は invalid / low-confidence / no-fit が起こりうる。
  - runtime unavailable でも resident dispatch を止めずに進める safety net が必要である。
  - 一方で通常経路の resident 選定主役は LLM に寄せる。

## 判定
- Overall: PASS

# delta-archive

## Delta ID
- DR-20260308-fallback-scorer-necessity-evaluation

## クローズ判定
- verify結果: PASS
- review gate: NOT REQUIRED
- archive可否: 可

## 結論
- fallback scorer は現時点で削除しない
- ただし resident routing の主役ではなく safety net として限定して残す
- 次の改善は LLM routing 精度を上げ、fallback 発火頻度を下げる方向で進める
