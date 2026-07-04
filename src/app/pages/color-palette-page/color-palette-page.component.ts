import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ColorPaletteInputCardComponent } from './color-palette-input-card/color-palette-input-card.component';
import { ColorPaletteOutputCardComponent } from './color-palette-output-card/color-palette-output-card.component';
import { ColorPaletteInputModel } from './color-palette-model';
import { ColorPaletteHelpComponent } from './color-palette-help/color-palette-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-color-palette-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    ColorPaletteInputCardComponent,
    ColorPaletteOutputCardComponent,
    ColorPaletteHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './color-palette-page.component.html',
  styleUrl: './color-palette-page.component.scss',
})
export class ColorPalettePageComponent implements OnInit, OnDestroy {
  private readonly outputCard = viewChild<ColorPaletteOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.colorPaletteTool.title:カラーパレット生成ツール（配色比較・グラデーション作成）`,
      description: $localize`:@@page.colorPalette.description:カラーコードを並べて比較したり、2色間のグラデーションを生成できる無料ツールです。配色案の検討やCSSグラデーションの確認にそのままブラウザで使えます。`,
      routerLink: '/color-palette',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  onGenerate(input: ColorPaletteInputModel): void {
    this.outputCard()?.renderPalette(input);
  }
}
