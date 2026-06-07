import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HelpSectionComponent } from '../../../components/help-section/help-section.component';

@Component({
  selector: 'app-color-palette-help',
  imports: [
    MatDividerModule,
    HelpSectionComponent,
  ],
  templateUrl: './color-palette-help.component.html',
  styleUrl: './color-palette-help.component.scss',
})
export class ColorPaletteHelpComponent {}
