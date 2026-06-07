import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-sql-formatter-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './sql-formatter-help.component.html',
  styleUrl: './sql-formatter-help.component.scss',
})
export class SqlFormatterHelpComponent {}
