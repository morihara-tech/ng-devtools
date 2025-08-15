import { Locale } from "../locale/locale-model";

export interface UpdateHistoryDefModel {
  date: string;
  description: { [locale in Locale]: string };
}

export interface UpdateHistoryModel {
  date: string;
  description: string;
}
