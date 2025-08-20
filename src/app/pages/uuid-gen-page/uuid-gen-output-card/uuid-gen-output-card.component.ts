import { Component, Input, inject } from '@angular/core';
import { Text } from '../../../../resources/texts/text';
import { UuidGenInputModel, UuidVersion } from '../uuid-gen-model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextViewerTableComponent } from '../../../components/text-viewer-table/text-viewer-table.component';
import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7 } from 'uuid';

@Component({
  selector: 'app-uuid-gen-output-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    HeadingComponent,
    TextViewerTableComponent,
  ],
  templateUrl: './uuid-gen-output-card.component.html',
  styleUrl: './uuid-gen-output-card.component.scss',
})
export class UuidGenOutputCardComponent {
  @Input() text?: Text;

  uuidStrings?: string;

  private snackBar = inject(MatSnackBar);

  generateUuid(input: UuidGenInputModel): void {
    const uuids = this.makeUuids(input);
    this.uuidStrings = uuids.join('\n');
  }

  onClickCopy(): void {
    if (!this.uuidStrings || !this.text) {
      return;
    }
    navigator.clipboard.writeText(this.uuidStrings);
    this.snackBar.open(this.text['copiedMessage'], this.text['ok'], {
      duration: 2000,
      horizontalPosition: 'start',
    });
  }

  private makeUuids(input: UuidGenInputModel): string[] {
    const results: string[] = [];
    for (let i = 0; i < input.generatingSize; i++) {
      results.push(this.makeUuid(input.version));
    }
    return results.sort();
  }

  private makeUuid(version: UuidVersion): string {
    switch (version) {
      case 'v1':
        return uuidv1();
      case 'v7':
        return uuidv7();
      case 'v4':
      default:
        return uuidv4();
    }
  }

}
