import { Component, input, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SidemenuCategoryModel, SidemenuItemModel, SidemenuPersonModel } from './sidemenu-model';
import { HomeLinkDirective } from '../locale/home-link.directive';

@Component({
  selector: 'app-sidemenu',
  imports: [
    RouterModule,
    HomeLinkDirective,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss',
})
export class SidemenuComponent {
  /**
   * Single top-level item rendered outside the accordion (e.g. Dashboard).
   * Always links to the app root, so the template renders it with
   * `appHomeLink` rather than `top.routerLink` (see HomeLinkDirective).
   */
  readonly topItem = input<SidemenuItemModel>();
  /** Category groups rendered as an accordion */
  readonly categories = input<SidemenuCategoryModel[]>();
  /**
   * Flat list of items rendered without accordion grouping.
   * Only used when `categories` is not provided.
   * @deprecated Pass `topItem` and `categories` instead.
   */
  readonly items = input<SidemenuItemModel[]>();
  readonly person = input<SidemenuPersonModel>();
  /** Items rendered at the bottom of the sidenav (e.g. Articles, Privacy Policy) */
  readonly bottomItems = input<SidemenuItemModel[]>();
  readonly clickMenu = output<void>();
}
