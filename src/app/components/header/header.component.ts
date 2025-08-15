import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderModel, PersonButtonMenuModel } from './header-model';
import { PersonButtonComponent } from './person-button/person-button.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { LanguageButtonComponent } from './language-button/language-button.component';
import { Text } from '../../../resources/texts/text';

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
  @Input() text?: Text;
  @Input() model?: HeaderModel;
  @Output() toggleMenu: EventEmitter<void> = new EventEmitter();
  @Output() clickPersonContext: EventEmitter<PersonButtonMenuModel> = new EventEmitter();

  constructor(
    private titleService: Title
  ) {}

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  get getTitle(): string {
    if (this.text) {
      return this.text['appTitle'];
    }
    return this.titleService.getTitle();
  }

}
