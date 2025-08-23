import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { HeaderModel, PersonButtonMenuModel } from './components/header/header-model';
import { filter, map, mergeMap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { IconService } from './icon.service';

@Component({
    selector: 'app-root',
    imports: [
        HeaderComponent,
        SidenavComponent,
        MatSidenavModule,
        RouterOutlet,
        SidenavComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  text?: Text;

  headerModel: HeaderModel = {
    logo: { logoUrl: 'logo.png', routerLink: '/' }
  };

  toggle: boolean = false;

  constructor(
    // @Inject(ENVIRONMENT) env: Environment,
    // private auth: AuthService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private _: IconService
  ) {
    this.setTitle();
  }

  onClickPersonContext(menu: PersonButtonMenuModel): void {
    if (menu.menuId === 'logout') {
      this.route.navigate(['logout']);
    }
  }

  onToggleMenu(): void {
    this.toggle = !this.toggle;
  }

  private setTitle(): void {
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(title);
        }
        this.toggle = (event['menuToggle']);
      });
  }

}
