import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-ulid-gen-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './ulid-gen-help.component.html',
  styleUrl: './ulid-gen-help.component.scss',
})
export class UlidGenHelpComponent {}
