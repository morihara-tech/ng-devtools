import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { MENU_CATEGORIES } from '../../../resources/menu/def/menu-def';
import { BreadcrumbSegment, RouteBreadcrumb } from '../../components/breadcrumb/breadcrumb.model';

/** Home node label, shared by every trail (either as an ancestor link or, on the dashboard, as the current page). */
const HOME_LABEL = $localize`:@@breadcrumb.home:ホーム`;

/**
 * Resolves the breadcrumb trail (and, implicitly, the `<h1>` page title) for
 * the current leaf route.
 *
 * Three resolution strategies, tried in order:
 * 1. The dashboard (`path === '/'`) — a single Home node, marked current.
 * 2. Any route registered as a `MenuItem` under `MENU_CATEGORIES` — trail is
 *    `Home > category > current page`, mirroring `AppComponent.setMetaDescription()`'s
 *    existing `routerLink` lookup.
 * 3. Everything else (guide/privacy-policy/operator-info/menu/articles) — resolved
 *    from `route.data.breadcrumb` (see `RouteBreadcrumb`).
 */
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  /** Builds the breadcrumb trail for the leaf route at `path`, given its resolved `data`. */
  resolve(path: string, data: Data): BreadcrumbSegment[] {
    const home: BreadcrumbSegment = { name: HOME_LABEL, routerLink: '/', isHome: true, isCurrent: false };

    if (path === '/') {
      const breadcrumb = data['breadcrumb'] as RouteBreadcrumb | undefined;
      return [{ ...home, name: breadcrumb?.label ?? HOME_LABEL, isCurrent: true }];
    }

    const category = MENU_CATEGORIES.find((cat) => cat.items.some((item) => item.routerLink === path));
    if (category) {
      const item = category.items.find((it) => it.routerLink === path)!;
      return [
        home,
        { name: category.label, routerLink: undefined, isHome: false, isCurrent: false },
        { name: item.label, routerLink: path, isHome: false, isCurrent: true },
      ];
    }

    const breadcrumb = data['breadcrumb'] as RouteBreadcrumb | undefined;
    const parents: BreadcrumbSegment[] = (breadcrumb?.parents ?? []).map((parent) => ({
      name: parent.label,
      routerLink: parent.routerLink,
      isHome: false,
      isCurrent: false,
    }));
    const currentLabel = breadcrumb?.label ?? (data['title'] as string | undefined) ?? '';

    return [
      home,
      ...parents,
      { name: currentLabel, routerLink: path, isHome: false, isCurrent: true },
    ];
  }
}
