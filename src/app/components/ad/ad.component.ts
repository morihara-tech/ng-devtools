import { afterNextRender, Component, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Supported ad providers. */
export type AdProvider = 'adsense';

type WindowWithAdsByGoogle = Window & { adsbygoogle?: object[] };

/**
 * Generic ad slot component.
 * Renders the appropriate ad tag for the given provider and slot, then initializes
 * the ad network SDK after the first browser render.
 *
 * **Explicit-size mode** – supply both `width` and `height` (in px) to serve a
 * fixed-dimension ad unit. The parent component should measure the available area
 * in its own `afterNextRender` callback (which Angular guarantees fires before the
 * child's callback) and pass the resulting pixel values as inputs.
 *
 * **Responsive mode** (default) – omit both inputs; the `<ins>` element uses
 * `data-ad-format="auto"` and `data-full-width-responsive="true"`.
 *
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

  /**
   * Explicit ad width in pixels.
   * When both `width` and `height` are positive, the component uses explicit-size
   * mode instead of responsive mode.
   */
  readonly width = input<number>();

  /**
   * Explicit ad height in pixels.
   * When both `width` and `height` are positive, the component uses explicit-size
   * mode instead of responsive mode.
   */
  readonly height = input<number>();

  protected readonly clientId = environment.adsense.clientId;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly insRef = viewChild<ElementRef<HTMLElement>>('adIns');

  private adBlockCheckTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => {
      this.applyDimensionsAndInit();
    });
  }

  ngOnDestroy(): void {
    if (this.adBlockCheckTimeout !== undefined) {
      clearTimeout(this.adBlockCheckTimeout);
    }
  }

  /**
   * Applies explicit dimensions to the `<ins>` DOM node (if provided) and then
   * calls `adsbygoogle.push({})`.
   *
   * Angular fires `afterNextRender` callbacks in registration order – parent
   * components are instantiated (and therefore register their callbacks) before
   * child components. This means the parent's measurement callback runs first,
   * updating the `width` and `height` signal inputs synchronously before this
   * callback executes.
   */
  private applyDimensionsAndInit(): void {
    if (this.provider() !== 'adsense') return;

    const ins = this.insRef()?.nativeElement;
    const w = this.width();
    const h = this.height();
    const isExplicit = ins !== undefined && w !== undefined && h !== undefined && w > 0 && h > 0;

    if (isExplicit) {
      ins!.style.display = 'block';
      ins!.style.width = `${w}px`;
      ins!.style.height = `${h}px`;
      ins!.removeAttribute('data-ad-format');
      ins!.removeAttribute('data-full-width-responsive');
    }

    try {
      const win = window as WindowWithAdsByGoogle;
      (win.adsbygoogle = win.adsbygoogle ?? []).push({});
    } catch {
      this.hideHost();
      return;
    }

    this.adBlockCheckTimeout = setTimeout(
      () => this.detectAdBlock(isExplicit),
      AD_BLOCK_CHECK_DELAY_MS,
    );
  }

  /**
   * Hides the host element when the ad was blocked or failed to fill.
   * In explicit-size mode the `<ins>` always has a non-zero offsetHeight (due to
   * the CSS we applied), so we check for child content (the AdSense iframe) instead.
   */
  private detectAdBlock(isExplicit: boolean): void {
    const ins = this.insRef()?.nativeElement;
    if (!ins) {
      this.hideHost();
      return;
    }

    const adBlocked = isExplicit ? ins.children.length === 0 : ins.offsetHeight === 0;
    if (adBlocked) {
      this.hideHost();
    }
  }

  private hideHost(): void {
    this.host.nativeElement.style.display = 'none';
  }
}

/** Milliseconds to wait before checking whether the ad slot was filled. */
const AD_BLOCK_CHECK_DELAY_MS = 1500;
