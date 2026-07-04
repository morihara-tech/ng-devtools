# sitemap.xml lastmod実質化 アーキテクチャ設計書

## 概要
- **対象機能**: GitHub Issue #193「sitemap.xmlのlastmodを実更新日ベースに修正する」
- **参照した背景資料**: `docs/core/tech/incident-report-indexing.md`（3.3節 欠陥4「lastmodの信頼性低下」、4節 P2「sitemap.xmlのlastmod改善」）
- **設計の目的**: `scripts/postbuild.mjs` が生成する `sitemap.xml` の `<lastmod>` を、全URL一律「ビルド日」から、各URLに対応するソースの実際の最終更新日ベースに変更するための技術方式を決定する。あわせて、この変更を安全に導入するために必要な周辺条件（CI設定等）を明らかにする。

## この設計にした理由

### 論点1: 「実際の最終更新日」の特定方法

検討した候補と評価は以下の通り。

| 候補 | メリット | デメリット・実現可能性 |
|---|---|---|
| **git log（コミット日時）** | 実際にソースが変更された日時を正確に反映する。ローカル・CI問わず「そのファイルが最後に変更されたコミット」を機械的に特定できる | (a) shallow clone（`fetch-depth: 1`、GitHub Actionsの`actions/checkout@v4`のデフォルト）ではその1コミットの履歴しか無く、実質「今回のビルドコミット日時」に潰れてしまう＝現状の不具合を再現する。**`fetch-depth: 0` が前提条件になる**。(b) `content/articles/` はgitignore対象（S3同期・非コミット）のため、記事本文には**原理的に使えない** |
| ファイルシステムmtime | 実装が単純 | CIでは`actions/checkout`がクローン時刻でファイルのmtimeを一律更新するため、**全ファイルが同一時刻になり、現状のバグ（全URL一律更新）をそのまま再現する**。ローカルビルドでは編集時刻を反映し得るが、CIでの本番ビルドこそが本Issueの対象であるため、CI環境での実現可能性が最も重要な評価軸であり、mtimeはこの評価軸で不採用
| frontmatterの日付フィールド（記事のみ） | git履歴に依存しない。`content/`が非コミットでも成立する。既に`publishedDate`という前例があり実装パターンが確立している | 記事以外のページ（ツールページ等）には適用できない（frontmatterという概念が無い） |

**結論**: ページ種別によってソースの管理方式が異なるため、**単一の方式に統一せず、ページ種別ごとに使い分ける**。
- ツールページ・静的ページ（Angularコンポーネント一式、git管理下）→ **git log方式**
- 記事詳細ページ（`content/`配下、git非管理・S3同期）→ **frontmatter日付方式**

この二層構成が、既存の実装済みパターン（`prebuild-articles.mjs`のfrontmatter駆動）および既存のCI/gitignore制約と最も整合する。

### 論点2: URL ↔ ソースファイル群のマッピング

URLごとに「関連するソースファイル群」を明示的に列挙したマッピングテーブルを`postbuild.mjs`に持たせる。自動推測（例: ルートパスからディレクトリ名を機械的に導出）はしない。理由は、ルートパスとディレクトリ名が一致しないケースが実際に存在するため（例: `password-generator` ルート ↔ `password-gen-page` ディレクトリ、`ip-cidr-calculator` ルート ↔ `ip-cidr-calculator-page` ディレクトリだが `svg-to-png` ルート ↔ 実体は `svg-to-png-page` など、命名規則にゆらぎがある）。明示テーブルであれば、新規ページ追加時に登録漏れがあってもフォールバック（後述）で安全側に倒せる。

**除外する変更**: アプリ全体で共有されるシェル部分（`app.component.html`のヘッダー・フッター、`SitemapComponent`等のグローバルUI）への変更は、どのページの`lastmod`にも反映しない。反映すると「共通コンポーネントを1箇所直すだけで全URLのlastmodが動く」という、今回是正したいバグと同型の問題を作り込むため。これは意図的なスコープ外とする（後述「スコープ外」参照）。

