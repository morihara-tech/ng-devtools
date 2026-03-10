import { Injectable } from '@angular/core';

const STORAGE_KEY = 'recent_menus';
const MAX_RECENT = 50;

/** Persists and retrieves recently-used menu item history. */
@Injectable({
  providedIn: 'root',
})
export class RecentMenuService {
  /**
   * Records a visit to the given router link.
   * Updates the timestamp if the link already exists in history.
   */
  track(routerLink: string): void {
    const history = this.loadHistory();
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
  }

  /**
   * Returns a copy of the given items array sorted by the most recently used
   * router link first. Items with no recorded history appear last in their
   * original relative order.
   */
  sortByRecent<T extends { routerLink: string }>(items: T[]): T[] {
    const history = this.loadHistory();
    const timestampMap = new Map<string, number>(
      history.map((h) => [h.routerLink, h.timestamp])
    );
    return [...items].sort((a, b) => {
      const ta = timestampMap.get(a.routerLink) ?? 0;
      const tb = timestampMap.get(b.routerLink) ?? 0;
      return tb - ta;
    });
  }

  private loadHistory(): Array<{ routerLink: string; timestamp: number }> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveHistory(history: Array<{ routerLink: string; timestamp: number }>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage errors (e.g., private browsing quota)
    }
  }
}
