import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { HyperLinkTextComponent } from '../../../components/hyper-link-text/hyper-link-text.component';

@Component({
  selector: 'app-menu-card',
  imports: [
    RouterModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    HyperLinkTextComponent,
  ],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.scss'
})
export class MenuCardComponent {

}
