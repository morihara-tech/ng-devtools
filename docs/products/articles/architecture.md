# 記事機能（articles）本文運用基盤 アーキテクチャ設計書

## 概要

- **対象機能**: `/articles` 記事セクション（既存実装: `src/app/pages/articles-page/`、一覧データ: `src/resources/articles/def/articles-def.ts`）
- **設計の目的**: 記事本文を S3 上の Markdown ファイルで管理し、GitHub Actions のビルド時に取得して Angular SSG の静的 HTML へ埋め込むコンテンツ運用基盤を設計する。記事数を増やしてもコンポーネントを手書きせずに済むスケーラブルな運用を実現する。
- **前提（ユーザー決定済み・厳守事項）**:
  - 記事本文は S3 に Markdown として保存する（別 Git リポジトリ方式は不採用）
  - 取得タイミングは「ビルド時取得」。GitHub Actions のビルドジョブ内で S3 から取得し、`ng build` 前後の処理で静的 HTML へ埋め込む。クライアントサイド fetch は行わない
  - 記事更新の反映には再ビルドが必須という制約は許容する

## この設計にした理由

### 全体方針: 「prebuild で取得・生成 → ng build で prerender → postbuild は現状維持」

最重要の技術的制約は **Angular の prerender がルート構成からルートを発見する**点にある。本リポジトリは `angular.json` で `prerender: true` を指定し、`getPrerenderParams` を使っていない。したがって **各記事の詳細ページ URL は `ng build` 実行時点で静的にルート定義へ登録されていなければ prerender されない**（＝静的 HTML が生成されない）。

このため、Markdown の取得とルート/本文の生成は **`ng build` より前（prebuild ステップ）** で完了させる必要がある。`scripts/postbuild.mjs` は「すでに描画済みの HTML を後処理する」フェーズであり、ここでルートを増やすことはできない。よって本文埋め込みを postbuild 側で行う案は却下する。

データフローは以下の3フェーズに分離する。

| フェーズ | 役割 | 実行物 |
|---|---|---|
| prebuild | S3 から Markdown 取得 → frontmatter 解析 → Angular テンプレート（HTML）＋ルート定義＋i18n 候補を生成 | `scripts/prebuild-articles.mjs`（新規） |
| build | 生成済みルート・テンプレートを含めて `ng build` で ja/en を prerender | 既存 `ng build`（無改変） |
| postbuild | 404/favicon/AdSense/canonical/OGP/sitemap 注入 | 既存 `scripts/postbuild.mjs`（無改変） |

この分離により、既存ビルド・デプロイフロー（`ng build` → `postbuild`）には一切手を入れず、prebuild を前段に足すだけで統合できる。

### 代替案と却下理由

- **クライアントサイド fetch**: ユーザー決定により不採用。SSG の SEO メリット（prerender 済み HTML）も失われるため技術的にも不適。
- **postbuild で HTML へ本文を文字列注入**: prerender 後の HTML に本文を差し込む案。ルートが prerender されないため詳細ページの `index.html` 自体が存在せず成立しない。また Angular のハイドレーション対象 DOM と不整合になりエラーの温床。却下。
- **別 Git リポジトリ（サブモジュール / submodule）方式**: ユーザー決定により不採用。
- **メタデータを完全に Markdown frontmatter へ移行**: 後述（設計判断5）のとおり段階移行とし、MVP では既存 `articles-def.ts` を Single Source of Truth として維持する。

## 技術スタック

| 領域 | 採用技術 | 選定理由 |
|---|---|---|
| Markdown パーサ | `marked`（devDependencies） | ビルド時のみ使用しランタイムバンドルに含めない。軽量・実績豊富・同期 API でスクリプトから扱いやすい。Angular 既存依存と競合しない |
| frontmatter 解析 | `gray-matter`（devDependencies） | YAML frontmatter の事実上の標準。メタデータの段階移行（判断5）で frontmatter を採用する際にそのまま利用できる |
| HTML サニタイズ | `sanitize-html`（devDependencies） | 生成 HTML をビルド時にサニタイズし XSS を排除。記事は内製コンテンツだが S3 経由のため境界として処理する |
| S3 取得 | AWS CLI `aws s3 sync`（既存導入済み） | デプロイ workflow で既に利用中。新規 SDK 依存を増やさない。OIDC ロールで認証 |
| ビルド時生成 | Node.js スクリプト（`.mjs`、既存 `postbuild.mjs` と同形式） | 既存 prebuild/postbuild と同じ ESM スクリプト方式に揃える。Yarn のみで完結（npm 不使用） |
| 静的化 | Angular `prerender: true`（既存） | 既存 SSG パイプラインをそのまま活用 |

