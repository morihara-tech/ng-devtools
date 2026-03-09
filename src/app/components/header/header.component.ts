import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderModel, PersonButtonMenuModel } from './header-model';
import { PersonButtonComponent } from './person-button/person-button.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LanguageButtonComponent } from './language-button/language-button.component';
import { filter, map, mergeMap } from 'rxjs';

@Component({
    selector: 'app-header',
    imports: [
        PersonButtonComponent,
        LanguageButtonComponent,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() model?: HeaderModel;
  @Output() toggleMenu: EventEmitter<void> = new EventEmitter();
  @Output() clickPersonContext: EventEmitter<PersonButtonMenuModel> = new EventEmitter();

  title?: string;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.initTitle();
  }

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  get getTitle(): string {
    if (this.title) {
      return this.title;
    }
    return $localize`:@@app.title:devTools`;
  }

  private initTitle(): void {
    this.route.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe((event) => {
      this.title = event['title'];
    });
  }

}
