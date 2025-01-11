import { Observable, of } from "rxjs";
import { DEF_TEXT } from "./def/def.text";
import { Locale } from "../../app/components/locale/locale-model";

export const TEXT = (locale: Locale): Observable<Text> => {
  return of(DEF_TEXT[locale]);
}

export type Text = { [key: string]: string };
