import { Component, inject } from '@angular/core';
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

  onAcceptAll(): void {
    this.consentService.acceptAll();
  }

  onDenyAll(): void {
    this.consentService.denyAll();
  }

  onPrivacyPolicy(): void {
    this.consentService.dismissBanner();
  }
}
