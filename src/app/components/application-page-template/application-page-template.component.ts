import {
  afterNextRender,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { AdComponent } from '../ad/ad.component';
import { environment } from '../../../environments/environment';

/** Horizontal padding (px) on each side inside .ad-wrapper */
const AD_WRAPPER_PADDING = 8;

/** Height-to-width ratio for the sidebar ad (4:3 landscape rectangle). */
const AD_HEIGHT_RATIO = 0.75;

@Component({
  selector: 'app-application-page-template',
  imports: [
    AdComponent,
  ],
  templateUrl: './application-page-template.component.html',
  styleUrl: './application-page-template.component.scss'
})
export class ApplicationPageTemplateComponent implements OnDestroy {
  protected readonly sidebarSlot = environment.adsense.sidebarSlot;

  /** Reference to the `.ad-wrapper` element, used to measure available ad width. */
  private readonly adWrapperRef = viewChild<ElementRef<HTMLElement>>('adWrapper');

  /** Measured content width of the ad-wrapper (px). Undefined until first render. */
  protected readonly adWidth = signal<number | undefined>(undefined);
  /** Computed height derived from `adWidth` using a 4:3 landscape ratio. */
  protected readonly adHeight = signal<number | undefined>(undefined);

  private adWrapperResizeObserver?: ResizeObserver;

  constructor() {
    // Measure the ad-wrapper after the first browser render. Angular guarantees
    // that a parent component's afterNextRender callback fires before child
    // components' callbacks (registration order = instantiation order), so the
    // adWidth / adHeight signals are set before AdComponent initialises its slot.
    afterNextRender(() => {
      const el = this.adWrapperRef()?.nativeElement;
      if (!el) return;

      this.updateAdSize(el);
      this.adWrapperResizeObserver = new ResizeObserver(() => this.updateAdSize(el));
      this.adWrapperResizeObserver.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.adWrapperResizeObserver?.disconnect();
  }

  /**
   * Computes the usable ad width from the wrapper element's offsetWidth
   * (subtracting horizontal padding) and derives a 4:3 landscape height.
   */
  private updateAdSize(el: HTMLElement): void {
    const w = el.offsetWidth - AD_WRAPPER_PADDING * 2;
    if (w > 0) {
      this.adWidth.set(w);
      this.adHeight.set(Math.round(w * AD_HEIGHT_RATIO));
    }
  }
}
