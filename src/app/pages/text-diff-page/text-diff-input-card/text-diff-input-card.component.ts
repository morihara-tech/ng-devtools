import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CodemirrorComponent } from '../../../components/codemirror/codemirror.component';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextDiffInputModel } from '../text-diff-model';

@Component({
  selector: 'app-text-diff-input-card',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CodemirrorComponent,
    HeadingComponent,
  ],
  templateUrl: './text-diff-input-card.component.html',
  styleUrl: './text-diff-input-card.component.scss',
})
export class TextDiffInputCardComponent {
  @Output() compare: EventEmitter<TextDiffInputModel> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter();

  originalText: string = '';
  modifiedText: string = '';

  onCompare(): void {
    this.compare.emit({
      original: this.originalText,
      modified: this.modifiedText,
    });
  }

  onClear(): void {
    this.originalText = '';
    this.modifiedText = '';
    this.clear.emit();
  }
}
