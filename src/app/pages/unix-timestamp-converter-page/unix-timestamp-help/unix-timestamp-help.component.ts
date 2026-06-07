import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-unix-timestamp-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './unix-timestamp-help.component.html',
  styleUrl: './unix-timestamp-help.component.scss',
})
export class UnixTimestampHelpComponent {}
