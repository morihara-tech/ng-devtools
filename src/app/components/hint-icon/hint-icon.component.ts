import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { ClickableHintIconDirective } from './clickable-hint-icon.directive';

@Component({
    selector: 'app-hint-icon',
    imports: [
        MatIconModule,
        MatTooltipModule,
        ClickableHintIconDirective,
    ],
    templateUrl: './hint-icon.component.html',
    styleUrl: './hint-icon.component.scss'
})
export class HintIconComponent {
  readonly message = input('');
  readonly showDelay = input(100);
  readonly hideDelay = input(1000);
  readonly hintPosition = input<TooltipPosition>('below');
}
