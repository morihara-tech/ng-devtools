import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-url-encoder-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './url-encoder-help.component.html',
  styleUrl: './url-encoder-help.component.scss',
})
export class UrlEncoderHelpComponent {}
