import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { MenuService } from '../../services/menu.service';
import { MenuCategoryDef } from '../../../resources/menu/def/menu-def';

@Component({
  selector: 'app-menu-page',
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule,
    ApplicationPageTemplateComponent,
    HeadingComponent,
  ],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss',
})
export class MenuPageComponent {
  readonly categories: MenuCategoryDef[];

  constructor(menuService: MenuService) {
    this.categories = menuService.getMenuTree();
  }
}
