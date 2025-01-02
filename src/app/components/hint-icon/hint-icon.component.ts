import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { ClickableHintIconDirective } from './clickable-hint-icon.directive';

@Component({
  selector: 'app-hint-icon',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    ClickableHintIconDirective,
  ],
  templateUrl: './hint-icon.component.html',
  styleUrl: './hint-icon.component.scss'
})
export class HintIconComponent {
  @Input() message: string = '';
  @Input() showDelay: number = 100;
  @Input() hideDelay: number = 1000;
  @Input() hintPosition: TooltipPosition = 'below';

}
