import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SqlFormatterInputModel } from '../sql-formatter-model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { SqlCodeEditorComponent } from './sql-code-editor/sql-code-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sql-formatter-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    HeadingComponent,
    SqlCodeEditorComponent,
  ],
  templateUrl: './sql-formatter-input-card.component.html',
  styleUrl: './sql-formatter-input-card.component.scss'
})
export class SqlFormatterInputCardComponent {
  @ViewChild(SqlCodeEditorComponent) sqlCodeEditorComponent?: SqlCodeEditorComponent;

  formGroup?: FormGroup;
  errorMessage?: string;

  private readonly fb: FormBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.resetForm();
    this.setupModeListener();
  }

  setupModeListener(): void {
    if (!this.formGroup) return;
    
    this.formGroup.get('mode')?.valueChanges.subscribe((mode) => {
      const indentControl = this.formGroup?.get('indentSpaceSize');
      if (mode === 'standard') {
        indentControl?.enable();
      } else {
        indentControl?.disable();
      }
    });
  }

  onSubmit(): void {
    if (!this.formGroup || this.hasError || !this.sqlCodeEditorComponent) {
      return;
    }
    this.sqlCodeEditorComponent.formatSql(this.makeModel());
  }

  onCatchError(message: string): void {
    this.errorMessage = message;
  }

  onClickCopyMenu(copyMode: 'plain' | 'quote' | 'code'): void {
    if (!this.sqlCodeEditorComponent) {
      return;
    }
    
    const value = this.sqlCodeEditorComponent.value ?? '';
    let text = '';

    switch (copyMode) {
      case 'plain':
        text = value;
        break;
      case 'quote':
        text = value.split('\n').map(line => `"${line}"`).join('\n');
        break;
      case 'code':
        const lines = value.split('\n');
        text = lines.map((line, index) => {
          if (index === 0) {
            return `"${line}"`;
          }
          return `+ "${line}"`;
        }).join('\n');
        break;
    }

    navigator.clipboard.writeText(text);
    this.snackBar.open($localize`:@@common.copiedMessage:コピーしました。`,
      $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
  }

  get hasError(): boolean {
    if (!this.formGroup) {
      return true;
    }
    return this.formGroup.status !== 'VALID';
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      indentSpaceSize: this.fb.control<string>('2', []),
      mode: this.fb.control<string>('standard', []),
      keywordCase: this.fb.control<string>('upper', []),
      identifierCase: this.fb.control<string>('lower', []),
    });
  }

  private makeModel(): SqlFormatterInputModel {
    if (!this.formGroup) {
      throw new Error('FormGroup is not initialized');
    }
    return {
      indentSpaceSize: Number(this.formGroup.controls['indentSpaceSize'].value),
      mode: this.formGroup.controls['mode'].value as 'standard' | 'tabularRight' | 'minify',
      keywordCase: this.formGroup.controls['keywordCase'].value as 'upper' | 'lower' | 'preserve',
      identifierCase: this.formGroup.controls['identifierCase'].value as 'upper' | 'lower' | 'preserve',
    };
  }

}
