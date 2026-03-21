import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { SidemenuCategoryModel, SidemenuItemModel } from '../sidemenu/sidemenu-model';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    SidemenuComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  @Input() toggle: boolean = false;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();

  topItem?: SidemenuItemModel;
  categories?: SidemenuCategoryModel[];

  private subscriptions = new Subscription();

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
    this.subscriptions.add(
      this.menuService.getDashboard().subscribe((item) => {
        this.topItem = item;
      })
    );
    this.subscriptions.add(
      this.menuService.getMenuTree().subscribe((categories) => {
        this.categories = categories;
      })
    );
    this.setVhVariable();
    window.addEventListener('resize', () => {
      this.setVhVariable();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
