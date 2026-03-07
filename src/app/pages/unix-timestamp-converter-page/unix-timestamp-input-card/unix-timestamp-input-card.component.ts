import {
  Component,
  EventEmitter,
  LOCALE_ID,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { ConversionMode, UnixTimestampInputModel } from '../unix-timestamp-model';
import { COMMON_TIMEZONES } from '../unix-timestamp-timezones';

@Component({
  selector: 'app-unix-timestamp-input-card',
  providers: [
    { provide: MAT_DATE_LOCALE, useExisting: LOCALE_ID },
  ],
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HeadingComponent,
  ],
  templateUrl: './unix-timestamp-input-card.component.html',
  styleUrl: './unix-timestamp-input-card.component.scss',
})
export class UnixTimestampInputCardComponent implements OnInit {
  @Output() convert: EventEmitter<UnixTimestampInputModel> = new EventEmitter();

  formGroup?: FormGroup;
  mode: ConversionMode = 'toDateTime';
  filteredTimezones: string[] = COMMON_TIMEZONES;

  private readonly fb = inject(FormBuilder);
  private readonly calendarAdapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly calendarLocale = signal(inject<unknown>(MAT_DATE_LOCALE));

  ngOnInit(): void {
    this.calendarAdapter.setLocale(this.calendarLocale());
    this.resetForm();
    setTimeout(() => {
      this.onSubmit();
    }, 10);
  }

  onModeChange(mode: ConversionMode): void {
    this.mode = mode;
    this.resetForm();
  }

  onTimezoneInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTimezones = COMMON_TIMEZONES.filter((tz) =>
      tz.toLowerCase().includes(value),
    );
  }

  onSubmit(): void {
    if (!this.formGroup || this.hasError) {
      return;
    }

    const model: UnixTimestampInputModel = {
      mode: this.mode,
      timezone: this.formGroup.value['timezone'] ?? 'UTC',
    };

    if (this.mode === 'toDateTime') {
      model.unixTimestamp = Number(this.formGroup.value['unixTimestamp']);
    } else {
      model.date = this.formGroup.value['date'];
      model.hours = Number(this.formGroup.value['hours'] ?? 0);
      model.minutes = Number(this.formGroup.value['minutes'] ?? 0);
      model.seconds = Number(this.formGroup.value['seconds'] ?? 0);
    }

    this.convert.emit(model);
  }

  get hasError(): boolean {
    return !this.formGroup || this.formGroup.status !== 'VALID';
  }

  get errorMessage(): string | null {
    if (!this.formGroup) {
      return null;
    }

    for (const key of Object.keys(this.formGroup.controls)) {
      if (this.formGroup.controls[key].errors?.['required']) {
        return $localize`:@@page.unixTimestamp.card.input.error.required:必須項目を入力してください。`;
      }
    }

    if (this.formGroup.controls['unixTimestamp']?.errors?.['min']) {
      return $localize`:@@page.unixTimestamp.card.input.error.invalidTimestamp:有効なUNIXタイムスタンプを入力してください。`;
    }

    return null;
  }

  get dateFormatPlaceholder(): string {
    const locale = String(this.calendarLocale());
    return locale.startsWith('ja') ? 'YYYY/MM/DD' : 'DD/MM/YYYY';
  }

  private resetForm(): void {
    if (this.mode === 'toDateTime') {
      this.formGroup = this.fb.group({
        unixTimestamp: this.fb.control<number | null>(null, [
          Validators.required,
          Validators.min(0),
        ]),
        timezone: this.fb.control<string>('Asia/Tokyo', [Validators.required]),
      });
    } else {
      const now = new Date();
      this.formGroup = this.fb.group({
        date: this.fb.control<Date>(now, [Validators.required]),
        hours: this.fb.control<number>(now.getHours(), [
          Validators.required,
          Validators.min(0),
          Validators.max(23),
        ]),
        minutes: this.fb.control<number>(now.getMinutes(), [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
        seconds: this.fb.control<number>(now.getSeconds(), [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
        timezone: this.fb.control<string>('Asia/Tokyo', [Validators.required]),
      });
    }

    this.filteredTimezones = COMMON_TIMEZONES;
  }
}
