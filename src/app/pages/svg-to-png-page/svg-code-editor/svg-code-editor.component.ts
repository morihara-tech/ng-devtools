import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { CodemirrorComponent } from '../../../components/codemirror/codemirror.component';
import { Extension } from '@codemirror/state';
import { html, autoCloseTags } from '@codemirror/lang-html';
import { indentOnInput, foldGutter } from '@codemirror/language';
import { defaultKeymap, historyKeymap } from '@codemirror/commands';
import { history } from '@codemirror/commands';
import { keymap, EditorView, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { autocompletion, completionKeymap, closeBrackets } from '@codemirror/autocomplete';
import { bracketMatching } from '@codemirror/language';
import { lintGutter } from '@codemirror/lint';

@Component({
  selector: 'app-svg-code-editor',
  imports: [
    CodemirrorComponent,
  ],
  templateUrl: './svg-code-editor.component.html',
  styleUrl: './svg-code-editor.component.scss',
})
export class SvgCodeEditorComponent implements OnInit {
  @ViewChild(CodemirrorComponent) codemirrorComponent!: CodemirrorComponent;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  value: string = '';

  sampleSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#AE1C1D" />
  <text x="100" y="110" text-anchor="middle" font-size="24" fill="white">SVG</text>
</svg>`;

  extensions: Extension[] = [
    html(),
    indentOnInput(),
    history(),
    closeBrackets(),
    autoCloseTags,
    autocompletion(),
    lineNumbers(),
    EditorView.lineWrapping,
    highlightActiveLine(),
    foldGutter(),
    bracketMatching(),
    lintGutter(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...completionKeymap,
    ]),
  ];

  backgroundColor: string | null = null;

  ngOnInit(): void {
    this.value = this.sampleSvg;
  }

  onWrapperClick(): void {
    this.codemirrorComponent.focus();
  }

  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  onChangeBgColor(color: string): void {
    this.backgroundColor = color;
  }

}
