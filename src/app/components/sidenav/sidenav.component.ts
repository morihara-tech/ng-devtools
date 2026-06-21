import { Component, computed, effect, inject, model, OnInit, signal, viewChild } from '@angular/core';
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
export class SidenavComponent implements OnInit {
  private readonly sidenav = viewChild<MatSidenav>('sidenav');

  readonly toggle = model(false);

  private readonly menuService = inject(MenuService);
  private readonly platformService = inject(PlatformService);

  readonly topItem = toSignal(this.menuService.getDashboard());
  readonly categories = toSignal(this.menuService.getMenuTree());

  /** Bottom navigation item linking to the Articles section. */
  readonly articlesItem: SidemenuItemModel = {
    label: $localize`:@@page.articles.menu:記事`,
    routerLink: '/articles',
    icon: 'article',
  };

  /** Bottom navigation item linking to the Privacy Policy page. */
  readonly privacyPolicyItem: SidemenuItemModel = {
    label: $localize`:@@page.privacyPolicy.menu:プライバシーポリシー`,
    routerLink: '/privacy-policy',
    icon: 'policy',
  };

  /** Bottom navigation item linking to the Operator Info page. */
  readonly operatorInfoItem: SidemenuItemModel = {
    label: $localize`:@@page.operatorInfo.menu:運営者情報・お問い合わせ`,
    routerLink: '/operator-info',
    icon: 'info',
  };

  /** Items rendered at the bottom of the sidenav, outside the accordion. */
  readonly bottomItems: SidemenuItemModel[] = [this.articlesItem, this.privacyPolicyItem, this.operatorInfoItem];

  /** Current viewport width, kept in sync with the `resize` event. Initialized lazily to avoid NG0100. */
  private readonly innerWidth = signal(this.platformService.window?.innerWidth ?? 0);

  /** Drawer mode derived from the viewport width signal so changes flow through Angular's reactivity. */
  readonly mode = computed<MatDrawerMode>(() => (this.innerWidth() < 600 ? 'over' : 'side'));

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
      this.innerWidth.set(this.platformService.window?.innerWidth ?? 0);
    });
  }

  onClickMenu(): void {
    setTimeout(() => {
      if (!this.toggle()) {
        this.toggle.set(false);
        this.sidenav()?.close();
      }
    }, 100);
  }

  private setVhVariable(): void {
    const vh = (this.platformService.window?.innerHeight ?? 0) * 0.01;
    this.platformService.nativeDocument.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