**除外する変更（多言語ファイル）**: `src/resources/texts/def/messages.en.xlf` は全ページのen翻訳が1ファイルに同居しており、単純に「このファイルへの最終コミット日時」をどこかのページのlastmod算出に使うと、無関係な他ページの翻訳修正のたびに誤って更新されてしまう。したがってMVPでは**xlfファイルをlastmod算出のソースに含めない**（ja側コンポーネントファイルの変更日時のみを見る）。翻訳のみの修正でen側ページの実更新が反映されない限界があることは既知のトレードオフとして許容し、「技術的リスク・制約」に明記する。より精密な対応（trans-unit単位の履歴追跡）はフェーズ2の検討課題とする。

### 論点3: 既存postbuild.mjsへの組み込み方

現状の実装（確認済み）:
- ステップ7で `BROWSER_DIR` 配下を再帰的に走査し、`index.html` の実パスから `urlPath` を導出、`lastmod = new Date().toISOString().slice(0, 10)`（＝スクリプト実行時刻）を全URL共通で埋め込んでいる。

変更方針:
- ステップ7の「全URL共通の`lastmod`変数」を廃止し、**URLごとに`resolveLastmod(urlPath)`を呼んで個別の値を得る**構成に変更する。
- `resolveLastmod`は、URLパス（ロケールプレフィックスを除いた部分、例: `/json-formatter`）をキーに`PAGE_SOURCE_MAP`を引き、以下のいずれかを実行する。
  - **静的ページ**: マップされたファイル/ディレクトリ群に対して `git log -1 --format=%ai -- <path...> -- <path2...> ...` を1回のプロセス起動で実行し（gitは複数pathspecを1コマンドで受け付けるため、ページ数分プロセスを分ける必要はあるが、1ページにつき1回で足りる）、得られたコミット日時をYYYY-MM-DD化して採用する。
  - **記事詳細ページ**（`/articles/<slug>`）: git を使わず、`prebuild-articles.mjs`が生成しgit管理下にある `src/generated/articles/articles-list.{locale}.json` の該当slugエントリの `updatedDate`（新設。無ければ`publishedDate`にフォールバック）を採用する。
  - **記事一覧ページ**（`/articles`）: 全記事エントリの`updatedDate`/`publishedDate`のうち最大値を採用する（一覧の表示内容は個々の記事メタデータの集合であるため）。
- **フォールバック**（git実行不可・対象パスがマップ未登録・git logが空を返す等）: 該当URL単体についてのみビルド日を使用し、`console.warn`で理由（未登録／git失敗／履歴なし）を明示してビルドは継続する。フォールバックは「1URL単位」で発動し、他URLの算出結果には影響させない。これにより「マッピング登録漏れ」が発生しても、その1ページが旧挙動に戻るだけで、サイト全体が壊れることはない。

### 論点4: CI/デプロイ環境への配慮（shallow clone問題）

`\.github/workflows/deployment.yml` は `actions/checkout@v4` をオプション無しで使用しており、デフォルトの `fetch-depth: 1`（shallow clone）である。この状態では`git log -1 --format=%ai -- <path>`は「直近1コミット」しか参照できず、**そのコミットがそのファイルに触れていなければ空、触れていればそのコミット日時＝実質ビルド日と大差ない値になり、本Issueが解決しない**。

したがって本設計は以下を**前提条件（実装フェーズで併せて必要な変更）**として明記する。
- `.github/workflows/deployment.yml` の `actions/checkout@v4` に `with: fetch-depth: 0`（全履歴取得）を追加する。
- 同様に、プレビュー/サンドボックスビルドで生成されるsitemapの正確性も求めるなら `pr.yml` / `sandbox-deploy.yml` も同様の変更を検討するが、これらはSearch Consoleに送信されないビルドのため優先度は低い（**スコープ外**、必要なら別途判断）。
- `git log`実行時にリポジトリ自体を利用できない環境（gitディレクトリが無い等、通常は発生しない想定）でも、コマンド失敗を捕捉してフォールバックする実装にすることで、ビルド自体は落とさない。

なお、この`fetch-depth: 0`変更は`postbuild.mjs`のコード変更ではなくワークフローYAMLの変更だが、本機能の**必須の前提条件**であるため、実装フェーズのタスクに含めるべきことをここに明記する。

## 技術方式

