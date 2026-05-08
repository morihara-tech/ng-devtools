import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextViewerTableComponent } from '../../../components/text-viewer-table/text-viewer-table.component';
import { PlatformService } from '../../../core/services/platform.service';
import { ApiKeyFormat, ApiKeyGenInputModel } from '../api-key-gen-model';

@Component({
  selector: 'app-api-key-gen-output-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
    HeadingComponent,
    TextViewerTableComponent,
  ],
  templateUrl: './api-key-gen-output-card.component.html',
  styleUrl: './api-key-gen-output-card.component.scss'
})
export class ApiKeyGenOutputCardComponent {
  apiKeyStrings?: string;
  private readonly base62Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private readonly snackBar = inject(MatSnackBar);
  private readonly platformService = inject(PlatformService);
  private apiKeys: string[] = [];

  generateApiKeys(input: ApiKeyGenInputModel): void {
    this.apiKeys = this.makeApiKeys(input);
    this.apiKeyStrings = this.apiKeys.join('\n');
  }

  onClickCopyAsPlain(): void {
    this.copyToClipboard(this.apiKeys.join('\n'));
  }

  onClickCopyAsMcpConfig(): void {
    const mcpConfig = this.apiKeys
      .map((apiKey) => JSON.stringify({ env: { API_KEY: apiKey } }))
      .join('\n');
    this.copyToClipboard(mcpConfig);
  }

  onClickCopyAsEnv(): void {
    const envText = this.apiKeys
      .map((apiKey) => `API_KEY=${apiKey}`)
      .join('\n');
    this.copyToClipboard(envText);
  }

  onClickDownload(): void {
    if (!this.apiKeys.length || !this.platformService.window) {
      return;
    }

    const downloadName = this.buildDownloadFileName(this.apiKeys[0]);
    const blob = new Blob([this.apiKeys.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = this.platformService.nativeDocument.createElement('a');
    link.href = url;
    link.download = downloadName;
    link.click();
    URL.revokeObjectURL(url);

    this.snackBar.open($localize`:@@page.apiKey.card.output.downloaded:ダウンロードしました。`,
      $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
  }

  private copyToClipboard(text: string): void {
    if (!text || !this.platformService.window?.navigator.clipboard) {
      return;
    }
    this.platformService.window.navigator.clipboard.writeText(text);
    this.snackBar.open($localize`:@@common.copiedMessage:コピーしました。`,
      $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
  }

  private makeApiKeys(input: ApiKeyGenInputModel): string[] {
    const results: string[] = [];
    const normalizedPrefix = input.prefix.trim();

    for (let i = 0; i < input.count; i++) {
      const keyBody = this.generateApiKey(input.format, input.length);
      const fullKey = normalizedPrefix ? `${normalizedPrefix}_${keyBody}` : keyBody;
      results.push(fullKey);
    }
    return results;
  }

  private generateApiKey(format: ApiKeyFormat, length: number): string {
    switch (format) {
      case 'hex':
        return this.generateHexString(length);
      case 'uuid-v4':
        return this.generateUuidV4();
      case 'base62':
      default:
        return this.generateBase62String(length);
    }
  }

  private generateBase62String(length: number): string {
    const win = this.platformService.window;
    if (!win) {
      return '';
    }

    const base62Length = this.base62Characters.length;
    const maxRandomValue = 248;
    let value = '';

    while (value.length < length) {
      const randomBytes = new Uint8Array(Math.max(length * 2, 16));
      win.crypto.getRandomValues(randomBytes);

      for (const randomByte of randomBytes) {
        if (randomByte >= maxRandomValue) {
          continue;
        }

        value += this.base62Characters[randomByte % base62Length];
        if (value.length === length) {
          break;
        }
      }
    }

    return value;
  }

  private generateHexString(length: number): string {
    const win = this.platformService.window;
    if (!win) {
      return '';
    }

    const randomBytes = new Uint8Array(Math.ceil(length / 2));
    win.crypto.getRandomValues(randomBytes);

    return Array.from(randomBytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length);
  }

  private generateUuidV4(): string {
    const win = this.platformService.window;
    if (!win) {
      return '';
    }

    const randomBytes = new Uint8Array(16);
    win.crypto.getRandomValues(randomBytes);

    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

    const hexParts = Array.from(randomBytes).map((byte) => byte.toString(16).padStart(2, '0'));
    return `${hexParts.slice(0, 4).join('')}-${hexParts.slice(4, 6).join('')}-${hexParts.slice(6, 8).join('')}-${hexParts.slice(8, 10).join('')}-${hexParts.slice(10, 16).join('')}`;
  }

  private buildDownloadFileName(firstApiKey: string): string {
    const prefixMatch = firstApiKey.match(/^([A-Za-z0-9_-]+)_/);
    const prefix = prefixMatch ? prefixMatch[1] : '';
    const date = new Date();
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');

    return prefix ? `api-keys-${prefix}-${yyyy}${mm}${dd}.txt` : `api-keys-${yyyy}${mm}${dd}.txt`;
  }
}
