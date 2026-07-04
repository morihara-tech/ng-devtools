# canonical/sitemap/サーバー応答 URL整合性CI検証 アーキテクチャ設計書

## 概要
- **対象機能**: Issue #194「canonical/sitemap/サーバー応答のURL整合性をCIで自動検証する」
- **関連ドキュメント**: `docs/core/tech/incident-report-indexing.md`（インシデント報告書）、`morihara-tech/build-tools#58` / PR #59（CloudFront Function側の恒久対応。マージ済み。実装内容は本設計書で確認済み）
- **設計の目的**: canonical/hreflang/sitemap.xml/内部リンク/実サーバー応答（301の有無）という4シグナルの不整合を、デプロイ後まで気づかれない状態からCIで機械的に検知できる状態にする。どのCIワークフローのどのタイミングでどんなロジックの検証を追加するか、また「意図的な不整合でCIが失敗する」ことをどう再現性高く担保するかを確定する。

## この設計にした理由

インシデントの本質は「canonical/sitemap/内部リンク（本リポジトリのビルド成果物だけで検証可能）」と「実サーバー応答＝CloudFront Functionのリダイレクト方向（本リポジトリ外・`build-tools`リポジトリ管理）」という**性質の異なる2種類のURL整合性**が食い違ったことにある。この2つを同じ場所・同じタイミングで検証しようとすると、後者の制約（別リポジトリ管理・デプロイ後にしか実URLへアクセスできない・CloudFrontのキャッシュ伝播の揺らぎ）が前者の検証まで不安定にする。したがって本設計は**目的とタイミングの異なる3層に分離**する。

| 層 | 検証対象 | 検証方法 | 実行タイミング | ブロック対象 |
|---|---|---|---|---|
| Layer A | ①canonical/hreflang ②sitemap.xml ④内部リンク | ビルド成果物の静的解析（ローカル完結） | PR（`pr.yml`） | PRマージ |
| Layer B | 「意図的な不整合を作るとLayer A/Cのロジックが失敗する」ことの契約テスト | CloudFront Functionの挙動をリポジトリ内でモック化し、正常系・異常系をテスト | PR（`pr.yml`） | PRマージ |
| Layer C | ③実サーバー応答（301の有無を含む） | デプロイ済み本番ドメインへの実HTTPリクエスト | デプロイ（`deployment.yml`、CloudFront invalidation後） | デプロイワークフローの成功表示（後述の制約あり） |

### 代替案と却下理由

1. **③もdeployment.yml内の事後検証（警告のみ）に留める**: デプロイ自体は止められないため単独では不採用。ただし「invalidation後にワークフローを失敗させる」形（Layer C）として採用し、Issue完了条件の「CIが失敗する」は満たす。
2. **③をsandbox-deploy.yml（PRごとのサンドボックス）で検証**: サンドボックスは `s3://bucket/pr-{番号}/` というパスプレフィックス配信であり、CloudFront Functionのリダイレクトロジック（後述のとおり `/ja` `/en` 配下の全パス〈下層ページ含む〉が末尾スラッシュ有無で301される、ドメインルート基準の正規表現ルール）が同一に発火する保証がない。パスプレフィックス配信下でこの正規表現ルールが意図通りに効くかは実機検証が別途必要であり、誤った安心感を与えるリスクが高いため③の主検証としては不採用。
3. **③をCI外の運用作業（手動スモークテスト）に留める**: Issue完了条件「意図的な不整合でCIが失敗することを確認できる」を満たせないため不採用。
4. **新規の定期実行ワークフロー（cron監視）を主手段にする**: デプロイをブロックする性質がなく、完了条件（CI失敗／通過）を単独で満たせない。**Layer Cの補完**として将来追加を推奨するが、スコープ外とする（下記参照）。
5. **postbuild.mjs内に検証ロジックを追記する**: postbuild.mjsは「生成（副作用ありでfsに書き込む）」、検証は「読み取り専用のassert」であり責務が異なる。同じ前提・同じバグを検証側も共有してしまう「自己言及チェック」になるリスクがあるため、別スクリプトとして独立させる。

## 技術スタック

