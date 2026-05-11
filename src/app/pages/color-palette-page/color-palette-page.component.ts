import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HelpDrawerService } from '../../services/help-drawer.service';
import { ColorPaletteInputCardComponent } from './color-palette-input-card/color-palette-input-card.component';
import { ColorPaletteOutputCardComponent } from './color-palette-output-card/color-palette-output-card.component';
import { ColorPaletteInputModel } from './color-palette-model';

@Component({
  selector: 'app-color-palette-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    ColorPaletteInputCardComponent,
    ColorPaletteOutputCardComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './color-palette-page.component.html',
  styleUrl: './color-palette-page.component.scss',
})
export class ColorPalettePageComponent {
  private readonly outputCard = viewChild<ColorPaletteOutputCardComponent>('output');
  private readonly helpDrawerService = inject(HelpDrawerService);

  onGenerate(input: ColorPaletteInputModel): void {
    this.outputCard()?.renderPalette(input);
  }

  onOpenHelp(content: TemplateRef<unknown>): void {
    this.helpDrawerService.open(content);
  }
}
