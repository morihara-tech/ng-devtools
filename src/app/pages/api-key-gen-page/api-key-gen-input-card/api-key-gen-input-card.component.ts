import { Component, OnInit, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { ApiKeyFormat, ApiKeyGenInputModel } from '../api-key-gen-model';

@Component({
  selector: 'app-api-key-gen-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HeadingComponent,
  ],
  templateUrl: './api-key-gen-input-card.component.html',
  styleUrl: './api-key-gen-input-card.component.scss'
})
export class ApiKeyGenInputCardComponent implements OnInit {
  readonly generate = output<ApiKeyGenInputModel>();

  formGroup?: FormGroup;

  readonly formats: ReadonlyArray<{ value: ApiKeyFormat; label: string }> = [
    { value: 'base62', label: $localize`:@@page.apiKey.card.input.format.base62:Base62` },
    { value: 'hex', label: $localize`:@@page.apiKey.card.input.format.hex:Hex` },
    { value: 'uuid-v4', label: $localize`:@@page.apiKey.card.input.format.uuidV4:UUID v4` },
  ];

  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.resetForm();
    this.onSubmit();
  }

  onSubmit(): void {
    if (!this.formGroup || this.hasError) {
      return;
    }
    const model: ApiKeyGenInputModel = {
      format: this.formGroup.controls['format'].value,
      length: Number(this.formGroup.controls['length'].value),
      count: Number(this.formGroup.controls['count'].value),
      prefix: this.formGroup.controls['prefix'].value,
    };
    this.generate.emit(model);
  }

  get hasError(): boolean {
    if (!this.formGroup) {
      return true;
    }
    return this.formGroup.status !== 'VALID';
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      format: this.fb.control<ApiKeyFormat>('base62', [
        Validators.required,
      ]),
      length: this.fb.control<number>(32, [
        Validators.required,
        Validators.min(1),
        Validators.max(256),
      ]),
      count: this.fb.control<number>(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      prefix: this.fb.control<string>('', [
        Validators.pattern('^[A-Za-z0-9_-]*$'),
        Validators.maxLength(32),
      ]),
    });
  }
}
