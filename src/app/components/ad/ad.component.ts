import { afterNextRender, Component, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Supported ad providers. */
export type AdProvider = 'adsense';

/**
 * Generic ad slot component.
 * Renders the appropriate ad tag for the given provider and slot, then initializes
 * the ad network SDK after the first browser render.
 * Hides itself entirely when an ad blocker prevents the ad from loading,
 * so no empty space is left in the layout.
 */
@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrl: './ad.component.scss',
})
export class AdComponent implements OnDestroy {
  /** Ad network provider. Currently only 'adsense' is supported. */
  readonly provider = input.required<AdProvider>();

  /** Ad unit slot ID as supplied by the ad network. */
  readonly slotId = input.required<string>();

  protected readonly clientId = environment.adsense.clientId;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly insRef = viewChild<ElementRef<HTMLElement>>('adIns');

  private adBlockCheckTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => {
      this.initAd();
    });
  }

  ngOnDestroy(): void {
    if (this.adBlockCheckTimeout !== undefined) {
      clearTimeout(this.adBlockCheckTimeout);
    }
  }

  /** Initializes the AdSense ad unit and detects adblock by checking the rendered height. */
  private initAd(): void {
    if (this.provider() !== 'adsense') return;

    try {
      const win = window as Window & { adsbygoogle?: object[] };
      (win.adsbygoogle = win.adsbygoogle ?? []).push({});
    } catch {
      this.hideHost();
      return;
    }

    // Allow the ad network a short delay to fill the slot before measuring.
    this.adBlockCheckTimeout = setTimeout(() => this.detectAdBlock(), AD_BLOCK_CHECK_DELAY_MS);
  }

  /** Hides the host element when the ad is blocked or failed to load. */
  private detectAdBlock(): void {
    const ins = this.insRef()?.nativeElement;
    if (!ins || ins.offsetHeight === 0) {
      this.hideHost();
    }
  }

  private hideHost(): void {
    this.host.nativeElement.style.display = 'none';
  }
}

/** Milliseconds to wait before checking whether the ad slot was filled. */
const AD_BLOCK_CHECK_DELAY_MS = 1500;
