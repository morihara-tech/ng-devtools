import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatetimeMakerDialogComponent } from './datetime-maker-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('DatetimeMakerDialogComponent', () => {
  let component: DatetimeMakerDialogComponent;
  let fixture: ComponentFixture<DatetimeMakerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatetimeMakerDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { unixdatetime: Date.now() } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ]
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
