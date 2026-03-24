import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MenuService } from './menu.service';
import { PlatformService } from '../core/services/platform.service';

const STORAGE_KEY = 'recent_menus';
const MAX_RECENT = 50;

interface RecentEntry {
  routerLink: string;
  timestamp: number;
}

/**
 * Persists and retrieves recently-used menu item history.
 * Automatically tracks navigation to known menu routes via the Angular Router,
 * so all navigation methods (sidenav, menu page, dashboard card, direct URL)
 * are captured without requiring manual track() calls.
 */
@Injectable({
  providedIn: 'root',
})
export class RecentMenuService {
  private readonly platformService = inject(PlatformService);
  private readonly historySubject = new BehaviorSubject<RecentEntry[]>(this.loadHistory());

  /** Emits whenever the recent-menu history changes. */
  readonly history$ = this.historySubject.asObservable();

  constructor(router: Router, menuService: MenuService) {
    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects.split('?')[0];
        menuService
          .getFlatMenu()
          .pipe(take(1))
          .subscribe((items) => {
            const match = items.find((item) => item.routerLink === url);
            if (match) {
              this.trackInternal(url);
            }
          });
      });
  }

  /**
   * Returns a copy of the given items array sorted by the most recently used
   * router link first. Items with no recorded history appear last in their
   * original relative order.
   */
  sortByRecent<T extends { routerLink: string }>(items: T[]): T[] {
    const history = this.historySubject.getValue();
    const timestampMap = new Map<string, number>(
      history.map((h) => [h.routerLink, h.timestamp])
    );
    return [...items].sort((a, b) => {
      const ta = timestampMap.get(a.routerLink) ?? 0;
      const tb = timestampMap.get(b.routerLink) ?? 0;
      return tb - ta;
    });
  }

  private trackInternal(routerLink: string): void {
    const history = [...this.historySubject.getValue()];
    const existing = history.find((item) => item.routerLink === routerLink);
    if (existing) {
      existing.timestamp = Date.now();
    } else {
      history.push({ routerLink, timestamp: Date.now() });
      if (history.length > MAX_RECENT) {
        history.splice(0, history.length - MAX_RECENT);
      }
    }
    this.saveHistory(history);
    this.historySubject.next(history);
  }

  private loadHistory(): RecentEntry[] {
    try {
      const raw = this.platformService.localStorage?.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveHistory(history: RecentEntry[]): void {
    try {
      this.platformService.localStorage?.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage errors (e.g., private browsing quota)
    }
  }
}
