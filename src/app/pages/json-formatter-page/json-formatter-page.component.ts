import { Component, ViewChild } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { JsonFormatterInputCardComponent } from './json-formatter-input-card/json-formatter-input-card.component';
import { JsonFormatterOutputCardComponent } from './json-formatter-output-card/json-formatter-output-card.component';
import { JsonFormatterInputModel } from './json-formatter-model';

@Component({
  selector: 'app-json-formatter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    JsonFormatterInputCardComponent,
    JsonFormatterOutputCardComponent,
  ],
  templateUrl: './json-formatter-page.component.html',
  styleUrl: './json-formatter-page.component.scss'
})
export class JsonFormatterPageComponent {
  @ViewChild('output') output?: JsonFormatterOutputCardComponent;

  onFormat(input: JsonFormatterInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.format(input);
  }

}
