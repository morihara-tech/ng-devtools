import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
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
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-ulid-gen-input-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    HeadingComponent,
    HintIconComponent,
  ],
  templateUrl: './ulid-gen-input-card.component.html',
  styleUrl: './ulid-gen-input-card.component.scss'
})
export class UlidGenInputCardComponent implements OnInit {
  @Input() text?: Text;
  @Output() submit: EventEmitter<UlidGenInputModel> = new EventEmitter();

  formGroup?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.resetForm();
  }

  onSubmit(): void {
    if (!this.formGroup || this.hasError) {
      return;
    }
    const model: UlidGenInputModel = {
      generatingSize: Number(this.formGroup.controls['generatingSize']),
      isSelectedTimeMode: Boolean(this.formGroup.controls['isSelectedTimeMode']),
      baseUnixDatetime: Number(this.formGroup.controls['baseUnixDatetime']),
      isMonoIncreaseMode: Boolean(this.formGroup.controls['isMonoIncreaseMode']),
    };
    this.submit.emit(model);
  }

  onClickCalendarButton(): void {
    if (!this.text || !this.formGroup) {
      return;
    }
    const dialogRef = this.dialog.open(DatetimeMakerDialogComponent, {
      data: {
        text: this.text,
        unixdatetime: Number(this.formGroup.value['baseUnixDatetime'])
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.formGroup?.controls['baseUnixDatetime'].setValue(result);
    });
  }

  onClickReload(): void {
    const now = new Date();
    this.formGroup?.controls['baseUnixDatetime'].setValue(Math.floor(now.getTime() / 1000));
  }

  get hasError(): boolean {
    if (!this.formGroup) {
      return true;
    }
    return this.formGroup.status !== 'VALID';
  }

  private resetForm(): void {
    const now = new Date();
    this.formGroup = this.fb.group({
      generatingSize: this.fb.control<number>(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000)
      ]),
      isSelectedTimeMode: this.fb.control<boolean>(false),
      baseUnixDatetime: this.fb.control<number>({value: Math.floor(now.getTime() / 1000), disabled: true}, [
        Validators.min(0),
      ]),
      isMonoIncreaseMode: this.fb.control<boolean>(false)
    });
    this.formGroup.valueChanges
      .pipe(distinctUntilChanged((prev, curr) => prev.isSelectedTimeMode === curr.isSelectedTimeMode))
      .subscribe(values => {
      if (!values.isSelectedTimeMode) {
        this.formGroup?.controls['baseUnixDatetime'].disable();
      } else {
        this.formGroup?.controls['baseUnixDatetime'].enable();
      }
    });
  }

}
