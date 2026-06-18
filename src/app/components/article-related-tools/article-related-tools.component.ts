import { Component, computed, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../../resources/menu/def/menu-def';

/**
 * Renders links to tools related to an article. Articles and tools are not
 * 1:1 — a single article may reference multiple tools, and a tool may be
 * referenced by multiple articles.
 */
@Component({
  selector: 'app-article-related-tools',
  imports: [RouterModule, MatIconModule],
  templateUrl: './article-related-tools.component.html',
  styleUrl: './article-related-tools.component.scss',
})
export class ArticleRelatedToolsComponent {
  /** Router links (e.g. `/uuid-generator`) of tools related to the current article. */
  readonly routerLinks = input.required<string[]>();

  private readonly menuService = inject(MenuService);
  private readonly flatMenu = toSignal(this.menuService.getFlatMenu(), { initialValue: [] as MenuItem[] });

  readonly relatedTools = computed<MenuItem[]>(() => {
    const links = new Set(this.routerLinks());
    return this.flatMenu().filter((item) => links.has(item.routerLink));
  });
}