| 領域 | 採用技術 | 選定理由 |
|---|---|---|
| 静的検証スクリプト（Layer A） | Node.js標準API（`fs`, `path`）のみ。追加npm依存なし | postbuild.mjsと実行環境を揃え、CI追加コストを最小化 |
| XML/HTMLパース | 正規表現ベースの軽量抽出（postbuild.mjsの既存手法を踏襲） | 既存コードとの一貫性。DOMパーサ導入は本タスクの目的に対して過剰 |
| 契約テスト（Layer B） | Node標準の`http`モジュールでモックサーバーを起動 + Node組み込みテストランナー（`node --test`）または既存の`yarn test`基盤とは独立した軽量スクリプト | 実ネットワーク・実CloudFrontに依存せず決定的に再現できることが目的のため、外部依存を増やさない |
| 実サーバー応答検証（Layer C） | Node標準の`fetch`（Node 18+、`redirect: 'manual'`） | 追加パッケージ不要。ステータスコードとLocationヘッダの取得のみで十分 |
| CI実行基盤 | 既存のGitHub Actions（`pr.yml` / `deployment.yml`） | 新規ワークフロー基盤を増やさず、既存の運用パターン（Node 20.19.5、yarn --frozen-lockfile）に統合 |

## コンポーネント構成

```
scripts/
  postbuild.mjs                        既存。canonical/hreflang/sitemap.xml/OGP生成（変更なし）
  url-policy.mjs                       新規。CloudFront Function側の「意図されたリダイレクトルール」を
                                        本リポジトリ側にミラーリングする唯一の定義ファイル
                                        （build-tools#58 / PR #59 の実装〈aws/devtools/devtools-frontsite.cf.yml〉
                                          と対応させる。コメントで参照元を明記。ロジックは以下の2ルール:
                                          (1) uri === "/" または "" → 301 "/ja"
                                          (2) uri が末尾スラッシュを持ち、かつ /^\/(ja|en)(\/|$)/ にマッチする場合
                                              → 301 で末尾スラッシュを除去したURLへ
                                          → ルール(2)は "/ja/" "/en/" だけでなく "/ja/json-formatter/" 等の
                                            下層ページも含む、ロケール配下の全パスが対象の正規表現ベースの
                                            ルールである点が実装上の要点）
  verify-url-consistency.mjs           新規。Layer A: ビルド成果物の静的整合性検証
  verify-production-urls.mjs           新規。Layer C: 本番URLへの実HTTPリクエスト検証
                                        （url-policy.mjs を使ったモック検証にも流用できるよう
                                          「対象URLリストを受け取り、レスポンス判定ロジックを実行する」
                                          部分を共通関数化する）

tests/
  url-consistency/
    mock-cloudfront-function.mjs       新規。Layer B: url-policy.mjs を読み込み、
                                        CloudFront Functionの挙動を最小再実装したHTTPサーバー
    verify-url-consistency.contract.test.mjs
                                        新規。Layer B: 正常系（現状のビルド成果物→全200）と
                                        異常系（canonicalを意図的にリダイレクト対象へ書き換え→検証失敗）
                                        の両方を1つのテストファイルにまとめる

.github/workflows/
  pr.yml                               変更。build+postbuildジョブを新設し、その中で
                                        Layer A（verify-url-consistency.mjs）と
                                        Layer B（url-consistency契約テスト）を実行
  deployment.yml                       変更。CloudFront invalidationステップの後に
                                        Layer C（verify-production-urls.mjs）を追加
```

## データフロー

### Layer A（PR時・静的検証）
1. `pr.yml` の新ジョブが `yarn --frozen-lockfile` → `yarn build`（`postbuild`はyarnのライフサイクルフックとして`build`スクリプト完了後に自動実行される。`package.json`の`"build"`と`"postbuild"`スクリプト名の対応による）を実行し、`dist/ng-devtools/browser/{ja,en}/` を生成
2. `node scripts/verify-url-consistency.mjs` を実行
   - `dist/ng-devtools/browser` 配下の全 `index.html`（`/error/` 配下を除く）を走査
   - 各ページから `canonical` / `hreflang`（自ロケール・対ロケール・x-default）/ 同一オリジンの内部リンク（`<a href>`）を抽出
   - `dist/ng-devtools/browser/sitemap.xml` をパースし `<loc>` の集合を取得
   - `scripts/url-policy.mjs` から「CloudFront Functionが301する既知のパターン」（`uri === "/"` → `/ja`、および `/^\/(ja|en)(\/|$)/` にマッチする末尾スラッシュ付きパス全般 → 末尾スラッシュ除去後のURL）を取得
3. 不整合を検知した場合は `::error::` annotationを出力し `process.exitCode = 1`
4. ジョブが失敗し、PRのrequired checkとして扱うことでマージをブロックする

