import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Text } from '../../../resources/texts/text';

@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './heading.component.html',
  styleUrl: './heading.component.scss'
})
export class HeadingComponent {
  @Input() text?: Text;
  @Input() headingType?: 'h1' | 'h2' | 'h3' | 'h4';
  @Input() hintMessageTextId?: string;
}
