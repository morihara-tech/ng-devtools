import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SvgToPngInputCardComponent } from './svg-to-png-input-card/svg-to-png-input-card.component';
import { SvgToPngOutputCardComponent } from './svg-to-png-output-card/svg-to-png-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HelpDrawerService } from '../../services/help-drawer.service';
import { SvgToPngSettingsModel, DEFAULT_SVG_TO_PNG_SETTINGS } from './svg-to-png-model';
import { SvgViewerHelpComponent } from './svg-viewer-help/svg-viewer-help.component';

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
export class SvgToPngPageComponent {
  private readonly outputCard = viewChild<SvgToPngOutputCardComponent>('output');
  private readonly inputCard = viewChild<SvgToPngInputCardComponent>('input');
  private readonly helpDrawerService = inject(HelpDrawerService);

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

  onOpenHelp(content: TemplateRef<unknown>): void {
    this.helpDrawerService.open(content);
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
