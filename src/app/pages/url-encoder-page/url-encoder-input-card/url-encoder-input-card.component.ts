import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { HintIconComponent } from '../../../components/hint-icon/hint-icon.component';
import { UrlEncoderInputModel, UrlEncoderMethod, UrlEncoderMode } from '../url-encoder-model';

@Component({
  selector: 'app-url-encoder-input-card',
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
      method: this.getMethod(),
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

  get encodeAllHintMessage(): string {
    const mode = (this.formGroup?.controls['mode'].value as UrlEncoderMode) ?? 'encode';
    if (mode === 'decode') {
      return $localize`:@@page.urlEncoder.card.input.encodeAll.hint.decode:ONの場合はdecodeURIComponentを使用し、スラッシュや疑問符などのURL記号も含めてすべてデコードします。OFFの場合はdecodeURIを使用し、URL構造を維持したままデコードします。`;
    }
    return $localize`:@@page.urlEncoder.card.input.encodeAll.hint.encode:ONの場合はencodeURIComponentを使用し、スラッシュや疑問符などのURL記号も含めてすべてエンコードします。OFFの場合はencodeURIを使用し、URL構造を維持したままエンコードします。`;
  }

  private getMethod(): UrlEncoderMethod {
    const encodeAll: boolean = this.formGroup!.controls['encodeAll'].value ?? true;
    return encodeAll ? 'encodeURIComponent' : 'encodeURI';
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      input: this.fb.control<string>('', [Validators.required]),
      mode: this.fb.control<UrlEncoderMode>('encode', []),
      encodeAll: this.fb.control<boolean>(true, []),
    });
  }
}
