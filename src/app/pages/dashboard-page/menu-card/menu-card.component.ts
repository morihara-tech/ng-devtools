import { afterNextRender, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
  ) {
    afterNextRender(() => {
      // Client-only: apply "most recently used" ordering after hydration.
      // RecentMenuService reads localStorage synchronously at construction
      // time, so applying this sort during ngOnInit would make the client's
      // pre-hydration render diverge from the SSR output (which always has
      // no history), causing a hydration mismatch. The initial render (both
      // server and client) always uses the default menu order; only once
      // hydration is complete do we re-sort by recency.
      this.subscription.add(
        combineLatest([
          this.menuService.getFlatMenu(),
          this.recentMenuService.history$,
        ]).subscribe(([allItems, _history]) => {
          this.items = this.recentMenuService.sortByRecent(allItems);
          this.cdr.markForCheck();
        })
      );
    });
  }

  ngOnInit(): void {
    // Server/client initial render: default menu order (no recency sort),
    // so SSR output and the client's pre-hydration render match exactly.
    this.subscription.add(
      this.menuService.getFlatMenu().subscribe((allItems) => {
        this.items = allItems;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
