import { Component } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { JsonFormatterInputCardComponent } from './json-formatter-input-card/json-formatter-input-card.component';

@Component({
  selector: 'app-json-formatter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    JsonFormatterInputCardComponent,
  ],
  templateUrl: './json-formatter-page.component.html',
  styleUrl: './json-formatter-page.component.scss'
})
export class JsonFormatterPageComponent {

}
