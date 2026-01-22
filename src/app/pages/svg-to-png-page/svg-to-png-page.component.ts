import { Component, ViewChild } from '@angular/core';
import { SvgToPngInputCardComponent } from './svg-to-png-input-card/svg-to-png-input-card.component';
import { SvgToPngOutputCardComponent } from './svg-to-png-output-card/svg-to-png-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { SvgToPngSettingsModel, DEFAULT_SVG_TO_PNG_SETTINGS } from './svg-to-png-model';

@Component({
  selector: 'app-svg-to-png-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    SvgToPngInputCardComponent,
    SvgToPngOutputCardComponent,
  ],
  templateUrl: './svg-to-png-page.component.html',
  styleUrl: './svg-to-png-page.component.scss'
})
export class SvgToPngPageComponent {
  @ViewChild('output') output?: SvgToPngOutputCardComponent;
  @ViewChild('input') input?: SvgToPngInputCardComponent;

  currentSettings: SvgToPngSettingsModel = { ...DEFAULT_SVG_TO_PNG_SETTINGS };
  currentSvgCode: string = '';

  ngAfterViewInit(): void {
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
    if (!this.output || !this.input) {
      return;
    }
    const svgCode = this.input.getSvgCode();
    this.output.updatePreview(svgCode, this.currentSettings);
  }
}