> パッケージ追加はすべて `devDependencies`。ランタイム（ブラウザ配信物）には Markdown ライブラリを一切含めない。`yarn add -D marked gray-matter sanitize-html` で導入（npm 禁止）。

## コンポーネント構成

記事数が増えても手書きコンポーネントを増やさないため、**詳細ページは単一の汎用コンポーネントに集約**する。

```
ArticlesPageComponent（一覧。既存。articles-def の ARTICLES を表示）
ArticleDetailComponent（新規・汎用）
  ├─ ApplicationPageTemplateComponent（既存・共通ページ枠）
  ├─ app-heading（既存・見出し）
  ├─ [innerHTML] 本文領域 ← prebuild が生成した記事HTML断片を束縛
  └─ ArticleRelatedToolsComponent（既存・関連ツールリンク。relatedTools を渡す）
```

### 各要素の責務

- **`ArticleDetailComponent`（新規）**: ルートデータ（`slug`）から、prebuild が生成した「記事HTML断片＋メタデータ」を読み込み描画する単一コンポーネント。本文は `[innerHTML]` でバインドする（HTML はビルド時にサニタイズ済みのため安全）。`app-heading`・`published-date`・`ArticleRelatedToolsComponent` の枠は既存の手書き記事と同じ見た目を踏襲する。
- **既存の `articles-detail-*` コンポーネント群**: 本基盤への移行対象。MVP で 1 本を Markdown 化して PoC とし、Phase 2 で全廃する（移行手順参照）。
- **`ArticlesPageComponent`（一覧）**: 変更不要。`articles-def.ts` の `ARTICLES` を読むという現状の責務を維持する。

> 本文を `[innerHTML]` で束縛するか、prebuild が `.html` テンプレート断片を各記事フォルダに吐き出して Angular がそれをテンプレートとしてコンパイルする方式かは、実装エージェントの裁量とする。ただし **prerender 前にルートと本文が確定していること** が満たされれば、どちらでも SSG 要件を満たす。本設計では追加バンドルを避けやすい `[innerHTML]` 束縛＋ビルド生成 JSON（記事HTML文字列を含む）を推奨する。

## データフロー

```
[編集者] Markdown を編集
   │  (aws s3 cp 等で手動 or 別途UI)
   ▼
[S3] s3://<articles-bucket>/articles/<slug>/ja.md, en.md
   │
   │  ① S3イベント or 手動トリガー（設計判断2）
   ▼
[GitHub Actions: deployment.yml]
   │  ② OIDC で AWS ロール assume（設計判断1）
   │  ③ aws s3 sync で Markdown を ./content/articles/ へ取得
   │  ④ yarn prebuild:articles
   │       - gray-matter で frontmatter 解析
   │       - marked で md → HTML
   │       - sanitize-html でサニタイズ
   │       - 生成物を src/generated/articles/ へ出力（ルート定義・記事HTML・i18nメタ）
   │  ⑤ yarn build（= ng build → postbuild。既存無改変）
   │       - ja/en それぞれ各記事URLを prerender
   │  ⑥ aws s3 sync dist → 配信用S3、CloudFront invalidation（既存）
   ▼
[配信] prerender 済み静的HTML（/ja/articles/<slug>/, /en/articles/<slug>/）
```

### 状態とSingle Source of Truth

- **記事一覧メタデータ（title/summary/publishedDate/relatedTools/slug）**: MVP では `articles-def.ts` が SSoT（現状維持）。
- **記事本文**: S3 の Markdown が SSoT。
- **生成物（`src/generated/articles/`）**: ビルド成果物でありコミットしない（`.gitignore` 追加）。prebuild が S3 から毎回再生成する。

## ファイル/ディレクトリ構成

### S3 上の Markdown 構成（設計判断4）

```
s3://<articles-content-bucket>/
└── articles/
    ├── uuid-v4-vs-v7/
    │   ├── ja.md          # 日本語本文（source locale）
    │   └── en.md          # 英語本文
    └── leap-seconds-unix-time/
        ├── ja.md
        └── en.md
```

