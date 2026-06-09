import { Component, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UlidGenInputCardComponent } from './ulid-gen-input-card/ulid-gen-input-card.component';
import { UlidGenOutputCardComponent } from './ulid-gen-output-card/ulid-gen-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { UlidGenInputModel } from './ulid-gen-model';
import { UlidGenHelpComponent } from './ulid-gen-help/ulid-gen-help.component';

@Component({
    selector: 'app-ulid-gen-page',
    imports: [
        ApplicationPageTemplateComponent,
        HeadingComponent,
        UlidGenInputCardComponent,
        UlidGenOutputCardComponent,
        UlidGenHelpComponent,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './ulid-gen-page.component.html',
    styleUrl: './ulid-gen-page.component.scss'
})
export class UlidGenPageComponent {
  private readonly output = viewChild<UlidGenOutputCardComponent>('output');

  onGenerate(input: UlidGenInputModel): void {
    this.output()?.generateUlid(input);
  }
}
