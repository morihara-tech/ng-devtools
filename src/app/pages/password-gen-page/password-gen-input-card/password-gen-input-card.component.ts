import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { PasswordGenInputModel } from '../password-gen-model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HintIconComponent } from '../../../components/hint-icon/hint-icon.component';

@Component({
    selector: 'app-password-gen-input-card',
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSelectModule,
        HeadingComponent,
        HintIconComponent,
    ],
    templateUrl: './password-gen-input-card.component.html',
    styleUrl: './password-gen-input-card.component.scss'
})
export class PasswordGenInputCardComponent implements OnInit {
  @Output() generate: EventEmitter<PasswordGenInputModel> = new EventEmitter();

  formGroup?: FormGroup;

  characterTypes = [
    { value: 'alphanumeric-symbols', label: $localize`:@@page.password.card.input.characterType.alphanumericSymbols:英数字 + 記号` },
    { value: 'alphanumeric', label: $localize`:@@page.password.card.input.characterType.alphanumeric:英数字` },
    { value: 'lowercase-digits', label: $localize`:@@page.password.card.input.characterType.lowercaseDigits:英小文字 + 数字` },
    { value: 'digits', label: $localize`:@@page.password.card.input.characterType.digits:数字のみ` }
  ];

  constructor(
    private fb: FormBuilder
  ) {}

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
    const model: PasswordGenInputModel = {
      length: Number(this.formGroup.controls['length'].value),
      count: Number(this.formGroup.controls['count'].value),
      characterType: this.formGroup.controls['characterType'].value,
      excludeSimilar: Boolean(this.formGroup.controls['excludeSimilar'].value),
    };
    this.generate.emit(model);
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

    for (const key of Object.keys(this.formGroup.controls)) {
      if (this.formGroup.controls[key].errors?.['required']) {
        return $localize`:@@page.password.card.input.error.required:必須項目を入力してください。`;
      }
    }
    if (this.formGroup.controls['length'].errors?.['min'] || this.formGroup.controls['length'].errors?.['max']) {
      return $localize`:@@page.password.card.input.error.lengthRange:文字数は1以上50以下で入力してください。`;
    }
    if (this.formGroup.controls['count'].errors?.['min'] || this.formGroup.controls['count'].errors?.['max']) {
      return $localize`:@@page.password.card.input.error.countRange:個数は1以上50以下で入力してください。`;
    }
    return null;
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      length: this.fb.control<number>(15, [
        Validators.required,
        Validators.min(1),
        Validators.max(50)
      ]),
      count: this.fb.control<number>(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(50)
      ]),
      characterType: this.fb.control<string>('alphanumeric-symbols', [
        Validators.required
      ]),
      excludeSimilar: this.fb.control<boolean>(true)
    });
  }

}
