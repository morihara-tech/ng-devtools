import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PersonButtonMenuModel, PersonButtonModel } from '../header-model';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-person-button',
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatIconModule
    ],
    templateUrl: './person-button.component.html',
    styleUrl: './person-button.component.scss'
})
export class PersonButtonComponent {
  @Input() person?: PersonButtonModel;
  @Output() clickMenu: EventEmitter<PersonButtonMenuModel> = new EventEmitter();

  constructor() { }

}
