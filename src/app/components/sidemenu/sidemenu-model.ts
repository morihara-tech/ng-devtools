export interface SidemenuItemModel {
  label: string;
  icon?: string;
  svgIcon?: string;
  routerLink: string;
}

export interface SidemenuCategoryModel {
  label: string;
  items: SidemenuItemModel[];
}

export interface SidemenuPersonModel {
  personName: string;
  // iconUrl?: string;
}
