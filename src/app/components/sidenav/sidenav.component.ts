import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { TEXT, Text } from '../../../resources/texts/text';
import { SidemenuItemModel, SidemenuPersonModel } from '../sidemenu/sidemenu-model';
import { LocaleService } from '../locale/locale.service';
import { mergeMap } from 'rxjs';

@Component({
    selector: 'app-sidenav',
    imports: [
        SidemenuComponent,
        MatSidenavModule
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnChanges, OnInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  @Input() toggle: boolean = false;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();

  text?: Text;
  sidemenuItems?: Array<SidemenuItemModel>;
  sidemenuPerson?: SidemenuPersonModel;

  constructor(
    // @Inject(ENVIRONMENT) env: Environment
    private localeService: LocaleService,
  ) {
    this.init();
  }

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

  private init(): void {
    this.localeService.get()
      .pipe(mergeMap((locale) => TEXT(locale)))
      .subscribe((res) => {
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

  private setVhVariable(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
