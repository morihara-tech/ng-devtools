import { Type } from "@angular/core";

export interface DashboardCardModel {
  title: string;
  information?: string;
  component: Type<any>;
  size?: DashboardCardSizeModel;
  destination?: DashboardCardDestinationModel;
}

export interface DashboardCardDestinationModel {
  linkText: string;
  url: string;
  external?: boolean;
  openInNewTab?: boolean;
}

export interface DashboardCardSizeModel {
  x?: 's' | 'm' | 'l';
  y?: 's' | 'm' | 'l';
}
