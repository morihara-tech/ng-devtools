import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TextViewerTableModel } from './text-viewer-table-model';

@Component({
    selector: 'app-text-viewer-table',
    imports: [
        MatTableModule,
    ],
    templateUrl: './text-viewer-table.component.html',
    styleUrl: './text-viewer-table.component.scss'
})
export class TextViewerTableComponent {
  @Input() value?: string;
  /** When true, long lines wrap and the line-number column is top-aligned.
   *  When false, lines do not wrap and the content scrolls horizontally. */
  @Input() wordWrap: boolean = false;

  displayedColumns: string[] = ['position', 'line'];

  get valueModels(): TextViewerTableModel[] {
    if (!this.value) {
      return [{ position: 1, line: '' }];
    }
    const models = this.value.split('\n')
      .map((line, i) => ({ position: i + 1, line: line }));
    if (models.slice(-1)[0].line === '') {
      models.pop();
    }
    return models;
  }
}
