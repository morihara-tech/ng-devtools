import { Component, input, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SidemenuCategoryModel, SidemenuItemModel, SidemenuPersonModel } from './sidemenu-model';

@Component({
  selector: 'app-sidemenu',
  imports: [
    RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss',
})
export class SidemenuComponent {
  /** Single top-level item rendered outside the accordion (e.g. Dashboard) */
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
  readonly clickMenu = output<void>();
}
