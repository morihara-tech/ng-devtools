import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SidemenuItemModel, SidemenuPersonModel } from './sidemenu-model';

@Component({
    selector: 'app-sidemenu',
    imports: [
        RouterModule,
        MatIconModule,
        MatListModule
    ],
    templateUrl: './sidemenu.component.html',
    styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  @Input() items?: Array<SidemenuItemModel>;
  @Input() person?: SidemenuPersonModel;
  @Output() clickMenu: EventEmitter<void> = new EventEmitter();

  constructor() {}

}