- **命名規則**: フォルダ名 = `slug`（= 詳細ページの URL パス末尾、`routerLink` の `/articles/<slug>`）。`articles-def.ts` の `routerLink` と完全一致させる。
- **ロケール分割**: 1 記事 = 1 フォルダ、ロケールごとに `ja.md` / `en.md` の 2 ファイル。XLF による文字列単位 i18n とは別系統で、**記事本文は「ファイル単位の翻訳」**とする（理由は i18n 節）。
- **frontmatter（任意・Phase 2 で本採用）**: 各 `.md` 冒頭に YAML frontmatter を置ける構造を最初から許容する。

```markdown
---
title: UUID v4とv7の違いと使い分け
publishedDate: 2026-06-18
relatedTools:
  - /uuid-generator
  - /ulid-generator
---

UUID（Universally Unique Identifier）は128bitの…
```

### リポジトリ側の構成

```
scripts/
  prebuild-articles.mjs        # 新規。md → 生成物。ng build の前に実行
  postbuild.mjs                # 既存・無改変
content/                       # CI で S3 から sync する一時取得先（.gitignore）
  articles/<slug>/{ja,en}.md
src/generated/articles/        # 新規・生成物（.gitignore）
  articles-content.ja.json     # slug → {html, title, publishedDate, relatedTools}
  articles-content.en.json
src/app/pages/articles-page/
  article-detail.component.ts   # 新規・汎用詳細コンポーネント
  articles-page.routes.ts       # 記事ルートを生成物から動的に組み立てるよう変更
src/resources/articles/def/
  articles-def.ts               # 既存。MVPでは SSoT を維持
```

### package.json スクリプト

```jsonc
{
  "scripts": {
    "prebuild:articles": "node scripts/prebuild-articles.mjs",
    "build": "yarn prebuild:articles && ng build",   // postbuild は既存の npm-lifecycle で自動実行
    "postbuild": "node scripts/postbuild.mjs"
  }
}
```

> `prebuild:articles` を `build` の先頭に直列で挟む。ローカル開発（`yarn start`）では S3 取得をスキップできるよう、`content/articles/` が空または存在しない場合は prebuild が「既存の手書き記事をそのまま使う / 生成をスキップ」できるフォールバックを必須とする（移行期の二重運用のため）。

## 設計判断（COO 提示の論点への回答）

### 1. S3 アクセスの認証方式 → **GitHub Actions OIDC を採用**

既存 `deployment.yml` が既に `permissions: id-token: write` ＋ `aws-actions/configure-aws-credentials@v4` で `role/GitHubActionsRole` を assume する **OIDC 方式を実績運用中**。記事 Markdown 取得も同じロールに S3 read 権限を付与するだけで完結する。

| 観点 | OIDC（推奨） | アクセスキー方式 |
|---|---|---|
| 長期秘密情報 | 不要（一時クレデンシャル） | アクセスキーを Secrets に保持・ローテ必要 |
| 既存資産 | `GitHubActionsRole` を流用可 | 新規 Secret 管理が増える |
| 漏洩リスク | 低 | 高（鍵漏洩で恒久アクセス） |
| 導入コスト | ロールの S3 read ポリシー追加のみ | Secret 登録＋運用 |

**結論**: OIDC。`GitHubActionsRole` の IAM ポリシーに記事コンテンツバケットへの `s3:GetObject` / `s3:ListBucket` を追加する（バケットは配信用と分離する。COO 承認済み確定事項2、判断6参照）。

### 2. 再ビルド・再デプロイのトリガー → **MVP は手動、Phase 2 で S3イベント→Lambda→repository_dispatch**

| 方式 | メリット | デメリット | 推奨度 |
|---|---|---|---|
| 手動トリガー（`workflow_dispatch` / 既存の master push） | 実装ゼロ・確実・コストゼロ | 編集者が再ビルドを意識する必要あり | **MVP 採用** |
| S3イベント → Lambda → `repository_dispatch` | 編集→自動反映、運用が滑らか | Lambda・イベント設定の構築コスト、GH トークン管理 | **Phase 2 採用** |
| 定期ポーリング（cron で `aws s3 ls` 差分検知 → trigger） | Lambda 不要 | 反映に遅延・無駄ビルド・差分検知ロジックが必要 | 非推奨 |

**結論**: MVP は `deployment.yml` に `workflow_dispatch` を追加し、記事更新時は手動 or master への push で再ビルドする（「再ビルド必須」はユーザー許容済み）。Phase 2 で S3 PUT イベント → Lambda → GitHub `repository_dispatch`（type: `articles-updated`）で自動化する。Lambda は最小権限の GitHub App トークン or fine-grained PAT で `dispatches` API を叩く。

### 3. Markdown → 静的HTML 変換方式 → **prebuild ステップ（postbuild には統合しない）**

