import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { CodemirrorComponent } from '../../../../components/codemirror/codemirror.component';
import { Extension } from '@codemirror/state';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { syntaxHighlighting, defaultHighlightStyle, indentOnInput, foldGutter } from '@codemirror/language';
import { defaultKeymap, historyKeymap } from '@codemirror/commands';
import { history } from '@codemirror/commands';
import { keymap, EditorView, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { autocompletion, completionKeymap, closeBrackets } from '@codemirror/autocomplete';
import { linter, lintGutter, lintKeymap } from '@codemirror/lint';
import { color } from '@codemirror/theme-one-dark';
import { JsonFormatterInputModel } from '../../json-formatter-model';

@Component({
  selector: 'app-json-code-editor',
  imports: [
    CodemirrorComponent,
  ],
  templateUrl: './json-code-editor.component.html',
  styleUrl: './json-code-editor.component.scss',
})
export class JsonCodeEditorComponent implements OnInit{
  @ViewChild(CodemirrorComponent) codemirrorComponent!: CodemirrorComponent;
  @Output() catchError: EventEmitter<string> = new EventEmitter();
  private isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  value: string = '';

  sampleJson = {
    status: 'success',
    data: {
      id: '123abc',
      title: 'Sample API Response',
      items: [1, 2, 3]
    },
    timestamp: '2024-01-13T10:30:00Z'
  };

  extensions: Extension[] = [
    json(),
    syntaxHighlighting(defaultHighlightStyle),
    indentOnInput(),
    history(),
    closeBrackets(),
    autocompletion(),
    lineNumbers(),
    EditorView.lineWrapping,
    highlightActiveLine(),
    foldGutter(),
    linter(jsonParseLinter()),
    lintGutter(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
  ];

  backgroundColor: string | null = this.isDarkMode ? color.background : null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.value = JSON.stringify(this.sampleJson);
    this.formatJson({ indentSpaceSize: 2, mode: 'format' });
  }

  onWrapperClick(): void {
    this.codemirrorComponent.focus();
  }

  formatJson(model: JsonFormatterInputModel): void {
    console.log('value before format:', this.value);
    try {
      const parsed = JSON.parse(this.value);
      this.errorMessage = null;

      if (model.mode === 'minify') {
        this.value = JSON.stringify(parsed);
      } else {
        let formatted = JSON.stringify(parsed, null, model.indentSpaceSize);
        formatted = this.compactSimpleArrays(formatted);
        this.value = formatted;
      }
    } catch (error) {
      this.catchError.emit($localize`:@@page.json.formatter.errorMessage:無効なJSONです。`);
    }
  }

  private compactSimpleArrays(json: string): string {
    return json.replace(/\[\s*\n(\s*)([^\[\{]+?)\s*\n\s*\]/gs, (match, indent: string, content: string) => {
      const elements = content.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      if (elements.length <= 5 && !content.includes('{') && !content.includes('[')) {
        return `[${content.replace(/\s+/g, ' ').trim()}]`;
      }
      return match;
    });
  }

}
