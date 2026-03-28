import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnDestroy,
  viewChild,
  viewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DashboardCardModel } from '../dashboard-card-model';
import { DashboardService } from '../dashboard.service';
import { HyperLinkTextComponent } from '../../hyper-link-text/hyper-link-text.component';
import { PlatformService } from '../../../core/services/platform.service';

const DEBOUNCE_DELAY = 50;
const MAX_CARD_WIDTH = 360;
const MAX_CARD_WIDTH_FOR_SMALL_WINDOW = 320;
const MAX_CARD_HEIGHT = 240;
const GAP_SIZE = 16;

const STORAGE_KEY = 'dashboard_layout';

/** Threshold (px) between snap sizes; halfway between adjacent sizes + gap */
const RESIZE_SNAP_THRESHOLD = (MAX_CARD_HEIGHT + GAP_SIZE) / 2;

/** Minimum card dimension (px) allowed during a free-form resize drag. */
const MIN_CARD_SIZE = 80;

const SIZE_M_MULTIPLIER = 2;
const SIZE_L_MULTIPLIER = 3;

type CardSize = 's' | 'm' | 'l';

interface ResizeState {
  /** Width of the blue placeholder (snapped to s/m/l). */
  placeholderWidth: number;
  /** Height of the blue placeholder (snapped to s/m/l). */
  placeholderHeight: number;
  /** Left offset of the placeholder relative to .card-container. */
  placeholderLeft: number;
  /** Top offset of the placeholder relative to .card-container. */
  placeholderTop: number;
  /** The card's current free-form width during drag (not snapped). */
  freeWidth: number;
  /** The card's current free-form height during drag (not snapped). */
  freeHeight: number;
}

interface LayoutEntry {
  id: string;
  size: { x?: CardSize; y?: CardSize };
}

@Component({
  selector: 'app-dashboard-page-template',
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    CdkDragPlaceholder,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    HyperLinkTextComponent
],
  templateUrl: './dashboard-page-template.component.html',
  styleUrl: './dashboard-page-template.component.scss',
})
export class DashboardPageTemplateComponent implements AfterViewInit, OnDestroy {
  private readonly cardContainer = viewChild.required('cardContainer', { read: ViewContainerRef });
  private readonly cardWrapper = viewChild.required('cardWrapper', { read: ViewContainerRef });
  private readonly cardContents = viewChildren('cardContent', { read: ViewContainerRef });

  readonly api = input.required<DashboardService>();
  readonly defaultCards = input<DashboardCardModel[]>([]);

  isReady: boolean = false;
  cardModels: DashboardCardModel[] = [];
  wrapperWidth: number = 0;

  /** Non-null while a card resize drag is in progress. */
  resizeState: ResizeState | null = null;
  /** The model being resized (used to override its width/height in the template). */
  resizingModel: DashboardCardModel | null = null;

  private subscription: Subscription | null = null;
  private resizeObserver!: ResizeObserver;
  private debounceTimeout!: ReturnType<typeof setTimeout>;

  /** Mouse event listeners added to document during a resize drag. */
  private resizeMouseMove?: (e: MouseEvent) => void;
  private resizeMouseUp?: (e: MouseEvent) => void;

  /** Tracks the starting position when a resize drag begins. */
  private resizeStart = { clientX: 0, clientY: 0, width: 0, height: 0 };

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformService = inject(PlatformService);

