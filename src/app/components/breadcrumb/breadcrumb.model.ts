/** A single node in the resolved breadcrumb trail, ready for rendering. */
export interface BreadcrumbSegment {
  /** Display label. */
  name: string;
  /** Router link, when this node is navigable. Category nodes have no link. */
  routerLink?: string;
  /** Whether this node is the Home node (rendered via `appHomeLink`). */
  isHome: boolean;
  /** Whether this node is the current page (rendered as `<h1>`, not a link). */
  isCurrent: boolean;
}

/** A navigable ancestor node used when building a breadcrumb trail from route data. */
export interface BreadcrumbLink {
  /** Display label. */
  label: string;
  /** Router link for this ancestor. */
  routerLink: string;
}

/**
 * Route `data.breadcrumb` shape for pages not covered by `MENU_CATEGORIES`
 * (dashboard, guide, privacy-policy, operator-info, menu, articles list/detail).
 */
export interface RouteBreadcrumb {
  /** Current page label. Falls back to `route.data.title` when omitted (e.g. resolved article titles). */
  label?: string;
  /** Ancestor nodes inserted between Home and the current page. */
  parents?: BreadcrumbLink[];
}
