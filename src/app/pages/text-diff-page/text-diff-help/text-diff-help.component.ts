import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-text-diff-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './text-diff-help.component.html',
  styleUrl: './text-diff-help.component.scss',
})
export class TextDiffHelpComponent {}
