import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('ulid', sanitizer.bypassSecurityTrustResourceUrl('icons/ulid.svg'));
    iconRegistry.addSvgIcon('uuid', sanitizer.bypassSecurityTrustResourceUrl('icons/uuid.svg'));
  }
}
