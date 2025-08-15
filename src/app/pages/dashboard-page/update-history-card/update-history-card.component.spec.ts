import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHistoryCardComponent } from './update-history-card.component';

describe('UpdateHistoryCardComponent', () => {
  let component: UpdateHistoryCardComponent;
  let fixture: ComponentFixture<UpdateHistoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHistoryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHistoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