1. **静的ページ（ツールページ・トップ・menu・guide・privacy-policy・operator-info等）**
   `PAGE_SOURCE_MAP`（urlPath → ソースパス配列）を`postbuild.mjs`内の定数として持つ。各ページのソースパスは、対応する`src/app/pages/<dir>/`配下一式（`.ts`/`.html`/`.scss`、`*.spec.ts`は除外）とする。
   - トップページ（`/`）は`dashboard-page`ディレクトリ + `menu-def.ts`（トップに主要ツール一覧が出るため）
   - `/menu`は`menu-page`ディレクトリ + `menu-def.ts`
   - `/guide`は`guide-page`ディレクトリのみ（現状の実装を確認した結果、guideページは各ツールのヘルプコンポーネントを実際に読み込んでいるのではなく、`guide-page.component.html`内に独自の要約文を保持している。したがって外部ページの更新はguideページの表示内容に影響しない）
   - lastmodは `git log -1 --format=%ai -- <該当パス群>` の結果日時をYYYY-MM-DD化したもの

2. **記事詳細ページ（`/articles/<slug>`）**
   `content/articles/<slug>/{ja,en}.md` のfrontmatterに `updatedDate`（任意項目）を新設する。`prebuild-articles.mjs`はこれを読み取り、`articles-list.{locale}.json`の各エントリに `updatedDate: string | null` として出力する（既存の`publishedDate`と並列。frontmatterに無ければ`null`を出力し、`postbuild.mjs`側で`publishedDate`にフォールバック）。
   `postbuild.mjs`はビルド成果物内の生成済みJSON（`dist`ではなく`src/generated/articles/articles-list.{locale}.json`、git管理下）を読み込み、slugをキーに`updatedDate ?? publishedDate`を`lastmod`として採用する。

3. **記事一覧ページ（`/articles`）**
   同JSONの全エントリについて`updatedDate ?? publishedDate`の最大値（文字列比較で日付順ソート可能なISO 8601形式のため`localeCompare`で比較）を採用する。

4. **フォールバック**
   上記いずれの方式でも値が得られない場合のみ、そのURL単体に限りビルド日（現状の挙動）を使用し、警告ログを出す。

## データフロー

```
[静的ページ系]
src/app/pages/<dir>/**/*.{ts,html,scss}  (git管理)
   │  git log -1 --format=%ai -- <paths>
   ▼
postbuild.mjs: PAGE_SOURCE_MAP[urlPath] → lastmod (YYYY-MM-DD)
   │
   ▼
sitemap.xml <url><loc>...</loc><lastmod>...</lastmod></url>

[記事系]
content/articles/<slug>/{ja,en}.md (frontmatter: publishedDate, updatedDate)  (非git・S3同期)
   │  prebuild-articles.mjs（既存スクリプトを拡張）
   ▼
src/generated/articles/articles-list.{ja,en}.json  (git管理・コミット対象)
   │  postbuild.mjs が読み込み、slug単位/全体最大値で lastmod を算出
   ▼
sitemap.xml <url><loc>.../articles/<slug></loc><lastmod>...</lastmod></url>
```

両経路とも最終的に同じ`sitemap.xml`生成ステップ（既存ステップ7の置き換え）に合流する。

## ファイル/ディレクトリ構成

| ファイル | 変更内容 |
|---|---|
| `scripts/postbuild.mjs` | ステップ7を書き換え。`PAGE_SOURCE_MAP`定数の追加、`resolveLastmod(urlPath)`関数の追加（git log実行・記事JSON参照・フォールバックを内包）、既存の一律`lastmod`変数を廃止 |
| `scripts/prebuild-articles.mjs` | frontmatterから`updatedDate`（任意項目）を読み取り、`articles-list.{locale}.json`の各要素に`updatedDate`フィールドを追加する処理を追加。`requireFrontmatterField`は使わず任意項目として扱う（無ければ`null`） |
| `content/articles/<slug>/{ja,en}.md` | 運用ドキュメント（記事執筆手順）に、内容修正時は`updatedDate`をfrontmatterに追記する運用ルールを追加する必要がある（`publish-article`スキル等のドキュメント更新が付随タスクとして発生し得るが、本設計書のスコープ外） |
| `.github/workflows/deployment.yml` | `actions/checkout@v4`に`fetch-depth: 0`を追加（前提条件） |
| `src/generated/articles/articles-list.{ja,en}.json` | スキーマに`updatedDate: string \| null`を追加（生成物・コミット対象） |

