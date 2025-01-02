import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeMakerDialogComponent } from './datetime-maker-dialog.component';

describe('DatetimeMakerDialogComponent', () => {
  let component: DatetimeMakerDialogComponent;
  let fixture: ComponentFixture<DatetimeMakerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatetimeMakerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatetimeMakerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
