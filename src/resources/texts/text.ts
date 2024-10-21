import { Observable, of } from "rxjs";
import { DEF_TEXT } from "./def/def.text";

export const TEXT = (locale: Locale): Observable<Text> => {
  return of(DEF_TEXT[locale]);
}

export type Locale = 'en' | 'ja';
export type Text = { [key: string]: string };
