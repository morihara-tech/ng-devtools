import { Observable, of } from "rxjs";
import { Locale } from "../../app/components/locale/locale-model";
import { UpdateHistoryDefModel, UpdateHistoryModel } from "../../app/components/update-history/update-history-model";

export const UPDATE_HISTORIES = (locale: Locale, historyDefs: Array<UpdateHistoryDefModel>): Observable<Array<UpdateHistoryModel>> => {
  return of(historyDefs.map(history => ({ date: history.date, description: history.description[locale] })));
}
