import { AfterViewInit, Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SvgToPngInputCardComponent } from './svg-to-png-input-card/svg-to-png-input-card.component';
import { SvgToPngOutputCardComponent } from './svg-to-png-output-card/svg-to-png-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { SvgToPngSettingsModel, DEFAULT_SVG_TO_PNG_SETTINGS } from './svg-to-png-model';
import { SvgViewerHelpComponent } from './svg-viewer-help/svg-viewer-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-svg-to-png-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    SvgToPngInputCardComponent,
    SvgToPngOutputCardComponent,
    SvgViewerHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './svg-to-png-page.component.html',
  styleUrl: './svg-to-png-page.component.scss'
})
export class SvgToPngPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly outputCard = viewChild<SvgToPngOutputCardComponent>('output');
  private readonly inputCard = viewChild<SvgToPngInputCardComponent>('input');
  private readonly structuredDataService = inject(StructuredDataService);

  currentSettings: SvgToPngSettingsModel = { ...DEFAULT_SVG_TO_PNG_SETTINGS };
  currentSvgCode: string = '';

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.svgToPngTool.title:SVGビューアー・PNG変換ツール（SVGプレビュー＆画像変換）`,
      description: $localize`:@@page.svgToPng.description:SVGファイルをブラウザ上でプレビューしながらPNG画像に変換できる無料ツールです。アイコンやロゴをラスター画像として書き出したいときにそのまま使えます。`,
      routerLink: '/svg-to-png',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  ngAfterViewInit(): void {
    this.structuredDataService.addFaqPageFromDom();
    setTimeout(() => {
      this.updatePreview();
    }, 100);
  }

  onSettingsChange(settings: SvgToPngSettingsModel): void {
    this.currentSettings = settings;
    this.updatePreview();
  }

  onSvgCodeChange(svgCode: string): void {
    this.currentSvgCode = svgCode;
    this.updatePreview();
  }


  private updatePreview(): void {
    const output = this.outputCard();
    const input = this.inputCard();
    if (!output || !input) {
      return;
    }
    const svgCode = input.getSvgCode();
    output.updatePreview(svgCode, this.currentSettings);
  }
}
