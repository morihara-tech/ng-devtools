import { Component, Input } from '@angular/core';
import { Text } from '../../../../resources/texts/text';
import { MatCardModule } from '@angular/material/card';
import { HeadingComponent } from '../../../components/heading/heading.component';

@Component({
  selector: 'app-ulid-gen-output-card',
  standalone: true,
  imports: [
    MatCardModule,
    HeadingComponent,
  ],
  templateUrl: './ulid-gen-output-card.component.html',
  styleUrl: './ulid-gen-output-card.component.scss'
})
export class UlidGenOutputCardComponent {
  @Input() text?: Text;

}
