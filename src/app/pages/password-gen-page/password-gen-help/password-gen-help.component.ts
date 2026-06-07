import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-password-gen-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './password-gen-help.component.html',
  styleUrl: './password-gen-help.component.scss',
})
export class PasswordGenHelpComponent {}
