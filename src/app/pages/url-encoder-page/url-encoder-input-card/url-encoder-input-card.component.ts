import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { UrlEncoderInputModel, UrlEncoderMethod, UrlEncoderMode } from '../url-encoder-model';

@Component({
  selector: 'app-url-encoder-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    HeadingComponent,
  ],
  templateUrl: './url-encoder-input-card.component.html',
  styleUrl: './url-encoder-input-card.component.scss',
})
export class UrlEncoderInputCardComponent implements OnInit {
  @Output() convert: EventEmitter<UrlEncoderInputModel> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter();

  formGroup?: FormGroup;

  private readonly fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.resetForm();
  }

  onSubmit(): void {
    if (!this.formGroup || this.isInputEmpty) {
      return;
    }
    const model: UrlEncoderInputModel = {
      input: this.formGroup.controls['input'].value,
      mode: this.formGroup.controls['mode'].value as UrlEncoderMode,
      method: this.formGroup.controls['method'].value as UrlEncoderMethod,
    };
    this.convert.emit(model);
  }

  onClear(): void {
    this.resetForm();
    this.clear.emit();
  }

  get isInputEmpty(): boolean {
    if (!this.formGroup) {
      return true;
    }
    const inputValue: string = this.formGroup.controls['input'].value ?? '';
    return inputValue.trim() === '';
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      input: this.fb.control<string>('', [Validators.required]),
      mode: this.fb.control<UrlEncoderMode>('encode', []),
      method: this.fb.control<UrlEncoderMethod>('encodeURIComponent', []),
    });
  }
}
