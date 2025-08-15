import { BehaviorSubject } from 'rxjs';
import { DashboardCardModel } from './dashboard-card-model';

export class DashboardService {
  private cardsSubject: BehaviorSubject<Array<DashboardCardModel>> = new BehaviorSubject<Array<DashboardCardModel>>([]);

  cards = this.cardsSubject.asObservable();

  append(cards: Array<DashboardCardModel>): void {
    const existingCards = this.getAll();
    const newCards = existingCards.concat(cards);
    this.cardsSubject.next(newCards);
  }

  update(cards: Array<DashboardCardModel>): void {
    this.cardsSubject.next(cards);
  }

  getAll(): Array<DashboardCardModel> {
    return this.cardsSubject.getValue();
  }

  move(fromIndex: number, toIndex: number): void {
    const cards = this.getAll();
    if (fromIndex < 0 || fromIndex >= cards.length || toIndex < 0 || toIndex > cards.length) {
      return;
    }
    const [item] = cards.splice(fromIndex, 1);
    const adjustedToIndex = fromIndex < toIndex ? toIndex : toIndex;
    cards.splice(adjustedToIndex, 0, item);
  }

}
