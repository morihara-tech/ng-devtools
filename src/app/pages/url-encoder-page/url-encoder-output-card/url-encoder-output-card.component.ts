import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextViewerTableComponent } from '../../../components/text-viewer-table/text-viewer-table.component';
import { UrlEncoderInputModel } from '../url-encoder-model';

@Component({
  selector: 'app-url-encoder-output-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    HeadingComponent,
    TextViewerTableComponent,
  ],
  templateUrl: './url-encoder-output-card.component.html',
  styleUrl: './url-encoder-output-card.component.scss',
})
export class UrlEncoderOutputCardComponent {
  result: string = '';

  private readonly snackBar = inject(MatSnackBar);

  /**
   * Converts the input string using the selected mode and method.
   * Shows a snackbar error if decoding fails due to an invalid URI string.
   */
  convert(model: UrlEncoderInputModel): void {
    try {
      if (model.mode === 'encode') {
        this.result = model.method === 'encodeURIComponent'
          ? encodeURIComponent(model.input)
          : encodeURI(model.input);
      } else {
        this.result = model.method === 'encodeURIComponent'
          ? decodeURIComponent(model.input)
          : decodeURI(model.input);
      }
    } catch (error) {
      if (error instanceof URIError) {
        this.snackBar.open(
          $localize`:@@page.urlEncoder.error.decode:デコードに失敗しました。入力文字列を確認してください。`,
          $localize`:@@common.ok:はい`,
          { duration: 5000, horizontalPosition: 'start' }
        );
      }
    }
  }

  clear(): void {
    this.result = '';
  }

  onClickCopy(): void {
    if (!this.result) {
      return;
    }
    navigator.clipboard.writeText(this.result).then(() => {
      this.snackBar.open(
        $localize`:@@common.copiedMessage:コピーしました。`,
        $localize`:@@common.ok:はい`,
        { duration: 2000, horizontalPosition: 'start' }
      );
    }).catch(() => {
      this.snackBar.open(
        $localize`:@@common.copyError:コピーに失敗しました。`,
        $localize`:@@common.ok:はい`,
        { duration: 2000, horizontalPosition: 'start' }
      );
    });
  }
}
