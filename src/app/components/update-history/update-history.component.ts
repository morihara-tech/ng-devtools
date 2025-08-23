import { Component, Input, LOCALE_ID, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { UpdateHistoryModel } from './update-history-model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-update-history',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useExisting: LOCALE_ID },
  ],
  imports: [
    MatListModule,
  ],
  templateUrl: './update-history.component.html',
  styleUrl: './update-history.component.scss'
})
export class UpdateHistoryComponent {
  @Input() histories: Array<UpdateHistoryModel> = [];

  private readonly locale = signal(inject<string>(MAT_DATE_LOCALE));

  getHistoryDate(history: UpdateHistoryModel): string {
    const date = new Date(history.date);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${history.date}`);
    }
    return date.toLocaleDateString(this.locale());
  }

}
