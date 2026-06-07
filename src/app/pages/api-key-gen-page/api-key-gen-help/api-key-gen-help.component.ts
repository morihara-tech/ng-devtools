import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-api-key-gen-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './api-key-gen-help.component.html',
  styleUrl: './api-key-gen-help.component.scss',
})
export class ApiKeyGenHelpComponent {}
