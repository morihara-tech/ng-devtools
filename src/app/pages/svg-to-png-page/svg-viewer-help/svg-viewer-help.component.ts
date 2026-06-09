import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-svg-viewer-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './svg-viewer-help.component.html',
  styleUrl: './svg-viewer-help.component.scss',
})
export class SvgViewerHelpComponent {}
