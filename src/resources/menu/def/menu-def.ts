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
  description: $localize`:@@page.dashboard.description:ツールの一覧と更新履歴を確認できます。`,
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
        description: $localize`:@@page.jsonFormatter.description:JSONデータを見やすく整形します。`,
        routerLink: '/json-formatter',
        svgIcon: 'json',
      },
      {
        label: $localize`:@@page.sql.menu:SQL整形`,
        description: $localize`:@@page.sql.description:SQLクエリを読みやすく整形します。`,
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
        description: $localize`:@@page.uuid.description:UUID (v1/v4/v7) を一括生成します。`,
        routerLink: '/uuid-generator',
        svgIcon: 'uuid',
      },
      {
        label: $localize`:@@page.ulid.menu:ULID生成`,
        description: $localize`:@@page.ulid.description:タイムスタンプ付きの ULID を生成します。`,
        routerLink: '/ulid-generator',
        svgIcon: 'ulid',
      },
      {
        label: $localize`:@@page.password.menu:パスワード生成`,
        description: $localize`:@@page.password.description:安全なランダムパスワードを生成します。`,
        routerLink: '/password-generator',
        icon: 'password',
      },
    ],
  },
  {
    label: $localize`:@@menu.category.converter:コンバーター`,
    items: [
      {
        label: $localize`:@@page.urlEncoder.menu:URLエンコーダー`,
        description: $localize`:@@page.urlEncoder.description:URLのエンコード・デコードを行います。`,
        routerLink: '/url-encoder',
        icon: 'link',
      },
      {
        label: $localize`:@@page.unixTimestamp.menu:UNIXタイム変換`,
        description: $localize`:@@page.unixTimestamp.description:UNIXタイムスタンプと日時を相互変換します。`,
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
        description: $localize`:@@page.ipCidr.description:IPアドレスとCIDRからネットワーク情報を計算します。`,
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
        description: $localize`:@@page.textDiff.description:2つのテキストを比較して差分を表示します。`,
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
        description: $localize`:@@page.svgToPng.description:SVGファイルをプレビュー・変換します。`,
        routerLink: '/svg-to-png',
        icon: 'image',
      },
    ],
  },
];
