import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidemenuItemModel, SidemenuPersonModel } from '../sidemenu/sidemenu-model';

@Component({
    selector: 'app-sidenav',
    imports: [
        SidemenuComponent,
        MatSidenavModule
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnChanges, OnInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  @Input() toggle: boolean = false;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();

  sidemenuItems?: Array<SidemenuItemModel>;
  sidemenuPerson?: SidemenuPersonModel;

  constructor(
    // @Inject(ENVIRONMENT) env: Environment
  ) {}

  ngOnChanges(): void {
    if (!this.sidenav) {
      return;
    }
    if (this.toggle) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }

  ngOnInit(): void {
    this.setSidemenu();
    this.setVhVariable();
    window.addEventListener('resize', () => {
      this.setVhVariable();
    });
  }

  onClickMenu(): void {
    setTimeout(() => {
      if (!this.toggle) {
        this.toggleChange.emit(false);
        this.sidenav?.close();
      }
    }, 100);
  }

  get mode(): MatDrawerMode {
    return (window.innerWidth < 600)
      ? 'over'
      : 'side';
  }

  private setSidemenu(): void {
    this.sidemenuItems = [
      { icon: 'dashboard', label: $localize`:@@page.dashboard.menu:ダッシュボード`, routerLink: '/dashboard' },
      { svgIcon: 'ulid', label: $localize`:@@page.ulid.menu:ULID生成`, routerLink: '/ulid-generator' },
      { svgIcon: 'uuid', label: $localize`:@@page.uuid.menu:UUID生成`, routerLink: '/uuid-generator' },
      { svgIcon: 'json', label: $localize`:@@page.jsonFormatter.menu:JSON整形`, routerLink: '/json-formatter' },
      { icon: 'storage', label: $localize`:@@page.sql.menu:SQL整形`, routerLink: '/sql-formatter' },
      { icon: 'password', label: $localize`:@@page.password.menu:パスワード生成`, routerLink: '/password-generator' },
      { icon: 'image', label: $localize`:@@page.svgToPng.menu:SVG描画`, routerLink: '/svg-to-png' },
      { svgIcon: 'ipCidr', label: $localize`:@@page.ipCidr.menu:IP/CIDR計算機`, routerLink: '/ip-cidr-calculator' },
    ];
  }

  private setVhVariable(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