  ngAfterViewInit(): void {
    if (!this.platformService.isBrowser()) {
      return;
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.initCardWrapper(width);
        }, DEBOUNCE_DELAY);
      }
    });
    if (this.cardContainer()?.element?.nativeElement) {
      this.resizeObserver.observe(this.cardContainer().element.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.resizeObserver?.disconnect();
    clearTimeout(this.debounceTimeout);
    this.removeResizeListeners();
  }

  // ── Drag-and-drop reorder ──────────────────────────────────────────────────

  onDrop(event: CdkDragDrop<string[]>): void {
    this.api().move(event.previousIndex, event.currentIndex);
    this.saveLayout();
  }

  // ── Card size helpers ──────────────────────────────────────────────────────

  getCardWidth(model: DashboardCardModel): number {
    if (this.getMaxWrapperWidth() > this.wrapperWidth) {
      return this.wrapperWidth;
    }
    return this.getCardWidthForSize(model.size?.x ?? 's');
  }

  getCardHeight(model: DashboardCardModel): number {
    return this.getCardHeightForSize(model.size?.y ?? 's');
  }

  // ── Resize via mouse events ────────────────────────────────────────────────

  /**
   * Starts a resize drag sequence for the given card.
   * Binds mousemove/mouseup listeners to the document for the duration of the drag.
   */
  onResizeMouseDown(event: MouseEvent, model: DashboardCardModel): void {
    event.preventDefault();
    event.stopPropagation();

    const handleEl = event.currentTarget as HTMLElement;
    const cardEl = handleEl.closest('mat-card') as HTMLElement | null;
    const containerEl = handleEl.closest('.card-container') as HTMLElement | null;
    const cardRect = (cardEl ?? handleEl).getBoundingClientRect();
    const containerRect = containerEl?.getBoundingClientRect() ?? { left: 0, top: 0 };

    this.resizingModel = model;
    this.resizeStart = {
      clientX: event.clientX,
      clientY: event.clientY,
      width: this.getCardWidth(model),
      height: this.getCardHeight(model),
    };

    this.resizeState = {
      placeholderWidth: this.getCardWidth(model),
      placeholderHeight: this.getCardHeight(model),
      placeholderLeft: cardRect.left - containerRect.left,
      placeholderTop: cardRect.top - containerRect.top,
      freeWidth: this.getCardWidth(model),
      freeHeight: this.getCardHeight(model),
    };

    this.resizeMouseMove = (e: MouseEvent) => this.onResizeMove(e);
    this.resizeMouseUp = (e: MouseEvent) => this.onResizeEnd(e);
    this.platformService.nativeDocument.addEventListener('mousemove', this.resizeMouseMove);
    this.platformService.nativeDocument.addEventListener('mouseup', this.resizeMouseUp);
  }

  private onResizeMove(event: MouseEvent): void {
    if (!this.resizeState || !this.resizingModel) return;

    const dx = event.clientX - this.resizeStart.clientX;
    const dy = event.clientY - this.resizeStart.clientY;

    const freeWidth = Math.max(MIN_CARD_SIZE, this.resizeStart.width + dx);
    const freeHeight = Math.max(MIN_CARD_SIZE, this.resizeStart.height + dy);

    const snappedX = this.snapWidth(freeWidth, this.getCardWidthForSize('s'));
    const snappedY = this.snapHeight(freeHeight, this.getCardHeightForSize('s'));

    this.resizeState = {
      ...this.resizeState!,
      freeWidth,
      freeHeight,
      placeholderWidth: this.getCardWidthForSize(snappedX),
      placeholderHeight: this.getCardHeightForSize(snappedY),
    };
    this.cdr.markForCheck();
  }

  private onResizeEnd(event: MouseEvent): void {
    this.removeResizeListeners();

    if (!this.resizeState || !this.resizingModel) {
      this.resizeState = null;
      this.resizingModel = null;
      return;
    }

    const dx = event.clientX - this.resizeStart.clientX;
    const dy = event.clientY - this.resizeStart.clientY;
    const finalWidth = Math.max(MIN_CARD_SIZE, this.resizeStart.width + dx);
    const finalHeight = Math.max(MIN_CARD_SIZE, this.resizeStart.height + dy);

    const newX = this.snapWidth(finalWidth, this.getCardWidthForSize('s'));
    const newY = this.snapHeight(finalHeight, this.getCardHeightForSize('s'));

    const model = this.resizingModel!;
    if (!model.size) {
      model.size = {};
    }
    model.size.x = newX;
    model.size.y = newY;

    this.resizeState = null;
    this.resizingModel = null;
    this.saveLayout();
    this.cdr.detectChanges();
  }

  private removeResizeListeners(): void {
    if (this.resizeMouseMove) {
      this.platformService.nativeDocument.removeEventListener('mousemove', this.resizeMouseMove);
      this.resizeMouseMove = undefined;
    }
    if (this.resizeMouseUp) {
      this.platformService.nativeDocument.removeEventListener('mouseup', this.resizeMouseUp);
      this.resizeMouseUp = undefined;
    }
  }

  // ── Layout persistence ─────────────────────────────────────────────────────

  /** Saves card order and sizes to localStorage. */
  saveLayout(): void {
    const layout: LayoutEntry[] = this.api().getAll().map((m) => ({
      id: m.id,
      size: { x: m.size?.x, y: m.size?.y },
    }));
    try {
      this.platformService.localStorage?.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch {
      // Ignore quota errors
    }
  }

  /** Clears saved layout and resets to defaults. */
  resetLayout(): void {
    try {
      this.platformService.localStorage?.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
    this.api().update([...this.defaultCards()]);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private initCardWrapper(width: number): void {
    this.setWrapperWidth(width);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.api().cards.subscribe((cardModels) => {
      this.cardModels = cardModels;
      this.showCards();
    });
  }

  private setWrapperWidth(containerWidth: number): void {
    if (this.getMaxWrapperWidth() < containerWidth) {
      this.wrapperWidth = this.getMaxWrapperWidth();
      return;
    }
    if (containerWidth < this.getBaseCardWidth()) {
      this.wrapperWidth = containerWidth;
      return;
    }
    for (let i = 0; ; i++) {
      const cardsWidthStart = this.getBaseCardWidth() * (i + 1) + GAP_SIZE * i;
      const cardsWidthEnd = this.getBaseCardWidth() * (i + 2) + GAP_SIZE * (i + 1);
      if (containerWidth >= cardsWidthStart && containerWidth < cardsWidthEnd) {
        this.wrapperWidth = cardsWidthStart;
        break;
      }
    }
  }

  private getBaseCardWidth(): number {
    return this.wrapperWidth > 1000 ? MAX_CARD_WIDTH : MAX_CARD_WIDTH_FOR_SMALL_WINDOW;
  }

  private getMaxWrapperWidth(): number {
    return this.getBaseCardWidth() * 3 + GAP_SIZE * 2;
  }

  private getCardWidthForSize(size: CardSize | undefined): number {
    const base = this.getBaseCardWidth();
    switch (size) {
      case 'm': return base * SIZE_M_MULTIPLIER + GAP_SIZE;
      case 'l': return base * SIZE_L_MULTIPLIER + GAP_SIZE * (SIZE_L_MULTIPLIER - 1);
      case 's':
      default:  return base;
    }
  }

  private getCardHeightForSize(size: CardSize | undefined): number {
    switch (size) {
      case 'm': return MAX_CARD_HEIGHT * SIZE_M_MULTIPLIER + GAP_SIZE;
      case 'l': return MAX_CARD_HEIGHT * SIZE_L_MULTIPLIER + GAP_SIZE * (SIZE_L_MULTIPLIER - 1);
      case 's':
      default:  return MAX_CARD_HEIGHT;
    }
  }

  private snapWidth(pixels: number, baseWidth: number): CardSize {
    const sMax = baseWidth + (baseWidth + GAP_SIZE) / 2;
    const mMax = baseWidth * 2 + GAP_SIZE + (baseWidth + GAP_SIZE) / 2;
    if (pixels < sMax) return 's';
    if (pixels < mMax) return 'm';
    return 'l';
  }

  private snapHeight(pixels: number, baseHeight: number): CardSize {
    const sMax = baseHeight + RESIZE_SNAP_THRESHOLD;
    const mMax = baseHeight * 2 + GAP_SIZE + RESIZE_SNAP_THRESHOLD;
    if (pixels < sMax) return 's';
    if (pixels < mMax) return 'm';
    return 'l';
  }

  private showCards(): void {
    this.cardModels.forEach((model, i) => {
      this.cdr.detectChanges();
      const cardContent = this.cardContents()[i];
      if (!cardContent) {
        console.warn(`Card for index ${i} not found.`);
        return;
      }
      cardContent.clear();
      cardContent.createComponent(model.component);
    });
    this.isReady = true;
  }
}
