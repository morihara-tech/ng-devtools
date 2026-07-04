/** Represents a single tool menu item */
export interface MenuItem {
  /** Display label (i18n) */
  label: string;
  /** Description for /menu page (i18n) */
  description: string;
  /** Angular router link */
  routerLink: string;
  /** Material icon name */
  icon?: string;
  /** SVG icon name registered in IconService */
  svgIcon?: string;
}

/** Represents a category grouping tool menu items */
export interface MenuCategory {
  /** Category display label (i18n) */
  label: string;
  /** Tool items belonging to this category */
  items: MenuItem[];
}

/** Dashboard top-level menu item (displayed outside accordion in sidenav) */
export const MENU_DASHBOARD: MenuItem = {
  label: $localize`:@@page.dashboard.menu:ダッシュボード`,
  description: $localize`:@@page.dashboard.description:JSON整形・SQL整形・UUID生成・URLエンコードなど開発者がよく使うツールを無料でまとめて利用できます。インストール不要でブラウザからすぐに使え、更新履歴やお役立ち記事もここから確認できます。`,
  routerLink: '/',
  icon: 'dashboard',
};

/** All tool categories with their items */
export const MENU_CATEGORIES: MenuCategory[] = [
  {
    label: $localize`:@@menu.category.formatter:フォーマッター`,
    items: [
      {
        label: $localize`:@@page.jsonFormatter.menu:JSON整形`,
        description: $localize`:@@page.jsonFormatter.description:崩れたJSONやAPIレスポンスを見やすく整形・検証できる無料ツールです。インデント調整やミニファイ、エスケープ処理にも対応し、レビューやデバッグ時の可読性向上にブラウザだけで使えます。`,
        routerLink: '/json-formatter',
        svgIcon: 'json',
      },
      {
        label: $localize`:@@page.sql.menu:SQL整形`,
        description: $localize`:@@page.sql.description:ORMが自動生成した読みにくいSQLや複雑なJOIN句を含むクエリも、インデントを自動調整して見やすく整形できる無料ツールです。レビュー前の整形やドキュメント共有時の可読性向上に便利です。`,
        routerLink: '/sql-formatter',
        icon: 'storage',
      },
    ],
  },
  {
    label: $localize`:@@menu.category.generator:ジェネレーター`,
    items: [
      {
        label: $localize`:@@page.uuid.menu:UUID生成`,
        description: $localize`:@@page.uuid.description:UUID v1・v4・v7を用途に応じて指定した個数だけ一括生成できる無料ツールです。テストデータ作成やDB設計、APIのダミーID生成など開発現場でそのまま使えます。`,
        routerLink: '/uuid-generator',
        svgIcon: 'uuid',
      },
      {
        label: $localize`:@@page.ulid.menu:ULID生成`,
        description: $localize`:@@page.ulid.description:タイムスタンプを含み時系列で並び替え可能なULIDを指定した個数だけ一括生成できる無料ツールです。DBの主キーやログの識別子など、生成順に並べたいIDが必要な場面で使えます。`,
        routerLink: '/ulid-generator',
        svgIcon: 'ulid',
      },
      {
        label: $localize`:@@page.password.menu:パスワード生成`,
        description: $localize`:@@page.password.description:文字種や桁数を細かく指定して安全なランダムパスワードを生成できる無料ツールです。使い回しを避けたい会員登録やサーバー設定、テスト用アカウント作成時にすぐ使えます。`,
        routerLink: '/password-generator',
        icon: 'password',
      },
      {
        label: $localize`:@@page.apiKey.menu:APIキー生成`,
        description: $localize`:@@page.apiKey.description:開発環境やMCPサーバー向けのランダムなAPIキー・シークレットトークンを無料で生成できるツールです。文字数や文字種を指定でき、ローカル環境変数やテスト用の仮キー作成にすぐ使えます。`,
        routerLink: '/api-key-generator',
        icon: 'vpn_key',
      },
    ],
  },
  {
    label: $localize`:@@menu.category.converter:コンバーター`,
    items: [
      {
        label: $localize`:@@page.urlEncoder.menu:URLエンコーダー`,
        description: $localize`:@@page.urlEncoder.description:URLやクエリ文字列に含まれる日本語・記号をパーセントエンコード／デコードできる無料ツールです。特殊文字が原因のURLエラー調査やAPIパラメータ確認にも役立ちます。`,
        routerLink: '/url-encoder',
        icon: 'link',
      },
      {
        label: $localize`:@@page.unixTimestamp.menu:UNIXタイム変換`,
        description: $localize`:@@page.unixTimestamp.description:UNIXタイムスタンプ（秒・ミリ秒）と日時表記を相互に変換できる無料ツールです。タイムゾーンを指定した変換にも対応し、ログ調査やAPIレスポンスの時刻確認にそのまま使えます。`,
        routerLink: '/unix-timestamp-converter',
        icon: 'schedule',
      },
    ],
  },
  {
    label: $localize`:@@menu.category.network:ネットワーク`,
    items: [
      {
        label: $localize`:@@page.ipCidr.menu:IP/CIDR計算機`,
        description: $localize`:@@page.ipCidr.description:IPアドレスとCIDR表記からネットワークアドレス・ブロードキャストアドレス・利用可能ホスト数などを自動計算できる無料ツールです。サブネット設計やネットワーク構成確認に役立ちます。`,
        routerLink: '/ip-cidr-calculator',
        svgIcon: 'ipCidr',
      },
    ],
  },
  {
    label: $localize`:@@menu.category.textCode:テキスト・コード`,
    items: [
      {
        label: $localize`:@@page.textDiff.menu:テキスト比較`,
        description: $localize`:@@page.textDiff.description:2つのテキストやコードを貼り付けるだけで、追加・削除・変更箇所を色分けして可視化できる無料ツールです。設定ファイルの変更確認やレビュー前の差分チェックに使えます。`,
        routerLink: '/text-diff',
        icon: 'difference',
      },
    ],
  },
  {
    label: $localize`:@@menu.category.imageDesign:画像・デザイン`,
    items: [
      {
        label: $localize`:@@page.svgToPng.menu:SVGビューアー`,
        description: $localize`:@@page.svgToPng.description:SVGファイルをブラウザ上でプレビューしながらPNG画像に変換できる無料ツールです。アイコンやロゴをラスター画像として書き出したいときにそのまま使えます。`,
        routerLink: '/svg-to-png',
        icon: 'image',
      },
      {
        label: $localize`:@@page.colorPalette.menu:カラーパレット`,
        description: $localize`:@@page.colorPalette.description:カラーコードを並べて比較したり、2色間のグラデーションを生成できる無料ツールです。配色案の検討やCSSグラデーションの確認にそのままブラウザで使えます。`,
        routerLink: '/color-palette',
        icon: 'palette',
      },
    ],
  },
];
