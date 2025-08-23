import { Component, OnInit } from '@angular/core';
import { DashboardPageTemplateComponent } from '../../components/dashboard/dashboard-page-template/dashboard-page-template.component';
import { DashboardService } from '../../components/dashboard/dashboard.service';
import { UsageCardComponent } from './usage-card/usage-card.component';
import { MenuCardComponent } from './menu-card/menu-card.component';
import { GithubCardComponent } from './github-card/github-card.component';
import { UpdateHistoryCardComponent } from './update-history-card/update-history-card.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    DashboardPageTemplateComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  dashboardService!: DashboardService;

  ngOnInit(): void {
    this.initDashboard();
  }

  private initDashboard(): void {
    this.dashboardService = new DashboardService();
    this.dashboardService.update([
      {
        title: $localize`:@@page.dashboard.card.usage.title:ご利用方法`,
        component: UsageCardComponent,
        size: { x: 'm', y: 's' },
      }, {
        title: $localize`:@@page.dashboard.card.github.title:問い合わせ`,
        component: GithubCardComponent,
        destination: {
          linkText: $localize`:@@page.dashboard.card.github.linkText:GitHub Issuesに移動`,
          url: 'https://github.com/morihara-tech/ng-devtools/issues',
          external: true,
          openInNewTab: true
        }
      }, {
        title: $localize`:@@page.dashboard.card.menu.title:メニュー`,
        component: MenuCardComponent,
        size: { x: 's', y: 'm' },
      },{
        title: $localize`:@@page.dashboard.card.updateHistory.title:更新履歴`,
        component: UpdateHistoryCardComponent,
        size: { x: 'm', y: 'm' },
      }
    ]);
  }

}
