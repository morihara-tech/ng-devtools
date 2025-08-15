import { Component, OnInit } from '@angular/core';
import { DashboardPageTemplateComponent } from '../../components/dashboard/dashboard-page-template/dashboard-page-template.component';
import { DashboardService } from '../../components/dashboard/dashboard.service';
import { UsageCardComponent } from './usage-card/usage-card.component';
import { LocaleService } from '../../components/locale/locale.service';
import { mergeMap } from 'rxjs';
import { TEXT, Text } from '../../../resources/texts/text';
import { MenuCardComponent } from './menu-card/menu-card.component';
import { GithubCardComponent } from './github-card/github-card.component';

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
  text!: Text;

  constructor(
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.localeService.get()
      .pipe(mergeMap((locale) => TEXT(locale)))
      .subscribe((res) => {
        this.text = res;
        this.initDashboard();
      });
  }

  private initDashboard(): void {
    this.dashboardService = new DashboardService();
    this.dashboardService.update([
      {
        title: this.text['usageCardTitle'],
        component: UsageCardComponent,
        size: { x: 'm', y: 's' },
      }, {
        title: this.text['menuCardTitle'],
        component: MenuCardComponent,
      }, {
        title: this.text['githubCardTitle'],
        component: GithubCardComponent,
        destination: {
          linkText: this.text['githubCardLinkText'],
          url: 'https://github.com/morihara-tech/ng-devtools/issues',
          external: true,
          openInNewTab: true
        }
      }
    ]);
  }

}
