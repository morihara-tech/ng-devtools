import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  CdkDragHandle,
  CdkDragMove,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DashboardCardModel } from '../dashboard-card-model';
import { DashboardService } from '../dashboard.service';
import { HyperLinkTextComponent } from '../../hyper-link-text/hyper-link-text.component';

const DEBOUNCE_DELAY = 50;
const MAX_CARD_WIDTH = 360;
const MAX_CARD_WIDTH_FOR_SMALL_WINDOW = 320;
const MAX_CARD_HEIGHT = 240;
const GAP_SIZE = 16;

const STORAGE_KEY = 'dashboard_layout';

/** Threshold (px) between snap sizes; halfway between adjacent sizes + gap */
const RESIZE_SNAP_THRESHOLD = (MAX_CARD_HEIGHT + GAP_SIZE) / 2;

type CardSize = 's' | 'm' | 'l';

interface ResizeState {
  model: DashboardCardModel;
  placeholderWidth: number;
  placeholderHeight: number;
  placeholderLeft: number;
  placeholderTop: number;
}

interface LayoutEntry {
  id: string;
  size: { x?: CardSize; y?: CardSize };
}

@Component({
  selector: 'app-dashboard-page-template',
  imports: [
    CommonModule,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    CdkDragPlaceholder,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    HyperLinkTextComponent,
  ],
  templateUrl: './dashboard-page-template.component.html',
  styleUrl: './dashboard-page-template.component.scss',
})
export class DashboardPageTemplateComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardContainer', { read: ViewContainerRef }) cardContainer!: ViewContainerRef;
  @ViewChild('cardWrapper', { read: ViewContainerRef }) cardWrapper!: ViewContainerRef;
  @ViewChildren('cardContent', { read: ViewContainerRef }) cardContents!: QueryList<ViewContainerRef>;

  @Input() api!: DashboardService;
  @Input() defaultCards: DashboardCardModel[] = [];

  cardModels: DashboardCardModel[] = [];
  wrapperWidth: number = 0;
  resizeState: ResizeState | null = null;

  private subscription: Subscription | null = null;
  private resizeObserver!: ResizeObserver;
  private debounceTimeout!: ReturnType<typeof setTimeout>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.initCardWrapper(width);
        }, DEBOUNCE_DELAY);
      }
    });
    if (this.cardContainer?.element?.nativeElement) {
      this.resizeObserver.observe(this.cardContainer.element.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.resizeObserver?.disconnect();
    clearTimeout(this.debounceTimeout);
  }

  // ── Drag-and-drop reorder ──────────────────────────────────────────────────

  onDrop(event: CdkDragDrop<string[]>): void {
    this.api.move(event.previousIndex, event.currentIndex);
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

  // ── Resize handle ──────────────────────────────────────────────────────────

  onResizeDragStarted(model: DashboardCardModel, resizeHandleElement: HTMLElement): void {
    const cardElement = resizeHandleElement.closest('mat-card') as HTMLElement | null;
    const rect = (cardElement ?? resizeHandleElement).getBoundingClientRect();
    const containerRect = resizeHandleElement.closest('.card-container')?.getBoundingClientRect();
    this.resizeState = {
      model,
      placeholderWidth: this.getCardWidth(model),
      placeholderHeight: this.getCardHeight(model),
      placeholderLeft: containerRect ? rect.left - containerRect.left : 0,
      placeholderTop: containerRect ? rect.top - containerRect.top : 0,
    };
  }

  onResizeDragMoved(event: CdkDragMove, model: DashboardCardModel): void {
    if (!this.resizeState) return;
    const baseWidth = this.getCardWidthForSize('s');
    const baseHeight = this.getCardHeightForSize('s');
    const currentWidth = this.getCardWidth(model);
    const currentHeight = this.getCardHeight(model);

    const targetX = this.snapWidth(currentWidth + event.distance.x, baseWidth);
    const targetY = this.snapHeight(currentHeight + event.distance.y, baseHeight);

    this.resizeState = {
      ...this.resizeState,
      placeholderWidth: this.getCardWidthForSize(targetX),
      placeholderHeight: this.getCardHeightForSize(targetY),
    };
  }

  onResizeDragEnded(event: CdkDragEnd, model: DashboardCardModel): void {
    if (!this.resizeState) return;

    const baseWidth = this.getCardWidthForSize('s');
    const baseHeight = this.getCardHeightForSize('s');
    const currentWidth = this.getCardWidth(model);
    const currentHeight = this.getCardHeight(model);

    const newX = this.snapWidth(currentWidth + event.distance.x, baseWidth);
    const newY = this.snapHeight(currentHeight + event.distance.y, baseHeight);

    if (!model.size) {
      model.size = {};
    }
    model.size.x = newX;
    model.size.y = newY;

    this.resizeState = null;
    this.saveLayout();
    this.cdr.detectChanges();

    // Return the drag handle to its original position
    event.source.reset();
  }

  // ── Layout persistence ─────────────────────────────────────────────────────

  /** Saves card order and sizes to localStorage. */
  saveLayout(): void {
    const layout: LayoutEntry[] = this.api.getAll().map((m) => ({
      id: m.id,
      size: { x: m.size?.x, y: m.size?.y },
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch {
      // Ignore quota errors
    }
  }

  /** Clears saved layout and resets to defaults. */
  resetLayout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
    this.api.update([...this.defaultCards]);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private initCardWrapper(width: number): void {
    this.setWrapperWidth(width);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.api.cards.subscribe((cardModels) => {
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
      case 'm': return base * 2 + GAP_SIZE;
      case 'l': return base * 3 + GAP_SIZE * 2;
      case 's':
      default:  return base;
    }
  }

  private getCardHeightForSize(size: CardSize | undefined): number {
    switch (size) {
      case 'm': return MAX_CARD_HEIGHT * 2 + GAP_SIZE;
      case 'l': return MAX_CARD_HEIGHT * 3 + GAP_SIZE * 2;
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
      const cardContent = this.cardContents.get(i);
      if (!cardContent) {
        console.warn(`Card for index ${i} not found.`);
        return;
      }
      cardContent.clear();
      cardContent.createComponent(model.component);
    });
  }
}
