import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-heading',
    imports: [
        CommonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    templateUrl: './heading.component.html',
    styleUrl: './heading.component.scss'
})
export class HeadingComponent {
  readonly headingType = input<'h1' | 'h2' | 'h3' | 'h4'>();
  readonly hintMessage = input<string>();
}
