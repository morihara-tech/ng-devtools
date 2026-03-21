import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UuidGenInputModel, UuidVersion } from '../uuid-gen-model';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { HintIconComponent } from '../../../components/hint-icon/hint-icon.component';

@Component({
  selector: 'app-uuid-gen-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HeadingComponent,
    HintIconComponent,
  ],
  templateUrl: './uuid-gen-input-card.component.html',
  styleUrl: './uuid-gen-input-card.component.scss'
})
export class UuidGenInputCardComponent implements OnInit {
  @Output() generate: EventEmitter<UuidGenInputModel> = new EventEmitter();

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
    const model: UuidGenInputModel = {
      generatingSize: Number(this.formGroup.controls['generatingSize'].value),
      version: this.getVersion(this.formGroup.controls['version'].value)
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
    const generatingSizeControl = this.formGroup.controls['generatingSize'];
    if (generatingSizeControl.hasError('required')) {
      return $localize`:@@page.uuid.card.input.error.generatingSize.required:生成数を入力してください。`;
    } else if (generatingSizeControl.hasError('min') || generatingSizeControl.hasError('max')) {
      return $localize`:@@page.uuid.card.input.error.generatingSize.range:生成数は1以上1,000以下で入力してください。`;
    }
    return null;
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      generatingSize: this.fb.control<number>(5, [
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ]),
      version: this.fb.control<string>(this.getVersion(), []),
    });
  }

  private getVersion(versionStr?: String): UuidVersion {
    const validVersions: UuidVersion[] = ['v1', 'v4', 'v7'];
    const defaultVersion = validVersions[1];
    if (!versionStr) {
      return defaultVersion;
    }
    if (validVersions.includes(versionStr as UuidVersion)) {
      return versionStr as UuidVersion;
    }
    return defaultVersion;
  }

}
