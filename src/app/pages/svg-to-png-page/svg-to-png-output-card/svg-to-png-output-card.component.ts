import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { SvgToPngSettingsModel } from '../svg-to-png-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-svg-to-png-output-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    HeadingComponent,
  ],
  templateUrl: './svg-to-png-output-card.component.html',
  styleUrl: './svg-to-png-output-card.component.scss'
})
export class SvgToPngOutputCardComponent {
  @ViewChild('canvas', { static: false }) canvasElement?: ElementRef<HTMLCanvasElement>;
  
  svgCode: string = '';
  settings: SvgToPngSettingsModel = {
    canvasWidth: 500,
    canvasHeight: 500,
    transparent: false,
    backgroundColor: '#ffffff',
    scale: 100,
    offsetX: 0,
    offsetY: 0,
  };
  safeHtml?: SafeHtml;

  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  updatePreview(svgCode: string, settings: SvgToPngSettingsModel): void {
    this.svgCode = svgCode;
    this.settings = settings;
    
    if (this.svgCode) {
      this.safeHtml = this.sanitizer.sanitize(1, this.svgCode) as SafeHtml;
    } else {
      this.safeHtml = undefined;
    }
  }

  onClickCopy(): void {
    if (!this.svgCode) {
      return;
    }
    navigator.clipboard.writeText(this.svgCode);
    this.snackBar.open($localize`:@@common.copiedMessage:コピーしました。`,
      $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
  }

  async onClickDownload(): Promise<void> {
    if (!this.svgCode) {
      return;
    }

    try {
      const pngDataUrl = await this.convertSvgToPng();
      const link = document.createElement('a');
      const timestamp = new Date().getTime();
      link.download = `svg-image-${timestamp}.png`;
      link.href = pngDataUrl;
      link.click();
      
      this.snackBar.open($localize`:@@page.svgToPng.card.output.downloaded:ダウンロードしました。`,
        $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
    } catch (error) {
      console.error('Failed to convert SVG to PNG:', error);
      this.snackBar.open($localize`:@@page.svgToPng.card.output.downloadError:ダウンロードに失敗しました。`,
        $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
    }
  }

  get canvasStyle(): { [key: string]: string } {
    return {
      'width': `${this.settings.canvasWidth}px`,
      'height': `${this.settings.canvasHeight}px`,
      'background-color': this.settings.transparent ? 'transparent' : this.settings.backgroundColor,
    };
  }

  get svgStyle(): { [key: string]: string } {
    const scaleValue = this.settings.scale / 100;
    return {
      'transform': `translate(${this.settings.offsetX}px, ${this.settings.offsetY}px) scale(${scaleValue})`,
      'transform-origin': 'top left',
    };
  }

  private async convertSvgToPng(): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = this.settings.canvasWidth;
      canvas.height = this.settings.canvasHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      if (!this.settings.transparent) {
        ctx.fillStyle = this.settings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const svgBlob = new Blob([this.svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const scaleValue = this.settings.scale / 100;
        const scaledWidth = img.width * scaleValue;
        const scaledHeight = img.height * scaleValue;
        
        ctx.drawImage(
          img,
          this.settings.offsetX,
          this.settings.offsetY,
          scaledWidth,
          scaledHeight
        );
        
        URL.revokeObjectURL(url);
        const pngDataUrl = canvas.toDataURL('image/png');
        resolve(pngDataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };

      img.src = url;
    });
  }
}
