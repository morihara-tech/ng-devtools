import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelpDrawerService {
  private readonly openedSubject = new BehaviorSubject(false);
  private readonly contentSubject = new BehaviorSubject<TemplateRef<unknown> | null>(null);

  readonly opened$: Observable<boolean> = this.openedSubject.asObservable();
  readonly content$: Observable<TemplateRef<unknown> | null> = this.contentSubject.asObservable();

  open(content: TemplateRef<unknown> | null): void {
    this.contentSubject.next(content);
    this.openedSubject.next(true);
  }

  close(): void {
    this.openedSubject.next(false);
  }

  setOpened(opened: boolean): void {
    this.openedSubject.next(opened);
  }

  setContent(content: TemplateRef<unknown> | null): void {
    this.contentSubject.next(content);
  }

  reset(): void {
    this.contentSubject.next(null);
    this.openedSubject.next(false);
  }
}
