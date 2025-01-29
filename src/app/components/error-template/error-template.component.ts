import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Text } from '../../../resources/texts/text';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-error-template',
    imports: [
        MatCardModule,
        MatButtonModule,
        RouterModule,
    ],
    templateUrl: './error-template.component.html',
    styleUrl: './error-template.component.scss'
})
export class ErrorTemplateComponent {
  @Input() text?: Text;
  @Input() titleTextId?: string;
}