「この設計にした理由」の通り、prerender がルート構成依存のため **`ng build` 前段の prebuild** で実施する。`scripts/prebuild-articles.mjs` が担う処理:

1. `content/articles/<slug>/{ja,en}.md` を走査
2. `gray-matter` で frontmatter 分離
3. `marked` で本文 Markdown → HTML 断片
4. `sanitize-html` で許可タグ・属性のホワイトリスト処理
5. 既存記事と同じ装飾（見出し・段落・リスト）に対応する CSS クラスへのマッピング（必要なら）
6. `src/generated/articles/articles-content.{ja,en}.json` を出力（slug → {html, メタデータ}）
7. `articles-page.routes.ts` が読む slug 一覧を確定（ルートは生成物から組む）

**postbuild.mjs は無改変**。canonical/hreflang/OGP/sitemap は既存ロジックが prerender 済み記事 `index.html` を自動で拾うため、記事ページにもそのまま適用される（sitemap への記事 URL 追加も既存ロジックで自動）。

### 4. S3 上の Markdown 構成・命名規則 → 上記「ファイル/ディレクトリ構成」参照

要点: `articles/<slug>/{ja,en}.md`。slug は `routerLink` 末尾と一致。ロケールはファイル分割。frontmatter 許容構造を最初から持たせる。

### 5. `articles-def.ts` との紐付け → **MVP はTS維持、Phase 2 で frontmatter へ寄せる**

| 案 | 内容 | 評価 |
|---|---|---|
| A（MVP） | メタデータは `articles-def.ts`、本文のみ S3。slug でマッチング | i18n が既存 XLF と一貫、移行リスク最小。`relatedTools` の型・補完が効く。**採用** |
| B（Phase 2） | メタデータも frontmatter へ移し、prebuild が `ARTICLES` 相当を生成 | 記事追加が「md 1 つ追加」で完結し真にスケール。ただし relatedTools の整合検証をビルド時に行う必要 |

**MVP の紐付け規約**:
- `articles-def.ts` の各記事に本文ソース種別を持たせる（例: `bodySource: 'markdown'` を追加、未指定は従来の手書きコンポーネント）。
- prebuild は `articles-def.ts` の slug と S3 の `<slug>/` フォルダを突き合わせ、`bodySource: 'markdown'` の記事について本文 JSON を生成する。
- 不整合（def にあるが md が無い / md があるが def に無い）はビルドを**失敗**させる（サイレントな欠落を防ぐ）。

### 6. 既存フローへの影響範囲とリスク

**影響範囲**:
- `package.json`: `build` スクリプト先頭に `prebuild:articles` を直列追加（既存 postbuild ライフサイクルは不変）。
- `.github/workflows/deployment.yml` / `sandbox-deploy.yml`: 「Build」ステップ前に「AWS Assume Role」と「記事 Markdown を S3 から sync」を追加。**現状は Build の後に Assume Role している順序を、記事取得のため Build 前に移動する必要がある**（デプロイ用の権限と同一ロールで read/write 両方可能なため、assume を前倒しするだけ。order 変更のみでロジック等価）。
- IAM: `GitHubActionsRole` にコンテンツバケットの read 権限追加。
- 新規 devDependencies 3 つ（marked / gray-matter / sanitize-html）。
- `.gitignore`: `content/`、`src/generated/articles/` を追加。
- `articles-page.routes.ts`・新規 `article-detail.component.ts`。

**リスクと対策**:

| リスク | 影響 | 対策 |
|---|---|---|
| S3 取得失敗でビルドが壊れ全サイトデプロイが止まる | 高 | prebuild に「取得 0 件 / ネットワーク失敗」のフェイルファスト＋明確なエラーログ。`sandbox-deploy` で事前検証してから master へ |
| prerender がルート未登録で記事が 404 | 高 | prebuild が生成した slug をルートに必ず反映。def と md の不整合をビルド失敗扱い |
| `[innerHTML]` 経由の XSS | 中 | ビルド時 `sanitize-html` でホワイトリスト処理。記事は内製のみ（外部投稿は受けない） |
| i18n 未翻訳記事（en.md 欠落） | 中 | en.md 必須をビルド時チェックし、欠落時はビルド失敗（COO 承認済み確定事項1） |
| ローカル `yarn start` で S3 取得できない | 中 | `content/` 不在時は生成スキップ＆手書き記事フォールバック（移行期の二重運用を許容） |
| Assume Role の順序変更で既存デプロイに副作用 | 低 | read/write 同一ロールのため等価。sandbox で先行検証 |

