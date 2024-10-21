import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderModel, PersonButtonMenuModel } from './header-model';
import { PersonButtonComponent } from './person-button/person-button.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PersonButtonComponent,
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

  constructor(
    private titleService: Title
  ) {}

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  get getTitle(): string {
    return this.titleService.getTitle();
  }

}
