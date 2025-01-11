import { Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatetimeMakerModel } from './datetime-maker-model';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import moment, { Moment } from 'moment';
import 'moment/locale/ja';
import { LocaleService } from '../../../../components/locale/locale.service';

@Component({
  selector: 'app-datetime-maker-dialog',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    provideMomentDateAdapter()
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './datetime-maker-dialog.component.html',
  styleUrl: './datetime-maker-dialog.component.scss'
})
export class DatetimeMakerDialogComponent implements OnInit {
  readonly data = inject<DatetimeMakerModel>(MAT_DIALOG_DATA);

  formGroup?: FormGroup;

  private readonly localeService = inject(LocaleService);
  private readonly dialogRef = inject(MatDialogRef<DatetimeMakerDialogComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly calendarAdapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly calendarLocale = signal(inject<unknown>(MAT_DATE_LOCALE));

  ngOnInit(): void {
    this.setCalendarLocale();
    this.resetForm();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.makeUnixDatetime());
  }

  get getDateFormatString(): string {
    if (this.calendarLocale() === 'ja-JP') {
      return 'YYYY/MM/DD';
    }
    return 'DD/MM/YYYY'; 
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

    if (this.formGroup.controls['baseDate'].errors?.['required']) {
      return this.data.text['datetimeMakerDialogErrorInvalidBaseDate'].replace('{0}', this.getDateFormatString);
    }
    for (const key of Object.keys(this.formGroup.controls)) {
      if (this.formGroup.controls[key].errors?.['required']) {
        return this.data.text['datetimeMakerDialogErrorRequired'];
      }
      if (this.formGroup.controls[key].errors?.['min'] || this.formGroup.controls[key].errors?.['max']) {
        return this.data.text['datetimeMakerDialogErrorInvalidTime'];
      }
    }
    return null;
  }

  private setCalendarLocale(): void {
    this.localeService.get().subscribe((locale) => {
      if (locale === 'ja') {
        this.calendarLocale.set('ja-JP');
      } else {
        this.calendarLocale.set('en-US');
      }
      this.calendarAdapter.setLocale(this.calendarLocale());
    });
  }

  private resetForm(): void {
    const date = new Date(this.data.unixdatetime);
    this.formGroup = this.fb.group({
      baseDate: this.fb.control<Moment>(moment(date), [
        Validators.required
      ]),
      baseHours: this.fb.control<number>(date.getHours(), [
        Validators.required,
        Validators.min(0),
        Validators.max(23)
      ]),
      baseMinutes: this.fb.control<number>(date.getMinutes(), [
        Validators.required,
        Validators.min(0),
        Validators.max(59)
      ]),
      baseSeconds: this.fb.control<number>(date.getSeconds(), [
        Validators.required,
        Validators.min(0),
        Validators.max(59)
      ])
    });
  }

  private makeUnixDatetime(): number {
    if (!this.formGroup) {
      throw new Error('Bad Implementation. formGroup is required.');
    }
    const baseDate: Moment = this.formGroup.value['baseDate'];
    baseDate.hours(this.formGroup.value['baseHours']);
    baseDate.minutes(this.formGroup.value['baseMinutes']);
    baseDate.seconds(this.formGroup.value['baseSeconds']);
    return baseDate.valueOf();
  }
}
