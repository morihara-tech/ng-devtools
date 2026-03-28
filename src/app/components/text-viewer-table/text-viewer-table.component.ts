import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TextViewerTableModel } from './text-viewer-table-model';

@Component({
    selector: 'app-text-viewer-table',
    imports: [
        NgClass,
        MatTableModule,
    ],
    templateUrl: './text-viewer-table.component.html',
    styleUrl: './text-viewer-table.component.scss'
})
export class TextViewerTableComponent {
  readonly value = input<string>();
  /** When true, long lines wrap and the line-number column is top-aligned.
   *  When false, lines do not wrap and the content scrolls horizontally. */
  readonly wordWrap = input(false);
  /** Maps 1-based line numbers to CSS class names for row background highlights. */
  readonly rowHighlights = input<Record<number, string>>();

  readonly displayedColumns: string[] = ['position', 'line'];

  readonly valueModels = computed<TextViewerTableModel[]>(() => {
    const val = this.value();
    if (!val) {
      return [{ position: 1, line: '' }];
    }
    const models = val.split('\n')
      .map((line, i) => ({ position: i + 1, line: line }));
    if (models.slice(-1)[0].line === '') {
      models.pop();
    }
    return models;
  });
}
