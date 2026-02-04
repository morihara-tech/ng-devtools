import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { JsonFormatterInputModel } from '../json-formatter-model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { JsonCodeEditorComponent } from './json-code-editor/json-code-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-json-formatter-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    HeadingComponent,
    JsonCodeEditorComponent,
  ],
  templateUrl: './json-formatter-input-card.component.html',
  styleUrl: './json-formatter-input-card.component.scss'
})
export class JsonFormatterInputCardComponent {
  @ViewChild(JsonCodeEditorComponent) jsonCodeEditorComponent?: JsonCodeEditorComponent;

  formGroup?: FormGroup;
  errorMessage?: string;

  private readonly fb: FormBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.resetForm();
  }

  onSubmit(): void {
    if (!this.formGroup || this.hasError || !this.jsonCodeEditorComponent) {
      return;
    }
    this.jsonCodeEditorComponent.formatJson(this.makeModel());
  }

  onCatchError(message: string): void {
    this.errorMessage = message;
  }

  onClickCopyMenu(isEscapeMode: boolean): void {
    if (!this.jsonCodeEditorComponent) {
      return;
    }
    const text = (isEscapeMode) ? JSON.stringify(this.jsonCodeEditorComponent.value) : this.jsonCodeEditorComponent.value ?? '';
    navigator.clipboard.writeText(text);
    this.snackBar.open($localize`:@@common.copiedMessage:コピーしました。`,
      $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
  }

  onClickClear(): void {
    if (!this.jsonCodeEditorComponent) {
      return;
    }
    const previousValue = this.jsonCodeEditorComponent.value;
    this.jsonCodeEditorComponent.value = '';
    
    const snackBarRef = this.snackBar.open(
      $localize`:@@common.clearedMessage:クリアしました。`,
      $localize`:@@common.undo:元に戻す`,
      { duration: 5000, horizontalPosition: 'start' }
    );

    snackBarRef.onAction().subscribe(() => {
      if (this.jsonCodeEditorComponent) {
        this.jsonCodeEditorComponent.value = previousValue;
      }
    });
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
      mode: this.fb.control<string>('format', []),
      isEscapeMode: this.fb.control<boolean>(false, []),
    });
  }

  private makeModel(): JsonFormatterInputModel {
    if (!this.formGroup) {
      throw new Error('FormGroup is not initialized');
    }
    return {
      indentSpaceSize: Number(this.formGroup.controls['indentSpaceSize'].value),
      mode: this.formGroup.controls['mode'].value as 'format' | 'minify',
    };
  }

}
