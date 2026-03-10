import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { HeadingComponent } from '../../components/heading/heading.component';
import { MenuService } from '../../services/menu.service';
import { MenuCategory } from '../../../resources/menu/def/menu-def';

@Component({
  selector: 'app-menu-page',
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule,
    HeadingComponent,
  ],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss',
})
export class MenuPageComponent implements OnInit, OnDestroy {
  categories: MenuCategory[] = [];

  private subscription = new Subscription();

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.menuService.getMenuTree().subscribe((categories) => {
        this.categories = categories;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
