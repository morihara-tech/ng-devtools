export interface HeaderModel {
  logo: HeaderLogoModel;
  person?: PersonButtonModel;
  appsButton?: HeaderAppsButtonModel;
}

export interface HeaderLogoModel {
  logoUrl: string;
  routerLink: string;
}

export interface HeaderAppsButtonModel {
  routerLink: string;
  label: string;
}

export interface PersonButtonModel {
  name: string;
  menus: Array<PersonButtonMenuModel>;
}

export interface PersonButtonMenuModel {
  menuId: string;
  label: string;
  icon: string;
}
