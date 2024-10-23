export interface HeaderModel {
  logo: HeaderLogoModel;
  person?: PersonButtonModel;
}

export interface HeaderLogoModel {
  logoUrl: string;
  routerLink: string;
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
