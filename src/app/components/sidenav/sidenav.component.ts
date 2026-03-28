import { Component, effect, inject, model, OnDestroy, OnInit, viewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { SidemenuCategoryModel, SidemenuItemModel } from '../sidemenu/sidemenu-model';
import { MenuService } from '../../services/menu.service';
import { PlatformService } from '../../core/services/platform.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    SidemenuComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy {
  private readonly sidenav = viewChild<MatSidenav>('sidenav');

  readonly toggle = model(false);

  private readonly menuService = inject(MenuService);
  private readonly platformService = inject(PlatformService);

  readonly topItem = toSignal(this.menuService.getDashboard());
  readonly categories = toSignal(this.menuService.getMenuTree());

  constructor() {
    effect(() => {
      const nav = this.sidenav();
      if (!nav) return;
      if (this.toggle()) {
        nav.open();
      } else {
        nav.close();
      }
    });
  }

  ngOnInit(): void {
    this.setVhVariable();
    this.platformService.window?.addEventListener('resize', () => {
      this.setVhVariable();
    });
  }

  ngOnDestroy(): void {}

  onClickMenu(): void {
    setTimeout(() => {
      if (!this.toggle()) {
        this.toggle.set(false);
        this.sidenav()?.close();
      }
    }, 100);
  }

  get mode(): MatDrawerMode {
    return (this.platformService.window?.innerWidth ?? 0) < 600 ? 'over' : 'side';
  }

  private setVhVariable(): void {
    const vh = (this.platformService.window?.innerHeight ?? 0) * 0.01;
    this.platformService.nativeDocument.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
