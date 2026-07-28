import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { HomeLinkDirective } from '../locale/home-link.directive';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { StructuredDataService } from '../../core/services/structured-data.service';
import { BreadcrumbSegment } from './breadcrumb.model';

/**
 * Site-wide breadcrumb trail, mounted once in `AppComponent` so every page
 * (including `dashboard-page`/`menu-page`, which don't use
 * `ApplicationPageTemplateComponent`) gets it automatically.
 *
 * The trail's last node doubles as the page's `<h1>` — see
 * `docs/core/tech/incident-report-indexing.md` for why every page needs
 * exactly one `<h1>` and why a breadcrumb, rather than a bare heading, was
 * chosen to host it.
 */
@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, HomeLinkDirective],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly structuredDataService = inject(StructuredDataService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly navLabel = $localize`:@@breadcrumb.nav.label:パンくずリスト`;

  protected readonly segments = signal<BreadcrumbSegment[]>([]);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        const url = this.router.url;
        const path = url.split('?')[0].split('#')[0];
        const resolved = this.breadcrumbService.resolve(path, data);
        this.segments.set(resolved);
        this.structuredDataService.setBreadcrumbList(resolved);
      });
  }
}
