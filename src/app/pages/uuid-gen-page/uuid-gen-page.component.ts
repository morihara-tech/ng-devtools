import { Component, ViewChild } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { UuidGenInputCardComponent } from './uuid-gen-input-card/uuid-gen-input-card.component';
import { UuidGenOutputCardComponent } from './uuid-gen-output-card/uuid-gen-output-card.component';
import { UuidGenInputModel } from './uuid-gen-model';

@Component({
  selector: 'app-uuid-gen-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UuidGenInputCardComponent,
    UuidGenOutputCardComponent,
  ],
  templateUrl: './uuid-gen-page.component.html',
  styleUrl: './uuid-gen-page.component.scss'
})
export class UuidGenPageComponent {
  @ViewChild('output') output?: UuidGenOutputCardComponent;

  onGenerate(input: UuidGenInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.generateUuid(input);
  }

}
