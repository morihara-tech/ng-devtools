import { Component, Input, inject } from '@angular/core';
import { Text } from '../../../../resources/texts/text';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextViewerTableComponent } from '../../../components/text-viewer-table/text-viewer-table.component';
import { UlidGenInputModel } from '../ulid-gen-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { factory, monotonicFactory } from 'ulid';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-ulid-gen-output-card',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatTooltipModule,
        HeadingComponent,
        TextViewerTableComponent,
    ],
    templateUrl: './ulid-gen-output-card.component.html',
    styleUrl: './ulid-gen-output-card.component.scss'
})
export class UlidGenOutputCardComponent {
  @Input() text?: Text;

  ulidStrings?: string;

  private snackBar = inject(MatSnackBar);

  generateUlid(input: UlidGenInputModel): void {
    const ulids = (input.isMonoIncreaseMode)
      ? this.makeMonotonicUlid(input.generatingSize, input.baseTimestamp)
      : this.makeUlid(input.generatingSize, input.baseTimestamp);
    this.ulidStrings = ulids.join('\n');
  }

  onClickCopy(): void {
    if (!this.ulidStrings || !this.text) {
      return;
    }
    navigator.clipboard.writeText(this.ulidStrings);
    this.snackBar.open(this.text['copiedMessage'], this.text['ok'], { duration: 2000, horizontalPosition: 'start' });
  }

  private makeUlid(size: number, baseTimestamp: number): string[] {
    const results: string[] = [];
    const ulid = factory();
    for (let i = 0; i < size; i++) {
      results.push(ulid(baseTimestamp));
    }
    return results.sort();
  }

  private makeMonotonicUlid(size: number, baseTimestamp: number): string[] {
    const results: string[] = [];
    const ulid = monotonicFactory();
    for (let i = 0; i < size; i++) {
      results.push(ulid(baseTimestamp));
    }
    return results;
  }
}
