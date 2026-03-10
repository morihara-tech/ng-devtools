import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HyperLinkTextComponent } from '../../../components/hyper-link-text/hyper-link-text.component';
import { MenuService } from '../../../services/menu.service';
import { RecentMenuService } from '../../../services/recent-menu.service';
import { MenuItem } from '../../../../resources/menu/def/menu-def';

@Component({
  selector: 'app-menu-card',
  imports: [
    RouterModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    HyperLinkTextComponent,
  ],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.scss',
})
export class MenuCardComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];

  private subscription = new Subscription();

  constructor(
    private menuService: MenuService,
    private recentMenuService: RecentMenuService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.menuService.getFlatMenu().subscribe((items) => {
        this.items = this.recentMenuService.sortByRecent(items);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /** Tracks a click on a menu item so it appears at the top of recent items. */
  onItemClick(routerLink: string): void {
    this.recentMenuService.track(routerLink);
  }
}
