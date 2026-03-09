import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { MenuCategoryDef, MenuItemDef } from '../../../resources/menu/def/menu-def';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    RouterModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnChanges, OnInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  @Input() toggle: boolean = false;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();

  dashboard!: MenuItemDef;
  categories!: MenuCategoryDef[];

  constructor(private menuService: MenuService) {}

  ngOnChanges(): void {
    if (!this.sidenav) {
      return;
    }
    if (this.toggle) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }

  ngOnInit(): void {
    this.dashboard = this.menuService.getDashboard();
    this.categories = this.menuService.getMenuTree();
    this.setVhVariable();
    window.addEventListener('resize', () => {
      this.setVhVariable();
    });
  }

  onClickMenu(): void {
    setTimeout(() => {
      if (!this.toggle) {
        this.toggleChange.emit(false);
        this.sidenav?.close();
      }
    }, 100);
  }

  get mode(): MatDrawerMode {
    return window.innerWidth < 600 ? 'over' : 'side';
  }

  private setVhVariable(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
