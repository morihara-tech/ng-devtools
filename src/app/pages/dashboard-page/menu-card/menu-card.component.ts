import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
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
    // Re-sort whenever the flat menu or recent history changes.
    // history$ is included solely to trigger re-sorting on navigation events.
    this.subscription.add(
      combineLatest([
        this.menuService.getFlatMenu(),
        this.recentMenuService.history$,
      ]).subscribe(([allItems, _history]) => {
        this.items = this.recentMenuService.sortByRecent(allItems);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
