import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-ip-cidr-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './ip-cidr-help.component.html',
  styleUrl: './ip-cidr-help.component.scss',
})
export class IpCidrHelpComponent {}
