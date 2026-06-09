import { Component, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { UuidGenInputCardComponent } from './uuid-gen-input-card/uuid-gen-input-card.component';
import { UuidGenOutputCardComponent } from './uuid-gen-output-card/uuid-gen-output-card.component';
import { UuidGenInputModel } from './uuid-gen-model';
import { UuidGenHelpComponent } from './uuid-gen-help/uuid-gen-help.component';

@Component({
  selector: 'app-uuid-gen-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UuidGenInputCardComponent,
    UuidGenOutputCardComponent,
    UuidGenHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './uuid-gen-page.component.html',
  styleUrl: './uuid-gen-page.component.scss'
})
export class UuidGenPageComponent {
  private readonly output = viewChild<UuidGenOutputCardComponent>('output');

  onGenerate(input: UuidGenInputModel): void {
    this.output()?.generateUuid(input);
  }
}
