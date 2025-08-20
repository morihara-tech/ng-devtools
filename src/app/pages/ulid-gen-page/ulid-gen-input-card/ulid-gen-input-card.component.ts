import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { Text } from '../../../../resources/texts/text';
import { UlidGenInputModel } from '../ulid-gen-model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HintIconComponent } from '../../../components/hint-icon/hint-icon.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DatetimeMakerDialogComponent } from './datetime-maker-dialog/datetime-maker-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-ulid-gen-input-card',
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTooltipModule,
        HeadingComponent,
        HintIconComponent,
    ],
    templateUrl: './ulid-gen-input-card.component.html',
    styleUrl: './ulid-gen-input-card.component.scss'
})
export class UlidGenInputCardComponent implements OnInit {
  @Input() text?: Text;
  @Output() generate: EventEmitter<UlidGenInputModel> = new EventEmitter();

  formGroup?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
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
    const model: UlidGenInputModel = {
      generatingSize: Number(this.formGroup.controls['generatingSize'].value),
      baseTimestamp: Number(this.formGroup.controls['baseTimestamp'].value),
      isMonoIncreaseMode: Boolean(this.formGroup.controls['isMonoIncreaseMode'].value),
    };
    this.generate.emit(model);
  }

  onClickCalendarButton(): void {
    if (!this.text || !this.formGroup) {
      return;
    }
    const dialogRef = this.dialog.open(DatetimeMakerDialogComponent, {
      data: {
        text: this.text,
        unixdatetime: Number(this.formGroup.value['baseTimestamp'])
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.formGroup?.controls['baseTimestamp'].setValue(result);
    });
  }

  onClickReload(): void {
    const now = new Date();
    this.formGroup?.controls['baseTimestamp'].setValue(Math.floor(now.getTime()));
  }

  get hasError(): boolean {
    if (!this.formGroup) {
      return true;
    }
    return this.formGroup.status !== 'VALID';
  }

  get errorMessage(): string | null {
    if (!this.formGroup || !this.text) {
      return null;
    }

    for (const key of Object.keys(this.formGroup.controls)) {
      if (this.formGroup.controls[key].errors?.['required']) {
        return this.text['ulidGenInputErrorRequired'];
      }
    }
    if (this.formGroup.controls['generatingSize'].errors?.['min'] || this.formGroup.controls['generatingSize'].errors?.['max']) {
      return this.text['ulidGenInputErrorGeneratingSizeRange'];
    }
    if (this.formGroup.controls['baseTimestamp'].errors?.['min']) {
      return this.text['ulidGenInputErrorBaseTimestampMin'];
    }
    return null;
  }

  private resetForm(): void {
    const now = new Date();
    this.formGroup = this.fb.group({
      generatingSize: this.fb.control<number>(5, [
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ]),
      baseTimestamp: this.fb.control<number>(Math.floor(now.getTime()), [
        Validators.required,
        Validators.min(0),
      ]),
      isMonoIncreaseMode: this.fb.control<boolean>(false)
    });
  }

}
