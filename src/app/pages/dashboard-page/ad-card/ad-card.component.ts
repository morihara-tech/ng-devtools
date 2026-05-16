import { afterNextRender, Component, ElementRef, inject, OnDestroy, signal } from '@angular/core';
import { AdComponent } from '../../../components/ad/ad.component';
import { environment } from '../../../../environments/environment';

/**
 * Dashboard card that renders an AdSense advertisement.
 * Placed as a draggable, resizable card in the dashboard grid.
 *
 * After the first browser render the host element's pixel dimensions are measured
 * and forwarded to `<app-ad>` as explicit width/height inputs, so AdSense serves
 * a fixed-size ad that matches the card content area rather than a responsive one.
 */
@Component({
  selector: 'app-ad-card',
  imports: [AdComponent],
  templateUrl: './ad-card.component.html',
  styles: [`:host { display: block; width: 100%; height: 100%; }`],
})
export class AdCardComponent implements OnDestroy {
  protected readonly dashboardSlot = environment.adsense.dashboardSlot;

  /** Measured width of the card content area (px). Undefined until first render. */
  protected readonly adWidth = signal<number | undefined>(undefined);
  /** Measured height of the card content area (px). Undefined until first render. */
  protected readonly adHeight = signal<number | undefined>(undefined);

  private readonly host = inject(ElementRef<HTMLElement>);
  private resizeObserver?: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      this.updateDimensions(el);

      // Keep dimensions in sync when the card is resized by the user.
      this.resizeObserver = new ResizeObserver(() => this.updateDimensions(el));
      this.resizeObserver.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private updateDimensions(el: HTMLElement): void {
    const w = el.offsetWidth;
    const h = el.offsetHeight - 16;
    if (w > 0) this.adWidth.set(w);
    if (h > 0) this.adHeight.set(h);
  }
}
