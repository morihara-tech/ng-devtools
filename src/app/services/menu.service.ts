import { Injectable } from '@angular/core';
import { MenuCategoryDef, MenuItemDef, MENU_CATEGORIES, MENU_DASHBOARD } from '../../resources/menu/def/menu-def';

/**
 * Provides menu tree and flat menu data derived from the central menu definitions.
 * Use this service in sidenav, dashboard card, and the /menu page.
 */
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  /**
   * Returns all tool categories with their items.
   * Use for the sidenav accordion and the /menu overview page.
   */
  getMenuTree(): MenuCategoryDef[] {
    return MENU_CATEGORIES;
  }

  /**
   * Returns a flat list of all tool items excluding the dashboard itself.
   * Use for the dashboard menu card.
   */
  getFlatMenu(): MenuItemDef[] {
    return MENU_CATEGORIES.flatMap((category) => category.items);
  }

  /** Returns the top-level dashboard menu item. */
  getDashboard(): MenuItemDef {
    return MENU_DASHBOARD;
  }
}
