import { Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JsonFormatterInputModel } from '../json-formatter-model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextViewerTableComponent } from '../../../components/text-viewer-table/text-viewer-table.component';

@Component({
  selector: 'app-json-formatter-output-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    HeadingComponent,
    TextViewerTableComponent,
  ],
  templateUrl: './json-formatter-output-card.component.html',
  styleUrl: './json-formatter-output-card.component.scss'
})
export class JsonFormatterOutputCardComponent {
  json: string = '';

  private snackBar = inject(MatSnackBar);

  format(input: JsonFormatterInputModel): void {
    // TODO Implement JSON formatting logic
    try {
      let parsed = JSON.parse(input.jsonString);
      if (input.isEscapeMode) {
        parsed = JSON.parse(parsed);
      }
      if (input.mode === 'format') {
        this.json = JSON.stringify(parsed, null, input.indentSpaceSize);
      } else {
        this.json = JSON.stringify(parsed);
      }
    } catch (e) {
      this.json = $localize`:@@page.json.formatter.errorMessage:無効なJSONです。`;
    }
  }

  onClickCopy(): void {
    if (!this.json) {
      return;
    }
    navigator.clipboard.writeText(this.json);
    this.snackBar.open($localize`:@@common.copiedMessage:コピーしました。`,
      $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
  }

}