## 実装フェーズ

| フェーズ | 実装範囲 | 備考 |
|---|---|---|
| フェーズ0（前提条件） | `deployment.yml`に`fetch-depth: 0`を追加 | これが無いと静的ページ側のgit log方式が機能せず、本Issueが未解決のまま残る |
| フェーズ1（MVP） | `postbuild.mjs`の`PAGE_SOURCE_MAP`+`resolveLastmod`実装、静的ページのgit log方式、記事のfrontmatter方式（`updatedDate`新設含む`prebuild-articles.mjs`拡張） | 完了条件（無関係な変更で対象外ページのlastmodが変わらないこと）を満たす最小構成 |
| フェーズ2（任意・将来課題） | `messages.en.xlf`のtrans-unit単位での`git log -L`精密追跡、記事本文更新時に`updatedDate`未更新だった場合の検知（lintまたはCIチェック）、本番稼働中のsitemap.xmlをフェッチしてlastmodを引き継ぐ耐障害フォールバックの追加 | MVPでは対応しない。優先度は低いが、翻訳のみ更新時にen側lastmodが更新されない既知の限界を解消する場合に着手 |

## 技術的リスク・制約

- **`fetch-depth: 0`が前提条件**: これを設定し忘れると、静的ページのlastmodは実質的に「直近コミットが対象ファイルに触れていたか」でしか判定できず、本Issueの症状が再現する。CIワークフロー変更を実装タスクから漏らさないこと。
- **翻訳のみの修正はlastmodに反映されない**: MVPでは`messages.en.xlf`をlastmod算出のソースに含めないため、en側ページの翻訳文言だけを修正した場合、そのページのlastmodは動かない。これは「無関係な変更で更新しない」という完了条件を安全側に満たすための意図的なトレードオフであり、不具合ではない。
- **新規ページ追加時の登録漏れ**: `PAGE_SOURCE_MAP`への登録を忘れると、そのページはフォールバック（ビルド日）に戻る。サイト全体を壊すことはないが、CLAUDE.mdの「新しいツールページ追加時の必須チェックリスト」に「`PAGE_SOURCE_MAP`へのエントリ追加」を項目として追加することを推奨する（本設計書のスコープ外だが、実装フェーズで併せて更新すべき）。
- **記事の`updatedDate`は運用ルールに依存する**: frontmatterへの記載を記事執筆者が忘れると、内容更新してもlastmodが動かない。CIで自動検知する仕組み（例: `content/`側のmtimeとの突合）はフェーズ2の検討課題とし、MVPでは運用ルール（ドキュメント）で担保する。
- **共有シェル部分の変更は反映対象外**: ヘッダー・フッター等のグローバルUI変更はどのページのlastmodにも影響しない設計とした。これらの変更が「全ページの実質的な内容変更」に該当するとGoogleに正しく伝えたいケースが将来出てきた場合は、別途方針の見直しが必要（現時点ではインシデントレポートが指摘する「lastmod信頼性」を優先し、意図的に反映しない）。
- **git logの実行コスト**: ページ数（現状19の静的ページ＋今後増える記事は git を使わないため対象外）程度であれば、1ページ1回のgit log呼び出しはビルド時間に有意な影響を与えない規模と判断する。ページ数が今後大幅に増える場合は再評価する。

## スコープ外

- `postbuild.mjs`・`prebuild-articles.mjs`の実際のコード実装（本設計書は方式決定のみ。実装はフロントエンドエージェントが行う）
- インシデントレポートが指摘するP1（canonical/hreflangの301矛盾）・P3（Search Console再送信等の運用作業）・P4（title/description個別最適化）への対応
- `messages.en.xlf`のtrans-unit単位精密追跡（フェーズ2として言及のみ）
- `pr.yml`・`sandbox-deploy.yml`の`fetch-depth`変更（本番デプロイの正確性を優先し、プレビュービルドは対象外と判断。将来必要になれば追加検討）
- CLAUDE.mdのチェックリスト更新（推奨事項として言及のみ、実際の追記は別タスク）