## i18n（記事本文の ja/en 設計）

- **既存方針（変更なし）**: UI 文字列・記事一覧メタデータ（title/summary）は `$localize` ＋ XLF（`messages.en.xlf`）で文字列単位翻訳を継続。
- **記事本文（新規方針）**: 本文は段落数百〜千文字規模の長文であり、XLF の文字列単位翻訳には不向き（翻訳単位が巨大化し XLF が破綻、`extract-i18n` の差分検査 CI とも相性が悪い）。したがって **本文は「ロケール別ファイル（ja.md / en.md）」で持つ**。prebuild が locale ごとに別 JSON（`articles-content.ja.json` / `articles-content.en.json`）を生成し、`ng build --configuration=ja|en` の各ロケールビルドが対応する JSON を読む。
- **未翻訳記事の扱い**: en.md が無い場合は **ビルド失敗**とする（COO 承認済み確定事項1。en.md 必須）。ja フォールバックや en での個別非公開は採用しない。CI の `check-i18n`（`messages.en.xlf` の `<target/>` 検査）は XLF 対象のみで、本文 md には適用されないため、md の存在検証は prebuild が独自に行う。

## 実装フェーズ

| フェーズ | 実装範囲 | 備考 |
|---|---|---|
| MVP | (1) devDeps 追加 (2) `prebuild-articles.mjs` 作成（en.md 欠落はビルド失敗） (3) 汎用 `ArticleDetailComponent` (4) `articles-page.routes.ts` を生成物駆動に (5) 既存記事 1 本を md 化し記事コンテンツ専用バケットへ配置して PoC (6) CI に S3 sync ＋ assume role 前倒し (7) 専用バケットへの IAM read 権限追加 (8) トリガーは `workflow_dispatch`＋master push | メタデータは `articles-def.ts` 維持。手書き記事との二重運用フォールバックあり。バケットは配信用と分離（確定事項2） |
| Phase 2 | (1) 全手書き記事を md 化し旧コンポーネント削除 (2) メタデータを frontmatter へ移行し `articles-def.ts` を生成側に寄せる (3) S3イベント→Lambda→`repository_dispatch` による自動再ビルド | 真の「md 追加だけで記事追加」運用へ。記事コンテンツ専用バケット分離は MVP で実施済み（確定事項2） |

## 技術的リスク・制約

- 記事更新の反映に再ビルドが必須（ユーザー許容済み）。MVP では手動トリガー前提のため反映に編集者の操作が必要。
- prerender はルート構成依存のため、ルート生成（prebuild）が壊れると記事が静的化されない。prebuild の堅牢性が全体の生命線。
- 本文 md は XLF 翻訳検査 CI の対象外。en.md の品質・存在保証は別途ビルド時チェックで担保する。
- ビルド時間は記事数に比例して微増（md パース＋prerender ページ増）。現状規模では無視可能。

## スコープ外

- 編集者向けの記事入稿 UI / CMS（S3 への md 配置は当面 `aws s3 cp` 等の手動運用）。
- 記事のバージョニング・下書き・公開予約（frontmatter で将来拡張可能だが本設計では未定義）。
- 記事本文内での Angular コンポーネント埋め込み（インタラクティブ要素）。MVP は静的 HTML 断片のみ。
- 配信用 CDN / CloudFront 設定の変更（既存をそのまま使用）。

## 確定事項（COO 承認済み）

以下の 3 点は COO の承認により方針が確定している。本設計書はこれらを前提に記述している。

1. **未翻訳記事（en.md 欠落）時の挙動**: **ビルド失敗とする（en.md 必須）**。ja フォールバックや en での個別非公開は採用しない。prebuild は `bodySource: 'markdown'` の各記事について `ja.md` / `en.md` の双方が揃っていることをビルド時に検証し、欠落があればフェイルファストする。
2. **記事コンテンツ用 S3 バケット**: **配信用バケットと分離する**。記事 Markdown 専用バケット（`<articles-content-bucket>`）を配信用バケットとは別に用意し、`GitHubActionsRole` には当該バケットへの `s3:GetObject` / `s3:ListBucket` のみを付与する。同一バケットの別 prefix 方式は採用しない。
3. **MVP の再ビルドトリガー**: **手動（`workflow_dispatch` ＋ master への push）で確定**。記事更新時は手動 or master への push で再ビルドする。S3 イベント → Lambda → `repository_dispatch` による自動再ビルドは **Phase 2** とする。
