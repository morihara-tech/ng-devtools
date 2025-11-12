import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { JsonFormatterInputModel } from '../json-formatter-model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HintIconComponent } from '../../../components/hint-icon/hint-icon.component';

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
    HeadingComponent,
    HintIconComponent,
  ],
  templateUrl: './json-formatter-input-card.component.html',
  styleUrl: './json-formatter-input-card.component.scss'
})
export class JsonFormatterInputCardComponent implements OnInit {
  @Output() format: EventEmitter<JsonFormatterInputModel> = new EventEmitter();

  formGroup?: FormGroup;

  private readonly fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.resetForm();
    setTimeout(() => {
      this.onSubmit();
    }, 10);
  }

  onSubmit(): void {
    if (!this.formGroup || this.hasError) {
      return;
    }
    const model: JsonFormatterInputModel = {
      indentSpaceSize: Number(this.formGroup.controls['indentSpaceSize'].value),
      mode: this.formGroup.controls['mode'].value as 'format' | 'minify',
      isEscapeMode: Boolean(this.formGroup.controls['isEscapeMode'].value),
      jsonString: String(this.formGroup.controls['jsonString'].value),
    };
    this.format.emit(model);
  }

  get hasError(): boolean {
    if (!this.formGroup) {
      return true;
    }
    return this.formGroup.status !== 'VALID';
  }

  get errorMessage(): string | null {
    if (!this.formGroup) {
      return null;
    }
    return null;
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      indentSpaceSize: this.fb.control<string>('2', []),
      mode: this.fb.control<string>('format', []),
      isEscapeMode: this.fb.control<boolean>(false, []),
      jsonString: this.fb.control<string>('{"id": 1,"value":"test"}', [
        // TODO add validation
      ]),
    });
  }

}
