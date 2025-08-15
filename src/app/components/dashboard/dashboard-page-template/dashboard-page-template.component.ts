import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { DashboardCardModel } from '../dashboard-card-model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { HyperLinkTextComponent } from '../../hyper-link-text/hyper-link-text.component';

const DEBOUNCE_DELAY = 50;
const MAX_CARD_WIDTH = 360;
const MAX_CARD_WIDTH_FOR_SMALL_WINDOW = 320;
const MAX_CARD_HEIGHT = 240;
const GAP_SIZE = 16;

@Component({
  selector: 'app-dashboard-page-template',
  imports: [
    CommonModule,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    CdkDragPlaceholder,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    HyperLinkTextComponent
  ],
  templateUrl: './dashboard-page-template.component.html',
  styleUrl: './dashboard-page-template.component.scss'
})
export class DashboardPageTemplateComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardContainer', { read: ViewContainerRef }) cardContainer!: ViewContainerRef;
  @ViewChild('cardWrapper', { read: ViewContainerRef }) cardWrapper!: ViewContainerRef;
  @ViewChildren('cardContent', { read: ViewContainerRef }) cardContents!: QueryList<ViewContainerRef>;

  @Input() api!: DashboardService;

  cardModels: Array<DashboardCardModel> = [];
  wrapperWidth: number = 0;

  private subscription: Subscription | null = null;
  private resizeObserver!: ResizeObserver;
  private debounceTimeout!: NodeJS.Timeout;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        clearTimeout(this.debounceTimeout)
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    clearTimeout(this.debounceTimeout);
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    this.api.move(event.previousIndex, event.currentIndex);
    this.showCards();
  }

  getCardWidth(model: DashboardCardModel): number {
    if (this.getMaxWrapperWidth() > this.wrapperWidth) {
      return this.wrapperWidth;
    }
    let cardWidth = this.getBaseCardWidth();
    if (model.size) {
      switch (model.size.x) {
        case 'm':
          cardWidth = cardWidth * 2 + GAP_SIZE;
          break;
        case 'l':
          cardWidth = cardWidth * 3 + GAP_SIZE * 2;
          break;
        case 's':
        default:
          break;
      } 
    }
    return cardWidth;
  }

  getCardHeight(model: DashboardCardModel): number {
    let cardHeight = MAX_CARD_HEIGHT;
    if (model.size) {
      switch (model.size.y) {
        case 'm':
          cardHeight = MAX_CARD_HEIGHT * 2 + GAP_SIZE;
          break;
        case 'l':
          cardHeight = MAX_CARD_HEIGHT * 3 + GAP_SIZE * 2;
          break;
        case 's':
        default:
          break;
      }
    }
    return cardHeight;
  }

  private initCardWrapper(width: number): void {
    this.setWrapperWidth(width);

    this.subscription = this.api.cards.subscribe(cardModels => {
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
    return (this.wrapperWidth > 1000) ? MAX_CARD_WIDTH : MAX_CARD_WIDTH_FOR_SMALL_WINDOW;
  }

  private getMaxWrapperWidth(): number {
    return this.getBaseCardWidth() * 3 + GAP_SIZE * 2;
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
