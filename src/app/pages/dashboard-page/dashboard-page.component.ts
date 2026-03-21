import { Component, inject, OnInit } from '@angular/core';
import { DashboardPageTemplateComponent } from '../../components/dashboard/dashboard-page-template/dashboard-page-template.component';
import { DashboardService } from '../../components/dashboard/dashboard.service';
import { DashboardCardModel } from '../../components/dashboard/dashboard-card-model';
import { UsageCardComponent } from './usage-card/usage-card.component';
import { MenuCardComponent } from './menu-card/menu-card.component';
import { GithubCardComponent } from './github-card/github-card.component';
import { UpdateHistoryCardComponent } from './update-history-card/update-history-card.component';
import { PlatformService } from '../../core/services/platform.service';

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
export class DashboardPageComponent implements OnInit {
  private readonly platformService = inject(PlatformService);

  dashboardService!: DashboardService;
  defaultCards: DashboardCardModel[] = [];

  ngOnInit(): void {
    this.defaultCards = this.buildDefaultCards();
    this.initDashboard();
  }

  private buildDefaultCards(): DashboardCardModel[] {
    return [
      {
        id: 'usage',
        title: $localize`:@@page.dashboard.card.usage.title:ご利用方法`,
        component: UsageCardComponent,
        size: { x: 'm', y: 's' },
      },
      {
        id: 'github',
        title: $localize`:@@page.dashboard.card.github.title:問い合わせ`,
        component: GithubCardComponent,
        destination: {
          linkText: $localize`:@@page.dashboard.card.github.linkText:GitHub Issuesに移動`,
          url: 'https://github.com/morihara-tech/ng-devtools/issues',
          external: true,
          openInNewTab: true,
        },
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
        id: 'updateHistory',
        title: $localize`:@@page.dashboard.card.updateHistory.title:更新履歴`,
        component: UpdateHistoryCardComponent,
        size: { x: 'm', y: 'm' },
      },
    ];
  }

  private initDashboard(): void {
    this.dashboardService = new DashboardService();
    const cards = this.loadLayoutFromStorage();
    this.dashboardService.update(cards);
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
