import { inject, Injectable, signal } from '@angular/core';
import { PlatformService } from '../core/services/platform.service';

const STORAGE_KEY = 'app_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

type ConsentValue = 'granted' | 'denied';
type ConsentStatus = ConsentValue | 'unknown';

interface ConsentRecord {
  status: ConsentValue;
  timestamp: number;
}

type WindowWithDataLayer = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * Manages Google Consent Mode v2 state.
 * Persists the user's choice in localStorage and issues gtag consent commands.
 */
@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  private readonly platformService = inject(PlatformService);

  /** True when the consent banner should be displayed to the user. */
  readonly needsBanner = signal(false);

  /**
   * Returns the persisted consent status.
   * Returns 'unknown' when no valid (non-expired) record exists.
   */
  getConsentStatus(): ConsentStatus {
    try {
      const raw = this.platformService.localStorage?.getItem(STORAGE_KEY);
      if (!raw) return 'unknown';
      const record: ConsentRecord = JSON.parse(raw) as ConsentRecord;
      if (this.isExpired(record.timestamp)) return 'unknown';
      return record.status;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Issues a `gtag('consent', 'default', ...)` command based on the persisted
   * status, then signals whether the banner should appear.
   * Must be called before the GA4 script is loaded.
   */
  initializeConsentDefaults(): void {
    const status = this.getConsentStatus();
    const consentState: ConsentValue = status === 'granted' ? 'granted' : 'denied';

    this.pushConsentDefault(consentState);
    this.needsBanner.set(status === 'unknown');
  }

  /** Grants all consent types, updates gtag, and hides the banner. */
  acceptAll(): void {
    this.issueConsentUpdate('granted');
    this.persistConsent('granted');
    this.needsBanner.set(false);
  }

  /** Denies all consent types, persists the choice, and hides the banner. */
  denyAll(): void {
    this.persistConsent('denied');
    this.needsBanner.set(false);
  }

  private pushConsentDefault(state: ConsentValue): void {
    const win = this.platformService.window as WindowWithDataLayer | null;
    if (!win) return;

    // Ensure dataLayer and gtag are available for consent defaults to be
    // pushed before the GA4 script loads.
    win.dataLayer = win.dataLayer ?? [];
    win.gtag = win.gtag ?? ((...args: unknown[]) => win.dataLayer!.push(args));

    win.gtag('consent', 'default', {
      analytics_storage: state,
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    });
  }

  private issueConsentUpdate(state: ConsentValue): void {
    const win = this.platformService.window as WindowWithDataLayer | null;
    win?.gtag?.('consent', 'update', {
      analytics_storage: state,
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    });
  }

  private persistConsent(status: ConsentValue): void {
    const record: ConsentRecord = { status, timestamp: Date.now() };
    try {
      this.platformService.localStorage?.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage errors (e.g., private browsing quota)
    }
  }

  private isExpired(timestamp: number): boolean {
    const expiryMs = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp > expiryMs;
  }
}
