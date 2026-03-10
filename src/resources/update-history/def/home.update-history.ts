import { UpdateHistoryModel } from "../../../app/components/update-history/update-history-model";

export const HOME_UPDATE_HISTORIES: Array<UpdateHistoryModel> = [
  // add new update history here
  {
    date: '2026-03-10',
    description: $localize`:@@update.home.20260310:ダッシュボードカードのリサイズ機能を追加しました。
カードの並び順・サイズをlocalStorageに保存するようにしました。
最近使ったメニューをダッシュボードに表示するようにしました。
メニュー画面のスマートフォン表示を最適化しました。`
  },
  {
    date: '2026-03-09',
    description: $localize`:@@update.home.20260309:メニューのコンポーネント化を実施しました。
サイドナビをカテゴリ別アコーディオンに変更しました。
ツール一覧画面を追加しました。`
  },
  {
    date: '2026-03-08',
    description: $localize`:@@update.home.20260308:テキスト比較ツールを実装しました。`
  },
  {
    date: '2026-03-07',
    description: $localize`:@@update.home.20260307:URLエンコード・デコードツールを実装しました。
UNIXタイム変換ツールを実装しました。`
  },
  {
    date: '2026-03-06',
    description: $localize`:@@update.home.20260306:SVGビューアーのUIを改善しました。
アプリアイコンとブランドカラーをリニューアルしました。`
  },
  {
    date: '2026-02-04',
    description: $localize`:@@update.home.20260204:JSON整形、SQL整形、SVGビューアーツールにクリアボタンを追加しました。`
  },
  {
    date: '2026-01-26',
    description: $localize`:@@update.home.20260126:IP/CIDR計算機を実装しました。`
  },
  {
    date: '2026-01-23',
    description: $localize`:@@update.home.20260123:SVGビューアーツールを実装しました。`
  },
  {
    date: '2026-01-21',
    description: $localize`:@@update.home.20260121:SQL整形ツールを実装しました。`
  },
  {
    date: '2026-01-20',
    description: $localize`:@@update.home.20260120:パスワード生成ツールを実装しました。`
  },
  {
    date: '2026-01-13',
    description: $localize`:@@update.home.20260113:JSON整形ツールを実装しました。`
  },
  {
    date: '2025-08-23',
    description: $localize`:@@update.home.20250823:言語切替機能を実装しました。`
  },
  {
    date: '2025-08-20',
    description: $localize`:@@update.home.20250820:UUID生成を実装しました。`
  },
  {
    date: '2025-08-16',
    description: $localize`:@@update.home.20250816:ダッシュボードを実装しました。`
  }
];
