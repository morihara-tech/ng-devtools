import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { JsonFormatterInputCardComponent } from './json-formatter-input-card/json-formatter-input-card.component';
import { JsonFormatterHelpComponent } from './json-formatter-help/json-formatter-help.component';

@Component({
  selector: 'app-json-formatter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    JsonFormatterInputCardComponent,
    JsonFormatterHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './json-formatter-page.component.html',
  styleUrl: './json-formatter-page.component.scss'
})
export class JsonFormatterPageComponent {}
