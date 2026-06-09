import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-uuid-gen-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './uuid-gen-help.component.html',
  styleUrl: './uuid-gen-help.component.scss',
})
export class UuidGenHelpComponent {}
