import { Component, Input, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { UpdateHistoryDefModel, UpdateHistoryModel } from './update-history-model';
import { LocaleService } from '../locale/locale.service';
import { mergeMap } from 'rxjs';
import { UPDATE_HISTORIES } from '../../../resources/update-history/update-history';

@Component({
  selector: 'app-update-history',
  imports: [
    MatListModule,
  ],
  templateUrl: './update-history.component.html',
  styleUrl: './update-history.component.scss'
})
export class UpdateHistoryComponent implements OnInit {
  @Input() historiesDef: Array<UpdateHistoryDefModel> = [];

  dateLocale: string = 'en-US';
  histories: Array<UpdateHistoryModel> = [];

  constructor(
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.localeService.get()
      .pipe(mergeMap((locale) => {
        this.dateLocale = locale === 'ja' ? 'ja-JP' : 'en-US';
        return UPDATE_HISTORIES(locale, this.historiesDef)
      }))
      .subscribe((res) => {
        this.histories = res;
      });
  }

  getHistoryDate(history: UpdateHistoryModel): string {
    const date = new Date(history.date);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${history.date}`);
    }
    return date.toLocaleDateString(this.dateLocale);
  }

}
