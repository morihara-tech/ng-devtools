import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-json-formatter-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './json-formatter-help.component.html',
  styleUrl: './json-formatter-help.component.scss',
})
export class JsonFormatterHelpComponent {}