### Layer B（PR時・契約テスト）
1. 同じPRジョブ内（または別ジョブ）で `node --test tests/url-consistency/` を実行
2. `mock-cloudfront-function.mjs` が `scripts/url-policy.mjs` の定義に基づき、dist配下の静的ファイルを配信しつつ「既知のリダイレクトパターンに一致するパスへは301を返す」ローカルHTTPサーバーを起動
3. **正常系**: 現在のビルド成果物のURL集合に対し `verify-production-urls.mjs` の判定ロジック（共通関数化した部分）をモックサーバー相手に実行し、全て200で通過することを確認
4. **異常系**: テストコード内でcanonical URLの一部を意図的にモックのリダイレクト対象パス（例: `/ja`、または下層ページに末尾スラッシュを付与した `/ja/json-formatter/` 相当）に書き換えたコピーを用意し、同じ判定ロジックを実行して非ゼロ終了（失敗）になることを`assert`
5. 異常系テストが「失敗を検知できること」自体を継続的に証明する常設テストとなる

### Layer C（デプロイ時・実サーバー応答検証）
1. `deployment.yml` の `CloudFront Invalidation` ステップの後に新ステップを追加
2. 今回のジョブ内でビルド済みの `dist/ng-devtools/browser/sitemap.xml` の全 `<loc>` と、全ページのcanonical/hreflang(x-default含む) URLの和集合（重複排除）を対象URLリストとする
3. `node scripts/verify-production-urls.mjs` が各URLに対し `fetch(url, { redirect: 'manual' })` を実行
   - 200以外（3xx含む）を即NG対象として記録（早期returnせず全件チェックしてから集計）
   - 一時的なネットワークゆらぎ対策として数回・数十秒間隔のリトリを設ける（ただしこれは「invalidation伝播待ち」ではなく「一過性の揺らぎ」対策であることを明記。判定対象がステータスコードとLocationヘッダのみでコンテンツ鮮度を見ないため、伝播遅延の影響を受けにくい設計にしている）
4. 不整合があれば `::error::` annotationを出力し、ステップを失敗させる。ワークフロー自体は赤（失敗）表示になるが、**S3同期・CloudFront invalidationは既に完了済みであるため、デプロイの巻き戻しは行わない**（後述のスコープ外・制約を参照）

## ファイル/ディレクトリ構成

| ファイル | 役割 |
|---|---|
| `scripts/url-policy.mjs` | CloudFront Functionの意図されたリダイレクトルールを本リポジトリ側で保持する唯一の定義。`build-tools#58` / PR #59（`aws/devtools/devtools-frontsite.cf.yml`）の実装と対応させ、コメントで参照元URLを明記。ルールは (1) `/` → `/ja` の301、(2) `/^\/(ja|en)(\/|$)/` にマッチする末尾スラッシュ付きパス（ロケール配下の全ページが対象）→ 末尾スラッシュ除去後のURLへの301、の2点。Layer A（既知パターンとの一致チェック）とLayer B（モックサーバーの挙動定義）の両方から参照する共通ソース |
| `scripts/verify-url-consistency.mjs` | Layer A本体。canonical/hreflang/sitemap.xml/内部リンクの静的整合性検証 |
| `scripts/verify-production-urls.mjs` | Layer C本体。判定ロジック（URL集合を受け取りHTTPステータスを判定する部分）をLayer Bのモック検証からも呼べるよう関数としてexportする |
| `tests/url-consistency/mock-cloudfront-function.mjs` | Layer B用モックサーバー |
| `tests/url-consistency/verify-url-consistency.contract.test.mjs` | Layer Bの正常系・異常系テスト |
| `.github/workflows/pr.yml` | `check-i18n`ジョブに加え、新規`verify-url-consistency`ジョブ（build→postbuild→Layer A→Layer B）を追加。既存の`auto-approve`ジョブの`needs`に新ジョブも含める |
| `.github/workflows/deployment.yml` | `CloudFront Invalidation`ステップの後に`Verify production URLs`ステップ（Layer C）を追加 |

## 実装フェーズ

