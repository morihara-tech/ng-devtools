export interface SidemenuItemModel {
  label: string;
  icon?: string;
  svgIcon?: string;
  routerLink: string;
  /**
   * Marks this item as the app-root "Home" link. When set, the template
   * renders it with `appHomeLink` instead of `[routerLink]` (see
   * `HomeLinkDirective`) to avoid the trailing-slash root-path href issue —
   * mirrors `BreadcrumbSegment.isHome` in `breadcrumb.model.ts`. Unset/false
   * for every other item, including `topItem` (Dashboard), which now links
   * via its own `routerLink` like any other item.
   */
  isHome?: boolean;
}

export interface SidemenuCategoryModel {
  label: string;
  items: SidemenuItemModel[];
}

export interface SidemenuPersonModel {
  personName: string;
  // iconUrl?: string;
}
