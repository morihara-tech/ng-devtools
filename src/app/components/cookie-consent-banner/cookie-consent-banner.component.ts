import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent-banner',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './cookie-consent-banner.component.html',
  styleUrl: './cookie-consent-banner.component.scss',
})
export class CookieConsentBannerComponent {
  private readonly consentService = inject(CookieConsentService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CookieConsentBannerComponent>);

  onAcceptAll(): void {
    this.consentService.acceptAll();
    this.bottomSheetRef.dismiss();
  }

  onDenyAll(): void {
    this.consentService.denyAll();
    this.bottomSheetRef.dismiss();
  }

  onPrivacyPolicy(): void {
    this.bottomSheetRef.dismiss();
  }
}