| フェーズ | 実装範囲 | 備考 |
|---|---|---|
| フェーズ1 | `scripts/url-policy.mjs` 新規作成（既知のリダイレクトパターンを定義。`build-tools#58` / PR #59〈マージ済み・実装確認済み〉に基づき、(1) `/` → `/ja` の301、(2) `/^\/(ja|en)(\/|$)/` にマッチする末尾スラッシュ付きパス〈下層ページ含む全パス〉→ 末尾スラッシュ除去後のURLへの301、の2ルールを正規表現ベースで実装する） | 別リポジトリ側の実装はPR #59で確認済みのため、実装フェーズ着手のブロッカーはない。今後`build-tools`側でルールが変更された場合は`url-policy.mjs`の同時更新が必要（下記リスク参照） |
| フェーズ2 | `scripts/verify-url-consistency.mjs`（Layer A）実装、`pr.yml`にbuild+postbuild+Layer Aのジョブを追加 | 現状`pr.yml`はビルドを行っていないため、CI実行時間増加（キャッシュ戦略要検討） |
| フェーズ3 | `tests/url-consistency/`（Layer B: モック+契約テスト）実装、同ジョブまたは新規ジョブとして`pr.yml`に追加 | Issue完了条件(a)(b)を常設テストとして担保する中核 |
| フェーズ4 | `scripts/verify-production-urls.mjs`（Layer C）実装、`deployment.yml`にステップ追加 | 本番ドメインへの実リクエストのため、初期導入時はリトライ回数・間隔の調整とflaky監視が必要 |
| フェーズ5 | ブランチ保護設定で新ジョブ（Layer A/B）をrequired checkに登録 | リポジトリ設定変更。GitHub上のSettings操作が必要（IaC管理外であれば手動設定） |

## 技術的リスク・制約

- **CloudFront Functionは別リポジトリ（`build-tools`）管理であり本リポジトリのCIからは触れない**。Layer AとLayer Bは「本リポジトリ側が把握している意図（`url-policy.mjs`）」の再実装にすぎず、`build-tools`側で無断にリダイレクトルールが変更された場合、Layer A/Bだけでは検知できない。これを埋めるのがLayer C（実ネットワーク検証）だが、Layer Cは**デプロイ後にしか実行できない**ため、根本的に「デプロイを未然に止める」設計にはできない。Issue #194の完了条件は「CIが失敗すること」であり「デプロイを事前に止めること」ではない点を、COO・関係者と合意しておく必要がある。
- `url-policy.mjs` の内容は `build-tools#58` / PR #59（マージ済み・`aws/devtools/devtools-frontsite.cf.yml`）の実装確認に基づき正規表現ルール（`/^\/(ja|en)(\/|$)/` にマッチする末尾スラッシュ付きパス全般が対象）として定義するが、`build-tools`側でこのルールが将来変更された場合、本リポジトリの`url-policy.mjs`が追随するまでLayer A/Bは古いルールのまま検証を続けてしまう。運用ルール（`build-tools`側でリダイレクトルールを変更する際は本リポジトリの`url-policy.mjs`も同時更新するクロスリポジトリ手順）を別途文書化する必要がある。理想的には`build-tools`側がリダイレクトルールをJSON等でエクスポートし、本リポジトリがそれをfetchして単一の真実源にする長期改善が望ましいが、本設計のスコープ外とし`build-tools#58`側への提案事項とする。
- Layer C（実URL検証）はCloudFrontのキャッシュ・エッジの一時的ゆらぎの影響を受ける可能性があり、初回導入時はflaky failureの監視が必要。
- `pr.yml`に新規ビルドジョブを追加することでPRのCI実行時間が伸びる（現状i18nチェックのみ→フルビルド追加）。`actions/setup-node`の`cache: 'yarn'`活用など別途キャッシュ戦略の検討が望ましい（本設計のスコープ外、実装時の最適化事項とする）。
- サンドボックス環境（PRごとのパスプレフィックス配信）は本番のドメインルート型リダイレクトを正確に再現できないため、Layer Cの対象から除外している。Issueが選択肢として挙げる「ステージングでの検証」は、ドメインルート配信（サブドメイン等）のステージング環境が別途用意されない限り事実上使えない。

## スコープ外

- CloudFront Function自体の実装修正（インシデント報告書のP1「スラッシュあり→なし301への統一」）は `build-tools#58` 側の対応であり、本設計書の対象外
- sitemap.xmlの`<lastmod>`改善（インシデント報告書P2）は別Issueとして扱う
- 定期実行（cron）による本番監視ワークフローの新設は、Layer Cの将来的な補完として有用だが本設計のスコープ外（必要になった時点で別途設計する）
- ステージング環境の新規構築
- ブランチ保護ルールの具体的なGitHub上の設定操作（フェーズ5であることは明記するが、設定作業自体は本設計書の範囲外）
