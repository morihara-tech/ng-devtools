import { Component, ViewChild } from '@angular/core';
import { UlidGenInputCardComponent } from './ulid-gen-input-card/ulid-gen-input-card.component';
import { UlidGenOutputCardComponent } from './ulid-gen-output-card/ulid-gen-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { UlidGenInputModel } from './ulid-gen-model';

@Component({
    selector: 'app-ulid-gen-page',
    imports: [
        ApplicationPageTemplateComponent,
        HeadingComponent,
        UlidGenInputCardComponent,
        UlidGenOutputCardComponent,
    ],
    templateUrl: './ulid-gen-page.component.html',
    styleUrl: './ulid-gen-page.component.scss'
})
export class UlidGenPageComponent {
  @ViewChild('output') output?: UlidGenOutputCardComponent;

  onGenerate(input: UlidGenInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.generateUlid(input);
  }

}
