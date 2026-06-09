import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-help-section',
  imports: [
    MatIconModule,
  ],
  templateUrl: './help-section.component.html',
  styleUrl: './help-section.component.scss',
})
export class HelpSectionComponent {
  readonly icon = input.required<string>();
}
