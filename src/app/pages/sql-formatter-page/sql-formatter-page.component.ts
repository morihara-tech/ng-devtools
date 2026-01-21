import { Component } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { SqlFormatterInputCardComponent } from './sql-formatter-input-card/sql-formatter-input-card.component';

@Component({
  selector: 'app-sql-formatter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    SqlFormatterInputCardComponent,
  ],
  templateUrl: './sql-formatter-page.component.html',
  styleUrl: './sql-formatter-page.component.scss'
})
export class SqlFormatterPageComponent {

}
