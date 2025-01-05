import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TextViewerTableModel } from './text-viewer-table-model';

@Component({
  selector: 'app-text-viewer-table',
  standalone: true,
  imports: [
    MatTableModule,
  ],
  templateUrl: './text-viewer-table.component.html',
  styleUrl: './text-viewer-table.component.scss'
})
export class TextViewerTableComponent {
  @Input() value?: string;

  displayedColumns: string[] = ['position', 'line'];

  get valueModels(): TextViewerTableModel[] {
    if (!this.value) {
      return [];
    }
    const models = this.value.split('\n')
      .map((line, i) => ({ position: i + 1, line: line }));
    if (models.slice(-1)[0].line === '') {
      models.pop();
    }
    return models;
  }
}
