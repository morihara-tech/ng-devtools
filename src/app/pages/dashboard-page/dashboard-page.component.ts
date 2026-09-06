import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DashboardPageTemplateComponent } from '../../components/dashboard/dashboard-page-template/dashboard-page-template.component';
import { DashboardService } from '../../components/dashboard/dashboard.service';
import { DashboardCardModel } from '../../components/dashboard/dashboard-card-model';
import { UsageCardComponent } from './usage-card/usage-card.component';
import { MenuCardComponent } from './menu-card/menu-card.component';
import { ArticlesCardComponent } from './articles-card/articles-card.component';
import { GithubCardComponent } from './github-card/github-card.component';
import { UpdateHistoryCardComponent } from './update-history-card/update-history-card.component';
import { AdCardComponent } from './ad-card/ad-card.component';
import { PlatformService } from '../../core/services/platform.service';
import { MENU_DASHBOARD } from '../../../resources/menu/def/menu-def';

const STORAGE_KEY = 'dashboard_layout';

interface LayoutEntry {
  id: string;
  size: { x?: 's' | 'm' | 'l'; y?: 's' | 'm' | 'l' };
}

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardPageTemplateComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private readonly platformService = inject(PlatformService);
  private readonly document = inject(DOCUMENT);

  dashboardService!: DashboardService;
  defaultCards: DashboardCardModel[] = [];
  private jsonLdScript?: HTMLScriptElement;

  constructor() {
    afterNextRender(() => {
      // Client-only: apply the saved layout (order/sizes) from localStorage
      // after hydration completes. Reading localStorage during ngOnInit would
      // make the client's pre-hydration render diverge from the SSR output
      // (which always sees no localStorage), causing a hydration mismatch.
      this.dashboardService.update(this.loadLayoutFromStorage());
    });
  }

  ngOnInit(): void {
    this.defaultCards = this.buildDefaultCards();
    this.dashboardService = new DashboardService();
    // Server/client initial render always uses the default order so the two
    // renders match exactly.
    this.dashboardService.update([...this.defaultCards]);
    this.addJsonLd();
  }

  ngOnDestroy(): void {
    this.jsonLdScript?.remove();
  }

  private addJsonLd(): void {
    const itemList = this.defaultCards
      .filter((c) => c.destination?.url)
      .map((c, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': c.title,
        'url': c.destination!.url,
      }));

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': $localize`:@@app.title:devTools`,
      'description': MENU_DASHBOARD.description,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'JPY' },
      'hasPart': itemList,
    });
    this.document.head.appendChild(script);
    this.jsonLdScript = script;
  }

  private buildDefaultCards(): DashboardCardModel[] {
    return [
      {
        id: 'usage',
        title: $localize`:@@page.dashboard.card.usage.title:ご利用方法`,
        component: UsageCardComponent,
        size: { x: 'l', y: 's' },
      },
      {
        id: 'menu',
        title: $localize`:@@page.dashboard.card.menu.title:メニュー`,
        component: MenuCardComponent,
        size: { x: 's', y: 'm' },
        destination: {
          linkText: $localize`:@@page.dashboard.card.menu.linkText:すべてのメニューを見る`,
          url: '/menu',
        },
      },
      {
        id: 'articles',
        title: $localize`:@@page.dashboard.card.articles.title:お役立ち記事`,
        component: ArticlesCardComponent,
        size: { x: 's', y: 'm' },
        destination: {
          linkText: $localize`:@@page.dashboard.card.articles.linkText:すべての記事を見る`,
          url: '/articles',
        },
      },
      {
        id: 'updateHistory',
        title: $localize`:@@page.dashboard.card.updateHistory.title:更新履歴`,
        component: UpdateHistoryCardComponent,
        size: { x: 'm', y: 's' },
      },
      {
        id: 'github',
        title: $localize`:@@page.dashboard.card.github.title:問い合わせ`,
        component: GithubCardComponent,
        size: { x: 's', y: 's' },
        destination: {
          linkText: $localize`:@@page.dashboard.card.github.linkText:GitHub Issuesに移動`,
          url: 'https://github.com/morihara-tech/ng-devtools/issues',
          external: true,
          openInNewTab: true,
        },
      },
      {
        id: 'ad',
        title: $localize`:@@page.dashboard.card.ad.title:広告`,
        component: AdCardComponent,
        size: { x: 's', y: 's' },
      },
    ];
  }

  /**
   * Loads the layout order and sizes from localStorage and merges with the
   * default card definitions, preserving card components and other metadata.
   */
  private loadLayoutFromStorage(): DashboardCardModel[] {
    try {
      const raw = this.platformService.localStorage?.getItem(STORAGE_KEY);
      if (!raw) return [...this.defaultCards];

      const layout: LayoutEntry[] = JSON.parse(raw);
      const byId = new Map<string, DashboardCardModel>(
        this.defaultCards.map((c) => [c.id, c])
      );

      // Re-order by saved layout; ignore unknown IDs
      const ordered: DashboardCardModel[] = layout
        .map((entry) => {
          const card = byId.get(entry.id);
          if (!card) return null;
          return { ...card, size: { ...card.size, ...entry.size } };
        })
        .filter((c) => c !== null) as DashboardCardModel[];

      // Append any new cards that were not in the saved layout
      const savedIds = new Set(layout.map((e) => e.id));
      const newCards = this.defaultCards.filter((c) => !savedIds.has(c.id));

      return [...ordered, ...newCards];
    } catch {
      return [...this.defaultCards];
    }
  }
}
