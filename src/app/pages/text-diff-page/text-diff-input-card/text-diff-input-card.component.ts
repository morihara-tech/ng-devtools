import { Component, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CodemirrorComponent } from '../../../components/codemirror/codemirror.component';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextDiffInputModel } from '../text-diff-model';
import { Extension } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { EditorView, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view';

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
  readonly compare = output<TextDiffInputModel>();
  readonly clear = output<void>();

  private readonly originalEditor = viewChild<CodemirrorComponent>('originalEditor');
  private readonly modifiedEditor = viewChild<CodemirrorComponent>('modifiedEditor');

  originalText: string = '';
  modifiedText: string = '';

  extensions: Extension[] = [
    history(),
    lineNumbers(),
    EditorView.lineWrapping,
    highlightActiveLine(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
    ]),
  ];

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

  onWrapperClick(type: 'original' | 'modified'): void {
    if (type === 'original') {
      this.originalEditor()?.focus();
    } else {
      this.modifiedEditor()?.focus();
    }
  }
}
