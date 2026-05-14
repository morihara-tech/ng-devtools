import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { PlatformService } from '../../core/services/platform.service';
import { HelpDrawerService } from '../../services/help-drawer.service';
import { AdComponent } from '../ad/ad.component';
import { environment } from '../../../environments/environment';

/** Horizontal padding (px) on each side inside .ad-wrapper */
const AD_WRAPPER_PADDING = 8;

/** Height-to-width ratio for the sidebar ad (4:3 landscape rectangle). */
const AD_HEIGHT_RATIO = 0.75;

@Component({
  selector: 'app-application-page-template',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    NgTemplateOutlet,
    AdComponent,
  ],
  templateUrl: './application-page-template.component.html',
  styleUrl: './application-page-template.component.scss'
})
export class ApplicationPageTemplateComponent implements OnInit, OnDestroy {
  readonly initialHelpDrawerContent = input<TemplateRef<unknown> | null>(null);

  protected readonly sidebarSlot = environment.adsense.sidebarSlot;

  private readonly platformService = inject(PlatformService);
  private readonly helpDrawerService = inject(HelpDrawerService);

  readonly isHelpDrawerOpen = toSignal(this.helpDrawerService.opened$, { initialValue: false });
  readonly helpDrawerContent = toSignal(this.helpDrawerService.content$, { initialValue: null });
  private readonly screenWidth = signal(this.platformService.window?.innerWidth ?? 0);

  private resizeHandler?: () => void;

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

  ngOnInit(): void {
    this.helpDrawerService.setContent(this.initialHelpDrawerContent());

    this.resizeHandler = () => {
      this.screenWidth.set(this.platformService.window?.innerWidth ?? 0);
    };
    this.platformService.window?.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      this.platformService.window?.removeEventListener('resize', this.resizeHandler);
    }
    this.adWrapperResizeObserver?.disconnect();
    this.helpDrawerService.reset();
  }

  onOpenedChange(opened: boolean): void {
    this.helpDrawerService.setOpened(opened);
  }

  onCloseHelp(): void {
    this.helpDrawerService.close();
  }

  get helpDrawerMode(): MatDrawerMode {
    return this.screenWidth() < 600 ? 'over' : 'side';
  }

  get hasBackdrop(): boolean {
    return this.helpDrawerMode === 'over';
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
