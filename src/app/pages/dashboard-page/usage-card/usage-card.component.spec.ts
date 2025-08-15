import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageCardComponent } from './usage-card.component';

describe('UsageCardComponent', () => {
  let component: UsageCardComponent;
  let fixture: ComponentFixture<UsageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
