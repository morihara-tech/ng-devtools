import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { SidemenuItemModel, SidemenuPersonModel } from './components/sidemenu/sidemenu-model';
import { HeaderModel, PersonButtonMenuModel } from './components/header/header-model';
import { filter, map, mergeMap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { TEXT, Text } from '../resources/texts/text';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    SidemenuComponent,
    MatSidenavModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  text?: Text;

  headerModel: HeaderModel = {
    logo: { logoUrl: '/logo.gif', routerLink: '/' }
  };
  sidemenuItems?: Array<SidemenuItemModel>;
  sidemenuPerson?: SidemenuPersonModel;

  defaultToggle: boolean = false;

  constructor(
    // @Inject(ENVIRONMENT) env: Environment,
    // private auth: AuthService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.init();
  }

  onClickMenu(): void {
    setTimeout(() => {
      if (!this.defaultToggle) {
        this.sidenav?.close();
      }
    }, 100);
  }

  onClickPersonContext(menu: PersonButtonMenuModel): void {
    if (menu.menuId === 'logout') {
      this.route.navigate(['logout']);
    }
  }

  private init(): void {
    // TODO locale
    TEXT('ja').subscribe(res => {
      this.text = res
      this.setTitle();
      this.setSidemenu();
    });
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
        if (this.text) {
          this.titleService.setTitle(this.text[event['titleId']]);
        }
        this.defaultToggle = (event['menuToggle']);
        if (this.defaultToggle) {
          this.sidenav?.open();
        }
        if (!this.defaultToggle) {
          this.sidenav?.close();
        }
      });
  }

  private setSidemenu(): void {
    if (!this.text) {
      return;
    }
    this.sidemenuItems = [
      { icon: 'data_object', label: 'test', routerLink: '/' }
    ];
  }

}
