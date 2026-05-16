import { afterNextRender, Component, effect, ElementRef, inject, input, OnDestroy, signal, untracked, viewChild } from '@angular/core';
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
 * and pass the resulting pixel values as signal inputs.
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

  /**
   * Set to `true` once the DOM has been rendered for the first time.
   * Used to gate the initialisation effect so it never runs server-side.
   */
  private readonly domReady = signal(false);

  /** Guards against calling `adsbygoogle.push({})` more than once per slot. */
  private adInitialized = false;

  constructor() {
    // Mark the DOM as ready after the first browser render.
    afterNextRender(() => {
      this.domReady.set(true);
    });

    // Initialise the ad slot reactively.
    //
    // In zoneless Angular, effects are flushed *after* all view bindings have been
    // updated in the same change-detection cycle. This means that by the time this
    // effect runs (triggered by `domReady` becoming `true`), the parent's template
    // binding `[width]="adWidth()"` has already propagated the measured value into
    // the `width` input signal – resolving the race that existed with the previous
    // `afterNextRender`-only approach.
    effect(() => {
      const ready = this.domReady();
      const w = this.width();
      const h = this.height();

      if (!ready || this.adInitialized) return;

      const hasExplicit = w !== undefined && h !== undefined && w > 0 && h > 0;
      const isResponsive = w === undefined && h === undefined;

      if (hasExplicit || isResponsive) {
        this.adInitialized = true;
        untracked(() => this.applyDimensionsAndInit());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.adBlockCheckTimeout !== undefined) {
      clearTimeout(this.adBlockCheckTimeout);
    }
  }

  /**
   * Applies explicit dimensions to the `<ins>` DOM node (if provided) and then
   * calls `adsbygoogle.push({})`. Must be called at most once per slot.
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
