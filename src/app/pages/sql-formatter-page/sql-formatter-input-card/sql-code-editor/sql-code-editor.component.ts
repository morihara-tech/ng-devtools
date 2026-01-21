import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { CodemirrorComponent } from '../../../../components/codemirror/codemirror.component';
import { Extension } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql';
import { syntaxHighlighting, defaultHighlightStyle, indentOnInput, foldGutter } from '@codemirror/language';
import { defaultKeymap, historyKeymap } from '@codemirror/commands';
import { history } from '@codemirror/commands';
import { keymap, EditorView, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { autocompletion, completionKeymap, closeBrackets } from '@codemirror/autocomplete';

import { SqlFormatterInputModel } from '../../sql-formatter-model';
import { format } from 'sql-formatter';

@Component({
  selector: 'app-sql-code-editor',
  imports: [
    CodemirrorComponent,
  ],
  templateUrl: './sql-code-editor.component.html',
  styleUrl: './sql-code-editor.component.scss',
})
export class SqlCodeEditorComponent implements OnInit {
  @ViewChild(CodemirrorComponent) codemirrorComponent!: CodemirrorComponent;
  @Output() catchError: EventEmitter<string> = new EventEmitter();

  value: string = '';

  sampleSql = `SELECT users.id, users.name, orders.order_date, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'completed' AND orders.total > 100
ORDER BY orders.order_date DESC
LIMIT 10`;

  extensions: Extension[] = [
    sql(),
    syntaxHighlighting(defaultHighlightStyle),
    indentOnInput(),
    history(),
    closeBrackets(),
    autocompletion(),
    lineNumbers(),
    EditorView.lineWrapping,
    highlightActiveLine(),
    foldGutter(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...completionKeymap,
    ]),
  ];

  errorMessage: string | null = null;

  ngOnInit(): void {
    this.value = this.sampleSql;
    this.formatSql({ indentSpaceSize: 2, mode: 'standard', keywordCase: 'upper', identifierCase: 'lower' });
  }

  onWrapperClick(): void {
    this.codemirrorComponent.focus();
  }

  formatSql(model: SqlFormatterInputModel): void {
    try {
      this.errorMessage = null;

      if (model.mode === 'minify') {
        this.value = this.value.replace(/\s+/g, ' ').trim();
      } else {
        const formatted = format(this.value, {
          language: 'sql',
          indentStyle: model.mode,
          tabWidth: model.indentSpaceSize,
          keywordCase: model.keywordCase,
          identifierCase: model.identifierCase,
        });
        this.value = formatted;
      }
    } catch (error) {
      this.catchError.emit($localize`:@@page.sql.formatter.errorMessage:無効なSQLです。`);
    }
  }

}
