import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() topItem?: SidemenuItemModel;
  /** Category groups rendered as an accordion */
  @Input() categories?: SidemenuCategoryModel[];
  /**
   * Flat list of items rendered without accordion grouping.
   * Only used when `categories` is not provided.
   * @deprecated Pass `topItem` and `categories` instead.
   */
  @Input() items?: SidemenuItemModel[];
  @Input() person?: SidemenuPersonModel;
  @Output() clickMenu: EventEmitter<void> = new EventEmitter();
}
