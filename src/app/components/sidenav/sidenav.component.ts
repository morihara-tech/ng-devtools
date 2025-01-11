import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { TEXT, Text } from '../../../resources/texts/text';
import { SidemenuItemModel, SidemenuPersonModel } from '../sidemenu/sidemenu-model';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    SidemenuComponent,
    MatSidenavModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnChanges {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  @Input() toggle: boolean = false;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();

  text?: Text;
  sidemenuItems?: Array<SidemenuItemModel>;
  sidemenuPerson?: SidemenuPersonModel;

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

  constructor(
    // @Inject(ENVIRONMENT) env: Environment
  ) {
    this.init();
  }

  onClickMenu(): void {
    setTimeout(() => {
      if (!this.toggle) {
        this.toggleChange.emit(false);
        this.sidenav?.close();
      }
    }, 100);
  }

  private init(): void {
    // TODO locale
    TEXT('ja').subscribe(res => {
      this.text = res;
      this.setSidemenu();
    });
  }

  get mode(): MatDrawerMode {
    return (window.innerWidth < 600)
      ? 'over'
      : 'side';
  }

  private setSidemenu(): void {
    if (!this.text) {
      return;
    }
    this.sidemenuItems = [
      { icon: 'exposure_plus_1', label: this.text['ulidGenPage'], routerLink: '/ulid-generator' }
    ];
  }

}
